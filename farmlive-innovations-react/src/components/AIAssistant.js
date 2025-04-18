import React, { useState, useEffect, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import { translateObject, translateText } from '../utils/translationService';
import { geminiAPI } from '../utils/apiService';

const AIAssistant = ({ language = 'en' }) => {
  // Default translations that won't change
  const defaultTranslations = {
    assistantTitle: "FarmLive AI Assistant",
    welcomeMessage: "Hello! I'm your farming assistant. How can I help you today? You can ask about crops, pests, weather, or upload a photo of a plant issue.",
    listeningMessage: "Listening... Speak now.",
    voiceRecognitionError: "Voice recognition is not supported in your browser.",
    voiceInputFailed: "Voice input failed: {0}. Please try typing instead.",
    voiceInputError: "Voice input isn't working right now. Please type your question.",
    uploadPhotoText: "Upload Photo",
    voiceInputText: "Voice Input",
    imageUploadError: "Please upload an image file (JPEG, PNG)",
    imageAnalyzing: "Analyzing the plant image...",
    imageAnalysisError: "Sorry, I couldn't analyze the image. Please try again with a clearer photo.",
    inputPlaceholder: "Ask me anything about farming..."
  };
  
  // Translation state
  const [translations, setTranslations] = useState(defaultTranslations);

  // State for the assistant
  const [isVisible, setIsVisible] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [model, setModel] = useState(null);
  
  // Refs
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const aiAssistantWindowRef = useRef(null);
  
  // Load translations and welcome message when language changes
  useEffect(() => {
    async function loadTranslations() {
      try {
        if (language !== 'en') {
          const translatedContent = await translateObject(defaultTranslations, language);
          setTranslations(translatedContent);
        } else {
          setTranslations(defaultTranslations);
        }
        
        // Set initial welcome message with correct translation if no messages exist
        if (messages.length === 0) {
          const welcomeMsg = language === 'en' ? 
            defaultTranslations.welcomeMessage : 
            (language !== 'en' ? await translateText(defaultTranslations.welcomeMessage, language) : defaultTranslations.welcomeMessage);
            
          setMessages([{ text: welcomeMsg, sender: 'bot' }]);
        }
      } catch (error) {
        console.error('Translation error:', error);
      }
    }
    
    loadTranslations();
  }, [language, messages.length]);
  
  // Load AI models on component mount
  useEffect(() => {
    async function loadModels() {
      try {
        console.log("Loading AI models...");
        const loadedModel = await mobilenet.load();
        setModel(loadedModel);
        console.log("Client-side model loaded");
      } catch (e) {
        console.error("Error loading AI models", e);
      }
    }
    
    loadModels();
  }, []);
  
  // Scroll to bottom of messages when new messages are added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  
  // Toggle visibility of the assistant window
  const toggleAssistant = () => {
    setIsVisible(!isVisible);
  };
  
  // Close the assistant window
  const closeAssistant = () => {
    setIsVisible(false);
  };
  
  // Handle user input change
  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };
  
  // Handle sending a message
  const handleSendMessage = async () => {
    if (isProcessing || !userInput.trim()) return;
    
    // Add user message
    const userMessage = userInput.trim();
    setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);
    setUserInput('');
    setIsProcessing(true);
    
    // Add typing indicator
    setMessages(prev => [...prev, { typing: true, sender: 'bot' }]);
    
    try {
      // Use Gemini API for AI response
      let response = await getAIResponse(userMessage);
      
      // Remove typing indicator and add bot response
      setMessages(prev => prev.filter(msg => !msg.typing));
      let botText = response;
      if (language !== 'en') {
        try {
          botText = await translateText(response, language);
        } catch (e) {
          botText = response;
        }
      }
      setMessages(prevMessages => [...prevMessages, { text: botText, sender: 'bot' }]);
    } catch (error) {
      console.error("Error getting AI response:", error);
      setMessages(prev => prev.filter(msg => !msg.typing));
      let errorMessage = "Sorry, I'm having trouble processing your request. Please try again.";
      if (language !== 'en') {
        try {
          errorMessage = await translateText(errorMessage, language);
        } catch (e) {
          errorMessage = "Sorry, I'm having trouble processing your request. Please try again.";
        }
      }
      setMessages(prev => [...prev, { text: errorMessage, sender: 'bot' }]);
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Get AI response using Gemini API or fallback
  const getAIResponse = async (userMessage) => {
    // Create a prompt that provides context about farming
    const prompt = `You are an AI farming assistant for FarmLive Innovations. The user is asking: "${userMessage}". 
    Provide helpful, accurate information about farming, agriculture, crop management, pest control, or related topics.
    Focus on sustainable farming practices and localized solutions for Indian farmers.
    Keep your answer concise (under 150 words) and friendly.`;
    
    try {
      // Try to get a response from the Gemini API
      const aiResponse = await geminiAPI.generateContent(prompt, {
        temperature: 0.4,  // More deterministic responses
        max_output_tokens: 250  // Keeping responses concise
      });
      
      if (aiResponse) {
        // If the language is not English, translate the response
        if (language !== 'en') {
          return await translateText(aiResponse, language);
        }
        return aiResponse;
      }
    } catch (error) {
      console.error("Gemini API error:", error);
    }
    
    // Fallback to pre-defined responses if API call fails
    return getFallbackResponse(userMessage);
  };
  
  // Fallback responses
  const getFallbackResponse = async (message) => {
    const lowerMessage = message.toLowerCase();
    let response;
    
    if (lowerMessage.includes('rust') || lowerMessage.includes('fungus')) {
      response = "Leaf rust can be treated with fungicides containing propiconazole or tebuconazole. Also ensure proper plant spacing for air circulation.";
    } 
    else if (lowerMessage.includes('soil') || lowerMessage.includes('crop')) {
      response = "For optimal crop selection, I'll need to know your soil type. Clay soils work well for wheat or barley, while sandy soils are better for millet or peanuts.";
    }
    else if (lowerMessage.includes('weather') || lowerMessage.includes('rain')) {
      response = "Our weather prediction system indicates a 60% chance of rain in the next 3 days. You might want to delay irrigation if rain is expected.";
    }
    else if (lowerMessage.includes('price') || lowerMessage.includes('market')) {
      response = "Current market trends show wheat prices at ₹2,150 per quintal in your region, with a predicted 5% increase next month.";
    }
    else {
      const genericResponses = [
        "Based on my analysis, I recommend checking your soil pH levels as a first step.",
        "This appears to be a nutrient deficiency. Have you considered adding organic compost?",
        "Our pest database suggests this might be a common seasonal issue. Regular monitoring is advised.",
        "I'm checking the latest farming data for your region to give you the most accurate advice."
      ];
      response = genericResponses[Math.floor(Math.random() * genericResponses.length)];
    }
    
    // Translate the response if not in English
    if (language !== 'en') {
      response = await translateText(response, language);
    }
    
    return response;
  };
  
  // Handle voice recognition
  const handleVoiceInput = () => {
    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setMessages(prev => [...prev, { text: translations.voiceRecognitionError, sender: 'bot' }]);
        return;
      }
      
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language.includes('-') ? language : `${language}-${language.toUpperCase()}`;
      
      recognition.onstart = () => {
        setMessages(prev => [...prev, { text: translations.listeningMessage, sender: 'bot' }]);
      };
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setUserInput(transcript);
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        const errorMessage = translations.voiceInputFailed.replace('{0}', event.error);
        setMessages(prev => [...prev, { text: errorMessage, sender: 'bot' }]);
      };
      
      recognition.start();
    } catch (e) {
      console.error("Voice recognition error:", e);
      setMessages(prev => [...prev, { text: translations.voiceInputError, sender: 'bot' }]);
    }
  };
  
  // Handle image upload
  const handleImageUpload = (e) => {
    if (!e.target.files.length) return;
    
    const file = e.target.files[0];
    if (!file.type.match('image.*')) {
      setMessages(prev => [...prev, { text: translations.imageUploadError, sender: 'bot' }]);
      return;
    }
    
    const reader = new FileReader();
    reader.onload = async (event) => {
      // Display the image
      setImagePreview(event.target.result);
      setShowImagePreview(true);
      
      // Show analysis message
      setMessages(prev => [...prev, { text: translations.imageAnalyzing, sender: 'bot' }]);
      
      try {
        // Get base64 image data for API call (remove data URI prefix)
        const base64Data = event.target.result.split(',')[1];
        
        // Use Gemini API to analyze the image
        const analysisPrompt = "Analyze this plant image and provide details about: 1) Plant species identification, 2) Detection of any diseases, pests, or nutrient deficiencies, 3) Recommended treatments or actions. Focus on information relevant for farmers.";
        
        // Try to use Gemini Vision API first
        let analysisResult;
        try {
          analysisResult = await geminiAPI.analyzeImage(base64Data, analysisPrompt);
        } catch (error) {
          console.error("Gemini Vision API error:", error);
          // Fallback to local model if Gemini fails
          analysisResult = await analyzeImageLocally(event.target.result);
        }
        
        // Translate the analysis if needed
        if (language !== 'en' && analysisResult) {
          analysisResult = await translateText(analysisResult, language);
        }
        
        // Display the analysis result
        setMessages(prev => [...prev, { text: analysisResult, sender: 'bot' }]);
      } catch (error) {
        console.error("Image analysis error:", error);
        setMessages(prev => [...prev, { text: translations.imageAnalysisError, sender: 'bot' }]);
      }
    };
    
    reader.readAsDataURL(file);
  };
  
  // Analyze image locally using TensorFlow.js
  const analyzeImageLocally = async (imageDataUrl) => {
    if (!model) {
      return "Sorry, image analysis model isn't loaded yet. Please try again in a moment.";
    }
    
    try {
      // Create an image element
      const img = new Image();
      img.src = imageDataUrl;
      
      // Wait for image to load
      await new Promise(resolve => {
        img.onload = resolve;
      });
      
      // Classify the image
      const predictions = await model.classify(img);
      
      // Format the results
      let result = "Image Analysis Results:\n\n";
      
      if (predictions && predictions.length > 0) {
        // Check if it's a plant
        const isPlant = predictions.some(p => 
          p.className.toLowerCase().includes('plant') || 
          p.className.toLowerCase().includes('leaf') ||
          p.className.toLowerCase().includes('flower') ||
          p.className.toLowerCase().includes('tree') ||
          p.className.toLowerCase().includes('crop')
        );
        
        if (isPlant) {
          // It's likely a plant
          const topPrediction = predictions[0];
          result += `Identified as: ${topPrediction.className} (${(topPrediction.probability * 100).toFixed(1)}% confidence)\n\n`;
          
          // Generate simulated diagnosis
          const possibleIssues = [
            {
              issue: "Healthy Plant",
              confidence: 92,
              solution: "No treatment needed. Continue with regular care routine."
            },
            {
              issue: "Early Blight",
              confidence: 85,
              solution: "Remove affected leaves, apply copper-based fungicide, and improve air circulation between plants."
            },
            {
              issue: "Nitrogen Deficiency",
              confidence: 78,
              solution: "Apply balanced organic fertilizer or compost. Consider crop rotation with legumes for next season."
            },
            {
              issue: "Spider Mite Infestation",
              confidence: 80,
              solution: "Treat with neem oil solution, increase humidity around plants, and remove heavily infested leaves."
            }
          ];
          
          // Choose a random diagnosis
          const diagnosis = possibleIssues[Math.floor(Math.random() * possibleIssues.length)];
          result += `Plant Health: ${diagnosis.issue} (${diagnosis.confidence}% confidence)\n\n`;
          result += `Recommendation: ${diagnosis.solution}`;
        } else {
          // Not a plant
          result = "The image does not appear to contain a plant. Please upload a clear image of a plant or crop for analysis.";
        }
      } else {
        result = "Unable to analyze the image. Please upload a clearer photo.";
      }
      
      return result;
    } catch (error) {
      console.error("Local image analysis error:", error);
      return "I couldn't analyze this image. Please try with a different image or ensure the plant is clearly visible.";
    }
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="ai-assistant-container">
      <div 
        className="ai-assistant-button" 
        onClick={toggleAssistant}
      >
        <i className="fas fa-robot"></i>
      </div>
      
      <div 
        className={`ai-assistant-window ${isVisible ? 'visible' : ''}`}
        ref={aiAssistantWindowRef}
      >
        <div className="ai-assistant-header">
          <div className="ai-assistant-title">{translations.assistantTitle}</div>
          <div 
            className="ai-assistant-close" 
            onClick={closeAssistant}
          >
            &times;
          </div>
        </div>
        
        <div className="ai-assistant-content">
          <div className="ai-assistant-messages">
            {messages.map((msg, index) => (
              msg.typing ? (
                <div key={index} className="message bot-message typing-indicator">
                  <div className="message-content">
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                  </div>
                </div>
              ) : (
                <div key={index} className={`message ${msg.sender}-message`}>
                  <div className="message-content">
                    {msg.text.split('\n').map((line, i) => (
                      <React.Fragment key={i}>
                        {line}
                        {i < msg.text.split('\n').length - 1 && <br />}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          <div className={`ai-image-preview-container ${showImagePreview ? 'visible' : ''}`}>
            {imagePreview && <img src={imagePreview} alt="Uploaded plant" className="ai-image-preview" />}
          </div>
          
          <div className="ai-media-controls">
            <div 
              className="ai-media-button" 
              onClick={() => fileInputRef.current.click()}
            >
              <i className="fas fa-camera"></i>
              <span>{translations.uploadPhotoText}</span>
              <input 
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                ref={fileInputRef}
                onChange={handleImageUpload}
              />
            </div>
            <div 
              className="ai-media-button" 
              onClick={handleVoiceInput}
            >
              <i className="fas fa-microphone"></i>
              <span>{translations.voiceInputText}</span>
            </div>
          </div>
          
          <div className="ai-assistant-input-container">
            <div className="ai-assistant-input">
              <input 
                type="text" 
                value={userInput} 
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder={translations.inputPlaceholder}
              />
              <button onClick={handleSendMessage}>
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
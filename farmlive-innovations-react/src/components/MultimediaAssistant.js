import React, { useState, useEffect, useRef } from 'react';
import { translateObject, translateText } from '../utils/translationService';
import { geminiAPI } from '../utils/apiService';

const MultimediaAssistant = ({ language = 'en', isOpen, onClose }) => {
  // State for translations
  const [translations, setTranslations] = useState({
    title: "Multimedia Assistant",
    searchPlaceholder: "Ask about farming techniques, crops, or equipment...",
    voiceInputButton: "Voice Input",
    searchButton: "Search",
    videoSectionTitle: "Video Resources",
    imageSectionTitle: "Visual References",
    textResponseTitle: "Expert Explanation",
    loadingText: "Processing your request...",
    errorText: "Sorry, there was an error processing your request. Please try again.",
    noResultsText: "No results found. Try a different search term.",
    saveToCollectionText: "Save to Collection",
    shareText: "Share",
    listeningText: "Listening... Speak now",
    stopListeningText: "Stop Listening",
    languageSelectLabel: "Select Language:"
  });

  // States for the assistant functionality
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [textResponse, setTextResponse] = useState('');
  const [videos, setVideos] = useState([]);
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);
  const [savedItems, setSavedItems] = useState([]);
  
  // Refs
  const searchInputRef = useRef(null);
  const assistantRef = useRef(null);
  const recognitionRef = useRef(null);

  // Effect for translations
  useEffect(() => {
    const defaultTranslations = {
      title: "Multimedia Assistant",
      searchPlaceholder: "Ask about farming techniques, crops, or equipment...",
      voiceInputButton: "Voice Input",
      searchButton: "Search",
      videoSectionTitle: "Video Resources",
      imageSectionTitle: "Visual References",
      textResponseTitle: "Expert Explanation",
      loadingText: "Processing your request...",
      errorText: "Sorry, there was an error processing your request. Please try again.",
      noResultsText: "No results found. Try a different search term.",
      saveToCollectionText: "Save to Collection",
      shareText: "Share",
      listeningText: "Listening... Speak now",
      stopListeningText: "Stop Listening",
      languageSelectLabel: "Select Language:"
    };

    async function translateContent() {
      try {
        if (language !== 'en') {
          const translatedContent = await translateObject(defaultTranslations, language);
          setTranslations(translatedContent);
        } else {
          setTranslations(defaultTranslations);
        }
      } catch (error) {
        console.error('Translation error:', error);
        setTranslations(defaultTranslations);
      }
    }

    translateContent();
  }, [language]);

  // Effect to initialize speech recognition
  useEffect(() => {
    // Initialize speech recognition if available in the browser
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      
      // Set language for speech recognition
      recognitionRef.current.lang = language === 'en' ? 'en-US' : 
                                   language === 'hi' ? 'hi-IN' : 
                                   language === 'kn' ? 'kn-IN' : 
                                   language === 'ta' ? 'ta-IN' : 
                                   language === 'te' ? 'te-IN' : 
                                   language === 'ml' ? 'ml-IN' : 
                                   language === 'gu' ? 'gu-IN' : 
                                   language === 'mr' ? 'mr-IN' : 
                                   language === 'pa' ? 'pa-IN' : 
                                   language === 'bn' ? 'bn-IN' : 
                                   language === 'ur' ? 'ur-IN' : 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [language]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (assistantRef.current && !assistantRef.current.contains(event.target) && isOpen) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Function to toggle voice input
  const toggleVoiceInput = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
          setIsListening(true);
        } catch (error) {
          console.error('Speech recognition error:', error);
        }
      }
    }
  };

  // Function to handle search
  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setTextResponse('');
    setVideos([]);
    setImages([]);
    
    try {
      // Simulate API calls for now
      // In a real application, these would be actual API calls to Gemini, YouTube, etc.
      
      // 1. Get text response from Gemini API
      const textResponseData = await simulateGeminiAPICall(query);
      setTextResponse(textResponseData);
      
      // 2. Get video results
      const videoResults = await simulateYouTubeAPICall(query);
      setVideos(videoResults);
      
      // 3. Get image results
      const imageResults = await simulateImageSearchAPICall(query);
      setImages(imageResults);
      
    } catch (error) {
      console.error('Search error:', error);
      setError(translations.errorText);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to simulate Gemini API call
  const simulateGeminiAPICall = async (query) => {
    // In a real application, this would be a call to the Gemini API
    // For now, we'll simulate a response based on the query
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate a response based on the query
    if (query.toLowerCase().includes('crop') || query.toLowerCase().includes('farming')) {
      return `Based on your query about "${query}", here's what I can tell you:
      
Sustainable farming practices involve crop rotation, which helps maintain soil health and reduce pest pressure. For your specific region, consider implementing a three-year rotation cycle with legumes, grains, and root vegetables.

Key benefits:
- Improved soil structure and fertility
- Reduced pest and disease pressure
- Better water retention
- Higher yields over time

Remember to consider your local climate conditions and soil type when planning your crop rotation strategy.`;
    } else if (query.toLowerCase().includes('pest') || query.toLowerCase().includes('disease')) {
      return `Regarding your question about "${query}":
      
Integrated Pest Management (IPM) is an effective approach that combines biological controls, habitat manipulation, and resistant crop varieties with judicious use of pesticides.

Steps to implement IPM:
1. Regular monitoring of crops for pests and diseases
2. Identifying beneficial insects that can help control pests
3. Using physical barriers when appropriate
4. Applying targeted treatments only when necessary

This approach minimizes environmental impact while effectively managing pest populations.`;
    } else {
      return `Here's information about your query on "${query}":
      
Agricultural technology continues to evolve rapidly, offering farmers new tools to improve efficiency and sustainability. From precision agriculture using GPS and sensors to monitor field conditions, to drone technology for crop assessment, these innovations are changing how farming is done.

Consider exploring:
- IoT sensors for soil moisture and nutrient monitoring
- Mobile apps for farm management
- Automated irrigation systems
- Weather prediction tools specifically designed for agriculture

These technologies can help optimize resource use while improving crop yields.`;
    }
  };

  // Function to simulate YouTube API call
  const simulateYouTubeAPICall = async (query) => {
    // In a real application, this would be a call to the YouTube API
    // For now, we'll simulate results based on the query
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Sample video data
    const sampleVideos = [
      {
        id: 'video1',
        title: 'Modern Farming Techniques for Sustainable Agriculture',
        description: 'Learn about the latest innovations in sustainable farming practices.',
        thumbnail: 'https://img.youtube.com/vi/dummyid1/hqdefault.jpg',
        url: 'https://www.youtube.com/watch?v=dummyid1'
      },
      {
        id: 'video2',
        title: 'Organic Pest Control Methods for Small Farms',
        description: 'Natural solutions to common pest problems without harmful chemicals.',
        thumbnail: 'https://img.youtube.com/vi/dummyid2/hqdefault.jpg',
        url: 'https://www.youtube.com/watch?v=dummyid2'
      },
      {
        id: 'video3',
        title: 'Water Conservation Techniques in Agriculture',
        description: 'Efficient irrigation methods to save water while improving crop yields.',
        thumbnail: 'https://img.youtube.com/vi/dummyid3/hqdefault.jpg',
        url: 'https://www.youtube.com/watch?v=dummyid3'
      }
    ];
    
    return sampleVideos;
  };

  // Function to simulate image search API call
  const simulateImageSearchAPICall = async (query) => {
    // In a real application, this would be a call to an image search API
    // For now, we'll simulate results
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Sample image data
    const sampleImages = [
      {
        id: 'img1',
        title: 'Sustainable Farming Practices',
        url: 'https://via.placeholder.com/300x200.png?text=Sustainable+Farming',
        thumbnail: 'https://via.placeholder.com/150x100.png?text=Sustainable+Farming'
      },
      {
        id: 'img2',
        title: 'Modern Agricultural Equipment',
        url: 'https://via.placeholder.com/300x200.png?text=Modern+Equipment',
        thumbnail: 'https://via.placeholder.com/150x100.png?text=Modern+Equipment'
      },
      {
        id: 'img3',
        title: 'Crop Rotation Diagram',
        url: 'https://via.placeholder.com/300x200.png?text=Crop+Rotation',
        thumbnail: 'https://via.placeholder.com/150x100.png?text=Crop+Rotation'
      },
      {
        id: 'img4',
        title: 'Soil Health Indicators',
        url: 'https://via.placeholder.com/300x200.png?text=Soil+Health',
        thumbnail: 'https://via.placeholder.com/150x100.png?text=Soil+Health'
      }
    ];
    
    return sampleImages;
  };

  // Function to save an item to collection
  const saveToCollection = (item, type) => {
    const newItem = {
      ...item,
      type,
      savedAt: new Date().toISOString()
    };
    
    setSavedItems(prev => [...prev, newItem]);
    // In a real application, you might want to save this to localStorage or a database
  };

  // Function to share an item
  const shareItem = (item, type) => {
    // In a real application, this would open a share dialog
    // For now, we'll just log the action
    console.log(`Sharing ${type}:`, item);
    
    // Simulate a share dialog with an alert
    alert(`Sharing ${type}: ${item.title}`);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };

  // If the assistant is not open, don't render anything
  if (!isOpen) return null;

  return (
    <div className="multimedia-assistant-overlay">
      <div className="multimedia-assistant-container" ref={assistantRef}>
        <div className="multimedia-assistant-header">
          <h2>{translations.title}</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        
        <div className="multimedia-assistant-search">
          <form onSubmit={handleSubmit}>
            <div className="search-input-container">
              <input
                type="text"
                ref={searchInputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={translations.searchPlaceholder}
                className="search-input"
              />
              <button 
                type="button" 
                className={`voice-input-button ${isListening ? 'listening' : ''}`}
                onClick={toggleVoiceInput}
              >
                <i className="fas fa-microphone"></i>
                {isListening ? translations.stopListeningText : translations.voiceInputButton}
              </button>
              <button type="submit" className="search-button">
                <i className="fas fa-search"></i>
                {translations.searchButton}
              </button>
            </div>
          </form>
          
          {isListening && (
            <div className="listening-indicator">
              <div className="listening-animation">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>
              <p>{translations.listeningText}</p>
            </div>
          )}
        </div>
        
        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>{translations.loadingText}</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p>{error}</p>
          </div>
        ) : (
          <div className="multimedia-assistant-results">
            {textResponse && (
              <div className="text-response-section">
                <h3>{translations.textResponseTitle}</h3>
                <div className="text-response-content">
                  {textResponse.split('\n').map((line, index) => (
                    line.trim() ? <p key={index}>{line}</p> : <br key={index} />
                  ))}
                </div>
                <div className="action-buttons">
                  <button 
                    className="save-button"
                    onClick={() => saveToCollection({ title: query, content: textResponse }, 'text')}
                  >
                    <i className="fas fa-bookmark"></i>
                    {translations.saveToCollectionText}
                  </button>
                  <button 
                    className="share-button"
                    onClick={() => shareItem({ title: query, content: textResponse }, 'text')}
                  >
                    <i className="fas fa-share-alt"></i>
                    {translations.shareText}
                  </button>
                </div>
              </div>
            )}
            
            {videos.length > 0 && (
              <div className="video-section">
                <h3>{translations.videoSectionTitle}</h3>
                <div className="video-grid">
                  {videos.map(video => (
                    <div className="video-card" key={video.id}>
                      <div className="video-thumbnail">
                        <img src={video.thumbnail} alt={video.title} />
                        <div className="play-button">
                          <i className="fas fa-play"></i>
                        </div>
                      </div>
                      <div className="video-info">
                        <h4>{video.title}</h4>
                        <p>{video.description}</p>
                      </div>
                      <div className="video-actions">
                        <button 
                          className="save-button"
                          onClick={() => saveToCollection(video, 'video')}
                        >
                          <i className="fas fa-bookmark"></i>
                        </button>
                        <button 
                          className="share-button"
                          onClick={() => shareItem(video, 'video')}
                        >
                          <i className="fas fa-share-alt"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {images.length > 0 && (
              <div className="image-section">
                <h3>{translations.imageSectionTitle}</h3>
                <div className="image-grid">
                  {images.map(image => (
                    <div className="image-card" key={image.id}>
                      <div className="image-container">
                        <img src={image.thumbnail} alt={image.title} />
                      </div>
                      <div className="image-info">
                        <h4>{image.title}</h4>
                      </div>
                      <div className="image-actions">
                        <button 
                          className="save-button"
                          onClick={() => saveToCollection(image, 'image')}
                        >
                          <i className="fas fa-bookmark"></i>
                        </button>
                        <button 
                          className="share-button"
                          onClick={() => shareItem(image, 'image')}
                        >
                          <i className="fas fa-share-alt"></i>
                        </button>
                        <button className="view-full-button">
                          <i className="fas fa-search-plus"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {!textResponse && videos.length === 0 && images.length === 0 && query && !isLoading && (
              <div className="no-results">
                <p>{translations.noResultsText}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MultimediaAssistant;

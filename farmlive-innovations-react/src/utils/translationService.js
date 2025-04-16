// Translation service for FarmLive Innovations
// This file centralizes translation functionality across the application

// Simple translation cache to avoid redundant API calls
const translationCache = new Map();

// Microsoft Translator API configuration
const MS_TRANSLATOR_KEY = process.env.REACT_APP_MS_TRANSLATOR_KEY;
const MS_TRANSLATOR_ENDPOINT = process.env.REACT_APP_MS_TRANSLATOR_ENDPOINT || 'https://api.cognitive.microsofttranslator.com/';
const MS_TRANSLATOR_REGION = 'global';  // Adjust the region if needed

// Mock translation dictionaries as a fallback if API fails
const mockTranslations = {
  // Hindi translations
  'hi': {
    'FarmLive Innovations': 'फार्मलाइव इनोवेशंस',
    'Revolutionizing Agriculture with AI Technology': 'कृत्रिम बुद्धिमत्ता तकनीक के साथ कृषि में क्रांति',
    'Transforming Agriculture': 'कृषि का परिवर्तन',
    'About': 'परिचय',
    'Features': 'विशेषताएँ',
    'Impact': 'प्रभाव',
    'Contact': 'संपर्क',
    'Smart Farming Features': 'स्मार्ट खेती की विशेषताएँ',
    'Our Impact': 'हमारा प्रभाव',
    'Get in Touch': 'संपर्क करें',
    'Weather Intelligence': 'मौसम बुद्धिमत्ता',
    'Soil Analysis': 'मिट्टी विश्लेषण',
    'Pest Detection': 'कीट पहचान',
    'Market Connect': 'बाजार कनेक्शन',
    'Farmers Helped': 'सहायता प्राप्त किसान',
    'Yield Increase': 'उत्पादन वृद्धि',
    'Districts Covered': 'कवर किए गए जिले',
    'Connect with Farmers': 'किसानों से जुड़ें',
    'NGO Connect': 'एनजीओ कनेक्ट',
    'Health Tracking Dashboard': 'स्वास्थ्य ट्रैकिंग डैशबोर्ड',
    'Show Land Ownership Map': 'भूमि स्वामित्व मानचित्र दिखाएँ',
    'Land Ownership Details': 'भूमि स्वामित्व विवरण',
    'Select a location on the map to view details.': 'विवरण देखने के लिए मानचित्र पर स्थान का चयन करें।',
    'No land details available for the selected location.': 'चयनित स्थान के लिए कोई भूमि विवरण उपलब्ध नहीं है।',
  },
  
  // Kannada translations
  'kn': {
    'FarmLive Innovations': 'ಫಾರ್ಮ್‌ಲೈವ್ ಇನ್ನೋವೇಶನ್ಸ್',
    'Revolutionizing Agriculture with AI Technology': 'ಕೃತಕ ಬುದ್ಧಿಮತ್ತೆ ತಂತ್ರಜ್ಞಾನದೊಂದಿಗೆ ಕೃಷಿಯನ್ನು ಕ್ರಾಂತಿಗೊಳಿಸುತ್ತಿದೆ',
    'Transforming Agriculture': 'ಕೃಷಿಯನ್ನು ಪರಿವರ್ತಿಸುವುದು',
    'About': 'ನಮ್ಮ ಬಗ್ಗೆ',
    'Features': 'ವೈಶಿಷ್ಟ್ಯಗಳು',
    'Impact': 'ಪರಿಣಾಮ',
    'Contact': 'ಸಂಪರ್ಕ',
    'Smart Farming Features': 'ಸ್ಮಾರ್ಟ್ ಕೃಷಿ ವೈಶಿಷ್ಟ್ಯಗಳು',
    'Our Impact': 'ನಮ್ಮ ಪ್ರಭಾವ',
    'Get in Touch': 'ಸಂಪರ್ಕದಲ್ಲಿರಿ',
    'Weather Intelligence': 'ಹವಾಮಾನ ಬುದ್ಧಿಮತ್ತೆ',
    'Soil Analysis': 'ಮಣ್ಣಿನ ವಿಶ್ಲೇಷಣೆ',
    'Pest Detection': 'ಕೀಟ ಪತ್ತೆ',
    'Market Connect': 'ಮಾರುಕಟ್ಟೆ ಸಂಪರ್ಕ',
    'Farmers Helped': 'ಸಹಾಯ ಮಾಡಿದ ರೈತರು',
    'Yield Increase': 'ಇಳುವರಿ ಹೆಚ್ಚಳ',
    'Districts Covered': 'ಒಳಗೊಂಡ ಜಿಲ್ಲೆಗಳು',
    'Connect with Farmers': 'ರೈತರೊಂದಿಗೆ ಸಂಪರ್ಕ ಸಾಧಿಸಿ',
    'NGO Connect': 'ಎನ್‌ಜಿಒ ಸಂಪರ್ಕ',
    'Health Tracking Dashboard': 'ಆರೋಗ್ಯ ಟ್ರ್ಯಾಕಿಂಗ್ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    'Show Land Ownership Map': 'ಭೂಮಿ ಒಡೆತನದ ನಕ್ಷೆ ತೋರಿಸಿ',
    'Land Ownership Details': 'ಭೂಮಿ ಒಡೆತನದ ವಿವರಗಳು',
    'Select a location on the map to view details.': 'ವಿವರಗಳನ್ನು ವೀಕ್ಷಿಸಲು ನಕ್ಷೆಯಲ್ಲಿ ಸ್ಥಳವನ್ನು ಆಯ್ಕೆಮಾಡಿ.',
    'No land details available for the selected location.': 'ಆಯ್ದ ಸ್ಥಳಕ್ಕೆ ಯಾವುದೇ ಭೂಮಿ ವಿವರಗಳು ಲಭ್ಯವಿಲ್ಲ.',
  },
  
  // Tamil translations
  'ta': {
    'FarmLive Innovations': 'ஃபார்ம்லைவ் இன்னோவேஷன்ஸ்',
    'Revolutionizing Agriculture with AI Technology': 'செயற்கை நுண்ணறிவு தொழில்நுட்பத்துடன் விவசாயத்தை புரட்சிகரமாக்குதல்',
    'Transforming Agriculture': 'விவசாயத்தை மாற்றுதல்',
    'About': 'எங்களைப் பற்றி',
    'Features': 'அம்சங்கள்',
    'Impact': 'தாக்கம்',
    'Contact': 'தொடர்பு',
    'Smart Farming Features': 'ஸ்மார்ட் விவசாய அம்சங்கள்',
    'Our Impact': 'எங்கள் தாக்கம்',
    'Get in Touch': 'தொடர்பில் இருங்கள்',
    'Weather Intelligence': 'வானிலை நுண்ணறிவு',
    'Soil Analysis': 'மண் பகுப்பாய்வு',
    'Pest Detection': 'பூச்சி கண்டுபிடிப்பு',
    'Market Connect': 'சந்தை இணைப்பு',
    'Farmers Helped': 'உதவிய விவசாயிகள்',
    'Yield Increase': 'விளைச்சல் அதிகரிப்பு',
    'Districts Covered': 'உள்ளடக்கிய மாவட்டங்கள்',
    'Connect with Farmers': 'விவசாயிகளுடன் இணையுங்கள்',
    'NGO Connect': 'என்ஜிஓ இணைப்பு',
    'Health Tracking Dashboard': 'உடல்நல கண்காணிப்பு டாஷ்போர்டு',
    'Show Land Ownership Map': 'நில உரிமை வரைபடம் காட்டு',
    'Land Ownership Details': 'நில உரிமை விவரங்கள்',
    'Select a location on the map to view details.': 'விவரங்களைக் காண வரைபடத்தில் ஒரு இடத்தைத் தேர்ந்தெடுக்கவும்.',
    'No land details available for the selected location.': 'தேர்ந்தெடுக்கப்பட்ட இடத்திற்கு நில விவரங்கள் இல்லை.',
  },
  
  // Telugu translations
  'te': {
    'FarmLive Innovations': 'ఫార్మ్‌లైవ్ ఇన్నోవేషన్స్',
    'Revolutionizing Agriculture with AI Technology': 'AI టెక్నాలజీతో వ్యవసాయంలో విప్లవాత్మక మార్పులు',
    'Transforming Agriculture': 'వ్యవసాయాన్ని మార్చడం',
    'About': 'మా గురించి',
    'Features': 'ఫీచర్లు',
    'Impact': 'ప్రభావం',
    'Contact': 'సంప్రదింపులు',
    'Smart Farming Features': 'స్మార్ట్ వ్యవసాయ లక్షణాలు',
    'Our Impact': 'మా ప్రభావం',
    'Get in Touch': 'సంప్రదించండి',
    'Weather Intelligence': 'వాతావరణ సమాచారం',
    'Soil Analysis': 'మట్టి విశ్లేషణ',
    'Pest Detection': 'పురుగుల గుర్తింపు',
    'Market Connect': 'మార్కెట్ కనెక్ట్',
    'Farmers Helped': 'సహాయం పొందిన రైతులు',
    'Yield Increase': 'దిగుబడి పెరుగుదల',
    'Districts Covered': 'కవర్ చేసిన జిల్లాలు',
    'Connect with Farmers': 'రైతులతో కనెక్ట్ అవ్వండి',
    'NGO Connect': 'ఎన్జీఓ కనెక్ట్',
    'Health Tracking Dashboard': 'హెల్త్ ట్రాకింగ్ డాష్‌బోర్డ్',
    'Show Land Ownership Map': 'భూమి యాజమాన్య పటం చూపు',
    'Land Ownership Details': 'భూమి యాజమాన్య వివరాలు',
    'Select a location on the map to view details.': 'వివరాలను చూడటానికి మ్యాప్‌లో స్థలాన్ని ఎంచుకోండి.',
    'No land details available for the selected location.': 'ఎంచుకున్న ప్రదేశానికి భూమి వివరాలు లభ్యం కాలేదు.',
  },
  
  // Malayalam translations
  'ml': {
    'FarmLive Innovations': 'ഫാം ലൈവ് ഇന്നൊവേഷൻസ്',
    'Revolutionizing Agriculture with AI Technology': 'എഐ സാങ്കേതികവിദ്യയിലൂടെ കൃഷിയിൽ വിപ്ലവം',
    'Transforming Agriculture': 'കൃഷി മാറ്റുന്നു',
    'About': 'ഞങ്ങളെ കുറിച്ച്',
    'Features': 'സവിശേഷതകൾ',
    'Impact': 'സ്വാധീനം',
    'Contact': 'ബന്ധപ്പെടുക',
    'Smart Farming Features': 'സ്മാർട്ട് ഫാമിംഗ് സവിശേഷതകൾ',
    'Our Impact': 'ഞങ്ങളുടെ സ്വാധീനം',
    'Get in Touch': 'ബന്ധപ്പെടുക',
    'Weather Intelligence': 'കാലാവസ്ഥ ബുദ്ധി',
    'Soil Analysis': 'മണ്ണ് വിശകലനം',
    'Pest Detection': 'കീടങ്ങളെ കണ്ടെത്തൽ',
    'Market Connect': 'മാർക്കറ്റ് കണക്ട്',
    'Farmers Helped': 'സഹായിച്ച കർഷകർ',
    'Yield Increase': 'വിളവ് വർദ്ധന',
    'Districts Covered': 'ഉൾപ്പെടുത്തിയ ജില്ലകൾ',
    'Connect with Farmers': 'കർഷകരുമായി ബന്ധപ്പെടുക',
    'NGO Connect': 'എൻജിഒ കണക്ട്',
    'Health Tracking Dashboard': 'ആരോഗ്യ നിരീക്ഷണ ഡാഷ്ബോർഡ്',
    'Show Land Ownership Map': 'ഭൂവുടമാവകാശ മാപ്പ് കാണിക്കുക',
    'Land Ownership Details': 'ഭൂമിയുടെ ഉടമസ്ഥാവകാശ വിശദാംശങ്ങൾ',
    'Select a location on the map to view details.': 'വിശദാംശങ്ങൾ കാണുന്നതിന് മാപ്പിൽ ഒരു സ്ഥലം തിരഞ്ഞെടുക്കുക.',
    'No land details available for the selected location.': 'തിരഞ്ഞെടുത്ത സ്ഥലത്തിന് ഭൂമി വിശദാംശങ്ങളൊന്നും ലഭ്യമല്ല.',
  }
};

/**
 * Generates a cache key for translation requests
 * @param {string} text - Text to translate
 * @param {string} language - Target language code
 * @returns {string} - Cache key
 */
const getCacheKey = (text, language) => `${language}:${text}`;

/**
 * Translates text using Microsoft Translator API
 * @param {string} text - Text to translate
 * @param {string} targetLang - Target language code
 * @returns {Promise<string>} - Translated text
 */
const translateWithMicrosoftAPI = async (text, targetLang) => {
  if (!MS_TRANSLATOR_KEY) {
    console.warn('Microsoft Translator API key not found. Using fallback translations.');
    return null;
  }
  
  try {
    const url = `${MS_TRANSLATOR_ENDPOINT}translate?api-version=3.0&to=${targetLang}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': MS_TRANSLATOR_KEY,
        'Ocp-Apim-Subscription-Region': MS_TRANSLATOR_REGION,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([{ text }]),
    });
    
    if (!response.ok) {
      throw new Error(`Translation API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data[0].translations[0].text;
  } catch (error) {
    console.error('Microsoft Translator API error:', error);
    return null;
  }
};

/**
 * Translates text to the specified language
 * @param {string} text - Text to translate
 * @param {string} language - Target language code (e.g., 'hi', 'kn', 'ta')
 * @returns {Promise<string>} - Translated text
 */
export const translateText = async (text, language) => {
  if (language === 'en') {
    return text;
  }

  // Return early with empty string for empty text
  if (!text || text.trim() === '') {
    return text;
  }
  
  // Check cache first
  const cacheKey = getCacheKey(text, language);
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey);
  }
  
  try {
    console.log(`Translating "${text}" to ${language}`);
    
    // Try Microsoft Translator API first
    let translatedText = await translateWithMicrosoftAPI(text, language);
    
    // If API call fails, use mock translations as fallback
    if (!translatedText) {
      // Check if we have an exact match in our mock translations
      if (mockTranslations[language] && mockTranslations[language][text]) {
        translatedText = mockTranslations[language][text];
      } else {
        // If no exact match, try to translate individual words and phrases
        // This is a very simplified approach - real translation is much more complex
        if (mockTranslations[language]) {
          translatedText = text;
          Object.entries(mockTranslations[language]).forEach(([original, translated]) => {
            // Replace the word/phrase if it's a whole word (not part of another word)
            const regex = new RegExp(`\\b${original}\\b`, 'gi');
            translatedText = translatedText.replace(regex, translated);
          });
        }
        
        // If no translation was found, add the language code to indicate
        // it would be translated in a real implementation
        if (translatedText === text) {
          translatedText = `${text} (${language})`;
        }
      }
    }
    
    // Cache the result
    translationCache.set(cacheKey, translatedText);
    
    return translatedText;
  } catch (error) {
    console.error('Translation error:', error);
    // Return original text on error
    return text;
  }
};

/**
 * Translates an object of texts to the specified language
 * @param {Object} textObject - Object with text values to translate
 * @param {string} language - Target language code
 * @returns {Promise<Object>} - Object with translated texts
 */
export const translateObject = async (textObject, language) => {
  if (language === 'en') {
    return textObject;
  }
  
  // Return early for empty objects
  if (!textObject || Object.keys(textObject).length === 0) {
    return textObject;
  }
  
  const translatedObject = {};
  
  try {
    // Create an array of promises for parallel translation
    const translations = await Promise.all(
      Object.entries(textObject).map(async ([key, value]) => {
        // Skip null or undefined values
        if (value === null || value === undefined) {
          return [key, value];
        }
        
        // Handle arrays of text (like lists)
        if (Array.isArray(value)) {
          const translatedArray = await Promise.all(
            value.map(item => typeof item === 'string' ? translateText(item, language) : item)
          );
          return [key, translatedArray];
        } 
        // Handle regular text
        else if (typeof value === 'string') {
          const translatedText = await translateText(value, language);
          return [key, translatedText];
        }
        // Return non-string values as is
        else {
          return [key, value];
        }
      })
    );
    
    // Convert back to object
    translations.forEach(([key, translated]) => {
      translatedObject[key] = translated;
    });
    
    return translatedObject;
  } catch (error) {
    console.error('Translation error in batch:', error);
    // Return original object on error
    return textObject;
  }
};

/**
 * Clears the translation cache
 */
export const clearTranslationCache = () => {
  translationCache.clear();
};
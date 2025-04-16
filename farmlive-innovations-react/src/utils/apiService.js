// API Service for FarmLive Innovations
// This file provides centralized access to all external APIs used in the application

/**
 * Agricultural Land Holdings and Census API Service
 */
export const agriCensusAPI = {
  /**
   * Fetches agricultural land census data by district/taluk
   * @param {string} district - Name of the district 
   * @param {string} [taluk] - Optional taluk name
   * @returns {Promise<Object>} - Agricultural census data
   */
  getLandCensusData: async (district, taluk = null) => {
    const API_KEY = process.env.REACT_APP_AGRI_CENSUS_KEY;
    if (!API_KEY) {
      console.error('Agricultural Census API key not found');
      return null;
    }

    try {
      const url = `https://api.data.gov.in/resource/45778c36-d7f7-4805-9e0c-0f8d3fa4909b?api-key=${API_KEY}&format=json`;
      const queryParams = taluk 
        ? `&filters[district]=${encodeURIComponent(district)}&filters[taluk_name]=${encodeURIComponent(taluk)}`
        : `&filters[district]=${encodeURIComponent(district)}`;
      
      const response = await fetch(url + queryParams);
      
      if (!response.ok) {
        throw new Error(`Agricultural Census API error: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching agricultural census data:', error);
      return null;
    }
  }
};

/**
 * Google Maps API Service
 */
export const mapsAPI = {
  /**
   * Gets Google Maps API key for client-side usage
   * @returns {string} - Google Maps API key
   */
  getApiKey: () => {
    return process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '';
  },
  
  /**
   * Geocodes an address to coordinates
   * @param {string} address - Address to geocode
   * @returns {Promise<{lat: number, lng: number}|null>} - Coordinates or null on error
   */
  geocodeAddress: async (address) => {
    const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    if (!API_KEY) {
      console.error('Google Maps API key not found');
      return null;
    }
    
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`Geocoding API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.status !== 'OK' || !data.results || !data.results[0]) {
        console.error('Geocoding error:', data.status);
        return null;
      }
      
      const { lat, lng } = data.results[0].geometry.location;
      return { lat, lng };
    } catch (error) {
      console.error('Error geocoding address:', error);
      return null;
    }
  }
};

/**
 * YouTube API Service
 */
export const youtubeAPI = {
  /**
   * Searches for YouTube videos
   * @param {string} query - Search query
   * @param {number} [maxResults=5] - Maximum number of results to return
   * @returns {Promise<Array|null>} - Array of video results or null on error
   */
  searchVideos: async (query, maxResults = 5) => {
    const API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;
    if (!API_KEY) {
      console.error('YouTube API key not found');
      return null;
    }
    
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&maxResults=${maxResults}&key=${API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`YouTube API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.items || [];
    } catch (error) {
      console.error('Error searching YouTube videos:', error);
      return null;
    }
  },
  
  /**
   * Gets details for a specific YouTube video
   * @param {string} videoId - YouTube video ID
   * @returns {Promise<Object|null>} - Video details or null on error
   */
  getVideoDetails: async (videoId) => {
    const API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;
    if (!API_KEY) {
      console.error('YouTube API key not found');
      return null;
    }
    
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`YouTube API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.items && data.items[0] ? data.items[0] : null;
    } catch (error) {
      console.error('Error getting YouTube video details:', error);
      return null;
    }
  }
};

/**
 * Google Gemini API Service for AI capabilities
 */
export const geminiAPI = {
  /**
   * Generates AI content using Google Gemini API
   * @param {string} prompt - Text prompt for content generation
   * @param {Object} [options] - Additional options
   * @returns {Promise<string|null>} - Generated content or null on error
   */
  generateContent: async (prompt, options = {}) => {
    const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
    if (!API_KEY) {
      console.error('Gemini API key not found');
      return null;
    }
    
    const defaultOptions = {
      model: 'gemini-1.5-pro',
      temperature: 0.7,
      max_output_tokens: 800,
    };
    
    const requestOptions = { ...defaultOptions, ...options };
    
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${requestOptions.model}:generateContent?key=${API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: prompt }]
            }],
            generationConfig: {
              temperature: requestOptions.temperature,
              maxOutputTokens: requestOptions.max_output_tokens
            }
          })
        }
      );
      
      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Extract the generated text from the response
      if (data && data.candidates && data.candidates[0] && 
          data.candidates[0].content && data.candidates[0].content.parts && 
          data.candidates[0].content.parts[0]) {
        return data.candidates[0].content.parts[0].text;
      } else {
        console.error('Unexpected Gemini API response format:', data);
        return null;
      }
    } catch (error) {
      console.error('Error generating AI content:', error);
      return null;
    }
  },
  
  /**
   * Analyzes an image with AI
   * @param {string} imageBase64 - Base64 encoded image data (without header prefix)
   * @param {string} prompt - Prompt for image analysis
   * @returns {Promise<string|null>} - Analysis result or null on error
   */
  analyzeImage(imageBase64, prompt) {
    const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
    if (!API_KEY) {
      console.error('Gemini API key not found');
      return null;
    }

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=${API_KEY}`;
      
      const requestBody = {
        contents: [
          {
            parts: [
              {
                text: prompt
              },
              {
                inline_data: {
                  mime_type: "image/jpeg",
                  data: imageBase64
                }
              }
            ]
          }
        ],
        safety_settings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ],
        generation_config: {
          temperature: 0.4,
          top_p: 0.95,
          top_k: 40,
          max_output_tokens: 2048,
        }
      };

      return fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        if (data.candidates && data.candidates[0] && data.candidates[0].content && 
            data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
          return data.candidates[0].content.parts[0].text;
        }
        return null;
      });
    } catch (error) {
      console.error('Error analyzing image with Gemini:', error);
      return null;
    }
  },
  
  /**
   * Generates multimedia-focused content for the Multimedia Assistant
   * @param {string} query - User query about farming, agriculture, etc.
   * @param {Object} [options] - Additional options
   * @returns {Promise<Object|null>} - Generated content with multimedia context or null on error
   */
  generateMultimediaContent: async (query, options = {}) => {
    const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
    if (!API_KEY) {
      console.error('Gemini API key not found');
      return null;
    }

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`;
      
      // Create a prompt specifically designed for multimedia content
      const enhancedPrompt = `Generate a comprehensive, educational response about the following agricultural topic: "${query}"

` +
        `Format your response to include:
` +
        `1. A detailed explanation suitable for farmers and agricultural professionals
` +
        `2. Key points that would be important to visualize in images or videos
` +
        `3. Specific topics that would benefit from video demonstrations
` +
        `4. Practical implementation steps
` +
        `5. Regional considerations for India, if applicable

` +
        `Keep the response informative, practical, and focused on sustainable farming practices.`;
      
      const requestBody = {
        contents: [
          {
            parts: [
              {
                text: enhancedPrompt
              }
            ]
          }
        ],
        safety_settings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ],
        generation_config: {
          temperature: 0.7,
          top_p: 0.95,
          top_k: 40,
          max_output_tokens: 4096,
        }
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content && 
          data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
        const textContent = data.candidates[0].content.parts[0].text;
        
        // Process the response to extract video and image keywords
        const videoKeywords = extractKeywords(textContent, 'video');
        const imageKeywords = extractKeywords(textContent, 'image');
        
        return {
          textContent,
          videoKeywords,
          imageKeywords
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error generating multimedia content with Gemini:', error);
      return null;
    }
  },
  
  /**
   * Analyzes a video transcript or description to provide educational context
   * @param {string} videoTranscript - Video transcript or description
   * @param {string} query - Original user query for context
   * @returns {Promise<string|null>} - Educational context or null on error
   */
  analyzeVideoContent: async (videoTranscript, query) => {
    const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
    if (!API_KEY) {
      console.error('Gemini API key not found');
      return null;
    }

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`;
      
      const prompt = `Given this video transcript or description about agriculture: "${videoTranscript}"

` +
        `And the user's original query: "${query}"

` +
        `Provide a concise educational context that explains:
` +
        `1. How this video relates to the user's query
` +
        `2. Key educational points covered in the video
` +
        `3. How a farmer could apply this information practically

` +
        `Keep your response under 200 words and focus on practical agricultural knowledge.`;
      
      const requestBody = {
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generation_config: {
          temperature: 0.4,
          top_p: 0.95,
          top_k: 40,
          max_output_tokens: 1024,
        }
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content && 
          data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
        return data.candidates[0].content.parts[0].text;
      }
      
      return null;
    } catch (error) {
      console.error('Error analyzing video content with Gemini:', error);
      return null;
    }
  }
};

/**
 * Helper function to extract keywords from Gemini response
 * @param {string} text - Text to extract keywords from
 * @param {string} type - Type of keywords to extract ('video' or 'image')
 * @returns {Array<string>} - Array of extracted keywords
 */
function extractKeywords(text, type) {
  // Simple extraction based on patterns in the text
  const keywords = [];
  const lines = text.split('\n');
  
  let inRelevantSection = false;
  
  for (const line of lines) {
    // Look for sections that might contain relevant keywords
    if (line.toLowerCase().includes(`${type} demonstration`) || 
        line.toLowerCase().includes(`${type}s`) ||
        line.toLowerCase().includes(`visual`) ||
        line.toLowerCase().includes(`demonstrate`) ||
        line.toLowerCase().includes(`show`)) {
      inRelevantSection = true;
    }
    
    // If we're in a relevant section, extract potential keywords
    if (inRelevantSection) {
      // Look for bullet points or numbered lists
      if (line.match(/^\s*[\*\-\•]\s+(.+)/) || line.match(/^\s*\d+\.\s+(.+)/)) {
        const match = line.match(/^\s*[\*\-\•\d+\.]\s+(.+)/);
        if (match && match[1]) {
          const keyword = match[1].trim();
          if (keyword.length > 3 && !keywords.includes(keyword)) {
            keywords.push(keyword);
          }
        }
      }
    }
    
    // Exit the relevant section if we hit a new heading
    if (line.match(/^#{1,6}\s+/) || line === '') {
      inRelevantSection = false;
    }
  }
  
  // If we didn't find any keywords with the structured approach, fall back to key terms
  if (keywords.length === 0) {
    const relevantTerms = type === 'video' ?
      ['technique', 'method', 'process', 'procedure', 'demonstration', 'tutorial'] :
      ['diagram', 'illustration', 'chart', 'visual', 'picture'];
    
    for (const term of relevantTerms) {
      const regex = new RegExp(`\\b(\\w+\\s+){0,3}${term}(\\s+\\w+){0,3}`, 'gi');
      const matches = text.match(regex);
      if (matches) {
        matches.forEach(match => {
          if (!keywords.includes(match) && match.length > term.length) {
            keywords.push(match.trim());
          }
        });
      }
    }
  }
  
  // Limit to 5 most relevant keywords
  return keywords.slice(0, 5);
}
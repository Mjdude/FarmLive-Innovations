import React, { useState, useEffect } from 'react';
import { translateObject, translateText } from '../utils/translationService';

const HealthTracking = ({ language }) => {
  const [translations, setTranslations] = useState({
    title: "Health Tracking Dashboard",
    description: "Track your health metrics and get personalized insights to support your well-being.",
    menstrualCycle: "Menstrual Cycle Start Date:",
    physicalActivity: "Physical Activity (minutes):",
    dietaryHabits: "Dietary Habits:",
    submit: "Log Health Data",
    tipsTitle: "Health Tips"
  });
  
  const [formData, setFormData] = useState({
    menstrualCycle: '',
    physicalActivity: '',
    dietaryHabits: ''
  });
  
  const [tips, setTips] = useState([]);
  const [showTips, setShowTips] = useState(false);

  useEffect(() => {
    const defaultTranslations = {
      title: "Health Tracking Dashboard",
      description: "Track your health metrics and get personalized insights to support your well-being.",
      menstrualCycle: "Menstrual Cycle Start Date:",
      physicalActivity: "Physical Activity (minutes):",
      dietaryHabits: "Dietary Habits:",
      submit: "Log Health Data",
      tipsTitle: "Health Tips"
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
      }
    }

    translateContent();
  }, [language]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real application, you would send this data to your backend
    console.log('Health data submitted:', formData);
    
    // Simulate fetching health tips
    fetchHealthTips(formData);
  };
  
  // Function to simulate fetching health tips from API
  const fetchHealthTips = async (data) => {
    // Simulate API call
    setTimeout(async () => {
      // In a real app, these tips would come from the backend/AI
      const generatedTips = [
        `Based on your cycle starting ${data.menstrualCycle}, you may experience increased energy in about 7 days.`,
        `Your ${data.physicalActivity} minutes of activity is excellent! Try to maintain consistency.`,
        `Consider adding more iron-rich foods based on your dietary habits: "${data.dietaryHabits}".`,
        `Stay hydrated during your workout sessions to maximize benefits.`
      ];
      let translatedTips = generatedTips;
      if (language !== 'en') {
        try {
          translatedTips = await Promise.all(generatedTips.map(tip => translateText(tip, language)));
        } catch (e) {
          translatedTips = generatedTips;
        }
      }
      setTips(translatedTips);
      setShowTips(true);
    }, 1000);
  };

  return (
    <div id="health-tracking" className="card">
      <h2>{translations.title}</h2>
      <p>{translations.description}</p>
      
      <form id="healthForm" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="menstrualCycle">{translations.menstrualCycle}</label>
          <input 
            type="date" 
            id="menstrualCycle" 
            name="menstrualCycle" 
            value={formData.menstrualCycle}
            onChange={handleChange}
            required 
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="physicalActivity">{translations.physicalActivity}</label>
          <input 
            type="number" 
            id="physicalActivity" 
            name="physicalActivity" 
            value={formData.physicalActivity}
            onChange={handleChange}
            required 
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="dietaryHabits">{translations.dietaryHabits}</label>
          <textarea 
            id="dietaryHabits" 
            name="dietaryHabits" 
            rows="4" 
            value={formData.dietaryHabits}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        
        <button type="submit" className="submit-button">{translations.submit}</button>
      </form>
      
      {showTips && (
        <div className="tips-container">
          <h3>{translations.tipsTitle}</h3>
          {tips.map((tip, index) => (
            <p key={index}>{tip}</p>
          ))}
        </div>
      )}
    </div>
  );
};

export default HealthTracking;
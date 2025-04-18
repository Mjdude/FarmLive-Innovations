import React, { useEffect, useState } from 'react';
import { translateObject } from '../utils/translationService';

const Features = ({ language }) => {
  const [translations, setTranslations] = useState({
    title: "Smart Farming Features",
    weatherTitle: "Weather Intelligence",
    weatherDesc: "AI-powered weather predictions and crop-specific advisories",
    soilTitle: "Soil Analysis",
    soilDesc: "Real-time soil health monitoring and recommendations",
    pestTitle: "Pest Detection",
    pestDesc: "Early warning system for pest and disease management",
    marketTitle: "Market Connect",
    marketDesc: "Direct market linkages and price predictions"
  });

  useEffect(() => {
    const defaultTranslations = {
      title: "Smart Farming Features",
      weatherTitle: "Weather Intelligence",
      weatherDesc: "AI-powered weather predictions and crop-specific advisories",
      soilTitle: "Soil Analysis",
      soilDesc: "Real-time soil health monitoring and recommendations",
      pestTitle: "Pest Detection",
      pestDesc: "Early warning system for pest and disease management",
      marketTitle: "Market Connect",
      marketDesc: "Direct market linkages and price predictions"
    };
    
    async function translateContent() {
      try {
        if (language !== 'en') {
          // Use the centralized translation service for all texts at once
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

  return (
    <section id="features" className="card features-card">
      <h2>{translations.title}</h2>
      <div className="features-grid">
        <div className="feature-item">
          <i className="fas fa-cloud-sun feature-icon"></i>
          <h3>{translations.weatherTitle}</h3>
          <p>{translations.weatherDesc}</p>
        </div>
        <div className="feature-item">
          <i className="fas fa-microscope feature-icon"></i>
          <h3>{translations.soilTitle}</h3>
          <p>{translations.soilDesc}</p>
        </div>
        <div className="feature-item">
          <i className="fas fa-bug feature-icon"></i>
          <h3>{translations.pestTitle}</h3>
          <p>{translations.pestDesc}</p>
        </div>
        <div className="feature-item">
          <i className="fas fa-coins feature-icon"></i>
          <h3>{translations.marketTitle}</h3>
          <p>{translations.marketDesc}</p>
        </div>
      </div>
    </section>
  );
};

export default Features;
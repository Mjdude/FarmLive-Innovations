import React, { useEffect, useState } from 'react';
import { translateObject } from '../utils/translationService';

const Impact = ({ language }) => {
  const [translations, setTranslations] = useState({
    title: "Our Impact",
    description: "Through our AI-driven solutions, we've helped farmers achieve:",
    impacts: [
      "Reduced water consumption by 40%",
      "Decreased chemical fertilizer usage by 35%",
      "Increased crop yield by up to 30%",
      "Better market prices through smart timing"
    ]
  });

  useEffect(() => {
    const defaultTranslations = {
      title: "Our Impact",
      description: "Through our AI-driven solutions, we've helped farmers achieve:",
      impacts: [
        "Reduced water consumption by 40%",
        "Decreased chemical fertilizer usage by 35%",
        "Increased crop yield by up to 30%",
        "Better market prices through smart timing"
      ]
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

  return (
    <section id="impact" className="card impact-card">
      <h2>{translations.title}</h2>
      <p>{translations.description}</p>
      <ul>
        {translations.impacts.map((impact, index) => (
          <li key={index}>{impact}</li>
        ))}
      </ul>
    </section>
  );
};

export default Impact;
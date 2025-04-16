import React, { useEffect, useState } from 'react';
import { translateObject } from '../utils/translationService';

const Header = ({ language }) => {
  const [translations, setTranslations] = useState({
    title: "FarmLive Innovations",
    subtitle: "Revolutionizing Agriculture with AI Technology"
  });

  useEffect(() => {
    const defaultTranslations = {
      title: "FarmLive Innovations",
      subtitle: "Revolutionizing Agriculture with AI Technology"
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
    <header>
      <div className="header-content">
        <h1 className="header-title">{translations.title}</h1>
        <p className="header-subtitle">{translations.subtitle}</p>
      </div>
    </header>
  );
};

export default Header;
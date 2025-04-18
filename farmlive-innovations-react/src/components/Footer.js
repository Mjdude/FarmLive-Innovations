import React, { useState, useEffect } from 'react';
import { translateObject } from '../utils/translationService';

const Footer = ({ language }) => {
  const [translations, setTranslations] = useState({
    copyright: "© 2025 FarmLive Innovations. All rights reserved.",
    tagline: "An initiative to transform agriculture through technology."
  });

  useEffect(() => {
    const defaultTranslations = {
      copyright: "© 2025 FarmLive Innovations. All rights reserved.",
      tagline: "An initiative to transform agriculture through technology."
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
    <footer>
      <p>{translations.copyright}</p>
      <p>{translations.tagline}</p>
    </footer>
  );
};

export default Footer;
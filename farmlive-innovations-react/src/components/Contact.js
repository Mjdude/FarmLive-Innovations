import React, { useEffect, useState } from 'react';
import { translateObject } from '../utils/translationService';

const Contact = ({ language }) => {
  const [translations, setTranslations] = useState({
    title: "Get in Touch",
    email: "support@farmlive.ai",
    phone: "+91 98765 43210",
    address: "Agricultural Innovation Center, Tech Park"
  });

  useEffect(() => {
    const defaultTranslations = {
      title: "Get in Touch",
      address: "Agricultural Innovation Center, Tech Park"
    };
    
    async function translateContent() {
      try {
        if (language !== 'en') {
          // Only translate title and address, keep contact info as is
          const translatedContent = await translateObject(defaultTranslations, language);
          
          setTranslations({
            ...translations,
            title: translatedContent.title,
            address: translatedContent.address
          });
        } else {
          setTranslations({
            title: "Get in Touch",
            email: "support@farmlive.ai",
            phone: "+91 98765 43210",
            address: "Agricultural Innovation Center, Tech Park"
          });
        }
      } catch (error) {
        console.error('Translation error:', error);
      }
    }

    translateContent();
  }, [language]);

  return (
    <section id="contact" className="card contact-card">
      <h2>{translations.title}</h2>
      <div className="contact-info">
        <div className="contact-item">
          <i className="fas fa-envelope"></i>
          <p>{translations.email}</p>
        </div>
        <div className="contact-item">
          <i className="fas fa-phone"></i>
          <p>{translations.phone}</p>
        </div>
        <div className="contact-item">
          <i className="fas fa-map-marker-alt"></i>
          <p>{translations.address}</p>
        </div>
      </div>
    </section>
  );
};

export default Contact;
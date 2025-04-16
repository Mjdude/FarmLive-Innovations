import React, { useState, useEffect, useRef } from 'react';
import { translateObject } from '../utils/translationService';

const LanguageSelector = ({ onLanguageChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const dropdownRef = useRef(null);
  const [translations, setTranslations] = useState({
    selectLanguage: "Select Language"
  });

  useEffect(() => {
    const defaultTranslations = {
      selectLanguage: "Select Language"
    };
    async function translateContent() {
      try {
        if (currentLanguage !== 'en') {
          const translated = await translateObject(defaultTranslations, currentLanguage);
          setTranslations(translated);
        } else {
          setTranslations(defaultTranslations);
        }
      } catch (error) {
        setTranslations(defaultTranslations);
      }
    }
    translateContent();
  }, [currentLanguage]);

  useEffect(() => {
    // Close dropdown when clicking outside
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLanguageChange = (lang) => {
    setCurrentLanguage(lang);
    onLanguageChange(lang);
    setIsOpen(false);
  };

  const languageOptions = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिन्दी' },
    { code: 'kn', name: 'ಕನ್ನಡ' },
    { code: 'ta', name: 'தமிழ்' },
    { code: 'te', name: 'తెలుగు' },
    { code: 'ml', name: 'മലയാളം' },
    { code: 'gu', name: 'ગુજરાતી' },
    { code: 'mr', name: 'मराठी' },
    { code: 'pa', name: 'ਪੰਜਾਬੀ' },
    { code: 'bn', name: 'বাংলা' },
    { code: 'ur', name: 'اردو' }
  ];

  return (
    <div className="language-control-container" ref={dropdownRef}>
      <button 
        className="language-control" 
        onClick={() => setIsOpen(!isOpen)}
        aria-label={translations.selectLanguage}
        title={translations.selectLanguage}
      >
        <i className="fas fa-globe"></i>
      </button>
      
      {isOpen && (
        <div className="language-dropdown">
          <div className="language-dropdown-header">
            {translations.selectLanguage}
          </div>
          <div className="language-options">
            {languageOptions.map(lang => (
              <div 
                key={lang.code} 
                className={`language-option ${currentLanguage === lang.code ? 'active' : ''}`}
                onClick={() => handleLanguageChange(lang.code)}
              >
                {lang.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
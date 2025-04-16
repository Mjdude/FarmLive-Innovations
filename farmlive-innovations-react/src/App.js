import React, { useState, useEffect, useRef } from 'react';
import './App.css';

// Import styles for components
import './styles/MultimediaAssistant.css';
import './styles/SchemeFinder.css';
import './styles/FlourishingFields.css';
import './styles/NotificationCenter.css';
import './styles/UtilityControls.css';
import './styles/ConnectionDashboard.css';

// Import theme utilities
import { initFlourishingFieldsTheme, showPageTransition } from './utils/FlourishingFieldsTheme';

// Component imports
import Header from './components/Header';
import Navigation from './components/Navigation';
import About from './components/About';
import Features from './components/Features';
import Impact from './components/Impact';
import Contact from './components/Contact';
import NGOConnect from './components/NGOConnect';
import HealthTracking from './components/HealthTracking';
import AIAssistant from './components/AIAssistant';
import MultimediaAssistant from './components/MultimediaAssistant';
import SchemeFinder from './components/SchemeFinder';
import NotificationCenter from './components/NotificationCenter';
import ConnectionDashboard from './components/ConnectionDashboard';
import Footer from './components/Footer';
import Map from './components/Map';

function App() {
  // State for showing/hiding components
  const [showMap, setShowMap] = useState(false);
  const [showMultimediaAssistant, setShowMultimediaAssistant] = useState(false);
  const [showSchemeFinder, setShowSchemeFinder] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  
  // Language state
  const [language, setLanguage] = useState('en');
  
  // Refs for click outside detection
  const languageDropdownRef = useRef(null);
  const notificationBellRef = useRef(null);
  
  // Initialize theme on mount
  useEffect(() => {
    initFlourishingFieldsTheme();
  }, []);
  
  // Handle language change
  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    setShowLanguageDropdown(false);
  };
  
  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target)) {
        setShowLanguageDropdown(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Toggle functions
  const toggleMultimediaAssistant = () => {
    showPageTransition(() => {
      setShowMultimediaAssistant(prev => !prev);
    });
  };
  
  const toggleSchemeFinder = () => {
    showPageTransition(() => {
      setShowSchemeFinder(prev => !prev);
    });
  };
  
  // Scroll to Connection Dashboard
  const scrollToConnectionDashboard = () => {
    const dashboardSection = document.getElementById('connection-dashboard');
    if (dashboardSection) {
      showPageTransition(() => {
        dashboardSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  };
  
  // Get language display name
  const getLanguageName = (code) => {
    const languages = {
      en: 'English',
      hi: 'हिन्दी',
      kn: 'ಕನ್ನಡ',
      ta: 'தமிழ்',
      te: 'తెలుగు',
      ml: 'മലയാളം',
      gu: 'ગુજરાતી',
      mr: 'मराठी',
      pa: 'ਪੰਜਾਬੀ',
      bn: 'বাংলা',
      ur: 'اردو'
    };
    return languages[code] || 'English';
  };
  
  return (
    <div className="App">
      {/* Utility Controls */}
      <div className="utility-controls">
        {/* Left Controls */}
        <div className="left-controls">
          {/* Language Selector */}
          <div className="language-control-wrapper" ref={languageDropdownRef}>
            <button 
              className="control-button"
              onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
              aria-label="Select Language"
            >
              <i className="fas fa-globe"></i>
            </button>
            
            {showLanguageDropdown && (
              <div className="language-dropdown">
                <div className="language-dropdown-header">
                  Select Language
                </div>
                <div className="language-options">
                  <div 
                    className={`language-option ${language === 'en' ? 'active' : ''}`}
                    onClick={() => handleLanguageChange('en')}
                  >
                    English
                  </div>
                  <div 
                    className={`language-option ${language === 'hi' ? 'active' : ''}`}
                    onClick={() => handleLanguageChange('hi')}
                  >
                    हिन्दी
                  </div>
                  <div 
                    className={`language-option ${language === 'kn' ? 'active' : ''}`}
                    onClick={() => handleLanguageChange('kn')}
                  >
                    ಕನ್ನಡ
                  </div>
                  <div 
                    className={`language-option ${language === 'ta' ? 'active' : ''}`}
                    onClick={() => handleLanguageChange('ta')}
                  >
                    தமிழ்
                  </div>
                  <div 
                    className={`language-option ${language === 'te' ? 'active' : ''}`}
                    onClick={() => handleLanguageChange('te')}
                  >
                    తెలుగు
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Map Button */}
          <button 
            className="control-button"
            onClick={() => setShowMap(true)}
            aria-label="Show Map"
          >
            <i className="fas fa-map-marker-alt"></i>
            <span className="map-tooltip">Show Map</span>
          </button>
        </div>
        
        {/* Right Controls */}
        <div className="right-controls">
          {/* Notification Bell */}
          <button 
            className="control-button"
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notifications"
            ref={notificationBellRef}
          >
            <i className="fas fa-bell"></i>
            <span className="notification-badge">3</span>
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <Header language={language} />
      <Navigation 
        language={language}
        onOpenMultimediaAssistant={toggleMultimediaAssistant}
        onOpenSchemeFinder={toggleSchemeFinder}
        onOpenConnectionDashboard={scrollToConnectionDashboard}
      />
      
      <div className="container">
        <About language={language} />
        <Features language={language} />
        <Impact language={language} />
        <NGOConnect language={language} />
        <HealthTracking language={language} />
        <AIAssistant language={language} />
        <div id="connection-dashboard">
          <ConnectionDashboard language={language} />
        </div>
        <Contact language={language} />
      </div>
      
      {/* Modal Components */}
      <Map 
        onClose={() => setShowMap(false)} 
        language={language}
        isOpen={showMap}
      />
      
      <MultimediaAssistant 
        onClose={() => setShowMultimediaAssistant(false)} 
        language={language}
        isOpen={showMultimediaAssistant}
      />
      
      <SchemeFinder 
        onClose={() => setShowSchemeFinder(false)} 
        language={language}
        isOpen={showSchemeFinder}
      />
      
      {showNotifications && (
        <NotificationCenter 
          language={language} 
          onClose={() => setShowNotifications(false)}
        />
      )}
      
      <Footer language={language} />
    </div>
  );
}

export default App;

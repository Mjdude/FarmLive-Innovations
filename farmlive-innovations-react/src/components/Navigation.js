import React, { useState, useEffect, useRef } from 'react';
import { translateObject } from '../utils/translationService';

const Navigation = ({ language, onOpenMultimediaAssistant, onOpenSchemeFinder, onOpenConnectionDashboard }) => {
  const [translations, setTranslations] = useState({
    about: "About",
    features: "Features",
    impact: "Impact",
    contact: "Contact",
    ngoConnect: "NGO Connect",
    multimediaAssistant: "Multimedia Assistant",
    schemeFinder: "Farmer Scheme Finder",
    connectionDashboard: "Connection Dashboard",
    sections: "Sections",
    menu: "Menu"
  });
  const [activeSection, setActiveSection] = useState('about');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const defaultTranslations = {
      about: "About",
      features: "Features",
      impact: "Impact",
      contact: "Contact",
      ngoConnect: "NGO Connect",
      multimediaAssistant: "Multimedia Assistant",
      schemeFinder: "Farmer Scheme Finder",
      connectionDashboard: "Connection Dashboard",
      sections: "Sections",
      menu: "Menu"
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

  // Smooth scroll and active link logic
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['about', 'features', 'impact', 'contact', 'ngo-connect', 'connection-dashboard'];
      let found = 'about';
      for (let i = 0; i < sections.length; i++) {
        const el = document.getElementById(sections[i]);
        if (el && window.scrollY + 80 >= el.offsetTop) {
          found = sections[i];
        }
      }
      setActiveSection(found);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleNavClick = (e, section) => {
    e.preventDefault();
    setMobileOpen(false);
    setDropdownOpen(false);
    const el = document.getElementById(section);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const navLinks = [
    { href: '#about', label: translations.about, icon: 'fas fa-seedling', section: 'about' },
    { href: '#features', label: translations.features, icon: 'fas fa-robot', section: 'features' },
    { href: '#impact', label: translations.impact, icon: 'fas fa-chart-line', section: 'impact' },
    { href: '#ngo-connect', label: translations.ngoConnect, icon: 'fas fa-handshake', section: 'ngo-connect' },
    { href: '#connection-dashboard', label: translations.connectionDashboard, icon: 'fas fa-exchange-alt', section: 'connection-dashboard' },
    { href: '#contact', label: translations.contact, icon: 'fas fa-envelope', section: 'contact' },
  ];

  return (
    <nav className="main-nav">
      <div className={`nav-links${mobileOpen ? ' open' : ''}`}>
        {/* Sections Dropdown */}
        <div className="sections-dropdown" ref={dropdownRef}>
          <button 
            className="sections-dropdown-toggle" 
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <i className="fas fa-bars"></i> {translations.sections}
            <i className={`fas fa-chevron-${dropdownOpen ? 'up' : 'down'}`}></i>
          </button>
          
          {dropdownOpen && (
            <div className="sections-dropdown-menu">
              {navLinks.map(link => (
                <a
                  key={link.section}
                  href={link.href}
                  className={`dropdown-item${activeSection === link.section ? ' active' : ''}`}
                  onClick={e => handleNavClick(e, link.section)}
                >
                  <i className={link.icon}></i> {link.label}
                </a>
              ))}
            </div>
          )}
        </div>
        
        {/* Special Buttons - Always Visible */}
        <button 
          className="multimedia-assistant-button" 
          onClick={onOpenMultimediaAssistant}
        >
          <i className="fas fa-film"></i> {translations.multimediaAssistant}
        </button>
        
        <button 
          className="scheme-finder-button" 
          onClick={onOpenSchemeFinder}
        >
          <i className="fas fa-leaf"></i> {translations.schemeFinder}
        </button>
        
        <button 
          className="connection-dashboard-button" 
          onClick={onOpenConnectionDashboard}
        >
          <i className="fas fa-exchange-alt"></i> {translations.connectionDashboard}
        </button>
      </div>
      
      <button className="mobile-menu-toggle" onClick={() => setMobileOpen(m => !m)}>
        <i className="fas fa-bars"></i>
      </button>
    </nav>
  );
};

export default Navigation;
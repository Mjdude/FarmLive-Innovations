import React, { useState, useEffect } from 'react';
import { translateObject } from '../utils/translationService';

const NGOConnect = ({ language }) => {
  const [translations, setTranslations] = useState({
    title: "Connect with Farmers",
    description: "We invite NGOs to partner with us in supporting farmers. Your contributions can help improve agricultural practices and sustainability. Please fill out the form below to express your interest in funding or collaborating with farmers.",
    ngoName: "NGO Name:",
    contactPerson: "Contact Person:",
    email: "Email:",
    phone: "Phone:",
    message: "Message:",
    submit: "Submit"
  });
  
  const [formData, setFormData] = useState({
    ngoName: '',
    contactPerson: '',
    email: '',
    phone: '',
    message: ''
  });

  useEffect(() => {
    const defaultTranslations = {
      title: "Connect with Farmers",
      description: "We invite NGOs to partner with us in supporting farmers. Your contributions can help improve agricultural practices and sustainability. Please fill out the form below to express your interest in funding or collaborating with farmers.",
      ngoName: "NGO Name:",
      contactPerson: "Contact Person:",
      email: "Email:",
      phone: "Phone:",
      message: "Message:",
      submit: "Submit"
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
    console.log('Form submitted:', formData);
    alert('Thank you for your interest! We will contact you soon.');
    
    // Reset form
    setFormData({
      ngoName: '',
      contactPerson: '',
      email: '',
      phone: '',
      message: ''
    });
  };

  return (
    <section id="ngo-connect" className="card ngo-card">
      <h2>{translations.title}</h2>
      <p>{translations.description}</p>
      
      <form id="ngoForm" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="ngoName">{translations.ngoName}</label>
          <input 
            type="text" 
            id="ngoName" 
            name="ngoName" 
            value={formData.ngoName}
            onChange={handleChange}
            required 
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="contactPerson">{translations.contactPerson}</label>
          <input 
            type="text" 
            id="contactPerson" 
            name="contactPerson" 
            value={formData.contactPerson}
            onChange={handleChange}
            required 
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">{translations.email}</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            value={formData.email}
            onChange={handleChange}
            required 
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="phone">{translations.phone}</label>
          <input 
            type="tel" 
            id="phone" 
            name="phone" 
            value={formData.phone}
            onChange={handleChange}
            required 
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="message">{translations.message}</label>
          <textarea 
            id="message" 
            name="message" 
            rows="4" 
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        
        <button type="submit" className="submit-button">{translations.submit}</button>
      </form>
    </section>
  );
};

export default NGOConnect;
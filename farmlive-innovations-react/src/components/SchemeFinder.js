import React, { useState, useEffect, useRef } from 'react';
import { translateObject, translateText } from '../utils/translationService';
import '../styles/SchemeFinder.css';

const SchemeFinder = ({ language = 'en', isOpen, onClose }) => {
  // State for translations
  const [translations, setTranslations] = useState({
    title: "Farmer Scheme Finder",
    subtitle: "Find and Apply for Government Schemes",
    profileTab: "My Profile",
    schemesTab: "Available Schemes",
    applicationsTab: "My Applications",
    saveProfileButton: "Save Profile",
    searchButton: "Find Schemes",
    applyButton: "Apply Now",
    trackButton: "Track Application",
    landSizeLabel: "Land Size (Acres)",
    cropsLabel: "Crops Grown",
    irrigationLabel: "Irrigation Status",
    incomeLabel: "Annual Income (₹)",
    stateLabel: "State",
    districtLabel: "District",
    uploadDocsLabel: "Upload Documents",
    documentTypes: "Land Records, Income Certificate, Aadhaar Card",
    eligibilityLabel: "Eligibility",
    deadlineLabel: "Deadline",
    benefitsLabel: "Benefits",
    categoryLabel: "Category",
    relevanceLabel: "Relevance Score",
    applicationStatusLabel: "Application Status",
    requiredDocsLabel: "Required Documents",
    loadingText: "Processing your request...",
    errorText: "Sorry, there was an error. Please try again.",
    noSchemesText: "No schemes found matching your profile. Please update your details.",
    profileSavedText: "Profile saved successfully!",
    applicationSubmittedText: "Application submitted successfully!",
    formInstructionText: "Fill in your details to find relevant schemes",
    voiceGuidanceButton: "Voice Guidance",
    offlineModeButton: "Enable Offline Mode",
    contactSupportButton: "Contact Support",
    communityForumButton: "Community Forum"
  });

  // States for the scheme finder functionality
  const [activeTab, setActiveTab] = useState('profile');
  const [farmerProfile, setFarmerProfile] = useState({
    landSize: '',
    crops: '',
    irrigation: 'rainfed',
    income: '',
    state: '',
    district: '',
    farmerCategory: '',
    age: '',
    gender: '',
    soilType: '',
    documents: []
  });
  const [availableSchemes, setAvailableSchemes] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [isVoiceGuidanceEnabled, setIsVoiceGuidanceEnabled] = useState(false);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  
  // Refs
  const schemeFinderRef = useRef(null);
  const fileInputRef = useRef(null);

  // Effect for translations
  useEffect(() => {
    const defaultTranslations = {
      title: "Farmer Scheme Finder",
      subtitle: "Find and Apply for Government Schemes",
      profileTab: "My Profile",
      schemesTab: "Available Schemes",
      applicationsTab: "My Applications",
      saveProfileButton: "Save Profile",
      searchButton: "Find Schemes",
      applyButton: "Apply Now",
      trackButton: "Track Application",
      landSizeLabel: "Land Size (Acres)",
      cropsLabel: "Crops Grown",
      irrigationLabel: "Irrigation Status",
      incomeLabel: "Annual Income (₹)",
      stateLabel: "State",
      districtLabel: "District",
      uploadDocsLabel: "Upload Documents",
      documentTypes: "Land Records, Income Certificate, Aadhaar Card",
      eligibilityLabel: "Eligibility",
      deadlineLabel: "Deadline",
      benefitsLabel: "Benefits",
      categoryLabel: "Category",
      relevanceLabel: "Relevance Score",
      applicationStatusLabel: "Application Status",
      requiredDocsLabel: "Required Documents",
      loadingText: "Processing your request...",
      errorText: "Sorry, there was an error. Please try again.",
      noSchemesText: "No schemes found matching your profile. Please update your details.",
      profileSavedText: "Profile saved successfully!",
      applicationSubmittedText: "Application submitted successfully!",
      formInstructionText: "Fill in your details to find relevant schemes",
      voiceGuidanceButton: "Voice Guidance",
      offlineModeButton: "Enable Offline Mode",
      contactSupportButton: "Contact Support",
      communityForumButton: "Community Forum"
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
        setTranslations(defaultTranslations);
      }
    }

    translateContent();
  }, [language]);

  // Handle profile input changes
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setFarmerProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle document upload
  const handleDocumentUpload = (e) => {
    const files = Array.from(e.target.files);
    setFarmerProfile(prev => ({
      ...prev,
      documents: [...prev.documents, ...files]
    }));
  };

  // Save farmer profile
  const saveProfile = () => {
    setIsLoading(true);
    setError(null);
    
    // Simulate API call to save profile
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMessage(translations.profileSavedText);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
        // Automatically switch to schemes tab after saving profile
        setActiveTab('schemes');
        // Find schemes based on profile
        findSchemes();
      }, 3000);
    }, 1500);
  };

  // Find schemes based on farmer profile
  const findSchemes = () => {
    setIsLoading(true);
    setError(null);
    
    // Simulate API call to find schemes
    setTimeout(() => {
      setIsLoading(false);
      
      // Generate sample schemes based on profile
      const schemes = generateSampleSchemes(farmerProfile);
      setAvailableSchemes(schemes);
    }, 2000);
  };

  // Apply for a scheme
  const applyForScheme = (scheme) => {
    setIsLoading(true);
    setError(null);
    
    // Simulate API call to apply for scheme
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMessage(translations.applicationSubmittedText);
      
      // Add to my applications
      const newApplication = {
        ...scheme,
        applicationId: `APP-${Date.now()}`,
        appliedDate: new Date().toISOString(),
        status: 'Submitted',
        nextSteps: 'Document verification in progress',
        estimatedCompletionTime: '2-3 weeks'
      };
      
      setMyApplications(prev => [...prev, newApplication]);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
        // Switch to applications tab
        setActiveTab('applications');
      }, 3000);
    }, 1500);
  };

  // Toggle voice guidance
  const toggleVoiceGuidance = () => {
    setIsVoiceGuidanceEnabled(prev => !prev);
    
    // Implement voice guidance logic here
    if (!isVoiceGuidanceEnabled) {
      // Example: Read current page content
      const textToRead = activeTab === 'profile' 
        ? translations.formInstructionText 
        : activeTab === 'schemes' 
          ? 'Here are the schemes available for you based on your profile.' 
          : 'Here are your applications and their current status.';
      
      // Use browser's speech synthesis if available
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(textToRead);
        utterance.lang = language === 'en' ? 'en-IN' : 
                         language === 'hi' ? 'hi-IN' : 
                         language === 'ta' ? 'ta-IN' : 'en-IN';
        window.speechSynthesis.speak(utterance);
      }
    } else {
      // Stop any ongoing speech
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }
  };

  // Toggle offline mode
  const toggleOfflineMode = () => {
    setIsOfflineMode(prev => !prev);
    // Implement offline mode logic here
    // This would typically involve caching data using IndexedDB or localStorage
  };

  // Generate sample schemes based on farmer profile
  const generateSampleSchemes = (profile) => {
    // In a real application, this would be an API call to a backend service
    // that would match the farmer's profile with available schemes
    
    const schemes = [
      {
        id: 'scheme1',
        title: 'PM-KISAN',
        description: 'Income support of ₹6,000 per year to all farmer families across the country in three equal installments of ₹2,000 each every four months.',
        eligibility: 'All small and marginal farmers with combined landholding up to 2 hectares.',
        deadline: '2025-06-30',
        benefits: '₹6,000 per year direct income support',
        category: 'Financial Assistance',
        relevanceScore: profile.landSize <= 5 ? 95 : 60,
        requiredDocuments: ['Aadhaar Card', 'Land Records', 'Bank Account Details'],
        applicationProcess: '1. Register online\n2. Submit land details\n3. Verification by local authorities\n4. Approval and disbursement',
        website: 'https://pmkisan.gov.in/',
        contactInfo: 'Toll-Free: 1800-11-0001'
      },
      {
        id: 'scheme2',
        title: 'Pradhan Mantri Fasal Bima Yojana',
        description: 'Crop insurance scheme to provide financial support to farmers suffering crop loss/damage due to unforeseen events.',
        eligibility: 'All farmers growing notified crops in notified areas.',
        deadline: '2025-07-31',
        benefits: 'Insurance coverage and financial support in case of crop failure due to natural calamities',
        category: 'Insurance',
        relevanceScore: profile.crops.includes('rice') || profile.crops.includes('wheat') ? 90 : 75,
        requiredDocuments: ['Aadhaar Card', 'Land Records', 'Bank Account Details', 'Crop Sowing Certificate'],
        applicationProcess: '1. Apply through local bank\n2. Pay premium amount\n3. Receive insurance policy\n4. Claim in case of crop damage',
        website: 'https://pmfby.gov.in/',
        contactInfo: 'Toll-Free: 1800-11-5555'
      },
      {
        id: 'scheme3',
        title: 'Soil Health Card Scheme',
        description: 'Provides information on soil health to farmers to help them improve productivity through judicious use of inputs.',
        eligibility: 'All farmers',
        deadline: 'Ongoing',
        benefits: 'Free soil testing and recommendations for nutrients and fertilizers',
        category: 'Technical Assistance',
        relevanceScore: 85,
        requiredDocuments: ['Aadhaar Card', 'Land Records'],
        applicationProcess: '1. Register at local agriculture office\n2. Submit soil samples\n3. Receive soil health card with recommendations',
        website: 'https://soilhealth.dac.gov.in/',
        contactInfo: 'Contact local Krishi Vigyan Kendra'
      },
      {
        id: 'scheme4',
        title: 'PM Kisan Maan Dhan Yojana',
        description: 'Pension scheme for small and marginal farmers who are between 18 to 40 years of age.',
        eligibility: 'Small and marginal farmers aged 18-40 years',
        deadline: 'Ongoing',
        benefits: 'Monthly pension of ₹3,000 after age of 60',
        category: 'Pension',
        relevanceScore: profile.landSize <= 5 ? 80 : 50,
        requiredDocuments: ['Aadhaar Card', 'Land Records', 'Age Proof', 'Bank Account Details'],
        applicationProcess: '1. Register through Common Service Centre\n2. Pay monthly contribution\n3. Receive pension after age 60',
        website: 'https://maandhan.in/',
        contactInfo: 'Toll-Free: 1800-11-0224'
      },
      {
        id: 'scheme5',
        title: 'National Mission on Sustainable Agriculture',
        description: 'Promotes sustainable agriculture through water use efficiency, soil health management, and resource conservation.',
        eligibility: 'Farmers adopting sustainable agriculture practices',
        deadline: 'Ongoing',
        benefits: 'Subsidies for micro-irrigation, organic farming inputs, and resource conservation technology',
        category: 'Sustainable Farming',
        relevanceScore: profile.irrigation === 'drip' || profile.irrigation === 'sprinkler' ? 90 : 70,
        requiredDocuments: ['Aadhaar Card', 'Land Records', 'Bank Account Details'],
        applicationProcess: '1. Apply through local agriculture department\n2. Submit farm details\n3. Verification visit\n4. Approval and subsidy release',
        website: 'https://nmsa.dac.gov.in/',
        contactInfo: 'Contact District Agriculture Officer'
      }
    ];
    
    // Sort schemes by relevance score
    return schemes.sort((a, b) => b.relevanceScore - a.relevanceScore);
  };

  // If the scheme finder is not open, don't render anything
  if (!isOpen) return null;

  return (
    <div className="scheme-finder-overlay">
      <div className="scheme-finder-container" ref={schemeFinderRef}>
        <div className="scheme-finder-header">
          <div className="scheme-finder-title">
            <h2>{translations.title}</h2>
            <p>{translations.subtitle}</p>
          </div>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        
        <div className="scheme-finder-tabs">
          <button 
            className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <i className="fas fa-user-circle"></i> {translations.profileTab}
          </button>
          <button 
            className={`tab-button ${activeTab === 'schemes' ? 'active' : ''}`}
            onClick={() => setActiveTab('schemes')}
          >
            <i className="fas fa-list-alt"></i> {translations.schemesTab}
          </button>
          <button 
            className={`tab-button ${activeTab === 'applications' ? 'active' : ''}`}
            onClick={() => setActiveTab('applications')}
          >
            <i className="fas fa-clipboard-list"></i> {translations.applicationsTab}
          </button>
        </div>
        
        {successMessage && (
          <div className="success-message">
            <p>{successMessage}</p>
          </div>
        )}
        
        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>{translations.loadingText}</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p>{error}</p>
          </div>
        ) : (
          <div className="scheme-finder-content">
            {activeTab === 'profile' && (
              <div className="profile-tab-content">
                <h3>{translations.formInstructionText}</h3>
                <div className="profile-form">
                  <div className="form-group">
                    <label htmlFor="landSize">{translations.landSizeLabel}</label>
                    <input 
                      type="number" 
                      id="landSize" 
                      name="landSize" 
                      value={farmerProfile.landSize} 
                      onChange={handleProfileChange}
                      min="0"
                      step="0.1"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="crops">{translations.cropsLabel}</label>
                    <input 
                      type="text" 
                      id="crops" 
                      name="crops" 
                      value={farmerProfile.crops} 
                      onChange={handleProfileChange}
                      placeholder="e.g., Rice, Wheat, Cotton"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="irrigation">{translations.irrigationLabel}</label>
                    <select 
                      id="irrigation" 
                      name="irrigation" 
                      value={farmerProfile.irrigation} 
                      onChange={handleProfileChange}
                    >
                      <option value="rainfed">Rainfed</option>
                      <option value="canal">Canal Irrigation</option>
                      <option value="well">Well/Tube Well</option>
                      <option value="drip">Drip Irrigation</option>
                      <option value="sprinkler">Sprinkler System</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="income">{translations.incomeLabel}</label>
                    <input 
                      type="number" 
                      id="income" 
                      name="income" 
                      value={farmerProfile.income} 
                      onChange={handleProfileChange}
                      min="0"
                      step="1000"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="state">{translations.stateLabel}</label>
                    <select 
                      id="state" 
                      name="state" 
                      value={farmerProfile.state} 
                      onChange={handleProfileChange}
                    >
                      <option value="">Select State</option>
                      <option value="Andhra Pradesh">Andhra Pradesh</option>
                      <option value="Bihar">Bihar</option>
                      <option value="Gujarat">Gujarat</option>
                      <option value="Haryana">Haryana</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Kerala">Kerala</option>
                      <option value="Madhya Pradesh">Madhya Pradesh</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Punjab">Punjab</option>
                      <option value="Rajasthan">Rajasthan</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="Telangana">Telangana</option>
                      <option value="Uttar Pradesh">Uttar Pradesh</option>
                      <option value="West Bengal">West Bengal</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="district">{translations.districtLabel}</label>
                    <input 
                      type="text" 
                      id="district" 
                      name="district" 
                      value={farmerProfile.district} 
                      onChange={handleProfileChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="farmerCategory">Farmer Category</label>
                    <select 
                      id="farmerCategory" 
                      name="farmerCategory" 
                      value={farmerProfile.farmerCategory} 
                      onChange={handleProfileChange}
                    >
                      <option value="">Select Category</option>
                      <option value="marginal">Marginal (Below 1 Hectare)</option>
                      <option value="small">Small (1-2 Hectares)</option>
                      <option value="medium">Medium (2-4 Hectares)</option>
                      <option value="large">Large (Above 4 Hectares)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="age">Age</label>
                    <input 
                      type="number" 
                      id="age" 
                      name="age" 
                      value={farmerProfile.age} 
                      onChange={handleProfileChange}
                      min="18"
                      max="100"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="gender">Gender</label>
                    <select 
                      id="gender" 
                      name="gender" 
                      value={farmerProfile.gender} 
                      onChange={handleProfileChange}
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="soilType">Soil Type</label>
                    <select 
                      id="soilType" 
                      name="soilType" 
                      value={farmerProfile.soilType} 
                      onChange={handleProfileChange}
                    >
                      <option value="">Select Soil Type</option>
                      <option value="alluvial">Alluvial</option>
                      <option value="black">Black</option>
                      <option value="red">Red</option>
                      <option value="laterite">Laterite</option>
                      <option value="sandy">Sandy</option>
                      <option value="clayey">Clayey</option>
                    </select>
                  </div>
                  
                  <div className="document-upload">
                    <label htmlFor="documents">{translations.uploadDocsLabel}</label>
                    <p className="document-types">{translations.documentTypes}</p>
                    <div className="upload-button-container">
                      <label className="upload-button" htmlFor="document-input">
                        <i className="fas fa-upload"></i> Upload Documents
                        <input 
                          type="file" 
                          id="document-input" 
                          multiple 
                          onChange={handleDocumentUpload} 
                          style={{ display: 'none' }}
                          ref={fileInputRef}
                        />
                      </label>
                    </div>
                    
                    {farmerProfile.documents.length > 0 && (
                      <div className="uploaded-files">
                        <p>Uploaded Documents:</p>
                        <ul>
                          {farmerProfile.documents.map((doc, index) => (
                            <li key={index}>{doc.name}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  
                  <div className="form-actions">
                    <button 
                      className="save-profile-button" 
                      onClick={saveProfile}
                    >
                      <i className="fas fa-save"></i> {translations.saveProfileButton}
                    </button>
                    <button 
                      className="find-schemes-button" 
                      onClick={findSchemes}
                    >
                      <i className="fas fa-search"></i> {translations.searchButton}
                    </button>
                  </div>

                  <div className="accessibility-features">
                    <button 
                      className={`voice-guidance-button ${isVoiceGuidanceEnabled ? 'active' : ''}`} 
                      onClick={toggleVoiceGuidance}
                    >
                      <i className="fas fa-volume-up"></i> {translations.voiceGuidanceButton}
                    </button>
                    <button 
                      className={`offline-mode-button ${isOfflineMode ? 'active' : ''}`} 
                      onClick={toggleOfflineMode}
                    >
                      <i className="fas fa-wifi-slash"></i> {translations.offlineModeButton}
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'schemes' && (
              <div className="schemes-tab-content">
                {availableSchemes.length > 0 ? (
                  <>
                    <div className="schemes-header">
                      <h3>AI-Powered Scheme Recommendations</h3>
                      <p className="schemes-explanation">
                        Based on your profile, our AI has analyzed and matched you with the following government schemes. 
                        The relevance score indicates how well each scheme matches your specific farming situation.
                      </p>
                      <div className="schemes-filter">
                        <label htmlFor="scheme-filter">Filter by Category:</label>
                        <select id="scheme-filter" onChange={(e) => {
                          // Filter functionality would be implemented here
                          console.log('Filter by:', e.target.value);
                        }}>
                          <option value="all">All Categories</option>
                          <option value="financial">Financial Assistance</option>
                          <option value="insurance">Insurance</option>
                          <option value="technical">Technical Assistance</option>
                          <option value="sustainable">Sustainable Farming</option>
                          <option value="pension">Pension</option>
                        </select>
                      </div>
                    </div>
                    <div className="schemes-list">
                      {availableSchemes.map(scheme => (
                        <div className="scheme-card" key={scheme.id}>
                          <div className="scheme-header">
                            <h3>{scheme.title}</h3>
                            <div className={`relevance-badge ${scheme.relevanceScore > 85 ? 'high-relevance' : scheme.relevanceScore > 70 ? 'medium-relevance' : 'low-relevance'}`}>
                              <span>{translations.relevanceLabel}: {scheme.relevanceScore}%</span>
                            </div>
                          </div>
                          <div className="scheme-description">
                            <p>{scheme.description}</p>
                          </div>
                          <div className="scheme-details">
                            <div className="detail-item">
                              <span className="detail-label">{translations.eligibilityLabel}:</span>
                              <span className="detail-value">{scheme.eligibility}</span>
                            </div>
                            <div className="detail-item">
                              <span className="detail-label">{translations.deadlineLabel}:</span>
                              <span className="detail-value">{scheme.deadline}</span>
                            </div>
                            <div className="detail-item">
                              <span className="detail-label">{translations.benefitsLabel}:</span>
                              <span className="detail-value">{scheme.benefits}</span>
                            </div>
                            <div className="detail-item">
                              <span className="detail-label">{translations.categoryLabel}:</span>
                              <span className="detail-value">{scheme.category}</span>
                            </div>
                          </div>
                          <div className="scheme-documents">
                            <h4>{translations.requiredDocsLabel}:</h4>
                            <ul>
                              {scheme.requiredDocuments.map((doc, index) => (
                                <li key={index}>
                                  <i className="fas fa-file-alt"></i> {doc}
                                  {farmerProfile.documents.some(uploadedDoc => 
                                    uploadedDoc.name.toLowerCase().includes(doc.toLowerCase().replace(/\s+/g, ''))
                                  ) && <span className="document-status-verified"><i className="fas fa-check-circle"></i> Uploaded</span>}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="scheme-application-process">
                            <h4>Application Process:</h4>
                            <div className="process-steps">
                              {scheme.applicationProcess.split('\n').map((step, index) => (
                                <div className="process-step" key={index}>
                                  <div className="step-number">{index + 1}</div>
                                  <div className="step-description">{step.replace(/^\d+\.\s*/, '')}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="scheme-contact">
                            <div className="contact-item">
                              <i className="fas fa-globe"></i> <a href={scheme.website} target="_blank" rel="noopener noreferrer">Official Website</a>
                            </div>
                            <div className="contact-item">
                              <i className="fas fa-phone-alt"></i> {scheme.contactInfo}
                            </div>
                          </div>
                          <div className="scheme-actions">
                            <button 
                              className="apply-button"
                              onClick={() => applyForScheme(scheme)}
                              disabled={scheme.requiredDocuments.some(doc => 
                                !farmerProfile.documents.some(uploadedDoc => 
                                  uploadedDoc.name.toLowerCase().includes(doc.toLowerCase().replace(/\s+/g, ''))
                                )
                              )}
                            >
                              <i className="fas fa-file-signature"></i> {translations.applyButton}
                              {scheme.requiredDocuments.some(doc => 
                                !farmerProfile.documents.some(uploadedDoc => 
                                  uploadedDoc.name.toLowerCase().includes(doc.toLowerCase().replace(/\s+/g, ''))
                                )
                              ) && <span className="missing-docs-warning"> (Upload required documents first)</span>}
                            </button>
                            <button className="details-button" onClick={() => window.open(scheme.website, '_blank')}>
                              <i className="fas fa-info-circle"></i> More Details
                            </button>
                          </div>
                          <div className="educational-note">
                            <i className="fas fa-lightbulb"></i>
                            <p>Tip: {scheme.category === 'Financial Assistance' ? 
                              'Financial assistance schemes often require income proof and land records. Make sure your documents are up-to-date.' : 
                              scheme.category === 'Insurance' ? 
                              'Crop insurance can protect you from losses due to natural calamities. Apply before the sowing season starts.' :
                              scheme.category === 'Technical Assistance' ?
                              'Technical assistance schemes can help improve your farm productivity through modern farming techniques.' :
                              'This scheme can help improve your farming practices and increase your income.'}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="ai-explanation">
                      <h4><i className="fas fa-robot"></i> How Our AI Matched These Schemes</h4>
                      <p>Our AI system analyzed your profile data including land size, crops grown, irrigation status, income level, and location to find the most relevant government schemes for you. The relevance score is calculated based on how closely your profile matches the eligibility criteria of each scheme.</p>
                      <p>The higher the score, the more likely you are to qualify and benefit from the scheme. Schemes with scores above 85% are highly recommended for your situation.</p>
                    </div>
                  </>
                ) : (
                  <div className="no-schemes">
                    <p>{translations.noSchemesText}</p>
                    <button 
                      className="update-profile-button"
                      onClick={() => setActiveTab('profile')}
                    >
                      Update Profile
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'applications' && (
              <div className="applications-tab-content">
                {myApplications.length > 0 ? (
                  <>
                    <div className="applications-header">
                      <h3>My Applications</h3>
                      <p className="applications-explanation">
                        Track the status of your scheme applications and manage your documents.
                      </p>
                    </div>
                    <div className="applications-list">
                      {myApplications.map(application => (
                        <div className="application-card" key={application.applicationId}>
                          <div className="application-header">
                            <h3>{application.title}</h3>
                            <div className="application-id">
                              <span>ID: {application.applicationId}</span>
                            </div>
                          </div>
                          <div className="application-details">
                            <div className="detail-item">
                              <span className="detail-label">Applied Date:</span>
                              <span className="detail-value">{new Date(application.appliedDate).toLocaleDateString()}</span>
                            </div>
                            <div className="detail-item">
                              <span className="detail-label">{translations.applicationStatusLabel}:</span>
                              <span className={`detail-value status-${application.status.toLowerCase()}`}>
                                {application.status}
                              </span>
                            </div>
                            <div className="detail-item">
                              <span className="detail-label">Next Steps:</span>
                              <span className="detail-value">{application.nextSteps}</span>
                            </div>
                            <div className="detail-item">
                              <span className="detail-label">Estimated Completion:</span>
                              <span className="detail-value">{application.estimatedCompletionTime}</span>
                            </div>
                          </div>
                          
                          <div className="application-progress">
                            <h4>Application Progress</h4>
                            <div className="progress-tracker">
                              <div className={`progress-step ${application.status === 'Submitted' || application.status === 'Under Review' || application.status === 'Approved' ? 'completed' : ''}`}>
                                <div className="step-icon"><i className="fas fa-file-signature"></i></div>
                                <div className="step-label">Submitted</div>
                              </div>
                              <div className="progress-connector"></div>
                              <div className={`progress-step ${application.status === 'Under Review' || application.status === 'Approved' ? 'completed' : ''}`}>
                                <div className="step-icon"><i className="fas fa-search"></i></div>
                                <div className="step-label">Under Review</div>
                              </div>
                              <div className="progress-connector"></div>
                              <div className={`progress-step ${application.status === 'Approved' ? 'completed' : ''}`}>
                                <div className="step-icon"><i className="fas fa-check-circle"></i></div>
                                <div className="step-label">Approved</div>
                              </div>
                              <div className="progress-connector"></div>
                              <div className={`progress-step ${application.status === 'Disbursed' ? 'completed' : ''}`}>
                                <div className="step-icon"><i className="fas fa-rupee-sign"></i></div>
                                <div className="step-label">Disbursed</div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="application-documents">
                            <h4>Submitted Documents</h4>
                            <ul>
                              {application.requiredDocuments && application.requiredDocuments.map((doc, index) => (
                                <li key={index}>
                                  <i className="fas fa-file-alt"></i> {doc}
                                  <span className="document-status-verified"><i className="fas fa-check-circle"></i> Verified</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div className="application-actions">
                            <button className="track-button">
                              <i className="fas fa-map-marker-alt"></i> {translations.trackButton}
                            </button>
                            <button className="download-button">
                              <i className="fas fa-download"></i> Download Receipt
                            </button>
                            <button className="support-button">
                              <i className="fas fa-headset"></i> Get Support
                            </button>
                          </div>
                          
                          <div className="application-updates">
                            <h4>Recent Updates</h4>
                            <div className="update-timeline">
                              <div className="update-item">
                                <div className="update-date">{new Date(application.appliedDate).toLocaleDateString()}</div>
                                <div className="update-content">Application submitted successfully</div>
                              </div>
                              {application.status !== 'Submitted' && (
                                <div className="update-item">
                                  <div className="update-date">{new Date(new Date(application.appliedDate).getTime() + 86400000 * 2).toLocaleDateString()}</div>
                                  <div className="update-content">Documents verification in progress</div>
                                </div>
                              )}
                              {(application.status === 'Under Review' || application.status === 'Approved') && (
                                <div className="update-item">
                                  <div className="update-date">{new Date(new Date(application.appliedDate).getTime() + 86400000 * 5).toLocaleDateString()}</div>
                                  <div className="update-content">Application under review by authorities</div>
                                </div>
                              )}
                              {application.status === 'Approved' && (
                                <div className="update-item">
                                  <div className="update-date">{new Date(new Date(application.appliedDate).getTime() + 86400000 * 10).toLocaleDateString()}</div>
                                  <div className="update-content">Application approved! Disbursement in process</div>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="educational-note">
                            <i className="fas fa-lightbulb"></i>
                            <p>Tip: Keep checking your application status regularly. If there are any document requirements or clarifications needed, you'll be notified here.</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="smart-application-features">
                      <h4><i className="fas fa-magic"></i> Smart Application Features</h4>
                      <div className="features-grid">
                        <div className="feature-item">
                          <div className="feature-icon"><i className="fas fa-bolt"></i></div>
                          <div className="feature-content">
                            <h5>One-Click Apply</h5>
                            <p>Apply to multiple schemes with pre-filled information from your profile</p>
                          </div>
                        </div>
                        <div className="feature-item">
                          <div className="feature-icon"><i className="fas fa-bell"></i></div>
                          <div className="feature-content">
                            <h5>Status Notifications</h5>
                            <p>Get real-time updates about your application status</p>
                          </div>
                        </div>
                        <div className="feature-item">
                          <div className="feature-icon"><i className="fas fa-calendar-alt"></i></div>
                          <div className="feature-content">
                            <h5>Deadline Reminders</h5>
                            <p>Never miss important deadlines with timely reminders</p>
                          </div>
                        </div>
                        <div className="feature-item">
                          <div className="feature-icon"><i className="fas fa-file-upload"></i></div>
                          <div className="feature-content">
                            <h5>Document Reuse</h5>
                            <p>Use already uploaded documents for new applications</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="no-applications">
                    <div className="empty-state-illustration">
                      <i className="fas fa-clipboard-list"></i>
                    </div>
                    <h3>No Applications Yet</h3>
                    <p>You haven't applied for any schemes yet. Find and apply for schemes that match your profile.</p>
                    <button 
                      className="find-schemes-button"
                      onClick={() => setActiveTab('schemes')}
                    >
                      <i className="fas fa-search"></i> Find Schemes
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        
        <div className="scheme-finder-footer">
          <div className="support-options">
            <button 
              className={`voice-guidance-button ${isVoiceGuidanceEnabled ? 'active' : ''}`}
              onClick={toggleVoiceGuidance}
            >
              <i className={`fas ${isVoiceGuidanceEnabled ? 'fa-volume-up' : 'fa-volume-mute'}`}></i>
              {translations.voiceGuidanceButton}
            </button>
            <button 
              className={`offline-mode-button ${isOfflineMode ? 'active' : ''}`}
              onClick={toggleOfflineMode}
            >
              <i className={`fas ${isOfflineMode ? 'fa-wifi-slash' : 'fa-wifi'}`}></i>
              {translations.offlineModeButton}
            </button>
            <button className="contact-support-button">
              <i className="fas fa-headset"></i>
              {translations.contactSupportButton}
            </button>
            <button className="community-forum-button">
              <i className="fas fa-users"></i>
              {translations.communityForumButton}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchemeFinder;

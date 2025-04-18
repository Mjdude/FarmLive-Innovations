import React, { useState, useEffect } from 'react';
import { translateObject } from '../utils/translationService';
import { connectionData, opportunityNotifications } from '../data/connectionData';
import '../styles/ConnectionDashboard.css';

const ConnectionDashboard = ({ language = 'en' }) => {
  // State for connections and opportunities
  const [connections, setConnections] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [filteredConnections, setFilteredConnections] = useState([]);
  
  // State for filters and search
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [buyerTypeFilter, setBuyerTypeFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  
  // State for translations
  const [translations, setTranslations] = useState({
    title: "Connection Dashboard",
    subtitle: "Recent matches between farmers and buyers",
    search: "Search connections...",
    statusFilter: "Status",
    buyerTypeFilter: "Buyer Type",
    connectionsTitle: "Recent Connections",
    opportunitiesTitle: "New Opportunities",
    all: "All",
    completed: "Completed",
    inProgress: "In Progress",
    pending: "Pending",
    government: "Government",
    privateCompany: "Private Company",
    cooperative: "Cooperative",
    retailChain: "Retail Chain",
    farmer: "Farmer",
    buyer: "Buyer",
    cropType: "Crop",
    quantity: "Quantity",
    price: "Price",
    viewDetails: "View Details",
    contact: "Contact",
    newBadge: "NEW",
    deadline: "Deadline",
    applyNow: "Apply Now",
    saveForLater: "Save",
    noResults: "No connections found",
    noOpportunities: "No new opportunities"
  });
  
  // Load translations
  useEffect(() => {
    const defaultTranslations = {
      title: "Connection Dashboard",
      subtitle: "Recent matches between farmers and buyers",
      search: "Search connections...",
      statusFilter: "Status",
      buyerTypeFilter: "Buyer Type",
      connectionsTitle: "Recent Connections",
      opportunitiesTitle: "New Opportunities",
      all: "All",
      completed: "Completed",
      inProgress: "In Progress",
      pending: "Pending",
      government: "Government",
      privateCompany: "Private Company",
      cooperative: "Cooperative",
      retailChain: "Retail Chain",
      farmer: "Farmer",
      buyer: "Buyer",
      cropType: "Crop",
      quantity: "Quantity",
      price: "Price",
      viewDetails: "View Details",
      contact: "Contact",
      newBadge: "NEW",
      deadline: "Deadline",
      applyNow: "Apply Now",
      saveForLater: "Save",
      noResults: "No connections found",
      noOpportunities: "No new opportunities"
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
  
  // Load initial data
  useEffect(() => {
    // In a real app, this would be an API call
    setConnections(connectionData);
    setFilteredConnections(connectionData);
    setOpportunities(opportunityNotifications);
  }, []);
  
  // Apply filters and search
  useEffect(() => {
    let filtered = [...connections];
    
    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(conn => 
        conn.farmerName.toLowerCase().includes(term) ||
        conn.buyerName.toLowerCase().includes(term) ||
        conn.cropType.toLowerCase().includes(term) ||
        conn.farmerLocation.toLowerCase().includes(term) ||
        conn.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(conn => 
        conn.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }
    
    // Apply buyer type filter
    if (buyerTypeFilter !== 'all') {
      filtered = filtered.filter(conn => 
        conn.buyerType.toLowerCase() === buyerTypeFilter.toLowerCase()
      );
    }
    
    setFilteredConnections(filtered);
  }, [searchTerm, statusFilter, buyerTypeFilter, connections]);
  
  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Get status class
  const getStatusClass = (status) => {
    const statusLower = status.toLowerCase();
    if (statusLower === 'completed') return 'status-completed';
    if (statusLower === 'in progress') return 'status-in-progress';
    if (statusLower === 'pending') return 'status-pending';
    return '';
  };
  
  // Render star rating
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    return (
      <div className="rating-stars">
        {[...Array(fullStars)].map((_, i) => (
          <i key={`full-${i}`} className="fas fa-star"></i>
        ))}
        {halfStar && <i className="fas fa-star-half-alt"></i>}
        {[...Array(emptyStars)].map((_, i) => (
          <i key={`empty-${i}`} className="far fa-star"></i>
        ))}
      </div>
    );
  };
  
  return (
    <section id="connection-dashboard" className="connection-dashboard">
      <div className="dashboard-container">
        {/* Dashboard Header */}
        <div className="dashboard-header">
          <div className="dashboard-title">
            <h2><i className="fas fa-handshake"></i> {translations.title}</h2>
            <p>{translations.subtitle}</p>
          </div>
          
          <div className="dashboard-search">
            <input 
              type="text" 
              placeholder={translations.search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button><i className="fas fa-search"></i></button>
          </div>
        </div>
        
        {/* Filters */}
        <div className="dashboard-filters">
          <div className="dashboard-filter">
            <label>{translations.statusFilter}:</label>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">{translations.all}</option>
              <option value="completed">{translations.completed}</option>
              <option value="in progress">{translations.inProgress}</option>
              <option value="pending">{translations.pending}</option>
            </select>
          </div>
          
          <div className="dashboard-filter">
            <label>{translations.buyerTypeFilter}:</label>
            <select 
              value={buyerTypeFilter}
              onChange={(e) => setBuyerTypeFilter(e.target.value)}
            >
              <option value="all">{translations.all}</option>
              <option value="government">{translations.government}</option>
              <option value="private company">{translations.privateCompany}</option>
              <option value="cooperative">{translations.cooperative}</option>
              <option value="retail chain">{translations.retailChain}</option>
            </select>
          </div>
        </div>
        
        {/* Dashboard Content */}
        <div className="dashboard-content">
          {/* Connections List */}
          <div className={`connections-list ${viewMode === 'list' ? 'connections-list-view' : ''}`}>
            <div className="connections-header">
              <h3><i className="fas fa-exchange-alt"></i> {translations.connectionsTitle}</h3>
              <div className="view-options">
                <button 
                  className={`view-option ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                  aria-label="Grid View"
                >
                  <i className="fas fa-th"></i>
                </button>
                <button 
                  className={`view-option ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                  aria-label="List View"
                >
                  <i className="fas fa-list"></i>
                </button>
              </div>
            </div>
            
            {filteredConnections.length > 0 ? (
              <div className="connection-cards">
                {filteredConnections.map(connection => (
                  <div key={connection.id} className="connection-card fade-in">
                    <div className="connection-image">
                      <img src={connection.imageUrl} alt={connection.cropType} />
                      <div className={`connection-status ${getStatusClass(connection.status)}`}>
                        {connection.status}
                      </div>
                    </div>
                    
                    <div className="connection-details">
                      <div className="connection-title">
                        <h4>{connection.cropType}</h4>
                        <span className="connection-date">{formatDate(connection.date)}</span>
                      </div>
                      
                      <div className="connection-participants">
                        <div className="participant">
                          <i className="fas fa-user-alt"></i>
                          <span className="participant-name">{connection.farmerName}</span>
                          <span className="participant-type">{translations.farmer}</span>
                        </div>
                        
                        <div className="participant">
                          <i className="fas fa-building"></i>
                          <span className="participant-name">{connection.buyerName}</span>
                          <span className="participant-type">{connection.buyerType}</span>
                        </div>
                      </div>
                      
                      <div className="connection-crop">
                        <div className="crop-details">
                          <span className="crop-type">{connection.quantity}</span>
                          <span className="crop-price">{connection.price}</span>
                        </div>
                      </div>
                      
                      <div className="connection-tags">
                        {connection.tags.map((tag, index) => (
                          <span key={index} className="connection-tag">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="connection-actions">
                      <div className="connection-rating">
                        {renderStars(connection.rating)}
                        <span className="rating-value">{connection.rating}</span>
                      </div>
                      
                      <div className="connection-buttons">
                        <button className="connection-button">
                          <i className="fas fa-info-circle"></i> {translations.viewDetails}
                        </button>
                        <button className="connection-button">
                          <i className="fas fa-phone"></i> {translations.contact}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-results">
                <p>{translations.noResults}</p>
              </div>
            )}
          </div>
          
          {/* Opportunities Panel */}
          <div className="opportunities-panel">
            <div className="opportunities-header">
              <h3><i className="fas fa-bell"></i> {translations.opportunitiesTitle}</h3>
              <span className="opportunities-count">
                {opportunities.filter(opp => opp.isNew).length}
              </span>
            </div>
            
            <div className="opportunities-list">
              {opportunities.length > 0 ? (
                opportunities.map(opportunity => (
                  <div key={opportunity.id} className="opportunity-item fade-in">
                    {opportunity.isNew && (
                      <span className="opportunity-new-badge">
                        {translations.newBadge}
                      </span>
                    )}
                    
                    <h4 className="opportunity-title">{opportunity.title}</h4>
                    
                    <div className="opportunity-details">
                      <div className="opportunity-detail">
                        <i className="fas fa-building"></i>
                        <span className="opportunity-detail-label">{translations.buyer}:</span>
                        <span className="opportunity-detail-value">{opportunity.buyer}</span>
                      </div>
                      
                      <div className="opportunity-detail">
                        <i className="fas fa-seedling"></i>
                        <span className="opportunity-detail-label">{translations.cropType}:</span>
                        <span className="opportunity-detail-value">{opportunity.cropType}</span>
                      </div>
                      
                      <div className="opportunity-detail">
                        <i className="fas fa-weight"></i>
                        <span className="opportunity-detail-label">{translations.quantity}:</span>
                        <span className="opportunity-detail-value">{opportunity.quantity}</span>
                      </div>
                      
                      <div className="opportunity-detail">
                        <i className="fas fa-rupee-sign"></i>
                        <span className="opportunity-detail-label">{translations.price}:</span>
                        <span className="opportunity-detail-value">{opportunity.price}</span>
                      </div>
                    </div>
                    
                    <div className="opportunity-deadline">
                      <i className="fas fa-clock"></i>
                      <span>{translations.deadline}: {formatDate(opportunity.deadline)}</span>
                    </div>
                    
                    <div className="opportunity-actions">
                      <button className="opportunity-button">
                        {translations.applyNow}
                      </button>
                      <button className="opportunity-save">
                        <i className="far fa-bookmark"></i>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-opportunities">
                  <p>{translations.noOpportunities}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConnectionDashboard;

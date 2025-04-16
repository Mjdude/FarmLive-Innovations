import React, { useState, useEffect, useRef } from 'react';
import { translateText, translateObject } from '../utils/translationService';
import '../styles/NotificationCenter.css';
import { schemeNotificationData } from '../data/schemeNotificationData';

const NotificationCenter = ({ language = 'en', onClose }) => {
  // State for notifications
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('notifications');
  const [viewMode, setViewMode] = useState('default'); // 'default' or 'all-schemes'
  const [translations, setTranslations] = useState({
    title: 'Scheme Notifications',
    unreadNotifications: 'Unread Notifications',
    markAllRead: 'Mark All as Read',
    noNotifications: 'No new notifications',
    viewAll: 'View All',
    filterBy: 'Filter by:',
    priority: 'Priority',
    schemeType: 'Scheme Type',
    readStatus: 'Read Status',
    history: 'Notification History',
    eligibilityStatus: 'Eligibility Status',
    eligible: 'Eligible',
    potentiallyEligible: 'Potentially Eligible',
    notEligible: 'Not Eligible',
    highPriority: 'High Priority',
    mediumPriority: 'Medium Priority',
    lowPriority: 'Low Priority',
    all: 'All',
    read: 'Read',
    unread: 'Unread',
    dismiss: 'Dismiss',
    new: 'NEW',
    expiresIn: 'Expires in',
    days: 'days',
    hours: 'hours',
    minutes: 'minutes',
    viewDetails: 'View Details',
    apply: 'Apply Now',
    opportunities: 'New Opportunities',
    buyingOpportunities: 'Buying Opportunities',
    viewOpportunity: 'View Opportunity'
  });
  
  // Refs
  const notificationPanelRef = useRef(null);
  const toastContainerRef = useRef(null);
  const notificationItemRefs = useRef({});
  
  // Filter states
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [readFilter, setReadFilter] = useState('all');
  
  // Translate content
  useEffect(() => {
    const translateContent = async () => {
      if (language !== 'en') {
        const translatedContent = await translateObject(translations, language);
        setTranslations(translatedContent);
      }
    };
    
    translateContent();
  }, [language]);
  
  // Initialize with test data
  useEffect(() => {
    // Add timestamps and read status to notifications
    const initialNotifications = schemeNotificationData.map(notification => ({
      ...notification,
      timestamp: new Date().getTime() - Math.floor(Math.random() * 86400000 * 7), // Random time within past week
      read: false,
      id: Math.random().toString(36).substr(2, 9)
    }));
    
    setNotifications(initialNotifications);
    setUnreadCount(initialNotifications.length);
    
    // Simulate receiving new notifications periodically
    const notificationInterval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance of new notification
        const randomScheme = schemeNotificationData[Math.floor(Math.random() * schemeNotificationData.length)];
        const newNotification = {
          ...randomScheme,
          timestamp: new Date().getTime(),
          read: false,
          id: Math.random().toString(36).substr(2, 9)
        };
        
        setNotifications(prev => [newNotification, ...prev]);
        setUnreadCount(prev => prev + 1);
        showToastNotification(newNotification);
      }
    }, 60000); // Check every minute
    
    return () => clearInterval(notificationInterval);
  }, []);
  
  // Update countdown timers for time-sensitive notifications
  useEffect(() => {
    const timerInterval = setInterval(() => {
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => {
          if (notification.expiryDate) {
            const now = new Date().getTime();
            const expiryTime = new Date(notification.expiryDate).getTime();
            const timeRemaining = expiryTime - now;
            
            // If expired, mark as read and update status
            if (timeRemaining <= 0 && !notification.expired) {
              return { ...notification, expired: true, read: true };
            }
          }
          return notification;
        })
      );
    }, 60000); // Update every minute
    
    return () => clearInterval(timerInterval);
  }, []);
  
  // Calculate remaining time for countdown
  const calculateTimeRemaining = (expiryDate) => {
    if (!expiryDate) return null;
    
    const now = new Date().getTime();
    const expiryTime = new Date(expiryDate).getTime();
    const timeRemaining = expiryTime - now;
    
    if (timeRemaining <= 0) return { expired: true };
    
    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    
    return { days, hours, minutes, expired: false };
  };
  
  // Show toast notification
  const showToastNotification = (notification) => {
    if (!toastContainerRef.current) return;
    
    const toast = document.createElement('div');
    toast.className = `notification-toast priority-${notification.priority}`;
    
    toast.innerHTML = `
      <div class="toast-content">
        <div class="toast-icon">
          <i class="fas ${getPriorityIcon(notification.priority)}"></i>
        </div>
        <div class="toast-text">
          <h4>${notification.title}</h4>
          <p>${notification.message.substring(0, 60)}${notification.message.length > 60 ? '...' : ''}</p>
        </div>
        <button class="toast-close">×</button>
      </div>
    `;
    
    toastContainerRef.current.appendChild(toast);
    
    // Add animation class after a small delay to trigger animation
    setTimeout(() => {
      toast.classList.add('show');
    }, 10);
    
    // Close button functionality
    const closeButton = toast.querySelector('.toast-close');
    closeButton.addEventListener('click', () => {
      toast.classList.remove('show');
      setTimeout(() => {
        toast.remove();
      }, 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      if (toast.parentNode) {
        toast.classList.remove('show');
        setTimeout(() => {
          if (toast.parentNode) {
            toast.remove();
          }
        }, 300);
      }
    }, 5000);
  };
  
  // Get icon based on priority
  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high':
        return 'fa-exclamation-circle';
      case 'medium':
        return 'fa-bell';
      case 'low':
        return 'fa-info-circle';
      default:
        return 'fa-bell';
    }
  };
  
  // Format timestamp
  const getTimeAgo = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.round(diffMs / 60000);
    const diffHours = Math.round(diffMs / 3600000);
    const diffDays = Math.round(diffMs / 86400000);
    
    if (diffMins < 60) {
      return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };
  
  // Close notification panel when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationPanelRef.current && !notificationPanelRef.current.contains(event.target)) {
        handleClose();
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      setIsOpen(false);
    }
  };

  // Toggle notification panel
  const toggleNotificationPanel = () => {
    setIsOpen(!isOpen);
  };
  
  // Mark notification as read
  const markAsRead = (id) => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
    
    setUnreadCount(prevCount => Math.max(0, prevCount - 1));
  };
  
  // Dismiss notification
  const dismissNotification = (id) => {
    const notification = notifications.find(n => n.id === id);
    
    setNotifications(prevNotifications => 
      prevNotifications.filter(notification => notification.id !== id)
    );
    
    if (!notification.read) {
      setUnreadCount(prevCount => Math.max(0, prevCount - 1));
    }
  };
  
  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => ({ ...notification, read: true }))
    );
    
    setUnreadCount(0);
  };
  
  // Group notifications by scheme category
  const groupedNotifications = notifications.reduce((groups, notification) => {
    // Apply filters
    if (priorityFilter !== 'all' && notification.priority !== priorityFilter) return groups;
    if (typeFilter !== 'all' && notification.schemeType !== typeFilter) return groups;
    if (readFilter === 'read' && !notification.read) return groups;
    if (readFilter === 'unread' && notification.read) return groups;
    
    const category = notification.schemeType;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(notification);
    return groups;
  }, {});
  
  // Get all unique scheme types for filter
  const schemeTypes = [...new Set(notifications.map(n => n.schemeType))];
  
  // Get eligibility status counts
  const eligibilityStatus = notifications.reduce((status, notification) => {
    if (notification.eligibilityStatus === 'eligible') {
      status.eligible += 1;
    } else if (notification.eligibilityStatus === 'potentially') {
      status.potentially += 1;
    } else {
      status.notEligible += 1;
    }
    return status;
  }, { eligible: 0, potentially: 0, notEligible: 0 });
  
  // Render a single notification item
  const renderNotificationItem = (notification) => {
    const isUnread = !notification.read;
    const timeAgo = getTimeAgo(notification.timestamp);
    
    // Get scheme type class
    const getSchemeTypeClass = (type) => {
      const typeMap = {
        'Crop Insurance': 'crop-insurance',
        'Subsidy': 'subsidy',
        'Loan': 'loan',
        'Grant': 'grant',
        'Training': 'training'
      };
      return typeMap[type] || '';
    };
    
    return (
      <li 
        key={notification.id} 
        className={`notification-item ${isUnread ? 'unread' : 'read'}`}
        ref={notificationItemRefs.current[notification.id]}
      >
        <div className="notification-content">
          <div className="notification-icon">
            <i className={notification.icon || "fas fa-bell"}></i>
          </div>
          <div className="notification-text">
            <h4 className="notification-title">
              {notification.title}
              {isUnread && <span className="new-badge">{translations.new}</span>}
            </h4>
            
            {notification.schemeType && (
              <div className={`scheme-type-badge ${getSchemeTypeClass(notification.schemeType)}`}>
                <i className={
                  notification.schemeType === 'Crop Insurance' ? 'fas fa-shield-alt' :
                  notification.schemeType === 'Subsidy' ? 'fas fa-hand-holding-usd' :
                  notification.schemeType === 'Loan' ? 'fas fa-money-bill-wave' :
                  notification.schemeType === 'Grant' ? 'fas fa-gift' :
                  'fas fa-graduation-cap'
                }></i> {notification.schemeType}
              </div>
            )}
            
            <p className="notification-description">{notification.message}</p>
            
            {notification.eligibilityStatus && (
              <div className={`eligibility-badge ${notification.eligibilityStatus.toLowerCase()}`}>
                <i className={
                  notification.eligibilityStatus === 'Eligible' ? 'fas fa-check-circle' :
                  notification.eligibilityStatus === 'Potentially Eligible' ? 'fas fa-question-circle' :
                  'fas fa-times-circle'
                }></i> {notification.eligibilityStatus === 'Eligible' 
                  ? translations.eligible 
                  : notification.eligibilityStatus === 'Potentially Eligible' 
                    ? translations.potentiallyEligible 
                    : translations.notEligible}
              </div>
            )}
            
            {notification.expiryDate && (
              <div className="expiry-countdown">
                <i className="fas fa-clock"></i>
                {translations.expiresIn}: {getExpiryTime(notification.expiryDate)}
              </div>
            )}
            
            <div className="notification-buttons">
              <button className="view-details-button">
                <i className="fas fa-eye"></i> {translations.viewDetails}
              </button>
              {notification.eligibilityStatus !== 'Not Eligible' && (
                <button className="apply-button">
                  <i className="fas fa-check-circle"></i> {translations.apply}
                </button>
              )}
            </div>
          </div>
        </div>
        
        <div className="notification-meta">
          <span className="notification-time">{timeAgo}</span>
          <span className={`notification-priority priority-${notification.priority.toLowerCase()}`}>
            <i className={
              notification.priority === 'High' ? 'fas fa-exclamation-circle' :
              notification.priority === 'Medium' ? 'fas fa-exclamation' :
              'fas fa-info-circle'
            }></i> {notification.priority === 'High' 
              ? translations.highPriority 
              : notification.priority === 'Medium' 
                ? translations.mediumPriority 
                : translations.lowPriority}
          </span>
        </div>
      </li>
    );
  };
  
  // Group notifications by scheme type for "View All" mode
  const getSchemeTypeGroups = () => {
    const groups = {};
    
    notifications.forEach(notification => {
      if (notification.schemeType) {
        if (!groups[notification.schemeType]) {
          groups[notification.schemeType] = [];
        }
        groups[notification.schemeType].push(notification);
      } else {
        if (!groups['Other']) {
          groups['Other'] = [];
        }
        groups['Other'].push(notification);
      }
    });
    
    return groups;
  };
  
  // Toggle view mode between default and all-schemes
  const toggleViewMode = () => {
    setViewMode(viewMode === 'default' ? 'all-schemes' : 'default');
  };
  
  const opportunities = [
    {
      id: 1,
      title: 'Buy Wheat at ₹20/kg',
      description: 'Buy wheat at ₹20/kg from our trusted suppliers.',
      crop: 'Wheat',
      quantity: '1000 kg',
      price: '₹20/kg',
      deadline: '2023-03-15T14:30:00.000Z',
      isNew: true
    },
    {
      id: 2,
      title: 'Sell Rice at ₹25/kg',
      description: 'Sell rice at ₹25/kg to our trusted buyers.',
      crop: 'Rice',
      quantity: '500 kg',
      price: '₹25/kg',
      deadline: '2023-03-20T14:30:00.000Z',
      isNew: false
    }
  ];
  
  const getExpiryTime = (deadline) => {
    const now = new Date().getTime();
    const expiryTime = new Date(deadline).getTime();
    const timeRemaining = expiryTime - now;
    
    if (timeRemaining <= 0) return 'Expired';
    
    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${days} days, ${hours} hours, ${minutes} minutes`;
  };
  
  return (
    <div className="notification-center-container">
      {/* Toast container for popup notifications */}
      <div className="toast-container" ref={toastContainerRef}></div>
      
      <div className="notification-panel">
        <div className="notification-header">
          <h3>{translations.title}</h3>
          <span className="notification-count">{unreadCount} {translations.unreadNotifications}</span>
        </div>
        
        <div className="notification-tabs">
          <button 
            className={`tab-button ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('notifications');
              setViewMode('default');
            }}
          >
            <i className="fas fa-bell"></i> {translations.title}
          </button>
          <button 
            className={`tab-button ${activeTab === 'opportunities' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('opportunities');
              setViewMode('default');
            }}
          >
            <i className="fas fa-exchange-alt"></i> {translations.opportunities}
          </button>
        </div>
        
        {activeTab === 'notifications' && viewMode === 'default' && (
          <>
            <div className="notification-filters">
              <div className="filter-row">
                <div className="filter-select">
                  <label>{translations.priority}</label>
                  <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}>
                    <option value="all">{translations.all}</option>
                    <option value="high">{translations.highPriority}</option>
                    <option value="medium">{translations.mediumPriority}</option>
                    <option value="low">{translations.lowPriority}</option>
                  </select>
                </div>
                
                <div className="filter-select">
                  <label>{translations.schemeType}</label>
                  <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
                    <option value="all">{translations.all}</option>
                    <option value="Crop Insurance">Crop Insurance</option>
                    <option value="Subsidy">Subsidy</option>
                    <option value="Loan">Loan</option>
                    <option value="Grant">Grant</option>
                  </select>
                </div>
                
                <div className="filter-select">
                  <label>{translations.readStatus}</label>
                  <select value={readFilter} onChange={e => setReadFilter(e.target.value)}>
                    <option value="all">{translations.all}</option>
                    <option value="read">{translations.read}</option>
                    <option value="unread">{translations.unread}</option>
                  </select>
                </div>
              </div>
              
              <div className="filter-actions">
                <button className="mark-all-read" onClick={markAllAsRead}>
                  <i className="fas fa-check-double"></i> {translations.markAllRead}
                </button>
              </div>
            </div>
            
            <ul className="notification-list">
              {Object.keys(groupedNotifications).length === 0 ? (
                <div className="no-notifications">{translations.noNotifications}</div>
              ) : (
                Object.entries(groupedNotifications).map(([category, categoryNotifications]) => (
                  <div key={category} className="notification-category">
                    <h4 className="category-title">{category}</h4>
                    {categoryNotifications.map(notification => renderNotificationItem(notification))}
                  </div>
                ))
              )}
            </ul>
          </>
        )}
        
        {activeTab === 'notifications' && viewMode === 'all-schemes' && (
          <div className="all-schemes-view">
            <div className="all-schemes-header">
              <button className="back-button" onClick={() => setViewMode('default')}>
                <i className="fas fa-arrow-left"></i> Back
              </button>
              <h3>All Schemes by Type</h3>
            </div>
            
            {Object.entries(getSchemeTypeGroups()).map(([schemeType, schemeNotifications]) => (
              <div key={schemeType} className="scheme-type-group">
                <div className={`scheme-type-header ${schemeType.toLowerCase().replace(/\s+/g, '-')}`}>
                  <i className={
                    schemeType === 'Crop Insurance' ? 'fas fa-shield-alt' :
                    schemeType === 'Subsidy' ? 'fas fa-hand-holding-usd' :
                    schemeType === 'Loan' ? 'fas fa-money-bill-wave' :
                    schemeType === 'Grant' ? 'fas fa-gift' :
                    schemeType === 'Training' ? 'fas fa-graduation-cap' :
                    'fas fa-bell'
                  }></i>
                  <h4>{schemeType}</h4>
                  <span className="scheme-count">{schemeNotifications.length}</span>
                </div>
                
                <ul className="scheme-list">
                  {schemeNotifications.map(notification => renderNotificationItem(notification))}
                </ul>
              </div>
            ))}
          </div>
        )}
        
        {activeTab === 'opportunities' && (
          <div className="opportunities-container">
            <div className="opportunities-header">
              <h4>{translations.buyingOpportunities}</h4>
            </div>
            <ul className="opportunities-list">
              {opportunities.length === 0 ? (
                <div className="no-opportunities">{translations.noNotifications}</div>
              ) : (
                opportunities.map(opportunity => (
                  <li key={opportunity.id} className="opportunity-item">
                    <div className="opportunity-content">
                      <div className="opportunity-icon">
                        <i className="fas fa-shopping-cart"></i>
                      </div>
                      <div className="opportunity-text">
                        <h4 className="opportunity-title">
                          {opportunity.title}
                          {opportunity.isNew && <span className="new-badge">{translations.new}</span>}
                        </h4>
                        <p className="opportunity-description">{opportunity.description}</p>
                        <div className="opportunity-details">
                          <span className="opportunity-crop"><i className="fas fa-seedling"></i> {opportunity.crop}</span>
                          <span className="opportunity-quantity"><i className="fas fa-weight"></i> {opportunity.quantity}</span>
                          <span className="opportunity-price"><i className="fas fa-rupee-sign"></i> {opportunity.price}</span>
                        </div>
                        {opportunity.deadline && (
                          <div className="expiry-countdown">
                            <i className="fas fa-clock"></i> {translations.expiresIn}: {getExpiryTime(opportunity.deadline)}
                          </div>
                        )}
                        <div className="opportunity-buttons">
                          <button className="view-details-button">
                            <i className="fas fa-eye"></i> {translations.viewOpportunity}
                          </button>
                          <button className="apply-button">
                            <i className="fas fa-check-circle"></i> {translations.apply}
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        )}
        
        <div className="notification-footer">
          {activeTab === 'notifications' && viewMode === 'default' && (
            <button className="view-all-button" onClick={toggleViewMode}>
              {translations.viewAll} <i className="fas fa-arrow-right"></i>
            </button>
          )}
          {activeTab === 'opportunities' && (
            <button className="view-all-button">
              {translations.viewAll} <i className="fas fa-arrow-right"></i>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter;

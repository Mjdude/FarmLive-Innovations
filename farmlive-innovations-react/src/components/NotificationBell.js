import React, { useState, useEffect } from 'react';
import '../styles/UtilityControls.css';

const NotificationBell = ({ onClick, notificationCount = 0 }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Animate the bell when new notifications arrive
  useEffect(() => {
    if (notificationCount > 0) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [notificationCount]);
  
  return (
    <div className="notification-bell-container">
      <button 
        className={`notification-bell ${isAnimating ? 'animate' : ''}`} 
        onClick={onClick}
        aria-label={`Notifications ${notificationCount > 0 ? `(${notificationCount} new)` : ''}`}
      >
        <i className="fas fa-bell"></i>
        {notificationCount > 0 && (
          <span className="notification-badge">{notificationCount > 99 ? '99+' : notificationCount}</span>
        )}
      </button>
    </div>
  );
};

export default NotificationBell;

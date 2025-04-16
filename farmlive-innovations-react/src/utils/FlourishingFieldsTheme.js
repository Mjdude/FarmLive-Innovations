/**
 * Flourishing Fields Theme
 * Implements the agricultural theme with animations and transitions
 */

// Number of decorative elements to create
const NUM_CROPS = 8;
const NUM_CREATURES = 5;
const NUM_RAINDROPS = 50;
const NUM_CROP_ROWS = 6;

/**
 * Initialize the Flourishing Fields theme
 */
export const initFlourishingFieldsTheme = () => {
  // If theme is already active, don't reinitialize
  if (document.body.classList.contains('flourishing-fields-theme')) {
    return;
  }
  
  // Add theme class to body
  document.body.classList.add('flourishing-fields-theme');
  
  // Create decorative elements - with a slight delay to prevent layout thrashing
  setTimeout(() => {
    createCropDecorations();
    setTimeout(() => {
      createFlyingCreatures();
      setTimeout(() => {
        createRainContainer();
        createPageTransitionContainer();
        initSeasonalChanges(); // Add seasonal changes
      }, 100);
    }, 100);
  }, 100);
  
  // Initialize scroll reveal
  initScrollReveal();
  
  // Reposition the scheme finder button
  repositionSchemeFinderButton();
  
  // Initialize form animations
  initFormAnimations();
  
  // Initialize card/panel animations
  initCardAnimations();
  
  // Initialize accessibility features
  initAccessibilityFeatures();
  
  console.log('Flourishing Fields theme initialized');
};

/**
 * Remove the Flourishing Fields theme
 */
export const removeFlourishingFieldsTheme = () => {
  // Remove theme class from body
  document.body.classList.remove('flourishing-fields-theme');
  
  // Remove decorative elements
  removeDecorations();
  
  // Restore scheme finder button position
  restoreSchemeFinderButton();
  
  console.log('Flourishing Fields theme removed');
};

/**
 * Create swaying crop decorations
 */
const createCropDecorations = () => {
  // Check if container already exists to prevent duplicates
  if (document.querySelector('.crop-decorations-container')) {
    return;
  }
  
  const container = document.createElement('div');
  container.className = 'crop-decorations-container';
  container.style.position = 'fixed';
  container.style.top = '0';
  container.style.left = '0';
  container.style.width = '100%';
  container.style.height = '100%';
  container.style.pointerEvents = 'none';
  container.style.zIndex = '-5'; // Lower z-index to ensure it stays behind content
  
  // Distribute crops evenly along the bottom edge
  for (let i = 0; i < NUM_CROPS; i++) {
    const crop = document.createElement('div');
    crop.className = 'crop-decoration';
    // More evenly distributed positioning
    crop.style.left = `${(i / NUM_CROPS * 100) + (Math.random() * 10 - 5)}%`;
    crop.style.bottom = '0';
    container.appendChild(crop);
  }
  
  document.body.appendChild(container);
};

/**
 * Create flying creatures (butterflies/birds)
 */
const createFlyingCreatures = () => {
  // Check if container already exists to prevent duplicates
  if (document.querySelector('.flying-creatures-container')) {
    return;
  }
  
  // Create 3-5 flying creatures (reduced for better performance)
  const creatureCount = Math.floor(Math.random() * 3) + 3;
  
  for (let i = 0; i < creatureCount; i++) {
    const creature = document.createElement('div');
    creature.className = 'flying-creature';
    
    // Randomize starting position
    // Ensure creatures are distributed across different areas of the screen
    const sectionWidth = 100 / creatureCount;
    const startX = (i * sectionWidth) + (Math.random() * (sectionWidth * 0.7));
    const startY = 10 + (i % 3) * 25 + (Math.random() * 15); // Distribute at different heights
    
    // Randomize animation duration and delay
    const duration = 20 + Math.random() * 15; // 20-35s for slower, less distracting movement
    const delay = Math.random() * 8; // Random delay up to 8s
    
    creature.style.left = `${startX}%`;
    creature.style.top = `${startY}%`;
    creature.style.animationDuration = `${duration}s`;
    creature.style.animationDelay = `${delay}s`;
    
    document.body.appendChild(creature);
  }
};

/**
 * Create rain container and raindrops
 */
const createRainContainer = () => {
  // Check if container already exists to prevent duplicates
  if (document.querySelector('.rain-container')) {
    return;
  }
  
  const container = document.createElement('div');
  container.className = 'rain-container';
  
  for (let i = 0; i < NUM_RAINDROPS; i++) {
    const raindrop = document.createElement('div');
    raindrop.className = 'raindrop';
    raindrop.style.left = `${Math.random() * 100}%`;
    raindrop.style.animationDelay = `${Math.random() * 1}s`;
    raindrop.style.animationDuration = `${0.5 + Math.random() * 0.5}s`;
    container.appendChild(raindrop);
  }
  
  document.body.appendChild(container);
  
  // Occasionally show rainfall animation - but don't start immediately
  setTimeout(() => {
    const rainInterval = setInterval(() => {
      // Only show rain if no modals are open
      const modalOpen = document.querySelector('.multimedia-assistant-overlay, .scheme-finder-overlay, .map-modal-overlay');
      if (!modalOpen && Math.random() < 0.1) { // 10% chance every interval
        showRainfall();
      }
      
      // Clear interval if theme is removed
      if (!document.body.classList.contains('flourishing-fields-theme')) {
        clearInterval(rainInterval);
      }
    }, 60000); // Check every 60 seconds (reduced frequency)
  }, 30000); // Start after 30 seconds
};

/**
 * Show rainfall animation for a short period
 */
const showRainfall = () => {
  const rainContainer = document.querySelector('.rain-container');
  if (rainContainer) {
    // Don't show rain if any modals are open
    const modalOpen = document.querySelector('.multimedia-assistant-overlay, .scheme-finder-overlay, .map-modal-overlay');
    if (modalOpen) return;
    
    rainContainer.classList.add('active');
    setTimeout(() => {
      rainContainer.classList.remove('active');
    }, 8000); // Show rain for 8 seconds (slightly shorter)
  }
};

/**
 * Create page transition container with crop rows
 */
const createPageTransitionContainer = () => {
  // Check if container already exists to prevent duplicates
  if (document.querySelector('.page-transition-container')) {
    return;
  }
  
  const container = document.createElement('div');
  container.className = 'page-transition-container';
  container.style.position = 'fixed';
  container.style.top = '0';
  container.style.left = '0';
  container.style.width = '100%';
  container.style.height = '100%';
  container.style.pointerEvents = 'none';
  container.style.zIndex = '9999';
  container.style.display = 'none';
  
  // Create crop rows for transition effect
  for (let i = 0; i < NUM_CROP_ROWS; i++) {
    const row = document.createElement('div');
    row.className = 'crop-row';
    row.style.position = 'absolute';
    row.style.left = '0';
    row.style.right = '0';
    row.style.height = `${100 / NUM_CROP_ROWS}%`;
    row.style.top = `${(i / NUM_CROP_ROWS) * 100}%`;
    row.style.backgroundColor = 'var(--ff-fresh-green)';
    row.style.transform = 'translateX(-100%)';
    row.style.transition = 'transform 0.5s ease-in-out';
    row.style.transitionDelay = `${i * 0.05}s`;
    
    container.appendChild(row);
  }
  
  document.body.appendChild(container);
};

/**
 * Initialize scroll reveal animations
 */
const initScrollReveal = () => {
  // Add scroll-reveal class to sections if not already added
  const sections = document.querySelectorAll('.container > section');
  sections.forEach(section => {
    if (!section.classList.contains('scroll-reveal')) {
      section.classList.add('scroll-reveal');
    }
  });
  
  // Create intersection observer for scroll animations if not already created
  if (!window.ffScrollObserver) {
    window.ffScrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, {
      threshold: 0.1 // Trigger when 10% of the element is visible
    });
    
    // Observe all sections
    sections.forEach(section => {
      window.ffScrollObserver.observe(section);
    });
  }
};

/**
 * Remove all decorative elements
 */
const removeDecorations = () => {
  // Remove crop decorations
  const cropContainer = document.querySelector('.crop-decorations-container');
  if (cropContainer) {
    document.body.removeChild(cropContainer);
  }
  
  // Remove flying creatures
  const creatures = document.querySelectorAll('.flying-creature');
  creatures.forEach(creature => {
    document.body.removeChild(creature);
  });
  
  // Remove rain container
  const rainContainer = document.querySelector('.rain-container');
  if (rainContainer) {
    document.body.removeChild(rainContainer);
  }
  
  // Remove page transition container
  const transitionContainer = document.querySelector('.page-transition-container');
  if (transitionContainer) {
    document.body.removeChild(transitionContainer);
  }
};

/**
 * Reposition the scheme finder button
 */
const repositionSchemeFinderButton = () => {
  // Check if a fixed button already exists
  if (document.querySelector('.scheme-finder-fixed-button')) {
    return;
  }
  
  // Find the scheme finder button in the navigation
  const navButton = document.querySelector('.scheme-finder-button');
  if (!navButton) {
    console.warn('Scheme finder button not found in navigation');
    return;
  }
  
  // Create a fixed position button
  const fixedButton = document.createElement('button');
  fixedButton.className = 'scheme-finder-fixed-button scheme-finder-button';
  fixedButton.innerHTML = navButton.innerHTML;
  fixedButton.setAttribute('aria-label', 'Open Farmer Scheme Finder');
  
  // Add pulsing glow effect
  fixedButton.style.animation = 'pulseGlow 2s infinite';
  
  // Add click event listener
  fixedButton.addEventListener('click', () => {
    // Trigger the original button's click event
    navButton.click();
  });
  
  // Add hover plant growth animation
  fixedButton.addEventListener('mouseenter', () => {
    const icon = fixedButton.querySelector('i');
    if (icon) {
      icon.style.transform = 'scale(1.2)';
    }
    
    // Create and show the growing plant effect
    const plantEffect = document.createElement('div');
    plantEffect.className = 'plant-growth-effect';
    plantEffect.style.position = 'absolute';
    plantEffect.style.bottom = '-20px';
    plantEffect.style.left = '50%';
    plantEffect.style.transform = 'translateX(-50%)';
    plantEffect.style.width = '20px';
    plantEffect.style.height = '20px';
    plantEffect.style.backgroundColor = 'var(--ff-leaf)';
    plantEffect.style.clipPath = 'polygon(50% 0%, 0% 100%, 100% 100%)';
    plantEffect.style.transition = 'height 0.3s ease';
    
    fixedButton.appendChild(plantEffect);
    
    // Animate the plant growth
    setTimeout(() => {
      plantEffect.style.height = '20px';
    }, 10);
  });
  
  fixedButton.addEventListener('mouseleave', () => {
    const icon = fixedButton.querySelector('i');
    if (icon) {
      icon.style.transform = '';
    }
    
    // Remove the plant growth effect
    const plantEffect = fixedButton.querySelector('.plant-growth-effect');
    if (plantEffect) {
      plantEffect.style.height = '0';
      setTimeout(() => {
        if (plantEffect.parentNode === fixedButton) {
          fixedButton.removeChild(plantEffect);
        }
      }, 300);
    }
  });
  
  // Append to body
  document.body.appendChild(fixedButton);
};

/**
 * Restore the scheme finder button to its original position
 */
const restoreSchemeFinderButton = () => {
  // Remove the fixed position button
  const fixedButton = document.querySelector('.scheme-finder-fixed-button');
  if (fixedButton) {
    document.body.removeChild(fixedButton);
  }
  
  // Restore the original button's visibility
  const navButton = document.querySelector('.scheme-finder-button');
  if (navButton) {
    navButton.style.display = '';
  }
};

/**
 * Initialize form animations
 */
const initFormAnimations = () => {
  // Add submit event listeners to forms
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    // Skip if already initialized
    if (form.dataset.ffAnimInitialized) return;
    
    form.dataset.ffAnimInitialized = 'true';
    form.addEventListener('submit', (e) => {
      // Add animation class
      form.classList.add('form-submitted');
      
      // Remove class after animation completes
      setTimeout(() => {
        form.classList.remove('form-submitted');
      }, 1000);
    });
  });
};

/**
 * Initialize card/panel animations
 */
const initCardAnimations = () => {
  // Add hover animations to cards and panels
  const cards = document.querySelectorAll('.card, .panel');
  cards.forEach(card => {
    // Skip if already initialized
    if (card.dataset.ffAnimInitialized) return;
    
    card.dataset.ffAnimInitialized = 'true';
    
    // Add seed packet opening animation on hover
    card.addEventListener('mouseenter', () => {
      card.classList.add('card-hover');
    });
    
    card.addEventListener('mouseleave', () => {
      card.classList.remove('card-hover');
    });
  });
};

/**
 * Initialize seasonal changes
 */
const initSeasonalChanges = () => {
  // Get current month to determine season
  const month = new Date().getMonth();
  let season = 'spring';
  
  // 0-2: Winter, 3-5: Spring, 6-8: Summer, 9-11: Fall
  if (month >= 0 && month <= 2) {
    season = 'winter';
  } else if (month >= 3 && month <= 5) {
    season = 'spring';
  } else if (month >= 6 && month <= 8) {
    season = 'summer';
  } else {
    season = 'fall';
  }
  
  // Add season class to body
  document.body.classList.add(`ff-season-${season}`);
  
  // Apply seasonal color adjustments
  const root = document.documentElement;
  
  switch (season) {
    case 'winter':
      root.style.setProperty('--ff-sky-blue', '#d0e6ff');
      root.style.setProperty('--ff-fresh-green', '#3a6349');
      root.style.setProperty('--ff-wheat', '#e8e0d0');
      break;
    case 'spring':
      root.style.setProperty('--ff-sky-blue', '#a5d8ff');
      root.style.setProperty('--ff-fresh-green', '#4a7c59');
      root.style.setProperty('--ff-wheat', '#f5deb3');
      break;
    case 'summer':
      root.style.setProperty('--ff-sky-blue', '#87cefa');
      root.style.setProperty('--ff-fresh-green', '#5a8c69');
      root.style.setProperty('--ff-wheat', '#f8e4c3');
      break;
    case 'fall':
      root.style.setProperty('--ff-sky-blue', '#b8d8f0');
      root.style.setProperty('--ff-fresh-green', '#3d6b4c');
      root.style.setProperty('--ff-wheat', '#e8d0a3');
      break;
  }
  
  console.log(`Seasonal theme applied: ${season}`);
};

/**
 * Initialize accessibility features
 */
const initAccessibilityFeatures = () => {
  // Create accessibility controls if they don't exist
  if (document.querySelector('.ff-accessibility-controls')) {
    return;
  }
  
  const container = document.createElement('div');
  container.className = 'ff-accessibility-controls';
  container.style.position = 'fixed';
  container.style.bottom = '20px';
  container.style.left = '20px';
  container.style.zIndex = '1000';
  container.style.display = 'flex';
  container.style.gap = '10px';
  
  // High contrast mode toggle
  const contrastButton = document.createElement('button');
  contrastButton.className = 'ff-accessibility-button';
  contrastButton.innerHTML = '<i class="fas fa-adjust"></i>';
  contrastButton.setAttribute('aria-label', 'Toggle high contrast mode');
  contrastButton.title = 'Toggle high contrast mode';
  
  contrastButton.addEventListener('click', () => {
    document.body.classList.toggle('high-contrast');
  });
  
  // Reduced motion toggle
  const motionButton = document.createElement('button');
  motionButton.className = 'ff-accessibility-button';
  motionButton.innerHTML = '<i class="fas fa-running"></i>';
  motionButton.setAttribute('aria-label', 'Toggle reduced motion');
  motionButton.title = 'Toggle reduced motion';
  
  motionButton.addEventListener('click', () => {
    document.body.classList.toggle('reduced-motion');
  });
  
  // Add buttons to container
  container.appendChild(contrastButton);
  container.appendChild(motionButton);
  
  // Append to body
  document.body.appendChild(container);
  
  // Check user preferences
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.body.classList.add('reduced-motion');
  }
  
  console.log('Accessibility features initialized');
};

/**
 * Show page transition animation
 * @param {Function} callback - Function to call after transition completes
 */
export const showPageTransition = (callback) => {
  const container = document.querySelector('.page-transition-container');
  if (!container) {
    console.warn('Page transition container not found');
    if (callback) callback();
    return;
  }
  
  // Show container
  container.style.display = 'block';
  
  // Get all crop rows
  const rows = container.querySelectorAll('.crop-row');
  
  // Animate rows in
  rows.forEach(row => {
    row.style.transform = 'translateX(0)';
  });
  
  // After rows are fully in, animate them out
  setTimeout(() => {
    rows.forEach(row => {
      row.style.transform = 'translateX(100%)';
    });
    
    // After rows are fully out, hide container and call callback
    setTimeout(() => {
      container.style.display = 'none';
      
      // Reset rows for next transition
      setTimeout(() => {
        rows.forEach(row => {
          row.style.transform = 'translateX(-100%)';
        });
      }, 100);
      
      if (callback) callback();
    }, 600); // Slightly longer than the transition duration
  }, 600); // Slightly longer than the transition duration
};

/**
 * Show water flow animation on an element
 * @param {HTMLElement} element - Element to show water flow on
 */
export const showWaterFlow = (element) => {
  if (!element) return;
  
  // Create water flow container
  const container = document.createElement('div');
  container.className = 'water-flow-container';
  container.style.position = 'absolute';
  container.style.top = '0';
  container.style.left = '0';
  container.style.width = '100%';
  container.style.height = '100%';
  container.style.overflow = 'hidden';
  container.style.pointerEvents = 'none';
  container.style.zIndex = '1';
  
  // Create water flow effect
  const water = document.createElement('div');
  water.className = 'water-flow';
  water.style.position = 'absolute';
  water.style.top = '0';
  water.style.left = '0';
  water.style.width = '100%';
  water.style.height = '100%';
  water.style.background = 'linear-gradient(to bottom, rgba(165, 216, 255, 0.8), rgba(165, 216, 255, 0))';
  water.style.transform = 'translateY(-100%)';
  water.style.animation = 'waterFlow 2s ease-in-out forwards';
  
  container.appendChild(water);
  element.appendChild(container);
  
  // Remove after animation completes
  setTimeout(() => {
    if (container.parentNode === element) {
      element.removeChild(container);
    }
  }, 2000);
};

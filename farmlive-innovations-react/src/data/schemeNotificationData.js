/**
 * Test data for the scheme notification system
 * Contains various scheme types with different eligibility criteria, priorities, and expiry dates
 */

export const schemeNotificationData = [
  // Crop Insurance Schemes
  {
    title: "Pradhan Mantri Fasal Bima Yojana Enrollment Open",
    message: "The enrollment window for PMFBY crop insurance is now open. Based on your profile, you are eligible for premium subsidies on wheat, rice, and cotton crops. Apply before the deadline to secure coverage for the upcoming season.",
    schemeType: "Crop Insurance",
    priority: "high",
    eligibilityStatus: "eligible",
    expiryDate: "2025-05-15T23:59:59", // One month from now
    eligibilityCriteria: {
      landSize: "0.5-10 hectares",
      crops: ["wheat", "rice", "cotton"],
      requiredDocuments: ["land records", "identity proof", "bank account details"]
    }
  },
  {
    title: "Weather-Based Crop Insurance Available",
    message: "A new weather-based crop insurance scheme has been launched for farmers in drought-prone regions. Your farm location indicates you may qualify for this coverage with reduced premiums.",
    schemeType: "Crop Insurance",
    priority: "medium",
    eligibilityStatus: "potentially",
    expiryDate: "2025-06-30T23:59:59", // Two months from now
    eligibilityCriteria: {
      region: "drought-prone areas",
      rainfall: "less than 700mm annually",
      requiredDocuments: ["land records", "weather station data"]
    }
  },

  // Subsidy Schemes
  {
    title: "Fertilizer Subsidy Increased for Organic Inputs",
    message: "The government has increased subsidies for organic fertilizers by 25%. As an organic farmer, you qualify for the enhanced subsidy rate of ₹2,000 per hectare. Visit your local agriculture office to claim this benefit.",
    schemeType: "Subsidy",
    priority: "high",
    eligibilityStatus: "eligible",
    expiryDate: "2025-05-01T23:59:59", // Two weeks from now
    eligibilityCriteria: {
      farmingType: "organic",
      certification: "required",
      minimumLandSize: "0.1 hectares"
    }
  },
  {
    title: "Seed Subsidy for Climate-Resilient Varieties",
    message: "New subsidy available for climate-resilient seed varieties. Based on your crop patterns, you could save up to 40% on certified seeds for the next planting season.",
    schemeType: "Subsidy",
    priority: "medium",
    eligibilityStatus: "potentially",
    expiryDate: null, // No expiry
    eligibilityCriteria: {
      crops: ["millets", "pulses", "oilseeds"],
      region: "rain-fed areas",
      requiredDocuments: ["farmer ID", "land records"]
    }
  },

  // Loan Schemes
  {
    title: "Kisan Credit Card Renewal Alert",
    message: "Your Kisan Credit Card is due for renewal next month. Renew now to continue accessing credit at subsidized interest rates and avoid any interruption in your farming operations.",
    schemeType: "Credit & Loans",
    priority: "high",
    eligibilityStatus: "eligible",
    expiryDate: "2025-05-10T23:59:59", // About three weeks from now
    eligibilityCriteria: {
      existingCustomer: true,
      creditHistory: "good",
      requiredDocuments: ["KCC card", "bank statements", "identity proof"]
    }
  },
  {
    title: "Agricultural Infrastructure Fund Loans",
    message: "Low-interest loans are available for building farm storage facilities. Your farming profile suggests you might benefit from improved storage infrastructure.",
    schemeType: "Credit & Loans",
    priority: "low",
    eligibilityStatus: "potentially",
    expiryDate: "2025-07-31T23:59:59", // About three months from now
    eligibilityCriteria: {
      purpose: "storage infrastructure",
      landHolding: "minimum 1 hectare",
      requiredDocuments: ["project proposal", "land records", "income proof"]
    }
  },

  // Equipment & Technology Schemes
  {
    title: "Farm Mechanization Subsidy Available",
    message: "You qualify for a 50% subsidy on small farm equipment purchases including power tillers and irrigation pumps. This is based on your land holding size and current mechanization level.",
    schemeType: "Equipment & Technology",
    priority: "medium",
    eligibilityStatus: "eligible",
    expiryDate: "2025-06-15T23:59:59", // About two months from now
    eligibilityCriteria: {
      landSize: "1-5 hectares",
      currentMechanization: "low",
      farmerCategory: "small/marginal"
    }
  },
  {
    title: "Solar Irrigation Pump Scheme",
    message: "The solar pump subsidy scheme has been expanded. Your irrigation needs and sunlight availability in your region make you a good candidate for this eco-friendly option.",
    schemeType: "Equipment & Technology",
    priority: "medium",
    eligibilityStatus: "potentially",
    expiryDate: null, // No expiry
    eligibilityCriteria: {
      irrigationNeeds: "medium to high",
      sunlightAvailability: "good",
      gridConnectivity: "poor to moderate"
    }
  },

  // Training & Skill Development
  {
    title: "Digital Farming Workshop Registration",
    message: "A free workshop on digital farming tools will be conducted in your district next week. Learn about soil sensors, weather forecasting apps, and online marketplaces for better farm management.",
    schemeType: "Training & Development",
    priority: "low",
    eligibilityStatus: "eligible",
    expiryDate: "2025-04-25T18:00:00", // About 9 days from now
    eligibilityCriteria: {
      location: "within 50km of workshop venue",
      farmingExperience: "any",
      requiredItems: ["smartphone or tablet"]
    }
  },
  {
    title: "Organic Certification Training Program",
    message: "Based on your interest in organic farming, you may want to join the upcoming certification training program. This will help you access premium markets and higher prices for your produce.",
    schemeType: "Training & Development",
    priority: "low",
    eligibilityStatus: "potentially",
    expiryDate: "2025-05-20T23:59:59", // About a month from now
    eligibilityCriteria: {
      farmingPractices: "chemical-free or transitioning",
      commitment: "3-year minimum",
      requiredDocuments: ["land records", "current farming practices declaration"]
    }
  },

  // Market Linkage Schemes
  {
    title: "E-NAM Registration Now Simplified",
    message: "The electronic National Agriculture Market (e-NAM) registration process has been simplified. Your crops have high demand on the platform, potentially fetching 15-20% higher prices than local markets.",
    schemeType: "Market Linkage",
    priority: "high",
    eligibilityStatus: "eligible",
    expiryDate: null, // No expiry
    eligibilityCriteria: {
      crops: ["commercial crops", "vegetables", "fruits"],
      quality: "graded produce",
      requiredDocuments: ["bank account", "identity proof", "land records"]
    }
  },
  {
    title: "Export Promotion Scheme for Organic Products",
    message: "Your organic farm produce may qualify for the export promotion scheme. This includes certification assistance, packaging subsidies, and international market linkages.",
    schemeType: "Market Linkage",
    priority: "medium",
    eligibilityStatus: "potentially",
    expiryDate: "2025-08-31T23:59:59", // About four months from now
    eligibilityCriteria: {
      certification: "organic certified",
      productionVolume: "minimum 5 tons annually",
      quality: "export grade"
    }
  },

  // Not eligible examples
  {
    title: "Large Irrigation Project Funding",
    message: "Funding is available for large-scale irrigation projects covering 50+ hectares. Based on your land holding, you do not qualify for this scheme, but you may form a farmer group to apply collectively.",
    schemeType: "Irrigation",
    priority: "low",
    eligibilityStatus: "not-eligible",
    expiryDate: null, // No expiry
    eligibilityCriteria: {
      projectSize: "minimum 50 hectares",
      investmentCapacity: "high",
      beneficiaries: "multiple farmers"
    }
  },
  {
    title: "Commercial Greenhouse Subsidy",
    message: "Subsidies for commercial polyhouse/greenhouse construction are available. Your current farming profile indicates you're focused on open field cultivation and may not benefit from this scheme.",
    schemeType: "Infrastructure",
    priority: "low",
    eligibilityStatus: "not-eligible",
    expiryDate: "2025-09-30T23:59:59", // About five months from now
    eligibilityCriteria: {
      cropType: "high-value vegetables/flowers",
      technicalKnowledge: "advanced",
      investmentCapacity: "medium to high"
    }
  }
];

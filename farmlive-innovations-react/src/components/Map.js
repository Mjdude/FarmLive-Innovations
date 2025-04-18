import React, { useEffect, useState, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { translateObject, translateText } from '../utils/translationService';
import { mapsAPI, agriCensusAPI } from '../utils/apiService';

const Map = ({ language, open, onClose }) => {
  const [translations, setTranslations] = useState({
    title: "Land Ownership Details",
    selectLocation: "Select a location on the map to view details.",
    noData: "No land details available for the selected location.",
    clickForDetails: "Click for details",
    owner: "Owner",
    male: "Male",
    female: "Female",
    institutions: "Institutions",
    total: "Total",
    area: "Area",
    hectares: "hectares"
  });
  
  const [landInfo, setLandInfo] = useState("Select a location on the map to view details.");
  const [landData, setLandData] = useState({});
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [mapApiKey, setMapApiKey] = useState("");
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [translatedMarkerName, setTranslatedMarkerName] = useState("");
  
  // Map configuration
  const mapContainerStyle = {
    width: '100%',
    height: '400px'
  };
  
  const center = {
    lat: 12.9716,
    lng: 77.5946  // Centered on Bangalore
  };
  
  // Taluk markers data with coordinates
  const taluks = [
    { name: 'Heggadadevanakote', position: { lat: 12.5080, lng: 76.4630 } },
    { name: 'Hirekerur', position: { lat: 14.6050, lng: 75.7630 } },
    { name: 'Hiriyur', position: { lat: 13.6300, lng: 76.5230 } },
    { name: 'Holalkere', position: { lat: 13.6460, lng: 76.5770 } },
    { name: 'Holenarasipura', position: { lat: 12.6780, lng: 76.9730 } },
    { name: 'Mysuru', position: { lat: 12.2958, lng: 76.6394 } },
    { name: 'Nagamangala', position: { lat: 12.8215, lng: 76.7546 } },
    { name: 'Nanjangud', position: { lat: 12.1225, lng: 76.6833 } },
    { name: 'Naragund', position: { lat: 15.7232, lng: 75.3860 } },
    { name: 'Navalgund', position: { lat: 15.5589, lng: 75.3701 } }
  ];
  
  // Fetch API key on component mount
  useEffect(() => {
    setMapApiKey(mapsAPI.getApiKey());
  }, []);
  
  // Fetch simulated census data
  const fetchCensusData = useCallback(async () => {
    // In a real app, we would fetch actual data from the Census API
    // For this app, we'll simulate the data
    try {
      // Optional: Try to fetch real data if API is available
      const realData = await agriCensusAPI.getLandCensusData('Mysuru', 'Mysuru');
      
      if (realData && realData.records && realData.records.length > 0) {
        // If real data is available, format and use it
        const formattedData = {};
        realData.records.forEach(record => {
          if (!formattedData[record.district]) {
            formattedData[record.district] = {};
          }
          // Format data according to your needs
          // This would need to be adapted to the actual API response structure
        });
        setLandData(formattedData);
      } else {
        // Fallback to simulated data
        const simulatedData = {
          'Mysuru': {
            'Medium Agricultural Land Holders _4to10 Hectares_ST_Numbers_Male': '450',
            'Medium Agricultural Land Holders _4to10 Hectares_ST_Numbers_Female': '120',
            'Medium Agricultural Land Holders _4to10 Hectares_ST_Numbers_Institutions': '15',
            'Medium Agricultural Land Holders _4to10 Hectares_ST_Numbers_Total': '585',
            'Medium Agricultural Land Holders _4to10 Hectares_ST_Area_Male': '2150',
            'Medium Agricultural Land Holders _4to10 Hectares _ST_Area_Female': '540',
            'Medium Agricultural Land Holders _4to10 Hectares_ST_Area_Institutions': '75',
            'Medium Agricultural Land Holders _4to10 Hectares_ST_Area_Total': '2765'
          },
          'Nanjangud': {
            'Medium Agricultural Land Holders _4to10 Hectares_ST_Numbers_Male': '320',
            'Medium Agricultural Land Holders _4to10 Hectares_ST_Numbers_Female': '95',
            'Medium Agricultural Land Holders _4to10 Hectares_ST_Numbers_Institutions': '10',
            'Medium Agricultural Land Holders _4to10 Hectares_ST_Numbers_Total': '425',
            'Medium Agricultural Land Holders _4to10 Hectares_ST_Area_Male': '1850',
            'Medium Agricultural Land Holders _4to10 Hectares _ST_Area_Female': '430',
            'Medium Agricultural Land Holders _4to10 Hectares_ST_Area_Institutions': '55',
            'Medium Agricultural Land Holders _4to10 Hectares_ST_Area_Total': '2335'
          }
        };
        
        // Add some data for the remaining taluks
        taluks.forEach(taluk => {
          if (!simulatedData[taluk.name]) {
            simulatedData[taluk.name] = {
              'Medium Agricultural Land Holders _4to10 Hectares_ST_Numbers_Male': Math.floor(Math.random() * 500 + 100).toString(),
              'Medium Agricultural Land Holders _4to10 Hectares_ST_Numbers_Female': Math.floor(Math.random() * 200 + 50).toString(),
              'Medium Agricultural Land Holders _4to10 Hectares_ST_Numbers_Institutions': Math.floor(Math.random() * 20 + 5).toString(),
              'Medium Agricultural Land Holders _4to10 Hectares_ST_Numbers_Total': Math.floor(Math.random() * 700 + 200).toString(),
              'Medium Agricultural Land Holders _4to10 Hectares_ST_Area_Male': Math.floor(Math.random() * 2500 + 1000).toString(),
              'Medium Agricultural Land Holders _4to10 Hectares _ST_Area_Female': Math.floor(Math.random() * 800 + 200).toString(),
              'Medium Agricultural Land Holders _4to10 Hectares_ST_Area_Institutions': Math.floor(Math.random() * 100 + 20).toString(),
              'Medium Agricultural Land Holders _4to10 Hectares_ST_Area_Total': Math.floor(Math.random() * 3500 + 1500).toString(),
            };
          }
        });
        
        setLandData(simulatedData);
      }
    } catch (error) {
      console.error('Error fetching census data:', error);
      // Fallback to empty data
      setLandData({});
    }
  }, []);
  
  // Display land details for a selected taluk
  const displayLandDetails = useCallback(async (talukName) => {
    const data = landData[talukName];
    
    if (!data) {
      setLandInfo(translations.noData);
      return;
    }
    // Use translations for all dynamic labels
    const landInfoText = `
      ${translations.owner}: ${translations.male}: ${data['Medium Agricultural Land Holders _4to10 Hectares_ST_Numbers_Male']}, 
      ${translations.female}: ${data['Medium Agricultural Land Holders _4to10 Hectares_ST_Numbers_Female']}, 
      ${translations.institutions}: ${data['Medium Agricultural Land Holders _4to10 Hectares_ST_Numbers_Institutions']}, 
      ${translations.total}: ${data['Medium Agricultural Land Holders _4to10 Hectares_ST_Numbers_Total']}<br>
      ${translations.area}: ${translations.male}: ${data['Medium Agricultural Land Holders _4to10 Hectares_ST_Area_Male']} ${translations.hectares}, 
      ${translations.female}: ${data['Medium Agricultural Land Holders _4to10 Hectares _ST_Area_Female']} ${translations.hectares}, 
      ${translations.institutions}: ${data['Medium Agricultural Land Holders _4to10 Hectares_ST_Area_Institutions']} ${translations.hectares}, 
      ${translations.total}: ${data['Medium Agricultural Land Holders _4to10 Hectares_ST_Area_Total']} ${translations.hectares}
    `;
    setLandInfo(landInfoText);
  }, [landData, translations]);
  
  // Handle marker click
  const handleMarkerClick = useCallback(async (taluk) => {
    console.log('Marker clicked:', taluk.name); // Debug log
    setSelectedMarker(taluk);
    displayLandDetails(taluk.name);
    if (language !== 'en') {
      try {
        const translated = await translateText(taluk.name, language);
        setTranslatedMarkerName(translated);
      } catch {
        setTranslatedMarkerName(taluk.name);
      }
    } else {
      setTranslatedMarkerName(taluk.name);
    }
  }, [displayLandDetails, language]);
  
  // Handle map load
  const handleMapLoad = useCallback(() => {
    setIsMapLoaded(true);
  }, []);
  
  // Load translations and data
  useEffect(() => {
    const defaultTranslations = {
      title: "Land Ownership Details",
      selectLocation: "Select a location on the map to view details.",
      noData: "No land details available for the selected location.",
      clickForDetails: "Click for details"
    };
    
    async function translateContent() {
      try {
        let currentTranslations;
        if (language !== 'en') {
          currentTranslations = await translateObject(defaultTranslations, language);
          setTranslations(currentTranslations);
          setLandInfo(currentTranslations.selectLocation);
        } else {
          currentTranslations = defaultTranslations;
          setTranslations(currentTranslations);
          setLandInfo(defaultTranslations.selectLocation);
        }
      } catch (error) {
        console.error('Translation error:', error);
      }
    }

    translateContent();
    fetchCensusData();
  }, [language, fetchCensusData]);

  if (!open) return null;
  if (!mapApiKey) {
    return <div style={{color: 'red'}}>Google Maps API key is missing or invalid. Please check your configuration.</div>;
  }

  return (
    <div className="map-modal-overlay">
      <div className="map-modal">
        <button className="map-modal-close" onClick={onClose} title="Close">&times;</button>
        <h2>{translations.title}</h2>
        <LoadScript googleMapsApiKey={mapApiKey} onLoad={handleMapLoad}>
          <div id="map" className="map-container">
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={center}
              zoom={7}
            >
              {taluks.map(taluk => (
                <Marker
                  key={taluk.name}
                  position={taluk.position}
                  onClick={() => handleMarkerClick(taluk)}
                />
              ))}
              {selectedMarker && (
                <InfoWindow
                  position={selectedMarker.position}
                  onCloseClick={() => setSelectedMarker(null)}
                >
                  <div>
                    <h3>{language !== 'en' ? translatedMarkerName : selectedMarker.name}</h3>
                    <p>{translations.clickForDetails}</p>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          </div>
        </LoadScript>
        <div id="land-details" className="land-details">
          <p id="land-info" dangerouslySetInnerHTML={{ __html: landInfo }}></p>
        </div>
      </div>
    </div>
  );
};

export default Map;
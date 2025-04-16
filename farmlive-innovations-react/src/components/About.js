import React, { useEffect, useState } from 'react';
import { translateObject } from '../utils/translationService';

const About = ({ language }) => {
  const [translations, setTranslations] = useState({
    title: "Transforming Agriculture",
    description: "We combine cutting-edge AI technology with traditional farming wisdom to help farmers make better decisions, increase yields, and promote sustainable agriculture. Our solutions are designed specifically for small and marginal farmers, making advanced farming techniques accessible to all.",
    farmersHelped: "Farmers Helped",
    yieldIncrease: "Yield Increase",
    districtsCovered: "Districts Covered"
  });

  useEffect(() => {
    const defaultTranslations = {
      title: "Transforming Agriculture",
      description: "We combine cutting-edge AI technology with traditional farming wisdom to help farmers make better decisions, increase yields, and promote sustainable agriculture. Our solutions are designed specifically for small and marginal farmers, making advanced farming techniques accessible to all.",
      farmersHelped: "Farmers Helped",
      yieldIncrease: "Yield Increase",
      districtsCovered: "Districts Covered"
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

  return (
    <section id="about" className="card about-card">
      <h2>{translations.title}</h2>
      <p>{translations.description}</p>
      
      <div className="stats-container">
        <div className="stat-item">
          <div className="stat-number">10,000+</div>
          <div>{translations.farmersHelped}</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">30%</div>
          <div>{translations.yieldIncrease}</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">25+</div>
          <div>{translations.districtsCovered}</div>
        </div>
      </div>
    </section>
  );
};

export default About;
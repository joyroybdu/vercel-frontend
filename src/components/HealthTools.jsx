import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/HealthTool.css';

const HealthTools = () => {
  const navigate = useNavigate();
  const toolsGridRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const tools = [
    {
      title: "BMR Calculator",
      description: "Calculate your Basal Metabolic Rate to understand your calorie needs.",
      icon: "📊",
      path: "/bmr"
    },
    {
      title: "Calorie Tracker",
      description: "Track your daily calorie intake and maintain a balanced diet.",
      icon: "🔥",
      path: "/calorie-tracker"
    },
   
  
    {
      title: "Meal Planner",
      description: "Plan your meals according to your nutritional needs.",
      icon: "🍽️",
      path: "/meal-planner"
    },
    {
      title: "BMR Calculator",
      description: "Calculate your Basal Metabolic Rate for weight management.",
      icon: "⚡",
      path: "/bmr"
    },
    {
      title: "Body Fat Calculator",
      description: "Estimate your body fat percentage with various methods.",
      icon: "🔍",
      path: "/body-fat"
    }
  ];

  const handleToolClick = (path) => {
    navigate(path);
  };

  const scrollLeft = () => {
    if (toolsGridRef.current) {
      toolsGridRef.current.scrollBy({ left: -300, behavior: 'smooth' });
      updateArrowVisibility();
    }
  };

  const scrollRight = () => {
    if (toolsGridRef.current) {
      toolsGridRef.current.scrollBy({ left: 300, behavior: 'smooth' });
      updateArrowVisibility();
    }
  };

  const updateArrowVisibility = () => {
    if (toolsGridRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = toolsGridRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  return (
    <div className="health-tools">
      <h2 className="tools-title">Fitness Tools</h2>
      <p className="tools-subtitle">Explore our collection of health and fitness calculators</p>
      
      <div className="tools-container">
        {showLeftArrow && (
          <button className="scroll-arrow left-arrow" onClick={scrollLeft}>
            &#8249;
          </button>
        )}
        
        <div className="tools-grid" ref={toolsGridRef} onScroll={updateArrowVisibility}>
          {tools.map((tool, index) => (
            <div 
              key={index} 
              className="glass-card"
              onClick={() => handleToolClick(tool.path)}
            >
              <div className="card-icon">{tool.icon}</div>
              <h3 className="card-title">{tool.title}</h3>
              <p className="card-description">{tool.description}</p>
              <button className="card-button">Explore</button>
            </div>
          ))}
        </div>

        {showRightArrow && (
          <button className="scroll-arrow right-arrow" onClick={scrollRight}>
            &#8250;
          </button>
        )}
      </div>
    </div>
  );
};

export default HealthTools;
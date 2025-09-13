import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/DailyPlanner.css';

const DailyPlanner = () => {
  const navigate = useNavigate();
  const toolsGridRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const tools = [
    {
      title: "Task Manager",
      description: "Organize your daily tasks and boost your productivity.",
      icon: "✅",
      path: "/task-manager"
    },
      {
      title: "Notes & Ideas",
      description: "Capture your thoughts, ideas, and important notes.",
      icon: "📝",
      path: "/notes"
    },
      {
      title: "Pomodoro Timer",
      description: "Boost your productivity with the Pomodoro Technique.",
      icon: "🍅",
      path: "/pomodoro"
    },
    // {
    //   title: "Money Management",
    //   description: "Track expenses and manage your budget effectively.",
    //   icon: "💰",
    //   path: "/money-management"
    // }
  ,
   
    {
      title: "Habit Builder",
      description: "Build positive habits and break negative ones.",
      icon: "🔁",
      path: "/habits"
    },
  
  
   
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
    <div className="daily-planner">
      <h2 className="planner-title">Daily Productivity Tools</h2>
      <p className="planner-subtitle">Everything you need to organize your day and boost productivity</p>
      
      <div className="planner-container">
        {showLeftArrow && (
          <button className="scroll-arrow left-arrow" onClick={scrollLeft}>
            &#8249;
          </button>
        )}
        
        <div className="tools-grid" ref={toolsGridRef} onScroll={updateArrowVisibility}>
          {tools.map((tool, index) => (
            <div 
              key={index} 
              className="neo-card"
              onClick={() => handleToolClick(tool.path)}
            >
              <div className="card-glow"></div>
              <div className="card-content">
                <div className="card-icon">{tool.icon}</div>
                <h3 className="card-title">{tool.title}</h3>
                <p className="card-description">{tool.description}</p>
                <button className="card-button">
                  <span>Explore</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
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

export default DailyPlanner;

// BMICalculator.jsx
import React, { useState } from 'react';
import '../css/BMI.css';

const BMICalculator = () => {
  const [inputs, setInputs] = useState({
    gender: 'male',
    height: '',
    weight: '',
    unit: 'metric', // metric or imperial
    age: ''
  });
  
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateBMI = () => {
    // Reset previous results
    setResult(null);
    setError('');
    
    // Validate inputs
    const { height, weight, unit } = inputs;
    
    if (!height || !weight) {
      setError('Please fill in all required fields');
      return;
    }
    
    // Convert inputs to numbers
    const h = parseFloat(height);
    const w = parseFloat(weight);
    
    let bmi;
    let heightMeters, weightKg;
    
    if (unit === 'metric') {
      // Metric: kg and cm
      heightMeters = h / 100; // convert cm to meters
      weightKg = w;
    } else {
      // Imperial: lbs and inches
      heightMeters = h * 0.0254; // convert inches to meters
      weightKg = w * 0.453592; // convert lbs to kg
    }
    
    // Calculate BMI: weight (kg) / height (m) squared
    bmi = weightKg / (heightMeters * heightMeters);
    
    // Determine category
    let category = '';
    let categoryColor = '';
    
    if (bmi < 18.5) {
      category = 'Underweight';
      categoryColor = '#3498db';
    } else if (bmi < 25) {
      category = 'Normal weight';
      categoryColor = '#2ecc71';
    } else if (bmi < 30) {
      category = 'Overweight';
      categoryColor = '#f39c12';
    } else {
      category = 'Obesity';
      categoryColor = '#e74c3c';
    }
    
    setResult({
      value: bmi.toFixed(1),
      category,
      categoryColor
    });
  };

  const resetForm = () => {
    setInputs({
      gender: 'male',
      height: '',
      weight: '',
      unit: 'metric',
      age: ''
    });
    setResult(null);
    setError('');
  };

  return (
    <div className="bmi-calculator">
      <h1>BMI Calculator</h1>
      <p className="description">
        Calculate your Body Mass Index to understand your weight category.
      </p>
      
      <div className="calculator-container">
        <div className="input-section">
          <h2>Your Measurements</h2>
          
          <div className="input-group">
            <label>Unit System</label>
            <div className="unit-selector">
              <button 
                type="button"
                className={inputs.unit === 'metric' ? 'active' : ''}
                onClick={() => setInputs({...inputs, unit: 'metric'})}
              >
                Metric (kg, cm)
              </button>
              <button 
                type="button"
                className={inputs.unit === 'imperial' ? 'active' : ''}
                onClick={() => setInputs({...inputs, unit: 'imperial'})}
              >
                Imperial (lbs, inches)
              </button>
            </div>
          </div>
          
          <div className="input-group">
            <label>Gender</label>
            <div className="gender-selector">
              <button 
                type="button"
                className={inputs.gender === 'male' ? 'active' : ''}
                onClick={() => setInputs({...inputs, gender: 'male'})}
              >
                Male
              </button>
              <button 
                type="button"
                className={inputs.gender === 'female' ? 'active' : ''}
                onClick={() => setInputs({...inputs, gender: 'female'})}
              >
                Female
              </button>
            </div>
          </div>
          
          <div className="input-group">
            <label htmlFor="age">Age (years)</label>
            <input
              type="number"
              id="age"
              name="age"
              value={inputs.age}
              onChange={handleInputChange}
              min="2"
              max="120"
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="height">
              {inputs.unit === 'metric' ? 'Height (cm)' : 'Height (inches)'}
            </label>
            <input
              type="number"
              id="height"
              name="height"
              value={inputs.height}
              onChange={handleInputChange}
              min={inputs.unit === 'metric' ? '50' : '20'}
              max={inputs.unit === 'metric' ? '250' : '100'}
              step="0.1"
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="weight">
              {inputs.unit === 'metric' ? 'Weight (kg)' : 'Weight (lbs)'}
            </label>
            <input
              type="number"
              id="weight"
              name="weight"
              value={inputs.weight}
              onChange={handleInputChange}
              min={inputs.unit === 'metric' ? '5' : '10'}
              max={inputs.unit === 'metric' ? '300' : '600'}
              step="0.1"
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <div className="button-group">
            <button 
              type="button" 
              className="calculate-btn"
              onClick={calculateBMI}
            >
              Calculate BMI
            </button>
            <button 
              type="button" 
              className="reset-btn"
              onClick={resetForm}
            >
              Reset
            </button>
          </div>
        </div>
        
        <div className="result-section">
          <h2>Your Results</h2>
          
          {result ? (
            <>
              <div className="result-card" style={{ borderColor: result.categoryColor }}>
                <div className="result-main">
                  <span className="bmi-value">{result.value}</span>
                  <span className="label">BMI</span>
                </div>
                
                <div className="result-details">
                  <div className="detail-item">
                    <span 
                      className="value" 
                      style={{ color: result.categoryColor }}
                    >
                      {result.category}
                    </span>
                    <span className="label">Category</span>
                  </div>
                </div>
              </div>
              
              <div className="bmi-chart">
                <h3>BMI Categories</h3>
                <div className="chart">
                  <div className="chart-bar">
                    <div className="chart-scale">
                      <span>16</span>
                      <span>18.5</span>
                      <span>25</span>
                      <span>30</span>
                      <span>40</span>
                    </div>
                    <div className="chart-visual">
                      <div 
                        className="chart-marker" 
                        style={{ 
                          left: `${((result.value - 16) / (40 - 16)) * 100}%`,
                          color: result.categoryColor
                        }}
                      >
                        <div className="marker-dot" style={{ backgroundColor: result.categoryColor }}></div>
                        <div className="marker-label">You</div>
                      </div>
                      <div className="chart-range underweight">Underweight</div>
                      <div className="chart-range normal">Normal</div>
                      <div className="chart-range overweight">Overweight</div>
                      <div className="chart-range obese">Obese</div>
                    </div>
                  </div>
                </div>
                
                <div className="category-info">
                  <div className="category-item">
                    <span className="color-dot" style={{ backgroundColor: '#3498db' }}></span>
                    <span className="category-name">Underweight</span>
                    <span className="category-range">&lt; 18.5</span>
                  </div>
                  <div className="category-item">
                    <span className="color-dot" style={{ backgroundColor: '#2ecc71' }}></span>
                    <span className="category-name">Normal weight</span>
                    <span className="category-range">18.5 - 24.9</span>
                  </div>
                  <div className="category-item">
                    <span className="color-dot" style={{ backgroundColor: '#f39c12' }}></span>
                    <span className="category-name">Overweight</span>
                    <span className="category-range">25 - 29.9</span>
                  </div>
                  <div className="category-item">
                    <span className="color-dot" style={{ backgroundColor: '#e74c3c' }}></span>
                    <span className="category-name">Obesity</span>
                    <span className="category-range">≥ 30</span>
                  </div>
                </div>
              </div>
              
              <div className="interpretation">
                <h3>What Your Result Means</h3>
                <p>
                  Your BMI is <strong>{result.value}</strong>, which is categorized as <strong style={{ color: result.categoryColor }}>{result.category}</strong>. 
                  {result.category === 'Underweight' && ' You may need to gain weight for optimal health.'}
                  {result.category === 'Normal weight' && ' Your weight is in a healthy range for your height.'}
                  {result.category === 'Overweight' && ' You may benefit from losing some weight to improve your health.'}
                  {result.category === 'Obesity' && ' Weight loss is recommended to reduce health risks.'}
                </p>
                <p className="disclaimer">
                  Note: BMI is a screening tool, not a direct measure of body fat. Athletes may have a high BMI due to muscle mass.
                </p>
              </div>
            </>
          ) : (
            <div className="placeholder">
              <p>Enter your measurements and click "Calculate BMI" to see your results</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BMICalculator;

// BodyFatCalculator.jsx
import React, { useState } from 'react';
import '../css/BodyFatCalculator.css';

const BodyFatCalculator = () => {
  const [inputs, setInputs] = useState({
    gender: 'male',
    height: '',
    weight: '',
    neck: '',
    waist: '',
    hips: '',
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

  const calculateBodyFat = () => {
    // Reset previous results
    setResult(null);
    setError('');
    
    // Validate inputs
    const { gender, height, weight, neck, waist, hips, age } = inputs;
    
    if (!height || !weight || !neck || !waist || (gender === 'female' && !hips) || !age) {
      setError('Please fill in all required fields');
      return;
    }
    
    // Convert inputs to numbers
    const h = parseFloat(height);
    const n = parseFloat(neck);
    const w = parseFloat(waist);
    const hip = parseFloat(hips) || 0;
    const ageNum = parseFloat(age);
    
    let bodyFatPercentage;
    
    if (gender === 'male') {
      // Formula for males: 86.010 * log10(waist - neck) - 70.041 * log10(height) + 36.76
      bodyFatPercentage = 86.010 * Math.log10(w - n) - 70.041 * Math.log10(h) + 36.76;
    } else {
      // Formula for females: 163.205 * log10(waist + hips - neck) - 97.684 * log10(height) - 78.387
      bodyFatPercentage = 163.205 * Math.log10(w + hip - n) - 97.684 * Math.log10(h) - 78.387;
    }
    
    // Calculate BMI
    const weightKg = parseFloat(weight) * 0.453592; // Convert lbs to kg
    const heightM = h * 0.0254; // Convert inches to meters
    const bmi = weightKg / (heightM * heightM);
    
    // Determine category based on gender and age
    let category = '';
    if (gender === 'male') {
      if (bodyFatPercentage < 6) category = 'Essential Fat';
      else if (bodyFatPercentage < 14) category = 'Athletic';
      else if (bodyFatPercentage < 18) category = 'Fitness';
      else if (bodyFatPercentage < 25) category = 'Average';
      else category = 'Obese';
    } else {
      if (bodyFatPercentage < 14) category = 'Essential Fat';
      else if (bodyFatPercentage < 21) category = 'Athletic';
      else if (bodyFatPercentage < 25) category = 'Fitness';
      else if (bodyFatPercentage < 32) category = 'Average';
      else category = 'Obese';
    }
    
    setResult({
      percentage: bodyFatPercentage.toFixed(1),
      bmi: bmi.toFixed(1),
      category
    });
  };

  const resetForm = () => {
    setInputs({
      gender: 'male',
      height: '',
      weight: '',
      neck: '',
      waist: '',
      hips: '',
      age: ''
    });
    setResult(null);
    setError('');
  };

  return (
    <div className="body-fat-calculator">
      <h1>Body Fat Calculator</h1>
      <p className="description">
        Calculate your body fat percentage using the U.S. Navy method. 
        Enter your measurements below to get started.
      </p>
      
      <div className="calculator-container">
        <div className="input-section">
          <h2>Your Measurements</h2>
          
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
              min="18"
              max="100"
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="height">Height (inches)</label>
            <input
              type="number"
              id="height"
              name="height"
              value={inputs.height}
              onChange={handleInputChange}
              min="48"
              max="96"
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="weight">Weight (lbs)</label>
            <input
              type="number"
              id="weight"
              name="weight"
              value={inputs.weight}
              onChange={handleInputChange}
              min="50"
              max="500"
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="neck">Neck Circumference (inches)</label>
            <input
              type="number"
              id="neck"
              name="neck"
              value={inputs.neck}
              onChange={handleInputChange}
              min="10"
              max="30"
              step="0.1"
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="waist">Waist Circumference (inches)</label>
            <input
              type="number"
              id="waist"
              name="waist"
              value={inputs.waist}
              onChange={handleInputChange}
              min="20"
              max="70"
              step="0.1"
            />
            <span className="help-text">Measure at the navel for men, at the narrowest point for women</span>
          </div>
          
          {inputs.gender === 'female' && (
            <div className="input-group">
              <label htmlFor="hips">Hip Circumference (inches)</label>
              <input
                type="number"
                id="hips"
                name="hips"
                value={inputs.hips}
                onChange={handleInputChange}
                min="30"
                max="70"
                step="0.1"
              />
              <span className="help-text">Measure at the widest point</span>
            </div>
          )}
          
          {error && <div className="error-message">{error}</div>}
          
          <div className="button-group">
            <button 
              type="button" 
              className="calculate-btn"
              onClick={calculateBodyFat}
            >
              Calculate Body Fat
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
              <div className="result-card">
                <div className="result-main">
                  <span className="percentage">{result.percentage}%</span>
                  <span className="label">Body Fat Percentage</span>
                </div>
                
                <div className="result-details">
                  <div className="detail-item">
                    <span className="value">{result.bmi}</span>
                    <span className="label">BMI</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="value">{result.category}</span>
                    <span className="label">Category</span>
                  </div>
                </div>
              </div>
              
              <div className="body-fat-chart">
                <h3>Body Fat Categories</h3>
                <div className="chart">
                  <div className="chart-bar">
                    <div className="chart-scale">
                      <span>0%</span>
                      <span>10%</span>
                      <span>20%</span>
                      <span>30%</span>
                      <span>40%</span>
                    </div>
                    <div className="chart-visual">
                      <div className={`chart-marker ${inputs.gender}`} style={{ left: `${result.percentage}%` }}>
                        <div className="marker-dot"></div>
                        <div className="marker-label">You</div>
                      </div>
                      <div className="chart-range essential">Essential</div>
                      <div className="chart-range athletic">Athletic</div>
                      <div className="chart-range fitness">Fitness</div>
                      <div className="chart-range average">Average</div>
                      <div className="chart-range obese">Obese</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="interpretation">
                <h3>What Your Result Means</h3>
                <p>
                  Based on your age and gender, your body fat percentage falls into the <strong>{result.category}</strong> category. 
                  Maintaining a healthy body fat percentage reduces your risk for health problems and improves overall wellness.
                </p>
              </div>
            </>
          ) : (
            <div className="placeholder">
              <p>Enter your measurements and click "Calculate Body Fat" to see your results</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BodyFatCalculator;

import React, { useState } from 'react';
import '../css/BMR.css';

const BMRCalculator = () => {
  const [gender, setGender] = useState('male');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [bmr, setBmr] = useState(null);

  const calculateBMR = () => {
    if (!weight || !height || !age) {
      alert('Please fill all fields');
      return;
    }

    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);
    const ageNum = parseFloat(age);

    let calculatedBMR;
    if (gender === 'male') {
      calculatedBMR = 66 + (13.7 * weightNum) + (5 * heightNum) - (6.8 * ageNum);
    } else {
      calculatedBMR = 655 + (9.6 * weightNum) + (1.8 * heightNum) - (4.7 * ageNum);
    }

    setBmr(calculatedBMR.toFixed(2));
  };

  const resetForm = () => {
    setGender('male');
    setWeight('');
    setHeight('');
    setAge('');
    setBmr(null);
  };

  return (
    <div className="bmr-calculator">
      <h1>Basal Metabolic Rate Calculator</h1>
      <p className="description">
        Your Basal Metabolic Rate (BMR) is the number of calories your body needs to perform basic life-sustaining functions.
      </p>
      
      <div className="calculator-container">
        <div className="input-section">
          <h2>Enter Your Details</h2>
          
          <div className="input-group">
            <label htmlFor="gender">Gender</label>
            <select 
              id="gender" 
              value={gender} 
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          
          <div className="input-group">
            <label htmlFor="weight">Weight (kg)</label>
            <input
              id="weight"
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Enter weight in kg"
              min="0"
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="height">Height (cm)</label>
            <input
              id="height"
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="Enter height in cm"
              min="0"
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="age">Age (years)</label>
            <input
              id="age"
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Enter age in years"
              min="0"
            />
          </div>
          
          <div className="button-group">
            <button className="calculate-btn" onClick={calculateBMR}>
              Calculate BMR
            </button>
            <button className="reset-btn" onClick={resetForm}>
              Reset
            </button>
          </div>
        </div>
        
        <div className="result-section">
          <h2>Your BMR Result</h2>
          {bmr ? (
            <div className="result">
              <div className="bmr-value">{bmr} calories/day</div>
              <p>This is how many calories your body needs at rest.</p>
              
              <div className="activity-levels">
                <h3>Daily Calorie Needs Based on Activity Level</h3>
                <div className="activity">
                  <span>Sedentary (little or no exercise)</span>
                  <span>{(bmr * 1.2).toFixed(2)} calories</span>
                </div>
                <div className="activity">
                  <span>Lightly active (light exercise 1-3 days/week)</span>
                  <span>{(bmr * 1.375).toFixed(2)} calories</span>
                </div>
                <div className="activity">
                  <span>Moderately active (moderate exercise 3-5 days/week)</span>
                  <span>{(bmr * 1.55).toFixed(2)} calories</span>
                </div>
                <div className="activity">
                  <span>Very active (hard exercise 6-7 days/week)</span>
                  <span>{(bmr * 1.725).toFixed(2)} calories</span>
                </div>
                <div className="activity">
                  <span>Extra active (very hard exercise, physical job)</span>
                  <span>{(bmr * 1.9).toFixed(2)} calories</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="placeholder">
              <p>Enter your information and click "Calculate BMR" to see your results.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BMRCalculator;
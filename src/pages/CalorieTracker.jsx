import { useState, useEffect } from 'react';
import '../css/calorietracker.css';

const CalorieTracker = () => {
  const [foodEntries, setFoodEntries] = useState([]);
  const [dailyGoal, setDailyGoal] = useState(2000);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [newGoal, setNewGoal] = useState(dailyGoal);
  const [foodForm, setFoodForm] = useState({
    name: '',
    calories: '',
    mealType: 'breakfast'
  });
  const [editingId, setEditingId] = useState(null);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedEntries = localStorage.getItem('calorieEntries');
    const savedGoal = localStorage.getItem('calorieGoal');
    
    if (savedEntries) {
      setFoodEntries(JSON.parse(savedEntries));
    }
    
    if (savedGoal) {
      setDailyGoal(parseInt(savedGoal));
      setNewGoal(parseInt(savedGoal));
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('calorieEntries', JSON.stringify(foodEntries));
  }, [foodEntries]);

  useEffect(() => {
    localStorage.setItem('calorieGoal', dailyGoal.toString());
  }, [dailyGoal]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFoodForm({
      ...foodForm,
      [name]: value
    });
  };

  const handleGoalChange = (e) => {
    setNewGoal(parseInt(e.target.value) || 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!foodForm.name || !foodForm.calories) return;
    
    const caloriesValue = parseInt(foodForm.calories);
    
    if (editingId !== null) {
      // Update existing entry
      setFoodEntries(foodEntries.map(entry => 
        entry.id === editingId 
          ? { ...foodForm, calories: caloriesValue, id: editingId }
          : entry
      ));
      setEditingId(null);
    } else {
      // Add new entry
      const newEntry = {
        id: Date.now(),
        name: foodForm.name,
        calories: caloriesValue,
        mealType: foodForm.mealType
      };
      setFoodEntries([...foodEntries, newEntry]);
    }
    
    // Reset form
    setFoodForm({
      name: '',
      calories: '',
      mealType: 'breakfast'
    });
  };

  const handleEdit = (id) => {
    const entryToEdit = foodEntries.find(entry => entry.id === id);
    if (entryToEdit) {
      setFoodForm({
        name: entryToEdit.name,
        calories: entryToEdit.calories.toString(),
        mealType: entryToEdit.mealType
      });
      setEditingId(id);
    }
  };

  const handleDelete = (id) => {
    setFoodEntries(foodEntries.filter(entry => entry.id !== id));
  };

  const updateDailyGoal = () => {
    if (newGoal > 0) {
      setDailyGoal(newGoal);
      setShowGoalForm(false);
    }
  };

  const calculateTotalCalories = () => {
    return foodEntries.reduce((total, entry) => total + entry.calories, 0);
  };

  const calculateMealCalories = (mealType) => {
    return foodEntries
      .filter(entry => entry.mealType === mealType)
      .reduce((total, entry) => total + entry.calories, 0);
  };

  const getProgressPercentage = () => {
    const total = calculateTotalCalories();
    return Math.min(100, (total / dailyGoal) * 100);
  };

  const getRemainingCalories = () => {
    return Math.max(0, dailyGoal - calculateTotalCalories());
  };

  const getMealTypeDisplay = (type) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <div className="calorie-tracker">
      <header className="calorie-header">
        <h1><i className="fas fa-apple-alt"></i> Calorie Tracker</h1>
        <div className="goal-display">
          <span>Daily Goal: {dailyGoal} kcal</span>
          <button 
            className="goal-edit-btn"
            onClick={() => setShowGoalForm(!showGoalForm)}
          >
            <i className="fas fa-edit"></i>
          </button>
        </div>
      </header>

      {showGoalForm && (
        <div className="goal-form">
          <h3>Set Daily Calorie Goal</h3>
          <input
            type="number"
            value={newGoal}
            onChange={handleGoalChange}
            min="1"
          />
          <button onClick={updateDailyGoal}>Update Goal</button>
          <button onClick={() => setShowGoalForm(false)}>Cancel</button>
        </div>
      )}

      <div className="progress-container">
        <div className="progress-header">
          <h2>Daily Progress</h2>
          <span>{calculateTotalCalories()} / {dailyGoal} kcal</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${getProgressPercentage()}%` }}
          ></div>
        </div>
        <p className="remaining-calories">
          {getRemainingCalories()} kcal remaining
        </p>
      </div>

      <div className="meal-summary">
        <h2>Meal Breakdown</h2>
        <div className="meal-cards">
          {['breakfast', 'lunch', 'dinner', 'snack'].map(mealType => (
            <div key={mealType} className="meal-card">
              <h3>{getMealTypeDisplay(mealType)}</h3>
              <p>{calculateMealCalories(mealType)} kcal</p>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="food-form">
        <h2>{editingId !== null ? 'Edit Food Entry' : 'Add Food Entry'}</h2>
        
        <div className="form-group">
          <label htmlFor="name">Food Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={foodForm.name}
            onChange={handleInputChange}
            placeholder="e.g., Apple"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="calories">Calories</label>
          <input
            type="number"
            id="calories"
            name="calories"
            value={foodForm.calories}
            onChange={handleInputChange}
            min="1"
            placeholder="e.g., 95"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="mealType">Meal Type</label>
          <select
            id="mealType"
            name="mealType"
            value={foodForm.mealType}
            onChange={handleInputChange}
          >
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
            <option value="snack">Snack</option>
          </select>
        </div>
        
        <button type="submit">
          {editingId !== null ? 'Update Entry' : 'Add Entry'}
        </button>
        
        {editingId !== null && (
          <button 
            type="button" 
            onClick={() => {
              setEditingId(null);
              setFoodForm({
                name: '',
                calories: '',
                mealType: 'breakfast'
              });
            }}
          >
            Cancel Edit
          </button>
        )}
      </form>

      <div className="food-entries">
        <h2>Food Entries</h2>
        
        {foodEntries.length === 0 ? (
          <p className="no-entries">No food entries yet. Add your first entry above!</p>
        ) : (
          <div className="entries-container">
            {foodEntries.map(entry => (
              <div key={entry.id} className="food-entry">
                <div className="entry-info">
                  <h3>{entry.name}</h3>
                  <p>{entry.calories} kcal · {getMealTypeDisplay(entry.mealType)}</p>
                </div>
                <div className="entry-actions">
                  <button 
                    onClick={() => handleEdit(entry.id)}
                    className="edit-btn"
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button 
                    onClick={() => handleDelete(entry.id)}
                    className="delete-btn"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CalorieTracker;
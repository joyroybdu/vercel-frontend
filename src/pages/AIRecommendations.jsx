import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AIRecommendations() {
  const { getAIRecommendations, addHabit } = useAuth();
  const [goals, setGoals] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGetRecommendations = async (e) => {
    e.preventDefault();
    if (!goals.trim()) {
      setError('Please describe your goals');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const recs = await getAIRecommendations(goals);
      setRecommendations(recs);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRecommendation = async (habit) => {
    try {
      await addHabit({
        name: habit.name,
        description: habit.description,
        type: habit.type,
        frequency: 'daily',
        goal: ''
      });
      alert(`Added habit: ${habit.name}`);
    } catch (err) {
      alert('Error adding habit: ' + err.message);
    }
  };

  return (
    <div className="container">
      <h1>AI Habit Recommendations</h1>
      
      <div className="card">
        <h3>Get Personalized Suggestions</h3>
        <p>Tell us about your goals and we'll suggest habits that can help you achieve them.</p>
        
        <form onSubmit={handleGetRecommendations} className="form">
          <label className="label">Your Goals</label>
          <textarea 
            className="input" 
            value={goals} 
            onChange={e => setGoals(e.target.value)}
            placeholder="e.g., I want to improve my productivity, reduce stress, and get better sleep"
            rows="3"
            required
          />
          
          {error && <div className="field-error">{error}</div>}
          
          <button 
            type="submit" 
            className="btn" 
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Get Recommendations'}
          </button>
        </form>
      </div>

      {recommendations.length > 0 && (
        <div className="mt-3">
          <h2>Recommended Habits</h2>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
            {recommendations.map((rec, index) => (
              <div key={index} className="card">
                <h3>{rec.name}</h3>
                <p>{rec.description}</p>
                <p><strong>Type:</strong> {rec.type === 'positive' ? 'Build' : 'Break'}</p>
                <p><strong>Why it helps:</strong> {rec.reason}</p>
                <button 
                  className="btn mt-2" 
                  onClick={() => handleAddRecommendation(rec)}
                >
                  Add to My Habits
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
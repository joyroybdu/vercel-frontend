import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Analytics() {
  const { habits, getAIAnalysis, getAIMotivation } = useAuth();
  const [analysis, setAnalysis] = useState('');
  const [motivation, setMotivation] = useState('');
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [loadingMotivation, setLoadingMotivation] = useState(false);

  useEffect(() => {
    if (habits.length > 0) {
      loadMotivation();
    }
  }, [habits]);

  const loadAnalysis = async () => {
    setLoadingAnalysis(true);
    try {
      const result = await getAIAnalysis();
      setAnalysis(result.analysis);
    } catch (err) {
      setAnalysis('Failed to load analysis. Please try again later.');
    } finally {
      setLoadingAnalysis(false);
    }
  };

  const loadMotivation = async () => {
    setLoadingMotivation(true);
    try {
      const result = await getAIMotivation();
      setMotivation(result.motivation);
    } catch (err) {
      setMotivation('Stay focused on your goals! Every small step counts.');
    } finally {
      setLoadingMotivation(false);
    }
  };

  const totalCompleted = habits.reduce((sum, habit) => sum + habit.completionDates.length, 0);
  const currentStreak = habits.reduce((max, habit) => Math.max(max, habit.streak), 0);
  const positiveHabits = habits.filter(h => h.type === 'positive').length;
  const negativeHabits = habits.filter(h => h.type === 'negative').length;

  return (
    <div className="container">
      <h1>Analytics & Insights</h1>

      {motivation && (
        <div className="card" style={{ borderLeft: '4px solid var(--accent)' }}>
          <h3>💫 Daily Motivation</h3>
          <p>{motivation}</p>
          <button 
            className="btn secondary mt-2" 
            onClick={loadMotivation}
            disabled={loadingMotivation}
          >
            {loadingMotivation ? 'Loading...' : 'New Motivation'}
          </button>
        </div>
      )}

      <div className="grid mt-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <div className="card center">
          <h2>{habits.length}</h2>
          <p>Total Habits</p>
        </div>
        <div className="card center">
          <h2>{totalCompleted}</h2>
          <p>Total Completions</p>
        </div>
        <div className="card center">
          <h2>{currentStreak}</h2>
          <p>Current Streak</p>
        </div>
        <div className="card center">
          <h2>{positiveHabits}</h2>
          <p>Positive Habits</p>
        </div>
        <div className="card center">
          <h2>{negativeHabits}</h2>
          <p>Habits to Break</p>
        </div>
      </div>

      <div className="card mt-3">
        <div className="flex" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>AI Pattern Analysis</h3>
          <button 
            className="btn" 
            onClick={loadAnalysis}
            disabled={loadingAnalysis || habits.length === 0}
          >
            {loadingAnalysis ? 'Analyzing...' : 'Analyze My Patterns'}
          </button>
        </div>
        
        {habits.length === 0 ? (
          <p>Add some habits first to get analysis.</p>
        ) : analysis ? (
          <div className="mt-2">
            <p>{analysis}</p>
          </div>
        ) : (
          <p>Get AI-powered insights about your habit patterns.</p>
        )}
      </div>

      {habits.length > 0 && (
        <div className="card mt-3">
          <h3>Habit Completion History</h3>
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Habit</th>
                  <th>Type</th>
                  <th>Streak</th>
                  <th>Completions</th>
                  <th>Last Completed</th>
                </tr>
              </thead>
              <tbody>
                {habits.map(habit => (
                  <tr key={habit._id}>
                    <td>{habit.name}</td>
                    <td>
                      <span className={`badge ${habit.type === 'positive' ? 'success' : 'danger'}`}>
                        {habit.type === 'positive' ? 'Build' : 'Break'}
                      </span>
                    </td>
                    <td>{habit.streak}</td>
                    <td>{habit.completionDates.length}</td>
                    <td>
                      {habit.completionDates.length > 0 ? 
                        new Date(habit.completionDates[habit.completionDates.length - 1]).toLocaleDateString() : 
                        'Never'
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
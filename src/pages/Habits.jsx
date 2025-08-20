import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Habits() {
  // ERROR: addHabit was not destructured from useAuth()
  const { habits, addHabit, completeHabit, deleteHabit } = useAuth();
  const [newHabit, setNewHabit] = useState({ 
    name: '', 
    description: '', 
    type: 'positive', 
    frequency: 'daily',
    goal: ''
  });
  const [showForm, setShowForm] = useState(false);

  const handleAddHabit = async (e) => {
    e.preventDefault();
    try {
      await addHabit(newHabit);
      setNewHabit({ name: '', description: '', type: 'positive', frequency: 'daily', goal: '' });
      setShowForm(false);
    } catch (err) {
      alert('Error adding habit: ' + err.message);
    }
  };

  const handleComplete = async (id) => {
    try {
      await completeHabit(id);
    } catch (err) {
      alert('Error completing habit: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this habit?')) {
      try {
        await deleteHabit(id);
      } catch (err) {
        alert('Error deleting habit: ' + err.message);
      }
    }
  };

  return (
    <div className="container">
      <div className="flex" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>My Habits</h1>
        <button className="btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Add New Habit'}
        </button>
      </div>

      {showForm && (
        <div className="card mt-2">
          <h3>Add New Habit</h3>
          <form onSubmit={handleAddHabit} className="form">
            <label className="label">Habit Name</label>
            <input 
              className="input" 
              value={newHabit.name} 
              onChange={e => setNewHabit({...newHabit, name: e.target.value})} 
              required 
            />

            <label className="label">Description</label>
            <textarea 
              className="input" 
              value={newHabit.description} 
              onChange={e => setNewHabit({...newHabit, description: e.target.value})}
              rows="3"
            />

            <label className="label">Type</label>
            <select 
              className="input" 
              value={newHabit.type} 
              onChange={e => setNewHabit({...newHabit, type: e.target.value})}
            >
              <option value="positive">Positive (Build)</option>
              <option value="negative">Negative (Break)</option>
            </select>

            <label className="label">Frequency</label>
            <select 
              className="input" 
              value={newHabit.frequency} 
              onChange={e => setNewHabit({...newHabit, frequency: e.target.value})}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>

            <label className="label">Goal (optional)</label>
            <input 
              className="input" 
              value={newHabit.goal} 
              onChange={e => setNewHabit({...newHabit, goal: e.target.value})}
              placeholder="e.g., 3 times per week" 
            />

            <button type="submit" className="btn">Add Habit</button>
          </form>
        </div>
      )}

      <div className="mt-3">
        {habits.length === 0 ? (
          <div className="card center">
            <h3>No habits yet</h3>
            <p>Start by adding your first habit or check out <Link to="/ai-recommendations">AI recommendations</Link>.</p>
          </div>
        ) : (
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
            {habits.map(habit => (
              <div key={habit._id} className="card">
                <div className="flex" style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h3>{habit.name}</h3>
                  <span className={`badge ${habit.type === 'positive' ? 'success' : 'danger'}`}>
                    {habit.type === 'positive' ? 'Build' : 'Break'}
                  </span>
                </div>
                
                {habit.description && <p>{habit.description}</p>}
                
                <div className="mt-2">
                  <p><strong>Frequency:</strong> {habit.frequency}</p>
                  {habit.goal && <p><strong>Goal:</strong> {habit.goal}</p>}
                  <p><strong>Streak:</strong> {habit.streak} days</p>
                  <p><strong>Completed:</strong> {habit.completionDates.length} times</p>
                </div>
                
                <div className="flex mt-2" style={{ gap: '8px' }}>
                  <button 
                    className="btn" 
                    onClick={() => handleComplete(habit._id)}
                    disabled={habit.completed}
                  >
                    {habit.completed ? 'Completed Today' : 'Mark Complete'}
                  </button>
                  <button 
                    className="btn danger" 
                    onClick={() => handleDelete(habit._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
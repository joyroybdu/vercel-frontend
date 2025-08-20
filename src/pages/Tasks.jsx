import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TasksContext';

export default function Tasks() {
  const { user } = useAuth();
  const { tasks, loading, addTask, deleteTask, toggleTaskCompletion, fetchTasks } = useTasks();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user, fetchTasks]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      await addTask({
        title: formData.title,
        description: formData.description,
        dueDate: formData.dueDate || undefined
      });
      
      setFormData({ title: '', description: '', dueDate: '' });
      setShowForm(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleToggleComplete = async (taskId, completed) => {
    try {
      await toggleTaskCompletion(taskId, !completed);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    try {
      await deleteTask(taskId);
    } catch (err) {
      setError(err.message);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    return new Date(dateString).toLocaleDateString();
  };

  if (!user) {
    return (
      <div className="container">
        <div className="card">
          <h2>Please log in</h2>
          <p>You need to be logged in to view and manage your tasks.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <div className="flex" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>My Tasks</h2>
          <button 
            className="btn" 
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel' : 'Add Task'}
          </button>
        </div>

        {showForm && (
          <div style={{ margin: '20px 0', padding: '15px', border: '1px solid #2a2f3a', borderRadius: '10px' }}>
            <h3>Add New Task</h3>
            <form onSubmit={handleSubmit} className="form">
              <label className="label">Title *</label>
              <input 
                className="input" 
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                placeholder="What needs to be done?"
                required
              />

              <label className="label">Description</label>
              <textarea 
                className="input" 
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                placeholder="Additional details..."
                rows="3"
              />

              <label className="label">Due Date</label>
             <input
  type="date"
  value={formData.dueDate}
  onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
  style={{
    backgroundColor: '#fff',
    color: '#000',
    border: '1px solid #ccc',
    borderRadius: '5px',
    padding: '0.5rem 0.75rem',
    fontSize: '1rem',
    outline: 'none',
    // Hover effect using onMouseEnter/onMouseLeave
  }}
  onMouseEnter={e => e.target.style.backgroundColor = '#fff'}
  onMouseLeave={e => e.target.style.backgroundColor = '#fff'}
/>


              {error && <div className="field-error">{error}</div>}
              
              <div className="flex" style={{ justifyContent: 'flex-end' }}>
                <button type="submit" className="btn">Add Task</button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="center mt-3">Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <div className="center mt-3">
            <p>No tasks yet. Add your first task to get started!</p>
          </div>
        ) : (
          <div className="mt-3">
            <h3>Your Tasks ({tasks.length})</h3>
            <div style={{ display: 'grid', gap: '12px' }}>
              {tasks.map(task => (
                <div 
                  key={task._id} 
                  className="card" 
                  style={{ 
                    opacity: task.completed ? 0.7 : 1,
                    borderLeft: `4px solid ${task.completed ? '#4caf50' : '#4ea1ff'}`
                  }}
                >
                  <div className="flex" style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <div className="flex" style={{ alignItems: 'center', gap: '8px' }}>
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => handleToggleComplete(task._id, task.completed)}
                          style={{ width: '18px', height: '18px' }}
                        />
                        <h4 style={{ 
                          margin: 0, 
                          textDecoration: task.completed ? 'line-through' : 'none' 
                        }}>
                          {task.title}
                        </h4>
                      </div>
                      
                      {task.description && (
                        <p style={{ margin: '8px 0 0 26px', color: '#b7bcc7' }}>
                          {task.description}
                        </p>
                      )}
                      
                      <div style={{ margin: '8px 0 0 26px', fontSize: '14px', color: '#8c93a1' }}>
                        <div>Due: {formatDate(task.dueDate)}</div>
                        {task.completed && task.completedAt && (
                          <div>Completed: {new Date(task.completedAt).toLocaleDateString()}</div>
                        )}
                        <div>Created: {new Date(task.createdAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                    
                    <div className="flex" style={{ gap: '8px' }}>
                      <button 
                        className="btn danger" 
                        onClick={() => handleDelete(task._id)}
                        style={{ padding: '6px 10px', fontSize: '13px' }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
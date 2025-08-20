import { useState } from 'react';
import { usePomodoro } from '../context/PomodoroContext';

export default function PomodoroTimer() {
  const {
    timeLeft,
    isActive,
    mode,
    completedPomodoros,
    tasks,
    startTimer,
    pauseTimer,
    resetTimer,
    switchMode,
    addTask,
    removeTask
  } = usePomodoro();
  
  const [newTask, setNewTask] = useState('');

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAddTask = () => {
    if (newTask.trim()) {
      addTask(newTask.trim());
      setNewTask('');
    }
  };

  const getModeLabel = () => {
    switch(mode) {
      case 'work': return 'Work';
      case 'shortBreak': return 'Short Break';
      case 'longBreak': return 'Long Break';
      default: return '';
    }
  };

  return (
    <div className="card">
      <h2>Pomodoro Timer</h2>
      
      <div className="center">
        <div style={{ fontSize: '3rem', fontWeight: 'bold', margin: '20px 0' }}>
          {formatTime(timeLeft)}
        </div>
        <div style={{ marginBottom: '20px', color: 'var(--muted)' }}>
          {getModeLabel()} • {completedPomodoros} completed today
        </div>
        
        <div className="flex" style={{ justifyContent: 'center', marginBottom: '20px' }}>
          <button 
            className={`btn ${mode === 'work' ? '' : 'secondary'}`}
            onClick={() => switchMode('work')}
          >
            Work
          </button>
          <button 
            className={`btn ${mode === 'shortBreak' ? '' : 'secondary'}`}
            onClick={() => switchMode('shortBreak')}
          >
            Short Break
          </button>
          <button 
            className={`btn ${mode === 'longBreak' ? '' : 'secondary'}`}
            onClick={() => switchMode('longBreak')}
          >
            Long Break
          </button>
        </div>
        
        <div className="flex" style={{ justifyContent: 'center' }}>
          {!isActive ? (
            <button className="btn" onClick={startTimer}>Start</button>
          ) : (
            <button className="btn secondary" onClick={pauseTimer}>Pause</button>
          )}
          <button className="btn danger" onClick={resetTimer}>Reset</button>
        </div>
      </div>
      
      <div style={{ marginTop: '30px' }}>
        <h3>Tasks</h3>
        <div className="form" style={{ gridTemplateColumns: '1fr auto' }}>
          <input
            type="text"
            className="input"
            placeholder="Add a task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
          />
          <button className="btn" onClick={handleAddTask}>Add</button>
        </div>
        
        {tasks.length > 0 && (
          <ul style={{ padding: 0, margin: '15px 0 0 0' }}>
            {tasks.map((task, index) => (
              <li key={index} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '10px',
                borderBottom: '1px solid #2a2f3a'
              }}>
                <span>{task}</span>
                <button 
                  className="btn danger" 
                  style={{ padding: '5px 10px', fontSize: '12px' }}
                  onClick={() => removeTask(index)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
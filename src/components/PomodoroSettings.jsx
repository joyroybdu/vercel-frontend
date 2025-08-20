import { useState } from 'react';
import { usePomodoro } from '../context/PomodoroContext';

export default function PomodoroSettings() {
  const { settings, updateSettings } = usePomodoro();
  const [localSettings, setLocalSettings] = useState(settings);
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = () => {
    updateSettings(localSettings);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setLocalSettings(settings);
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button className="btn secondary" onClick={() => setIsOpen(true)}>
        Timer Settings
      </button>
    );
  }

  return (
    <div className="card">
      <h3>Timer Settings</h3>
      
      <div className="form">
        <label className="label">Work Time (minutes)</label>
        <input
          type="number"
          className="input"
          min="1"
          max="60"
          value={localSettings.workTime / 60}
          onChange={(e) => setLocalSettings({...localSettings, workTime: e.target.value * 60})}
        />
        
        <label className="label">Short Break (minutes)</label>
        <input
          type="number"
          className="input"
          min="1"
          max="30"
          value={localSettings.shortBreak / 60}
          onChange={(e) => setLocalSettings({...localSettings, shortBreak: e.target.value * 60})}
        />
        
        <label className="label">Long Break (minutes)</label>
        <input
          type="number"
          className="input"
          min="1"
          max="60"
          value={localSettings.longBreak / 60}
          onChange={(e) => setLocalSettings({...localSettings, longBreak: e.target.value * 60})}
        />
        
        <label className="label">Long Break Interval</label>
        <input
          type="number"
          className="input"
          min="1"
          max="10"
          value={localSettings.longBreakInterval}
          onChange={(e) => setLocalSettings({...localSettings, longBreakInterval: parseInt(e.target.value)})}
        />
        
        <div className="flex">
          <button className="btn" onClick={handleSave}>Save</button>
          <button className="btn secondary" onClick={handleCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
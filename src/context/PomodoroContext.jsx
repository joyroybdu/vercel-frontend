// import { createContext, useContext, useState, useEffect } from 'react';
// import { useAuth } from './AuthContext';
// import { api } from '../services/api';

// const PomodoroCtx = createContext();

// // Default timer settings
// const defaultSettings = {
//   workTime: 25 * 60, // 25 minutes in seconds
//   shortBreak: 5 * 60, // 5 minutes in seconds
//   longBreak: 15 * 60, // 15 minutes in seconds
//   longBreakInterval: 4 // Every 4 pomodoros
// };

// export function PomodoroProvider({ children }) {
//   const [timeLeft, setTimeLeft] = useState(defaultSettings.workTime);
//   const [isActive, setIsActive] = useState(false);
//   const [mode, setMode] = useState('work'); // work, shortBreak, longBreak
//   const [completedPomodoros, setCompletedPomodoros] = useState(0);
//   const [tasks, setTasks] = useState([]);
//   const [settings, setSettings] = useState(defaultSettings);
//   const [stats, setStats] = useState({ today: 0, totalPomodoros: 0, totalWorkTime: 0 });
  
//   const { user, token } = useAuth();

//   // Load user's pomodoro statistics
//   const loadStats = async () => {
//     if (!user) return;
//     try {
//       const data = await api('/api/pomodoro/stats', { token });
//       setStats(data);
//       setCompletedPomodoros(data.today % settings.longBreakInterval);
//     } catch (err) {
//       console.error('Failed to load pomodoro stats:', err);
//     }
//   };

//   // Save a completed pomodoro session
//   const savePomodoro = async (type, duration) => {
//     if (!user) return;
//     try {
//       await api('/api/pomodoro', {
//         method: 'POST',
//         body: { type, duration, tasks },
//         token
//       });
//       loadStats(); // Refresh stats
//     } catch (err) {
//       console.error('Failed to save pomodoro:', err);
//     }
//   };

//   // Timer logic
//   useEffect(() => {
//     let interval = null;
    
//     if (isActive && timeLeft > 0) {
//       interval = setInterval(() => {
//         setTimeLeft(timeLeft - 1);
//       }, 1000);
//     } else if (isActive && timeLeft === 0) {
//       clearInterval(interval);
//       handleTimerComplete();
//     }
    
//     return () => clearInterval(interval);
//   }, [isActive, timeLeft]);

//   const handleTimerComplete = () => {
//     // Play notification sound
//     playNotificationSound();
    
//     // Show browser notification if permitted
//     if (Notification.permission === 'granted') {
//       new Notification('Pomodoro Timer', {
//         body: `${mode === 'work' ? 'Time for a break!' : 'Time to work!'}`
//       });
//     }
    
//     // Save the completed session
//     const duration = mode === 'work' 
//       ? settings.workTime 
//       : mode === 'shortBreak' 
//         ? settings.shortBreak 
//         : settings.longBreak;
    
//     savePomodoro(mode, duration);
    
//     // Determine next mode
//     if (mode === 'work') {
//       const newCompleted = completedPomodoros + 1;
//       setCompletedPomodoros(newCompleted);
      
//       if (newCompleted % settings.longBreakInterval === 0) {
//         setMode('longBreak');
//         setTimeLeft(settings.longBreak);
//       } else {
//         setMode('shortBreak');
//         setTimeLeft(settings.shortBreak);
//       }
//     } else {
//       setMode('work');
//       setTimeLeft(settings.workTime);
//     }
    
//     setIsActive(false);
//   };

//   const playNotificationSound = () => {
//     const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbVtfdJivrJBhNjVgodDbq2EcBSt8s+fDfDkRDkKR2/LDfE8iHkqU2/LDfF8qJkqU2/LDfG8yLkqU2/LDfH86NkqU2/LDfI9CPlKU2/LDfJ9KRlKU2/LDfK9STlKU2/LDfL9aVlKU2/LDfM9iXlKU2/LDfN9qZlKU2/LDfO9yblKU2/LDfP96dlKU2/LDfQ+ChlKU2/LDfR+Kl');
//     audio.play().catch(e => console.log('Audio play failed:', e));
//   };

//   const startTimer = () => setIsActive(true);
//   const pauseTimer = () => setIsActive(false);
//   const resetTimer = () => {
//     setIsActive(false);
//     setTimeLeft(
//       mode === 'work' 
//         ? settings.workTime 
//         : mode === 'shortBreak' 
//           ? settings.shortBreak 
//           : settings.longBreak
//     );
//   };

//   const switchMode = (newMode) => {
//     setIsActive(false);
//     setMode(newMode);
//     setTimeLeft(
//       newMode === 'work' 
//         ? settings.workTime 
//         : newMode === 'shortBreak' 
//           ? settings.shortBreak 
//           : settings.longBreak
//     );
//   };

//   const addTask = (task) => {
//     setTasks([...tasks, task]);
//   };

//   const removeTask = (index) => {
//     setTasks(tasks.filter((_, i) => i !== index));
//   };

//   const updateSettings = (newSettings) => {
//     setSettings(newSettings);
//     // Reset timer with new settings
//     setTimeLeft(
//       mode === 'work' 
//         ? newSettings.workTime 
//         : mode === 'shortBreak' 
//           ? newSettings.shortBreak 
//           : newSettings.longBreak
//     );
//   };

//   // Request notification permission on component mount
//   useEffect(() => {
//     if ('Notification' in window && Notification.permission === 'default') {
//       Notification.requestPermission();
//     }
//     if (user) {
//       loadStats();
//     }
//   }, [user]);

//   const value = {
//     timeLeft,
//     isActive,
//     mode,
//     completedPomodoros,
//     tasks,
//     settings,
//     stats,
//     startTimer,
//     pauseTimer,
//     resetTimer,
//     switchMode,
//     addTask,
//     removeTask,
//     updateSettings,
//     loadStats
//   };

//   return <PomodoroCtx.Provider value={value}>{children}</PomodoroCtx.Provider>;
// }

// export const usePomodoro = () => useContext(PomodoroCtx);
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { api } from '../services/api';

const PomodoroCtx = createContext();

// Default timer settings
const defaultSettings = {
  workTime: 25 * 60, // 25 minutes in seconds
  shortBreak: 5 * 60, // 5 minutes in seconds
  longBreak: 15 * 60, // 15 minutes in seconds
  longBreakInterval: 4 // Every 4 pomodoros
};

export function PomodoroProvider({ children }) {
  const [timeLeft, setTimeLeft] = useState(defaultSettings.workTime);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('work'); // work, shortBreak, longBreak
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [settings, setSettings] = useState(defaultSettings);
  const [stats, setStats] = useState({ today: 0, totalPomodoros: 0, totalWorkTime: 0 });
  
  const { user } = useAuth();

  // Load user's pomodoro statistics - FIXED
  const loadStats = useCallback(async () => {
    if (!user) return;
    try {
      // Use api.get() instead of api()
      const data = await api.get('/api/pomodoro/stats');
      setStats(data);
      setCompletedPomodoros(data.today % settings.longBreakInterval);
    } catch (err) {
      console.error('Failed to load pomodoro stats:', err);
    }
  }, [user, settings.longBreakInterval]);

  // Save a completed pomodoro session - FIXED
  const savePomodoro = useCallback(async (type, duration) => {
    if (!user) return;
    try {
      // Use api.post() instead of api()
      await api.post('/api/pomodoro', {
        body: { type, duration, tasks }
      });
      loadStats(); // Refresh stats
    } catch (err) {
      console.error('Failed to save pomodoro:', err);
    }
  }, [user, tasks, loadStats]);

  // Timer logic
  useEffect(() => {
    let interval = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      clearInterval(interval);
      handleTimerComplete();
    }
    
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const handleTimerComplete = () => {
    // Play notification sound
    playNotificationSound();
    
    // Show browser notification if permitted
    if (Notification.permission === 'granted') {
      new Notification('Pomodoro Timer', {
        body: `${mode === 'work' ? 'Time for a break!' : 'Time to work!'}`
      });
    }
    
    // Save the completed session
    const duration = mode === 'work' 
      ? settings.workTime 
      : mode === 'shortBreak' 
        ? settings.shortBreak 
        : settings.longBreak;
    
    savePomodoro(mode, duration);
    
    // Determine next mode
    if (mode === 'work') {
      const newCompleted = completedPomodoros + 1;
      setCompletedPomodoros(newCompleted);
      
      if (newCompleted % settings.longBreakInterval === 0) {
        setMode('longBreak');
        setTimeLeft(settings.longBreak);
      } else {
        setMode('shortBreak');
        setTimeLeft(settings.shortBreak);
      }
    } else {
      setMode('work');
      setTimeLeft(settings.workTime);
    }
    
    setIsActive(false);
  };

  const playNotificationSound = () => {
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbVtfdJivrJBhNjVgodDbq2EcBSt8s+fDfDkRDkKR2/LDfE8iHkqU2/LDfF8qJkqU2/LDfG8yLkqU2/LDfH86NkqU2/LDfI9CPlKU2/LDfJ9KRlKU2/LDfK9STlKU2/LDfL9aVlKU2/LDfM9iXlKU2/LDfN9qZlKU2/LDfO9yblKU2/LDfP96dlKU2/LDfQ+ChlKU2/LDfR+Kl');
    audio.play().catch(e => console.log('Audio play failed:', e));
  };

  const startTimer = () => setIsActive(true);
  const pauseTimer = () => setIsActive(false);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(
      mode === 'work' 
        ? settings.workTime 
        : mode === 'shortBreak' 
          ? settings.shortBreak 
          : settings.longBreak
    );
  };

  const switchMode = (newMode) => {
    setIsActive(false);
    setMode(newMode);
    setTimeLeft(
      newMode === 'work' 
        ? settings.workTime 
        : newMode === 'shortBreak' 
          ? settings.shortBreak 
          : settings.longBreak
    );
  };

  const addTask = (task) => {
    setTasks([...tasks, task]);
  };

  const removeTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const updateSettings = (newSettings) => {
    setSettings(newSettings);
    // Reset timer with new settings
    setTimeLeft(
      mode === 'work' 
        ? newSettings.workTime 
        : mode === 'shortBreak' 
          ? newSettings.shortBreak 
          : newSettings.longBreak
    );
  };

  // Request notification permission on component mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
    if (user) {
      loadStats();
    }
  }, [user, loadStats]);

  const value = {
    timeLeft,
    isActive,
    mode,
    completedPomodoros,
    tasks,
    settings,
    stats,
    startTimer,
    pauseTimer,
    resetTimer,
    switchMode,
    addTask,
    removeTask,
    updateSettings,
    loadStats
  };

  return <PomodoroCtx.Provider value={value}>{children}</PomodoroCtx.Provider>;
}

export const usePomodoro = () => useContext(PomodoroCtx);
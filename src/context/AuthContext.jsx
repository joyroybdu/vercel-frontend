
// import { createContext, useContext, useEffect, useMemo, useState } from 'react';
// import {api }from '../services/api'; // Default import

// const AuthCtx = createContext();

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(() => localStorage.getItem('token'));
//   const [loading, setLoading] = useState(true);
//    const [habits, setHabits] = useState([]);//add

//   useEffect(() => {
//     const bootstrap = async () => {
//       if (!token) { setLoading(false); return; }
//       try {
//         const me = await api.get('/api/auth/me', { token }); // Use api.get
//         setUser(me);
//          // Load user's habits
//         const userHabits = await api.get('/api/habits');
//         setHabits(userHabits);
//       } catch (_) {
//         setToken(null);
//         localStorage.removeItem('token');
//       } finally {
//         setLoading(false);
//       }
//     };
//     bootstrap();
//   }, [token]);

//   const login = async (email, password) => {
//     const res = await api.post('/api/auth/login', { // Use api.post
//       body: { email, password },
//     });
//     localStorage.setItem('token', res.token);
//     setToken(res.token);
//     setUser(res.user);
//   };

//   const signup = async (name, email, mobile, password) => {
//     const res = await api.post('/api/auth/signup', { // Use api.post
//       body: { name, email, mobile, password },
//     });
//     localStorage.setItem('token', res.token);
//     setToken(res.token);
//     setUser(res.user);
//       setHabits([]); // New user has no habits
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     setToken(null);
//     setUser(null);
//      setHabits([]);//add
//   };

//   const value = useMemo(() => ({ user, token, loading, login, signup, logout, setUser }), [user, token, loading]);
//   return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
// }

// export const useAuth = () => useContext(AuthCtx);
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';

const AuthCtx = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [habits, setHabits] = useState([]);

  useEffect(() => {
    const bootstrap = async () => {
      if (!token) { setLoading(false); return; }
      try {
        const me = await api.get('/api/auth/me');
        setUser(me);
        
        // Load user's habits
        const userHabits = await api.get('/api/habits');
        setHabits(userHabits);
      } catch (_) {
        setToken(null);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };
    bootstrap();
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post('/api/auth/login', { body: { email, password } });
    localStorage.setItem('token', res.token);
    setToken(res.token);
    setUser(res.user);
    
    // Load user's habits after login
    const userHabits = await api.get('/api/habits');
    setHabits(userHabits);
  };

  const signup = async (name, email, mobile, password) => {
    const res = await api.post('/api/auth/signup', { body: { name, email, mobile, password } });
    localStorage.setItem('token', res.token);
    setToken(res.token);
    setUser(res.user);
    setHabits([]); // New user has no habits
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setHabits([]);
  };

  // Habit management functions
  const addHabit = async (habitData) => {
    const newHabit = await api.post('/api/habits', { body: habitData });
    setHabits(prev => [...prev, newHabit]);
    return newHabit;
  };

  const updateHabit = async (id, updates) => {
    const updatedHabit = await api.put(`/api/habits/${id}`, { body: updates });
    setHabits(prev => prev.map(habit => 
      habit._id === id ? updatedHabit : habit
    ));
    return updatedHabit;
  };

  const deleteHabit = async (id) => {
    await api.delete(`/api/habits/${id}`);
    setHabits(prev => prev.filter(habit => habit._id !== id));
  };

  const completeHabit = async (id) => {
    const updatedHabit = await api.post(`/api/habits/${id}/complete`);
    setHabits(prev => prev.map(habit => 
      habit._id === id ? updatedHabit : habit
    ));
    return updatedHabit;
  };

  // AI functions
  const getAIRecommendations = async (goals) => {
    return await api.get(`/api/habits/ai/recommendations?goals=${encodeURIComponent(goals)}`);
  };

  const getAIAnalysis = async () => {
    return await api.get('/api/habits/ai/analysis');
  };

  const getAIMotivation = async () => {
    return await api.get('/api/habits/ai/motivation');
  };

  const value = useMemo(() => ({ 
    user, 
    token, 
    loading, 
    habits,
    login, 
    signup, 
    logout, 
    setUser,
    addHabit,
    updateHabit,
    deleteHabit,
    completeHabit,
    getAIRecommendations,
    getAIAnalysis,
    getAIMotivation
  }), [user, token, loading, habits]);

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export const useAuth = () => useContext(AuthCtx);
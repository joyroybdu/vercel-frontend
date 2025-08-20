import { createContext, useContext, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import {api} from '../services/api';

const TasksCtx = createContext();

export function TasksProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const fetchTasks = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const tasksData = await api.get('/api/tasks', { token });
      setTasks(tasksData);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const addTask = async (taskData) => {
    try {
      const newTask = await api.post('/api/tasks', {
        body: taskData,
        token
      });
      setTasks(prev => [newTask, ...prev]);
      return newTask;
    } catch (err) {
      console.error('Failed to add task:', err);
      throw err;
    }
  };

  const updateTask = async (id, updates) => {
    try {
      const updatedTask = await api.put(`/api/tasks/${id}`, {
        body: updates,
        token
      });
      setTasks(prev => prev.map(task => 
        task._id === id ? updatedTask : task
      ));
      return updatedTask;
    } catch (err) {
      console.error('Failed to update task:', err);
      throw err;
    }
  };

  const deleteTask = async (id) => {
    try {
      await api.delete(`/api/tasks/${id}`, { token });
      setTasks(prev => prev.filter(task => task._id !== id));
    } catch (err) {
      console.error('Failed to delete task:', err);
      throw err;
    }
  };

  const toggleTaskCompletion = async (id, completed) => {
    return updateTask(id, { completed });
  };

  const value = {
    tasks,
    loading,
    fetchTasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion
  };

  return <TasksCtx.Provider value={value}>{children}</TasksCtx.Provider>;
}

export const useTasks = () => useContext(TasksCtx);
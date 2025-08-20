// context/NotesContext.jsx
import { createContext, useContext, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { api } from '../services/api';

const NotesContext = createContext();

export function NotesProvider({ children }) {
  const { token } = useAuth();

  const fetchNotes = useCallback(async () => {
    const data = await api('/api/notes', { token });
    return data;
  }, [token]);

  const addNote = useCallback(async (noteData) => {
    const note = await api('/api/notes', {
      method: 'POST',
      body: noteData,
      token
    });
    return note;
  }, [token]);

  const updateNote = useCallback(async (id, noteData) => {
    const note = await api(`/api/notes/${id}`, {
      method: 'PUT',
      body: noteData,
      token
    });
    return note;
  }, [token]);

  const deleteNote = useCallback(async (id) => {
    await api(`/api/notes/${id}`, {
      method: 'DELETE',
      token
    });
  }, [token]);

  const value = {
    fetchNotes,
    addNote,
    updateNote,
    deleteNote
  };

  return (
    <NotesContext.Provider value={value}>
      {children}
    </NotesContext.Provider>
  );
}

export const useNotes = () => useContext(NotesContext);
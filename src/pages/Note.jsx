import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {api }from '../services/api.js'; // REMOVED THE CURLY BRACES - this is the fix!
import jsPDF from 'jspdf';
import '../css/Note.css';

export default function Notes() {
  const { user, token } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingNote, setEditingNote] = useState(null);
  const [form, setForm] = useState({ title: '', description: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) fetchNotes();
  }, [user]);

  const fetchNotes = async () => {
    try {
      const data = await api.get('/api/notes', { token }); // Added .get method
      setNotes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingNote) {
        await api.put(`/api/notes/${editingNote._id}`, { // Added .put method
          body: form,
          token
        });
        setEditingNote(null);
      } else {
        await api.post('/api/notes', { // Added .post method
          body: form,
          token
        });
      }
      setForm({ title: '', description: '' });
      fetchNotes();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    try {
      await api.delete(`/api/notes/${id}`, { token }); // Added .delete method
      fetchNotes();
    } catch (err) {
      setError(err.message);
    }
  };

  const downloadAsPDF = (note) => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text(note.title, 20, 20);
    doc.setFontSize(12);
    const splitDescription = doc.splitTextToSize(note.description, 170);
    doc.text(splitDescription, 20, 30);
    doc.save(`${note.title.replace(/\s+/g, '_')}.pdf`);
  };

  const shareNote = async (note) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: note.title,
          text: note.description,
          url: window.location.href
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      const text = `${note.title}\n\n${note.description}`;
      navigator.clipboard.writeText(text).then(() => {
        alert('Note copied to clipboard!');
      });
    }
  };

  if (!user) {
    return (
      <div className="container">
        <div className="card">
          <h2>Please log in</h2>
          <p>You need to be logged in to view and create notes.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container">
        <div className="card">Loading notes...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <h2>My Notes</h2>
        
        {/* Note Form */}
        <form className="form" onSubmit={handleSubmit}>
          <h3>{editingNote ? 'Edit Note' : 'Create New Note'}</h3>
          <label className="label">Title</label>
          <input
            className="input"
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            required
            placeholder="Enter note title"
          />

          <label className="label">Description</label>
          <textarea
            className="input"
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            required
            rows="4"
            placeholder="Enter note description"
            style={{ resize: 'vertical' }}
          />

          {error && <div className="field-error">{error}</div>}
          
          <div className="flex">
            <button className="btn" type="submit">
              {editingNote ? 'Update Note' : 'Create Note'}
            </button>
            {editingNote && (
              <button
                type="button"
                className="btn secondary"
                onClick={() => {
                  setEditingNote(null);
                  setForm({ title: '', description: '' });
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* Notes List */}
        <div className="mt-3">
          <h3>Your Notes ({notes.length})</h3>
          {notes.length === 0 ? (
            <p>No notes yet. Create your first note above!</p>
          ) : (
            <div style={{ display: 'grid', gap: '16px' }}>
              {notes.map(note => (
                <div key={note._id} className="card" style={{ background: 'var(--bg)' }}>
                  <h4 style={{ margin: '0 0 8px 0', color: 'var(--accent)' }}>{note.title}</h4>
                  <p style={{ margin: '0 0 16px 0', whiteSpace: 'pre-wrap' }}>{note.description}</p>
                  <div className="flex">
                    <button
                      className="btn secondary"
                      onClick={() => handleEdit(note)}
                      style={{ fontSize: '12px', padding: '6px 12px' }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn secondary"
                      onClick={() => downloadAsPDF(note)}
                      style={{ fontSize: '12px', padding: '6px 12px' }}
                    >
                      Download PDF
                    </button>
                    <button
                      className="btn secondary"
                      onClick={() => shareNote(note)}
                      style={{ fontSize: '12px', padding: '6px 12px' }}
                    >
                      Share
                    </button>
                    <button
                      className="btn danger"
                      onClick={() => handleDelete(note._id)}
                      style={{ fontSize: '12px', padding: '6px 12px' }}
                    >
                      Delete
                    </button>
                  </div>
                  <small style={{ color: 'var(--muted)', marginTop: '8px', display: 'block' }}>
                    Created: {new Date(note.createdAt).toLocaleDateString()}
                  </small>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {api }from '../services/api'; // Default import

export default function EditProfile() {
  const { user, token, setUser } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', mobile: '' });
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (user) setForm({ name: user.name || '', email: user.email || '', mobile: user.mobile || '' });
  }, [user]);

  if (!user) {
    return (
      <div className="container"><div className="card"><p>Please log in first.</p></div></div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setOk('');
    try {
      const updated = await api.put('/api/auth/me', { // Use api.put
        body: form, 
        token 
      });
      setUser(updated);
      setOk('Profile updated');
      navigate('/profile');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Edit Profile</h2>
        <form className="form" onSubmit={handleSubmit}>
          <label className="label">Name</label>
          <input className="input" value={form.name} onChange={e=>setForm(f=>({...f, name:e.target.value}))} required />

          <label className="label">Email</label>
          <input type="email" className="input" value={form.email} onChange={e=>setForm(f=>({...f, email:e.target.value}))} required />

          <label className="label">Mobile</label>
          <input className="input" value={form.mobile} onChange={e=>setForm(f=>({...f, mobile:e.target.value}))} />

          {error && <div className="field-error">{error}</div>}
          {ok && <div className="mt-2">{ok}</div>}
          <button className="btn">Save Changes</button>
        </form>
      </div>
    </div>
  );
}
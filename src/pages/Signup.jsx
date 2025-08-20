import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', mobile: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { signup } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signup(form.name, form.email, form.mobile, form.password);
      navigate('/login');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Create an Account</h2>
        <form className="form" onSubmit={handleSubmit}>
          <label className="label">Name</label>
          <input className="input" value={form.name} onChange={e=>setForm(f=>({...f, name:e.target.value}))} required />

          <label className="label">Email</label>
          <input type="email" className="input" value={form.email} onChange={e=>setForm(f=>({...f, email:e.target.value}))} required />

          <label className="label">Mobile</label>
          <input className="input" value={form.mobile} onChange={e=>setForm(f=>({...f, mobile:e.target.value}))} />

          <label className="label">Password</label>
          <input type="password" className="input" value={form.password} onChange={e=>setForm(f=>({...f, password:e.target.value}))} required />

          {error && <div className="field-error">{error}</div>}
          <button className="btn">Sign Up</button>
        </form>
      </div>
    </div>
  );
}
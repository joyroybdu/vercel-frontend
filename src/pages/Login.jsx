import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Login</h2>
        <form className="form" onSubmit={handleSubmit}>
          <label className="label">Email</label>
          <input type="email" className="input" value={form.email} onChange={e=>setForm(f=>({...f, email:e.target.value}))} required />

          <label className="label">Password</label>
          <input type="password" className="input" value={form.password} onChange={e=>setForm(f=>({...f, password:e.target.value}))} required />

          {error && <div className="field-error">{error}</div>}
          <button className="btn">Login</button>
        </form>
      </div>
    </div>
  );
}
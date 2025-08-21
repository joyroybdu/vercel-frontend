import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// Import DOMPurify for sanitization
import DOMPurify from 'dompurify';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', mobile: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signup } = useAuth();

  // Password Strength Regex
  const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Sanitize inputs against XSS
    const safeForm = {
      name: DOMPurify.sanitize(form.name),
      email: DOMPurify.sanitize(form.email),
      mobile: DOMPurify.sanitize(form.mobile),
      password: form.password,
      confirmPassword: form.confirmPassword,
    };

    // Frontend validation
    if (!strongPassword.test(safeForm.password)) {
      setError("Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.");
      return;
    }
    if (safeForm.password !== safeForm.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await signup(safeForm.name, safeForm.email, safeForm.mobile, safeForm.password);
      navigate('/login');
    } catch (err) {
      setError(err.message || "Failed to sign up");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Create an Account</h2>
        <form className="form" onSubmit={handleSubmit}>
          <label className="label" htmlFor="name">Name</label>
          <input id="name" className="input" value={form.name} 
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />

          <label className="label" htmlFor="email">Email</label>
          <input id="email" type="email" className="input" value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />

          <label className="label" htmlFor="mobile">Mobile</label>
          <input id="mobile" className="input" value={form.mobile}
            onChange={e => setForm(f => ({ ...f, mobile: e.target.value }))} />

          <label className="label" htmlFor="password">Password</label>
          <input id="password" type="password" className="input" value={form.password}
            onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />

          <label className="label" htmlFor="confirmPassword">Confirm Password</label>
          <input id="confirmPassword" type="password" className="input" value={form.confirmPassword}
            onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))} required />

          {error && <div className="field-error">{error}</div>}
          <button className="btn" disabled={loading}>
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}

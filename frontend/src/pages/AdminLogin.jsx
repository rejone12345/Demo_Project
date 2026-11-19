import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please provide both email and password.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Logged in successfully! The backend sets an httpOnly cookie
        navigate('/admin/dashboard');
      } else {
        setError(data.error || 'Invalid email or password.');
      }
    } catch (err) {
      setError('Network error. Make sure your backend server is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '420px', margin: '3rem auto', background: '#fff', padding: '2rem', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)' }}>
      <h2 style={{ textAlign: 'center', color: '#0044cc', marginBottom: '0.5rem' }}>Admin Portal</h2>
      <p style={{ textAlign: 'center', color: '#666', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
        Log in to manage student registrations
      </p>

      {error && (
        <div style={{ background: '#fdf2f2', border: '1px solid #f8b4b4', color: '#9b1c1c', padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.9rem' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '1.2rem' }}>
          <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.3rem' }}>Email Address</label>
          <input
            type="email"
            placeholder="admin@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '0.7rem', borderRadius: '6px', border: '1px solid #ccc', fontSize: '1rem', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.3rem' }}>Password</label>
          <input
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '0.7rem', borderRadius: '6px', border: '1px solid #ccc', fontSize: '1rem', boxSizing: 'border-box' }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '0.8rem',
            background: loading ? '#8cb3f5' : '#0044cc',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Logging in...' : 'Sign In'}
        </button>
      </form>

      <div style={{ marginTop: '1.5rem', background: '#f8fafc', padding: '0.8rem', borderRadius: '6px', fontSize: '0.85rem', color: '#64748b' }}>
        <strong>Default Credentials:</strong><br />
        Email: <code>admin@example.com</code><br />
        Password: <code>ChangeMe123!</code>
      </div>
    </div>
  );
}

export default AdminLogin;

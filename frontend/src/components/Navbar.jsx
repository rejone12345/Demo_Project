import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.2rem' }}>
          🎓 Student Portal
        </Link>
      </div>
      <div className="links">
        <Link to="/">Home</Link>
        <Link to="/register">Register</Link>
        <Link to="/admin/login" style={{ background: 'rgba(255,255,255,0.2)', padding: '0.35rem 0.75rem', borderRadius: '4px' }}>
          Admin
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;

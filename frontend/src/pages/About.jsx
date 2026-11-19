import React from 'react';
import { Link } from 'react-router-dom';

function About() {
  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', background: '#fff', padding: '2.5rem', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.06)' }}>
      <h1 style={{ color: '#0044cc', marginBottom: '0.8rem', fontSize: '1.8rem' }}>About Our Portal</h1>
      <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
        Welcome to the <strong>Student Registration Management System</strong>. Our platform provides a modern, centralized solution for student enrollments, record verifications, and institutional admissions.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.2rem', marginBottom: '2rem' }}>
        <div style={{ background: '#f8fafc', padding: '1.2rem', borderRadius: '8px', borderLeft: '4px solid #0044cc' }}>
          <h3 style={{ color: '#1e293b', fontSize: '1.1rem', marginBottom: '0.4rem' }}>⚡ Instant Submission</h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.5', margin: 0 }}>
            Students can quickly submit their personal records online and immediately receive a unique reference ID.
          </p>
        </div>

        <div style={{ background: '#f8fafc', padding: '1.2rem', borderRadius: '8px', borderLeft: '4px solid #059669' }}>
          <h3 style={{ color: '#1e293b', fontSize: '1.1rem', marginBottom: '0.4rem' }}>🔒 Secure & Protected</h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.5', margin: 0 }}>
            All registration data is stored in MongoDB Atlas with encrypted TLS transfer, rate limiting, and HTTP-only sessions.
          </p>
        </div>

        <div style={{ background: '#f8fafc', padding: '1.2rem', borderRadius: '8px', borderLeft: '4px solid #d97706' }}>
          <h3 style={{ color: '#1e293b', fontSize: '1.1rem', marginBottom: '0.4rem' }}>📊 Admin Control</h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.5', margin: 0 }}>
            Institutional administrators have dedicated tools to review, filter, approve, reject, or export registrations to CSV.
          </p>
        </div>
      </div>

      <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', padding: '1.2rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h4 style={{ margin: '0 0 0.3rem 0', color: '#1e40af' }}>Ready to register?</h4>
          <p style={{ margin: 0, color: '#3b82f6', fontSize: '0.9rem' }}>It takes only 2 minutes to complete your submission.</p>
        </div>
        <Link
          to="/register"
          style={{ background: '#0044cc', color: '#fff', padding: '0.65rem 1.2rem', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.95rem' }}
        >
          Go to Registration Form →
        </Link>
      </div>
    </div>
  );
}

export default About;

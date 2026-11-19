import React, { useState } from 'react';

function Registration() {
  const [formData, setFormData] = useState({
    studentName: '',
    fatherName: '',
    motherName: '',
    email: '',
    dateOfBirth: '',
    gender: '',
    address: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [registrationId, setRegistrationId] = useState('');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validate = () => {
    const newErrors = {};
    if (!formData.studentName.trim()) newErrors.studentName = 'Student full name is required.';
    if (!formData.fatherName.trim()) newErrors.fatherName = "Father's name is required.";
    if (!formData.motherName.trim()) newErrors.motherName = "Mother's name is required.";
    if (formData.email.trim() && !emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (!formData.address.trim()) newErrors.address = 'Full address is required.';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error as user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setRegistrationId('');
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);
    try {
      const response = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (response.ok) {
        setSuccessMsg('Registration submitted successfully!');
        setRegistrationId(result.registrationId || 'N/A');
        setFormData({
          studentName: '',
          fatherName: '',
          motherName: '',
          email: '',
          dateOfBirth: '',
          gender: '',
          address: '',
        });
      } else {
        setErrors({ submit: result.message || 'Submission failed. Please check the fields.' });
      }
    } catch (err) {
      setErrors({ submit: 'Network error. Please make sure the backend server is running.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '640px', margin: '2rem auto', background: '#fff', padding: '2rem', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
      <h2 style={{ color: '#0044cc', marginBottom: '0.5rem', textAlign: 'center' }}>Student Registration Form</h2>
      <p style={{ color: '#666', textAlign: 'center', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
        Please fill out your personal information carefully.
      </p>

      {successMsg && (
        <div style={{ background: '#e6f7ec', border: '1px solid #a3e2bb', color: '#155724', padding: '1rem', borderRadius: '6px', marginBottom: '1.5rem' }}>
          <p style={{ fontWeight: 'bold', margin: '0 0 0.25rem 0' }}>✅ {successMsg}</p>
          <p style={{ margin: 0 }}>Reference ID: <strong style={{ color: '#0044cc' }}>{registrationId}</strong></p>
        </div>
      )}

      {errors.submit && (
        <div style={{ background: '#fdf2f2', border: '1px solid #f8b4b4', color: '#9b1c1c', padding: '0.8rem', borderRadius: '6px', marginBottom: '1.5rem' }}>
          {errors.submit}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div style={{ marginBottom: '1.2rem' }}>
          <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.3rem' }}>
            Student Full Name <span style={{ color: '#e02424' }}>*</span>
          </label>
          <input
            type="text"
            name="studentName"
            placeholder="e.g. Mohammad Rahim"
            value={formData.studentName}
            onChange={handleChange}
            style={{ width: '100%', padding: '0.7rem', borderRadius: '6px', border: '1px solid #ccc', fontSize: '1rem', boxSizing: 'border-box' }}
          />
          {errors.studentName && <span style={{ color: '#e02424', fontSize: '0.85rem' }}>{errors.studentName}</span>}
        </div>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: '1', minWidth: '240px', marginBottom: '1.2rem' }}>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.3rem' }}>
              Father's Name <span style={{ color: '#e02424' }}>*</span>
            </label>
            <input
              type="text"
              name="fatherName"
              placeholder="e.g. Abdul Karim"
              value={formData.fatherName}
              onChange={handleChange}
              style={{ width: '100%', padding: '0.7rem', borderRadius: '6px', border: '1px solid #ccc', fontSize: '1rem', boxSizing: 'border-box' }}
            />
            {errors.fatherName && <span style={{ color: '#e02424', fontSize: '0.85rem' }}>{errors.fatherName}</span>}
          </div>

          <div style={{ flex: '1', minWidth: '240px', marginBottom: '1.2rem' }}>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.3rem' }}>
              Mother's Name <span style={{ color: '#e02424' }}>*</span>
            </label>
            <input
              type="text"
              name="motherName"
              placeholder="e.g. Fatema Begum"
              value={formData.motherName}
              onChange={handleChange}
              style={{ width: '100%', padding: '0.7rem', borderRadius: '6px', border: '1px solid #ccc', fontSize: '1rem', boxSizing: 'border-box' }}
            />
            {errors.motherName && <span style={{ color: '#e02424', fontSize: '0.85rem' }}>{errors.motherName}</span>}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: '1', minWidth: '240px', marginBottom: '1.2rem' }}>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.3rem' }}>
              Email Address (optional)
            </label>
            <input
              type="email"
              name="email"
              placeholder="e.g. student@example.com"
              value={formData.email}
              onChange={handleChange}
              style={{ width: '100%', padding: '0.7rem', borderRadius: '6px', border: '1px solid #ccc', fontSize: '1rem', boxSizing: 'border-box' }}
            />
            {errors.email && <span style={{ color: '#e02424', fontSize: '0.85rem' }}>{errors.email}</span>}
          </div>

          <div style={{ flex: '1', minWidth: '240px', marginBottom: '1.2rem' }}>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.3rem' }}>
              Date of Birth (optional)
            </label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              style={{ width: '100%', padding: '0.7rem', borderRadius: '6px', border: '1px solid #ccc', fontSize: '1rem', boxSizing: 'border-box' }}
            />
          </div>
        </div>

        <div style={{ marginBottom: '1.2rem' }}>
          <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.3rem' }}>
            Gender (optional)
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            style={{ width: '100%', padding: '0.7rem', borderRadius: '6px', border: '1px solid #ccc', fontSize: '1rem', boxSizing: 'border-box', background: '#fff' }}
          >
            <option value="">-- Select Gender --</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.3rem' }}>
            Full Address <span style={{ color: '#e02424' }}>*</span>
          </label>
          <textarea
            name="address"
            rows={3}
            placeholder="Village/House, Road, Thana/Upazila, District"
            value={formData.address}
            onChange={handleChange}
            style={{ width: '100%', padding: '0.7rem', borderRadius: '6px', border: '1px solid #ccc', fontSize: '1rem', boxSizing: 'border-box' }}
          />
          {errors.address && <span style={{ color: '#e02424', fontSize: '0.85rem' }}>{errors.address}</span>}
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '0.85rem',
            background: loading ? '#8cb3f5' : '#0044cc',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            fontSize: '1.05rem',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background 0.2s'
          }}
        >
          {loading ? 'Submitting Registration...' : 'Submit Registration'}
        </button>
      </form>
    </div>
  );
}

export default Registration;

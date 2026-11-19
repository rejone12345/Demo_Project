import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const [admin, setAdmin] = useState(null);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const navigate = useNavigate();

  // Check auth and fetch initial data
  const fetchData = async () => {
    try {
      setLoading(true);
      // 1. Verify admin session
      const authRes = await fetch('/api/admin/auth/me');
      if (!authRes.ok) {
        navigate('/admin/login');
        return;
      }
      const authData = await authRes.json();
      setAdmin(authData.admin);

      // 2. Fetch stats
      const statsRes = await fetch('/api/admin/dashboard/stats');
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      // 3. Fetch registrations with search/filter
      let url = `/api/admin/registrations?status=${statusFilter}`;
      if (searchTerm.trim()) {
        url += `&search=${encodeURIComponent(searchTerm.trim())}`;
      }
      const regRes = await fetch(url);
      if (regRes.ok) {
        const regData = await regRes.json();
        setRegistrations(regData.registrations || []);
      }
    } catch (err) {
      setError('Failed to connect to backend server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchData();
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/admin/registrations/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchData(); // refresh
      } else {
        alert('Failed to update status');
      }
    } catch (err) {
      alert('Error updating status');
    }
  };

  const handleDelete = async (id, studentName) => {
    if (!window.confirm(`Are you sure you want to delete registration for "${studentName}"?`)) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/registrations/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchData();
      } else {
        alert('Failed to delete registration');
      }
    } catch (err) {
      alert('Error deleting registration');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } finally {
      navigate('/admin/login');
    }
  };

  if (loading && !admin) {
    return <div style={{ textAlign: 'center', padding: '3rem' }}>Checking admin authentication...</div>;
  }

  return (
    <div style={{ padding: '1rem 0' }}>
      {/* Header bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', background: '#fff', padding: '1.2rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <div>
          <h2 style={{ margin: 0, color: '#1e3a8a' }}>Admin Dashboard</h2>
          <span style={{ fontSize: '0.9rem', color: '#64748b' }}>Logged in as: <strong>{admin?.email}</strong></span>
        </div>
        <button
          onClick={handleLogout}
          style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '0.55rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Logout
        </button>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ background: '#fff', padding: '1.2rem', borderRadius: '8px', textAlign: 'center', borderLeft: '4px solid #3b82f6', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#1e40af' }}>{stats.total}</div>
          <div style={{ color: '#64748b', fontSize: '0.9rem' }}>Total Registrations</div>
        </div>
        <div style={{ background: '#fff', padding: '1.2rem', borderRadius: '8px', textAlign: 'center', borderLeft: '4px solid #eab308', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#a16207' }}>{stats.pending}</div>
          <div style={{ color: '#64748b', fontSize: '0.9rem' }}>Pending</div>
        </div>
        <div style={{ background: '#fff', padding: '1.2rem', borderRadius: '8px', textAlign: 'center', borderLeft: '4px solid #22c55e', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#15803d' }}>{stats.approved}</div>
          <div style={{ color: '#64748b', fontSize: '0.9rem' }}>Approved</div>
        </div>
        <div style={{ background: '#fff', padding: '1.2rem', borderRadius: '8px', textAlign: 'center', borderLeft: '4px solid #ef4444', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#b91c1c' }}>{stats.rejected}</div>
          <div style={{ color: '#64748b', fontSize: '0.9rem' }}>Rejected</div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', background: '#fff', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem', flex: '1', minWidth: '260px' }}>
          <input
            type="text"
            placeholder="Search by student name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ flex: 1, padding: '0.6rem', border: '1px solid #cbd5e1', borderRadius: '6px' }}
          />
          <button type="submit" style={{ padding: '0.6rem 1rem', background: '#0044cc', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
            Search
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.9rem', color: '#475569', fontWeight: '600' }}>Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: '0.6rem', border: '1px solid #cbd5e1', borderRadius: '6px', background: '#fff' }}
          >
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
          <a
            href="/api/admin/registrations/export"
            download
            style={{ display: 'inline-block', padding: '0.6rem 1rem', background: '#059669', color: '#fff', borderRadius: '6px', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 'bold' }}
          >
            Export CSV
          </a>
        </div>
      </div>

      {/* Registrations Table */}
      <div style={{ background: '#fff', borderRadius: '8px', overflowX: 'auto', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        {registrations.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2.5rem', color: '#64748b' }}>
            No registrations found.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '0.9rem 1rem', fontSize: '0.85rem', color: '#475569' }}>REF ID</th>
                <th style={{ padding: '0.9rem 1rem', fontSize: '0.85rem', color: '#475569' }}>Student Name</th>
                <th style={{ padding: '0.9rem 1rem', fontSize: '0.85rem', color: '#475569' }}>Father / Mother</th>
                <th style={{ padding: '0.9rem 1rem', fontSize: '0.85rem', color: '#475569' }}>Address</th>
                <th style={{ padding: '0.9rem 1rem', fontSize: '0.85rem', color: '#475569' }}>Status</th>
                <th style={{ padding: '0.9rem 1rem', fontSize: '0.85rem', color: '#475569', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((item) => (
                <tr key={item.registrationId || item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.8rem 1rem', fontFamily: 'monospace', fontSize: '0.85rem', color: '#0044cc', fontWeight: 'bold' }}>
                    {item.registrationId}
                  </td>
                  <td style={{ padding: '0.8rem 1rem', fontWeight: '600' }}>
                    {item.studentName}
                    {item.email && <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'normal' }}>{item.email}</div>}
                  </td>
                  <td style={{ padding: '0.8rem 1rem', fontSize: '0.85rem', color: '#334155' }}>
                    {item.fatherName} / {item.motherName}
                  </td>
                  <td style={{ padding: '0.8rem 1rem', fontSize: '0.85rem', color: '#475569', maxWidth: '200px' }}>
                    {item.address}
                  </td>
                  <td style={{ padding: '0.8rem 1rem' }}>
                    <span style={{
                      padding: '0.3rem 0.6rem',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      background: item.status === 'Approved' ? '#dcfce7' : item.status === 'Rejected' ? '#fee2e2' : '#fef9c3',
                      color: item.status === 'Approved' ? '#166534' : item.status === 'Rejected' ? '#991b1b' : '#854d0e',
                    }}>
                      {item.status}
                    </span>
                  </td>
                  <td style={{ padding: '0.8rem 1rem', textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                      {item.status !== 'Approved' && (
                        <button
                          onClick={() => handleStatusChange(item.registrationId, 'Approved')}
                          style={{ background: '#22c55e', color: '#fff', border: 'none', padding: '0.35rem 0.65rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}
                        >
                          Approve
                        </button>
                      )}
                      {item.status !== 'Rejected' && (
                        <button
                          onClick={() => handleStatusChange(item.registrationId, 'Rejected')}
                          style={{ background: '#f59e0b', color: '#fff', border: 'none', padding: '0.35rem 0.65rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}
                        >
                          Reject
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(item.registrationId, item.studentName)}
                        style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '0.35rem 0.65rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;

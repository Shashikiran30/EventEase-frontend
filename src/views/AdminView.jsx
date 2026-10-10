import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Building, 
  Layers, 
  BarChart3, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Sparkles,
  Ticket
} from 'lucide-react';
import api from '../api/client';

export const AdminView = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [venues, setVenues] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [activeTab, setActiveTab] = useState('STATS');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      setLoading(true);
      try {
        const [statsRes, userRes, venueRes, deptRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/users'),
          api.get('/venues'),
          api.get('/admin/departments')
        ]);
        setStats(statsRes.data);
        setUsers(userRes.data);
        setVenues(venueRes.data);
        setDepartments(deptRes.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '2px 8px', borderRadius: 4, background: '#ede9fe', color: '#6d28d9' }}>
            ADMINISTRATION & EXECUTIVE OVERSIGHT
          </span>
        </div>
        <h1 style={{ fontSize: '1.85rem', color: '#0f172a' }}>
          Campus Event Administration
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
          System telemetry, user directory, venue infrastructure, and departmental approval governance.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
        {[
          { id: 'STATS', label: 'System Analytics' },
          { id: 'USERS', label: `Users (${users.length})` },
          { id: 'VENUES', label: `Venues (${venues.length})` },
          { id: 'DEPTS', label: `Departments (${departments.length})` },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              border: 'none',
              background: activeTab === t.id ? '#4f46e5' : '#f1f5f9',
              color: activeTab === t.id ? '#ffffff' : '#475569',
              padding: '6px 14px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab: Analytics */}
      {activeTab === 'STATS' && stats && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem'
          }}>
            <div className="glass-panel" style={{ padding: '1.25rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>TOTAL EVENTS</span>
              <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', margin: '4px 0' }}>{stats.totalEvents}</div>
              <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Submissions to date</span>
            </div>

            <div className="glass-panel" style={{ padding: '1.25rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#b45309' }}>PENDING REVIEWS</span>
              <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', margin: '4px 0' }}>{stats.pendingApprovals}</div>
              <span style={{ fontSize: '0.72rem', color: '#64748b' }}>In approval pipeline</span>
            </div>

            <div className="glass-panel" style={{ padding: '1.25rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#047857' }}>FULLY APPROVED</span>
              <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', margin: '4px 0' }}>{stats.approvedEvents}</div>
              <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Ready to publish</span>
            </div>

            <div className="glass-panel" style={{ padding: '1.25rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6d28d9' }}>LIVE PUBLISHED</span>
              <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', margin: '4px 0' }}>{stats.publishedEvents}</div>
              <span style={{ fontSize: '0.72rem', color: '#64748b' }}>On college calendar</span>
            </div>

            <div className="glass-panel" style={{ padding: '1.25rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0284c7' }}>STUDENT REGISTRATIONS</span>
              <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', margin: '4px 0' }}>{stats.totalRegistrations}</div>
              <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Passes issued</span>
            </div>
          </div>

          {/* Breakdown grids */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.05rem', color: '#0f172a', marginBottom: '1rem' }}>
                Events by Category
              </h3>
              {Object.entries(stats.eventsByCategory || {}).map(([cat, cnt]) => (
                <div key={cat} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #f1f5f9', fontSize: '0.85rem' }}>
                  <span style={{ fontWeight: 600, color: '#334155' }}>{cat}</span>
                  <span style={{ fontWeight: 700, color: '#4f46e5' }}>{cnt}</span>
                </div>
              ))}
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.05rem', color: '#0f172a', marginBottom: '1rem' }}>
                Events by Department
              </h3>
              {Object.entries(stats.eventsByDepartment || {}).map(([dept, cnt]) => (
                <div key={dept} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #f1f5f9', fontSize: '0.85rem' }}>
                  <span style={{ fontWeight: 600, color: '#334155' }}>{dept}</span>
                  <span style={{ fontWeight: 700, color: '#4f46e5' }}>{cnt}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Users Directory */}
      {activeTab === 'USERS' && (
        <div className="glass-panel" style={{ overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead style={{ background: '#f8fafc', borderBottom: '1px solid var(--border-color)' }}>
              <tr>
                <th style={{ padding: '0.75rem 1.25rem', color: '#64748b' }}>Full Name</th>
                <th style={{ padding: '0.75rem 1.25rem', color: '#64748b' }}>Username</th>
                <th style={{ padding: '0.75rem 1.25rem', color: '#64748b' }}>Email</th>
                <th style={{ padding: '0.75rem 1.25rem', color: '#64748b' }}>Role</th>
                <th style={{ padding: '0.75rem 1.25rem', color: '#64748b' }}>Department</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.75rem 1.25rem', fontWeight: 600, color: '#0f172a' }}>{u.fullName}</td>
                  <td style={{ padding: '0.75rem 1.25rem', color: '#64748b' }}>{u.username}</td>
                  <td style={{ padding: '0.75rem 1.25rem', color: '#64748b' }}>{u.email}</td>
                  <td style={{ padding: '0.75rem 1.25rem' }}>
                    <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: '0.72rem', fontWeight: 700, background: '#e0e7ff', color: '#4338ca' }}>
                      {u.role.replace('ROLE_', '')}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem 1.25rem', color: '#64748b' }}>{u.departmentName || 'Campus Wide'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab: Venues */}
      {activeTab === 'VENUES' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {venues.map(v => (
            <div key={v.id} className="glass-panel" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <h3 style={{ fontSize: '1.05rem', color: '#0f172a' }}>{v.name}</h3>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '2px 8px', borderRadius: 9999, background: '#ecfdf5', color: '#047857' }}>
                  Capacity: {v.capacity} pax
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: 8 }}>
                Location: {v.location}
              </p>
              <div style={{ fontSize: '0.75rem', color: '#475569', background: '#f8fafc', padding: '0.5rem', borderRadius: 6 }}>
                <strong>Facilities:</strong> {v.facilities}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Departments */}
      {activeTab === 'DEPTS' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {departments.map(d => (
            <div key={d.id} className="glass-panel" style={{ padding: '1.25rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '2px 6px', borderRadius: 4, background: '#e0e7ff', color: '#4338ca' }}>
                {d.code}
              </span>
              <h3 style={{ fontSize: '1.05rem', color: '#0f172a', margin: '6px 0 4px' }}>{d.name}</h3>
              <p style={{ fontSize: '0.8rem', color: '#64748b' }}>{d.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

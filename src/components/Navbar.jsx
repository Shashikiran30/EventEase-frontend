import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Bell, Calendar, LogOut, Check } from 'lucide-react';
import api from '../api/client';

export const Navbar = ({ onOpenNotifications }) => {
  const { user, quickLogin, logout } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnread = async () => {
    try {
      const res = await api.get('/notifications/unread-count');
      setUnreadCount(res.data.unreadCount || 0);
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => {
    fetchUnread();
    const interval = setInterval(fetchUnread, 15000);
    return () => clearInterval(interval);
  }, [user]);

  const testAccounts = [
    { username: 'student', label: 'Student', role: 'ROLE_STUDENT', desc: 'Organizer' },
    { username: 'hod_cse', label: 'HOD', role: 'ROLE_HOD', desc: 'Dept Approver' },
    { username: 'dean', label: 'Dean', role: 'ROLE_DEAN', desc: 'Academic Reviewer' },
    { username: 'finance', label: 'Finance', role: 'ROLE_FINANCE_OFFICER', desc: 'Budget Officer' },
    { username: 'admin', label: 'Admin', role: 'ROLE_ADMIN', desc: 'System Admin' },
  ];

  return (
    <header style={{
      background: '#ffffff',
      borderBottom: '1px solid var(--border-color)',
      padding: '0.75rem 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: 'var(--shadow-sm)'
    }}>
      {/* Brand Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        <div style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
        }}>
          <Calendar size={22} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-display)', background: 'linear-gradient(135deg, #1e1b4b 0%, #4338ca 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              EventEase
            </span>
            <span style={{ fontSize: '0.68rem', fontWeight: 700, padding: '2px 8px', borderRadius: 9999, background: '#e0e7ff', color: '#4338ca' }}>
              SMART APPROVAL
            </span>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            College Event & Multi-Level Sanction Workflow
          </span>
        </div>
      </div>

      {/* Role Switcher Toolbar (Demo/Testing Convenience) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: '#f8fafc', padding: '4px 6px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', padding: '0 6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Role Switch:
        </span>
        {testAccounts.map((acc) => {
          const isActive = user?.username === acc.username;
          return (
            <button
              key={acc.username}
              onClick={() => quickLogin(acc.username)}
              style={{
                border: 'none',
                background: isActive ? '#4f46e5' : 'transparent',
                color: isActive ? '#ffffff' : '#475569',
                padding: '4px 10px',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontWeight: isActive ? 700 : 500,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
              title={`Switch to ${acc.label} (${acc.desc})`}
            >
              {acc.label}
              {isActive && <Check size={11} strokeWidth={3} />}
            </button>
          );
        })}
      </div>

      {/* User Actions & Notification Bell */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        {/* Notification Bell */}
        <button
          onClick={onOpenNotifications}
          style={{
            position: 'relative',
            background: '#f8fafc',
            border: '1px solid var(--border-color)',
            padding: '8px',
            borderRadius: '10px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#334155',
            transition: 'all 0.15s'
          }}
          title="Notifications"
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span style={{
              position: 'absolute',
              top: -4,
              right: -4,
              background: '#ef4444',
              color: 'white',
              fontSize: '0.65rem',
              fontWeight: 800,
              width: 18,
              height: 18,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid white'
            }}>
              {unreadCount}
            </span>
          )}
        </button>

        {/* Profile Card */}
        {user && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '4px 12px 4px 6px',
            background: '#f1f5f9',
            borderRadius: '10px',
            border: '1px solid var(--border-color)'
          }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: '8px',
              background: '#6366f1',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.85rem'
            }}>
              {user.fullName ? user.fullName[0].toUpperCase() : 'U'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>
                {user.fullName}
              </span>
              <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                {user.role.replace('ROLE_', '')} {user.departmentCode ? `• ${user.departmentCode}` : ''}
              </span>
            </div>
          </div>
        )}

        {/* Logout Button */}
        {user && (
          <button
            id="logout-btn"
            onClick={logout}
            style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '10px',
              padding: '8px 12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: '#b91c1c',
              fontSize: '0.78rem',
              fontWeight: 600,
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#fee2e2'; e.currentTarget.style.borderColor = '#fca5a5'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.borderColor = '#fecaca'; }}
            title="Sign out"
          >
            <LogOut size={15} />
            <span>Sign Out</span>
          </button>
        )}
      </div>
    </header>
  );
};

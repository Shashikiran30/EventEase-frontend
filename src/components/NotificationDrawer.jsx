import React, { useState, useEffect } from 'react';
import { X, Check, Bell, BellOff, Info, AlertTriangle, CheckCircle } from 'lucide-react';
import api from '../api/client';

export const NotificationDrawer = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (e) {
      console.error(e);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (e) {
      console.error(e);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: 420,
          maxWidth: '100vw',
          maxHeight: '100vh',
          borderRadius: 0,
          display: 'flex',
          flexDirection: 'column',
          margin: 0,
          animation: 'fadeIn 0.2s ease-out'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#f8fafc'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Bell size={20} color="#4f46e5" />
            <h3 style={{ fontSize: '1.05rem', color: '#0f172a' }}>
              Notifications
            </h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {notifications.some(n => !n.isRead) && (
              <button
                className="btn btn-secondary btn-sm"
                onClick={markAllAsRead}
                style={{ fontSize: '0.75rem' }}
              >
                <Check size={12} /> Mark All Read
              </button>
            )}
            <button
              onClick={onClose}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
              Loading alerts...
            </div>
          ) : notifications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#94a3b8' }}>
              <BellOff size={36} style={{ margin: '0 auto 0.75rem', opacity: 0.5 }} />
              <p style={{ fontSize: '0.9rem' }}>No notifications to display right now.</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => markAsRead(n.id)}
                style={{
                  padding: '0.9rem',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '0.65rem',
                  background: n.isRead ? '#ffffff' : '#f0fdf4',
                  border: n.isRead ? '1px solid var(--border-color)' : '1px solid #bbf7d0',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: n.isRead ? 600 : 700, color: '#0f172a' }}>
                    {n.title}
                  </span>
                  {!n.isRead && (
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', marginTop: 4 }} />
                  )}
                </div>
                <p style={{ fontSize: '0.8rem', color: '#475569', lineHeight: 1.4, marginBottom: 6 }}>
                  {n.message}
                </p>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                  {n.createdAt ? new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' • ' + new Date(n.createdAt).toLocaleDateString() : 'Recent'}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

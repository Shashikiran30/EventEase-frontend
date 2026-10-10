import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Ticket, Calendar, MapPin, QrCode, Eye, CheckCircle2 } from 'lucide-react';
import api from '../api/client';

export const MyRegistrationsView = ({ onOpenTicket }) => {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const res = await api.get('/registrations/my');
      setRegistrations(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, [user]);

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.85rem', color: '#0f172a' }}>
          My Event Passes & Bookings
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
          Your digital admission passes for college workshops, tech events, and fests.
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
          Loading your event passes...
        </div>
      ) : registrations.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <Ticket size={48} style={{ margin: '0 auto 1rem', color: '#cbd5e1' }} />
          <h3 style={{ fontSize: '1.15rem', color: '#334155', marginBottom: 6 }}>
            No tickets reserved yet
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.88rem' }}>
            Check out the Event Calendar to find exciting workshops and register for free admission.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {registrations.map((reg) => (
            <div
              key={reg.id}
              className="glass-panel"
              style={{
                padding: '1.25rem',
                borderTop: '4px solid #4f46e5',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '0.85rem'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#4f46e5', textTransform: 'uppercase' }}>
                    TICKET PASS
                  </span>
                  <span style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 9999,
                    background: '#ecfdf5',
                    color: '#047857'
                  }}>
                    CONFIRMED
                  </span>
                </div>
                <h3 style={{ fontSize: '1.1rem', color: '#0f172a', marginBottom: 8 }}>
                  {reg.eventTitle}
                </h3>

                <div style={{ fontSize: '0.82rem', color: '#64748b', display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Calendar size={14} color="#6366f1" />
                    <span>{reg.eventStartDate ? new Date(reg.eventStartDate).toLocaleDateString() : 'TBD'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <MapPin size={14} color="#6366f1" />
                    <span>{reg.venueName || 'Campus Main Hall'}</span>
                  </div>
                </div>
              </div>

              {/* Barcode & Action */}
              <div style={{
                paddingTop: '0.75rem',
                borderTop: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', fontWeight: 700, color: '#334155' }}>
                  {reg.ticketCode}
                </span>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => onOpenTicket(reg)}
                >
                  <QrCode size={14} /> View Pass
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { X, Calendar, MapPin, User, CheckCircle2, QrCode, Download, Printer } from 'lucide-react';

export const TicketModal = ({ registration, onClose }) => {
  if (!registration) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 480 }}>
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#f8fafc',
          borderTopLeftRadius: 'var(--radius-xl)',
          borderTopRightRadius: 'var(--radius-xl)'
        }}>
          <div>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
              Confirmed Booking Pass
            </span>
            <h3 style={{ fontSize: '1.1rem', color: '#0f172a' }}>
              Student Event Pass
            </h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
            <X size={20} />
          </button>
        </div>

        {/* Digital Ticket Card */}
        <div style={{ padding: '1.5rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
            borderRadius: 'var(--radius-lg)',
            color: 'white',
            padding: '1.5rem',
            position: 'relative',
            boxShadow: '0 10px 25px rgba(30, 27, 75, 0.25)',
            overflow: 'hidden'
          }}>
            {/* Top branding */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#a5b4fc', fontWeight: 700 }}>
                  EventEase Verified Ticket
                </span>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginTop: 2 }}>
                  {registration.eventTitle}
                </h4>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.15)', padding: '4px 10px', borderRadius: 9999, fontSize: '0.72rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                <CheckCircle2 size={12} color="#4ade80" /> CONFIRMED
              </div>
            </div>

            {/* Details Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.9rem', marginBottom: '1.25rem', fontSize: '0.82rem' }}>
              <div>
                <span style={{ color: '#a5b4fc', fontSize: '0.7rem', display: 'block' }}>ATTENDEE NAME</span>
                <strong>{registration.studentName}</strong>
              </div>
              <div>
                <span style={{ color: '#a5b4fc', fontSize: '0.7rem', display: 'block' }}>STUDENT ROLL / ID</span>
                <strong>{registration.studentRollNo || 'N/A'}</strong>
              </div>
              <div>
                <span style={{ color: '#a5b4fc', fontSize: '0.7rem', display: 'block' }}>VENUE</span>
                <span>{registration.venueName || 'Campus Main Hall'}</span>
              </div>
              <div>
                <span style={{ color: '#a5b4fc', fontSize: '0.7rem', display: 'block' }}>DATE & TIME</span>
                <span>{registration.eventStartDate ? new Date(registration.eventStartDate).toLocaleDateString() : 'TBD'}</span>
              </div>
            </div>

            {/* Divider dashed line */}
            <div style={{ borderTop: '2px dashed rgba(255, 255, 255, 0.2)', margin: '1rem 0' }} />

            {/* Ticket Code and Barcode Box */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span style={{ color: '#a5b4fc', fontSize: '0.7rem', display: 'block' }}>TICKET SERIAL CODE</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.95rem', fontWeight: 700, letterSpacing: '0.05em' }}>
                  {registration.ticketCode}
                </span>
              </div>
              <div style={{
                background: 'white',
                color: '#1e1b4b',
                padding: '6px 10px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontWeight: 800,
                fontSize: '0.75rem'
              }}>
                <QrCode size={18} /> SCAN QR
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '1rem 1.5rem',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-between',
          background: '#f8fafc',
          borderBottomLeftRadius: 'var(--radius-xl)',
          borderBottomRightRadius: 'var(--radius-xl)'
        }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => window.print()}
          >
            <Printer size={14} /> Print Pass
          </button>
          <button className="btn btn-primary btn-sm" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

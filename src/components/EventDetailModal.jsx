import React from 'react';
import { X, Calendar, Clock, MapPin, Building, Users, IndianRupee, Sparkles, History, Ticket } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

export const EventDetailModal = ({ event, onClose, onOpenTimeline, onRegister, onEdit }) => {
  if (!event) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 700 }}>
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.75rem',
          borderBottom: '1px solid var(--border-color)',
          background: '#f8fafc',
          borderTopLeftRadius: 'var(--radius-xl)',
          borderTopRightRadius: 'var(--radius-xl)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
              {event.category} • {event.departmentName}
            </span>
            <h3 style={{ fontSize: '1.25rem', color: '#0f172a', marginTop: 2 }}>
              {event.title}
            </h3>
          </div>
          <StatusBadge status={event.status} />
        </div>

        {/* Body */}
        <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <h4 style={{ fontSize: '0.9rem', color: '#1e293b', marginBottom: 4 }}>
              Description
            </h4>
            <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.5 }}>
              {event.description}
            </p>
          </div>

          {event.objectives && (
            <div style={{ background: '#f8fafc', padding: '0.9rem 1.1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <h4 style={{ fontSize: '0.85rem', color: '#1e293b', marginBottom: 4 }}>
                Objectives & Outcomes
              </h4>
              <p style={{ fontSize: '0.82rem', color: '#334155', whiteSpace: 'pre-line', lineHeight: 1.4 }}>
                {event.objectives}
              </p>
            </div>
          )}

          {/* Logistics Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.85rem' }}>
            <div style={{ background: '#ffffff', padding: '0.9rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, display: 'block' }}>RESERVED VENUE</span>
              <strong>{event.venueName}</strong>
              <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748b' }}>
                {event.venueLocation} (Cap: {event.venueCapacity} pax)
              </span>
            </div>

            <div style={{ background: '#ffffff', padding: '0.9rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, display: 'block' }}>SCHEDULE</span>
              <strong>{event.startDate ? new Date(event.startDate).toLocaleDateString() : 'TBD'}</strong>
              <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748b' }}>
                {event.startDate ? new Date(event.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''} - {event.endDate ? new Date(event.endDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
              </span>
            </div>

            <div style={{ background: '#ffffff', padding: '0.9rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, display: 'block' }}>BUDGET SANCTION</span>
              <strong>₹{event.budget?.toLocaleString() || '0'}</strong>
              {event.budgetBreakdown && (
                <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', marginTop: 2 }}>
                  Breakdown: {event.budgetBreakdown}
                </span>
              )}
            </div>

            <div style={{ background: '#ffffff', padding: '0.9rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, display: 'block' }}>ORGANIZER & COORD</span>
              <strong>{event.organizerName}</strong>
              <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748b' }}>
                {event.coordinatorName ? `Coord: ${event.coordinatorName}` : 'Faculty Coord: Assigned'}
              </span>
            </div>
          </div>

          {/* AI Briefing if available */}
          {event.aiSummary && (
            <div style={{
              background: '#f5f3ff',
              border: '1px solid #ddd6fe',
              borderRadius: 'var(--radius-md)',
              padding: '0.9rem 1.1rem',
              fontSize: '0.82rem',
              color: '#5b21b6'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <Sparkles size={14} color="#7c3aed" />
                <strong>AI Executive Proposal Brief:</strong>
              </div>
              <p style={{ whiteSpace: 'pre-line' }}>{event.aiSummary}</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div style={{
          padding: '1rem 1.75rem',
          borderTop: '1px solid var(--border-color)',
          background: '#f8fafc',
          borderBottomLeftRadius: 'var(--radius-xl)',
          borderBottomRightRadius: 'var(--radius-xl)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <button className="btn btn-secondary btn-sm" onClick={() => onOpenTimeline(event)}>
            <History size={14} /> Full Audit History ({event.approvalHistory?.length || 0})
          </button>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {event.status === 'CHANGES_REQUESTED' && onEdit && (
              <button className="btn btn-primary btn-sm" onClick={() => onEdit(event)}>
                Revise Proposal
              </button>
            )}

            {event.status === 'PUBLISHED' && onRegister && (
              <button className="btn btn-primary btn-sm" onClick={() => onRegister(event.id)}>
                <Ticket size={14} /> Register for Pass
              </button>
            )}

            <button className="btn btn-secondary btn-sm" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

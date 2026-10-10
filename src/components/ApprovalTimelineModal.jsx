import React from 'react';
import { X, CheckCircle, XCircle, AlertCircle, Clock, Send, Sparkles } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

export const ApprovalTimelineModal = ({ event, onClose }) => {
  if (!event) return null;

  const history = event.approvalHistory || [];

  const getActionIcon = (action) => {
    switch (action) {
      case 'APPROVE':
        return <CheckCircle size={18} color="#059669" />;
      case 'REJECT':
        return <XCircle size={18} color="#dc2626" />;
      case 'REQUEST_CHANGES':
        return <AlertCircle size={18} color="#d97706" />;
      case 'SUBMIT':
      case 'RESUBMIT':
        return <Send size={18} color="#4f46e5" />;
      case 'PUBLISH':
        return <Sparkles size={18} color="#7c3aed" />;
      default:
        return <Clock size={18} color="#64748b" />;
    }
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'APPROVE': return '#ecfdf5';
      case 'REJECT': return '#fef2f2';
      case 'REQUEST_CHANGES': return '#fffbeb';
      case 'SUBMIT':
      case 'RESUBMIT': return '#eef2ff';
      case 'PUBLISH': return '#f5f3ff';
      default: return '#f1f5f9';
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 640 }}>
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.75rem',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#f8fafc',
          borderTopLeftRadius: 'var(--radius-xl)',
          borderTopRightRadius: 'var(--radius-xl)'
        }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
              Traceable Audit Log
            </span>
            <h3 style={{ fontSize: '1.15rem', color: '#0f172a', marginTop: 2 }}>
              Approval History & Decision Trail
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '1.5rem 1.75rem' }}>
          {/* Proposal Summary Header */}
          <div style={{
            background: '#ffffff',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            marginBottom: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <h4 style={{ fontSize: '0.95rem', color: '#1e293b', marginBottom: 4 }}>
                {event.title}
              </h4>
              <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                Department: {event.departmentName} • Venue: {event.venueName}
              </span>
            </div>
            <StatusBadge status={event.status} />
          </div>

          {/* Stepper / Timeline List */}
          {history.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#94a3b8' }}>
              <Clock size={36} style={{ margin: '0 auto 0.75rem', opacity: 0.5 }} />
              <p style={{ fontSize: '0.9rem' }}>No approval actions recorded yet for this draft.</p>
            </div>
          ) : (
            <div style={{ position: 'relative', paddingLeft: '1.5rem' }}>
              {/* Vertical line connecting entries */}
              <div style={{
                position: 'absolute',
                left: 17,
                top: 10,
                bottom: 10,
                width: 2,
                background: '#e2e8f0'
              }} />

              {history.map((item, index) => (
                <div key={item.id || index} style={{ position: 'relative', marginBottom: '1.5rem' }}>
                  {/* Icon circle */}
                  <div style={{
                    position: 'absolute',
                    left: -24,
                    top: 0,
                    width: 34,
                    height: 34,
                    borderRadius: '50%',
                    background: getActionColor(item.action),
                    border: '2px solid #ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'var(--shadow-sm)'
                  }}>
                    {getActionIcon(item.action)}
                  </div>

                  {/* Card Content */}
                  <div style={{
                    background: '#ffffff',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.9rem 1rem',
                    boxShadow: 'var(--shadow-sm)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>
                          {item.actorName || 'Authority'}
                        </span>
                        <span style={{
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          padding: '1px 6px',
                          borderRadius: 4,
                          background: '#f1f5f9',
                          color: '#475569'
                        }}>
                          {item.actorRole?.replace('ROLE_', '')}
                        </span>
                      </div>
                      <span style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        color: item.action === 'APPROVE' ? '#059669' : item.action === 'REJECT' ? '#dc2626' : item.action === 'REQUEST_CHANGES' ? '#d97706' : '#4f46e5'
                      }}>
                        {item.action.replace('_', ' ')}
                      </span>
                    </div>

                    {item.comments && (
                      <div style={{
                        margin: '0.4rem 0',
                        padding: '0.5rem 0.75rem',
                        background: '#f8fafc',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.82rem',
                        color: '#334155',
                        borderLeft: '3px solid #6366f1'
                      }}>
                        "{item.comments}"
                      </div>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }}>
                      <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                        {item.timestamp ? new Date(item.timestamp).toLocaleString() : 'Just now'}
                      </span>
                      {item.previousStatus && item.newStatus && (
                        <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                          Status: {item.previousStatus} → <strong>{item.newStatus}</strong>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '1rem 1.75rem',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'flex-end',
          background: '#f8fafc',
          borderBottomLeftRadius: 'var(--radius-xl)',
          borderBottomRightRadius: 'var(--radius-xl)'
        }}>
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

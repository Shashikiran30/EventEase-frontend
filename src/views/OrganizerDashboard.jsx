import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/StatusBadge';
import { 
  PlusCircle, 
  Calendar, 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  ExternalLink, 
  History, 
  Edit3, 
  Sparkles,
  Send,
  Eye,
  Building,
  Tag
} from 'lucide-react';
import api from '../api/client';

export const OrganizerDashboard = ({ onNewProposal, onSelectEvent, onOpenTimeline, onEditProposal }) => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [publishingId, setPublishingId] = useState(null);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await api.get('/events');
      setEvents(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [user]);

  const handlePublish = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to officially publish this approved event to the campus portal and calendar?')) {
      return;
    }
    setPublishingId(id);
    try {
      await api.post(`/events/${id}/publish`);
      await fetchEvents();
      alert('Event successfully published live to the college calendar!');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to publish event');
    } finally {
      setPublishingId(null);
    }
  };

  const filteredEvents = events.filter((e) => {
    if (filter === 'PENDING') {
      return e.status === 'PENDING_HOD' || e.status === 'PENDING_DEAN' || e.status === 'PENDING_FINANCE';
    }
    if (filter === 'REVISION') {
      return e.status === 'CHANGES_REQUESTED' || e.status === 'DRAFT';
    }
    if (filter === 'APPROVED') {
      return e.status === 'APPROVED' || e.status === 'PUBLISHED';
    }
    return true;
  });

  const pendingCount = events.filter(e => e.status.startsWith('PENDING')).length;
  const changesCount = events.filter(e => e.status === 'CHANGES_REQUESTED').length;
  const approvedCount = events.filter(e => e.status === 'APPROVED' || e.status === 'PUBLISHED').length;

  return (
    <div>
      {/* Top Banner / Welcome */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', color: '#0f172a' }}>
            Event Proposals Dashboard
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: 4 }}>
            Create and track college event sanctions across HOD, Dean, and administration workflows.
          </p>
        </div>
        <button className="btn btn-primary" onClick={onNewProposal}>
          <PlusCircle size={18} /> Submit New Proposal
        </button>
      </div>

      {/* Department & Academic Leadership Card */}
      {user?.departmentName && (
        <div className="glass-panel" style={{
          padding: '1.25rem 1.5rem',
          marginBottom: '2rem',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          border: '1px solid var(--border-color)',
          borderLeft: '4px solid #6366f1',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.25rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: '#e0e7ff',
              color: '#4338ca',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1rem'
            }}>
              {user.departmentCode || 'DEPT'}
            </div>
            <div>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Your Academic Department
              </span>
              <h2 style={{ fontSize: '1.15rem', color: '#0f172a', fontWeight: 700, margin: '2px 0 0 0' }}>
                {user.departmentName} ({user.departmentCode})
              </h2>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ borderLeft: '2px solid #e2e8f0', paddingLeft: '1rem' }}>
              <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, display: 'block' }}>
                Department Head (HOD)
              </span>
              <strong id="student-dashboard-hod-name" style={{ fontSize: '0.95rem', color: '#0f172a' }}>
                {user.hodName || 'Not Assigned'}
              </strong>
            </div>

            <div style={{ borderLeft: '2px solid #e2e8f0', paddingLeft: '1rem' }}>
              <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, display: 'block' }}>
                Dean (SOE)
              </span>
              <strong id="student-dashboard-dean-name" style={{ fontSize: '0.95rem', color: '#0f172a' }}>
                {user.deanName || 'Dr. Vijay Kumar'}
              </strong>
            </div>
          </div>
        </div>
      )}

      {/* Metrics Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2rem'
      }}>
        <div className="glass-panel" style={{ padding: '1.25rem', borderLeft: '4px solid #4f46e5' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
            Total Submissions
          </span>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', margin: '0.35rem 0' }}>
            {events.length}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Proposals created by you or your department</span>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem', borderLeft: '4px solid #f59e0b' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#b45309', textTransform: 'uppercase' }}>
            Awaiting Sanction
          </span>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', margin: '0.35rem 0' }}>
            {pendingCount}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Currently in HOD or Dean review pipeline</span>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem', borderLeft: '4px solid #3b82f6' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1d4ed8', textTransform: 'uppercase' }}>
            Changes Requested
          </span>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', margin: '0.35rem 0' }}>
            {changesCount}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Returned by authority with review feedback</span>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem', borderLeft: '4px solid #10b981' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#047857', textTransform: 'uppercase' }}>
            Approved / Published
          </span>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', margin: '0.35rem 0' }}>
            {approvedCount}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Cleared all mandatory approvals</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.25rem',
        borderBottom: '1px solid var(--border-color)',
        paddingBottom: '0.75rem',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {[
            { id: 'ALL', label: `All (${events.length})` },
            { id: 'PENDING', label: `In Review (${pendingCount})` },
            { id: 'REVISION', label: `Revisions Needed (${changesCount})` },
            { id: 'APPROVED', label: `Approved & Live (${approvedCount})` }
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setFilter(t.id)}
              style={{
                border: 'none',
                background: filter === t.id ? '#4f46e5' : '#f1f5f9',
                color: filter === t.id ? '#ffffff' : '#475569',
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Proposal Cards List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
          Loading event proposals...
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <Calendar size={48} style={{ margin: '0 auto 1rem', color: '#cbd5e1' }} />
          <h3 style={{ fontSize: '1.15rem', color: '#334155', marginBottom: 6 }}>
            No proposals found in this category
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.88rem', maxWidth: 440, margin: '0 auto 1.5rem' }}>
            Submit an event proposal to begin the automated HOD and Dean sanction workflow.
          </p>
          <button className="btn btn-primary" onClick={onNewProposal}>
            <PlusCircle size={16} /> Submit Proposal
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="glass-panel"
              style={{
                padding: '1.25rem 1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                borderLeft: event.status === 'CHANGES_REQUESTED' ? '4px solid #3b82f6' : 
                            event.status === 'APPROVED' ? '4px solid #10b981' : 
                            event.status === 'PUBLISHED' ? '4px solid #8b5cf6' : '1px solid var(--border-color)'
              }}
              onClick={() => onSelectEvent(event)}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 4 }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '2px 8px', borderRadius: 4, background: '#e0e7ff', color: '#4338ca' }}>
                      {event.category}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      {event.departmentName}
                    </span>
                    {event.aiCompletenessScore && (
                      <span style={{
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        padding: '1px 6px',
                        borderRadius: 9999,
                        background: event.aiCompletenessScore >= 80 ? '#ecfdf5' : '#fffbeb',
                        color: event.aiCompletenessScore >= 80 ? '#047857' : '#b45309',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 3
                      }}>
                        <Sparkles size={11} /> AI Score: {event.aiCompletenessScore}%
                      </span>
                    )}
                  </div>
                  <h3 style={{ fontSize: '1.15rem', color: '#0f172a' }}>
                    {event.title}
                  </h3>
                </div>
                <StatusBadge status={event.status} />
              </div>

              <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {event.description}
              </p>

              {/* Metadata Row */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1.25rem',
                fontSize: '0.8rem',
                color: '#64748b',
                paddingTop: '0.5rem',
                borderTop: '1px solid #f1f5f9'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Building size={14} color="#6366f1" />
                  <span>{event.venueName}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Calendar size={14} color="#6366f1" />
                  <span>{event.startDate ? new Date(event.startDate).toLocaleDateString() : 'TBD'}</span>
                </div>
                <div>
                  Budget: <strong>₹{event.budget?.toLocaleString() || '0'}</strong>
                </div>
                <div>
                  Est. Attendees: <strong>{event.estimatedParticipants || 50}</strong>
                </div>
                {event.status === 'PUBLISHED' && (
                  <div style={{ color: '#7c3aed', fontWeight: 600 }}>
                    Registrations: <strong>{event.registrationCount || 0}</strong>
                  </div>
                )}

                {/* Actions Right */}
                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={(e) => e.stopPropagation()}>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => onOpenTimeline(event)}
                    title="View Traceable Timeline"
                  >
                    <History size={14} /> History ({event.approvalHistory?.length || 0})
                  </button>

                  {event.status === 'CHANGES_REQUESTED' && (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => onEditProposal(event)}
                      style={{ background: '#2563eb' }}
                    >
                      <Edit3 size={14} /> Revise & Resubmit
                    </button>
                  )}

                  {event.status === 'APPROVED' && (
                    <button
                      className="btn btn-ai btn-sm"
                      onClick={(e) => handlePublish(event.id, e)}
                      disabled={publishingId === event.id}
                    >
                      <Sparkles size={14} /> {publishingId === event.id ? 'Publishing...' : 'Publish Live'}
                    </button>
                  )}

                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => onSelectEvent(event)}
                  >
                    <Eye size={14} /> Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

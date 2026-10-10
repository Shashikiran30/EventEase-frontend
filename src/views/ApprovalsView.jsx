import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/StatusBadge';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Sparkles, 
  Clock, 
  Building, 
  Calendar, 
  User, 
  History,
  FileText,
  ShieldAlert,
  Send
} from 'lucide-react';
import api from '../api/client';

export const ApprovalsView = ({ onOpenTimeline }) => {
  const { user } = useAuth();
  const [pendingEvents, setPendingEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Review modal state
  const [activeEvent, setActiveEvent] = useState(null);
  const [aiSummary, setAiSummary] = useState(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [comments, setComments] = useState('');
  const [submittingAction, setSubmittingAction] = useState(false);

  const fetchPending = async () => {
    setLoading(true);
    try {
      const res = await api.get('/approvals/pending');
      setPendingEvents(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, [user]);

  const openReviewModal = async (event) => {
    setActiveEvent(event);
    setComments('');
    setAiSummary(null);

    // Fetch AI Executive Review summary
    setLoadingAi(true);
    try {
      const res = await api.get(`/ai/executive-summary/${event.id}`);
      setAiSummary(res.data);
    } catch (e) {
      console.error('Failed to fetch AI summary', e);
    } finally {
      setLoadingAi(false);
    }
  };

  const handleDecision = async (actionType) => {
    if (!activeEvent) return;

    if (actionType === 'REQUEST_CHANGES' && !comments.trim()) {
      alert('Please specify the required changes in the comments box for the organizer.');
      return;
    }
    if (actionType === 'REJECT' && !comments.trim()) {
      alert('Please provide a reason for rejection in the comments box.');
      return;
    }

    setSubmittingAction(true);
    try {
      await api.post(`/approvals/${activeEvent.id}/decision`, {
        action: actionType,
        comments: comments.trim() || `Sanctioned by ${user.fullName} (${user.role.replace('ROLE_', '')})`
      });
      alert(`Decision recorded successfully (${actionType})!`);
      setActiveEvent(null);
      await fetchPending();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to record decision');
    } finally {
      setSubmittingAction(false);
    }
  };

  return (
    <div>
      {/* View Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '2px 8px', borderRadius: 4, background: '#fef3c7', color: '#b45309' }}>
            {user?.role === 'ROLE_HOD' ? `HOD PORTAL • ${user?.departmentCode || 'DEPARTMENT'}` :
             user?.role === 'ROLE_DEAN' ? 'DEAN PORTAL • SCHOOL OF ENGINEERING (SOE)' :
             user?.role === 'ROLE_FINANCE_OFFICER' ? 'FINANCE PORTAL' :
             user?.role === 'ROLE_PRINCIPAL' ? 'PRINCIPAL PORTAL' : 'AUTHORITY SANCTION PORTAL'}
          </span>
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
            Active Approver: <strong>{user?.fullName}</strong> ({user?.role?.replace('ROLE_', '')})
          </span>
        </div>
        <h1 style={{ fontSize: '1.85rem', color: '#0f172a' }}>
          {user?.role === 'ROLE_HOD' ? `HOD Dashboard — ${user?.departmentName || user?.departmentCode} Department` :
           user?.role === 'ROLE_DEAN' ? 'Dean Dashboard — School of Engineering (SOE)' :
           user?.role === 'ROLE_FINANCE_OFFICER' ? 'Finance Sanction Dashboard' :
           user?.role === 'ROLE_PRINCIPAL' ? 'Principal Authorization Dashboard' : 'Pending Approval Queue'}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
          {user?.role === 'ROLE_HOD' ? `Review student submissions and approval requests belonging to the ${user?.departmentName || user?.departmentCode} Department.` :
           user?.role === 'ROLE_DEAN' ? 'Review student submissions and HOD-approved requests across all School of Engineering (SOE) departments.' :
           user?.role === 'ROLE_FINANCE_OFFICER' ? 'Review event budgets, verify financial allocations, and record finance clearance.' :
           user?.role === 'ROLE_PRINCIPAL' ? 'Review dean-approved events and provide final institutional signoff before publication.' :
           'Review submitted proposals, inspect AI executive summaries, and record binding sanction decisions.'}
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
          Loading review tasks...
        </div>
      ) : pendingEvents.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <CheckCircle size={48} color="#10b981" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.2rem', color: '#1e293b', marginBottom: 6 }}>
            All Clear! No Pending Reviews
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.88rem', maxWidth: 440, margin: '0 auto' }}>
            There are no proposals currently awaiting your authorization. Check back when organizers submit new requests.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
          {pendingEvents.map((event) => (
            <div
              key={event.id}
              className="glass-panel"
              style={{
                padding: '1.5rem',
                borderLeft: '4px solid #f59e0b',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.9rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 4 }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '2px 8px', borderRadius: 4, background: '#e0e7ff', color: '#4338ca' }}>
                      {event.category}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      Dept: {event.departmentName}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      Organizer: <strong>{event.organizerName}</strong>
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.25rem', color: '#0f172a' }}>
                    {event.title}
                  </h3>
                </div>
                <StatusBadge status={event.status} />
              </div>

              <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.5 }}>
                {event.description}
              </p>

              {/* Specs Row */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1.5rem',
                fontSize: '0.82rem',
                color: '#64748b',
                paddingTop: '0.75rem',
                borderTop: '1px solid #f1f5f9'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Building size={15} color="#4f46e5" />
                  <span>Venue: <strong>{event.venueName}</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Calendar size={15} color="#4f46e5" />
                  <span>Date: <strong>{event.startDate ? new Date(event.startDate).toLocaleDateString() : 'TBD'}</strong></span>
                </div>
                <div>
                  Requested Budget: <strong>₹{event.budget?.toLocaleString() || '0'}</strong>
                </div>
                <div>
                  Target Attendees: <strong>{event.estimatedParticipants || 50}</strong>
                </div>

                {/* Action Buttons */}
                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => onOpenTimeline(event)}
                  >
                    <History size={14} /> Audit Trail ({event.approvalHistory?.length || 0})
                  </button>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => openReviewModal(event)}
                  >
                    Review & Decide
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Authority Review & Decision Modal */}
      {activeEvent && (
        <div className="modal-backdrop" onClick={() => setActiveEvent(null)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: 760 }}
          >
            {/* Modal Header */}
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
                  Official Sanction Assessment
                </span>
                <h3 style={{ fontSize: '1.2rem', color: '#0f172a', marginTop: 2 }}>
                  Review Proposal: {activeEvent.title}
                </h3>
              </div>
              <StatusBadge status={activeEvent.status} />
            </div>

            {/* Modal Content */}
            <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Proposal Overview */}
              <div style={{
                background: '#ffffff',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem 1.25rem'
              }}>
                <h4 style={{ fontSize: '0.92rem', color: '#1e293b', marginBottom: 6 }}>
                  Event Objectives & Description
                </h4>
                <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5, marginBottom: 8 }}>
                  {activeEvent.description}
                </p>
                {activeEvent.objectives && (
                  <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', color: '#334155' }}>
                    <strong>Objectives:</strong>
                    <p style={{ marginTop: 2, whiteSpace: 'pre-line' }}>{activeEvent.objectives}</p>
                  </div>
                )}
              </div>

              {/* AI Executive Summary Card */}
              <div style={{
                background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)',
                border: '1px solid #ddd6fe',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                  <Sparkles size={16} color="#7c3aed" />
                  <h4 style={{ fontSize: '0.92rem', color: '#5b21b6' }}>
                    AI Executive Review Aid
                  </h4>
                </div>

                {loadingAi ? (
                  <p style={{ fontSize: '0.82rem', color: '#6d28d9' }}>Synthesizing proposal briefing...</p>
                ) : aiSummary ? (
                  <div style={{ fontSize: '0.82rem', color: '#4c1d95', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <p><strong>Executive Brief:</strong> {aiSummary.executiveSummary}</p>
                    <p><strong>Capacity & Venue Assessment:</strong> {aiSummary.venueAndLogisticsImpact}</p>
                    <p><strong>Financial Impact:</strong> {aiSummary.budgetAssessment}</p>
                    {aiSummary.keyRiskFactors?.length > 0 && (
                      <div>
                        <strong>Flagged Risk Considerations:</strong>
                        <ul style={{ paddingLeft: '1.2rem', marginTop: 2 }}>
                          {aiSummary.keyRiskFactors.map((r, i) => <li key={i}>{r}</li>)}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <p style={{ fontSize: '0.82rem', color: '#6d28d9' }}>
                    {activeEvent.aiSummary || 'Automated proposal summary available.'}
                  </p>
                )}
              </div>

              {/* Financial & Logistics Info */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
                fontSize: '0.85rem'
              }}>
                <div style={{ background: '#f8fafc', padding: '0.9rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, display: 'block' }}>RESERVED VENUE</span>
                  <strong>{activeEvent.venueName}</strong>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748b' }}>
                    Location: {activeEvent.venueLocation}
                  </span>
                </div>

                <div style={{ background: '#f8fafc', padding: '0.9rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, display: 'block' }}>REQUESTED BUDGET</span>
                  <strong>₹{activeEvent.budget?.toLocaleString() || '0'}</strong>
                  {activeEvent.budgetBreakdown && (
                    <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', marginTop: 2 }}>
                      Breakdown: {activeEvent.budgetBreakdown}
                    </span>
                  )}
                </div>
              </div>

              {/* Decision Comments Input */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">
                  Reviewer Official Comments / Conditions *
                </label>
                <textarea
                  className="form-control"
                  placeholder="Enter approval remarks, conditions, or requested modifications for the organizer..."
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  rows={3}
                />
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div style={{
              padding: '1.25rem 1.75rem',
              borderTop: '1px solid var(--border-color)',
              background: '#f8fafc',
              borderBottomLeftRadius: 'var(--radius-xl)',
              borderBottomRightRadius: 'var(--radius-xl)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <button
                className="btn btn-secondary"
                onClick={() => setActiveEvent(null)}
                disabled={submittingAction}
              >
                Cancel
              </button>

              <div style={{ display: 'flex', gap: '0.65rem' }}>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDecision('REJECT')}
                  disabled={submittingAction}
                >
                  <XCircle size={16} /> Reject
                </button>
                <button
                  className="btn btn-warning btn-sm"
                  onClick={() => handleDecision('REQUEST_CHANGES')}
                  disabled={submittingAction}
                >
                  <AlertCircle size={16} /> Request Changes
                </button>
                <button
                  className="btn btn-success"
                  onClick={() => handleDecision('APPROVE')}
                  disabled={submittingAction}
                >
                  <CheckCircle size={18} /> {user?.role === 'ROLE_HOD' ? 'Approve & Forward to Dean' : 'Grant Final Approval'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

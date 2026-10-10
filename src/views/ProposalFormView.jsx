import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, 
  Send, 
  Save, 
  AlertCircle, 
  CheckCircle, 
  Calendar, 
  Clock, 
  Building, 
  IndianRupee, 
  Users, 
  FileText,
  ArrowLeft,
  Wand2,
  ListChecks
} from 'lucide-react';
import api from '../api/client';

export const ProposalFormView = ({ initialEvent, onCancel, onSuccess }) => {
  const { user } = useAuth();
  const isEditing = Boolean(initialEvent && (initialEvent.status === 'CHANGES_REQUESTED' || initialEvent.status === 'DRAFT'));

  const [departments, setDepartments] = useState([]);
  const [venues, setVenues] = useState([]);
  const [coordinators, setCoordinators] = useState([]);

  // Form state
  const [title, setTitle] = useState(initialEvent?.title || '');
  const [description, setDescription] = useState(initialEvent?.description || '');
  const [objectives, setObjectives] = useState(initialEvent?.objectives || '');
  const [category, setCategory] = useState(initialEvent?.category || 'Technical');
  const [departmentId, setDepartmentId] = useState(initialEvent?.departmentId || user?.departmentId || 1);
  const [coordinatorId, setCoordinatorId] = useState(initialEvent?.coordinatorId || '');
  const [venueId, setVenueId] = useState(initialEvent?.venueId || 1);
  const [startDate, setStartDate] = useState(
    initialEvent?.startDate ? initialEvent.startDate.slice(0, 16) : new Date(Date.now() + 86400000 * 7).toISOString().slice(0, 16)
  );
  const [endDate, setEndDate] = useState(
    initialEvent?.endDate ? initialEvent.endDate.slice(0, 16) : new Date(Date.now() + 86400000 * 7 + 3600000 * 6).toISOString().slice(0, 16)
  );
  const [estimatedParticipants, setEstimatedParticipants] = useState(initialEvent?.estimatedParticipants || 80);
  const [budget, setBudget] = useState(initialEvent?.budget || 10000);
  const [budgetBreakdown, setBudgetBreakdown] = useState(initialEvent?.budgetBreakdown || '');
  const [documentUrls, setDocumentUrls] = useState(initialEvent?.documentUrls || '');
  const [resubmissionComments, setResubmissionComments] = useState('');

  // Venue conflict status
  const [venueCheck, setVenueCheck] = useState(null);
  const [checkingVenue, setCheckingVenue] = useState(false);

  // AI assistant state
  const [aiDraftPrompt, setAiDraftPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiCompleteness, setAiCompleteness] = useState(null);
  const [showAiModal, setShowAiModal] = useState(false);

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch initial lookups
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [deptRes, venueRes, coordRes] = await Promise.all([
          api.get('/departments'),
          api.get('/venues'),
          api.get('/users/coordinators')
        ]);
        setDepartments(deptRes.data);
        setVenues(venueRes.data);
        setCoordinators(coordRes.data);
        if (!departmentId) {
          if (user?.departmentId) {
            setDepartmentId(user.departmentId);
          } else if (deptRes.data.length > 0) {
            setDepartmentId(deptRes.data[0].id);
          }
        }
        if (!venueId && venueRes.data.length > 0) {
          setVenueId(venueRes.data[0].id);
        }
      } catch (e) {
        console.error('Error fetching lookups', e);
      }
    };
    fetchMetadata();
  }, []);

  // Venue conflict validation effect
  useEffect(() => {
    if (!venueId || !startDate || !endDate) return;

    const checkAvailability = async () => {
      setCheckingVenue(true);
      try {
        const res = await api.get('/venues/check-availability', {
          params: {
            venueId,
            startDate: new Date(startDate).toISOString(),
            endDate: new Date(endDate).toISOString(),
            excludeEventId: initialEvent?.id || null
          }
        });
        setVenueCheck(res.data);
      } catch (err) {
        console.error('Availability check failed', err);
      } finally {
        setCheckingVenue(false);
      }
    };

    const debounce = setTimeout(checkAvailability, 400);
    return () => clearTimeout(debounce);
  }, [venueId, startDate, endDate]);

  // AI Draft generator
  const handleAiDraft = async () => {
    if (!aiDraftPrompt.trim()) return;
    setAiLoading(true);
    try {
      const res = await api.post('/ai/draft-proposal', {
        topic: aiDraftPrompt,
        category,
        targetAudience: 'Engineering & Technology Students',
        duration: 'Full Day'
      });
      const data = res.data;
      setTitle(data.title);
      setDescription(data.description);
      setObjectives(data.objectives);
      if (data.suggestedParticipants) setEstimatedParticipants(data.suggestedParticipants);
      if (data.estimatedBudget) setBudget(data.estimatedBudget);
      if (data.suggestedBudgetBreakdown) setBudgetBreakdown(data.suggestedBudgetBreakdown);
      setShowAiModal(false);
      // Run completeness check after draft
      triggerCompletenessCheck(data.title, data.description, data.objectives, data.estimatedBudget, data.suggestedBudgetBreakdown, data.suggestedParticipants);
    } catch (e) {
      alert('AI assistant draft generation failed: ' + (e.response?.data?.error || e.message));
    } finally {
      setAiLoading(false);
    }
  };

  // AI Completeness check
  const triggerCompletenessCheck = async (t = title, d = description, obj = objectives, b = budget, bb = budgetBreakdown, p = estimatedParticipants) => {
    try {
      const selectedVenue = venues.find(v => v.id === Number(venueId));
      const res = await api.post('/ai/check-completeness', {
        title: t,
        description: d,
        objectives: obj,
        venue: selectedVenue?.name || 'Assigned Hall',
        budget: b,
        budgetBreakdown: bb,
        participants: p
      });
      setAiCompleteness(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = async (submitImmediately = true) => {
    setErrorMsg('');
    if (!title.trim() || !description.trim()) {
      setErrorMsg('Event title and description are required.');
      return;
    }
    if (venueCheck && !venueCheck.isAvailable) {
      setErrorMsg('Please resolve venue conflict: ' + venueCheck.conflictReason);
      return;
    }

    setSubmitting(true);
    try {
      if (isEditing) {
        // Update existing proposal
        await api.put(`/events/${initialEvent.id}`, {
          title,
          description,
          objectives,
          category,
          departmentId: Number(departmentId),
          coordinatorId: coordinatorId ? Number(coordinatorId) : null,
          venueId: Number(venueId),
          startDate: new Date(startDate).toISOString(),
          endDate: new Date(endDate).toISOString(),
          estimatedParticipants: Number(estimatedParticipants),
          budget: Number(budget),
          budgetBreakdown,
          documentUrls,
          resubmit: submitImmediately,
          resubmissionComments: resubmissionComments || 'Addressed requested adjustments.'
        });
      } else {
        // Create new proposal
        await api.post('/events', {
          title,
          description,
          objectives,
          category,
          departmentId: Number(departmentId),
          coordinatorId: coordinatorId ? Number(coordinatorId) : null,
          venueId: Number(venueId),
          startDate: new Date(startDate).toISOString(),
          endDate: new Date(endDate).toISOString(),
          estimatedParticipants: Number(estimatedParticipants),
          budget: Number(budget),
          budgetBreakdown,
          documentUrls,
          submitImmediately
        });
      }
      onSuccess();
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Failed to submit proposal');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: 960, margin: '0 auto' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button className="btn btn-secondary btn-sm" onClick={onCancel}>
            <ArrowLeft size={16} /> Back
          </button>
          <div>
            <h1 style={{ fontSize: '1.6rem', color: '#0f172a' }}>
              {isEditing ? 'Revise Event Proposal' : 'Submit College Event Proposal'}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              {isEditing 
                ? 'Update details to satisfy authority feedback and resubmit for HOD sign-off.'
                : 'Complete the proposal details. The multi-level workflow will automatically route to HOD and Dean.'}
            </p>
          </div>
        </div>

        {/* AI Assistant Quick Trigger */}
        <button
          className="btn btn-ai"
          onClick={() => setShowAiModal(true)}
          style={{ padding: '0.5rem 1rem', fontSize: '0.82rem' }}
        >
          <Sparkles size={16} /> AI Draft Assistant
        </button>
      </div>

      {errorMsg && (
        <div style={{
          padding: '0.9rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          background: '#fef2f2',
          border: '1px solid #fecaca',
          color: '#b91c1c',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.88rem'
        }}>
          <AlertCircle size={18} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Form Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.5rem' }}>
        {/* Left Form Content */}
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          {isEditing && (
            <div style={{
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              marginBottom: '1.5rem'
            }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1d4ed8', textTransform: 'uppercase' }}>
                Resubmission Notes
              </span>
              <p style={{ fontSize: '0.82rem', color: '#1e3a8a', margin: '4px 0 8px' }}>
                Please summarize how you addressed the comments requested by the reviewer.
              </p>
              <textarea
                className="form-control"
                placeholder="e.g. Added written clearance from campus safety and itemized equipment costs..."
                value={resubmissionComments}
                onChange={(e) => setResubmissionComments(e.target.value)}
                rows={2}
              />
            </div>
          )}

          {/* Title & Category */}
          <div className="form-group">
            <label className="form-label">Event Proposal Title *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. National Hackathon 2026: CodeSpark"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => triggerCompletenessCheck()}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select className="form-control" value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="Technical">Technical</option>
                <option value="Workshop">Workshop</option>
                <option value="Cultural">Cultural</option>
                <option value="Sports">Sports</option>
                <option value="Seminar">Seminar</option>
                <option value="Conference">Conference</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Host Department *</label>
              <select className="form-control" value={departmentId} onChange={(e) => setDepartmentId(e.target.value)}>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.code} - {d.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Detailed Event Description *</label>
            <textarea
              className="form-control"
              placeholder="Describe event structure, targeted topics, mentor credentials, and schedule flow..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={() => triggerCompletenessCheck()}
              rows={4}
              required
            />
          </div>

          {/* Objectives */}
          <div className="form-group">
            <label className="form-label">Specific Objectives & Expected Outcomes</label>
            <textarea
              className="form-control"
              placeholder="1. Experiential learning in...\n2. Deliverable prototypes created by attendees..."
              value={objectives}
              onChange={(e) => setObjectives(e.target.value)}
              onBlur={() => triggerCompletenessCheck()}
              rows={3}
            />
          </div>

          {/* Schedule & Venue */}
          <div style={{
            background: '#f8fafc',
            padding: '1.25rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            marginBottom: '1.5rem'
          }}>
            <h4 style={{ fontSize: '0.92rem', color: '#1e293b', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Building size={16} color="#4f46e5" /> Venue & Schedule Reservation
            </h4>

            <div className="form-group">
              <label className="form-label">Select Venue *</label>
              <select className="form-control" value={venueId} onChange={(e) => setVenueId(e.target.value)}>
                {venues.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} (Cap: {v.capacity} pax) — {v.location}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Start Date & Time *</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">End Date & Time *</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            {/* Venue Availability / Collision Alert */}
            {checkingVenue ? (
              <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Checking venue calendar availability...</span>
            ) : venueCheck && (
              <div style={{
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.82rem',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: venueCheck.isAvailable ? '#ecfdf5' : '#fef2f2',
                border: venueCheck.isAvailable ? '1px solid #6ee7b7' : '1px solid #fca5a5',
                color: venueCheck.isAvailable ? '#047857' : '#b91c1c'
              }}>
                {venueCheck.isAvailable ? (
                  <>
                    <CheckCircle size={16} color="#059669" />
                    <strong>Venue Available: No calendar collisions detected for this hall.</strong>
                  </>
                ) : (
                  <>
                    <AlertCircle size={16} color="#dc2626" />
                    <div>
                      <strong>Booking Collision:</strong> {venueCheck.conflictReason}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Budget & Participants */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Estimated Participants</label>
              <input
                type="number"
                className="form-control"
                placeholder="80"
                value={estimatedParticipants}
                onChange={(e) => setEstimatedParticipants(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Total Estimated Budget (₹)</label>
              <input
                type="number"
                className="form-control"
                placeholder="15000"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Itemized Budget Breakdown</label>
            <textarea
              className="form-control"
              placeholder="Guest Honorarium: ₹6,000; Refreshments: ₹4,000; Kits: ₹2,000..."
              value={budgetBreakdown}
              onChange={(e) => setBudgetBreakdown(e.target.value)}
              rows={2}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Faculty Coordinator</label>
            <select className="form-control" value={coordinatorId} onChange={(e) => setCoordinatorId(e.target.value)}>
              <option value="">-- Select Faculty Coordinator --</option>
              {coordinators.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.fullName} ({c.designation || 'Faculty'})
                </option>
              ))}
            </select>
          </div>

          {/* Buttons Footer */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '2rem' }}>
            <button className="btn btn-secondary" onClick={onCancel} disabled={submitting}>
              Cancel
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => handleSubmit(false)}
              disabled={submitting || (venueCheck && !venueCheck.isAvailable)}
            >
              <Save size={16} /> Save Draft
            </button>
            <button
              className="btn btn-primary"
              onClick={() => handleSubmit(true)}
              disabled={submitting || (venueCheck && !venueCheck.isAvailable)}
            >
              <Send size={16} /> {submitting ? 'Submitting...' : isEditing ? 'Resubmit to HOD' : 'Submit Proposal'}
            </button>
          </div>
        </div>

        {/* Right Sidebar: AI Completeness Auditor & Workflow Guide */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* AI Completeness Widget */}
          <div className="glass-panel" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Sparkles size={16} color="#7c3aed" />
                <h4 style={{ fontSize: '0.9rem', color: '#1e293b' }}>
                  AI Proposal Audit
                </h4>
              </div>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => triggerCompletenessCheck()}
                style={{ fontSize: '0.72rem', padding: '2px 8px' }}
              >
                Audit
              </button>
            </div>

            {aiCompleteness ? (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    background: aiCompleteness.score >= 80 ? '#ecfdf5' : aiCompleteness.score >= 60 ? '#fffbeb' : '#fef2f2',
                    border: `3px solid ${aiCompleteness.score >= 80 ? '#10b981' : aiCompleteness.score >= 60 ? '#f59e0b' : '#ef4444'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '1rem',
                    color: aiCompleteness.score >= 80 ? '#047857' : aiCompleteness.score >= 60 ? '#b45309' : '#b91c1c'
                  }}>
                    {aiCompleteness.score}%
                  </div>
                  <div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', color: '#1e293b' }}>
                      {aiCompleteness.status}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      Completeness Assessment
                    </span>
                  </div>
                </div>

                {aiCompleteness.missingItems?.length > 0 && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#b45309', textTransform: 'uppercase' }}>
                      Missing / Suggestions:
                    </span>
                    <ul style={{ fontSize: '0.75rem', color: '#64748b', paddingLeft: '1.1rem', marginTop: 4 }}>
                      {aiCompleteness.missingItems.map((m, idx) => (
                        <li key={idx} style={{ marginBottom: 3 }}>{m}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '1rem', color: '#94a3b8', fontSize: '0.8rem' }}>
                Fill in fields and click Audit to receive real-time completeness feedback before HOD submission.
              </div>
            )}
          </div>

          {/* Workflow Sequence Checklist */}
          <div className="glass-panel" style={{ padding: '1.25rem' }}>
            <h4 style={{ fontSize: '0.88rem', color: '#1e293b', marginBottom: '0.65rem', display: 'flex', alignItems: 'center', gap: 6 }}>
              <ListChecks size={16} color="#4f46e5" /> Approval Pathway
            </h4>
            <div style={{ fontSize: '0.78rem', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 20, height: 20, borderRadius: '50%', background: '#e0e7ff', color: '#4338ca', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.7rem' }}>1</span>
                <span>Stage 1: HOD of Department review</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 20, height: 20, borderRadius: '50%', background: '#e0e7ff', color: '#4338ca', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.7rem' }}>2</span>
                <span>Stage 2: Dean of Academic Affairs sign-off</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 20, height: 20, borderRadius: '50%', background: '#ecfdf5', color: '#047857', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.7rem' }}>3</span>
                <span>Stage 3: Approved & eligible for College Calendar</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Draft Generator Modal */}
      {showAiModal && (
        <div className="modal-backdrop" onClick={() => setShowAiModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 520 }}>
            <div style={{
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid var(--border-color)',
              background: '#f8fafc',
              borderTopLeftRadius: 'var(--radius-xl)',
              borderTopRightRadius: 'var(--radius-xl)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Sparkles size={20} color="#7c3aed" />
                <h3 style={{ fontSize: '1.1rem', color: '#0f172a' }}>
                  AI Proposal Draft Assistant
                </h3>
              </div>
              <p style={{ fontSize: '0.78rem', color: '#64748b', marginTop: 2 }}>
                Enter a topic or keywords and the assistant will generate a structured outline for you to review and edit.
              </p>
            </div>

            <div style={{ padding: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">Event Topic / Theme</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Hands-On Generative AI & LLM Workshop"
                  value={aiDraftPrompt}
                  onChange={(e) => setAiDraftPrompt(e.target.value)}
                />
              </div>

              <div style={{
                background: '#f8fafc',
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.75rem',
                color: '#64748b',
                lineHeight: 1.4
              }}>
                <strong>Notice:</strong> Per college guidelines, AI assists with drafting and structure only. Final review and approval decisions remain solely with authorized college officials.
              </div>
            </div>

            <div style={{
              padding: '1rem 1.5rem',
              borderTop: '1px solid var(--border-color)',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '0.5rem',
              background: '#f8fafc',
              borderBottomLeftRadius: 'var(--radius-xl)',
              borderBottomRightRadius: 'var(--radius-xl)'
            }}>
              <button className="btn btn-secondary" onClick={() => setShowAiModal(false)}>
                Cancel
              </button>
              <button
                className="btn btn-ai"
                onClick={handleAiDraft}
                disabled={aiLoading || !aiDraftPrompt.trim()}
              >
                <Wand2 size={16} /> {aiLoading ? 'Generating...' : 'Generate Proposal Draft'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

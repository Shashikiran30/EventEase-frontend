import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Calendar as CalendarIcon, 
  MapPin, 
  Clock, 
  Users, 
  Sparkles, 
  Ticket, 
  CheckCircle2, 
  Search,
  Filter,
  Building,
  Tag
} from 'lucide-react';
import api from '../api/client';

export const CalendarView = ({ onSelectEvent, onOpenTicket }) => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [registeringId, setRegisteringId] = useState(null);

  const fetchCalendar = async () => {
    setLoading(true);
    try {
      const res = await api.get('/calendar/events');
      setEvents(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendar();
  }, [user]);

  const handleRegister = async (eventId, e) => {
    e.stopPropagation();
    setRegisteringId(eventId);
    try {
      const res = await api.post(`/events/${eventId}/registrations`, {
        studentName: user?.fullName || 'Student Attendee',
        studentEmail: user?.email || 'student@college.edu',
        studentRollNo: 'STU-' + (user?.id || '01'),
        studentDepartment: user?.departmentName || 'General'
      });
      alert('Registration confirmed! Generating your event entry pass...');
      onOpenTicket(res.data);
      await fetchCalendar();
    } catch (err) {
      alert(err.response?.data?.error || 'Registration failed');
    } finally {
      setRegisteringId(null);
    }
  };

  const categories = ['ALL', 'Technical', 'Workshop', 'Cultural', 'Sports', 'Seminar', 'Conference'];

  const filteredEvents = events.filter((ev) => {
    const matchesCat = selectedCategory === 'ALL' || ev.category?.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = !searchTerm || ev.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          ev.venueName?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div>
      {/* Top Banner */}
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
            Campus Event Calendar
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Explore approved and published college events. Students can register for free digital admission passes.
          </p>
        </div>

        {/* Search Bar */}
        <div style={{ position: 'relative', width: 280 }}>
          <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: 12, top: 11 }} />
          <input
            type="text"
            className="form-control"
            placeholder="Search events, venues..."
            style={{ paddingLeft: '2.25rem' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Category Filter Chips */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        overflowX: 'auto',
        paddingBottom: '1rem',
        marginBottom: '1.5rem'
      }}>
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setSelectedCategory(c)}
            style={{
              border: selectedCategory === c ? '1px solid #4f46e5' : '1px solid var(--border-color)',
              background: selectedCategory === c ? '#4f46e5' : '#ffffff',
              color: selectedCategory === c ? '#ffffff' : '#475569',
              padding: '6px 16px',
              borderRadius: '9999px',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)',
              transition: 'all 0.15s'
            }}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Events Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
          Loading calendar events...
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <CalendarIcon size={48} style={{ margin: '0 auto 1rem', color: '#cbd5e1' }} />
          <h3 style={{ fontSize: '1.15rem', color: '#334155', marginBottom: 6 }}>
            No published events in this view
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.88rem' }}>
            Events appear here once both HOD and Dean grant approval and the proposal is published.
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '1.5rem'
        }}>
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="glass-panel"
              style={{
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
              onClick={() => onSelectEvent(event)}
            >
              {/* Event Card Header Accent */}
              <div style={{
                background: 'linear-gradient(135deg, #1e1b4b 0%, #3730a3 100%)',
                padding: '1.25rem',
                color: 'white',
                position: 'relative'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    padding: '2px 8px',
                    borderRadius: 4,
                    background: 'rgba(255, 255, 255, 0.2)'
                  }}>
                    {event.category}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#c7d2fe' }}>
                    {event.departmentName}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, lineHeight: 1.3 }}>
                  {event.title}
                </h3>
              </div>

              {/* Event Card Body */}
              <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1rem' }}>
                <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {event.description}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.82rem', color: '#64748b' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <CalendarIcon size={14} color="#6366f1" />
                    <span>
                      {event.startDate ? new Date(event.startDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : 'TBD'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Clock size={14} color="#6366f1" />
                    <span>
                      {event.startDate ? new Date(event.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''} - {event.endDate ? new Date(event.endDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <MapPin size={14} color="#6366f1" />
                    <span>{event.venueName} ({event.venueLocation})</span>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div style={{
                  paddingTop: '0.75rem',
                  borderTop: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                    <Users size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                    {event.registrationCount || 0} Registered
                  </div>

                  <button
                    className="btn btn-primary btn-sm"
                    onClick={(e) => handleRegister(event.id, e)}
                    disabled={registeringId === event.id}
                  >
                    <Ticket size={14} /> {registeringId === event.id ? 'Registering...' : 'Register Pass'}
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

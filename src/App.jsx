import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { NotificationDrawer } from './components/NotificationDrawer';
import { ApprovalTimelineModal } from './components/ApprovalTimelineModal';
import { EventDetailModal } from './components/EventDetailModal';
import { TicketModal } from './components/TicketModal';
import { OrganizerDashboard } from './views/OrganizerDashboard';
import { ProposalFormView } from './views/ProposalFormView';
import { ApprovalsView } from './views/ApprovalsView';
import { CalendarView } from './views/CalendarView';
import { MyRegistrationsView } from './views/MyRegistrationsView';
import { AdminView } from './views/AdminView';
import { LoginView } from './views/LoginView';
import { RegisterView } from './views/RegisterView';
import api from './api/client';

// ─── Auth Gate (Login / Register) ───────────────────────────────────────────
const AuthGate = () => {
  const [authPage, setAuthPage] = useState('login'); // 'login' | 'register'

  if (authPage === 'register') {
    return <RegisterView onSwitchToLogin={() => setAuthPage('login')} />;
  }
  return <LoginView onSwitchToRegister={() => setAuthPage('register')} />;
};

// ─── Loading Spinner ─────────────────────────────────────────────────────────
const LoadingScreen = () => (
  <div style={{
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f8fafc',
    fontFamily: 'var(--font-primary)'
  }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{
        width: 48, height: 48,
        borderRadius: '50%',
        border: '4px solid #e0e7ff',
        borderTopColor: '#4f46e5',
        animation: 'spin 1s linear infinite',
        margin: '0 auto 1rem'
      }} />
      <h3 style={{ fontSize: '1.1rem', color: '#1e293b' }}>Loading EventEase...</h3>
      <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Initializing college workflow portal</p>
    </div>
    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
  </div>
);

// ─── Main Authenticated App ───────────────────────────────────────────────────
const MainApp = () => {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('proposals');
  const [pendingCount, setPendingCount] = useState(0);

  // Modals
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [timelineEvent, setTimelineEvent] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [activeTicket, setActiveTicket] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);

  const fetchPendingCount = async () => {
    if (!user || user.role === 'ROLE_STUDENT') return;
    try {
      const res = await api.get('/approvals/pending');
      setPendingCount(res.data.length || 0);
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => {
    fetchPendingCount();
    // Default tab based on role
    if (user?.role === 'ROLE_HOD' || user?.role === 'ROLE_DEAN' ||
        user?.role === 'ROLE_FINANCE_OFFICER' || user?.role === 'ROLE_PRINCIPAL') {
      setActiveTab('approvals');
    } else if (user?.role === 'ROLE_ADMIN') {
      setActiveTab('admin');
    } else {
      setActiveTab('proposals');
    }
  }, [user]);

  // Show loading screen while checking auth
  if (loading) return <LoadingScreen />;

  // Show login/register if not authenticated
  if (!user) return <AuthGate />;

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setEditingEvent(null);
          setActiveTab(tab);
        }}
        pendingCount={pendingCount}
      />

      {/* Main Body */}
      <div className="main-content">
        <Navbar onOpenNotifications={() => setNotificationsOpen(true)} />

        <main className="content-body">
          {activeTab === 'proposals' && (
            <OrganizerDashboard
              onNewProposal={() => {
                setEditingEvent(null);
                setActiveTab('new-proposal');
              }}
              onSelectEvent={(ev) => setSelectedEvent(ev)}
              onOpenTimeline={(ev) => setTimelineEvent(ev)}
              onEditProposal={(ev) => {
                setEditingEvent(ev);
                setActiveTab('new-proposal');
              }}
            />
          )}

          {activeTab === 'new-proposal' && (
            <ProposalFormView
              initialEvent={editingEvent}
              onCancel={() => {
                setEditingEvent(null);
                setActiveTab('proposals');
              }}
              onSuccess={() => {
                setEditingEvent(null);
                setActiveTab('proposals');
                fetchPendingCount();
              }}
            />
          )}

          {activeTab === 'approvals' && (
            <ApprovalsView
              onOpenTimeline={(ev) => setTimelineEvent(ev)}
            />
          )}

          {activeTab === 'calendar' && (
            <CalendarView
              onSelectEvent={(ev) => setSelectedEvent(ev)}
              onOpenTicket={(ticket) => setActiveTicket(ticket)}
            />
          )}

          {activeTab === 'registrations' && (
            <MyRegistrationsView
              onOpenTicket={(ticket) => setActiveTicket(ticket)}
            />
          )}

          {activeTab === 'admin' && user?.role === 'ROLE_ADMIN' && (
            <AdminView />
          )}
        </main>
      </div>

      {/* Global Modals & Drawers */}
      <NotificationDrawer
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />

      <ApprovalTimelineModal
        event={timelineEvent}
        onClose={() => setTimelineEvent(null)}
      />

      <EventDetailModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onOpenTimeline={(ev) => {
          setSelectedEvent(null);
          setTimelineEvent(ev);
        }}
        onEdit={(ev) => {
          setSelectedEvent(null);
          setEditingEvent(ev);
          setActiveTab('new-proposal');
        }}
        onRegister={async (eventId) => {
          try {
            const res = await api.post(`/events/${eventId}/registrations`, {
              studentName: user?.fullName,
              studentEmail: user?.email,
              studentRollNo: 'STU-' + user?.id,
              studentDepartment: user?.departmentName || 'General'
            });
            setSelectedEvent(null);
            setActiveTicket(res.data);
          } catch (e) {
            alert(e.response?.data?.error || 'Registration failed');
          }
        }}
      />

      <TicketModal
        registration={activeTicket}
        onClose={() => setActiveTicket(null)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

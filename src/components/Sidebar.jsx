import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  PlusCircle, 
  CheckSquare, 
  CalendarDays, 
  Ticket, 
  Building2, 
  ShieldCheck, 
  Users, 
  Sparkles,
  Layers
} from 'lucide-react';

export const Sidebar = ({ activeTab, setActiveTab, pendingCount }) => {
  const { user } = useAuth();
  const role = user?.role || 'ROLE_STUDENT';

  const getNavLinks = () => {
    const common = [
      { id: 'calendar', label: 'Event Calendar', icon: CalendarDays }
    ];

    if (role === 'ROLE_STUDENT') {
      return [
        { id: 'proposals', label: 'My Proposals', icon: LayoutDashboard },
        { id: 'new-proposal', label: 'Submit Proposal', icon: PlusCircle, highlight: true },
        { id: 'registrations', label: 'My Event Passes', icon: Ticket },
        ...common
      ];
    } else if (role === 'ROLE_HOD') {
      return [
        { id: 'approvals', label: 'HOD Review Queue', icon: CheckSquare, badge: pendingCount },
        { id: 'proposals', label: 'Department Events', icon: LayoutDashboard },
        { id: 'new-proposal', label: 'Create Dept Event', icon: PlusCircle },
        ...common
      ];
    } else if (role === 'ROLE_DEAN') {
      return [
        { id: 'approvals', label: 'Dean Review Queue', icon: CheckSquare, badge: pendingCount },
        { id: 'proposals', label: 'College Proposals', icon: LayoutDashboard },
        ...common
      ];
    } else if (role === 'ROLE_FINANCE_OFFICER') {
      return [
        { id: 'approvals', label: 'Budget Approvals', icon: CheckSquare, badge: pendingCount },
        { id: 'proposals', label: 'Audited Events', icon: LayoutDashboard },
        ...common
      ];
    } else if (role === 'ROLE_PRINCIPAL') {
      return [
        { id: 'approvals', label: 'Principal Review Queue', icon: CheckSquare, badge: pendingCount },
        { id: 'proposals', label: 'College Events', icon: LayoutDashboard },
        ...common
      ];
    } else if (role === 'ROLE_ADMIN') {
      return [
        { id: 'admin', label: 'Admin Dashboard', icon: ShieldCheck },
        { id: 'proposals', label: 'All Event Proposals', icon: LayoutDashboard },
        { id: 'approvals', label: 'Master Review Queue', icon: CheckSquare, badge: pendingCount },
        { id: 'new-proposal', label: 'Create Event', icon: PlusCircle },
        ...common
      ];
    }
    return common;
  };

  const navLinks = getNavLinks();

  return (
    <aside style={{
      width: 260,
      background: 'var(--bg-sidebar)',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      padding: '1.5rem 1rem',
      flexShrink: 0,
      borderRight: '1px solid #1e293b'
    }}>
      <div style={{ marginBottom: '1.75rem', padding: '0 0.5rem' }}>
        <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94a3b8', fontWeight: 700 }}>
          Navigation Portal
        </span>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1 }}>
        {navLinks.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                background: isActive ? 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)' : 'transparent',
                color: isActive ? '#ffffff' : '#cbd5e1',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.88rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                textAlign: 'left',
                boxShadow: isActive ? '0 4px 12px rgba(79, 70, 229, 0.35)' : 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Icon size={18} color={isActive ? '#ffffff' : '#94a3b8'} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span style={{
                  background: isActive ? '#ffffff' : '#ef4444',
                  color: isActive ? '#4f46e5' : '#ffffff',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  padding: '2px 7px',
                  borderRadius: 9999
                }}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Role Guide Footer Card */}
      <div style={{
        background: '#1e293b',
        borderRadius: 'var(--radius-md)',
        padding: '0.9rem',
        border: '1px solid #334155'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
          <Sparkles size={14} color="#818cf8" />
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#e2e8f0' }}>
            Workflow Role
          </span>
        </div>
        <p style={{ fontSize: '0.73rem', color: '#94a3b8', lineHeight: 1.4 }}>
          {role === 'ROLE_STUDENT' && 'Create proposals, verify venue clashes with AI assistance, track decisions.'}
          {role === 'ROLE_HOD' && 'First authority. Endorse or request modifications for department proposals.'}
          {role === 'ROLE_DEAN' && 'Final approval. Review academic alignment and approve for public publishing.'}
          {role === 'ROLE_FINANCE_OFFICER' && 'Audit budget allocations and expenditures.'}
          {role === 'ROLE_PRINCIPAL' && 'Principal authorization. Final institutional signoff for approved events.'}
          {role === 'ROLE_ADMIN' && 'Configure approval workflows, manage departments, venues & accounts.'}
        </p>
      </div>
    </aside>
  );
};

import React from 'react';
import { Clock, CheckCircle2, XCircle, AlertCircle, Sparkles, FileEdit, Send } from 'lucide-react';

export const StatusBadge = ({ status }) => {
  switch (status) {
    case 'DRAFT':
      return (
        <span className="badge" style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1' }}>
          <FileEdit size={12} /> Draft
        </span>
      );
    case 'PENDING_HOD':
      return (
        <span className="badge" style={{ background: 'var(--status-pending-bg)', color: 'var(--status-pending-text)', border: '1px solid var(--status-pending-border)' }}>
          <Clock size={12} /> Pending HOD
        </span>
      );
    case 'PENDING_DEAN':
      return (
        <span className="badge" style={{ background: '#fff7ed', color: '#c2410c', border: '1px solid #fdba74' }}>
          <Clock size={12} /> Pending Dean
        </span>
      );
    case 'PENDING_FINANCE':
      return (
        <span className="badge" style={{ background: '#fdf4ff', color: '#a21caf', border: '1px solid #f0abfc' }}>
          <Clock size={12} /> Pending Finance
        </span>
      );
    case 'PENDING_PRINCIPAL':
      return (
        <span className="badge" style={{ background: '#f0fdf4', color: '#15803d', border: '1px solid #86efac' }}>
          <Clock size={12} /> Pending Principal
        </span>
      );
    case 'CHANGES_REQUESTED':
      return (
        <span className="badge" style={{ background: 'var(--status-changes-bg)', color: 'var(--status-changes-text)', border: '1px solid var(--status-changes-border)' }}>
          <AlertCircle size={12} /> Changes Requested
        </span>
      );
    case 'APPROVED':
      return (
        <span className="badge" style={{ background: 'var(--status-approved-bg)', color: 'var(--status-approved-text)', border: '1px solid var(--status-approved-border)' }}>
          <CheckCircle2 size={12} /> Approved (Ready to Publish)
        </span>
      );
    case 'REJECTED':
      return (
        <span className="badge" style={{ background: 'var(--status-rejected-bg)', color: 'var(--status-rejected-text)', border: '1px solid var(--status-rejected-border)' }}>
          <XCircle size={12} /> Rejected
        </span>
      );
    case 'PUBLISHED':
      return (
        <span className="badge" style={{ background: 'var(--status-published-bg)', color: 'var(--status-published-text)', border: '1px solid var(--status-published-border)' }}>
          <Sparkles size={12} /> Published Live
        </span>
      );
    default:
      return <span className="badge">{status}</span>;
  }
};

import React, { useState } from 'react';
import { Calendar, Sparkles, Eye, EyeOff, LogIn, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginView = ({ onSwitchToRegister }) => {
  const { login } = useAuth();
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username.trim() || !form.password.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    setError('');
    const result = await login(form.username.trim(), form.password);
    setLoading(false);
    if (!result.success) {
      setError(result.error || 'Invalid username or password. Please try again.');
    }
  };

  const demoAccounts = [
    { label: 'Student', username: 'student', color: '#6366f1' },
    { label: 'HOD', username: 'hod_cse', color: '#0891b2' },
    { label: 'Dean', username: 'dean', color: '#059669' },
    { label: 'Finance', username: 'finance', color: '#d97706' },
    { label: 'Admin', username: 'admin', color: '#dc2626' },
  ];

  const fillDemo = (username) => {
    setForm({ username, password: 'password123' });
    setError('');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      fontFamily: 'var(--font-primary)',
      background: '#f8fafc',
    }}>
      {/* Left Branding Panel */}
      <div style={{
        width: '45%',
        background: 'linear-gradient(145deg, #0f172a 0%, #1e1b4b 40%, #312e81 75%, #4338ca 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: '4rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative Circles */}
        <div style={{ position: 'absolute', width: 380, height: 380, borderRadius: '50%', background: 'rgba(99,102,241,0.12)', top: -80, right: -80 }} />
        <div style={{ position: 'absolute', width: 260, height: 260, borderRadius: '50%', background: 'rgba(139,92,246,0.1)', bottom: 60, left: -60 }} />
        <div style={{ position: 'absolute', width: 160, height: 160, borderRadius: '50%', background: 'rgba(99,102,241,0.08)', bottom: 200, right: 40 }} />

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', marginBottom: '3.5rem', position: 'relative', zIndex: 1 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14,
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(99,102,241,0.45)',
          }}>
            <Calendar size={26} color="white" />
          </div>
          <div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: '#fff' }}>EventEase</div>
            <div style={{ fontSize: '0.72rem', color: '#a5b4fc', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Smart Approval Platform</div>
          </div>
        </div>

        {/* Headline */}
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#fff', lineHeight: 1.2, marginBottom: '1.25rem', fontFamily: 'var(--font-display)', position: 'relative', zIndex: 1 }}>
          College Event<br />Management,<br /><span style={{ color: '#a5b4fc' }}>Simplified.</span>
        </h1>
        <p style={{ fontSize: '1rem', color: '#94a3b8', lineHeight: 1.7, maxWidth: 340, marginBottom: '2.5rem', position: 'relative', zIndex: 1 }}>
          Submit proposals, track multi-level approvals, manage venues, and publish events — all in one unified workflow portal.
        </p>

        {/* Features */}
        {[
          { icon: '🏛️', text: 'Multi-level HOD & Dean approval workflow' },
          { icon: '📅', text: 'Smart venue booking with conflict detection' },
          { icon: '🤖', text: 'AI-powered proposal completeness scoring' },
          { icon: '🎟️', text: 'Student event registration & digital tickets' },
        ].map((f, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.8rem', position: 'relative', zIndex: 1 }}>
            <span style={{ fontSize: '1.1rem' }}>{f.icon}</span>
            <span style={{ color: '#cbd5e1', fontSize: '0.88rem' }}>{f.text}</span>
          </div>
        ))}
      </div>

      {/* Right Login Form Panel */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 2rem',
        overflowY: 'auto',
      }}>
        <div style={{ width: '100%', maxWidth: 440 }}>
          {/* Header */}
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.85rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: '#0f172a', marginBottom: '0.4rem' }}>
              Welcome back
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
              Sign in to your EventEase account
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fca5a5',
              borderRadius: 10,
              padding: '0.75rem 1rem',
              marginBottom: '1.25rem',
              color: '#b91c1c',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}>
              <span>⚠️</span> {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label className="form-label" htmlFor="login-username">Username</label>
              <input
                id="login-username"
                name="username"
                type="text"
                className="form-control"
                placeholder="Enter your username"
                value={form.username}
                onChange={handleChange}
                autoComplete="username"
                autoFocus
                style={{ fontSize: '0.95rem', padding: '0.75rem 1rem' }}
              />
            </div>

            <div className="form-group" style={{ position: 'relative' }}>
              <label className="form-label" htmlFor="login-password">Password</label>
              <input
                id="login-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
                style={{ fontSize: '0.95rem', padding: '0.75rem 1rem', paddingRight: '2.75rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                style={{
                  position: 'absolute', right: 12, bottom: 12,
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#94a3b8', padding: 0, display: 'flex', alignItems: 'center',
                }}
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>

            <button
              id="login-submit-btn"
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.85rem',
                fontSize: '1rem',
                marginTop: '0.5rem',
                borderRadius: 12,
                gap: '0.6rem',
                opacity: loading ? 0.75 : 1,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? (
                <>
                  <span style={{ display: 'inline-block', width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', animation: 'spin 0.7s linear infinite' }} />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn size={17} />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Register Link */}
          <div style={{ textAlign: 'center', marginTop: '1.5rem', color: '#64748b', fontSize: '0.9rem' }}>
            Don't have an account?{' '}
            <button
              id="go-to-register-btn"
              onClick={onSwitchToRegister}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: '#4f46e5', fontWeight: 700, fontSize: '0.9rem',
                textDecoration: 'underline', textDecorationColor: 'transparent',
                transition: 'text-decoration-color 0.15s',
              }}
              onMouseEnter={(e) => e.target.style.textDecorationColor = '#4f46e5'}
              onMouseLeave={(e) => e.target.style.textDecorationColor = 'transparent'}
            >
              Create account <ArrowRight size={13} style={{ verticalAlign: 'middle' }} />
            </button>
          </div>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '1.75rem 0' }}>
            <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
            <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 500, whiteSpace: 'nowrap' }}>QUICK DEMO ACCESS</span>
            <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
          </div>

          {/* Demo Accounts */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
            {demoAccounts.map((acc) => (
              <button
                key={acc.username}
                id={`demo-login-${acc.username}`}
                onClick={() => fillDemo(acc.username)}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 10,
                  padding: '0.6rem 0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.15s',
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = acc.color; e.currentTarget.style.background = '#fff'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#f8fafc'; }}
              >
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: acc.color, flexShrink: 0 }} />
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155' }}>{acc.label}</span>
              </button>
            ))}
          </div>
          <p style={{ textAlign: 'center', marginTop: '0.6rem', fontSize: '0.75rem', color: '#94a3b8' }}>
            Demo password: <code style={{ fontFamily: 'var(--font-mono)', background: '#f1f5f9', padding: '1px 6px', borderRadius: 4 }}>password123</code>
          </p>
        </div>
      </div>

      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

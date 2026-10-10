import React, { useState } from 'react';
import { Calendar, Eye, EyeOff, UserPlus, Check, ArrowLeft } from 'lucide-react';
import api from '../api/client';

export const RegisterView = ({ onSwitchToLogin }) => {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    username: '',
    departmentId: '',
    password: '',
    confirmPassword: '',
  });
  const [departments, setDepartments] = useState([]);
  const [loadingDepts, setLoadingDepts] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  // Fetch departments from backend on mount
  React.useEffect(() => {
    api.get('/departments')
      .then((res) => setDepartments(res.data || []))
      .catch(() => setDepartments([]))
      .finally(() => setLoadingDepts(false));
  }, []);

  const validate = () => {
    if (!form.fullName.trim()) return 'Full name is required.';
    if (!form.email.trim()) return 'Email address is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Please enter a valid email address.';
    if (!form.username.trim()) return 'Username is required.';
    if (form.username.length < 3) return 'Username must be at least 3 characters.';
    if (!form.departmentId) return 'Please select your department.';
    if (!form.password) return 'Password is required.';
    if (form.password.length < 6) return 'Password must be at least 6 characters.';
    if (form.password !== form.confirmPassword) return 'Passwords do not match.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.post('/auth/register', {
        fullName: form.fullName.trim(),
        email: form.email.trim().toLowerCase(),
        username: form.username.trim().toLowerCase(),
        departmentId: parseInt(form.departmentId, 10),
        password: form.password,
      });
      setSuccess(true);
    } catch (err) {
      const msg = err.response?.data?.error || 'Registration failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = () => {
    const p = form.password;
    if (!p) return { label: '', color: '#e2e8f0', width: '0%' };
    if (p.length < 6) return { label: 'Weak', color: '#ef4444', width: '25%' };
    if (p.length < 8) return { label: 'Fair', color: '#f59e0b', width: '50%' };
    if (/[A-Z]/.test(p) && /[0-9]/.test(p)) return { label: 'Strong', color: '#10b981', width: '100%' };
    return { label: 'Good', color: '#3b82f6', width: '75%' };
  };

  const strength = passwordStrength();

  if (success) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-primary)',
        background: '#f8fafc',
        padding: '2rem',
      }}>
        <div style={{
          background: '#fff',
          borderRadius: 24,
          padding: '3rem',
          maxWidth: 480,
          width: '100%',
          textAlign: 'center',
          border: '1px solid #e2e8f0',
          boxShadow: '0 20px 50px rgba(0,0,0,0.08)',
        }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1.5rem',
            boxShadow: '0 8px 24px rgba(16,185,129,0.35)',
          }}>
            <Check size={34} color="white" strokeWidth={2.5} />
          </div>
          <h2 style={{ fontSize: '1.65rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: '#0f172a', marginBottom: '0.65rem' }}>
            Account Created!
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem' }}>
            Your EventEase account has been created successfully. You can now sign in with your credentials.
          </p>
          <button
            id="go-to-login-after-register-btn"
            onClick={onSwitchToLogin}
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.85rem', fontSize: '1rem', borderRadius: 12 }}
          >
            Sign In Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      fontFamily: 'var(--font-primary)',
      background: '#f8fafc',
    }}>
      {/* Left Branding Panel */}
      <div style={{
        width: '42%',
        background: 'linear-gradient(145deg, #0f172a 0%, #1e1b4b 40%, #312e81 75%, #4338ca 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: '4rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', width: 340, height: 340, borderRadius: '50%', background: 'rgba(99,102,241,0.12)', top: -60, right: -80 }} />
        <div style={{ position: 'absolute', width: 220, height: 220, borderRadius: '50%', background: 'rgba(139,92,246,0.1)', bottom: 80, left: -50 }} />

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', marginBottom: '3rem', position: 'relative', zIndex: 1 }}>
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

        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#fff', lineHeight: 1.25, marginBottom: '1.1rem', fontFamily: 'var(--font-display)', position: 'relative', zIndex: 1 }}>
          Join your college's<br />event community
        </h1>
        <p style={{ fontSize: '0.95rem', color: '#94a3b8', lineHeight: 1.7, maxWidth: 320, marginBottom: '2.5rem', position: 'relative', zIndex: 1 }}>
          Create your account to propose events, track approvals, register for activities, and more.
        </p>

        {/* Steps */}
        {[
          { step: '01', text: 'Create your account' },
          { step: '02', text: 'Submit event proposals' },
          { step: '03', text: 'Get approval & publish' },
          { step: '04', text: 'Manage registrations' },
        ].map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', position: 'relative', zIndex: 1 }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'rgba(99,102,241,0.25)',
              border: '1px solid rgba(99,102,241,0.5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.72rem', fontWeight: 700, color: '#a5b4fc', flexShrink: 0,
            }}>{s.step}</div>
            <span style={{ color: '#cbd5e1', fontSize: '0.88rem' }}>{s.text}</span>
          </div>
        ))}
      </div>

      {/* Right Register Form */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 2rem',
        overflowY: 'auto',
      }}>
        <div style={{ width: '100%', maxWidth: 460 }}>
          {/* Back to login */}
          <button
            onClick={onSwitchToLogin}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              color: '#64748b', fontSize: '0.85rem', marginBottom: '1.75rem',
              transition: 'color 0.15s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#4f46e5'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}
            id="back-to-login-btn"
          >
            <ArrowLeft size={15} /> Back to Sign In
          </button>

          {/* Header */}
          <div style={{ marginBottom: '1.75rem' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: '#0f172a', marginBottom: '0.4rem' }}>
              Create your account
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.92rem' }}>
              Join the EventEase portal as a student organizer
            </p>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              background: '#fef2f2', border: '1px solid #fca5a5',
              borderRadius: 10, padding: '0.75rem 1rem',
              marginBottom: '1.25rem', color: '#b91c1c', fontSize: '0.875rem',
              display: 'flex', alignItems: 'center', gap: '0.5rem',
            }}>
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Full Name */}
            <div className="form-group">
              <label className="form-label" htmlFor="reg-fullName">Full Name</label>
              <input
                id="reg-fullName"
                name="fullName"
                type="text"
                className="form-control"
                placeholder="e.g. Shashi Kiran"
                value={form.fullName}
                onChange={handleChange}
                autoComplete="name"
                autoFocus
                style={{ fontSize: '0.95rem', padding: '0.75rem 1rem' }}
              />
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="form-label" htmlFor="reg-email">College Email</label>
              <input
                id="reg-email"
                name="email"
                type="email"
                className="form-control"
                placeholder="you@college.edu"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                style={{ fontSize: '0.95rem', padding: '0.75rem 1rem' }}
              />
            </div>

            {/* Department */}
            <div className="form-group">
              <label className="form-label" htmlFor="reg-department">Department <span style={{ color: '#ef4444' }}>*</span></label>
              <select
                id="reg-department"
                name="departmentId"
                className="form-control"
                value={form.departmentId}
                onChange={handleChange}
                required
                style={{
                  fontSize: '0.95rem',
                  padding: '0.75rem 1rem',
                  cursor: 'pointer',
                  appearance: 'none',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 0.75rem center',
                  paddingRight: '2.5rem',
                  color: form.departmentId ? '#0f172a' : '#94a3b8',
                }}
              >
                <option value="" disabled>Select your department</option>
                {loadingDepts ? (
                  <option disabled>Loading departments...</option>
                ) : (
                  departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.code} — {dept.name}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Username */}
            <div className="form-group">
              <label className="form-label" htmlFor="reg-username">Username</label>
              <input
                id="reg-username"
                name="username"
                type="text"
                className="form-control"
                placeholder="Choose a unique username"
                value={form.username}
                onChange={handleChange}
                autoComplete="username"
                style={{ fontSize: '0.95rem', padding: '0.75rem 1rem' }}
              />
            </div>

            {/* Password */}
            <div className="form-group" style={{ position: 'relative' }}>
              <label className="form-label" htmlFor="reg-password">Password</label>
              <input
                id="reg-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                placeholder="At least 6 characters"
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
                style={{ fontSize: '0.95rem', padding: '0.75rem 1rem', paddingRight: '2.75rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                style={{ position: 'absolute', right: 12, bottom: 12, background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 0, display: 'flex', alignItems: 'center' }}
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
              {/* Strength bar */}
              {form.password && (
                <div style={{ marginTop: '0.4rem' }}>
                  <div style={{ height: 4, borderRadius: 4, background: '#e2e8f0', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: strength.width, background: strength.color, transition: 'all 0.3s ease', borderRadius: 4 }} />
                  </div>
                  <span style={{ fontSize: '0.72rem', color: strength.color, fontWeight: 600 }}>{strength.label}</span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="form-group" style={{ position: 'relative' }}>
              <label className="form-label" htmlFor="reg-confirm-password">Confirm Password</label>
              <input
                id="reg-confirm-password"
                name="confirmPassword"
                type={showConfirm ? 'text' : 'password'}
                className="form-control"
                placeholder="Re-enter your password"
                value={form.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                style={{
                  fontSize: '0.95rem', padding: '0.75rem 1rem', paddingRight: '2.75rem',
                  borderColor: form.confirmPassword && form.password !== form.confirmPassword ? '#ef4444' : undefined,
                }}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((p) => !p)}
                style={{ position: 'absolute', right: 12, bottom: 12, background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 0, display: 'flex', alignItems: 'center' }}
                tabIndex={-1}
                aria-label={showConfirm ? 'Hide password' : 'Show password'}
              >
                {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
              {form.confirmPassword && form.password !== form.confirmPassword && (
                <p style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.3rem' }}>Passwords do not match</p>
              )}
            </div>

            {/* Terms notice */}
            <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: '1.25rem', lineHeight: 1.5 }}>
              By creating an account, you agree to the EventEase college platform terms. Your account will have Student role and can be upgraded by administrators.
            </p>

            <button
              id="register-submit-btn"
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.85rem',
                fontSize: '1rem',
                borderRadius: 12,
                gap: '0.6rem',
                opacity: loading ? 0.75 : 1,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? (
                <>
                  <span style={{ display: 'inline-block', width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', animation: 'spin 0.7s linear infinite' }} />
                  Creating account...
                </>
              ) : (
                <>
                  <UserPlus size={17} />
                  Create Account
                </>
              )}
            </button>
          </form>

          {/* Sign-in link */}
          <div style={{ textAlign: 'center', marginTop: '1.5rem', color: '#64748b', fontSize: '0.9rem' }}>
            Already have an account?{' '}
            <button
              id="go-to-login-btn"
              onClick={onSwitchToLogin}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: '#4f46e5', fontWeight: 700, fontSize: '0.9rem',
                textDecoration: 'underline', textDecorationColor: 'transparent',
                transition: 'text-decoration-color 0.15s',
              }}
              onMouseEnter={(e) => e.target.style.textDecorationColor = '#4f46e5'}
              onMouseLeave={(e) => e.target.style.textDecorationColor = 'transparent'}
            >
              Sign In
            </button>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

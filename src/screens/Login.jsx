import { useState } from 'react';

const roleConfig = {
  ADMIN:   { icon: '🛡️', label: 'Admin',   gradient: 'linear-gradient(135deg,#667eea,#764ba2)', color: '#667eea' },
  DOCTOR:  { icon: '🩺', label: 'Doctor',  gradient: 'linear-gradient(135deg,#11998e,#38ef7d)', color: '#11998e' },
  PATIENT: { icon: '🏥', label: 'Patient', gradient: 'linear-gradient(135deg,#f093fb,#f5576c)', color: '#f093fb' },
};

export default function Login({ role, onBack, onLoginSuccess, onNavigate }) {
  const cfg = roleConfig[role] || roleConfig.ADMIN;

  const [loginMethod, setLoginMethod] = useState('email'); // 'email' | 'phone'
  const [form, setForm]               = useState({ identifier: '', password: '' });
  const [showPass, setShowPass]       = useState(false);
  const [loading, setLoading]         = useState(false);
  const [alert, setAlert]             = useState(null);

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const showAlert = (msg, type = 'error') => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 4500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.identifier || !form.password) return showAlert('Please fill in all fields.');
    setLoading(true);
    try {
      const payload = { password: form.password, role };
      if (loginMethod === 'email') payload.email    = form.identifier;
      else                         payload.phone    = form.identifier;

      const res  = await fetch('http://localhost:8085/api/auth/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Login failed. Please check credentials.');

      localStorage.setItem('hmsToken', data.token);
      localStorage.setItem('hmsUser',  JSON.stringify({ ...data, role }));
      onLoginSuccess({ ...data, role });
    } catch (err) {
      showAlert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card} className="glass-card animate-fadeInUp">
        {/* Back */}
        <button style={styles.backBtn} onClick={onBack}>← Change Role</button>

        {/* Role badge */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ ...styles.roleIcon, background: cfg.gradient }}>
            <span style={{ fontSize: '1.8rem' }}>{cfg.icon}</span>
          </div>
          <h1 style={styles.title}>Welcome Back</h1>
          <p style={styles.sub}>Sign in to your <strong style={{ color: cfg.color }}>{cfg.label}</strong> portal</p>
        </div>

        {/* Method toggle */}
        <div style={styles.toggleRow}>
          {['email', 'phone'].map(m => (
            <button key={m} style={{ ...styles.toggleBtn, ...(loginMethod === m ? { ...styles.toggleActive, color: cfg.color, borderColor: cfg.color } : {}) }}
              onClick={() => { setLoginMethod(m); setForm(f => ({ ...f, identifier: '' })); }}>
              {m === 'email' ? '📧 Email' : '📱 Phone'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* Identifier */}
          <div className="input-group">
            <label>{loginMethod === 'email' ? 'Email Address' : 'Phone Number'}</label>
            <div className="input-wrap">
              <span className="input-icon">{loginMethod === 'email' ? '📧' : '📱'}</span>
              <input
                type={loginMethod === 'email' ? 'email' : 'tel'}
                value={form.identifier}
                onChange={set('identifier')}
                placeholder={loginMethod === 'email' ? 'you@hospital.com' : '+91 9876543210'}
                autoComplete={loginMethod === 'email' ? 'email' : 'tel'}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="input-group">
            <label>Password</label>
            <div className="input-wrap">
              <span className="input-icon">🔒</span>
              <input
                type={showPass ? 'text' : 'password'}
                value={form.password}
                onChange={set('password')}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />
              <button type="button" className="toggle-password" onClick={() => setShowPass(s => !s)}>
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {/* Forgot password */}
          <div style={{ textAlign: 'right', marginTop: -10, marginBottom: 18 }}>
            <button type="button" className="link-btn text-sm" onClick={() => onNavigate('forgot', { role })}>
              Forgot password?
            </button>
          </div>

          {/* Alert */}
          {alert && (
            <div className={`alert alert-${alert.type}`}>
              {alert.type === 'error' ? '⚠️' : '✅'} {alert.msg}
            </div>
          )}

          {/* Submit */}
          <button type="submit" className="btn btn-primary btn-block btn-lg" style={{ marginTop: 8, background: cfg.gradient, boxShadow: `0 4px 20px ${cfg.color}55` }} disabled={loading}>
            {loading ? <><span className="spinner" />&nbsp;Signing in…</> : `Sign In as ${cfg.label}`}
          </button>
        </form>

        {/* Register link */}
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: 22 }}>
          New here?&nbsp;
          <button className="link-btn" style={{ color: cfg.color }} onClick={() => onNavigate('register', { role })}>
            Create an account
          </button>
        </p>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px',
  },
  card: {
    width: '100%', maxWidth: 440, padding: '36px 40px',
    position: 'relative',
  },
  backBtn: {
    background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer',
    fontSize: '0.82rem', padding: 0, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 6,
    transition: 'color 0.2s', fontFamily: 'inherit',
  },
  roleIcon: {
    width: 72, height: 72, borderRadius: 20, margin: '0 auto 16px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 8px 28px rgba(0,0,0,0.3)',
  },
  title: { fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 6 },
  sub: { color: 'var(--text-secondary)', fontSize: '0.9rem' },
  toggleRow: {
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24,
  },
  toggleBtn: {
    padding: '10px', borderRadius: 10, background: 'rgba(255,255,255,0.04)',
    border: '1.5px solid var(--border)', color: 'var(--text-muted)',
    cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.875rem', fontWeight: 600,
    transition: 'all 0.25s',
  },
  toggleActive: {
    background: 'rgba(79,142,247,0.08)',
  },
};

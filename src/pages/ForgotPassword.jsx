import React, { useState } from 'react';

const API = 'http://localhost:8085/api/auth';

export default function ForgotPassword({ role, onBack, onNavigate }) {
  const roleColors = { ADMIN: '#667eea', DOCTOR: '#11998e', PATIENT: '#f093fb' };
  const accentColor = roleColors[role] || '#4f8ef7';

  const [method, setMethod]       = useState('email'); // 'email' | 'phone'
  const [step, setStep]           = useState(1);       // 1=identifier, 2=otp, 3=new password, 4=success
  const [identifier, setIdent]    = useState('');
  const [resolvedEmail, setEmail] = useState('');      // backend returns this
  const [otp, setOtp]             = useState(['','','','','','']);
  const [form, setForm]           = useState({ password: '', confirm: '' });
  const [showPass, setShowPass]   = useState(false);
  const [showConf, setShowConf]   = useState(false);
  const [loading, setLoading]     = useState(false);
  const [alert, setAlert]         = useState(null);
  const [resendTimer, setTimer]   = useState(0);

  const showAlert = (msg, type = 'error') => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 5000);
  };

  const startTimer = () => {
    setTimer(60);
    const iv = setInterval(() => {
      setTimer(t => { if (t <= 1) { clearInterval(iv); return 0; } return t - 1; });
    }, 1000);
  };

  /* ── Step 1 → Send OTP ── */
  const handleSend = async (e) => {
    e.preventDefault();
    if (!identifier) return showAlert('Please enter your ' + (method === 'email' ? 'email address' : 'phone number') + '.');
    setLoading(true);
    try {
      const body = method === 'email' ? { email: identifier } : { phone: identifier };
      const res  = await fetch(`${API}/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Failed to send OTP.');

      // Backend returns resolved email so we know where to verify
      if (data.email) setEmail(data.email);
      else setEmail(identifier); // fallback

      startTimer();
      setStep(2);
      showAlert('OTP sent! Check your email inbox (and spam folder).', 'success');
    } catch (err) {
      showAlert(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ── Step 1 → Resend OTP ── */
  const handleResend = async () => {
    if (resendTimer > 0) return;
    try {
      const body = method === 'email' ? { email: identifier } : { phone: identifier };
      await fetch(`${API}/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      startTimer();
      showAlert('OTP resent! Check your email.', 'success');
    } catch {
      showAlert('Failed to resend OTP.');
    }
  };

  /* ── Step 2 OTP input handlers ── */
  const handleOtp = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < 5) document.getElementById(`otp-${i+1}`)?.focus();
  };

  const handleOtpKey = (i, e) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) document.getElementById(`otp-${i-1}`)?.focus();
  };

  /* ── Step 2 → Verify OTP ── */
  const handleVerify = async (e) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) return showAlert('Please enter the complete 6-digit OTP.');
    setLoading(true);
    try {
      const res  = await fetch(`${API}/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resolvedEmail, otp: code }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Invalid or expired OTP.');
      setStep(3);
    } catch (err) {
      showAlert(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ── Step 3 → Reset password ── */
  const handleReset = async (e) => {
    e.preventDefault();
    if (form.password.length < 8)       return showAlert('Password must be at least 8 characters.');
    if (form.password !== form.confirm) return showAlert('Passwords do not match.');
    setLoading(true);
    try {
      const res  = await fetch(`${API}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resolvedEmail, password: form.password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Failed to reset password.');
      setStep(4);
    } catch (err) {
      showAlert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const steps = ['Request OTP', 'Verify OTP', 'New Password', 'Done'];

  return (
    <div style={styles.wrapper}>
      <div style={styles.card} className="glass-card animate-fadeInUp">
        {step < 4 && (
          <button style={styles.backBtn} onClick={step === 1 ? onBack : () => setStep(s => s - 1)}>
            ← {step === 1 ? 'Back to Login' : 'Back'}
          </button>
        )}

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>
            {step === 4 ? '🎉' : step === 3 ? '🔐' : step === 2 ? '🔢' : '🔑'}
          </div>
          <h1 style={styles.title}>
            {step === 1 && 'Reset Password'}
            {step === 2 && 'Enter OTP'}
            {step === 3 && 'New Password'}
            {step === 4 && 'Password Reset!'}
          </h1>
          <p style={styles.sub}>
            {step === 1 && "We'll send a verification code to reset your password."}
            {step === 2 && <>OTP sent to <strong style={{ color: accentColor }}>{resolvedEmail}</strong>. Check your inbox.</>}
            {step === 3 && 'Choose a strong new password for your account.'}
            {step === 4 && 'Your password has been reset successfully.'}
          </p>
        </div>

        {/* Progress */}
        {step < 4 && (
          <div style={{ display: 'flex', gap: 6, marginBottom: 28 }}>
            {steps.slice(0,3).map((_, i) => (
              <div key={i} style={{
                flex: 1, height: 4, borderRadius: 2,
                background: i < step ? accentColor : 'var(--border)',
                transition: 'background 0.4s',
              }} />
            ))}
          </div>
        )}

        {/* ── Step 1 ── */}
        {step === 1 && (
          <form onSubmit={handleSend} noValidate>
            <div style={styles.methodToggle}>
              {['email','phone'].map(m => (
                <button key={m} type="button"
                  style={{ ...styles.methodBtn, ...(method === m ? { ...styles.methodActive, borderColor: accentColor, color: accentColor } : {}) }}
                  onClick={() => { setMethod(m); setIdent(''); }}>
                  {m === 'email' ? '📧 Email' : '📱 Phone'}
                </button>
              ))}
            </div>
            <div className="input-group">
              <label>{method === 'email' ? 'Email Address' : 'Phone Number'}</label>
              <div className="input-wrap">
                <span className="input-icon">{method === 'email' ? '📧' : '📱'}</span>
                <input
                  type={method === 'email' ? 'email' : 'tel'}
                  value={identifier}
                  onChange={e => setIdent(e.target.value)}
                  placeholder={method === 'email' ? 'you@hospital.com' : '+91 9876543210'}
                  required
                />
              </div>
            </div>
            {alert && <div className={`alert alert-${alert.type}`}>{alert.msg}</div>}
            <button type="submit" className="btn btn-primary btn-block btn-lg"
              style={{ marginTop: 8, background: `linear-gradient(135deg, ${accentColor}, #4f8ef7)` }}
              disabled={loading}>
              {loading ? <><span className="spinner" />&nbsp;Sending OTP…</> : 'Send OTP →'}
            </button>
          </form>
        )}

        {/* ── Step 2 ── */}
        {step === 2 && (
          <form onSubmit={handleVerify} noValidate>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 24 }}>
              {otp.map((d, i) => (
                <input
                  key={i} id={`otp-${i}`}
                  type="text" inputMode="numeric" maxLength={1}
                  value={d} onChange={e => handleOtp(i, e.target.value)}
                  onKeyDown={e => handleOtpKey(i, e)}
                  style={{
                    width: 48, height: 56, textAlign: 'center', fontSize: '1.4rem',
                    fontWeight: 700, background: 'rgba(255,255,255,0.05)',
                    border: d ? `2px solid ${accentColor}` : '1.5px solid var(--border)',
                    borderRadius: 12, color: 'var(--text-primary)', outline: 'none',
                    transition: 'border 0.2s', fontFamily: 'inherit',
                  }}
                />
              ))}
            </div>
            <div style={{ textAlign: 'center', marginBottom: 20, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {resendTimer > 0
                ? <>Resend in <strong style={{ color: accentColor }}>{resendTimer}s</strong></>
                : <><button className="link-btn" style={{ color: accentColor }} type="button" onClick={handleResend}>Resend OTP</button></>
              }
            </div>
            {alert && <div className={`alert alert-${alert.type}`}>{alert.msg}</div>}
            <button type="submit" className="btn btn-primary btn-block btn-lg"
              style={{ background: `linear-gradient(135deg, ${accentColor}, #4f8ef7)` }}
              disabled={loading || otp.join('').length < 6}>
              {loading ? <><span className="spinner" />&nbsp;Verifying…</> : 'Verify OTP →'}
            </button>
          </form>
        )}

        {/* ── Step 3 ── */}
        {step === 3 && (
          <form onSubmit={handleReset} noValidate>
            <div className="input-group">
              <label>New Password</label>
              <div className="input-wrap">
                <span className="input-icon">🔒</span>
                <input type={showPass ? 'text' : 'password'}
                  value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="Min. 8 characters" required />
                <button type="button" className="toggle-password" onClick={() => setShowPass(s => !s)}>
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
            <div className="input-group">
              <label>Confirm New Password</label>
              <div className="input-wrap">
                <span className="input-icon">🔒</span>
                <input type={showConf ? 'text' : 'password'}
                  value={form.confirm} onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))}
                  placeholder="Repeat new password" required />
                <button type="button" className="toggle-password" onClick={() => setShowConf(s => !s)}>
                  {showConf ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
            {alert && <div className={`alert alert-${alert.type}`}>{alert.msg}</div>}
            <button type="submit" className="btn btn-primary btn-block btn-lg"
              style={{ marginTop: 8, background: `linear-gradient(135deg, ${accentColor}, #4f8ef7)` }}
              disabled={loading}>
              {loading ? <><span className="spinner" />&nbsp;Resetting…</> : 'Reset Password ✓'}
            </button>
          </form>
        )}

        {/* ── Step 4 ── */}
        {step === 4 && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(16,185,129,0.15)', border: '2px solid rgba(16,185,129,0.4)', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>✅</div>
            <button className="btn btn-primary btn-block btn-lg" style={{ background: `linear-gradient(135deg, ${accentColor}, #4f8ef7)` }}
              onClick={() => onNavigate('login', { role })}>
              Sign In with New Password →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  wrapper: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' },
  card: { width: '100%', maxWidth: 420, padding: '36px 40px', position: 'relative' },
  backBtn: {
    background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer',
    fontSize: '0.82rem', padding: 0, marginBottom: 24, fontFamily: 'inherit', transition: 'color 0.2s',
  },
  title: { fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 8 },
  sub:   { color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 },
  methodToggle: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 22 },
  methodBtn: {
    padding: 10, borderRadius: 10, background: 'rgba(255,255,255,0.04)',
    border: '1.5px solid var(--border)', color: 'var(--text-muted)',
    cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.875rem', fontWeight: 600, transition: 'all 0.25s',
  },
  methodActive: { background: 'rgba(79,142,247,0.08)' },
};

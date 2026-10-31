import { useState } from 'react';

const roleConfig = {
  ADMIN:   { icon: '🛡️', label: 'Admin',   gradient: 'linear-gradient(135deg,#667eea,#764ba2)', color: '#667eea' },
  DOCTOR:  { icon: '🩺', label: 'Doctor',  gradient: 'linear-gradient(135deg,#11998e,#38ef7d)', color: '#11998e' },
  PATIENT: { icon: '🏥', label: 'Patient', gradient: 'linear-gradient(135deg,#f093fb,#f5576c)', color: '#f093fb' },
};

const specializations = [
  'Cardiology','Dermatology','Emergency Medicine','Endocrinology','Gastroenterology',
  'General Surgery','Gynecology','Hematology','Internal Medicine','Neurology',
  'Oncology','Ophthalmology','Orthopedics','Pediatrics','Psychiatry','Pulmonology',
  'Radiology','Rheumatology','Urology','Other',
];

function getStrength(pw) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}
const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'];
const strengthColor = ['', '#ef4444', '#f59e0b', '#3b82f6', '#10b981'];

export default function Register({ role, onBack, onNavigate }) {
  const cfg = roleConfig[role] || roleConfig.PATIENT;

  const [step, setStep]       = useState(1); // 1 = basic info, 2 = profile, 3 = success
  const [showPass, setShowPass]   = useState(false);
  const [showConf, setShowConf]   = useState(false);
  const [loading, setLoading]     = useState(false);
  const [alert, setAlert]         = useState(null);

  const [form, setForm] = useState({
    fullName: '', email: '', phone: '', password: '', confirmPassword: '',
    // doctor extras
    specialization: '', licenseNumber: '', experience: '',
    // patient extras
    dateOfBirth: '', gender: '', bloodGroup: '', address: '',
  });

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));
  const strength = getStrength(form.password);

  const showAlert = (msg, type = 'error') => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 5000);
  };

  const validateStep1 = () => {
    if (!form.fullName.trim())                       return showAlert('Full name is required.');
    if (!form.email.includes('@'))                   return showAlert('Enter a valid email address.');
    if (!/^\+?\d{7,15}$/.test(form.phone.replace(/\s/g,''))) return showAlert('Enter a valid phone number.');
    if (form.password.length < 8)                   return showAlert('Password must be at least 8 characters.');
    if (form.password !== form.confirmPassword)     return showAlert('Passwords do not match.');
    return true;
  };

  const handleNext = () => {
    if (!validateStep1()) return;
    setAlert(null);
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);
    try {
      const payload = {
        fullName: form.fullName, email: form.email,
        phone: form.phone, password: form.password, role,
      };
      if (role === 'DOCTOR') {
        payload.specialization = form.specialization;
        payload.licenseNumber  = form.licenseNumber;
        payload.experience     = Number(form.experience) || 0;
      }
      if (role === 'PATIENT') {
        payload.dateOfBirth = form.dateOfBirth;
        payload.gender      = form.gender;
        payload.bloodGroup  = form.bloodGroup;
        payload.address     = form.address;
      }

      const res  = await fetch('http://localhost:8085/api/auth/register', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Registration failed.');
      setStep(3);
    } catch (err) {
      showAlert(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ─── Step 3: Success Screen ─── */
  if (step === 3) return (
    <div style={styles.wrapper}>
      <div style={styles.card} className="glass-card animate-fadeInUp">
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{ fontSize: '4rem', marginBottom: 16 }}>🎉</div>
          <h2 style={{ fontWeight: 800, fontSize: '1.6rem', marginBottom: 10 }}>Account Created!</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 32 }}>
            Your <strong style={{ color: cfg.color }}>{cfg.label}</strong> account has been created successfully.
            Please sign in to continue.
          </p>
          <button className="btn btn-primary btn-block btn-lg" style={{ background: cfg.gradient }}
            onClick={() => onNavigate('login', { role })}>
            Go to Login →
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={styles.wrapper}>
      <div style={{ ...styles.card, maxWidth: 500 }} className="glass-card animate-fadeInUp">
        <button style={styles.backBtn} onClick={step === 2 ? () => setStep(1) : onBack}>
          ← {step === 2 ? 'Back' : 'Change Role'}
        </button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ ...styles.roleIcon, background: cfg.gradient }}><span style={{ fontSize: '1.8rem' }}>{cfg.icon}</span></div>
          <h1 style={styles.title}>Create Account</h1>
          <p style={styles.sub}>Register as <strong style={{ color: cfg.color }}>{cfg.label}</strong></p>
        </div>

        {/* Step indicator */}
        <div style={styles.stepRow}>
          {[1,2].map(n => (
            <div key={n} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{
                ...styles.stepDot,
                background: step >= n ? cfg.gradient : 'transparent',
                border: `2px solid ${step >= n ? 'transparent' : 'var(--border)'}`,
                color: step >= n ? '#fff' : 'var(--text-muted)',
              }}>{n}</div>
              <span style={{ fontSize: '0.72rem', color: step >= n ? cfg.color : 'var(--text-muted)', fontWeight: 600 }}>
                {n === 1 ? 'Account Info' : 'Profile Details'}
              </span>
            </div>
          ))}
          <div style={{ position: 'absolute', top: 16, left: '50%', transform: 'translateX(-50%)', width: '45%', height: 2, background: step === 2 ? cfg.color : 'var(--border)', transition: 'background 0.4s', zIndex: 0 }} />
        </div>

        <form onSubmit={step === 1 ? (e) => { e.preventDefault(); handleNext(); } : handleSubmit} noValidate>
          {step === 1 && (
            <>
              <div className="input-group">
                <label>Full Name</label>
                <div className="input-wrap"><span className="input-icon">👤</span>
                  <input value={form.fullName} onChange={set('fullName')} placeholder="Dr. John Smith" required />
                </div>
              </div>
              <div className="input-group">
                <label>Email Address</label>
                <div className="input-wrap"><span className="input-icon">📧</span>
                  <input type="email" value={form.email} onChange={set('email')} placeholder="you@hospital.com" required />
                </div>
              </div>
              <div className="input-group">
                <label>Phone Number</label>
                <div className="input-wrap"><span className="input-icon">📱</span>
                  <input type="tel" value={form.phone} onChange={set('phone')} placeholder="+91 9876543210" required />
                </div>
              </div>
              <div className="input-group">
                <label>Password</label>
                <div className="input-wrap"><span className="input-icon">🔒</span>
                  <input type={showPass ? 'text' : 'password'} value={form.password} onChange={set('password')} placeholder="Min. 8 characters" required />
                  <button type="button" className="toggle-password" onClick={() => setShowPass(s => !s)}>{showPass ? '🙈' : '👁️'}</button>
                </div>
                {form.password && (
                  <div style={{ marginTop: 6 }}>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {[1,2,3,4].map(i => <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= strength ? strengthColor[strength] : 'var(--border)', transition: 'background 0.3s' }} />)}
                    </div>
                    <span style={{ fontSize: '0.72rem', color: strengthColor[strength], marginTop: 3, display: 'block' }}>{strengthLabel[strength]}</span>
                  </div>
                )}
              </div>
              <div className="input-group">
                <label>Confirm Password</label>
                <div className="input-wrap"><span className="input-icon">🔒</span>
                  <input type={showConf ? 'text' : 'password'} value={form.confirmPassword} onChange={set('confirmPassword')} placeholder="Repeat password" required />
                  <button type="button" className="toggle-password" onClick={() => setShowConf(s => !s)}>{showConf ? '🙈' : '👁️'}</button>
                </div>
              </div>
            </>
          )}

          {step === 2 && role === 'DOCTOR' && (
            <>
              <div className="input-group">
                <label>Specialization</label>
                <div className="input-wrap"><span className="input-icon">🏥</span>
                  <select value={form.specialization} onChange={set('specialization')} required>
                    <option value="">Select specialization</option>
                    {specializations.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="input-group">
                <label>Medical License Number</label>
                <div className="input-wrap"><span className="input-icon">📋</span>
                  <input value={form.licenseNumber} onChange={set('licenseNumber')} placeholder="MCI-XXXX-XXXX" />
                </div>
              </div>
              <div className="input-group">
                <label>Years of Experience</label>
                <div className="input-wrap"><span className="input-icon">⭐</span>
                  <input type="number" min="0" max="60" value={form.experience} onChange={set('experience')} placeholder="e.g. 5" />
                </div>
              </div>
            </>
          )}

          {step === 2 && role === 'PATIENT' && (
            <>
              <div className="input-group">
                <label>Date of Birth</label>
                <div className="input-wrap"><span className="input-icon">🗓️</span>
                  <input type="date" value={form.dateOfBirth} onChange={set('dateOfBirth')} required />
                </div>
              </div>
              <div className="grid-2" style={{ gap: 14 }}>
                <div className="input-group">
                  <label>Gender</label>
                  <div className="input-wrap"><span className="input-icon">⚧</span>
                    <select value={form.gender} onChange={set('gender')}>
                      <option value="">Select</option>
                      <option>Male</option><option>Female</option><option>Other</option>
                    </select>
                  </div>
                </div>
                <div className="input-group">
                  <label>Blood Group</label>
                  <div className="input-wrap"><span className="input-icon">🩸</span>
                    <select value={form.bloodGroup} onChange={set('bloodGroup')}>
                      <option value="">Select</option>
                      {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(bg => <option key={bg}>{bg}</option>)}
                    </select>
                  </div>
                </div>
              </div>
              <div className="input-group">
                <label>Address</label>
                <div className="input-wrap"><span className="input-icon">📍</span>
                  <input value={form.address} onChange={set('address')} placeholder="123 Main St, City, State" />
                </div>
              </div>
            </>
          )}

          {step === 2 && role === 'ADMIN' && (
            <div style={{ padding: '20px 0', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <div style={{ fontSize: '3rem', marginBottom: 12 }}>✅</div>
              <p>Admin accounts are granted full system access. Please review your details before submitting.</p>
            </div>
          )}

          {alert && <div className={`alert alert-${alert.type}`}>{alert.type === 'error' ? '⚠️' : '✅'} {alert.msg}</div>}

          <button type="submit" className="btn btn-primary btn-block btn-lg"
            style={{ marginTop: 12, background: cfg.gradient, boxShadow: `0 4px 20px ${cfg.color}55` }}
            disabled={loading}>
            {loading ? <><span className="spinner" />&nbsp;Creating account…</> : step === 1 ? 'Continue →' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: 20 }}>
          Already have an account?&nbsp;
          <button className="link-btn" style={{ color: cfg.color }} onClick={() => onNavigate('login', { role })}>
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
}

const styles = {
  wrapper: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' },
  card: { width: '100%', maxWidth: 480, padding: '36px 40px', position: 'relative' },
  backBtn: {
    background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer',
    fontSize: '0.82rem', padding: 0, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 6,
    transition: 'color 0.2s', fontFamily: 'inherit',
  },
  roleIcon: {
    width: 68, height: 68, borderRadius: 18, margin: '0 auto 16px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 8px 28px rgba(0,0,0,0.3)',
  },
  title: { fontSize: '1.55rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 6 },
  sub:   { color: 'var(--text-secondary)', fontSize: '0.9rem' },
  stepRow: { display: 'flex', justifyContent: 'space-between', marginBottom: 28, position: 'relative' },
  stepDot: {
    width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center',
    justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, zIndex: 1,
    transition: 'all 0.3s',
  },
};

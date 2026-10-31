const roles = [
  {
    id: 'ADMIN',
    icon: '🛡️',
    title: 'Admin',
    subtitle: 'System Administrator',
    description: 'Manage the entire hospital system, staff, patients, billing, and reports.',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    glow: 'rgba(102,126,234,0.4)',
    features: ['Staff Management', 'System Reports', 'Billing Control', 'Full Access'],
  },
  {
    id: 'DOCTOR',
    icon: '🩺',
    title: 'Doctor',
    subtitle: 'Medical Professional',
    description: 'Access patient records, manage appointments, and update medical notes.',
    gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    glow: 'rgba(17,153,142,0.4)',
    features: ['Patient Records', 'Appointments', 'Medical Notes', 'Prescriptions'],
  },
  {
    id: 'PATIENT',
    icon: '🏥',
    title: 'Patient',
    subtitle: 'Healthcare Recipient',
    description: 'View appointments, medical history, test results, and billing information.',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    glow: 'rgba(240,147,251,0.4)',
    features: ['My Appointments', 'Medical History', 'Test Results', 'Billing'],
  },
];

export default function Landing({ onRoleSelect }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 56, animation: 'fadeInUp 0.7s ease both' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14,
            background: 'linear-gradient(135deg, #4f8ef7, #7c3aed)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.6rem', boxShadow: '0 8px 24px rgba(79,142,247,0.4)',
          }}>⚕️</div>
          <span style={{ fontSize: '1.7rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            HMS<span style={{ color: '#4f8ef7' }}>+</span>
          </span>
        </div>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 16 }}>
          Hospital Management<br />
          <span style={{
            background: 'linear-gradient(90deg, #4f8ef7, #7c3aed, #06b6d4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>System</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: 500, margin: '0 auto' }}>
          Select your role to continue. Each portal is secured with role-based access control.
        </p>
      </div>

      {/* Role Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 24,
        width: '100%',
        maxWidth: 980,
      }}>
        {roles.map((role, i) => (
          <button
            key={role.id}
            onClick={() => onRoleSelect(role.id)}
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 24,
              padding: '32px 28px',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
              animation: `fadeInUp 0.6s ${0.1 * i + 0.2}s ease both`,
              color: 'var(--text-primary)',
              backdropFilter: 'blur(20px)',
              position: 'relative',
              overflow: 'hidden',
            }}
            className="role-card"
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)';
              e.currentTarget.style.boxShadow = `0 20px 60px ${role.glow}`;
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)';
              e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = '';
              e.currentTarget.style.boxShadow = '';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
              e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
            }}
          >
            {/* Gradient accent bar */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: role.gradient, borderRadius: '24px 24px 0 0' }} />

            {/* Icon */}
            <div style={{
              width: 64, height: 64, borderRadius: 18,
              background: role.gradient,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.9rem', marginBottom: 20,
              boxShadow: `0 8px 24px ${role.glow}`,
            }}>{role.icon}</div>

            <div style={{ fontWeight: 800, fontSize: '1.35rem', marginBottom: 4 }}>{role.title}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 14 }}>{role.subtitle}</div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: 22 }}>{role.description}</p>

            {/* Features list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {role.features.map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  <span style={{ color: role.glow.replace('0.4', '1') }}>✓</span>
                  {f}
                </div>
              ))}
            </div>

            {/* CTA */}
            <div style={{
              marginTop: 24, padding: '11px 20px',
              background: role.gradient,
              borderRadius: 10, display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: 8,
              fontWeight: 700, fontSize: '0.9rem',
              boxShadow: `0 4px 16px ${role.glow}`,
            }}>
              Continue as {role.title} →
            </div>
          </button>
        ))}
      </div>

      {/* Footer */}
      <div style={{ marginTop: 52, textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
        <span>🔒 Secured with JWT Authentication &nbsp;·&nbsp; HIPAA Compliant &nbsp;·&nbsp; 256-bit Encryption</span>
      </div>
    </div>
  );
}

import React, { useState } from 'react';

const navItems = [
  { id: 'dashboard',   icon: '📊', label: 'My Health'      },
  { id: 'appointments',icon: '📅', label: 'Appointments'   },
  { id: 'records',     icon: '📋', label: 'Medical Records' },
  { id: 'billing',     icon: '💳', label: 'Billing'        },
  { id: 'profile',     icon: '👤', label: 'My Profile'     },
];

const demoAppointments = [
  { id:1, doctor:'Dr. Priya Sharma', specialization:'Cardiologist', date:'2026-05-20', time:'10:00 AM', status:'SCHEDULED',  reason:'Follow-up', room:'Room 201', fee:800  },
  { id:2, doctor:'Dr. Rahul Verma',  specialization:'Neurologist',  date:'2026-05-28', time:'02:00 PM', status:'SCHEDULED',  reason:'Headache evaluation', room:'Room 305', fee:600 },
  { id:3, doctor:'Dr. Priya Sharma', specialization:'Cardiologist', date:'2026-04-15', time:'11:00 AM', status:'COMPLETED',  reason:'Initial Consultation', room:'Room 201', fee:800 },
  { id:4, doctor:'Dr. Kavya Iyer',   specialization:'General',      date:'2026-03-10', time:'09:30 AM', status:'COMPLETED',  reason:'Fever',    room:'Room 101', fee:300 },
];

const demoRecords = [
  { id:1, date:'2026-04-15', doctor:'Dr. Priya Sharma', diagnosis:'Essential Hypertension', prescription:['Amlodipine 5mg – OD','Aspirin 75mg – OD'], notes:'BP: 145/90. Reduce salt intake. Follow up in 1 month.' },
  { id:2, date:'2026-03-10', doctor:'Dr. Kavya Iyer',   diagnosis:'Viral Fever',            prescription:['Paracetamol 500mg – TDS','ORS Sachets'],        notes:'Temperature 102°F. Rest and fluids advised.' },
];

const demoBills = [
  { id:1, date:'2026-04-15', description:'Consultation – Cardiology',  amount:800,  status:'PAID'    },
  { id:2, date:'2026-04-15', description:'Blood Pressure Lab Tests',   amount:450,  status:'PAID'    },
  { id:3, date:'2026-05-20', description:'Upcoming Consultation',      amount:800,  status:'PENDING' },
];

const statusColor = s => ({ SCHEDULED:'primary', COMPLETED:'success', CANCELLED:'danger', PAID:'success', PENDING:'warning' }[s] || 'primary');

export default function PatientDashboard({ user, onLogout }) {
  const [active, setActive]       = useState('dashboard');
  const [sidebarOpen, setSidebar] = useState(true);
  const [bookModal, setBookModal] = useState(false);
  const [toast, setToast]         = useState(null);
  const [bookForm, setBookForm]   = useState({ doctor:'', date:'', time:'', reason:'' });

  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3500); };

  const upcomingApts = demoAppointments.filter(a => a.status === 'SCHEDULED');
  const stats = [
    { label: 'Upcoming Visits',    value: upcomingApts.length,  icon: '📅', color: '#f093fb', bg: 'rgba(240,147,251,0.15)' },
    { label: 'Completed Visits',   value: demoAppointments.filter(a => a.status === 'COMPLETED').length, icon: '✅', color: '#10b981', bg: 'rgba(16,185,129,0.15)' },
    { label: 'Medical Records',    value: demoRecords.length,   icon: '📋', color: '#667eea', bg: 'rgba(102,126,234,0.15)' },
    { label: 'Pending Payments',   value: `₹${demoBills.filter(b => b.status === 'PENDING').reduce((s, b) => s + b.amount, 0)}`, icon: '💳', color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
  ];

  const doctors = ['Dr. Priya Sharma (Cardiology)', 'Dr. Rahul Verma (Neurology)', 'Dr. Kavya Iyer (General)'];

  return (
    <div style={styles.root}>
      {/* Sidebar */}
      <aside style={{ ...styles.sidebar, width: sidebarOpen ? 240 : 68 }}>
        <div style={styles.sidebarTop}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, overflow: 'hidden' }}>
            <div style={{ ...styles.logo, background: 'linear-gradient(135deg,#f093fb,#f5576c)' }}>🏥</div>
            {sidebarOpen && <span style={{ fontWeight: 800, fontSize: '1.1rem', whiteSpace: 'nowrap' }}>Patient Portal</span>}
          </div>
          <button style={styles.toggleBtn} onClick={() => setSidebar(s => !s)}>{sidebarOpen ? '◀' : '▶'}</button>
        </div>
        <nav style={{ flex: 1, padding: '12px 8px' }}>
          {navItems.map(n => (
            <button key={n.id} style={{ ...styles.navItem, ...(active === n.id ? styles.navActive : {}) }} onClick={() => setActive(n.id)}>
              <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>{n.icon}</span>
              {sidebarOpen && <span style={{ whiteSpace: 'nowrap' }}>{n.label}</span>}
            </button>
          ))}
        </nav>
        <div style={{ padding: '12px 8px', borderTop: '1px solid var(--border)' }}>
          <button style={{ ...styles.navItem, color: 'var(--danger)' }} onClick={onLogout}>
            <span style={{ fontSize: '1.2rem' }}>🚪</span>
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={styles.main}>
        <header style={styles.header}>
          <div>
            <h2 style={{ fontWeight: 700, fontSize: '1.2rem' }}>{navItems.find(n => n.id === active)?.label || 'My Health'}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Patient Portal · Monday, May 20, 2026</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button className="btn btn-primary btn-sm" style={{ background: 'linear-gradient(135deg,#f093fb,#f5576c)' }} onClick={() => setBookModal(true)}>
              + Book Appointment
            </button>
            <div style={{ ...styles.avatar, background: 'rgba(240,147,251,0.2)' }}>🧑</div>
            <div style={{ lineHeight: 1.3 }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{user?.fullName || user?.username || 'Patient'}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Patient · ID #{user?.id || 'P001'}</div>
            </div>
          </div>
        </header>

        <div style={styles.content}>
          {/* Dashboard */}
          {active === 'dashboard' && (
            <div className="animate-fadeIn">
              {/* Stats */}
              <div className="grid-4" style={{ marginBottom: 28 }}>
                {stats.map(s => (
                  <div key={s.label} className="stat-card">
                    <div className="stat-icon" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
                    <div className="stat-info"><div className="label">{s.label}</div><div className="value" style={{ color: s.color }}>{s.value}</div></div>
                  </div>
                ))}
              </div>

              <div className="grid-2">
                {/* Health Summary */}
                <div style={styles.widget}>
                  <div className="section-title" style={{ marginBottom: 18 }}>❤️ Health Summary</div>
                  {[
                    { label: 'Blood Group',    value: user?.bloodGroup   || 'B+',          icon: '🩸' },
                    { label: 'Age',            value: user?.age          || '32 years',     icon: '🧬' },
                    { label: 'Last Diagnosis', value: 'Hypertension',                       icon: '📋' },
                    { label: 'Last Visit',     value: '2026-04-15',                         icon: '📅' },
                    { label: 'Primary Doctor', value: 'Dr. Priya Sharma',                  icon: '🩺' },
                    { label: 'Allergies',      value: user?.allergies    || 'None reported', icon: '⚠️' },
                  ].map(({ label, value, icon }) => (
                    <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <span style={{ fontSize: '1.1rem', width: 24, textAlign: 'center' }}>{icon}</span>
                      <span style={{ color: 'var(--text-muted)', flex: 1, fontSize: '0.875rem' }}>{label}</span>
                      <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{value}</span>
                    </div>
                  ))}
                </div>

                {/* Upcoming Appointments */}
                <div style={styles.widget}>
                  <div className="section-title" style={{ marginBottom: 18 }}>📅 Upcoming Appointments</div>
                  {upcomingApts.length === 0
                    ? <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-muted)' }}><div style={{ fontSize: '2rem', marginBottom: 8 }}>📅</div><p>No upcoming appointments.</p></div>
                    : upcomingApts.map(a => (
                      <div key={a.id} style={styles.aptCard}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{a.doctor}</div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{a.specialization} · {a.room}</div>
                          </div>
                          <span className={`badge badge-${statusColor(a.status)}`}>{a.status}</span>
                        </div>
                        <div style={{ display: 'flex', gap: 16, marginTop: 10, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                          <span>📅 {a.date}</span>
                          <span>🕐 {a.time}</span>
                          <span>💰 ₹{a.fee}</span>
                        </div>
                        <div style={{ marginTop: 10, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Reason: {a.reason}</div>
                        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                          <button className="btn btn-secondary btn-sm">Reschedule</button>
                          <button className="btn btn-danger btn-sm">Cancel</button>
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>

              {/* Recent prescriptions */}
              <div style={{ ...styles.widget, marginTop: 24 }}>
                <div className="section-title" style={{ marginBottom: 16 }}>💊 Recent Prescriptions</div>
                {demoRecords[0] && (
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    {demoRecords[0].prescription.map(p => (
                      <span key={p} style={{ padding: '6px 14px', background: 'rgba(240,147,251,0.12)', border: '1px solid rgba(240,147,251,0.25)', borderRadius: 999, fontSize: '0.82rem', color: '#f093fb', fontWeight: 600 }}>
                        💊 {p}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Appointments */}
          {active === 'appointments' && (
            <div className="animate-fadeIn">
              <div className="page-header">
                <span className="section-title">📅 All Appointments</span>
                <button className="btn btn-primary btn-sm" style={{ background: 'linear-gradient(135deg,#f093fb,#f5576c)' }} onClick={() => setBookModal(true)}>
                  + Book New
                </button>
              </div>
              <div style={styles.tableCard}>
                <div className="table-wrapper">
                  <table className="tbl">
                    <thead><tr><th>Doctor</th><th>Specialization</th><th>Date</th><th>Time</th><th>Reason</th><th>Fee</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>
                      {demoAppointments.map(a => (
                        <tr key={a.id}>
                          <td>{a.doctor}</td>
                          <td>{a.specialization}</td>
                          <td>{a.date}</td>
                          <td>{a.time}</td>
                          <td>{a.reason}</td>
                          <td style={{ fontWeight: 700, color: '#10b981' }}>₹{a.fee}</td>
                          <td><span className={`badge badge-${statusColor(a.status)}`}>{a.status}</span></td>
                          <td><div className="actions-col">
                            {a.status === 'SCHEDULED' && <><button className="btn btn-secondary btn-sm">Reschedule</button><button className="btn btn-danger btn-sm">Cancel</button></>}
                            {a.status === 'COMPLETED' && <button className="btn btn-secondary btn-sm">View Summary</button>}
                          </div></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Medical Records */}
          {active === 'records' && (
            <div className="animate-fadeIn">
              <div className="section-title" style={{ marginBottom: 24 }}>📋 Medical Records</div>
              {demoRecords.map(r => (
                <div key={r.id} style={{ ...styles.widget, marginBottom: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>🏥 {r.diagnosis}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: 4 }}>{r.doctor} · {r.date}</div>
                    </div>
                    <button className="btn btn-secondary btn-sm">📥 Download</button>
                  </div>
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>Prescription</div>
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                      {r.prescription.map(p => (
                        <span key={p} style={{ padding: '5px 14px', background: 'rgba(102,126,234,0.12)', border: '1px solid rgba(102,126,234,0.25)', borderRadius: 999, fontSize: '0.8rem', color: '#a78bfa', fontWeight: 600 }}>💊 {p}</span>
                      ))}
                    </div>
                  </div>
                  <div style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: 10, fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, borderLeft: '3px solid #667eea' }}>
                    📝 {r.notes}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Billing */}
          {active === 'billing' && (
            <div className="animate-fadeIn">
              <div className="page-header">
                <span className="section-title">💳 Billing & Payments</span>
                <div style={{ display: 'flex', gap: 8 }}>
                  <span className="badge badge-success">Total Paid: ₹{demoBills.filter(b => b.status === 'PAID').reduce((s, b) => s + b.amount, 0)}</span>
                  <span className="badge badge-warning">Pending: ₹{demoBills.filter(b => b.status === 'PENDING').reduce((s, b) => s + b.amount, 0)}</span>
                </div>
              </div>
              <div style={styles.tableCard}>
                <div className="table-wrapper">
                  <table className="tbl">
                    <thead><tr><th>Bill ID</th><th>Date</th><th>Description</th><th>Amount (₹)</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>
                      {demoBills.map(b => (
                        <tr key={b.id}>
                          <td>#{b.id}</td>
                          <td>{b.date}</td>
                          <td>{b.description}</td>
                          <td style={{ fontWeight: 700, color: b.status === 'PAID' ? '#10b981' : '#f59e0b' }}>₹{b.amount}</td>
                          <td><span className={`badge badge-${statusColor(b.status)}`}>{b.status}</span></td>
                          <td><div className="actions-col">
                            <button className="btn btn-secondary btn-sm">📄 Invoice</button>
                            {b.status === 'PENDING' && <button className="btn btn-primary btn-sm" style={{ background: 'linear-gradient(135deg,#f093fb,#f5576c)' }} onClick={() => showToast('Payment initiated (demo mode)!', 'info')}>Pay Now</button>}
                          </div></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Profile */}
          {active === 'profile' && (
            <div className="animate-fadeIn" style={{ maxWidth: 560 }}>
              <div style={styles.widget}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 }}>
                  <div style={{ width: 80, height: 80, borderRadius: 20, background: 'linear-gradient(135deg,#f093fb,#f5576c)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>🧑</div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '1.3rem' }}>{user?.fullName || 'Patient User'}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Patient ID: #{user?.id || 'P001'}</div>
                    <span className="badge badge-success" style={{ marginTop: 6 }}>Active</span>
                  </div>
                </div>
                {[
                  ['Email',      user?.email     || 'patient@email.com',  '📧'],
                  ['Phone',      user?.phone     || '+91 9123456789',     '📱'],
                  ['Date of Birth', user?.dob   || '1994-03-14',          '🗓️'],
                  ['Gender',     user?.gender    || 'Female',              '⚧'],
                  ['Blood Group',user?.bloodGroup|| 'B+',                  '🩸'],
                  ['Address',    user?.address   || '123 MG Road, Bangalore', '📍'],
                ].map(([k, v, ic]) => (
                  <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ fontSize: '1.1rem' }}>{ic}</span>
                    <span style={{ color: 'var(--text-muted)', width: 120, fontSize: '0.875rem' }}>{k}</span>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{v}</span>
                  </div>
                ))}
                <button className="btn btn-primary" style={{ marginTop: 20, background: 'linear-gradient(135deg,#f093fb,#f5576c)' }}>
                  Edit Profile
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Book Appointment Modal */}
      {bookModal && (
        <div style={styles.overlay} onClick={() => setBookModal(false)}>
          <div style={{ ...styles.modalCard, maxWidth: 440 }} className="glass-card" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontWeight: 700, fontSize: '1.1rem' }}>📅 Book Appointment</h3>
              <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.2rem' }} onClick={() => setBookModal(false)}>✕</button>
            </div>
            <form onSubmit={e => { e.preventDefault(); showToast('Appointment booked! (Demo mode)','info'); setBookModal(false); }}>
              <div className="input-group">
                <label>Select Doctor</label>
                <div className="input-wrap"><span className="input-icon">🩺</span>
                  <select value={bookForm.doctor} onChange={e => setBookForm(f => ({ ...f, doctor: e.target.value }))} required>
                    <option value="">Choose a doctor</option>
                    {doctors.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid-2" style={{ gap: 14 }}>
                <div className="input-group">
                  <label>Preferred Date</label>
                  <div className="input-wrap"><span className="input-icon">📅</span>
                    <input type="date" value={bookForm.date} onChange={e => setBookForm(f => ({ ...f, date: e.target.value }))} min={new Date().toISOString().split('T')[0]} required />
                  </div>
                </div>
                <div className="input-group">
                  <label>Preferred Time</label>
                  <div className="input-wrap"><span className="input-icon">🕐</span>
                    <select value={bookForm.time} onChange={e => setBookForm(f => ({ ...f, time: e.target.value }))} required>
                      <option value="">Select time</option>
                      {['09:00 AM','10:00 AM','11:00 AM','12:00 PM','02:00 PM','03:00 PM','04:00 PM'].map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
              </div>
              <div className="input-group">
                <label>Reason for Visit</label>
                <div className="input-wrap"><span className="input-icon">📝</span>
                  <input value={bookForm.reason} onChange={e => setBookForm(f => ({ ...f, reason: e.target.value }))} placeholder="Briefly describe your symptoms" required />
                </div>
              </div>
              <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: 10, background: 'linear-gradient(135deg,#f093fb,#f5576c)' }}>
                Confirm Booking ✓
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`alert alert-${toast.type}`} style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, minWidth: 260, boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}>
          {toast.type === 'success' ? '✅' : 'ℹ️'} {toast.msg}
        </div>
      )}
    </div>
  );
}

const styles = {
  root:       { display: 'flex', height: '100vh', overflow: 'hidden' },
  sidebar:    { background: 'rgba(255,255,255,0.03)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', transition: 'width 0.3s ease', overflow: 'hidden', flexShrink: 0 },
  sidebarTop: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 14px 16px', borderBottom: '1px solid var(--border)' },
  logo:       { width: 38, height: 38, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 },
  toggleBtn:  { background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.8rem', padding: 4 },
  navItem:    { display: 'flex', alignItems: 'center', gap: 12, padding: '11px 10px', borderRadius: 10, background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', width: '100%', textAlign: 'left', fontFamily: 'inherit', fontSize: '0.88rem', fontWeight: 500, transition: 'all 0.2s', marginBottom: 2, overflow: 'hidden' },
  navActive:  { background: 'rgba(240,147,251,0.15)', color: '#f093fb', fontWeight: 700 },
  main:       { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  header:     { padding: '18px 28px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.02)', flexWrap: 'wrap', gap: 12 },
  content:    { flex: 1, overflowY: 'auto', padding: '28px' },
  avatar:     { width: 40, height: 40, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' },
  widget:     { background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: 16, padding: '20px 22px' },
  aptCard:    { background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: 12, padding: '14px 16px', marginBottom: 14 },
  tableCard:  { background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' },
  overlay:    { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 24 },
  modalCard:  { width: '100%', padding: '28px 32px' },
};

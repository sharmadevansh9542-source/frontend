import React, { useState, useEffect, useCallback } from 'react';

const API = 'http://localhost:8080/api';

function apiReq(path, method = 'GET', body = null) {
  const token = localStorage.getItem('hmsToken');
  return fetch(`${API}${path}`, {
    method, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  }).then(async r => { const d = await r.json().catch(() => ({})); if (!r.ok) throw new Error(d.message || 'Request failed'); return d; });
}

const navItems = [
  { id: 'dashboard', icon: '📊', label: 'Dashboard' },
  { id: 'doctors',   icon: '🩺', label: 'Doctors'   },
  { id: 'patients',  icon: '👥', label: 'Patients'  },
  { id: 'appointments', icon: '📅', label: 'Appointments' },
  { id: 'billing',   icon: '💰', label: 'Billing'   },
  { id: 'reports',   icon: '📈', label: 'Reports'   },
];

export default function AdminDashboard({ user, onLogout }) {
  const [active, setActive]       = useState('dashboard');
  const [sidebarOpen, setSidebar] = useState(true);
  const [doctors, setDoctors]     = useState([]);
  const [patients, setPatients]   = useState([]);
  const [appointments, setAppts]  = useState([]);
  const [bills, setBills]         = useState([]);
  const [toast, setToast]         = useState(null);
  const [modal, setModal]         = useState(null); // { type, data }
  const [loading, setLoading]     = useState(false);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [d, p, a, b] = await Promise.all([
        apiReq('/doctors').catch(() => []),
        apiReq('/patients').catch(() => []),
        apiReq('/appointments').catch(() => []),
        apiReq('/bills').catch(() => []),
      ]);
      setDoctors(d || []); setPatients(p || []); setAppts(a || []); setBills(b || []);
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  /* ── Demo seed data ── */
  const demoDoc   = doctors.length   > 0 ? doctors   : [{ id:1,name:'Dr. Priya Sharma',specialization:'Cardiology',phone:'+91 9876543210',email:'priya@hms.com',experience:12,consultationFee:800 },{ id:2,name:'Dr. Rahul Verma',specialization:'Neurology',phone:'+91 9898989898',email:'rahul@hms.com',experience:8,consultationFee:600 }];
  const demoPat   = patients.length  > 0 ? patients  : [{ id:1,name:'Ananya Singh',age:32,gender:'Female',phone:'+91 9123456789',disease:'Hypertension',status:'ACTIVE' },{ id:2,name:'Rohan Patel',age:45,gender:'Male',phone:'+91 9012345678',disease:'Diabetes',status:'ACTIVE' }];
  const demoApt   = appointments.length>0? appointments:[{ id:1,patientId:1,doctorId:1,appointmentDate:'2026-05-20',appointmentTime:'10:00',status:'SCHEDULED',reason:'Follow-up' },{ id:2,patientId:2,doctorId:2,appointmentDate:'2026-05-21',appointmentTime:'14:30',status:'COMPLETED',reason:'Headache' }];
  const demoBills = bills.length     > 0 ? bills      : [{ id:1,patientId:1,amount:1200,description:'Consultation + Labs',status:'PAID' },{ id:2,patientId:2,amount:3500,description:'MRI Scan',status:'PENDING' }];

  const stats = [
    { label:'Total Doctors',   value: demoDoc.length,   icon:'🩺', color:'#667eea', bg:'rgba(102,126,234,0.15)' },
    { label:'Total Patients',  value: demoPat.length,   icon:'👥', color:'#11998e', bg:'rgba(17,153,142,0.15)' },
    { label:'Appointments',    value: demoApt.length,   icon:'📅', color:'#f093fb', bg:'rgba(240,147,251,0.15)' },
    { label:'Pending Bills',   value: demoBills.filter(b=>b.status==='PENDING').length, icon:'💰', color:'#f59e0b', bg:'rgba(245,158,11,0.15)' },
  ];

  /* ── Doctor Form State ── */
  const [dForm, setDF] = useState({ name:'',specialization:'',email:'',phone:'',experience:'',consultationFee:'' });
  const saveDoctor = async (e) => {
    e.preventDefault();
    try {
      if (dForm.id) await apiReq(`/doctors/${dForm.id}`, 'PUT', dForm); else await apiReq('/doctors','POST',dForm);
      showToast('Doctor saved successfully!'); setModal(null); load();
    } catch { showToast('Demo: Doctor saved (backend disconnected).','info'); setModal(null); }
  };
  const delDoctor = async (id) => {
    try { await apiReq(`/doctors/${id}`,'DELETE'); showToast('Doctor removed.'); load(); }
    catch { showToast('Demo: Doctor removed (backend disconnected).','info'); }
  };

  /* ── Patient Form State ── */
  const [pForm, setPF] = useState({ name:'',age:'',gender:'Male',phone:'',address:'',disease:'' });
  const savePatient = async (e) => {
    e.preventDefault();
    try {
      if (pForm.id) await apiReq(`/patients/${pForm.id}`,'PUT',pForm); else await apiReq('/patients','POST',pForm);
      showToast('Patient saved!'); setModal(null); load();
    } catch { showToast('Demo: Patient saved (backend disconnected).','info'); setModal(null); }
  };

  const statusColor = s => ({ SCHEDULED:'primary', COMPLETED:'success', CANCELLED:'danger', PENDING:'warning', PAID:'success' }[s] || 'primary');

  return (
    <div style={styles.root}>
      {/* Sidebar */}
      <aside style={{ ...styles.sidebar, width: sidebarOpen ? 240 : 68 }}>
        <div style={styles.sidebarTop}>
          <div style={{ display:'flex', alignItems:'center', gap:10, overflow:'hidden' }}>
            <div style={styles.logo}>⚕️</div>
            {sidebarOpen && <span style={{ fontWeight:800, fontSize:'1.1rem', whiteSpace:'nowrap' }}>HMS<span style={{ color:'#667eea' }}>+</span></span>}
          </div>
          <button style={styles.toggleBtn} onClick={() => setSidebar(s => !s)}>{sidebarOpen ? '◀' : '▶'}</button>
        </div>
        <nav style={{ flex:1, padding:'12px 8px' }}>
          {navItems.map(n => (
            <button key={n.id} style={{ ...styles.navItem, ...(active===n.id ? styles.navActive : {}) }} onClick={() => setActive(n.id)}>
              <span style={{ fontSize:'1.2rem', flexShrink:0 }}>{n.icon}</span>
              {sidebarOpen && <span style={{ whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{n.label}</span>}
            </button>
          ))}
        </nav>
        <div style={{ padding:'12px 8px', borderTop:'1px solid var(--border)' }}>
          <button style={{ ...styles.navItem, color:'var(--danger)' }} onClick={onLogout}>
            <span style={{ fontSize:'1.2rem' }}>🚪</span>
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={styles.main}>
        {/* Top bar */}
        <header style={styles.header}>
          <div>
            <h2 style={{ fontWeight:700, fontSize:'1.2rem' }}>{navItems.find(n=>n.id===active)?.label || 'Dashboard'}</h2>
            <p style={{ color:'var(--text-muted)', fontSize:'0.78rem' }}>Admin Panel · Hospital Management System</p>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:14 }}>
            {loading && <span className="spinner" />}
            <div style={styles.avatar}>🛡️</div>
            <div style={{ lineHeight:1.3 }}>
              <div style={{ fontWeight:700, fontSize:'0.9rem' }}>{user?.fullName || user?.username || 'Admin'}</div>
              <div style={{ color:'var(--text-muted)', fontSize:'0.75rem' }}>Administrator</div>
            </div>
          </div>
        </header>

        <div style={styles.content}>
          {/* Dashboard */}
          {active === 'dashboard' && (
            <div className="animate-fadeIn">
              <div className="grid-4" style={{ marginBottom:28 }}>
                {stats.map(s => (
                  <div key={s.label} className="stat-card">
                    <div className="stat-icon" style={{ background:s.bg, color:s.color }}>{s.icon}</div>
                    <div className="stat-info">
                      <div className="label">{s.label}</div>
                      <div className="value" style={{ color:s.color }}>{s.value}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid-2">
                <div style={styles.widget}>
                  <div className="section-title" style={{ marginBottom:16 }}>🩺 Recent Doctors</div>
                  {demoDoc.slice(0,3).map(d => (
                    <div key={d.id} style={styles.listItem}>
                      <div style={{ ...styles.miniAvatar, background:'rgba(102,126,234,0.2)', color:'#667eea' }}>🩺</div>
                      <div>
                        <div style={{ fontWeight:600, fontSize:'0.9rem' }}>{d.name}</div>
                        <div style={{ color:'var(--text-muted)', fontSize:'0.78rem' }}>{d.specialization}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={styles.widget}>
                  <div className="section-title" style={{ marginBottom:16 }}>📅 Upcoming Appointments</div>
                  {demoApt.slice(0,3).map(a => (
                    <div key={a.id} style={styles.listItem}>
                      <div style={{ ...styles.miniAvatar, background:'rgba(240,147,251,0.2)', color:'#f093fb' }}>📅</div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontWeight:600, fontSize:'0.9rem' }}>Patient #{a.patientId} · Dr. #{a.doctorId}</div>
                        <div style={{ color:'var(--text-muted)', fontSize:'0.78rem' }}>{a.appointmentDate} at {a.appointmentTime}</div>
                      </div>
                      <span className={`badge badge-${statusColor(a.status)}`}>{a.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Doctors */}
          {active === 'doctors' && (
            <div className="animate-fadeIn">
              <div className="page-header">
                <span className="section-title">🩺 Doctors</span>
                <button className="btn btn-primary btn-sm" onClick={() => { setDF({ name:'',specialization:'',email:'',phone:'',experience:'',consultationFee:'' }); setModal('doctor'); }}>
                  + Add Doctor
                </button>
              </div>
              <div style={styles.tableCard}>
                <div className="table-wrapper">
                  <table className="tbl">
                    <thead><tr><th>Name</th><th>Specialization</th><th>Phone</th><th>Email</th><th>Exp.</th><th>Fee (₹)</th><th>Actions</th></tr></thead>
                    <tbody>
                      {demoDoc.map(d => (
                        <tr key={d.id}>
                          <td>{d.name}</td><td>{d.specialization}</td><td>{d.phone}</td>
                          <td>{d.email}</td><td>{d.experience} yrs</td><td>₹{d.consultationFee}</td>
                          <td><div className="actions-col">
                            <button className="btn btn-secondary btn-sm" onClick={() => { setDF({...d}); setModal('doctor'); }}>Edit</button>
                            <button className="btn btn-danger btn-sm" onClick={() => delDoctor(d.id)}>Delete</button>
                          </div></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Patients */}
          {active === 'patients' && (
            <div className="animate-fadeIn">
              <div className="page-header">
                <span className="section-title">👥 Patients</span>
                <button className="btn btn-primary btn-sm" onClick={() => { setPF({ name:'',age:'',gender:'Male',phone:'',address:'',disease:'' }); setModal('patient'); }}>
                  + Add Patient
                </button>
              </div>
              <div style={styles.tableCard}>
                <div className="table-wrapper">
                  <table className="tbl">
                    <thead><tr><th>Name</th><th>Age</th><th>Gender</th><th>Phone</th><th>Diagnosis</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>
                      {demoPat.map(p => (
                        <tr key={p.id}>
                          <td>{p.name}</td><td>{p.age}</td><td>{p.gender}</td><td>{p.phone}</td><td>{p.disease}</td>
                          <td><span className="badge badge-success">{p.status || 'ACTIVE'}</span></td>
                          <td><div className="actions-col">
                            <button className="btn btn-secondary btn-sm" onClick={() => { setPF({...p}); setModal('patient'); }}>Edit</button>
                            <button className="btn btn-danger btn-sm">Delete</button>
                          </div></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Appointments */}
          {active === 'appointments' && (
            <div className="animate-fadeIn">
              <div className="page-header">
                <span className="section-title">📅 Appointments</span>
                <button className="btn btn-primary btn-sm">+ Schedule</button>
              </div>
              <div style={styles.tableCard}>
                <div className="table-wrapper">
                  <table className="tbl">
                    <thead><tr><th>Patient ID</th><th>Doctor ID</th><th>Date</th><th>Time</th><th>Reason</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>
                      {demoApt.map(a => (
                        <tr key={a.id}>
                          <td>#{a.patientId}</td><td>#{a.doctorId}</td>
                          <td>{a.appointmentDate}</td><td>{a.appointmentTime}</td>
                          <td>{a.reason}</td>
                          <td><span className={`badge badge-${statusColor(a.status)}`}>{a.status}</span></td>
                          <td><div className="actions-col">
                            <button className="btn btn-secondary btn-sm">Edit</button>
                            <button className="btn btn-danger btn-sm">Cancel</button>
                          </div></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Billing */}
          {active === 'billing' && (
            <div className="animate-fadeIn">
              <div className="page-header">
                <span className="section-title">💰 Billing</span>
                <button className="btn btn-primary btn-sm">+ New Bill</button>
              </div>
              <div style={styles.tableCard}>
                <div className="table-wrapper">
                  <table className="tbl">
                    <thead><tr><th>Bill ID</th><th>Patient ID</th><th>Amount (₹)</th><th>Description</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>
                      {demoBills.map(b => (
                        <tr key={b.id}>
                          <td>#{b.id}</td><td>#{b.patientId}</td>
                          <td style={{ fontWeight:700, color:'#10b981' }}>₹{b.amount}</td>
                          <td>{b.description}</td>
                          <td><span className={`badge badge-${statusColor(b.status)}`}>{b.status}</span></td>
                          <td><div className="actions-col">
                            <button className="btn btn-secondary btn-sm">View</button>
                            {b.status === 'PENDING' && <button className="btn btn-primary btn-sm">Mark Paid</button>}
                          </div></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Reports */}
          {active === 'reports' && (
            <div className="animate-fadeIn">
              <div className="section-title" style={{ marginBottom:24 }}>📈 System Reports</div>
              <div className="grid-3">
                {[
                  { label:'Total Revenue', value:'₹4,700', icon:'💰', color:'#10b981', sub:'This month' },
                  { label:'Active Staff',  value:'2',      icon:'👔', color:'#667eea', sub:'Doctors + Nurses' },
                  { label:'Recovery Rate',value:'94%',     icon:'💊', color:'#f093fb', sub:'Last 30 days' },
                ].map(r => (
                  <div key={r.label} className="stat-card" style={{ flexDirection:'column', alignItems:'flex-start', gap:8 }}>
                    <div style={{ fontSize:'2rem' }}>{r.icon}</div>
                    <div style={{ fontSize:'2rem', fontWeight:800, color:r.color }}>{r.value}</div>
                    <div style={{ fontWeight:600 }}>{r.label}</div>
                    <div style={{ color:'var(--text-muted)', fontSize:'0.78rem' }}>{r.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      {modal && (
        <div style={styles.overlay} onClick={() => setModal(null)}>
          <div style={styles.modalCard} className="glass-card" onClick={e => e.stopPropagation()}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
              <h3 style={{ fontWeight:700, fontSize:'1.1rem' }}>
                {modal === 'doctor' ? (dForm.id ? 'Edit Doctor' : 'Add Doctor') : (pForm.id ? 'Edit Patient' : 'Add Patient')}
              </h3>
              <button style={{ background:'none', border:'none', color:'var(--text-muted)', cursor:'pointer', fontSize:'1.2rem' }} onClick={() => setModal(null)}>✕</button>
            </div>
            {modal === 'doctor' && (
              <form onSubmit={saveDoctor}>
                {[['Name','name','text'],['Specialization','specialization','text'],['Email','email','email'],['Phone','phone','tel'],['Experience (years)','experience','number'],['Consultation Fee','consultationFee','number']].map(([lbl,field,type]) => (
                  <div className="input-group" key={field}>
                    <label>{lbl}</label>
                    <div className="input-wrap no-icon">
                      <input type={type} value={dForm[field]||''} onChange={e => setDF(f=>({...f,[field]:e.target.value}))} required={['name','email'].includes(field)} />
                    </div>
                  </div>
                ))}
                <button type="submit" className="btn btn-primary btn-block" style={{ marginTop:8 }}>Save Doctor</button>
              </form>
            )}
            {modal === 'patient' && (
              <form onSubmit={savePatient}>
                {[['Full Name','name','text'],['Age','age','number'],['Phone','phone','tel'],['Address','address','text'],['Diagnosis / Disease','disease','text']].map(([lbl,field,type]) => (
                  <div className="input-group" key={field}>
                    <label>{lbl}</label>
                    <div className="input-wrap no-icon">
                      <input type={type} value={pForm[field]||''} onChange={e => setPF(f=>({...f,[field]:e.target.value}))} required={['name'].includes(field)} />
                    </div>
                  </div>
                ))}
                <button type="submit" className="btn btn-primary btn-block" style={{ marginTop:8 }}>Save Patient</button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`alert alert-${toast.type}`} style={{ position:'fixed', bottom:24, right:24, zIndex:9999, minWidth:280, boxShadow:'0 8px 24px rgba(0,0,0,0.4)' }}>
          {toast.type==='success'?'✅':toast.type==='info'?'ℹ️':'⚠️'} {toast.msg}
        </div>
      )}
    </div>
  );
}

const styles = {
  root:   { display:'flex', height:'100vh', overflow:'hidden', background:'var(--bg-dark)' },
  sidebar: {
    background:'rgba(255,255,255,0.03)', borderRight:'1px solid var(--border)',
    display:'flex', flexDirection:'column', transition:'width 0.3s ease', overflow:'hidden', flexShrink:0,
  },
  sidebarTop: {
    display:'flex', alignItems:'center', justifyContent:'space-between', padding:'20px 14px 16px',
    borderBottom:'1px solid var(--border)',
  },
  logo: {
    width:38, height:38, borderRadius:10, background:'linear-gradient(135deg,#667eea,#764ba2)',
    display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.2rem', flexShrink:0,
  },
  toggleBtn: {
    background:'none', border:'none', color:'var(--text-muted)', cursor:'pointer', fontSize:'0.8rem', padding:4,
  },
  navItem: {
    display:'flex', alignItems:'center', gap:12, padding:'11px 10px', borderRadius:10,
    background:'none', border:'none', color:'var(--text-secondary)', cursor:'pointer',
    width:'100%', textAlign:'left', fontFamily:'inherit', fontSize:'0.88rem', fontWeight:500,
    transition:'all 0.2s', marginBottom:2, overflow:'hidden',
  },
  navActive: { background:'rgba(102,126,234,0.15)', color:'#667eea', fontWeight:700 },
  main:    { flex:1, display:'flex', flexDirection:'column', overflow:'hidden' },
  header:  {
    padding:'18px 28px', borderBottom:'1px solid var(--border)', display:'flex',
    alignItems:'center', justifyContent:'space-between', background:'rgba(255,255,255,0.02)',
  },
  content: { flex:1, overflowY:'auto', padding:'28px' },
  avatar:  { width:40, height:40, borderRadius:12, background:'rgba(102,126,234,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.3rem' },
  widget:  { background:'rgba(255,255,255,0.03)', border:'1px solid var(--border)', borderRadius:16, padding:'20px 22px' },
  listItem:{ display:'flex', alignItems:'center', gap:12, padding:'10px 0', borderBottom:'1px solid rgba(255,255,255,0.04)' },
  miniAvatar:{ width:36, height:36, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1rem', flexShrink:0 },
  tableCard:{ background:'rgba(255,255,255,0.03)', border:'1px solid var(--border)', borderRadius:16, overflow:'hidden' },
  overlay:  { position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', backdropFilter:'blur(4px)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, padding:24 },
  modalCard:{ width:'100%', maxWidth:480, padding:'28px 32px', maxHeight:'85vh', overflowY:'auto' },
};

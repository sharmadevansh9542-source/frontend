import React, { useState } from 'react';

const navItems = [
  { id: 'dashboard',    icon: '📊', label: 'Dashboard'      },
  { id: 'appointments', icon: '📅', label: 'My Appointments' },
  { id: 'patients',     icon: '👥', label: 'My Patients'     },
  { id: 'schedule',     icon: '🗓️', label: 'Schedule'       },
  { id: 'profile',      icon: '👤', label: 'Profile'         },
];

const demoAppointments = [
  { id:1, patient:'Ananya Singh', age:32, time:'10:00 AM', date:'2026-05-20', reason:'Follow-up Checkup', status:'SCHEDULED', room:'Room 201' },
  { id:2, patient:'Rohan Patel',  age:45, time:'11:30 AM', date:'2026-05-20', reason:'Chest Pain',        status:'SCHEDULED', room:'Room 203' },
  { id:3, patient:'Meera Nair',   age:28, time:'02:00 PM', date:'2026-05-19', reason:'Consultation',     status:'COMPLETED', room:'Room 201' },
  { id:4, patient:'Karan Mehta',  age:55, time:'03:30 PM', date:'2026-05-19', reason:'Hypertension',     status:'COMPLETED', room:'Room 202' },
];

const demoPatients = [
  { id:1, name:'Ananya Singh',   age:32, gender:'Female', phone:'+91 9123456789', bloodGroup:'B+', lastVisit:'2026-05-15', condition:'Hypertension',  status:'Stable' },
  { id:2, name:'Rohan Patel',    age:45, gender:'Male',   phone:'+91 9012345678', bloodGroup:'O+', lastVisit:'2026-05-10', condition:'Diabetes',      status:'Under Monitoring' },
  { id:3, name:'Meera Nair',     age:28, gender:'Female', phone:'+91 9234567890', bloodGroup:'A+', lastVisit:'2026-05-19', condition:'Anxiety',       status:'Recovering' },
  { id:4, name:'Karan Mehta',    age:55, gender:'Male',   phone:'+91 9345678901', bloodGroup:'AB+',lastVisit:'2026-05-19', condition:'Hypertension',  status:'Stable' },
];

const statusColor = s => ({ SCHEDULED:'primary', COMPLETED:'success', CANCELLED:'danger' }[s] || 'primary');

export default function DoctorDashboard({ user, onLogout }) {
  const [active, setActive]       = useState('dashboard');
  const [sidebarOpen, setSidebar] = useState(true);
  const [selectedPat, setSelPat]  = useState(null);
  const [note, setNote]           = useState('');
  const [toast, setToast]         = useState(null);

  const showToast = (msg, type='success') => { setToast({msg,type}); setTimeout(()=>setToast(null),3500); };

  const todayApts = demoAppointments.filter(a => a.date === '2026-05-20');
  const stats = [
    { label:"Today's Appointments", value: todayApts.length,    icon:'📅', color:'#11998e', bg:'rgba(17,153,142,0.15)' },
    { label:'Total Patients',       value: demoPatients.length, icon:'👥', color:'#667eea', bg:'rgba(102,126,234,0.15)' },
    { label:'Completed Today',      value: demoAppointments.filter(a=>a.status==='COMPLETED').length, icon:'✅', color:'#10b981', bg:'rgba(16,185,129,0.15)' },
    { label:'Avg. Rating',          value: '4.8 ⭐',            icon:'⭐', color:'#f59e0b', bg:'rgba(245,158,11,0.15)' },
  ];

  return (
    <div style={styles.root}>
      {/* Sidebar */}
      <aside style={{ ...styles.sidebar, width: sidebarOpen ? 240 : 68 }}>
        <div style={styles.sidebarTop}>
          <div style={{ display:'flex', alignItems:'center', gap:10, overflow:'hidden' }}>
            <div style={{ ...styles.logo, background:'linear-gradient(135deg,#11998e,#38ef7d)' }}>🩺</div>
            {sidebarOpen && <span style={{ fontWeight:800, fontSize:'1.1rem', whiteSpace:'nowrap' }}>Dr. Portal</span>}
          </div>
          <button style={styles.toggleBtn} onClick={() => setSidebar(s=>!s)}>{sidebarOpen?'◀':'▶'}</button>
        </div>
        <nav style={{ flex:1, padding:'12px 8px' }}>
          {navItems.map(n => (
            <button key={n.id} style={{ ...styles.navItem, ...(active===n.id?styles.navActive:{}) }} onClick={() => setActive(n.id)}>
              <span style={{ fontSize:'1.2rem', flexShrink:0 }}>{n.icon}</span>
              {sidebarOpen && <span style={{ whiteSpace:'nowrap' }}>{n.label}</span>}
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
        <header style={styles.header}>
          <div>
            <h2 style={{ fontWeight:700, fontSize:'1.2rem' }}>{navItems.find(n=>n.id===active)?.label || 'Dashboard'}</h2>
            <p style={{ color:'var(--text-muted)', fontSize:'0.78rem' }}>Doctor Portal · Monday, May 20, 2026</p>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:14 }}>
            <div style={{ ...styles.avatar, background:'rgba(17,153,142,0.2)' }}>🩺</div>
            <div style={{ lineHeight:1.3 }}>
              <div style={{ fontWeight:700, fontSize:'0.9rem' }}>{user?.fullName || 'Dr. ' + (user?.username || 'Smith')}</div>
              <div style={{ color:'var(--text-muted)', fontSize:'0.75rem' }}>{user?.specialization || 'Cardiologist'}</div>
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
                    <div className="stat-info"><div className="label">{s.label}</div><div className="value" style={{ color:s.color }}>{s.value}</div></div>
                  </div>
                ))}
              </div>
              <div className="grid-2">
                <div style={styles.widget}>
                  <div className="section-title" style={{ marginBottom:16 }}>📅 Today's Appointments</div>
                  {todayApts.length === 0
                    ? <p style={{ color:'var(--text-muted)', fontSize:'0.875rem' }}>No appointments today.</p>
                    : todayApts.map(a => (
                      <div key={a.id} style={styles.aptCard}>
                        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:6 }}>
                          <div>
                            <div style={{ fontWeight:700 }}>{a.patient}</div>
                            <div style={{ color:'var(--text-muted)', fontSize:'0.78rem' }}>Age {a.age} · {a.room}</div>
                          </div>
                          <span className={`badge badge-${statusColor(a.status)}`}>{a.status}</span>
                        </div>
                        <div style={{ color:'var(--text-secondary)', fontSize:'0.82rem' }}>{a.reason} · {a.time}</div>
                        <div style={{ display:'flex', gap:8, marginTop:10 }}>
                          <button className="btn btn-primary btn-sm">Start Consultation</button>
                          <button className="btn btn-secondary btn-sm">Notes</button>
                        </div>
                      </div>
                    ))
                  }
                </div>
                <div style={styles.widget}>
                  <div className="section-title" style={{ marginBottom:16 }}>👥 Recent Patients</div>
                  {demoPatients.slice(0,4).map(p => (
                    <div key={p.id} style={styles.listItem} onClick={() => { setSelPat(p); setActive('patients'); }} className="cursor-ptr">
                      <div style={{ ...styles.miniAvatar, background:'rgba(102,126,234,0.2)', color:'#667eea', cursor:'pointer' }}>
                        {p.gender === 'Male' ? '👨' : '👩'}
                      </div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontWeight:600, fontSize:'0.9rem' }}>{p.name}</div>
                        <div style={{ color:'var(--text-muted)', fontSize:'0.78rem' }}>{p.condition} · Last: {p.lastVisit}</div>
                      </div>
                      <span style={{ fontSize:'0.72rem', color: p.status==='Stable'?'var(--success)':'var(--warning)', fontWeight:600 }}>{p.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Appointments Tab */}
          {active === 'appointments' && (
            <div className="animate-fadeIn">
              <div className="page-header">
                <span className="section-title">📅 All Appointments</span>
              </div>
              <div style={styles.tableCard}>
                <div className="table-wrapper">
                  <table className="tbl">
                    <thead><tr><th>Patient</th><th>Date</th><th>Time</th><th>Reason</th><th>Room</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>
                      {demoAppointments.map(a => (
                        <tr key={a.id}>
                          <td>{a.patient} <span style={{ color:'var(--text-muted)', fontSize:'0.78rem' }}>(Age {a.age})</span></td>
                          <td>{a.date}</td><td>{a.time}</td><td>{a.reason}</td><td>{a.room}</td>
                          <td><span className={`badge badge-${statusColor(a.status)}`}>{a.status}</span></td>
                          <td><div className="actions-col">
                            <button className="btn btn-primary btn-sm">Consult</button>
                            <button className="btn btn-secondary btn-sm">Reschedule</button>
                          </div></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Patients Tab */}
          {active === 'patients' && (
            <div className="animate-fadeIn">
              <div className="page-header">
                <span className="section-title">👥 My Patients</span>
              </div>
              <div className="grid-2">
                {/* Patient list */}
                <div style={styles.tableCard}>
                  {demoPatients.map(p => (
                    <div key={p.id} style={{ ...styles.patCard, ...(selectedPat?.id===p.id ? { border:'1.5px solid #11998e', background:'rgba(17,153,142,0.08)' } : {}) }}
                      onClick={() => setSelPat(p)}>
                      <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                        <div style={{ ...styles.miniAvatar, background:'rgba(17,153,142,0.2)', color:'#11998e', width:44, height:44, fontSize:'1.3rem' }}>
                          {p.gender==='Male'?'👨':'👩'}
                        </div>
                        <div>
                          <div style={{ fontWeight:700 }}>{p.name}</div>
                          <div style={{ color:'var(--text-muted)', fontSize:'0.78rem' }}>Age {p.age} · {p.bloodGroup} · {p.phone}</div>
                        </div>
                      </div>
                      <div style={{ marginTop:10, display:'flex', gap:8, flexWrap:'wrap' }}>
                        <span className="badge badge-primary">{p.condition}</span>
                        <span className={`badge ${p.status==='Stable'?'badge-success':'badge-warning'}`}>{p.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Detail panel */}
                <div style={{ ...styles.widget, position:'sticky', top:0, alignSelf:'flex-start' }}>
                  {selectedPat ? (
                    <>
                      <div style={{ fontWeight:700, fontSize:'1.1rem', marginBottom:16 }}>📋 {selectedPat.name}</div>
                      {[['Age', selectedPat.age],['Gender', selectedPat.gender],['Phone', selectedPat.phone],['Blood Group', selectedPat.bloodGroup],['Condition', selectedPat.condition],['Last Visit', selectedPat.lastVisit]].map(([k,v]) => (
                        <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid rgba(255,255,255,0.05)', fontSize:'0.875rem' }}>
                          <span style={{ color:'var(--text-muted)' }}>{k}</span>
                          <span style={{ fontWeight:600 }}>{v}</span>
                        </div>
                      ))}
                      <div style={{ marginTop:16 }}>
                        <label style={{ fontSize:'0.78rem', fontWeight:600, color:'var(--text-muted)', display:'block', marginBottom:6 }}>MEDICAL NOTES</label>
                        <textarea value={note} onChange={e=>setNote(e.target.value)}
                          placeholder="Add consultation notes..." rows={4}
                          style={{ width:'100%', background:'rgba(255,255,255,0.05)', border:'1.5px solid var(--border)', borderRadius:10, padding:'10px 14px', color:'var(--text-primary)', fontFamily:'inherit', fontSize:'0.875rem', outline:'none', resize:'vertical' }} />
                        <button className="btn btn-primary btn-sm" style={{ marginTop:10, background:'linear-gradient(135deg,#11998e,#38ef7d)' }} onClick={() => showToast('Notes saved!')}>
                          Save Notes
                        </button>
                      </div>
                    </>
                  ) : (
                    <div style={{ textAlign:'center', padding:'32px 0', color:'var(--text-muted)' }}>
                      <div style={{ fontSize:'2.5rem', marginBottom:8 }}>👈</div>
                      <p>Select a patient to view details</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Schedule */}
          {active === 'schedule' && (
            <div className="animate-fadeIn">
              <div className="section-title" style={{ marginBottom:24 }}>🗓️ Weekly Schedule</div>
              <div style={styles.widget}>
                {['Monday','Tuesday','Wednesday','Thursday','Friday'].map((day, i) => (
                  <div key={day} style={{ display:'flex', alignItems:'center', gap:16, padding:'14px 0', borderBottom: i<4 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                    <div style={{ width:110, fontWeight:600, color: i===0 ? '#11998e' : 'var(--text-secondary)' }}>{day}{i===0?' (Today)':''}</div>
                    <div style={{ flex:1, display:'flex', gap:8, flexWrap:'wrap' }}>
                      {i===0 ? demoAppointments.filter(a=>a.date==='2026-05-20').map(a => (
                        <span key={a.id} style={{ padding:'4px 12px', borderRadius:999, background:'rgba(17,153,142,0.2)', color:'#38ef7d', fontSize:'0.78rem', fontWeight:600 }}>
                          {a.time} · {a.patient}
                        </span>
                      )) : <span style={{ color:'var(--text-muted)', fontSize:'0.85rem' }}>{i<3 ? 'No appointments' : 'Day off'}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Profile */}
          {active === 'profile' && (
            <div className="animate-fadeIn" style={{ maxWidth:560 }}>
              <div style={styles.widget}>
                <div style={{ display:'flex', alignItems:'center', gap:20, marginBottom:24 }}>
                  <div style={{ width:80, height:80, borderRadius:20, background:'linear-gradient(135deg,#11998e,#38ef7d)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2.5rem' }}>🩺</div>
                  <div>
                    <div style={{ fontWeight:800, fontSize:'1.3rem' }}>{user?.fullName || 'Dr. Smith'}</div>
                    <div style={{ color:'var(--text-muted)', fontSize:'0.875rem' }}>{user?.specialization || 'Cardiologist'}</div>
                    <span className="badge badge-success" style={{ marginTop:6 }}>Active</span>
                  </div>
                </div>
                {[['Email', user?.email||'doctor@hms.com','📧'],['Phone', user?.phone||'+91 9876543210','📱'],['License No.', 'MCI-2024-XXXX','📋'],['Experience', '12 Years','⭐'],['Department', 'Cardiology','🏥']].map(([k,v,ic]) => (
                  <div key={k} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 0', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ fontSize:'1.1rem' }}>{ic}</span>
                    <span style={{ color:'var(--text-muted)', width:110, fontSize:'0.875rem' }}>{k}</span>
                    <span style={{ fontWeight:600, fontSize:'0.9rem' }}>{v}</span>
                  </div>
                ))}
                <button className="btn btn-primary" style={{ marginTop:20, background:'linear-gradient(135deg,#11998e,#38ef7d)' }}>
                  Edit Profile
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Toast */}
      {toast && (
        <div className={`alert alert-${toast.type}`} style={{ position:'fixed', bottom:24, right:24, zIndex:9999, minWidth:260, boxShadow:'0 8px 24px rgba(0,0,0,0.4)' }}>
          ✅ {toast.msg}
        </div>
      )}
    </div>
  );
}

const styles = {
  root:   { display:'flex', height:'100vh', overflow:'hidden' },
  sidebar:{ background:'rgba(255,255,255,0.03)', borderRight:'1px solid var(--border)', display:'flex', flexDirection:'column', transition:'width 0.3s ease', overflow:'hidden', flexShrink:0 },
  sidebarTop:{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'20px 14px 16px', borderBottom:'1px solid var(--border)' },
  logo:   { width:38, height:38, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.2rem', flexShrink:0 },
  toggleBtn:{ background:'none', border:'none', color:'var(--text-muted)', cursor:'pointer', fontSize:'0.8rem', padding:4 },
  navItem:{ display:'flex', alignItems:'center', gap:12, padding:'11px 10px', borderRadius:10, background:'none', border:'none', color:'var(--text-secondary)', cursor:'pointer', width:'100%', textAlign:'left', fontFamily:'inherit', fontSize:'0.88rem', fontWeight:500, transition:'all 0.2s', marginBottom:2, overflow:'hidden' },
  navActive:{ background:'rgba(17,153,142,0.15)', color:'#38ef7d', fontWeight:700 },
  main:   { flex:1, display:'flex', flexDirection:'column', overflow:'hidden' },
  header: { padding:'18px 28px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between', background:'rgba(255,255,255,0.02)' },
  content:{ flex:1, overflowY:'auto', padding:'28px' },
  avatar: { width:40, height:40, borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.3rem' },
  widget: { background:'rgba(255,255,255,0.03)', border:'1px solid var(--border)', borderRadius:16, padding:'20px 22px' },
  listItem:{ display:'flex', alignItems:'center', gap:12, padding:'10px 0', borderBottom:'1px solid rgba(255,255,255,0.04)', cursor:'pointer' },
  miniAvatar:{ width:36, height:36, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1rem', flexShrink:0 },
  tableCard:{ background:'rgba(255,255,255,0.03)', border:'1px solid var(--border)', borderRadius:16, overflow:'hidden' },
  aptCard:{ background:'rgba(255,255,255,0.03)', border:'1px solid var(--border)', borderRadius:12, padding:'14px 16px', marginBottom:12 },
  patCard:{ padding:'16px', borderBottom:'1px solid rgba(255,255,255,0.05)', cursor:'pointer', transition:'background 0.2s', border:'1px solid transparent', borderRadius:0 },
};

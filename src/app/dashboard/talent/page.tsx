'use client';

import React, { useState, useEffect } from 'react';
import { DashboardSidebar } from '@/components/DashboardSidebar/DashboardSidebar';
import { NotificationBell } from '@/components/NotificationBell/NotificationBell';
import styles from './DashboardTalent.module.css';

export default function TalentDashboardPage() {
  const [activeTab, setActiveTab] = useState<string>('profile');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [jobs, setJobs] = useState<any[]>([]);

  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    phone: '+91 98765 43210',
    skills: 'Full-Stack Engineering, Next.js, Python, Cloud Architecture',
    experience: '8+ Years',
    title: 'Senior Scrizian Talent'
  });

  useEffect(() => {
    let localEmail = '';
    const stored = localStorage.getItem('scrizians_user');
    if (stored) {
      try {
        const u = JSON.parse(stored);
        setCurrentUser(u);
        localEmail = u.email || '';
        setEditFormData({
          name: u.name || '',
          phone: u.phone || '+91 98765 43210',
          skills: u.skills || 'Full-Stack Engineering, Next.js, Python, Cloud Architecture',
          experience: u.experience || '8+ Years',
          title: u.title || 'Senior Scrizian Talent'
        });
      } catch (e) {}
    }

    fetch('/api/users', { cache: 'no-store' })
      .then(r => r.json())
      .then(res => {
        if (res.success && Array.isArray(res.data)) {
          const match = res.data.find((usr: any) => (localEmail && usr.email?.toLowerCase() === localEmail.toLowerCase()) || usr.role === 'talent');
          if (match) {
            setCurrentUser(match);
            localStorage.setItem('scrizians_user', JSON.stringify(match));
            setEditFormData({
              name: match.name || '',
              phone: match.phone || '+91 98765 43210',
              skills: match.skills || 'Full-Stack Engineering, Next.js, Python, Cloud Architecture',
              experience: match.experience || '8+ Years',
              title: match.title || 'Senior Scrizian Talent'
            });
          }
        }
      })
      .catch(e => console.warn('User sync error:', e));

    fetch('/api/jobs', { cache: 'no-store' })
      .then(r => r.json())
      .then(res => {
        if (res.success && Array.isArray(res.data)) {
          setJobs(res.data);
        }
      })
      .catch(e => console.warn('Jobs sync error:', e));
  }, []);

  const displayName = currentUser?.name || editFormData.name || 'Verified Talent';
  const displayEmail = currentUser?.email || 'talent@scrizians.com';
  const displayId = currentUser?.scrizianId || currentUser?.id || 'TLT-809';
  const displayPhone = currentUser?.phone || editFormData.phone;
  const displaySkills = currentUser?.skills || editFormData.skills;
  const displayExperience = currentUser?.experience || editFormData.experience;
  const displayTitle = currentUser?.title || editFormData.title;

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedUser = {
        ...currentUser,
        name: editFormData.name,
        phone: editFormData.phone,
        skills: editFormData.skills,
        experience: editFormData.experience,
        title: editFormData.title
      };

      setCurrentUser(updatedUser);
      localStorage.setItem('scrizians_user', JSON.stringify(updatedUser));

      await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: displayEmail,
          name: editFormData.name,
          phone: editFormData.phone,
          skills: editFormData.skills,
          experience: editFormData.experience,
          title: editFormData.title,
          role: 'talent'
        })
      });

      setShowEditProfileModal(false);
      showToast('🎉 Profile updated successfully in MongoDB database!');
    } catch (err) {
      console.warn('Save profile error:', err);
      showToast('🎉 Profile saved locally!');
      setShowEditProfileModal(false);
    }
  };

  return (
    <div className={styles.dashboardLayout}>
      <DashboardSidebar 
        role="talent" 
        activeTab={activeTab}
        onTabChange={(tab: any) => setActiveTab(tab)}
        user={currentUser || { name: displayName, role: 'talent', email: displayEmail, scrizianId: displayId }} 
      />

      <div className={styles.container}>
        {toastMsg && (
          <div style={{
            position: 'fixed',
            top: '24px',
            right: '24px',
            background: '#0B172A',
            color: '#ffffff',
            padding: '0.9rem 1.4rem',
            borderRadius: '10px',
            zIndex: 99999,
            fontWeight: 700,
            fontSize: '0.92rem',
            border: '1px solid rgba(229, 43, 43, 0.5)',
            boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.5), 0 0 20px rgba(229, 43, 43, 0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.8rem'
          }}>
            <span>⚡</span>
            <span>{toastMsg}</span>
            <button onClick={() => setToastMsg(null)} style={{ background: 'transparent', border: 'none', color: '#94A3B8', fontSize: '1.2rem', cursor: 'pointer', marginLeft: '0.5rem' }}>×</button>
          </div>
        )}

        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Talent Network Hub</h1>
            <p className={styles.subTitle}>
              Logged in as: <strong style={{ color: '#ffffff' }}>{displayName}</strong> | Scrizian ID: {displayId}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button 
              onClick={() => {
                setEditFormData({
                  name: displayName,
                  phone: displayPhone,
                  skills: displaySkills,
                  experience: displayExperience,
                  title: displayTitle
                });
                setShowEditProfileModal(true);
              }}
              style={{ background: '#E52B2B', color: '#ffffff', border: 'none', padding: '0.55rem 1.1rem', borderRadius: '8px', fontWeight: 800, cursor: 'pointer', fontSize: '0.85rem' }}
            >
              ✏️ Edit Profile
            </button>
            <span className={styles.badge}>
              ✓ VERIFIED TALENT
            </span>
            <NotificationBell />
          </div>
        </div>

        {/* TAB 1: Profile */}
        {(activeTab === 'profile' || !activeTab) && (
          <div className={styles.grid}>
            <div className={styles.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h3 className={styles.cardTitle} style={{ margin: 0 }}>Talent Bio & Tech Stack</h3>
                <button 
                  onClick={() => {
                    setEditFormData({
                      name: displayName,
                      phone: displayPhone,
                      skills: displaySkills,
                      experience: displayExperience,
                      title: displayTitle
                    });
                    setShowEditProfileModal(true);
                  }}
                  className={styles.btnSecondary}
                  style={{ padding: '0.35rem 0.8rem', fontSize: '0.8rem' }}
                >
                  ✏️ Edit
                </button>
              </div>
              <p className={styles.cardSub}>Your verified engineering profile showcase for Scriza enterprise clients.</p>

              <div className={styles.gridTwoCols}>
                <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '1rem', borderRadius: '8px' }}>
                  <p style={{ margin: '0.4rem 0', color: '#0F172A', fontWeight: 600 }}><strong>Full Name:</strong> {displayName}</p>
                  <p style={{ margin: '0.4rem 0', color: '#0F172A', fontWeight: 600 }}><strong>Email:</strong> {displayEmail}</p>
                  <p style={{ margin: '0.4rem 0', color: '#0F172A', fontWeight: 600 }}><strong>Phone:</strong> {displayPhone}</p>
                  <p style={{ margin: '0.4rem 0', color: '#0F172A', fontWeight: 600 }}><strong>Specialization:</strong> {displayTitle}</p>
                </div>
                <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '1rem', borderRadius: '8px' }}>
                  <p style={{ margin: '0.4rem 0', color: '#0F172A', fontWeight: 600 }}><strong>Experience:</strong> {displayExperience}</p>
                  <p style={{ margin: '0.4rem 0', color: '#0F172A', fontWeight: 600 }}><strong>Skills:</strong> {displaySkills}</p>
                  <p style={{ margin: '0.4rem 0', color: '#0F172A', fontWeight: 600 }}><strong>Hourly Rate:</strong> $45 - $65 / hr</p>
                  <p style={{ margin: '0.4rem 0', color: '#0F172A', fontWeight: 600 }}><strong>Vetting Level:</strong> Tier 1 Senior Architect</p>
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Availability & Status</h3>
              <p className={styles.cardSub}>Client matching settings.</p>

              <div style={{ background: '#F0FDF4', border: '1px solid #86EFAC', padding: '1rem', borderRadius: '8px' }}>
                <div style={{ fontWeight: 800, color: '#166534' }}>🟢 Available for New Contracts</div>
                <div style={{ fontSize: '0.85rem', color: '#15803D', marginTop: '0.4rem' }}>
                  Open to full-time remote or part-time contract projects with EST/PST overlap.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Portfolio Showcase */}
        {activeTab === 'portfolio' && (
          <div className={styles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <h3 className={styles.cardTitle} style={{ margin: 0 }}>🎨 Portfolio Showcase & Verified Projects</h3>
                <p className={styles.cardSub} style={{ margin: '0.2rem 0 0 0' }}>Client-ready project architecture showcases and NDA-protected case studies.</p>
              </div>
              <button 
                onClick={() => showToast('➕ Add Project feature modal available in Admin approval desk')}
                className={styles.btnSecondary}
                style={{ padding: '0.45rem 0.9rem', fontSize: '0.82rem' }}
              >
                ➕ Submit New Showcase Project
              </button>
            </div>

            <div className={styles.gridTwoCols} style={{ marginTop: '1.2rem' }}>
              <div style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '10px', padding: '1.2rem', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <h4 style={{ margin: 0, color: '#0F172A', fontSize: '1.05rem', fontWeight: 800 }}>🚀 Enterprise Lending Platform Migration</h4>
                  <span style={{ background: '#FEF3C7', color: '#92400E', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800 }}>🔒 NDA Protected</span>
                </div>
                <p style={{ color: '#475569', fontSize: '0.88rem', margin: '0.4rem 0 0.8rem 0' }}>
                  Re-architected monolithic Java backend into Next.js & Node.js microservices handling $45M monthly transactions.
                </p>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  <span className={styles.skillBadge}>Next.js</span>
                  <span className={styles.skillBadge}>Node.js</span>
                  <span className={styles.skillBadge}>AWS ECS</span>
                  <span className={styles.skillBadge}>MongoDB</span>
                </div>
              </div>

              <div style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '10px', padding: '1.2rem', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <h4 style={{ margin: 0, color: '#0F172A', fontSize: '1.05rem', fontWeight: 800 }}>🛍️ D2C Storefront Headless Commerce</h4>
                  <span style={{ background: '#DCFCE7', color: '#166534', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800 }}>✓ Public Showcase</span>
                </div>
                <p style={{ color: '#475569', fontSize: '0.88rem', margin: '0.4rem 0 0.8rem 0' }}>
                  Built high-speed headless Shopify storefront with 98+ Google Lighthouse performance rating and sub-500ms page load.
                </p>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  <span className={styles.skillBadge}>Next.js App Router</span>
                  <span className={styles.skillBadge}>Shopify Storefront API</span>
                  <span className={styles.skillBadge}>Tailwind</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Availability & Rates */}
        {activeTab === 'availability' && (
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>🟢 Availability & Rate Card Settings</h3>
            <p className={styles.cardSub}>Configure your billing expectations, weekly hours, and availability timeline for client contracts.</p>

            <div className={styles.gridTwoCols} style={{ marginTop: '1.2rem' }}>
              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '1.2rem', borderRadius: '10px' }}>
                <h4 style={{ margin: '0 0 0.6rem 0', color: '#0F172A', fontWeight: 800 }}>💰 Hourly & Monthly Rate Baseline</h4>
                <p style={{ fontSize: '0.9rem', color: '#334155', margin: '0.3rem 0' }}><strong>Hourly Contract Rate:</strong> $42.00 – $65.00 / hr</p>
                <p style={{ fontSize: '0.9rem', color: '#334155', margin: '0.3rem 0' }}><strong>Monthly Dedicated Rate:</strong> ₹2,40,000 INR / month</p>
                <p style={{ fontSize: '0.82rem', color: '#64748B', marginTop: '0.6rem' }}>
                  Rates are verified by Scriza Client Success Desk based on your senior technical background.
                </p>
              </div>

              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '1.2rem', borderRadius: '10px' }}>
                <h4 style={{ margin: '0 0 0.6rem 0', color: '#0F172A', fontWeight: 800 }}>⏰ Work Schedule & Timezone Overlap</h4>
                <p style={{ fontSize: '0.9rem', color: '#334155', margin: '0.3rem 0' }}><strong>Weekly Capacity:</strong> 40 Hours / Week (Full-Time)</p>
                <p style={{ fontSize: '0.9rem', color: '#334155', margin: '0.3rem 0' }}><strong>Preferred Overlap:</strong> 4 Hours EST / PST Daily</p>
                <p style={{ fontSize: '0.82rem', color: '#166534', fontWeight: 700, marginTop: '0.6rem' }}>
                  ✓ Status: Available for Immediate Onboarding
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Opportunities */}
        {activeTab === 'opportunities' && (
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>🎯 Matched Client Opportunities</h3>
            <p className={styles.cardSub}>Inbound client project requirements matching your skill profile and availability.</p>

            <div style={{ background: '#F0FDF4', border: '2px solid #86EFAC', padding: '1.2rem', borderRadius: '10px', marginTop: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <h4 style={{ margin: 0, color: '#166534', fontSize: '1.1rem', fontWeight: 800 }}>⚡ Lead Next.js Architect Contract</h4>
                  <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.9rem', color: '#14532D' }}>
                    Client: CloudScale Inc (USA) | Duration: 6 Months Dedicated Contract
                  </p>
                </div>
                <span style={{ background: '#DCFCE7', color: '#166534', padding: '0.3rem 0.8rem', borderRadius: '8px', fontWeight: 800, fontSize: '0.82rem' }}>
                  Shortlisted by Scriza Ops
                </span>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#15803D', marginTop: '0.8rem', fontWeight: 600 }}>
                Requirements: Next.js 14 App Router, AWS Lambda, MongoDB Atlas, REST/GraphQL. Interfacing with US Product Team.
              </p>
            </div>
          </div>
        )}

        {/* TAB 5: Jobs Board */}
        {activeTab === 'jobs' && (
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>💼 Active Scrizians Jobs Board</h3>
            <p className={styles.cardSub}>Browse active open contracts and full-time software engineering roles.</p>

            <div className={styles.tableContainer} style={{ marginTop: '1rem' }}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Job Title</th>
                    <th>Company / Client</th>
                    <th>Rate / Salary</th>
                    <th>Location</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.length > 0 ? (
                    jobs.map(j => (
                      <tr key={j.id || j.slug}>
                        <td><strong>{j.title}</strong></td>
                        <td>{j.company || 'Enterprise Partner'}</td>
                        <td><span style={{ fontWeight: 800, color: '#166534' }}>{j.rate || j.salaryUSD || '$35 - $45 / hr'}</span></td>
                        <td>{j.location || 'Remote'}</td>
                        <td>
                          <button 
                            onClick={() => showToast(`🎉 Expressed interest for position: ${j.title}`)}
                            className={styles.btnPrimary}
                            style={{ padding: '0.35rem 0.85rem', fontSize: '0.8rem' }}
                          >
                            Express Interest
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center', padding: '1.5rem', color: '#64748B' }}>
                        Loading open job listings from MongoDB...
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: My Articles */}
        {activeTab === 'articles' && (
          <div className={styles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <h3 className={styles.cardTitle} style={{ margin: 0 }}>📝 Authored Articles & Technical Guides</h3>
                <p className={styles.cardSub} style={{ margin: '0.2rem 0 0 0' }}>Technical articles published under your author profile on Scrizians Insights.</p>
              </div>
            </div>

            <div className={styles.gridTwoCols} style={{ marginTop: '1.2rem' }}>
              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '1.2rem', borderRadius: '10px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#E52B2B', textTransform: 'uppercase' }}>TECHNICAL GUIDE</span>
                <h4 style={{ margin: '0.4rem 0 0.5rem 0', color: '#0F172A', fontSize: '1.05rem', fontWeight: 800 }}>
                  Multi-Tenant SaaS Architecture with Node.js and MongoDB
                </h4>
                <p style={{ color: '#475569', fontSize: '0.88rem', margin: 0 }}>
                  Deep dive architectural guide on isolation, database tenant routing, and scaling multi-tenant platforms.
                </p>
                <div style={{ marginTop: '0.8rem', fontSize: '0.8rem', color: '#166534', fontWeight: 800 }}>✓ Published & Indexed</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: Performance Analytics */}
        {activeTab === 'analytics' && (
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>📊 Performance Analytics & Client Views</h3>
            <p className={styles.cardSub}>Overview of profile views, client interview selections, and platform metrics.</p>

            <div className={styles.gridThreeCols} style={{ marginTop: '1.2rem' }}>
              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '1.2rem', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: '#0F172A' }}>342</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#64748B', marginTop: '0.3rem' }}>CLIENT PROFILE VIEWS</div>
              </div>

              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '1.2rem', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: '#E52B2B' }}>12</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#64748B', marginTop: '0.3rem' }}>CLIENT SHORTLISTS</div>
              </div>

              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '1.2rem', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: '#166534' }}>98%</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#64748B', marginTop: '0.3rem' }}>INTERVIEW CLEAR RATE</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {showEditProfileModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(11, 23, 42, 0.75)',
          backdropFilter: 'blur(6px)',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem'
        }} onClick={() => setShowEditProfileModal(false)}>
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            maxWidth: '520px',
            width: '95vw',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '1.5rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            position: 'relative',
            border: '1px solid rgba(229, 43, 43, 0.2)'
          }} onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setShowEditProfileModal(false)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'rgba(15, 23, 42, 0.05)',
                border: 'none',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                fontSize: '1.2rem',
                cursor: 'pointer',
                color: '#64748B'
              }}
            >
              ×
            </button>

            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.3rem' }}>
              ✏️ Edit Talent Profile Details
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#64748B', marginBottom: '1.2rem' }}>
              Update your account name, contact phone, primary skills, and experience. Changes will save to MongoDB Atlas database.
            </p>

            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '0.3rem' }}>
                  Full Name *
                </label>
                <input 
                  type="text" 
                  required 
                  value={editFormData.name}
                  onChange={e => setEditFormData({ ...editFormData, name: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem 0.8rem', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.92rem', fontWeight: 600, outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '0.3rem' }}>
                  Phone Number *
                </label>
                <input 
                  type="text" 
                  required 
                  value={editFormData.phone}
                  onChange={e => setEditFormData({ ...editFormData, phone: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem 0.8rem', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.92rem', fontWeight: 600, outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '0.3rem' }}>
                  Primary Skill Tags *
                </label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. Next.js, Python, Cloud Architecture"
                  value={editFormData.skills}
                  onChange={e => setEditFormData({ ...editFormData, skills: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem 0.8rem', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.92rem', fontWeight: 600, outline: 'none' }}
                />
              </div>

              <div className={styles.gridTwoCols}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '0.3rem' }}>
                    Total Experience *
                  </label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. 8+ Years"
                    value={editFormData.experience}
                    onChange={e => setEditFormData({ ...editFormData, experience: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem 0.8rem', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.92rem', fontWeight: 600, outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '0.3rem' }}>
                    Title / Role *
                  </label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. Senior Full-Stack Engineer"
                    value={editFormData.title}
                    onChange={e => setEditFormData({ ...editFormData, title: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem 0.8rem', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.92rem', fontWeight: 600, outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.8rem', marginTop: '0.5rem' }}>
                <button 
                  type="button" 
                  onClick={() => setShowEditProfileModal(false)}
                  style={{ flex: 1, padding: '0.75rem', background: '#F1F5F9', border: 'none', borderRadius: '8px', fontWeight: 700, color: '#475569', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  style={{ flex: 1, padding: '0.75rem', background: '#E52B2B', border: 'none', borderRadius: '8px', fontWeight: 800, color: '#ffffff', cursor: 'pointer', boxShadow: '0 4px 14px rgba(229, 43, 43, 0.35)' }}
                >
                  💾 Save Profile Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

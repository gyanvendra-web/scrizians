'use client';

import React, { useState, useEffect } from 'react';
import { DashboardSidebar } from '@/components/DashboardSidebar/DashboardSidebar';
import { NotificationBell } from '@/components/NotificationBell/NotificationBell';
import styles from './DashboardTalent.module.css';

export default function TalentDashboardPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'projects' | 'earnings' | 'availability'>('profile');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

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
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem', marginTop: '1rem' }}>
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
                  Open to full-time remote or part-time contract projects.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Projects */}
        {activeTab === 'projects' && (
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Assigned Client Projects</h3>
            <p className={styles.cardSub}>Active software builds and contracts assigned by Scriza project managers.</p>
            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '1.2rem', borderRadius: '8px', marginTop: '1rem' }}>
              <h4 style={{ margin: 0, color: '#0F172A' }}>🚀 Next.js Enterprise Portal Migration</h4>
              <p style={{ color: '#475569', fontSize: '0.9rem', margin: '0.5rem 0' }}>Client: Enterprise Global Logistics | Role: Lead Full-Stack Engineer</p>
              <span className={styles.skillBadge}>Active Contract - Sprint 4</span>
            </div>
          </div>
        )}

        {/* TAB 3: Earnings */}
        {activeTab === 'earnings' && (
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Earnings & Invoices</h3>
            <p className={styles.cardSub}>Summary of monthly payouts and completed milestones.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: 700 }}>TOTAL EARNED</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', marginTop: '0.3rem' }}>$14,250.00</div>
              </div>
              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: 700 }}>PENDING ESCROW</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#E52B2B', marginTop: '0.3rem' }}>$2,800.00</div>
              </div>
              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: 700 }}>LAST PAYOUT</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#166534', marginTop: '0.3rem' }}>$3,500.00</div>
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
            width: '100%',
            padding: '2rem',
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
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
                    Specialization Title *
                  </label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. Senior Full-Stack Lead"
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

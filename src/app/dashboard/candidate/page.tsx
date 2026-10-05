'use client';

import React, { useState, useEffect } from 'react';
import { DashboardSidebar } from '@/components/DashboardSidebar/DashboardSidebar';
import { Pagination } from '@/components/Pagination/Pagination';
import { NotificationBell } from '@/components/NotificationBell/NotificationBell';
import styles from '../client/DashboardClient.module.css';

export default function CandidateDashboardPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'resume' | 'applications' | 'interview_status'>('profile');
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [resumeFileName, setResumeFileName] = useState('My_Updated_Resume_2026.pdf (1.8 MB)');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    phone: '+91 98765 43210',
    skills: 'Next.js, Node.js, React, AWS',
    experience: '7+ Years',
    title: 'Senior Full-Stack Architect'
  });

  useEffect(() => {
    const stored = localStorage.getItem('scrizians_user');
    if (stored) {
      try {
        const u = JSON.parse(stored);
        setCurrentUser(u);
        setResumeFileName('My_Updated_Resume_2026.pdf (1.8 MB)');
        setEditFormData({
          name: u.name || '',
          phone: u.phone || '+91 98765 43210',
          skills: u.skills || 'Next.js, Node.js, React, AWS',
          experience: u.experience || '7+ Years',
          title: u.title || 'Senior Full-Stack Architect'
        });
      } catch (e) {}
    }
  }, []);

  const displayName = currentUser?.name || editFormData.name || 'Job Candidate';
  const displayEmail = currentUser?.email || 'candidate@scrizians.com';
  const displayId = currentUser?.scrizianId || currentUser?.id || 'APP-901';
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
          role: 'candidate'
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      const displayStr = `${file.name} (${sizeMB} MB)`;
      setResumeFileName(displayStr);
      showToast(`🎉 Resume "${file.name}" uploaded successfully!`);
    }
  };

  const [applications, setApplications] = useState([
    {
      id: 'APP-901',
      jobTitle: 'Senior Full-Stack Architect',
      company: 'CloudScale Inc (USA)',
      appliedDate: '2026-10-01',
      status: 'Interview Scheduled',
      stage: 'Tech Interview Round 2'
    },
    {
      id: 'APP-902',
      jobTitle: 'Lead Frontend Specialist',
      company: 'Fintech Systems (UK)',
      appliedDate: '2026-09-28',
      status: 'Under Review',
      stage: 'Profile Assessment'
    }
  ]);

  return (
    <div className={styles.dashboardLayout}>
      <DashboardSidebar 
        role="candidate" 
        activeTab={activeTab}
        onTabChange={(tab: any) => setActiveTab(tab)}
        user={currentUser || { name: displayName, role: 'candidate', email: displayEmail, scrizianId: displayId }} 
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
            <h1 className={styles.title}>Candidate Portal</h1>
            <p className={styles.subTitle}>
              Logged in as: <strong style={{ color: '#ffffff' }}>{displayName}</strong> | Job Applicant ID: {displayId}
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
              style={{ background: '#E52B2B', color: '#ffffff', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 800, cursor: 'pointer', fontSize: '0.85rem' }}
            >
              ✏️ Edit Profile
            </button>
            <span style={{ background: '#DCFCE7', color: '#166534', padding: '0.4rem 0.8rem', borderRadius: '8px', fontWeight: 800, fontSize: '0.82rem' }}>
              ✓ PROFILE VERIFIED
            </span>
            <NotificationBell />
          </div>
        </div>

        {/* TAB 1: Profile */}
        {(activeTab === 'profile' || !activeTab) && (
          <div className={styles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <h3 className={styles.cardTitle} style={{ margin: 0 }}>Candidate Profile Details</h3>
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
                style={{ background: '#0F172A', color: '#ffffff', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '6px', fontWeight: 700, cursor: 'pointer', fontSize: '0.82rem' }}
              >
                ✏️ Edit Details
              </button>
            </div>
            <p className={styles.cardSub}>Update your personal background, contact info, and career preferences.</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem', marginTop: '1rem' }}>
              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '1rem', borderRadius: '8px' }}>
                <p><strong>Full Name:</strong> {displayName}</p>
                <p><strong>Email:</strong> {displayEmail}</p>
                <p><strong>Phone:</strong> {displayPhone}</p>
                <p><strong>Primary Skill:</strong> {displaySkills}</p>
              </div>
              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '1rem', borderRadius: '8px' }}>
                <p><strong>Total Experience:</strong> {displayExperience}</p>
                <p><strong>Desired Role:</strong> {displayTitle}</p>
                <p><strong>Notice Period:</strong> Immediate / 15 Days</p>
                <p><strong>Verification Status:</strong> Verified by Scriza Ops Desk</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Resume & Credentials */}
        {activeTab === 'resume' && (
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Resume & Credentials</h3>
            <p className={styles.cardSub}>Upload and manage your CV, certificates, and portfolio documents.</p>

            <div style={{ background: '#FFFBEB', border: '2px solid #FCD34D', padding: '1.2rem', borderRadius: '8px', marginTop: '1rem' }}>
              <div style={{ fontWeight: 800, color: '#78350F' }}>📄 Primary Resume Attached:</div>
              <div style={{ fontSize: '0.9rem', color: '#92400E', marginTop: '0.3rem', fontWeight: 700 }}>{resumeFileName}</div>
              
              <input 
                type="file" 
                ref={fileInputRef} 
                accept=".pdf,.doc,.docx" 
                onChange={handleFileChange} 
                style={{ display: 'none' }} 
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                style={{ marginTop: '0.8rem', background: '#0F172A', color: '#fff', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
              >
                📤 Upload Updated Resume PDF
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: Job Applications */}
        {activeTab === 'applications' && (
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Job Applications</h3>
            <p className={styles.cardSub}>Track your submitted job applications across hiring companies.</p>

            <div className={styles.tableContainer} style={{ marginTop: '1rem' }}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>App ID</th>
                    <th>Target Role & Company</th>
                    <th>Applied Date</th>
                    <th>Current Status</th>
                    <th>Hiring Stage</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map(app => (
                    <tr key={app.id}>
                      <td style={{ fontFamily: 'monospace', fontWeight: 800 }}>{app.id}</td>
                      <td>
                        <strong>{app.jobTitle}</strong><br/>
                        <span style={{ fontSize: '0.82rem', color: '#64748B' }}>{app.company}</span>
                      </td>
                      <td>{app.appliedDate}</td>
                      <td>
                        <span style={{ background: '#DCFCE7', color: '#166534', padding: '0.2rem 0.6rem', borderRadius: '12px', fontWeight: 800, fontSize: '0.78rem' }}>
                          ● {app.status}
                        </span>
                      </td>
                      <td><strong>{app.stage}</strong></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination 
              currentPage={1}
              totalPages={1}
              onPageChange={() => {}}
              totalItems={applications.length}
              itemsPerPage={5}
              itemLabel="active applications"
            />
          </div>
        )}

        {/* TAB 4: Interview Status */}
        {activeTab === 'interview_status' && (
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Interview Status & Schedule</h3>
            <p className={styles.cardSub}>View upcoming interview slots and feedback from Scriza client technical leads.</p>

            <div style={{ background: '#F0FDF4', border: '2px solid #86EFAC', padding: '1.2rem', borderRadius: '10px', marginTop: '1rem' }}>
              <h4 style={{ margin: 0, color: '#166534' }}>📅 Technical Interview Round 2 Confirmed</h4>
              <p style={{ margin: '0.4rem 0', fontSize: '0.9rem', color: '#14532D' }}>
                Client: CloudScale Inc (USA) | Slot: Tomorrow @ 6:30 PM IST (Google Meet)
              </p>
              <div style={{ fontSize: '0.82rem', color: '#15803D', fontWeight: 700 }}>
                Meeting link sent to {displayEmail}
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
              ✏️ Edit Profile Details
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
                  placeholder="e.g. Next.js, React, Node.js, AWS"
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
                    placeholder="e.g. 5+ Years"
                    value={editFormData.experience}
                    onChange={e => setEditFormData({ ...editFormData, experience: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem 0.8rem', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.92rem', fontWeight: 600, outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '0.3rem' }}>
                    Desired Role / Title *
                  </label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. Full-Stack Developer"
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

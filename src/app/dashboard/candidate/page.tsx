'use client';

import React, { useState } from 'react';
import { DashboardSidebar } from '@/components/DashboardSidebar/DashboardSidebar';
import { Pagination } from '@/components/Pagination/Pagination';
import { NotificationBell } from '@/components/NotificationBell/NotificationBell';
import styles from '../client/DashboardClient.module.css';

export default function CandidateDashboardPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'resume' | 'applications' | 'interview_status'>('profile');
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [resumeFileName, setResumeFileName] = useState('Aarav_Sharma_Senior_FullStack_Architect_2026.pdf (1.8 MB)');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
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
        user={{ name: 'Aarav Sharma', role: 'candidate', email: 'aarav.candidate@scrizians.com' }} 
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
              Logged in as: <strong style={{ color: '#ffffff' }}>Aarav Sharma</strong> | Job Applicant ID: APP-901
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ background: '#DCFCE7', color: '#166534', padding: '0.4rem 0.8rem', borderRadius: '8px', fontWeight: 800, fontSize: '0.82rem' }}>
              ✓ PROFILE VERIFIED
            </span>
            <NotificationBell />
          </div>
        </div>

        {/* TAB 1: Profile */}
        {(activeTab === 'profile' || !activeTab) && (
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Candidate Profile Details</h3>
            <p className={styles.cardSub}>Update your personal background, contact info, and career preferences.</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem', marginTop: '1rem' }}>
              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '1rem', borderRadius: '8px' }}>
                <p><strong>Full Name:</strong> Aarav Sharma</p>
                <p><strong>Email:</strong> aarav.candidate@scrizians.com</p>
                <p><strong>Phone:</strong> +91 98765 43210</p>
                <p><strong>Primary Skill:</strong> Next.js, Node.js, React, AWS</p>
              </div>
              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '1rem', borderRadius: '8px' }}>
                <p><strong>Total Experience:</strong> 7+ Years</p>
                <p><strong>Desired Role:</strong> Senior Full-Stack Architect</p>
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
                Meeting link sent to aarav.candidate@scrizians.com
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

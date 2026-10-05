'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardSidebar } from '@/components/DashboardSidebar/DashboardSidebar';
import { NotificationBell } from '@/components/NotificationBell/NotificationBell';
import styles from './DashboardTalent.module.css';

export default function TalentDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'profile' | 'portfolio' | 'availability' | 'opportunities' | 'jobs' | 'articles' | 'analytics'>('profile');
  const [isAvailable, setIsAvailable] = useState(true);
  const [hourlyRate, setHourlyRate] = useState(42);
  const [skills, setSkills] = useState(['Next.js', 'React', 'Node.js', 'TypeScript', 'MongoDB', 'AWS', 'Redis']);
  const [showEditSkills, setShowEditSkills] = useState(false);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleToggleAvailability = () => {
    setIsAvailable(!isAvailable);
    showToast(`✓ Availability status updated to ${!isAvailable ? 'Available (Immediate)' : 'Occupied / On Contract'}`);
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillInput.trim()) return;
    if (!skills.includes(newSkillInput.trim())) {
      setSkills([...skills, newSkillInput.trim()]);
      showToast(`✓ Added skill: ${newSkillInput.trim()}`);
    }
    setNewSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
    showToast(`✓ Removed skill: ${skillToRemove}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('scrizians_token');
    localStorage.removeItem('scrizians_user');
    router.push('/dashboard');
  };

  return (
    <div className={styles.dashboardLayout}>
      <DashboardSidebar 
        role="talent" 
        activeTab={activeTab}
        onTabChange={(tab: any) => setActiveTab(tab)}
        user={{ name: 'Aarav M. (Senior Architect)', role: 'talent', scrizianId: 'SZN-DEV-00001' }} 
      />

      <div className={styles.container}>
        {toastMsg && (
          <div style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: '#0B172A',
            color: '#ffffff',
            padding: '0.9rem 1.5rem',
            borderRadius: '8px',
            zIndex: 2000,
            fontWeight: 800,
            borderLeft: '5px solid #10B981'
          }}>
            {toastMsg}
          </div>
        )}

        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Scrizian Talent Portal</h1>
            <p className={styles.subTitle}>
              Logged in as: <strong style={{ color: '#ffffff' }}>SZN-DEV-00001</strong> | Aarav M. (Senior Full-Stack Architect)
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span className={styles.badge}>✓ VERIFIED SCRIZIAN</span>
            <NotificationBell />
          </div>
        </div>

        {/* TAB 1: Profile */}
        {(activeTab === 'profile' || !activeTab) && (
          <div className={styles.grid}>
            <div>
              <div className={styles.card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                  <h3 className={styles.cardTitle} style={{ margin: 0 }}>My Scrizian Identity & Skills</h3>
                  <button onClick={() => setShowEditSkills(!showEditSkills)} className={styles.btnSecondary} style={{ padding: '0.4rem 0.8rem', fontSize: '0.82rem' }}>
                    {showEditSkills ? 'Done Editing' : '✏️ Edit Skills'}
                  </button>
                </div>

                <p className={styles.cardSub}>
                  Your personal details (email, phone, address) are masked by Scriza Private Limited. Clients search and request interviews via your unique Scrizian ID <strong>SZN-DEV-00001</strong>.
                </p>

                <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                  {skills.map((s, idx) => (
                    <span key={idx} className={styles.skillBadge}>
                      {s}
                      {showEditSkills && (
                        <button 
                          onClick={() => handleRemoveSkill(s)} 
                          style={{ background: 'none', border: 'none', color: '#EF4444', marginLeft: '0.4rem', cursor: 'pointer', fontWeight: 900 }}
                        >
                          ×
                        </button>
                      )}
                    </span>
                  ))}
                </div>

                {showEditSkills && (
                  <form onSubmit={handleAddSkill} style={{ marginTop: '1.2rem', display: 'flex', gap: '0.6rem' }}>
                    <input 
                      type="text" 
                      placeholder="Add a new skill (e.g. GraphQL, Docker)" 
                      value={newSkillInput}
                      onChange={e => setNewSkillInput(e.target.value)}
                      style={{ padding: '0.5rem 0.8rem', border: '2px solid #0F172A', borderRadius: '6px', fontWeight: 700, flex: 1 }}
                    />
                    <button type="submit" className={styles.btnPrimary}>+ Add Skill</button>
                  </form>
                )}
              </div>
            </div>

            <div>
              <div className={styles.card}>
                <h3 className={styles.cardTitle}>Availability & Rate Snapshot</h3>
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0F172A' }}>Status:</div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: isAvailable ? '#16A34A' : '#DC2626', marginTop: '0.2rem' }}>
                    {isAvailable ? '🟢 Available (Immediate)' : '🔴 Occupied on Project'}
                  </div>
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0F172A' }}>${hourlyRate}/hr</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Portfolio */}
        {activeTab === 'portfolio' && (
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Portfolio Showcase & Code Samples</h3>
            <p className={styles.cardSub}>Verified Github repositories, architecture diagrams, and deployed project links.</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
              <div style={{ background: '#F8FAFC', border: '1px solid #CBD5E1', padding: '1rem', borderRadius: '8px' }}>
                <strong style={{ fontSize: '1rem', color: '#0F172A' }}>⚡ Real-Time Fintech Trading Engine</strong>
                <p style={{ margin: '0.4rem 0', fontSize: '0.85rem', color: '#475569' }}>Built with Next.js App Router, WebSockets, Redis pub/sub, and AWS Lambda.</p>
                <div style={{ fontSize: '0.8rem', color: '#E52B2B', fontWeight: 800 }}>Github Repository Verified ✓</div>
              </div>
              <div style={{ background: '#F8FAFC', border: '1px solid #CBD5E1', padding: '1rem', borderRadius: '8px' }}>
                <strong style={{ fontSize: '1rem', color: '#0F172A' }}>🛡️ Enterprise Microservices Architecture</strong>
                <p style={{ margin: '0.4rem 0', fontSize: '0.85rem', color: '#475569' }}>Dockerized Node.js microservices with gRPC and PostgreSQL read replicas.</p>
                <div style={{ fontSize: '0.8rem', color: '#E52B2B', fontWeight: 800 }}>Live Staging Demo Verified ✓</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Availability & Rates */}
        {activeTab === 'availability' && (
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Manage Availability & Hourly Rates</h3>
            <p className={styles.cardSub}>Update your work capacity and hourly rate band ($35/hr - $50/hr).</p>

            <div style={{ background: '#F8FAFC', border: '1px solid #CBD5E1', padding: '1.2rem', borderRadius: '10px', marginTop: '1rem' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0F172A' }}>Current Rate Band:</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0F172A', marginTop: '0.2rem' }}>
                ${hourlyRate}/hr <span style={{ fontSize: '0.9rem', color: '#64748B', fontWeight: 700 }}>(₹1,80,000 / month equivalent)</span>
              </div>
              <button onClick={handleToggleAvailability} className={styles.btnPrimary} style={{ marginTop: '1rem' }}>
                {isAvailable ? 'Mark as Occupied on Contract' : 'Mark as Available (Immediate)'}
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: Opportunities */}
        {activeTab === 'opportunities' && (
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Client Opportunities & Interview Invites</h3>
            <p className={styles.cardSub}>Inbound hiring enquiries routed via Scriza Private Limited desk.</p>

            <div style={{ borderLeft: '4px solid #E52B2B', padding: '1.2rem', marginTop: '1rem', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #CBD5E1' }}>
              <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '1.05rem' }}>Senior Next.js Architect Contract (6 Months)</div>
              <p style={{ margin: '0.4rem 0', fontSize: '0.88rem', color: '#334155' }}>
                Client: Confidential US SaaS Enterprise | Requirement: Staff Augmentation (4-hr EST overlap)
              </p>
              <span style={{ background: '#DCFCE7', color: '#166534', padding: '0.2rem 0.6rem', borderRadius: '12px', fontWeight: 800, fontSize: '0.78rem' }}>
                ✓ Interview Confirmed: Tomorrow @ 6:30 PM IST
              </span>
            </div>
          </div>
        )}

        {/* TAB 5: Jobs Board */}
        {activeTab === 'jobs' && (
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Scrizians Open Jobs Board</h3>
            <p className={styles.cardSub}>Explore remote and staff augmentation job openings from international clients.</p>

            <div style={{ background: '#F8FAFC', border: '1px solid #CBD5E1', padding: '1rem', borderRadius: '8px', marginTop: '1rem' }}>
              <strong style={{ fontSize: '1rem', color: '#0F172A' }}>CloudScale Inc — Full-Stack Next.js Developer</strong>
              <p style={{ margin: '0.3rem 0', fontSize: '0.85rem', color: '#475569' }}>Rate: $30 - $40/hr | Location: Remote (US EST Overlap)</p>
              <button className={styles.btnPrimary} style={{ marginTop: '0.5rem', fontSize: '0.82rem' }}>Quick Apply via Scrizian Profile</button>
            </div>
          </div>
        )}

        {/* TAB 6: Articles */}
        {activeTab === 'articles' && (
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>My Published Articles & Tech Guides</h3>
            <p className={styles.cardSub}>Technical thought leadership articles authored by SZN-DEV-00001.</p>

            <div style={{ background: '#F8FAFC', border: '1px solid #CBD5E1', padding: '1rem', borderRadius: '8px', marginTop: '1rem' }}>
              <strong style={{ fontSize: '1rem', color: '#0F172A' }}>Scaling Next.js 14 App Router for Enterprise High Traffic</strong>
              <p style={{ margin: '0.3rem 0', fontSize: '0.85rem', color: '#475569' }}>Published on `/insights` | 5 min read | 1.4k Views</p>
              <span style={{ background: '#DCFCE7', color: '#166534', padding: '0.2rem 0.6rem', borderRadius: '12px', fontWeight: 800, fontSize: '0.78rem' }}>✓ Live on Website</span>
            </div>
          </div>
        )}

        {/* TAB 7: Analytics */}
        {activeTab === 'analytics' && (
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Performance Analytics & Earnings Summary</h3>
            <p className={styles.cardSub}>Track your client views, shortlist counts, and monthly billing totals.</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
              <div style={{ background: '#F1F5F9', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0F172A' }}>48</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748B' }}>Client Profile Views</div>
              </div>
              <div style={{ background: '#F1F5F9', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0F172A' }}>6</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748B' }}>Client Shortlists</div>
              </div>
              <div style={{ background: '#F1F5F9', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#16A34A' }}>$5,120</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#166534' }}>Monthly Earnings</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

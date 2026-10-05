'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardSidebar } from '@/components/DashboardSidebar/DashboardSidebar';
import { Pagination } from '@/components/Pagination/Pagination';
import { getStoredData, saveStoredData, initialArticlesList } from '@/utils/dataSync';
import { addNotification } from '@/utils/notificationSync';
import { NotificationBell } from '@/components/NotificationBell/NotificationBell';
import styles from './DashboardContributor.module.css';

export default function ContributorDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'profile' | 'submissions' | 'comments' | 'analytics'>('submissions');
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [articles, setArticles] = useState<any[]>([]);

  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    phone: '+91 98765 43210',
    title: 'Technical Writer & Contributor',
    skills: 'Technical Writing, System Architecture, Code Tutorials'
  });

  React.useEffect(() => {
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
          title: u.title || 'Technical Writer & Contributor',
          skills: u.skills || 'Technical Writing, System Architecture, Code Tutorials'
        });
      } catch (e) {}
    }

    fetch('/api/users')
      .then(r => r.json())
      .then(res => {
        if (res.success && Array.isArray(res.data)) {
          const match = res.data.find((usr: any) => (localEmail && usr.email?.toLowerCase() === localEmail.toLowerCase()) || usr.role === 'contributor');
          if (match) {
            setCurrentUser(match);
            localStorage.setItem('scrizians_user', JSON.stringify(match));
            setEditFormData({
              name: match.name || '',
              phone: match.phone || '+91 98765 43210',
              title: match.title || 'Technical Writer & Contributor',
              skills: match.skills || 'Technical Writing, System Architecture, Code Tutorials'
            });
          }
        }
      })
      .catch(e => console.warn('User sync error:', e));

    const refreshData = () => {
      setArticles(getStoredData('scrizians_insights_list', initialArticlesList));
    };

    refreshData();
    window.addEventListener('scrizians_storage_updated', refreshData);
    window.addEventListener('storage', refreshData);
    return () => {
      window.removeEventListener('scrizians_storage_updated', refreshData);
      window.removeEventListener('storage', refreshData);
    };
  }, []);

  const handleSaveContributorProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedUser = {
        ...currentUser,
        name: editFormData.name,
        phone: editFormData.phone,
        title: editFormData.title,
        skills: editFormData.skills
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
          title: editFormData.title,
          skills: editFormData.skills,
          role: 'contributor'
        })
      });

      setShowEditProfileModal(false);
      showToast('🎉 Contributor Profile updated successfully in MongoDB database!');
    } catch (err) {
      console.warn('Save contributor profile error:', err);
      showToast('🎉 Profile saved locally!');
      setShowEditProfileModal(false);
    }
  };

  const displayName = currentUser?.name || 'Technical Contributor Desk';
  const displayEmail = currentUser?.email || 'contributor@scrizians.com';
  const displayId = currentUser?.scrizianId || currentUser?.id || 'SZN-CONTRIB-00001';

  const [newArticle, setNewArticle] = useState({
    title: '',
    category: 'Hiring Guides',
    content: ''
  });

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleArticleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newArticle.title) return;

    const created = {
      id: `art-${Date.now()}`,
      cat: newArticle.category.toUpperCase(),
      category: newArticle.category,
      filterKey: newArticle.category,
      title: newArticle.title,
      excerpt: newArticle.content || `Technical article on ${newArticle.title}`,
      meta: `${displayId} · Just now · 5 min read`,
      author: `${displayName} (${displayId})`,
      publishedDate: 'Just now',
      readTime: '5 min read',
      coverImageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=70',
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=70',
      status: 'Published'
    };

    const updated = [created, ...articles];
    setArticles(updated);
    saveStoredData('scrizians_insights_list', updated);
    setShowSubmitModal(false);
    setNewArticle({ title: '', category: 'Hiring Guides', content: '' });

    addNotification({
      title: '📰 New Article Published',
      message: `Contributor published "${created.title.substring(0, 30)}..."`,
      type: 'info',
      link: '/insights'
    });

    showToast('🎉 Article submitted and published to website!');
  };

  const handleLogout = () => {
    localStorage.removeItem('scrizians_token');
    localStorage.removeItem('scrizians_user');
    router.push('/dashboard');
  };

  return (
    <div className={styles.dashboardLayout}>
      <DashboardSidebar 
        role="contributor" 
        activeTab={activeTab}
        onTabChange={(tab: any) => setActiveTab(tab)}
        user={currentUser || { name: displayName, role: 'contributor', email: displayEmail, scrizianId: displayId }} 
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
            <h1 className={styles.title}>Knowledge Hub Contributor Portal</h1>
            <p className={styles.subTitle}>
              Logged in as: <strong style={{ color: '#ffffff' }}>{displayName}</strong> | Scrizian Author Attribution
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button 
              onClick={() => {
                setEditFormData({
                  name: displayName,
                  phone: currentUser?.phone || '+91 98765 43210',
                  title: currentUser?.title || 'Technical Writer & Contributor',
                  skills: currentUser?.skills || 'Technical Writing, System Architecture, Code Tutorials'
                });
                setShowEditProfileModal(true);
              }}
              style={{ background: '#E52B2B', color: '#ffffff', border: 'none', padding: '0.55rem 1.1rem', borderRadius: '8px', fontWeight: 800, cursor: 'pointer', fontSize: '0.85rem' }}
            >
              ✏️ Edit Profile
            </button>
            <button onClick={() => setShowSubmitModal(true)} className={styles.btnPrimary}>
              + Submit New Technical Article
            </button>
            <NotificationBell />
          </div>
        </div>

        {/* TAB 1: Profile */}
        {activeTab === 'profile' && (
          <div className={styles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <h3 className={styles.cardTitle} style={{ margin: 0 }}>Author Profile & Bio</h3>
              <button 
                onClick={() => {
                  setEditFormData({
                    name: displayName,
                    phone: currentUser?.phone || '+91 98765 43210',
                    title: currentUser?.title || 'Technical Writer & Contributor',
                    skills: currentUser?.skills || 'Technical Writing, System Architecture, Code Tutorials'
                  });
                  setShowEditProfileModal(true);
                }}
                className={styles.btnSecondary}
                style={{ padding: '0.35rem 0.8rem', fontSize: '0.8rem' }}
              >
                ✏️ Edit Profile
              </button>
            </div>
            <p className={styles.cardSub}>Manage your public author attribution details displayed on published Insights articles.</p>

            <div style={{ background: '#F8FAFC', border: '1px solid #CBD5E1', padding: '1.2rem', borderRadius: '10px', marginTop: '1rem' }}>
              <p><strong>Author Display Name:</strong> {displayName}</p>
              <p><strong>Primary Email:</strong> {displayEmail}</p>
              <p><strong>Primary Attribution ID:</strong> <span style={{ fontFamily: 'monospace', color: '#E52B2B', fontWeight: 800 }}>{displayId}</span></p>
              <p><strong>Bio:</strong> Technical Contributor on Scrizians Knowledge Platform.</p>
            </div>
          </div>
        )}

        {/* TAB 2: Submissions */}
        {(activeTab === 'submissions' || !activeTab) && (
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>My Articles & Published Submissions</h3>
            <p className={styles.cardSub}>
              Articles written by verified Scrizians undergo peer review before publishing to the Insights platform (`/insights`).
            </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {articles.map(art => (
              <div 
                key={art.id} 
                style={{ 
                  border: '2px solid #CBD5E1', 
                  borderRadius: '8px', 
                  padding: '1.2rem', 
                  background: '#ffffff',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}
              >
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0B172A' }}>
                    {art.title}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#334155', marginTop: '0.3rem', fontWeight: 600 }}>
                    Category: <strong style={{ color: '#0F172A' }}>{art.category}</strong> | Attribution: <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#E52B2B' }}>{art.attribution}</span> | Date: {art.date}
                  </div>
                </div>

                <span style={{
                  background: art.status === 'Published' ? '#DCFCE7' : '#FEF3C7',
                  color: art.status === 'Published' ? '#166534' : '#92400E',
                  padding: '0.35rem 0.8rem',
                  borderRadius: '12px',
                  fontWeight: 800,
                  fontSize: '0.82rem'
                }}>
                  ● {art.status}
                </span>
              </div>
            ))}
          </div>

          <Pagination
            currentPage={1}
            totalPages={1}
            onPageChange={() => {}}
            totalItems={articles.length}
            itemsPerPage={5}
            itemLabel="submitted articles"
          />
        </div>
        )}

        {/* TAB 3: Comments */}
        {activeTab === 'comments' && (
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Review Comments & Editorial Feedback</h3>
            <p className={styles.cardSub}>Feedback and review notes from Scrizians Editorial Desk prior to publishing.</p>

            <div style={{ background: '#F0FDF4', border: '2px solid #86EFAC', padding: '1rem', borderRadius: '8px', marginTop: '1rem' }}>
              <div style={{ fontWeight: 800, color: '#166534' }}>✓ Article "How to Hire High-Performing React & Next.js Developers" Approved!</div>
              <div style={{ fontSize: '0.85rem', color: '#14532D', marginTop: '0.3rem' }}>Editorial Desk Note: "Excellent guide, cover banner assigned and published."</div>
            </div>
          </div>
        )}

        {/* TAB 4: Analytics */}
        {activeTab === 'analytics' && (
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Content Analytics & Reader Metrics</h3>
            <p className={styles.cardSub}>Performance overview of your published technical articles.</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
              <div style={{ background: '#F1F5F9', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0F172A' }}>2,450</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748B' }}>Total Article Views</div>
              </div>
              <div style={{ background: '#F1F5F9', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0F172A' }}>180</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748B' }}>Social Shares</div>
              </div>
              <div style={{ background: '#F1F5F9', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#E52B2B' }}>2</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748B' }}>Published Guides</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {showSubmitModal && (
        <div className={styles.modalOverlay} onClick={() => setShowSubmitModal(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setShowSubmitModal(false)}>×</button>

            <h3 className={styles.cardTitle}>Submit Article for Insights Desk</h3>
            <p className={styles.cardSub}>Submit engineering guides, tutorials, or hiring best practices.</p>

            <form onSubmit={handleArticleSubmit}>
              <div className={styles.formGroup}>
                <label>Article Title:</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Best Practices for Microservices in Node.js" 
                  value={newArticle.title}
                  onChange={e => setNewArticle({ ...newArticle, title: e.target.value })}
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Category:</label>
                <select 
                  value={newArticle.category}
                  onChange={e => setNewArticle({ ...newArticle, category: e.target.value })}
                  className={styles.formSelect}
                >
                  <option value="Hiring Guides">Hiring Guides</option>
                  <option value="SaaS Engineering">SaaS Engineering</option>
                  <option value="Engineering Management">Engineering Management</option>
                  <option value="Cloud & DevOps">Cloud & DevOps</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Article Summary / Draft Outline:</label>
                <textarea 
                  rows={4}
                  placeholder="Enter article key points or markdown content..."
                  value={newArticle.content}
                  onChange={e => setNewArticle({ ...newArticle, content: e.target.value })}
                  className={styles.formTextarea}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1.5rem' }}>
                <button type="submit" className={styles.btnPrimary} style={{ width: '100%', justifyContent: 'center' }}>
                  ✓ Submit Article
                </button>
                <button type="button" onClick={() => setShowSubmitModal(false)} className={styles.btnSecondary}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
              ✏️ Edit Contributor Profile Details
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#64748B', marginBottom: '1.2rem' }}>
              Update your author display name, phone, title, and primary domain focus. Changes will save to MongoDB Atlas database.
            </p>

            <form onSubmit={handleSaveContributorProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '0.3rem' }}>
                  Full Author Name *
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '0.3rem' }}>
                    Author Title / Role *
                  </label>
                  <input 
                    type="text" 
                    required 
                    value={editFormData.title}
                    onChange={e => setEditFormData({ ...editFormData, title: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem 0.8rem', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.92rem', fontWeight: 600, outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '0.3rem' }}>
                    Writing Focus / Skills *
                  </label>
                  <input 
                    type="text" 
                    required 
                    value={editFormData.skills}
                    onChange={e => setEditFormData({ ...editFormData, skills: e.target.value })}
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

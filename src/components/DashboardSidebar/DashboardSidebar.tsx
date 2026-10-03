'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './DashboardSidebar.module.css';

interface DashboardSidebarProps {
  role: 'admin' | 'client' | 'talent' | 'contributor' | 'candidate';
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  user?: any;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  role,
  activeTab,
  onTabChange,
  user,
}) => {
  const router = useRouter();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('scrizians_token');
    localStorage.removeItem('scrizians_user');
    router.push('/dashboard');
  };

  const getRoleLabel = () => {
    switch (role) {
      case 'admin': return 'Admin & Staff Ops';
      case 'client': return 'Client / Company';
      case 'talent': return 'Scrizian Talent';
      case 'contributor': return 'Content Author';
      case 'candidate': return 'Job Candidate';
      default: return 'Dashboard';
    }
  };

  const handleItemClick = (tab: string) => {
    setIsMobileSidebarOpen(false);
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  return (
    <>
      {/* Mobile Top Header Bar */}
      <div className={styles.mobileBar}>
        <div className={styles.mobileBrand}>
          <img src="/images/logo.png" alt="Scrizians Logo" className={styles.mobileLogo} />
          <span className={styles.mobilePortalName}>{getRoleLabel()}</span>
        </div>
        <button 
          type="button"
          className={styles.mobileToggleBtn}
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          aria-label="Toggle Dashboard Menu"
        >
          <span>{isMobileSidebarOpen ? '✕' : '☰'}</span>
          <span style={{ fontSize: '0.8rem' }}>Menu</span>
        </button>
      </div>

      {/* Mobile Backdrop Overlay */}
      <div 
        className={`${styles.mobileBackdrop} ${isMobileSidebarOpen ? styles.mobileBackdropShow : ''}`}
        onClick={() => setIsMobileSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* Sidebar Drawer Container */}
      <aside className={`${styles.sidebar} ${isMobileSidebarOpen ? styles.sidebarOpen : ''}`}>
        {/* Top Logo */}
        <div className={styles.logoBox}>
          <Link href="/" className={styles.brandLink}>
            <img src="/images/logo.png" alt="Scrizians Logo" className={styles.brandImg} />
          </Link>
          <span className={styles.portalTag}>{getRoleLabel()}</span>
        </div>

        {/* User Snippet */}
        <div className={styles.userCard}>
          <div className={styles.userAvatar}>
            {user?.scrizianId ? user.scrizianId.slice(-2) : (user?.name?.charAt(0) || 'U')}
          </div>
          <div className={styles.userInfo}>
            <div className={styles.userName}>{user?.name || 'Scrizians User'}</div>
            <div className={styles.userSub}>
              {user?.scrizianId ? (
                <span className={styles.scrizianIdTag}>{user.scrizianId}</span>
              ) : (
                user?.email || 'verified@scrizians.com'
              )}
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className={styles.navMenu} aria-label="Dashboard Menu">
          <div className={styles.menuGroupTitle}>MAIN ACCESS MENU</div>

          {/* 1. Admin & Scriza Staff Panel */}
          {role === 'admin' && (
            <>
              <button
                type="button"
                className={`${styles.navItem} ${activeTab === 'leads' || !activeTab ? styles.navItemActive : ''}`}
                onClick={() => handleItemClick('leads')}
              >
                <span className={styles.itemIcon}>📊</span>
                <span>Assigned Leads & CRM</span>
              </button>
              <button
                type="button"
                className={`${styles.navItem} ${activeTab === 'talent' ? styles.navItemActive : ''}`}
                onClick={() => handleItemClick('talent')}
              >
                <span className={styles.itemIcon}>👥</span>
                <span>Talent Review & Roster</span>
              </button>
              <button
                type="button"
                className={`${styles.navItem} ${activeTab === 'insights' ? styles.navItemActive : ''}`}
                onClick={() => handleItemClick('insights')}
              >
                <span className={styles.itemIcon}>📰</span>
                <span>Content & Insights Review</span>
              </button>
              <button
                type="button"
                className={`${styles.navItem} ${activeTab === 'jobs' ? styles.navItemActive : ''}`}
                onClick={() => handleItemClick('jobs')}
              >
                <span className={styles.itemIcon}>💼</span>
                <span>Job Workflows</span>
              </button>
              <button
                type="button"
                className={`${styles.navItem} ${activeTab === 'config' ? styles.navItemActive : ''}`}
                onClick={() => handleItemClick('config')}
              >
                <span className={styles.itemIcon}>⚙️</span>
                <span>Platform Config & RBAC</span>
              </button>
              <button
                type="button"
                className={`${styles.navItem} ${activeTab === 'audit' ? styles.navItemActive : ''}`}
                onClick={() => handleItemClick('audit')}
              >
                <span className={styles.itemIcon}>🔍</span>
                <span>SEO, Pricing & Audit</span>
              </button>
            </>
          )}

          {/* 2. Client / Company Panel */}
          {role === 'client' && (
            <>
              <button
                type="button"
                className={`${styles.navItem} ${activeTab === 'requirements' || !activeTab ? styles.navItemActive : ''}`}
                onClick={() => handleItemClick('requirements')}
              >
                <span className={styles.itemIcon}>📌</span>
                <span>Hiring Requirements</span>
              </button>
              <button
                type="button"
                className={`${styles.navItem} ${activeTab === 'shortlist' ? styles.navItemActive : ''}`}
                onClick={() => handleItemClick('shortlist')}
              >
                <span className={styles.itemIcon}>⭐</span>
                <span>Shortlisted Talent</span>
              </button>
              <button
                type="button"
                className={`${styles.navItem} ${activeTab === 'interviews' ? styles.navItemActive : ''}`}
                onClick={() => handleItemClick('interviews')}
              >
                <span className={styles.itemIcon}>📅</span>
                <span>Interview Schedule</span>
              </button>
              <button
                type="button"
                className={`${styles.navItem} ${activeTab === 'engagements' ? styles.navItemActive : ''}`}
                onClick={() => handleItemClick('engagements')}
              >
                <span className={styles.itemIcon}>🤝</span>
                <span>Active Engagements</span>
              </button>
              <button
                type="button"
                className={`${styles.navItem} ${activeTab === 'invoices' ? styles.navItemActive : ''}`}
                onClick={() => handleItemClick('invoices')}
              >
                <span className={styles.itemIcon}>🧾</span>
                <span>Invoices & Billing</span>
              </button>
            </>
          )}

          {/* 3. Scrizian / Talent Panel */}
          {role === 'talent' && (
            <>
              <button
                type="button"
                className={`${styles.navItem} ${activeTab === 'profile' || !activeTab ? styles.navItemActive : ''}`}
                onClick={() => handleItemClick('profile')}
              >
                <span className={styles.itemIcon}>👤</span>
                <span>Scrizian Profile</span>
              </button>
              <button
                type="button"
                className={`${styles.navItem} ${activeTab === 'portfolio' ? styles.navItemActive : ''}`}
                onClick={() => handleItemClick('portfolio')}
              >
                <span className={styles.itemIcon}>🎨</span>
                <span>Portfolio Showcase</span>
              </button>
              <button
                type="button"
                className={`${styles.navItem} ${activeTab === 'availability' ? styles.navItemActive : ''}`}
                onClick={() => handleItemClick('availability')}
              >
                <span className={styles.itemIcon}>🟢</span>
                <span>Availability & Rates</span>
              </button>
              <button
                type="button"
                className={`${styles.navItem} ${activeTab === 'opportunities' ? styles.navItemActive : ''}`}
                onClick={() => handleItemClick('opportunities')}
              >
                <span className={styles.itemIcon}>🎯</span>
                <span>Opportunities</span>
              </button>
              <button
                type="button"
                className={`${styles.navItem} ${activeTab === 'jobs' ? styles.navItemActive : ''}`}
                onClick={() => handleItemClick('jobs')}
              >
                <span className={styles.itemIcon}>💼</span>
                <span>Jobs Board</span>
              </button>
              <button
                type="button"
                className={`${styles.navItem} ${activeTab === 'articles' ? styles.navItemActive : ''}`}
                onClick={() => handleItemClick('articles')}
              >
                <span className={styles.itemIcon}>📝</span>
                <span>My Articles</span>
              </button>
              <button
                type="button"
                className={`${styles.navItem} ${activeTab === 'analytics' ? styles.navItemActive : ''}`}
                onClick={() => handleItemClick('analytics')}
              >
                <span className={styles.itemIcon}>📊</span>
                <span>Performance Analytics</span>
              </button>
            </>
          )}

          {/* 4. Contributor / Author Panel */}
          {role === 'contributor' && (
            <>
              <button
                type="button"
                className={`${styles.navItem} ${activeTab === 'profile' ? styles.navItemActive : ''}`}
                onClick={() => handleItemClick('profile')}
              >
                <span className={styles.itemIcon}>👤</span>
                <span>Author Profile</span>
              </button>
              <button
                type="button"
                className={`${styles.navItem} ${activeTab === 'submissions' || !activeTab ? styles.navItemActive : ''}`}
                onClick={() => handleItemClick('submissions')}
              >
                <span className={styles.itemIcon}>📝</span>
                <span>Drafts & Submissions</span>
              </button>
              <button
                type="button"
                className={`${styles.navItem} ${activeTab === 'comments' ? styles.navItemActive : ''}`}
                onClick={() => handleItemClick('comments')}
              >
                <span className={styles.itemIcon}>💬</span>
                <span>Review Comments</span>
              </button>
              <button
                type="button"
                className={`${styles.navItem} ${activeTab === 'analytics' ? styles.navItemActive : ''}`}
                onClick={() => handleItemClick('analytics')}
              >
                <span className={styles.itemIcon}>📊</span>
                <span>Content Analytics</span>
              </button>
            </>
          )}

          {/* 5. Candidate Panel */}
          {role === 'candidate' && (
            <>
              <button
                type="button"
                className={`${styles.navItem} ${activeTab === 'profile' || !activeTab ? styles.navItemActive : ''}`}
                onClick={() => handleItemClick('profile')}
              >
                <span className={styles.itemIcon}>👤</span>
                <span>My Profile</span>
              </button>
              <button
                type="button"
                className={`${styles.navItem} ${activeTab === 'resume' ? styles.navItemActive : ''}`}
                onClick={() => handleItemClick('resume')}
              >
                <span className={styles.itemIcon}>📄</span>
                <span>Resume & Credentials</span>
              </button>
              <button
                type="button"
                className={`${styles.navItem} ${activeTab === 'applications' ? styles.navItemActive : ''}`}
                onClick={() => handleItemClick('applications')}
              >
                <span className={styles.itemIcon}>💼</span>
                <span>Job Applications</span>
              </button>
              <button
                type="button"
                className={`${styles.navItem} ${activeTab === 'interview_status' ? styles.navItemActive : ''}`}
                onClick={() => handleItemClick('interview_status')}
              >
                <span className={styles.itemIcon}>📅</span>
                <span>Interview Status</span>
              </button>
            </>
          )}
        </nav>

        {/* Footer / Logout */}
        <div className={styles.sidebarFooter}>
          <Link href="/" className={styles.btnWebsite}>
            🌐 Back to Website
          </Link>
          <button type="button" onClick={handleLogout} className={styles.btnLogout}>
            🚪 Log Out
          </button>
        </div>
      </aside>
    </>
  );
};

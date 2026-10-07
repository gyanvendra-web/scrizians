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
          <img src="/images/logo-white.png" alt="Scrizians Logo" className={styles.mobileLogo} />
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
            <img src="/images/logo-white.png" alt="Scrizians Logo" className={styles.brandImg} />
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
              <a
                href="#leads"
                className={`${styles.navItem} ${activeTab === 'leads' || !activeTab ? styles.navItemActive : ''}`}
                onClick={(e) => { e.preventDefault(); handleItemClick('leads'); }}
              >
                <span className={styles.itemIcon}>📊</span>
                <span>Assigned Leads & CRM</span>
              </a>
              <a
                href="#talent"
                className={`${styles.navItem} ${activeTab === 'talent' ? styles.navItemActive : ''}`}
                onClick={(e) => { e.preventDefault(); handleItemClick('talent'); }}
              >
                <span className={styles.itemIcon}>👥</span>
                <span>Talent Review & Roster</span>
              </a>
              <a
                href="#insights"
                className={`${styles.navItem} ${activeTab === 'insights' ? styles.navItemActive : ''}`}
                onClick={(e) => { e.preventDefault(); handleItemClick('insights'); }}
              >
                <span className={styles.itemIcon}>📰</span>
                <span>Content & Insights Review</span>
              </a>
              <a
                href="#jobs"
                className={`${styles.navItem} ${activeTab === 'jobs' ? styles.navItemActive : ''}`}
                onClick={(e) => { e.preventDefault(); handleItemClick('jobs'); }}
              >
                <span className={styles.itemIcon}>💼</span>
                <span>Job Workflows</span>
              </a>
              <a
                href="#portfolio"
                className={`${styles.navItem} ${activeTab === 'portfolio' ? styles.navItemActive : ''}`}
                onClick={(e) => { e.preventDefault(); handleItemClick('portfolio'); }}
              >
                <span className={styles.itemIcon}>🎨</span>
                <span>Portfolio Showcase</span>
              </a>
              <a
                href="#config"
                className={`${styles.navItem} ${activeTab === 'config' ? styles.navItemActive : ''}`}
                onClick={(e) => { e.preventDefault(); handleItemClick('config'); }}
              >
                <span className={styles.itemIcon}>⚙️</span>
                <span>Platform Config & RBAC</span>
              </a>
              <a
                href="#audit"
                className={`${styles.navItem} ${activeTab === 'audit' ? styles.navItemActive : ''}`}
                onClick={(e) => { e.preventDefault(); handleItemClick('audit'); }}
              >
                <span className={styles.itemIcon}>🔍</span>
                <span>SEO, Pricing & Audit</span>
              </a>
            </>
          )}

          {/* 2. Client / Company Panel */}
          {role === 'client' && (
            <>
              <a
                href="#requirements"
                className={`${styles.navItem} ${activeTab === 'requirements' || !activeTab ? styles.navItemActive : ''}`}
                onClick={(e) => { e.preventDefault(); handleItemClick('requirements'); }}
              >
                <span className={styles.itemIcon}>📌</span>
                <span>Hiring Requirements</span>
              </a>
              <a
                href="#shortlist"
                className={`${styles.navItem} ${activeTab === 'shortlist' ? styles.navItemActive : ''}`}
                onClick={(e) => { e.preventDefault(); handleItemClick('shortlist'); }}
              >
                <span className={styles.itemIcon}>⭐</span>
                <span>Shortlisted Talent</span>
              </a>
              <a
                href="#interviews"
                className={`${styles.navItem} ${activeTab === 'interviews' ? styles.navItemActive : ''}`}
                onClick={(e) => { e.preventDefault(); handleItemClick('interviews'); }}
              >
                <span className={styles.itemIcon}>📅</span>
                <span>Interview Schedule</span>
              </a>
              <a
                href="#engagements"
                className={`${styles.navItem} ${activeTab === 'engagements' ? styles.navItemActive : ''}`}
                onClick={(e) => { e.preventDefault(); handleItemClick('engagements'); }}
              >
                <span className={styles.itemIcon}>🤝</span>
                <span>Active Engagements</span>
              </a>
              <a
                href="#invoices"
                className={`${styles.navItem} ${activeTab === 'invoices' ? styles.navItemActive : ''}`}
                onClick={(e) => { e.preventDefault(); handleItemClick('invoices'); }}
              >
                <span className={styles.itemIcon}>🧾</span>
                <span>Invoices & Billing</span>
              </a>
            </>
          )}

          {/* 3. Scrizian / Talent Panel */}
          {role === 'talent' && (
            <>
              <a
                href="#profile"
                className={`${styles.navItem} ${activeTab === 'profile' || !activeTab ? styles.navItemActive : ''}`}
                onClick={(e) => { e.preventDefault(); handleItemClick('profile'); }}
              >
                <span className={styles.itemIcon}>👤</span>
                <span>Scrizian Profile</span>
              </a>
              <a
                href="#portfolio"
                className={`${styles.navItem} ${activeTab === 'portfolio' ? styles.navItemActive : ''}`}
                onClick={(e) => { e.preventDefault(); handleItemClick('portfolio'); }}
              >
                <span className={styles.itemIcon}>🎨</span>
                <span>Portfolio Showcase</span>
              </a>
              <a
                href="#availability"
                className={`${styles.navItem} ${activeTab === 'availability' ? styles.navItemActive : ''}`}
                onClick={(e) => { e.preventDefault(); handleItemClick('availability'); }}
              >
                <span className={styles.itemIcon}>🟢</span>
                <span>Availability & Rates</span>
              </a>
              <a
                href="#opportunities"
                className={`${styles.navItem} ${activeTab === 'opportunities' ? styles.navItemActive : ''}`}
                onClick={(e) => { e.preventDefault(); handleItemClick('opportunities'); }}
              >
                <span className={styles.itemIcon}>🎯</span>
                <span>Opportunities</span>
              </a>
              <a
                href="#jobs"
                className={`${styles.navItem} ${activeTab === 'jobs' ? styles.navItemActive : ''}`}
                onClick={(e) => { e.preventDefault(); handleItemClick('jobs'); }}
              >
                <span className={styles.itemIcon}>💼</span>
                <span>Jobs Board</span>
              </a>
              <a
                href="#articles"
                className={`${styles.navItem} ${activeTab === 'articles' ? styles.navItemActive : ''}`}
                onClick={(e) => { e.preventDefault(); handleItemClick('articles'); }}
              >
                <span className={styles.itemIcon}>📝</span>
                <span>My Articles</span>
              </a>
              <a
                href="#analytics"
                className={`${styles.navItem} ${activeTab === 'analytics' ? styles.navItemActive : ''}`}
                onClick={(e) => { e.preventDefault(); handleItemClick('analytics'); }}
              >
                <span className={styles.itemIcon}>📊</span>
                <span>Performance Analytics</span>
              </a>
            </>
          )}

          {/* 4. Contributor / Author Panel */}
          {role === 'contributor' && (
            <>
              <a
                href="#profile"
                className={`${styles.navItem} ${activeTab === 'profile' ? styles.navItemActive : ''}`}
                onClick={(e) => { e.preventDefault(); handleItemClick('profile'); }}
              >
                <span className={styles.itemIcon}>👤</span>
                <span>Author Profile</span>
              </a>
              <a
                href="#submissions"
                className={`${styles.navItem} ${activeTab === 'submissions' || !activeTab ? styles.navItemActive : ''}`}
                onClick={(e) => { e.preventDefault(); handleItemClick('submissions'); }}
              >
                <span className={styles.itemIcon}>📝</span>
                <span>Drafts & Submissions</span>
              </a>
              <a
                href="#comments"
                className={`${styles.navItem} ${activeTab === 'comments' ? styles.navItemActive : ''}`}
                onClick={(e) => { e.preventDefault(); handleItemClick('comments'); }}
              >
                <span className={styles.itemIcon}>💬</span>
                <span>Review Comments</span>
              </a>
              <a
                href="#analytics"
                className={`${styles.navItem} ${activeTab === 'analytics' ? styles.navItemActive : ''}`}
                onClick={(e) => { e.preventDefault(); handleItemClick('analytics'); }}
              >
                <span className={styles.itemIcon}>📊</span>
                <span>Content Analytics</span>
              </a>
            </>
          )}

          {/* 5. Candidate Panel */}
          {role === 'candidate' && (
            <>
              <a
                href="#profile"
                className={`${styles.navItem} ${activeTab === 'profile' || !activeTab ? styles.navItemActive : ''}`}
                onClick={(e) => { e.preventDefault(); handleItemClick('profile'); }}
              >
                <span className={styles.itemIcon}>👤</span>
                <span>My Profile</span>
              </a>
              <a
                href="#resume"
                className={`${styles.navItem} ${activeTab === 'resume' ? styles.navItemActive : ''}`}
                onClick={(e) => { e.preventDefault(); handleItemClick('resume'); }}
              >
                <span className={styles.itemIcon}>📄</span>
                <span>Resume & Credentials</span>
              </a>
              <a
                href="#applications"
                className={`${styles.navItem} ${activeTab === 'applications' ? styles.navItemActive : ''}`}
                onClick={(e) => { e.preventDefault(); handleItemClick('applications'); }}
              >
                <span className={styles.itemIcon}>💼</span>
                <span>Job Applications</span>
              </a>
              <a
                href="#interview_status"
                className={`${styles.navItem} ${activeTab === 'interview_status' ? styles.navItemActive : ''}`}
                onClick={(e) => { e.preventDefault(); handleItemClick('interview_status'); }}
              >
                <span className={styles.itemIcon}>📅</span>
                <span>Interview Status</span>
              </a>
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

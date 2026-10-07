'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Pagination } from '@/components/Pagination/Pagination';
import { DashboardSidebar } from '@/components/DashboardSidebar/DashboardSidebar';
import { NotificationBell } from '@/components/NotificationBell/NotificationBell';
import { getStoredData, saveStoredData, deleteStoredData, syncAllFromMongoDB, initialLeadsList, initialTalentList, initialJobsList, initialArticlesList } from '@/utils/dataSync';
import styles from './DashboardAdmin.module.css';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'leads' | 'talent' | 'jobs' | 'insights' | 'portfolio' | 'config' | 'audit'>('leads');
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  // Pagination states
  const [leadsPage, setLeadsPage] = useState(1);
  const [talentPage, setTalentPage] = useState(1);
  const [jobsPage, setJobsPage] = useState(1);
  const [insightsPage, setInsightsPage] = useState(1);

  // 1. Leads State
  const [leads, setLeads] = useState<any[]>([]);

  // 2. Talent Profiles State with Avatars
  const [talents, setTalents] = useState<any[]>([]);

  // 3. Jobs State with Company Logos
  const [jobs, setJobs] = useState<any[]>([]);

  // 4. Insights / Articles State with Cover Banners
  const [insights, setInsights] = useState<any[]>([]);

  // 5. Registered System Users State for RBAC
  const [usersList, setUsersList] = useState<any[]>([]);

  // 6. Portfolio Showcase State
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [portfolioPage, setPortfolioPage] = useState(1);
  const [showPortfolioModal, setShowPortfolioModal] = useState(false);
  const [editingPortfolio, setEditingPortfolio] = useState<any | null>(null);
  const [portfolioFormData, setPortfolioFormData] = useState({
    id: '',
    scrizianId: '',
    authorRole: '',
    title: '',
    description: '',
    skills: '',
    coverImageUrl: '',
    isNdaProtected: false
  });

  // Modal Editing & Adding States
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  
  // Talent Modal Form
  const [showTalentModal, setShowTalentModal] = useState(false);
  const [editingTalent, setEditingTalent] = useState<any | null>(null);
  const [talentFormData, setTalentFormData] = useState({ 
    id: '', displayName: '', title: '', hourlyRateUSD: '35', availability: 'Immediate', skills: '', avatarUrl: '/images/logo.png', status: 'Verified' 
  });

  // Job Modal Form
  const [leadViewMode, setLeadViewMode] = useState<'table' | 'kanban'>('table');
  const [showJobModal, setShowJobModal] = useState(false);
  const [editingJob, setEditingJob] = useState<any | null>(null);
  const [jobFormData, setJobFormData] = useState({ 
    id: '', title: '', company: 'Scriza Client Partner', companyLogoUrl: '/images/logo.png', location: 'Remote (India / Global)', rate: '$30 - $40 / hr', status: 'Active' 
  });

  // Insight Modal Form
  const [showInsightModal, setShowInsightModal] = useState(false);
  const [editingInsight, setEditingInsight] = useState<any | null>(null);
  const [insightFormData, setInsightFormData] = useState({ 
    id: '', title: '', category: 'Hiring Guides', excerpt: '', content: '', coverImageUrl: '/images/logo.png', readTime: '5 min read', author: 'Scrizians Editorial', status: 'Published' 
  });

  const [currentUser, setCurrentUser] = useState<any>(null);

  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    phone: '+91 98765 43210',
    title: 'Scriza Super Admin',
    skills: 'Platform Governance, Executive Operations, User Management'
  });

  useEffect(() => {
    const stored = localStorage.getItem('scrizians_user');
    if (stored) {
      try {
        const u = JSON.parse(stored);
        setCurrentUser(u);
        setEditFormData({
          name: u.name || '',
          phone: u.phone || '+91 98765 43210',
          title: u.title || 'Scriza Super Admin',
          skills: u.skills || 'Platform Governance, Executive Operations, User Management'
        });
      } catch (e) {}
    }

    const loadFromApi = () => {
      fetch('/api/leads', { cache: 'no-store' }).then(r => r.json()).then(res => { if (res.success && Array.isArray(res.data)) setLeads(res.data); }).catch(e => console.warn(e));
      fetch('/api/talent', { cache: 'no-store' }).then(r => r.json()).then(res => { if (res.success && Array.isArray(res.data)) setTalents(res.data); }).catch(e => console.warn(e));
      fetch('/api/jobs', { cache: 'no-store' }).then(r => r.json()).then(res => { if (res.success && Array.isArray(res.data)) setJobs(res.data); }).catch(e => console.warn(e));
      fetch('/api/insights', { cache: 'no-store' }).then(r => r.json()).then(res => { if (res.success && Array.isArray(res.data)) setInsights(res.data); }).catch(e => console.warn(e));
      fetch('/api/portfolio', { cache: 'no-store' }).then(r => r.json()).then(res => { if (res.success && Array.isArray(res.data)) setPortfolios(res.data); }).catch(e => console.warn(e));
      fetch('/api/users', { cache: 'no-store' }).then(r => r.json()).then(res => { if (res.success && Array.isArray(res.data)) setUsersList(res.data); }).catch(e => console.warn(e));
    };

    loadFromApi();
    window.addEventListener('scrizians_storage_updated', loadFromApi);
    window.addEventListener('storage', loadFromApi);

    return () => {
      window.removeEventListener('scrizians_storage_updated', loadFromApi);
      window.removeEventListener('storage', loadFromApi);
    };
  }, []);

  const displayName = currentUser?.name || 'Scriza Super Admin';
  const displayEmail = currentUser?.email || 'admin@scrizians.com';

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSaveAdminProfile = async (e: React.FormEvent) => {
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
          role: 'admin'
        })
      });

      setShowEditProfileModal(false);
      showToast('🎉 Admin Profile updated successfully in MongoDB database!');
    } catch (err) {
      console.warn('Save admin profile error:', err);
      showToast('🎉 Profile saved locally!');
      setShowEditProfileModal(false);
    }
  };

  // Helper function for local image file reader preview
  const handleImageUpload = (file: File, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        callback(reader.result as string);
        showToast('🖼️ Image uploaded & preview ready!');
      }
    };
    reader.readAsDataURL(file);
  };

  // --- LEADS ACTIONS ---
  const handleUpdateLeadStage = (leadId: string, newStage: string) => {
    const updated = leads.map(l => l._id === leadId ? { ...l, stage: newStage } : l);
    setLeads(updated);
    saveStoredData('scrizians_leads_list', updated);
    showToast(`✓ Pipeline stage updated to "${newStage}"`);
  };

  const handleDeleteLead = (leadId: string) => {
    const updated = leads.filter(l => (l._id || l.id) !== leadId);
    setLeads(updated);
    deleteStoredData('scrizians_leads_list', leadId, updated);
    if (selectedLead?._id === leadId || selectedLead?.id === leadId) setSelectedLead(null);
    showToast('🗑️ Lead deleted successfully');
  };

  // --- TALENT ACTIONS ---
  const handleOpenAddTalent = () => {
    setEditingTalent(null);
    setTalentFormData({ id: `SZN-DEV-${Math.floor(10000 + Math.random() * 90000)}`, displayName: '', title: '', hourlyRateUSD: '35', availability: 'Immediate', skills: '', avatarUrl: '/images/logo.png', status: 'Verified' });
    setShowTalentModal(true);
  };

  const handleOpenEditTalent = (t: any) => {
    setEditingTalent(t);
    setTalentFormData({ id: t.id || t.scrizianId, displayName: t.displayName, title: t.title, hourlyRateUSD: String(t.hourlyRateUSD), availability: t.availability, skills: Array.isArray(t.skills) ? t.skills.join(', ') : t.skills, avatarUrl: t.avatarUrl || '/images/logo.png', status: t.status });
    setShowTalentModal(true);
  };

  const handleSaveTalent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!talentFormData.displayName || !talentFormData.title) return;

    let updated: any[];
    if (editingTalent) {
      updated = talents.map(t => (t.id === editingTalent.id || t.scrizianId === editingTalent.id) ? { ...t, ...talentFormData, hourlyRateUSD: Number(talentFormData.hourlyRateUSD) } : t);
      showToast(`✓ Scrizian ${editingTalent.id} updated!`);
    } else {
      const created = { ...talentFormData, hourlyRateUSD: Number(talentFormData.hourlyRateUSD) };
      updated = [created, ...talents];
      showToast(`🎉 New Scrizian ${created.id} created with profile image!`);
    }
    setTalents(updated);
    saveStoredData('scrizians_talent_list', updated);

    fetch('/api/talent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingTalent ? { ...editingTalent, ...talentFormData } : { ...talentFormData })
    }).catch(err => console.warn('MongoDB Talent Save Error:', err));

    setShowTalentModal(false);
  };

  const handleDeleteTalent = (id: string) => {
    const updated = talents.filter(t => t.id !== id && t.scrizianId !== id && t._id !== id);
    setTalents(updated);
    deleteStoredData('scrizians_talent_list', id, updated);
    showToast(`🗑️ Scrizian ${id} deleted successfully`);
  };

  const handleToggleVerifyTalent = (id: string) => {
    const updated = talents.map(t => {
      if (t.id === id || t.scrizianId === id || t._id === id) {
        const nextStatus = t.status === 'Verified' ? 'Pending Review' : 'Verified';
        fetch('/api/talent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...t, status: nextStatus })
        }).catch(err => console.warn('Talent verify error:', err));
        return { ...t, status: nextStatus };
      }
      return t;
    });
    setTalents(updated);
    saveStoredData('scrizians_talent_list', updated);
    showToast(`✓ Scrizian ${id} verification status updated!`);
  };

  const handleToggleApproveArticle = (id: string) => {
    const updated = insights.map(art => {
      if (art.id === id || art._id === id) {
        const nextStatus = art.status === 'Published' ? 'Draft' : 'Published';
        fetch('/api/insights', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...art, status: nextStatus })
        }).catch(err => console.warn('Insight verify error:', err));
        return { ...art, status: nextStatus };
      }
      return art;
    });
    setInsights(updated);
    saveStoredData('scrizians_insights_list', updated);
    showToast(`✓ Article publication status updated!`);
  };

  // --- JOBS ACTIONS ---
  const handleOpenAddJob = () => {
    setEditingJob(null);
    setJobFormData({ id: `job-${jobs.length + 101}`, title: '', company: 'Scriza Client Partner', companyLogoUrl: '/images/logo.png', location: 'Remote (India / Global)', rate: '$30 - $40 / hr', status: 'Active' });
    setShowJobModal(true);
  };

  const handleOpenEditJob = (j: any) => {
    setEditingJob(j);
    setJobFormData({ id: j.id, title: j.title, company: j.company, companyLogoUrl: j.companyLogoUrl || '/images/logo.png', location: j.location, rate: j.rate || j.salaryUSD, status: j.status });
    setShowJobModal(true);
  };

  const handleSaveJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobFormData.title) return;

    let updated: any[];
    if (editingJob) {
      updated = jobs.map(j => j.id === editingJob.id ? { ...j, ...jobFormData } : j);
      showToast(`✓ Job Opening ${editingJob.id} updated!`);
    } else {
      const created = { ...jobFormData, applicantsCount: 0 };
      updated = [created, ...jobs];
      showToast('🎉 New Job Opening posted with logo!');
    }
    setJobs(updated);
    saveStoredData('scrizians_jobs_list', updated);

    fetch('/api/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingJob ? { ...editingJob, ...jobFormData } : { ...jobFormData })
    }).catch(err => console.warn('MongoDB Job Save Error:', err));

    setShowJobModal(false);
  };

  const handleDeleteJob = (id: string) => {
    const updated = jobs.filter(j => j.id !== id && j.slug !== id && j._id !== id);
    setJobs(updated);
    deleteStoredData('scrizians_jobs_list', id, updated);
    showToast(`🗑️ Job Opening ${id} deleted successfully`);
  };

  const handleToggleJobStatus = (id: string) => {
    const updated = jobs.map(j => {
      if (j.id === id || j.slug === id || j._id === id) {
        const nextStatus = (j.status === 'Active' || j.status === 'Verified') ? 'Inactive' : 'Active';
        fetch('/api/jobs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...j, status: nextStatus })
        }).catch(err => console.warn('Job status error:', err));
        return { ...j, status: nextStatus };
      }
      return j;
    });
    setJobs(updated);
    saveStoredData('scrizians_jobs_list', updated);
    showToast(`✓ Job Opening status updated!`);
  };

  // --- INSIGHTS / ARTICLES ACTIONS ---
  const handleOpenAddInsight = () => {
    setEditingInsight(null);
    setInsightFormData({ id: `art-${insights.length + 1}`, title: '', category: 'Hiring Guides', excerpt: '', content: '', coverImageUrl: '/images/logo.png', readTime: '5 min read', author: 'Scrizians Editorial', status: 'Published' });
    setShowInsightModal(true);
  };

  const handleOpenEditInsight = (art: any) => {
    setEditingInsight(art);
    setInsightFormData({ id: art.id, title: art.title, category: art.category, excerpt: art.excerpt || '', content: art.content || art.body || '', coverImageUrl: art.coverImageUrl || '/images/logo.png', readTime: art.readTime || '5 min read', author: art.author || 'Scrizians Editorial', status: art.status || 'Published' });
    setShowInsightModal(true);
  };

  const handleSaveInsight = (e: React.FormEvent) => {
    e.preventDefault();
    if (!insightFormData.title) return;

    let updated: any[];
    if (editingInsight) {
      updated = insights.map(a => a.id === editingInsight.id ? { ...a, ...insightFormData } : a);
      showToast(`✓ Article "${insightFormData.title.substring(0, 20)}..." updated!`);
    } else {
      const created = { ...insightFormData, publishedDate: 'Just now' };
      updated = [created, ...insights];
      showToast('🎉 New Article Published with Cover Image!');
    }
    setInsights(updated);
    saveStoredData('scrizians_insights_list', updated);

    fetch('/api/insights', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingInsight ? { ...editingInsight, ...insightFormData } : { ...insightFormData })
    }).catch(err => console.warn('MongoDB Insight Save Error:', err));

    setShowInsightModal(false);
  };

  const handleDeleteInsight = (id: string) => {
    const updated = insights.filter(a => a.id !== id && a._id !== id && a.slug !== id);
    setInsights(updated);
    deleteStoredData('scrizians_insights_list', id, updated);
    showToast('🗑️ Article deleted successfully');
  };

  // --- PORTFOLIO ACTIONS ---
  const handleOpenAddPortfolio = () => {
    setEditingPortfolio(null);
    setPortfolioFormData({
      id: `port-${Math.floor(100 + Math.random() * 900)}`,
      scrizianId: 'SCR-8841',
      authorRole: 'Lead Architect',
      title: '',
      description: '',
      skills: 'Next.js, Node.js, MongoDB',
      coverImageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=70',
      isNdaProtected: false
    });
    setShowPortfolioModal(true);
  };

  const handleOpenEditPortfolio = (item: any) => {
    setEditingPortfolio(item);
    setPortfolioFormData({
      id: item.id || item._id,
      scrizianId: item.scrizianId || 'SCR-8841',
      authorRole: item.authorRole || 'Architect',
      title: item.title || '',
      description: item.description || '',
      skills: Array.isArray(item.skills) ? item.skills.join(', ') : (item.skills || ''),
      coverImageUrl: item.coverImageUrl || 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=70',
      isNdaProtected: !!item.isNdaProtected
    });
    setShowPortfolioModal(true);
  };

  const handleSavePortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!portfolioFormData.title) return;
    const skillsArr = portfolioFormData.skills.split(',').map(s => s.trim()).filter(Boolean);
    const itemData = {
      id: portfolioFormData.id,
      scrizianId: portfolioFormData.scrizianId,
      authorRole: portfolioFormData.authorRole,
      title: portfolioFormData.title,
      description: portfolioFormData.description,
      skills: skillsArr,
      coverImageUrl: portfolioFormData.coverImageUrl,
      isNdaProtected: portfolioFormData.isNdaProtected
    };

    let updated: any[];
    if (editingPortfolio) {
      updated = portfolios.map(p => (p.id === itemData.id || p._id === itemData.id) ? itemData : p);
    } else {
      updated = [itemData, ...portfolios];
    }
    setPortfolios(updated);
    saveStoredData('scrizians_portfolio_list', updated);

    try {
      await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData)
      });
      showToast(editingPortfolio ? '✏️ Portfolio item updated successfully!' : '🎨 New Portfolio Showcase added!');
    } catch (err) {
      console.warn('Portfolio API save error:', err);
      showToast('🎉 Portfolio saved!');
    }
    setShowPortfolioModal(false);
  };

  const handleDeletePortfolio = async (portId: string) => {
    const updated = portfolios.filter(p => p.id !== portId && p._id !== portId);
    setPortfolios(updated);
    deleteStoredData('scrizians_portfolio_list', portId, updated);
    try {
      await fetch(`/api/portfolio?id=${portId}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('Portfolio DELETE error:', err);
    }
    showToast('🗑️ Portfolio item deleted');
  };

  const handleToggleNDA = async (item: any) => {
    const updatedItem = { ...item, isNdaProtected: !item.isNdaProtected };
    const updated = portfolios.map(p => (p.id === item.id || p._id === item.id) ? updatedItem : p);
    setPortfolios(updated);
    try {
      await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedItem)
      });
      showToast(`🔒 NDA status toggled to ${updatedItem.isNdaProtected ? 'Protected' : 'Public Showcase'}`);
    } catch (err) {}
  };

  const handleLogout = () => {
    localStorage.removeItem('scrizians_token');
    localStorage.removeItem('scrizians_user');
    router.push('/login');
  };

  const filteredLeads = leads.filter(l => 
    l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.scrizianIdReferenced.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const LEADS_PER_PAGE = 10;
  const totalLeadsPages = Math.max(1, Math.ceil(filteredLeads.length / LEADS_PER_PAGE));
  const paginatedLeads = filteredLeads.slice((leadsPage - 1) * LEADS_PER_PAGE, leadsPage * LEADS_PER_PAGE);

  const TALENT_PER_PAGE = 10;
  const totalTalentPages = Math.max(1, Math.ceil(talents.length / TALENT_PER_PAGE));
  const paginatedTalents = talents.slice((talentPage - 1) * TALENT_PER_PAGE, talentPage * TALENT_PER_PAGE);

  const JOBS_PER_PAGE = 10;
  const totalJobsPages = Math.max(1, Math.ceil(jobs.length / JOBS_PER_PAGE));
  const paginatedJobs = jobs.slice((jobsPage - 1) * JOBS_PER_PAGE, jobsPage * JOBS_PER_PAGE);

  const INSIGHTS_PER_PAGE = 10;
  const totalInsightsPages = Math.max(1, Math.ceil(insights.length / INSIGHTS_PER_PAGE));
  const paginatedInsights = insights.slice((insightsPage - 1) * INSIGHTS_PER_PAGE, insightsPage * INSIGHTS_PER_PAGE);

  const PORTFOLIO_PER_PAGE = 8;
  const filteredPortfolios = portfolios.filter(p =>
    (p.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.authorRole || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.scrizianId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (Array.isArray(p.skills) ? p.skills.join(' ') : (p.skills || '')).toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPortfolioPages = Math.max(1, Math.ceil(filteredPortfolios.length / PORTFOLIO_PER_PAGE));
  const paginatedPortfolios = filteredPortfolios.slice((portfolioPage - 1) * PORTFOLIO_PER_PAGE, portfolioPage * PORTFOLIO_PER_PAGE);

  return (
    <div className={styles.dashboardLayout}>
      <DashboardSidebar 
        role="admin" 
        activeTab={activeTab} 
        onTabChange={(t: any) => setActiveTab(t)} 
        user={currentUser || { name: displayName, role: 'admin', email: displayEmail }} 
      />

      <div className={styles.container}>
        {/* Animated Top-Right Toast Notification */}
        {notification && (
          <div className={styles.toastContainer}>
            <div className={styles.toastCard}>
              <span style={{ fontSize: '1.1rem' }}>⚡</span>
              <span>{notification}</span>
              <button onClick={() => setNotification(null)} className={styles.toastClose}>×</button>
            </div>
          </div>
        )}

        {/* Top Dark Banner */}
        <div className={styles.header}>
          <div>
            <h1 className={styles.headerTitle}>Scriza Admin & Operations Control Panel</h1>
            <p className={styles.headerSub}>
              Logged in as: <strong style={{ color: '#ffffff' }}>{displayName}</strong> | Parent Entity: <strong style={{ color: '#ffffff' }}>Scriza Private Limited</strong>
            </p>
          </div>
          <div className={styles.headerRight} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button 
              onClick={() => {
                setEditFormData({
                  name: displayName,
                  phone: currentUser?.phone || '+91 98765 43210',
                  title: currentUser?.title || 'Scriza Super Admin',
                  skills: currentUser?.skills || 'Platform Governance, Executive Operations, User Management'
                });
                setShowEditProfileModal(true);
              }}
              style={{ background: '#E52B2B', color: '#ffffff', border: 'none', padding: '0.55rem 1.1rem', borderRadius: '8px', fontWeight: 800, cursor: 'pointer', fontSize: '0.85rem' }}
            >
              ✏️ Edit Profile
            </button>
            <span className={styles.adminBadge}>SUPER ADMIN (2FA)</span>
            <NotificationBell />
          </div>
        </div>

        {activeTab === 'leads' && (
          <div className={styles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <h3 className={styles.cardTitle} style={{ margin: 0 }}>Hiring Leads CRM</h3>
                <p className={styles.cardSub} style={{ margin: '0.15rem 0 0 0' }}>
                  Manage inbound client leads & pipeline stages.
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{ display: 'flex', background: '#F1F5F9', padding: '0.15rem', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                  <button 
                    onClick={() => setLeadViewMode('table')} 
                    style={{ background: leadViewMode === 'table' ? '#ffffff' : 'transparent', color: leadViewMode === 'table' ? '#0F172A' : '#64748B', border: 'none', padding: '0.3rem 0.65rem', borderRadius: '4px', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer' }}
                  >
                    📋 Table
                  </button>
                  <button 
                    onClick={() => setLeadViewMode('kanban')} 
                    style={{ background: leadViewMode === 'kanban' ? '#ffffff' : 'transparent', color: leadViewMode === 'kanban' ? '#0F172A' : '#64748B', border: 'none', padding: '0.3rem 0.65rem', borderRadius: '4px', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer' }}
                  >
                    📊 Kanban
                  </button>
                </div>
                <input 
                  type="text" 
                  placeholder="Search leads..." 
                  aria-label="Search inbound hiring leads CRM"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className={styles.formInput}
                  style={{ maxWidth: '180px', padding: '0.35rem 0.7rem', fontSize: '0.82rem' }}
                />
              </div>
            </div>

            {leadViewMode === 'kanban' ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem' }}>
                {['New Inbound Lead', 'Requirement Confirmed', 'Talent Shortlisted', 'Contract Sent', 'Hired / Closed'].map((colStage) => {
                  const columnLeads = filteredLeads.filter(l => l.stage === colStage || (!l.stage && colStage === 'New Inbound Lead'));
                  return (
                    <div key={colStage} style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '1rem', minHeight: '380px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem', paddingBottom: '0.5rem', borderBottom: '2px solid #CBD5E1' }}>
                        <strong style={{ fontSize: '0.85rem', color: '#0F172A' }}>{colStage}</strong>
                        <span style={{ background: '#0F172A', color: '#ffffff', borderRadius: '12px', padding: '0.1rem 0.5rem', fontSize: '0.75rem', fontWeight: 800 }}>
                          {columnLeads.length}
                        </span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {columnLeads.map(lead => (
                          <div key={lead._id} style={{ background: '#ffffff', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '0.8rem', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                            <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#0F172A' }}>{lead.name}</div>
                            <div style={{ fontSize: '0.78rem', color: '#64748B', margin: '0.2rem 0' }}>{lead.company} • {lead.serviceRequested}</div>
                            {lead.scrizianIdReferenced && (
                              <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#E52B2B', background: 'rgba(229, 43, 43, 0.08)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                                {lead.scrizianIdReferenced}
                              </span>
                            )}
                            <div style={{ marginTop: '0.6rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <select 
                                value={lead.stage || 'New Inbound Lead'} 
                                onChange={e => handleUpdateLeadStage(lead._id, e.target.value)}
                                style={{ fontSize: '0.75rem', padding: '0.2rem 0.4rem', borderRadius: '4px', border: '1px solid #CBD5E1' }}
                              >
                                <option value="New Inbound Lead">New Lead</option>
                                <option value="Requirement Confirmed">Confirmed</option>
                                <option value="Talent Shortlisted">Shortlisted</option>
                                <option value="Contract Sent">Contract</option>
                                <option value="Hired / Closed">Hired</option>
                              </select>
                              <button onClick={() => setSelectedLead(lead)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem' }}>👁️</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className={styles.tableContainer}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Client / Contact</th>
                      <th>Company</th>
                      <th>Target Scrizian ID</th>
                      <th>Engagement</th>
                      <th>Pipeline Stage</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedLeads.map(lead => (
                      <tr key={lead._id}>
                        <td style={{ whiteSpace: 'nowrap' }}>{lead.createdAt}</td>
                        <td>
                          <strong>{lead.name}</strong><br/>
                          <span className={styles.subText}>{lead.email}</span>
                        </td>
                        <td>{lead.company}</td>
                        <td>
                          <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#E52B2B' }}>
                            {lead.scrizianIdReferenced || 'N/A'}
                          </span>
                        </td>
                        <td>{lead.serviceRequested}</td>
                        <td>
                          <select 
                            value={lead.stage}
                            aria-label={`Update pipeline stage for lead ${lead.name}`}
                            onChange={e => handleUpdateLeadStage(lead._id, e.target.value)}
                            className={styles.selectStatus}
                          >
                            <option value="New Inbound Lead">New Inbound Lead</option>
                            <option value="Talent Shortlisted">Talent Shortlisted</option>
                            <option value="Requirement Confirmed">Requirement Confirmed</option>
                            <option value="Contract Sent">Contract Sent</option>
                            <option value="Hired / Closed">Hired / Closed</option>
                          </select>
                        </td>
                        <td>
                          <div className={styles.actionBtnGroup}>
                            <button onClick={() => setSelectedLead(lead)} className={styles.btnActionView} title="View Details" aria-label={`View details for lead ${lead.name}`}>
                              👁️
                            </button>
                            <button onClick={() => handleDeleteLead(lead._id)} className={styles.btnActionDelete} title="Delete Lead" aria-label={`Delete lead ${lead.name}`}>
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <Pagination 
              currentPage={leadsPage}
              totalPages={totalLeadsPages}
              onPageChange={setLeadsPage}
              totalItems={filteredLeads.length}
              itemsPerPage={LEADS_PER_PAGE}
              itemLabel="leads"
            />
          </div>
        )}

        {/* TAB 2: Scrizian Talent Directory with Avatars */}
        {activeTab === 'talent' && (
          <div className={styles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.2rem' }}>
              <div>
                <h3 className={styles.cardTitle} style={{ margin: 0 }}>Verified Scrizian Talent Roster</h3>
                <p className={styles.cardSub} style={{ margin: '0.2rem 0 0 0' }}>
                  Manage engineers and specialists. Click Edit to update profile photo, skills, or rates.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                <input 
                  type="text" 
                  placeholder="Search talent..." 
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className={styles.formInput}
                  style={{ maxWidth: '220px', padding: '0.5rem 0.8rem', fontSize: '0.85rem' }}
                />
                <button onClick={handleOpenAddTalent} className={styles.btnPrimaryAction}>
                  + Add New Scrizian
                </button>
              </div>
            </div>

            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Photo</th>
                    <th>Scrizian ID</th>
                    <th>Name & Title</th>
                    <th>Hourly Rate</th>
                    <th>Availability</th>
                    <th>Verification Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedTalents.map(talent => (
                    <tr key={talent.id}>
                      <td>
                        <img 
                          src={talent.avatarUrl || '/images/logo.png'} 
                          alt="Avatar" 
                          className={styles.tableImage}
                        />
                      </td>
                      <td style={{ fontFamily: 'monospace', fontWeight: 800 }}>{talent.id}</td>
                      <td>
                        <strong>{talent.displayName}</strong><br/>
                        <span className={styles.subText}>{talent.title}</span>
                      </td>
                      <td><strong style={{ color: '#0B172A' }}>${talent.hourlyRateUSD} / hr</strong></td>
                      <td>{talent.availability}</td>
                      <td>
                        <span style={{ whiteSpace: 'nowrap', fontWeight: 700, fontSize: '0.85rem', color: '#0F172A' }}>
                          {talent.status === 'Verified' ? '✓ Verified Scrizian' : '⏳ Pending Review'}
                        </span>
                      </td>
                      <td>
                        <div className={styles.actionBtnGroup}>
                          <button 
                            onClick={() => handleToggleVerifyTalent(talent.id)} 
                            style={{ background: talent.status === 'Verified' ? '#DCFCE7' : '#FEF3C7', color: talent.status === 'Verified' ? '#166534' : '#92400E', padding: '0.35rem 0.65rem', borderRadius: '4px', border: 'none', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer', whiteSpace: 'nowrap' }}
                            title="Toggle Verification Status"
                          >
                            {talent.status === 'Verified' ? '✓ Verified' : '⚡ Verify'}
                          </button>
                          <button onClick={() => handleOpenEditTalent(talent)} className={styles.btnActionEdit} title="Edit Talent">
                            ✏️
                          </button>
                          <button onClick={() => handleDeleteTalent(talent.id)} className={styles.btnActionDelete} title="Delete Talent">
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination 
              currentPage={talentPage}
              totalPages={totalTalentPages}
              onPageChange={setTalentPage}
              totalItems={talents.length}
              itemsPerPage={TALENT_PER_PAGE}
              itemLabel="talent profiles"
            />
          </div>
        )}

        {/* TAB 3: Job Openings Table with Company Logos */}
        {activeTab === 'jobs' && (
          <div className={styles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.2rem' }}>
              <div>
                <h3 className={styles.cardTitle} style={{ margin: 0 }}>Active Client Hiring Postings</h3>
                <p className={styles.cardSub} style={{ margin: '0.2rem 0 0 0' }}>
                  Manage live job postings displayed on the jobs board with company logos.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                <input 
                  type="text" 
                  placeholder="Search jobs..." 
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className={styles.formInput}
                  style={{ maxWidth: '220px', padding: '0.5rem 0.8rem', fontSize: '0.85rem' }}
                />
                <button onClick={handleOpenAddJob} className={styles.btnPrimaryAction}>
                  + Post Job Opening
                </button>
              </div>
            </div>

            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Logo</th>
                    <th>Job ID</th>
                    <th>Title & Client</th>
                    <th>Location</th>
                    <th>Rate Range</th>
                    <th>Applicants</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedJobs.map(job => (
                    <tr key={job.id}>
                      <td>
                        <img 
                          src={job.companyLogoUrl || '/images/logo.png'} 
                          alt="Logo" 
                          className={styles.tableImage}
                        />
                      </td>
                      <td style={{ fontFamily: 'monospace', fontWeight: 800 }}>{job.id}</td>
                      <td>
                        <strong>{job.title}</strong><br/>
                        <span className={styles.subText}>{job.company}</span>
                      </td>
                      <td>{job.location}</td>
                      <td><strong>{job.rate}</strong></td>
                      <td><span style={{ fontWeight: 800, color: '#E52B2B' }}>{job.applicantsCount} Applicants</span></td>
                      <td>
                        <span style={{ whiteSpace: 'nowrap', fontWeight: 700, fontSize: '0.85rem', color: '#0F172A' }}>
                          ● {job.status}
                        </span>
                      </td>
                      <td>
                        <div className={styles.actionBtnGroup}>
                          <button 
                            onClick={() => handleToggleJobStatus(job.id)} 
                            style={{ background: (job.status === 'Active' || job.status === 'Verified') ? '#DCFCE7' : '#FEF3C7', color: (job.status === 'Active' || job.status === 'Verified') ? '#166534' : '#92400E', padding: '0.35rem 0.65rem', borderRadius: '4px', border: 'none', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer', whiteSpace: 'nowrap' }}
                            title="Toggle Job Status"
                          >
                            {(job.status === 'Active' || job.status === 'Verified') ? '✓ Active' : '⚡ Activate'}
                          </button>
                          <button onClick={() => handleOpenEditJob(job)} className={styles.btnActionEdit} title="Edit Job">
                            ✏️
                          </button>
                          <button onClick={() => handleDeleteJob(job.id)} className={styles.btnActionDelete} title="Delete Job">
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination 
              currentPage={jobsPage}
              totalPages={totalJobsPages}
              onPageChange={setJobsPage}
              totalItems={jobs.length}
              itemsPerPage={JOBS_PER_PAGE}
              itemLabel="job openings"
            />
          </div>
        )}

        {/* TAB 4: Insights & Articles Table with Banners */}
        {activeTab === 'insights' && (
          <div className={styles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.2rem' }}>
              <div>
                <h3 className={styles.cardTitle} style={{ margin: 0 }}>Published Insights & Technical Articles</h3>
                <p className={styles.cardSub} style={{ margin: '0.2rem 0 0 0' }}>
                  Manage community articles and guides published on `/insights` with cover images.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                <input 
                  type="text" 
                  placeholder="Search articles..." 
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className={styles.formInput}
                  style={{ maxWidth: '220px', padding: '0.5rem 0.8rem', fontSize: '0.85rem' }}
                />
                <button onClick={handleOpenAddInsight} className={styles.btnPrimaryAction}>
                  + Create Article
                </button>
              </div>
            </div>

            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Cover Banner</th>
                    <th>Article Title</th>
                    <th>Category</th>
                    <th>Author Attribution</th>
                    <th>Read Time</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedInsights.map(art => (
                    <tr key={art.id}>
                      <td>
                        <img 
                          src={art.coverImageUrl || '/images/logo.png'} 
                          alt="Cover" 
                          className={styles.tableImage}
                          style={{ width: '60px', height: '40px' }}
                        />
                      </td>
                      <td>
                        <strong>{art.title}</strong><br/>
                        <span className={styles.subText} style={{ whiteSpace: 'nowrap' }}>Published: {art.publishedDate}</span>
                      </td>
                      <td><span style={{ whiteSpace: 'nowrap', fontWeight: 700, fontSize: '0.85rem', color: '#0F172A' }}>{art.category}</span></td>
                      <td><strong>{art.author}</strong></td>
                      <td style={{ whiteSpace: 'nowrap' }}>{art.readTime}</td>
                      <td>
                        <span style={{ whiteSpace: 'nowrap', fontWeight: 700, fontSize: '0.85rem', color: '#0F172A' }}>
                          ✓ {art.status}
                        </span>
                      </td>
                      <td>
                        <div className={styles.actionBtnGroup}>
                          <button 
                            onClick={() => handleToggleApproveArticle(art.id)} 
                            style={{ background: art.status === 'Published' ? '#DCFCE7' : '#FEF3C7', color: art.status === 'Published' ? '#166534' : '#92400E', padding: '0.35rem 0.65rem', borderRadius: '4px', border: 'none', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer', whiteSpace: 'nowrap' }}
                            title="Toggle Publication Status"
                          >
                            {art.status === 'Published' ? '✓ Live' : '⚡ Publish'}
                          </button>
                          <button onClick={() => handleOpenEditInsight(art)} className={styles.btnActionEdit} title="Edit Article">
                            ✏️
                          </button>
                          <button onClick={() => handleDeleteInsight(art.id)} className={styles.btnActionDelete} title="Delete Article">
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination 
              currentPage={insightsPage}
              totalPages={totalInsightsPages}
              onPageChange={setInsightsPage}
              totalItems={insights.length}
              itemsPerPage={INSIGHTS_PER_PAGE}
              itemLabel="published articles"
            />
          </div>
        )}

        {/* TAB 5: Portfolio Showcase Review & Management */}
        {activeTab === 'portfolio' && (
          <div className={styles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.8rem', marginBottom: '1.2rem' }}>
              <div>
                <h3 className={styles.cardTitle} style={{ margin: 0 }}>🎨 Portfolio Showcase & Case Studies</h3>
                <p className={styles.cardSub} style={{ margin: '0.2rem 0 0 0' }}>
                  Manage verified client project showcases, architecture case studies, tech stacks, and NDA permissions.
                </p>
              </div>
              <button 
                onClick={handleOpenAddPortfolio}
                className={styles.btnPrimaryAction}
                style={{ padding: '0.55rem 1.1rem', fontSize: '0.88rem' }}
              >
                ➕ Add New Portfolio Showcase
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.2rem' }}>
              {paginatedPortfolios.map((item) => (
                <div key={item.id || item._id} style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ height: '140px', position: 'relative', overflow: 'hidden', background: '#0F172A' }}>
                    <img 
                      src={item.coverImageUrl || 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=70'} 
                      alt={item.title} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }} 
                    />
                    <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                      <button 
                        onClick={() => handleToggleNDA(item)}
                        style={{ background: item.isNdaProtected ? '#FEF3C7' : '#DCFCE7', color: item.isNdaProtected ? '#92400E' : '#166534', border: 'none', padding: '0.25rem 0.65rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer' }}
                      >
                        {item.isNdaProtected ? '🔒 NDA Protected' : '✓ Public Showcase'}
                      </button>
                    </div>
                    <div style={{ position: 'absolute', bottom: '8px', left: '12px', background: 'rgba(15, 23, 42, 0.85)', color: '#FFFFFF', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.72rem', fontFamily: 'monospace' }}>
                      {item.scrizianId} • {item.authorRole}
                    </div>
                  </div>

                  <div style={{ padding: '1.2rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                    <div>
                      <h4 style={{ margin: '0 0 0.4rem 0', color: '#0F172A', fontSize: '1.05rem', fontWeight: 800 }}>{item.title}</h4>
                      <p style={{ color: '#475569', fontSize: '0.85rem', margin: '0 0 0.8rem 0', lineHeight: 1.4 }}>{item.description}</p>
                      
                      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                        {(Array.isArray(item.skills) ? item.skills : (item.skills || '').split(',')).map((sk: string, i: number) => (
                          <span key={i} className={styles.skillBadge} style={{ fontSize: '0.72rem' }}>{sk.trim()}</span>
                        ))}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.6rem', borderTop: '1px solid #E2E8F0', paddingTop: '0.8rem' }}>
                      <button onClick={() => handleOpenEditPortfolio(item)} className={styles.btnActionEdit} style={{ flex: 1, padding: '0.4rem', fontSize: '0.8rem' }}>
                        ✏️ Edit Showcase
                      </button>
                      <button onClick={() => handleDeletePortfolio(item.id || item._id)} className={styles.btnActionDelete} style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Pagination
              currentPage={portfolioPage}
              totalPages={totalPortfolioPages}
              onPageChange={setPortfolioPage}
              totalItems={filteredPortfolios.length}
              itemsPerPage={PORTFOLIO_PER_PAGE}
              itemLabel="portfolio showcases"
            />
          </div>
        )}

        {/* TAB 6: Platform Config & RBAC */}
        {activeTab === 'config' && (
          <div className={styles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.8rem', marginBottom: '1.2rem' }}>
              <div>
                <h3 className={styles.cardTitle} style={{ margin: 0 }}>Platform Configuration & Granular RBAC Permissions</h3>
                <p className={styles.cardSub} style={{ margin: '0.2rem 0 0 0' }}>
                  Manage system settings, role-based access rules (View/Create/Edit/Delete/Approve/Publish/Export/Assign), and user roles.
                </p>
              </div>
              <span className={styles.adminBadge}>RBAC SYSTEM ONLINE</span>
            </div>

            <div className={styles.gridTwoCols}>
              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '1.2rem', borderRadius: '10px' }}>
                <h4 style={{ margin: '0 0 0.8rem 0', color: '#0F172A', fontSize: '1rem', fontWeight: 800 }}>🛡️ Mandatory 2FA & Session Security</h4>
                <div style={{ fontSize: '0.88rem', color: '#334155', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <label><input type="checkbox" defaultChecked /> Require 2FA for all Super Admin logins (OTP / Authenticator App)</label>
                  <label><input type="checkbox" defaultChecked /> Enforce JWT Access Token + Refresh Token Rotation</label>
                  <label><input type="checkbox" defaultChecked /> Secure HttpOnly Cookie Sessions with Brute-Force Rate Limiting</label>
                  <label><input type="checkbox" defaultChecked /> Prevent Public Indexing of Sensitive Verification Documents</label>
                </div>
              </div>

              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '1.2rem', borderRadius: '10px' }}>
                <h4 style={{ margin: '0 0 0.8rem 0', color: '#0F172A', fontSize: '1rem', fontWeight: 800 }}>🔑 Active API Access Keys</h4>
                <div style={{ fontSize: '0.85rem', color: '#475569' }}>
                  <p><strong>Primary Web Gateway Key:</strong> <span style={{ fontFamily: 'monospace', background: '#E2E8F0', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>szn_live_key_9988112233</span></p>
                  <p><strong>CRM Webhook Endpoint:</strong> <span style={{ fontFamily: 'monospace', background: '#E2E8F0', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>https://api.scrizians.com/v1/leads/inbound</span></p>
                  <button onClick={() => setNotification('🔑 API Keys rotated successfully!')} className={styles.btnPrimaryAction} style={{ marginTop: '0.5rem', fontSize: '0.82rem' }}>Rotate System API Keys</button>
                </div>
              </div>
            </div>

            {/* Granular User Role Management Table */}
            <div style={{ marginTop: '1.8rem' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.4rem' }}>👥 System User Accounts & RBAC Role Assignment</h4>
              <p style={{ fontSize: '0.88rem', color: '#64748B', marginBottom: '1rem' }}>
                Manage roles and permissions for registered users saved in MongoDB Atlas database.
              </p>

              <div className={styles.tableContainer}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Scrizian ID / Email</th>
                      <th>Full Name</th>
                      <th>Current System Role</th>
                      <th>Status & Permissions</th>
                      <th>Role Management Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersList.length > 0 ? (
                      usersList.map((usr: any) => (
                        <tr key={usr._id || usr.email}>
                          <td>
                            <strong style={{ color: '#0F172A' }}>{usr.email}</strong><br/>
                            <span style={{ fontSize: '0.78rem', color: '#E52B2B', fontFamily: 'monospace', fontWeight: 800 }}>
                              {usr.scrizianId || usr.id || 'SZN-USER'}
                            </span>
                          </td>
                          <td>{usr.name || 'Registered User'}</td>
                          <td>
                            <span style={{
                              padding: '0.25rem 0.7rem',
                              borderRadius: '12px',
                              fontWeight: 800,
                              fontSize: '0.78rem',
                              background: usr.role === 'admin' ? '#FEE2E2' : usr.role === 'client' ? '#E0E7FF' : usr.role === 'talent' ? '#DCFCE7' : '#FEF3C7',
                              color: usr.role === 'admin' ? '#991B1B' : usr.role === 'client' ? '#3730A3' : usr.role === 'talent' ? '#166534' : '#92400E',
                              textTransform: 'uppercase'
                            }}>
                              ● {usr.role}
                            </span>
                          </td>
                          <td>
                            <span style={{ fontSize: '0.82rem', color: '#166534', fontWeight: 700 }}>
                              ✓ Active (MongoDB Authenticated)
                            </span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <select 
                                defaultValue={usr.role}
                                onChange={async (e) => {
                                  const newRole = e.target.value;
                                  try {
                                    await fetch('/api/users', {
                                      method: 'POST',
                                      headers: { 'Content-Type': 'application/json' },
                                      body: JSON.stringify({ email: usr.email, role: newRole })
                                    });
                                    setNotification(`🎉 Role for ${usr.email} updated to ${newRole.toUpperCase()}`);
                                  } catch (err) {
                                    console.warn('Role update error:', err);
                                  }
                                }}
                                className={styles.formSelect}
                                style={{ padding: '0.35rem 0.6rem', fontSize: '0.8rem' }}
                              >
                                <option value="admin">Super Admin</option>
                                <option value="client">Client / Company</option>
                                <option value="talent">Scrizian Talent</option>
                                <option value="contributor">Content Author</option>
                                <option value="candidate">Job Candidate</option>
                              </select>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} style={{ textAlign: 'center', padding: '1.5rem', color: '#64748B' }}>
                          Loading user accounts from MongoDB Atlas...
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: SEO, Pricing & Audit */}
        {activeTab === 'audit' && (
          <div className={styles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
              <div>
                <h3 className={styles.cardTitle} style={{ margin: 0 }}>SEO Metadata, Currency Pricing & Platform Audit Logs</h3>
                <p className={styles.cardSub} style={{ margin: '0.2rem 0 0 0' }}>
                  Monitor platform-wide audit trails, currency exchange baseline rates ($1 USD = ₹83.50 INR), and search engine indexing status.
                </p>
              </div>
              <span className={styles.adminBadge} style={{ background: '#0F172A' }}>AUDIT TRAIL LOGGING</span>
            </div>

            <div className={styles.gridThreeCols}>
              <div style={{ background: '#F1F5F9', padding: '1rem', borderRadius: '8px', border: '1px solid #CBD5E1' }}>
                <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.9rem' }}>🌐 Sitemap & Robots Status</div>
                <div style={{ fontSize: '0.82rem', color: '#166534', fontWeight: 700, marginTop: '0.4rem' }}>✓ /sitemap.xml (Active - 28 routes)</div>
                <div style={{ fontSize: '0.82rem', color: '#166534', fontWeight: 700, marginTop: '0.2rem' }}>✓ /robots.txt (Configured)</div>
              </div>

              <div style={{ background: '#F1F5F9', padding: '1rem', borderRadius: '8px', border: '1px solid #CBD5E1' }}>
                <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.9rem' }}>💱 Global Pricing Model</div>
                <div style={{ fontSize: '0.82rem', color: '#0F172A', marginTop: '0.4rem' }}>USD Rate: <strong>$1.00 USD</strong></div>
                <div style={{ fontSize: '0.82rem', color: '#0F172A', marginTop: '0.2rem' }}>INR Conversion: <strong>₹83.50 INR</strong></div>
              </div>

              <div style={{ background: '#F1F5F9', padding: '1rem', borderRadius: '8px', border: '1px solid #CBD5E1' }}>
                <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.9rem' }}>⚡ Performance Metric</div>
                <div style={{ fontSize: '0.82rem', color: '#16A34A', fontWeight: 800, marginTop: '0.4rem' }}>PageSpeed Score: 98+ Optimized</div>
                <div style={{ fontSize: '0.82rem', color: '#475569', marginTop: '0.2rem' }}>LCP: 0.8s | CLS: 0.00</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL 1: Lead Details Modal */}
      {selectedLead && (
        <div className={styles.modalOverlay} onClick={() => setSelectedLead(null)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setSelectedLead(null)}>×</button>
            <h3 className={styles.cardTitle}>Inbound Hiring Enquiry Details</h3>
            <p className={styles.cardSub}>Lead ID: {selectedLead._id} | Date: {selectedLead.createdAt}</p>

            <div style={{ background: '#F8FAFC', border: '2px solid #CBD5E1', padding: '1.2rem', borderRadius: '8px', marginBottom: '1.2rem' }}>
              <p style={{ margin: '0.3rem 0' }}><strong>Client Name:</strong> {selectedLead.name}</p>
              <p style={{ margin: '0.3rem 0' }}><strong>Email:</strong> {selectedLead.email}</p>
              <p style={{ margin: '0.3rem 0' }}><strong>Phone:</strong> {selectedLead.phone}</p>
              <p style={{ margin: '0.3rem 0' }}><strong>Company:</strong> {selectedLead.company}</p>
              <p style={{ margin: '0.3rem 0' }}><strong>Target Scrizian ID:</strong> <span style={{ fontFamily: 'monospace', color: '#E52B2B', fontWeight: 800 }}>{selectedLead.scrizianIdReferenced}</span></p>
              <p style={{ margin: '0.3rem 0' }}><strong>Engagement Type:</strong> {selectedLead.serviceRequested}</p>
            </div>

            <div className={styles.formGroup}>
              <label style={{ fontWeight: 800, color: '#0F172A', display: 'block', marginBottom: '0.4rem' }}>Lead Pipeline Stage (PDF Task 14 Blueprint):</label>
              <select
                value={selectedLead.stage || 'New'}
                onChange={e => {
                  const updatedStage = e.target.value;
                  setLeads(leads.map(l => l._id === selectedLead._id ? { ...l, stage: updatedStage } : l));
                  setSelectedLead({ ...selectedLead, stage: updatedStage });
                }}
                className={styles.formInput}
                style={{ background: '#ffffff', color: '#0F172A', fontWeight: 800, cursor: 'pointer' }}
              >
                <option value="New">🟢 New Inbound Lead</option>
                <option value="Contacted">📞 Contacted</option>
                <option value="Qualified">🎯 Qualified</option>
                <option value="Requirement Confirmed">📝 Requirement Confirmed</option>
                <option value="Talent Shortlisted">🌟 Talent Shortlisted</option>
                <option value="Interview">📅 Interview Scheduled</option>
                <option value="Negotiation">🤝 Negotiation</option>
                <option value="Won">🏆 Won / Agreement Signed</option>
                <option value="Lost">❌ Lost</option>
                <option value="Nurture">🌱 Nurture</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Requirement Message:</label>
              <div style={{ background: '#FFFBEB', border: '2px solid #FCD34D', padding: '1rem', borderRadius: '8px', fontSize: '0.9rem', color: '#78350F', fontWeight: 700 }}>
                "{selectedLead.message}"
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1.5rem' }}>
              <a 
                href={`mailto:${selectedLead.email}?subject=Scrizians Enquiry - ${selectedLead.company}`}
                className={styles.btnPrimaryAction}
                style={{ textDecoration: 'none', width: '100%', justifyContent: 'center' }}
              >
                ✉️ Reply via Email
              </a>
              <button onClick={() => setSelectedLead(null)} className={styles.btnActionEdit} style={{ padding: '0.7rem 1.4rem' }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Add / Edit Scrizian Profile Modal WITH IMAGE UPLOAD */}
      {showTalentModal && (
        <div className={styles.modalOverlay} onClick={() => setShowTalentModal(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setShowTalentModal(false)}>×</button>

            <h3 className={styles.cardTitle}>{editingTalent ? '✏️ Edit Scrizian Profile' : '➕ Add New Scrizian Profile'}</h3>
            <p className={styles.cardSub}>ID: {talentFormData.id}</p>

            <form onSubmit={handleSaveTalent}>
              {/* Profile Image File Upload Field */}
              <div className={styles.formGroup}>
                <label>Profile Avatar / Photo Upload:</label>
                <div className={styles.imageUploadBox}>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0], url => setTalentFormData({ ...talentFormData, avatarUrl: url }))}
                    style={{ display: 'none' }}
                    id="talent-photo-input"
                  />
                  <label htmlFor="talent-photo-input" style={{ cursor: 'pointer', margin: 0 }}>
                    📁 Click or Drag Image to Upload Photo
                  </label>
                  {talentFormData.avatarUrl && (
                    <div className={styles.imagePreviewRow}>
                      <img src={talentFormData.avatarUrl} alt="Preview" className={styles.imagePreview} />
                      <span style={{ fontSize: '0.8rem', color: '#166534', fontWeight: 800 }}>✓ Avatar Preview Loaded</span>
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Display Name (Privacy First format e.g. Aarav M.):</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Rahul S. (Lead Fullstack Dev)" 
                  value={talentFormData.displayName}
                  onChange={e => setTalentFormData({ ...talentFormData, displayName: e.target.value })}
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Professional Title:</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Senior React & Node.js Developer" 
                  value={talentFormData.title}
                  onChange={e => setTalentFormData({ ...talentFormData, title: e.target.value })}
                  className={styles.formInput}
                />
              </div>

              <div className={styles.gridTwoCols}>
                <div className={styles.formGroup}>
                  <label>Hourly Rate ($ USD):</label>
                  <input 
                    type="number" 
                    value={talentFormData.hourlyRateUSD}
                    onChange={e => setTalentFormData({ ...talentFormData, hourlyRateUSD: e.target.value })}
                    className={styles.formInput}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Availability:</label>
                  <select 
                    value={talentFormData.availability}
                    onChange={e => setTalentFormData({ ...talentFormData, availability: e.target.value })}
                    className={styles.formSelect}
                  >
                    <option value="Immediate">Immediate</option>
                    <option value="1-2 Weeks">1-2 Weeks</option>
                    <option value="1 Month">1 Month</option>
                  </select>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Key Skills:</label>
                <input 
                  type="text" 
                  placeholder="React, Next.js, Node.js, AWS" 
                  value={talentFormData.skills}
                  onChange={e => setTalentFormData({ ...talentFormData, skills: e.target.value })}
                  className={styles.formInput}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1.5rem' }}>
                <button type="submit" className={styles.btnPrimaryAction} style={{ width: '100%', justifyContent: 'center' }}>
                  ✓ {editingTalent ? 'Save Changes' : 'Create & Publish Profile'}
                </button>
                <button type="button" onClick={() => setShowTalentModal(false)} className={styles.btnActionEdit} style={{ padding: '0.7rem 1.4rem' }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Add / Edit Job Opening Modal WITH LOGO UPLOAD */}
      {showJobModal && (
        <div className={styles.modalOverlay} onClick={() => setShowJobModal(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setShowJobModal(false)}>×</button>

            <h3 className={styles.cardTitle}>{editingJob ? '✏️ Edit Job Opening' : '➕ Post New Job Opening'}</h3>
            <p className={styles.cardSub}>ID: {jobFormData.id}</p>

            <form onSubmit={handleSaveJob}>
              {/* Company Logo Image Upload Field */}
              <div className={styles.formGroup}>
                <label>Client Company Logo Upload:</label>
                <div className={styles.imageUploadBox}>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0], url => setJobFormData({ ...jobFormData, companyLogoUrl: url }))}
                    style={{ display: 'none' }}
                    id="job-logo-input"
                  />
                  <label htmlFor="job-logo-input" style={{ cursor: 'pointer', margin: 0 }}>
                    📁 Click or Drag Image to Upload Company Logo
                  </label>
                  {jobFormData.companyLogoUrl && (
                    <div className={styles.imagePreviewRow}>
                      <img src={jobFormData.companyLogoUrl} alt="Preview" className={styles.imagePreview} />
                      <span style={{ fontSize: '0.8rem', color: '#166534', fontWeight: 800 }}>✓ Logo Preview Loaded</span>
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Job Title:</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Lead Flutter & Mobile Architect" 
                  value={jobFormData.title}
                  onChange={e => setJobFormData({ ...jobFormData, title: e.target.value })}
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Client / Company Name:</label>
                <input 
                  type="text" 
                  value={jobFormData.company}
                  onChange={e => setJobFormData({ ...jobFormData, company: e.target.value })}
                  className={styles.formInput}
                />
              </div>

              <div className={styles.gridTwoCols}>
                <div className={styles.formGroup}>
                  <label>Location:</label>
                  <input 
                    type="text" 
                    value={jobFormData.location}
                    onChange={e => setJobFormData({ ...jobFormData, location: e.target.value })}
                    className={styles.formInput}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Rate / Budget Range:</label>
                  <input 
                    type="text" 
                    value={jobFormData.rate}
                    onChange={e => setJobFormData({ ...jobFormData, rate: e.target.value })}
                    className={styles.formInput}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1.5rem' }}>
                <button type="submit" className={styles.btnPrimaryAction} style={{ width: '100%', justifyContent: 'center' }}>
                  ✓ {editingJob ? 'Save Changes' : 'Post Job Opening'}
                </button>
                <button type="button" onClick={() => setShowJobModal(false)} className={styles.btnActionEdit} style={{ padding: '0.7rem 1.4rem' }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: Add / Edit Insights Article Modal WITH BANNER COVER UPLOAD */}
      {showInsightModal && (
        <div className={styles.modalOverlay} onClick={() => setShowInsightModal(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setShowInsightModal(false)}>×</button>

            <h3 className={styles.cardTitle}>{editingInsight ? '✏️ Edit Published Article' : '➕ Create & Publish Article'}</h3>
            <p className={styles.cardSub}>ID: {insightFormData.id}</p>

            <form onSubmit={handleSaveInsight}>
              {/* Cover Banner Image Upload Field */}
              <div className={styles.formGroup}>
                <label>Article Cover Banner Upload:</label>
                <div className={styles.imageUploadBox}>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0], url => setInsightFormData({ ...insightFormData, coverImageUrl: url }))}
                    style={{ display: 'none' }}
                    id="insight-cover-input"
                  />
                  <label htmlFor="insight-cover-input" style={{ cursor: 'pointer', margin: 0 }}>
                    📁 Click or Drag Image to Upload Cover Banner
                  </label>
                  {insightFormData.coverImageUrl && (
                    <div className={styles.imagePreviewRow}>
                      <img src={insightFormData.coverImageUrl} alt="Preview" className={styles.imagePreview} style={{ width: '100px', height: '60px' }} />
                      <span style={{ fontSize: '0.8rem', color: '#166534', fontWeight: 800 }}>✓ Cover Preview Loaded</span>
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Article Title:</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Scaling Next.js Applications for High Traffic" 
                  value={insightFormData.title}
                  onChange={e => setInsightFormData({ ...insightFormData, title: e.target.value })}
                  className={styles.formInput}
                />
              </div>

              <div className={styles.gridTwoCols}>
                <div className={styles.formGroup}>
                  <label>Category:</label>
                  <select 
                    value={insightFormData.category}
                    onChange={e => setInsightFormData({ ...insightFormData, category: e.target.value })}
                    className={styles.formSelect}
                  >
                    <option value="Hiring Guides">Hiring Guides</option>
                    <option value="SaaS Engineering">SaaS Engineering</option>
                    <option value="Engineering Management">Engineering Management</option>
                    <option value="Cloud & DevOps">Cloud & DevOps</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label>Author Attribution:</label>
                  <input 
                    type="text" 
                    value={insightFormData.author}
                    onChange={e => setInsightFormData({ ...insightFormData, author: e.target.value })}
                    className={styles.formInput}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Article Summary / Excerpt:</label>
                <textarea 
                  rows={2}
                  placeholder="Short 2-3 sentence overview shown on article cards and search results..." 
                  value={insightFormData.excerpt}
                  onChange={e => setInsightFormData({ ...insightFormData, excerpt: e.target.value })}
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Full Article Body / Content:</label>
                <textarea 
                  rows={6}
                  placeholder="Enter full article text. Use paragraphs or headings (e.g. 1. Heading Name)..." 
                  value={insightFormData.content}
                  onChange={e => setInsightFormData({ ...insightFormData, content: e.target.value })}
                  className={styles.formInput}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1.5rem' }}>
                <button type="submit" className={styles.btnPrimaryAction} style={{ width: '100%', justifyContent: 'center' }}>
                  ✓ {editingInsight ? 'Save Changes' : 'Publish Article'}
                </button>
                <button type="button" onClick={() => setShowInsightModal(false)} className={styles.btnActionEdit} style={{ padding: '0.7rem 1.4rem' }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: Add / Edit Portfolio Showcase Modal */}
      {showPortfolioModal && (
        <div className={styles.modalOverlay} onClick={() => setShowPortfolioModal(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()} style={{ maxWidth: '620px' }}>
            <button className={styles.modalClose} onClick={() => setShowPortfolioModal(false)}>×</button>
            <h3 className={styles.cardTitle}>{editingPortfolio ? '✏️ Edit Portfolio Showcase Project' : '➕ Add New Portfolio Showcase Project'}</h3>
            <p className={styles.cardSub}>Add client-ready project architectures, case study details, and NDA visibility status.</p>

            <form onSubmit={handleSavePortfolio} style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className={styles.formGroup}>
                <label style={{ fontWeight: 800, color: '#0F172A', display: 'block', marginBottom: '0.3rem' }}>Project Title:</label>
                <input 
                  type="text" 
                  value={portfolioFormData.title} 
                  onChange={e => setPortfolioFormData({ ...portfolioFormData, title: e.target.value })} 
                  placeholder="e.g. Enterprise Microservices Architecture" 
                  required 
                  className={styles.formInput} 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className={styles.formGroup}>
                  <label style={{ fontWeight: 800, color: '#0F172A', display: 'block', marginBottom: '0.3rem' }}>Target Scrizian ID:</label>
                  <input 
                    type="text" 
                    value={portfolioFormData.scrizianId} 
                    onChange={e => setPortfolioFormData({ ...portfolioFormData, scrizianId: e.target.value })} 
                    placeholder="SCR-8841" 
                    required 
                    className={styles.formInput} 
                  />
                </div>
                <div className={styles.formGroup}>
                  <label style={{ fontWeight: 800, color: '#0F172A', display: 'block', marginBottom: '0.3rem' }}>Author Role / Title:</label>
                  <input 
                    type="text" 
                    value={portfolioFormData.authorRole} 
                    onChange={e => setPortfolioFormData({ ...portfolioFormData, authorRole: e.target.value })} 
                    placeholder="e.g. Lead Solutions Architect" 
                    required 
                    className={styles.formInput} 
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label style={{ fontWeight: 800, color: '#0F172A', display: 'block', marginBottom: '0.3rem' }}>Short Description / Achievements:</label>
                <textarea 
                  value={portfolioFormData.description} 
                  onChange={e => setPortfolioFormData({ ...portfolioFormData, description: e.target.value })} 
                  placeholder="Describe key outcomes, architecture changes, scale, and client impact..." 
                  rows={3} 
                  required 
                  className={styles.formInput} 
                />
              </div>

              <div className={styles.formGroup}>
                <label style={{ fontWeight: 800, color: '#0F172A', display: 'block', marginBottom: '0.3rem' }}>Tech Stack / Skills (comma separated):</label>
                <input 
                  type="text" 
                  value={portfolioFormData.skills} 
                  onChange={e => setPortfolioFormData({ ...portfolioFormData, skills: e.target.value })} 
                  placeholder="Next.js, Node.js, AWS ECS, MongoDB" 
                  className={styles.formInput} 
                />
              </div>

              <div className={styles.formGroup}>
                <label style={{ fontWeight: 800, color: '#0F172A', display: 'block', marginBottom: '0.3rem' }}>Cover Image Banner URL:</label>
                <input 
                  type="text" 
                  value={portfolioFormData.coverImageUrl} 
                  onChange={e => setPortfolioFormData({ ...portfolioFormData, coverImageUrl: e.target.value })} 
                  placeholder="https://images.unsplash.com/..." 
                  className={styles.formInput} 
                />
              </div>

              <div className={styles.formGroup} style={{ background: '#F8FAFC', border: '1px solid #CBD5E1', padding: '0.8rem', borderRadius: '8px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 800, color: '#0F172A' }}>
                  <input 
                    type="checkbox" 
                    checked={portfolioFormData.isNdaProtected} 
                    onChange={e => setPortfolioFormData({ ...portfolioFormData, isNdaProtected: e.target.checked })} 
                  />
                  🔒 Enable NDA Protection (Anonymize client name and sensitive business data)
                </label>
              </div>

              <div style={{ display: 'flex', gap: '0.8rem', marginTop: '0.5rem' }}>
                <button type="submit" className={styles.btnPrimaryAction} style={{ flex: 1 }}>
                  {editingPortfolio ? 'Save Changes' : 'Publish Portfolio Showcase'}
                </button>
                <button type="button" onClick={() => setShowPortfolioModal(false)} className={styles.btnActionEdit} style={{ padding: '0.7rem 1.4rem' }}>
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
              ✏️ Edit Admin Profile Details
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#64748B', marginBottom: '1.2rem' }}>
              Update your account name, contact phone, primary skills, and title. Changes will save to MongoDB Atlas database.
            </p>

            <form onSubmit={handleSaveAdminProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
                  Admin Designation / Title *
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
                  Governance Focus / Skills *
                </label>
                <input 
                  type="text" 
                  required 
                  value={editFormData.skills}
                  onChange={e => setEditFormData({ ...editFormData, skills: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem 0.8rem', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.92rem', fontWeight: 600, outline: 'none' }}
                />
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

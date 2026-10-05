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
  const [activeTab, setActiveTab] = useState<'leads' | 'talent' | 'jobs' | 'insights' | 'config' | 'audit'>('leads');
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

  // Modal Editing & Adding States
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  
  // Talent Modal Form
  const [showTalentModal, setShowTalentModal] = useState(false);
  const [editingTalent, setEditingTalent] = useState<any | null>(null);
  const [talentFormData, setTalentFormData] = useState({ 
    id: '', displayName: '', title: '', hourlyRateUSD: '35', availability: 'Immediate', skills: '', avatarUrl: '/images/logo.png', status: 'Verified' 
  });

  // Job Modal Form
  const [showJobModal, setShowJobModal] = useState(false);
  const [editingJob, setEditingJob] = useState<any | null>(null);
  const [jobFormData, setJobFormData] = useState({ 
    id: '', title: '', company: 'Scriza Client Partner', companyLogoUrl: '/images/logo.png', location: 'Remote (India / Global)', rate: '$30 - $40 / hr', status: 'Active' 
  });

  // Insight Modal Form
  const [showInsightModal, setShowInsightModal] = useState(false);
  const [editingInsight, setEditingInsight] = useState<any | null>(null);
  const [insightFormData, setInsightFormData] = useState({ 
    id: '', title: '', category: 'Hiring Guides', coverImageUrl: '/images/logo.png', readTime: '5 min read', author: 'Scrizians Editorial', status: 'Published' 
  });

  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem('scrizians_user');
    if (stored) {
      try {
        const u = JSON.parse(stored);
        setCurrentUser(u);
      } catch (e) {}
    }

    const refreshData = () => {
      setLeads(getStoredData('scrizians_leads_list', initialLeadsList));
      setTalents(getStoredData('scrizians_talent_list', initialTalentList));
      setJobs(getStoredData('scrizians_jobs_list', initialJobsList));
      setInsights(getStoredData('scrizians_insights_list', initialArticlesList));
    };

    refreshData();
    syncAllFromMongoDB();
    window.addEventListener('scrizians_storage_updated', refreshData);
    window.addEventListener('storage', refreshData);

    return () => {
      window.removeEventListener('scrizians_storage_updated', refreshData);
      window.removeEventListener('storage', refreshData);
    };
  }, []);

  const displayName = currentUser?.name || 'Scriza Super Admin';
  const displayEmail = currentUser?.email || 'admin@scrizians.com';

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
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

  // --- INSIGHTS / ARTICLES ACTIONS ---
  const handleOpenAddInsight = () => {
    setEditingInsight(null);
    setInsightFormData({ id: `art-${insights.length + 1}`, title: '', category: 'Hiring Guides', coverImageUrl: '/images/logo.png', readTime: '5 min read', author: 'Scrizians Editorial', status: 'Published' });
    setShowInsightModal(true);
  };

  const handleOpenEditInsight = (art: any) => {
    setEditingInsight(art);
    setInsightFormData({ id: art.id, title: art.title, category: art.category, coverImageUrl: art.coverImageUrl || '/images/logo.png', readTime: art.readTime, author: art.author, status: art.status });
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
            <span className={styles.adminBadge}>SUPER ADMIN (2FA)</span>
            <NotificationBell />
          </div>
        </div>

        {/* TAB 1: Hiring Leads CRM Table */}
        {activeTab === 'leads' && (
          <div className={styles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.2rem' }}>
              <div>
                <h3 className={styles.cardTitle} style={{ margin: 0 }}>Inbound Client Hiring Leads & CRM Pipeline</h3>
                <p className={styles.cardSub} style={{ margin: '0.2rem 0 0 0' }}>
                  All public CTAs route through Scriza Private Limited. Manage stages, edit details, or remove leads.
                </p>
              </div>
              <input 
                type="text" 
                placeholder="Search leads..." 
                aria-label="Search inbound hiring leads CRM"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className={styles.formInput}
                style={{ maxWidth: '240px', padding: '0.5rem 0.8rem', fontSize: '0.85rem' }}
              />
            </div>

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

        {/* TAB 5: Platform Config & RBAC */}
        {activeTab === 'config' && (
          <div className={styles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
              <div>
                <h3 className={styles.cardTitle} style={{ margin: 0 }}>Platform Configuration & Granular RBAC Permissions</h3>
                <p className={styles.cardSub} style={{ margin: '0.2rem 0 0 0' }}>
                  Manage system settings, role-based access rules (View/Create/Edit/Delete/Approve/Publish/Export/Assign), and security policies.
                </p>
              </div>
              <span className={styles.adminBadge}>RBAC SYSTEM ONLINE</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem', marginTop: '1rem' }}>
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
                  <button className={styles.btnPrimaryAction} style={{ marginTop: '0.5rem', fontSize: '0.82rem' }}>Rotate System API Keys</button>
                </div>
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
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
    </div>
  );
}

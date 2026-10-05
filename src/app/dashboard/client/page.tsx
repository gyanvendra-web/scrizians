'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DashboardSidebar } from '@/components/DashboardSidebar/DashboardSidebar';
import { LeadModal } from '@/components/LeadModal/LeadModal';
import { Pagination } from '@/components/Pagination/Pagination';
import { NotificationBell } from '@/components/NotificationBell/NotificationBell';
import styles from './DashboardClient.module.css';

export default function ClientDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'requirements' | 'shortlist' | 'interviews' | 'engagements' | 'invoices'>('requirements');
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [selectedScrizian, setSelectedScrizian] = useState<string | undefined>();
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    phone: '+1 (555) 234-5678',
    title: 'VP of Engineering',
    company: 'CloudScale Inc (USA)'
  });

  React.useEffect(() => {
    const stored = localStorage.getItem('scrizians_user');
    if (stored) {
      try {
        const u = JSON.parse(stored);
        setCurrentUser(u);
        setEditFormData({
          name: u.name || '',
          phone: u.phone || '+1 (555) 234-5678',
          title: u.title || 'VP of Engineering',
          company: u.company || u.organization || 'CloudScale Inc (USA)'
        });
      } catch (e) {}
    }
  }, []);

  const handleSaveClientProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedUser = {
        ...currentUser,
        name: editFormData.name,
        phone: editFormData.phone,
        title: editFormData.title,
        company: editFormData.company
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
          company: editFormData.company,
          role: 'client'
        })
      });

      setShowEditProfileModal(false);
      showToast('🎉 Client Profile updated successfully in MongoDB database!');
    } catch (err) {
      console.warn('Save client profile error:', err);
      showToast('🎉 Profile saved locally!');
      setShowEditProfileModal(false);
    }
  };

  const displayName = currentUser?.name || 'Michael R. (VP Engineering)';
  const displayEmail = currentUser?.email || 'client@scrizians.com';
  const displayCompany = currentUser?.company || 'CloudScale Inc (USA)';

  const [shortlist, setShortlist] = useState([
    {
      id: 'SZN-DEV-00001',
      role: 'Senior Full-Stack Architect',
      skills: 'React, Next.js, Node.js, AWS',
      experience: '8 Years',
      rate: '$32/hr (₹1,80,000/mo)',
      status: 'Interview Scheduled'
    },
    {
      id: 'SZN-DEV-00002',
      role: 'Lead Frontend Specialist',
      skills: 'React, Next.js, CSS Modules',
      experience: '6 Years',
      rate: '$28/hr (₹1,50,000/mo)',
      status: 'Shortlisted'
    }
  ]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleRequestInterview = (scrizianId: string) => {
    setSelectedScrizian(scrizianId);
    setIsLeadModalOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('scrizians_token');
    localStorage.removeItem('scrizians_user');
    router.push('/dashboard');
  };

  const handleRemoveShortlist = (id: string) => {
    setShortlist(shortlist.filter(item => item.id !== id));
    showToast(`🗑️ Removed ${id} from shortlist`);
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    const pdfHeader = `%PDF-1.4
1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj
2 0 obj << /Type /Pages /Kinds [ /Page ] /Count 1 /Kids [ 3 0 R ] >> endobj
3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [ 0 0 612 792 ] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >> endobj
5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj
4 0 obj << /Length 260 >> stream
BT
/F1 18 Tf
50 720 Td (SCRIZA PRIVATE LIMITED - INVOICE STATEMENT) Tj
0 -30 Td /F1 12 Tf (Invoice ID: ${invoiceId}) Tj
0 -20 Td (Billing Period: September 2026) Tj
0 -20 Td (Client: ${displayCompany}) Tj
0 -20 Td (Amount Paid: $5,120.00 / INR 4,27,520) Tj
0 -20 Td (Status: PAID - Verified by Scriza Billing Desk) Tj
0 -30 Td (Thank you for partnering with Scrizians!) Tj
ET
endstream endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000062 00000 n 
0000000142 00000 n 
0000000325 00000 n 
0000000270 00000 n 
trailer << /Size 6 /Root 1 0 R >>
startxref
638
%%EOF`;

    const blob = new Blob([pdfHeader], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Invoice_${invoiceId}_Scrizians.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast(`📄 Downloaded Invoice_${invoiceId}_Scrizians.pdf`);
  };

  return (
    <div className={styles.dashboardLayout}>
      <DashboardSidebar 
        role="client" 
        activeTab={activeTab}
        onTabChange={(tab: any) => setActiveTab(tab)}
        user={currentUser || { name: displayName, role: 'client', email: displayEmail, company: displayCompany }} 
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
            <h1 className={styles.title}>Client & Company Portal</h1>
            <p className={styles.subTitle}>
              Logged in as: <strong style={{ color: '#ffffff' }}>{displayName}</strong> | {displayCompany}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button 
              onClick={() => {
                setEditFormData({
                  name: displayName,
                  phone: currentUser?.phone || '+1 (555) 234-5678',
                  title: currentUser?.title || 'VP of Engineering',
                  company: displayCompany
                });
                setShowEditProfileModal(true);
              }}
              style={{ background: '#E52B2B', color: '#ffffff', border: 'none', padding: '0.55rem 1.1rem', borderRadius: '8px', fontWeight: 800, cursor: 'pointer', fontSize: '0.85rem' }}
            >
              ✏️ Edit Profile
            </button>
            <button onClick={() => setIsLeadModalOpen(true)} className={styles.btnPrimary}>
              + Request New Talent
            </button>
            <NotificationBell />
          </div>
        </div>

        {/* TAB 1: Requirements */}
        {(activeTab === 'requirements' || !activeTab) && (
          <div className={styles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <h3 className={styles.cardTitle} style={{ margin: 0 }}>Active Hiring Requirements & Specs</h3>
                <p className={styles.cardSub} style={{ margin: '0.2rem 0 0 0' }}>
                  Manage staffing specifications, timezone overlap preferences, and developer tech stacks.
                </p>
              </div>
              <button onClick={() => setIsLeadModalOpen(true)} className={styles.btnPrimary}>+ Submit Requirement</button>
            </div>

            <div style={{ background: '#F8FAFC', border: '1px solid #CBD5E1', padding: '1.2rem', borderRadius: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '1.05rem', color: '#0F172A' }}>Requirement #REQ-8891: Dedicated Next.js & Node.js Architects</strong>
                <span style={{ background: '#DCFCE7', color: '#166534', padding: '0.2rem 0.6rem', borderRadius: '12px', fontWeight: 800, fontSize: '0.78rem' }}>✓ Active Sourcing</span>
              </div>
              <p style={{ margin: '0.5rem 0', fontSize: '0.9rem', color: '#475569' }}>
                Looking for 2 Senior Architects for 6-month contract with 4-hour EST overlap. Preferred budget: $30 - $35/hr.
              </p>
              <div style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: 700 }}>
                Matched Scrizians: SZN-DEV-00001, SZN-DEV-00002
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Shortlist */}
        {activeTab === 'shortlist' && (
          <div className={styles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.8rem' }}>
              <h3 className={styles.cardTitle} style={{ margin: 0 }}>Active Shortlisted Scrizian Talent</h3>
              <Link href="/hire-talent" className={styles.btnSecondary}>
                🔍 Browse Full Talent Network
              </Link>
            </div>

            <p className={styles.cardSub}>
              Talent contact info is privacy-protected. All communications and interview slots are scheduled directly via your dedicated Scriza account desk (<strong>+91 91191 12999</strong>).
            </p>

            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Scrizian ID</th>
                    <th>Role / Title</th>
                    <th>Skills</th>
                    <th>Experience</th>
                    <th>Rate Band</th>
                    <th>Pipeline Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {shortlist.map(item => (
                    <tr key={item.id}>
                      <td style={{ fontFamily: 'monospace', fontWeight: 800, color: '#E52B2B' }}>{item.id}</td>
                      <td><strong>{item.role}</strong></td>
                      <td>{item.skills}</td>
                      <td>{item.experience}</td>
                      <td><strong>{item.rate}</strong></td>
                      <td>
                        <span style={{
                          background: item.status === 'Interview Scheduled' ? '#DCFCE7' : '#DBEAFE',
                          color: item.status === 'Interview Scheduled' ? '#166534' : '#1E40AF',
                          padding: '0.3rem 0.7rem',
                          borderRadius: '12px',
                          fontWeight: 800,
                          fontSize: '0.8rem'
                        }}>
                          ● {item.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button 
                            onClick={() => handleRequestInterview(item.id)} 
                            className={styles.btnSecondary}
                          >
                            📅 Schedule Slot
                          </button>
                          <button 
                            onClick={() => handleRemoveShortlist(item.id)} 
                            className={styles.btnSecondary}
                            style={{ color: '#DC2626', borderColor: '#DC2626' }}
                          >
                            🗑️ Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination
              currentPage={1}
              totalPages={1}
              onPageChange={() => {}}
              totalItems={shortlist.length}
              itemsPerPage={5}
              itemLabel="shortlisted Scrizians"
            />
          </div>
        )}

        {/* TAB 3: Interviews */}
        {activeTab === 'interviews' && (
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Interview Schedule & Feedback</h3>
            <p className={styles.cardSub}>Track upcoming video interviews scheduled with shortlisted Scrizian engineers.</p>

            <div style={{ background: '#F0FDF4', border: '2px solid #86EFAC', padding: '1.2rem', borderRadius: '10px', marginTop: '1rem' }}>
              <h4 style={{ margin: 0, color: '#166534' }}>📅 Confirmed Interview Slot with SZN-DEV-00001</h4>
              <p style={{ margin: '0.4rem 0', fontSize: '0.9rem', color: '#14532D' }}>
                Slot: Tomorrow @ 6:30 PM IST (8:00 AM EST) | Host: Scriza Technical Ops
              </p>
              <div style={{ fontSize: '0.82rem', color: '#15803D', fontWeight: 700 }}>
                Calendar Invite & Google Meet link dispatched to m.ross@techus.com
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Engagements */}
        {activeTab === 'engagements' && (
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Active Talent Engagements & Staff Augmentation</h3>
            <p className={styles.cardSub}>Monitor active developer contracts, dedicated squad setups, and monthly hours.</p>

            <div style={{ background: '#F8FAFC', border: '1px solid #CBD5E1', padding: '1.2rem', borderRadius: '10px', marginTop: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '1rem', color: '#0F172A' }}>Contract #ENG-102: SZN-DEV-00001 (Senior Architect)</strong>
                <span style={{ background: '#DCFCE7', color: '#166534', padding: '0.2rem 0.6rem', borderRadius: '12px', fontWeight: 800, fontSize: '0.78rem' }}>🟢 Active Staff Augmentation</span>
              </div>
              <p style={{ margin: '0.4rem 0', fontSize: '0.88rem', color: '#475569' }}>
                Monthly Rate: $32/hr | Total Hours Logged This Month: 140 hrs | Timezone Overlap: EST
              </p>
            </div>
          </div>
        )}

        {/* TAB 5: Invoices */}
        {activeTab === 'invoices' && (
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Invoices & Billing Statements</h3>
            <p className={styles.cardSub}>View monthly billing statements issued via Scriza Private Limited.</p>

            <div className={styles.tableContainer} style={{ marginTop: '1rem' }}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Invoice #</th>
                    <th>Billing Period</th>
                    <th>Amount (USD / INR)</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ fontFamily: 'monospace', fontWeight: 800 }}>INV-2026-09</td>
                    <td>September 2026</td>
                    <td><strong>$5,120.00 / ₹4,27,520</strong></td>
                    <td><span style={{ background: '#DCFCE7', color: '#166534', padding: '0.2rem 0.6rem', borderRadius: '12px', fontWeight: 800, fontSize: '0.78rem' }}>✓ Paid</span></td>
                    <td>
                      <button 
                        onClick={() => handleDownloadInvoice('INV-2026-09')} 
                        className={styles.btnSecondary} 
                        style={{ fontSize: '0.8rem', cursor: 'pointer' }}
                      >
                        📄 Download PDF
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
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
              ✏️ Edit Client Profile Details
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#64748B', marginBottom: '1.2rem' }}>
              Update your contact name, phone, designation, and company name. Changes will save to MongoDB Atlas database.
            </p>

            <form onSubmit={handleSaveClientProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '0.3rem' }}>
                    Title / Designation *
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
                    Company Name *
                  </label>
                  <input 
                    type="text" 
                    required 
                    value={editFormData.company}
                    onChange={e => setEditFormData({ ...editFormData, company: e.target.value })}
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

      <LeadModal 
        isOpen={isLeadModalOpen}
        onClose={() => { setIsLeadModalOpen(false); setSelectedScrizian(undefined); }}
        prefilledScrizianId={selectedScrizian}
      />
    </div>
  );
}

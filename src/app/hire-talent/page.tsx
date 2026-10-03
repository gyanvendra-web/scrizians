'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Header } from '@/components/Header/Header';
import { Footer } from '@/components/Footer/Footer';
import { TalentCard, Talent } from '@/components/TalentCard/TalentCard';
import { LeadModal } from '@/components/LeadModal/LeadModal';
import { Pagination } from '@/components/Pagination/Pagination';
import { getStoredData, initialTalentList } from '@/utils/dataSync';
import styles from './HireTalent.module.css';

const rolesList = [
  { id: 'frontend', label: 'Frontend Developers' },
  { id: 'backend', label: 'Backend Developers' },
  { id: 'fullstack', label: 'Full Stack Developers' },
  { id: 'qa', label: 'QA Engineers' },
  { id: 'devops', label: 'DevOps Engineers' },
  { id: 'uiux', label: 'UI/UX Designers' },
  { id: 'mobile', label: 'Mobile Developers' },
  { id: 'data-ai', label: 'Data & AI Specialists' },
  { id: 'seo-digital', label: 'SEO & Digital Talent' }
];

const techList = [
  'React', 'Next.js', 'Angular', 'Vue.js', 'TypeScript', 'Node.js', 
  'Laravel', 'PHP', 'Python', 'Java', '.NET', 'Flutter', 
  'Android', 'iOS', 'React Native', 'AWS', 'GCP', 'Azure'
];

function HireTalentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentRoleParam = searchParams.get('role') || '';
  const currentTechParam = searchParams.get('tech') || '';

  const [selectedRole, setSelectedRole] = useState(currentRoleParam);
  const [selectedTech, setSelectedTech] = useState(currentTechParam);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [selectedScrizianId, setSelectedScrizianId] = useState<string | undefined>(undefined);

  const [rawTalent, setRawTalent] = useState<any[]>([]);

  useEffect(() => {
    const refreshData = () => {
      setRawTalent(getStoredData('scrizians_talent_list', initialTalentList));
    };
    refreshData();
    window.addEventListener('scrizians_storage_updated', refreshData);
    window.addEventListener('storage', refreshData);
    return () => {
      window.removeEventListener('scrizians_storage_updated', refreshData);
      window.removeEventListener('storage', refreshData);
    };
  }, []);

  const allTalentList: Talent[] = React.useMemo(() => {
    return rawTalent.map(t => ({
      scrizianId: t.id || t.scrizianId,
      displayName: t.displayName || t.name,
      title: t.title,
      category: t.category || 'Full Stack Developers',
      summary: t.summary || `${t.experienceYears || 7}+ years experience in ${t.skills || 'software development'}.`,
      experienceYears: t.experienceYears || 7,
      skills: Array.isArray(t.skills) ? t.skills : String(t.skills || '').split(',').map((s: string) => s.trim()),
      availability: t.availability || 'Available now',
      hourlyRateUSD: Number(t.hourlyRateUSD || 35),
      monthlyRateINR: Number(t.monthlyRateINR || 190000),
      relationshipBadge: t.relationshipBadge || 'Verified Scrizian',
      avatarText: (t.id || t.scrizianId || '00').replace(/[^0-9]/g, '').slice(-2) || '00'
    }));
  }, [rawTalent]);

  useEffect(() => {
    setSelectedRole(searchParams.get('role') || '');
    setSelectedTech(searchParams.get('tech') || '');
  }, [searchParams]);

  const handleRoleSelect = (roleId: string) => {
    const newRole = selectedRole === roleId ? '' : roleId;
    setSelectedRole(newRole);
    
    const params = new URLSearchParams();
    if (newRole) params.set('role', newRole);
    if (selectedTech) params.set('tech', selectedTech);

    const queryString = params.toString();
    router.push(`/hire-talent${queryString ? `?${queryString}` : ''}`);
  };

  const handleTechSelect = (techName: string) => {
    const newTech = selectedTech === techName ? '' : techName;
    setSelectedTech(newTech);

    const params = new URLSearchParams();
    if (selectedRole) params.set('role', selectedRole);
    if (newTech) params.set('tech', newTech);

    const queryString = params.toString();
    router.push(`/hire-talent${queryString ? `?${queryString}` : ''}`);
  };

  const handleResetFilters = () => {
    setSelectedRole('');
    setSelectedTech('');
    router.push('/hire-talent');
  };

  const filteredTalents = allTalentList.filter(talent => {
    let matchesRole = true;
    let matchesTech = true;

    if (selectedRole) {
      if (selectedRole === 'frontend') matchesRole = talent.category === 'Frontend Developers' || talent.title.toLowerCase().includes('frontend') || talent.title.toLowerCase().includes('react');
      else if (selectedRole === 'backend') matchesRole = talent.category === 'Backend Developers' || talent.title.toLowerCase().includes('backend') || talent.title.toLowerCase().includes('java') || talent.title.toLowerCase().includes('laravel');
      else if (selectedRole === 'fullstack') matchesRole = talent.category === 'Full Stack Developers' || talent.title.toLowerCase().includes('full-stack');
      else if (selectedRole === 'qa') matchesRole = talent.category === 'QA Engineers' || talent.title.toLowerCase().includes('qa');
      else if (selectedRole === 'devops') matchesRole = talent.category === 'DevOps Engineers' || talent.title.toLowerCase().includes('devops') || talent.title.toLowerCase().includes('cloud');
      else if (selectedRole === 'uiux') matchesRole = talent.category === 'UI/UX Designers' || talent.title.toLowerCase().includes('designer') || talent.title.toLowerCase().includes('ui/ux');
      else if (selectedRole === 'mobile') matchesRole = talent.category === 'Mobile Developers' || talent.title.toLowerCase().includes('mobile') || talent.title.toLowerCase().includes('flutter');
      else if (selectedRole === 'data-ai') matchesRole = talent.category === 'Data & AI Specialists' || talent.title.toLowerCase().includes('data') || talent.title.toLowerCase().includes('ai');
      else if (selectedRole === 'seo-digital') matchesRole = talent.category === 'SEO & Digital Talent' || talent.title.toLowerCase().includes('seo') || talent.title.toLowerCase().includes('growth');
    }

    if (selectedTech) {
      matchesTech = talent.skills.some(s => s.toLowerCase() === selectedTech.toLowerCase());
    }

    return matchesRole && matchesTech;
  });

  const handleOpenLeadModal = (scrizianId?: string) => {
    setSelectedScrizianId(scrizianId);
    setIsLeadModalOpen(true);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;
  const totalPages = Math.max(1, Math.ceil(filteredTalents.length / ITEMS_PER_PAGE));
  const paginatedTalents = filteredTalents.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <>
      <Header onOpenLeadModal={() => handleOpenLeadModal()} />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroRingWrapper}>
          <div className={styles.heroRing} />
        </div>

        <div className={styles.heroInner}>
          <div className={styles.breadcrumb}>
            <Link href="/" className={styles.breadcrumbLink}>Home</Link> / Hire Talent
          </div>

          <span className={styles.eyebrow}>HIRE TALENT</span>
          <h1 className={styles.title}>Hire Tech Talent from India</h1>
          <p className={styles.subtitle}>
            Pre-vetted Scrizians across roles and technologies, ready for staff augmentation, dedicated or remote engagements.
          </p>

          <button className={styles.btnShareReq} onClick={() => handleOpenLeadModal()}>
            Share your requirement
          </button>
        </div>
      </section>

      {/* Main Filtered Layout */}
      <main className={styles.mainContainer}>
        <div className={styles.layout}>
          {/* Left Sidebar */}
          <aside className={styles.sidebar}>
            {/* BY ROLE */}
            <div className={styles.filterSection}>
              <h3 className={styles.filterSectionTitle}>BY ROLE</h3>
              <div className={styles.roleList}>
                {rolesList.map(role => {
                  const isActive = selectedRole === role.id;
                  return (
                    <button
                      key={role.id}
                      onClick={() => handleRoleSelect(role.id)}
                      className={`${styles.roleBtn} ${isActive ? styles.roleBtnActive : ''}`}
                    >
                      {role.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* BY TECHNOLOGY */}
            <div className={styles.filterSection}>
              <h3 className={styles.filterSectionTitle}>BY TECHNOLOGY</h3>
              <div className={styles.techGrid}>
                {techList.map(tech => {
                  const isActive = selectedTech.toLowerCase() === tech.toLowerCase();
                  return (
                    <button
                      key={tech}
                      onClick={() => handleTechSelect(tech)}
                      className={`${styles.techPill} ${isActive ? styles.techPillActive : ''}`}
                    >
                      {tech}
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Right Talent Grid */}
          <section className={styles.contentArea}>
            <div className={styles.contentHeader}>
              <span className={styles.profilesLabel}>{filteredTalents.length} PROFILES</span>
              <h2 className={styles.sectionHeading}>
                {selectedRole ? rolesList.find(r => r.id === selectedRole)?.label || 'Featured Scrizians' : selectedTech ? `${selectedTech} Scrizians` : 'Featured Scrizians'}
              </h2>
            </div>

            {filteredTalents.length > 0 ? (
              <>
                <div className={styles.talentGrid}>
                  {paginatedTalents.map(talent => (
                    <TalentCard 
                      key={talent.scrizianId} 
                      talent={talent} 
                      onSelectLeadModal={(id) => handleOpenLeadModal(id)}
                    />
                  ))}
                </div>

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  totalItems={filteredTalents.length}
                  itemsPerPage={ITEMS_PER_PAGE}
                  itemLabel="Scrizians"
                />
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '4rem 2rem', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>No profiles found</h3>
                <p style={{ color: '#64748B', marginBottom: '1rem' }}>No Scrizians matched your active filters.</p>
                <button onClick={handleResetFilters} className={styles.resetBtn}>
                  Reset filters
                </button>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Red CTA Band */}
      <section style={{ 
        backgroundColor: '#E52B2B', 
        backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 12px, rgba(0,0,0,0.06) 12px, rgba(0,0,0,0.06) 24px)',
        color: '#ffffff',
        padding: '4rem 1.5rem'
      }}>
        <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.4rem' }}>Ready to build your team?</h2>
            <p style={{ fontSize: '1rem', color: '#ffffff', opacity: 0.9 }}>
              Share your requirement and receive a curated Scrizian shortlist within 48 hours.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
              onClick={() => handleOpenLeadModal()}
              style={{ background: '#0B172A', color: '#ffffff', padding: '0.85rem 1.8rem', borderRadius: '6px', fontWeight: 700, fontSize: '0.95rem', border: 'none', cursor: 'pointer' }}
            >
              Hire Talent
            </button>
            <a 
              href="tel:+919119112999" 
              style={{ background: '#ffffff', color: '#0B172A', padding: '0.85rem 1.8rem', borderRadius: '6px', fontWeight: 700, fontSize: '0.95rem', textDecoration: 'none', display: 'inline-block' }}
            >
              Call +91 91191 12999
            </a>
          </div>
        </div>
      </section>

      <LeadModal 
        isOpen={isLeadModalOpen} 
        onClose={() => setIsLeadModalOpen(false)}
        prefilledScrizianId={selectedScrizianId}
      />

      <Footer />
    </>
  );
}

export default function HireTalentPage() {
  return (
    <Suspense fallback={<div style={{ padding: '4rem', textAlign: 'center' }}>Loading Scrizians...</div>}>
      <HireTalentContent />
    </Suspense>
  );
}

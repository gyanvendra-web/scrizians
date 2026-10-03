'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header/Header';
import { Footer } from '@/components/Footer/Footer';
import { LeadModal } from '@/components/LeadModal/LeadModal';
import { Pagination } from '@/components/Pagination/Pagination';
import styles from './Portfolio.module.css';

export default function PortfolioPage() {
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <>
      <Header onOpenLeadModal={() => setIsLeadModalOpen(true)} />

      {/* Hero Section matching media_1790940423376.png */}
      <section className={styles.hero}>
        <div className={styles.heroRingWrapper}>
          <div className={styles.heroRing} />
        </div>

        <div className={styles.heroInner}>
          <div className={styles.breadcrumb}>
            <Link href="/" className={styles.breadcrumbLink}>Home</Link> / Portfolio
          </div>

          <span className={styles.eyebrow}>PORTFOLIO</span>
          <h1 className={styles.title}>Work shipped by Scrizians</h1>
          <p className={styles.subtitle}>
            Every project is reviewed for rights and confidentiality before publishing. NDA work is shown without client identity.
          </p>
        </div>
      </section>

      {/* Portfolio Grid Layout matching media_1790940423376.png */}
      <main className={styles.mainContainer}>
        {/* Row 1: Asymmetric (Big Left, Small Right) */}
        <div className={styles.rowAsymmLeft}>
          <div className={styles.portfolioCard}>
            <div 
              className={styles.cardMediaBig} 
              style={{ backgroundImage: `url('https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=70')` }}
            >
              <span className={styles.ndaBadge}>🔒 NDA Protected</span>
            </div>
            <div className={styles.cardBody}>
              <div>
                <span className={styles.authorTagRed}>by SCR-8841 · Lead Architect</span>
                <h2 className={styles.projectTitle}>Lending Platform Re-architecture</h2>
                <p className={styles.projectSub}>Microservices migration for a US lending platform.</p>
              </div>
              <div className={styles.skillsRow}>
                <span className={styles.skillChip}>Node.js</span>
                <span className={styles.skillChip}>AWS</span>
                <span className={styles.skillChip}>Kafka</span>
              </div>
            </div>
          </div>

          <div className={styles.portfolioCard}>
            <div 
              className={styles.cardMedia} 
              style={{ backgroundImage: `url('https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=70')` }}
            />
            <div className={styles.cardBody}>
              <div>
                <span className={styles.authorTagRed}>by SCR-2207 · Frontend Engineer</span>
                <h3 className={styles.projectTitle}>D2C Storefront on Next.js</h3>
                <p className={styles.projectSub}>Headless commerce storefront with 98 Lighthouse score.</p>
              </div>
              <div className={styles.skillsRow}>
                <span className={styles.skillChip}>Next.js</span>
                <span className={styles.skillChip}>Shopify</span>
                <span className={styles.skillChip}>TypeScript</span>
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Equal (1fr 1fr) */}
        <div className={styles.rowEqui}>
          <div className={styles.portfolioCard}>
            <div 
              className={styles.cardMedia} 
              style={{ backgroundImage: `url('https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=70')` }}
            />
            <div className={styles.cardBody}>
              <div>
                <span className={styles.authorTagRed}>by SCR-3928 · Product Designer</span>
                <h3 className={styles.projectTitle}>B2B Analytics Design System</h3>
                <p className={styles.projectSub}>120-component design system adopted by 4 product teams.</p>
              </div>
              <div className={styles.skillsRow}>
                <span className={styles.skillChip}>Figma</span>
                <span className={styles.skillChip}>Storybook</span>
              </div>
            </div>
          </div>

          <div className={styles.portfolioCard}>
            <div 
              className={styles.cardMedia} 
              style={{ backgroundImage: `url('https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=70')` }}
            />
            <div className={styles.cardBody}>
              <div>
                <span className={styles.authorTagRed}>by SCR-4416 · Mobile Developer</span>
                <h3 className={styles.projectTitle}>Fitness Tracking Mobile App</h3>
                <p className={styles.projectSub}>Cross-platform app with wearable sync and offline mode.</p>
              </div>
              <div className={styles.skillsRow}>
                <span className={styles.skillChip}>Flutter</span>
                <span className={styles.skillChip}>Firebase</span>
              </div>
            </div>
          </div>
        </div>

        {/* Row 3: Asymmetric (Big Left, Small Right) */}
        <div className={styles.rowAsymmRight}>
          <div className={styles.portfolioCard}>
            <div 
              className={styles.cardMediaBig} 
              style={{ backgroundImage: `url('https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1200&q=70')` }}
            />
            <div className={styles.cardBody}>
              <div>
                <span className={styles.authorTagRed}>by SCR-6102 · DevOps Engineer</span>
                <h2 className={styles.projectTitle}>Zero-Downtime Kubernetes Platform</h2>
                <p className={styles.projectSub}>Multi-region GKE platform with GitOps deployments.</p>
              </div>
              <div className={styles.skillsRow}>
                <span className={styles.skillChip}>GKE</span>
                <span className={styles.skillChip}>ArgoCD</span>
                <span className={styles.skillChip}>Terraform</span>
              </div>
            </div>
          </div>

          <div className={styles.portfolioCard}>
            <div 
              className={styles.cardMedia} 
              style={{ backgroundImage: `url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=70')` }}
            >
              <span className={styles.ndaBadge}>🔒 NDA Protected</span>
            </div>
            <div className={styles.cardBody}>
              <div>
                <span className={styles.authorTagRed}>by SCR-7719 · AI Engineer</span>
                <h3 className={styles.projectTitle}>Enterprise Document Q&A</h3>
                <p className={styles.projectSub}>RAG assistant over 2M documents with citations.</p>
              </div>
              <div className={styles.skillsRow}>
                <span className={styles.skillChip}>Python</span>
                <span className={styles.skillChip}>LangChain</span>
                <span className={styles.skillChip}>Pinecone</span>
              </div>
            </div>
          </div>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={2}
          onPageChange={setCurrentPage}
          totalItems={6}
          itemsPerPage={3}
          itemLabel="portfolio projects"
        />
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
              onClick={() => setIsLeadModalOpen(true)}
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
      />

      <Footer />
    </>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Header } from '@/components/Header/Header';
import { Footer } from '@/components/Footer/Footer';
import { LeadModal } from '@/components/LeadModal/LeadModal';
import { getStoredData, syncFromMongoDB, initialArticlesList } from '@/utils/dataSync';
import styles from '../Insights.module.css';

export default function InsightDetailPage() {
  const params = useParams();
  const rawId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const articleId = decodeURIComponent(rawId || '');

  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [articles, setArticles] = useState<any[]>([]);

  useEffect(() => {
    const refreshData = () => {
      const data = getStoredData('scrizians_insights_list', initialArticlesList);
      setArticles(Array.isArray(data) ? data : initialArticlesList);
    };
    refreshData();
    syncFromMongoDB('scrizians_insights_list');

    window.addEventListener('scrizians_storage_updated', refreshData);
    window.addEventListener('storage', refreshData);
    return () => {
      window.removeEventListener('scrizians_storage_updated', refreshData);
      window.removeEventListener('storage', refreshData);
    };
  }, []);

  // Find target article by id or slug
  const article = articles.find(
    a => (a.id && a.id.toLowerCase() === articleId.toLowerCase()) || 
         (a.slug && a.slug.toLowerCase() === articleId.toLowerCase())
  ) || initialArticlesList.find(
    a => a.id.toLowerCase() === articleId.toLowerCase()
  ) || articles[0] || initialArticlesList[0];

  const relatedArticles = articles
    .filter(a => a.id !== article?.id)
    .slice(0, 3);

  if (!article) {
    return (
      <>
        <Header onOpenLeadModal={() => setIsLeadModalOpen(true)} />
        <div style={{ padding: '6rem 2rem', textAlign: 'center' }}>
          <h2>Article Not Found</h2>
          <p>The requested article could not be located.</p>
          <Link href="/insights" style={{ color: '#E52B2B', fontWeight: 800 }}>← Back to All Insights</Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header onOpenLeadModal={() => setIsLeadModalOpen(true)} />

      {/* Hero Header */}
      <section className={styles.hero} style={{ padding: '4rem 1.5rem 3rem' }}>
        <div className={styles.heroInner} style={{ maxWidth: '900px' }}>
          <div className={styles.breadcrumb}>
            <Link href="/" className={styles.breadcrumbLink}>Home</Link> / <Link href="/insights" className={styles.breadcrumbLink}>Insights</Link> / {article.category || 'Article'}
          </div>

          <span className={styles.eyebrow} style={{ background: '#E52B2B', color: '#ffffff', padding: '0.3rem 0.8rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 800 }}>
            {(article.category || article.cat || 'HIRING GUIDES').toUpperCase()}
          </span>

          <h1 className={styles.title} style={{ fontSize: '2.4rem', marginTop: '1rem', lineHeight: 1.25 }}>
            {article.title}
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', marginTop: '1.2rem', color: '#94A3B8', fontSize: '0.9rem', flexWrap: 'wrap' }}>
            <span>✍️ <strong>{article.author || 'Scrizians Editorial'}</strong></span>
            <span>📅 {article.publishedDate || '2026'}</span>
            <span>⏱️ {article.readTime || '6 min read'}</span>
          </div>
        </div>
      </section>

      {/* Article Body Content Container */}
      <main className={styles.mainContainer} style={{ maxWidth: '900px', margin: '0 auto', padding: '2.5rem 1.5rem 5rem' }}>
        {/* Featured Cover Banner */}
        <div style={{ marginBottom: '2.5rem', borderRadius: '12px', overflow: 'hidden', border: '2px solid #0F172A', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
          <img 
            src={article.coverImageUrl || article.image || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=70'} 
            alt={article.title}
            style={{ width: '100%', maxHeight: '480px', objectFit: 'cover', display: 'block' }}
          />
        </div>

        {/* Lead Excerpt */}
        <div style={{ 
          fontSize: '1.2rem', 
          lineHeight: 1.6, 
          color: '#0F172A', 
          fontWeight: 700, 
          borderLeft: '4px solid #E52B2B', 
          paddingLeft: '1.2rem', 
          marginBottom: '2rem',
          background: '#F8FAFC',
          padding: '1.2rem 1.5rem',
          borderRadius: '0 8px 8px 0'
        }}>
          {article.excerpt}
        </div>

        {/* Article Body Paragraphs */}
        <div style={{ fontSize: '1.05rem', lineHeight: 1.8, color: '#334155' }}>
          <p style={{ marginBottom: '1.5rem' }}>
            In today's fast-moving software ecosystem, engineering leaders and CTOs face immense pressure to deliver robust, scalable technology products while controlling operational budgets. Selecting the right offshore talent model and vetting senior architects is the single most critical factor determining project velocity.
          </p>

          <h2 style={{ fontSize: '1.6rem', color: '#0B172A', fontWeight: 800, marginTop: '2.5rem', marginBottom: '1rem' }}>
            1. Evaluating Technical Competency & Real-World Experience
          </h2>
          <p style={{ marginBottom: '1.5rem' }}>
            Resume keywords rarely tell the complete story. When interviewing senior React, Next.js, or cloud infrastructure developers from India, focus on scenario-based architectural questions rather than syntax memorization. Ask candidates to explain how they optimize Web Vitals, structure server components, and manage database connection pooling under high concurrency.
          </p>

          <h2 style={{ fontSize: '1.6rem', color: '#0B172A', fontWeight: 800, marginTop: '2.5rem', marginBottom: '1rem' }}>
            2. Configuring Time Zone Overlap for Seamless Collaboration
          </h2>
          <p style={{ marginBottom: '1.5rem' }}>
            Distributed engineering teams thrive when there is a reliable 4-hour daily synchronous overlap between US/European tech leads and offshore developer squads in India. This overlap window ensures daily standups, code reviews, and sprint planning sessions happen smoothly without delaying release pipelines.
          </p>

          {/* Key Takeaways Box */}
          <div style={{ background: '#F1F5F9', border: '2px solid #CBD5E1', borderRadius: '10px', padding: '1.8rem', margin: '2.5rem 0' }}>
            <h3 style={{ margin: '0 0 1rem 0', color: '#0B172A', fontSize: '1.2rem', fontWeight: 800 }}>⚡ Key Engineering Takeaways</h3>
            <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#1E293B', lineHeight: 1.7 }}>
              <li style={{ marginBottom: '0.5rem' }}>Vet for architectural depth and system design, not just framework syntax.</li>
              <li style={{ marginBottom: '0.5rem' }}>Establish 4-hour synchronous overlap windows for daily standups & code reviews.</li>
              <li style={{ marginBottom: '0.5rem' }}>Leverage Scrizians pre-vetted developer roster for guaranteed quality and immediate onboarding.</li>
            </ul>
          </div>

          <h2 style={{ fontSize: '1.6rem', color: '#0B172A', fontWeight: 800, marginTop: '2.5rem', marginBottom: '1rem' }}>
            3. Onboarding & Long-Term Retention
          </h2>
          <p style={{ marginBottom: '1.5rem' }}>
            A structured 2-week onboarding roadmap with direct access to code repositories, staging environments, and architectural diagrams significantly accelerates developer productivity. Scrizians dedicated account managers oversee ongoing performance and engagement health to ensure long-term retention.
          </p>
        </div>

        {/* Back Link */}
        <div style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '2px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/insights" style={{ color: '#0F172A', fontWeight: 800, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            ← Back to Knowledge Base
          </Link>
          <button 
            onClick={() => setIsLeadModalOpen(true)}
            style={{ background: '#E52B2B', color: '#ffffff', border: 'none', padding: '0.6rem 1.4rem', borderRadius: '6px', fontWeight: 800, cursor: 'pointer' }}
          >
            Hire Developer
          </button>
        </div>

        {/* Related Articles Section */}
        {relatedArticles.length > 0 && (
          <div style={{ marginTop: '4rem' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0B172A', marginBottom: '1.5rem' }}>Related Guides & Insights</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.2rem' }}>
              {relatedArticles.map(rel => (
                <Link key={rel.id} href={`/insights/${rel.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div style={{ background: '#ffffff', border: '1px solid #CBD5E1', borderRadius: '8px', overflow: 'hidden' }}>
                    <img src={rel.coverImageUrl || rel.image} alt={rel.title} style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
                    <div style={{ padding: '1rem' }}>
                      <span style={{ fontSize: '0.75rem', color: '#E52B2B', fontWeight: 800, textTransform: 'uppercase' }}>{rel.category || 'GUIDE'}</span>
                      <h4 style={{ fontSize: '0.98rem', fontWeight: 800, margin: '0.4rem 0', color: '#0B172A', lineHeight: 1.3 }}>{rel.title}</h4>
                      <span style={{ fontSize: '0.78rem', color: '#64748B' }}>{rel.readTime || '5 min read'}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* CTA Red Band */}
      <section style={{ 
        backgroundColor: '#E52B2B', 
        backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 12px, rgba(0,0,0,0.06) 12px, rgba(0,0,0,0.06) 24px)',
        color: '#ffffff',
        padding: '4rem 1.5rem'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.4rem' }}>Need pre-vetted engineers for your team?</h2>
            <p style={{ fontSize: '0.98rem', color: '#ffffff', opacity: 0.9 }}>
              Share your requirement specs and receive handpicked Scrizian developer profiles within 48 hours.
            </p>
          </div>
          <button 
            onClick={() => setIsLeadModalOpen(true)}
            style={{ background: '#0B172A', color: '#ffffff', padding: '0.85rem 1.8rem', borderRadius: '6px', fontWeight: 700, fontSize: '0.95rem', border: 'none', cursor: 'pointer' }}
          >
            Hire Talent Now
          </button>
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

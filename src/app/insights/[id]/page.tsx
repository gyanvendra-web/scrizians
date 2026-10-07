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
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(142);
  const [copied, setCopied] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('section-1');

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

  // Intersection observer for Table of Contents active highlighting
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['section-1', 'section-2', 'section-3', 'section-4'];
      const scrollPos = window.scrollY + 200;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Find target article by id or slug
  const article = articles.find(
    a => (a.id && a.id.toLowerCase() === articleId.toLowerCase()) || 
         (a.slug && a.slug.toLowerCase() === articleId.toLowerCase()) ||
         (a._id && String(a._id).toLowerCase() === articleId.toLowerCase())
  ) || initialArticlesList.find(
    a => (a.id && a.id.toLowerCase() === articleId.toLowerCase()) || 
         (a.slug && a.slug.toLowerCase() === articleId.toLowerCase())
  );

  const tocItems = React.useMemo(() => {
    if (!article) return [];
    if (article.content || article.body) {
      const text = article.content || article.body || '';
      const lines = text.split(/\n+/).map((l: string) => l.trim()).filter(Boolean);
      const headings = lines.filter((l: string) => /^(#|\d+\.|\bSection\b)/i.test(l));
      if (headings.length > 0) {
        return headings.map((h: string, idx: number) => ({
          id: `section-${idx + 1}`,
          title: h.replace(/^#+\s*/, '').substring(0, 35)
        }));
      }
    }
    return [
      { id: 'section-1', title: '1. Architectural Overview' },
      { id: 'section-2', title: '2. Strategic Implementation' },
      { id: 'section-3', title: '3. Team & Workflow Standards' },
      { id: 'section-4', title: '4. Scrizians Advantage' }
    ];
  }, [article]);

  const relatedArticles = articles
    .filter(a => a.id !== article?.id)
    .slice(0, 3);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleToggleLike = () => {
    if (!liked) {
      setLikeCount(prev => prev + 1);
      setLiked(true);
    } else {
      setLikeCount(prev => prev - 1);
      setLiked(false);
    }
  };

  if (!article) {
    return (
      <>
        <Header onOpenLeadModal={() => setIsLeadModalOpen(true)} />
        <div style={{ padding: '6rem 2rem', textAlign: 'center', minHeight: '60vh' }}>
          <h2 style={{ fontSize: '2rem', color: '#0F172A', fontWeight: 800 }}>Article Not Found</h2>
          <p style={{ color: '#64748B', margin: '1rem 0 2rem' }}>The requested insight article could not be located.</p>
          <Link href="/insights" style={{ background: '#E52B2B', color: '#ffffff', padding: '0.8rem 1.6rem', borderRadius: '6px', textDecoration: 'none', fontWeight: 800 }}>
            ← Back to All Insights
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header onOpenLeadModal={() => setIsLeadModalOpen(true)} />

      {/* Hero Header */}
      <section className={styles.hero} style={{ padding: '4rem 1.5rem 3.5rem' }}>
        <div className={styles.heroRingWrapper}>
          <div className={styles.heroRing} />
        </div>
        <div className={styles.heroInner} style={{ maxWidth: '1100px' }}>
          <div className={styles.breadcrumb}>
            <Link href="/" className={styles.breadcrumbLink}>Home</Link> / <Link href="/insights" className={styles.breadcrumbLink}>Insights</Link> / <span style={{ color: '#F87171' }}>{article.category || 'Guide'}</span>
          </div>

          <span className={styles.eyebrow} style={{ display: 'inline-block', background: 'rgba(229, 43, 43, 0.2)', border: '1px solid #E52B2B', color: '#F87171', padding: '0.35rem 0.9rem', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1.2rem' }}>
            {(article.category || article.cat || 'ENGINEERING LEADERSHIP').toUpperCase()}
          </span>

          <h1 className={styles.title} style={{ fontSize: 'clamp(2.1rem, 4vw, 3.2rem)', lineHeight: 1.18, fontWeight: 900, color: '#ffffff', maxWidth: '980px', margin: '0 0 1.4rem 0' }}>
            {article.title}
          </h1>

          {/* Author & Meta Pill Bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.2rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.15)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'linear-gradient(135deg, #E52B2B 0%, #0F172A 100%)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.1rem', border: '2px solid #ffffff' }}>
                {article.author ? article.author.charAt(0) : 'S'}
              </div>
              <div>
                <div style={{ color: '#ffffff', fontWeight: 800, fontSize: '0.98rem' }}>{article.author || 'Scrizians Editorial'}</div>
                <div style={{ color: '#94A3B8', fontSize: '0.82rem' }}>Tech Talent & Offshore Engineering Lead</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', color: '#CBD5E1', fontSize: '0.88rem', fontWeight: 600 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                📅 {article.publishedDate || 'October 2026'}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                ⏱️ {article.readTime || '6 min read'}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.1)', padding: '0.25rem 0.7rem', borderRadius: '14px' }}>
                👁️ 1.4k Views
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main 2-Column Container */}
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '3.5rem 1.5rem 5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: '3rem', alignItems: 'start' }}>
          
          {/* Main Article Content (Left) */}
          <article>
            {/* Featured Image Banner */}
            <div style={{ position: 'relative', marginBottom: '2.5rem', borderRadius: '16px', overflow: 'hidden', border: '1px solid #E2E8F0', boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}>
              <img 
                src={article.coverImageUrl || article.image || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=70'} 
                alt={article.title}
                style={{ width: '100%', maxHeight: '460px', objectFit: 'cover', display: 'block' }}
              />
              <div style={{ position: 'absolute', bottom: '1rem', right: '1rem', background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(8px)', color: '#ffffff', padding: '0.4rem 0.9rem', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 700 }}>
                Scrizians Verified Talent Report
              </div>
            </div>

            {/* Social Share & Action Toolbar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#F8FAFC', padding: '1rem 1.4rem', borderRadius: '12px', border: '1px solid #E2E8F0', marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Share Article:</span>
                <button 
                  onClick={handleCopyLink}
                  style={{ background: copied ? '#16A34A' : '#ffffff', color: copied ? '#ffffff' : '#0F172A', border: '1px solid #CBD5E1', padding: '0.45rem 0.9rem', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}
                >
                  {copied ? '✓ Link Copied!' : '🔗 Copy Link'}
                </button>
                <a 
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ background: '#0A66C2', color: '#ffffff', padding: '0.45rem 0.9rem', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 700, textDecoration: 'none' }}
                >
                  in LinkedIn
                </a>
              </div>

              <button 
                onClick={handleToggleLike}
                style={{ background: liked ? '#FEF2F2' : '#ffffff', color: liked ? '#E52B2B' : '#475569', border: liked ? '1px solid #E52B2B' : '1px solid #CBD5E1', padding: '0.45rem 1rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', transition: 'all 0.2s' }}
              >
                {liked ? '❤️ Appreciated' : '👍 Helpful'} ({likeCount})
              </button>
            </div>

            {/* Lead Excerpt */}
            <div style={{ 
              fontSize: '1.25rem', 
              lineHeight: 1.6, 
              color: '#0F172A', 
              fontWeight: 700, 
              borderLeft: '5px solid #E52B2B', 
              background: '#FFF5F5',
              padding: '1.5rem 1.8rem',
              borderRadius: '0 12px 12px 0',
              marginBottom: '2.5rem'
            }}>
              {article.excerpt}
            </div>

            {/* Executive Highlights Summary Box */}
            <div style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', color: '#ffffff', borderRadius: '14px', padding: '2rem', marginBottom: '3rem', border: '1px solid rgba(229, 43, 43, 0.4)', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#F87171', fontWeight: 900, fontSize: '0.88rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.8rem' }}>
                <span>⚡ Executive Key Takeaways</span>
              </div>
              <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#E2E8F0', lineHeight: 1.75, fontSize: '0.98rem' }}>
                <li style={{ marginBottom: '0.6rem' }}><strong>Technical Rigor:</strong> Prioritize scenario-based system architecture over syntax memorization during developer interviews.</li>
                <li style={{ marginBottom: '0.6rem' }}><strong>Synchronous Overlap:</strong> Maintain at least a 4-hour daily overlap window for daily standups, code reviews, and sprint grooming.</li>
                <li style={{ marginBottom: '0.6rem' }}><strong>Turnaround Speed:</strong> Scrizians pre-vetted roster eliminates 6+ weeks of traditional recruiting overhead, deploying senior engineers in under 48 hours.</li>
              </ul>
            </div>

            {/* Main Article Body Text */}
            <div style={{ fontSize: '1.08rem', lineHeight: 1.85, color: '#334155' }}>
              {(article.content || article.body) ? (
                <div>
                  {(article.content || article.body).split(/\n+/).map((para: string, idx: number) => {
                    const trimmed = para.trim();
                    if (!trimmed) return null;
                    if (/^(#|\d+\.|\bSection\b)/i.test(trimmed)) {
                      return (
                        <h2 
                          key={idx} 
                          id={`section-${idx + 1}`}
                          style={{ fontSize: '1.75rem', color: '#0F172A', fontWeight: 800, marginTop: '2.5rem', marginBottom: '1.2rem', borderBottom: '2px solid #F1F5F9', paddingBottom: '0.6rem', scrollMarginTop: '100px' }}
                        >
                          {trimmed.replace(/^#+\s*/, '')}
                        </h2>
                      );
                    }
                    return (
                      <p key={idx} style={{ marginBottom: '1.4rem' }}>
                        {trimmed}
                      </p>
                    );
                  })}
                </div>
              ) : (
                <div>
                  <section id="section-1" style={{ scrollMarginTop: '100px', marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '1.75rem', color: '#0F172A', fontWeight: 800, marginBottom: '1.2rem', borderBottom: '2px solid #F1F5F9', paddingBottom: '0.6rem' }}>
                      1. Architectural Overview & Strategic Insights
                    </h2>
                    <p style={{ marginBottom: '1.4rem' }}>
                      {article.excerpt || `In today's fast-moving software ecosystem, engineering leaders face increasing demand to deliver high-performance applications while maintaining clean code architecture and operational efficiency.`}
                    </p>
                    <p style={{ marginBottom: '1.4rem' }}>
                      {`Evaluating senior engineering talent for ${article.title} requires moving beyond syntax memorization toward real-world system design, component reusability, state management, and production reliability under high load.`}
                    </p>
                    <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderLeft: '4px solid #2563EB', padding: '1.4rem 1.6rem', borderRadius: '8px', margin: '2rem 0', color: '#1E40AF' }}>
                      <div style={{ fontWeight: 800, fontSize: '0.95rem', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        💡 Scrizians Engineering Directives
                      </div>
                      <div style={{ fontSize: '0.94rem', lineHeight: 1.6 }}>
                        {`When building teams for ${article.category || 'tech innovation'}, conduct 30-minute live code walkthroughs of production modules to observe candidate problem-solving and architectural decision-making.`}
                      </div>
                    </div>
                  </section>

                  <section id="section-2" style={{ scrollMarginTop: '100px', marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '1.75rem', color: '#0F172A', fontWeight: 800, marginBottom: '1.2rem', borderBottom: '2px solid #F1F5F9', paddingBottom: '0.6rem' }}>
                      2. Time Zone Overlap & Collaboration Best Practices
                    </h2>
                    <p style={{ marginBottom: '1.4rem' }}>
                      {`Distributed development models achieve maximum throughput when teams standardize daily 4-hour synchronous overlap windows between US/European engineering leads and offshore developer squads.`}
                    </p>
                    <p style={{ marginBottom: '1.4rem' }}>
                      {`During this overlap window, teams conduct daily standups, unblock PR code reviews, and clarify ticket specifications on Slack and GitHub, followed by deep focus coding shifts.`}
                    </p>
                  </section>

                  <section id="section-3" style={{ scrollMarginTop: '100px', marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '1.75rem', color: '#0F172A', fontWeight: 800, marginBottom: '1.2rem', borderBottom: '2px solid #F1F5F9', paddingBottom: '0.6rem' }}>
                      3. Onboarding & Retaining Top Engineering Talent
                    </h2>
                    <p style={{ marginBottom: '1.4rem' }}>
                      {`Structured onboarding dramatically accelerates developer velocity. Scrizians provides pre-screened senior engineers equipped with clear environment setup docs, sandbox credentials, and dedicated account managers to handle administrative compliance.`}
                    </p>
                  </section>

                  <section id="section-4" style={{ scrollMarginTop: '100px', marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '1.75rem', color: '#0F172A', fontWeight: 800, marginBottom: '1.2rem', borderBottom: '2px solid #F1F5F9', paddingBottom: '0.6rem' }}>
                      4. Why Global Engineering Teams Choose Scrizians
                    </h2>
                    <p style={{ marginBottom: '1.6rem' }}>
                      {`Scrizians bridges top-tier global enterprises with elite Indian developer talent through rigorous multi-stage vetting, transparent pricing, and zero-risk 14-day trials.`}
                    </p>
                  </section>
                </div>
              )}
            </div>

            {/* Article Tags */}
            <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>Tags:</span>
              {['#OffshoreEngineering', '#TechTalent', '#NextJS', '#ReactJS', '#ScriziansSquads'].map(tag => (
                <span key={tag} style={{ background: '#F1F5F9', color: '#475569', padding: '0.3rem 0.8rem', borderRadius: '14px', fontSize: '0.82rem', fontWeight: 600 }}>
                  {tag}
                </span>
              ))}
            </div>

            {/* Author Bio Box */}
            <div style={{ marginTop: '3rem', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#E52B2B', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', fontWeight: 900, flexShrink: 0 }}>
                S
              </div>
              <div style={{ flex: 1, minWidth: '220px' }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0F172A' }}>Written by Scrizians Insights Team</h3>
                <p style={{ margin: '0.4rem 0 0.8rem 0', fontSize: '0.88rem', color: '#64748B', lineHeight: 1.5 }}>
                  Curated by Scrizians senior talent architects and engineering managers specializing in building distributed software teams for scale.
                </p>
                <button 
                  onClick={() => setIsLeadModalOpen(true)}
                  style={{ background: '#0F172A', color: '#ffffff', border: 'none', padding: '0.45rem 1rem', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  Consult with an Architect →
                </button>
              </div>
            </div>

            {/* Back Button & CTA */}
            <div style={{ marginTop: '3.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <Link href="/insights" style={{ color: '#0F172A', fontWeight: 800, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#F1F5F9', padding: '0.7rem 1.4rem', borderRadius: '8px', transition: 'all 0.2s' }}>
                ← Back to All Insights
              </Link>

              <button 
                onClick={() => setIsLeadModalOpen(true)}
                style={{ background: '#E52B2B', color: '#ffffff', border: 'none', padding: '0.75rem 1.6rem', borderRadius: '8px', fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 14px rgba(229, 43, 43, 0.3)' }}
              >
                Request Custom Developer Roster
              </button>
            </div>

          </article>

          {/* Sticky Sidebar (Right) */}
          <aside style={{ position: 'sticky', top: '100px' }}>
            
            {/* Table of Contents Widget */}
            <div style={{ background: '#ffffff', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.8rem', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
              <h3 style={{ margin: '0 0 1rem 0', fontSize: '0.95rem', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.6px', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                📑 On This Page
              </h3>
              <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.88rem' }}>
                {tocItems.map(item => (
                  <a 
                    key={item.id}
                    href={`#${item.id}`}
                    style={{ 
                      color: activeSection === item.id ? '#E52B2B' : '#64748B', 
                      fontWeight: activeSection === item.id ? 800 : 500,
                      textDecoration: 'none',
                      paddingLeft: activeSection === item.id ? '0.6rem' : '0rem',
                      borderLeft: activeSection === item.id ? '3px solid #E52B2B' : 'none',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {item.title}
                  </a>
                ))}
              </nav>
            </div>

            {/* Quick Hire Talent Card Widget */}
            <div style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', color: '#ffffff', border: '2px solid #E52B2B', borderRadius: '14px', padding: '1.8rem 1.4rem', textAlign: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.12)' }}>
              <span style={{ background: '#E52B2B', color: '#ffffff', fontSize: '0.72rem', fontWeight: 900, textTransform: 'uppercase', padding: '0.25rem 0.7rem', borderRadius: '12px', letterSpacing: '0.8px' }}>
                HIRING FAST TRACK
              </span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, margin: '1rem 0 0.6rem 0', color: '#ffffff', lineHeight: 1.25 }}>
                Build Your Offshore Squad in 48h
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#94A3B8', margin: '0 0 1.4rem 0', lineHeight: 1.5 }}>
                Pre-vetted React, Next.js, Node, and DevOps engineers ready for deployment with a 14-day zero risk trial.
              </p>
              <button 
                onClick={() => setIsLeadModalOpen(true)}
                style={{ width: '100%', background: '#E52B2B', color: '#ffffff', border: 'none', padding: '0.8rem 1rem', borderRadius: '8px', fontWeight: 800, fontSize: '0.92rem', cursor: 'pointer', transition: 'transform 0.2s ease' }}
              >
                Hire Developers Now →
              </button>
            </div>

          </aside>

        </div>

        {/* Related Articles Cards Section */}
        {relatedArticles.length > 0 && (
          <div style={{ marginTop: '5rem', paddingTop: '3rem', borderTop: '2px solid #E2E8F0' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
              <div>
                <span style={{ color: '#E52B2B', fontWeight: 800, fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Explore Further</span>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0F172A', margin: '0.2rem 0 0 0' }}>Related Articles & Insights</h3>
              </div>
              <Link href="/insights" style={{ color: '#E52B2B', fontWeight: 800, textDecoration: 'none', fontSize: '0.92rem' }}>
                View All Guides →
              </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.8rem' }}>
              {relatedArticles.map(rel => (
                <Link key={rel.id} href={`/insights/${rel.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div style={{ background: '#ffffff', border: '1px solid #E2E8F0', borderRadius: '12px', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column', transition: 'all 0.25s ease' }}>
                    <div style={{ height: '160px', overflow: 'hidden' }}>
                      <img src={rel.coverImageUrl || rel.image} alt={rel.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ padding: '1.4rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: '#E52B2B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.6px' }}>{rel.category || 'GUIDE'}</span>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0.5rem 0 0.8rem 0', color: '#0F172A', lineHeight: 1.35 }}>{rel.title}</h4>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.8rem', borderTop: '1px solid #F1F5F9' }}>
                        <span>⏱️ {rel.readTime || '5 min read'}</span>
                        <span style={{ fontWeight: 700, color: '#0F172A' }}>Read Article →</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* CTA Red Hero Footer Band */}
      <section style={{ 
        backgroundColor: '#E52B2B', 
        backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 14px, rgba(0,0,0,0.05) 14px, rgba(0,0,0,0.05) 28px)',
        color: '#ffffff',
        padding: '4.5rem 1.5rem'
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem' }}>
          <div style={{ maxWidth: '680px' }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '0.6rem', color: '#ffffff', lineHeight: 1.2 }}>Ready to scale your software engineering capabilities?</h2>
            <p style={{ fontSize: '1.05rem', color: '#ffffff', opacity: 0.95, margin: 0 }}>
              Connect with Scrizians today and receive custom developer profiles tailored to your exact tech stack in under 48 hours.
            </p>
          </div>
          <button 
            onClick={() => setIsLeadModalOpen(true)}
            style={{ background: '#0F172A', color: '#ffffff', padding: '1rem 2.2rem', borderRadius: '8px', fontWeight: 800, fontSize: '1rem', border: 'none', cursor: 'pointer', boxShadow: '0 8px 24px rgba(0,0,0,0.25)' }}
          >
            Schedule Hiring Call
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

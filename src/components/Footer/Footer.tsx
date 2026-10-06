'use client';

import React from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';

export const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      {/* Sitemap Main Grid Container */}
      <div className={styles.inner}>
        {/* Brand & Identity Column */}
        <div className={styles.brandCol}>
          <Link href="/" className={styles.logoRow}>
            <img src="/images/logo-white.png" alt="Scrizians Logo" className={styles.footerLogoImg} />
          </Link>
          <div className={styles.tagline}>Talent. Technology. Together.</div>
          <p className={styles.parentText}>
            Global technology talent & managed software delivery platform powered by <a href="https://www.scriza.in/" target="_blank" rel="noopener noreferrer" className={styles.scrizaLink}>Scriza Private Limited</a>.
          </p>
          <div className={styles.contactDetails}>
            <a href="tel:+919119112999" className={styles.contactBadge}>
              <span className={styles.contactIcon}>📞</span> +91 91191 12999
            </a>
            <a href="mailto:support@scrizians.com" className={styles.contactBadge}>
              <span className={styles.contactIcon}>✉️</span> support@scrizians.com
            </a>
            <div className={styles.locationText}>
              📍 Noida, Delhi NCR & Global Remote Operations
            </div>
          </div>
        </div>

        {/* Column 1: Hire Talent */}
        <div className={styles.navCol}>
          <h4 className={styles.colTitle}>Hire Tech Talent</h4>
          <ul className={styles.linkList}>
            <li><Link href="/hire-developers-from-india">Hire Developers from India</Link></li>
            <li><Link href="/hire-talent?role=fullstack">Full Stack Developers</Link></li>
            <li><Link href="/hire-talent?role=frontend">Frontend Specialists</Link></li>
            <li><Link href="/hire-talent?role=backend">Backend Engineers</Link></li>
            <li><Link href="/hire-talent?role=devops">DevOps & Cloud Engineers</Link></li>
            <li><Link href="/hire-talent?role=aiml">AI / ML & Data Engineers</Link></li>
            <li><Link href="/hire-talent?role=uiux">UI/UX Product Designers</Link></li>
          </ul>
        </div>

        {/* Column 2: Solutions & Models */}
        <div className={styles.navCol}>
          <h4 className={styles.colTitle}>Solutions & Pricing</h4>
          <ul className={styles.linkList}>
            <li><Link href="/pricing">Pricing & Engagement Models</Link></li>
            <li><Link href="/solutions#staff-augmentation">Staff Augmentation</Link></li>
            <li><Link href="/solutions#dedicated-developers">Dedicated Developers</Link></li>
            <li><Link href="/solutions#dedicated-team">Dedicated Offshore ODC</Link></li>
            <li><Link href="/solutions#remote-team">Remote Managed Projects</Link></li>
            <li><Link href="/solutions#custom-delivery">Turnkey Delivery</Link></li>
          </ul>
        </div>

        {/* Column 3: Tech & Work */}
        <div className={styles.navCol}>
          <h4 className={styles.colTitle}>Tech & Portfolio</h4>
          <ul className={styles.linkList}>
            <li><Link href="/technologies">React & Next.js Stack</Link></li>
            <li><Link href="/technologies">Node.js & Python Systems</Link></li>
            <li><Link href="/technologies">Java & Spring Architecture</Link></li>
            <li><Link href="/technologies">Cloud & Kubernetes IaC</Link></li>
            <li><Link href="/portfolio">Portfolio Showcase</Link></li>
            <li><Link href="/case-studies">Client Case Studies</Link></li>
          </ul>
        </div>

        {/* Column 4: Company & Platform */}
        <div className={styles.navCol}>
          <h4 className={styles.colTitle}>Company & Platform</h4>
          <ul className={styles.linkList}>
            <li><Link href="/about">About Scrizians</Link></li>
            <li><Link href="/about-scriza">About Scriza (Parent Org)</Link></li>
            <li><Link href="/become-a-scrizian">Join Scrizian Network</Link></li>
            <li><Link href="/jobs">Jobs & Careers</Link></li>
            <li><Link href="/insights">Insights & Engineering Blog</Link></li>
            <li><Link href="/write-for-scrizians">Write for Scrizians</Link></li>
            <li><Link href="/contact">Contact Support</Link></li>
          </ul>
        </div>
      </div>

      {/* Designer Sitemap Ribbon Bar */}
      <div className={styles.sitemapRibbonSection}>
        <div className={styles.sitemapRibbonInner}>
          <span className={styles.sitemapLabel}>PLATFORM SITEMAP:</span>
          <div className={styles.sitemapBadges}>
            <Link href="/">Home</Link>
            <span className={styles.dot}>•</span>
            <Link href="/hire-talent">Hire Talent</Link>
            <span className={styles.dot}>•</span>
            <Link href="/talent">Talent Network</Link>
            <span className={styles.dot}>•</span>
            <Link href="/pricing">Pricing</Link>
            <span className={styles.dot}>•</span>
            <Link href="/solutions">Solutions</Link>
            <span className={styles.dot}>•</span>
            <Link href="/technologies">Technologies</Link>
            <span className={styles.dot}>•</span>
            <Link href="/case-studies">Case Studies</Link>
            <span className={styles.dot}>•</span>
            <Link href="/jobs">Jobs</Link>
            <span className={styles.dot}>•</span>
            <Link href="/insights">Insights</Link>
            <span className={styles.dot}>•</span>
            <Link href="/about">About</Link>
            <span className={styles.dot}>•</span>
            <Link href="/about-scriza">Scriza Org</Link>
            <span className={styles.dot}>•</span>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
      </div>

      {/* Clean & Professional Bottom Bar */}
      <div className={styles.bottomBar}>
        <div className={styles.copyText}>
          © 2026 <a href="https://www.scriza.in/" target="_blank" rel="noopener noreferrer" className={styles.scrizaLink}>Scriza Private Limited</a>. All rights reserved.
        </div>
        
        <div className={styles.securityBadge}>
          <span className={styles.shieldIcon}>🔒</span> ISO & Enterprise Grade Security Verified
        </div>

        <div className={styles.policyLinks}>
          <Link href="/policies/privacy">Privacy Policy</Link>
          <Link href="/policies/terms">Terms of Service</Link>
          <Link href="/policies/cookie-policy">Cookie Policy</Link>
          <Link href="/policies/grievance">Trust & Security</Link>
        </div>
      </div>
    </footer>
  );
};

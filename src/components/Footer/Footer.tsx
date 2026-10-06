'use client';

import React from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';

export const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        {/* Brand & Identity */}
        <div className={styles.brandCol}>
          <Link href="/" className={styles.logoRow}>
            <div className={styles.footerLogoBadge}>
              <img src="/images/logo-white.png" alt="Scrizians Logo" className={styles.footerLogoImg} />
            </div>
          </Link>
          <div className={styles.tagline}>Talent. Technology. Together.</div>
          <p className={styles.parentText}>
            Global technology talent & software delivery platform by <strong>Scriza Private Limited</strong>.
          </p>
          <a href="tel:+919119112999" className={styles.phoneNum}>
            📞 +91 91191 12999
          </a>
        </div>

        {/* Hire Talent */}
        <div>
          <h4 className={styles.colTitle}>Hire Talent</h4>
          <ul className={styles.linkList}>
            <li><Link href="/hire-talent?role=fullstack">Full Stack Developers</Link></li>
            <li><Link href="/hire-talent?role=frontend">Frontend Specialists</Link></li>
            <li><Link href="/hire-talent?role=backend">Backend Engineers</Link></li>
            <li><Link href="/hire-talent?role=devops">DevOps & Cloud Engineers</Link></li>
            <li><Link href="/hire-talent?role=uiux">UI/UX Product Designers</Link></li>
          </ul>
        </div>

        {/* Solutions */}
        <div>
          <h4 className={styles.colTitle}>Solutions</h4>
          <ul className={styles.linkList}>
            <li><Link href="/solutions#staff-augmentation">Staff Augmentation</Link></li>
            <li><Link href="/solutions#dedicated-developers">Dedicated Developers</Link></li>
            <li><Link href="/solutions#dedicated-team">Dedicated Offshore Team</Link></li>
            <li><Link href="/solutions#remote-team">Remote Managed Team</Link></li>
          </ul>
        </div>

        {/* Company & Platform */}
        <div>
          <h4 className={styles.colTitle}>Company</h4>
          <ul className={styles.linkList}>
            <li><Link href="/about">About Scrizians</Link></li>
            <li><Link href="/portfolio">Portfolio</Link></li>
            <li><Link href="/case-studies">Case Studies</Link></li>
            <li><Link href="/jobs">Jobs & Careers</Link></li>
            <li><Link href="/insights">Insights & News</Link></li>
            <li><Link href="/become-a-scrizian">Join Scrizian Network</Link></li>
            <li><Link href="/contact">Contact Support</Link></li>
          </ul>
        </div>
      </div>

      {/* Clean & Professional Bottom Bar */}
      <div className={styles.bottomBar}>
        <div>© 2026 Scriza Private Limited. All rights reserved.</div>
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

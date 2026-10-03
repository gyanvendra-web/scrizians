'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCurrency } from '@/context/CurrencyContext';
import styles from './Header.module.css';

interface HeaderProps {
  onOpenLeadModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenLeadModal }) => {
  const { currency, toggleCurrency } = useCurrency();
  const pathname = usePathname();
  const [loggedInUser, setLoggedInUser] = React.useState<any>(null);

  React.useEffect(() => {
    const stored = localStorage.getItem('scrizians_user');
    if (stored) {
      try {
        setLoggedInUser(JSON.parse(stored));
      } catch (e) {}
    }
  }, []);

  const getDashboardHref = () => {
    if (!loggedInUser) return '/login';
    if (loggedInUser.role === 'admin' || loggedInUser.role === 'scriza_staff') return '/dashboard/admin';
    if (loggedInUser.role === 'client') return '/dashboard/client';
    if (loggedInUser.role === 'contributor') return '/dashboard/contributor';
    return '/dashboard/talent';
  };

  return (
    <header className={styles.header}>
      {/* Top Bar */}
      <div className={styles.topbar}>
        <div className={styles.topbarInner}>
          <span>Talent. Technology. Together.</span>
          <div className={styles.topRight}>
            <a href="tel:+919119112999" className={styles.phoneLink}>
              📞 +91 91191 12999
            </a>
            <div className={styles.currencyToggle}>
              <button 
                className={`${styles.currBtn} ${currency === 'USD' ? styles.currBtnActive : ''}`}
                onClick={() => toggleCurrency('USD')}
              >
                $ USD
              </button>
              <button 
                className={`${styles.currBtn} ${currency === 'INR' ? styles.currBtnActive : ''}`}
                onClick={() => toggleCurrency('INR')}
              >
                ₹ INR
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <div className={styles.mainNav}>
        <div className={styles.inner}>
          <Link href="/" className={styles.brand}>
            <img src="/images/logo.png" alt="Scrizians Logo" className={styles.brandImg} />
          </Link>

          <nav className={styles.nav}>
            {[
              { href: '/hire-talent', label: 'Hire Talent' },
              { href: '/talent', label: 'Talent Network' },
              { href: '/solutions', label: 'Solutions' },
              { href: '/technologies', label: 'Technologies' },
              { href: '/case-studies', label: 'Case Studies' },
              { href: '/jobs', label: 'Jobs' },
              { href: '/insights', label: 'Insights' }
            ].map(link => (
              <Link 
                key={link.href}
                href={link.href} 
                className={`${styles.navLink} ${pathname === link.href ? styles.navLinkActiveRedText : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className={styles.actions}>
            <Link href="/become-a-scrizian" className={styles.btnBecome}>
              Become a Scrizian
            </Link>
            {onOpenLeadModal ? (
              <button 
                className={styles.btnHire} 
                onClick={onOpenLeadModal}
              >
                Hire Talent
              </button>
            ) : (
              <Link href="/hire-talent" className={styles.btnHire}>
                Hire Talent
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

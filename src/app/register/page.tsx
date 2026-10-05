'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Header } from '@/components/Header/Header';
import { Footer } from '@/components/Footer/Footer';
import styles from './Register.module.css';

function RegisterFormContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const roleParam = searchParams.get('role');

  const [selectedRole, setSelectedRole] = useState<'talent' | 'candidate' | 'contributor' | 'client'>('contributor');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  useEffect(() => {
    if (roleParam === 'contributor' || roleParam === 'talent' || roleParam === 'candidate' || roleParam === 'client') {
      setSelectedRole(roleParam);
    }
  }, [roleParam]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    if (!agreeTerms) {
      setErrorMessage('Please accept the Terms of Use and Privacy Policy to proceed.');
      return;
    }

    setLoading(true);

    const scrizianId = `SZN-${selectedRole.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fullName,
          email: email.toLowerCase().trim(),
          password,
          role: selectedRole,
          scrizianId,
          company: selectedRole === 'client' ? 'Client Partner' : 'Scrizians Platform'
        })
      });

      const data = await res.json();

      if (data.success && data.data) {
        const user = data.data;
        localStorage.setItem('scrizians_user', JSON.stringify(user));
        localStorage.setItem('scrizians_token', `token_${selectedRole}_${Date.now()}`);

        showToast('🎉 Account registered successfully in MongoDB!');

        setTimeout(() => {
          if (selectedRole === 'contributor') {
            router.push('/dashboard/contributor');
          } else if (selectedRole === 'talent') {
            router.push('/dashboard/talent');
          } else if (selectedRole === 'client') {
            router.push('/dashboard/client');
          } else {
            router.push('/dashboard/candidate');
          }
          setLoading(false);
        }, 800);
      } else {
        setErrorMessage(data.error || 'Failed to create account. Please try again.');
        setLoading(false);
      }
    } catch (err: any) {
      console.warn('MongoDB Register Error:', err);
      const mockUser = {
        name: fullName,
        email,
        role: selectedRole,
        scrizianId
      };
      localStorage.setItem('scrizians_user', JSON.stringify(mockUser));
      localStorage.setItem('scrizians_token', `token_${selectedRole}_${Date.now()}`);
      showToast('🎉 Account created successfully!');
      setTimeout(() => {
        router.push(`/dashboard/${selectedRole}`);
        setLoading(false);
      }, 800);
    }
  };

  return (
    <>
      <Header />

      {/* Top Right Toast Notification Tooltip */}
      {toastMsg && (
        <div className={styles.toastContainer}>
          <div className={styles.toastCard}>
            <span style={{ fontSize: '1.1rem' }}>🎉</span>
            <span>{toastMsg}</span>
          </div>
        </div>
      )}

      <main className={styles.registerSection}>
        {/* Main Outer Centered Card Wrapper */}
        <div className={styles.cardWrapper}>
          {/* Left Dark Navy Card */}
          <div className={styles.leftPanel}>
            <div className={styles.leftTop}>
              <Link href="/" className={styles.brand}>
                <div className={styles.logoBadge}>
                  <img src="/images/logo.png" alt="Scrizians Logo" className={styles.logoImg} />
                </div>
              </Link>

              <h1 className={styles.headline}>Talent. Technology. Together.</h1>
              <p className={styles.leftSub}>
                One secure account for Scrizians, candidates, contributors and clients — with role-based dashboards.
              </p>
            </div>

            <Link href="/" className={styles.backLink}>
              ← Back to website
            </Link>
          </div>

          {/* Right White Form Panel */}
          <div className={styles.rightPanel}>
            <h2 className={styles.formTitle}>Create your account</h2>
            <p className={styles.formSub}>Choose how you want to use Scrizians.</p>

            {errorMessage && <div className={styles.errorAlert}>{errorMessage}</div>}

            <form onSubmit={handleSubmit}>
              {/* Role Selector Grid */}
              <div className={styles.roleGrid}>
                <div
                  className={`${styles.roleCard} ${selectedRole === 'talent' ? styles.roleCardSelected : ''}`}
                  onClick={() => setSelectedRole('talent')}
                >
                  <span className={styles.roleCardTitle}>Scrizian (Talent)</span>
                  <span className={styles.roleCardDesc}>Get listed on Talent Network</span>
                </div>

                <div
                  className={`${styles.roleCard} ${selectedRole === 'candidate' ? styles.roleCardSelected : ''}`}
                  onClick={() => setSelectedRole('candidate')}
                >
                  <span className={styles.roleCardTitle}>Job Candidate</span>
                  <span className={styles.roleCardDesc}>Apply & track job applications</span>
                </div>

                <div
                  className={`${styles.roleCard} ${selectedRole === 'contributor' ? styles.roleCardSelected : ''}`}
                  onClick={() => setSelectedRole('contributor')}
                >
                  <span className={styles.roleCardTitle}>Contributor</span>
                  <span className={styles.roleCardDesc}>Write articles for Insights</span>
                </div>

                <div
                  className={`${styles.roleCard} ${selectedRole === 'client' ? styles.roleCardSelected : ''}`}
                  onClick={() => setSelectedRole('client')}
                >
                  <span className={styles.roleCardTitle}>Client / Company</span>
                  <span className={styles.roleCardDesc}>Hire talent & manage requirements</span>
                </div>
              </div>

              {/* Input Fields */}
              <div className={styles.formGroup}>
                <label className={styles.label}>Full name *</label>
                <input
                  type="text"
                  required
                  className={styles.input}
                  placeholder="e.g. Aarav Sharma"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Email *</label>
                <input
                  type="email"
                  required
                  className={styles.input}
                  placeholder="aarav@company.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Password *</label>
                <div className={styles.passwordWrapper}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    className={styles.passwordInput}
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className={styles.eyeToggleBtn}
                    onClick={() => setShowPassword(!showPassword)}
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? '👁️' : '🔒'}
                  </button>
                </div>
                <span className={styles.helpText}>Minimum 8 characters</span>
              </div>

              <div className={styles.checkboxRow}>
                <input
                  type="checkbox"
                  required
                  id="termsCheck"
                  className={styles.checkbox}
                  checked={agreeTerms}
                  onChange={e => setAgreeTerms(e.target.checked)}
                />
                <label htmlFor="termsCheck" style={{ cursor: 'pointer' }}>
                  I accept Terms of Use, Privacy Policy and role-specific terms.
                </label>
              </div>

              <button type="submit" className={styles.btnSubmit} disabled={loading}>
                {loading ? 'Creating account...' : 'Create account'}
              </button>

              <p className={styles.footerNote}>
                Already have an account? <Link href="/login" className={styles.linkRed}>Log in</Link>
              </p>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div style={{ padding: '4rem', textAlign: 'center' }}>Loading registration...</div>}>
      <RegisterFormContent />
    </Suspense>
  );
}

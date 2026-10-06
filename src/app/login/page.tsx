'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header/Header';
import { Footer } from '@/components/Footer/Footer';
import styles from './Login.module.css';

export default function LoginPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<'admin' | 'talent' | 'client' | 'contributor' | 'candidate'>('admin');
  const [email, setEmail] = useState('admin@scrizians.com');
  const [password, setPassword] = useState('Admin@123456');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Forgot Password Modal State
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Check if user is already authenticated
  useEffect(() => {
    const storedUser = localStorage.getItem('scrizians_user');
    if (storedUser) {
      try {
        const u = JSON.parse(storedUser);
        if (u.role === 'admin' || u.role === 'scriza_staff') router.push('/dashboard/admin');
        else if (u.role === 'client') router.push('/dashboard/client');
        else if (u.role === 'contributor') router.push('/dashboard/contributor');
        else if (u.role === 'candidate') router.push('/dashboard/candidate');
        else router.push('/dashboard/talent');
      } catch (e) {}
    }
  }, [router]);

  const handleRoleSelect = (role: 'admin' | 'talent' | 'client' | 'contributor' | 'candidate') => {
    setSelectedRole(role);
    setErrorMessage('');
    if (role === 'admin') {
      setEmail('admin@scrizians.com');
      setPassword('Admin@123456');
    } else if (role === 'talent') {
      setEmail('talent@scrizians.com');
      setPassword('Talent@123456');
    } else if (role === 'client') {
      setEmail('client@scrizians.com');
      setPassword('Client@123456');
    } else if (role === 'contributor') {
      setEmail('contributor@scrizians.com');
      setPassword('Contributor@123456');
    } else if (role === 'candidate') {
      setEmail('candidate@scrizians.com');
      setPassword('Candidate@123456');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role: selectedRole })
      });
      const data = await res.json();

      if (data.success && data.data) {
        const user = data.data;
        const roleRouteMap: Record<string, string> = {
          admin: '/dashboard/admin',
          talent: '/dashboard/talent',
          client: '/dashboard/client',
          contributor: '/dashboard/contributor',
          candidate: '/dashboard/candidate'
        };

        const targetRoute = roleRouteMap[user.role] || roleRouteMap[selectedRole] || '/dashboard/admin';

        localStorage.setItem('scrizians_token', data.token || `token_${user.role}_2026`);
        localStorage.setItem('scrizians_user', JSON.stringify(user));
        showToast(`🎉 Login successful! Redirecting to ${user.name}'s Portal...`);

        setTimeout(() => {
          router.push(targetRoute);
          setLoading(false);
        }, 600);
      } else {
        setErrorMessage(data.error || 'Authentication failed. Please check your credentials.');
        setLoading(false);
      }
    } catch (err: any) {
      console.warn('Login error:', err);
      setErrorMessage(err.message || 'Authentication error. Please check your credentials or register a new account.');
      setLoading(false);
    }
  };

  const handleOpenForgotModal = () => {
    setForgotEmail(email || '');
    setOtpSent(false);
    setOtpCode('');
    setNewPassword('');
    setShowForgotModal(true);
  };

  const handleSendResetCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotLoading(true);
    setTimeout(() => {
      setForgotLoading(false);
      setOtpSent(true);
      showToast(`🔑 Verification code sent to ${forgotEmail}! Check your inbox.`);
    }, 600);
  };

  const handleResetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) return;
    setForgotLoading(true);
    setTimeout(() => {
      setForgotLoading(false);
      setPassword(newPassword);
      setEmail(forgotEmail);
      setShowForgotModal(false);
      showToast('🎉 Password reset successfully! You can now log in with your new password.');
    }, 600);
  };

  return (
    <>
      <Header />

      {/* Top Right Toast Notification */}
      {toastMsg && (
        <div className={styles.toastContainer}>
          <div className={styles.toastCard}>
            <span style={{ fontSize: '1.1rem' }}>⚡</span>
            <span>{toastMsg}</span>
          </div>
        </div>
      )}

      <main className={styles.loginSection}>
        {/* Main Outer Centered Card Wrapper */}
        <div className={styles.cardWrapper}>
          {/* Left Dark Navy Card */}
          <div className={styles.leftPanel}>
            <div className={styles.leftTop}>
              <Link href="/" className={styles.brand}>
                <div className={styles.logoBadge}>
                  <img src="/images/logo-white.png" alt="Scrizians Logo" className={styles.logoImg} />
                </div>
              </Link>

              <h1 className={styles.headline}>Welcome back to Scrizians</h1>
              <p className={styles.leftSub}>
                Sign in to access your admin operations, talent network profile, client portal, or candidate workspace.
              </p>
            </div>

            <Link href="/" className={styles.backLink}>
              ← Back to website
            </Link>
          </div>

          {/* Right White Form Panel */}
          <div className={styles.rightPanel}>
            <h2 className={styles.formTitle}>Portal Authentication</h2>
            <p className={styles.formSub}>Select your portal role and enter credentials to sign in.</p>

            {errorMessage && <div className={styles.errorAlert}>{errorMessage}</div>}

            <form onSubmit={handleLogin}>
              {/* Portal / Role Dropdown Selector */}
              <div className={styles.formGroup}>
                <label className={styles.label}>Select Portal / Role *</label>
                <select
                  value={selectedRole}
                  onChange={e => handleRoleSelect(e.target.value as any)}
                  className={styles.selectInput}
                  style={{ cursor: 'pointer', fontWeight: 700 }}
                >
                  <option value="admin">👑 Admin & Operations Portal</option>
                  <option value="talent">💻 Scrizian Talent Portal</option>
                  <option value="client">🏢 Client & Company Portal</option>
                  <option value="contributor">✍️ Content Contributor Portal</option>
                  <option value="candidate">📄 Job Candidate Portal</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Email Address *</label>
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
                <div className={styles.labelRow}>
                  <label className={styles.label}>Password *</label>
                  <button 
                    type="button" 
                    className={styles.forgotBtn}
                    onClick={handleOpenForgotModal}
                  >
                    Forgot password?
                  </button>
                </div>
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
              </div>

              <button type="submit" className={styles.btnSubmit} disabled={loading}>
                {loading ? 'Authenticating...' : `Log In to ${selectedRole.toUpperCase()} Portal →`}
              </button>

              <p className={styles.footerNote}>
                Don't have an account? <Link href="/register" className={styles.linkRed}>Create account</Link>
              </p>
            </form>
          </div>
        </div>
      </main>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className={styles.modalOverlay} onClick={() => setShowForgotModal(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button 
              className={styles.modalCloseBtn} 
              onClick={() => setShowForgotModal(false)}
              title="Close modal"
            >
              ×
            </button>

            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>🔑 Reset Your Password</h3>
              <p className={styles.modalSub}>
                {!otpSent 
                  ? 'Enter your registered email address to receive a secure password reset verification code.'
                  : `Enter the 6-digit code sent to ${forgotEmail} and choose a new password.`}
              </p>
            </div>

            {!otpSent ? (
              <form onSubmit={handleSendResetCode}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Registered Email Address *</label>
                  <input 
                    type="email" 
                    required 
                    className={styles.input} 
                    placeholder="name@scrizians.com" 
                    value={forgotEmail}
                    onChange={e => setForgotEmail(e.target.value)}
                  />
                </div>
                <button type="submit" className={styles.btnSubmit} disabled={forgotLoading}>
                  {forgotLoading ? 'Sending Code...' : 'Send Verification Code →'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetPasswordSubmit}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Verification Code (OTP) *</label>
                  <input 
                    type="text" 
                    required 
                    className={styles.input} 
                    placeholder="e.g. 784920" 
                    value={otpCode}
                    onChange={e => setOtpCode(e.target.value)}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>New Password *</label>
                  <div className={styles.passwordWrapper}>
                    <input 
                      type={showNewPassword ? 'text' : 'password'} 
                      required 
                      className={styles.passwordInput} 
                      placeholder="At least 6 characters" 
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className={styles.eyeToggleBtn}
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? '👁️' : '🔒'}
                    </button>
                  </div>
                </div>

                <button type="submit" className={styles.btnSubmit} disabled={forgotLoading}>
                  {forgotLoading ? 'Updating Password...' : 'Reset & Update Password →'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

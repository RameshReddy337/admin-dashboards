// src/LoginModalWithOTP.jsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import './App.css';
import { sendOtp, verifyOtp } from './Apps';

// small validators
const isEmail = (v) => typeof v === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const isPhone = (v) => typeof v === 'string' && /^\+?\d{6,15}$/.test(v.replace(/\s+/g, ''));

// helpful formatting for seconds -> mm:ss
const formatSeconds = (s) => {
  if (!s || s <= 0) return '00:00';
  const mm = String(Math.floor(s / 60)).padStart(2, '0');
  const ss = String(s % 60).padStart(2, '0');
  return `${mm}:${ss}`;
};

export default function LoginModalWithOTP({ onClose, onLogin }) {
  const [identifier, setIdentifier] = useState('');
  const [step, setStep] = useState('identify'); // identify -> otp -> loggedin
  const [error, setError] = useState('');

  const [otpInput, setOtpInput] = useState('');
  const otpExpiresAtRef = useRef(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const timerRef = useRef(null);

  const [resendCount, setResendCount] = useState(0);
  const RESEND_LIMIT = 3;

  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  // clear timer on unmount
  useEffect(() => () => clearInterval(timerRef.current), []);

  // start countdown when otpExpiresAtRef set
  useEffect(() => {
    clearInterval(timerRef.current);
    if (!otpExpiresAtRef.current) {
      setSecondsLeft(0);
      return;
    }
    timerRef.current = setInterval(() => {
      const left = Math.max(0, Math.ceil((otpExpiresAtRef.current - Date.now()) / 1000));
      setSecondsLeft(left);
      if (left <= 0) clearInterval(timerRef.current);
    }, 250);
    return () => clearInterval(timerRef.current);
  }, [otpExpiresAtRef.current]);

  // Identify submit: request server to send OTP
  const handleIdentifySubmit = async (e) => {
    e?.preventDefault();
    setError('');
    const id = identifier.trim();
    if (!id) { setError('Enter phone or email'); return; }
    if (!isEmail(id) && !isPhone(id)) { setError('Enter valid email or phone (E.164 for phone recommended)'); return; }

    setLoading(true);
    try {
      const resp = await sendOtp(id);
      // server returns expiresIn in seconds
      const expiresIn = (resp && resp.expiresIn) ? resp.expiresIn : 180;
      otpExpiresAtRef.current = Date.now() + expiresIn * 1000;
      setSecondsLeft(expiresIn);
      setStep('otp');
      setResendCount(0);
      setOtpInput('');
      // (Optionally) for dev, backend may return debug info; don't rely on it in prod.
    } catch (err) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP submit
  const handleVerifyOtp = async (e) => {
    e?.preventDefault();
    setError('');
    if (!otpInput || otpInput.length < 4) { setError('Enter a valid code'); return; }
    if (!identifier) { setError('Missing identifier'); return; }

    setLoading(true);
    try {
      const resp = await verifyOtp(identifier.trim(), otpInput.trim());
      // resp.user expected
      const loggedUser = resp.user || resp;
      setUser(loggedUser);
      // store token or session here if server returns it (jwt)
      if (resp.token) {
        localStorage.setItem('token', resp.token);
      }
      // mark logged in
      setStep('loggedin');
      if (typeof onLogin === 'function') onLogin(loggedUser);
      // cleanup OTP UI
      otpExpiresAtRef.current = null;
      setSecondsLeft(0);
      setOtpInput('');
    } catch (err) {
      setError(err.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    if (resendCount >= RESEND_LIMIT) { setError('Resend limit reached'); return; }
    if (!identifier) { setError('Missing identifier'); return; }
    setLoading(true);
    try {
      const resp = await sendOtp(identifier.trim());
      const expiresIn = (resp && resp.expiresIn) ? resp.expiresIn : 180;
      otpExpiresAtRef.current = Date.now() + expiresIn * 1000;
      setSecondsLeft(expiresIn);
      setResendCount((r) => r + 1);
      setOtpInput('');
    } catch (err) {
      setError(err.message || 'Failed to resend');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setStep('identify');
    setIdentifier('');
    setOtpInput('');
    localStorage.removeItem('token');
  };

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose?.(); }}>
      <div className="modal-card" role="dialog" aria-modal="true" aria-labelledby="login-modal-title">
        <button className="modal-close" onClick={onClose} aria-label="Close">×</button>

        {step === 'identify' && !user && (
          <>
            <h2 id="login-modal-title">Sign in with OTP</h2>
            <form className="login-form" onSubmit={handleIdentifySubmit}>
              <label>
                Email or phone
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="@gmail.com or +919701801802"
                  required
                />
              </label>

              {error && <p className="error">{error}</p>}

              <div className="modal-actions">
                <button className="btn" type="submit" disabled={loading}>{loading ? 'Sending…' : 'Send OTP'}</button>
                <button type="button" className="btn secondary" onClick={onClose}>Cancel</button>
              </div>
            </form>
            <p className="muted">We will send a one-time code to your email or phone. Use E.164 for phone numbers (eg. +919701801802).</p>
          </>
        )}

        {step === 'otp' && (
          <>
            <h2 id="login-modal-title">Enter OTP</h2>
            <form className="login-form" onSubmit={handleVerifyOtp}>
              <label>
                OTP
                <input
                  type="text"
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="6-digit code"
                  inputMode="numeric"
                  required
                />
              </label>

              <div className="otp-meta">
                <div>Expires in: <strong>{formatSeconds(secondsLeft)}</strong></div>
                <div>Resends left: <strong>{Math.max(0, RESEND_LIMIT - resendCount)}</strong></div>
              </div>

              {error && <p className="error">{error}</p>}

              <div className="modal-actions">
                <button className="btn" type="submit" disabled={loading}>{loading ? 'Verifying…' : 'Verify'}</button>
                <button type="button" className="btn secondary" onClick={() => { setStep('identify'); setError(''); }}>Change</button>
                <button type="button" className="btn" onClick={handleResend} disabled={loading || resendCount >= RESEND_LIMIT}>
                  {loading ? '…' : 'Resend'}
                </button>
              </div>
            </form>
            <p className="muted">Didn't receive? Check spam or try Resend. For development, your backend may log the OTP to console.</p>
          </>
        )}

        {step === 'loggedin' && user && (
          <>
            <h2 id="login-modal-title">Signed in</h2>
            <div className="login-details">
              <p><strong>{user.name || user.identifier || 'User'}</strong></p>
              {user.email && <p><strong>Email:</strong> {user.email}</p>}
              {user.phone && <p><strong>Phone:</strong> {user.phone}</p>}
            </div>
            <div className="modal-actions">
              <button className="btn" onClick={handleLogout}>Logout</button>
              <button className="btn secondary" onClick={onClose}>Close</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

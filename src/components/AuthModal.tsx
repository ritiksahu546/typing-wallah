import React, { useState, useEffect } from 'react';
import { ExamId } from '../types';
import { EXAMS_DATA } from '../data/exams';
import { X, Lock, Mail, User, ShieldCheck, AlertCircle, CheckCircle2, Loader2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const {
    loginWithEmail,
    signupWithEmail,
    resetPassword,
    continueAsGuest
  } = useAuth();

  const [mode, setMode] = useState<'signin' | 'register' | 'forgot'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [targetExam, setTargetExam] = useState<ExamId>('cpct');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setErrorMessage(null);
      setSuccessMessage(null);
      setLoading(false);
    }
  }, [isOpen]);

  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !loading) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, loading]);

  if (!isOpen) return null;

  const parseAuthError = (err: any): string => {
    const code = err?.code || '';
    switch (code) {
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Invalid email or password. Please try again.';
      case 'auth/email-already-in-use':
        return 'An account already exists with this email. Please sign in.';
      case 'auth/weak-password':
        return 'Password must be at least 6 characters long.';
      case 'auth/too-many-requests':
        return 'Access to this account has been temporarily disabled due to many failed login attempts. Reset your password or try again later.';
      default:
        return err?.message || 'Authentication operation could not be completed.';
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email.trim() || (!password && mode !== 'forgot')) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    setLoading(true);

    try {
      if (mode === 'signin') {
        await loginWithEmail(email, password);
        onSuccess?.();
        onClose();
      } else if (mode === 'register') {
        if (!name.trim()) {
          setErrorMessage('Please enter your full name.');
          setLoading(false);
          return;
        }
        await signupWithEmail(email, password, name, targetExam);
        onSuccess?.();
        onClose();
      } else if (mode === 'forgot') {
        await resetPassword(email);
        setSuccessMessage('Password reset instructions have been sent to your email.');
      }
    } catch (err: any) {
      setErrorMessage(parseAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGuestMode = () => {
    continueAsGuest(name || 'Guest Aspirant', targetExam);
    onSuccess?.();
    onClose();
  };

  return (
    <div
      id="auth-modal-backdrop"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex min-h-full items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) onClose();
      }}
    >
      <div
        id="auth-modal-dialog"
        className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden my-auto"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="min-w-0 pr-2">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate">
              {mode === 'signin' && 'Sign In to Your Account'}
              {mode === 'register' && 'Create Aspirant Account'}
              {mode === 'forgot' && 'Reset Your Password'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
              {mode === 'forgot'
                ? 'Enter your email address to receive a password reset link'
                : 'Save your typing speed history, accuracy stats, and exam progress'}
            </p>
          </div>
          <button
            type="button"
            id="close-auth-modal"
            onClick={onClose}
            disabled={loading}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 disabled:opacity-50 cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher (only for signin/register) */}
        {mode !== 'forgot' && (
          <div className="p-1.5 mx-6 mt-4 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center gap-1 shrink-0">
            <button
              type="button"
              id="auth-tab-signin"
              onClick={() => {
                setMode('signin');
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                mode === 'signin'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              id="auth-tab-register"
              onClick={() => {
                setMode('register');
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                mode === 'register'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>
        )}

        {/* Status Alerts */}
        {errorMessage && (
          <div className="mx-6 mt-3 p-3 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900/60 text-xs text-red-800 dark:text-red-200 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
            <span className="flex-1 leading-snug">{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mx-6 mt-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900/60 text-xs text-emerald-800 dark:text-emerald-200 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <span className="flex-1 leading-snug">{successMessage}</span>
          </div>
        )}

        {/* Form Body */}
        <form
          onSubmit={handleEmailAuth}
          className="p-6 space-y-4 overflow-y-auto"
        >
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-hidden focus:border-blue-600 dark:focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-hidden focus:border-blue-600 dark:focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                {mode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      setErrorMessage(null);
                      setSuccessMessage(null);
                    }}
                    className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-hidden focus:border-blue-600 dark:focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>
          )}

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Target Exam
              </label>
              <select
                value={targetExam}
                onChange={(e) => setTargetExam(e.target.value as ExamId)}
                disabled={loading}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-600 dark:focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm truncate"
              >
                {Object.values(EXAMS_DATA).map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.name} — {e.fullName}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Submit Action Button */}
          <div className="pt-1">
            <button
              id="auth-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 whitespace-nowrap"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Please wait...</span>
                </>
              ) : mode === 'signin' ? (
                <span>Sign In</span>
              ) : mode === 'register' ? (
                <span>Create Account</span>
              ) : (
                <span>Send Reset Link</span>
              )}
            </button>
          </div>

          {mode === 'forgot' && (
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 py-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Sign In</span>
            </button>
          )}

          {mode !== 'forgot' && (
            <button
              id="auth-guest-btn"
              type="button"
              onClick={handleGuestMode}
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors cursor-pointer text-center whitespace-nowrap"
            >
              Continue as Guest
            </button>
          )}

          <div className="pt-1 flex items-center justify-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 text-center">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>Encrypted Email & Password Authentication</span>
          </div>
        </form>
      </div>
    </div>
  );
};

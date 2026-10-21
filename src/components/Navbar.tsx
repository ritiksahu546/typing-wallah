import React, { useState, useRef, useEffect } from 'react';
import { ActivePage, ExamId, UserProfile } from '../types';
import {
  Keyboard,
  ChevronDown,
  Menu,
  X,
  Sparkles,
  Trophy,
  BookOpen,
  Globe,
  Sun,
  Moon,
  Hand,
  LogOut
} from 'lucide-react';
import { EXAMS_DATA } from '../data/exams';
import { useTheme } from '../context/ThemeContext';
import { auth, googleProvider } from '../services/firebase';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';

interface NavbarProps {
  activePage: ActivePage;
  onNavigate: (page: ActivePage, examId?: ExamId) => void;
  user: UserProfile;
  onOpenAuth: () => void;
  onUserLoginSuccess?: (user: UserProfile) => void;
  onUserLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePage,
  onNavigate,
  user,
  onOpenAuth,
  onUserLoginSuccess,
  onUserLogout
}) => {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [examsDropdownOpen, setExamsDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [authNotice, setAuthNotice] = useState<string | null>(null);

  const examsRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // 1. Real-time Firebase Auth State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const seed = (firebaseUser.displayName || firebaseUser.email || 'A')
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2) || 'A';

        const updatedProfile: UserProfile = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || 'Candidate',
          email: firebaseUser.email || '',
          avatarSeed: seed,
          photoURL: firebaseUser.photoURL || undefined,
          targetExam: user.targetExam || 'cpct',
          joinedDate: user.joinedDate || 'Recent',
          isLoggedIn: true
        };

        if (onUserLoginSuccess) {
          onUserLoginSuccess(updatedProfile);
        }
      }
    });

    return () => unsubscribe();
  }, [onUserLoginSuccess, user.targetExam, user.joinedDate]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (examsRef.current && !examsRef.current.contains(event.target as Node)) {
        setExamsDropdownOpen(false);
      }
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNav = (page: ActivePage, examId?: ExamId) => {
    onNavigate(page, examId);
    setMobileMenuOpen(false);
    setExamsDropdownOpen(false);
    setLangDropdownOpen(false);
    setUserDropdownOpen(false);
  };

  // 2. Google Sign-In with Popup
  const handleGoogleSignIn = async () => {
    try {
      setIsLoggingIn(true);
      setAuthNotice(null);
      const cred = await signInWithPopup(auth, googleProvider);
      const fbUser = cred.user;
      const seed = (fbUser.displayName || fbUser.email || 'A')
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) || 'A';

      const updatedProfile: UserProfile = {
        id: fbUser.uid,
        name: fbUser.displayName || 'Candidate',
        email: fbUser.email || '',
        avatarSeed: seed,
        photoURL: fbUser.photoURL || undefined,
        targetExam: user.targetExam || 'cpct',
        joinedDate: 'Recent',
        isLoggedIn: true
      };

      if (onUserLoginSuccess) {
        onUserLoginSuccess(updatedProfile);
      }
      setUserDropdownOpen(false);
      setMobileMenuOpen(false);
    } catch (error: any) {
      const code = error?.code || '';
      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
        // User voluntarily dismissed the sign-in window. Not an unhandled error.
        setAuthNotice('Sign-in cancelled. You can sign in anytime or use Email/Password.');
        setTimeout(() => setAuthNotice(null), 4000);
      } else if (code === 'auth/popup-blocked') {
        setAuthNotice('Popup was blocked by browser. Please allow popups or use Email login.');
        onOpenAuth();
      } else {
        console.warn('Google Sign-In notice:', error?.message || error);
        onOpenAuth();
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  // 3. Logout with signOut(auth)
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      if (onUserLogout) {
        onUserLogout();
      }
      setUserDropdownOpen(false);
      setMobileMenuOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header
      id="main-navbar"
      className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-200"
    >
      {authNotice && (
        <div
          id="auth-notice-banner"
          className="bg-amber-50 dark:bg-amber-950/70 border-b border-amber-200 dark:border-amber-900/50 px-4 py-1.5 text-center text-xs font-semibold text-amber-800 dark:text-amber-200 flex items-center justify-center space-x-2"
        >
          <span>{authNotice}</span>
          <button
            type="button"
            onClick={() => setAuthNotice(null)}
            className="text-amber-600 hover:text-amber-900 dark:text-amber-400 p-0.5"
            aria-label="Dismiss notice"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Brand Logo */}
          <div
            id="brand-logo-container"
            onClick={() => handleNav('home')}
            className="flex items-center space-x-2.5 sm:space-x-3 cursor-pointer group shrink-0 py-1"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform shrink-0">
              <Keyboard className="w-5 h-5" />
            </div>
            <div className="flex flex-col justify-center">
              <div className="flex items-center space-x-1.5">
                <span className="text-lg sm:text-xl font-black tracking-tight text-slate-900 dark:text-white leading-none">
                  TYPING <span className="text-blue-600 dark:text-blue-400">WALLAH</span>
                </span>
                <span className="hidden md:inline-block px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 rounded uppercase tracking-wider">
                  Govt Exams
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium tracking-wide mt-0.5 leading-none">
                Practice. Improve. Type Faster.
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2 text-xs xl:text-sm">
            <button
              id="nav-home"
              type="button"
              onClick={() => handleNav('home')}
              className={`px-2.5 xl:px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                activePage === 'home'
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Home
            </button>

            <button
              id="nav-tests"
              type="button"
              onClick={() => handleNav('typing-test')}
              className={`px-2.5 xl:px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                activePage === 'typing-test'
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Typing Tests
            </button>

            <button
              id="nav-touch-typing"
              type="button"
              onClick={() => handleNav('touch-typing')}
              className={`px-2.5 xl:px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center space-x-1.5 ${
                activePage === 'touch-typing'
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Hand className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Touch Typing (बेसिक)</span>
            </button>

            {/* Exams Dropdown */}
            <div className="relative" ref={examsRef}>
              <button
                id="nav-exams-dropdown"
                type="button"
                onClick={() => {
                  setExamsDropdownOpen(!examsDropdownOpen);
                  setLangDropdownOpen(false);
                }}
                className={`flex items-center space-x-1 px-2.5 xl:px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                  activePage === 'exams' || activePage === 'exam-detail' || activePage === 'cpct'
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>Exams</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${examsDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {examsDropdownOpen && (
                <div
                  id="exams-menu-dropdown"
                  className="absolute left-0 mt-2 w-72 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Official Exam Simulators
                  </div>
                  <button
                    id="dropdown-cpct"
                    type="button"
                    onClick={() => handleNav('cpct')}
                    className="w-full text-left px-3 py-2 text-xs xl:text-sm text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-700 dark:hover:text-blue-300 font-bold flex items-center justify-between"
                  >
                    <span>MP CPCT Special Hub</span>
                    <span className="text-[10px] bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded font-bold">Recommended</span>
                  </button>
                  {Object.values(EXAMS_DATA).slice(0, 5).map((exam) => (
                    <button
                      key={exam.id}
                      id={`dropdown-exam-${exam.id}`}
                      type="button"
                      onClick={() => handleNav('exam-detail', exam.id)}
                      className="w-full text-left px-3 py-1.5 text-xs xl:text-sm text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-700 dark:hover:text-blue-300 font-medium flex items-center justify-between"
                    >
                      <span>{exam.name}</span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">{exam.qualifyingEnglishWpm || exam.qualifyingHindiWpm} WPM</span>
                    </button>
                  ))}
                  <div className="border-t border-slate-100 dark:border-slate-700 my-1"></div>
                  <button
                    id="dropdown-all-exams"
                    type="button"
                    onClick={() => handleNav('exams')}
                    className="w-full text-left px-3 py-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                  >
                    View All 8 Target Exams →
                  </button>
                </div>
              )}
            </div>

            {/* Languages Dropdown */}
            <div className="relative" ref={langRef}>
              <button
                id="nav-lang-dropdown"
                type="button"
                onClick={() => {
                  setLangDropdownOpen(!langDropdownOpen);
                  setExamsDropdownOpen(false);
                }}
                className={`flex items-center space-x-1 px-2.5 xl:px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                  activePage === 'hindi-typing' || activePage === 'english-typing'
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Globe className="w-3.5 h-3.5 text-amber-500" />
                <span>Languages</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${langDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {langDropdownOpen && (
                <div
                  id="lang-menu-dropdown"
                  className="absolute left-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  <button
                    id="dropdown-hindi-typing"
                    type="button"
                    onClick={() => handleNav('hindi-typing')}
                    className="w-full text-left px-3 py-2 text-xs xl:text-sm text-slate-700 dark:text-slate-200 hover:bg-amber-50 dark:hover:bg-amber-900/20 hover:text-amber-700 dark:hover:text-amber-300 flex flex-col"
                  >
                    <div className="font-bold flex items-center justify-between">
                      <span>Hindi Typing (Mangal)</span>
                      <span className="text-[10px] bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 px-1 rounded">CPCT & SSC</span>
                    </div>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500">InScript & Remington GAIL layouts</span>
                  </button>

                  <button
                    id="dropdown-english-typing"
                    type="button"
                    onClick={() => handleNav('english-typing')}
                    className="w-full text-left px-3 py-2 text-xs xl:text-sm text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-700 dark:hover:text-blue-300 flex flex-col"
                  >
                    <div className="font-bold flex items-center justify-between">
                      <span>English Typing (DEST)</span>
                      <span className="text-[10px] bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300 px-1 rounded">TCS Pattern</span>
                    </div>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500">1750 & 2000 Key Depressions</span>
                  </button>
                </div>
              )}
            </div>

            <button
              id="nav-leaderboard"
              type="button"
              onClick={() => handleNav('leaderboard')}
              className={`px-2.5 xl:px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center space-x-1 ${
                activePage === 'leaderboard'
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>Leaderboard</span>
            </button>

            <button
              id="nav-blog"
              type="button"
              onClick={() => handleNav('blog')}
              className={`px-2.5 xl:px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center space-x-1 ${
                activePage === 'blog' || activePage === 'blog-post'
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Blog & Tips</span>
            </button>
          </nav>

          {/* Action Buttons & Auth */}
          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
            {/* Dark/Light Mode Switcher */}
            <button
              id="theme-toggle-btn"
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 transition-transform rotate-0 hover:rotate-45" />
              ) : (
                <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600 transition-transform -rotate-12 hover:rotate-0" />
              )}
            </button>

            {/* Auth Section: Logged In vs Logged Out */}
            {user.isLoggedIn ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  id="nav-user-profile-btn"
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 p-1 sm:px-2.5 sm:py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.name}
                      referrerPolicy="no-referrer"
                      className="w-7 h-7 rounded-full object-cover border border-blue-500 shrink-0"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                      {user.avatarSeed || (user.name ? user.name.slice(0, 1).toUpperCase() : 'U')}
                    </div>
                  )}
                  <span className="hidden sm:inline font-bold text-xs text-slate-800 dark:text-slate-100 max-w-[100px] truncate">
                    {(user.name || 'Candidate').split(' ')[0]}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* User Dropdown Menu */}
                {userDropdownOpen && (
                  <div
                    id="nav-user-dropdown"
                    className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  >
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleNav('dashboard')}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600"
                    >
                      📊 My Dashboard & Analytics
                    </button>
                    <button
                      type="button"
                      onClick={() => handleNav('leaderboard')}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600"
                    >
                      🏆 Leaderboard Standing
                    </button>
                    <div className="border-t border-slate-100 dark:border-slate-700 my-1"></div>
                    <button
                      type="button"
                      id="nav-logout-btn"
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center space-x-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                {/* Google Login Button */}
                <button
                  id="nav-google-login-btn"
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isLoggingIn}
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700 font-bold text-xs shadow-xs transition-all cursor-pointer active:scale-95"
                >
                  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.25 21.36 7.33 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.94 0 12s.46 3.84 1.26 5.42l4.02-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.25 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>
                  <span className="hidden sm:inline">Google Login</span>
                  <span className="sm:hidden">Login</span>
                </button>
              </div>
            )}

            {/* Start Test CTA */}
            <button
              id="header-start-test-cta"
              type="button"
              onClick={() => handleNav('typing-test')}
              className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-all hover:scale-102 active:scale-98 flex items-center space-x-1.5 shrink-0 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span className="whitespace-nowrap">Start Test</span>
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              id="mobile-menu-toggle"
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-menu-drawer"
          className="lg:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 pt-2 pb-6 space-y-2 max-h-[calc(100vh-4rem)] overflow-y-auto"
        >
          {/* User card in mobile drawer if logged in */}
          {user.isLoggedIn && (
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mb-2">
              <div className="flex items-center space-x-2.5">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.name} referrerPolicy="no-referrer" className="w-8 h-8 rounded-full" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                    {user.avatarSeed}
                  </div>
                )}
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">{user.name}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">{user.email}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleSignOut}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 px-2 py-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30"
              >
                Logout
              </button>
            </div>
          )}

          <button
            id="mobile-nav-home"
            type="button"
            onClick={() => handleNav('home')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Home
          </button>
          <button
            id="mobile-nav-test"
            type="button"
            onClick={() => handleNav('typing-test')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Typing Tests
          </button>
          <button
            id="mobile-nav-touch-typing"
            type="button"
            onClick={() => handleNav('touch-typing')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-blue-700 dark:text-blue-300 bg-blue-50/70 dark:bg-blue-950/40 flex items-center justify-between"
          >
            <span className="flex items-center space-x-2">
              <Hand className="w-4 h-4 text-blue-600" />
              <span>Touch Typing (बेसिक से सीखें)</span>
            </span>
            <span className="text-[10px] bg-blue-200 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-1.5 py-0.5 rounded font-bold">New</span>
          </button>
          <button
            id="mobile-nav-cpct"
            type="button"
            onClick={() => handleNav('cpct')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 flex items-center justify-between"
          >
            <span>MP CPCT Special Portal</span>
            <span className="text-[10px] bg-blue-200 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-1.5 py-0.5 rounded font-bold">Featured</span>
          </button>
          <button
            id="mobile-nav-exams"
            type="button"
            onClick={() => handleNav('exams')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            All Government Exams (8 Categories)
          </button>
          <button
            id="mobile-nav-hindi"
            type="button"
            onClick={() => handleNav('hindi-typing')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Hindi Typing (InScript & Remington GAIL)
          </button>
          <button
            id="mobile-nav-english"
            type="button"
            onClick={() => handleNav('english-typing')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            English Typing (DEST & TCS Pattern)
          </button>
          <button
            id="mobile-nav-leaderboard"
            type="button"
            onClick={() => handleNav('leaderboard')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Leaderboard
          </button>
          <button
            id="mobile-nav-dashboard"
            type="button"
            onClick={() => handleNav('dashboard')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            User Dashboard & Progress
          </button>
          <button
            id="mobile-nav-blog"
            type="button"
            onClick={() => handleNav('blog')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Blog & Exam Tips
          </button>

          {/* Mobile Auth actions */}
          <div className="pt-3 mt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
            {!user.isLoggedIn ? (
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full py-2 px-3 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center justify-center space-x-2"
              >
                <span>Google Sign-In</span>
              </button>
            ) : null}
            <div className="flex items-center justify-between px-1">
              <button
                id="mobile-auth-btn"
                type="button"
                onClick={user.isLoggedIn ? () => handleNav('dashboard') : onOpenAuth}
                className="text-xs font-bold text-slate-600 dark:text-slate-300"
              >
                {user.isLoggedIn ? 'Account Settings' : 'Email Login / Register'}
              </button>
              <button
                id="mobile-admin-btn"
                type="button"
                onClick={() => handleNav('admin')}
                className="text-xs text-slate-400 dark:text-slate-500 hover:text-slate-600"
              >
                Admin Config
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

import React, { useState, useRef, useEffect } from 'react';
import { ActivePage, ExamId, UserProfile } from '../types';
import {
  Keyboard,
  ChevronDown,
  Menu,
  X,
  Sun,
  Moon,
  LogOut,
  User
} from 'lucide-react';
import { EXAMS_DATA } from '../data/exams';
import { useTheme } from '../context/ThemeContext';
import { auth } from '../services/firebase';
import { signOut } from 'firebase/auth';

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
  onUserLogout
}) => {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [examsDropdownOpen, setExamsDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const examsRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

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

  // Logout
  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch {
      // ignore
    }
    if (onUserLogout) {
      onUserLogout();
    }
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <header
      id="main-navbar"
      className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Brand Wordmark */}
          <button
            id="brand-logo-container"
            type="button"
            onClick={() => handleNav('home')}
            className="flex items-center gap-2.5 cursor-pointer group shrink-0 whitespace-nowrap text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs shrink-0">
              <Keyboard className="w-5 h-5" />
            </div>
            <span className="text-lg sm:text-xl font-black tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0">
              TYPING <span className="text-blue-600 dark:text-blue-400">WALLAH</span>
            </span>
          </button>

          {/* Zone 2: Primary Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold">
            <button
              id="nav-home"
              type="button"
              onClick={() => handleNav('home')}
              className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activePage === 'home'
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Home
            </button>

            <button
              id="nav-tests"
              type="button"
              onClick={() => handleNav('typing-test')}
              className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activePage === 'typing-test'
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Typing Tests
            </button>

            <button
              id="nav-touch-typing"
              type="button"
              onClick={() => handleNav('touch-typing')}
              className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activePage === 'touch-typing'
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Touch Typing
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
                className={`flex items-center gap-1 py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  activePage === 'exams' || activePage === 'exam-detail' || activePage === 'cpct'
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>Exams</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${examsDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {examsDropdownOpen && (
                <div
                  id="exams-menu-dropdown"
                  className="absolute left-0 mt-2 w-72 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50"
                >
                  <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 dark:text-slate-500">
                    Official Exam Simulators
                  </div>
                  <button
                    id="dropdown-cpct"
                    type="button"
                    onClick={() => handleNav('cpct')}
                    className="w-full text-left px-3 py-2 text-xs sm:text-sm text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-700 dark:hover:text-blue-300 font-bold flex items-center justify-between"
                  >
                    <span>MP CPCT Portal</span>
                    <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold">Featured</span>
                  </button>
                  {Object.values(EXAMS_DATA).slice(0, 5).map((exam) => (
                    <button
                      key={exam.id}
                      id={`dropdown-exam-${exam.id}`}
                      type="button"
                      onClick={() => handleNav('exam-detail', exam.id)}
                      className="w-full text-left px-3 py-1.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-700 dark:hover:text-blue-300 font-medium flex items-center justify-between"
                    >
                      <span>{exam.name}</span>
                      <span className="text-xs text-slate-400 dark:text-slate-500 tabular-nums">{exam.qualifyingEnglishWpm || exam.qualifyingHindiWpm} WPM</span>
                    </button>
                  ))}
                  <div className="border-t border-slate-100 dark:border-slate-700 my-1"></div>
                  <button
                    id="dropdown-all-exams"
                    type="button"
                    onClick={() => handleNav('exams')}
                    className="w-full text-left px-3 py-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                  >
                    View All 8 Target Exams
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
                className={`flex items-center gap-1 py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  activePage === 'hindi-typing' || activePage === 'english-typing'
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>Languages</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${langDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {langDropdownOpen && (
                <div
                  id="lang-menu-dropdown"
                  className="absolute left-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50"
                >
                  <button
                    id="dropdown-hindi-typing"
                    type="button"
                    onClick={() => handleNav('hindi-typing')}
                    className="w-full text-left px-3 py-2 text-xs sm:text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex flex-col"
                  >
                    <span className="font-bold">Hindi Typing (Mangal)</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">InScript & Remington GAIL</span>
                  </button>

                  <button
                    id="dropdown-english-typing"
                    type="button"
                    onClick={() => handleNav('english-typing')}
                    className="w-full text-left px-3 py-2 text-xs sm:text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex flex-col"
                  >
                    <span className="font-bold">English Typing (DEST)</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">1750 & 2000 Key Depressions</span>
                  </button>
                </div>
              )}
            </div>

            <button
              id="nav-leaderboard"
              type="button"
              onClick={() => handleNav('leaderboard')}
              className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activePage === 'leaderboard'
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Leaderboard
            </button>

            <button
              id="nav-pricing"
              type="button"
              onClick={() => handleNav('pricing')}
              className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activePage === 'pricing'
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Pricing
            </button>

            <button
              id="nav-blog"
              type="button"
              onClick={() => handleNav('blog')}
              className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activePage === 'blog' || activePage === 'blog-post'
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Guides
            </button>
          </nav>

          {/* Zone 3: Actions & Account */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              id="theme-toggle-btn"
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
              )}
            </button>

            {user.isLoggedIn ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  id="nav-user-profile-btn"
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    {user.avatarSeed || (user.name ? user.name.slice(0, 1).toUpperCase() : 'U')}
                  </div>
                  <span className="hidden sm:inline font-bold text-xs text-slate-800 dark:text-slate-100 max-w-[100px] truncate">
                    {(user.name || 'Candidate').split(' ')[0]}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {userDropdownOpen && (
                  <div
                    id="nav-user-dropdown"
                    className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50"
                  >
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleNav('dashboard')}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600"
                    >
                      My Dashboard & Analytics
                    </button>
                    <button
                      type="button"
                      onClick={() => handleNav('leaderboard')}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600"
                    >
                      Leaderboard Standing
                    </button>
                    <button
                      type="button"
                      onClick={() => handleNav('referrals')}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600"
                    >
                      Invite & Referrals
                    </button>
                    <div className="border-t border-slate-100 dark:border-slate-700 my-1"></div>
                    <button
                      type="button"
                      id="nav-logout-btn"
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                id="nav-login-btn"
                type="button"
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700 font-bold text-xs sm:text-sm transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <User className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <span>Login / Sign Up</span>
              </button>
            )}

            <button
              id="header-start-test-cta"
              type="button"
              onClick={() => handleNav('typing-test')}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer whitespace-nowrap"
            >
              <span>Start Test</span>
            </button>

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
          {user.isLoggedIn && (
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mb-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                  {user.avatarSeed}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">{user.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
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
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Touch Typing Course
          </button>
          <button
            id="mobile-nav-cpct"
            type="button"
            onClick={() => handleNav('cpct')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            MP CPCT Special Portal
          </button>
          <button
            id="mobile-nav-exams"
            type="button"
            onClick={() => handleNav('exams')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            All Government Exams
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
            id="mobile-nav-pricing"
            type="button"
            onClick={() => handleNav('pricing')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Pricing & Plans
          </button>
          <button
            id="mobile-nav-blog"
            type="button"
            onClick={() => handleNav('blog')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Typing Guides & Blog
          </button>
          <button
            id="mobile-nav-referrals"
            type="button"
            onClick={() => handleNav('referrals')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Invite & Referrals
          </button>
          <button
            id="mobile-nav-dashboard"
            type="button"
            onClick={() => handleNav('dashboard')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            User Dashboard & Progress
          </button>

          {/* Mobile Auth actions */}
          <div className="pt-3 mt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
            {!user.isLoggedIn && (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth();
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2"
              >
                <User className="w-4 h-4" />
                <span>Login / Create Account</span>
              </button>
            )}
            <div className="flex items-center justify-between px-1">
              <button
                id="mobile-auth-btn"
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (user.isLoggedIn) {
                    handleNav('dashboard');
                  } else {
                    onOpenAuth();
                  }
                }}
                className="text-xs font-bold text-slate-600 dark:text-slate-300"
              >
                {user.isLoggedIn ? 'Account Dashboard' : 'Email Login / Sign Up'}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

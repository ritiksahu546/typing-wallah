import React, { useState, useEffect } from 'react';
import { ActivePage, BlogPost, ExamId, HindiKeyboardLayout } from './types';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BLOG_POSTS } from './data/blogs';
import { StorageService } from './services/storageService';
import { getPathForRoute, parseRouteFromPath, updatePageSeo } from './utils/seo';

// Layout Components
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';

// Pages
import { HomePage } from './pages/HomePage';
import { TypingTestPage } from './pages/TypingTestPage';
import { LearnTouchTypingPage } from './pages/LearnTouchTypingPage';
import { CpctPortalPage } from './pages/CpctPortalPage';
import { ExamDetailPage } from './pages/ExamDetailPage';
import { ExamsListPage } from './pages/ExamsListPage';
import { HindiTypingPage } from './pages/HindiTypingPage';
import { EnglishTypingPage } from './pages/EnglishTypingPage';
import { UserDashboardPage } from './pages/UserDashboardPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { BlogPage } from './pages/BlogPage';
import { BlogPostPage } from './pages/BlogPostPage';
import { AdminPage } from './pages/AdminPage';
import {
  AboutPage,
  ContactPage,
  DisclaimerPage,
  PrivacyPolicyPage,
  TermsPage,
  PricingPage,
  ReferralPage,
  NotFoundPage
} from './pages/StaticPages';

function AppContent() {
  const { profile, logout } = useAuth();
  const initialRoute = parseRouteFromPath(window.location.pathname);

  const [activePage, setActivePage] = useState<ActivePage>(initialRoute.page);
  const [selectedExamId, setSelectedExamId] = useState<ExamId>(initialRoute.examId || 'cpct');
  const [testLanguage, setTestLanguage] = useState<'english' | 'hindi'>('english');
  const [testDuration, setTestDuration] = useState<number>(300);
  const [hindiLayout, setHindiLayout] = useState<HindiKeyboardLayout>('remington_gail');
  const [selectedBlogPost, setSelectedBlogPost] = useState<BlogPost | null>(() => {
    if (initialRoute.blogSlug) {
      return BLOG_POSTS.find((b) => b.slug === initialRoute.blogSlug) || BLOG_POSTS[0] || null;
    }
    return null;
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Capture ?ref= query parameter if present
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const refCode = params.get('ref');
    if (refCode && /^TW-[A-Z0-9]{4,10}$/i.test(refCode.trim())) {
      StorageService.applyFriendReferralCode(refCode.trim().toUpperCase());
    }
  }, []);

  // Listen to browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const parsed = parseRouteFromPath(window.location.pathname);
      setActivePage(parsed.page);
      if (parsed.examId) {
        setSelectedExamId(parsed.examId);
      }
      if (parsed.blogSlug) {
        const found = BLOG_POSTS.find((b) => b.slug === parsed.blogSlug);
        if (found) setSelectedBlogPost(found);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Sync URL and SEO tags on route changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    updatePageSeo(activePage, selectedExamId, selectedBlogPost);

    const targetPath = getPathForRoute(activePage, selectedExamId, selectedBlogPost);
    if (window.location.pathname !== targetPath && activePage !== '404') {
      window.history.pushState({}, '', targetPath);
    }
  }, [activePage, selectedExamId, selectedBlogPost]);

  const handleNavigate = (page: ActivePage, examId?: ExamId) => {
    if (examId) {
      setSelectedExamId(examId);
    }
    if (page === 'seo-page') {
      setActivePage('exams');
      return;
    }
    setActivePage(page);
  };

  const handleStartTest = (
    examId?: ExamId,
    lang?: 'english' | 'hindi',
    duration?: number,
    layout?: HindiKeyboardLayout
  ) => {
    if (examId) setSelectedExamId(examId);
    if (lang) setTestLanguage(lang);
    if (duration) setTestDuration(duration);
    if (layout) setHindiLayout(layout);
    setActivePage('typing-test');
  };

  const handleSelectBlogPost = (post: BlogPost) => {
    setSelectedBlogPost(post);
    setActivePage('blog-post');
  };

  const isTypingSession =
    activePage === 'typing-test' ||
    activePage === 'practice' ||
    activePage === 'mock-tests';

  return (
    <div className={`min-h-screen ${isTypingSession ? 'bg-[#121316]' : 'bg-slate-50 dark:bg-slate-950'} flex flex-col text-slate-900 dark:text-slate-100 font-sans selection:bg-blue-100 dark:selection:bg-blue-900 selection:text-blue-900 dark:selection:text-blue-100 overflow-x-hidden w-full max-w-full`}>
      {/* Universal Navbar with Firebase Auth (hidden during authentic typing tests) */}
      {!isTypingSession && (
        <Navbar
          activePage={activePage}
          onNavigate={handleNavigate}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          user={profile}
          onUserLoginSuccess={() => {}}
          onUserLogout={logout}
        />
      )}

      {/* Main Content Router */}
      <main className="flex-1">
        {activePage === 'home' && (
          <HomePage
            onStartTest={handleStartTest}
            onNavigate={handleNavigate}
          />
        )}

        {activePage === 'typing-test' && (
          <TypingTestPage
            initialExamId={selectedExamId}
            initialLanguage={testLanguage}
            initialDuration={testDuration}
            initialLayout={hindiLayout}
            initialMode="practice"
            user={profile}
            onNavigate={handleNavigate}
          />
        )}

        {activePage === 'touch-typing' && (
          <LearnTouchTypingPage
            onStartExam={handleStartTest}
            onNavigate={handleNavigate}
          />
        )}

        {(activePage === 'cpct' || activePage === 'cpct-portal') && (
          <CpctPortalPage
            onStartTest={handleStartTest}
            onNavigate={handleNavigate}
          />
        )}

        {(activePage === 'practice' || activePage === 'mock-tests') && (
          <TypingTestPage
            initialExamId={selectedExamId}
            initialLanguage={testLanguage}
            initialDuration={testDuration}
            initialLayout={hindiLayout}
            initialMode={activePage === 'mock-tests' ? 'exam' : 'practice'}
            user={profile}
            onNavigate={handleNavigate}
          />
        )}

        {(activePage === 'exams' || activePage === 'seo-page') && (
          <ExamsListPage
            onStartTest={(eId, lang, dur) => handleStartTest(eId, lang, dur)}
            onNavigate={handleNavigate}
          />
        )}

        {activePage === 'exam-detail' && (
          <ExamDetailPage
            examId={selectedExamId}
            onStartTest={handleStartTest}
            onNavigate={handleNavigate}
          />
        )}

        {activePage === 'hindi-typing' && (
          <HindiTypingPage
            onStartTest={handleStartTest}
            onNavigate={handleNavigate}
          />
        )}

        {activePage === 'english-typing' && (
          <EnglishTypingPage
            onStartTest={handleStartTest}
            onNavigate={handleNavigate}
          />
        )}

        {activePage === 'dashboard' && (
          <UserDashboardPage
            user={profile}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onUserLogout={logout}
            onStartTest={handleStartTest}
            onNavigate={handleNavigate}
          />
        )}

        {activePage === 'leaderboard' && (
          <LeaderboardPage
            user={profile}
            onStartTest={handleStartTest}
            onNavigate={handleNavigate}
          />
        )}

        {activePage === 'pricing' && (
          <PricingPage onNavigate={handleNavigate} />
        )}

        {activePage === 'referrals' && (
          <ReferralPage onNavigate={handleNavigate} />
        )}

        {activePage === 'blog' && (
          <BlogPage
            onSelectPost={handleSelectBlogPost}
            onNavigate={handleNavigate}
          />
        )}

        {activePage === 'blog-post' && selectedBlogPost && (
          <BlogPostPage
            post={selectedBlogPost}
            onBack={() => setActivePage('blog')}
            onNavigate={handleNavigate}
          />
        )}

        {activePage === 'admin' && (
          <AdminPage onNavigate={handleNavigate} />
        )}

        {/* Static & Legal Pages */}
        {activePage === 'about' && <AboutPage onNavigate={handleNavigate} />}
        {activePage === 'contact' && <ContactPage onNavigate={handleNavigate} />}
        {activePage === 'disclaimer' && <DisclaimerPage onNavigate={handleNavigate} />}
        {activePage === 'privacy' && <PrivacyPolicyPage onNavigate={handleNavigate} />}
        {activePage === 'terms' && <TermsPage onNavigate={handleNavigate} />}
        {activePage === '404' && <NotFoundPage onNavigate={handleNavigate} />}
      </main>

      {/* Universal Footer with Trust Disclaimer (hidden during typing test sessions) */}
      {!isTypingSession && <Footer onNavigate={handleNavigate} />}

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;

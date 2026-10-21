import { ActivePage, BlogPost, ExamId } from '../types';
import { EXAMS_DATA } from '../data/exams';
import { BLOG_POSTS } from '../data/blogs';
import firebaseConfig from '../../firebase-applet-config.json';

export interface RouteParseResult {
  page: ActivePage;
  examId?: ExamId;
  blogSlug?: string;
}

/**
 * Canonical base URL derived from the project's configured Firebase authDomain.
 */
export const SITE_BASE_URL = `https://${firebaseConfig.authDomain}`;

const VALID_EXAM_IDS = new Set<string>(Object.keys(EXAMS_DATA));
const VALID_BLOG_SLUGS = new Set<string>(BLOG_POSTS.map((post) => post.slug));

const PRIVATE_NOINDEX_PAGES = new Set<ActivePage>(['admin', 'dashboard', 'referrals', '404']);

/**
 * Convert an ActivePage (+ optional examId / blogPost) into a clean URL pathname.
 */
export function getPathForRoute(
  page: ActivePage,
  examId?: ExamId,
  blogPost?: BlogPost | null
): string {
  switch (page) {
    case 'home':
      return '/';
    case 'typing-test':
      return '/typing-test';
    case 'practice':
      return '/practice';
    case 'mock-tests':
      return '/mock-tests';
    case 'english-typing':
      return '/english-typing-test';
    case 'hindi-typing':
      return '/hindi-typing-test';
    case 'touch-typing':
      return '/learn-touch-typing';
    case 'cpct':
    case 'cpct-portal':
      return '/mp-cpct-typing-test';
    case 'exams':
    case 'seo-page':
      return '/exams';
    case 'exam-detail':
      return `/exam/${examId || 'cpct'}`;
    case 'dashboard':
      return '/dashboard';
    case 'leaderboard':
      return '/leaderboard';
    case 'pricing':
      return '/pricing';
    case 'referrals':
      return '/referrals';
    case 'blog':
      return '/blog';
    case 'blog-post':
      return blogPost?.slug ? `/blog/${blogPost.slug}` : '/blog';
    case 'admin':
      return '/admin';
    case 'about':
      return '/about';
    case 'contact':
      return '/contact';
    case 'privacy':
      return '/privacy-policy';
    case 'terms':
      return '/terms-and-conditions';
    case 'disclaimer':
      return '/disclaimer';
    case '404':
    default:
      return '/404';
  }
}

/**
 * Parse a browser pathname into an ActivePage route state.
 */
export function parseRouteFromPath(pathname: string): RouteParseResult {
  const clean = pathname.replace(/\/+$/, '') || '/';

  if (clean === '/' || clean === '/index.html') return { page: 'home' };
  if (clean === '/typing-test') return { page: 'typing-test' };
  if (clean === '/practice') return { page: 'practice' };
  if (clean === '/mock-tests') return { page: 'mock-tests' };
  if (clean === '/english-typing-test' || clean === '/english-typing') return { page: 'english-typing' };
  if (clean === '/hindi-typing-test' || clean === '/hindi-typing') return { page: 'hindi-typing' };
  if (clean === '/learn-touch-typing' || clean === '/touch-typing') return { page: 'touch-typing' };
  if (clean === '/mp-cpct-typing-test' || clean === '/cpct' || clean === '/cpct-portal') return { page: 'cpct' };
  if (clean === '/exams' || clean === '/seo-page') return { page: 'exams' };
  if (clean === '/dashboard') return { page: 'dashboard' };
  if (clean === '/leaderboard') return { page: 'leaderboard' };
  if (clean === '/pricing') return { page: 'pricing' };
  if (clean === '/referrals') return { page: 'referrals' };
  if (clean === '/blog') return { page: 'blog' };
  if (clean === '/admin') return { page: 'admin' };
  if (clean === '/about') return { page: 'about' };
  if (clean === '/contact') return { page: 'contact' };
  if (clean === '/privacy-policy' || clean === '/privacy') return { page: 'privacy' };
  if (clean === '/terms-and-conditions' || clean === '/terms') return { page: 'terms' };
  if (clean === '/disclaimer') return { page: 'disclaimer' };

  if (clean.startsWith('/exam/')) {
    const rawId = clean.slice('/exam/'.length);
    if (VALID_EXAM_IDS.has(rawId)) {
      return { page: 'exam-detail', examId: rawId as ExamId };
    }
    return { page: '404' };
  }

  if (clean.startsWith('/blog/')) {
    const slug = clean.slice('/blog/'.length);
    if (slug && VALID_BLOG_SLUGS.has(slug)) {
      return { page: 'blog-post', blogSlug: slug };
    }
    return { page: '404' };
  }

  return { page: '404' };
}

function setMetaTag(selector: string, attrName: string, attrValue: string, content: string) {
  let el = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attrName, attrValue);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

/**
 * Dynamically update document title, meta description, canonical URL, Open Graph tags, and JSON-LD schema.
 */
export function updatePageSeo(
  page: ActivePage,
  examId?: ExamId,
  blogPost?: BlogPost | null
) {
  let title = 'Typing Wallah — Free Hindi & English Exam Typing Practice Platform';
  let description =
    'Practice Smart. Type Fast. Crack Your Exam. Free online English and Hindi (Mangal InScript & Remington GAIL) typing tests for SSC CHSL, SSC CGL DEST, RRB NTPC, and MP CPCT.';

  switch (page) {
    case 'english-typing':
      title = 'English Typing Test (SSC DEST & TCS Pattern) | Typing Wallah';
      description =
        'Practice online English typing tests with 1, 3, 5, 10, and 15-minute timers, real-time Gross & Net WPM, and SSC CGL/CHSL DEST 2,000 key-depression evaluation.';
      break;
    case 'hindi-typing':
      title = 'Hindi Typing Test — Mangal InScript & Remington GAIL | Typing Wallah';
      description =
        'Free online Hindi Unicode typing test in Mangal font supporting both Remington GAIL and InScript keyboard layouts for MP CPCT, UPSSSC, and Rajasthan LDC.';
      break;
    case 'touch-typing':
      title = 'Learn Touch Typing Course (Home Row to 50 WPM) | Typing Wallah';
      description =
        'Step-by-step interactive touch typing course in English and Hindi with animated finger guidance, home-row drills, and progressive WPM benchmarks.';
      break;
    case 'cpct':
    case 'cpct-portal':
      title = 'MP CPCT Typing Test Simulator (English 30 WPM & Hindi 20 WPM) | Typing Wallah';
      description =
        'Authentic MP CPCT typing test practice with 15-minute English and Hindi Mangal (Remington GAIL & InScript) simulation and official proficiency scorecard.';
      break;
    case 'exams':
    case 'seo-page':
      title = 'Government Exam Typing Tests — SSC, RRB NTPC, CPCT & High Court | Typing Wallah';
      description =
        'Select your target Indian government typing exam: SSC CHSL, SSC CGL DEST, RRB NTPC, MP CPCT, Delhi Police HCM, UPSSSC Junior Assistant, and Rajasthan LDC.';
      break;
    case 'exam-detail': {
      const exam = examId ? EXAMS_DATA[examId] : EXAMS_DATA.cpct;
      if (exam) {
        title = `${exam.name} Typing Test (${exam.fullName}) | Typing Wallah`;
        description = `${exam.overview} Practice ${exam.durationMinutes}-minute mock tests with official evaluation rules.`;
      }
      break;
    }
    case 'dashboard':
      title = 'Candidate Dashboard & Typing Progress Analytics | Typing Wallah';
      description =
        'Track your personal best WPM, average accuracy, English vs. Hindi typing metrics, and target government exam readiness on Typing Wallah.';
      break;
    case 'leaderboard':
      title = 'Live Aspirant Typing Leaderboard | Typing Wallah';
      description =
        'Compare your Net WPM and accuracy percentage with fellow government exam aspirants across India.';
      break;
    case 'pricing':
      title = 'Practice Plans & Pricing | Typing Wallah';
      description =
        'Access free English and Hindi typing practice tests, 8 government exam simulators, and 100 touch-typing lessons on Typing Wallah.';
      break;
    case 'referrals':
      title = 'Invite Fellow Aspirants & Referrals | Typing Wallah';
      description =
        'Share Typing Wallah with your study group using your personal invite code.';
      break;
    case 'blog':
      title = 'Typing Exam Preparation Guides & Articles | Typing Wallah';
      description =
        'Read practical guides on SSC DEST mistake calculation, Mangal Remington GAIL vs. InScript keyboard selection, and increasing typing speed to 50+ WPM.';
      break;
    case 'blog-post':
      if (blogPost) {
        title = `${blogPost.title} | Typing Wallah Guides`;
        description = blogPost.summary;
      }
      break;
    case 'about':
      title = 'About Typing Wallah — Practice Smart. Type Fast. Crack Your Exam.';
      description =
        'Learn how Typing Wallah helps Indian government exam aspirants prepare for SSC, RRB, CPCT, and state clerical typing skill tests.';
      break;
    case 'contact':
      title = 'Contact Support | Typing Wallah';
      description = 'Get in touch with the Typing Wallah team for passage requests, feedback, or support.';
      break;
    case 'privacy':
      title = 'Privacy Policy | Typing Wallah';
      description = 'Read how Typing Wallah protects your typing history, privacy, and account data.';
      break;
    case 'terms':
      title = 'Terms & Conditions | Typing Wallah';
      description = 'Terms of service and acceptable use guidelines for the Typing Wallah typing simulator.';
      break;
    case 'disclaimer':
      title = 'Legal Disclaimer & Non-Affiliation Notice | Typing Wallah';
      description =
        'Typing Wallah is an independent educational platform and is not affiliated with any government agency or recruitment board.';
      break;
    case '404':
      title = 'Page Not Found (404) | Typing Wallah';
      description = 'The requested page could not be found on Typing Wallah.';
      break;
    default:
      break;
  }

  document.title = title;
  const robotsContent = PRIVATE_NOINDEX_PAGES.has(page) ? 'noindex, nofollow' : 'index, follow';
  setMetaTag('meta[name="robots"]', 'name', 'robots', robotsContent);
  setMetaTag('meta[name="description"]', 'name', 'description', description);
  setMetaTag('meta[property="og:title"]', 'property', 'og:title', title);
  setMetaTag('meta[property="og:description"]', 'property', 'og:description', description);
  setMetaTag('meta[property="og:type"]', 'property', 'og:type', 'website');
  setMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
  setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', title);
  setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', description);

  const origin =
    typeof window !== 'undefined' &&
    window.location.origin &&
    !window.location.origin.includes('localhost') &&
    !window.location.origin.includes('127.0.0.1')
      ? window.location.origin
      : SITE_BASE_URL;
  const canonicalUrl = `${origin}${getPathForRoute(page, examId, blogPost)}`;
  let canonicalLink = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.setAttribute('href', canonicalUrl);

  // Inject or update Schema.org JSON-LD
  const scriptId = 'typing-wallah-jsonld';
  let scriptEl = document.getElementById(scriptId) as HTMLScriptElement | null;
  if (!scriptEl) {
    scriptEl = document.createElement('script');
    scriptEl.id = scriptId;
    scriptEl.type = 'application/ld+json';
    document.head.appendChild(scriptEl);
  }

  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Typing Wallah',
    slogan: 'Practice Smart. Type Fast. Crack Your Exam.',
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'All',
    url: canonicalUrl,
    description,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR'
    }
  };
  scriptEl.textContent = JSON.stringify(schemaData);
}

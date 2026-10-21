export type Language = 'english' | 'hindi';

export type HindiKeyboardLayout = 'remington_gail' | 'inscript' | 'krutidev';

export type Difficulty = 'easy' | 'medium' | 'hard' | 'exam_level';

export type TestModeDuration = 60 | 180 | 300 | 600 | 900 | number; // in seconds

export type ExamCategory =
  | 'central_gov'
  | 'railways'
  | 'state_gov'
  | 'courts'
  | 'delhi'
  | 'autonomous';

export type ExamStatus = 'Active' | 'Archived' | 'Verification Required';

export type ExamId =
  | 'cpct'
  | 'ssc-chsl'
  | 'ssc-cgl-dest'
  | 'ssc-selection-post'
  | 'ssc-steno'
  | 'rrb-ntpc'
  | 'delhi-police-hcm'
  | 'high-court'
  | 'patna-hc'
  | 'supreme-court-jca'
  | 'upsssc'
  | 'bssc-bihar'
  | 'dsssb'
  | 'state-gov'
  | 'autonomous-inst';

export interface ExamInfo {
  id: ExamId;
  name: string;
  fullName: string;
  shortTag: string;
  slug: string;
  conductedBy: string;
  category: ExamCategory;
  state: string;
  posts: string[];
  typingRequired: boolean;
  skillTestType: string;
  overview: string;
  qualifyingHindiWpm?: number;
  qualifyingEnglishWpm?: number;
  keyDepressionsTarget?: number;
  durationMinutes: number;
  accuracyRequirement: string;
  allowedErrorPercent: number;
  supportedKeyboards: ('standard' | HindiKeyboardLayout)[];
  patternSummary: string[];
  instructions: string[];
  faqs: { question: string; answer: string }[];
  relatedExams: ExamId[];
  officialSource: string;
  notificationDate: string;
  lastVerified: string;
  status: ExamStatus;
  freeOrPro: 'free' | 'pro';
  scoringMethod?: string;
  passageType?: string;
}

export interface Passage {
  id: string;
  passageNumber?: number;
  title: string;
  language: Language;
  difficulty: Difficulty;
  content: string;
  examId?: ExamId;
  targetExams?: ExamId[];
  category: string;
  domain?: string;
  wordCount: number;
  charCount: number;
  isPro?: boolean;
}

export interface TypingMetrics {
  grossWpm: number;
  netWpm: number;
  accuracy: number;
  totalChars: number;
  correctChars: number;
  incorrectChars: number;
  errors: number;
  backspaceCount: number;
  keyDepressions: number;
  elapsedSeconds: number;
  remainingSeconds: number;
  isQualified?: boolean;
  kdph?: number;
  fullMistakes?: number;
  halfMistakes?: number;
  allowedMistakes?: number;
  penaltyMistakes?: number;
  penaltyDeductionWords?: number;
  errorPercentage?: number;
  grade?: string;
  qualificationReason?: string;
  scoringFormulaName?: string;
}

export interface TestResultRecord {
  id: string;
  timestamp: number;
  examId: ExamId | 'general';
  examName: string;
  language: Language;
  keyboardLayout?: HindiKeyboardLayout | 'standard';
  durationSeconds: number;
  passageTitle: string;
  passageId: string;
  metrics: TypingMetrics;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarSeed: string;
  photoURL?: string;
  targetExam: ExamId;
  joinedDate: string;
  isLoggedIn: boolean;
  isPro?: boolean;
  proExpiryDate?: string | null;
  referralCode?: string;
  referredBy?: string;
  referralCount?: number;
  referralDaysEarned?: number;
}

export interface UserSubscription {
  uid: string;
  plan: 'free' | 'pro_monthly' | 'pro_annual' | 'referral_unlocked';
  status: 'active' | 'expired' | 'trial';
  startDate: string;
  expiryDate: string;
  source: 'payment' | 'referral' | 'admin';
  amountInr?: number;
  paymentId?: string;
}

export interface ReferralRecord {
  id: string;
  referrerUid: string;
  referrerCode: string;
  referredUid: string;
  referredEmail: string;
  referredName: string;
  timestamp: number;
  daysAwarded: number;
  status: 'verified' | 'pending';
}

export interface UserStatsSummary {
  bestWpm: number;
  avgWpm: number;
  avgAccuracy: number;
  totalTests: number;
  totalPracticeTimeSeconds: number;
  recentTests: TestResultRecord[];
}

export interface LeaderboardItem {
  id: string;
  rank: number;
  username: string;
  wpm: number;
  netWpm: number;
  accuracy: number;
  examName: string;
  language: Language;
  date: string;
  isCurrentUser?: boolean;
  avatarSeed?: string;
  userId?: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  category: 'CPCT' | 'SSC' | 'Railway' | 'Hindi Typing' | 'English Typing' | 'Typing Tips' | 'Exam Updates' | 'Keyboard Layouts';
  author: string;
  readTime: string;
  date: string;
  summary: string;
  content: string;
  tags: string[];
}

export type ActivePage =
  | 'home'
  | 'typing-test'
  | 'touch-typing'
  | 'exams'
  | 'exam-detail'
  | 'cpct'
  | 'cpct-portal'
  | 'hindi-typing'
  | 'english-typing'
  | 'practice'
  | 'mock-tests'
  | 'result'
  | 'dashboard'
  | 'leaderboard'
  | 'blog'
  | 'blog-post'
  | 'admin'
  | 'pricing'
  | 'referrals'
  | 'about'
  | 'contact'
  | 'disclaimer'
  | 'privacy'
  | 'terms'
  | 'seo-page'
  | '404';



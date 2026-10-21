import React, { useState } from 'react';
import { ActivePage, ExamId } from '../types';
import { EXAMS_DATA } from '../data/exams';
import { PASSAGES_DATA } from '../data/passages';
import { DEMO_TESTIMONIALS } from '../data/leaderboard';
import {
  Sparkles,
  Play,
  CheckCircle2,
  Trophy,
  Keyboard,
  Clock,
  ArrowRight,
  ShieldCheck,
  Zap,
  Target,
  FileText,
  ChevronRight,
  HelpCircle,
  Award,
  Globe,
  Flame,
  BarChart3,
  BookmarkCheck,
  ChevronDown,
  Hand
} from 'lucide-react';

interface HomePageProps {
  onStartTest: (examId?: ExamId, lang?: 'english' | 'hindi', duration?: number) => void;
  onNavigate: (page: ActivePage, examId?: ExamId) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onStartTest,
  onNavigate
}) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [quickLang, setQuickLang] = useState<'english' | 'hindi'>('english');
  const [quickDuration, setQuickDuration] = useState<number>(300);

  const homeFaqs = [
    {
      q: 'Which Hindi keyboard layout should I use for MP CPCT and SSC exams?',
      a: 'MP CPCT officially permits both InScript and Remington GAIL on Mangal Unicode font. If you learned typing on KrutiDev 010, choose Remington GAIL. If you are learning Devanagari typing afresh, InScript is strongly recommended by the Government of India due to its logical phonetic structure.'
    },
    {
      q: 'How does Typing Wallah calculate Net WPM?',
      a: 'Following official recruitment norms (like CPCT and SSC), 5 characters count as one standard word. Gross WPM = (Total characters typed ÷ 5) ÷ Time in minutes. Net WPM subtracts penalized errors committed: Net WPM = Gross WPM - (Errors ÷ 5) ÷ Time in minutes.'
    },
    {
      q: 'Is backspace allowed in actual government typing skill tests?',
      a: 'Yes, in modern computer-based examinations (such as MP CPCT, SSC CHSL, SSC CGL DEST, and UPSSSC), backspace is functional within the active paragraph. However, excessive backspacing wastes valuable seconds, which reduces your overall word count.'
    },
    {
      q: 'What is the DEST 2,000 key depressions requirement in SSC CGL?',
      a: 'In SSC CGL DEST, candidates must complete 2,000 key depressions in 15 minutes. At an average of 5 keystrokes per word, this corresponds to approximately 27 WPM with a stringent maximum error tolerance of 5% to 7% depending on reservation categories.'
    }
  ];

  return (
    <div id="homepage-root" className="space-y-12 sm:space-y-20 pb-16 w-full max-w-full overflow-x-hidden">
      {/* 1. HERO SECTION */}
      <section
        id="hero-section"
        className="relative overflow-hidden pt-6 sm:pt-14 pb-12 sm:pb-20 bg-gradient-to-b from-blue-50/70 via-slate-50 to-white dark:from-slate-900/60 dark:via-slate-950 dark:to-slate-950 border-b border-slate-100 dark:border-slate-800/60 transition-colors"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-5 sm:space-y-6">
            {/* Pill Badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800/80 text-blue-800 dark:text-blue-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span className="truncate">Independent Practice Platform for Indian Aspirants</span>
            </div>

            {/* Headline & Subheadline (Required Prompt exact match) */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              Master Typing for <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 dark:from-blue-400 dark:via-blue-300 dark:to-indigo-300">
                Government Exams
              </span>
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300 font-medium leading-relaxed max-w-2xl mx-auto">
              Practice Hindi and English typing with realistic exam-style tests.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <button
                id="hero-start-typing-cta"
                type="button"
                onClick={() => onStartTest(undefined, 'english', 300)}
                className="w-full sm:w-auto px-8 py-3.5 sm:py-4 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-black text-base shadow-lg shadow-blue-500/25 transition-all hover:scale-102 active:scale-98 flex items-center justify-center space-x-2.5 shrink-0"
              >
                <Play className="w-5 h-5 fill-current text-amber-300" />
                <span>Start Typing Test</span>
              </button>

              <button
                id="hero-learn-touch-typing-cta"
                type="button"
                onClick={() => onNavigate('touch-typing')}
                className="w-full sm:w-auto px-6 py-3.5 sm:py-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-base shadow-md transition-all flex items-center justify-center space-x-2 shrink-0"
              >
                <Hand className="w-5 h-5 fill-current" />
                <span>✋ Touch Typing सीखें (बेसिक)</span>
              </button>

              <button
                id="hero-explore-exams-cta"
                type="button"
                onClick={() => onNavigate('exams')}
                className="w-full sm:w-auto px-6 py-3.5 sm:py-4 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold text-base border border-slate-300 dark:border-slate-700 shadow-xs transition-all flex items-center justify-center space-x-2 shrink-0"
              >
                <span>Explore Exams</span>
                <ArrowRight className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              </button>
            </div>

            {/* Quick Badges */}
            <div className="pt-3 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-slate-500 dark:text-slate-400 font-semibold">
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>InScript & Remington GAIL</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>MP CPCT & SSC CHSL Presets</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Real-Time Net WPM & Accuracy</span>
              </div>
            </div>
          </div>

          {/* Quick Launch Control Card */}
          <div className="mt-10 sm:mt-12 max-w-4xl mx-auto bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md dark:shadow-slate-950/50 p-5 sm:p-7">
            <div className="flex flex-col md:flex-row items-center justify-between gap-5">
              <div className="space-y-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start space-x-2">
                  <Flame className="w-4 h-4 text-amber-500" />
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">Quick Practice Launcher</h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Select your test parameters and start immediately without registration.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
                {/* Practice vs Exam Mode Toggle */}
                <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => onNavigate('typing-test')}
                    className="px-3 py-1.5 rounded-lg text-emerald-700 dark:text-emerald-400 hover:bg-white dark:hover:bg-slate-700 transition-all flex items-center space-x-1"
                  >
                    <span>🎯 Practice</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate('mock-tests')}
                    className="px-3 py-1.5 rounded-lg text-rose-700 dark:text-rose-400 hover:bg-white dark:hover:bg-slate-700 transition-all flex items-center space-x-1"
                  >
                    <span>⏱️ Exam Mode</span>
                  </button>
                </div>

                {/* Language Select */}
                <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setQuickLang('english')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      quickLang === 'english'
                        ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    English (DEST)
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickLang('hindi')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      quickLang === 'hindi'
                        ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Hindi (Mangal)
                  </button>
                </div>

                {/* Duration Select */}
                <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700 text-xs font-bold">
                  {[60, 180, 300, 600, 900].map((secs) => (
                    <button
                      key={secs}
                      type="button"
                      onClick={() => setQuickDuration(secs)}
                      className={`px-2.5 py-1.5 rounded-lg transition-all ${
                        quickDuration === secs
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {secs / 60}m
                    </button>
                  ))}
                </div>

                {/* Launch Button */}
                <button
                  type="button"
                  onClick={() => onStartTest(undefined, quickLang, quickDuration)}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-transform active:scale-95 flex items-center space-x-1.5 shrink-0"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Launch Test</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS OVERVIEW SECTION */}
      <section id="stats-overview" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 text-center shadow-xs">
            <div className="text-3xl sm:text-4xl font-black text-blue-700 dark:text-blue-400 tabular-nums">
              8
            </div>
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mt-1">
              Target Exams Covered
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">MP CPCT, SSC, RRB, Courts</p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 text-center shadow-xs">
            <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tabular-nums">
              2,000
            </div>
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mt-1">
              Key Depressions Standard
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">Exact SSC DEST 15-min metric</p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 text-center shadow-xs">
            <div className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums">
              20 & 30
            </div>
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mt-1">
              CPCT Qualifying WPM
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">Hindi (20) & English (30)</p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 text-center shadow-xs">
            <div className="text-3xl sm:text-4xl font-black text-amber-600 dark:text-amber-400 tabular-nums">
              100%
            </div>
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mt-1">
              Calculated Keystrokes
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">Zero simulated fake metrics</p>
          </div>
        </div>
      </section>

      {/* 3. TARGET EXAM CARDS */}
      <section id="target-exams-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
              Exam-Specific Simulators
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Select Your Target Government Exam
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('exams')}
            className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center space-x-1"
          >
            <span>View All Exam Patterns</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {Object.values(EXAMS_DATA).map((exam) => (
            <div
              key={exam.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 flex flex-col justify-between shadow-xs hover:shadow-md dark:hover:border-slate-700 transition-all group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900">
                    {exam.shortTag}
                  </span>
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                    {exam.durationMinutes} Mins
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 dark:text-white text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {exam.name}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {exam.overview}
                </p>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                    <span>Target Speed:</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {exam.qualifyingEnglishWpm ? `${exam.qualifyingEnglishWpm} WPM (Eng)` : ''}
                      {exam.qualifyingHindiWpm ? ` / ${exam.qualifyingHindiWpm} WPM (Hin)` : ''}
                    </span>
                  </div>
                  {exam.keyDepressionsTarget && (
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                      <span>Key Depressions:</span>
                      <span className="font-bold text-amber-600 dark:text-amber-400">{exam.keyDepressionsTarget}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => onStartTest(exam.id, 'english', exam.durationMinutes * 60)}
                  className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-bold text-xs transition-colors flex items-center justify-center space-x-1"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Test</span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('exam-detail', exam.id)}
                  className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-colors"
                >
                  Pattern
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. DEDICATED HINDI & ENGLISH TYPING SECTIONS */}
      <section id="dual-language-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Hindi Typing Card */}
          <div className="bg-gradient-to-br from-amber-500/10 via-white to-orange-50/40 dark:from-amber-950/30 dark:via-slate-900 dark:to-slate-950 rounded-3xl border border-amber-200/80 dark:border-amber-900/40 p-6 sm:p-8 space-y-5">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-white font-bold shrink-0">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                  Devanagari Unicode
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">Hindi Typing Practice</h3>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Master government-standard Hindi typing on <strong>Mangal Font</strong>. Choose between <strong>InScript</strong> (the official C-DAC layout) and <strong>Remington GAIL</strong> (the typewriter layout) for MP CPCT, UPSSSC, and High Court exams.
            </p>

            <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Full support for Matras, Halant, and Complex Conjuncts</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Interactive layout maps for Remington GAIL & InScript keys</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>CPCT-level 20 WPM passing speed evaluation</span>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onNavigate('hindi-typing')}
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm transition-all"
              >
                Open Hindi Typing Hub →
              </button>
              <button
                type="button"
                onClick={() => onStartTest('cpct', 'hindi', 900)}
                className="px-4 py-2.5 rounded-xl border border-amber-300 dark:border-amber-700 hover:bg-amber-100/50 dark:hover:bg-amber-950/40 text-amber-900 dark:text-amber-200 font-bold text-xs"
              >
                CPCT 15m Mock
              </button>
            </div>
          </div>

          {/* English Typing Card */}
          <div className="bg-gradient-to-br from-blue-500/10 via-white to-indigo-50/40 dark:from-blue-950/30 dark:via-slate-900 dark:to-slate-950 rounded-3xl border border-blue-200/80 dark:border-blue-900/40 p-6 sm:p-8 space-y-5">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shrink-0">
                <Keyboard className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">
                  QWERTY Standard
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">English Typing Practice</h3>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Designed for <strong>SSC CHSL (35 WPM / 1,750 Depressions)</strong>, <strong>SSC CGL DEST (2,000 Depressions)</strong>, and <strong>RRB NTPC (30 WPM)</strong> with live stroke-by-stroke mistake evaluation.
            </p>

            <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Continuous master screen passage matching TCS exam software</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Full and half mistake percentage penalties tracking</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Flexible 1, 3, 5, 10, and 15-minute exam durations</span>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onNavigate('english-typing')}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all"
              >
                Open English Typing Hub →
              </button>
              <button
                type="button"
                onClick={() => onStartTest('ssc-chsl', 'english', 600)}
                className="px-4 py-2.5 rounded-xl border border-blue-300 dark:border-blue-700 hover:bg-blue-100/50 dark:hover:bg-blue-950/40 text-blue-900 dark:text-blue-200 font-bold text-xs"
              >
                SSC CHSL 10m Mock
              </button>
            </div>
          </div>
        </div>

        {/* 4.1 TOUCH TYPING LEARNING BANNER */}
        <div className="mt-8 bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-blue-800/60">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-300/30 text-xs font-bold uppercase tracking-wider">
              <Hand className="w-3.5 h-3.5" />
              <span>नया फीचर • Beginner Touch Typing Mastery</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black">
              बेसिक से सीखें: किस उंगली से कौन सा बटन दबाना है
            </h3>
            <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
              अगर आप पहली बार टाइपिंग सीख रहे हैं, तो बिना कीबोर्ड देखे 10 उंगलियों से टाइप करना सीखें। दोनों हाथों का लाइव विजुअल गाइड (Visual Hand Guide) और कलर-कोडेड कीबोर्ड के साथ बेसिक से अभ्यास करें।
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('touch-typing')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-sm shadow-lg shadow-amber-400/20 transition-all flex items-center justify-center space-x-2"
            >
              <Hand className="w-4 h-4 fill-current" />
              <span>Touch Typing बेसिक शुरू करें →</span>
            </button>
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS */}
      <section id="how-it-works-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            Preparation Methodology
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            How to Prepare on Typing Wallah
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Four disciplined steps from keyboard unfamiliarity to clearing your exam cutoff speed.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 sm:gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 space-y-3 relative shadow-xs">
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-black text-sm flex items-center justify-center">
              1
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-base">Select Your Exam Pattern</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Pick CPCT, SSC, RRB, or High Court to load exact timing rules and mistake tolerance formulas.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 space-y-3 relative shadow-xs">
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-black text-sm flex items-center justify-center">
              2
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-base">Choose Language & Layout</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Select English or Hindi (Remington GAIL or InScript) along with your desired practice duration.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 space-y-3 relative shadow-xs">
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-black text-sm flex items-center justify-center">
              3
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-base">Type the Master Passage</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Type naturally on the master text passage with real-time character color-coded verification.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 space-y-3 relative shadow-xs">
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-black text-sm flex items-center justify-center">
              4
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-base">Get Qualification Report</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              View your Net WPM, accuracy, key depressions, and official exam pass/fail status immediately.
            </p>
          </div>
        </div>
      </section>

      {/* 6. POPULAR TESTS GRID */}
      <section id="popular-tests" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Recommended Tests</span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">Popular Exam Passages</h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('practice')}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
          >
            Browse All Passages →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {PASSAGES_DATA.slice(0, 6).map((pass) => (
            <div
              key={pass.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between shadow-xs hover:border-blue-400 dark:hover:border-blue-500 transition-colors"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2 py-0.5 rounded font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 capitalize">
                    {pass.language}
                  </span>
                  <span className="text-slate-400 dark:text-slate-500 text-[11px]">{pass.wordCount} words</span>
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm leading-snug">
                  {pass.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                  {pass.content}
                </p>
              </div>

              <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase">{pass.category}</span>
                <button
                  type="button"
                  onClick={() => onStartTest(pass.examId, pass.language, 300)}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center space-x-1"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Start Test</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. TESTIMONIALS (Clearly Marked Demo Stories as required) */}
      <section id="aspirants-testimonials" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-block px-2.5 py-1 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[11px] font-bold uppercase tracking-wider">
            Sample Demo Testimonials & Candidate Experiences
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Aspirant Practice Stories
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Illustrative feedback demonstrating how structured typing simulation aids government exam preparation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {DEMO_TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 space-y-4 shadow-xs flex flex-col justify-between"
            >
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 italic leading-relaxed">
                "{t.text}"
              </p>
              <div className="flex items-center space-x-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 font-bold text-xs flex items-center justify-center shrink-0">
                  {t.avatar}
                </div>
                <div>
                  <div className="font-bold text-slate-900 dark:text-white text-xs">{t.name}</div>
                  <div className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold">{t.target}</div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500">{t.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. FAQ ACCORDION */}
      <section id="homepage-faqs" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Aspirant Queries</span>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-3">
          {homeFaqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between font-bold text-sm text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${isOpen ? 'rotate-180 text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

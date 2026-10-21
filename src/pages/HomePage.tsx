import React, { useState } from 'react';
import { ActivePage, ExamId } from '../types';
import { EXAMS_DATA } from '../data/exams';
import { PASSAGES_DATA } from '../data/passages';
import { BUILTIN_COURSE_LESSONS } from '../data/touchTypingCourseCurriculum';
import {
  Sparkles,
  Play,
  CheckCircle2,
  Trophy,
  Keyboard,
  Clock,
  ArrowRight,
  Zap,
  Target,
  Globe,
  Flame,
  BarChart3,
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

  const totalExamsCount = Object.keys(EXAMS_DATA).length;
  const totalPassagesCount = PASSAGES_DATA.length;
  const totalLessonsCount = BUILTIN_COURSE_LESSONS.length;

  const homeFaqs = [
    {
      q: 'Which Hindi keyboard layout should I use for MP CPCT and SSC exams?',
      a: 'MP CPCT officially permits both InScript and Remington GAIL on Mangal Unicode font. If you learned typing on KrutiDev 010, choose Remington GAIL. If you are learning Devanagari typing afresh, InScript is strongly recommended due to its logical phonetic structure.'
    },
    {
      q: 'How does Typing Wallah calculate Net WPM?',
      a: 'Following standard recruitment norms (5 characters = 1 word), Gross WPM = (Total characters typed ÷ 5) ÷ Time in minutes. Net WPM deducts exam-specific mistake penalties (such as 1 word per mistake, or 10x excess mistake deduction in RRB NTPC after the 5% free error allowance).'
    },
    {
      q: 'Is backspace allowed in actual government typing skill tests?',
      a: 'In most computer-based examinations (such as MP CPCT, SSC CHSL, SSC CGL DEST, and UPSSSC), backspace is enabled within the active passage, though you can also enable Strict Backspace Lock in Exam Settings to practice under judicial hall conditions.'
    },
    {
      q: 'What is the DEST 2,000 key depressions requirement in SSC CGL?',
      a: 'In SSC CGL DEST, candidates must complete 2,000 key depressions in 15 minutes (~8,000 KDPH or ~27 WPM) with a maximum error tolerance of 5% to 7% depending on category.'
    }
  ];

  return (
    <div id="homepage-root" className="space-y-12 sm:space-y-20 pb-16 w-full max-w-full overflow-x-hidden">
      {/* 1. HERO SECTION */}
      <section
        id="hero-section"
        className="relative overflow-hidden pt-6 sm:pt-14 pb-12 sm:pb-20 bg-slate-50 dark:bg-slate-950 border-b border-slate-200/80 dark:border-slate-800/60 transition-colors"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-5 sm:space-y-6">
            {/* Tagline Badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-md bg-blue-100/80 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800/80 text-blue-800 dark:text-blue-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span className="truncate">Practice Smart. Type Fast. Crack Your Exam.</span>
            </div>

            {/* Headline & Subheadline (Master Prompt Section 5) */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              Improve Your Typing Speed. <br className="hidden sm:inline" />
              <span className="text-blue-600 dark:text-blue-400">
                Prepare for Your Exam.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed max-w-2xl mx-auto">
              Free online typing practice in English (QWERTY) and Hindi (Mangal Unicode — Remington GAIL &amp; InScript) with official exam timers, mistake evaluation, and progressive touch-typing lessons.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <button
                id="hero-start-typing-cta"
                type="button"
                onClick={() => onStartTest(undefined, 'english', 300)}
                className="w-full sm:w-auto px-8 py-3.5 sm:py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-base shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center space-x-2.5 shrink-0 cursor-pointer"
              >
                <Play className="w-5 h-5 fill-current text-amber-300" />
                <span>Start Typing Test</span>
              </button>

              <button
                id="hero-explore-exams-cta"
                type="button"
                onClick={() => onNavigate('exams')}
                className="w-full sm:w-auto px-6 py-3.5 sm:py-4 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold text-base border border-slate-300 dark:border-slate-700 shadow-xs transition-all flex items-center justify-center space-x-2 shrink-0 cursor-pointer"
              >
                <span>Explore Exam Practice</span>
                <ArrowRight className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              </button>

              <button
                id="hero-learn-touch-typing-cta"
                type="button"
                onClick={() => onNavigate('touch-typing')}
                className="w-full sm:w-auto px-6 py-3.5 sm:py-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-base shadow-md transition-all flex items-center justify-center space-x-2 shrink-0 cursor-pointer"
              >
                <Hand className="w-5 h-5" />
                <span>Learn Touch Typing</span>
              </button>
            </div>

            {/* Quick Badges */}
            <div className="pt-3 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-slate-500 dark:text-slate-400 font-semibold">
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Hindi InScript &amp; Remington GAIL</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>SSC CHSL, CGL DEST, RRB NTPC &amp; MP CPCT</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>100% Free Practice Mode</span>
              </div>
            </div>
          </div>

          {/* Quick Typing Test Launcher */}
          <div className="mt-10 sm:mt-12 max-w-4xl mx-auto bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md p-5 sm:p-7">
            <div className="flex flex-col md:flex-row items-center justify-between gap-5">
              <div className="space-y-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start space-x-2">
                  <Flame className="w-4 h-4 text-amber-500" />
                  <h2 className="font-bold text-slate-900 dark:text-white text-base">Quick Typing Test</h2>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Choose English or Hindi and select a 1, 3, 5, 10, or 15-minute duration to start immediately.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
                {/* Language Select */}
                <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setQuickLang('english')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      quickLang === 'english'
                        ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    English Test
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickLang('hindi')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      quickLang === 'hindi'
                        ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Hindi Test
                  </button>
                </div>

                {/* Duration Select: 1m, 3m, 5m, 10m, 15m */}
                <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700 text-xs font-bold">
                  {[60, 180, 300, 600, 900].map((secs) => (
                    <button
                      key={secs}
                      type="button"
                      onClick={() => setQuickDuration(secs)}
                      className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
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
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-transform active:scale-95 flex items-center space-x-1.5 shrink-0 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Start {quickDuration / 60}-Min Test</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. VERIFIED PLATFORM CAPABILITIES OVERVIEW */}
      <section id="stats-overview" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 text-center shadow-xs">
            <div className="text-3xl sm:text-4xl font-black text-blue-700 dark:text-blue-400 tabular-nums">
              {totalExamsCount}
            </div>
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mt-1">
              Exam Profiles Covered
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">SSC, RRB, CPCT, High Courts</p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 text-center shadow-xs">
            <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tabular-nums">
              {totalPassagesCount}
            </div>
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mt-1">
              Practice Passages
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">English &amp; Hindi Unicode</p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 text-center shadow-xs">
            <div className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums">
              {totalLessonsCount}
            </div>
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mt-1">
              Touch Typing Lessons
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">Home Row to Exam Mastery</p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 text-center shadow-xs">
            <div className="text-3xl sm:text-4xl font-black text-amber-600 dark:text-amber-400 tabular-nums">
              1m–15m
            </div>
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mt-1">
              Timed Test Modes
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">Real-time WPM &amp; KDPH</p>
          </div>
        </div>
      </section>

      {/* 3. TARGET EXAM CARDS */}
      <section id="target-exams-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
              Exam-Wise Typing Practice
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Select Your Target Government Exam
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('exams')}
            className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center space-x-1 cursor-pointer"
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
                  className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors flex items-center justify-center space-x-1 cursor-pointer"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Start Test</span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('exam-detail', exam.id)}
                  className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-colors cursor-pointer"
                >
                  Pattern
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. DEDICATED HINDI & ENGLISH TYPING + LEARN TOUCH TYPING */}
      <section id="dual-language-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Hindi Typing Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-amber-200/80 dark:border-amber-900/40 p-6 sm:p-8 space-y-5 shadow-xs">
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
              Practice government-standard Hindi typing on <strong>Mangal Font</strong>. Switch seamlessly between <strong>InScript</strong> and <strong>Remington GAIL</strong> for MP CPCT, UPSSSC, BSSC, and High Court exams.
            </p>

            <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Accurate Unicode evaluation for Matras, Halant, and Conjuncts</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Interactive layout maps &amp; built-in QWERTY-to-Hindi converter</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>CPCT, BSSC, UPSSSC &amp; High Court qualifying benchmarks</span>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onNavigate('hindi-typing')}
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
              >
                Open Hindi Typing Hub →
              </button>
              <button
                type="button"
                onClick={() => onStartTest('cpct', 'hindi', 900)}
                className="px-4 py-2.5 rounded-xl border border-amber-300 dark:border-amber-700 hover:bg-amber-100/50 dark:hover:bg-amber-950/40 text-amber-900 dark:text-amber-200 font-bold text-xs cursor-pointer"
              >
                CPCT 15m Mock
              </button>
            </div>
          </div>

          {/* English Typing Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-blue-200/80 dark:border-blue-900/40 p-6 sm:p-8 space-y-5 shadow-xs">
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
              Engineered for <strong>SSC CHSL (35 WPM / 1,750 Depressions)</strong>, <strong>SSC CGL DEST (2,000 Depressions)</strong>, and <strong>RRB NTPC (30 WPM)</strong> with real-time full and half mistake evaluation.
            </p>

            <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Split-screen exam hall interface with word-level highlighting</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Full &amp; half mistake percentage penalties and KDPH tracking</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>1, 3, 5, 10, and 15-minute practice &amp; exam durations</span>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onNavigate('english-typing')}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
              >
                Open English Typing Hub →
              </button>
              <button
                type="button"
                onClick={() => onStartTest('ssc-chsl', 'english', 600)}
                className="px-4 py-2.5 rounded-xl border border-blue-300 dark:border-blue-700 hover:bg-blue-100/50 dark:hover:bg-blue-950/40 text-blue-900 dark:text-blue-200 font-bold text-xs cursor-pointer"
              >
                SSC CHSL 10m Mock
              </button>
            </div>
          </div>
        </div>

        {/* 4.1 LEARN TOUCH TYPING BANNER */}
        <div className="mt-8 bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-amber-400/20 text-amber-300 border border-amber-300/30 text-xs font-bold uppercase tracking-wider">
              <Hand className="w-3.5 h-3.5" />
              <span>Learn Touch Typing • {totalLessonsCount} Progressive Lessons</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black">
              Beginner Lessons, Home-Row Drills &amp; Finger Placement
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Build muscle memory from scratch with guided home-row, top-row, bottom-row, capitalization, number, and accuracy exercises featuring a live visual 10-finger hand guide.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('touch-typing')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-sm shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Hand className="w-4 h-4" />
              <span>Start Touch Typing Course →</span>
            </button>
          </div>
        </div>
      </section>

      {/* 5. PROGRESS & ANALYTICS FEATURES (Master Prompt Section 5) */}
      <section id="progress-features-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            Progress &amp; Performance Tracking
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Measure Every Keystroke Toward Your Qualifying Cutoff
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Real-time WPM tracking, accuracy measurement, personal bests, and historical test comparisons.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-2.5 shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Gross &amp; Net WPM Tracking</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              High-precision timestamp calculation computes Gross WPM, Net WPM, and Key Depressions Per Hour (KDPH) without timer drift.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-2.5 shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Accuracy &amp; Error Diagnostics</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Detailed breakdown of full mistakes (omitted/substituted words) and half mistakes (spelling, punctuation, capitalization).
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-2.5 shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Typing History &amp; Analytics</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Every completed test is saved to your local and cloud history so you can compare your latest attempt against prior scores.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-2.5 shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Trophy className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Personal Bests &amp; Readiness</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Track your peak Net WPM, total practice time, and exact speed gap remaining to qualify for your chosen exam.
            </p>
          </div>
        </div>
      </section>

      {/* 6. POPULAR PRACTICE PASSAGES GRID */}
      <section id="popular-tests" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Practice Passages</span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">Popular Exam Passages</h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('practice')}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 cursor-pointer"
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
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center space-x-1 cursor-pointer"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Start Test</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. FAQ ACCORDION */}
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
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between font-bold text-sm text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
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

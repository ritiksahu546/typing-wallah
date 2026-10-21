import React, { useState, useEffect, useRef } from 'react';
import { ActivePage, ExamId, HindiKeyboardLayout } from '../types';
import {
  TOUCH_TYPING_LESSONS,
  TouchTypingLesson,
  QWERTY_FINGER_MAP,
  FINGER_DETAILS,
  FingerKey
} from '../data/touchTypingData';
import { translatePhysicalKeyToHindi, transliterateNewInputToHindi } from '../engine/hindiKeyboards';
import { InteractiveHandGuide } from '../components/InteractiveHandGuide';
import { TouchTypingKeyboard } from '../components/TouchTypingKeyboard';
import {
  TouchTypingCourseLesson,
  UserCourseProgress,
  DailyPracticeGoal
} from '../types/touchTypingCourse';
import {
  BUILTIN_COURSE_LESSONS,
  COURSE_LEVELS
} from '../data/touchTypingCourseCurriculum';
import { LearningProgressService } from '../services/learningProgressService';
import { CourseLessonPlayer } from '../components/learning/CourseLessonPlayer';
import { CourseCurriculumDrawer } from '../components/learning/CourseCurriculumDrawer';
import { LearningDashboardModal } from '../components/learning/LearningDashboardModal';
import { AdminLessonManagerModal } from '../components/learning/AdminLessonManagerModal';
import { useAuth } from '../context/AuthContext';
import {
  BookOpen,
  Keyboard,
  Hand,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Volume2,
  VolumeX,
  Play,
  Lightbulb,
  Award,
  Zap,
  Globe,
  Trophy,
  Layers,
  Settings,
  Flame,
  Target
} from 'lucide-react';

interface LearnTouchTypingPageProps {
  onStartExam?: (examId?: ExamId, lang?: 'english' | 'hindi', duration?: number) => void;
  onNavigate: (page: ActivePage, examId?: ExamId) => void;
}

export const LearnTouchTypingPage: React.FC<LearnTouchTypingPageProps> = ({
  onStartExam,
  onNavigate
}) => {
  const { currentUser, profile, isAdmin } = useAuth();

  // Mode: 'course' (92-lesson sequential curriculum) vs 'free-practice' (classic explorer)
  const [activeMode, setActiveMode] = useState<'course' | 'free-practice'>('course');

  // Course Curriculum State
  const [lessons, setLessons] = useState<TouchTypingCourseLesson[]>(BUILTIN_COURSE_LESSONS);
  const [selectedLesson, setSelectedLesson] = useState<TouchTypingCourseLesson>(BUILTIN_COURSE_LESSONS[0]);
  const [progress, setProgress] = useState<UserCourseProgress>({
    userId: 'guest',
    currentLessonNumber: 1,
    highestUnlockedLessonNumber: 1,
    completedLessonIds: [],
    bestWpm: 0,
    avgWpm: 0,
    avgAccuracy: 100,
    totalAttempts: 0,
    passedAttempts: 0,
    currentStreak: 1,
    lastActiveDate: new Date().toISOString().split('T')[0],
    todayWordsTyped: 0,
    todayPracticeTimeSeconds: 0,
    lastUpdated: Date.now()
  });
  const [dailyGoal, setDailyGoal] = useState<DailyPracticeGoal>(LearningProgressService.getDailyGoal());

  // Modal / Drawer visibility
  const [isCurriculumDrawerOpen, setIsCurriculumDrawerOpen] = useState(false);
  const [isDashboardModalOpen, setIsDashboardModalOpen] = useState(false);
  const [isAdminManagerOpen, setIsAdminManagerOpen] = useState(false);

  // Load progress and custom curriculum from Firestore / LocalStorage
  useEffect(() => {
    const loadCourseData = async () => {
      const combined = await LearningProgressService.getCombinedCurriculum();
      setLessons(combined);

      const userProg = await LearningProgressService.getUserCourseProgress(currentUser?.uid);
      setProgress(userProg);

      // Default active lesson: user's highest unlocked or current
      const resumeLesson =
        combined.find((l) => l.lessonNumber === userProg.currentLessonNumber) ||
        combined.find((l) => l.lessonNumber === userProg.highestUnlockedLessonNumber) ||
        combined[0];
      setSelectedLesson(resumeLesson);
    };

    loadCourseData();
  }, [currentUser?.uid]);

  // Handle updates from completed lessons
  const handleProgressUpdated = (updated: UserCourseProgress) => {
    setProgress(updated);
  };

  // -------------------------------------------------------------
  // CLASSIC FREE-PRACTICE STATE (100% PRESERVED)
  // -------------------------------------------------------------
  const [selectedLanguage, setSelectedLanguage] = useState<'english' | 'hindi'>('english');
  const [hindiLayout, setHindiLayout] = useState<HindiKeyboardLayout>('remington_gail');
  const [currentLessonIndex, setCurrentLessonIndex] = useState<number>(0);
  const [activeFingerFilter, setActiveFingerFilter] = useState<FingerKey | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const [typedInput, setTypedInput] = useState<string>('');
  const [mistakeCount, setMistakeCount] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number | null>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const currentLesson: TouchTypingLesson =
    TOUCH_TYPING_LESSONS[currentLessonIndex] || TOUCH_TYPING_LESSONS[0];

  const targetText =
    selectedLanguage === 'english'
      ? currentLesson.practiceTextEnglish
      : hindiLayout === 'remington_gail'
      ? currentLesson.practiceTextHindiRemington
      : currentLesson.practiceTextHindiInscript;

  const nextExpectedChar =
    typedInput.length < targetText.length ? targetText[typedInput.length] : '';
  const nextCharMapping = nextExpectedChar
    ? QWERTY_FINGER_MAP[nextExpectedChar.toLowerCase()]
    : undefined;

  useEffect(() => {
    if (activeMode === 'free-practice') {
      setTypedInput('');
      setMistakeCount(0);
      setIsCompleted(false);
      setStartTime(null);
      setTimeout(() => {
        inputRef.current?.focus({ preventScroll: true });
      }, 100);
    }
  }, [currentLessonIndex, selectedLanguage, hindiLayout, activeMode]);

  const playClick = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.05);
    } catch {
      // AudioContext unavailable
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isCompleted) return;

    if (
      selectedLanguage === 'hindi' &&
      e.key.length === 1 &&
      e.key !== ' ' &&
      !e.ctrlKey &&
      !e.altKey &&
      !e.metaKey
    ) {
      const hindiChar = translatePhysicalKeyToHindi(e.key, e.shiftKey, hindiLayout);
      if (hindiChar) {
        e.preventDefault();
        if (!startTime) {
          setStartTime(Date.now());
        }
        const nextVal = typedInput + hindiChar;
        if (nextVal.length <= targetText.length) {
          const charIndex = typedInput.length;
          if (charIndex < targetText.length) {
            if (nextVal.slice(charIndex) !== targetText.slice(charIndex, nextVal.length)) {
              setMistakeCount((prev) => prev + 1);
            } else {
              playClick();
            }
          }
          setTypedInput(nextVal);
          if (nextVal.length === targetText.length) {
            setIsCompleted(true);
          }
        }
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isCompleted) return;

    let val = e.target.value;
    if (!startTime && val.length > 0) {
      setStartTime(Date.now());
    }

    if (selectedLanguage === 'hindi' && val.length > typedInput.length) {
      val = transliterateNewInputToHindi(typedInput, val, hindiLayout);
    }

    if (val.length > typedInput.length) {
      const charIndex = val.length - 1;
      if (charIndex < targetText.length) {
        if (val[charIndex] !== targetText[charIndex]) {
          setMistakeCount((prev) => prev + 1);
        } else {
          playClick();
        }
      }
    }

    if (val.length <= targetText.length) {
      setTypedInput(val);
      if (val.length === targetText.length) {
        setIsCompleted(true);
      }
    }
  };

  const handleResetLesson = () => {
    setTypedInput('');
    setMistakeCount(0);
    setIsCompleted(false);
    setStartTime(null);
    inputRef.current?.focus({ preventScroll: true });
  };

  const handleNextLesson = () => {
    if (currentLessonIndex < TOUCH_TYPING_LESSONS.length - 1) {
      setCurrentLessonIndex((prev) => prev + 1);
    }
  };

  const handlePrevLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex((prev) => prev - 1);
    }
  };

  const accuracy =
    typedInput.length > 0
      ? Math.max(0, Math.round(((typedInput.length - mistakeCount) / typedInput.length) * 100))
      : 100;

  return (
    <div id="learn-touch-typing-page" className="max-w-6xl mx-auto px-3 sm:px-6 py-2.5 space-y-2.5">
      {/* Compact Single-Row Top Bar so the entire Touch Typing Stage fits in 1 screen */}
      <div className="bg-slate-900 text-white rounded-xl px-3.5 py-2 border border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="flex rounded-lg bg-slate-800 p-0.5 border border-slate-700 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveMode('course')}
              className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeMode === 'course'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-amber-300" />
              <span>92-Lesson Course</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveMode('free-practice')}
              className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeMode === 'free-practice'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Keyboard className="w-3.5 h-3.5" />
              <span>Free Layout & Hindi Guide</span>
            </button>
          </div>

          <div className="hidden md:flex items-center gap-2 text-xs text-slate-300 font-medium">
            <span>{progress.completedLessonIds.length} / {lessons.length} Passed</span>
            <span aria-hidden="true">·</span>
            <span className="text-amber-300">{progress.currentStreak} Day Streak</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {activeMode === 'course' && (
            <>
              <button
                type="button"
                onClick={() => setIsCurriculumDrawerOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 border border-slate-700 transition-colors cursor-pointer whitespace-nowrap"
              >
                <Layers className="w-3.5 h-3.5 text-blue-400" />
                <span>All Lessons ({lessons.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setIsDashboardModalOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
              >
                <Target className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </button>

              {isAdmin && (
                <button
                  type="button"
                  onClick={() => setIsAdminManagerOpen(true)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
                  title="Admin Lesson CMS"
                >
                  <Settings className="w-3.5 h-3.5" />
                </button>
              )}
            </>
          )}

          {activeMode === 'free-practice' && (
            <button
              type="button"
              onClick={() => onNavigate('typing-test')}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Full Exam Practice</span>
            </button>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* MODE 1: PROGRESSIVE 92-LESSON CAREER COURSE (PRIMARY)     */}
      {/* ========================================================= */}
      {activeMode === 'course' && (
        <CourseLessonPlayer
          lesson={selectedLesson}
          allLessons={lessons}
          progress={progress}
          onLessonChange={(lesson) => setSelectedLesson(lesson)}
          onOpenCurriculum={() => setIsCurriculumDrawerOpen(true)}
          onOpenDashboard={() => setIsDashboardModalOpen(true)}
          onProgressUpdated={handleProgressUpdated}
        />
      )}

      {/* ========================================================= */}
      {/* MODE 2: CLASSIC FREE PRACTICE & HINDI/ENGLISH LAYOUTS    */}
      {/* ========================================================= */}
      {activeMode === 'free-practice' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Language & Layout Selection Ribbon */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700 text-xs font-bold">
              <button
                type="button"
                onClick={() => setSelectedLanguage('english')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  selectedLanguage === 'english'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                English QWERTY
              </button>
              <button
                type="button"
                onClick={() => setSelectedLanguage('hindi')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  selectedLanguage === 'hindi'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                Hindi (मंगल फ़ॉन्ट)
              </button>
            </div>

            {selectedLanguage === 'hindi' && (
              <div className="flex rounded-xl bg-amber-500/10 p-1 border border-amber-400/30 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setHindiLayout('remington_gail')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    hindiLayout === 'remington_gail'
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'text-amber-700 dark:text-amber-300'
                  }`}
                >
                  Remington GAIL
                </button>
                <button
                  type="button"
                  onClick={() => setHindiLayout('inscript')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    hindiLayout === 'inscript'
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'text-amber-700 dark:text-amber-300'
                  }`}
                >
                  InScript (सरकारी मानक)
                </button>
              </div>
            )}
          </div>

          {/* Lesson Navigation Slider */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                पाठ / Lessons:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {TOUCH_TYPING_LESSONS.map((l, idx) => (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => setCurrentLessonIndex(idx)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      currentLessonIndex === idx
                        ? 'bg-blue-600 text-white shadow-sm scale-105'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    L{l.level}: {l.titleHindi.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={handlePrevLesson}
                disabled={currentLessonIndex === 0}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="पिछला पाठ"
              >
                <ArrowLeft className="w-4 h-4 text-slate-600 dark:text-slate-300" />
              </button>
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                {currentLessonIndex + 1} / {TOUCH_TYPING_LESSONS.length}
              </span>
              <button
                type="button"
                onClick={handleNextLesson}
                disabled={currentLessonIndex === TOUCH_TYPING_LESSONS.length - 1}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="अगला पाठ"
              >
                <ArrowRight className="w-4 h-4 text-slate-600 dark:text-slate-300" />
              </button>
            </div>
          </div>

          {/* Main Interactive Learning Workspace */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div>
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                      Level {currentLesson.level} • {currentLesson.titleEnglish}
                    </span>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                      {currentLesson.titleHindi}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {currentLesson.subtitleHindi}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                    title={soundEnabled ? 'ध्वनि चालू' : 'ध्वनि बंद'}
                  >
                    {soundEnabled ? (
                      <Volume2 className="w-4 h-4 text-blue-600" />
                    ) : (
                      <VolumeX className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {currentLesson.descriptionHindi}
                </p>

                <div className="bg-blue-50/70 dark:bg-blue-950/30 rounded-xl p-4 border border-blue-100 dark:border-blue-900 space-y-2">
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-blue-800 dark:text-blue-300">
                    <Lightbulb className="w-4 h-4 text-amber-500" />
                    <span>गुरु मंत्र (Typing Rules):</span>
                  </div>
                  <ul className="space-y-1 text-xs text-blue-900 dark:text-blue-200 pl-5 list-disc">
                    {currentLesson.tips.map((tip, idx) => (
                      <li key={idx}>{tip}</li>
                    ))}
                  </ul>
                </div>

                {nextExpectedChar && nextCharMapping && (
                  <div className="p-4 rounded-xl border-2 border-blue-300 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/40 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase block">
                        अगला बटन दबाएं:
                      </span>
                      <div className="flex items-center space-x-2 mt-0.5">
                        <span className="text-2xl font-black font-mono text-blue-700 dark:text-blue-400 bg-white dark:bg-slate-800 px-3 py-0.5 rounded-lg border border-blue-200 dark:border-blue-700 uppercase shadow-xs">
                          {nextExpectedChar === ' ' ? 'Space' : nextExpectedChar}
                        </span>
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          👉 {nextCharMapping.fingerHindi}
                        </span>
                      </div>
                    </div>
                    <div className="text-right text-xs text-slate-600 dark:text-slate-400 max-w-[200px]">
                      {nextCharMapping.tipHindi}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
                    <span>टाइप करें (नीचे बॉक्स में लिखें):</span>
                    <span>
                      प्रगति: {typedInput.length} / {targetText.length} | सटीकता:{' '}
                      <strong>{accuracy}%</strong>
                    </span>
                  </div>

                  <div
                    className={`p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-lg sm:text-xl font-medium tracking-wide select-none leading-relaxed overflow-x-auto whitespace-pre-wrap ${
                      selectedLanguage === 'hindi' ? 'font-hindi' : 'font-mono'
                    }`}
                    onClick={() => inputRef.current?.focus()}
                  >
                    {targetText.split('').map((char, idx) => {
                      let cls = 'transition-colors ';
                      if (idx < typedInput.length) {
                        if (typedInput[idx] === char) {
                          cls +=
                            'text-emerald-600 dark:text-emerald-400 bg-emerald-100/70 dark:bg-emerald-950/60 font-bold';
                        } else {
                          cls +=
                            'text-rose-600 dark:text-rose-400 bg-rose-200 dark:bg-rose-950/80 font-bold underline';
                        }
                      } else if (idx === typedInput.length) {
                        cls += 'bg-blue-600 text-white rounded font-black animate-pulse px-0.5';
                      } else {
                        cls += 'text-slate-400 dark:text-slate-500';
                      }

                      return (
                        <span key={idx} className={cls}>
                          {char}
                        </span>
                      );
                    })}
                  </div>

                  <div className="relative">
                    <input
                      ref={inputRef}
                      type="text"
                      id="touch-typing-live-input"
                      value={typedInput}
                      onKeyDown={handleKeyDown}
                      onChange={handleInputChange}
                      disabled={isCompleted}
                      placeholder="यहाँ टाइप करना शुरू करें (उंगलियों की सही पोजीशन रखें)..."
                      autoFocus
                      spellCheck={false}
                      autoCapitalize="none"
                      autoCorrect="off"
                      autoComplete="off"
                      className={`w-full px-4 py-3 rounded-xl border-2 border-slate-300 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-base outline-none transition-all shadow-xs ${
                        selectedLanguage === 'hindi' ? 'font-hindi' : 'font-mono'
                      }`}
                    />

                    <div className="absolute right-2 top-2 flex items-center space-x-1">
                      <button
                        type="button"
                        onClick={handleResetLesson}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="रीसेट करें"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {isCompleted && (
                    <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        <div>
                          <p className="text-sm font-black text-emerald-900 dark:text-emerald-200">
                            शाबाश! आपने यह पाठ सफलतापूर्वक पूरा कर लिया।
                          </p>
                          <p className="text-xs text-emerald-700 dark:text-emerald-400">
                            सटीकता: {accuracy}% • कुल गलतियां: {mistakeCount}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleNextLesson}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md flex items-center space-x-1"
                      >
                        <span>अगला पाठ (Next)</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-6">
              <InteractiveHandGuide
                highlightKey={nextExpectedChar || 'f'}
                selectedFinger={activeFingerFilter}
                onSelectFinger={(f) => setActiveFingerFilter(f)}
                language={selectedLanguage}
                hindiLayout={hindiLayout}
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Keyboard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  कलर कोडेड टच टाइपिंग कीबोर्ड (Color Coded Touch Typing Keyboard)
                </h3>
              </div>
              <span className="text-xs text-slate-400">
                प्रत्येक रंग एक विशिष्ट उंगली को दर्शाता है
              </span>
            </div>

            <TouchTypingKeyboard
              layout={selectedLanguage === 'english' ? 'standard' : hindiLayout}
              activeKeyChar={nextExpectedChar || 'f'}
              showFingersColor={true}
            />
          </div>
        </div>
      )}

      {/* Curriculum Drawer */}
      <CourseCurriculumDrawer
        isOpen={isCurriculumDrawerOpen}
        onClose={() => setIsCurriculumDrawerOpen(false)}
        lessons={lessons}
        activeLessonId={selectedLesson.id}
        progress={progress}
        onSelectLesson={(l) => setSelectedLesson(l)}
      />

      {/* Student Dashboard Modal */}
      <LearningDashboardModal
        isOpen={isDashboardModalOpen}
        onClose={() => setIsDashboardModalOpen(false)}
        progress={progress}
        dailyGoal={dailyGoal}
        totalLessonsCount={lessons.length}
        onJumpToLesson={(num) => {
          const l = lessons.find((x) => x.lessonNumber === num);
          if (l) setSelectedLesson(l);
        }}
      />

      {/* Admin Lesson Manager Modal */}
      <AdminLessonManagerModal
        isOpen={isAdminManagerOpen}
        onClose={() => setIsAdminManagerOpen(false)}
        lessons={lessons}
        onLessonsUpdated={(updated) => setLessons(updated)}
      />
    </div>
  );
};

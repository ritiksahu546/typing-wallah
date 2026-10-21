import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  TouchTypingCourseLesson,
  UserCourseProgress,
  LessonAttemptResult
} from '../../types/touchTypingCourse';
import { TouchTypingVisualStage, getFingerForKey } from '../TouchTypingVisualStage';
import { LessonResultModal } from './LessonResultModal';
import { LockedLessonNotice } from './LockedLessonNotice';
import { LearningProgressService } from '../../services/learningProgressService';
import {
  BookOpen,
  Target,
  Zap,
  RotateCcw,
  Volume2,
  VolumeX,
  Lock,
  Unlock,
  ArrowRight,
  ArrowLeft,
  Flame,
  CheckCircle2,
  Trophy,
  Layers,
  Sparkles
} from 'lucide-react';

interface CourseLessonPlayerProps {
  lesson: TouchTypingCourseLesson;
  allLessons: TouchTypingCourseLesson[];
  progress: UserCourseProgress;
  onLessonChange: (lesson: TouchTypingCourseLesson) => void;
  onOpenCurriculum: () => void;
  onOpenDashboard: () => void;
  onProgressUpdated: (updated: UserCourseProgress) => void;
}

// Low-latency Web Audio sound synthesizer for realistic tactile feedback
const playTone = (type: 'key' | 'error' | 'success', soundEnabled: boolean) => {
  if (!soundEnabled) return;
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    if (type === 'key') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } else if (type === 'error') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } else if (type === 'success') {
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.06);
        gain.gain.setValueAtTime(0.08, ctx.currentTime + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.06 + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.06);
        osc.stop(ctx.currentTime + i * 0.06 + 0.2);
      });
    }
  } catch {
    // AudioContext failure ignore
  }
};

export const CourseLessonPlayer: React.FC<CourseLessonPlayerProps> = ({
  lesson,
  allLessons,
  progress,
  onLessonChange,
  onOpenCurriculum,
  onOpenDashboard,
  onProgressUpdated
}) => {
  // Check if this lesson is unlocked
  const isLessonUnlocked = lesson.lessonNumber <= progress.highestUnlockedLessonNumber;

  // Player mode tabs: 'intro' | 'practice' | 'test'
  const [activeTab, setActiveTab] = useState<'intro' | 'practice' | 'test'>(
    lesson.mode === 'test' ? 'test' : 'intro'
  );

  const [soundEnabled, setSoundEnabled] = useState(true);

  // Sequences setup
  const introSequence = useMemo(() => {
    return (lesson.introductionText || lesson.practiceText || 'f j f j').split('');
  }, [lesson]);

  const practiceSequence = useMemo(() => {
    return (lesson.practiceText || 'fj fj jf jf fff jjj').split('');
  }, [lesson]);

  const testText = useMemo(() => {
    return lesson.testText || lesson.practiceText || 'fff jjj fff jjj';
  }, [lesson]);

  // Stage state for intro and practice
  const [introIdx, setIntroIdx] = useState(0);
  const [practiceIdx, setPracticeIdx] = useState(0);
  const [mistakeShake, setMistakeShake] = useState(false);

  // Test Mode state
  const [testInput, setTestInput] = useState('');
  const [testStartTime, setTestStartTime] = useState<number | null>(null);
  const [testEndTime, setTestEndTime] = useState<number | null>(null);
  const [testErrors, setTestErrors] = useState(0);
  const [testBackspaces, setTestBackspaces] = useState(0);
  const [testIsActive, setTestIsActive] = useState(false);
  const [testWpm, setTestWpm] = useState(0);
  const [testAccuracy, setTestAccuracy] = useState(100);

  // Result modal state
  const [showResultModal, setShowResultModal] = useState(false);
  const [latestResult, setLatestResult] = useState<LessonAttemptResult | null>(null);
  const [latestNextUnlocked, setLatestNextUnlocked] = useState(false);

  // Focus input ref
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const testTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Reset states when lesson changes
  useEffect(() => {
    setIntroIdx(0);
    setPracticeIdx(0);
    setTestInput('');
    setTestStartTime(null);
    setTestEndTime(null);
    setTestErrors(0);
    setTestBackspaces(0);
    setTestIsActive(false);
    setTestWpm(0);
    setTestAccuracy(100);
    setShowResultModal(false);
    setActiveTab(lesson.mode === 'test' ? 'test' : 'intro');
  }, [lesson.id]);

  // Keep hidden input focused in intro/practice mode
  const focusInput = () => {
    if (activeTab === 'test') {
      testTextareaRef.current?.focus();
    } else {
      hiddenInputRef.current?.focus();
    }
  };

  useEffect(() => {
    focusInput();
  }, [activeTab, introIdx, practiceIdx]);

  // Handle typing in Introduction & Practice mode
  const handleStageKeyDown = (e: React.KeyboardEvent) => {
    if (!isLessonUnlocked) return;
    if (e.key === 'Tab' || e.key === 'Alt' || e.key === 'Control' || e.key === 'Shift') return;

    const currentSequence = activeTab === 'intro' ? introSequence : practiceSequence;
    const currentIdx = activeTab === 'intro' ? introIdx : practiceIdx;
    const setIdx = activeTab === 'intro' ? setIntroIdx : setPracticeIdx;

    const targetChar = currentSequence[currentIdx];
    if (!targetChar) return;

    if (e.key === targetChar) {
      playTone('key', soundEnabled);
      const nextIdx = currentIdx + 1;
      setIdx(nextIdx);

      if (nextIdx >= currentSequence.length) {
        playTone('success', soundEnabled);
        if (activeTab === 'intro') {
          // Auto switch to practice or test
          setTimeout(() => {
            setActiveTab('practice');
            setPracticeIdx(0);
          }, 300);
        } else if (activeTab === 'practice') {
          // Prompt to take test
          setTimeout(() => {
            setActiveTab('test');
          }, 300);
        }
      }
    } else {
      // Mistake
      playTone('error', soundEnabled);
      setMistakeShake(true);
      setTimeout(() => setMistakeShake(false), 300);
    }
  };

  // Handle Test Mode typing & real-time analytics
  const handleTestChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!isLessonUnlocked) return;
    const val = e.target.value;

    if (!testIsActive && val.length > 0) {
      setTestIsActive(true);
      setTestStartTime(Date.now());
    }

    // Count backspaces
    if (val.length < testInput.length) {
      setTestBackspaces((prev) => prev + 1);
    }

    setTestInput(val);
    playTone('key', soundEnabled);

    // Calculate real-time speed & accuracy
    const now = Date.now();
    const elapsedSeconds = testStartTime ? Math.max(1, (now - testStartTime) / 1000) : 1;

    let errors = 0;
    for (let i = 0; i < val.length; i++) {
      if (val[i] !== testText[i]) {
        errors++;
      }
    }
    setTestErrors(errors);

    const typedWords = val.length / 5;
    const grossWpm = Math.round((typedWords / (elapsedSeconds / 60)) || 0);
    const uncorrectedErrors = errors;
    const netWpm = Math.max(0, Math.round(((typedWords - uncorrectedErrors) / (elapsedSeconds / 60)) || 0));
    const accuracy = val.length > 0 ? Math.max(0, Math.round(((val.length - errors) / val.length) * 100)) : 100;

    setTestWpm(netWpm);
    setTestAccuracy(accuracy);

    // Check completion
    if (val.length >= testText.length) {
      finishTest(val, errors, elapsedSeconds, grossWpm, netWpm, accuracy);
    }
  };

  // Complete and submit test attempt
  const finishTest = async (
    val: string,
    errors: number,
    durationSeconds: number,
    grossWpm: number,
    netWpm: number,
    accuracy: number
  ) => {
    setTestEndTime(Date.now());
    setTestIsActive(false);

    const record = await LearningProgressService.recordLessonAttempt(
      {
        userId: progress.userId,
        lessonId: lesson.id,
        lessonNumber: lesson.lessonNumber,
        grossWpm,
        netWpm,
        accuracy,
        errors,
        backspaces: testBackspaces,
        durationSeconds: Math.round(durationSeconds)
      },
      lesson
    );

    setLatestResult(record.attemptResult);
    setLatestNextUnlocked(record.nextUnlocked);
    setShowResultModal(true);
    onProgressUpdated(record.updatedProgress);

    if (record.passed) {
      playTone('success', soundEnabled);
    } else {
      playTone('error', soundEnabled);
    }
  };

  // Restart current test
  const handleRestartTest = () => {
    setTestInput('');
    setTestStartTime(null);
    setTestEndTime(null);
    setTestErrors(0);
    setTestBackspaces(0);
    setTestIsActive(false);
    setTestWpm(0);
    setTestAccuracy(100);
    setShowResultModal(false);
    setTimeout(() => testTextareaRef.current?.focus(), 100);
  };

  // Continue to next lesson after passing
  const handleContinueNext = () => {
    setShowResultModal(false);
    const nextLesson = allLessons.find((l) => l.lessonNumber === lesson.lessonNumber + 1);
    if (nextLesson) {
      onLessonChange(nextLesson);
    }
  };

  // Navigate directly if unlocked
  const goToNextLesson = () => {
    const next = allLessons.find((l) => l.lessonNumber === lesson.lessonNumber + 1);
    if (next && next.lessonNumber <= progress.highestUnlockedLessonNumber) {
      onLessonChange(next);
    }
  };

  const goToPrevLesson = () => {
    const prev = allLessons.find((l) => l.lessonNumber === lesson.lessonNumber - 1);
    if (prev) {
      onLessonChange(prev);
    }
  };

  // If lesson is locked, show strict lock screen
  if (!isLessonUnlocked) {
    return (
      <LockedLessonNotice
        lesson={lesson}
        highestUnlockedLessonNumber={progress.highestUnlockedLessonNumber}
        onGoToUnlocked={() => {
          const unlockedLesson = allLessons.find(
            (l) => l.lessonNumber === progress.highestUnlockedLessonNumber
          );
          if (unlockedLesson) onLessonChange(unlockedLesson);
        }}
        onGoBack={onOpenCurriculum}
      />
    );
  }

  const isCompleted = progress.completedLessonIds.includes(lesson.id);
  const nextLessonExists = allLessons.some((l) => l.lessonNumber === lesson.lessonNumber + 1);
  const canGoNext =
    nextLessonExists && lesson.lessonNumber + 1 <= progress.highestUnlockedLessonNumber;

  return (
    <div className="max-w-5xl mx-auto space-y-6" onClick={focusInput}>
      {/* Hidden input for capturing keyboard events smoothly */}
      <input
        ref={hiddenInputRef}
        type="text"
        className="opacity-0 absolute -top-9999 pointer-events-none"
        onKeyDown={handleStageKeyDown}
        autoFocus
      />

      {/* Top Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Lesson Title & Level */}
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={goToPrevLesson}
              disabled={lesson.lessonNumber <= 1}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
              title="Previous Lesson"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
                  Lesson {lesson.lessonNumber}
                </span>

                {isCompleted && (
                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Passed ✓</span>
                  </span>
                )}

                {lesson.tier === 'pro' && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-500 uppercase">
                    PRO
                  </span>
                )}
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
                {lesson.name}
              </h1>
            </div>

            <button
              type="button"
              onClick={goToNextLesson}
              disabled={!canGoNext}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
              title={canGoNext ? 'Next Lesson' : 'Next lesson is locked'}
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Actions & Sound */}
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={soundEnabled ? 'Mute typing sounds' : 'Enable typing sounds'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-blue-500" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={onOpenCurriculum}
              className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs flex items-center space-x-1.5 transition-colors"
            >
              <Layers className="w-3.5 h-3.5 text-blue-500" />
              <span>All Lessons ({allLessons.length})</span>
            </button>

            <button
              type="button"
              onClick={onOpenDashboard}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-blue-500/20 transition-all"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-300" />
              <span>Dashboard</span>
            </button>
          </div>
        </div>

        {/* Lesson Mode Navigation Tabs & Criteria Pill */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
            <button
              type="button"
              onClick={() => {
                setActiveTab('intro');
                setIntroIdx(0);
              }}
              className={`px-4 py-2 rounded-xl font-black text-xs transition-all ${
                activeTab === 'intro'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
              }`}
            >
              1. Key Introduction
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('practice');
                setPracticeIdx(0);
              }}
              className={`px-4 py-2 rounded-xl font-black text-xs transition-all ${
                activeTab === 'practice'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
              }`}
            >
              2. Practice Drills
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('test')}
              className={`px-4 py-2 rounded-xl font-black text-xs transition-all flex items-center space-x-1 ${
                activeTab === 'test'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              <span>3. Benchmark Test (Unlock Next)</span>
            </button>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <span className="text-slate-500 dark:text-slate-400">Pass Benchmark:</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
              {lesson.targetWpm} WPM • {lesson.minAccuracy}% Accuracy
            </span>
          </div>
        </div>
      </div>

      {/* Main Interactive Stage */}
      {activeTab === 'intro' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <TouchTypingVisualStage
            currentKey={introSequence[introIdx] || ' '}
            sequence={introSequence}
            currentIndex={introIdx}
            mode="introduction"
            mistakeTrigger={mistakeShake}
          />

          <div className="text-center">
            <button
              type="button"
              onClick={() => setActiveTab('practice')}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 inline-flex items-center space-x-1.5 transition-all"
            >
              <span>Continue to Practice Drills →</span>
            </button>
          </div>
        </div>
      )}

      {activeTab === 'practice' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <TouchTypingVisualStage
            currentKey={practiceSequence[practiceIdx] || ' '}
            sequence={practiceSequence}
            currentIndex={practiceIdx}
            mode="practice"
            mistakeTrigger={mistakeShake}
          />

          <div className="flex justify-center items-center gap-3">
            <button
              type="button"
              onClick={() => setPracticeIdx(0)}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs inline-flex items-center space-x-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Practice</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('test')}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-md shadow-blue-500/20 inline-flex items-center space-x-1.5 transition-all"
            >
              <Target className="w-3.5 h-3.5" />
              <span>Take Benchmark Test & Unlock Next Lesson →</span>
            </button>
          </div>
        </div>
      )}

      {activeTab === 'test' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6 animate-in fade-in duration-200">
          {/* Test HUD Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-3 border border-slate-200 dark:border-slate-700/60 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Current Speed</span>
              <div className="flex items-baseline justify-center space-x-1 mt-0.5">
                <span className="text-2xl font-black text-blue-600 dark:text-blue-400">
                  {testWpm}
                </span>
                <span className="text-xs text-slate-400 font-bold">WPM</span>
              </div>
              <span className="text-[10px] text-slate-400 block">Goal: {lesson.targetWpm}</span>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-3 border border-slate-200 dark:border-slate-700/60 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Accuracy</span>
              <div className="flex items-baseline justify-center space-x-1 mt-0.5">
                <span className={`text-2xl font-black ${testAccuracy >= lesson.minAccuracy ? 'text-emerald-500' : 'text-amber-500'}`}>
                  {testAccuracy}%
                </span>
              </div>
              <span className="text-[10px] text-slate-400 block">Min: {lesson.minAccuracy}%</span>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-3 border border-slate-200 dark:border-slate-700/60 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Errors</span>
              <div className="flex items-baseline justify-center space-x-1 mt-0.5">
                <span className="text-2xl font-black text-rose-500">{testErrors}</span>
              </div>
              <span className="text-[10px] text-slate-400 block">Backspaces: {testBackspaces}</span>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-3 border border-slate-200 dark:border-slate-700/60 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Progress</span>
              <div className="flex items-baseline justify-center space-x-1 mt-0.5">
                <span className="text-2xl font-black text-slate-800 dark:text-slate-200">
                  {Math.min(100, Math.round((testInput.length / testText.length) * 100))}%
                </span>
              </div>
              <span className="text-[10px] text-slate-400 block">
                {testInput.length}/{testText.length} chars
              </span>
            </div>
          </div>

          {/* Benchmark Text Display */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 font-mono text-base sm:text-lg leading-relaxed tracking-wider select-none relative min-h-32">
            {testText.split('').map((char, index) => {
              const isTyped = index < testInput.length;
              const isCorrect = isTyped && testInput[index] === char;
              const isCurrent = index === testInput.length;

              return (
                <span
                  key={index}
                  className={`${
                    isCorrect
                      ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30'
                      : isTyped
                      ? 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 line-through'
                      : isCurrent
                      ? 'bg-blue-600 text-white rounded-xs px-0.5 animate-pulse'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {char}
                </span>
              );
            })}
          </div>

          {/* Interactive Typing Textarea */}
          <div className="relative">
            <textarea
              ref={testTextareaRef}
              value={testInput}
              onChange={handleTestChange}
              placeholder="Click here and start typing the benchmark test above..."
              rows={3}
              className="w-full p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-base focus:ring-0 focus:outline-hidden transition-colors"
            />

            {!testIsActive && testInput.length === 0 && (
              <div className="absolute top-4 right-4 pointer-events-none">
                <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold animate-pulse">
                  <Sparkles className="w-3 h-3" />
                  <span>Timer starts when you press first key</span>
                </span>
              </div>
            )}
          </div>

          {/* Footer Controls */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleRestartTest}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs flex items-center space-x-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Benchmark</span>
            </button>

            <span className="text-xs text-slate-400">
              Must pass <span className="font-bold text-slate-700 dark:text-slate-300">{lesson.targetWpm} WPM</span> &{' '}
              <span className="font-bold text-slate-700 dark:text-slate-300">{lesson.minAccuracy}% Acc</span> to unlock Lesson {lesson.lessonNumber + 1}
            </span>
          </div>
        </div>
      )}

      {/* Pass / Fail Result Modal */}
      <LessonResultModal
        isOpen={showResultModal}
        result={latestResult}
        lesson={lesson}
        nextUnlocked={latestNextUnlocked}
        onContinueNext={handleContinueNext}
        onRetry={handleRestartTest}
        onClose={() => setShowResultModal(false)}
      />
    </div>
  );
};

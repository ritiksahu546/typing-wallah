import React from 'react';
import { LessonAttemptResult, TouchTypingCourseLesson } from '../../types/touchTypingCourse';
import {
  CheckCircle2,
  XCircle,
  Trophy,
  ArrowRight,
  RotateCcw,
  BookOpen,
  Lock,
  Unlock,
  Zap,
  Target,
  Clock,
  AlertTriangle
} from 'lucide-react';

interface LessonResultModalProps {
  isOpen: boolean;
  result: LessonAttemptResult | null;
  lesson: TouchTypingCourseLesson | null;
  nextUnlocked: boolean;
  onContinueNext: () => void;
  onRetry: () => void;
  onClose: () => void;
}

export const LessonResultModal: React.FC<LessonResultModalProps> = ({
  isOpen,
  result,
  lesson,
  nextUnlocked,
  onContinueNext,
  onRetry,
  onClose
}) => {
  if (!isOpen || !result || !lesson) return null;

  const passed = result.passed;
  const targetWpm = lesson.targetWpm;
  const minAccuracy = lesson.minAccuracy;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 overflow-hidden">
        {/* Top Decorative Banner */}
        <div
          className={`-mx-6 -mt-6 sm:-mx-8 sm:-mt-8 p-6 text-center text-white relative overflow-hidden ${
            passed
              ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600'
              : 'bg-gradient-to-r from-rose-600 via-pink-600 to-amber-600'
          }`}
        >
          <div className="relative z-10 flex flex-col items-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg">
              {passed ? (
                <Trophy className="w-8 h-8 text-amber-300 animate-bounce" />
              ) : (
                <AlertTriangle className="w-8 h-8 text-white" />
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              {passed ? '🎉 Lesson Passed!' : '✕ Try Again!'}
            </h2>

            <p className="text-xs sm:text-sm text-white/90 font-medium max-w-xs">
              {passed
                ? 'Great job! Lesson completed and the next lesson has been unlocked.'
                : `You need ${targetWpm} WPM with ${minAccuracy}% accuracy to unlock the next lesson.`}
            </p>
          </div>
        </div>

        {/* Score Breakdown Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-3 border border-slate-200 dark:border-slate-700/60">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase block">
              Net Speed
            </span>
            <div className="flex items-baseline justify-center space-x-1 mt-0.5">
              <span className={`text-2xl font-black ${result.netWpm >= targetWpm ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                {result.netWpm}
              </span>
              <span className="text-xs text-slate-400 font-semibold">WPM</span>
            </div>
            <span className="text-[10px] text-slate-400 block mt-0.5">Target: {targetWpm}</span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-3 border border-slate-200 dark:border-slate-700/60">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase block">
              Accuracy
            </span>
            <div className="flex items-baseline justify-center space-x-1 mt-0.5">
              <span className={`text-2xl font-black ${result.accuracy >= minAccuracy ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                {result.accuracy}%
              </span>
            </div>
            <span className="text-[10px] text-slate-400 block mt-0.5">Min: {minAccuracy}%</span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-3 border border-slate-200 dark:border-slate-700/60">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase block">
              Errors
            </span>
            <div className="flex items-baseline justify-center space-x-1 mt-0.5">
              <span className="text-2xl font-black text-slate-800 dark:text-slate-200">
                {result.errors}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              Backspaces: {result.backspaces}
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-3 border border-slate-200 dark:border-slate-700/60">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase block">
              Duration
            </span>
            <div className="flex items-baseline justify-center space-x-1 mt-0.5">
              <span className="text-2xl font-black text-slate-800 dark:text-slate-200">
                {result.durationSeconds}
              </span>
              <span className="text-xs text-slate-400 font-semibold">s</span>
            </div>
            <span className="text-[10px] text-slate-400 block mt-0.5">Gross: {result.grossWpm} WPM</span>
          </div>
        </div>

        {/* Lock / Unlock Notice Banner */}
        <div
          className={`p-4 rounded-2xl border flex items-center space-x-3 text-xs sm:text-sm ${
            passed
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
              : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200'
          }`}
        >
          {passed ? (
            <Unlock className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <Lock className="w-5 h-5 text-amber-600 shrink-0" />
          )}

          <div>
            <p className="font-bold">
              {passed
                ? 'Sequential Progression Verified: Next Lesson Unlocked'
                : 'Next Lesson Is Locked'}
            </p>
            <p className="text-xs opacity-80 mt-0.5">
              {passed
                ? `You have qualified Lesson ${lesson.lessonNumber} (${lesson.name}). You can now continue.`
                : 'Complete this lesson with the required benchmark speed and accuracy to unlock the next lesson.'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          {passed ? (
            <button
              type="button"
              onClick={onContinueNext}
              className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center space-x-2 transition-all"
            >
              <span>Continue to Next Lesson ({lesson.lessonNumber + 1})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onRetry}
              className="w-full py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm shadow-lg shadow-blue-600/30 flex items-center justify-center space-x-2 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry Test (Unlock Next Lesson)</span>
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs transition-colors"
          >
            Review & Practice Lesson
          </button>
        </div>
      </div>
    </div>
  );
};

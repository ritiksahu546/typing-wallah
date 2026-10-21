import React from 'react';
import { TouchTypingCourseLesson } from '../../types/touchTypingCourse';
import { Lock, ArrowLeft, ShieldAlert, Sparkles } from 'lucide-react';

interface LockedLessonNoticeProps {
  lesson: TouchTypingCourseLesson;
  highestUnlockedLessonNumber: number;
  onGoToUnlocked: () => void;
  onGoBack: () => void;
}

export const LockedLessonNotice: React.FC<LockedLessonNoticeProps> = ({
  lesson,
  highestUnlockedLessonNumber,
  onGoToUnlocked,
  onGoBack
}) => {
  return (
    <div className="max-w-xl mx-auto my-12 p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-6">
      <div className="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto ring-8 ring-amber-500/5">
        <Lock className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <span className="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">
          Lesson Locked (🔒)
        </span>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">
          Lesson {lesson.lessonNumber}: {lesson.name}
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
          Complete the previous lesson to unlock this lesson. All lessons in this course are sequential to ensure mastery before advancing.
        </p>
      </div>

      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-left text-xs space-y-1.5">
        <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200">
          <span>Required Prerequisite:</span>
          <span className="text-amber-600 dark:text-amber-400">
            Pass Lesson {lesson.lessonNumber - 1}
          </span>
        </div>
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
          <span>Your Highest Unlocked Lesson:</span>
          <span className="font-bold text-blue-600 dark:text-blue-400">
            Lesson {highestUnlockedLessonNumber}
          </span>
        </div>
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
          <span>Target Requirement:</span>
          <span>
            {lesson.targetWpm} WPM with {lesson.minAccuracy}% Accuracy
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <button
          type="button"
          onClick={onGoToUnlocked}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 flex items-center justify-center space-x-2 transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>Go to Lesson {highestUnlockedLessonNumber}</span>
        </button>

        <button
          type="button"
          onClick={onGoBack}
          className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-sm transition-colors"
        >
          Browse All Lessons
        </button>
      </div>
    </div>
  );
};

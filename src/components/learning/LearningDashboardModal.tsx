import React from 'react';
import { UserCourseProgress, DailyPracticeGoal } from '../../types/touchTypingCourse';
import { COURSE_LEVELS } from '../../data/touchTypingCourseCurriculum';
import {
  Trophy,
  Flame,
  Target,
  Clock,
  Award,
  CheckCircle2,
  Lock,
  ArrowRight,
  TrendingUp,
  X,
  Zap,
  BookOpen
} from 'lucide-react';

interface LearningDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: UserCourseProgress;
  dailyGoal: DailyPracticeGoal;
  totalLessonsCount: number;
  onJumpToLesson: (lessonNumber: number) => void;
}

export const LearningDashboardModal: React.FC<LearningDashboardModalProps> = ({
  isOpen,
  onClose,
  progress,
  dailyGoal,
  totalLessonsCount,
  onJumpToLesson
}) => {
  if (!isOpen) return null;

  const completedCount = progress.completedLessonIds.length;
  const completionPercent = Math.min(100, Math.round((completedCount / totalLessonsCount) * 100));

  // Determine current level
  const currentLevelObj =
    COURSE_LEVELS.find(
      (lvl) =>
        progress.currentLessonNumber >= lvl.startLesson &&
        progress.currentLessonNumber <= lvl.endLesson
    ) || COURSE_LEVELS[0];

  const wordsProgressPercent = Math.min(
    100,
    Math.round((progress.todayWordsTyped / (dailyGoal.targetWords || 500)) * 100)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/30">
              <Trophy className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                Touch Typing Student Dashboard
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Course Progress, Daily Goals & 50 WPM Roadmap
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Overall Course Progress Banner */}
        <div className="bg-gradient-to-br from-blue-700 via-indigo-800 to-slate-900 text-white rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-300">
                Current Level: {currentLevelObj.name}
              </span>
              <h3 className="text-2xl font-black mt-0.5">{currentLevelObj.title}</h3>
            </div>

            <div className="text-right">
              <span className="text-3xl font-black text-white">{completionPercent}%</span>
              <span className="text-xs text-blue-200 block">
                {completedCount} / {totalLessonsCount} Lessons Completed
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 to-teal-300 rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${completionPercent}%` }}
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-center text-xs">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2.5">
              <span className="text-blue-200 text-[10px] uppercase font-bold block">Best Speed</span>
              <span className="text-lg font-black text-amber-300">{progress.bestWpm} WPM</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2.5">
              <span className="text-blue-200 text-[10px] uppercase font-bold block">Average WPM</span>
              <span className="text-lg font-black text-white">{progress.avgWpm} WPM</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2.5">
              <span className="text-blue-200 text-[10px] uppercase font-bold block">Accuracy</span>
              <span className="text-lg font-black text-emerald-300">{progress.avgAccuracy}%</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2.5">
              <span className="text-blue-200 text-[10px] uppercase font-bold block">Ultimate Goal</span>
              <span className="text-lg font-black text-amber-400">50 WPM</span>
            </div>
          </div>
        </div>

        {/* 2. Daily Practice Card */}
        <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-5 border border-slate-200 dark:border-slate-700/60 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                Today's Daily Practice Streak: <span className="text-orange-500 font-black">{progress.currentStreak} Days</span>
              </h4>
            </div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {progress.todayWordsTyped} / {dailyGoal.targetWords} Words Typed
            </span>
          </div>

          <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-orange-500 rounded-full transition-all duration-300"
              style={{ width: `${wordsProgressPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Goal: {dailyGoal.targetMinutes} mins practice / {dailyGoal.targetWords} words</span>
            <span>Target WPM: {dailyGoal.targetWpm} WPM | Acc: {dailyGoal.minAccuracy}%+</span>
          </div>
        </div>

        {/* 3. Level Progression Road Map */}
        <div className="space-y-2">
          <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center space-x-1.5">
            <Award className="w-4 h-4 text-blue-600" />
            <span>11 Course Levels Roadmap</span>
          </h4>

          <div className="space-y-2">
            {COURSE_LEVELS.map((lvl) => {
              const isLevelUnlocked = progress.highestUnlockedLessonNumber >= lvl.startLesson;
              const isLevelCompleted = progress.highestUnlockedLessonNumber > lvl.endLesson;
              const isLevelActive =
                progress.currentLessonNumber >= lvl.startLesson &&
                progress.currentLessonNumber <= lvl.endLesson;

              return (
                <div
                  key={lvl.level}
                  className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                    isLevelCompleted
                      ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40'
                      : isLevelActive
                      ? 'bg-blue-50 dark:bg-blue-950/30 border-blue-300 dark:border-blue-800 ring-1 ring-blue-400'
                      : isLevelUnlocked
                      ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
                      : 'bg-slate-50/40 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-60'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                        isLevelCompleted
                          ? 'bg-emerald-600 text-white'
                          : isLevelActive
                          ? 'bg-blue-600 text-white'
                          : isLevelUnlocked
                          ? 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                      }`}
                    >
                      {isLevelCompleted ? <CheckCircle2 className="w-4 h-4" /> : lvl.level}
                    </div>

                    <div>
                      <h5 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                        {lvl.name} — {lvl.title}
                      </h5>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Lessons {lvl.startLesson} to {lvl.endLesson}
                      </p>
                    </div>
                  </div>

                  <div>
                    {isLevelUnlocked ? (
                      <button
                        type="button"
                        onClick={() => {
                          onJumpToLesson(lvl.startLesson);
                          onClose();
                        }}
                        className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs"
                      >
                        Practice
                      </button>
                    ) : (
                      <div className="flex items-center space-x-1 text-slate-400 text-xs font-semibold">
                        <Lock className="w-3.5 h-3.5" />
                        <span>Locked</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-sm shadow-md"
          >
            Continue Learning →
          </button>
        </div>
      </div>
    </div>
  );
};

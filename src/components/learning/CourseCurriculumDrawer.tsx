import React, { useState } from 'react';
import { TouchTypingCourseLesson, UserCourseProgress } from '../../types/touchTypingCourse';
import { COURSE_LEVELS } from '../../data/touchTypingCourseCurriculum';
import {
  CheckCircle2,
  Lock,
  Unlock,
  ChevronDown,
  ChevronRight,
  X,
  BookOpen,
  Trophy,
  Sparkles,
  Search
} from 'lucide-react';

interface CourseCurriculumDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  lessons: TouchTypingCourseLesson[];
  activeLessonId: string;
  progress: UserCourseProgress;
  onSelectLesson: (lesson: TouchTypingCourseLesson) => void;
}

export const CourseCurriculumDrawer: React.FC<CourseCurriculumDrawerProps> = ({
  isOpen,
  onClose,
  lessons,
  activeLessonId,
  progress,
  onSelectLesson
}) => {
  const [expandedLevels, setExpandedLevels] = useState<Record<number, boolean>>({ 1: true });
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const toggleLevel = (levelNum: number) => {
    setExpandedLevels((prev) => ({ ...prev, [levelNum]: !prev[levelNum] }));
  };

  const completedSet = new Set(progress.completedLessonIds);

  // Filter lessons if searching
  const filteredLessons = searchQuery.trim()
    ? lessons.filter(
        (l) =>
          l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (l.focusKeys || l.primaryKeys || []).some((k) => k.toLowerCase().includes(searchQuery.toLowerCase())) ||
          l.lessonNumber.toString() === searchQuery.trim()
      )
    : lessons;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 dark:text-white text-base">
                Course Curriculum
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                11 Levels • {lessons.length} Progressive Lessons
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

        {/* Search Bar */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search lessons or keys (e.g. F, J, Home Row)..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>
        </div>

        {/* Lessons List grouped by Level */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {searchQuery ? (
            /* Search Results */
            <div className="space-y-2">
              <p className="text-xs text-slate-400 font-semibold px-1">
                {filteredLessons.length} lessons found:
              </p>
              {filteredLessons.map((lesson) => {
                const isCompleted = completedSet.has(lesson.id);
                const isUnlocked = lesson.lessonNumber <= progress.highestUnlockedLessonNumber;
                const isActive = lesson.id === activeLessonId;

                return (
                  <button
                    key={lesson.id}
                    type="button"
                    onClick={() => {
                      onSelectLesson(lesson);
                      onClose();
                    }}
                    className={`w-full p-3 rounded-xl border flex items-center justify-between text-left transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                        : isCompleted
                        ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40 text-slate-800 dark:text-slate-200'
                        : isUnlocked
                        ? 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                        : 'bg-slate-50/40 dark:bg-slate-900/40 border-slate-100 dark:border-slate-800 text-slate-400 opacity-60'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-5 flex justify-center">
                        {isCompleted ? (
                          <CheckCircle2 className={`w-4 h-4 ${isActive ? 'text-white' : 'text-emerald-500'}`} />
                        ) : isUnlocked ? (
                          <Unlock className={`w-4 h-4 ${isActive ? 'text-white' : 'text-blue-500'}`} />
                        ) : (
                          <Lock className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-xs">
                          {lesson.lessonNumber}. {lesson.name}
                        </div>
                        <div className={`text-[10px] ${isActive ? 'text-blue-100' : 'text-slate-400'}`}>
                          Target: {lesson.targetWpm} WPM • Acc: {lesson.minAccuracy}%
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            /* Levels Hierarchy */
            COURSE_LEVELS.map((lvl) => {
              const levelLessons = lessons.filter(
                (l) => l.lessonNumber >= lvl.startLesson && l.lessonNumber <= lvl.endLesson
              );
              const isLevelExpanded = expandedLevels[lvl.level] ?? (progress.currentLessonNumber >= lvl.startLesson && progress.currentLessonNumber <= lvl.endLesson);
              const levelCompletedCount = levelLessons.filter((l) => completedSet.has(l.id)).length;
              const isLevelUnlocked = progress.highestUnlockedLessonNumber >= lvl.startLesson;

              return (
                <div
                  key={lvl.level}
                  className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-slate-50/50 dark:bg-slate-800/20"
                >
                  {/* Level Header Accordion */}
                  <button
                    type="button"
                    onClick={() => toggleLevel(lvl.level)}
                    className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="flex items-center space-x-2.5">
                      <div
                        className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center ${
                          levelCompletedCount === levelLessons.length && levelLessons.length > 0
                            ? 'bg-emerald-600 text-white'
                            : isLevelUnlocked
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                        }`}
                      >
                        {levelCompletedCount === levelLessons.length && levelLessons.length > 0 ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : (
                          lvl.level
                        )}
                      </div>

                      <div>
                        <div className="font-bold text-xs text-slate-900 dark:text-white">
                          Level {lvl.level}: {lvl.name}
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">
                          {levelCompletedCount}/{levelLessons.length} completed
                        </div>
                      </div>
                    </div>

                    <div className="text-slate-400">
                      {isLevelExpanded ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </div>
                  </button>

                  {/* Level Lessons List */}
                  {isLevelExpanded && (
                    <div className="p-2 pt-0 space-y-1.5 border-t border-slate-100 dark:border-slate-800">
                      {levelLessons.map((lesson) => {
                        const isCompleted = completedSet.has(lesson.id);
                        const isUnlocked =
                          lesson.lessonNumber <= progress.highestUnlockedLessonNumber;
                        const isActive = lesson.id === activeLessonId;

                        return (
                          <button
                            key={lesson.id}
                            type="button"
                            onClick={() => {
                              onSelectLesson(lesson);
                              onClose();
                            }}
                            className={`w-full p-2.5 rounded-xl border flex items-center justify-between text-left transition-all ${
                              isActive
                                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                : isCompleted
                                ? 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:border-emerald-500 text-slate-800 dark:text-slate-200'
                                : isUnlocked
                                ? 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:border-blue-500 text-slate-800 dark:text-slate-200'
                                : 'bg-slate-50/50 dark:bg-slate-900/30 border-dashed border-slate-200 dark:border-slate-800 text-slate-400'
                            }`}
                          >
                            <div className="flex items-center space-x-2.5 overflow-hidden">
                              <div className="w-4 shrink-0 flex justify-center">
                                {isCompleted ? (
                                  <CheckCircle2
                                    className={`w-3.5 h-3.5 ${
                                      isActive ? 'text-white' : 'text-emerald-500'
                                    }`}
                                  />
                                ) : isUnlocked ? (
                                  <Unlock
                                    className={`w-3.5 h-3.5 ${
                                      isActive ? 'text-white' : 'text-blue-500'
                                    }`}
                                  />
                                ) : (
                                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                                )}
                              </div>

                              <div className="truncate">
                                <span className="font-semibold text-xs truncate block">
                                  {lesson.lessonNumber}. {lesson.name}
                                </span>
                                <span
                                  className={`text-[10px] ${
                                    isActive ? 'text-blue-100' : 'text-slate-400'
                                  }`}
                                >
                                  {(lesson.mode || lesson.type || 'PRACTICE').toUpperCase().replace(/_/g, ' ')} • {lesson.targetWpm} WPM • {lesson.minAccuracy}%
                                </span>
                              </div>
                            </div>

                            {lesson.tier === 'pro' && (
                              <span className="shrink-0 ml-1 px-1.5 py-0.5 rounded text-[9px] font-black bg-amber-500/20 text-amber-500 uppercase">
                                PRO
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

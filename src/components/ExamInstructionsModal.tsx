import React from 'react';
import { X, BookOpen, CheckCircle2, AlertTriangle, ShieldCheck, Award } from 'lucide-react';
import { ExamInfo } from '../types';

interface ExamInstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  exam: ExamInfo | null | undefined;
}

export const ExamInstructionsModal: React.FC<ExamInstructionsModalProps> = ({
  isOpen,
  onClose,
  exam
}) => {
  if (!isOpen || !exam) return null;

  const minAccuracy = exam.allowedErrorPercent ? Math.max(0, 100 - exam.allowedErrorPercent) : 90;
  const keyboardsText = exam.supportedKeyboards && exam.supportedKeyboards.length > 0
    ? exam.supportedKeyboards.map(k => {
        if (k === 'remington_gail') return 'Remington GAIL';
        if (k === 'inscript') return 'InScript';
        return 'Standard QWERTY';
      }).join(', ')
    : 'Remington GAIL, InScript (Mangal Unicode)';

  return (
    <div
      id="exam-instructions-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        id="exam-instructions-modal-card"
        className="w-full max-w-xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            <div>
              <h3 className="text-base font-bold text-white leading-tight">
                {exam.name || 'Exam Guidelines'}
              </h3>
              <p className="text-xs text-slate-400">
                {exam.fullName || 'Official Examination Pattern & Rules'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-700 dark:text-slate-300">
          {/* Key Parameters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Duration</span>
              <span className="text-base font-black text-slate-900 dark:text-white">{exam.durationMinutes || 10} Min</span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">English Speed</span>
              <span className="text-base font-black text-indigo-600 dark:text-indigo-400">
                {exam.qualifyingEnglishWpm ? `${exam.qualifyingEnglishWpm} WPM` : 'N/A'}
              </span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Hindi Speed</span>
              <span className="text-base font-black text-amber-600 dark:text-amber-400">
                {exam.qualifyingHindiWpm ? `${exam.qualifyingHindiWpm} WPM` : 'N/A'}
              </span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Min Accuracy</span>
              <span className="text-base font-black text-emerald-600 dark:text-emerald-400">{minAccuracy}%</span>
            </div>
          </div>

          {/* Evaluation Method / Formula */}
          <div className="p-3.5 bg-indigo-50/70 dark:bg-indigo-950/40 rounded-xl border border-indigo-200 dark:border-indigo-900">
            <div className="flex items-center gap-1.5 font-bold text-indigo-950 dark:text-indigo-200 mb-1">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>Scoring Standard: {exam.scoringMethod || 'Standard Net WPM Calculation'}</span>
            </div>
            <p className="text-indigo-900/90 dark:text-indigo-300 leading-relaxed text-[11px]">
              {exam.overview || exam.accuracyRequirement || 'Official typing skill test conducted per recruitment notification standards.'}
            </p>
          </div>

          {/* Official Instructions */}
          {exam.instructions && exam.instructions.length > 0 ? (
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                Examination Instructions & Rules:
              </h4>
              <div className="space-y-2">
                {exam.instructions.map((instruction, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{instruction}</span>
                  </div>
                ))}
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Supported Keyboards:</strong> {keyboardsText}
                  </span>
                </div>
                {exam.keyDepressionsTarget && (
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>KDPH Benchmark:</strong> Target {exam.keyDepressionsTarget.toLocaleString()} Key Depressions in test duration.
                    </span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                Standard Rules:
              </h4>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Standard Word Definition:</strong> 1 standard word is computed as 5 keystrokes (characters including spaces).
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Hindi Typing Layout:</strong> {keyboardsText}.
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs transition-colors"
          >
            Understood, Start Practice
          </button>
        </div>
      </div>
    </div>
  );
};

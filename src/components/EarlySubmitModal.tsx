import React from 'react';
import { AlertCircle, ArrowRight, RotateCcw } from 'lucide-react';

interface EarlySubmitModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  remainingSeconds: number;
  typedWords: number;
  totalWords: number;
}

export const EarlySubmitModal: React.FC<EarlySubmitModalProps> = ({
  isOpen,
  onCancel,
  onConfirm,
  remainingSeconds,
  typedWords,
  totalWords
}) => {
  if (!isOpen) return null;

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const timeFormatted = `${minutes > 0 ? `${minutes}m ` : ''}${seconds}s`;

  return (
    <div
      id="early-submit-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in"
      onClick={onCancel}
    >
      <div
        id="early-submit-modal-card"
        className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Submit Test Early?
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Are you sure you want to finish the exam now?
            </p>
          </div>
        </div>

        <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 p-3.5 space-y-2 text-xs text-slate-700 dark:text-slate-300">
          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-slate-400">Time Remaining:</span>
            <span className="font-bold text-slate-900 dark:text-white font-mono">{timeFormatted}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-slate-400">Words Completed:</span>
            <span className="font-bold text-slate-900 dark:text-white">
              {typedWords} / {totalWords} words ({Math.min(100, Math.round((typedWords / Math.max(1, totalWords)) * 100))}%)
            </span>
          </div>
          <p className="text-[11px] text-amber-700 dark:text-amber-400 pt-1 border-t border-slate-200 dark:border-slate-700">
            Note: Submitting early will calculate your Net Speed (WPM) based on the current elapsed time.
          </p>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            id="early-submit-cancel-btn"
            type="button"
            onClick={onCancel}
            className="flex-1 py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors"
          >
            Continue Test
          </button>
          <button
            id="early-submit-confirm-btn"
            type="button"
            onClick={onConfirm}
            className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-sm flex items-center justify-center gap-1.5"
          >
            <span>Submit Test</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

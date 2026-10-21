import React, { useState, useMemo } from 'react';
import { ExamId, TestResultRecord } from '../types';
import { EXAMS_DATA } from '../data/exams';
import { StorageService } from '../services/storageService';
import {
  Trophy,
  CheckCircle2,
  RotateCcw,
  BookOpen,
  Share2,
  Award,
  AlertTriangle,
  Zap,
  Target,
  Key,
  Printer,
  FileCheck,
  TrendingUp
} from 'lucide-react';

interface ResultModalProps {
  result: TestResultRecord;
  exam?: any;
  onTryAgain?: () => void;
  onRestart?: () => void;
  onPracticeMore?: () => void;
  onNextTest?: () => void;
  onGoToDashboard?: () => void;
  onNavigateHome?: () => void;
}

export const ResultModal: React.FC<ResultModalProps> = ({
  result,
  exam: passedExam,
  onTryAgain,
  onRestart,
  onPracticeMore,
  onNextTest,
  onGoToDashboard
}) => {
  const [copied, setCopied] = useState(false);
  const { metrics, examId, examName, language, durationSeconds, passageTitle } = result;

  const exam = passedExam || (examId !== 'general' && EXAMS_DATA[examId as ExamId] ? EXAMS_DATA[examId as ExamId] : null);
  const isQualified = !!metrics.isQualified;

  // Compare with real previous attempt in history (never fabricate if no prior history exists)
  const previousAttempt = useMemo(() => {
    const history = StorageService.getTestHistory().filter((r) => r.id !== result.id);
    if (history.length === 0) return null;
    const sameLanguage = history.find((r) => r.language === language);
    return sameLanguage || history[0];
  }, [result.id, language]);

  const wpmDelta = previousAttempt ? metrics.netWpm - previousAttempt.metrics.netWpm : null;
  const accDelta = previousAttempt ? Number((metrics.accuracy - previousAttempt.metrics.accuracy).toFixed(1)) : null;

  const formattedDuration = useMemo(() => {
    const mins = Math.floor(durationSeconds / 60);
    const secs = durationSeconds % 60;
    if (mins === 0) return `${secs}s`;
    if (secs === 0) return `${mins} Min`;
    return `${mins}m ${secs}s`;
  }, [durationSeconds]);

  const handleRetry = onTryAgain || onRestart || (() => {});
  const handleMore = onPracticeMore || onNextTest || (() => {});

  const handleShare = () => {
    const text = `I achieved ${metrics.netWpm} Net WPM with ${metrics.accuracy}% accuracy in ${examName} typing test on Typing Wallah! #TypingWallah #GovtExams`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const grade = metrics.grade || (isQualified ? 'A' : 'Unqualified');

  return (
    <div id="result-dashboard-root" className="w-full max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-200 print:max-w-none print:shadow-none bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
      {/* Result Hero Header */}
      <div className={`rounded-2xl p-5 sm:p-8 text-white shadow-lg ${
        isQualified
          ? 'bg-emerald-700'
          : 'bg-slate-900'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider bg-white/20 text-white">
                {examName} Evaluation
              </span>
              <span className="text-xs text-white/80 capitalize">
                {language} • Duration: {formattedDuration}
              </span>
              {metrics.scoringFormulaName && (
                <span className="bg-black/20 text-white/90 text-[10px] px-2 py-0.5 rounded-md font-mono">
                  {metrics.scoringFormulaName}
                </span>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight mt-1">
              Candidate Score: <span className="text-amber-300">{metrics.netWpm} Net WPM</span>
            </h2>
            <p className="text-xs sm:text-sm text-white/90">
              Passage: <span className="font-semibold">{passageTitle}</span>
            </p>
          </div>

          {/* Qualification Badge with Grade */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center w-full sm:w-auto min-w-[150px] shrink-0">
            {isQualified ? (
              <div>
                <div className="flex items-center justify-center text-emerald-300 mb-1">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="text-sm font-black uppercase tracking-wider text-emerald-200">
                  Qualified (Grade {grade})
                </div>
                <div className="text-[11px] text-white/80">Meets Exam Cutoff</div>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-center text-amber-300 mb-1">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div className="text-sm font-black uppercase tracking-wider text-amber-200">
                  Needs Practice
                </div>
                <div className="text-[11px] text-white/80">Below Target Benchmark</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Primary Key Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* Net WPM */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-xs text-center">
          <div className="flex items-center justify-center text-blue-600 dark:text-blue-400 mb-2">
            <Zap className="w-5 h-5" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tabular-nums">
            {metrics.netWpm}
          </div>
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">
            Net Speed (WPM)
          </div>
          <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Official Formula Applied</div>
        </div>

        {/* Gross WPM */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-xs text-center">
          <div className="flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-2">
            <Target className="w-5 h-5" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-100 tabular-nums">
            {metrics.grossWpm}
          </div>
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">
            Gross Speed (WPM)
          </div>
          <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Raw Keystrokes / 5</div>
        </div>

        {/* Accuracy */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-xs text-center">
          <div className="flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-2">
            <Award className="w-5 h-5" />
          </div>
          <div className={`text-2xl sm:text-3xl font-black tabular-nums ${
            metrics.accuracy >= 95 ? 'text-emerald-600 dark:text-emerald-400' : metrics.accuracy >= 85 ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400'
          }`}>
            {metrics.accuracy}%
          </div>
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">
            Accuracy
          </div>
          <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Target: ≥ 90%</div>
        </div>

        {/* Key Depressions & KDPH */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-xs text-center">
          <div className="flex items-center justify-center text-purple-600 dark:text-purple-400 mb-2">
            <Key className="w-5 h-5" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tabular-nums">
            {metrics.kdph ? metrics.kdph : metrics.keyDepressions}
          </div>
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">
            {metrics.kdph ? 'KDPH (Depressions/Hr)' : 'Key Depressions'}
          </div>
          <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
            {metrics.kdph ? `${metrics.keyDepressions} total strokes` : 'Standard key depressions'}
          </div>
        </div>
      </div>

      {/* Real Comparison with Previous Attempt (Shown ONLY when real history exists) */}
      {previousAttempt && wpmDelta !== null && accDelta !== null && (
        <div className="bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/60 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <div>
              <span className="font-bold text-slate-900 dark:text-white block">
                Comparison with Your Previous Attempt ({previousAttempt.passageTitle})
              </span>
              <span className="text-slate-500 dark:text-slate-400">
                Previous Score: {previousAttempt.metrics.netWpm} Net WPM at {previousAttempt.metrics.accuracy}% accuracy
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 font-mono font-bold">
            <span className={`px-2.5 py-1 rounded-lg border ${
              wpmDelta >= 0
                ? 'bg-emerald-100/80 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                : 'bg-rose-100/80 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800'
            }`}>
              Speed: {wpmDelta >= 0 ? `+${wpmDelta}` : wpmDelta} WPM
            </span>
            <span className={`px-2.5 py-1 rounded-lg border ${
              accDelta >= 0
                ? 'bg-emerald-100/80 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                : 'bg-rose-100/80 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800'
            }`}>
              Accuracy: {accDelta >= 0 ? `+${accDelta}%` : `${accDelta}%`}
            </span>
          </div>
        </div>
      )}

      {/* Official Exam Qualification Note */}
      {metrics.qualificationReason && (
        <div className={`p-4 rounded-2xl border text-xs sm:text-sm font-medium flex items-start space-x-3 ${
          isQualified
            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
            : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200'
        }`}>
          <FileCheck className={`w-5 h-5 shrink-0 mt-0.5 ${isQualified ? 'text-emerald-600' : 'text-amber-600'}`} />
          <div className="space-y-1">
            <div className="font-bold">
              {isQualified ? 'Qualification Status: PASS' : 'Qualification Status: NEEDS PRACTICE'}
            </div>
            <p className="leading-relaxed">{metrics.qualificationReason}</p>
          </div>
        </div>
      )}

      {/* Detailed Diagnostics Breakdown */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-5">
        <h3 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg flex items-center space-x-2">
          <Trophy className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <span>Diagnostic Evaluation Breakdown</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-sm">
          <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-xl border border-slate-100 dark:border-slate-700/60">
            <span className="text-slate-500 dark:text-slate-400 text-xs block">Correct Chars</span>
            <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">{metrics.correctChars}</span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-xl border border-slate-100 dark:border-slate-700/60">
            <span className="text-slate-500 dark:text-slate-400 text-xs block">Incorrect Chars</span>
            <span className="text-lg font-bold text-rose-600 dark:text-rose-400 tabular-nums">{metrics.incorrectChars}</span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-xl border border-slate-100 dark:border-slate-700/60">
            <span className="text-slate-500 dark:text-slate-400 text-xs block">Errors (Mistakes)</span>
            <span className="text-lg font-bold text-rose-600 dark:text-rose-400 tabular-nums">
              {(metrics as any).mistakesDetail?.totalMistakes ?? metrics.errors}
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-xl border border-slate-100 dark:border-slate-700/60">
            <span className="text-slate-500 dark:text-slate-400 text-xs block">Backspaces</span>
            <span className="text-lg font-bold text-slate-800 dark:text-slate-100 tabular-nums">{metrics.backspaceCount}</span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-xl border border-slate-100 dark:border-slate-700/60">
            <span className="text-slate-500 dark:text-slate-400 text-xs block">Test Duration</span>
            <span className="text-lg font-bold text-slate-800 dark:text-slate-100 tabular-nums">{formattedDuration}</span>
          </div>
        </div>

        {/* Mistakes Detail if available */}
        {(metrics.fullMistakes !== undefined || metrics.penaltyMistakes !== undefined) && (
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-2">
            <div className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px]">
              Mistakes Analysis (Exam Evaluation Engine)
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {metrics.fullMistakes !== undefined && (
                <div>Full Mistakes: <strong>{metrics.fullMistakes}</strong></div>
              )}
              {metrics.halfMistakes !== undefined && (
                <div>Half Mistakes: <strong>{metrics.halfMistakes}</strong></div>
              )}
              {metrics.allowedMistakes !== undefined && (
                <div>Allowed Mistakes (Free): <strong>{metrics.allowedMistakes}</strong></div>
              )}
              {metrics.penaltyMistakes !== undefined && metrics.penaltyMistakes > 0 && (
                <div className="text-rose-600 dark:text-rose-400 font-bold">
                  Excess Penalty Mistakes: {metrics.penaltyMistakes} ({metrics.penaltyDeductionWords} words deducted)
                </div>
              )}
            </div>
          </div>
        )}

        {/* Visual Accuracy Bar */}
        <div className="space-y-1.5 pt-2">
          <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-400">
            <span>Accuracy Ratio ({metrics.correctChars} correct / {metrics.totalChars} total)</span>
            <span>{metrics.accuracy}%</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden flex">
            <div
              className="bg-emerald-500 h-full transition-all duration-500"
              style={{ width: `${Math.min(100, metrics.accuracy)}%` }}
            ></div>
            <div
              className="bg-rose-500 h-full transition-all duration-500"
              style={{ width: `${Math.min(100, 100 - metrics.accuracy)}%` }}
            ></div>
          </div>
        </div>

        {/* Exam Criteria Comparison note */}
        {exam && (
          <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-xl p-4 text-xs text-blue-900 dark:text-blue-200 space-y-1">
            <div className="font-bold flex items-center space-x-1.5 text-blue-800 dark:text-blue-300">
              <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Official {exam.name} Benchmark Rules:</span>
            </div>
            <p>
              Qualifying cutoff: {language === 'hindi' ? exam.qualifyingHindiWpm : exam.qualifyingEnglishWpm} WPM ({language} medium).
              Accuracy target: {exam.accuracyRequirement}.
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 print:hidden">
        <div className="flex flex-wrap items-center gap-2">
          <button
            id="result-try-again-btn"
            type="button"
            onClick={handleRetry}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 flex items-center space-x-2 transition-transform hover:scale-102 active:scale-98 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Try Again</span>
          </button>

          <button
            id="result-practice-more-btn"
            type="button"
            onClick={handleMore}
            className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-sm transition-colors flex items-center space-x-2 cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            <span>Practice More Tests</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            id="result-print-btn"
            type="button"
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Scorecard</span>
          </button>

          {onGoToDashboard && (
            <button
              id="result-dashboard-btn"
              type="button"
              onClick={onGoToDashboard}
              className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-sm font-semibold transition-colors cursor-pointer"
            >
              View in Dashboard
            </button>
          )}

          <button
            id="result-share-btn"
            type="button"
            onClick={handleShare}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold shadow-sm flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>{copied ? 'Copied Result!' : 'Share Result'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect, useMemo } from 'react';
import { ActivePage, ExamId, UserProfile, UserStatsSummary } from '../types';
import { StorageService } from '../services/storageService';
import { EXAMS_DATA } from '../data/exams';
import { useAuth } from '../context/AuthContext';
import {
  Trophy,
  Zap,
  Target,
  Clock,
  RotateCcw,
  CheckCircle2,
  User,
  LogOut,
  Play,
  TrendingUp,
  Sparkles,
  Copy,
  Check,
  Gift,
  Languages
} from 'lucide-react';

interface UserDashboardPageProps {
  user: UserProfile;
  onOpenAuth: () => void;
  onUserLogout: () => void;
  onStartTest: (examId?: ExamId, lang?: 'english' | 'hindi', duration?: number) => void;
  onNavigate: (page: ActivePage, examId?: ExamId) => void;
}

export const UserDashboardPage: React.FC<UserDashboardPageProps> = ({
  user,
  onOpenAuth,
  onUserLogout,
  onStartTest,
  onNavigate
}) => {
  const { updateTargetExam } = useAuth();
  const [stats, setStats] = useState<UserStatsSummary>({
    bestWpm: 0,
    avgWpm: 0,
    avgAccuracy: 0,
    totalTests: 0,
    totalPracticeTimeSeconds: 0,
    recentTests: []
  });
  const [copiedReferral, setCopiedReferral] = useState(false);

  useEffect(() => {
    const loadStats = async () => {
      if (user.isLoggedIn && user.id && !user.id.startsWith('guest_')) {
        try {
          await StorageService.fetchCloudUserHistory(user.id);
        } catch (e) {
          console.warn('Dashboard cloud stats note:', e);
        }
      }
      setStats(StorageService.getUserStats());
    };
    loadStats();
  }, [user.id, user.isLoggedIn]);

  const formatPracticeTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    if (mins < 60) return `${mins} Mins`;
    const hrs = (mins / 60).toFixed(1);
    return `${hrs} Hours`;
  };

  const languageStats = useMemo(() => {
    const history = StorageService.getTestHistory();
    const eng = history.filter((t) => t.language === 'english');
    const hin = history.filter((t) => t.language === 'hindi');

    const summarize = (list: typeof history) => {
      if (list.length === 0) return { count: 0, bestWpm: 0, avgWpm: 0, avgAcc: 0 };
      const bestWpm = Math.max(...list.map((t) => t.metrics.netWpm));
      const avgWpm = Math.round(list.reduce((s, t) => s + t.metrics.netWpm, 0) / list.length);
      const avgAcc = Number(
        (list.reduce((s, t) => s + t.metrics.accuracy, 0) / list.length).toFixed(1)
      );
      return { count: list.length, bestWpm, avgWpm, avgAcc };
    };

    return {
      english: summarize(eng),
      hindi: summarize(hin)
    };
  }, [stats]);

  const referralState = useMemo(() => StorageService.getReferralState(), [user.id]);

  const handleCopyReferral = () => {
    const url = `${window.location.origin}/?ref=${referralState.myReferralCode}`;
    navigator.clipboard.writeText(url).catch(() => {});
    setCopiedReferral(true);
    setTimeout(() => setCopiedReferral(false), 2500);
  };

  const targetExamInfo = EXAMS_DATA[user.targetExam];

  return (
    <div id="user-dashboard-root" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Profile Overview Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.name}
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-500 shadow-md"
            />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-white font-black text-2xl flex items-center justify-center shadow-md">
              {user.avatarSeed}
            </div>
          )}
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900 dark:text-white">{user.name}</h1>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-800">
                {user.isLoggedIn ? 'Registered Aspirant' : 'Guest Mode'}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{user.email}</p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-2">
              <label className="inline-flex items-center gap-1.5">
                <span>Target Exam:</span>
                <select
                  aria-label="Select Target Exam"
                  value={user.targetExam}
                  onChange={(e) => updateTargetExam(e.target.value as ExamId)}
                  className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-800 dark:text-slate-200 text-xs focus:outline-hidden focus:border-blue-500"
                >
                  {Object.values(EXAMS_DATA).map((ex) => (
                    <option key={ex.id} value={ex.id}>
                      {ex.name}
                    </option>
                  ))}
                </select>
              </label>
              <span>•</span>
              <span>Joined: {user.joinedDate}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {user.isLoggedIn ? (
            <button
              id="dashboard-logout-btn"
              type="button"
              onClick={onUserLogout}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold flex items-center space-x-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          ) : (
            <button
              id="dashboard-login-btn"
              type="button"
              onClick={onOpenAuth}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm flex items-center space-x-1.5"
            >
              <User className="w-3.5 h-3.5" />
              <span>Login / Create Account</span>
            </button>
          )}

          <button
            id="dashboard-start-practice-btn"
            type="button"
            onClick={() => onStartTest(user.targetExam, 'english', 600)}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center space-x-1.5 transition-transform hover:scale-105"
          >
            <Play className="w-3.5 h-3.5 fill-current text-amber-300" />
            <span>Practice Target Exam</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Best WPM */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs text-center">
          <div className="flex items-center justify-center text-amber-500 mb-2">
            <Trophy className="w-5 h-5" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white tabular-nums">
            {stats.bestWpm}
          </div>
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">
            Personal Best WPM
          </div>
          <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Top Net Speed</div>
        </div>

        {/* Avg WPM */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs text-center">
          <div className="flex items-center justify-center text-blue-600 dark:text-blue-400 mb-2">
            <Zap className="w-5 h-5" />
          </div>
          <div className="text-3xl font-black text-blue-700 dark:text-blue-400 tabular-nums">
            {stats.avgWpm}
          </div>
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">
            Average Speed
          </div>
          <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">All sessions</div>
        </div>

        {/* Avg Accuracy */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs text-center">
          <div className="flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-2">
            <Target className="w-5 h-5" />
          </div>
          <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums">
            {stats.avgAccuracy}%
          </div>
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">
            Average Accuracy
          </div>
          <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Benchmark: ≥ 90%</div>
        </div>

        {/* Tests Attempted */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs text-center">
          <div className="flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-2">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div className="text-3xl font-black text-slate-800 dark:text-white tabular-nums">
            {stats.totalTests}
          </div>
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">
            Tests Attempted
          </div>
          <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Simulated Mocks</div>
        </div>

        {/* Total Practice Time */}
        <div className="col-span-2 lg:col-span-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs text-center">
          <div className="flex items-center justify-center text-purple-600 dark:text-purple-400 mb-2">
            <Clock className="w-5 h-5" />
          </div>
          <div className="text-3xl font-black text-slate-800 dark:text-white tabular-nums">
            {formatPracticeTime(stats.totalPracticeTimeSeconds)}
          </div>
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">
            Practice Time
          </div>
          <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Active keyboard hours</div>
        </div>
      </div>

      {/* Language-Wise Breakdown & Referral Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Languages className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Language-Wise Performance Breakdown
              </h3>
            </div>
            <span className="text-xs text-slate-400">English vs. Hindi</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase">
                  English Typing
                </span>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {languageStats.english.count} Tests
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                <div>
                  <div className="text-lg font-black text-slate-900 dark:text-white tabular-nums">
                    {languageStats.english.bestWpm}
                  </div>
                  <div className="text-[10px] text-slate-500">Best WPM</div>
                </div>
                <div>
                  <div className="text-lg font-black text-blue-600 dark:text-blue-400 tabular-nums">
                    {languageStats.english.avgWpm}
                  </div>
                  <div className="text-[10px] text-slate-500">Avg WPM</div>
                </div>
                <div>
                  <div className="text-lg font-black text-emerald-600 dark:text-emerald-400 tabular-nums">
                    {languageStats.english.avgAcc}%
                  </div>
                  <div className="text-[10px] text-slate-500">Avg Acc</div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-700 dark:text-amber-300 uppercase">
                  Hindi Typing (Mangal)
                </span>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {languageStats.hindi.count} Tests
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                <div>
                  <div className="text-lg font-black text-slate-900 dark:text-white tabular-nums">
                    {languageStats.hindi.bestWpm}
                  </div>
                  <div className="text-[10px] text-slate-500">Best WPM</div>
                </div>
                <div>
                  <div className="text-lg font-black text-amber-600 dark:text-amber-400 tabular-nums">
                    {languageStats.hindi.avgWpm}
                  </div>
                  <div className="text-[10px] text-slate-500">Avg WPM</div>
                </div>
                <div>
                  <div className="text-lg font-black text-emerald-600 dark:text-emerald-400 tabular-nums">
                    {languageStats.hindi.avgAcc}%
                  </div>
                  <div className="text-[10px] text-slate-500">Avg Acc</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Referral & Invite Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                <Gift className="w-5 h-5" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Invite Aspirants
                </h3>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('referrals')}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
              >
                Full Details
              </button>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Share your personal invite code with fellow exam aspirants.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2">
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Your Referral Code</div>
              <div className="font-mono font-black text-sm text-slate-900 dark:text-white">
                {referralState.myReferralCode}
              </div>
            </div>
            <button
              type="button"
              onClick={handleCopyReferral}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1"
            >
              {copiedReferral ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedReferral ? 'Copied' : 'Copy Link'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Target Exam Readiness Progress Card */}
      {targetExamInfo && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border border-blue-200 dark:border-blue-800/70 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Target Exam Readiness: {targetExamInfo.name}
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Cutoff requirement: {targetExamInfo.qualifyingEnglishWpm || 30} WPM (English) / {targetExamInfo.qualifyingHindiWpm || 25} WPM (Hindi).
              Your current peak: <strong>{stats.bestWpm} WPM</strong>.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            {stats.bestWpm >= (targetExamInfo.qualifyingEnglishWpm || 30) ? (
              <span className="px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center space-x-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Benchmark Achieved!</span>
              </span>
            ) : (
              <span className="px-3 py-1.5 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 font-bold text-xs flex items-center space-x-1">
                <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>{Math.max(0, (targetExamInfo.qualifyingEnglishWpm || 30) - stats.bestWpm)} WPM to Qualifying Speed</span>
              </span>
            )}
          </div>
        </div>
      )}

      {/* Recent Tests Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Recent Test Attempts
          </h3>
          <span className="text-xs text-slate-400">
            Showing last {stats.recentTests.length} recorded tests
          </span>
        </div>

        {stats.recentTests.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
              <Clock className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">No test attempts recorded yet.</p>
            <p className="text-xs text-slate-400">Complete your first typing test to start logging your WPM trends.</p>
            <button
              type="button"
              onClick={() => onStartTest(undefined, 'english', 300)}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs inline-flex items-center space-x-1"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Start 5-Min Test Now</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase text-[11px]">
                  <th className="pb-3">Exam / Passage</th>
                  <th className="pb-3">Language</th>
                  <th className="pb-3">Net WPM</th>
                  <th className="pb-3">Gross WPM</th>
                  <th className="pb-3">Accuracy</th>
                  <th className="pb-3">Duration</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {stats.recentTests.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 font-semibold text-slate-800 dark:text-slate-200">
                      <div>{t.examName}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-xs">{t.passageTitle}</div>
                    </td>
                    <td className="py-3 capitalize text-slate-600 dark:text-slate-300">
                      {t.language}
                    </td>
                    <td className="py-3 font-black text-blue-700 dark:text-blue-400 tabular-nums">
                      {t.metrics.netWpm}
                    </td>
                    <td className="py-3 font-bold text-slate-600 dark:text-slate-400 tabular-nums">
                      {t.metrics.grossWpm}
                    </td>
                    <td className="py-3 font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                      {t.metrics.accuracy}%
                    </td>
                    <td className="py-3 text-slate-500 dark:text-slate-400 tabular-nums">
                      {Math.max(1, Math.round(t.durationSeconds / 60))} min
                    </td>
                    <td className="py-3">
                      {t.metrics.isQualified ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                          Qualified
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-bold">
                          Practicing
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

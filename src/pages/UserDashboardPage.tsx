import React, { useState, useEffect } from 'react';
import { ActivePage, ExamId, UserProfile, UserStatsSummary } from '../types';
import { StorageService } from '../services/storageService';
import { EXAMS_DATA } from '../data/exams';
import {
  Trophy,
  Zap,
  Target,
  Clock,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Calendar,
  User,
  LogOut,
  Play,
  TrendingUp,
  Award,
  Sparkles
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
  const [stats, setStats] = useState<UserStatsSummary>({
    bestWpm: 0,
    avgWpm: 0,
    avgAccuracy: 0,
    totalTests: 0,
    totalPracticeTimeSeconds: 0,
    recentTests: []
  });

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

  const targetExamInfo = EXAMS_DATA[user.targetExam];

  return (
    <div id="user-dashboard-root" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Profile Overview Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
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
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-black text-slate-900">{user.name}</h1>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
                {user.isLoggedIn ? 'Registered Aspirant' : 'Guest Mode'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{user.email}</p>
            <div className="flex items-center space-x-3 text-xs text-slate-400 mt-2">
              <span>Target: <strong className="text-slate-700">{targetExamInfo?.name || 'General Govt Exam'}</strong></span>
              <span>•</span>
              <span>Joined: {user.joinedDate}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {user.isLoggedIn ? (
            <button
              id="dashboard-logout-btn"
              type="button"
              onClick={onUserLogout}
              className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold flex items-center space-x-1.5"
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
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs text-center">
          <div className="flex items-center justify-center text-amber-500 mb-2">
            <Trophy className="w-5 h-5" />
          </div>
          <div className="text-3xl font-black text-slate-900 tabular-nums">
            {stats.bestWpm}
          </div>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">
            Personal Best WPM
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Top Net Speed</div>
        </div>

        {/* Avg WPM */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs text-center">
          <div className="flex items-center justify-center text-blue-600 mb-2">
            <Zap className="w-5 h-5" />
          </div>
          <div className="text-3xl font-black text-blue-700 tabular-nums">
            {stats.avgWpm}
          </div>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">
            Average Speed
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">All sessions</div>
        </div>

        {/* Avg Accuracy */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs text-center">
          <div className="flex items-center justify-center text-emerald-600 mb-2">
            <Target className="w-5 h-5" />
          </div>
          <div className="text-3xl font-black text-emerald-600 tabular-nums">
            {stats.avgAccuracy}%
          </div>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">
            Average Accuracy
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Benchmark: ≥ 90%</div>
        </div>

        {/* Tests Attempted */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs text-center">
          <div className="flex items-center justify-center text-indigo-600 mb-2">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div className="text-3xl font-black text-slate-800 tabular-nums">
            {stats.totalTests}
          </div>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">
            Tests Attempted
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Simulated Mocks</div>
        </div>

        {/* Total Practice Time */}
        <div className="col-span-2 lg:col-span-1 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs text-center">
          <div className="flex items-center justify-center text-purple-600 mb-2">
            <Clock className="w-5 h-5" />
          </div>
          <div className="text-3xl font-black text-slate-800 tabular-nums">
            {formatPracticeTime(stats.totalPracticeTimeSeconds)}
          </div>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">
            Practice Time
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Active keyboard hours</div>
        </div>
      </div>

      {/* Target Exam Readiness Progress Card */}
      {targetExamInfo && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <h3 className="font-bold text-slate-900 text-base">
                Target Exam Readiness: {targetExamInfo.name}
              </h3>
            </div>
            <p className="text-xs text-slate-600">
              Cutoff requirement: {targetExamInfo.qualifyingEnglishWpm || 30} WPM (English) / {targetExamInfo.qualifyingHindiWpm || 20} WPM (Hindi).
              Your current peak: <strong>{stats.bestWpm} WPM</strong>.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            {stats.bestWpm >= (targetExamInfo.qualifyingEnglishWpm || 30) ? (
              <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center space-x-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Benchmark Achieved!</span>
              </span>
            ) : (
              <span className="px-3 py-1.5 rounded-xl bg-amber-100 text-amber-800 font-bold text-xs flex items-center space-x-1">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>{Math.max(0, (targetExamInfo.qualifyingEnglishWpm || 30) - stats.bestWpm)} WPM to Qualifying Speed</span>
              </span>
            )}
          </div>
        </div>
      )}

      {/* Recent Tests Table */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">
            Recent Test Attempts
          </h3>
          <span className="text-xs text-slate-400">
            Showing last {stats.recentTests.length} recorded tests
          </span>
        </div>

        {stats.recentTests.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Clock className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-700">No test attempts recorded yet.</p>
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
                <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[11px]">
                  <th className="pb-3">Exam / Passage</th>
                  <th className="pb-3">Language</th>
                  <th className="pb-3">Net WPM</th>
                  <th className="pb-3">Gross WPM</th>
                  <th className="pb-3">Accuracy</th>
                  <th className="pb-3">Duration</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stats.recentTests.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 font-semibold text-slate-800">
                      <div>{t.examName}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-xs">{t.passageTitle}</div>
                    </td>
                    <td className="py-3 capitalize text-slate-600">
                      {t.language}
                    </td>
                    <td className="py-3 font-black text-blue-700">
                      {t.metrics.netWpm}
                    </td>
                    <td className="py-3 font-bold text-slate-600">
                      {t.metrics.grossWpm}
                    </td>
                    <td className="py-3 font-bold text-emerald-600">
                      {t.metrics.accuracy}%
                    </td>
                    <td className="py-3 text-slate-500">
                      {Math.round(t.durationSeconds / 60)} min
                    </td>
                    <td className="py-3">
                      {t.metrics.isQualified ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          Qualified
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
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

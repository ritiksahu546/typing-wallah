import React, { useState, useEffect, useMemo } from 'react';
import { ActivePage, ExamId, LeaderboardItem, UserProfile } from '../types';
import { StorageService } from '../services/storageService';
import { db, withFirestoreTimeout } from '../services/firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import {
  Trophy,
  Info,
  Sparkles,
  Play,
  RefreshCw
} from 'lucide-react';

interface LeaderboardPageProps {
  user: UserProfile;
  onStartTest: (examId?: ExamId, lang?: 'english' | 'hindi') => void;
  onNavigate: (page: ActivePage) => void;
}

export const LeaderboardPage: React.FC<LeaderboardPageProps> = ({
  user,
  onStartTest
}) => {
  const [languageFilter, setLanguageFilter] = useState<'all' | 'english' | 'hindi'>('all');
  const [examFilter, setExamFilter] = useState<string>('all');
  const [firestoreLeaderboard, setFirestoreLeaderboard] = useState<LeaderboardItem[]>([]);
  const [isLoadingFirestore, setIsLoadingFirestore] = useState<boolean>(false);

  const fetchOnlineScores = async () => {
    try {
      setIsLoadingFirestore(true);
      const q = query(collection(db, 'leaderboard'), orderBy('netWpm', 'desc'), limit(50));
      const querySnapshot = await withFirestoreTimeout(getDocs(q), 2500);

      const onlineItems: LeaderboardItem[] = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const netWpm = Number(data.netWpm) || 0;
        const accuracy = Number(data.accuracy) || 0;
        // Validate realistic bounds
        if (netWpm <= 0 || netWpm > 250 || accuracy < 0 || accuracy > 100) return;

        const isMe = Boolean(user.id && data.userId === user.id);
        onlineItems.push({
          id: 'fs_' + docSnap.id,
          userId: data.userId,
          rank: 0,
          username: isMe ? `${data.username || user.name} (You)` : data.username || 'Aspirant',
          wpm: data.grossWpm || netWpm,
          netWpm,
          accuracy,
          examName: data.exam || data.examId || 'General Practice',
          language: data.language === 'hindi' ? 'hindi' : 'english',
          date: data.date || 'Recent',
          isCurrentUser: isMe,
          avatarSeed: (data.username || 'A').slice(0, 2).toUpperCase()
        });
      });

      setFirestoreLeaderboard(onlineItems);
    } catch {
      // Operating in offline / local mode seamlessly
    } finally {
      setIsLoadingFirestore(false);
    }
  };

  useEffect(() => {
    fetchOnlineScores();
  }, [user.id]);

  // Validated local user test records
  const combined = useMemo(() => {
    const history = StorageService.getTestHistory();
    const userLeaderboardItems: LeaderboardItem[] = history
      .filter((t) => t.metrics.netWpm > 0 && t.metrics.netWpm <= 250)
      .map((t) => ({
        id: 'local_' + t.id,
        userId: user.id,
        rank: 0,
        username: `${user.name} (You)`,
        wpm: t.metrics.grossWpm,
        netWpm: t.metrics.netWpm,
        accuracy: t.metrics.accuracy,
        examName: t.examName,
        language: t.language,
        date: new Date(t.timestamp).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        }),
        isCurrentUser: true,
        avatarSeed: user.avatarSeed || 'GA'
      }));

    // Deduplicate by keeping highest score per (userId/username + examName + language)
    const bestMap = new Map<string, LeaderboardItem>();
    [...firestoreLeaderboard, ...userLeaderboardItems].forEach((item) => {
      const key = `${item.userId || item.username}_${item.examName}_${item.language}`;
      const existing = bestMap.get(key);
      if (!existing || item.netWpm > existing.netWpm) {
        bestMap.set(key, item);
      }
    });

    return Array.from(bestMap.values())
      .filter((item) => {
        if (languageFilter !== 'all' && item.language !== languageFilter) return false;
        if (examFilter !== 'all' && !item.examName.toLowerCase().includes(examFilter.toLowerCase())) return false;
        return true;
      })
      .sort((a, b) => b.netWpm - a.netWpm || b.accuracy - a.accuracy)
      .map((item, index) => ({
        ...item,
        rank: index + 1
      }));
  }, [firestoreLeaderboard, user.id, user.name, user.avatarSeed, languageFilter, examFilter]);

  return (
    <div id="leaderboard-root" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl space-y-4 border border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-amber-400/20 text-amber-200 border border-amber-300/30 text-xs font-bold uppercase tracking-wider">
            <Trophy className="w-3.5 h-3.5 text-amber-300" />
            <span>Verified Aspirant Leaderboard</span>
          </div>

          <button
            type="button"
            onClick={fetchOnlineScores}
            disabled={isLoadingFirestore}
            className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-md bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400/30 text-xs font-bold transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingFirestore ? 'animate-spin' : ''}`} />
            <span>{isLoadingFirestore ? 'Syncing...' : 'Refresh Live Scores'}</span>
          </button>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
          Aspirants Leaderboard
        </h1>

        <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
          Real, validated typing test scores submitted by candidates across MP CPCT, SSC, RRB, and High Court test categories. No fabricated or simulated profiles are shown.
        </p>

        <div className="bg-white/5 border border-white/15 rounded-2xl p-3.5 text-xs text-white/90 flex items-start space-x-2.5 max-w-2xl">
          <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p>
            <strong>Validation Policy:</strong> Only real completed typing tests with verified Net WPM and accuracy bounds appear on this board. Sign in before taking a test to publish your best score to the cloud leaderboard.
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Language Filter */}
        <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 text-xs font-bold w-full md:w-auto">
          {(['all', 'english', 'hindi'] as const).map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => setLanguageFilter(lang)}
              className={`flex-1 md:flex-none px-4 py-2 rounded-lg capitalize transition-all cursor-pointer ${
                languageFilter === lang
                  ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {lang === 'all' ? 'All Languages' : `${lang} Medium`}
            </button>
          ))}
        </div>

        {/* Exam Filter Dropdown */}
        <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Filter Exam:</span>
          <select
            value={examFilter}
            onChange={(e) => setExamFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-blue-600"
          >
            <option value="all">All Exams Combined</option>
            <option value="CPCT">MP CPCT</option>
            <option value="SSC">SSC CHSL / DEST</option>
            <option value="RRB">RRB NTPC</option>
            <option value="Delhi">Delhi Police HCM</option>
            <option value="Court">High Court / Supreme Court</option>
            <option value="UPSSSC">UPSSSC / BSSC</option>
          </select>
        </div>
      </div>

      {/* Leaderboard Table or Honest Empty State */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs overflow-hidden">
        {combined.length === 0 ? (
          <div className="text-center py-12 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
              <Trophy className="w-7 h-7" />
            </div>
            <div className="space-y-1 max-w-md mx-auto">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                No Verified Scores Recorded Yet for This Filter
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Complete a typing test to record your real Net WPM and accuracy on the leaderboard.
              </p>
            </div>
            <div className="pt-1 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => onStartTest(undefined, 'english')}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs inline-flex items-center space-x-1.5 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Take English Typing Test</span>
              </button>
              <button
                type="button"
                onClick={() => onStartTest(undefined, 'hindi')}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs inline-flex items-center space-x-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Take Hindi Typing Test</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase text-[11px]">
                  <th className="pb-3 text-center w-16">Rank</th>
                  <th className="pb-3">Aspirant Name</th>
                  <th className="pb-3">Net WPM</th>
                  <th className="pb-3">Accuracy</th>
                  <th className="pb-3">Exam Category</th>
                  <th className="pb-3">Medium</th>
                  <th className="pb-3 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {combined.map((item) => (
                  <tr
                    key={item.id}
                    className={`transition-colors ${
                      item.isCurrentUser
                        ? 'bg-blue-50/80 dark:bg-blue-950/40 font-bold'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <td className="py-4 text-center">
                      <span className={`inline-flex items-center justify-center w-7 h-7 rounded-md font-black text-xs ${
                        item.rank === 1
                          ? 'bg-amber-400 text-slate-950'
                          : item.rank === 2
                          ? 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100'
                          : item.rank === 3
                          ? 'bg-amber-700/20 text-amber-800 dark:text-amber-300'
                          : 'text-slate-500'
                      }`}>
                        #{item.rank}
                      </span>
                    </td>

                    <td className="py-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                          item.isCurrentUser ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}>
                          {item.avatarSeed || 'A'}
                        </div>
                        <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center space-x-1.5">
                          <span>{item.username}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 font-black text-blue-700 dark:text-blue-400 text-base tabular-nums">
                      {item.netWpm}
                    </td>

                    <td className="py-4 font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                      {item.accuracy}%
                    </td>

                    <td className="py-4 font-semibold text-slate-800 dark:text-slate-200">
                      {item.examName}
                    </td>

                    <td className="py-4 capitalize text-slate-600 dark:text-slate-400">
                      {item.language}
                    </td>

                    <td className="py-4 text-right text-slate-400 text-xs">
                      {item.date}
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

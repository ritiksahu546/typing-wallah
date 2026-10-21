import React, { useState, useEffect } from 'react';
import { ActivePage, ExamId, LeaderboardItem, UserProfile } from '../types';
import { DEMO_LEADERBOARD_DATA } from '../data/leaderboard';
import { StorageService } from '../services/storageService';
import { db } from '../services/firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import {
  Trophy,
  Calendar,
  Filter,
  Info,
  Sparkles,
  CloudCheck,
  RefreshCw
} from 'lucide-react';

interface LeaderboardPageProps {
  user: UserProfile;
  onStartTest: (examId?: ExamId) => void;
  onNavigate: (page: ActivePage) => void;
}

export const LeaderboardPage: React.FC<LeaderboardPageProps> = ({
  user,
  onStartTest,
  onNavigate
}) => {
  const [timeFilter, setTimeFilter] = useState<'daily' | 'weekly' | 'monthly' | 'all-time'>('daily');
  const [examFilter, setExamFilter] = useState<string>('all');
  const [firestoreLeaderboard, setFirestoreLeaderboard] = useState<LeaderboardItem[]>([]);
  const [isLoadingFirestore, setIsLoadingFirestore] = useState<boolean>(false);

  // Fetch real-time online high scores from Firestore
  useEffect(() => {
    let isMounted = true;
    const fetchOnlineScores = async () => {
      try {
        setIsLoadingFirestore(true);
        const q = query(collection(db, 'leaderboard'), orderBy('netWpm', 'desc'), limit(50));
        const querySnapshot = await getDocs(q);
        if (!isMounted) return;

        const onlineItems: LeaderboardItem[] = [];
        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          const isMe = data.userId === user.id;
          onlineItems.push({
            id: 'fs_' + docSnap.id,
            rank: 0,
            username: isMe ? `${data.username} (You)` : data.username || 'Aspirant',
            wpm: data.netWpm || data.grossWpm || 0,
            netWpm: data.netWpm || 0,
            accuracy: data.accuracy || 100,
            examName: data.exam || data.examId || 'General',
            language: data.language || 'english',
            date: data.date || 'Recent',
            isCurrentUser: isMe,
            avatarSeed: (data.username || 'A').slice(0, 2).toUpperCase()
          });
        });

        setFirestoreLeaderboard(onlineItems);
      } catch (err) {
        console.warn('Firestore leaderboard query notice:', err);
      } finally {
        if (isMounted) setIsLoadingFirestore(false);
      }
    };

    fetchOnlineScores();
    return () => {
      isMounted = false;
    };
  }, [user.id]);

  const history = StorageService.getTestHistory();

  // Local user tests
  const userLeaderboardItems: LeaderboardItem[] = history.map((t) => ({
    id: 'user_' + t.id,
    rank: 0,
    username: `${user.name} (You)`,
    wpm: t.metrics.netWpm,
    netWpm: t.metrics.netWpm,
    accuracy: t.metrics.accuracy,
    examName: t.examName,
    language: t.language,
    date: 'Recent',
    isCurrentUser: true,
    avatarSeed: user.avatarSeed
  }));

  // Combine Firestore scores + local tests + standard benchmark profiles
  const combined = [...firestoreLeaderboard, ...userLeaderboardItems, ...DEMO_LEADERBOARD_DATA]
    .filter((item) => {
      if (examFilter === 'all') return true;
      return item.examName.toLowerCase().includes(examFilter.toLowerCase());
    })
    .sort((a, b) => b.netWpm - a.netWpm)
    .map((item, index) => ({
      ...item,
      rank: index + 1
    }));

  return (
    <div id="leaderboard-root" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-200 border border-amber-300/30 text-xs font-bold uppercase tracking-wider">
            <Trophy className="w-3.5 h-3.5 text-amber-300" />
            <span>National Typing Benchmarks</span>
          </div>

          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Firestore Live Sync Active</span>
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
          Aspirants Leaderboard
        </h1>

        <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
          Compare your Net WPM and accuracy against benchmark aspirant speeds across MP CPCT, SSC, RRB, and High Court test categories. Logged in candidate scores sync directly to Firestore.
        </p>

        {/* Notice */}
        <div className="bg-white/10 border border-white/20 rounded-2xl p-3.5 text-xs text-white/90 flex items-start space-x-2.5 max-w-2xl">
          <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p>
            <strong>Live Sync Notice:</strong> All scores typed while signed in with Google are synced to the cloud Firestore collection in real time.
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Time Filter Pills */}
        <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 text-xs font-bold w-full md:w-auto">
          {(['daily', 'weekly', 'monthly', 'all-time'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setTimeFilter(tab)}
              className={`flex-1 md:flex-none px-4 py-2 rounded-lg capitalize transition-all ${
                timeFilter === tab ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 shadow-xs' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {tab.replace('-', ' ')}
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
            <option value="Court">High Court</option>
            <option value="UPSSSC">UPSSSC</option>
          </select>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs overflow-hidden">
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
              {combined.map((item) => {
                return (
                  <tr
                    key={item.id}
                    className={`transition-colors ${
                      item.isCurrentUser
                        ? 'bg-blue-50/80 dark:bg-blue-950/40 font-bold'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <td className="py-4 text-center">
                      {item.rank === 1 ? (
                        <div className="w-7 h-7 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 font-black text-xs flex items-center justify-center mx-auto shadow-xs">
                          🥇
                        </div>
                      ) : item.rank === 2 ? (
                        <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-black text-xs flex items-center justify-center mx-auto">
                          🥈
                        </div>
                      ) : item.rank === 3 ? (
                        <div className="w-7 h-7 rounded-full bg-amber-200/60 dark:bg-amber-900/40 text-amber-900 dark:text-amber-300 font-black text-xs flex items-center justify-center mx-auto">
                          🥉
                        </div>
                      ) : (
                        <span className="font-bold text-slate-500">#{item.rank}</span>
                      )}
                    </td>

                    <td className="py-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                          item.isCurrentUser ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}>
                          {item.avatarSeed || 'A'}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center space-x-1.5">
                            <span>{item.username}</span>
                            {item.isCurrentUser && (
                              <span className="px-1.5 py-0.2 bg-blue-600 text-white rounded text-[10px] font-bold">
                                You
                              </span>
                            )}
                          </div>
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
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

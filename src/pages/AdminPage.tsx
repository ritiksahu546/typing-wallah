import React, { useState, useEffect } from 'react';
import { ActivePage, ExamId, Passage, Difficulty, Language } from '../types';
import { EXAMS_DATA } from '../data/exams';
import { PASSAGES_DATA } from '../data/passages';
import { StorageService } from '../services/storageService';
import { EXAM_SCORING_DOCUMENTATION } from '../engine/examScoring';
import { useAuth } from '../context/AuthContext';
import {
  ShieldAlert,
  Database,
  Sliders,
  Plus,
  Trash2,
  CheckCircle,
  Lock,
  ArrowLeft
} from 'lucide-react';

import { BUILTIN_COURSE_LESSONS } from '../data/touchTypingCourseCurriculum';
import { TouchTypingCourseLesson } from '../types/touchTypingCourse';
import { LearningProgressService } from '../services/learningProgressService';
import { AdminLessonManagerModal } from '../components/learning/AdminLessonManagerModal';

interface AdminPageProps {
  onNavigate: (page: ActivePage) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onNavigate }) => {
  const { isAdmin, profile } = useAuth();
  const [adminTab, setAdminTab] = useState<'exams' | 'passages' | 'scoring' | 'touch-typing' | 'analytics'>('exams');
  const [dataWiped, setDataWiped] = useState(false);
  const [courseLessons, setCourseLessons] = useState<TouchTypingCourseLesson[]>(BUILTIN_COURSE_LESSONS);
  const [isCmsModalOpen, setIsCmsModalOpen] = useState(false);

  // Custom passages state
  const [customPassages, setCustomPassages] = useState<Passage[]>(() => StorageService.getCustomPassages());
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newLanguage, setNewLanguage] = useState<Language>('english');
  const [newDifficulty, setNewDifficulty] = useState<Difficulty>('exam_level');
  const [newExamTag, setNewExamTag] = useState<ExamId>('ssc-chsl');
  const [passageSavedBanner, setPassageSavedBanner] = useState(false);

  useEffect(() => {
    LearningProgressService.getCombinedCurriculum().then(setCourseLessons);
  }, []);

  if (!isAdmin) {
    return (
      <div id="admin-unauthorized-root" className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 sm:p-10 shadow-sm text-center space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Admin Authorization Required
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
            The Typing Wallah Administration Control Plane is restricted to verified platform administrators.
            {profile.isLoggedIn
              ? ` Your account (${profile.email}) does not currently have administrator privileges.`
              : ' Please sign in with a verified administrator account to manage passages, lessons, and platform settings.'}
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs inline-flex items-center gap-2 shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Home</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const history = StorageService.getTestHistory();
  const allPassages = [...customPassages, ...PASSAGES_DATA];

  const handleAddCustomPassage = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = newTitle.trim();
    const trimmedContent = newContent.trim();
    if (!trimmedTitle || trimmedContent.length < 20) return;

    const words = trimmedContent.split(/\s+/).filter(Boolean).length;
    const newPassage: Passage = {
      id: `custom_${Date.now()}`,
      title: trimmedTitle,
      language: newLanguage,
      difficulty: newDifficulty,
      examId: newExamTag,
      targetExams: [newExamTag],
      category: 'Admin Custom',
      content: trimmedContent,
      wordCount: words,
      charCount: trimmedContent.length
    };

    StorageService.saveCustomPassage(newPassage);
    setCustomPassages(StorageService.getCustomPassages());
    setNewTitle('');
    setNewContent('');
    setPassageSavedBanner(true);
    setTimeout(() => setPassageSavedBanner(false), 3000);
  };

  const handleDeleteCustomPassage = (id: string) => {
    StorageService.deleteCustomPassage(id);
    setCustomPassages(StorageService.getCustomPassages());
  };

  const handleClearLocalData = () => {
    localStorage.removeItem('typing_wallah_history');
    setDataWiped(true);
    setTimeout(() => setDataWiped(false), 3000);
  };

  return (
    <div id="admin-architecture-root" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-3 border border-slate-800">
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-amber-400">
          <Database className="w-4 h-4" />
          <span>Typing Wallah Admin Control Plane</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
          Platform Administration & Content Management
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          Manage custom English and Hindi typing passages, touch-typing course lessons, exam cutoff standards, and scoring rule configurations.
        </p>
      </div>

      {/* Admin Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-bold gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setAdminTab('exams')}
          className={`px-4 py-2.5 rounded-lg whitespace-nowrap transition-colors ${
            adminTab === 'exams'
              ? 'bg-blue-600 text-white'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Exams Management ({Object.keys(EXAMS_DATA).length})
        </button>
        <button
          type="button"
          onClick={() => setAdminTab('passages')}
          className={`px-4 py-2.5 rounded-lg whitespace-nowrap transition-colors ${
            adminTab === 'passages'
              ? 'bg-blue-600 text-white'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Passage Repository ({allPassages.length})
        </button>
        <button
          type="button"
          onClick={() => setAdminTab('scoring')}
          className={`px-4 py-2.5 rounded-lg whitespace-nowrap transition-colors ${
            adminTab === 'scoring'
              ? 'bg-blue-600 text-white'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Scoring Formula Rules
        </button>
        <button
          type="button"
          onClick={() => setAdminTab('touch-typing')}
          className={`px-4 py-2.5 rounded-lg whitespace-nowrap transition-colors ${
            adminTab === 'touch-typing'
              ? 'bg-blue-600 text-white'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Touch Typing Lessons ({courseLessons.length})
        </button>
        <button
          type="button"
          onClick={() => setAdminTab('analytics')}
          className={`px-4 py-2.5 rounded-lg whitespace-nowrap transition-colors ${
            adminTab === 'analytics'
              ? 'bg-blue-600 text-white'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Local Telemetry & Data
        </button>
      </div>

      {/* Tab: Exams Management */}
      {adminTab === 'exams' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">Configured Examination Nodes</h3>
            <span className="text-xs text-slate-400">{Object.keys(EXAMS_DATA).length} Supported Target Exams</span>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-x-auto shadow-xs">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase text-[11px]">
                <tr>
                  <th className="p-4">Exam ID</th>
                  <th className="p-4">Full Designation</th>
                  <th className="p-4">Default Duration</th>
                  <th className="p-4">English WPM</th>
                  <th className="p-4">Hindi WPM</th>
                  <th className="p-4">Permitted Layouts</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {Object.values(EXAMS_DATA).map((e) => (
                  <tr key={e.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                    <td className="p-4 font-mono font-bold text-blue-700 dark:text-blue-400">{e.id}</td>
                    <td className="p-4 font-semibold text-slate-800 dark:text-slate-200">{e.name} ({e.fullName})</td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">{e.durationMinutes} Mins</td>
                    <td className="p-4 font-bold text-slate-900 dark:text-white">{e.qualifyingEnglishWpm || '—'} WPM</td>
                    <td className="p-4 font-bold text-amber-700 dark:text-amber-400">{e.qualifyingHindiWpm || '—'} WPM</td>
                    <td className="p-4 text-slate-500 dark:text-slate-400 capitalize">{e.supportedKeyboards.join(', ').replace(/_/g, ' ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Passage Repository & Custom Passage Manager */}
      {adminTab === 'passages' && (
        <div className="space-y-6">
          {/* Add Custom Passage Form */}
          <form
            onSubmit={handleAddCustomPassage}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-600" />
                <span>Add New Custom Practice Passage</span>
              </h3>
              {passageSavedBanner && (
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  Passage saved to repository
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Passage Title</label>
                <input
                  required
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., SSC CHSL 2026 Tier-II Editorial Passage"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Language</label>
                <select
                  value={newLanguage}
                  onChange={(e) => setNewLanguage(e.target.value as Language)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="english">English</option>
                  <option value="hindi">Hindi (Unicode)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Target Exam</label>
                <select
                  value={newExamTag}
                  onChange={(e) => setNewExamTag(e.target.value as ExamId)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  {Object.values(EXAMS_DATA).map((ex) => (
                    <option key={ex.id} value={ex.id}>
                      {ex.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="text-xs">
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Passage Content (Min 20 characters)
              </label>
              <textarea
                required
                rows={4}
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Paste or type the full English or Devanagari Unicode passage text..."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-600"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold text-slate-600 dark:text-slate-400">Difficulty:</span>
                {(['easy', 'medium', 'exam_level', 'hard'] as Difficulty[]).map((diff) => (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => setNewDifficulty(diff)}
                    className={`px-2.5 py-1 rounded-lg font-bold capitalize ${
                      newDifficulty === diff
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {diff.replace('_', ' ')}
                  </button>
                ))}
              </div>

              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Save Passage</span>
              </button>
            </div>
          </form>

          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Master Passage Database ({allPassages.length} Total)
            </h3>
            <span className="text-xs text-slate-400">
              {customPassages.length} Custom • {PASSAGES_DATA.length} Built-in
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {allPassages.map((p) => {
              const isCustom = p.id.startsWith('custom_');
              return (
                <div
                  key={p.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-2 shadow-xs"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-blue-700 dark:text-blue-400 font-bold">{p.id}</span>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase">
                        {p.language}
                      </span>
                      {isCustom && (
                        <button
                          type="button"
                          onClick={() => handleDeleteCustomPassage(p.id)}
                          className="p-1 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                          title="Delete custom passage"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">{p.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{p.content}</p>
                  <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-800">
                    <span>Words: {p.wordCount} • Chars: {p.charCount}</span>
                    <span className="capitalize">{p.difficulty.replace('_', ' ')}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab: Scoring Formula Rules */}
      {adminTab === 'scoring' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-6 shadow-xs">
          <h3 className="font-bold text-slate-900 dark:text-white text-lg">
            Official Exam Scoring Equations & Penalty Matrix
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700 dark:text-slate-300">
            {Object.entries(EXAM_SCORING_DOCUMENTATION).map(([key, formulaDesc]) => (
              <div
                key={key}
                className="bg-slate-50 dark:bg-slate-800/60 p-5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm uppercase">{key.replace(/-/g, ' ')}</h4>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold">
                    {key}
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{formulaDesc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Touch Typing Course Lessons */}
      {adminTab === 'touch-typing' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-lg">
                Touch Typing Course Curriculum ({courseLessons.length} Lessons)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Manage all 11 progressive levels, benchmark WPM requirements, and custom drills.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsCmsModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md self-start"
            >
              <Sliders className="w-4 h-4" />
              <span>Open Lesson CMS Editor</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center">
              <span className="text-[11px] font-bold text-slate-400 uppercase block">Total Lessons</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white">{courseLessons.length}</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center">
              <span className="text-[11px] font-bold text-slate-400 uppercase block">Progression Levels</span>
              <span className="text-2xl font-black text-purple-600 dark:text-purple-400">11 Levels</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center">
              <span className="text-[11px] font-bold text-slate-400 uppercase block">Benchmark Goal</span>
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">50 WPM</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Analytics & Local Data */}
      {adminTab === 'analytics' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-xs">
          <h3 className="font-bold text-slate-900 dark:text-white text-lg">
            Client Local Storage Management
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Local browser storage contains {history.length} logged typing attempts on this device.
          </p>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleClearLocalData}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center space-x-1.5 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear Local Test History</span>
            </button>
            {dataWiped && (
              <p className="text-xs text-emerald-600 font-bold mt-2">
                ✓ Local session history cleared successfully.
              </p>
            )}
          </div>
        </div>
      )}

      {/* CMS Modal */}
      <AdminLessonManagerModal
        isOpen={isCmsModalOpen}
        onClose={() => setIsCmsModalOpen(false)}
        lessons={courseLessons}
        onLessonsUpdated={(updated) => setCourseLessons(updated)}
      />
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { ActivePage, ExamId } from '../types';
import { EXAMS_DATA } from '../data/exams';
import { PASSAGES_DATA } from '../data/passages';
import { BLOG_POSTS } from '../data/blogs';
import { StorageService } from '../services/storageService';
import {
  X,
  ShieldAlert,
  Database,
  FileText,
  Sliders,
  Users,
  Settings,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  Clock,
  Layers
} from 'lucide-react';

import { BUILTIN_COURSE_LESSONS } from '../data/touchTypingCourseCurriculum';
import { TouchTypingCourseLesson } from '../types/touchTypingCourse';
import { LearningProgressService } from '../services/learningProgressService';
import { AdminLessonManagerModal } from '../components/learning/AdminLessonManagerModal';

interface AdminPageProps {
  onNavigate: (page: ActivePage) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onNavigate }) => {
  const [adminTab, setAdminTab] = useState<'exams' | 'passages' | 'scoring' | 'touch-typing' | 'analytics'>('exams');
  const [dataWiped, setDataWiped] = useState(false);
  const [courseLessons, setCourseLessons] = useState<TouchTypingCourseLesson[]>(BUILTIN_COURSE_LESSONS);
  const [isCmsModalOpen, setIsCmsModalOpen] = useState(false);

  useEffect(() => {
    LearningProgressService.getCombinedCurriculum().then(setCourseLessons);
  }, []);

  const history = StorageService.getTestHistory();

  const handleClearLocalData = () => {
    localStorage.removeItem('typing_wallah_history');
    setDataWiped(true);
    setTimeout(() => setDataWiped(false), 3000);
  };

  return (
    <div id="admin-architecture-root" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Architecture Transparency Banner (Phase 13 Compliance) */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-3">
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-amber-400">
          <Database className="w-4 h-4" />
          <span>Phase 13: Admin Control Plane Architecture</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
          Typing Wallah Administration Architecture
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          This control panel provides a live inspector for test configurations, passages repository, exam cutoff standards, and client telemetry. Conforming strictly to instructions, it does not simulate permanent server writes until a backend service is connected in future loops.
        </p>
      </div>

      {/* Admin Tabs */}
      <div className="flex border-b border-slate-200 text-xs sm:text-sm font-bold gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setAdminTab('exams')}
          className={`px-4 py-2.5 rounded-lg whitespace-nowrap transition-colors ${
            adminTab === 'exams' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Exams Management ({Object.keys(EXAMS_DATA).length})
        </button>
        <button
          type="button"
          onClick={() => setAdminTab('passages')}
          className={`px-4 py-2.5 rounded-lg whitespace-nowrap transition-colors ${
            adminTab === 'passages' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Passage Repository ({PASSAGES_DATA.length})
        </button>
        <button
          type="button"
          onClick={() => setAdminTab('scoring')}
          className={`px-4 py-2.5 rounded-lg whitespace-nowrap transition-colors ${
            adminTab === 'scoring' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Scoring Formula Rules
        </button>
        <button
          type="button"
          onClick={() => setAdminTab('touch-typing')}
          className={`px-4 py-2.5 rounded-lg whitespace-nowrap transition-colors ${
            adminTab === 'touch-typing' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Touch Typing Lessons ({courseLessons.length})
        </button>
        <button
          type="button"
          onClick={() => setAdminTab('analytics')}
          className={`px-4 py-2.5 rounded-lg whitespace-nowrap transition-colors ${
            adminTab === 'analytics' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Local Telemetry & Data
        </button>
      </div>

      {/* Tab: Exams Management */}
      {adminTab === 'exams' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-lg">Configured Examination Nodes</h3>
            <span className="text-xs text-slate-400">8 Supported Target Exams</span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase text-[11px]">
                <tr>
                  <th className="p-4">Exam ID</th>
                  <th className="p-4">Full Designation</th>
                  <th className="p-4">Default Duration</th>
                  <th className="p-4">English WPM</th>
                  <th className="p-4">Hindi WPM</th>
                  <th className="p-4">Permitted Layouts</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {Object.values(EXAMS_DATA).map((e) => (
                  <tr key={e.id} className="hover:bg-slate-50/80">
                    <td className="p-4 font-mono font-bold text-blue-700">{e.id}</td>
                    <td className="p-4 font-semibold text-slate-800">{e.name} ({e.fullName})</td>
                    <td className="p-4 text-slate-600">{e.durationMinutes} Mins</td>
                    <td className="p-4 font-bold text-slate-900">{e.qualifyingEnglishWpm || '—'} WPM</td>
                    <td className="p-4 font-bold text-amber-700">{e.qualifyingHindiWpm || '—'} WPM</td>
                    <td className="p-4 text-slate-500 capitalize">{e.supportedKeyboards.join(', ').replace(/_/g, ' ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Passage Repository */}
      {adminTab === 'passages' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-lg">Master Passage Database</h3>
            <span className="text-xs text-slate-400">English & Hindi Unicode</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PASSAGES_DATA.map((p) => (
              <div key={p.id} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2 shadow-xs">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-blue-700 font-bold">{p.id}</span>
                  <span className="px-2 py-0.5 rounded font-bold bg-slate-100 uppercase">{p.language}</span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm">{p.title}</h4>
                <p className="text-xs text-slate-500 line-clamp-2">{p.content}</p>
                <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100">
                  <span>Words: {p.wordCount} • Chars: {p.charCount}</span>
                  <span className="capitalize">{p.difficulty.replace('_', ' ')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Scoring Formula Rules */}
      {adminTab === 'scoring' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-xs">
          <h3 className="font-bold text-slate-900 text-lg">
            Standard Scoring Equations & Deduction Matrix
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-700">
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900 text-sm">International & CPCT Standard</h4>
              <p><strong>Gross Words</strong> = (Total Keystrokes ÷ 5)</p>
              <p><strong>Elapsed Minutes</strong> = Elapsed Seconds ÷ 60</p>
              <p><strong>Gross WPM</strong> = Gross Words ÷ Elapsed Minutes</p>
              <p><strong>Net WPM</strong> = Gross WPM - (Character Errors ÷ 5 ÷ Elapsed Minutes)</p>
              <p><strong>Accuracy %</strong> = (Correct Characters ÷ Total Typed Characters) × 100</p>
            </div>

            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900 text-sm">SSC DEST Key Depressions</h4>
              <p><strong>Strokes Target</strong>: 2,000 Key Depressions (15 mins)</p>
              <p><strong>Equivalent Speed</strong>: ~27 Words Per Minute</p>
              <p><strong>Full Mistake</strong>: Omission, addition, substitution of full words</p>
              <p><strong>Half Mistake</strong>: Spacing errors, capitalization, punctuation</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Touch Typing Course Lessons */}
      {adminTab === 'touch-typing' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-lg">
                Touch Typing Course Curriculum ({courseLessons.length} Lessons)
              </h3>
              <p className="text-xs text-slate-500">
                Manage all 11 progressive levels, benchmark WPM requirements, and custom drills.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsCmsModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md"
            >
              <Sliders className="w-4 h-4" />
              <span>Open Lesson CMS Editor</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[11px] font-bold text-slate-400 uppercase block">Total Lessons</span>
              <span className="text-2xl font-black text-slate-900">{courseLessons.length}</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[11px] font-bold text-slate-400 uppercase block">Progression Levels</span>
              <span className="text-2xl font-black text-purple-600">11 Levels</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[11px] font-bold text-slate-400 uppercase block">Benchmark Goal</span>
              <span className="text-2xl font-black text-emerald-600">50 WPM</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Analytics & Local Data */}
      {adminTab === 'analytics' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <h3 className="font-bold text-slate-900 text-lg">
            Client Local Storage Management
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
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

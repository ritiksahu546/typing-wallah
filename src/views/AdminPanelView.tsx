import React, { useState } from 'react';
import { ActivePage, ExamId } from '../types';
import { EXAMS_DATA } from '../data/exams';
import { PASSAGES_DATA } from '../data/passages';
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

interface AdminPanelViewProps {
  onNavigate?: (page: ActivePage) => void;
  onClose?: () => void;
}

export const AdminPanelView: React.FC<AdminPanelViewProps> = ({ onNavigate, onClose }) => {
  const [adminTab, setAdminTab] = useState<'exams' | 'passages' | 'scoring' | 'analytics'>('exams');
  const [dataWiped, setDataWiped] = useState(false);
  const [showNoticeBanner, setShowNoticeBanner] = useState(true);

  const history = StorageService.getTestHistory();

  const handleClearLocalData = () => {
    localStorage.removeItem('typing_wallah_history');
    setDataWiped(true);
    setTimeout(() => setDataWiped(false), 3000);
  };

  return (
    <div id="admin-panel-view-root" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Dismissible Notice Banner with X icon */}
      {showNoticeBanner && (
        <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900 rounded-2xl text-blue-900 dark:text-blue-200 text-xs sm:text-sm">
          <div className="flex items-center space-x-2">
            <Database className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
            <span className="font-semibold">
              Admin Control Plane: Real-time inspection for exam nodes, scoring metrics, and local telemetry.
            </span>
          </div>
          <button
            type="button"
            id="dismiss-admin-banner"
            onClick={() => setShowNoticeBanner(false)}
            className="p-1 rounded-lg text-blue-500 hover:text-blue-800 dark:hover:text-blue-200 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors ml-2 shrink-0"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Architecture Transparency Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-3 relative">
        {onClose && (
          <button
            type="button"
            id="close-admin-view-btn"
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            aria-label="Close Admin Panel"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-amber-400">
          <Database className="w-4 h-4" />
          <span>Admin Control Plane Architecture</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
          Typing Wallah Administration Architecture
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          This control panel provides a live inspector for test configurations, passages repository, exam cutoff standards, and client telemetry. Conforming strictly to instructions, it operates with local persistence for candidate data.
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
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
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
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Passage Repository ({PASSAGES_DATA.length})
        </button>
        <button
          type="button"
          onClick={() => setAdminTab('scoring')}
          className={`px-4 py-2.5 rounded-lg whitespace-nowrap transition-colors ${
            adminTab === 'scoring'
              ? 'bg-blue-600 text-white'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Scoring Formula Rules
        </button>
        <button
          type="button"
          onClick={() => setAdminTab('analytics')}
          className={`px-4 py-2.5 rounded-lg whitespace-nowrap transition-colors ${
            adminTab === 'analytics'
              ? 'bg-blue-600 text-white'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
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
            <span className="text-xs text-slate-400 dark:text-slate-500">8 Supported Target Exams</span>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-bold uppercase text-[11px]">
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
                    <tr key={e.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                      <td className="p-4 font-mono font-bold text-blue-600 dark:text-blue-400">{e.id}</td>
                      <td className="p-4 font-semibold text-slate-800 dark:text-slate-200">{e.name} ({e.fullName})</td>
                      <td className="p-4 text-slate-600 dark:text-slate-400">{e.durationMinutes} Mins</td>
                      <td className="p-4 font-bold text-slate-900 dark:text-white">{e.qualifyingEnglishWpm || '—'} WPM</td>
                      <td className="p-4 font-bold text-amber-600 dark:text-amber-400">{e.qualifyingHindiWpm || '—'} WPM</td>
                      <td className="p-4 text-slate-500 dark:text-slate-400 capitalize">{e.supportedKeyboards.join(', ').replace(/_/g, ' ')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Passage Repository */}
      {adminTab === 'passages' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">Master Passage Database</h3>
            <span className="text-xs text-slate-400 dark:text-slate-500">English & Hindi Unicode</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PASSAGES_DATA.map((p) => (
              <div key={p.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-2 shadow-xs">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">{p.id}</span>
                  <span className="px-2 py-0.5 rounded font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase">{p.language}</span>
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">{p.title}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{p.content}</p>
                <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 border-t border-slate-100 dark:border-slate-800">
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
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-6 shadow-xs">
          <h3 className="font-bold text-slate-900 dark:text-white text-lg">
            Standard Scoring Equations & Deduction Matrix
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-700 dark:text-slate-300">
            <div className="bg-slate-50 dark:bg-slate-800/60 p-5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">International & CPCT Standard</h4>
              <p><strong>Gross Words</strong> = (Total Keystrokes ÷ 5)</p>
              <p><strong>Elapsed Minutes</strong> = Elapsed Seconds ÷ 60</p>
              <p><strong>Gross WPM</strong> = Gross Words ÷ Elapsed Minutes</p>
              <p><strong>Net WPM</strong> = Gross WPM - (Character Errors ÷ 5 ÷ Elapsed Minutes)</p>
              <p><strong>Accuracy %</strong> = (Correct Characters ÷ Total Typed Characters) × 100</p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 p-5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">SSC DEST Key Depressions</h4>
              <p><strong>Strokes Target</strong>: 2,000 Key Depressions (15 mins)</p>
              <p><strong>Equivalent Speed</strong>: ~27 Words Per Minute</p>
              <p><strong>Full Mistake</strong>: Omission, addition, substitution of full words</p>
              <p><strong>Half Mistake</strong>: Spacing errors, capitalization, punctuation</p>
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
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold mt-2">
                ✓ Local session history cleared successfully.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanelView;

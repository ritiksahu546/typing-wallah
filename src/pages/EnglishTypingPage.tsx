import React, { useState } from 'react';
import { ActivePage, ExamId } from '../types';
import { PASSAGES_DATA } from '../data/passages';
import {
  Keyboard,
  Clock,
  Play,
  CheckCircle2,
  Award,
  Zap,
  Target,
  Key
} from 'lucide-react';

interface EnglishTypingPageProps {
  onStartTest: (examId?: ExamId, lang?: 'english' | 'hindi', duration?: number) => void;
  onNavigate: (page: ActivePage, examId?: ExamId) => void;
}

export const EnglishTypingPage: React.FC<EnglishTypingPageProps> = ({
  onStartTest,
  onNavigate
}) => {
  const [duration, setDuration] = useState<number>(600); // 10 mins
  const englishPassages = PASSAGES_DATA.filter((p) => p.language === 'english');

  return (
    <div id="english-typing-root" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 border border-blue-400/30 text-xs font-bold uppercase tracking-wider">
          <Key className="w-3.5 h-3.5 text-blue-300" />
          <span>DEST 2000 Depressions • SSC CHSL 35 WPM</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
          English Typing Master Hub
        </h1>

        <p className="text-sm sm:text-base text-blue-100 max-w-3xl leading-relaxed">
          High-performance English typing practice for Central and State government recruitment examinations. Track exact key depressions, stroke pacing, and mistake percentages conforming to TCS examination software standards.
        </p>

        {/* Quick Launch */}
        <div className="pt-2 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => onStartTest('ssc-chsl', 'english', duration)}
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center space-x-2"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Launch English Practice ({duration / 60}m)</span>
          </button>
          <button
            type="button"
            onClick={() => onStartTest('ssc-cgl-dest', 'english', 900)}
            className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-colors"
          >
            15m CGL DEST (2,000 Key Depressions)
          </button>
        </div>
      </div>

      {/* Duration Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            Test Duration Preset
          </label>
          <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-bold">
            {[60, 180, 300, 600, 900].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setDuration(s)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  duration === s ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600'
                }`}
              >
                {s / 60} min
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => onStartTest(undefined, 'english', duration)}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center space-x-1.5 shadow-xs"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Launch Configured Test</span>
        </button>
      </div>

      {/* Speed Thresholds Explained */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-xs">
          <span className="text-xs font-bold text-blue-600 uppercase">SSC CHSL Requirement</span>
          <h4 className="text-xl font-bold text-slate-900">35 WPM / 1,750 Strokes</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Candidates must type 1,750 key depressions in a 10-minute window with error rates below 7% for General category.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-xs">
          <span className="text-xs font-bold text-indigo-600 uppercase">SSC CGL DEST</span>
          <h4 className="text-xl font-bold text-slate-900">2,000 Key Depressions</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            15-minute continuous master passage test. Strict penalty evaluation for missing punctuation or line skipping.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-xs">
          <span className="text-xs font-bold text-amber-600 uppercase">RRB NTPC & High Court</span>
          <h4 className="text-xl font-bold text-slate-900">30–40 WPM Standard</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Fast legal and administrative passages requiring 90%+ net accuracy.
          </p>
        </div>
      </div>

      {/* English Passages List */}
      <div className="space-y-4">
        <h3 className="text-xl font-black text-slate-900">English Practice Passages</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {englishPassages.map((pass) => (
            <div
              key={pass.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 flex flex-col justify-between shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2 py-0.5 rounded font-bold bg-blue-50 text-blue-700 capitalize">
                    {pass.difficulty.replace('_', ' ')}
                  </span>
                  <span className="text-slate-400">{pass.wordCount} words</span>
                </div>
                <h4 className="font-bold text-slate-900 text-base mt-2">{pass.title}</h4>
                <p className="text-xs text-slate-600 mt-1 line-clamp-3 leading-relaxed">
                  {pass.content}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">{pass.category}</span>
                <button
                  type="button"
                  onClick={() => onStartTest(pass.examId, 'english', duration)}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center space-x-1"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Start Practice</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

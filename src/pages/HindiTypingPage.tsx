import React, { useState } from 'react';
import { ActivePage, ExamId, HindiKeyboardLayout } from '../types';
import { PASSAGES_DATA } from '../data/passages';
import { VirtualKeyboardMap } from '../components/VirtualKeyboardMap';
import {
  Globe,
  Keyboard,
  Play,
  CheckCircle2,
  BookOpen,
  Award,
  Sparkles,
  HelpCircle
} from 'lucide-react';

interface HindiTypingPageProps {
  onStartTest: (examId?: ExamId, lang?: 'english' | 'hindi', duration?: number, layout?: HindiKeyboardLayout) => void;
  onNavigate: (page: ActivePage, examId?: ExamId) => void;
}

export const HindiTypingPage: React.FC<HindiTypingPageProps> = ({
  onStartTest,
  onNavigate
}) => {
  const [layout, setLayout] = useState<HindiKeyboardLayout>('remington_gail');
  const [duration, setDuration] = useState<number>(300);
  const [showLayoutMap, setShowLayoutMap] = useState(false);

  const hindiPassages = PASSAGES_DATA.filter((p) => p.language === 'hindi');

  return (
    <div id="hindi-typing-root" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-amber-700 via-orange-800 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-200 border border-amber-300/30 text-xs font-bold uppercase tracking-wider">
          <Globe className="w-3.5 h-3.5 text-amber-300" />
          <span>Mangal Unicode Standard • CPCT, UPSSSC & High Court</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
          Hindi Typing Master Hub
        </h1>

        <p className="text-sm sm:text-base text-amber-100 max-w-3xl leading-relaxed">
          The ultimate Hindi typing training simulator. Practice on authentic government exam passages with complete support for both <strong>Remington GAIL</strong> (typewriter keyboard) and <strong>InScript</strong> (Government of India standard) layouts on Mangal font.
        </p>

        {/* Quick Launch & Layout Controls */}
        <div className="pt-2 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => onStartTest('cpct', 'hindi', duration, layout)}
            className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs sm:text-sm shadow-md transition-all flex items-center space-x-2"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Start Hindi Practice ({duration / 60}m)</span>
          </button>

          <button
            type="button"
            onClick={() => setShowLayoutMap(!showLayoutMap)}
            className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-colors flex items-center space-x-1.5"
          >
            <Keyboard className="w-4 h-4" />
            <span>{showLayoutMap ? 'Hide Keyboard Layout' : 'Open Virtual Keyboard Map'}</span>
          </button>
        </div>
      </div>

      {/* Configurator Box */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Keyboard Layout
            </label>
            <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-bold">
              <button
                type="button"
                onClick={() => setLayout('remington_gail')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  layout === 'remington_gail' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'text-slate-600'
                }`}
              >
                Remington GAIL
              </button>
              <button
                type="button"
                onClick={() => setLayout('inscript')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  layout === 'inscript' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'text-slate-600'
                }`}
              >
                InScript
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Test Duration
            </label>
            <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-bold">
              {[60, 180, 300, 600, 900].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setDuration(s)}
                  className={`px-2.5 py-1.5 rounded-lg transition-all ${
                    duration === s ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600'
                  }`}
                >
                  {s / 60}m
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onStartTest('cpct', 'hindi', duration, layout)}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center space-x-1.5 shadow-xs"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Launch Now</span>
        </button>
      </div>

      {/* Keyboard Map Viewer */}
      {showLayoutMap && (
        <VirtualKeyboardMap
          layout={layout}
          onClose={() => setShowLayoutMap(false)}
        />
      )}

      {/* Key Layout Differences & Ligature Guide */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold text-slate-900 text-base">
              Remington GAIL Guide (Mangal)
            </h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Preferred by candidates transitioning from KrutiDev 010. Keystrokes correspond to typewriter mechanical keys.
          </p>
          <ul className="space-y-1.5 text-xs text-slate-600">
            <li>• <strong>k</strong> = ा (Aa Matra)</li>
            <li>• <strong>e</strong> = म, <strong>Shift+e</strong> = ?</li>
            <li>• <strong>f</strong> = िक (Small I Matra), <strong>h</strong> = ी (Big I Matra)</li>
            <li>• <strong>d</strong> = क् (Half Ka) / Halant</li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-base">
              InScript Layout Guide (C-DAC Standard)
            </h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            The national standard layout. Built on linguistic logic: Left hand = Vowels, Right hand = Consonants.
          </p>
          <ul className="space-y-1.5 text-xs text-slate-600">
            <li>• <strong>d</strong> = ् (Halant / Virama - forms conjuncts automatically)</li>
            <li>• <strong>k</strong> = क, <strong>l</strong> = त, <strong>j</strong> = र</li>
            <li>• <strong>e</strong> = ा, <strong>r</strong> = ी, <strong>w</strong> = ू</li>
            <li>• Cleanest layout with zero obscure Alt codes needed</li>
          </ul>
        </div>
      </div>

      {/* Hindi Practice Passages */}
      <div className="space-y-4">
        <h3 className="text-xl font-black text-slate-900">
          Curated Hindi Passages for Government Exams
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {hindiPassages.map((pass) => (
            <div
              key={pass.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 flex flex-col justify-between shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2 py-0.5 rounded font-bold bg-amber-50 text-amber-800 border border-amber-200 capitalize">
                    {pass.difficulty.replace('_', ' ')}
                  </span>
                  <span className="text-slate-400">{pass.wordCount} words</span>
                </div>
                <h4 className="font-bold text-slate-900 text-base mt-2 font-hindi">{pass.title}</h4>
                <p className="text-xs text-slate-600 mt-1 line-clamp-3 font-hindi leading-relaxed">
                  {pass.content}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">{pass.category}</span>
                <button
                  type="button"
                  onClick={() => onStartTest(pass.examId, 'hindi', duration, layout)}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center space-x-1"
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

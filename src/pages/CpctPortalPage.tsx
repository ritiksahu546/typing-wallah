import React, { useState } from 'react';
import { ActivePage, ExamId, HindiKeyboardLayout } from '../types';
import { EXAMS_DATA } from '../data/exams';
import { PASSAGES_DATA } from '../data/passages';
import { VirtualKeyboardMap } from '../components/VirtualKeyboardMap';
import {
  Keyboard,
  Clock,
  Play,
  CheckCircle2,
  AlertTriangle,
  FileText,
  HelpCircle,
  Award,
  Globe,
  Settings,
  ChevronDown
} from 'lucide-react';

interface CpctPortalPageProps {
  onStartTest: (examId: ExamId, lang: 'english' | 'hindi', duration: number, layout?: HindiKeyboardLayout) => void;
  onNavigate: (page: ActivePage, examId?: ExamId) => void;
}

export const CpctPortalPage: React.FC<CpctPortalPageProps> = ({
  onStartTest,
  onNavigate
}) => {
  const [selectedSubTab, setSelectedSubTab] = useState<'overview' | 'hindi' | 'english' | 'practice' | 'mock'>('overview');
  const [hindiLayout, setHindiLayout] = useState<HindiKeyboardLayout>('remington_gail');
  const [selectedDuration, setSelectedDuration] = useState<number>(900); // 15 mins default
  const [showKeyboardMap, setShowKeyboardMap] = useState(false);

  const cpctInfo = EXAMS_DATA['cpct'];
  const cpctPassages = PASSAGES_DATA.filter((p) => p.examId === 'cpct' || p.category.includes('CPCT') || p.category.includes('प्रशासन'));

  return (
    <div id="cpct-portal-root" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Official CPCT Banner Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 flex items-start space-x-3 text-amber-900 text-xs sm:text-sm">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-amber-800">
            Official CPCT Rule Verification Reminder:
          </p>
          <p className="leading-relaxed text-amber-700">
            Typing Wallah is an independent mock simulator. Official CPCT examination notifications, passing score weights, and scorecard validity regulations are administered by <strong>MAP_IT, Government of Madhya Pradesh</strong>. Candidates should regularly check <strong>cpct.mp.gov.in</strong> for official updates.
          </p>
        </div>
      </div>

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 border border-blue-400/30 text-xs font-bold uppercase tracking-wider">
          <Award className="w-3.5 h-3.5 text-amber-400" />
          <span>Special Exam Hub • Madhya Pradesh</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
          MP CPCT Typing Portal
        </h1>

        <p className="text-sm sm:text-base text-blue-100 max-w-3xl leading-relaxed">
          The comprehensive preparation suite for the Madhya Pradesh Computer Proficiency Certification Test. Practice English (30 WPM minimum) and Hindi (20 WPM minimum on Mangal font with Remington GAIL or InScript) in realistic exam mock sessions.
        </p>

        {/* Quick Launch Buttons */}
        <div className="pt-3 flex flex-wrap items-center gap-3">
          <button
            id="cpct-launch-hindi-mock"
            type="button"
            onClick={() => onStartTest('cpct', 'hindi', 900, hindiLayout)}
            className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs sm:text-sm shadow-md transition-all flex items-center space-x-2"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Launch 15-Min Hindi Mock (Mangal)</span>
          </button>

          <button
            id="cpct-launch-english-mock"
            type="button"
            onClick={() => onStartTest('cpct', 'english', 900)}
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center space-x-2"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Launch 15-Min English Mock</span>
          </button>

          <button
            id="cpct-toggle-keyboard-ref"
            type="button"
            onClick={() => setShowKeyboardMap(!showKeyboardMap)}
            className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-colors flex items-center space-x-1.5"
          >
            <Keyboard className="w-4 h-4" />
            <span>{showKeyboardMap ? 'Hide Layout Map' : 'View Keyboard Layout'}</span>
          </button>
        </div>
      </div>

      {/* Layout Reference Viewer */}
      {showKeyboardMap && (
        <VirtualKeyboardMap
          layout={hindiLayout}
          onClose={() => setShowKeyboardMap(false)}
        />
      )}

      {/* Sub-Navigation Tabs (Phase 6 Requirements) */}
      <div className="flex border-b border-slate-200 overflow-x-auto text-xs sm:text-sm font-bold gap-1 pb-1">
        <button
          id="cpct-subtab-overview"
          type="button"
          onClick={() => setSelectedSubTab('overview')}
          className={`px-4 py-2.5 rounded-lg whitespace-nowrap transition-colors ${
            selectedSubTab === 'overview'
              ? 'bg-blue-600 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          CPCT Overview & Pattern
        </button>
        <button
          id="cpct-subtab-hindi"
          type="button"
          onClick={() => setSelectedSubTab('hindi')}
          className={`px-4 py-2.5 rounded-lg whitespace-nowrap transition-colors ${
            selectedSubTab === 'hindi'
              ? 'bg-blue-600 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          CPCT Hindi Typing (20 WPM)
        </button>
        <button
          id="cpct-subtab-english"
          type="button"
          onClick={() => setSelectedSubTab('english')}
          className={`px-4 py-2.5 rounded-lg whitespace-nowrap transition-colors ${
            selectedSubTab === 'english'
              ? 'bg-blue-600 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          CPCT English Typing (30 WPM)
        </button>
        <button
          id="cpct-subtab-practice"
          type="button"
          onClick={() => setSelectedSubTab('practice')}
          className={`px-4 py-2.5 rounded-lg whitespace-nowrap transition-colors ${
            selectedSubTab === 'practice'
              ? 'bg-blue-600 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          CPCT Practice Passages
        </button>
        <button
          id="cpct-subtab-mock"
          type="button"
          onClick={() => setSelectedSubTab('mock')}
          className={`px-4 py-2.5 rounded-lg whitespace-nowrap transition-colors ${
            selectedSubTab === 'mock'
              ? 'bg-blue-600 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Full CPCT Mock Test
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {selectedSubTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
              <h3 className="text-xl font-bold text-slate-900">
                About MP CPCT Examination
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                The Computer Proficiency Certification Test (CPCT) is mandatory in Madhya Pradesh for recruitment into various clerical posts like Assistant Grade-3, Steno-Typist, Data Entry Operator, and Patwari across state government departments, secretariats, and autonomous boards.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1">
                  <span className="text-xs font-bold text-slate-400 uppercase">English Typing Norm</span>
                  <div className="text-xl font-bold text-blue-700">30 WPM (Net Speed)</div>
                  <p className="text-xs text-slate-500">15 Minutes test time</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1">
                  <span className="text-xs font-bold text-slate-400 uppercase">Hindi Typing Norm</span>
                  <div className="text-xl font-bold text-amber-700">20 WPM (Net Speed)</div>
                  <p className="text-xs text-slate-500">15 Minutes on Mangal font</p>
                </div>
              </div>
            </div>

            {/* Pattern & Guidelines */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
              <h3 className="text-lg font-bold text-slate-900">
                CPCT Exam Structure & Timing Sequence
              </h3>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-600">
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Section 1:</strong> Multiple Choice Computer Proficiency (75 Questions, 75 Minutes).</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Section 2:</strong> English Typing Mock trial (5 mins) followed by actual English Typing Test (15 minutes).</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Section 3:</strong> Hindi Typing Mock trial (10 mins) followed by actual Hindi Typing Test (15 minutes).</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Sidebar Configurator */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
              <div className="flex items-center space-x-2">
                <Settings className="w-5 h-5 text-blue-600" />
                <h4 className="font-bold text-slate-900 text-base">Test Configuration</h4>
              </div>

              {/* Layout selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Hindi Keyboard Layout:
                </label>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="cpct-layout"
                      checked={hindiLayout === 'remington_gail'}
                      onChange={() => setHindiLayout('remington_gail')}
                      className="text-blue-600"
                    />
                    <span>Remington GAIL (Typewriter style)</span>
                  </label>
                  <label className="flex items-center space-x-2 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="cpct-layout"
                      checked={hindiLayout === 'inscript'}
                      onChange={() => setHindiLayout('inscript')}
                      className="text-blue-600"
                    />
                    <span>InScript (Govt of India standard)</span>
                  </label>
                </div>
              </div>

              {/* Duration selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Practice Duration:
                </label>
                <select
                  value={selectedDuration}
                  onChange={(e) => setSelectedDuration(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                >
                  <option value={900}>15 Minutes (Official CPCT)</option>
                  <option value={600}>10 Minutes (Standard)</option>
                  <option value={300}>5 Minutes (Sprint)</option>
                  <option value={180}>3 Minutes (Warm up)</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onStartTest('cpct', 'hindi', selectedDuration, hindiLayout)}
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-sm flex items-center justify-center space-x-2"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Start Configured Test</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: HINDI TYPING SPECIFIC */}
      {selectedSubTab === 'hindi' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-amber-600 uppercase">CPCT Section 3</span>
              <h3 className="text-2xl font-black text-slate-900">CPCT Hindi Typing Practice</h3>
              <p className="text-xs text-slate-500 mt-1">
                Mangal Unicode Font • Qualifying speed: 20 Net WPM • Remington GAIL or InScript
              </p>
            </div>
            <button
              type="button"
              onClick={() => onStartTest('cpct', 'hindi', 900, hindiLayout)}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs shadow-sm flex items-center space-x-1.5"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Launch 15m Hindi Test</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
              <h4 className="font-bold text-slate-900 text-sm">Remington GAIL Key Bindings</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Identical to KrutiDev 010 key mappings. Standard matras are keyed using:
                <br />• <strong>k</strong> for 'ा' (aa matra)
                <br />• <strong>e</strong> for 'म'
                <br />• <strong>u</strong> for 'न'
                <br />• <strong>j</strong> for 'र'
              </p>
              <button
                type="button"
                onClick={() => {
                  setHindiLayout('remington_gail');
                  setShowKeyboardMap(true);
                }}
                className="text-xs font-bold text-blue-600 hover:underline"
              >
                View Full Remington GAIL Chart →
              </button>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
              <h4 className="font-bold text-slate-900 text-sm">InScript Key Bindings</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Phonetic C-DAC standard layout:
                <br />• Left hand keys vowels & matras: <strong>e</strong> for 'ा', <strong>r</strong> for 'ी'
                <br />• Right hand keys consonants: <strong>k</strong> for 'क', <strong>j</strong> for 'र'
                <br />• Press <strong>d</strong> (halant) between two letters to generate conjuncts.
              </p>
              <button
                type="button"
                onClick={() => {
                  setHindiLayout('inscript');
                  setShowKeyboardMap(true);
                }}
                className="text-xs font-bold text-blue-600 hover:underline"
              >
                View Full InScript Chart →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ENGLISH TYPING SPECIFIC */}
      {selectedSubTab === 'english' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase">CPCT Section 2</span>
              <h3 className="text-2xl font-black text-slate-900">CPCT English Typing Practice</h3>
              <p className="text-xs text-slate-500 mt-1">
                Standard QWERTY • Qualifying speed: 30 Net WPM • 15 Minutes evaluation
              </p>
            </div>
            <button
              type="button"
              onClick={() => onStartTest('cpct', 'english', 900)}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm flex items-center space-x-1.5"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Launch 15m English Test</span>
            </button>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 text-xs text-blue-900 space-y-2">
            <h4 className="font-bold text-blue-800 text-sm">English Test Success Strategy for CPCT</h4>
            <p className="leading-relaxed">
              In the 15-minute English typing session, candidates must type approximately 450 words (2,250 characters) to reach 30 WPM. The test passage contains capital letters, commas, and periods. To ensure a passing score, prioritize typing rhythm over fast bursts.
            </p>
          </div>
        </div>
      )}

      {/* TAB 4: PRACTICE PASSAGES */}
      {selectedSubTab === 'practice' && (
        <div className="space-y-4">
          <h3 className="font-bold text-slate-900 text-lg">CPCT Pattern Passages</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cpctPassages.map((pass) => (
              <div
                key={pass.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-2 py-0.5 rounded font-bold bg-slate-100 text-slate-700 uppercase">
                      {pass.language}
                    </span>
                    <span className="text-slate-400">{pass.wordCount} words</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm mt-2">{pass.title}</h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-3">{pass.content}</p>
                </div>
                <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => onStartTest('cpct', pass.language, 900, hindiLayout)}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center space-x-1"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Practice Passage</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: MOCK TEST */}
      {selectedSubTab === 'mock' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center max-w-2xl mx-auto space-y-6">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <Clock className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-slate-900">Full Official CPCT Mock Simulator</h3>
            <p className="text-xs text-slate-500">
              Includes full 15-minute timing, strict error scoring, and official scorecard evaluation.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            <button
              type="button"
              onClick={() => onStartTest('cpct', 'hindi', 900, hindiLayout)}
              className="p-4 rounded-xl border border-amber-300 bg-amber-50/50 hover:bg-amber-100/50 text-amber-900 font-bold text-xs space-y-1"
            >
              <div className="text-lg font-black">15m Hindi</div>
              <div className="text-[10px] text-amber-700">Target: 20 Net WPM</div>
            </button>
            <button
              type="button"
              onClick={() => onStartTest('cpct', 'english', 900)}
              className="p-4 rounded-xl border border-blue-300 bg-blue-50/50 hover:bg-blue-100/50 text-blue-900 font-bold text-xs space-y-1"
            >
              <div className="text-lg font-black">15m English</div>
              <div className="text-[10px] text-blue-700">Target: 30 Net WPM</div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

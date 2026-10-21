import React, { useState } from 'react';
import {
  FingerKey,
  FINGER_DETAILS,
  QWERTY_FINGER_MAP,
  KeyFingerMapping
} from '../data/touchTypingData';
import { HindiKeyboardLayout } from '../types';
import { Hand, Sparkles, HelpCircle, Check, Info } from 'lucide-react';

interface InteractiveHandGuideProps {
  highlightKey?: string;
  selectedFinger?: FingerKey | null;
  onSelectFinger?: (finger: FingerKey | null) => void;
  language?: 'english' | 'hindi';
  hindiLayout?: HindiKeyboardLayout;
}

export const InteractiveHandGuide: React.FC<InteractiveHandGuideProps> = ({
  highlightKey,
  selectedFinger,
  onSelectFinger,
  language = 'english',
  hindiLayout = 'remington_gail'
}) => {
  const [activeKey, setActiveKey] = useState<string>(highlightKey ? highlightKey.toLowerCase() : 'f');

  const currentMapping: KeyFingerMapping | undefined =
    QWERTY_FINGER_MAP[highlightKey?.toLowerCase() || activeKey];

  const currentFingerKey: FingerKey =
    selectedFinger || (currentMapping ? currentMapping.finger : 'left-index');

  const fingerInfo = FINGER_DETAILS[currentFingerKey];

  // Colors for finger SVG
  const getFingerFill = (fingerId: FingerKey) => {
    const isCurrent = currentFingerKey === fingerId;
    switch (fingerId) {
      case 'left-pinky':
        return isCurrent ? '#f43f5e' : '#fecdd3';
      case 'left-ring':
        return isCurrent ? '#f97316' : '#ffedd5';
      case 'left-middle':
        return isCurrent ? '#f59e0b' : '#fef3c7';
      case 'left-index':
        return isCurrent ? '#3b82f6' : '#dbeafe';
      case 'thumb':
        return isCurrent ? '#10b981' : '#d1fae5';
      case 'right-index':
        return isCurrent ? '#6366f1' : '#e0e7ff';
      case 'right-middle':
        return isCurrent ? '#a855f7' : '#f3e8ff';
      case 'right-ring':
        return isCurrent ? '#d946ef' : '#fae8ff';
      case 'right-pinky':
        return isCurrent ? '#ec4899' : '#fce7f3';
      default:
        return '#cbd5e1';
    }
  };

  return (
    <div id="interactive-hand-guide" className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
            <Hand className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
              टच टाइपिंग उंगली मार्गदर्शिका (Hand & Finger Placement)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              देखें किस उंगली से कौन सा बटन दबाना होता है
            </p>
          </div>
        </div>

        {fingerInfo && (
          <div className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center space-x-2 ${fingerInfo.lightBgClass} ${fingerInfo.borderClass} ${fingerInfo.colorClass}`}>
            <span className="w-2.5 h-2.5 rounded-full bg-current animate-pulse" />
            <span>{fingerInfo.nameHindi}</span>
          </div>
        )}
      </div>

      {/* Visual Hands Layout (Left & Right Hands with SVG) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Left Hand Card */}
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-700/60 flex flex-col items-center text-center">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            बायां हाथ (Left Hand) • Home: A - S - D - F
          </div>

          <div className="relative w-60 h-44 my-2">
            <svg viewBox="0 0 240 180" className="w-full h-full drop-shadow-sm">
              {/* Palm */}
              <path
                d="M 40 130 C 40 90, 70 85, 110 85 C 150 85, 165 110, 165 150 C 165 175, 50 175, 40 130 Z"
                fill="#f1f5f9"
                stroke="#94a3b8"
                strokeWidth="2"
                className="dark:fill-slate-700 dark:stroke-slate-600"
              />
              {/* Left Pinky */}
              <g
                className="cursor-pointer transition-transform hover:scale-105"
                onClick={() => onSelectFinger ? onSelectFinger('left-pinky') : setActiveKey('a')}
              >
                <rect
                  x="40"
                  y="45"
                  width="18"
                  height="60"
                  rx="9"
                  fill={getFingerFill('left-pinky')}
                  stroke="#e11d48"
                  strokeWidth={currentFingerKey === 'left-pinky' ? '3' : '1.5'}
                />
                <text x="49" y="80" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#881337">
                  A
                </text>
                <text x="49" y="38" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#e11d48">
                  Pinky
                </text>
              </g>

              {/* Left Ring */}
              <g
                className="cursor-pointer transition-transform hover:scale-105"
                onClick={() => onSelectFinger ? onSelectFinger('left-ring') : setActiveKey('s')}
              >
                <rect
                  x="66"
                  y="28"
                  width="20"
                  height="75"
                  rx="10"
                  fill={getFingerFill('left-ring')}
                  stroke="#ea580c"
                  strokeWidth={currentFingerKey === 'left-ring' ? '3' : '1.5'}
                />
                <text x="76" y="70" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#7c2d12">
                  S
                </text>
                <text x="76" y="20" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#ea580c">
                  Ring
                </text>
              </g>

              {/* Left Middle */}
              <g
                className="cursor-pointer transition-transform hover:scale-105"
                onClick={() => onSelectFinger ? onSelectFinger('left-middle') : setActiveKey('d')}
              >
                <rect
                  x="94"
                  y="18"
                  width="20"
                  height="85"
                  rx="10"
                  fill={getFingerFill('left-middle')}
                  stroke="#d97706"
                  strokeWidth={currentFingerKey === 'left-middle' ? '3' : '1.5'}
                />
                <text x="104" y="65" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#78350f">
                  D
                </text>
                <text x="104" y="12" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#d97706">
                  Middle
                </text>
              </g>

              {/* Left Index */}
              <g
                className="cursor-pointer transition-transform hover:scale-105"
                onClick={() => onSelectFinger ? onSelectFinger('left-index') : setActiveKey('f')}
              >
                <rect
                  x="122"
                  y="28"
                  width="20"
                  height="75"
                  rx="10"
                  fill={getFingerFill('left-index')}
                  stroke="#2563eb"
                  strokeWidth={currentFingerKey === 'left-index' ? '3' : '1.5'}
                />
                <text x="132" y="70" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#1e3a8a">
                  F/G
                </text>
                <text x="132" y="20" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#2563eb">
                  Index
                </text>
              </g>

              {/* Left Thumb */}
              <g
                className="cursor-pointer transition-transform hover:scale-105"
                onClick={() => onSelectFinger ? onSelectFinger('thumb') : setActiveKey(' ')}
              >
                <path
                  d="M 145 125 C 165 110, 185 115, 195 130 C 200 140, 185 155, 165 145 Z"
                  fill={getFingerFill('thumb')}
                  stroke="#059669"
                  strokeWidth={currentFingerKey === 'thumb' ? '3' : '1.5'}
                />
                <text x="180" y="138" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#064e3b">
                  Space
                </text>
              </g>
            </svg>
          </div>

          <div className="flex flex-wrap justify-center gap-1.5 mt-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300">
              Pinky: Q, A, Z
            </span>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300">
              Ring: W, S, X
            </span>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
              Middle: E, D, C
            </span>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300">
              Index: R, T, F, G, V, B
            </span>
          </div>
        </div>

        {/* Right Hand Card */}
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-700/60 flex flex-col items-center text-center">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            दायां हाथ (Right Hand) • Home: J - K - L - ;
          </div>

          <div className="relative w-60 h-44 my-2">
            <svg viewBox="0 0 240 180" className="w-full h-full drop-shadow-sm">
              {/* Palm */}
              <path
                d="M 75 150 C 75 110, 90 85, 130 85 C 170 85, 200 90, 200 130 C 190 175, 75 175, 75 150 Z"
                fill="#f1f5f9"
                stroke="#94a3b8"
                strokeWidth="2"
                className="dark:fill-slate-700 dark:stroke-slate-600"
              />

              {/* Right Thumb (Spacebar) */}
              <g
                className="cursor-pointer transition-transform hover:scale-105"
                onClick={() => onSelectFinger ? onSelectFinger('thumb') : setActiveKey(' ')}
              >
                <path
                  d="M 95 125 C 75 110, 55 115, 45 130 C 40 140, 55 155, 75 145 Z"
                  fill={getFingerFill('thumb')}
                  stroke="#059669"
                  strokeWidth={currentFingerKey === 'thumb' ? '3' : '1.5'}
                />
                <text x="60" y="138" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#064e3b">
                  Space
                </text>
              </g>

              {/* Right Index */}
              <g
                className="cursor-pointer transition-transform hover:scale-105"
                onClick={() => onSelectFinger ? onSelectFinger('right-index') : setActiveKey('j')}
              >
                <rect
                  x="98"
                  y="28"
                  width="20"
                  height="75"
                  rx="10"
                  fill={getFingerFill('right-index')}
                  stroke="#4f46e5"
                  strokeWidth={currentFingerKey === 'right-index' ? '3' : '1.5'}
                />
                <text x="108" y="70" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#1e1b4b">
                  H/J
                </text>
                <text x="108" y="20" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#4f46e5">
                  Index
                </text>
              </g>

              {/* Right Middle */}
              <g
                className="cursor-pointer transition-transform hover:scale-105"
                onClick={() => onSelectFinger ? onSelectFinger('right-middle') : setActiveKey('k')}
              >
                <rect
                  x="126"
                  y="18"
                  width="20"
                  height="85"
                  rx="10"
                  fill={getFingerFill('right-middle')}
                  stroke="#9333ea"
                  strokeWidth={currentFingerKey === 'right-middle' ? '3' : '1.5'}
                />
                <text x="136" y="65" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#3b0764">
                  K
                </text>
                <text x="136" y="12" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#9333ea">
                  Middle
                </text>
              </g>

              {/* Right Ring */}
              <g
                className="cursor-pointer transition-transform hover:scale-105"
                onClick={() => onSelectFinger ? onSelectFinger('right-ring') : setActiveKey('l')}
              >
                <rect
                  x="154"
                  y="28"
                  width="20"
                  height="75"
                  rx="10"
                  fill={getFingerFill('right-ring')}
                  stroke="#c026d3"
                  strokeWidth={currentFingerKey === 'right-ring' ? '3' : '1.5'}
                />
                <text x="164" y="70" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#4a044e">
                  L
                </text>
                <text x="164" y="20" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#c026d3">
                  Ring
                </text>
              </g>

              {/* Right Pinky */}
              <g
                className="cursor-pointer transition-transform hover:scale-105"
                onClick={() => onSelectFinger ? onSelectFinger('right-pinky') : setActiveKey(';')}
              >
                <rect
                  x="182"
                  y="45"
                  width="18"
                  height="60"
                  rx="9"
                  fill={getFingerFill('right-pinky')}
                  stroke="#db2777"
                  strokeWidth={currentFingerKey === 'right-pinky' ? '3' : '1.5'}
                />
                <text x="191" y="80" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#831843">
                  ;
                </text>
                <text x="191" y="38" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#db2777">
                  Pinky
                </text>
              </g>
            </svg>
          </div>

          <div className="flex flex-wrap justify-center gap-1.5 mt-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300">
              Index: Y, U, H, J, N, M
            </span>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300">
              Middle: I, K, ,
            </span>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-950/60 dark:text-fuchsia-300">
              Ring: O, L, .
            </span>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-pink-100 text-pink-800 dark:bg-pink-950/60 dark:text-pink-300">
              Pinky: P, ;, ', Enter, /
            </span>
          </div>
        </div>
      </div>

      {/* Selected Finger Details Card */}
      {fingerInfo && (
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 space-y-2">
          <div className="flex items-center space-x-2">
            <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
              {fingerInfo.nameHindi} के लिए असाइन किए गए बटन:
            </h4>
          </div>

          {currentMapping && (
            <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 space-y-1">
              <p>
                <strong>वर्तमान बटन: </strong>
                <span className="font-mono font-bold px-2 py-0.5 rounded bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 uppercase">
                  {currentMapping.englishChar}
                </span>
                {language === 'hindi' && (
                  <span className="ml-2">
                    (हिंदी {hindiLayout === 'remington_gail' ? 'Remington' : 'InScript'}:{' '}
                    <strong className="text-amber-600 dark:text-amber-400">
                      {hindiLayout === 'remington_gail'
                        ? currentMapping.hindiRemingtonNormal || currentMapping.englishChar
                        : currentMapping.hindiInscriptNormal || currentMapping.englishChar}
                    </strong>
                    )
                  </span>
                )}
              </p>
              <p className="text-slate-600 dark:text-slate-400">
                <strong>उंगली का नियम: </strong> {currentMapping.tipHindi}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

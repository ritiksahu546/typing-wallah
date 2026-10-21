import React, { useMemo } from 'react';
import { FingerKey, QWERTY_FINGER_MAP, FINGER_DETAILS } from '../data/touchTypingData';
import { Check, Hand } from 'lucide-react';

interface TouchTypingVisualStageProps {
  currentKey: string;
  sequence: string[];
  currentIndex: number;
  mode?: 'introduction' | 'practice' | 'test';
  mistakeTrigger?: boolean;
}

// Finger coordination helper
export const getFingerForKey = (char: string): { key: FingerKey; name: string; hand: 'left' | 'right'; tip: string } => {
  const lower = char.toLowerCase();
  const mapping = QWERTY_FINGER_MAP[lower];
  if (!mapping) {
    if (char === ' ') {
      return {
        key: 'thumb',
        name: 'Right Thumb (दायां अंगूठा)',
        hand: 'right',
        tip: 'Spacebar is always struck with your dominant thumb.'
      };
    }
    return {
      key: 'left-index',
      name: 'Left Index Finger',
      hand: 'left',
      tip: 'Strike with proper hand position.'
    };
  }

  const isLeft = mapping.hand === 'left';
  return {
    key: mapping.finger,
    name: mapping.fingerHindi,
    hand: isLeft ? 'left' : 'right',
    tip: mapping.tipHindi
  };
};

export const TouchTypingVisualStage: React.FC<TouchTypingVisualStageProps> = ({
  currentKey,
  sequence,
  currentIndex,
  mode = 'practice',
  mistakeTrigger = false
}) => {
  const activeChar = currentKey || (sequence && sequence[currentIndex]) || ' ';
  const activeCharLower = activeChar.toLowerCase();
  const fingerInfo = useMemo(() => getFingerForKey(activeChar), [activeChar]);

  // Keyboard Rows layout definition
  const KEYBOARD_ROWS = [
    [
      { label: '`', char: '`', code: 'Backquote', width: 'w-8 sm:w-10' },
      { label: '1', char: '1', code: 'Digit1', width: 'w-8 sm:w-10' },
      { label: '2', char: '2', code: 'Digit2', width: 'w-8 sm:w-10' },
      { label: '3', char: '3', code: 'Digit3', width: 'w-8 sm:w-10' },
      { label: '4', char: '4', code: 'Digit4', width: 'w-8 sm:w-10' },
      { label: '5', char: '5', code: 'Digit5', width: 'w-8 sm:w-10' },
      { label: '6', char: '6', code: 'Digit6', width: 'w-8 sm:w-10' },
      { label: '7', char: '7', code: 'Digit7', width: 'w-8 sm:w-10' },
      { label: '8', char: '8', code: 'Digit8', width: 'w-8 sm:w-10' },
      { label: '9', char: '9', code: 'Digit9', width: 'w-8 sm:w-10' },
      { label: '0', char: '0', code: 'Digit0', width: 'w-8 sm:w-10' },
      { label: '-', char: '-', code: 'Minus', width: 'w-8 sm:w-10' },
      { label: '=', char: '=', code: 'Equal', width: 'w-8 sm:w-10' },
      { label: 'Backspace', char: 'Backspace', code: 'Backspace', width: 'w-16 sm:w-20', isSpecial: true }
    ],
    [
      { label: 'Tab', char: 'Tab', code: 'Tab', width: 'w-12 sm:w-14', isSpecial: true },
      { label: 'Q', char: 'q', code: 'KeyQ', width: 'w-8 sm:w-10' },
      { label: 'W', char: 'w', code: 'KeyW', width: 'w-8 sm:w-10' },
      { label: 'E', char: 'e', code: 'KeyE', width: 'w-8 sm:w-10' },
      { label: 'R', char: 'r', code: 'KeyR', width: 'w-8 sm:w-10' },
      { label: 'T', char: 't', code: 'KeyT', width: 'w-8 sm:w-10' },
      { label: 'Y', char: 'y', code: 'KeyY', width: 'w-8 sm:w-10' },
      { label: 'U', char: 'u', code: 'KeyU', width: 'w-8 sm:w-10' },
      { label: 'I', char: 'i', code: 'KeyI', width: 'w-8 sm:w-10' },
      { label: 'O', char: 'o', code: 'KeyO', width: 'w-8 sm:w-10' },
      { label: 'P', char: 'p', code: 'KeyP', width: 'w-8 sm:w-10' },
      { label: '[', char: '[', code: 'BracketLeft', width: 'w-8 sm:w-10' },
      { label: ']', char: ']', code: 'BracketRight', width: 'w-8 sm:w-10' },
      { label: '\\', char: '\\', code: 'Backslash', width: 'w-10 sm:w-14' }
    ],
    [
      { label: 'Caps', char: 'CapsLock', code: 'CapsLock', width: 'w-14 sm:w-16', isSpecial: true },
      { label: 'A', char: 'a', code: 'KeyA', width: 'w-8 sm:w-10', home: true },
      { label: 'S', char: 's', code: 'KeyS', width: 'w-8 sm:w-10', home: true },
      { label: 'D', char: 'd', code: 'KeyD', width: 'w-8 sm:w-10', home: true },
      { label: 'F', char: 'f', code: 'KeyF', width: 'w-8 sm:w-10', home: true, hasBump: true },
      { label: 'G', char: 'g', code: 'KeyG', width: 'w-8 sm:w-10' },
      { label: 'H', char: 'h', code: 'KeyH', width: 'w-8 sm:w-10' },
      { label: 'J', char: 'j', code: 'KeyJ', width: 'w-8 sm:w-10', home: true, hasBump: true },
      { label: 'K', char: 'k', code: 'KeyK', width: 'w-8 sm:w-10', home: true },
      { label: 'L', char: 'l', code: 'KeyL', width: 'w-8 sm:w-10', home: true },
      { label: ';', char: ';', code: 'Semicolon', width: 'w-8 sm:w-10', home: true },
      { label: "'", char: "'", code: 'Quote', width: 'w-8 sm:w-10' },
      { label: 'Enter', char: 'Enter', code: 'Enter', width: 'w-16 sm:w-20', isSpecial: true }
    ],
    [
      { label: 'Shift', char: 'ShiftLeft', code: 'ShiftLeft', width: 'w-16 sm:w-20', isSpecial: true },
      { label: 'Z', char: 'z', code: 'KeyZ', width: 'w-8 sm:w-10' },
      { label: 'X', char: 'x', code: 'KeyX', width: 'w-8 sm:w-10' },
      { label: 'C', char: 'c', code: 'KeyC', width: 'w-8 sm:w-10' },
      { label: 'V', char: 'v', code: 'KeyV', width: 'w-8 sm:w-10' },
      { label: 'B', char: 'b', code: 'KeyB', width: 'w-8 sm:w-10' },
      { label: 'N', char: 'n', code: 'KeyN', width: 'w-8 sm:w-10' },
      { label: 'M', char: 'm', code: 'KeyM', width: 'w-8 sm:w-10' },
      { label: ',', char: ',', code: 'Comma', width: 'w-8 sm:w-10' },
      { label: '.', char: '.', code: 'Period', width: 'w-8 sm:w-10' },
      { label: '/', char: '/', code: 'Slash', width: 'w-8 sm:w-10' },
      { label: 'Shift', char: 'ShiftRight', code: 'ShiftRight', width: 'w-18 sm:w-24', isSpecial: true }
    ],
    [
      { label: 'Ctrl', char: 'ControlLeft', code: 'ControlLeft', width: 'w-10 sm:w-12', isSpecial: true },
      { label: 'Alt', char: 'AltLeft', code: 'AltLeft', width: 'w-10 sm:w-12', isSpecial: true },
      { label: 'Space', char: ' ', code: 'Space', width: 'w-48 sm:w-72', isSpace: true },
      { label: 'Alt', char: 'AltRight', code: 'AltRight', width: 'w-10 sm:w-12', isSpecial: true },
      { label: 'Ctrl', char: 'ControlRight', code: 'ControlRight', width: 'w-10 sm:w-12', isSpecial: true }
    ]
  ];

  // Windowed sequence for clean display (show up to 10 items)
  const windowStart = Math.max(0, currentIndex - 4);
  const visibleItems = sequence.slice(windowStart, windowStart + 10);

  return (
    <div className="w-full bg-[#121316] text-white rounded-3xl border border-[#232630] shadow-2xl p-4 sm:p-6 lg:p-8 space-y-6 select-none overflow-hidden relative">
      {/* Background subtle radial ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* 1. TOP KEY-SEQUENCE BOXES (Matching User's Reference UI) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span className="font-semibold uppercase tracking-wider text-[11px] text-blue-400">
            {mode === 'introduction' ? 'Key Sequence' : 'Exercise Progress'}
          </span>
          <span className="font-mono">
            Key {Math.min(currentIndex + 1, sequence.length)} of {sequence.length}
          </span>
        </div>

        {/* Horizontal Sequence Bar */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 py-3 overflow-x-auto">
          {visibleItems.map((item, relIdx) => {
            const actualIdx = windowStart + relIdx;
            const isDone = actualIdx < currentIndex;
            const isCurrent = actualIdx === currentIndex;
            const isFuture = actualIdx > currentIndex;

            return (
              <div key={actualIdx} className="flex flex-col items-center">
                {/* Status Indicator Icon floating above */}
                <div className="h-5 flex items-center justify-center">
                  {isDone && (
                    <div className="w-4 h-4 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center animate-in zoom-in-50">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </div>

                {/* Key Box */}
                <div
                  className={`w-10 h-11 sm:w-12 sm:h-14 rounded-xl flex items-center justify-center font-mono text-lg sm:text-xl font-bold transition-all relative ${
                    isDone
                      ? 'bg-emerald-950/40 border border-emerald-500/60 text-emerald-400'
                      : isCurrent
                      ? `bg-blue-600 text-white shadow-lg shadow-blue-500/40 scale-105 ring-2 ring-blue-400 ${
                          mistakeTrigger ? 'bg-rose-600 ring-rose-400 animate-shake' : ''
                        }`
                      : 'bg-[#1a1c23] border border-[#2a2d38] text-slate-400'
                  }`}
                >
                  <span>{item === ' ' ? '␣' : item}</span>
                </div>

                {/* Underline Indicator Bar on Current Key */}
                <div className="h-2 flex items-center justify-center mt-1">
                  {isCurrent && (
                    <div className="w-8 h-1 bg-blue-400 rounded-full shadow-sm shadow-blue-400 animate-pulse" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. DYNAMIC INSTRUCTION BANNER */}
      <div className="text-center space-y-1.5 pt-1">
        <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-[11px] font-bold uppercase tracking-wider">
          <Hand className="w-3 h-3" />
          <span>Touch Typing Instruction</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
          Type the{' '}
          <span className="inline-block px-2.5 py-0.5 bg-blue-600/90 text-white rounded-lg border border-blue-400 shadow-xs font-mono uppercase">
            {activeChar === ' ' ? 'Spacebar' : activeChar}
          </span>{' '}
          key using your <span className="text-blue-400 underline decoration-blue-500/50 underline-offset-4">{fingerInfo.name}</span>.
        </h3>

        <p className="text-xs text-slate-400 max-w-lg mx-auto">
          {fingerInfo.tip}
        </p>
      </div>

      {/* 3. KEYBOARD CHASSIS WITH TRANSLUCENT HANDS OVERLAY */}
      <div className="relative mx-auto max-w-4xl bg-[#16181f] rounded-2xl p-3 sm:p-5 border border-[#262a36] shadow-inner overflow-hidden">
        {/* The Keyboard Matrix */}
        <div className="space-y-1.5 sm:space-y-2 relative z-10">
          {KEYBOARD_ROWS.map((row, rIdx) => (
            <div key={rIdx} className="flex justify-center gap-1 sm:gap-1.5">
              {row.map((k) => {
                const isKeyActive =
                  k.char.toLowerCase() === activeCharLower ||
                  (k.isSpace && activeChar === ' ') ||
                  (k.char === 'ShiftLeft' && activeChar.length === 1 && activeChar === activeChar.toUpperCase() && activeChar !== activeChar.toLowerCase() && 'yuiophjklnm'.includes(activeCharLower)) ||
                  (k.char === 'ShiftRight' && activeChar.length === 1 && activeChar === activeChar.toUpperCase() && activeChar !== activeChar.toLowerCase() && 'qwertasdfgzxcvb'.includes(activeCharLower));

                return (
                  <div
                    key={k.code}
                    className={`h-9 sm:h-12 ${k.width} rounded-lg sm:rounded-xl flex flex-col items-center justify-center font-mono font-bold text-xs sm:text-sm transition-all duration-150 relative ${
                      isKeyActive
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/60 ring-2 ring-blue-300 scale-105 z-20 animate-pulse'
                        : k.isSpecial
                        ? 'bg-[#21242d] text-slate-400 border border-[#2c303c]'
                        : 'bg-[#f8fafc] text-slate-900 border border-slate-300 shadow-sm hover:border-blue-300'
                    }`}
                  >
                    <span>{k.label}</span>

                    {/* Raised tactile bump for F and J keys */}
                    {k.hasBump && (
                      <div className="absolute bottom-1 w-3 sm:w-4 h-0.5 bg-slate-400/90 rounded-full" />
                    )}

                    {/* Active key glow ring wave */}
                    {isKeyActive && (
                      <span className="absolute -inset-1 rounded-xl bg-blue-500/30 animate-ping pointer-events-none" />
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* 4. TRANSLUCENT HANDS OVERLAY (Ergonomic Home-Row Resting Position) */}
        <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-between px-6 sm:px-16 opacity-75">
          {/* Left Hand SVG Silhouette */}
          <svg
            className="w-48 sm:w-72 h-44 sm:h-64 transition-all duration-300 transform -translate-y-2 sm:-translate-y-4"
            viewBox="0 0 200 180"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="handGradLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.10" />
              </linearGradient>
              <filter id="glowLeft" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Hand Palm & Wrist Contour */}
            <path
              d="M 40 170 C 40 130, 45 105, 55 95 C 65 85, 95 85, 120 95 C 135 105, 140 130, 140 170 Z"
              fill="url(#handGradLeft)"
              stroke="#ffffff"
              strokeOpacity="0.3"
              strokeWidth="1.5"
            />

            {/* Left Pinky (Touches A row) */}
            <path
              d="M 45 100 C 40 75, 40 50, 48 40 C 53 35, 58 40, 56 60 L 58 95"
              fill={fingerInfo.key === 'left_pinky' ? '#3b82f6' : 'url(#handGradLeft)'}
              fillOpacity={fingerInfo.key === 'left_pinky' ? '0.85' : '1'}
              stroke={fingerInfo.key === 'left_pinky' ? '#60a5fa' : '#ffffff'}
              strokeOpacity={fingerInfo.key === 'left_pinky' ? '1' : '0.4'}
              strokeWidth={fingerInfo.key === 'left_pinky' ? '2.5' : '1.5'}
              filter={fingerInfo.key === 'left_pinky' ? 'url(#glowLeft)' : undefined}
            />

            {/* Left Ring (Touches S row) */}
            <path
              d="M 62 90 C 58 60, 60 30, 70 20 C 76 15, 82 20, 80 45 L 78 88"
              fill={fingerInfo.key === 'left_ring' ? '#3b82f6' : 'url(#handGradLeft)'}
              fillOpacity={fingerInfo.key === 'left_ring' ? '0.85' : '1'}
              stroke={fingerInfo.key === 'left_ring' ? '#60a5fa' : '#ffffff'}
              strokeOpacity={fingerInfo.key === 'left_ring' ? '1' : '0.4'}
              strokeWidth={fingerInfo.key === 'left_ring' ? '2.5' : '1.5'}
              filter={fingerInfo.key === 'left_ring' ? 'url(#glowLeft)' : undefined}
            />

            {/* Left Middle (Touches D row) */}
            <path
              d="M 82 85 C 80 50, 82 20, 94 10 C 100 5, 106 10, 104 38 L 100 85"
              fill={fingerInfo.key === 'left_middle' ? '#3b82f6' : 'url(#handGradLeft)'}
              fillOpacity={fingerInfo.key === 'left_middle' ? '0.85' : '1'}
              stroke={fingerInfo.key === 'left_middle' ? '#60a5fa' : '#ffffff'}
              strokeOpacity={fingerInfo.key === 'left_middle' ? '1' : '0.4'}
              strokeWidth={fingerInfo.key === 'left_middle' ? '2.5' : '1.5'}
              filter={fingerInfo.key === 'left_middle' ? 'url(#glowLeft)' : undefined}
            />

            {/* Left Index (Touches F row & reaches G/R/V) */}
            <path
              d="M 104 88 C 105 55, 110 25, 122 18 C 128 14, 134 18, 130 45 L 122 92"
              fill={fingerInfo.key === 'left_index' ? '#3b82f6' : 'url(#handGradLeft)'}
              fillOpacity={fingerInfo.key === 'left_index' ? '0.85' : '1'}
              stroke={fingerInfo.key === 'left_index' ? '#60a5fa' : '#ffffff'}
              strokeOpacity={fingerInfo.key === 'left_index' ? '1' : '0.4'}
              strokeWidth={fingerInfo.key === 'left_index' ? '2.5' : '1.5'}
              filter={fingerInfo.key === 'left_index' ? 'url(#glowLeft)' : undefined}
            />

            {/* Left Thumb (Resting toward Spacebar) */}
            <path
              d="M 125 110 C 145 105, 165 115, 175 130 C 178 136, 172 142, 160 140 L 132 130"
              fill={fingerInfo.key === 'left_thumb' ? '#3b82f6' : 'url(#handGradLeft)'}
              fillOpacity={fingerInfo.key === 'left_thumb' ? '0.85' : '1'}
              stroke={fingerInfo.key === 'left_thumb' ? '#60a5fa' : '#ffffff'}
              strokeOpacity={fingerInfo.key === 'left_thumb' ? '1' : '0.4'}
              strokeWidth={fingerInfo.key === 'left_thumb' ? '2.5' : '1.5'}
              filter={fingerInfo.key === 'left_thumb' ? 'url(#glowLeft)' : undefined}
            />

            {/* Glowing Active Guide Target on Active Finger */}
            {fingerInfo.hand === 'left' && (
              <g className="animate-pulse">
                {fingerInfo.key === 'left_index' && (
                  <circle cx="122" cy="18" r="7" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" />
                )}
                {fingerInfo.key === 'left_middle' && (
                  <circle cx="94" cy="10" r="7" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" />
                )}
                {fingerInfo.key === 'left_ring' && (
                  <circle cx="70" cy="20" r="7" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" />
                )}
                {fingerInfo.key === 'left_pinky' && (
                  <circle cx="48" cy="40" r="7" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" />
                )}
              </g>
            )}
          </svg>

          {/* Right Hand SVG Silhouette */}
          <svg
            className="w-48 sm:w-72 h-44 sm:h-64 transition-all duration-300 transform -translate-y-2 sm:-translate-y-4"
            viewBox="0 0 200 180"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="handGradRight" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.10" />
              </linearGradient>
              <filter id="glowRight" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Hand Palm & Wrist Contour */}
            <path
              d="M 160 170 C 160 130, 155 105, 145 95 C 135 85, 105 85, 80 95 C 65 105, 60 130, 60 170 Z"
              fill="url(#handGradRight)"
              stroke="#ffffff"
              strokeOpacity="0.3"
              strokeWidth="1.5"
            />

            {/* Right Thumb (Spacebar striker) */}
            <path
              d="M 75 110 C 55 105, 35 115, 25 130 C 22 136, 28 142, 40 140 L 68 130"
              fill={fingerInfo.key === 'right_thumb' ? '#3b82f6' : 'url(#handGradRight)'}
              fillOpacity={fingerInfo.key === 'right_thumb' ? '0.85' : '1'}
              stroke={fingerInfo.key === 'right_thumb' ? '#60a5fa' : '#ffffff'}
              strokeOpacity={fingerInfo.key === 'right_thumb' ? '1' : '0.4'}
              strokeWidth={fingerInfo.key === 'right_thumb' ? '2.5' : '1.5'}
              filter={fingerInfo.key === 'right_thumb' ? 'url(#glowRight)' : undefined}
            />

            {/* Right Index (Touches J row & reaches H/U/M) */}
            <path
              d="M 96 88 C 95 55, 90 25, 78 18 C 72 14, 66 18, 70 45 L 78 92"
              fill={fingerInfo.key === 'right_index' ? '#3b82f6' : 'url(#handGradRight)'}
              fillOpacity={fingerInfo.key === 'right_index' ? '0.85' : '1'}
              stroke={fingerInfo.key === 'right_index' ? '#60a5fa' : '#ffffff'}
              strokeOpacity={fingerInfo.key === 'right_index' ? '1' : '0.4'}
              strokeWidth={fingerInfo.key === 'right_index' ? '2.5' : '1.5'}
              filter={fingerInfo.key === 'right_index' ? 'url(#glowRight)' : undefined}
            />

            {/* Right Middle (Touches K row & reaches I/, ) */}
            <path
              d="M 118 85 C 120 50, 118 20, 106 10 C 100 5, 94 10, 96 38 L 100 85"
              fill={fingerInfo.key === 'right_middle' ? '#3b82f6' : 'url(#handGradRight)'}
              fillOpacity={fingerInfo.key === 'right_middle' ? '0.85' : '1'}
              stroke={fingerInfo.key === 'right_middle' ? '#60a5fa' : '#ffffff'}
              strokeOpacity={fingerInfo.key === 'right_middle' ? '1' : '0.4'}
              strokeWidth={fingerInfo.key === 'right_middle' ? '2.5' : '1.5'}
              filter={fingerInfo.key === 'right_middle' ? 'url(#glowRight)' : undefined}
            />

            {/* Right Ring (Touches L row & reaches O/. ) */}
            <path
              d="M 138 90 C 142 60, 140 30, 130 20 C 124 15, 118 20, 120 45 L 122 88"
              fill={fingerInfo.key === 'right_ring' ? '#3b82f6' : 'url(#handGradRight)'}
              fillOpacity={fingerInfo.key === 'right_ring' ? '0.85' : '1'}
              stroke={fingerInfo.key === 'right_ring' ? '#60a5fa' : '#ffffff'}
              strokeOpacity={fingerInfo.key === 'right_ring' ? '1' : '0.4'}
              strokeWidth={fingerInfo.key === 'right_ring' ? '2.5' : '1.5'}
              filter={fingerInfo.key === 'right_ring' ? 'url(#glowRight)' : undefined}
            />

            {/* Right Pinky (Touches ; row & reaches P/Enter/Shift) */}
            <path
              d="M 155 100 C 160 75, 160 50, 152 40 C 147 35, 142 40, 144 60 L 142 95"
              fill={fingerInfo.key === 'right_pinky' ? '#3b82f6' : 'url(#handGradRight)'}
              fillOpacity={fingerInfo.key === 'right_pinky' ? '0.85' : '1'}
              stroke={fingerInfo.key === 'right_pinky' ? '#60a5fa' : '#ffffff'}
              strokeOpacity={fingerInfo.key === 'right_pinky' ? '1' : '0.4'}
              strokeWidth={fingerInfo.key === 'right_pinky' ? '2.5' : '1.5'}
              filter={fingerInfo.key === 'right_pinky' ? 'url(#glowRight)' : undefined}
            />

            {/* Glowing Active Guide Target on Active Finger */}
            {fingerInfo.hand === 'right' && (
              <g className="animate-pulse">
                {fingerInfo.key === 'right_index' && (
                  <circle cx="78" cy="18" r="7" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" />
                )}
                {fingerInfo.key === 'right_middle' && (
                  <circle cx="106" cy="10" r="7" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" />
                )}
                {fingerInfo.key === 'right_ring' && (
                  <circle cx="130" cy="20" r="7" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" />
                )}
                {fingerInfo.key === 'right_pinky' && (
                  <circle cx="152" cy="40" r="7" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" />
                )}
                {fingerInfo.key === 'right_thumb' && (
                  <circle cx="35" cy="125" r="7" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" />
                )}
              </g>
            )}
          </svg>
        </div>
      </div>
    </div>
  );
};

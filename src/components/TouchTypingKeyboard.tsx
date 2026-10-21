import React, { useState } from 'react';
import {
  FingerKey,
  FINGER_DETAILS,
  QWERTY_FINGER_MAP,
  KeyFingerMapping
} from '../data/touchTypingData';
import { HindiKeyboardLayout } from '../types';
import { Keyboard, HelpCircle } from 'lucide-react';

interface Props {
  layout: 'standard' | HindiKeyboardLayout;
  activeKeyChar?: string;
  onKeyClick?: (char: string) => void;
  showFingersColor?: boolean;
}

export const TouchTypingKeyboard: React.FC<Props> = ({
  layout,
  activeKeyChar,
  onKeyClick,
  showFingersColor = true
}) => {
  const [showShift, setShowShift] = useState(false);

  // QWERTY keyboard row definitions
  const row1 = [
    { key: '`', shift: '~' },
    { key: '1', shift: '!' },
    { key: '2', shift: '@' },
    { key: '3', shift: '#' },
    { key: '4', shift: '$' },
    { key: '5', shift: '%' },
    { key: '6', shift: '^' },
    { key: '7', shift: '&' },
    { key: '8', shift: '*' },
    { key: '9', shift: '(' },
    { key: '0', shift: ')' },
    { key: '-', shift: '_' },
    { key: '=', shift: '+' },
    { key: 'Backspace', width: 'w-14 sm:w-16', isSpecial: true }
  ];

  const row2 = [
    { key: 'Tab', width: 'w-12 sm:w-14', isSpecial: true },
    { key: 'q', shift: 'Q' },
    { key: 'w', shift: 'W' },
    { key: 'e', shift: 'E' },
    { key: 'r', shift: 'R' },
    { key: 't', shift: 'T' },
    { key: 'y', shift: 'Y' },
    { key: 'u', shift: 'U' },
    { key: 'i', shift: 'I' },
    { key: 'o', shift: 'O' },
    { key: 'p', shift: 'P' },
    { key: '[', shift: '{' },
    { key: ']', shift: '}' },
    { key: '\\', shift: '|' }
  ];

  const row3 = [
    { key: 'Caps', width: 'w-14 sm:w-16', isSpecial: true },
    { key: 'a', shift: 'A', homeKey: true },
    { key: 's', shift: 'S', homeKey: true },
    { key: 'd', shift: 'D', homeKey: true },
    { key: 'f', shift: 'F', homeKey: true, bump: true },
    { key: 'g', shift: 'G' },
    { key: 'h', shift: 'H' },
    { key: 'j', shift: 'J', homeKey: true, bump: true },
    { key: 'k', shift: 'K', homeKey: true },
    { key: 'l', shift: 'L', homeKey: true },
    { key: ';', shift: ':', homeKey: true },
    { key: '\'', shift: '"' },
    { key: 'Enter', width: 'w-14 sm:w-16', isSpecial: true }
  ];

  const row4 = [
    { key: 'Shift', width: 'w-16 sm:w-20', isSpecial: true },
    { key: 'z', shift: 'Z' },
    { key: 'x', shift: 'X' },
    { key: 'c', shift: 'C' },
    { key: 'v', shift: 'V' },
    { key: 'b', shift: 'B' },
    { key: 'n', shift: 'N' },
    { key: 'm', shift: 'M' },
    { key: ',', shift: '<' },
    { key: '.', shift: '>' },
    { key: '/', shift: '?' },
    { key: 'Shift', width: 'w-16 sm:w-20', isSpecial: true }
  ];

  const row5 = [
    { key: 'Ctrl', width: 'w-12', isSpecial: true },
    { key: 'Alt', width: 'w-12', isSpecial: true },
    { key: ' ', width: 'w-56 sm:w-72', isSpace: true, label: 'Spacebar (दायां अंगूठा)' },
    { key: 'Alt', width: 'w-12', isSpecial: true },
    { key: 'Ctrl', width: 'w-12', isSpecial: true }
  ];

  const getKeyStyling = (charKey: string, isSpecial?: boolean, isSpace?: boolean) => {
    const lowerKey = charKey.toLowerCase();
    const mapping = QWERTY_FINGER_MAP[lowerKey];
    const isTarget = activeKeyChar && (activeKeyChar.toLowerCase() === lowerKey || (charKey === ' ' && activeKeyChar === ' '));

    if (isTarget) {
      return 'bg-blue-600 text-white font-black scale-110 shadow-lg ring-4 ring-blue-400 z-10 border-blue-700 animate-pulse';
    }

    if (isSpecial) {
      return 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700';
    }

    if (!showFingersColor || !mapping) {
      return 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border-slate-300 dark:border-slate-700 hover:bg-slate-50';
    }

    switch (mapping.finger) {
      case 'left-pinky':
        return 'bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 border-rose-300 dark:border-rose-800 hover:bg-rose-100';
      case 'left-ring':
        return 'bg-orange-50 dark:bg-orange-950/40 text-orange-900 dark:text-orange-200 border-orange-300 dark:border-orange-800 hover:bg-orange-100';
      case 'left-middle':
        return 'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-800 hover:bg-amber-100';
      case 'left-index':
        return 'bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 border-blue-300 dark:border-blue-800 hover:bg-blue-100';
      case 'thumb':
        return 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100';
      case 'right-index':
        return 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 border-indigo-300 dark:border-indigo-800 hover:bg-indigo-100';
      case 'right-middle':
        return 'bg-purple-50 dark:bg-purple-950/40 text-purple-900 dark:text-purple-200 border-purple-300 dark:border-purple-800 hover:bg-purple-100';
      case 'right-ring':
        return 'bg-fuchsia-50 dark:bg-fuchsia-950/40 text-fuchsia-900 dark:text-fuchsia-200 border-fuchsia-300 dark:border-fuchsia-800 hover:bg-fuchsia-100';
      case 'right-pinky':
        return 'bg-pink-50 dark:bg-pink-950/40 text-pink-900 dark:text-pink-200 border-pink-300 dark:border-pink-800 hover:bg-pink-100';
      default:
        return 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border-slate-300 dark:border-slate-700';
    }
  };

  const getHindiSublabel = (charKey: string) => {
    const lowerKey = charKey.toLowerCase();
    const mapping = QWERTY_FINGER_MAP[lowerKey];
    if (!mapping) return null;

    if (layout === 'remington_gail') {
      return showShift ? mapping.hindiRemingtonShift : mapping.hindiRemingtonNormal;
    } else if (layout === 'inscript') {
      return showShift ? mapping.hindiInscriptShift : mapping.hindiInscriptNormal;
    }
    return null;
  };

  const renderRow = (rowItems: any[], rowIdx: number) => (
    <div key={rowIdx} className="flex justify-center space-x-1 sm:space-x-1.5">
      {rowItems.map((item, idx) => {
        const isSpecial = item.isSpecial;
        const isSpace = item.isSpace;
        const mainChar = showShift && item.shift ? item.shift : item.key;
        const hindiChar = getHindiSublabel(item.key);
        const style = getKeyStyling(item.key, isSpecial, isSpace);
        const widthClass = item.width || 'w-8 sm:w-11';

        return (
          <button
            key={idx}
            type="button"
            onClick={() => onKeyClick && onKeyClick(item.key)}
            className={`h-10 sm:h-12 ${widthClass} rounded-lg border flex flex-col items-center justify-center relative select-none transition-all ${style}`}
          >
            {/* Main Key Display */}
            {isSpace ? (
              <span className="text-xs font-bold">{item.label}</span>
            ) : (
              <div className="flex flex-col items-center justify-center leading-none">
                <span className="text-xs sm:text-sm font-bold uppercase">{mainChar}</span>
                {hindiChar && (
                  <span className="text-[10px] sm:text-xs font-hindi text-amber-700 dark:text-amber-400 font-bold mt-0.5">
                    {hindiChar.split(' ')[0]}
                  </span>
                )}
              </div>
            )}

            {/* Tactile bump indicator on F and J */}
            {item.bump && (
              <span className="absolute bottom-1 w-2.5 sm:w-3.5 h-0.5 bg-slate-400 dark:bg-slate-400 rounded-full" />
            )}
          </button>
        );
      })}
    </div>
  );

  return (
    <div id="touch-typing-keyboard" className="w-full max-w-4xl mx-auto space-y-2 p-3 sm:p-4 bg-slate-100/90 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto">
      {/* Keyboard Controls Bar */}
      <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center space-x-2">
          <Keyboard className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span className="font-bold text-slate-800 dark:text-slate-200">
            {layout === 'standard' ? 'English QWERTY Layout' : layout === 'remington_gail' ? 'Hindi Remington GAIL (Mangal)' : 'Hindi InScript (Standard)'}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setShowShift(!showShift)}
          className={`px-3 py-1 rounded-lg font-bold border transition-colors ${
            showShift
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
          }`}
        >
          {showShift ? 'Shift ON (Caps/Upper)' : 'Shift OFF (Normal)'}
        </button>
      </div>

      {/* Rows */}
      <div className="space-y-1.5 min-w-[620px]">
        {renderRow(row1, 1)}
        {renderRow(row2, 2)}
        {renderRow(row3, 3)}
        {renderRow(row4, 4)}
        {renderRow(row5, 5)}
      </div>

      {/* Color Legend Bar */}
      {showFingersColor && (
        <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-[10px] sm:text-[11px] font-bold">
          <span className="flex items-center space-x-1 text-rose-700 dark:text-rose-400">
            <span className="w-2.5 h-2.5 rounded bg-rose-500" />
            <span>बायां Pinky (A)</span>
          </span>
          <span className="flex items-center space-x-1 text-orange-700 dark:text-orange-400">
            <span className="w-2.5 h-2.5 rounded bg-orange-500" />
            <span>बायां Ring (S)</span>
          </span>
          <span className="flex items-center space-x-1 text-amber-700 dark:text-amber-400">
            <span className="w-2.5 h-2.5 rounded bg-amber-500" />
            <span>बायां Middle (D)</span>
          </span>
          <span className="flex items-center space-x-1 text-blue-700 dark:text-blue-400">
            <span className="w-2.5 h-2.5 rounded bg-blue-500" />
            <span>बायां Index (F/G)</span>
          </span>
          <span className="flex items-center space-x-1 text-emerald-700 dark:text-emerald-400">
            <span className="w-2.5 h-2.5 rounded bg-emerald-500" />
            <span>Thumb (Space)</span>
          </span>
          <span className="flex items-center space-x-1 text-indigo-700 dark:text-indigo-400">
            <span className="w-2.5 h-2.5 rounded bg-indigo-500" />
            <span>दायां Index (H/J)</span>
          </span>
          <span className="flex items-center space-x-1 text-purple-700 dark:text-purple-400">
            <span className="w-2.5 h-2.5 rounded bg-purple-500" />
            <span>दायां Middle (K)</span>
          </span>
          <span className="flex items-center space-x-1 text-fuchsia-700 dark:text-fuchsia-400">
            <span className="w-2.5 h-2.5 rounded bg-fuchsia-500" />
            <span>दायां Ring (L)</span>
          </span>
          <span className="flex items-center space-x-1 text-pink-700 dark:text-pink-400">
            <span className="w-2.5 h-2.5 rounded bg-pink-500" />
            <span>दायां Pinky (;)</span>
          </span>
        </div>
      )}
    </div>
  );
};

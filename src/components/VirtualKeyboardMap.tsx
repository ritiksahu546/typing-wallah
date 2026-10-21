import React, { useState } from 'react';
import { HindiKeyboardLayout } from '../types';
import { Keyboard, HelpCircle, X } from 'lucide-react';

interface Props {
  layout: 'standard' | HindiKeyboardLayout;
  onClose?: () => void;
}

export const VirtualKeyboardMap: React.FC<Props> = ({ layout, onClose }) => {
  const [showShift, setShowShift] = useState(false);

  // Character mappings for Remington GAIL and InScript on Mangal font
  const remingtonRowsNormal = [
    ['~', '१', '२', '३', '४', '५', '६', '७', '८', '९', '०', '-', 'ृ'],
    ['Tab', 'ौ', 'ै', 'ा', 'ी', 'ू', 'ब', 'ह', 'ग', 'द', 'ज', 'ड', '़'],
    ['Caps', 'ो', 'े', '्', 'ि', 'ु', 'प', 'र', 'क', 'त', 'च', 'ट', 'Enter'],
    ['Shift', 'ं', 'ँ', 'म', 'न', 'व', 'ल', 'स', 'य', 'श', 'ष', 'Shift'],
    ['Ctrl', 'Alt', 'Spacebar', 'Alt', 'Ctrl']
  ];

  const remingtonRowsShift = [
    ['`', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+'],
    ['Tab', 'औ', 'ऐ', 'आ', 'ई', 'ऊ', 'भ', 'ङ', 'घ', 'ध', 'झ', 'ढ', '|'],
    ['Caps', 'ओ', 'ए', 'अ', 'इ', 'उ', 'फ', 'र्', 'ख', 'थ', 'छ', 'ठ', 'Enter'],
    ['Shift', 'ः', 'ऋ', 'ण', 'ञ', 'ऑ', 'ळ', 'श्र', 'ज्ञ', 'त्र', 'क्ष', 'Shift'],
    ['Ctrl', 'Alt', 'Spacebar', 'Alt', 'Ctrl']
  ];

  const inscriptRowsNormal = [
    ['`', '१', '२', '३', '४', '५', '६', '७', '८', '९', '०', '-', '='],
    ['Tab', 'ौ', 'ै', 'ा', 'ी', 'ू', 'ब', 'ह', 'ग', 'द', 'ज', 'ड', '़'],
    ['Caps', 'ो', 'े', '्', 'ि', 'ु', 'प', 'र', 'क', 'त', 'च', 'ट', 'Enter'],
    ['Shift', 'ं', 'म', 'न', 'व', 'ल', 'स', 'य', 'श', 'ष', 'Shift'],
    ['Ctrl', 'Alt', 'Spacebar', 'Alt', 'Ctrl']
  ];

  const inscriptRowsShift = [
    ['~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+'],
    ['Tab', 'औ', 'ऐ', 'आ', 'ई', 'ऊ', 'भ', 'ङ', 'घ', 'ध', 'झ', 'ढ', 'ञ'],
    ['Caps', 'ओ', 'ए', 'अ', 'इ', 'उ', 'फ', 'ऋ', 'ख', 'थ', 'छ', 'ठ', 'Enter'],
    ['Shift', 'ँ', 'ण', 'ळ', '।', '?', 'श्र', 'ज्ञ', 'त्र', 'क्ष', 'Shift'],
    ['Ctrl', 'Alt', 'Spacebar', 'Alt', 'Ctrl']
  ];

  const rows =
    layout === 'remington_gail'
      ? showShift
        ? remingtonRowsShift
        : remingtonRowsNormal
      : showShift
      ? inscriptRowsShift
      : inscriptRowsNormal;

  const layoutLabel =
    layout === 'remington_gail'
      ? 'Remington GAIL (Mangal Font)'
      : layout === 'inscript'
      ? 'InScript (Devanagari Standard)'
      : 'Standard English QWERTY';

  return (
    <div id="virtual-keyboard-map" className="w-full max-w-4xl mx-auto my-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-lg p-4 sm:p-5 overflow-hidden">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
        <div className="flex items-center space-x-2">
          <Keyboard className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
          <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm sm:text-base">
            Layout: <span className="text-blue-600 dark:text-blue-400">{layoutLabel}</span>
          </h3>
        </div>
        <div className="flex items-center space-x-2">
          <button
            id="toggle-shift-key"
            type="button"
            onClick={() => setShowShift(!showShift)}
            className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-colors ${
              showShift
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {showShift ? 'Shift (Upper)' : 'Normal (Lower)'}
          </button>
          {onClose && (
            <button
              id="close-keyboard-map"
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <div className="w-full overflow-x-auto pb-2 scrollbar-thin">
        <div className="space-y-1.5 min-w-[500px]">
          {rows.map((row, rIdx) => (
            <div key={rIdx} className="flex justify-center space-x-1 sm:space-x-1.5">
              {row.map((key, kIdx) => {
                const isSpecial = ['Tab', 'Caps', 'Enter', 'Shift', 'Ctrl', 'Alt'].includes(key);
                const isSpace = key === 'Spacebar';
                return (
                  <div
                    key={kIdx}
                    className={`flex items-center justify-center rounded border text-xs sm:text-sm font-medium transition-colors select-none ${
                      isSpace
                        ? 'w-48 sm:w-64 h-9 sm:h-10 bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                        : isSpecial
                        ? 'px-2 sm:px-3 h-9 sm:h-10 bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                        : 'w-8 sm:w-11 h-9 sm:h-10 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-hindi shadow-xs'
                    }`}
                  >
                    {key}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-2">
        <div className="flex items-center space-x-1">
          <HelpCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>Use native OS Hindi IME (InScript or Remington GAIL) for physical key input.</span>
        </div>
        <div className="text-slate-400 dark:text-slate-500">Mangal Unicode Standard | CPCT, SSC, High Court Compliant</div>
      </div>
    </div>
  );
};

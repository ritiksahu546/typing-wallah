import { HindiKeyboardLayout } from '../types';

export interface KeyMapEntry {
  normal: string;
  shift: string;
}

// Remington GAIL (Mangal Unicode) mapping for standard US QWERTY physical keys
export const REMINGTON_GAIL_KEYMAP: Record<string, KeyMapEntry> = {
  // Number row
  '`': { normal: '`', shift: '~' },
  '1': { normal: '१', shift: '!' },
  '2': { normal: '२', shift: '@' },
  '3': { normal: '३', shift: '#' },
  '4': { normal: '४', shift: '$' },
  '5': { normal: '५', shift: '%' },
  '6': { normal: '६', shift: '^' },
  '7': { normal: '७', shift: '&' },
  '8': { normal: '८', shift: '*' },
  '9': { normal: '९', shift: '(' },
  '0': { normal: '०', shift: ')' },
  '-': { normal: '-', shift: '_' },
  '=': { normal: 'ृ', shift: '+' },

  // Top row (QWERTYUIOP[])
  'q': { normal: 'ौ', shift: 'औ' },
  'w': { normal: 'ै', shift: 'ऐ' },
  'e': { normal: 'ा', shift: 'आ' },
  'r': { normal: 'ी', shift: 'ई' },
  't': { normal: 'ू', shift: 'ऊ' },
  'y': { normal: 'ब', shift: 'भ' },
  'u': { normal: 'ह', shift: 'ङ' },
  'i': { normal: 'ग', shift: 'घ' },
  'o': { normal: 'द', shift: 'ध' },
  'p': { normal: 'ज', shift: 'झ' },
  '[': { normal: 'ड', shift: 'ढ' },
  ']': { normal: '़', shift: '।' },
  '\\': { normal: '।', shift: '।' },

  // Home row (ASDFGHJKL;')
  'a': { normal: 'ो', shift: 'ओ' },
  's': { normal: 'े', shift: 'ए' },
  'd': { normal: '्', shift: 'अ' },
  'f': { normal: 'ि', shift: 'इ' },
  'g': { normal: 'ु', shift: 'उ' },
  'h': { normal: 'प', shift: 'फ' },
  'j': { normal: 'र', shift: 'र्' },
  'k': { normal: 'क', shift: 'ख' },
  'l': { normal: 'त', shift: 'थ' },
  ';': { normal: 'च', shift: 'छ' },
  "'": { normal: 'ट', shift: 'ठ' },

  // Bottom row (ZXCVBNM,./)
  'z': { normal: 'ं', shift: 'ः' },
  'x': { normal: 'ँ', shift: 'ऋ' },
  'c': { normal: 'म', shift: 'ण' },
  'v': { normal: 'न', shift: 'ञ' },
  'b': { normal: 'व', shift: 'ऑ' },
  'n': { normal: 'ल', shift: 'ळ' },
  'm': { normal: 'स', shift: 'श' },
  ',': { normal: 'य', shift: 'ष' },
  '.': { normal: 'श', shift: '।' },
  '/': { normal: 'ष', shift: 'ज्ञ' }
};

// InScript (Mangal Unicode Standard) mapping for standard US QWERTY physical keys
export const INSCRIPT_KEYMAP: Record<string, KeyMapEntry> = {
  // Number row
  '`': { normal: '`', shift: '~' },
  '1': { normal: '१', shift: '!' },
  '2': { normal: '२', shift: '@' },
  '3': { normal: '३', shift: '#' },
  '4': { normal: '४', shift: '$' },
  '5': { normal: '५', shift: '%' },
  '6': { normal: '६', shift: '^' },
  '7': { normal: '७', shift: '&' },
  '8': { normal: '८', shift: '*' },
  '9': { normal: '९', shift: '(' },
  '0': { normal: '०', shift: ')' },
  '-': { normal: '-', shift: '_' },
  '=': { normal: 'ृ', shift: 'ऋ' },

  // Top row
  'q': { normal: 'ौ', shift: 'औ' },
  'w': { normal: 'ै', shift: 'ऐ' },
  'e': { normal: 'ा', shift: 'आ' },
  'r': { normal: 'ी', shift: 'ई' },
  't': { normal: 'ू', shift: 'ऊ' },
  'y': { normal: 'ब', shift: 'भ' },
  'u': { normal: 'ह', shift: 'ङ' },
  'i': { normal: 'ग', shift: 'घ' },
  'o': { normal: 'द', shift: 'ध' },
  'p': { normal: 'ज', shift: 'झ' },
  '[': { normal: 'ड', shift: 'ढ' },
  ']': { normal: '़', shift: 'ञ' },
  '\\': { normal: '।', shift: '।' },

  // Home row
  'a': { normal: 'ो', shift: 'ओ' },
  's': { normal: 'े', shift: 'ए' },
  'd': { normal: '्', shift: 'अ' },
  'f': { normal: 'ि', shift: 'इ' },
  'g': { normal: 'ु', shift: 'उ' },
  'h': { normal: 'प', shift: 'फ' },
  'j': { normal: 'र', shift: 'र्' },
  'k': { normal: 'क', shift: 'ख' },
  'l': { normal: 'त', shift: 'थ' },
  ';': { normal: 'च', shift: 'छ' },
  "'": { normal: 'ट', shift: 'ठ' },

  // Bottom row
  'z': { normal: 'ं', shift: 'ँ' },
  'x': { normal: 'म', shift: 'ण' },
  'c': { normal: 'न', shift: 'ळ' },
  'v': { normal: 'व', shift: '।' },
  'b': { normal: 'ल', shift: '?' },
  'n': { normal: 'स', shift: 'श' },
  'm': { normal: 'य', shift: 'ष' },
  ',': { normal: ',', shift: 'श्र' },
  '.': { normal: '.', shift: '।' },
  '/': { normal: '/', shift: '?' }
};

const SHIFTED_SYMBOL_TO_BASE: Record<string, string> = {
  '~': '`',
  '!': '1',
  '@': '2',
  '#': '3',
  '$': '4',
  '%': '5',
  '^': '6',
  '&': '7',
  '*': '8',
  '(': '9',
  ')': '0',
  '_': '-',
  '+': '=',
  '{': '[',
  '}': ']',
  '|': '\\',
  ':': ';',
  '"': "'",
  '<': ',',
  '>': '.',
  '?': '/'
};

/**
 * Checks if a string contains Devanagari script characters
 */
export function isDevanagari(text: string): boolean {
  return /[\u0900-\u097F]/.test(text);
}

/**
 * Translate a physical key press into corresponding Hindi Devanagari character
 * based on selected layout (Remington GAIL or InScript).
 */
export function translatePhysicalKeyToHindi(
  key: string,
  isShift: boolean,
  layout: HindiKeyboardLayout
): string | null {
  if (!key || key === ' ' || key === '\n' || key === '\t') {
    return null;
  }

  const map = layout === 'remington_gail' ? REMINGTON_GAIL_KEYMAP : INSCRIPT_KEYMAP;

  // Handle shifted punctuation characters reported by browser KeyboardEvent.key
  if (SHIFTED_SYMBOL_TO_BASE[key]) {
    const baseKey = SHIFTED_SYMBOL_TO_BASE[key];
    const entry = map[baseKey];
    if (entry) {
      return entry.shift;
    }
  }

  const lowerKey = key.toLowerCase();
  const entry = map[lowerKey] || map[key];
  if (!entry) {
    return null;
  }

  return isShift ? entry.shift : entry.normal;
}

/**
 * Converts newly inserted ASCII characters in an input/textarea change event
 * into Hindi Devanagari characters (fallback for mobile/virtual keyboards where onKeyDown sends 'Unidentified').
 */
export function transliterateNewInputToHindi(
  prevText: string,
  nextText: string,
  layout: HindiKeyboardLayout
): string {
  if (nextText.length <= prevText.length) {
    return nextText;
  }

  let prefixLen = 0;
  const minLen = Math.min(prevText.length, nextText.length);
  while (prefixLen < minLen && prevText[prefixLen] === nextText[prefixLen]) {
    prefixLen++;
  }

  let suffixLen = 0;
  while (
    suffixLen < minLen - prefixLen &&
    prevText[prevText.length - 1 - suffixLen] === nextText[nextText.length - 1 - suffixLen]
  ) {
    suffixLen++;
  }

  const inserted = nextText.slice(prefixLen, nextText.length - suffixLen);
  let converted = '';

  for (const ch of inserted) {
    if (ch === ' ' || ch === '\n' || ch === '\t' || isDevanagari(ch)) {
      converted += ch;
      continue;
    }
    const isUpperAlpha = ch >= 'A' && ch <= 'Z';
    const isShiftedSym = Boolean(SHIFTED_SYMBOL_TO_BASE[ch]);
    const mapped = translatePhysicalKeyToHindi(ch, isUpperAlpha || isShiftedSym, layout);
    converted += mapped ?? ch;
  }

  return nextText.slice(0, prefixLen) + converted + nextText.slice(nextText.length - suffixLen);
}

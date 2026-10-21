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
  ']': { normal: '़', shift: '|' },
  '\\': { normal: '़', shift: '|' },

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
  '.': { normal: 'श', shift: 'श्र' },
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
  'v': { normal: 'व', shift: '।'},
  'b': { normal: 'ल', shift: '?' },
  'n': { normal: 'स', shift: 'श' },
  'm': { normal: 'य', shift: 'ष' },
  ',': { normal: ',', shift: 'श्र' },
  '.': { normal: '.', shift: 'ज्ञ' },
  '/': { normal: '/', shift: '?' }
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
  const map = layout === 'remington_gail' ? REMINGTON_GAIL_KEYMAP : INSCRIPT_KEYMAP;
  const lowerKey = key.toLowerCase();

  const entry = map[lowerKey] || map[key];
  if (!entry) {
    return null;
  }

  return isShift ? entry.shift : entry.normal;
}

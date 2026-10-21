export type FingerKey =
  | 'left-pinky'
  | 'left-ring'
  | 'left-middle'
  | 'left-index'
  | 'thumb'
  | 'right-index'
  | 'right-middle'
  | 'right-ring'
  | 'right-pinky';

export interface FingerInfo {
  id: FingerKey;
  hand: 'left' | 'right';
  nameHindi: string;
  nameEnglish: string;
  colorClass: string;
  bgClass: string;
  borderClass: string;
  badgeClass: string;
  lightBgClass: string;
}

export const FINGER_DETAILS: Record<FingerKey, FingerInfo> = {
  'left-pinky': {
    id: 'left-pinky',
    hand: 'left',
    nameHindi: 'बाएं हाथ की कनिष्ठिका (Little / Pinky)',
    nameEnglish: 'Left Pinky',
    colorClass: 'text-rose-600 dark:text-rose-400',
    bgClass: 'bg-rose-500',
    borderClass: 'border-rose-400 dark:border-rose-600',
    badgeClass: 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300',
    lightBgClass: 'bg-rose-50 dark:bg-rose-950/40'
  },
  'left-ring': {
    id: 'left-ring',
    hand: 'left',
    nameHindi: 'बाएं हाथ की अनामिका (Ring Finger)',
    nameEnglish: 'Left Ring',
    colorClass: 'text-orange-600 dark:text-orange-400',
    bgClass: 'bg-orange-500',
    borderClass: 'border-orange-400 dark:border-orange-600',
    badgeClass: 'bg-orange-100 text-orange-800 dark:bg-orange-950/80 dark:text-orange-300',
    lightBgClass: 'bg-orange-50 dark:bg-orange-950/40'
  },
  'left-middle': {
    id: 'left-middle',
    hand: 'left',
    nameHindi: 'बाएं हाथ की मध्यमा (Middle Finger)',
    nameEnglish: 'Left Middle',
    colorClass: 'text-amber-600 dark:text-amber-400',
    bgClass: 'bg-amber-500',
    borderClass: 'border-amber-400 dark:border-amber-600',
    badgeClass: 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300',
    lightBgClass: 'bg-amber-50 dark:bg-amber-950/40'
  },
  'left-index': {
    id: 'left-index',
    hand: 'left',
    nameHindi: 'बाएं हाथ की तर्जनी (Index Finger)',
    nameEnglish: 'Left Index',
    colorClass: 'text-blue-600 dark:text-blue-400',
    bgClass: 'bg-blue-500',
    borderClass: 'border-blue-400 dark:border-blue-600',
    badgeClass: 'bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300',
    lightBgClass: 'bg-blue-50 dark:bg-blue-950/40'
  },
  'thumb': {
    id: 'thumb',
    hand: 'right',
    nameHindi: 'दायां अंगूठा (Right Thumb - Spacebar)',
    nameEnglish: 'Thumb (Space)',
    colorClass: 'text-emerald-600 dark:text-emerald-400',
    bgClass: 'bg-emerald-500',
    borderClass: 'border-emerald-400 dark:border-emerald-600',
    badgeClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300',
    lightBgClass: 'bg-emerald-50 dark:bg-emerald-950/40'
  },
  'right-index': {
    id: 'right-index',
    hand: 'right',
    nameHindi: 'दाएं हाथ की तर्जनी (Index Finger)',
    nameEnglish: 'Right Index',
    colorClass: 'text-indigo-600 dark:text-indigo-400',
    bgClass: 'bg-indigo-500',
    borderClass: 'border-indigo-400 dark:border-indigo-600',
    badgeClass: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300',
    lightBgClass: 'bg-indigo-50 dark:bg-indigo-950/40'
  },
  'right-middle': {
    id: 'right-middle',
    hand: 'right',
    nameHindi: 'दाएं हाथ की मध्यमा (Middle Finger)',
    nameEnglish: 'Right Middle',
    colorClass: 'text-purple-600 dark:text-purple-400',
    bgClass: 'bg-purple-500',
    borderClass: 'border-purple-400 dark:border-purple-600',
    badgeClass: 'bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300',
    lightBgClass: 'bg-purple-50 dark:bg-purple-950/40'
  },
  'right-ring': {
    id: 'right-ring',
    hand: 'right',
    nameHindi: 'दाएं हाथ की अनामिका (Ring Finger)',
    nameEnglish: 'Right Ring',
    colorClass: 'text-fuchsia-600 dark:text-fuchsia-400',
    bgClass: 'bg-fuchsia-500',
    borderClass: 'border-fuchsia-400 dark:border-fuchsia-600',
    badgeClass: 'bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-950/80 dark:text-fuchsia-300',
    lightBgClass: 'bg-fuchsia-50 dark:bg-fuchsia-950/40'
  },
  'right-pinky': {
    id: 'right-pinky',
    hand: 'right',
    nameHindi: 'दाएं हाथ की कनिष्ठिका (Little / Pinky)',
    nameEnglish: 'Right Pinky',
    colorClass: 'text-pink-600 dark:text-pink-400',
    bgClass: 'bg-pink-500',
    borderClass: 'border-pink-400 dark:border-pink-600',
    badgeClass: 'bg-pink-100 text-pink-800 dark:bg-pink-950/80 dark:text-pink-300',
    lightBgClass: 'bg-pink-50 dark:bg-pink-950/40'
  }
};

export interface KeyFingerMapping {
  key: string;
  finger: FingerKey;
  hand: 'left' | 'right';
  row: 'number' | 'top' | 'home' | 'bottom' | 'space';
  englishChar: string;
  englishShift?: string;
  hindiRemingtonNormal?: string;
  hindiRemingtonShift?: string;
  hindiInscriptNormal?: string;
  hindiInscriptShift?: string;
  fingerHindi: string;
  tipHindi: string;
}

export const QWERTY_FINGER_MAP: Record<string, KeyFingerMapping> = {
  // Home Row
  'a': {
    key: 'a',
    finger: 'left-pinky',
    hand: 'left',
    row: 'home',
    englishChar: 'a',
    englishShift: 'A',
    hindiRemingtonNormal: 'ं (अनुस्वार)',
    hindiRemingtonShift: 'ं',
    hindiInscriptNormal: 'ो (मात्रा)',
    hindiInscriptShift: 'ओ',
    fingerHindi: 'बाएं हाथ की छोटी उंगली (Pinky)',
    tipHindi: 'Home row पर A की डिफ़ॉल्ट स्थिति है।'
  },
  's': {
    key: 's',
    finger: 'left-ring',
    hand: 'left',
    row: 'home',
    englishChar: 's',
    englishShift: 'S',
    hindiRemingtonNormal: 'े (ए मात्रा)',
    hindiRemingtonShift: 'ै',
    hindiInscriptNormal: 'े (मात्रा)',
    hindiInscriptShift: 'ए',
    fingerHindi: 'बाएं हाथ की अनामिका (Ring finger)',
    tipHindi: 'S पर अपनी रिंग उंगली रखें।'
  },
  'd': {
    key: 'd',
    finger: 'left-middle',
    hand: 'left',
    row: 'home',
    englishChar: 'd',
    englishShift: 'D',
    hindiRemingtonNormal: '् (हलंत)',
    hindiRemingtonShift: 'ध',
    hindiInscriptNormal: '् (हलंत)',
    hindiInscriptShift: 'अ',
    fingerHindi: 'बाएं हाथ की बीच वाली उंगली (Middle)',
    tipHindi: 'D पर अपनी मिडल फिंगर रखें।'
  },
  'f': {
    key: 'f',
    finger: 'left-index',
    hand: 'left',
    row: 'home',
    englishChar: 'f',
    englishShift: 'F',
    hindiRemingtonNormal: 'ि (छोटी इ मात्रा)',
    hindiRemingtonShift: 'थ',
    hindiInscriptNormal: 'ि (मात्रा)',
    hindiInscriptShift: 'इ',
    fingerHindi: 'बाएं हाथ की पहली उंगली (Index finger)',
    tipHindi: 'F बटन पर एक उभार (bump) होता है जिससे बिना देखे उंगली सेट होती है।'
  },
  'g': {
    key: 'g',
    finger: 'left-index',
    hand: 'left',
    row: 'home',
    englishChar: 'g',
    englishShift: 'G',
    hindiRemingtonNormal: 'ु (छोटा उ मात्रा)',
    hindiRemingtonShift: 'भ',
    hindiInscriptNormal: 'ु (मात्रा)',
    hindiInscriptShift: 'उ',
    fingerHindi: 'बाएं हाथ की पहली उंगली (Index finger)',
    tipHindi: 'F से दाईं तरफ सरका कर G दबाएं और वापस F पर आएं।'
  },
  'h': {
    key: 'h',
    finger: 'right-index',
    hand: 'right',
    row: 'home',
    englishChar: 'h',
    englishShift: 'H',
    hindiRemingtonNormal: 'प (अक्षर)',
    hindiRemingtonShift: 'फ',
    hindiInscriptNormal: 'प',
    hindiInscriptShift: 'फ',
    fingerHindi: 'दाएं हाथ की पहली उंगली (Index finger)',
    tipHindi: 'J से बाईं तरफ सरका कर H दबाएं और फिर वापस J पर आएं।'
  },
  'j': {
    key: 'j',
    finger: 'right-index',
    hand: 'right',
    row: 'home',
    englishChar: 'j',
    englishShift: 'J',
    hindiRemingtonNormal: 'र (अक्षर)',
    hindiRemingtonShift: 'र् (रेफ)',
    hindiInscriptNormal: 'र',
    hindiInscriptShift: 'ज्ञ',
    fingerHindi: 'दाएं हाथ की पहली उंगली (Index finger)',
    tipHindi: 'J पर उभार (bump) होता है, यह दाएं हाथ का मुख्य होम की है।'
  },
  'k': {
    key: 'k',
    finger: 'right-middle',
    hand: 'right',
    row: 'home',
    englishChar: 'k',
    englishShift: 'K',
    hindiRemingtonNormal: 'क (अक्षर)',
    hindiRemingtonShift: 'ख',
    hindiInscriptNormal: 'क',
    hindiInscriptShift: 'ख',
    fingerHindi: 'दाएं हाथ की बीच वाली उंगली (Middle)',
    tipHindi: 'K पर दायां मिडल फिंगर स्थिर रखें।'
  },
  'l': {
    key: 'l',
    finger: 'right-ring',
    hand: 'right',
    row: 'home',
    englishChar: 'l',
    englishShift: 'L',
    hindiRemingtonNormal: 'त (अक्षर)',
    hindiRemingtonShift: 'थ',
    hindiInscriptNormal: 'त',
    hindiInscriptShift: 'थ',
    fingerHindi: 'दाएं हाथ की अनामिका (Ring finger)',
    tipHindi: 'L पर दायां रिंग फिंगर रखें।'
  },
  ';': {
    key: ';',
    finger: 'right-pinky',
    hand: 'right',
    row: 'home',
    englishChar: ';',
    englishShift: ':',
    hindiRemingtonNormal: 'च / य',
    hindiRemingtonShift: 'छ',
    hindiInscriptNormal: 'च',
    hindiInscriptShift: 'छ',
    fingerHindi: 'दाएं हाथ की छोटी उंगली (Pinky)',
    tipHindi: '; बटन दाएं हाथ की पिंकी फिंगर से दबता है।'
  },
  '\'': {
    key: '\'',
    finger: 'right-pinky',
    hand: 'right',
    row: 'home',
    englishChar: '\'',
    englishShift: '"',
    hindiRemingtonNormal: 'ट',
    hindiRemingtonShift: 'ठ',
    hindiInscriptNormal: 'ट',
    hindiInscriptShift: 'ठ',
    fingerHindi: 'दाएं हाथ की छोटी उंगली (Pinky)',
    tipHindi: 'दाएं हाथ की पिंकी को थोड़ा बाहर ले जाकर दबाएं।'
  },

  // Top Row (QWERTY)
  'q': {
    key: 'q',
    finger: 'left-pinky',
    hand: 'left',
    row: 'top',
    englishChar: 'q',
    englishShift: 'Q',
    hindiRemingtonNormal: 'ौ (मात्रा)',
    hindiRemingtonShift: 'फ',
    hindiInscriptNormal: 'ौ',
    hindiInscriptShift: 'औ',
    fingerHindi: 'बाएं हाथ की छोटी उंगली (Pinky)',
    tipHindi: 'A से ऊपर की तरफ जाकर Q दबाएं।'
  },
  'w': {
    key: 'w',
    finger: 'left-ring',
    hand: 'left',
    row: 'top',
    englishChar: 'w',
    englishShift: 'W',
    hindiRemingtonNormal: 'ै (मात्रा)',
    hindiRemingtonShift: 'ऋ',
    hindiInscriptNormal: 'ै',
    hindiInscriptShift: 'ऐ',
    fingerHindi: 'बाएं हाथ की अनामिका (Ring finger)',
    tipHindi: 'S से ऊपर की ओर जाकर W दबाएं।'
  },
  'e': {
    key: 'e',
    finger: 'left-middle',
    hand: 'left',
    row: 'top',
    englishChar: 'e',
    englishShift: 'E',
    hindiRemingtonNormal: 'ा (आ की मात्रा)',
    hindiRemingtonShift: 'आ',
    hindiInscriptNormal: 'ा',
    hindiInscriptShift: 'आ',
    fingerHindi: 'बाएं हाथ की बीच वाली उंगली (Middle)',
    tipHindi: 'D से ऊपर की ओर जाकर E दबाएं।'
  },
  'r': {
    key: 'r',
    finger: 'left-index',
    hand: 'left',
    row: 'top',
    englishChar: 'r',
    englishShift: 'R',
    hindiRemingtonNormal: 'ी (बड़ी ई मात्रा)',
    hindiRemingtonShift: 'ई',
    hindiInscriptNormal: 'ी',
    hindiInscriptShift: 'ई',
    fingerHindi: 'बाएं हाथ की पहली उंगली (Index finger)',
    tipHindi: 'F से ऊपर की ओर जाकर R दबाएं।'
  },
  't': {
    key: 't',
    finger: 'left-index',
    hand: 'left',
    row: 'top',
    englishChar: 't',
    englishShift: 'T',
    hindiRemingtonNormal: 'ू (बड़ा ऊ मात्रा)',
    hindiRemingtonShift: 'ऊ',
    hindiInscriptNormal: 'ू',
    hindiInscriptShift: 'ऊ',
    fingerHindi: 'बाएं हाथ की पहली उंगली (Index finger)',
    tipHindi: 'F से ऊपर-दाएं जाकर T दबाएं।'
  },
  'y': {
    key: 'y',
    finger: 'right-index',
    hand: 'right',
    row: 'top',
    englishChar: 'y',
    englishShift: 'Y',
    hindiRemingtonNormal: 'ब (अक्षर)',
    hindiRemingtonShift: 'भ',
    hindiInscriptNormal: 'ब',
    hindiInscriptShift: 'भ',
    fingerHindi: 'दाएं हाथ की पहली उंगली (Index finger)',
    tipHindi: 'J से ऊपर-बाएं जाकर Y दबाएं।'
  },
  'u': {
    key: 'u',
    finger: 'right-index',
    hand: 'right',
    row: 'top',
    englishChar: 'u',
    englishShift: 'U',
    hindiRemingtonNormal: 'ह (अक्षर)',
    hindiRemingtonShift: 'ङ',
    hindiInscriptNormal: 'ह',
    hindiInscriptShift: 'ङ',
    fingerHindi: 'दाएं हाथ की पहली उंगली (Index finger)',
    tipHindi: 'J से ऊपर जाकर U दबाएं।'
  },
  'i': {
    key: 'i',
    finger: 'right-middle',
    hand: 'right',
    row: 'top',
    englishChar: 'i',
    englishShift: 'I',
    hindiRemingtonNormal: 'ग (अक्षर)',
    hindiRemingtonShift: 'घ',
    hindiInscriptNormal: 'ग',
    hindiInscriptShift: 'घ',
    fingerHindi: 'दाएं हाथ की बीच वाली उंगली (Middle)',
    tipHindi: 'K से ऊपर जाकर I दबाएं।'
  },
  'o': {
    key: 'o',
    finger: 'right-ring',
    hand: 'right',
    row: 'top',
    englishChar: 'o',
    englishShift: 'O',
    hindiRemingtonNormal: 'द (अक्षर)',
    hindiRemingtonShift: 'ध',
    hindiInscriptNormal: 'द',
    hindiInscriptShift: 'ध',
    fingerHindi: 'दाएं हाथ की अनामिका (Ring finger)',
    tipHindi: 'L से ऊपर जाकर O दबाएं।'
  },
  'p': {
    key: 'p',
    finger: 'right-pinky',
    hand: 'right',
    row: 'top',
    englishChar: 'p',
    englishShift: 'P',
    hindiRemingtonNormal: 'ज (अक्षर)',
    hindiRemingtonShift: 'झ',
    hindiInscriptNormal: 'ज',
    hindiInscriptShift: 'झ',
    fingerHindi: 'दाएं हाथ की छोटी उंगली (Pinky)',
    tipHindi: '; से ऊपर जाकर P दबाएं।'
  },
  '[': {
    key: '[',
    finger: 'right-pinky',
    hand: 'right',
    row: 'top',
    englishChar: '[',
    englishShift: '{',
    hindiRemingtonNormal: 'ड / ख्',
    hindiRemingtonShift: 'ढ',
    hindiInscriptNormal: 'ड',
    hindiInscriptShift: 'ढ',
    fingerHindi: 'दाएं हाथ की छोटी उंगली (Pinky)',
    tipHindi: 'दाएं हाथ की पिंकी को ऊपर-दाएं स्ट्रेच करें।'
  },
  ']': {
    key: ']',
    finger: 'right-pinky',
    hand: 'right',
    row: 'top',
    englishChar: ']',
    englishShift: '}',
    hindiRemingtonNormal: '़ (नुक़्ता)',
    hindiRemingtonShift: 'ञ',
    hindiInscriptNormal: '़',
    hindiInscriptShift: 'ञ',
    fingerHindi: 'दाएं हाथ की छोटी उंगली (Pinky)',
    tipHindi: 'दाएं हाथ की पिंकी से दूर तक पहुंच कर दबाएं।'
  },

  // Bottom Row (ZXCVBNM)
  'z': {
    key: 'z',
    finger: 'left-pinky',
    hand: 'left',
    row: 'bottom',
    englishChar: 'z',
    englishShift: 'Z',
    hindiRemingtonNormal: 'र् (क्र/प्र के लिए)',
    hindiRemingtonShift: 'ः (विसर्ग)',
    hindiInscriptNormal: 'ं (अनुस्वार)',
    hindiInscriptShift: 'ँ',
    fingerHindi: 'बाएं हाथ की छोटी उंगली (Pinky)',
    tipHindi: 'A से नीचे आकर Z दबाएं।'
  },
  'x': {
    key: 'x',
    finger: 'left-ring',
    hand: 'left',
    row: 'bottom',
    englishChar: 'x',
    englishShift: 'X',
    hindiRemingtonNormal: 'ग / द्',
    hindiRemingtonShift: 'ऋ',
    hindiInscriptNormal: 'ं',
    hindiInscriptShift: 'ण',
    fingerHindi: 'बाएं हाथ की अनामिका (Ring finger)',
    tipHindi: 'S से नीचे आकर X दबाएं।'
  },
  'c': {
    key: 'c',
    finger: 'left-middle',
    hand: 'left',
    row: 'bottom',
    englishChar: 'c',
    englishShift: 'C',
    hindiRemingtonNormal: 'म (अक्षर)',
    hindiRemingtonShift: 'ण',
    hindiInscriptNormal: 'म',
    hindiInscriptShift: 'ण',
    fingerHindi: 'बाएं हाथ की बीच वाली उंगली (Middle)',
    tipHindi: 'D से नीचे आकर C दबाएं।'
  },
  'v': {
    key: 'v',
    finger: 'left-index',
    hand: 'left',
    row: 'bottom',
    englishChar: 'v',
    englishShift: 'V',
    hindiRemingtonNormal: 'न (अक्षर)',
    hindiRemingtonShift: 'ञ',
    hindiInscriptNormal: 'न',
    hindiInscriptShift: 'ळ',
    fingerHindi: 'बाएं हाथ की पहली उंगली (Index finger)',
    tipHindi: 'F से नीचे आकर V दबाएं।'
  },
  'b': {
    key: 'b',
    finger: 'left-index',
    hand: 'left',
    row: 'bottom',
    englishChar: 'b',
    englishShift: 'B',
    hindiRemingtonNormal: 'व (अक्षर)',
    hindiRemingtonShift: 'ऑ',
    hindiInscriptNormal: 'व',
    hindiInscriptShift: '। (पूर्णविराम)',
    fingerHindi: 'बाएं हाथ की पहली उंगली (Index finger)',
    tipHindi: 'F से नीचे-दाएं जाकर B दबाएं।'
  },
  'n': {
    key: 'n',
    finger: 'right-index',
    hand: 'right',
    row: 'bottom',
    englishChar: 'n',
    englishShift: 'N',
    hindiRemingtonNormal: 'ल (अक्षर)',
    hindiRemingtonShift: 'ळ',
    hindiInscriptNormal: 'ल',
    hindiInscriptShift: '?',
    fingerHindi: 'दाएं हाथ की पहली उंगली (Index finger)',
    tipHindi: 'J से नीचे-बाएं जाकर N दबाएं।'
  },
  'm': {
    key: 'm',
    finger: 'right-index',
    hand: 'right',
    row: 'bottom',
    englishChar: 'm',
    englishShift: 'M',
    hindiRemingtonNormal: 'स (अक्षर)',
    hindiRemingtonShift: 'श',
    hindiInscriptNormal: 'स',
    hindiInscriptShift: 'श',
    fingerHindi: 'दाएं हाथ की पहली उंगली (Index finger)',
    tipHindi: 'J से नीचे आकर M दबाएं।'
  },
  ',': {
    key: ',',
    finger: 'right-middle',
    hand: 'right',
    row: 'bottom',
    englishChar: ',',
    englishShift: '<',
    hindiRemingtonNormal: 'य (अक्षर)',
    hindiRemingtonShift: 'ष',
    hindiInscriptNormal: ', (कॉमा)',
    hindiInscriptShift: 'ष',
    fingerHindi: 'दाएं हाथ की बीच वाली उंगली (Middle)',
    tipHindi: 'K से नीचे आकर कॉमा (,) दबाएं।'
  },
  '.': {
    key: '.',
    finger: 'right-ring',
    hand: 'right',
    row: 'bottom',
    englishChar: '.',
    englishShift: '>',
    hindiRemingtonNormal: 'श / .',
    hindiRemingtonShift: 'ज्ञ',
    hindiInscriptNormal: '. (डॉट)',
    hindiInscriptShift: '। (पूर्णविराम)',
    fingerHindi: 'दाएं हाथ की अनामिका (Ring finger)',
    tipHindi: 'L से नीचे आकर फुलस्टॉप (.) दबाएं।'
  },
  '/': {
    key: '/',
    finger: 'right-pinky',
    hand: 'right',
    row: 'bottom',
    englishChar: '/',
    englishShift: '?',
    hindiRemingtonNormal: 'ष / /',
    hindiRemingtonShift: '?',
    hindiInscriptNormal: 'य',
    hindiInscriptShift: '?',
    fingerHindi: 'दाएं हाथ की छोटी उंगली (Pinky)',
    tipHindi: '; से नीचे आकर स्लैश (/) दबाएं।'
  },

  // Spacebar
  ' ': {
    key: ' ',
    finger: 'thumb',
    hand: 'right',
    row: 'space',
    englishChar: 'Spacebar',
    hindiRemingtonNormal: 'Space (शब्दों के बीच स्पेस)',
    hindiInscriptNormal: 'Space (शब्दों के बीच स्पेस)',
    fingerHindi: 'दाएं हाथ का अंगूठा (Right Thumb)',
    tipHindi: 'शब्द पूरा होने के बाद केवल अंगूठे से स्पेसबार दबाएं।'
  }
};

export interface TouchTypingLesson {
  id: string;
  level: number;
  titleHindi: string;
  titleEnglish: string;
  subtitleHindi: string;
  targetFingers: FingerKey[];
  keys: string[];
  practiceTextEnglish: string;
  practiceTextHindiRemington: string;
  practiceTextHindiInscript: string;
  descriptionHindi: string;
  tips: string[];
}

export const TOUCH_TYPING_LESSONS: TouchTypingLesson[] = [
  {
    id: 'lesson-1-home-row-base',
    level: 1,
    titleHindi: 'होम रो बेस (A S D F - J K L ;)',
    titleEnglish: 'Home Row Foundation',
    subtitleHindi: 'उंगलियों की मुख्य स्थिति (Home Position)',
    targetFingers: ['left-pinky', 'left-ring', 'left-middle', 'left-index', 'right-index', 'right-middle', 'right-ring', 'right-pinky'],
    keys: ['a', 's', 'd', 'f', 'j', 'k', 'l', ';', ' '],
    practiceTextEnglish: 'asdf jkl; asdf jkl; a s d f j k l ; dad sad lad fall ask flask',
    practiceTextHindiRemington: 'ं े ् ि र क त च ंे्ि रकतच कर तर कस कल मल',
    practiceTextHindiInscript: 'ो े ् ि र क त च ोे्ि रकतच कर तर कस कल मल',
    descriptionHindi: 'टाइपिंग सीखने का सबसे पहला नियम है "Home Row"। बिना कीबोर्ड देखे दोनों हाथों की चार-चार उंगलियां क्रमशः A-S-D-F और J-K-L-; पर रखें। F और J पर हल्की लकीर (bump) होती है जिसे महसूस करके उंगलियां सेट करें।',
    tips: [
      'बायां हाथ: कनिष्ठिका (Pinky) = A, अनामिका (Ring) = S, मध्यमा (Middle) = D, तर्जनी (Index) = F',
      'दायां हाथ: तर्जनी (Index) = J, मध्यमा (Middle) = K, अनामिका (Ring) = L, कनिष्ठिका (Pinky) = ;',
      'दोनों अंगूठे Spacebar के ऊपर हवा में या हल्के टिके होने चाहिए।',
      'हर बटन दबाने के बाद उंगली वापस अपने होम बटन पर आनी चाहिए।'
    ]
  },
  {
    id: 'lesson-2-home-row-g-h',
    level: 2,
    titleHindi: 'होम रो विस्तार (G और H बटन)',
    titleEnglish: 'Home Row Extension (G and H)',
    subtitleHindi: 'तर्जनी (Index Finger) का साइड मूवमेंट',
    targetFingers: ['left-index', 'right-index', 'thumb'],
    keys: ['f', 'g', 'h', 'j', 'd', 'k', ' '],
    practiceTextEnglish: 'fg jh fg jh gh gh glad flash half flag dash jag hag gash',
    practiceTextHindiRemington: 'ि ु प र िु पर कह पग गज हर पल जल थल',
    practiceTextHindiInscript: 'ि ु प र िु पर कह पग गज हर पल जल थल',
    descriptionHindi: 'G और H होम रो के बीच में होते हैं। बाएं हाथ की पहली उंगली (Index) F से दाईं तरफ सरका कर G दबाती है, और दाएं हाथ की पहली उंगली J से बाईं तरफ सरका कर H दबाती है। बटन दबाकर तुरंत वापस F और J पर आएं।',
    tips: [
      'G दबाने के लिए: बाएं हाथ की तर्जनी को दाईं तरफ स्लाइड करें, फिर वापस F पर लाएं।',
      'H दबाने के लिए: दाएं हाथ की तर्जनी को बाईं तरफ स्लाइड करें, फिर वापस J पर लाएं।',
      'अपनी कलाई को टेबल पर ज़ोर से न दबाएं, हल्का उठा कर रखें।'
    ]
  },
  {
    id: 'lesson-3-top-row-qwer-uiop',
    level: 3,
    titleHindi: 'ऊपरी रो (Top Row - Q W E R T Y U I O P)',
    titleEnglish: 'Top Row Navigation',
    subtitleHindi: 'होम रो से ऊपर उंगलियां ले जाना',
    targetFingers: ['left-pinky', 'left-ring', 'left-middle', 'left-index', 'right-index', 'right-middle', 'right-ring', 'right-pinky'],
    keys: ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', ' '],
    practiceTextEnglish: 'qwert yuiop quiet power write trust report youth proper quote operate queue',
    practiceTextHindiRemington: 'ौ ै ा ी ू ब ह ग द ज ौैाीू बहगदज बात रात देश शहर अगर मगर',
    practiceTextHindiInscript: 'ौ ै ा ी ू ब ह ग द ज ौैाीू बहगदज बात रात देश शहर अगर मगर',
    descriptionHindi: 'टॉप रो के लिए उंगली को ऊपर की ओर ले जाना होता है और बटन दबाते ही तुरंत होम रो पर वापस खींच लेना होता है। कभी भी हाथ पूरा ऊपर न ले जाएं, केवल संबंधित उंगली को ऊपर स्ट्रेच करें।',
    tips: [
      'Q = बायां Pinky, W = बायां Ring, E = बायां Middle, R = बायां Index, T = बायां Index',
      'Y = दायां Index, U = दायां Index, I = दायां Middle, O = दायां Ring, P = दायां Pinky',
      'Hindi Remington में E से "ा" (आ की मात्रा), R से "ी" की मात्रा आती है जो सबसे ज़्यादा इस्तेमाल होती है।'
    ]
  },
  {
    id: 'lesson-4-bottom-row-zxcv-bnm',
    level: 4,
    titleHindi: 'निचली रो (Bottom Row - Z X C V B N M , .)',
    titleEnglish: 'Bottom Row Control',
    subtitleHindi: 'होम रो से नीचे उंगलियां ले जाना',
    targetFingers: ['left-pinky', 'left-ring', 'left-middle', 'left-index', 'right-index', 'right-middle', 'right-ring', 'right-pinky'],
    keys: ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', ' '],
    practiceTextEnglish: 'zxcvb nm,. civil mixer blank zebra cabin voice normal common summer examine',
    practiceTextHindiRemington: 'र् ग म न व ल स य श मन वन लस सम यश क्रम जनम नया',
    practiceTextHindiInscript: 'ं म न व ल स य श मन वन लस सम यश नया भारत',
    descriptionHindi: 'बॉटम रो कीबोर्ड की सबसे नीचे की लाइन है। नए टाइपर्स को नीचे उंगली ले जाने में थोड़ी झिझक होती है। उंगली को तिरछा नीचे ले जाएं और तुरंत अपनी होम पोजीशन पर वापस आएं।',
    tips: [
      'Z = बायां Pinky, X = बायां Ring, C = बायां Middle, V = बायां Index, B = बायां Index',
      'N = दायां Index, M = दायां Index, कॉमा (,) = दायां Middle, डॉट (.) = दायां Ring',
      'Hindi Remington में C से "म" और V से "न" अक्षर टाइप होता है।'
    ]
  },
  {
    id: 'lesson-5-shift-key-hindi-matras',
    level: 5,
    titleHindi: 'Shift Key और हिंदी संयुक्ताक्षर / बड़े अक्षर',
    titleEnglish: 'Shift Key Mastery & Capitals',
    subtitleHindi: 'उल्टी उंगली से Shift दबाने का नियम',
    targetFingers: ['left-pinky', 'right-pinky'],
    keys: ['A', 'S', 'D', 'F', 'J', 'K', 'L', ' '],
    practiceTextEnglish: 'India Bharat Delhi Patna Bhopal Lucknow Jaipur Kolkata Mumbai Chennai',
    practiceTextHindiRemington: 'ओ ए अ इ उ फ र् ख थ छ ठ भ घ ध झ ढ',
    practiceTextHindiInscript: 'औ ऐ आ ई ऊ ङ घ ध झ ढ फ ख थ छ ठ',
    descriptionHindi: 'Shift दबाने का स्वर्णिम नियम: यदि दाहिने हाथ का अक्षर दबाना है, तो बायां Pinky Shift दबाएगा। यदि बाएं हाथ का अक्षर दबाना है, तो दायां Pinky Shift दबाएगा। कभी भी एक ही हाथ से Shift और अक्षर न दबाएं!',
    tips: [
      'Right Hand Character (e.g. K, J, O) → Left Pinky holds Left Shift.',
      'Left Hand Character (e.g. D, S, E) → Right Pinky holds Right Shift.',
      'हिंदी में आधा अक्षर (हलंत) या ऊपर का रेफ (र्) लगाने के लिए Shift का सही उपयोग बहुत जरूरी है।'
    ]
  },
  {
    id: 'lesson-6-real-words-sentences',
    level: 6,
    titleHindi: 'पूर्ण वाक्य और परीक्षा स्तर अभ्यास',
    titleEnglish: 'Full Words & Exam Sentences',
    subtitleHindi: 'धाराप्रवाह टाइपिंग और रिदम',
    targetFingers: ['left-pinky', 'left-ring', 'left-middle', 'left-index', 'right-index', 'right-middle', 'right-ring', 'right-pinky', 'thumb'],
    keys: ['all'],
    practiceTextEnglish: 'The quick brown fox jumps over the lazy dog. Continuous practice ensures rapid typing speed for government exams.',
    practiceTextHindiRemington: 'मध्य प्रदेश शासन द्वारा आयोजित सीपीसीटी परीक्षा में हिंदी और अंग्रेजी दोनों टाइपिंग उत्तीर्ण करना अनिवार्य है।',
    practiceTextHindiInscript: 'भारत सरकार के सभी मंत्रालयों और विभागों में कंप्यूटर आधारित टाइपिंग टेस्ट आयोजित किए जाते हैं।',
    descriptionHindi: 'अब सभी रो मिल चुकी हैं। स्क्रीन पर देखें, कीबोर्ड पर बिल्कुल न देखें। गलतियां होने पर Backspace कम से कम दबाएं ताकि आपकी उंगलियों की मेमोरी (Muscle Memory) मजबूत बने।',
    tips: [
      'स्पीड से पहले Accuracy पर ध्यान दें। अगर 95% से अधिक Accuracy रहेगी तो स्पीड अपने आप बढ़ेगी।',
      'टाइपिंग करते समय अपनी सांस सामान्य रखें और कीबोर्ड पर हल्के हाथ से वार करें।'
    ]
  }
];

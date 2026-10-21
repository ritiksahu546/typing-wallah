import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  ActivePage,
  ExamId,
  HindiKeyboardLayout,
  Passage,
  TestResultRecord,
  UserProfile
} from '../types';
import { EXAMS_DATA } from '../data/exams';
import { PASSAGES_DATA } from '../data/passages';
import { calculateTypingMetrics } from '../engine/metrics';
import { translatePhysicalKeyToHindi, transliterateNewInputToHindi } from '../engine/hindiKeyboards';
import { StorageService } from '../services/storageService';
import { ResultModal } from './ResultModal';
import { SubscriptionModal } from './SubscriptionModal';
import { VirtualKeyboardMap } from './VirtualKeyboardMap';
import { EarlySubmitModal } from './EarlySubmitModal';
import {
  ArrowLeft,
  RotateCcw,
  Settings,
  Clock,
  Send,
  User,
  Check,
  Sparkles,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  Keyboard,
  ShieldAlert,
  Search,
  BookOpen,
  X
} from 'lucide-react';

interface AuthenticExamTypingProps {
  user: UserProfile;
  initialExamId?: ExamId;
  initialLanguage?: 'english' | 'hindi';
  initialDuration?: number;
  initialLayout?: HindiKeyboardLayout;
  initialMode?: 'exam' | 'practice';
  onNavigate: (page: ActivePage, examId?: ExamId) => void;
  onOpenSubscriptionModal: () => void;
  isUserPro: boolean;
}

export const AuthenticExamTyping: React.FC<AuthenticExamTypingProps> = ({
  user,
  initialExamId = 'patna-hc',
  initialLanguage = 'english',
  initialDuration = 600,
  initialLayout = 'remington_gail',
  initialMode = 'practice',
  onNavigate,
  onOpenSubscriptionModal,
  isUserPro
}) => {
  // Navigation and Exam settings
  const [selectedExamId, setSelectedExamId] = useState<ExamId>(initialExamId);
  const [language, setLanguage] = useState<'english' | 'hindi'>(initialLanguage);
  const [durationSeconds, setDurationSeconds] = useState<number>(initialDuration);
  const [keyboardLayout, setKeyboardLayout] = useState<HindiKeyboardLayout>(initialLayout);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [wordLimit, setWordLimit] = useState<'all' | '100' | '200' | '300' | '420'>('420');

  // Passage selection
  const [selectedPassageId, setSelectedPassageId] = useState<string>(
    initialLanguage === 'hindi' ? 'hin-free-01' : 'eng-free-02'
  );
  const [isPassageDropdownOpen, setIsPassageDropdownOpen] = useState<boolean>(false);
  const [passageSearchQuery, setPassageSearchQuery] = useState<string>('');

  // Modals and Drawers
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [showKeyboardMap, setShowKeyboardMap] = useState<boolean>(false);
  const [showEarlySubmitModal, setShowEarlySubmitModal] = useState<boolean>(false);
  const [activeResult, setActiveResult] = useState<TestResultRecord | null>(null);

  // User Settings (Virtual Hindi QWERTY->Devanagari converter enabled by default)
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('large');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [disableBackspace, setDisableBackspace] = useState<boolean>(false);
  const [useVirtualRemington, setUseVirtualRemington] = useState<boolean>(true);
  const [backspaceWarning, setBackspaceWarning] = useState<boolean>(false);

  // Typing Session State
  const [typedText, setTypedText] = useState<string>('');
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [backspaceCount, setBackspaceCount] = useState<number>(0);
  const [keystrokesCount, setKeystrokesCount] = useState<number>(0);

  // Refs
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const accumulatedElapsedRef = useRef<number>(0);
  const hasSubmittedRef = useRef<boolean>(false);
  const activeWordRef = useRef<HTMLSpanElement | null>(null);
  const referenceContainerRef = useRef<HTMLDivElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Sync props when navigating with new initial language/exam/layout
  useEffect(() => {
    setSelectedExamId(initialExamId);
    setLanguage(initialLanguage);
    setDurationSeconds(initialDuration);
    setKeyboardLayout(initialLayout);
    setSelectedCategory('All');
    const customList = StorageService.getCustomPassages().filter((p) => p.language === initialLanguage);
    const firstForLang = customList[0] || PASSAGES_DATA.find((p) => p.language === initialLanguage);
    if (firstForLang) {
      setSelectedPassageId(firstForLang.id);
    }
  }, [initialExamId, initialLanguage, initialDuration, initialLayout]);

  // Candidate Name (never hardcode a personal name for guests)
  const candidateName =
    user?.name && user.name.trim() !== '' && user.name !== 'Candidate'
      ? user.name
      : 'Guest Aspirant';

  // Get Exam Data
  const currentExam = EXAMS_DATA[selectedExamId] || EXAMS_DATA['high-court'] || EXAMS_DATA['cpct'];

  // Filter passages by active language (including any custom passages saved by admin)
  const availablePassages = useMemo(() => {
    const custom = StorageService.getCustomPassages().filter((p) => p.language === language);
    const builtin = PASSAGES_DATA.filter((p) => p.language === language);
    const map = new Map<string, Passage>();
    custom.forEach((p) => map.set(p.id, p));
    builtin.forEach((p) => {
      if (!map.has(p.id)) map.set(p.id, p);
    });
    return Array.from(map.values());
  }, [language]);

  const availableCategories = useMemo(() => {
    const cats = Array.from(new Set(availablePassages.map((p) => p.category).filter(Boolean))) as string[];
    return ['All', ...cats];
  }, [availablePassages]);

  const filteredPassages = useMemo(() => {
    let list = availablePassages;
    if (selectedCategory !== 'All') {
      list = list.filter((p) => p.category?.toLowerCase() === selectedCategory.toLowerCase());
    }
    if (passageSearchQuery.trim() !== '') {
      const q = passageSearchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.content.toLowerCase().includes(q) ||
          String(p.passageNumber).includes(q)
      );
    }
    return list;
  }, [availablePassages, selectedCategory, passageSearchQuery]);

  // Active Passage (strictly scoped to availablePassages of current language)
  const activePassage = useMemo(() => {
    return (
      availablePassages.find((p) => p.id === selectedPassageId) ||
      availablePassages[0] ||
      PASSAGES_DATA[0]
    );
  }, [selectedPassageId, availablePassages]);

  // Handle word limit truncation
  const baseWords = useMemo(() => {
    return activePassage.content.trim().split(/\s+/);
  }, [activePassage]);

  const targetWords = useMemo(() => {
    if (wordLimit === 'all') return baseWords;
    const limit = parseInt(wordLimit, 10);
    return baseWords.slice(0, Math.min(limit, baseWords.length));
  }, [baseWords, wordLimit]);

  const targetText = useMemo(() => {
    return targetWords.join(' ');
  }, [targetWords]);

  // Word length metric
  const avgWordLength = useMemo(() => {
    if (targetWords.length === 0) return '5.00';
    const totalChars = targetWords.reduce((sum, w) => sum + w.length, 0);
    return (totalChars / targetWords.length).toFixed(2);
  }, [targetWords]);

  // Typed words parsing
  const typedWords = useMemo(() => {
    if (!typedText || typedText.trim().length === 0) return [];
    return typedText.trim().split(/\s+/);
  }, [typedText]);

  // Current word index being typed
  const currentWordIndex = useMemo(() => {
    if (typedText.length === 0) return 0;
    if (typedText.endsWith(' ')) {
      return typedWords.length;
    }
    return Math.max(0, typedWords.length - 1);
  }, [typedText, typedWords]);

  // Keystrokes & Words calculation
  const effectiveKeystrokes = Math.max(typedText.length, keystrokesCount);
  const totalWordsCount = targetWords.length;
  const isLastCharWhitespace = /\s$/.test(typedText);
  const completedWordsCount = isLastCharWhitespace
    ? typedWords.length
    : Math.max(0, typedWords.length - 1);
  const pendingWordsCount = Math.max(0, totalWordsCount - completedWordsCount);

  // Compute exact wall-clock elapsed seconds for accurate speed calculation
  const effectiveElapsed = useMemo(() => {
    if (typedText.length === 0) return 0;
    if (startTimeRef.current && !isPaused) {
      const wallElapsed = accumulatedElapsedRef.current + (Date.now() - startTimeRef.current) / 1000;
      return Math.min(durationSeconds, Math.max(elapsedSeconds, wallElapsed, 1.5));
    }
    return Math.max(elapsedSeconds, accumulatedElapsedRef.current, 1.5);
  }, [typedText.length, elapsedSeconds, durationSeconds, isPaused]);

  // Real-time metrics computed via master exam scoring engine
  const liveMetrics = useMemo(() => {
    return calculateTypingMetrics(
      typedText,
      targetText,
      effectiveElapsed,
      durationSeconds,
      backspaceCount,
      selectedExamId,
      language
    );
  }, [typedText, targetText, effectiveElapsed, durationSeconds, backspaceCount, selectedExamId, language]);

  // Speed Metrics & Error Counts
  const errorCount = liveMetrics.mistakesDetail.totalMistakes;
  const grossWpm = typedText.length > 0 ? liveMetrics.grossWpm : 0;
  const netWpm = typedText.length > 0 ? liveMetrics.netWpm : 0;
  const accuracy = typedText.length > 0 ? liveMetrics.accuracy : 100;

  // Remaining time (never negative)
  const remainingSeconds = Math.max(0, durationSeconds - Math.floor(elapsedSeconds));
  const formatTime = (secs: number) => {
    const wholeSecs = Math.max(0, Math.floor(secs));
    const m = Math.floor(wholeSecs / 60);
    const s = wholeSecs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Sound generator
  const playKeyClick = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(340, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.03, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.03);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.03);
    } catch {}
  }, [soundEnabled]);

  // Finish test callback with strict single-submission lock
  const finishTest = useCallback(() => {
    if (hasSubmittedRef.current) return;
    hasSubmittedRef.current = true;

    if (timerRef.current) clearInterval(timerRef.current);
    setIsActive(false);
    setIsPaused(false);
    setIsFinished(true);

    const finalElapsed = startTimeRef.current
      ? Math.min(durationSeconds, Math.max(1.5, accumulatedElapsedRef.current + (Date.now() - startTimeRef.current) / 1000))
      : Math.max(1.5, elapsedSeconds);

    const metrics = calculateTypingMetrics(
      typedText,
      targetText,
      finalElapsed,
      durationSeconds,
      backspaceCount,
      selectedExamId,
      language
    );

    const resultRecord: TestResultRecord = {
      id: `res-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      timestamp: Date.now(),
      examId: selectedExamId,
      examName: currentExam.name,
      language,
      keyboardLayout: language === 'hindi' ? keyboardLayout : 'standard',
      durationSeconds: Math.round(finalElapsed),
      passageTitle: activePassage.title,
      passageId: activePassage.id,
      metrics
    };

    StorageService.saveTestResult(resultRecord);
    setActiveResult(resultRecord);
  }, [
    typedText,
    targetText,
    elapsedSeconds,
    durationSeconds,
    backspaceCount,
    selectedExamId,
    currentExam.name,
    language,
    keyboardLayout,
    activePassage.title,
    activePassage.id
  ]);

  // High-precision wall-clock timer tick
  useEffect(() => {
    if (isActive && !isPaused && !isFinished) {
      startTimeRef.current = Date.now();
      timerRef.current = window.setInterval(() => {
        if (!startTimeRef.current) return;
        const nextElapsed = accumulatedElapsedRef.current + (Date.now() - startTimeRef.current) / 1000;
        if (nextElapsed >= durationSeconds) {
          setElapsedSeconds(durationSeconds);
          if (timerRef.current) clearInterval(timerRef.current);
        } else {
          setElapsedSeconds(nextElapsed);
        }
      }, 250);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, isPaused, isFinished, durationSeconds]);

  // Trigger test completion when time expires or passage is fully completed
  useEffect(() => {
    if (isActive && !isFinished) {
      if (elapsedSeconds >= durationSeconds && durationSeconds > 0) {
        finishTest();
      } else if (
        totalWordsCount > 0 &&
        typedWords.length >= totalWordsCount &&
        (typedText.endsWith(' ') || typedWords[totalWordsCount - 1] === targetWords[totalWordsCount - 1])
      ) {
        finishTest();
      }
    }
  }, [isActive, isFinished, elapsedSeconds, durationSeconds, totalWordsCount, typedWords, targetWords, typedText, finishTest]);

  // Pause / Resume toggle
  const handleTogglePause = useCallback(() => {
    if (!isActive || isFinished) return;
    if (!isPaused) {
      if (startTimeRef.current) {
        accumulatedElapsedRef.current += (Date.now() - startTimeRef.current) / 1000;
        startTimeRef.current = null;
      }
      setIsPaused(true);
    } else {
      startTimeRef.current = Date.now();
      setIsPaused(false);
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [isActive, isFinished, isPaused]);

  // Reset Session
  const handleReset = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    startTimeRef.current = null;
    accumulatedElapsedRef.current = 0;
    hasSubmittedRef.current = false;
    setTypedText('');
    setElapsedSeconds(0);
    setIsActive(false);
    setIsPaused(false);
    setIsFinished(false);
    setBackspaceCount(0);
    setKeystrokesCount(0);
    setActiveResult(null);
    setShowEarlySubmitModal(false);
    if (inputRef.current) {
      inputRef.current.value = '';
      inputRef.current.focus();
    }
  }, []);

  // Auto-scroll reference text to keep active word in view
  useEffect(() => {
    if (activeWordRef.current && referenceContainerRef.current) {
      const activeEl = activeWordRef.current;
      const container = referenceContainerRef.current;
      const elTop = activeEl.offsetTop - container.offsetTop;
      if (elTop > container.clientHeight * 0.55 || elTop < container.scrollTop) {
        container.scrollTop = Math.max(0, elTop - 40);
      }
    }
  }, [currentWordIndex]);

  // Close passage dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsPassageDropdownOpen(false);
      }
    };
    if (isPassageDropdownOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isPassageDropdownOpen]);

  // Handle Input Changes
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (isFinished) return;
    let val = e.target.value;
    if (!isActive && val.length > 0) {
      if (!startTimeRef.current) startTimeRef.current = Date.now();
      setIsActive(true);
    }
    if (language === 'hindi' && useVirtualRemington && val.length > typedText.length) {
      val = transliterateNewInputToHindi(typedText, val, keyboardLayout);
    }
    // Collapse consecutive spaces or leading space to keep word alignment accurate
    val = val.replace(/^\s+/, '').replace(/ {2,}/g, ' ');
    setTypedText(val);
    playKeyClick();
  };

  // Handle Key Down
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (isFinished) return;

    // Prevent leading space or consecutive spaces from shifting word alignment
    if (e.key === ' ' && (typedText.length === 0 || typedText.endsWith(' '))) {
      e.preventDefault();
      return;
    }

    // Start on first key
    if (!isActive && e.key.length === 1) {
      if (!startTimeRef.current) startTimeRef.current = Date.now();
      setIsActive(true);
    }

    if (e.key === 'Backspace' || e.key === 'Enter' || e.key === ' ' || e.key.length === 1) {
      setKeystrokesCount((prev) => prev + 1);
    }

    // Backspace handling
    if (e.key === 'Backspace') {
      if (disableBackspace) {
        e.preventDefault();
        setBackspaceWarning(true);
        setTimeout(() => setBackspaceWarning(false), 2000);
        return;
      }
      setBackspaceCount((prev) => prev + 1);
      return;
    }

    // Hindi Direct Transliteration (maps physical English QWERTY keys to Hindi Devanagari)
    if (
      language === 'hindi' &&
      useVirtualRemington &&
      e.key.length === 1 &&
      e.key !== ' ' &&
      !e.ctrlKey &&
      !e.altKey &&
      !e.metaKey
    ) {
      const hindiChar = translatePhysicalKeyToHindi(e.key, e.shiftKey, keyboardLayout);
      if (hindiChar) {
        e.preventDefault();
        const textarea = e.currentTarget;
        const start = textarea.selectionStart ?? typedText.length;
        const end = textarea.selectionEnd ?? typedText.length;
        const newText = typedText.substring(0, start) + hindiChar + typedText.substring(end);
        setTypedText(newText);
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.selectionStart = inputRef.current.selectionEnd = start + hindiChar.length;
          }
        }, 0);
        playKeyClick();
      }
    }
  };

  // Handle Submit button click
  const handleSubmitClick = () => {
    if (isFinished) return;
    if (remainingSeconds > 30 && completedWordsCount < totalWordsCount * 0.5) {
      setShowEarlySubmitModal(true);
    } else {
      finishTest();
    }
  };

  // Font class
  const fontClass =
    fontSize === 'xlarge'
      ? 'text-xl leading-relaxed'
      : fontSize === 'large'
      ? 'text-lg leading-relaxed'
      : 'text-base leading-normal';

  return (
    <div className="min-h-screen bg-[#121316] text-[#e5e7eb] flex flex-col font-sans select-none">
      {/* 1. TOP HEADER NAVIGATION BAR */}
      <header className="bg-[#18191d] border-b border-[#2c2e35] px-3 sm:px-4 py-2.5 flex flex-wrap items-center justify-between gap-2.5 z-20">
        {/* Left Controls: Back, Exam Selector, Passage Dropdown, Word Length, Word Limit, Categories */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Back Button */}
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="p-1.5 rounded-lg bg-[#242730] hover:bg-[#2f3340] border border-[#374151] text-slate-300 transition-colors"
            title="Go to Home"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          {/* Exam Selector */}
          <select
            value={selectedExamId}
            onChange={(e) => {
              const newExam = e.target.value as ExamId;
              setSelectedExamId(newExam);
              handleReset();
            }}
            className="px-2.5 py-1.5 rounded-lg bg-[#242730] hover:bg-[#2f3340] border border-[#374151] text-xs font-bold text-white cursor-pointer"
          >
            {Object.values(EXAMS_DATA).map((ex) => (
              <option key={ex.id} value={ex.id} className="bg-[#18191d] text-white">
                {ex.shortTag || ex.name}
              </option>
            ))}
          </select>

          {/* Passage Dropdown Opener */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsPassageDropdownOpen(!isPassageDropdownOpen)}
              className="px-3 py-1.5 rounded-lg bg-[#242730] hover:bg-[#2f3340] border border-[#374151] text-xs font-medium text-slate-200 flex items-center gap-1.5 max-w-[200px] sm:max-w-[280px] truncate transition-colors"
            >
              <span className="truncate">
                {activePassage.passageNumber ? `${activePassage.passageNumber}. ` : ''}
                {activePassage.title}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </button>

            {/* Passage Selection Dropdown Menu (Screenshot 2 Match) */}
            {isPassageDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-[320px] sm:w-[380px] bg-[#1a1b20] border border-[#333742] rounded-xl shadow-2xl z-50 overflow-hidden">
                {/* Search Bar inside Dropdown */}
                <div className="p-2.5 border-b border-[#2c2e35] bg-[#141519]">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      placeholder="Search passage by name or number..."
                      value={passageSearchQuery}
                      onChange={(e) => setPassageSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#242730] border border-[#374151] text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Category Pills inside Dropdown */}
                <div className="px-2.5 py-2 border-b border-[#2c2e35] flex items-center gap-1 overflow-x-auto text-[11px]">
                  {availableCategories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-2.5 py-1 rounded-md transition-colors shrink-0 font-medium ${
                        selectedCategory.toLowerCase() === cat.toLowerCase()
                          ? 'bg-blue-600 text-white'
                          : 'bg-[#242730] text-slate-300 hover:bg-[#2f3340]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Passage List */}
                <div className="max-h-72 overflow-y-auto divide-y divide-[#262830]">
                  {filteredPassages.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-400">
                      No passages found for selected filter.
                    </div>
                  ) : (
                    filteredPassages.map((p) => {
                      const isSelected = p.id === activePassage.id;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => {
                            setSelectedPassageId(p.id);
                            setIsPassageDropdownOpen(false);
                            handleReset();
                          }}
                          className={`w-full px-3 py-2.5 text-left text-xs flex items-center justify-between gap-2 transition-colors ${
                            isSelected
                              ? 'bg-blue-600/20 text-white font-semibold'
                              : 'hover:bg-[#242730] text-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className="text-slate-400 font-mono text-[11px] shrink-0">
                              {p.passageNumber ? `${p.passageNumber}.` : '•'}
                            </span>
                            <span className="truncate">{p.title}</span>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {p.isPro && (
                              <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] font-bold">
                                Pro
                              </span>
                            )}
                            {isSelected && <Check className="w-3.5 h-3.5 text-blue-400" />}
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Average Word Length Display */}
          <div className="px-2.5 py-1.5 rounded-lg bg-[#242730] border border-[#374151] text-xs font-medium text-slate-300 hidden md:block">
            Word Length: <strong className="text-white font-mono">{avgWordLength}</strong>
          </div>

          {/* Word Limit Dropdown (e.g. 100w, 200w, 300w, 420w, All) */}
          <select
            value={wordLimit}
            onChange={(e) => {
              setWordLimit(e.target.value as any);
              handleReset();
            }}
            className="px-2.5 py-1.5 rounded-lg bg-[#242730] hover:bg-[#2f3340] border border-[#374151] text-xs font-bold text-white cursor-pointer"
          >
            <option value="100">100w</option>
            <option value="200">200w</option>
            <option value="300">300w</option>
            <option value="420">420w</option>
            <option value="all">All</option>
          </select>

          {/* Category Chips in Header Bar */}
          <div className="hidden lg:flex items-center gap-1 text-xs">
            {availableCategories.filter((c) => c !== 'All').slice(0, 4).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setSelectedCategory(selectedCategory === cat ? 'All' : cat);
                }}
                className={`px-2.5 py-1 rounded-md transition-colors text-xs font-medium ${
                  selectedCategory.toLowerCase() === cat.toLowerCase()
                    ? 'bg-blue-600 text-white'
                    : 'bg-[#242730] text-slate-300 hover:bg-[#2f3340] border border-[#374151]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Right Controls: Pause/Resume, Reset Button & Settings Button */}
        <div className="flex items-center gap-2">
          {isActive && !isFinished && (
            <button
              type="button"
              onClick={handleTogglePause}
              className={`px-2.5 py-1.5 rounded-lg border text-xs font-bold transition-colors ${
                isPaused
                  ? 'bg-emerald-600 text-white border-emerald-500'
                  : 'bg-[#242730] hover:bg-[#2f3340] border-[#374151] text-amber-300'
              }`}
              title={isPaused ? 'Resume Test' : 'Pause Test'}
            >
              {isPaused ? 'Resume' : 'Pause'}
            </button>
          )}

          {/* Reset / Reload Button */}
          <button
            type="button"
            onClick={handleReset}
            className="p-1.5 rounded-lg bg-[#242730] hover:bg-[#2f3340] border border-[#374151] text-slate-300 transition-colors"
            title="Reset Typing Test"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Settings Button */}
          <button
            type="button"
            onClick={() => setIsSettingsOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-[#242730] hover:bg-[#2f3340] border border-[#374151] text-xs font-bold text-slate-200 flex items-center gap-1.5 transition-colors"
          >
            <Settings className="w-3.5 h-3.5 text-slate-300" />
            <span>Settings</span>
          </button>
        </div>
      </header>

      {/* 2. SECTIONS SUB-BAR */}
      <div className="bg-[#141519] border-b border-[#2c2e35] px-3 sm:px-4 py-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 font-semibold">Sections</span>
          <div className="flex rounded-md bg-[#242730] p-0.5 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setLanguage('english');
                setSelectedCategory('All');
                const firstEng = PASSAGES_DATA.find((p) => p.language === 'english');
                if (firstEng) setSelectedPassageId(firstEng.id);
                handleReset();
              }}
              className={`px-3 py-1 rounded transition-colors ${
                language === 'english' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              English Typing Actual
            </button>
            <button
              type="button"
              onClick={() => {
                setLanguage('hindi');
                setSelectedCategory('All');
                const firstHin = PASSAGES_DATA.find((p) => p.language === 'hindi');
                if (firstHin) setSelectedPassageId(firstHin.id);
                handleReset();
              }}
              className={`px-3 py-1 rounded transition-colors ${
                language === 'hindi' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              Hindi Typing Actual
            </button>
          </div>

          {language === 'hindi' && (
            <div className="flex flex-wrap items-center gap-1.5 pl-1">
              <div className="flex rounded-md bg-[#242730] p-0.5 text-[11px] font-bold border border-[#374151]">
                <button
                  type="button"
                  onClick={() => {
                    setKeyboardLayout('remington_gail');
                    handleReset();
                  }}
                  className={`px-2.5 py-0.5 rounded transition-colors ${
                    keyboardLayout === 'remington_gail'
                      ? 'bg-amber-500 text-slate-950 font-black'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Remington GAIL
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setKeyboardLayout('inscript');
                    handleReset();
                  }}
                  className={`px-2.5 py-0.5 rounded transition-colors ${
                    keyboardLayout === 'inscript'
                      ? 'bg-amber-500 text-slate-950 font-black'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  InScript
                </button>
              </div>

              <button
                type="button"
                onClick={() => setShowKeyboardMap(!showKeyboardMap)}
                className="px-2.5 py-1 rounded-md bg-[#242730] hover:bg-[#2f3340] border border-[#374151] text-[11px] font-semibold text-amber-300 flex items-center gap-1"
              >
                <Keyboard className="w-3 h-3" />
                <span>Hindi Key Map</span>
              </button>
            </div>
          )}
        </div>

        {/* Duration & Timer Display */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-300">
            <span>Duration:</span>
            <select
              value={durationSeconds}
              onChange={(e) => {
                setDurationSeconds(Number(e.target.value));
                handleReset();
              }}
              className="px-2 py-1 rounded bg-[#242730] border border-[#374151] text-xs font-bold text-white cursor-pointer"
            >
              <option value="60">1 min</option>
              <option value="180">3 min</option>
              <option value="300">5 min</option>
              <option value="600">10 min</option>
              <option value="900">15 min</option>
            </select>
          </div>

          {/* Time Remaining Clock */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono font-bold ${
              remainingSeconds < 60
                ? 'bg-rose-950/80 text-rose-300 border border-rose-800 animate-pulse'
                : 'bg-[#242730] text-blue-300 border border-blue-900/60'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            <span>Time Left: {formatTime(remainingSeconds)}</span>
          </div>
        </div>
      </div>

      {/* Solid Blue Horizontal Divider Line */}
      <div className="h-[3px] bg-blue-600 w-full" />

      {/* 3. QUESTION TYPE BAR */}
      <div className="bg-[#18191d] px-4 py-1.5 border-b border-[#2c2e35] flex items-center justify-between text-xs text-slate-400">
        <span className="font-semibold text-slate-300">Question Type: Typing</span>
        <span className="font-mono text-slate-300">{targetWords.length} words</span>
      </div>

      {/* 4. MAIN WORKSPACE: SPLIT SCREEN (TOP REFERENCE BOX + BOTTOM TYPING TEXTAREA) + RIGHT SIDEBAR */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Main Typing Workspace */}
        <div className="flex-1 flex flex-col p-3 sm:p-4 gap-3 overflow-y-auto">
          {/* Backspace Warning Notice */}
          {backspaceWarning && (
            <div className="p-2 bg-rose-950/80 border border-rose-700 text-rose-200 text-xs rounded-lg flex items-center gap-2 animate-bounce">
              <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
              <span>
                <strong>Backspace Restriction:</strong> Backspace is disabled for this test as per official exam rules.
              </span>
            </div>
          )}

          {/* Upper Box: Reference Passage (Scrollable, word-by-word evaluation) */}
          <div className="flex-1 min-h-[220px] max-h-[340px] bg-[#1b1c20] border border-[#2c2e35] rounded-xl p-4 sm:p-5 overflow-y-auto shadow-inner relative flex flex-col">
            <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-2 flex items-center justify-between pb-1 border-b border-[#262830]">
              <span>Reference Passage (मूल पाठ)</span>
              <span className="font-mono text-[10px] text-slate-500">
                Word {Math.min(currentWordIndex + 1, targetWords.length)} of {targetWords.length}
              </span>
            </div>

            <div
              ref={referenceContainerRef}
              className={`flex-1 overflow-y-auto select-none leading-relaxed ${fontClass} ${
                language === 'hindi' ? 'font-hindi' : 'font-sans'
              }`}
            >
              {targetWords.map((word, index) => {
                const isCompleted = index < currentWordIndex;
                const isCurrent = index === currentWordIndex;
                const candidateWord = typedWords[index];
                const isCorrect = candidateWord === word;

                let wordStyle = 'text-slate-200 mr-2 inline-block';

                if (isCompleted) {
                  if (isCorrect) {
                    wordStyle = 'text-emerald-400 font-semibold mr-2 inline-block';
                  } else {
                    wordStyle =
                      'text-rose-400 bg-rose-950/60 px-1 rounded-xs underline decoration-rose-500 font-semibold mr-2 inline-block';
                  }
                } else if (isCurrent) {
                  wordStyle =
                    'bg-blue-600/40 text-white border-b-2 border-blue-400 px-1.5 py-0.5 rounded-xs font-bold mr-2 inline-block shadow-xs';
                }

                return (
                  <span
                    key={index}
                    ref={isCurrent ? activeWordRef : null}
                    className={wordStyle}
                  >
                    {word}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Lower Box: Real Typing Textarea where candidate types */}
          <div className="flex-1 min-h-[220px] max-h-[340px] bg-[#1b1c20] border border-[#2c2e35] focus-within:border-blue-500 rounded-xl p-4 sm:p-5 shadow-inner relative flex flex-col transition-colors">
            <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-2 flex items-center justify-between pb-1 border-b border-[#262830]">
              <span>Typing Area (अभ्यर्थी टंकण क्षेत्र)</span>
              <span className="text-[10px] text-slate-500 font-mono">
                Keystrokes: {effectiveKeystrokes}
              </span>
            </div>

            <textarea
              ref={inputRef}
              value={typedText}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              disabled={isFinished}
              placeholder="Click here or start typing to begin the test... Kindly type the highlighted word to proceed further."
              spellCheck={false}
              autoCapitalize="none"
              autoCorrect="off"
              autoComplete="off"
              autoFocus
              className={`w-full flex-1 bg-transparent text-white resize-none focus:outline-hidden leading-relaxed custom-scrollbar ${fontClass} ${
                language === 'hindi' ? 'font-hindi' : 'font-sans'
              }`}
            />
          </div>
        </div>

        {/* Toggle Button for Right Sidebar (< / >) */}
        <button
          type="button"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={`absolute top-1/2 -translate-y-1/2 z-30 transition-all duration-200 p-1 rounded-l-md bg-blue-600 text-white hover:bg-blue-700 shadow-md ${
            isSidebarOpen ? 'right-[280px] sm:right-[300px]' : 'right-0 rounded-l-md'
          }`}
          title={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {isSidebarOpen ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>

        {/* 5. RIGHT SIDEBAR: CANDIDATE PROFILE, OFFICIAL COUNT TABLE, INSTRUCTIONS, SUBMIT BUTTON */}
        <div
          className={`bg-[#18191d] border-l border-[#2c2e35] transition-all duration-200 flex flex-col z-10 ${
            isSidebarOpen ? 'w-[280px] sm:w-[300px] p-4' : 'w-0 overflow-hidden p-0 border-l-0'
          }`}
        >
          {isSidebarOpen && (
            <div className="flex-1 flex flex-col justify-between overflow-y-auto space-y-4 text-xs">
              {/* Top Profile Card */}
              <div className="flex flex-col items-center text-center pb-3 border-b border-[#2c2e35]">
                <div className="w-14 h-14 rounded-full bg-slate-700 border-2 border-blue-500/80 flex items-center justify-center text-slate-200 shadow-md mb-2 overflow-hidden">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={candidateName} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-7 h-7 text-slate-300" />
                  )}
                </div>
                <h3 className="font-bold text-sm text-white">{candidateName}</h3>
                <p className="text-[11px] text-blue-400 font-medium mt-0.5">
                  You are viewing {language === 'english' ? 'English' : 'Hindi'} Typing Actual
                </p>
              </div>

              {/* Official Table of Exam Counts (Screenshot Match) */}
              <div className="border border-[#2c2e35] rounded-lg overflow-hidden divide-y divide-[#2c2e35] bg-[#141519]">
                <div className="flex justify-between px-3 py-1.5 text-[11px]">
                  <span className="text-slate-400">Keystrokes Count</span>
                  <span className="font-bold text-white font-mono">{effectiveKeystrokes}</span>
                </div>
                <div className="flex justify-between px-3 py-1.5 text-[11px]">
                  <span className="text-slate-400">Error Count</span>
                  <span className="font-bold text-rose-400 font-mono">{errorCount}</span>
                </div>
                <div className="flex justify-between px-3 py-1.5 text-[11px]">
                  <span className="text-slate-400">Backspace Count</span>
                  <span className="font-bold text-slate-300 font-mono">{backspaceCount}</span>
                </div>
                <div className="flex justify-between px-3 py-1.5 text-[11px]">
                  <span className="text-slate-400">Total Word Count</span>
                  <span className="font-bold text-white font-mono">{totalWordsCount}</span>
                </div>
                <div className="flex justify-between px-3 py-1.5 text-[11px]">
                  <span className="text-slate-400">Typed Word Count</span>
                  <span className="font-bold text-emerald-400 font-mono">{completedWordsCount}</span>
                </div>
                <div className="flex justify-between px-3 py-1.5 text-[11px]">
                  <span className="text-slate-400">Pending Word Count</span>
                  <span className="font-bold text-amber-400 font-mono">{pendingWordsCount}</span>
                </div>
              </div>

              {/* Live Velocity / Diagnostics Strip */}
              <div className="grid grid-cols-3 gap-1.5 text-center">
                <div className="p-2 rounded-lg bg-[#242730] border border-[#374151]">
                  <span className="text-[9px] text-slate-400 uppercase block font-semibold">Net WPM</span>
                  <span className="font-mono font-bold text-sm text-blue-400">{netWpm}</span>
                </div>
                <div className="p-2 rounded-lg bg-[#242730] border border-[#374151]">
                  <span className="text-[9px] text-slate-400 uppercase block font-semibold">Gross</span>
                  <span className="font-mono font-bold text-sm text-slate-200">{grossWpm}</span>
                </div>
                <div className="p-2 rounded-lg bg-[#242730] border border-[#374151]">
                  <span className="text-[9px] text-slate-400 uppercase block font-semibold">Accuracy</span>
                  <span className="font-mono font-bold text-sm text-emerald-400">{accuracy}%</span>
                </div>
              </div>

              {/* Instructions Card (Screenshot Exact Match) */}
              <div className="p-3 rounded-lg bg-[#141519] border border-[#2c2e35] text-[10px] text-slate-300 space-y-1.5 leading-relaxed">
                <span className="font-bold text-white text-[11px] block border-b border-[#2c2e35] pb-1">
                  Instructions
                </span>
                <p>• Kindly type the highlighted word to proceed further.</p>
                <p>• Kindly note, you can edit the text contents that you have typed.</p>
                <p>• Correct/Wrong words turn Green/Red respectively.</p>
                <p>• Kindly note, it is mandatory for you to type the entire text contents to submit.</p>
                <p>• Upon timeout, the system will automatically submit your response.</p>
              </div>

              {/* Large Blue Submit Button */}
              <button
                type="button"
                id="exam-submit-button"
                onClick={handleSubmitClick}
                className="w-full py-3 rounded-lg bg-[#1d4ed8] hover:bg-[#1e40af] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <Send className="w-4 h-4" />
                <span>Submit</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 6. SETTINGS MODAL */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#18191d] border border-[#2c2e35] rounded-2xl p-5 shadow-2xl text-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-[#2c2e35] pb-3">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Settings className="w-4 h-4 text-blue-400" />
                Exam Interface Settings
              </h3>
              <button
                type="button"
                onClick={() => setIsSettingsOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {/* Font Size */}
              <div className="flex items-center justify-between py-1">
                <span className="font-semibold text-slate-300">Font Size:</span>
                <div className="flex rounded-lg bg-[#242730] p-1">
                  {(['normal', 'large', 'xlarge'] as const).map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setFontSize(sz)}
                      className={`px-2.5 py-1 rounded text-xs capitalize ${
                        fontSize === sz ? 'bg-blue-600 text-white font-bold' : 'text-slate-300'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Hindi Keyboard Layout */}
              {language === 'hindi' && (
                <div className="flex items-center justify-between py-1">
                  <span className="font-semibold text-slate-300">Hindi Layout:</span>
                  <select
                    value={keyboardLayout}
                    onChange={(e) => setKeyboardLayout(e.target.value as HindiKeyboardLayout)}
                    className="px-2.5 py-1 rounded bg-[#242730] border border-[#374151] text-xs font-bold text-white"
                  >
                    <option value="remington_gail">Remington GAIL</option>
                    <option value="inscript">InScript (Official)</option>
                  </select>
                </div>
              )}

              {/* Virtual Remington Converter */}
              {language === 'hindi' && (
                <div className="flex items-center justify-between py-1">
                  <div>
                    <span className="font-semibold text-slate-300 block">Virtual Remington Converter</span>
                    <span className="text-[10px] text-slate-400">Type Hindi with standard English keyboard</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={useVirtualRemington}
                    onChange={(e) => setUseVirtualRemington(e.target.checked)}
                    className="rounded text-blue-600 w-4 h-4"
                  />
                </div>
              )}

              {/* Backspace Restriction */}
              <div className="flex items-center justify-between py-1">
                <div>
                  <span className="font-semibold text-slate-300 block">Strict Backspace Lock</span>
                  <span className="text-[10px] text-slate-400">Simulate strict judicial hall rules</span>
                </div>
                <input
                  type="checkbox"
                  checked={disableBackspace}
                  onChange={(e) => setDisableBackspace(e.target.checked)}
                  className="rounded text-blue-600 w-4 h-4"
                />
              </div>

              {/* Typing Click Sound */}
              <div className="flex items-center justify-between py-1">
                <span className="font-semibold text-slate-300">Mechanical Key Sound:</span>
                <button
                  type="button"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`px-3 py-1 rounded-lg border text-xs font-bold flex items-center gap-1 ${
                    soundEnabled
                      ? 'bg-blue-600/20 text-blue-300 border-blue-500'
                      : 'bg-[#242730] text-slate-400 border-[#374151]'
                  }`}
                >
                  {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                  <span>{soundEnabled ? 'Enabled' : 'Muted'}</span>
                </button>
              </div>

              {/* Keyboard Map helper */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsSettingsOpen(false);
                    setShowKeyboardMap(true);
                  }}
                  className="w-full py-2 rounded-lg bg-[#242730] hover:bg-[#2f3340] border border-[#374151] text-xs font-semibold text-slate-200 flex items-center justify-center gap-1.5"
                >
                  <Keyboard className="w-3.5 h-3.5 text-blue-400" />
                  <span>View Virtual Keyboard Layout Map</span>
                </button>
              </div>
            </div>

            <div className="border-t border-[#2c2e35] pt-3 flex justify-end">
              <button
                type="button"
                onClick={() => setIsSettingsOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
              >
                Save & Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. VIRTUAL KEYBOARD MAP MODAL */}
      {showKeyboardMap && (
        <VirtualKeyboardMap
          layout={language === 'hindi' ? keyboardLayout : 'standard'}
          onClose={() => setShowKeyboardMap(false)}
        />
      )}

      {/* 8. EARLY SUBMIT CONFIRMATION MODAL */}
      <EarlySubmitModal
        isOpen={showEarlySubmitModal}
        onCancel={() => setShowEarlySubmitModal(false)}
        onConfirm={() => {
          setShowEarlySubmitModal(false);
          finishTest();
        }}
        remainingSeconds={remainingSeconds}
        typedWords={completedWordsCount}
        totalWords={totalWordsCount}
      />

      {/* 9. TEST RESULT MODAL OVERLAY */}
      {activeResult && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm overflow-y-auto p-4 sm:p-6 flex items-start justify-center">
          <div className="w-full max-w-4xl my-auto">
            <ResultModal
              result={activeResult}
              exam={currentExam}
              onRestart={handleReset}
              onNextTest={() => {
                handleReset();
                const currIdx = availablePassages.findIndex((p) => p.id === selectedPassageId);
                const nextPass = availablePassages[(currIdx + 1) % availablePassages.length];
                if (nextPass) {
                  setSelectedPassageId(nextPass.id);
                }
              }}
              onGoToDashboard={() => onNavigate('dashboard')}
              onNavigateHome={() => onNavigate('home')}
            />
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ExamId, Language, HindiKeyboardLayout, Passage, TestResultRecord, TypingMetrics } from '../types';
import { calculateTypingMetrics, ExamScoreResult } from '../engine/metrics';
import { translatePhysicalKeyToHindi, transliterateNewInputToHindi } from '../engine/hindiKeyboards';
import { QWERTY_FINGER_MAP } from '../data/touchTypingData';
import {
  RotateCcw,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Keyboard,
  Clock,
  Hand,
  ShieldAlert,
  Sparkles,
  Zap,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  AlertCircle,
  Activity,
  Send
} from 'lucide-react';
import { VirtualKeyboardMap } from './VirtualKeyboardMap';
import { EarlySubmitModal } from './EarlySubmitModal';

interface TypingEngineProps {
  passage: Passage;
  durationSeconds: number;
  examId?: ExamId | 'general';
  keyboardLayout?: 'standard' | HindiKeyboardLayout;
  mode?: 'exam' | 'practice';
  disableBackspace?: boolean;
  showFingerHint?: boolean;
  onTestComplete: (result: TestResultRecord) => void;
  onExit?: () => void;
}

export const TypingEngine: React.FC<TypingEngineProps> = ({
  passage,
  durationSeconds,
  examId = 'general' as ExamId | 'general',
  keyboardLayout = 'standard' as 'standard' | HindiKeyboardLayout,
  mode = 'practice',
  disableBackspace = false,
  showFingerHint = true,
  onTestComplete,
  onExit
}) => {
  // Typing state
  const [typedText, setTypedText] = useState('');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [backspaceCount, setBackspaceCount] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('large');
  const [showKeyboardMap, setShowKeyboardMap] = useState(false);
  const [backspaceBlockedWarning, setBackspaceBlockedWarning] = useState(false);
  const [useVirtualRemington, setUseVirtualRemington] = useState(true);
  const [showEarlySubmitModal, setShowEarlySubmitModal] = useState(false);
  const [statsCollapsed, setStatsCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('tw_stats_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const toggleStatsCollapsed = () => {
    setStatsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('tw_stats_collapsed', String(next));
      } catch {}
      return next;
    });
  };

  // References
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const timerRef = useRef<number | null>(null);
  const lastTickRef = useRef<number | null>(null);
  const activeCharRef = useRef<HTMLSpanElement | null>(null);
  const passageContainerRef = useRef<HTMLDivElement | null>(null);
  const wakeLockRef = useRef<any>(null);

  const targetText = passage.content;
  const remainingSeconds = Math.max(0, durationSeconds - Math.floor(elapsedSeconds));

  // Screen Wake Lock API to keep screen alive during 10/15 min typing tests
  useEffect(() => {
    const acquireWakeLock = async () => {
      try {
        if ('wakeLock' in navigator && isActive && !isPaused && !isFinished) {
          wakeLockRef.current = await (navigator as any).wakeLock.request('screen');
        }
      } catch (err) {
        // Wake lock may fail due to battery savers or permission policies
      }
    };

    if (isActive && !isPaused && !isFinished) {
      acquireWakeLock();
    } else if (wakeLockRef.current) {
      wakeLockRef.current.release?.().catch(() => {});
      wakeLockRef.current = null;
    }

    return () => {
      if (wakeLockRef.current) {
        wakeLockRef.current.release?.().catch(() => {});
      }
    };
  }, [isActive, isPaused, isFinished]);

  // Real-time metrics computed via master exam scoring engine
  const currentMetrics: ExamScoreResult = calculateTypingMetrics(
    typedText,
    targetText,
    typedText.length > 0 ? Math.max(1.5, elapsedSeconds) : 0,
    durationSeconds,
    backspaceCount,
    examId,
    passage.language
  );

  // Scroll active character into view
  useEffect(() => {
    if (activeCharRef.current && passageContainerRef.current) {
      const charEl = activeCharRef.current;
      const container = passageContainerRef.current;
      const charTop = charEl.offsetTop - container.offsetTop;
      if (charTop > container.clientHeight * 0.6 || charTop < container.scrollTop) {
        container.scrollTop = charTop - 60;
      }
    }
  }, [typedText]);

  // Audio effect (gentle web audio click)
  const playKeyClick = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.04);
    } catch {
      // AudioContext unavailable
    }
  }, [soundEnabled]);

  // Handle test completion
  const finishTest = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsActive(false);
    setIsFinished(true);

    const finalElapsed = Math.max(1.5, elapsedSeconds);
    const finalMetrics = calculateTypingMetrics(
      typedText,
      targetText,
      finalElapsed,
      durationSeconds,
      backspaceCount,
      examId,
      passage.language
    );

    const resultRecord: TestResultRecord = {
      id: 'test_' + Date.now(),
      timestamp: Date.now(),
      examId: examId || 'general',
      examName: examId === 'cpct' ? 'MP CPCT' : examId ? examId.toUpperCase() : 'General Practice',
      language: passage.language,
      keyboardLayout,
      durationSeconds: Math.round(finalElapsed),
      passageTitle: passage.title,
      passageId: passage.id,
      metrics: finalMetrics
    };

    onTestComplete(resultRecord);
  }, [
    typedText,
    targetText,
    elapsedSeconds,
    durationSeconds,
    backspaceCount,
    examId,
    passage,
    keyboardLayout,
    onTestComplete
  ]);

  // Main countdown/elapsed timer using wall-clock deltas
  useEffect(() => {
    if (isActive && !isPaused && !isFinished) {
      lastTickRef.current = Date.now();
      timerRef.current = window.setInterval(() => {
        const now = Date.now();
        const delta = lastTickRef.current ? (now - lastTickRef.current) / 1000 : 0.25;
        lastTickRef.current = now;
        setElapsedSeconds((prev) => {
          const next = prev + delta;
          if (next >= durationSeconds) {
            clearInterval(timerRef.current!);
            return durationSeconds;
          }
          return next;
        });
      }, 250);
    } else {
      lastTickRef.current = null;
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, isPaused, isFinished, durationSeconds]);

  // Check for time expiry or completed text
  useEffect(() => {
    if (isActive && !isFinished) {
      if (elapsedSeconds >= durationSeconds && durationSeconds > 0) {
        finishTest();
      } else if (typedText.length >= targetText.length && targetText.length > 0) {
        finishTest();
      }
    }
  }, [elapsedSeconds, durationSeconds, typedText.length, targetText.length, isActive, isFinished, finishTest]);

  // Key down tracking for Backspace count, shortcuts & virtual transliteration
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (isFinished) return;

    if (!isActive && !isPaused && e.key.length === 1) {
      lastTickRef.current = Date.now();
      setIsActive(true);
    }

    // Exam mode anti-cheat: prevent common shortcuts
    if (mode === 'exam') {
      if (e.ctrlKey && (e.key === 'a' || e.key === 'c' || e.key === 'v' || e.key === 'x')) {
        e.preventDefault();
        return;
      }
    }

    if (e.key === 'Backspace') {
      if (disableBackspace) {
        e.preventDefault();
        setBackspaceBlockedWarning(true);
        setTimeout(() => setBackspaceBlockedWarning(false), 2500);
        return;
      }
      setBackspaceCount((prev) => prev + 1);
    }

    // Virtual Remington/InScript transliteration for physical QWERTY keyboards without native Hindi IME
    if (
      passage.language === 'hindi' &&
      useVirtualRemington &&
      e.key.length === 1 &&
      e.key !== ' ' &&
      !e.ctrlKey &&
      !e.altKey &&
      !e.metaKey
    ) {
      const converted = translatePhysicalKeyToHindi(
        e.key,
        e.shiftKey,
        (keyboardLayout as HindiKeyboardLayout) || 'remington_gail'
      );
      if (converted) {
        e.preventDefault();
        setTypedText((prev) => {
          if (prev.length <= targetText.length + 20) {
            return prev + converted;
          }
          return prev;
        });
      }
    }

    playKeyClick();
  };

  // Textarea change handler
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (isFinished || isPaused) return;

    let val = e.target.value;
    if (!isActive && val.length > 0) {
      setIsActive(true);
    }

    if (passage.language === 'hindi' && useVirtualRemington && val.length > typedText.length) {
      val = transliterateNewInputToHindi(
        typedText,
        val,
        (keyboardLayout as HindiKeyboardLayout) || 'remington_gail'
      );
    }

    if (val.length <= targetText.length + 20) {
      setTypedText(val);
    }
  };

  // Control handlers
  const handleTogglePause = () => {
    if (isPaused) {
      setIsPaused(false);
      inputRef.current?.focus();
    } else {
      setIsPaused(true);
    }
  };

  const handleRestart = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTypedText('');
    setElapsedSeconds(0);
    setIsActive(false);
    setIsPaused(false);
    setIsFinished(false);
    setBackspaceCount(0);
    if (passageContainerRef.current) {
      passageContainerRef.current.scrollTop = 0;
    }
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  // Render passage with character-level accuracy highlights
  const renderPassageCharacters = () => {
    const chars: React.ReactNode[] = [];
    const targetLen = targetText.length;
    const typedLen = typedText.length;

    for (let i = 0; i < targetLen; i++) {
      const targetChar = targetText[i];
      let className = 'transition-colors ';

      if (i < typedLen) {
        const typedChar = typedText[i];
        if (typedChar === targetChar) {
          className += 'text-emerald-700 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-950/60 font-semibold';
        } else {
          className += 'text-rose-700 dark:text-rose-200 bg-rose-200 dark:bg-rose-950/80 font-bold underline decoration-rose-500';
        }
      } else if (i === typedLen) {
        className += 'bg-blue-600 text-white rounded-xs font-bold typing-cursor px-0.5 shadow-xs';
      } else {
        className += 'text-slate-600 dark:text-slate-400';
      }

      const isCurrent = i === typedLen;

      chars.push(
        <span
          key={i}
          ref={isCurrent ? activeCharRef : null}
          className={className}
        >
          {targetChar}
        </span>
      );
    }

    return chars;
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const textFontClass =
    fontSize === 'xlarge'
      ? 'text-2xl leading-relaxed tracking-wide'
      : fontSize === 'large'
      ? 'text-xl leading-relaxed tracking-normal'
      : 'text-lg leading-relaxed';

  const isHindi = passage.language === 'hindi';
  const showKdphBadge = examId === 'ssc-chsl' || examId === 'ssc-cgl-dest';

  const nextChar = typedText.length < targetText.length ? targetText[typedText.length] : '';
  const nextCharFinger = nextChar ? QWERTY_FINGER_MAP[nextChar.toLowerCase()] : undefined;

  const typedWords = typedText.trim().length > 0 ? typedText.trim().split(/\s+/).length : 0;
  const totalWords = passage.wordCount || (targetText.trim().length > 0 ? targetText.trim().split(/\s+/).length : 0);
  const progressPercent = Math.min(100, Math.round((typedText.length / Math.max(1, targetText.length)) * 100));

  const handleRequestSubmit = () => {
    if (!isActive && typedText.length === 0) return;
    if (remainingSeconds > 5 || typedWords < totalWords * 0.9) {
      setShowEarlySubmitModal(true);
    } else {
      finishTest();
    }
  };

  return (
    <div id="typing-engine-root" className="w-full mx-auto space-y-4">
      {/* Backspace Blocked Notice in Exam Mode */}
      {backspaceBlockedWarning && (
        <div className="p-3 bg-rose-500 text-white rounded-xl text-xs font-bold shadow-lg flex items-center justify-between animate-bounce">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>Exam Mode Rule: Backspace is strictly disabled for this examination simulation!</span>
          </div>
          <span className="text-[10px] bg-rose-700 px-2 py-0.5 rounded">TCS Rule</span>
        </div>
      )}

      {/* Top Status & Quick Controls Ribbon */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-3.5 sm:p-4 flex flex-wrap items-center justify-between gap-3">
        {/* Timer Display & Mode Badge */}
        <div className="flex items-center space-x-3">
          <div className={`p-2.5 rounded-xl flex items-center justify-center transition-colors ${
            remainingSeconds <= 30 && isActive
              ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 animate-pulse'
              : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300'
          }`}>
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {durationSeconds > 0 ? 'Remaining Time' : 'Elapsed Time'}
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                mode === 'exam'
                  ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
                  : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
              }`}>
                {mode === 'exam' ? 'Exam Mode' : 'Practice Mode'}
              </span>
            </div>
            <div className={`text-2xl font-black tabular-nums font-mono ${
              remainingSeconds <= 30 && isActive ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white'
            }`}>
              {formatTime(remainingSeconds)}
            </div>
          </div>
        </div>

        {/* Mobile/Tablet Compact Metrics Strip */}
        <div className="flex items-center space-x-2 lg:hidden">
          <div className="bg-slate-50 dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-center">
            <span className="text-[9px] uppercase font-bold text-slate-400 block">Net WPM</span>
            <span className="text-base font-black text-indigo-600 dark:text-indigo-400 font-mono">{currentMetrics.netWpm}</span>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-center">
            <span className="text-[9px] uppercase font-bold text-slate-400 block">Acc</span>
            <span className="text-base font-black text-emerald-600 dark:text-emerald-400 font-mono">{currentMetrics.accuracy}%</span>
          </div>
        </div>

        {/* Toolbar Utility Controls */}
        <div className="flex items-center space-x-1.5 ml-auto">
          {/* Pause / Resume */}
          {isActive && (
            <button
              id="engine-pause-toggle"
              type="button"
              onClick={handleTogglePause}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={isPaused ? 'Resume Test' : 'Pause Test'}
            >
              {isPaused ? <Play className="w-4 h-4 text-emerald-600" /> : <Pause className="w-4 h-4 text-amber-600" />}
            </button>
          )}

          {/* Restart */}
          <button
            id="engine-restart-btn"
            type="button"
            onClick={handleRestart}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Restart Test"
          >
            <RotateCcw className="w-4 h-4 text-slate-600 dark:text-slate-400" />
          </button>

          {/* Sound Toggle */}
          <button
            id="engine-sound-toggle"
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-lg border transition-colors ${
              soundEnabled ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300' : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title={soundEnabled ? 'Sound On' : 'Sound Off'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Font Size Selector */}
          <div className="flex rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden text-xs">
            <button
              type="button"
              onClick={() => setFontSize('normal')}
              className={`px-2 py-1.5 font-medium ${fontSize === 'normal' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
              title="Normal Font Size"
            >
              A
            </button>
            <button
              type="button"
              onClick={() => setFontSize('large')}
              className={`px-2.5 py-1.5 font-bold ${fontSize === 'large' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
              title="Large Font Size"
            >
              A+
            </button>
            <button
              type="button"
              onClick={() => setFontSize('xlarge')}
              className={`px-2.5 py-1.5 font-extrabold ${fontSize === 'xlarge' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
              title="Extra Large Font Size"
            >
              A++
            </button>
          </div>

          {/* Hindi Layout Helper */}
          {isHindi && (
            <button
              id="engine-keyboard-map-btn"
              type="button"
              onClick={() => setShowKeyboardMap(!showKeyboardMap)}
              className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold flex items-center space-x-1 ${
                showKeyboardMap ? 'bg-indigo-600 text-white border-indigo-600' : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Keyboard className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Layout Map</span>
            </button>
          )}

          {/* Toggle Right Statistics Panel */}
          <button
            id="toggle-stats-panel-btn"
            type="button"
            onClick={toggleStatsCollapsed}
            className={`hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
              statsCollapsed
                ? 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
            }`}
            title={statsCollapsed ? 'Show live stats sidebar' : 'Hide stats sidebar for wide typing'}
          >
            <Activity className="w-3.5 h-3.5 text-indigo-600" />
            <span>{statsCollapsed ? 'Show Stats' : 'Wide Arena'}</span>
          </button>
        </div>
      </div>

      {/* Keyboard Map Modal if toggled */}
      {showKeyboardMap && (
        <VirtualKeyboardMap
          layout={keyboardLayout}
          onClose={() => setShowKeyboardMap(false)}
        />
      )}

      {/* Hindi Virtual Transliterator Option */}
      {isHindi && (
        <div className="flex items-center justify-between px-3 py-2 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-xl text-xs text-amber-900 dark:text-amber-200">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>
              <strong>Direct Remington Gail Conversion:</strong> Type Hindi directly using standard English QWERTY keys without installing Mangal IME.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setUseVirtualRemington(!useVirtualRemington)}
            className={`px-3 py-1 rounded-lg font-bold text-xs transition-colors shrink-0 ${
              useVirtualRemington
                ? 'bg-amber-600 text-white'
                : 'bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300'
            }`}
          >
            {useVirtualRemington ? 'Enabled ✓' : 'Enable Converter'}
          </button>
        </div>
      )}

      {/* Main Two-Column Body: Center Arena (left/center) + Right Statistics Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Center Typing Arena */}
        <div className={`${statsCollapsed ? 'lg:col-span-12' : 'lg:col-span-9'} col-span-12 space-y-3`}>
          {/* Passage Metadata Strip */}
          <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1 gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-slate-800 dark:text-slate-100">
                {passage.passageNumber ? `#${passage.passageNumber} ` : ''}{passage.title}
              </span>
              {passage.domain && (
                <span className="bg-indigo-100 dark:bg-indigo-950/70 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60 px-2 py-0.5 rounded-full font-bold text-[10px] tracking-wide">
                  {passage.domain}
                </span>
              )}
              {passage.isPro && (
                <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.2 rounded-full text-[10px] font-bold">
                  <Sparkles className="w-2.5 h-2.5 text-amber-600" /> PRO
                </span>
              )}
              <span>•</span>
              <span className="capitalize">{passage.difficulty.replace('_', ' ')}</span>
              <span>•</span>
              <span className="font-mono text-[10px]">
                {isHindi ? `Hindi (${keyboardLayout === 'remington_gail' ? 'Remington GAIL' : 'InScript'})` : 'English QWERTY'}
              </span>
              {disableBackspace && (
                <span className="bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 px-1.5 py-0.5 rounded font-bold text-[10px]">
                  Backspace Disabled
                </span>
              )}
            </div>
            <div className="flex items-center space-x-3 text-slate-400 dark:text-slate-500">
              <span>Words: <strong className="text-slate-700 dark:text-slate-300">{typedWords} / {totalWords}</strong></span>
              <span>Progress: <strong className="text-indigo-600 dark:text-indigo-400">{progressPercent}%</strong></span>
            </div>
          </div>

          {/* Live Finger Guidance */}
          {showFingerHint && nextChar && nextCharFinger && (
            <div className="p-3 bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-900 rounded-xl flex items-center justify-between text-xs transition-all shadow-xs">
              <div className="flex items-center space-x-2.5">
                <div className="p-1 rounded-lg bg-indigo-600 text-white font-black text-xs">
                  <Hand className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">अगला बटन (Next Key): </span>
                  <span className="font-mono font-black text-sm uppercase text-indigo-700 dark:text-indigo-300 bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-700 mx-1">
                    {nextChar === ' ' ? 'Spacebar' : nextChar}
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    👉 उंगली: <span className="text-indigo-700 dark:text-indigo-300">{nextCharFinger.fingerHindi}</span>
                  </span>
                </div>
              </div>
              <span className="hidden sm:inline-block text-[11px] text-slate-500 dark:text-slate-400 italic">
                {nextCharFinger.tipHindi}
              </span>
            </div>
          )}

          {/* Interactive Passage Display & Hidden Typing Input Area */}
          <div
            id="typing-passage-box"
            className="relative bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-200 dark:border-slate-800 focus-within:border-indigo-500 dark:focus-within:border-indigo-500 shadow-sm transition-all overflow-hidden cursor-text"
            onClick={() => inputRef.current?.focus()}
          >
            {/* Master Text Passage Box (Character-by-character render with auto-scroll) */}
            <div
              ref={passageContainerRef}
              className={`h-72 sm:h-80 overflow-y-auto p-6 select-none custom-scrollbar ${textFontClass} ${
                isHindi ? 'font-hindi' : 'font-sans'
              }`}
              style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
            >
              {renderPassageCharacters()}
            </div>

            {/* Instruction overlay before test starts */}
            {!isActive && !isFinished && typedText.length === 0 && (
              <div
                className="absolute inset-0 bg-slate-900/10 dark:bg-slate-950/30 backdrop-blur-[1px] flex flex-col items-center justify-center p-4 text-center cursor-pointer"
                onClick={() => inputRef.current?.focus()}
              >
                <div className="bg-white/95 dark:bg-slate-900/95 px-6 py-4 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 max-w-md animate-bounce">
                  <p className="text-base font-bold text-slate-900 dark:text-white">
                    Click here or start typing to begin the test
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    The timer will start automatically on your first keystroke.
                  </p>
                </div>
              </div>
            )}

            {/* Paused Overlay */}
            {isPaused && (
              <div className="absolute inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center z-10">
                <div className="bg-white dark:bg-slate-900 px-8 py-6 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 max-w-sm">
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Test Paused</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                    Your timer and accuracy states are securely held.
                  </p>
                  <button
                    type="button"
                    onClick={handleTogglePause}
                    className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-500/20"
                  >
                    Resume Typing
                  </button>
                </div>
              </div>
            )}

            {/* Hidden active textarea capturing natural keyboard input */}
            <textarea
              id="real-typing-input"
              ref={inputRef}
              value={typedText}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onPaste={(e) => {
                if (mode === 'exam') {
                  e.preventDefault();
                }
              }}
              autoFocus
              spellCheck={false}
              autoCapitalize="none"
              autoCorrect="off"
              autoComplete="off"
              className="absolute -top-9999px left-0 opacity-0 pointer-events-auto h-1 w-1"
              aria-label="Typing input box"
            />
          </div>

          {/* Sticky Bottom Permanently Accessible Action Bar */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-3 sm:p-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
            {/* Progress Bar & Word Counter */}
            <div className="flex-1 min-w-[200px] space-y-1">
              <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-300">
                <span>Passage Completion</span>
                <span className="font-mono">{typedWords} of {totalWords} words ({progressPercent}%)</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-600 transition-all duration-300 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Submit Action Button */}
            <div className="flex items-center gap-2">
              <button
                id="engine-submit-test-btn"
                type="button"
                onClick={handleRequestSubmit}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 hover:shadow-emerald-600/20 active:scale-95"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Exam (टेस्ट सबमिट करें)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Live Statistics Panel */}
        {!statsCollapsed && (
          <div className="hidden lg:flex lg:col-span-3 flex-col gap-3 sticky top-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-indigo-600" /> Live Diagnostics
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  currentMetrics.isQualified
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-slate-100 text-slate-600'
                }`}>
                  {currentMetrics.isQualified ? 'Qualified ✓' : 'In Progress'}
                </span>
              </div>

              {/* Primary Cards: Net WPM & Accuracy */}
              <div className="grid grid-cols-2 gap-2.5">
                {/* Net WPM */}
                <div className="p-3 bg-indigo-50/70 dark:bg-indigo-950/40 rounded-xl border border-indigo-200 dark:border-indigo-900 text-center">
                  <span className="text-[10px] font-bold uppercase text-indigo-700 dark:text-indigo-400 block">
                    Net WPM
                  </span>
                  <span className="text-2xl font-black text-indigo-900 dark:text-indigo-200 tabular-nums font-mono">
                    {currentMetrics.netWpm}
                  </span>
                  <span className="text-[9px] text-indigo-600 block mt-0.5">
                    Target: {currentMetrics.targetSpeed} WPM
                  </span>
                </div>

                {/* Accuracy */}
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                  <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 block">
                    Accuracy
                  </span>
                  <span className={`text-2xl font-black tabular-nums font-mono ${
                    currentMetrics.accuracy >= 95
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : currentMetrics.accuracy >= 85
                      ? 'text-amber-600 dark:text-amber-400'
                      : 'text-rose-600 dark:text-rose-400'
                  }`}>
                    {currentMetrics.accuracy}%
                  </span>
                  <span className="text-[9px] text-slate-500 block mt-0.5">
                    Grade: {currentMetrics.grade}
                  </span>
                </div>
              </div>

              {/* Secondary Metrics List */}
              <div className="space-y-2 text-xs divide-y divide-slate-100 dark:divide-slate-800">
                <div className="flex justify-between items-center pt-1.5">
                  <span className="text-slate-500 dark:text-slate-400">Gross WPM:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">{currentMetrics.grossWpm}</span>
                </div>

                {showKdphBadge && (
                  <div className="flex justify-between items-center pt-1.5">
                    <span className="text-slate-500 dark:text-slate-400">KDPH (Rate):</span>
                    <span className="font-bold text-purple-600 dark:text-purple-400 font-mono">{currentMetrics.kdph}</span>
                  </div>
                )}

                <div className="flex justify-between items-center pt-1.5">
                  <span className="text-slate-500 dark:text-slate-400">Total Errors:</span>
                  <span className={`font-bold font-mono ${currentMetrics.errors > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-700 dark:text-slate-300'}`}>
                    {currentMetrics.errors}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-1.5">
                  <span className="text-slate-500 dark:text-slate-400">Backspaces:</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300 font-mono">{backspaceCount}</span>
                </div>

                <div className="flex justify-between items-center pt-1.5">
                  <span className="text-slate-500 dark:text-slate-400">Keystrokes:</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300 font-mono">{typedText.length}</span>
                </div>

                <div className="flex justify-between items-center pt-1.5">
                  <span className="text-slate-500 dark:text-slate-400">Words Typed:</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300 font-mono">{typedWords} / {totalWords}</span>
                </div>
              </div>

              {/* Live Formula Description */}
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">
                <span className="font-bold text-slate-700 dark:text-slate-300 block mb-0.5">Scoring Model:</span>
                {currentMetrics.scoringFormulaName}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Early Submit Confirmation Modal */}
      <EarlySubmitModal
        isOpen={showEarlySubmitModal}
        onCancel={() => setShowEarlySubmitModal(false)}
        onConfirm={() => {
          setShowEarlySubmitModal(false);
          finishTest();
        }}
        remainingSeconds={remainingSeconds}
        typedWords={typedWords}
        totalWords={totalWords}
      />
    </div>
  );
};

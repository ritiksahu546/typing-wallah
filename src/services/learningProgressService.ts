import { auth, db } from './firebase';
import {
  doc,
  getDoc,
  setDoc,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp
} from 'firebase/firestore';
import {
  TouchTypingCourseLesson,
  LessonAttemptResult,
  UserCourseProgress,
  DailyPracticeGoal
} from '../types/touchTypingCourse';
import { BUILTIN_COURSE_LESSONS } from '../data/touchTypingCourseCurriculum';

const STORAGE_KEYS = {
  PROGRESS_PREFIX: 'tw_learning_progress_',
  ATTEMPTS_PREFIX: 'tw_learning_attempts_',
  DAILY_GOAL: 'tw_learning_daily_goal',
  CUSTOM_LESSONS: 'tw_learning_custom_lessons'
};

const DEFAULT_PROGRESS: UserCourseProgress = {
  userId: 'guest',
  currentLessonNumber: 1,
  highestUnlockedLessonNumber: 1, // Lesson 1 is unlocked, Lesson 2+ are locked initially
  completedLessonIds: [],
  bestWpm: 0,
  avgWpm: 0,
  avgAccuracy: 100,
  totalAttempts: 0,
  passedAttempts: 0,
  currentStreak: 1,
  lastActiveDate: new Date().toISOString().split('T')[0],
  todayWordsTyped: 0,
  todayPracticeTimeSeconds: 0,
  lastUpdated: Date.now()
};

export const LearningProgressService = {
  /**
   * Retrieves course progress for the current user.
   * Checks Firestore first if logged in, with seamless offline LocalStorage cache fallback.
   */
  async getUserCourseProgress(userId?: string): Promise<UserCourseProgress> {
    const uid = userId || auth.currentUser?.uid || 'guest';
    const localKey = `${STORAGE_KEYS.PROGRESS_PREFIX}${uid}`;

    // Read local cache first for instant responsiveness
    let localProgress: UserCourseProgress = { ...DEFAULT_PROGRESS, userId: uid };
    try {
      const cached = localStorage.getItem(localKey);
      if (cached) {
        localProgress = JSON.parse(cached);
      }
    } catch {
      // Ignore JSON parse errors
    }

    // If authenticated, sync with Firestore to support cross-device persistence (Website, Android, Windows)
    if (auth.currentUser && uid !== 'guest') {
      try {
        const progressDocRef = doc(db, 'users', uid, 'learning_progress', 'course');
        const snap = await getDoc(progressDocRef);
        if (snap.exists()) {
          const remoteData = snap.data() as Partial<UserCourseProgress>;
          // Merge remote with highest unlocked guarantee
          const merged: UserCourseProgress = {
            ...localProgress,
            ...remoteData,
            userId: uid,
            highestUnlockedLessonNumber: Math.max(
              localProgress.highestUnlockedLessonNumber || 1,
              remoteData.highestUnlockedLessonNumber || 1
            ),
            completedLessonIds: Array.from(
              new Set([
                ...(localProgress.completedLessonIds || []),
                ...(remoteData.completedLessonIds || [])
              ])
            )
          };
          localStorage.setItem(localKey, JSON.stringify(merged));
          return merged;
        } else {
          // Initialize remote document
          await setDoc(progressDocRef, {
            ...localProgress,
            lastUpdated: Date.now()
          });
        }
      } catch (err) {
        console.warn('Firestore progress load error (using local cache):', err);
      }
    }

    return localProgress;
  },

  /**
   * Evaluates and records a lesson attempt.
   * Enforces that a lesson is unlocked only when the previous lesson is genuinely PASSED.
   */
  async recordLessonAttempt(
    attempt: Omit<LessonAttemptResult, 'id' | 'passed' | 'timestamp' | 'date' | 'lessonName' | 'attemptNumber'> & {
      date?: string;
      lessonName?: string;
      attemptNumber?: number;
    },
    lesson: TouchTypingCourseLesson
  ): Promise<{
    passed: boolean;
    nextUnlocked: boolean;
    updatedProgress: UserCourseProgress;
    attemptResult: LessonAttemptResult;
  }> {
    const uid = auth.currentUser?.uid || attempt.userId || 'guest';
    const currentProgress = await this.getUserCourseProgress(uid);

    // Rule validation: Did candidate meet BOTH Target WPM AND Min Accuracy?
    const passed =
      attempt.netWpm >= lesson.targetWpm && attempt.accuracy >= lesson.minAccuracy;

    const fullAttempt: LessonAttemptResult = {
      date: new Date().toISOString().split('T')[0],
      lessonName: lesson.name,
      attemptNumber: (currentProgress.totalAttempts || 0) + 1,
      ...attempt,
      id: `attempt_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      passed,
      timestamp: Date.now()
    };

    // Save attempt locally
    try {
      const attemptsKey = `${STORAGE_KEYS.ATTEMPTS_PREFIX}${uid}_${lesson.id}`;
      const existingRaw = localStorage.getItem(attemptsKey);
      const existing: LessonAttemptResult[] = existingRaw ? JSON.parse(existingRaw) : [];
      existing.unshift(fullAttempt);
      if (existing.length > 20) existing.pop();
      localStorage.setItem(attemptsKey, JSON.stringify(existing));
    } catch {
      // ignore
    }

    // Calculate progression
    let nextUnlocked = false;
    let newHighestUnlocked = currentProgress.highestUnlockedLessonNumber;
    const completedSet = new Set(currentProgress.completedLessonIds);

    if (passed) {
      completedSet.add(lesson.id);
      // Unlock next lesson if completing the current frontier
      if (lesson.lessonNumber >= currentProgress.highestUnlockedLessonNumber) {
        newHighestUnlocked = lesson.lessonNumber + 1;
        nextUnlocked = true;
      }
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const isNewDay = currentProgress.lastActiveDate !== todayStr;
    const currentStreak = isNewDay ? currentProgress.currentStreak + 1 : currentProgress.currentStreak;

    // Recalculate stats
    const totalAttempts = currentProgress.totalAttempts + 1;
    const passedAttempts = currentProgress.passedAttempts + (passed ? 1 : 0);
    const bestWpm = Math.max(currentProgress.bestWpm, attempt.netWpm);
    const avgWpm = Math.round(
      (currentProgress.avgWpm * currentProgress.totalAttempts + attempt.netWpm) / totalAttempts
    );
    const avgAccuracy = Math.round(
      (currentProgress.avgAccuracy * currentProgress.totalAttempts + attempt.accuracy) / totalAttempts
    );

    const updatedProgress: UserCourseProgress = {
      ...currentProgress,
      userId: uid,
      highestUnlockedLessonNumber: newHighestUnlocked,
      currentLessonNumber: passed ? Math.min(newHighestUnlocked, 92) : lesson.lessonNumber,
      completedLessonIds: Array.from(completedSet),
      bestWpm,
      avgWpm,
      avgAccuracy,
      totalAttempts,
      passedAttempts,
      currentStreak,
      lastActiveDate: todayStr,
      todayWordsTyped: (isNewDay ? 0 : currentProgress.todayWordsTyped) + Math.round((attempt.durationSeconds * attempt.grossWpm) / 60),
      todayPracticeTimeSeconds: (isNewDay ? 0 : currentProgress.todayPracticeTimeSeconds) + attempt.durationSeconds,
      lastUpdated: Date.now()
    };

    // Save to LocalStorage
    const localKey = `${STORAGE_KEYS.PROGRESS_PREFIX}${uid}`;
    try {
      localStorage.setItem(localKey, JSON.stringify(updatedProgress));
    } catch {
      // ignore
    }

    // Save to Firestore if user is authenticated
    if (auth.currentUser && uid !== 'guest') {
      try {
        const progressDocRef = doc(db, 'users', uid, 'learning_progress', 'course');
        await setDoc(progressDocRef, updatedProgress, { merge: true });

        const resultsColRef = collection(db, 'users', uid, 'learning_results');
        await addDoc(resultsColRef, {
          ...fullAttempt,
          createdAt: serverTimestamp()
        });
      } catch (err) {
        console.warn('Firestore progress update failed (offline cache retained):', err);
      }
    }

    return {
      passed,
      nextUnlocked,
      updatedProgress,
      attemptResult: fullAttempt
    };
  },

  /**
   * Retrieves previous attempts for a specific lesson.
   */
  getLessonAttempts(lessonId: string, userId?: string): LessonAttemptResult[] {
    const uid = userId || auth.currentUser?.uid || 'guest';
    const attemptsKey = `${STORAGE_KEYS.ATTEMPTS_PREFIX}${uid}_${lessonId}`;
    try {
      const cached = localStorage.getItem(attemptsKey);
      if (cached) return JSON.parse(cached);
    } catch {
      // ignore
    }
    return [];
  },

  /**
   * Loads custom lessons created by Admin, merging them into the curriculum.
   */
  async getCombinedCurriculum(): Promise<TouchTypingCourseLesson[]> {
    let customLessons: TouchTypingCourseLesson[] = [];

    // Local custom lessons cache
    try {
      const cached = localStorage.getItem(STORAGE_KEYS.CUSTOM_LESSONS);
      if (cached) customLessons = JSON.parse(cached);
    } catch {
      // ignore
    }

    // Try fetching from Firestore collection /learning_lessons
    try {
      const colRef = collection(db, 'learning_lessons');
      const snap = await getDocs(colRef);
      if (!snap.empty) {
        const remoteLessons: TouchTypingCourseLesson[] = [];
        snap.forEach((d) => {
          remoteLessons.push(d.data() as TouchTypingCourseLesson);
        });
        if (remoteLessons.length > 0) {
          customLessons = remoteLessons;
          localStorage.setItem(STORAGE_KEYS.CUSTOM_LESSONS, JSON.stringify(remoteLessons));
        }
      }
    } catch (err) {
      console.warn('Could not fetch custom lessons from Firestore:', err);
    }

    // Merge: Custom lessons can override built-in or add new lessons (e.g. lessonNumber > 92)
    const lessonMap = new Map<string, TouchTypingCourseLesson>();
    BUILTIN_COURSE_LESSONS.forEach((l) => lessonMap.set(l.id, l));
    customLessons.forEach((l) => lessonMap.set(l.id, l));

    return Array.from(lessonMap.values()).sort((a, b) => a.lessonNumber - b.lessonNumber);
  },

  /**
   * Admin: Save or update a lesson definition in Firestore and local storage.
   */
  async saveAdminLesson(lesson: TouchTypingCourseLesson): Promise<void> {
    // 1. Update local cache
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.CUSTOM_LESSONS);
      const existing: TouchTypingCourseLesson[] = raw ? JSON.parse(raw) : [];
      const idx = existing.findIndex((l) => l.id === lesson.id);
      if (idx >= 0) {
        existing[idx] = lesson;
      } else {
        existing.push(lesson);
      }
      localStorage.setItem(STORAGE_KEYS.CUSTOM_LESSONS, JSON.stringify(existing));
    } catch {
      // ignore
    }

    // 2. Persist to Firestore
    try {
      const docRef = doc(db, 'learning_lessons', lesson.id);
      await setDoc(docRef, { ...lesson, isCustom: true }, { merge: true });
    } catch (err) {
      console.warn('Admin lesson Firestore save error:', err);
    }
  },

  /**
   * Daily Practice Goal status
   */
  getDailyGoal(): DailyPracticeGoal {
    const defaultGoal: DailyPracticeGoal = {
      targetMinutes: 15,
      targetWords: 500,
      minAccuracy: 90,
      targetWpm: 40,
      currentWords: 0,
      currentMinutes: 0
    };
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DAILY_GOAL);
      if (data) return JSON.parse(data);
    } catch {
      // ignore
    }
    return defaultGoal;
  },

  saveDailyGoal(goal: DailyPracticeGoal): void {
    try {
      localStorage.setItem(STORAGE_KEYS.DAILY_GOAL, JSON.stringify(goal));
    } catch {
      // ignore
    }
  }
};

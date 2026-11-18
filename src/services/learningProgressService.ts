import { auth, db, withFirestoreTimeout } from './firebase';
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

export function sanitizeCourseProgressPayload(
  progress: Partial<UserCourseProgress>,
  uid: string
): UserCourseProgress {
  return {
    userId: uid,
    currentLessonNumber: Math.max(1, Math.min(500, Math.round(Number(progress.currentLessonNumber) || 1))),
    highestUnlockedLessonNumber: Math.max(
      1,
      Math.min(500, Math.round(Number(progress.highestUnlockedLessonNumber) || 1))
    ),
    completedLessonIds: Array.isArray(progress.completedLessonIds)
      ? progress.completedLessonIds.slice(0, 500).map(String)
      : [],
    bestWpm: Math.max(0, Math.min(300, Math.round(Number(progress.bestWpm) || 0))),
    avgWpm: Math.max(0, Math.min(300, Math.round(Number(progress.avgWpm) || 0))),
    avgAccuracy: Math.max(0, Math.min(100, Math.round(Number(progress.avgAccuracy ?? 100)))),
    totalAttempts: Math.max(0, Math.min(1000000, Math.floor(Number(progress.totalAttempts) || 0))),
    passedAttempts: Math.max(0, Math.min(1000000, Math.floor(Number(progress.passedAttempts) || 0))),
    currentStreak: Math.max(0, Math.min(100000, Math.floor(Number(progress.currentStreak) || 1))),
    lastActiveDate: String(progress.lastActiveDate || new Date().toISOString().split('T')[0]).slice(0, 30),
    todayWordsTyped: Math.max(0, Math.min(1000000, Math.floor(Number(progress.todayWordsTyped) || 0))),
    todayPracticeTimeSeconds: Math.max(
      0,
      Math.min(864000, Math.floor(Number(progress.todayPracticeTimeSeconds) || 0))
    ),
    lastUpdated:
      typeof progress.lastUpdated === 'number' && progress.lastUpdated > 0
        ? Math.floor(progress.lastUpdated)
        : Date.now()
  };
}

export function sanitizeLessonAttemptPayload(
  attempt: LessonAttemptResult,
  uid: string,
  createdAtValue: unknown = serverTimestamp()
): Record<string, any> {
  return {
    id: String(attempt.id || `attempt_${Date.now()}`).slice(0, 120),
    lessonId: String(attempt.lessonId || 'lesson-1').slice(0, 80),
    lessonNumber: Math.max(1, Math.min(500, Math.round(Number(attempt.lessonNumber) || 1))),
    lessonName: String(attempt.lessonName || 'Lesson').slice(0, 160),
    userId: uid,
    timestamp:
      typeof attempt.timestamp === 'number' &&
      attempt.timestamp >= 1000000000000 &&
      attempt.timestamp <= 9999999999999
        ? Math.floor(attempt.timestamp)
        : Date.now(),
    date: String(attempt.date || new Date().toISOString().split('T')[0]).slice(0, 30),
    grossWpm: Math.max(0, Math.min(300, Math.round(Number(attempt.grossWpm) || 0))),
    netWpm: Math.max(0, Math.min(300, Math.round(Number(attempt.netWpm) || 0))),
    accuracy: Math.max(0, Math.min(100, Math.round(Number(attempt.accuracy) || 0))),
    errors: Math.max(0, Math.min(50000, Math.floor(Number(attempt.errors) || 0))),
    backspaces: Math.max(0, Math.min(50000, Math.floor(Number(attempt.backspaces) || 0))),
    durationSeconds: Math.max(1, Math.min(7200, Math.round(Number(attempt.durationSeconds) || 1))),
    passed: Boolean(attempt.passed),
    attemptNumber: Math.max(1, Math.min(1000000, Math.floor(Number(attempt.attemptNumber) || 1))),
    createdAt: createdAtValue
  };
}

export const LearningProgressService = {
  /**
   * Retrieves course progress for the current user.
   * Checks Firestore first if logged in, with seamless offline LocalStorage cache fallback.
   */
  async getUserCourseProgress(userId?: string): Promise<UserCourseProgress> {
    const uid = auth.currentUser?.uid || userId || 'guest';
    const localKey = `${STORAGE_KEYS.PROGRESS_PREFIX}${uid}`;

    // Read local cache first for instant responsiveness
    let localProgress: UserCourseProgress = { ...DEFAULT_PROGRESS, userId: uid };
    try {
      const cached = localStorage.getItem(localKey);
      if (cached) {
        localProgress = sanitizeCourseProgressPayload(JSON.parse(cached), uid);
      }
    } catch {
      // Ignore JSON parse errors
    }

    // If authenticated, sync with Firestore to support cross-device persistence (Website, Android, Windows)
    if (auth.currentUser && uid === auth.currentUser.uid) {
      try {
        const progressDocRef = doc(db, 'users', uid, 'learning_progress', 'course');
        const snap = await withFirestoreTimeout(getDoc(progressDocRef), 2500);
        if (snap.exists()) {
          const remoteData = snap.data() as Partial<UserCourseProgress>;
          // Merge remote with highest unlocked guarantee
          const merged = sanitizeCourseProgressPayload(
            {
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
            },
            uid
          );
          localStorage.setItem(localKey, JSON.stringify(merged));
          return merged;
        } else {
          // Initialize remote document with strictly validated schema
          const initialPayload = sanitizeCourseProgressPayload(
            {
              ...localProgress,
              lastUpdated: Date.now()
            },
            uid
          );
          await withFirestoreTimeout(setDoc(progressDocRef, initialPayload), 2500);
        }
      } catch {
        // Offline cache used seamlessly
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

    const safeGrossWpm = Math.max(0, Math.min(300, Math.round(Number(attempt.grossWpm) || 0)));
    const safeNetWpm = Math.max(0, Math.min(safeGrossWpm, Math.round(Number(attempt.netWpm) || 0)));
    const safeAccuracy = Math.max(0, Math.min(100, Math.round(Number(attempt.accuracy) || 0)));
    const safeDuration = Math.max(1, Math.min(7200, Math.round(Number(attempt.durationSeconds) || 1)));

    // Rule validation: Did candidate meet BOTH Target WPM AND Min Accuracy?
    const passed = safeNetWpm >= lesson.targetWpm && safeAccuracy >= lesson.minAccuracy;

    const fullAttempt: LessonAttemptResult = {
      date: new Date().toISOString().split('T')[0],
      lessonName: lesson.name,
      attemptNumber: (currentProgress.totalAttempts || 0) + 1,
      ...attempt,
      userId: uid,
      grossWpm: safeGrossWpm,
      netWpm: safeNetWpm,
      accuracy: safeAccuracy,
      durationSeconds: safeDuration,
      id: `attempt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
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
    const bestWpm = Math.max(currentProgress.bestWpm, safeNetWpm);
    const avgWpm = Math.round(
      (currentProgress.avgWpm * currentProgress.totalAttempts + safeNetWpm) / totalAttempts
    );
    const avgAccuracy = Math.round(
      (currentProgress.avgAccuracy * currentProgress.totalAttempts + safeAccuracy) / totalAttempts
    );

    const updatedProgress = sanitizeCourseProgressPayload(
      {
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
        todayWordsTyped:
          (isNewDay ? 0 : currentProgress.todayWordsTyped) +
          Math.round((safeDuration * safeGrossWpm) / 60),
        todayPracticeTimeSeconds:
          (isNewDay ? 0 : currentProgress.todayPracticeTimeSeconds) + safeDuration,
        lastUpdated: Date.now()
      },
      uid
    );

    // Save to LocalStorage
    const localKey = `${STORAGE_KEYS.PROGRESS_PREFIX}${uid}`;
    try {
      localStorage.setItem(localKey, JSON.stringify(updatedProgress));
    } catch {
      // ignore
    }

    // Save to Firestore if user is authenticated
    if (auth.currentUser && uid === auth.currentUser.uid) {
      try {
        const progressDocRef = doc(db, 'users', uid, 'learning_progress', 'course');
        await withFirestoreTimeout(setDoc(progressDocRef, updatedProgress, { merge: true }), 2500);

        const resultsColRef = collection(db, 'users', uid, 'learning_results');
        const attemptPayload = sanitizeLessonAttemptPayload(fullAttempt, uid, serverTimestamp());
        await withFirestoreTimeout(addDoc(resultsColRef, attemptPayload), 2500);
      } catch {
        // Offline cache retained seamlessly
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

    // Try fetching from Firestore collection /learning_lessons with a fast timeout
    try {
      const colRef = collection(db, 'learning_lessons');
      const snap = await withFirestoreTimeout(getDocs(colRef), 2500);
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
    } catch {
      // Fall back to local cache / built-in curriculum seamlessly
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
      await withFirestoreTimeout(setDoc(docRef, { ...lesson, isCustom: true }, { merge: true }), 2500);
    } catch {
      // Offline cache updated seamlessly
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

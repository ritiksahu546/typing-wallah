import { TestResultRecord, UserProfile, UserStatsSummary, LeaderboardItem, UserSubscription, Passage } from '../types';
import { auth, db, withFirestoreTimeout } from './firebase';
import {
  collection,
  doc,
  getDoc,
  setDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp
} from 'firebase/firestore';

const STORAGE_KEYS = {
  PROFILE: 'typing_wallah_profile',
  HISTORY: 'typing_wallah_history',
  OFFLINE_QUEUE: 'typing_wallah_offline_queue',
  SETTINGS: 'typing_wallah_settings',
  LEGACY_SUBSCRIPTION: 'typing_wallah_subscription'
};

const DEFAULT_PROFILE: UserProfile = {
  id: 'guest_aspirant',
  name: 'Candidate (Guest)',
  email: 'guest@typingwallah.in',
  avatarSeed: 'TW',
  targetExam: 'cpct',
  joinedDate: 'Guest Session',
  isLoggedIn: false,
  isPro: false,
  referralCode: 'TW-GUEST0',
  referralCount: 0,
  referralDaysEarned: 0
};

// In-memory rate-limiting & duplicate submission tracking for cloud writes
const syncedResultIds = new Set<string>();
let lastCloudSubmissionAt = 0;
const MIN_SUBMISSION_INTERVAL_MS = 3000;

// Server-verified subscription cache (never persisted to or trusted from localStorage)
let verifiedCloudSubscription: UserSubscription | null = null;

import {
  verifyLeaderboardSubmissionPayload,
  checkSubmissionRateLimit
} from './resultVerification';

/**
 * Pure validation helper for typing test result records before cloud/leaderboard submission.
 * Exported for automated unit tests and client pre-flight validation.
 */
export function validateTestResultPayload(result: TestResultRecord): { valid: boolean; reason?: string } {
  const outcome = verifyLeaderboardSubmissionPayload(result);
  return { valid: outcome.valid, reason: outcome.reason };
}

export interface NormalizedResultPayloads {
  safeResultId: string;
  leaderboardEligible: boolean;
  userResultPayload: Record<string, any>;
  rootResultPayload: Record<string, any>;
  leaderboardPayload: Record<string, any>;
}

/**
 * Builds normalized Firestore payloads for:
 * - Step A: `/users/{uid}/results/{safeResultId}`
 * - Step B: `/user_results/{uid}_{safeResultId}`
 * - Step C: `/leaderboard/{uid}_{examId}_{language}`
 *
 * Ensures every field, numeric bound, and server timestamp key matches `firestore.rules`.
 */
export function buildNormalizedResultPayloads(
  result: TestResultRecord,
  user: { uid: string; email?: string | null; displayName?: string | null; photoURL?: string | null },
  serverTimeValue: unknown = serverTimestamp()
): NormalizedResultPayloads {
  const safeResultId = result.id.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 64);
  const netWpm = Math.round(Number(result.metrics.netWpm) * 100) / 100;
  const grossWpm = Math.round(Number(result.metrics.grossWpm) * 100) / 100;
  const accuracy = Math.round(Number(result.metrics.accuracy) * 100) / 100;
  const totalChars = Math.max(1, Math.floor(Number(result.metrics.totalChars) || 1));
  const correctChars = Math.min(totalChars, Math.max(0, Math.floor(Number(result.metrics.correctChars) || 0)));
  const incorrectChars = Math.max(0, totalChars - correctChars);
  const errors = Math.max(0, Math.floor(Number(result.metrics.errors) || 0));
  const backspaceCount = Math.max(0, Math.floor(Number(result.metrics.backspaceCount) || 0));
  const keyDepressions = Math.max(totalChars, Math.floor(Number(result.metrics.keyDepressions) || totalChars));
  const kdph = Math.max(0, Math.floor(Number(result.metrics.kdph) || 0));
  const rawElapsed = Math.max(1, Math.round(Number(result.metrics.elapsedSeconds) || Number(result.durationSeconds) || 60));
  const durationSeconds = Math.max(10, Math.min(7200, Math.max(Math.round(Number(result.durationSeconds) || 60), rawElapsed)));
  const elapsedSeconds = Math.max(1, Math.min(durationSeconds, rawElapsed));
  const remainingSeconds = Math.max(0, durationSeconds - elapsedSeconds);
  const safeExamId = String(result.examId || 'general').slice(0, 60);
  const safeExamName = String(result.examName || 'Typing Test').slice(0, 120);
  const safePassageId = String(result.passageId || 'default').slice(0, 80);
  const safePassageTitle = String(result.passageTitle || 'Practice Passage').slice(0, 160);
  const safeKeyboardLayout = String(result.keyboardLayout || 'standard').slice(0, 40);
  const safeTimestamp =
    typeof result.timestamp === 'number' && result.timestamp >= 1000000000000 && result.timestamp <= 9999999999999
      ? Math.floor(result.timestamp)
      : Date.now();
  const safeUsername = (user.displayName?.trim() || user.email?.split('@')[0]?.trim() || 'Candidate').slice(0, 100);
  const safeEmail = (user.email || '').slice(0, 200);
  const safePhotoUrl = (user.photoURL || '').slice(0, 2048);

  const normalizedMetrics = {
    grossWpm,
    netWpm,
    accuracy,
    totalChars,
    correctChars,
    incorrectChars,
    errors,
    backspaceCount,
    keyDepressions,
    elapsedSeconds,
    remainingSeconds,
    kdph,
    isQualified: Boolean(result.metrics.isQualified),
    grade: String(result.metrics.grade || 'Unqualified').slice(0, 30)
  };

  const userResultPayload = {
    id: safeResultId,
    testId: safeResultId,
    userId: user.uid,
    timestamp: safeTimestamp,
    createdAt: serverTimeValue,
    examId: safeExamId,
    examName: safeExamName,
    language: result.language,
    keyboardLayout: safeKeyboardLayout,
    durationSeconds,
    passageTitle: safePassageTitle,
    passageId: safePassageId,
    metrics: normalizedMetrics
  };

  const rootResultPayload = {
    ...userResultPayload,
    userEmail: safeEmail,
    username: safeUsername,
    photoURL: safePhotoUrl
  };

  const leaderboardPayload = {
    userId: user.uid,
    testId: safeResultId,
    username: safeUsername,
    name: safeUsername,
    photoURL: safePhotoUrl,
    avatar: safePhotoUrl,
    wpm: netWpm,
    netWpm,
    grossWpm,
    accuracy,
    mistakes: errors,
    durationSeconds,
    isQualified: Boolean(result.metrics.isQualified),
    exam: safeExamName,
    examId: safeExamId,
    language: result.language,
    date: new Date(safeTimestamp).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }),
    timestamp: serverTimeValue,
    updatedAt: serverTimeValue
  };

  const leaderboardEligible =
    elapsedSeconds >= 10 &&
    totalChars >= 25 &&
    netWpm <= 220 &&
    grossWpm <= 240 &&
    accuracy >= 50;

  return {
    safeResultId,
    leaderboardEligible,
    userResultPayload,
    rootResultPayload,
    leaderboardPayload
  };
}

export interface ResultSyncStepRunnerParams {
  safeResultId: string;
  leaderboardEligible: boolean;
  netWpm: number;
  accuracy: number;
  userResultExists: () => Promise<boolean>;
  writeUserResult: () => Promise<void>;
  rootResultExists: () => Promise<boolean>;
  writeRootResult: () => Promise<void>;
  getExistingLeaderboardEntry: () => Promise<Record<string, any> | null>;
  writeLeaderboardEntry: () => Promise<void>;
}

/**
 * Executes the 3-step result synchronization pipeline with idempotent retry support.
 * If a previous attempt saved the personal result (Step A) or root audit record (Step B)
 * before a network failure, retrying skips the already-saved immutable document instead of
 * attempting an illegal overwrite (`allow update: if false` in firestore.rules) and proceeds
 * to complete the remaining steps.
 */
export async function executeResultSyncSteps(params: ResultSyncStepRunnerParams): Promise<{
  wroteUserResult: boolean;
  wroteRootResult: boolean;
  wroteLeaderboard: boolean;
}> {
  let wroteUserResult = false;
  let wroteRootResult = false;
  let wroteLeaderboard = false;

  // Step A: Personal immutable result (/users/{uid}/results/{safeResultId})
  const hasUserResult = await params.userResultExists();
  if (!hasUserResult) {
    await params.writeUserResult();
    wroteUserResult = true;
  }

  // Step B: Root immutable audit result (/user_results/{uid}_{safeResultId})
  const hasRootResult = await params.rootResultExists();
  if (!hasRootResult) {
    await params.writeRootResult();
    wroteRootResult = true;
  }

  // Step C: Public leaderboard entry (/leaderboard/{uid}_{examId}_{language})
  if (params.leaderboardEligible) {
    const existingData = await params.getExistingLeaderboardEntry();
    const isSameTestAlreadyRecorded = existingData?.testId === params.safeResultId;

    if (!isSameTestAlreadyRecorded) {
      const existingBestNetWpm = existingData
        ? Number(existingData.netWpm ?? existingData.wpm ?? -1)
        : -1;
      const existingBestAcc = existingData ? Number(existingData.accuracy ?? -1) : -1;

      const isBetterScore =
        !existingData ||
        params.netWpm > existingBestNetWpm ||
        (params.netWpm === existingBestNetWpm && params.accuracy >= existingBestAcc);

      if (isBetterScore) {
        await params.writeLeaderboardEntry();
        wroteLeaderboard = true;
      }
    }
  }

  return { wroteUserResult, wroteRootResult, wroteLeaderboard };
}

export const StorageService = {
  getProfile(): UserProfile {
    try {
      // Always purge any legacy client-side subscription key
      localStorage.removeItem(STORAGE_KEYS.LEGACY_SUBSCRIPTION);
      const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (data) {
        const parsed: UserProfile = JSON.parse(data);
        const activeSub = this.getSubscription();
        // Never trust client localStorage for paid Pro entitlement
        return {
          ...parsed,
          isPro: this.hasVerifiedPaidSubscription(),
          proExpiryDate: activeSub?.expiryDate || null
        };
      }
    } catch {
      // fallback
    }
    return DEFAULT_PROFILE;
  },

  saveProfile(profile: UserProfile): void {
    try {
      const activeSub = this.getSubscription();
      // Strip self-granted isPro flags before saving to localStorage
      const safeProfile: UserProfile = {
        ...profile,
        isPro: this.hasVerifiedPaidSubscription(),
        proExpiryDate: activeSub?.expiryDate || null
      };
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(safeProfile));
    } catch {
      // ignore
    }
  },

  getTestHistory(): TestResultRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    return [];
  },

  saveTestResult(result: TestResultRecord): void {
    const validation = validateTestResultPayload(result);
    if (!validation.valid) {
      console.warn('Rejected invalid typing test result:', validation.reason);
      return;
    }

    // 1. Maintain localStorage history for offline & instant feedback
    try {
      const history = this.getTestHistory();
      if (!history.some((r) => r.id === result.id)) {
        history.unshift(result);
        if (history.length > 50) history.pop();
        localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
      }
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }

    // 2. If user is authenticated, sync to Firestore
    const currentUser = auth.currentUser;
    if (currentUser) {
      this.syncResultToFirestore(result).catch((err) => {
        console.warn('Firestore sync background notice, queueing for offline retry:', err);
        this.enqueueOfflineResult(result);
      });
    }
  },

  enqueueOfflineResult(result: TestResultRecord): void {
    if (!validateTestResultPayload(result).valid) return;
    try {
      const queueRaw = localStorage.getItem(STORAGE_KEYS.OFFLINE_QUEUE);
      const queue: TestResultRecord[] = queueRaw ? JSON.parse(queueRaw) : [];
      if (!queue.some((item) => item.id === result.id)) {
        queue.push(result);
        localStorage.setItem(STORAGE_KEYS.OFFLINE_QUEUE, JSON.stringify(queue));
      }
    } catch {
      // ignore
    }
  },

  async drainOfflineQueue(): Promise<void> {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    try {
      const queueRaw = localStorage.getItem(STORAGE_KEYS.OFFLINE_QUEUE);
      if (!queueRaw) return;
      const queue: TestResultRecord[] = JSON.parse(queueRaw);
      if (!queue.length) return;

      const remaining: TestResultRecord[] = [];
      for (const item of queue) {
        try {
          await this.syncResultToFirestore(item, { isRetry: true });
        } catch {
          remaining.push(item);
        }
      }
      localStorage.setItem(STORAGE_KEYS.OFFLINE_QUEUE, JSON.stringify(remaining));
    } catch {
      // ignore
    }
  },

  async syncResultToFirestore(
    result: TestResultRecord,
    options?: { isRetry?: boolean }
  ): Promise<void> {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      return;
    }

    // 1. Validate score types, realistic bounds, and WPM consistency
    const verification = verifyLeaderboardSubmissionPayload(result, currentUser.uid);
    if (!verification.valid) {
      throw new Error(`Invalid test result payload: ${verification.reason}`);
    }

    const safeResultId = result.id.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 64);
    if (!safeResultId) {
      throw new Error('Invalid test result identifier');
    }
    if (syncedResultIds.has(safeResultId)) {
      return;
    }

    // 2. Duplicate-submission & sliding-window rate-limiting protection
    if (!options?.isRetry) {
      const now = Date.now();
      if (now - lastCloudSubmissionAt < MIN_SUBMISSION_INTERVAL_MS) {
        throw new Error('Submission rate limit exceeded. Please wait before submitting another result.');
      }
      const rateCheck = checkSubmissionRateLimit(currentUser.uid, safeResultId, now);
      if (!rateCheck.allowed) {
        throw new Error(rateCheck.reason || 'Submission rate limit exceeded.');
      }
      lastCloudSubmissionAt = now;
    }

    // 3. Trusted backend verification endpoint (/api/results/verify) when available
    let backendLeaderboardEligible = verification.leaderboardEligible;
    if (typeof window !== 'undefined' && typeof fetch === 'function') {
      try {
        const resp = await fetch('/api/results/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uid: currentUser.uid, result })
        });
        if (resp.status === 400 || resp.status === 429) {
          const errBody = await resp.json().catch(() => ({}));
          throw new Error(errBody.reason || 'Result rejected by server verification');
        }
        if (resp.ok) {
          const verifiedBody = await resp.json();
          backendLeaderboardEligible = Boolean(verifiedBody.leaderboardEligible);
        }
      } catch (e: any) {
        if (
          e?.message?.includes('rejected by server') ||
          e?.message?.includes('Rate limit') ||
          e?.message?.includes('cooldown')
        ) {
          throw e;
        }
        // If running on static hosting without /api/results/verify, proceed with Firestore rules enforcement
      }
    }

    const payloads = buildNormalizedResultPayloads(
      result,
      {
        uid: currentUser.uid,
        email: currentUser.email,
        displayName: currentUser.displayName,
        photoURL: currentUser.photoURL
      },
      serverTimestamp()
    );

    const userResultDocRef = doc(db, 'users', currentUser.uid, 'results', payloads.safeResultId);
    const rootResultDocRef = doc(db, 'user_results', `${currentUser.uid}_${payloads.safeResultId}`);
    const leaderboardDocId = `${currentUser.uid}_${payloads.userResultPayload.examId}_${payloads.userResultPayload.language}`;
    const leaderboardDocRef = doc(db, 'leaderboard', leaderboardDocId);

    await executeResultSyncSteps({
      safeResultId: payloads.safeResultId,
      leaderboardEligible: payloads.leaderboardEligible && backendLeaderboardEligible,
      netWpm: payloads.userResultPayload.metrics.netWpm,
      accuracy: payloads.userResultPayload.metrics.accuracy,
      userResultExists: async () => {
        const snap = await withFirestoreTimeout(getDoc(userResultDocRef), 2500);
        return snap.exists();
      },
      writeUserResult: async () => {
        await withFirestoreTimeout(setDoc(userResultDocRef, payloads.userResultPayload), 3000);
      },
      rootResultExists: async () => {
        const snap = await withFirestoreTimeout(getDoc(rootResultDocRef), 2500);
        return snap.exists();
      },
      writeRootResult: async () => {
        await withFirestoreTimeout(setDoc(rootResultDocRef, payloads.rootResultPayload), 3000);
      },
      getExistingLeaderboardEntry: async () => {
        const snap = await withFirestoreTimeout(getDoc(leaderboardDocRef), 2500);
        return snap.exists() ? snap.data() : null;
      },
      writeLeaderboardEntry: async () => {
        await withFirestoreTimeout(setDoc(leaderboardDocRef, payloads.leaderboardPayload), 3000);
      }
    });

    // Only mark as fully synced once Steps A, B, and C have all succeeded
    syncedResultIds.add(payloads.safeResultId);
  },

  async fetchCloudUserHistory(uid: string): Promise<TestResultRecord[]> {
    try {
      const userSubcol = collection(db, 'users', uid, 'results');
      const q = query(userSubcol, orderBy('timestamp', 'desc'), limit(30));
      const snap = await withFirestoreTimeout(getDocs(q), 2500);

      const records: TestResultRecord[] = [];
      snap.forEach((docSnap) => {
        const d = docSnap.data();
        records.push({
          id: d.testId || docSnap.id,
          timestamp: d.timestamp || Date.now(),
          examId: d.examId || 'general',
          examName: d.examName || 'Typing Test',
          language: d.language || 'english',
          keyboardLayout: d.keyboardLayout || 'standard',
          durationSeconds: d.durationSeconds || 300,
          passageTitle: d.passageTitle || 'Master Passage',
          passageId: d.passageId || 'default',
          metrics: {
            grossWpm: d.metrics?.grossWpm || 0,
            netWpm: d.metrics?.netWpm || 0,
            accuracy: d.metrics?.accuracy || 0,
            totalChars: d.metrics?.totalChars || 0,
            correctChars: d.metrics?.correctChars || 0,
            incorrectChars: d.metrics?.incorrectChars || 0,
            errors: d.metrics?.errors || 0,
            backspaceCount: d.metrics?.backspaceCount || 0,
            keyDepressions: d.metrics?.keyDepressions || 0,
            elapsedSeconds: d.durationSeconds || 300,
            remainingSeconds: 0,
            isQualified: d.metrics?.isQualified,
            grade: d.metrics?.grade
          }
        });
      });

      if (records.length > 0) {
        localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(records));
        return records;
      }
    } catch {
      // Fall back to local cache seamlessly
    }

    return this.getTestHistory();
  },

  async fetchLeaderboardFromFirestore(examId?: string, language?: string): Promise<LeaderboardItem[]> {
    try {
      const leaderCol = collection(db, 'leaderboard');
      let q = query(leaderCol, orderBy('netWpm', 'desc'), limit(50));

      if (examId && examId !== 'all') {
        q = query(leaderCol, where('examId', '==', examId), orderBy('netWpm', 'desc'), limit(50));
      }

      const snap = await withFirestoreTimeout(getDocs(q), 2500);
      const items: LeaderboardItem[] = [];
      let rank = 1;

      snap.forEach((docSnap) => {
        const d = docSnap.data();
        if (language && language !== 'all' && d.language !== language) {
          return;
        }

        const currentUid = auth.currentUser?.uid;
        items.push({
          id: docSnap.id,
          rank: rank++,
          username: d.username || 'Candidate',
          wpm: d.grossWpm || d.netWpm || 0,
          netWpm: d.netWpm || 0,
          accuracy: d.accuracy || 100,
          examName: d.exam || 'All Exams',
          language: d.language || 'english',
          date: d.date || 'Recent',
          isCurrentUser: currentUid ? d.userId === currentUid : false,
          avatarSeed: (d.username || 'A').slice(0, 2).toUpperCase()
        });
      });

      return items;
    } catch {
      return [];
    }
  },

  getUserStats(): UserStatsSummary {
    const history = this.getTestHistory();
    if (history.length === 0) {
      return {
        bestWpm: 0,
        avgWpm: 0,
        avgAccuracy: 0,
        totalTests: 0,
        totalPracticeTimeSeconds: 0,
        recentTests: []
      };
    }

    let maxWpm = 0;
    let sumWpm = 0;
    let sumAcc = 0;
    let totalSecs = 0;

    history.forEach((t) => {
      if (t.metrics.netWpm > maxWpm) maxWpm = t.metrics.netWpm;
      sumWpm += t.metrics.netWpm;
      sumAcc += t.metrics.accuracy;
      totalSecs += t.durationSeconds;
    });

    return {
      bestWpm: maxWpm,
      avgWpm: Math.round(sumWpm / history.length),
      avgAccuracy: Number((sumAcc / history.length).toFixed(1)),
      totalTests: history.length,
      totalPracticeTimeSeconds: totalSecs,
      recentTests: history.slice(0, 10)
    };
  },

  // =========================================================================
  // --- Subscription & Entitlement Management (Server-Authoritative Only) ---
  // =========================================================================

  /**
   * Immediately clears the in-memory verified subscription cache and strips any cached Pro flag.
   * Called on sign-out, account change, and failed subscription verification.
   */
  clearSubscriptionCache(): void {
    verifiedCloudSubscription = null;
    try {
      localStorage.removeItem(STORAGE_KEYS.LEGACY_SUBSCRIPTION);
      const rawProfile = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (rawProfile) {
        const parsed = JSON.parse(rawProfile);
        localStorage.setItem(
          STORAGE_KEYS.PROFILE,
          JSON.stringify({ ...parsed, isPro: false, proExpiryDate: null })
        );
      }
    } catch {
      // ignore
    }
  },

  /**
   * Test-only helper for verifying UID-bound subscription cache isolation in unit tests.
   */
  setVerifiedSubscriptionCacheForTesting(sub: UserSubscription | null): void {
    verifiedCloudSubscription = sub;
  },

  /**
   * Returns only a server-verified subscription loaded from Firestore /subscriptions/{uid}
   * that is strictly bound to the currently authenticated UID (or explicit expectedUid).
   * Never reads or trusts localStorage for subscription status, and never reuses another user's cache.
   */
  getSubscription(expectedUid?: string): UserSubscription | null {
    try {
      localStorage.removeItem(STORAGE_KEYS.LEGACY_SUBSCRIPTION);
    } catch {
      // ignore
    }
    if (!verifiedCloudSubscription) return null;

    const activeUid = expectedUid !== undefined ? expectedUid : auth.currentUser?.uid;
    if (!activeUid || !verifiedCloudSubscription.uid || verifiedCloudSubscription.uid !== activeUid) {
      // Clear immediately if signed out or if the active UID does not match the cached subscription's owner
      verifiedCloudSubscription = null;
      return null;
    }

    const isExpired = new Date(verifiedCloudSubscription.expiryDate).getTime() <= Date.now();
    if (isExpired) {
      return { ...verifiedCloudSubscription, status: 'expired' };
    }
    return verifiedCloudSubscription;
  },

  /**
   * Checks whether the current authenticated user holds a server-verified paid subscription in Firestore.
   * Users cannot grant themselves premium status via localStorage or client state.
   */
  hasVerifiedPaidSubscription(expectedUid?: string): boolean {
    const sub = this.getSubscription(expectedUid);
    return Boolean(sub && sub.status === 'active' && new Date(sub.expiryDate).getTime() > Date.now());
  },

  /**
   * Server-authoritative Pro check bound to the authenticated user's verified subscription.
   * Never returns hardcoded `true`. Free practice features are kept open directly in UI components
   * without faking Pro subscription status.
   */
  isUserPro(expectedUid?: string): boolean {
    return this.hasVerifiedPaidSubscription(expectedUid);
  },

  async syncSubscriptionWithCloud(uid: string): Promise<UserSubscription | null> {
    if (!uid || typeof uid !== 'string') {
      this.clearSubscriptionCache();
      return null;
    }
    if (auth.currentUser && auth.currentUser.uid !== uid) {
      this.clearSubscriptionCache();
      return null;
    }
    if (verifiedCloudSubscription && verifiedCloudSubscription.uid !== uid) {
      this.clearSubscriptionCache();
    }

    try {
      localStorage.removeItem(STORAGE_KEYS.LEGACY_SUBSCRIPTION);
      const subDocRef = doc(db, 'subscriptions', uid);
      const snap = await withFirestoreTimeout(getDoc(subDocRef), 2500);
      if (snap.exists()) {
        const d = snap.data();
        if (d.uid && d.uid !== uid) {
          this.clearSubscriptionCache();
          return null;
        }
        verifiedCloudSubscription = {
          uid,
          plan: d.plan || 'pro_monthly',
          status: d.status || 'active',
          startDate: d.startDate || new Date().toISOString(),
          expiryDate: d.expiryDate || new Date(0).toISOString(),
          source: d.source || 'admin',
          amountInr: d.amountInr
        };
        return this.getSubscription(uid);
      } else {
        this.clearSubscriptionCache();
        return null;
      }
    } catch {
      // Clear cache on failed verification so stale or cross-account state is never retained
      this.clearSubscriptionCache();
      return null;
    }
  },

  // =========================================================================
  // --- Referral System: Unique Owner-Bound Registration & Resolution ---
  // =========================================================================

  /**
   * Generates deterministic candidate referral codes for a UID.
   * Includes full-UID FNV-1a hash fallbacks so two UIDs sharing a 6-character prefix never collide.
   */
  getReferralCodeCandidates(userUid: string): string[] {
    const rawUid = (userUid || 'GUEST').trim();
    const cleanId = rawUid.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    const primary = `TW-${(cleanId + '89X2A1').slice(0, 6)}`;

    let hash = 2166136261;
    for (let i = 0; i < rawUid.length; i++) {
      hash ^= rawUid.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    const hashSuffix = (Math.abs(hash) >>> 0).toString(36).toUpperCase().padStart(4, '0').slice(0, 4);
    const secondary = `TW-${(cleanId + '89X2').slice(0, 4)}${hashSuffix}`;
    const tertiary = `TW-${(cleanId + '89X2A1').slice(0, 6)}${hashSuffix}`;

    return Array.from(new Set([primary, secondary, tertiary]));
  },

  getReferralCode(userUid: string): string {
    const cleanUid = (userUid || 'GUEST').trim();
    try {
      const cachedOwned = localStorage.getItem(`tw_owned_ref_code_${cleanUid}`);
      if (cachedOwned && /^TW-[A-Z0-9]{6,10}$/.test(cachedOwned)) {
        return cachedOwned;
      }
    } catch {
      // ignore
    }
    return this.getReferralCodeCandidates(cleanUid)[0];
  },

  /**
   * Ensures a unique referral code is registered in `/referral_codes/{code}` against its actual owner `uid`.
   * If a 6-char prefix collision ever occurs with another user's UID, falls back to the full-UID hash candidate.
   */
  async registerUserReferralCode(uid: string, existingProfileCode?: string): Promise<string> {
    const candidates = this.getReferralCodeCandidates(uid);
    if (existingProfileCode && /^TW-[A-Z0-9]{6,10}$/.test(existingProfileCode)) {
      if (!candidates.includes(existingProfileCode)) {
        candidates.unshift(existingProfileCode);
      }
    }

    for (const candidate of candidates) {
      try {
        const refDoc = doc(db, 'referral_codes', candidate);
        const snap = await withFirestoreTimeout(getDoc(refDoc), 2500);
        if (!snap.exists()) {
          await withFirestoreTimeout(
            setDoc(refDoc, {
              code: candidate,
              uid,
              ownerUid: uid,
              createdAt: serverTimestamp()
            }),
            2500
          );
          try {
            localStorage.setItem(`tw_owned_ref_code_${uid}`, candidate);
          } catch {
            // ignore
          }
          return candidate;
        } else {
          const existingOwnerUid = snap.data()?.ownerUid || snap.data()?.uid;
          if (existingOwnerUid === uid) {
            try {
              localStorage.setItem(`tw_owned_ref_code_${uid}`, candidate);
            } catch {
              // ignore
            }
            return candidate;
          }
        }
        // Otherwise owned by a different user -> try next deterministic candidate
      } catch {
        // Offline or transient failure
      }
    }

    return candidates[0];
  },

  getReferralState(): { myReferralCode: string; referredByCode: string | null } {
    const profile = this.getProfile();
    const uid = auth.currentUser?.uid || profile.id || 'GUEST';
    const myReferralCode = this.getReferralCode(uid);
    const appliedRefKey = `tw_verified_ref_${uid}`;
    const referredByCode = localStorage.getItem(appliedRefKey) || null;
    return { myReferralCode, referredByCode };
  },

  /**
   * Stores a pending referral invite code from a URL parameter (?ref=TW-XXXXXX)
   * for subsequent verification against Firestore once the user signs in.
   * LocalStorage is NEVER treated as final proof of referral eligibility.
   */
  applyFriendReferralCode(referrerCode: string): { success: boolean; message: string } {
    if (!referrerCode || !referrerCode.trim()) {
      return { success: false, message: 'Please enter a valid invite code.' };
    }
    const cleanCode = referrerCode.trim().toUpperCase();
    if (!/^TW-[A-Z0-9]{6,10}$/.test(cleanCode)) {
      return { success: false, message: 'Invite code must be in the format TW-XXXXXX.' };
    }
    const profile = this.getProfile();
    const uid = auth.currentUser?.uid || profile.id || 'GUEST';
    const myCandidates = this.getReferralCodeCandidates(uid);
    if (cleanCode === this.getReferralCode(uid) || myCandidates.includes(cleanCode)) {
      return { success: false, message: 'You cannot apply your own invite code.' };
    }
    try {
      localStorage.setItem('tw_pending_ref_code', cleanCode);
    } catch {
      // ignore
    }
    return {
      success: true,
      message: auth.currentUser
        ? `Verifying invite code ${cleanCode} with server...`
        : `Invite code ${cleanCode} saved. Sign in to verify and link it to your account.`
    };
  },

  /**
   * Resolves `referrerCode` against registered `/referral_codes/{code}` in Firestore,
   * verifies that `referrerUid !== currentUser.uid`, prevents duplicate referral redemptions
   * using deterministic `/referrals/{referredUid}` document ID, and issues no paid/monetary rewards.
   */
  async recordReferralUnlock(
    referrerCode: string,
    _newUserId: string,
    newUserEmail: string,
    newUserName: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      if (!referrerCode || !referrerCode.trim()) {
        return { success: false, message: 'Please enter a valid invite code.' };
      }

      const cleanCode = referrerCode.trim().toUpperCase();
      if (!/^TW-[A-Z0-9]{6,10}$/.test(cleanCode)) {
        return { success: false, message: 'Invite code must be in the format TW-XXXXXX.' };
      }

      const currentUser = auth.currentUser;
      if (!currentUser) {
        return {
          success: false,
          message: 'Please sign in to your account to verify and apply a friend referral code.'
        };
      }

      const myCandidates = this.getReferralCodeCandidates(currentUser.uid);
      if (cleanCode === this.getReferralCode(currentUser.uid) || myCandidates.includes(cleanCode)) {
        return { success: false, message: 'You cannot apply your own invite code.' };
      }

      // 1. Check if this user has already redeemed a referral in Firestore (/referrals/{currentUser.uid})
      const userReferralDocRef = doc(db, 'referrals', currentUser.uid);
      const existingReferralSnap = await withFirestoreTimeout(getDoc(userReferralDocRef), 3000);
      if (existingReferralSnap.exists()) {
        const existingCode = existingReferralSnap.data()?.referrerCode || cleanCode;
        try {
          localStorage.setItem(`tw_verified_ref_${currentUser.uid}`, existingCode);
        } catch {
          // ignore
        }
        return {
          success: false,
          message: 'A referral invite code has already been verified and linked to your account.'
        };
      }

      // 2. Resolve referral code to an actual registered referrer account in /referral_codes/{cleanCode}
      const codeDocRef = doc(db, 'referral_codes', cleanCode);
      const codeSnap = await withFirestoreTimeout(getDoc(codeDocRef), 3000);
      if (!codeSnap.exists()) {
        return {
          success: false,
          message: 'Invite code not found. Please check that the code belongs to a registered Typing Wallah user.'
        };
      }

      const referrerUid = codeSnap.data()?.ownerUid || codeSnap.data()?.uid;
      if (!referrerUid || typeof referrerUid !== 'string') {
        return { success: false, message: 'Invalid referral code record.' };
      }

      // 3. Prevent self-referral by UID check
      if (referrerUid === currentUser.uid) {
        return { success: false, message: 'You cannot apply your own invite code.' };
      }

      // 4. Write immutable referral record at deterministic path /referrals/{currentUser.uid}
      await withFirestoreTimeout(
        setDoc(userReferralDocRef, {
          referrerUid,
          referrerCode: cleanCode,
          referredUid: currentUser.uid,
          referredEmail: (currentUser.email || newUserEmail || '').slice(0, 200),
          referredName: (currentUser.displayName || newUserName || 'Candidate').slice(0, 120),
          timestamp: Date.now(),
          daysAwarded: 0,
          rewardDays: 0,
          status: 'verified',
          createdAt: serverTimestamp()
        }),
        3000
      );

      try {
        localStorage.setItem(`tw_verified_ref_${currentUser.uid}`, cleanCode);
        localStorage.removeItem('tw_pending_ref_code');
      } catch {
        // ignore
      }

      return {
        success: true,
        message: `Invite code ${cleanCode} verified and linked to your account!`
      };
    } catch (e: any) {
      return {
        success: false,
        message: e?.message || 'Invite code could not be verified at this time.'
      };
    }
  },

  // =========================================================================
  // --- Custom Passages & CMS Additions ---
  // =========================================================================

  getCustomPassages(): Passage[] {
    try {
      const data = localStorage.getItem('tw_custom_passages');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveCustomPassage(passage: Passage): void {
    try {
      const existing = this.getCustomPassages().filter((p) => p.id !== passage.id);
      existing.unshift(passage);
      localStorage.setItem('tw_custom_passages', JSON.stringify(existing));

      if (auth.currentUser) {
        setDoc(doc(db, 'passages', passage.id), {
          ...passage,
          updatedAt: serverTimestamp()
        }, { merge: true }).catch(() => {});
      }
    } catch (e) {
      console.warn('Error saving custom passage:', e);
    }
  },

  deleteCustomPassage(passageId: string): void {
    try {
      const existing = this.getCustomPassages().filter((p) => p.id !== passageId);
      localStorage.setItem('tw_custom_passages', JSON.stringify(existing));
    } catch (e) {
      console.warn('Error deleting custom passage:', e);
    }
  }
};

// Listen to online events to drain any offline completed test results
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    StorageService.drainOfflineQueue().catch(() => {});
  });
}


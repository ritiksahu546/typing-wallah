import { TestResultRecord } from '../types';

export interface ResultVerificationOutcome {
  valid: boolean;
  leaderboardEligible: boolean;
  reason?: string;
}

export interface RateLimitOutcome {
  allowed: boolean;
  retryAfterMs?: number;
  reason?: string;
}

interface UserRateState {
  recentSubmissions: { testId: string; timestampMs: number }[];
}

const rateLimitStore = new Map<string, UserRateState>();

const MIN_NEW_SUBMISSION_INTERVAL_MS = 3000;
const RATE_WINDOW_MS = 60_000;
const MAX_SUBMISSIONS_PER_WINDOW = 8;

function isFiniteNum(val: unknown): val is number {
  return typeof val === 'number' && Number.isFinite(val);
}

/**
 * Verifies a test result payload for schema integrity, mathematical WPM/character consistency,
 * and public leaderboard plausibility ceilings.
 *
 * Security Note:
 * While this validates telemetry consistency and human speed/accuracy plausibility bounds,
 * browser-submitted metrics alone cannot prove that keystrokes were not synthesized in the client.
 */
export function verifyLeaderboardSubmissionPayload(
  result: TestResultRecord,
  uid?: string
): ResultVerificationOutcome {
  if (!result || typeof result !== 'object') {
    return { valid: false, leaderboardEligible: false, reason: 'Missing result payload' };
  }
  if (uid !== undefined && (!uid || typeof uid !== 'string' || uid.trim().length === 0)) {
    return { valid: false, leaderboardEligible: false, reason: 'Invalid authenticated user ID' };
  }
  if (!result.id || typeof result.id !== 'string' || result.id.length > 120) {
    return { valid: false, leaderboardEligible: false, reason: 'Invalid result ID' };
  }
  if (!result.examId || typeof result.examId !== 'string' || result.examId.length > 60) {
    return { valid: false, leaderboardEligible: false, reason: 'Invalid exam ID' };
  }
  if (result.language !== 'english' && result.language !== 'hindi') {
    return { valid: false, leaderboardEligible: false, reason: 'Invalid language' };
  }
  if (!isFiniteNum(result.durationSeconds) || result.durationSeconds < 10 || result.durationSeconds > 7200) {
    return { valid: false, leaderboardEligible: false, reason: 'Test duration out of valid range (10s - 7200s)' };
  }

  const m = result.metrics;
  if (!m || typeof m !== 'object') {
    return { valid: false, leaderboardEligible: false, reason: 'Missing metrics object' };
  }
  if (!isFiniteNum(m.grossWpm) || m.grossWpm < 0 || m.grossWpm > 300) {
    return { valid: false, leaderboardEligible: false, reason: 'Gross WPM out of valid bounds (0 - 300)' };
  }
  if (!isFiniteNum(m.netWpm) || m.netWpm < 0 || m.netWpm > 300) {
    return { valid: false, leaderboardEligible: false, reason: 'Net WPM out of valid bounds (0 - 300)' };
  }
  if (m.netWpm > m.grossWpm) {
    return { valid: false, leaderboardEligible: false, reason: 'Net WPM cannot exceed Gross WPM' };
  }
  if (!isFiniteNum(m.accuracy) || m.accuracy < 0 || m.accuracy > 100) {
    return { valid: false, leaderboardEligible: false, reason: 'Accuracy must be between 0 and 100' };
  }
  if (!isFiniteNum(m.totalChars) || m.totalChars < 1 || m.totalChars > 50000) {
    return { valid: false, leaderboardEligible: false, reason: 'Total characters out of bounds (1 - 50000)' };
  }
  if (!isFiniteNum(m.correctChars) || m.correctChars < 0 || m.correctChars > m.totalChars) {
    return { valid: false, leaderboardEligible: false, reason: 'Invalid correct character count' };
  }
  if (
    !isFiniteNum(m.incorrectChars) ||
    m.incorrectChars < 0 ||
    m.correctChars + m.incorrectChars > m.totalChars + 5
  ) {
    return { valid: false, leaderboardEligible: false, reason: 'Invalid incorrect character count' };
  }
  if (!isFiniteNum(m.errors) || m.errors < 0 || m.errors > 50000) {
    return { valid: false, leaderboardEligible: false, reason: 'Invalid error count' };
  }
  if (!isFiniteNum(m.backspaceCount) || m.backspaceCount < 0 || m.backspaceCount > 50000) {
    return { valid: false, leaderboardEligible: false, reason: 'Invalid backspace count' };
  }
  if (!isFiniteNum(m.keyDepressions) || m.keyDepressions < 0 || m.keyDepressions > 60000) {
    return { valid: false, leaderboardEligible: false, reason: 'Invalid key depressions count' };
  }
  if (
    !isFiniteNum(m.elapsedSeconds) ||
    m.elapsedSeconds < 1 ||
    m.elapsedSeconds > result.durationSeconds + 1
  ) {
    return { valid: false, leaderboardEligible: false, reason: 'Invalid elapsed seconds' };
  }

  // Mathematical consistency check: grossWpm must align with (totalChars / 5) / (elapsedSeconds / 60)
  const expectedGrossWpm = (m.totalChars / 5) / (m.elapsedSeconds / 60);
  if (Math.abs(m.grossWpm - expectedGrossWpm) > 8) {
    return {
      valid: false,
      leaderboardEligible: false,
      reason: 'Reported WPM does not match character count and elapsed time'
    };
  }

  // Determine whether this valid personal result also qualifies for public leaderboard ranking
  const leaderboardEligible =
    m.elapsedSeconds >= 10 &&
    m.totalChars >= 25 &&
    m.netWpm <= 220 &&
    m.grossWpm <= 240 &&
    m.accuracy >= 50;

  return {
    valid: true,
    leaderboardEligible,
    reason: leaderboardEligible
      ? undefined
      : 'Result saved to personal history, but does not meet public leaderboard thresholds (min 10s, 25 chars, >=50% accuracy, <=220 Net WPM)'
  };
}

/**
 * Sliding-window per-user rate limiter for result and leaderboard submissions.
 * Allows idempotent retries of an already-submitted `testId` while blocking rapid spam of new testIds.
 */
export function checkSubmissionRateLimit(
  uid: string,
  testId: string,
  nowMs: number = Date.now()
): RateLimitOutcome {
  if (!uid || !testId) {
    return { allowed: false, reason: 'Missing user ID or test ID' };
  }

  const state = rateLimitStore.get(uid) || { recentSubmissions: [] };
  // Prune entries older than the 60s sliding window
  state.recentSubmissions = state.recentSubmissions.filter(
    (entry) => nowMs - entry.timestampMs < RATE_WINDOW_MS
  );

  // If this exact testId was already seen in the window, allow idempotent retry
  const existingEntry = state.recentSubmissions.find((entry) => entry.testId === testId);
  if (existingEntry) {
    rateLimitStore.set(uid, state);
    return { allowed: true };
  }

  // Enforce minimum interval between distinct test submissions
  const latest = state.recentSubmissions[state.recentSubmissions.length - 1];
  if (latest && nowMs - latest.timestampMs < MIN_NEW_SUBMISSION_INTERVAL_MS) {
    const retryAfterMs = MIN_NEW_SUBMISSION_INTERVAL_MS - (nowMs - latest.timestampMs);
    return {
      allowed: false,
      retryAfterMs,
      reason: 'Submission cooldown active. Please wait a few seconds before submitting another result.'
    };
  }

  // Enforce maximum submissions per 60-second window
  if (state.recentSubmissions.length >= MAX_SUBMISSIONS_PER_WINDOW) {
    const oldestInWindow = state.recentSubmissions[0];
    const retryAfterMs = Math.max(1000, RATE_WINDOW_MS - (nowMs - oldestInWindow.timestampMs));
    return {
      allowed: false,
      retryAfterMs,
      reason: 'Rate limit exceeded (max 8 submissions per minute).'
    };
  }

  state.recentSubmissions.push({ testId, timestampMs: nowMs });
  rateLimitStore.set(uid, state);
  return { allowed: true };
}

export function resetSubmissionRateLimiterForTesting(): void {
  rateLimitStore.clear();
}

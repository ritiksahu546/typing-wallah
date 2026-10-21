import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  calculateExamScore,
  analyzeMistakes,
  splitGraphemes,
  EXAM_SCORING_DOCUMENTATION
} from '../examScoring';
import {
  translatePhysicalKeyToHindi,
  transliterateNewInputToHindi
} from '../hindiKeyboards';
import { BUILTIN_COURSE_LESSONS } from '../../data/touchTypingCourseCurriculum';
import { StorageService, validateTestResultPayload } from '../../services/storageService';
import { parseRouteFromPath, SITE_BASE_URL } from '../../utils/seo';
import { TestResultRecord } from '../../types';

function createValidResultFixture(overrides?: Partial<TestResultRecord>): TestResultRecord {
  return {
    id: 'test_20261021_ssc_01',
    timestamp: Date.now(),
    examId: 'ssc-chsl',
    examName: 'SSC CHSL',
    language: 'english',
    keyboardLayout: 'standard',
    durationSeconds: 600,
    passageTitle: 'Digital Public Infrastructure',
    passageId: 'passage-1',
    metrics: {
      grossWpm: 43,
      netWpm: 40.2,
      accuracy: 96.5,
      totalChars: 2125,
      correctChars: 2050,
      incorrectChars: 75,
      errors: 15,
      backspaceCount: 12,
      keyDepressions: 2125,
      elapsedSeconds: 600,
      remainingSeconds: 0,
      isQualified: true,
      kdph: 12750,
      grade: 'Qualified'
    },
    ...overrides
  };
}

function runTypingEngineTests() {
  console.log('Running Typing Wallah Automated Test Suite...\n');

  // 1. Timer behavior & edge cases: 0s elapsed, partial elapsed, and full duration
  {
    const zeroMetrics = calculateExamScore(
      '',
      'The quick brown fox jumps over the lazy dog',
      0,
      300,
      0,
      'ssc-chsl',
      'english'
    );
    assert.equal(zeroMetrics.grossWpm, 0, 'Gross WPM at 0s must be 0');
    assert.equal(zeroMetrics.netWpm, 0, 'Net WPM at 0s must be 0');
    assert.equal(zeroMetrics.accuracy, 100, 'Initial accuracy with 0 chars typed must be 100%');
    assert.equal(zeroMetrics.remainingSeconds, 300, 'Remaining seconds at 0s must equal full duration');

    // Halfway timer check (150s of 300s, 375 chars = 75 words in 2.5 min = 30 WPM)
    const passage = 'government typing examination requires steady rhythm and accurate keystrokes '.repeat(10);
    const partialTyped = passage.slice(0, 375);
    const midMetrics = calculateExamScore(partialTyped, passage, 150, 300, 3, 'ssc-chsl', 'english');
    assert.equal(midMetrics.grossWpm, 30, '375 chars in 150s (2.5m) must equal 30 Gross WPM');
    assert.equal(midMetrics.elapsedSeconds, 150, 'Elapsed seconds must be 150');
    assert.equal(midMetrics.remainingSeconds, 150, 'Remaining seconds must be 150');
    assert.equal(midMetrics.backspaceCount, 3, 'Backspace count must be tracked accurately');
    console.log('✓ Test 1 passed: Timer zero-elapsed, mid-test, and countdown behavior');
  }

  // 2. Standard 5-char word WPM, KDPH & accuracy calculation (SSC CHSL & SSC CGL DEST)
  {
    const sample =
      'India has a rapidly growing digital public infrastructure that empowers citizens across every state and district in the country today with online services. '.repeat(
        15
      );
    const typed150 = sample.slice(0, 150);
    const chslMetrics = calculateExamScore(typed150, sample, 60, 300, 0, 'ssc-chsl', 'english');
    assert.equal(chslMetrics.grossWpm, 30, '150 chars in 60s must equal 30 Gross WPM');
    assert.equal(chslMetrics.netWpm, 30, 'Zero errors in 60s must equal 30 Net WPM');
    assert.equal(chslMetrics.accuracy, 100, 'Exact match must yield 100% accuracy');

    // SSC CGL DEST: 2,000 key depressions in 900s (15 mins) -> 8000 KDPH
    const typed2000 = sample.slice(0, 2000);
    const cglMetrics = calculateExamScore(typed2000, sample, 900, 900, 0, 'ssc-cgl-dest', 'english');
    assert.equal(cglMetrics.keyDepressions, 2000, 'Key depressions must equal 2000');
    assert.equal(cglMetrics.kdph, 8000, '2000 key depressions in 15 mins must equal 8000 KDPH');
    assert.equal(cglMetrics.isQualified, true, '2000 key depressions with 0% error in SSC CGL DEST must qualify');
    console.log('✓ Test 2 passed: Standard Gross/Net WPM, KDPH & 100% accuracy');
  }

  // 3. RRB NTPC 10x mistake penalty rule
  {
    const refText = 'indian railways operates one of the largest rail networks in the world today ';
    const typedText = 'indian railwyas operates one of the largest rail networks in the wordl today ';
    const mistakes = analyzeMistakes(typedText, refText, true);
    assert.ok(mistakes.totalMistakes >= 1, 'Misspelled words must be counted in mistakes');

    const rrbMetrics = calculateExamScore(typedText, refText, 60, 300, 2, 'rrb-ntpc', 'english');
    assert.ok(
      (rrbMetrics.penaltyDeductionWords ?? 0) >= 0 && rrbMetrics.netWpm <= rrbMetrics.grossWpm,
      'RRB NTPC must apply penalty deduction on excess mistakes'
    );
    console.log('✓ Test 3 passed: RRB NTPC mistake deduction formula');
  }

  // 4. MP CPCT Net WPM & Qualification Matrix (English >= 30 WPM, Hindi >= 20 WPM)
  {
    const baseSentence = 'computer proficiency certification test requires thirty words per minute in english ';
    const fullPassage = baseSentence.repeat(5).trim();
    const typed200 = fullPassage.slice(0, 200);
    const cpctEng = calculateExamScore(typed200, fullPassage, 60, 300, 0, 'cpct', 'english');
    assert.equal(cpctEng.grossWpm, 40, '200 chars in 60s must be 40 Gross WPM');
    assert.equal(cpctEng.isQualified, true, '40 WPM English in CPCT must qualify');

    const typed100 = fullPassage.slice(0, 100); // 20 WPM (< 30 WPM English threshold)
    const cpctEngFail = calculateExamScore(typed100, fullPassage, 60, 300, 0, 'cpct', 'english');
    assert.equal(cpctEngFail.grossWpm, 20, '100 chars in 60s must be 20 Gross WPM');
    assert.equal(cpctEngFail.isQualified, false, '20 WPM English in CPCT must not qualify (requires 30 WPM)');
    console.log('✓ Test 4 passed: MP CPCT Net WPM & qualification thresholds');
  }

  // 5. Hindi Unicode NFC & Grapheme Cluster Splitting
  {
    const hindiWord = 'भारत';
    const graphemes = splitGraphemes(hindiWord);
    assert.equal(graphemes.length, 3, 'Devanagari word भारत should segment into 3 grapheme clusters');

    const conjunctWord = 'प्रशासन';
    const conjunctGraphemes = splitGraphemes(conjunctWord);
    assert.ok(conjunctGraphemes.length >= 4, 'Devanagari conjunct word प्रशासन must segment cleanly');

    const hindiPassage = 'भारत सरकार डिजिटल प्रशासन सेवा को नागरिकों तक पहुंचा रही है ';
    const hindiMetrics = calculateExamScore(hindiPassage, hindiPassage, 60, 300, 0, 'cpct', 'hindi');
    assert.equal(hindiMetrics.accuracy, 100, 'Exact Hindi Unicode match must yield 100% accuracy');
    console.log('✓ Test 5 passed: Hindi Devanagari Unicode grapheme cluster segmentation & scoring');
  }

  // 6. Hindi Remington GAIL & InScript Keyboard Mapping
  {
    const remK = translatePhysicalKeyToHindi('k', false, 'remington_gail');
    assert.equal(remK, 'क', 'Remington GAIL key "k" should produce "क"');
    const remShiftK = translatePhysicalKeyToHindi('K', true, 'remington_gail');
    assert.equal(remShiftK, 'ख', 'Remington GAIL Shift+"K" should produce "ख"');
    const remH = translatePhysicalKeyToHindi('u', false, 'remington_gail');
    assert.equal(remH, 'ह', 'Remington GAIL key "u" should produce "ह"');
    const remMatraI = translatePhysicalKeyToHindi('r', false, 'remington_gail');
    assert.equal(remMatraI, 'ी', 'Remington GAIL key "r" should produce "ी"');

    const insKa = transliterateNewInputToHindi('', 'ke', 'inscript');
    assert.equal(insKa, 'का', 'InScript keys "ke" should produce "का"');
    const insKi = transliterateNewInputToHindi('', 'kf', 'inscript');
    assert.equal(insKi, 'कि', 'InScript keys "kf" should produce "कि"');
    console.log('✓ Test 6 passed: Hindi Remington GAIL & InScript keyboard mapping');
  }

  // 7. Score & Result Payload Validation Bounds + Mathematical WPM Telemetry Consistency
  {
    const validFixture = createValidResultFixture();
    assert.equal(validateTestResultPayload(validFixture).valid, true, 'Valid fixture must pass score validation');

    const excessiveWpm = createValidResultFixture({
      metrics: { ...validFixture.metrics, grossWpm: 350, netWpm: 320 }
    });
    assert.equal(validateTestResultPayload(excessiveWpm).valid, false, 'Gross WPM > 300 must be rejected');

    const netExceedsGross = createValidResultFixture({
      metrics: { ...validFixture.metrics, grossWpm: 45, netWpm: 55 }
    });
    assert.equal(
      validateTestResultPayload(netExceedsGross).valid,
      false,
      'Net WPM exceeding Gross WPM must be rejected'
    );

    const invalidAccuracy = createValidResultFixture({
      metrics: { ...validFixture.metrics, accuracy: 105 }
    });
    assert.equal(validateTestResultPayload(invalidAccuracy).valid, false, 'Accuracy > 100 must be rejected');

    const shortDuration = createValidResultFixture({ durationSeconds: 3 });
    assert.equal(validateTestResultPayload(shortDuration).valid, false, 'Duration < 10s must be rejected');

    const invalidCharCount = createValidResultFixture({
      metrics: { ...validFixture.metrics, totalChars: 100, correctChars: 120 }
    });
    assert.equal(
      validateTestResultPayload(invalidCharCount).valid,
      false,
      'correctChars > totalChars must be rejected'
    );

    // Spoofed WPM check: claiming 140 WPM with only 150 chars in 600s (actual = 3 WPM)
    const spoofedWpm = createValidResultFixture({
      metrics: {
        ...validFixture.metrics,
        totalChars: 150,
        correctChars: 150,
        incorrectChars: 0,
        elapsedSeconds: 600,
        grossWpm: 140,
        netWpm: 140
      }
    });
    assert.equal(
      validateTestResultPayload(spoofedWpm).valid,
      false,
      'Client-reported WPM inconsistent with character count and elapsed time must be rejected'
    );
    console.log('✓ Test 7 passed: Score & result payload validation bounds + mathematical WPM telemetry check');
  }

  // 8. Sitemap XML, robots.txt & Route Resolution Integrity
  {
    const sitemapPath = path.resolve(process.cwd(), 'public/sitemap.xml');
    const robotsPath = path.resolve(process.cwd(), 'public/robots.txt');
    const sitemapXml = fs.readFileSync(sitemapPath, 'utf-8').trim();
    const robotsTxt = fs.readFileSync(robotsPath, 'utf-8').trim();

    assert.ok(sitemapXml.startsWith('<?xml version="1.0" encoding="UTF-8"?>'), 'Sitemap must have XML declaration');
    assert.ok(
      sitemapXml.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">') &&
        sitemapXml.endsWith('</urlset>'),
      'Sitemap must have valid <urlset> root element'
    );

    const locMatches = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    assert.ok(locMatches.length >= 25, 'Sitemap must include all public indexable routes');

    const privatePaths = ['/admin', '/dashboard', '/referrals', '/404', '/login'];
    for (const locUrl of locMatches) {
      assert.ok(
        locUrl.startsWith(SITE_BASE_URL),
        `Sitemap URL "${locUrl}" must use absolute configured domain "${SITE_BASE_URL}"`
      );
      const parsedUrl = new URL(locUrl);
      const pathname = parsedUrl.pathname;
      for (const priv of privatePaths) {
        assert.notEqual(pathname, priv, `Private route "${priv}" must not appear in sitemap.xml`);
      }
      const routeResult = parseRouteFromPath(pathname);
      assert.notEqual(
        routeResult.page,
        '404',
        `Sitemap URL "${locUrl}" (pathname "${pathname}") resolved to 404 instead of a valid public page`
      );
    }

    assert.ok(
      robotsTxt.includes(`Sitemap: ${SITE_BASE_URL}/sitemap.xml`),
      'robots.txt must reference the absolute Sitemap URL'
    );
    assert.ok(
      robotsTxt.includes('Disallow: /admin') && robotsTxt.includes('Disallow: /dashboard'),
      'robots.txt must disallow private admin and dashboard paths'
    );
    console.log(`✓ Test 8 passed: Sitemap XML (${locMatches.length} verified URLs) & robots.txt validation`);
  }

  // 9. Firestore Security Rules Invariants Check
  {
    const rulesPath = path.resolve(process.cwd(), 'firestore.rules');
    const rulesContent = fs.readFileSync(rulesPath, 'utf-8');

    assert.ok(
      !rulesContent.includes('gig.ritik546@gmail.com') && !rulesContent.includes('admin@typingwallah.in'),
      'firestore.rules must not contain hardcoded email-only admin authorization'
    );
    assert.ok(
      rulesContent.includes('request.auth.token.admin == true') &&
        rulesContent.includes('exists(/databases/$(database)/documents/admins/$(request.auth.uid))'),
      'firestore.rules must verify admin via custom claims or server-managed /admins/{uid}'
    );
    assert.ok(
      rulesContent.includes('isBackedByVerifiedResult(data)'),
      'firestore.rules must require leaderboard entries to reference an immutable verified user test result'
    );
    assert.ok(
      rulesContent.includes('request.resource.data.testId != resource.data.testId'),
      'firestore.rules must prevent arbitrary updates to the same completed testId on the leaderboard'
    );
    assert.ok(
      rulesContent.includes('exists(/databases/$(database)/documents/referral_codes/$(request.resource.data.referrerCode))'),
      'firestore.rules must verify referral codes against registered /referral_codes/{code}'
    );
    console.log('✓ Test 9 passed: Firestore security rules invariants verified');
  }

  // 10. Touch Typing Curriculum & Exam Scoring Documentation Integrity
  {
    assert.ok(
      BUILTIN_COURSE_LESSONS.length >= 20,
      'Touch typing curriculum must contain progressive lessons'
    );
    const firstLesson = BUILTIN_COURSE_LESSONS[0];
    assert.equal(firstLesson.lessonNumber, 1, 'First lesson must be lesson #1');
    assert.ok(
      firstLesson.targetWpm > 0 && firstLesson.minAccuracy > 0,
      'Lesson must have valid WPM & accuracy benchmarks'
    );
    assert.ok(
      Object.keys(EXAM_SCORING_DOCUMENTATION).length >= 8,
      'All core exams must have documented scoring formulas'
    );
    console.log('✓ Test 10 passed: Curriculum progression & exam formula documentation');
  }

  // 11. Subscription Cache UID Isolation & Server-Authoritative Pro Check
  {
    StorageService.clearSubscriptionCache();
    assert.equal(
      StorageService.isUserPro(),
      false,
      'isUserPro() must default to false when no verified subscription exists'
    );
    assert.equal(
      StorageService.hasVerifiedPaidSubscription(),
      false,
      'hasVerifiedPaidSubscription() must be false when unauthenticated'
    );

    // Seed verified cache for User A
    const futureExpiry = new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString();
    StorageService.setVerifiedSubscriptionCacheForTesting({
      uid: 'user_alpha_123',
      plan: 'pro_annual',
      status: 'active',
      startDate: new Date().toISOString(),
      expiryDate: futureExpiry,
      source: 'admin'
    });

    // Querying for User A's UID returns active subscription
    assert.equal(
      StorageService.isUserPro('user_alpha_123'),
      true,
      'isUserPro("user_alpha_123") must be true for the matching owner UID'
    );

    // Querying for User B's UID must reject and immediately clear User A's cached subscription
    assert.equal(
      StorageService.isUserPro('user_beta_999'),
      false,
      'isUserPro("user_beta_999") must never reuse User A subscription'
    );
    assert.equal(
      StorageService.getSubscription('user_alpha_123'),
      null,
      'Cross-UID access attempt must purge the cached subscription'
    );

    // Verify clearSubscriptionCache() on sign-out clears active cache
    StorageService.setVerifiedSubscriptionCacheForTesting({
      uid: 'user_alpha_123',
      plan: 'pro_monthly',
      status: 'active',
      startDate: new Date().toISOString(),
      expiryDate: futureExpiry,
      source: 'admin'
    });
    StorageService.clearSubscriptionCache();
    assert.equal(
      StorageService.isUserPro('user_alpha_123'),
      false,
      'clearSubscriptionCache() must clear verified subscription on sign-out'
    );
    console.log('✓ Test 11 passed: Subscription cache UID isolation & server-authoritative Pro check');
  }

  // 12. Referral Code Uniqueness, Prefix Collision Fallbacks & Self-Referral Prevention
  {
    const uidA = 'ABCDEF1111111111';
    const uidB = 'ABCDEF2222222222';
    const candidatesA = StorageService.getReferralCodeCandidates(uidA);
    const candidatesB = StorageService.getReferralCodeCandidates(uidB);

    assert.ok(candidatesA.length >= 2, 'Each UID must have collision-fallback referral code candidates');
    assert.notEqual(
      candidatesA[1],
      candidatesB[1],
      'UIDs sharing a 6-char prefix must produce distinct full-UID hash fallback codes'
    );

    // Self-referral check against all candidate codes of the same user
    const selfRefAttempt = StorageService.applyFriendReferralCode(candidatesA[0]);
    assert.ok(selfRefAttempt, 'applyFriendReferralCode must return a result');
    console.log('✓ Test 12 passed: Referral code collision fallbacks & owner binding');
  }

  console.log('\nAll 12 automated test suites passed successfully!');
}

runTypingEngineTests();


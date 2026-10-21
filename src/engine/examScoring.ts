import { ExamId, TypingMetrics } from '../types';
import { EXAMS_DATA } from '../data/exams';

export interface DetailedMistakes {
  fullMistakes: number;
  halfMistakes: number;
  totalMistakes: number;
  omittedWords: number;
  substitutedWords: number;
  spellingErrors: number;
  capitalizationErrors: number;
  punctuationErrors: number;
}

export interface ExamScoreResult extends TypingMetrics {
  kdph: number;
  mistakesDetail: DetailedMistakes;
  allowedMistakes: number;
  penaltyMistakes: number;
  penaltyDeductionWords: number;
  errorPercentage: number;
  targetSpeed: number;
  speedUnit: 'WPM' | 'KDPH';
  isQualified: boolean;
  qualificationReason: string;
  scoringFormulaName: string;
  grade: 'A+' | 'A' | 'B' | 'C' | 'Unqualified';
}

/**
 * Computes word-level full and half mistakes according to official government exam guidelines.
 * Full mistake = Complete omission of a word, complete substitution, or extra inserted word.
 * Half mistake = Case mismatch (Capital/Small), punctuation mistake, or minor spelling transposition.
 * NOTE: Untyped words at the end of the passage are NOT mistakes; they are pending words.
 */
export function analyzeMistakes(typedText: string, targetText: string, includeInProgressLastWord = false): DetailedMistakes {
  const normTarget = targetText.normalize('NFC');
  const normTyped = typedText.normalize('NFC');

  const targetWords = normTarget.trim().split(/\s+/).filter(Boolean);
  const allTypedWords = normTyped.trim().split(/\s+/).filter(Boolean);

  // If the user is currently in the middle of typing the last word (no trailing space),
  // do not evaluate that incomplete word as a completed word mistake unless explicitly requested
  const hasTrailingSpace = /\s$/.test(normTyped);
  const typedWords =
    !includeInProgressLastWord && allTypedWords.length > 0 && !hasTrailingSpace
      ? allTypedWords.slice(0, -1)
      : allTypedWords;

  let fullMistakes = 0;
  let halfMistakes = 0;
  let omittedWords = 0;
  let substitutedWords = 0;
  let spellingErrors = 0;
  let capitalizationErrors = 0;
  let punctuationErrors = 0;

  if (typedWords.length === 0) {
    return {
      fullMistakes: 0,
      halfMistakes: 0,
      totalMistakes: 0,
      omittedWords: 0,
      substitutedWords: 0,
      spellingErrors: 0,
      capitalizationErrors: 0,
      punctuationErrors: 0
    };
  }

  let tgtIdx = 0;
  for (let i = 0; i < typedWords.length; i++) {
    const typ = typedWords[i];
    const tgt = targetWords[tgtIdx];

    if (tgt === undefined) {
      // Extra inserted word beyond passage
      fullMistakes += 1;
      substitutedWords += 1;
      continue;
    }

    // 1. Exact match
    if (tgt === typ) {
      tgtIdx++;
      continue;
    }

    // 2. Check if candidate skipped targetWords[tgtIdx] (lookahead 1 in target)
    if (tgtIdx + 1 < targetWords.length && targetWords[tgtIdx + 1] === typ) {
      fullMistakes += 1;
      omittedWords += 1;
      tgtIdx += 2; // Counted skipped word, current typ matches targetWords[tgtIdx + 1]
      continue;
    }

    // 3. Check if candidate inserted an extra word (lookahead 1 in typed)
    if (i + 1 < typedWords.length && typedWords[i + 1] === tgt) {
      fullMistakes += 1;
      substitutedWords += 1;
      // Do not advance tgtIdx so the next typed word matches tgt
      continue;
    }

    // 4. Check if difference is purely capitalization (Half mistake)
    if (tgt.toLowerCase() === typ.toLowerCase()) {
      halfMistakes += 1;
      capitalizationErrors += 1;
      tgtIdx++;
      continue;
    }

    // 5. Check if difference is punctuation (Half mistake, including Hindi Purna Viram '।')
    const cleanTgt = tgt.replace(/[.,/#!$%^&*;:{}=\-_`~()?"'।]/g, '');
    const cleanTyp = typ.replace(/[.,/#!$%^&*;:{}=\-_`~()?"'।]/g, '');
    if (cleanTgt.length > 0 && cleanTgt.toLowerCase() === cleanTyp.toLowerCase()) {
      halfMistakes += 1;
      punctuationErrors += 1;
      tgtIdx++;
      continue;
    }

    // 6. Check edit distance for minor spelling error (1 char typo or <= 2 on 4+ char word is half mistake)
    const dist = levenshteinDistance(tgt, typ);
    if (dist === 1 || (dist <= 2 && tgt.length >= 4)) {
      halfMistakes += 1;
      spellingErrors += 1;
    } else {
      fullMistakes += 1;
      substitutedWords += 1;
    }
    tgtIdx++;
  }

  const totalMistakes = fullMistakes + (halfMistakes * 0.5);

  return {
    fullMistakes,
    halfMistakes,
    totalMistakes: Number(totalMistakes.toFixed(1)),
    omittedWords,
    substitutedWords,
    spellingErrors,
    capitalizationErrors,
    punctuationErrors
  };
}

function levenshteinDistance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }

  return dp[m][n];
}

/**
 * Master Exam Scoring Engine for all government and skill tests
 */
export function calculateExamScore(
  typedText: string,
  targetText: string,
  elapsedSeconds: number,
  totalDurationSeconds: number,
  backspaceCount: number,
  examId?: ExamId | 'general',
  language: 'english' | 'hindi' = 'english'
): ExamScoreResult {
  const normTyped = typedText.normalize('NFC');
  const normTarget = targetText.normalize('NFC');

  // Stabilize elapsed time (min 1.5s when active) so WPM does not spike on the first keystroke
  const effectiveElapsedSeconds = normTyped.length > 0 ? Math.max(elapsedSeconds, 1.5) : Math.max(elapsedSeconds, 1);
  const safeElapsedMinutes = effectiveElapsedSeconds / 60;
  const remainingSeconds = Math.max(0, Math.ceil(totalDurationSeconds - elapsedSeconds));

  const targetWords = normTarget.trim().split(/\s+/).filter(Boolean);
  const typedWords = normTyped.trim().split(/\s+/).filter(Boolean);
  const hasTrailingSpace = /\s$/.test(normTyped);

  // Word-aligned character accuracy calculation (without inflating totalChars beyond normTyped.length)
  let correctChars = 0;
  let incorrectChars = 0;

  let alignTgtIdx = 0;
  for (let i = 0; i < typedWords.length; i++) {
    const typ = typedWords[i];
    const tgt = targetWords[alignTgtIdx];
    const isLastWord = i === typedWords.length - 1;
    const isInProgressWord = isLastWord && !hasTrailingSpace;
    const wordHasSpaceAfter = !isLastWord || hasTrailingSpace;

    if (!tgt) {
      incorrectChars += typ.length + (wordHasSpaceAfter ? 1 : 0);
      continue;
    }

    if (isInProgressWord) {
      // User is still typing this word: only evaluate the characters typed so far
      for (let c = 0; c < typ.length; c++) {
        if (c < tgt.length && typ[c] === tgt[c]) {
          correctChars++;
        } else {
          incorrectChars++;
        }
      }
      alignTgtIdx++;
      continue;
    }

    if (typ === tgt) {
      // Exact completed word match: all letters + trailing space are correct
      correctChars += typ.length + (wordHasSpaceAfter ? 1 : 0);
      alignTgtIdx++;
    } else if (alignTgtIdx + 1 < targetWords.length && targetWords[alignTgtIdx + 1] === typ) {
      // Candidate skipped tgt, current typ matches next target word
      correctChars += typ.length + (wordHasSpaceAfter ? 1 : 0);
      alignTgtIdx += 2;
    } else if (i + 1 < typedWords.length && typedWords[i + 1] === tgt) {
      // Candidate inserted an extra word
      incorrectChars += typ.length + (wordHasSpaceAfter ? 1 : 0);
    } else {
      // Completed word with mismatch: compare character by character up to typ.length
      for (let c = 0; c < typ.length; c++) {
        if (c < tgt.length && typ[c] === tgt[c]) {
          correctChars++;
        } else {
          incorrectChars++;
        }
      }
      if (wordHasSpaceAfter) {
        // If user pressed space early before completing the word, the space itself was premature
        if (typ.length < tgt.length) {
          incorrectChars++;
        } else {
          correctChars++;
        }
      }
      alignTgtIdx++;
    }
  }

  const totalChars = normTyped.length;
  correctChars = Math.min(totalChars, correctChars);
  incorrectChars = Math.max(0, totalChars - correctChars);

  const keyDepressions = totalChars;
  const kdph = totalChars > 0 && elapsedSeconds > 0 ? Math.round((keyDepressions / safeElapsedMinutes) * 60) : 0;

  // Standard word conversion: 5 characters / keystrokes = 1 word
  const grossWords = totalChars / 5;
  const grossWpm = totalChars > 0 && elapsedSeconds > 0 ? Math.round(grossWords / safeElapsedMinutes) : 0;

  // Detailed full and half mistakes evaluation (only on completed words)
  const mistakesDetail = analyzeMistakes(normTyped, normTarget, false);
  const accuracy = totalChars > 0 ? Number(((correctChars / totalChars) * 100).toFixed(1)) : 100;
  const errorPercentage = totalChars > 0 ? Number(((incorrectChars / totalChars) * 100).toFixed(2)) : 0;

  // Effective mistake words accounts for both word-level mistakes and raw mistyped character spans
  const effectiveMistakeWords = Math.max(mistakesDetail.totalMistakes, incorrectChars / 5);

  // Initialize scoring variables
  let netWpm = 0;
  let allowedMistakes = 0;
  let penaltyMistakes = 0;
  let penaltyDeductionWords = 0;
  let isQualified = false;
  let qualificationReason = '';
  let scoringFormulaName = 'Standard WPM Formula';
  let targetSpeed = 30;
  let speedUnit: 'WPM' | 'KDPH' = 'WPM';

  const examConfig = examId && examId !== 'general' ? EXAMS_DATA[examId] : null;

  if (examConfig) {
    targetSpeed = language === 'hindi'
      ? (examConfig.qualifyingHindiWpm || 25)
      : (examConfig.qualifyingEnglishWpm || 30);
  }

  switch (examId) {
    case 'patna-hc': {
      // Official High Court of Judicature at Patna:
      // Minimum Qualifying: 40 WPM (English) / 30 WPM (Hindi) with 90% accuracy
      // Net Words = Gross Words - Total Mistakes
      scoringFormulaName = 'Patna High Court Official Standard (1 Error = 1 Word Deduction)';
      const reqSpeed = language === 'hindi' ? 30 : 40;
      targetSpeed = reqSpeed;

      penaltyMistakes = mistakesDetail.totalMistakes;
      penaltyDeductionWords = effectiveMistakeWords;
      const netWords = Math.max(0, grossWords - penaltyDeductionWords);
      netWpm = totalChars > 0 && elapsedSeconds > 0 ? Math.max(0, Math.round(netWords / safeElapsedMinutes)) : 0;
      isQualified = netWpm >= reqSpeed && accuracy >= 90;

      if (isQualified) {
        qualificationReason = `Qualified! Net Speed of ${netWpm} WPM with ${accuracy}% accuracy satisfies Patna High Court benchmark (>= ${reqSpeed} WPM, >= 90% accuracy).`;
      } else {
        qualificationReason = netWpm < reqSpeed
          ? `Not Qualified: Net speed of ${netWpm} WPM is below Patna High Court qualifying cutoff of ${reqSpeed} WPM (Gross: ${grossWpm} WPM, Errors: ${mistakesDetail.totalMistakes}).`
          : `Not Qualified: Accuracy of ${accuracy}% is below Patna High Court minimum threshold of 90%.`;
      }
      break;
    }

    case 'rrb-ntpc': {
      // Official Indian Railways RRB NTPC Formula:
      // Allowed mistakes = 5% of Total Words Typed (TWT)
      // Mistakes beyond 5% attract 10x word deduction
      scoringFormulaName = 'Indian Railways RRB NTPC (5% Free + 10x Excess Penalty)';
      allowedMistakes = Number((grossWords * 0.05).toFixed(1));
      penaltyMistakes = Number(Math.max(0, mistakesDetail.totalMistakes - allowedMistakes).toFixed(1));
      penaltyDeductionWords = Number((penaltyMistakes * 10).toFixed(1));
      const netWords = Math.max(0, grossWords - Math.max(penaltyDeductionWords, incorrectChars / 5));
      netWpm = totalChars > 0 && elapsedSeconds > 0 ? Math.max(0, Math.round(netWords / safeElapsedMinutes)) : 0;

      const requiredSpeed = language === 'hindi' ? 25 : 30;
      isQualified = netWpm >= requiredSpeed && accuracy >= 85;

      if (isQualified) {
        qualificationReason = `Qualified! Net speed of ${netWpm} WPM meets the RRB requirement (>= ${requiredSpeed} WPM with penalty deductions applied).`;
      } else {
        qualificationReason = netWpm < requiredSpeed
          ? `Not Qualified: Net speed of ${netWpm} WPM is below the required ${requiredSpeed} WPM (Penalty: ${penaltyDeductionWords} words deducted for ${penaltyMistakes} excess mistakes).`
          : `Not Qualified: Accuracy of ${accuracy}% is below acceptable minimum for RRB NTPC.`;
      }
      break;
    }

    case 'ssc-chsl': {
      // SSC CHSL Evaluation:
      // Based on percentage of full & half mistakes and required key depressions (1,750 for English, 1,500 for Hindi)
      scoringFormulaName = 'SSC CHSL Tier-II Mistake Evaluation (Full & Half Mistakes)';
      const targetKD = language === 'hindi' ? 1500 : 1750;
      targetSpeed = language === 'hindi' ? 30 : 35;
      const maxAllowedErrorPercent = examConfig?.allowedErrorPercent || 7;

      // In SSC: Net WPM = Gross WPM - (Mistakes / elapsedMinutes)
      const netWords = Math.max(0, grossWords - effectiveMistakeWords);
      netWpm = totalChars > 0 && elapsedSeconds > 0 ? Math.max(0, Math.round(netWords / safeElapsedMinutes)) : 0;
      const mistakePercent = grossWords > 0
        ? Number(((effectiveMistakeWords / grossWords) * 100).toFixed(2))
        : 0;

      const meetsKD = keyDepressions >= (targetKD * (elapsedSeconds / totalDurationSeconds) * 0.95);
      const meetsError = mistakePercent <= maxAllowedErrorPercent;
      isQualified = meetsKD && meetsError;

      if (isQualified) {
        qualificationReason = `Qualified! Total KDPH: ${kdph} (${keyDepressions} depressions), Mistake %: ${mistakePercent}% (Within ${maxAllowedErrorPercent}% cutoff).`;
      } else {
        qualificationReason = !meetsKD
          ? `Not Qualified: Key depressions (${keyDepressions}) below target (${targetKD} needed for full test).`
          : `Not Qualified: Mistake percentage (${mistakePercent}%) exceeds permitted ${maxAllowedErrorPercent}% limit.`;
      }
      break;
    }

    case 'ssc-cgl-dest': {
      // SSC CGL Data Entry Skill Test (DEST):
      // Target: 2,000 Key Depressions (approx 8,000 KDPH / ~27 WPM). Maximum 5% error.
      scoringFormulaName = 'SSC CGL DEST Evaluation (2,000 Key Depressions Cutoff)';
      speedUnit = 'KDPH';
      targetSpeed = 8000;
      const maxAllowedErrorPercent = examConfig?.allowedErrorPercent || 5;

      const netWords = Math.max(0, grossWords - effectiveMistakeWords);
      netWpm = totalChars > 0 && elapsedSeconds > 0 ? Math.max(0, Math.round(netWords / safeElapsedMinutes)) : 0;
      const mistakePercent = grossWords > 0
        ? Number(((effectiveMistakeWords / grossWords) * 100).toFixed(2))
        : 0;

      const meetsKD = kdph >= 7600; // Target approx 8000 KDPH
      const meetsError = mistakePercent <= maxAllowedErrorPercent;
      isQualified = meetsKD && meetsError;

      if (isQualified) {
        qualificationReason = `Qualified! Speed: ${kdph} KDPH with ${mistakePercent}% errors (within ${maxAllowedErrorPercent}% tolerance).`;
      } else {
        qualificationReason = !meetsKD
          ? `Not Qualified: Pace of ${kdph} KDPH is below DEST benchmark (approx 8,000 KDPH).`
          : `Not Qualified: Mistake percentage (${mistakePercent}%) exceeds ${maxAllowedErrorPercent}% tolerance limit.`;
      }
      break;
    }

    case 'cpct': {
      // MP CPCT Official Evaluation (MAP_IT Norms):
      // English: 30 WPM, Hindi: 20 WPM. Accuracy >= 80%.
      scoringFormulaName = 'MP CPCT Official Evaluation (MAP_IT Norms)';
      const reqSpeed = language === 'hindi' ? 20 : 30;
      targetSpeed = reqSpeed;

      const netWords = Math.max(0, grossWords - effectiveMistakeWords);
      netWpm = totalChars > 0 && elapsedSeconds > 0 ? Math.max(0, Math.round(netWords / safeElapsedMinutes)) : 0;
      isQualified = netWpm >= reqSpeed && accuracy >= 80;

      if (isQualified) {
        qualificationReason = `Qualified! Net speed: ${netWpm} WPM (Target: ${reqSpeed} WPM) with ${accuracy}% accuracy. Scorecard eligible.`;
      } else {
        qualificationReason = netWpm < reqSpeed
          ? `Not Qualified: Net speed of ${netWpm} WPM is below minimum ${reqSpeed} WPM requirement.`
          : `Not Qualified: Accuracy of ${accuracy}% is below mandatory 80% threshold.`;
      }
      break;
    }

    case 'high-court': {
      // High Court / Judicial Stenographer & Typist:
      scoringFormulaName = 'Judicial / High Court Evaluation (1 Error = 1 Word Deduction)';
      const reqSpeed = language === 'hindi' ? 30 : 35;
      targetSpeed = reqSpeed;

      penaltyMistakes = mistakesDetail.totalMistakes;
      penaltyDeductionWords = effectiveMistakeWords;
      const netWords = Math.max(0, grossWords - penaltyDeductionWords);
      netWpm = totalChars > 0 && elapsedSeconds > 0 ? Math.max(0, Math.round(netWords / safeElapsedMinutes)) : 0;
      isQualified = netWpm >= reqSpeed && accuracy >= 90;

      if (isQualified) {
        qualificationReason = `Qualified! Net Speed: ${netWpm} WPM with ${accuracy}% accuracy meets Judicial standard.`;
      } else {
        qualificationReason = netWpm < reqSpeed
          ? `Not Qualified: High Court demands ${reqSpeed} WPM. Achieved: ${netWpm} WPM (after error deduction).`
          : `Not Qualified: Accuracy ${accuracy}% below strict 90% court requirement.`;
      }
      break;
    }

    case 'supreme-court-jca': {
      // Supreme Court Junior Court Assistant: English 35 WPM, strictly <= 3% mistakes
      scoringFormulaName = 'Supreme Court of India JCA (35 WPM, Max 3% Error Limit)';
      targetSpeed = 35;
      const mistakePercent = grossWords > 0
        ? Number(((effectiveMistakeWords / grossWords) * 100).toFixed(2))
        : 0;
      const netWords = Math.max(0, grossWords - effectiveMistakeWords);
      netWpm = totalChars > 0 && elapsedSeconds > 0 ? Math.max(0, Math.round(netWords / safeElapsedMinutes)) : 0;
      isQualified = netWpm >= 35 && mistakePercent <= 3.0;

      if (isQualified) {
        qualificationReason = `Qualified! Speed: ${netWpm} WPM with ${mistakePercent}% errors (under Supreme Court 3.0% threshold).`;
      } else {
        qualificationReason = netWpm < 35
          ? `Not Qualified: Net speed ${netWpm} WPM is under required 35 WPM.`
          : `Not Qualified: Error rate of ${mistakePercent}% exceeds strict 3.0% Supreme Court cutoff.`;
      }
      break;
    }

    case 'bssc-bihar': {
      // Bihar BSSC Inter Level: Hindi 30 WPM / English 35 WPM with max 2% error
      scoringFormulaName = 'Bihar BSSC Typist (Hindi 30 WPM / English 35 WPM, 2% Cutoff)';
      const reqSpeed = language === 'hindi' ? 30 : 35;
      targetSpeed = reqSpeed;
      const mistakePercent = grossWords > 0
        ? Number(((effectiveMistakeWords / grossWords) * 100).toFixed(2))
        : 0;
      const netWords = Math.max(0, grossWords - effectiveMistakeWords);
      netWpm = totalChars > 0 && elapsedSeconds > 0 ? Math.max(0, Math.round(netWords / safeElapsedMinutes)) : 0;
      isQualified = netWpm >= reqSpeed && mistakePercent <= 2.0;

      if (isQualified) {
        qualificationReason = `Qualified! Net speed: ${netWpm} WPM with ${mistakePercent}% errors (within 2% limit).`;
      } else {
        qualificationReason = netWpm < reqSpeed
          ? `Not Qualified: Net speed of ${netWpm} WPM is below BSSC target of ${reqSpeed} WPM.`
          : `Not Qualified: Error rate ${mistakePercent}% exceeds BSSC 2% cutoff.`;
      }
      break;
    }

    case 'dsssb': {
      // DSSSB Junior Assistant / LDC: English 35 WPM / Hindi 30 WPM, max 5% error
      scoringFormulaName = 'DSSSB Junior Assistant / LDC (English 35 WPM / Hindi 30 WPM)';
      const reqSpeed = language === 'hindi' ? 30 : 35;
      targetSpeed = reqSpeed;
      const mistakePercent = grossWords > 0
        ? Number(((effectiveMistakeWords / grossWords) * 100).toFixed(2))
        : 0;
      const netWords = Math.max(0, grossWords - effectiveMistakeWords);
      netWpm = totalChars > 0 && elapsedSeconds > 0 ? Math.max(0, Math.round(netWords / safeElapsedMinutes)) : 0;
      isQualified = netWpm >= reqSpeed && mistakePercent <= 5.0;

      if (isQualified) {
        qualificationReason = `Qualified! Speed: ${netWpm} WPM with ${mistakePercent}% errors satisfies DSSSB cutoff.`;
      } else {
        qualificationReason = netWpm < reqSpeed
          ? `Not Qualified: Net speed of ${netWpm} WPM is below DSSSB requirement of ${reqSpeed} WPM.`
          : `Not Qualified: Mistake percentage of ${mistakePercent}% exceeds 5% ceiling.`;
      }
      break;
    }

    case 'delhi-police-hcm': {
      // Delhi Police Head Constable (Ministerial):
      scoringFormulaName = 'Delhi Police HCM Standard (30 WPM English / 25 WPM Hindi)';
      const reqSpeed = language === 'hindi' ? 25 : 30;
      targetSpeed = reqSpeed;
      const netWords = Math.max(0, grossWords - effectiveMistakeWords);
      netWpm = totalChars > 0 && elapsedSeconds > 0 ? Math.max(0, Math.round(netWords / safeElapsedMinutes)) : 0;
      isQualified = netWpm >= reqSpeed && accuracy >= 90;

      if (isQualified) {
        qualificationReason = `Qualified! Speed of ${netWpm} WPM meets Delhi Police HCM standard (>= ${reqSpeed} WPM).`;
      } else {
        qualificationReason = `Not Qualified: Speed of ${netWpm} WPM or accuracy ${accuracy}% did not satisfy qualifying marks.`;
      }
      break;
    }

    case 'upsssc': {
      // UPSSSC Junior Assistant:
      scoringFormulaName = 'UPSSSC Typing Standard (30 WPM English / 25 WPM Hindi)';
      const reqSpeed = language === 'hindi' ? 25 : 30;
      targetSpeed = reqSpeed;
      const netWords = Math.max(0, grossWords - effectiveMistakeWords);
      netWpm = totalChars > 0 && elapsedSeconds > 0 ? Math.max(0, Math.round(netWords / safeElapsedMinutes)) : 0;
      isQualified = netWpm >= reqSpeed && accuracy >= 85;

      if (isQualified) {
        qualificationReason = `Qualified! Speed of ${netWpm} WPM meets UPSSSC qualifying cutoff (>= ${reqSpeed} WPM).`;
      } else {
        qualificationReason = `Not Qualified: Achieved ${netWpm} WPM (Target: ${reqSpeed} WPM with >= 85% accuracy).`;
      }
      break;
    }

    default: {
      // Standard Practice Mode / General
      scoringFormulaName = 'Standard Net WPM Evaluation';
      const netWords = Math.max(0, grossWords - effectiveMistakeWords);
      netWpm = totalChars > 0 && elapsedSeconds > 0 ? Math.max(0, Math.round(netWords / safeElapsedMinutes)) : 0;
      isQualified = netWpm >= 30 && accuracy >= 90;
      qualificationReason = isQualified
        ? `Qualified: Good performance! Net speed: ${netWpm} WPM with ${accuracy}% accuracy.`
        : `Keep practicing: Aim for >= 30 WPM and >= 90% accuracy.`;
      break;
    }
  }

  // Calculate performance Grade
  let grade: 'A+' | 'A' | 'B' | 'C' | 'Unqualified' = 'Unqualified';
  if (isQualified) {
    if (netWpm >= targetSpeed + 15 && accuracy >= 98) {
      grade = 'A+';
    } else if (netWpm >= targetSpeed + 5 && accuracy >= 95) {
      grade = 'A';
    } else if (accuracy >= 90) {
      grade = 'B';
    } else {
      grade = 'C';
    }
  }

  return {
    grossWpm,
    netWpm,
    accuracy,
    totalChars,
    correctChars,
    incorrectChars,
    errors: incorrectChars,
    backspaceCount,
    keyDepressions,
    elapsedSeconds,
    remainingSeconds,
    isQualified,
    kdph,
    mistakesDetail,
    allowedMistakes,
    penaltyMistakes,
    penaltyDeductionWords,
    errorPercentage,
    targetSpeed,
    speedUnit,
    qualificationReason,
    scoringFormulaName,
    grade
  };
}

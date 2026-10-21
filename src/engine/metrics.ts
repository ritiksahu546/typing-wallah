import { ExamId, TypingMetrics } from '../types';
import { calculateExamScore, ExamScoreResult } from './examScoring';

export function calculateTypingMetrics(
  typedText: string,
  targetText: string,
  elapsedSeconds: number,
  totalDurationSeconds: number,
  backspaceCount: number,
  examId?: ExamId | 'general',
  language: 'english' | 'hindi' = 'english'
): ExamScoreResult {
  return calculateExamScore(
    typedText,
    targetText,
    elapsedSeconds,
    totalDurationSeconds,
    backspaceCount,
    examId,
    language
  );
}

export * from './examScoring';

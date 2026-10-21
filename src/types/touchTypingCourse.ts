import { FingerKey } from '../data/touchTypingData';

export type CourseLevelId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

export type LessonType =
  | 'key_introduction' // TYPE 1: Key introduction
  | 'repeated_key'    // TYPE 2: Repeated key practice
  | 'mixed_keys'       // TYPE 3: Mixed keys
  | 'words'            // TYPE 4: Words
  | 'sentences'        // TYPE 5: Sentences
  | 'paragraph'        // TYPE 6: Paragraph
  | 'speed_test'       // TYPE 7: Speed test
  | 'exam_test';       // TYPE 8: Exam-style test

export type CourseFingerKey =
  | 'left-pinky'
  | 'left-ring'
  | 'left-middle'
  | 'left-index'
  | 'thumb'
  | 'right-index'
  | 'right-middle'
  | 'right-ring'
  | 'right-pinky'
  | 'left_pinky'
  | 'left_ring'
  | 'left_middle'
  | 'left_index'
  | 'left_thumb'
  | 'right_index'
  | 'right_middle'
  | 'right_ring'
  | 'right_pinky'
  | 'right_thumb';

export interface CourseLevel {
  level: CourseLevelId;
  name: string;
  title: string;
  description: string;
  startLesson: number;
  endLesson: number;
  badgeColor: string;
}

export interface TouchTypingCourseLesson {
  id: string; // e.g. 'lesson-1', 'lesson-2'
  lessonNumber: number; // 1 to 92 (and up for admin)
  level: CourseLevelId;
  levelName?: string;
  name: string; // e.g. "F and J Keys"
  titleEnglish?: string;
  description: string;
  type?: LessonType;
  mode?: 'introduction' | 'practice' | 'test';
  primaryKeys?: string[];
  secondaryKeys?: string[];
  focusKeys?: string[];
  requiredFingers?: CourseFingerKey[];
  exerciseSequence?: string[]; // Step-by-step key tokens or words for top display
  introductionText?: string;
  practiceText: string;       // Stream for interactive practice
  testText: string;           // Stream for official lesson test
  targetWpm: number;          // e.g. 15 for beginners, up to 50 for levels 10-11
  minAccuracy: number;        // e.g. 90%
  durationSeconds?: number;    // duration for the lesson test (e.g. 60 or 120s)
  isPro?: boolean;            // Free for Level 1, PRO for later
  tier?: 'free' | 'pro';
  tips?: string[];             // Contextual tips
  status?: 'published' | 'draft' | 'archived';
  isCustom?: boolean;         // Admin created custom lesson
}

export interface LessonAttemptResult {
  id: string;
  lessonId: string;
  lessonNumber: number;
  lessonName: string;
  userId: string;
  timestamp: number;
  date: string;
  grossWpm: number;
  netWpm: number;
  accuracy: number;
  errors: number;
  backspaces: number;
  durationSeconds: number;
  passed: boolean;
  attemptNumber: number;
}

export interface UserCourseProgress {
  userId: string;
  currentLessonNumber: number;
  highestUnlockedLessonNumber: number;
  completedLessonIds: string[];
  bestWpm: number;
  avgWpm: number;
  avgAccuracy: number;
  totalAttempts: number;
  passedAttempts: number;
  currentStreak: number;
  lastActiveDate: string;
  todayWordsTyped: number;
  todayPracticeTimeSeconds: number;
  lastUpdated: number;
}

export interface DailyPracticeGoal {
  targetMinutes: number;
  targetWords: number;
  minAccuracy: number;
  targetWpm: number;
  currentWords: number;
  currentMinutes: number;
}

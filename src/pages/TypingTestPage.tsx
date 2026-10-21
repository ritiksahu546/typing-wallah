import React, { useState } from 'react';
import { ActivePage, ExamId, HindiKeyboardLayout, UserProfile } from '../types';
import { EXAMS_DATA } from '../data/exams';
import { StorageService } from '../services/storageService';
import { SubscriptionModal } from '../components/SubscriptionModal';
import { AuthenticExamTyping } from '../components/AuthenticExamTyping';

interface TypingTestPageProps {
  initialExamId?: ExamId;
  initialLanguage?: 'english' | 'hindi';
  initialDuration?: number;
  initialLayout?: HindiKeyboardLayout;
  initialMode?: 'exam' | 'practice';
  user: UserProfile;
  onNavigate: (page: ActivePage, examId?: ExamId) => void;
}

export const TypingTestPage: React.FC<TypingTestPageProps> = ({
  initialExamId = 'patna-hc',
  initialLanguage = 'english',
  initialDuration = 600,
  initialLayout = 'remington_gail',
  initialMode = 'practice',
  user,
  onNavigate
}) => {
  const [isPro, setIsPro] = useState<boolean>(() => StorageService.isUserPro());
  const [showSubModal, setShowSubModal] = useState<boolean>(false);

  const currentExam = EXAMS_DATA[initialExamId] || EXAMS_DATA['patna-hc'];

  return (
    <div className="w-full h-full min-h-screen bg-[#121316]">
      <AuthenticExamTyping
        user={user}
        initialExamId={initialExamId}
        initialLanguage={initialLanguage}
        initialDuration={initialDuration}
        initialLayout={initialLayout}
        initialMode={initialMode}
        onNavigate={onNavigate}
        onOpenSubscriptionModal={() => setShowSubModal(true)}
        isUserPro={isPro}
      />

      <SubscriptionModal
        isOpen={showSubModal}
        onClose={() => setShowSubModal(false)}
        selectedExam={currentExam}
        onSuccess={() => {
          setIsPro(StorageService.isUserPro());
        }}
      />
    </div>
  );
};

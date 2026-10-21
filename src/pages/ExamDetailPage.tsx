import React, { useState } from 'react';
import { ActivePage, ExamId } from '../types';
import { EXAMS_DATA } from '../data/exams';
import { PASSAGES_DATA } from '../data/passages';
import {
  Clock,
  Play,
  CheckCircle2,
  AlertCircle,
  FileText,
  HelpCircle,
  Award,
  ChevronDown,
  ArrowRight,
  ShieldCheck,
  Zap,
  Target
} from 'lucide-react';

interface ExamDetailPageProps {
  examId: ExamId;
  onStartTest: (examId: ExamId, lang?: 'english' | 'hindi', duration?: number) => void;
  onNavigate: (page: ActivePage, examId?: ExamId) => void;
}

export const ExamDetailPage: React.FC<ExamDetailPageProps> = ({
  examId,
  onStartTest,
  onNavigate
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'practice' | 'mock' | 'instructions' | 'faqs'>('overview');
  const [selectedLang, setSelectedLang] = useState<'english' | 'hindi'>('english');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const exam = EXAMS_DATA[examId] || EXAMS_DATA['ssc-chsl'];
  const examPassages = PASSAGES_DATA.filter((p) => p.examId === exam.id || p.category.toLowerCase().includes(exam.shortTag.toLowerCase()));

  return (
    <div id="exam-detail-root" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-bold uppercase tracking-wider">
            {exam.conductedBy}
          </span>
          <span className="text-xs text-white/70">
            Official Simulation Hub
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
          {exam.name} Typing Test
        </h1>

        <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
          {exam.overview}
        </p>

        {/* Quick Launch Buttons */}
        <div className="pt-2 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => onStartTest(exam.id, 'english', exam.durationMinutes * 60)}
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center space-x-2"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Launch English Test ({exam.durationMinutes}m)</span>
          </button>

          {exam.qualifyingHindiWpm && (
            <button
              type="button"
              onClick={() => onStartTest(exam.id, 'hindi', exam.durationMinutes * 60)}
              className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs sm:text-sm shadow-md transition-all flex items-center space-x-2"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Launch Hindi Test ({exam.durationMinutes}m)</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setActiveTab('mock')}
            className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-colors"
          >
            Mock Simulator Mode
          </button>
        </div>
      </div>

      {/* Metric Cards Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 text-center shadow-xs">
          <span className="text-xs font-bold text-slate-400 block uppercase">Duration</span>
          <span className="text-2xl font-black text-slate-900">{exam.durationMinutes} Mins</span>
          <span className="text-[11px] text-slate-400 block mt-0.5">Standard evaluation</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 text-center shadow-xs">
          <span className="text-xs font-bold text-slate-400 block uppercase">English Cutoff</span>
          <span className="text-2xl font-black text-blue-700">
            {exam.qualifyingEnglishWpm ? `${exam.qualifyingEnglishWpm} WPM` : 'N/A'}
          </span>
          <span className="text-[11px] text-slate-400 block mt-0.5">QWERTY Keyboard</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 text-center shadow-xs">
          <span className="text-xs font-bold text-slate-400 block uppercase">Hindi Cutoff</span>
          <span className="text-2xl font-black text-amber-700">
            {exam.qualifyingHindiWpm ? `${exam.qualifyingHindiWpm} WPM` : 'Optional'}
          </span>
          <span className="text-[11px] text-slate-400 block mt-0.5">Mangal Font</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 text-center shadow-xs">
          <span className="text-xs font-bold text-slate-400 block uppercase">Error Limit</span>
          <span className="text-2xl font-black text-rose-600">≤ {exam.allowedErrorPercent}%</span>
          <span className="text-[11px] text-slate-400 block mt-0.5">{exam.accuracyRequirement.slice(0, 20)}...</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 text-xs sm:text-sm font-bold gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 rounded-lg whitespace-nowrap transition-colors ${
            activeTab === 'overview' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Exam Overview
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('practice')}
          className={`px-4 py-2.5 rounded-lg whitespace-nowrap transition-colors ${
            activeTab === 'practice' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Typing Practice Passages
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('mock')}
          className={`px-4 py-2.5 rounded-lg whitespace-nowrap transition-colors ${
            activeTab === 'mock' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Full Mock Test
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('instructions')}
          className={`px-4 py-2.5 rounded-lg whitespace-nowrap transition-colors ${
            activeTab === 'instructions' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Official Instructions
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('faqs')}
          className={`px-4 py-2.5 rounded-lg whitespace-nowrap transition-colors ${
            activeTab === 'faqs' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Exam FAQs
        </button>
      </div>

      {/* Tab: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <h3 className="text-xl font-bold text-slate-900">
              Exam Pattern & Evaluation Standards
            </h3>
            <div className="space-y-3">
              {exam.patternSummary.map((item, idx) => (
                <div key={idx} className="flex items-start space-x-2 text-xs sm:text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Supported Keyboards */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
            <h4 className="font-bold text-slate-900 text-base">Permitted Keyboard Layouts</h4>
            <div className="flex flex-wrap gap-2">
              {exam.supportedKeyboards.map((kb) => (
                <span
                  key={kb}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800 capitalize"
                >
                  {kb === 'standard' ? 'Standard English QWERTY' : kb.replace('_', ' ')}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Practice Passages */}
      {activeTab === 'practice' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">
              Passages Tailored for {exam.name}
            </h3>
            <div className="flex rounded-lg bg-slate-100 p-1 text-xs font-bold">
              <button
                type="button"
                onClick={() => setSelectedLang('english')}
                className={`px-3 py-1 rounded-md ${selectedLang === 'english' ? 'bg-white shadow-xs text-blue-700' : 'text-slate-600'}`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setSelectedLang('hindi')}
                className={`px-3 py-1 rounded-md ${selectedLang === 'hindi' ? 'bg-white shadow-xs text-blue-700' : 'text-slate-600'}`}
              >
                Hindi
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {examPassages
              .filter((p) => p.language === selectedLang)
              .map((pass) => (
                <div
                  key={pass.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 flex flex-col justify-between shadow-xs"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="px-2 py-0.5 rounded font-bold bg-blue-50 text-blue-700 capitalize">
                        {pass.difficulty.replace('_', ' ')}
                      </span>
                      <span className="text-slate-400">{pass.wordCount} words</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm mt-2">{pass.title}</h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-3 leading-relaxed">
                      {pass.content}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">{pass.category}</span>
                    <button
                      type="button"
                      onClick={() => onStartTest(exam.id, pass.language, exam.durationMinutes * 60)}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center space-x-1"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Start Practice</span>
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Tab: Mock Simulator */}
      {activeTab === 'mock' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center max-w-2xl mx-auto space-y-6">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mx-auto">
            <Clock className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-slate-900">
              {exam.name} Official Timing Mock
            </h3>
            <p className="text-xs text-slate-500">
              Full {exam.durationMinutes}-minute examination condition simulator with exact passing speed criteria and mistake tracking.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => onStartTest(exam.id, 'english', exam.durationMinutes * 60)}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md"
            >
              Start English Mock ({exam.durationMinutes}m)
            </button>
            {exam.qualifyingHindiWpm && (
              <button
                type="button"
                onClick={() => onStartTest(exam.id, 'hindi', exam.durationMinutes * 60)}
                className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-sm shadow-md"
              >
                Start Hindi Mock ({exam.durationMinutes}m)
              </button>
            )}
          </div>
        </div>
      )}

      {/* Tab: Instructions */}
      {activeTab === 'instructions' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <h3 className="text-lg font-bold text-slate-900">
            Official Examination Instructions & Advisory
          </h3>
          <div className="space-y-3 text-xs sm:text-sm text-slate-600">
            {exam.instructions.map((inst, idx) => (
              <div key={idx} className="flex items-start space-x-2">
                <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span>{inst}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: FAQs */}
      {activeTab === 'faqs' && (
        <div className="space-y-3 max-w-4xl mx-auto">
          {exam.faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between font-bold text-sm text-slate-800 hover:text-blue-600"
                >
                  <span>{faq.question}</span>
                  <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${isOpen ? 'rotate-180 text-blue-600' : 'text-slate-400'}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Related Exams Section */}
      <div className="pt-6 border-t border-slate-200 space-y-3">
        <h4 className="text-sm font-bold text-slate-900">Related Government Typing Tests:</h4>
        <div className="flex flex-wrap gap-2">
          {exam.relatedExams.map((relId) => {
            const rel = EXAMS_DATA[relId];
            if (!rel) return null;
            return (
              <button
                key={rel.id}
                type="button"
                onClick={() => onNavigate('exam-detail', rel.id)}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-xs font-semibold border border-slate-200 transition-colors flex items-center space-x-1"
              >
                <span>{rel.name}</span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

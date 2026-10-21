import React, { useState, useMemo } from 'react';
import {
  X,
  Search,
  Lock,
  CheckCircle2,
  FileText,
  Sparkles,
  Award,
  Filter
} from 'lucide-react';
import { Passage, ExamId } from '../types';
import { PASSAGES_DATA } from '../data/passages';

interface PassageSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPassage: (passage: Passage) => void;
  currentPassageId: string;
  selectedExamId?: ExamId;
  language: 'english' | 'hindi';
  isUserPro: boolean;
  onOpenSubscriptionModal: () => void;
  customPassages?: Passage[];
}

export const PassageSelectorModal: React.FC<PassageSelectorModalProps> = ({
  isOpen,
  onClose,
  onSelectPassage,
  currentPassageId,
  selectedExamId,
  language,
  isUserPro,
  onOpenSubscriptionModal,
  customPassages = []
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard' | 'exam_level'>('all');
  const [examSpecificOnly, setExamSpecificOnly] = useState(true);

  if (!isOpen) return null;

  // Combine static and custom passages
  const allPassages = [...PASSAGES_DATA, ...customPassages].filter(
    (p) => p.language === language
  );

  // Filter logic
  const filteredPassages = useMemo(() => {
    return allPassages.filter((p) => {
      // Search
      const matchSearch =
        !searchQuery.trim() ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.domain && p.domain.toLowerCase().includes(searchQuery.toLowerCase())) ||
        p.content.toLowerCase().includes(searchQuery.toLowerCase());

      // Difficulty
      const matchDiff = filterDifficulty === 'all' || p.difficulty === filterDifficulty;

      // Exam specificity
      let matchExam = true;
      if (examSpecificOnly && selectedExamId) {
        matchExam =
          p.examId === selectedExamId ||
          (p.targetExams && p.targetExams.includes(selectedExamId)) ||
          p.category.toLowerCase().includes('practice') ||
          p.domain?.toLowerCase().includes('fundamentals') ||
          false;
      }

      return matchSearch && matchDiff && matchExam;
    });
  }, [allPassages, searchQuery, filterDifficulty, examSpecificOnly, selectedExamId]);

  // Partition into Free and Pro
  const freePassages = filteredPassages.filter((p) => !p.isPro);
  const proPassages = filteredPassages.filter((p) => p.isPro);

  const handlePassageClick = (passage: Passage) => {
    if (passage.isPro && !isUserPro) {
      // Locked PRO passage: open Subscription Modal
      onOpenSubscriptionModal();
      return;
    }
    onSelectPassage(passage);
    onClose();
  };

  return (
    <div
      id="passage-selector-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        id="passage-selector-card"
        className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-indigo-400" />
            <div>
              <h2 className="text-base font-bold text-white leading-tight">
                Select Exam Passage
              </h2>
              <p className="text-xs text-slate-400 capitalize">
                {language} Typing • {filteredPassages.length} Available Passages
              </p>
            </div>
          </div>
          <button
            id="passage-selector-close-btn"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Controls: Search & Filters */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 space-y-3">
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="passage-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by topic, keyword, or exam category..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-slate-500 font-medium">Difficulty:</span>
              {(['all', 'easy', 'medium', 'hard', 'exam_level'] as const).map((diff) => (
                <button
                  key={diff}
                  onClick={() => setFilterDifficulty(diff)}
                  className={`px-2 py-1 rounded-md text-[11px] font-medium capitalize transition-colors ${
                    filterDifficulty === diff
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {diff === 'exam_level' ? 'Exam Level' : diff}
                </button>
              ))}
            </div>

            {selectedExamId && (
              <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-slate-700 font-medium select-none">
                <input
                  type="checkbox"
                  checked={examSpecificOnly}
                  onChange={(e) => setExamSpecificOnly(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span>Exam Relevant Only</span>
              </label>
            )}
          </div>
        </div>

        {/* Scrollable Passage List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* FREE SECTION */}
          {freePassages.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2.5 pb-1 border-b border-slate-200">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Free Passages ({freePassages.length})
                </span>
                <span className="text-[11px] text-slate-500">Accessible to all candidates</span>
              </div>

              <div className="space-y-2">
                {freePassages.map((passage) => {
                  const isSelected = passage.id === currentPassageId;
                  return (
                    <button
                      key={passage.id}
                      onClick={() => handlePassageClick(passage)}
                      className={`w-full text-left p-3 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/70 ring-1 ring-indigo-500'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          {passage.passageNumber && (
                            <span className="text-xs font-bold text-slate-400">
                              #{passage.passageNumber}
                            </span>
                          )}
                          <h4 className="text-xs font-bold text-slate-900 truncate">
                            {passage.title}
                          </h4>
                          {isSelected && (
                            <span className="text-[10px] font-semibold bg-indigo-600 text-white px-1.5 py-0.2 rounded">
                              Current
                            </span>
                          )}
                        </div>

                        <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                          {passage.content}
                        </p>

                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          {passage.domain && (
                            <span className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
                              {passage.domain}
                            </span>
                          )}
                          <span className="text-[10px] text-slate-500">
                            {passage.wordCount} words • {passage.charCount} chars
                          </span>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${
                              passage.difficulty === 'hard' || passage.difficulty === 'exam_level'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {passage.difficulty.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* PRO SECTION */}
          {proPassages.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2.5 pb-1 border-b border-slate-200">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>PRO Official Exam Passages ({proPassages.length})</span>
                </span>
                {!isUserPro && (
                  <button
                    onClick={onOpenSubscriptionModal}
                    className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-1"
                  >
                    Unlock All with PRO or Free Share &gt;
                  </button>
                )}
              </div>

              <div className="space-y-2">
                {proPassages.map((passage) => {
                  const isSelected = passage.id === currentPassageId;
                  const isLocked = !isUserPro;

                  return (
                    <button
                      key={passage.id}
                      onClick={() => handlePassageClick(passage)}
                      className={`w-full text-left p-3 rounded-xl border transition-all flex items-start justify-between gap-3 relative overflow-hidden ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/70 ring-1 ring-indigo-500'
                          : isLocked
                          ? 'border-slate-200 bg-slate-50/70 hover:border-indigo-300 hover:bg-indigo-50/30'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          {passage.passageNumber && (
                            <span className="text-xs font-bold text-slate-400">
                              #{passage.passageNumber}
                            </span>
                          )}
                          <h4 className="text-xs font-bold text-slate-900 truncate">
                            {passage.title}
                          </h4>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                            <Sparkles className="w-2.5 h-2.5 text-amber-600" /> PRO
                          </span>
                          {isLocked && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-slate-500">
                              <Lock className="w-3 h-3 text-slate-400" /> Locked
                            </span>
                          )}
                        </div>

                        <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                          {isLocked ? `${passage.content.slice(0, 85)}... [Locked]` : passage.content}
                        </p>

                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          {passage.domain && (
                            <span className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
                              {passage.domain}
                            </span>
                          )}
                          <span className="text-[10px] text-slate-500">
                            {passage.wordCount} words • {passage.charCount} chars
                          </span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 capitalize">
                            {passage.difficulty.replace('_', ' ')}
                          </span>
                        </div>
                      </div>

                      {isLocked && (
                        <div className="flex flex-col items-end justify-center self-center pl-2">
                          <div className="p-2 rounded-lg bg-slate-200 text-slate-600">
                            <Lock className="w-4 h-4" />
                          </div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {filteredPassages.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              <FileText className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-semibold text-slate-700">No matching passages found</p>
              <p className="text-xs mt-1">Try resetting filters or searching with different terms.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <span>
            {isUserPro ? (
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> PRO Membership Active: All Passages Unlocked
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-amber-600" /> Free Plan: Standard passages unlocked
              </span>
            )}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

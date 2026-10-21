import React, { useState } from 'react';
import { ActivePage, ExamId } from '../types';
import { EXAMS_DATA } from '../data/exams';
import {
  Search,
  Clock,
  Play,
  ArrowRight,
  CheckCircle2,
  Filter,
  Award
} from 'lucide-react';

interface ExamsListPageProps {
  onStartTest: (examId: ExamId, lang?: 'english' | 'hindi', duration?: number) => void;
  onNavigate: (page: ActivePage, examId?: ExamId) => void;
}

export const ExamsListPage: React.FC<ExamsListPageProps> = ({
  onStartTest,
  onNavigate
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'central' | 'state' | 'court'>('all');

  const exams = Object.values(EXAMS_DATA).filter((e) => {
    const matchesSearch =
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.conductedBy.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterType === 'central') {
      return matchesSearch && (e.id.includes('ssc') || e.id.includes('rrb') || e.id.includes('delhi'));
    }
    if (filterType === 'state') {
      return matchesSearch && (e.id.includes('cpct') || e.id.includes('upsssc') || e.id.includes('state'));
    }
    if (filterType === 'court') {
      return matchesSearch && e.id.includes('court');
    }
    return matchesSearch;
  });

  return (
    <div id="exams-list-root" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-bold uppercase tracking-wider">
          <Award className="w-3.5 h-3.5 text-blue-300" />
          <span>Complete Examination Directory</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
          Government Typing Exam Simulators
        </h1>

        <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
          Select any official central or state government typing recruitment examination to view its syllabus, qualifying WPM requirements, and launch dedicated mock tests.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-bold w-full md:w-auto">
          {(['all', 'central', 'state', 'court'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilterType(tab)}
              className={`flex-1 md:flex-none px-4 py-2 rounded-lg capitalize transition-all ${
                filterType === tab ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              {tab === 'all' ? 'All Exams' : `${tab} Exams`}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search exam (e.g. CPCT, SSC, RRB)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-blue-600"
          />
        </div>
      </div>

      {/* Exam Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exams.map((exam) => (
          <div
            key={exam.id}
            className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between shadow-xs hover:shadow-md hover:border-blue-300 transition-all space-y-4 group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full font-bold bg-blue-50 text-blue-700 text-xs">
                  {exam.shortTag}
                </span>
                <span className="text-xs font-semibold text-slate-400">
                  {exam.durationMinutes} Minutes
                </span>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors">
                  {exam.name}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">{exam.conductedBy}</p>
              </div>

              <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                {exam.overview}
              </p>

              <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs text-slate-700">
                <div className="flex justify-between">
                  <span>English Cutoff:</span>
                  <strong className="text-blue-700">
                    {exam.qualifyingEnglishWpm ? `${exam.qualifyingEnglishWpm} WPM` : 'N/A'}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span>Hindi Cutoff:</span>
                  <strong className="text-amber-700">
                    {exam.qualifyingHindiWpm ? `${exam.qualifyingHindiWpm} WPM` : 'N/A'}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span>Error Limit:</span>
                  <strong className="text-rose-600">≤ {exam.allowedErrorPercent}%</strong>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center space-x-2">
              <button
                type="button"
                onClick={() => onStartTest(exam.id, 'english', exam.durationMinutes * 60)}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Start Mock</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('exam-detail', exam.id)}
                className="px-3.5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs"
              >
                Pattern
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

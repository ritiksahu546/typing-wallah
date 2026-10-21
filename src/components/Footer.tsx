import React from 'react';
import { ActivePage, ExamId } from '../types';
import { Keyboard, ShieldAlert, Heart, ExternalLink, Award } from 'lucide-react';
import { EXAMS_DATA } from '../data/exams';

interface FooterProps {
  onNavigate: (page: ActivePage, examId?: ExamId) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer id="main-footer" className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-slate-800">
          {/* Brand & Purpose */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">
                <Keyboard className="w-5 h-5" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                TYPING <span className="text-blue-400">WALLAH</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              India's premier independent typing practice simulator tailored specifically for competitive government exams. Realistic interface, exact timing algorithms, and dual Remington GAIL & InScript Hindi support.
            </p>
            <div className="flex items-center space-x-2 text-xs text-amber-400 bg-slate-800/80 p-2.5 rounded-lg border border-slate-700/60 max-w-sm">
              <Award className="w-4 h-4 shrink-0 text-amber-400" />
              <span>Tagline: Practice. Improve. Type Faster.</span>
            </div>
          </div>

          {/* Government Exams */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-3">
              Government Exams
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  id="footer-exam-cpct"
                  type="button"
                  onClick={() => onNavigate('cpct-portal')}
                  className="hover:text-blue-400 transition-colors text-left"
                >
                  MP CPCT Portal
                </button>
              </li>
              {Object.values(EXAMS_DATA).slice(1, 6).map((exam) => (
                <li key={exam.id}>
                  <button
                    id={`footer-exam-${exam.id}`}
                    type="button"
                    onClick={() => onNavigate('exam-detail', exam.id)}
                    className="hover:text-blue-400 transition-colors text-left"
                  >
                    {exam.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Typing Practice */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-3">
              Typing Modalities
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  id="footer-nav-hindi"
                  type="button"
                  onClick={() => onNavigate('hindi-typing')}
                  className="hover:text-blue-400 transition-colors text-left"
                >
                  Hindi InScript Typing
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-remington"
                  type="button"
                  onClick={() => onNavigate('hindi-typing')}
                  className="hover:text-blue-400 transition-colors text-left"
                >
                  Hindi Remington GAIL
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-english"
                  type="button"
                  onClick={() => onNavigate('english-typing')}
                  className="hover:text-blue-400 transition-colors text-left"
                >
                  English DEST (2000 Depressions)
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-practice"
                  type="button"
                  onClick={() => onNavigate('practice')}
                  className="hover:text-blue-400 transition-colors text-left"
                >
                  1 / 3 / 5 / 10 / 15 Min Modes
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-mock"
                  type="button"
                  onClick={() => onNavigate('mock-tests')}
                  className="hover:text-blue-400 transition-colors text-left"
                >
                  Official Exam Mocks
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-leaderboard"
                  type="button"
                  onClick={() => onNavigate('leaderboard')}
                  className="hover:text-blue-400 transition-colors text-left"
                >
                  Aspirants Leaderboard
                </button>
              </li>
            </ul>
          </div>

          {/* Resources & Admin */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-3">
              Resources & Tools
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  id="footer-nav-blog"
                  type="button"
                  onClick={() => onNavigate('blog')}
                  className="hover:text-blue-400 transition-colors text-left"
                >
                  Preparation Blog & Tips
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-dashboard"
                  type="button"
                  onClick={() => onNavigate('dashboard')}
                  className="hover:text-blue-400 transition-colors text-left"
                >
                  Candidate Dashboard
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-admin"
                  type="button"
                  onClick={() => onNavigate('admin')}
                  className="hover:text-blue-400 transition-colors text-left text-slate-400"
                >
                  Admin Architecture Preview
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-seo"
                  type="button"
                  onClick={() => onNavigate('seo-page')}
                  className="hover:text-blue-400 transition-colors text-left text-slate-400"
                >
                  Exam Landing Guides
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Mandatory Independent Disclaimer (Phase 17 Trust) */}
        <div className="my-6 p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 text-xs text-slate-400 flex items-start space-x-3">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-slate-200">
              Independent Platform Disclaimer & Non-Affiliation Statement:
            </p>
            <p className="leading-relaxed">
              <strong>Typing Wallah</strong> is an independent educational practice platform and is <strong>NOT</strong> affiliated with, associated with, authorized by, endorsed by, or in any way officially connected with Physics Wallah, MP CPCT (MAP_IT), Staff Selection Commission (SSC), Railway Recruitment Board (RRB), Delhi Police, State High Courts, UPSSSC, or any state or central government department.
            </p>
            <p className="text-[11px] text-slate-500">
              Exam names, syllabi, and marks schemes are referenced purely for informational and mock preparation purposes. Aspirants should always verify official notifications on the respective government recruiting body websites.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© 2026 Typing Wallah. Built with precision for Indian Competitive Aspirants.</p>
          <div className="flex items-center space-x-4">
            <span className="text-slate-400">Loop 01 Production Foundation</span>
            <span>•</span>
            <span className="text-emerald-400 font-medium">100% Client-Side Ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

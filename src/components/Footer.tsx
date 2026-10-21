import React from 'react';
import { ActivePage, ExamId } from '../types';
import { Keyboard, ShieldAlert, Award } from 'lucide-react';
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
              India's dedicated online typing practice platform built for competitive government exam aspirants. Realistic exam interfaces, accurate WPM & penalty scoring, and dual Remington GAIL & InScript Hindi support.
            </p>
            <div className="flex items-center space-x-2 text-xs text-amber-400 bg-slate-800/80 p-2.5 rounded-lg border border-slate-700/60 max-w-sm">
              <Award className="w-4 h-4 shrink-0 text-amber-400" />
              <span>Practice Smart. Type Fast. Crack Your Exam.</span>
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
              <li>
                <button
                  id="footer-all-exams"
                  type="button"
                  onClick={() => onNavigate('exams')}
                  className="hover:text-blue-400 transition-colors text-left font-semibold text-blue-400"
                >
                  All 8 Exam Simulators →
                </button>
              </li>
            </ul>
          </div>

          {/* Typing Practice */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-3">
              Typing Practice
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  id="footer-nav-touch-typing"
                  type="button"
                  onClick={() => onNavigate('touch-typing')}
                  className="hover:text-blue-400 transition-colors text-left"
                >
                  Learn Touch Typing Course
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-hindi"
                  type="button"
                  onClick={() => onNavigate('hindi-typing')}
                  className="hover:text-blue-400 transition-colors text-left"
                >
                  Hindi InScript & Remington GAIL
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

          {/* Platform & Legal */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-3">
              Platform & Legal
            </h4>
            <ul className="space-y-2 text-xs">
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
                  id="footer-nav-pricing"
                  type="button"
                  onClick={() => onNavigate('pricing')}
                  className="hover:text-blue-400 transition-colors text-left"
                >
                  Pricing & Plans
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-referrals"
                  type="button"
                  onClick={() => onNavigate('referrals')}
                  className="hover:text-blue-400 transition-colors text-left"
                >
                  Invite & Referrals
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-blog"
                  type="button"
                  onClick={() => onNavigate('blog')}
                  className="hover:text-blue-400 transition-colors text-left"
                >
                  Preparation Blog & Guides
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-about"
                  type="button"
                  onClick={() => onNavigate('about')}
                  className="hover:text-blue-400 transition-colors text-left"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-contact"
                  type="button"
                  onClick={() => onNavigate('contact')}
                  className="hover:text-blue-400 transition-colors text-left"
                >
                  Contact Support
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Mandatory Independent Disclaimer */}
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

        {/* Bottom Bar with Legal Links */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© {new Date().getFullYear()} Typing Wallah. Practice Smart. Type Fast. Crack Your Exam.</p>
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => onNavigate('privacy')}
              className="hover:text-slate-300 transition-colors"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => onNavigate('terms')}
              className="hover:text-slate-300 transition-colors"
            >
              Terms & Conditions
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => onNavigate('disclaimer')}
              className="hover:text-slate-300 transition-colors"
            >
              Legal Disclaimer
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

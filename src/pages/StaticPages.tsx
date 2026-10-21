import React, { useState } from 'react';
import { ActivePage } from '../types';
import {
  ShieldAlert,
  Mail,
  HelpCircle,
  FileText,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  Info
} from 'lucide-react';

interface StaticPageProps {
  onNavigate: (page: ActivePage) => void;
}

export const AboutPage: React.FC<StaticPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
        <h1 className="text-3xl font-black text-slate-900">About Typing Wallah</h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          <strong>Typing Wallah</strong> (Tagline: <em>Practice. Improve. Type Faster.</em>) is an independent online typing practice and test preparation platform created to assist Indian competitive examination candidates preparing for government computer skill tests.
        </p>

        <h3 className="text-xl font-bold text-slate-900 pt-2">Our Mission</h3>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Typing tests in Indian recruitments have specific grading frameworks—such as 15-minute 2,000 key depressions in SSC CGL DEST, 20/30 Net WPM requirements in MP CPCT, and strict Devanagari Unicode keyboards (InScript and Remington GAIL). Traditional global typing tutors do not reflect these exam criteria. Typing Wallah bridges this gap by providing an authentic, distraction-free environment adhering strictly to Indian exam specifications.
        </p>

        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 text-xs sm:text-sm text-blue-900 space-y-2">
          <h4 className="font-bold text-blue-800">Commitment to High Integrity</h4>
          <p className="leading-relaxed">
            Every calculation on Typing Wallah—from Gross WPM to Net WPM and character error tallies—is computed stroke-by-stroke from genuine candidate input. We never generate artificial or simulated figures.
          </p>
        </div>
      </div>
    </div>
  );
};

export const ContactPage: React.FC<StaticPageProps> = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
        <h1 className="text-3xl font-black text-slate-900">Contact Typing Wallah</h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Have queries about exam guidelines, passage suggestions, or platform feedback? Reach out to our community team.
        </p>

        {submitted ? (
          <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-2 text-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <h4 className="font-bold text-base">Message Received</h4>
            <p className="text-xs text-emerald-700">
              Thank you for reaching out. We will review your inquiry shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Your Name</label>
              <input
                required
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Aspirant Name"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-hidden focus:border-blue-600"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Email Address</label>
              <input
                required
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="aspirant@example.com"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-hidden focus:border-blue-600"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Message / Question</label>
              <textarea
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Your question regarding exam formats, bugs, or suggestions..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-hidden focus:border-blue-600"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all"
            >
              Send Inquiries
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export const DisclaimerPage: React.FC<StaticPageProps> = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="bg-white rounded-3xl border border-amber-200 p-6 sm:p-10 shadow-xs space-y-6">
        <div className="flex items-center space-x-3 text-amber-700">
          <AlertTriangle className="w-8 h-8" />
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Legal Disclaimer & Non-Affiliation Notice
          </h1>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm font-semibold leading-relaxed">
          Typing Wallah is an independent educational initiative created solely for candidate skill preparation, mock test practice, and typing speed enhancement.
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <h3 className="text-base font-bold text-slate-900">1. Strict Non-Affiliation Declaration</h3>
          <p>
            Typing Wallah is <strong>NOT affiliated, associated, authorized, endorsed by, or in any way officially connected</strong> with:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Physics Wallah or any related commercial entity</li>
            <li>Staff Selection Commission (SSC)</li>
            <li>Railway Recruitment Boards (RRB) / Ministry of Railways</li>
            <li>Madhya Pradesh MAP_IT / MP CPCT</li>
            <li>Delhi Police / UPSSSC / High Courts / State Public Service Commissions</li>
            <li>Any central, state, or municipal government agency of India</li>
          </ul>

          <h3 className="text-base font-bold text-slate-900 pt-2">2. Accuracy of Examination Information</h3>
          <p>
            All exam names, acronyms, minimum speed requirements (WPM/KDPH), syllabus details, and logos referenced on this website are used strictly for identification, reference, and informational purposes. Official rules and cutoff scores are determined solely by the respective recruiting authorities in their official notifications. Candidates must always verify dates and criteria directly on official recruitment portals.
          </p>

          <h3 className="text-base font-bold text-slate-900 pt-2">3. Mock Scorecard Disclaimer</h3>
          <p>
            Scorecards, qualification indicators, and percentile reports generated on Typing Wallah are for self-assessment only and carry no official certification or legal status.
          </p>
        </div>
      </div>
    </div>
  );
};

export const PrivacyPolicyPage: React.FC<StaticPageProps> = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
        <h1 className="text-3xl font-black text-slate-900">Privacy Policy</h1>
        <p className="text-xs text-slate-400">Last Updated: September 2026</p>

        <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <h3 className="text-base font-bold text-slate-900">1. Information Collection</h3>
          <p>
            Typing Wallah is engineered with privacy as a foundational principle. By default, your typing attempts, keystroke counts, WPM figures, and history are saved strictly within your device's browser <strong>LocalStorage</strong>.
          </p>

          <h3 className="text-base font-bold text-slate-900">2. Keystroke Logging Protection</h3>
          <p>
            We do not transmit your individual raw keystroke timing data or typed texts to external ad networks or third parties. Keystrokes are evaluated inside your browser's memory for real-time accuracy scoring.
          </p>

          <h3 className="text-base font-bold text-slate-900">3. Local Data Clearing</h3>
          <p>
            You may clear your entire local typing records and test history at any time using your browser settings or directly from the Admin local telemetry view.
          </p>
        </div>
      </div>
    </div>
  );
};

export const TermsPage: React.FC<StaticPageProps> = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
        <h1 className="text-3xl font-black text-slate-900">Terms of Service</h1>
        <p className="text-xs text-slate-400">Effective Date: September 2026</p>

        <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <p>
            By using Typing Wallah, you agree to access the simulator strictly for lawful personal typing preparation.
          </p>

          <h3 className="text-base font-bold text-slate-900">1. Acceptable Use</h3>
          <p>
            Users agree not to deploy automated typing bots, scripts, or auto-clickers to fraudulently distort community benchmark rankings.
          </p>

          <h3 className="text-base font-bold text-slate-900">2. Intellectual Property</h3>
          <p>
            All original passage compositions, custom UI styling, typing engine algorithms, and branding assets of Typing Wallah are protected. Do not clone or mirror without explicit authorization.
          </p>
        </div>
      </div>
    </div>
  );
};

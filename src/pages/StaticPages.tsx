import React, { useState, useMemo } from 'react';
import { ActivePage } from '../types';
import { StorageService } from '../services/storageService';
import { useAuth } from '../context/AuthContext';
import {
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Clock,
  Copy,
  Check,
  Gift,
  Share2,
  Home,
  Keyboard,
  Award,
  ArrowRight
} from 'lucide-react';

interface StaticPageProps {
  onNavigate: (page: ActivePage) => void;
}

export const AboutPage: React.FC<StaticPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-xs space-y-6">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">About Typing Wallah</h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          <strong>Typing Wallah</strong> (Tagline: <em>Practice Smart. Type Fast. Crack Your Exam.</em>) is an independent online typing practice and test preparation platform created to assist Indian competitive examination candidates preparing for government computer skill tests.
        </p>

        <h3 className="text-xl font-bold text-slate-900 dark:text-white pt-2">Our Mission</h3>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          Typing tests in Indian recruitments have specific grading frameworks—such as 15-minute 2,000 key depressions in SSC CGL DEST, 20/30 Net WPM requirements in MP CPCT, 10× error deduction in RRB NTPC, and strict Devanagari Unicode keyboards (InScript and Remington GAIL). Traditional global typing tutors do not reflect these exam criteria. Typing Wallah bridges this gap by providing an authentic, distraction-free environment adhering strictly to Indian exam specifications.
        </p>

        <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-800/60 rounded-2xl p-5 text-xs sm:text-sm text-blue-900 dark:text-blue-200 space-y-2">
          <h4 className="font-bold text-blue-800 dark:text-blue-300">Commitment to High Integrity</h4>
          <p className="leading-relaxed">
            Every calculation on Typing Wallah—from Gross WPM to Net WPM and character error tallies—is computed stroke-by-stroke from genuine candidate input. We never generate artificial or simulated figures.
          </p>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={() => onNavigate('typing-test')}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs inline-flex items-center gap-2 shadow-sm"
          >
            <Keyboard className="w-4 h-4" />
            <span>Start Typing Practice</span>
          </button>
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
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-xs space-y-6">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">Contact Typing Wallah</h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          Have queries about exam guidelines, passage suggestions, or platform feedback? Reach out to our community team.
        </p>

        {submitted ? (
          <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 space-y-2 text-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto" />
            <h4 className="font-bold text-base">Message Received</h4>
            <p className="text-xs text-emerald-700 dark:text-emerald-300">
              Thank you for reaching out. We will review your inquiry shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Your Name</label>
              <input
                required
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Aspirant Name"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-hidden focus:border-blue-600"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
              <input
                required
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="aspirant@example.com"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-hidden focus:border-blue-600"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Message / Question</label>
              <textarea
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Your question regarding exam formats, bugs, or suggestions..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-hidden focus:border-blue-600"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all"
            >
              Send Inquiry
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
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-amber-200 dark:border-amber-800/60 p-6 sm:p-10 shadow-xs space-y-6">
        <div className="flex items-center space-x-3 text-amber-700 dark:text-amber-400">
          <AlertTriangle className="w-8 h-8" />
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Legal Disclaimer & Non-Affiliation Notice
          </h1>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/70 text-amber-900 dark:text-amber-200 text-xs sm:text-sm font-semibold leading-relaxed">
          Typing Wallah is an independent educational initiative created solely for candidate skill preparation, mock test practice, and typing speed enhancement.
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">1. Strict Non-Affiliation Declaration</h3>
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

          <h3 className="text-base font-bold text-slate-900 dark:text-white pt-2">2. Accuracy of Examination Information</h3>
          <p>
            All exam names, acronyms, minimum speed requirements (WPM/KDPH), syllabus details, and logos referenced on this website are used strictly for identification, reference, and informational purposes. Official rules and cutoff scores are determined solely by the respective recruiting authorities in their official notifications. Candidates must always verify dates and criteria directly on official recruitment portals.
          </p>

          <h3 className="text-base font-bold text-slate-900 dark:text-white pt-2">3. Mock Scorecard Disclaimer</h3>
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
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-xs space-y-6">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">Privacy Policy</h1>
        <p className="text-xs text-slate-400">Last Updated: October 2026</p>

        <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">1. Information Collection</h3>
          <p>
            Typing Wallah is engineered with privacy as a foundational principle. For guest users, typing attempts, keystroke counts, WPM figures, and history are saved within your device's browser <strong>LocalStorage</strong>. When you sign in with an account, your test history and progress are synchronized securely with your account profile.
          </p>

          <h3 className="text-base font-bold text-slate-900 dark:text-white">2. Keystroke Logging Protection</h3>
          <p>
            We do not transmit your individual raw keystroke timing data or typed texts to external ad networks or third parties. Keystrokes are evaluated inside your browser's memory for real-time accuracy scoring.
          </p>

          <h3 className="text-base font-bold text-slate-900 dark:text-white">3. Local Data Clearing</h3>
          <p>
            You may clear your local typing records and test history at any time using your browser settings.
          </p>
        </div>
      </div>
    </div>
  );
};

export const TermsPage: React.FC<StaticPageProps> = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-xs space-y-6">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">Terms of Service</h1>
        <p className="text-xs text-slate-400">Effective Date: October 2026</p>

        <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            By using Typing Wallah, you agree to access the simulator strictly for lawful personal typing preparation.
          </p>

          <h3 className="text-base font-bold text-slate-900 dark:text-white">1. Acceptable Use</h3>
          <p>
            Users agree not to deploy automated typing bots, scripts, or auto-clickers to fraudulently distort community benchmark rankings.
          </p>

          <h3 className="text-base font-bold text-slate-900 dark:text-white">2. Intellectual Property</h3>
          <p>
            All original passage compositions, custom UI styling, typing engine algorithms, and branding assets of Typing Wallah are protected. Do not clone or mirror without explicit authorization.
          </p>
        </div>
      </div>
    </div>
  );
};

export const PricingPage: React.FC<StaticPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-bold border border-blue-200 dark:border-blue-800">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Transparent Access</span>
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Practice Plans for Every Aspirant
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          All core English & Hindi typing practice tests, exam simulators, and touch-typing lessons are currently open for free practice while premium subscription plans are being finalized.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Free Plan */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-emerald-500 p-7 shadow-md flex flex-col justify-between space-y-6 relative">
          <span className="absolute -top-3 left-6 px-3 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider">
            Active Now
          </span>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">Free Aspirant Tier</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Complete access to daily typing practice
              </p>
            </div>
            <div className="text-3xl font-black text-slate-900 dark:text-white">
              ₹0 <span className="text-xs font-semibold text-slate-400">/ Forever</span>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>English & Hindi (InScript + Remington GAIL) Tests</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>1, 3, 5, 10, and 15-Minute Timed Practice</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>All 8 Government Exam Simulators</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>100-Lesson Touch Typing Course</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>WPM & Accuracy History Tracking</span>
              </li>
            </ul>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('typing-test')}
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm"
          >
            <span>Start Free Practice</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Monthly Pro (Coming Soon) */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-7 shadow-xs flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-900 dark:text-white">Monthly Pro</h3>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 text-[10px] font-bold">
                Coming Soon
              </span>
            </div>
            <div className="text-3xl font-black text-slate-900 dark:text-white">
              ₹149 <span className="text-xs font-semibold text-slate-400">/ Month</span>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                <span>Everything in Free Aspirant Tier</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                <span>Detailed Keystroke Error Heatmaps</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                <span>Downloadable PDF Exam Scorecards</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                <span>Priority New Exam Passage Sets</span>
              </li>
            </ul>
          </div>

          <div className="w-full py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold text-xs flex items-center justify-center gap-1.5">
            <Clock className="w-4 h-4" />
            <span>Premium Plans Coming Soon</span>
          </div>
        </div>

        {/* Annual Pro (Coming Soon) */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-7 shadow-xs flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-900 dark:text-white">Annual Exam Pass</h3>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 text-[10px] font-bold">
                Coming Soon
              </span>
            </div>
            <div className="text-3xl font-black text-slate-900 dark:text-white">
              ₹499 <span className="text-xs font-semibold text-slate-400">/ Year</span>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                <span>Full 12-Month Exam Cycle Coverage</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                <span>SSC, RRB, CPCT & High Court Test Series</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                <span>Unlimited Cloud Analytics Backup</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                <span>weak-key & Finger Latency Diagnostics</span>
              </li>
            </ul>
          </div>

          <div className="w-full py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold text-xs flex items-center justify-center gap-1.5">
            <Clock className="w-4 h-4" />
            <span>Premium Plans Coming Soon</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ReferralPage: React.FC<StaticPageProps> = ({ onNavigate }) => {
  const { profile } = useAuth();
  const [referralState, setReferralState] = useState(() => StorageService.getReferralState());
  const [friendCode, setFriendCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const shareUrl = useMemo(
    () => `${window.location.origin}/?ref=${referralState.myReferralCode}`,
    [referralState.myReferralCode]
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleApplyFriendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    const clean = friendCode.trim().toUpperCase();
    if (profile.isLoggedIn && profile.id && !profile.id.startsWith('guest_')) {
      const verifyRes = await StorageService.recordReferralUnlock(
        clean,
        profile.id,
        profile.email,
        profile.name
      );
      if (!verifyRes.success) {
        setFeedback({ type: 'error', message: verifyRes.message });
        return;
      }
      setReferralState(StorageService.getReferralState());
      setFriendCode('');
      setFeedback({ type: 'success', message: verifyRes.message });
    } else {
      const res = StorageService.applyFriendReferralCode(clean);
      if (!res.success) {
        setFeedback({ type: 'error', message: res.message });
        return;
      }
      setFriendCode('');
      setFeedback({ type: 'success', message: res.message });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-xs space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Gift className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Invite Fellow Exam Aspirants
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Share Typing Wallah with your study group and track your community referrals.
            </p>
          </div>
        </div>

        {/* Share Link Box */}
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
            <span>Your Personal Referral Link</span>
            <span className="font-mono text-indigo-600 dark:text-indigo-400">{referralState.myReferralCode}</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              readOnly
              type="text"
              value={shareUrl}
              className="flex-1 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-mono text-slate-800 dark:text-slate-200"
            />
            <button
              type="button"
              onClick={handleCopy}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs inline-flex items-center justify-center gap-1.5 shrink-0"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Link Copied!' : 'Copy Invite Link'}</span>
            </button>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(
                `Practice SSC, RRB & MP CPCT Hindi/English typing tests for free on Typing Wallah! Join with my invite code ${referralState.myReferralCode}: ${shareUrl}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs inline-flex items-center justify-center gap-1.5 shrink-0"
            >
              <Share2 className="w-4 h-4" />
              <span>Share on WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Apply a Friend's Code */}
        <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-3">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">
            Have a Friend's Referral Code?
          </h3>
          {referralState.referredByCode ? (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Applied Referral Code: <strong>{referralState.referredByCode}</strong></span>
            </div>
          ) : (
            <form onSubmit={handleApplyFriendCode} className="flex flex-col sm:flex-row gap-2">
              <input
                required
                type="text"
                value={friendCode}
                onChange={(e) => setFriendCode(e.target.value)}
                placeholder="Enter code (e.g., TW-ABCD12)"
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono uppercase text-slate-900 dark:text-white"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700 text-white font-bold text-xs"
              >
                Apply Code
              </button>
            </form>
          )}
          {feedback && (
            <p
              className={`text-xs font-bold ${
                feedback.type === 'success' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600'
              }`}
            >
              {feedback.message}
            </p>
          )}
        </div>

        <div className="pt-2 flex items-center justify-between">
          <button
            type="button"
            onClick={() => onNavigate('dashboard')}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
          >
            ← Back to Candidate Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export const NotFoundPage: React.FC<StaticPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 sm:p-12 shadow-xs space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-black text-2xl flex items-center justify-center mx-auto">
          404
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          Page Not Found
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
          The page or route you are looking for does not exist or may have moved. Choose one of the destinations below to continue your typing practice.
        </p>
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs inline-flex items-center gap-2 shadow-sm"
          >
            <Home className="w-4 h-4" />
            <span>Go to Homepage</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('typing-test')}
            className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs inline-flex items-center gap-2"
          >
            <Keyboard className="w-4 h-4" />
            <span>Start Typing Test</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('exams')}
            className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs inline-flex items-center gap-2"
          >
            <Award className="w-4 h-4" />
            <span>Explore Exams</span>
          </button>
        </div>
      </div>
    </div>
  );
};

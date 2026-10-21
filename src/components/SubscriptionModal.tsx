import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Share2,
  Copy,
  Check,
  Sparkles,
  ShieldCheck,
  Gift,
  Clock,
  Smartphone,
  Monitor
} from 'lucide-react';
import { StorageService } from '../services/storageService';
import { UserProfile, ExamInfo } from '../types';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedExam?: ExamInfo | null;
  onSuccess?: () => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  selectedExam,
  onSuccess
}) => {
  const [activeTab, setActiveTab] = useState<'plans' | 'referral'>('plans');
  const [copied, setCopied] = useState(false);
  const [inputReferralCode, setInputReferralCode] = useState('');
  const [referralFeedback, setReferralFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isSubmittingReferral, setIsSubmittingReferral] = useState(false);

  if (!isOpen) return null;

  const profile: UserProfile = StorageService.getProfile();
  const referralCode = StorageService.getReferralCode(profile.id);
  const currentUrl = typeof window !== 'undefined' ? window.location.origin : 'https://typingwallah.in';
  const referralLink = `${currentUrl}/?ref=${referralCode}`;

  const examText = selectedExam ? selectedExam.name : 'SSC, RRB, CPCT & High Court';
  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    `Practice authentic typing tests for ${examText} on Typing Wallah! Join using my invite link:\n${referralLink}`
  )}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleApplyReferral = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputReferralCode.trim()) return;

    setIsSubmittingReferral(true);
    setReferralFeedback(null);

    const res = await StorageService.recordReferralUnlock(
      inputReferralCode.trim(),
      profile.id,
      profile.email,
      profile.name
    );

    setIsSubmittingReferral(false);
    if (res.success) {
      setReferralFeedback({ type: 'success', message: res.message });
      if (onSuccess) onSuccess();
    } else {
      setReferralFeedback({ type: 'error', message: res.message });
    }
  };

  return (
    <div
      id="subscription-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        id="subscription-modal-card"
        className="relative w-full max-w-xl overflow-hidden rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Banner */}
        <div className="bg-slate-900 px-6 py-6 text-white relative border-b border-slate-800">
          <button
            id="subscription-modal-close-btn"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-amber-400/20 text-amber-300 border border-amber-400/30">
              <Clock className="w-3.5 h-3.5" /> PREMIUM PLANS COMING SOON
            </span>
            {selectedExam && (
              <span className="text-xs text-slate-300 font-medium">
                • {selectedExam.name}
              </span>
            )}
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-white">
            Typing Wallah Plans & Access
          </h2>
          <p className="mt-1 text-sm text-slate-300">
            All English & Hindi typing practice tests, exam simulations, and touch-typing lessons are currently open for free practice.
          </p>

          {/* Tab Switcher */}
          <div className="flex gap-2 mt-5 p-1 bg-white/10 rounded-xl max-w-xs">
            <button
              id="tab-plans-btn"
              onClick={() => setActiveTab('plans')}
              className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'plans'
                  ? 'bg-white text-slate-950 shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Plans Overview
            </button>
            <button
              id="tab-referral-btn"
              onClick={() => setActiveTab('referral')}
              className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1 ${
                activeTab === 'referral'
                  ? 'bg-amber-400 text-slate-950 shadow'
                  : 'text-amber-300 hover:text-white'
              }`}
            >
              <Gift className="w-3.5 h-3.5" /> Invite Friends
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {activeTab === 'plans' ? (
            <div className="space-y-5">
              {/* Free Access Notice */}
              <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/40 p-4 border border-emerald-200 dark:border-emerald-800/60">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                    Current Status: Free Access Active
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-600 text-white">
                    ₹0 / Free
                  </span>
                </div>
                <p className="text-xs text-emerald-700 dark:text-emerald-300 leading-relaxed">
                  You have full access to English & Hindi typing tests, SSC/CPCT/RRB exam profiles, and progressive touch-typing lessons at no cost.
                </p>
              </div>

              {/* Planned PRO Features */}
              <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-4 border border-slate-200 dark:border-slate-700">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                  Included in Free & Upcoming Pro Suite:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>1, 3, 5, 10 & 15-min exam mocks</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Exam-specific WPM & KDPH scoring</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Editorial, legal & official passages</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>English & Hindi (Remington/InScript)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Detailed error & backspace diagnostics</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Cloud history & progress analytics</span>
                  </div>
                </div>
              </div>

              {/* Upcoming Pricing Cards (Payment Gateway Postponed) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 flex flex-col justify-between bg-white dark:bg-slate-900">
                  <div>
                    <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                      Monthly Pro (Planned)
                    </div>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="text-2xl font-black text-slate-900 dark:text-white">₹99</span>
                      <span className="text-xs text-slate-500">/ 30 days</span>
                    </div>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      Upcoming premium tier for dedicated exam test series & advanced analytics.
                    </p>
                  </div>
                  <button
                    id="buy-monthly-btn"
                    type="button"
                    disabled
                    className="mt-4 w-full py-2.5 px-4 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg text-xs font-bold cursor-not-allowed flex items-center justify-center gap-1.5"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Premium Plans Coming Soon</span>
                  </button>
                </div>

                <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 relative flex flex-col justify-between bg-white dark:bg-slate-900">
                  <div>
                    <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                      Annual Pro (Planned)
                    </div>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="text-2xl font-black text-slate-900 dark:text-white">₹499</span>
                      <span className="text-xs text-slate-500">/ 365 days</span>
                    </div>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      Year-round preparation for SSC, RRB, CPCT, and High Court exams.
                    </p>
                  </div>
                  <button
                    id="buy-annual-btn"
                    type="button"
                    disabled
                    className="mt-4 w-full py-2.5 px-4 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg text-xs font-bold cursor-not-allowed flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Premium Plans Coming Soon</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Referral / Invite Friends View */
            <div className="space-y-5">
              <div className="rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 p-4">
                <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300 font-bold text-sm">
                  <Gift className="w-4 h-4 text-amber-600" />
                  <span>Invite Fellow Exam Aspirants</span>
                </div>
                <p className="mt-1 text-xs text-amber-800 dark:text-amber-300/90 leading-relaxed">
                  Share your personal invite code with friends preparing for SSC CHSL, RRB NTPC, MP CPCT, or High Court typing tests so they can practice together with you.
                </p>
              </div>

              {/* Unique Referral Link & Share Buttons */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Your Personal Invite Link ({referralCode}):
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={referralLink}
                    className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-700 dark:text-slate-200 select-all"
                  />
                  <button
                    id="copy-referral-link-btn"
                    type="button"
                    onClick={handleCopyLink}
                    className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <a
                id="whatsapp-share-btn"
                href={whatsappShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                <span>Share Invite Link on WhatsApp</span>
              </a>

              {/* Enter a code from friend */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Have an Invite Code from a Friend?
                </label>
                <form onSubmit={handleApplyReferral} className="flex gap-2">
                  <input
                    type="text"
                    value={inputReferralCode}
                    onChange={(e) => setInputReferralCode(e.target.value.toUpperCase())}
                    placeholder="e.g. TW-AB12CD"
                    className="flex-1 border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg px-3 py-2 text-xs font-mono uppercase focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                  <button
                    id="apply-referral-code-btn"
                    type="submit"
                    disabled={isSubmittingReferral || !inputReferralCode.trim()}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors"
                  >
                    {isSubmittingReferral ? 'Recording...' : 'Apply Code'}
                  </button>
                </form>

                {referralFeedback && (
                  <p
                    className={`mt-2 text-xs font-medium ${
                      referralFeedback.type === 'success' ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {referralFeedback.message}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Free Practice Mode
            </span>
            <span className="flex items-center gap-1">
              <Monitor className="w-3.5 h-3.5" /> Desktop Ready
            </span>
            <span className="flex items-center gap-1">
              <Smartphone className="w-3.5 h-3.5" /> Mobile Friendly
            </span>
          </div>
          <button
            id="subscription-modal-dismiss-btn"
            onClick={onClose}
            className="text-slate-600 dark:text-slate-300 hover:text-slate-900 font-semibold"
          >
            Continue Free Practice
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  X,
  Lock,
  CheckCircle2,
  Share2,
  Copy,
  Check,
  Sparkles,
  ShieldCheck,
  Gift,
  ArrowRight,
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
  const currentUrl = typeof window !== 'undefined' ? window.location.origin : 'https://typingwallah.com';
  const referralLink = `${currentUrl}/?ref=${referralCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsAppShare = () => {
    const examText = selectedExam ? selectedExam.name : 'SSC, RRB, CPCT & High Court';
    const message = encodeURIComponent(
      `🎯 Practice authentic typing tests for ${examText} on Typing Wallah!\n\nUse my invite link to unlock free PRO exam passages & full mocks:\n${referralLink}`
    );
    window.open(`https://api.whatsapp.com/send?text=${message}`, '_blank');
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
      setTimeout(() => {
        onClose();
      }, 2000);
    } else {
      setReferralFeedback({ type: 'error', message: res.message });
    }
  };

  const handleMockPayment = (planName: string, amount: number) => {
    // Activate PRO plan
    const now = new Date();
    const days = planName.includes('Year') ? 365 : 30;
    const expiry = new Date(now.getTime() + days * 24 * 60 * 60 * 1000).toISOString();

    StorageService.saveSubscription({
      uid: profile.id,
      plan: planName.includes('Year') ? 'pro_annual' : 'pro_monthly',
      status: 'active',
      startDate: now.toISOString(),
      expiryDate: expiry,
      source: 'payment',
      amountInr: amount
    });

    if (onSuccess) onSuccess();
    onClose();
  };

  return (
    <div
      id="subscription-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        id="subscription-modal-card"
        className="relative w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-indigo-900 via-blue-900 to-indigo-950 px-6 py-6 text-white relative">
          <button
            id="subscription-modal-close-btn"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-indigo-200 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-400/20 text-amber-300 border border-amber-400/30">
              <Lock className="w-3.5 h-3.5" /> PRO PASSAGE & EXAM SUITE
            </span>
            {selectedExam && (
              <span className="text-xs text-indigo-200 font-medium">
                • {selectedExam.name}
              </span>
            )}
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-white">
            Unlock Full Exam Practice
          </h2>
          <p className="mt-1 text-sm text-indigo-200">
            Prepare with exact official government exam patterns, scoring formulas & unlimited mock passages.
          </p>

          {/* Tab Switcher */}
          <div className="flex gap-2 mt-5 p-1 bg-white/10 rounded-xl max-w-xs">
            <button
              id="tab-plans-btn"
              onClick={() => setActiveTab('plans')}
              className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'plans'
                  ? 'bg-white text-indigo-950 shadow'
                  : 'text-indigo-200 hover:text-white'
              }`}
            >
              Get PRO Plan
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
              <Gift className="w-3.5 h-3.5" /> Share & Unlock Free
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {activeTab === 'plans' ? (
            <div className="space-y-6">
              {/* Value propositions */}
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
                  Everything Included in PRO:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Full-length 10 & 15-min exam mocks</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Official 10x penalty & KDPH scoring</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>All locked legal & governance passages</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>English & Hindi (Remington/InScript)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Downloadable official score certificates</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Website + Android + Windows ready</span>
                  </div>
                </div>
              </div>

              {/* Pricing Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 1 Month */}
                <div className="rounded-xl border border-slate-200 p-4 hover:border-indigo-500 transition-colors flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                      Monthly Sprint
                    </div>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="text-2xl font-black text-slate-900">₹99</span>
                      <span className="text-xs text-slate-500">/ 30 days</span>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                      Best for upcoming exam dates & rapid 4-week preparation.
                    </p>
                  </div>
                  <button
                    id="buy-monthly-btn"
                    onClick={() => handleMockPayment('1 Month PRO', 99)}
                    className="mt-4 w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <span>Get 30-Day Access</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* 1 Year - Recommended */}
                <div className="rounded-xl border-2 border-indigo-600 bg-indigo-50/40 p-4 relative flex flex-col justify-between">
                  <span className="absolute -top-2.5 right-4 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Best Value
                  </span>
                  <div>
                    <div className="text-xs font-bold text-indigo-900 uppercase tracking-wider">
                      Full Year Unlimited
                    </div>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="text-2xl font-black text-slate-900">₹499</span>
                      <span className="text-xs text-slate-500">/ 365 days</span>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                      Includes all central & state recruitment exams for 1 year.
                    </p>
                  </div>
                  <button
                    id="buy-annual-btn"
                    onClick={() => handleMockPayment('1 Year PRO', 499)}
                    className="mt-4 w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Get 1-Year Access</span>
                  </button>
                </div>
              </div>

              {/* Or switch to referral */}
              <div className="text-center pt-2">
                <button
                  id="switch-to-referral-text-btn"
                  onClick={() => setActiveTab('referral')}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold hover:underline inline-flex items-center gap-1"
                >
                  <Gift className="w-3.5 h-3.5 text-amber-500" /> Don't want to pay? Unlock Free with 1 WhatsApp Share &gt;
                </button>
              </div>
            </div>
          ) : (
            /* Referral / Share & Unlock View */
            <div className="space-y-5">
              <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                  <Gift className="w-4 h-4 text-amber-600" />
                  <span>Refer & Unlock Full PRO Features Free</span>
                </div>
                <p className="mt-1 text-xs text-amber-800 leading-relaxed">
                  Invite your friends preparing for SSC, CPCT, Railways or High Court. When they start practicing, both of you earn free PRO access!
                </p>

                {/* Milestone breakdown */}
                <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-white/80 rounded-lg p-2 border border-amber-200">
                    <div className="font-bold text-amber-950">1 Referral</div>
                    <div className="text-emerald-700 font-semibold text-[11px]">7 Days PRO</div>
                  </div>
                  <div className="bg-white/80 rounded-lg p-2 border border-amber-200">
                    <div className="font-bold text-amber-950">3 Referrals</div>
                    <div className="text-emerald-700 font-semibold text-[11px]">30 Days PRO</div>
                  </div>
                  <div className="bg-white/80 rounded-lg p-2 border border-amber-200">
                    <div className="font-bold text-amber-950">5 Referrals</div>
                    <div className="text-emerald-700 font-semibold text-[11px]">60 Days PRO</div>
                  </div>
                </div>
              </div>

              {/* Unique Referral Link & Share Buttons */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Your Personal Invite Link:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={referralLink}
                    className="flex-1 bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono text-slate-700 select-all"
                  />
                  <button
                    id="copy-referral-link-btn"
                    onClick={handleCopyLink}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors"
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

              <button
                id="whatsapp-share-btn"
                onClick={handleWhatsAppShare}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                <span>Share on WhatsApp & Unlock Free</span>
              </button>

              {/* Enter a code from friend */}
              <div className="pt-3 border-t border-slate-200">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Have an Invite Code from a Friend?
                </label>
                <form onSubmit={handleApplyReferral} className="flex gap-2">
                  <input
                    type="text"
                    value={inputReferralCode}
                    onChange={(e) => setInputReferralCode(e.target.value.toUpperCase())}
                    placeholder="e.g. TW-AB12CD"
                    className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono uppercase focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                  <button
                    id="apply-referral-code-btn"
                    type="submit"
                    disabled={isSubmittingReferral || !inputReferralCode.trim()}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-lg text-xs font-bold transition-colors"
                  >
                    {isSubmittingReferral ? 'Verifying...' : 'Claim 7 Days'}
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
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Secure Practice
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
            className="text-slate-500 hover:text-slate-800 font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

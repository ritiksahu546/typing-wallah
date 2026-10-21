import { TestResultRecord, UserProfile, UserStatsSummary, LeaderboardItem, UserSubscription, ReferralRecord, Passage, ExamInfo } from '../types';
import { auth, db } from './firebase';
import {
  collection,
  addDoc,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  increment
} from 'firebase/firestore';

const STORAGE_KEYS = {
  PROFILE: 'typing_wallah_profile',
  HISTORY: 'typing_wallah_history',
  OFFLINE_QUEUE: 'typing_wallah_offline_queue',
  SETTINGS: 'typing_wallah_settings',
  SUBSCRIPTION: 'typing_wallah_subscription'
};

const DEFAULT_PROFILE: UserProfile = {
  id: 'guest_aspirant',
  name: 'Candidate (Guest)',
  email: 'guest@typingwallah.in',
  avatarSeed: 'TW',
  targetExam: 'cpct',
  joinedDate: 'Guest Session',
  isLoggedIn: false,
  isPro: false,
  referralCode: 'TW-GUEST',
  referralCount: 0,
  referralDaysEarned: 0
};

export const StorageService = {
  getProfile(): UserProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    return DEFAULT_PROFILE;
  },

  saveProfile(profile: UserProfile): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    } catch {
      // ignore
    }
  },

  getTestHistory(): TestResultRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    return [];
  },

  saveTestResult(result: TestResultRecord): void {
    // 1. Maintain robust localStorage for offline & instant feedback
    try {
      const history = this.getTestHistory();
      history.unshift(result);
      if (history.length > 50) history.pop();
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }

    // 2. If user is authenticated, sync to Firestore
    const currentUser = auth.currentUser;
    if (currentUser) {
      this.syncResultToFirestore(result).catch((err) => {
        console.warn('Firestore sync background notice, queueing for offline retry:', err);
        this.enqueueOfflineResult(result);
      });
    }
  },

  enqueueOfflineResult(result: TestResultRecord): void {
    try {
      const queueRaw = localStorage.getItem(STORAGE_KEYS.OFFLINE_QUEUE);
      const queue: TestResultRecord[] = queueRaw ? JSON.parse(queueRaw) : [];
      queue.push(result);
      localStorage.setItem(STORAGE_KEYS.OFFLINE_QUEUE, JSON.stringify(queue));
    } catch {
      // ignore
    }
  },

  async drainOfflineQueue(): Promise<void> {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    try {
      const queueRaw = localStorage.getItem(STORAGE_KEYS.OFFLINE_QUEUE);
      if (!queueRaw) return;
      const queue: TestResultRecord[] = JSON.parse(queueRaw);
      if (!queue.length) return;

      const remaining: TestResultRecord[] = [];
      for (const item of queue) {
        try {
          await this.syncResultToFirestore(item);
        } catch {
          remaining.push(item);
        }
      }
      localStorage.setItem(STORAGE_KEYS.OFFLINE_QUEUE, JSON.stringify(remaining));
    } catch {
      // ignore
    }
  },

  async syncResultToFirestore(result: TestResultRecord): Promise<void> {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      return;
    }

    try {
      // A. Write to user's personal results subcollection
      const userSubcol = collection(db, 'users', currentUser.uid, 'results');
      await addDoc(userSubcol, {
        userId: currentUser.uid,
        testId: result.id,
        timestamp: result.timestamp,
        createdAt: serverTimestamp(),
        examId: result.examId,
        examName: result.examName,
        language: result.language,
        keyboardLayout: result.keyboardLayout || 'standard',
        durationSeconds: result.durationSeconds,
        passageTitle: result.passageTitle,
        passageId: result.passageId,
        metrics: {
          grossWpm: Number(result.metrics.grossWpm) || 0,
          netWpm: Number(result.metrics.netWpm) || 0,
          accuracy: Number(result.metrics.accuracy) || 0,
          totalChars: Number(result.metrics.totalChars) || 0,
          correctChars: Number(result.metrics.correctChars) || 0,
          incorrectChars: Number(result.metrics.incorrectChars) || 0,
          errors: Number(result.metrics.errors) || 0,
          backspaceCount: Number(result.metrics.backspaceCount) || 0,
          keyDepressions: Number(result.metrics.keyDepressions) || 0,
          kdph: Number(result.metrics.kdph) || 0,
          isQualified: !!result.metrics.isQualified,
          grade: result.metrics.grade || 'Unqualified'
        }
      });

      // B. Write to root user_results collection for backwards compatibility & audit
      const rootResultsCol = collection(db, 'user_results');
      await addDoc(rootResultsCol, {
        userId: currentUser.uid,
        userEmail: currentUser.email || '',
        username: currentUser.displayName || 'Candidate',
        photoURL: currentUser.photoURL || '',
        testId: result.id,
        timestamp: result.timestamp,
        createdAt: serverTimestamp(),
        examId: result.examId,
        examName: result.examName,
        language: result.language,
        keyboardLayout: result.keyboardLayout || 'standard',
        durationSeconds: result.durationSeconds,
        passageTitle: result.passageTitle,
        passageId: result.passageId,
        metrics: {
          grossWpm: Number(result.metrics.grossWpm) || 0,
          netWpm: Number(result.metrics.netWpm) || 0,
          accuracy: Number(result.metrics.accuracy) || 0,
          totalChars: Number(result.metrics.totalChars) || 0,
          correctChars: Number(result.metrics.correctChars) || 0,
          incorrectChars: Number(result.metrics.incorrectChars) || 0,
          errors: Number(result.metrics.errors) || 0,
          backspaceCount: Number(result.metrics.backspaceCount) || 0,
          keyDepressions: Number(result.metrics.keyDepressions) || 0,
          isQualified: !!result.metrics.isQualified
        }
      });

      // C. Update leaderboard entry if netWpm is competitive
      const leaderboardDocId = `${currentUser.uid}_${result.examId}_${result.language}`;
      const leaderboardDocRef = doc(db, 'leaderboard', leaderboardDocId);

      await setDoc(
        leaderboardDocRef,
        {
          userId: currentUser.uid,
          username: currentUser.displayName || 'Candidate',
          photoURL: currentUser.photoURL || '',
          netWpm: Number(result.metrics.netWpm) || 0,
          grossWpm: Number(result.metrics.grossWpm) || 0,
          accuracy: Number(result.metrics.accuracy) || 0,
          exam: result.examName,
          examId: result.examId,
          language: result.language,
          date: new Date().toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          }),
          timestamp: serverTimestamp()
        },
        { merge: true }
      );
    } catch (error) {
      console.error('Error syncing test result to Firestore:', error);
      throw error;
    }
  },

  async fetchCloudUserHistory(uid: string): Promise<TestResultRecord[]> {
    try {
      const userSubcol = collection(db, 'users', uid, 'results');
      const q = query(userSubcol, orderBy('timestamp', 'desc'), limit(30));
      const snap = await getDocs(q);

      const records: TestResultRecord[] = [];
      snap.forEach((docSnap) => {
        const d = docSnap.data();
        records.push({
          id: d.testId || docSnap.id,
          timestamp: d.timestamp || Date.now(),
          examId: d.examId || 'general',
          examName: d.examName || 'Typing Test',
          language: d.language || 'english',
          keyboardLayout: d.keyboardLayout || 'standard',
          durationSeconds: d.durationSeconds || 300,
          passageTitle: d.passageTitle || 'Master Passage',
          passageId: d.passageId || 'default',
          metrics: {
            grossWpm: d.metrics?.grossWpm || 0,
            netWpm: d.metrics?.netWpm || 0,
            accuracy: d.metrics?.accuracy || 0,
            totalChars: d.metrics?.totalChars || 0,
            correctChars: d.metrics?.correctChars || 0,
            incorrectChars: d.metrics?.incorrectChars || 0,
            errors: d.metrics?.errors || 0,
            backspaceCount: d.metrics?.backspaceCount || 0,
            keyDepressions: d.metrics?.keyDepressions || 0,
            elapsedSeconds: d.durationSeconds || 300,
            remainingSeconds: 0,
            isQualified: d.metrics?.isQualified,
            grade: d.metrics?.grade
          }
        });
      });

      if (records.length > 0) {
        // Cache to local storage as well
        localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(records));
        return records;
      }
    } catch (e) {
      console.warn('Could not fetch cloud user history, using local cache:', e);
    }

    return this.getTestHistory();
  },

  async fetchLeaderboardFromFirestore(examId?: string, language?: string): Promise<LeaderboardItem[]> {
    try {
      const leaderCol = collection(db, 'leaderboard');
      let q = query(leaderCol, orderBy('netWpm', 'desc'), limit(50));

      if (examId && examId !== 'all') {
        q = query(leaderCol, where('examId', '==', examId), orderBy('netWpm', 'desc'), limit(50));
      }

      const snap = await getDocs(q);
      const items: LeaderboardItem[] = [];
      let rank = 1;

      snap.forEach((docSnap) => {
        const d = docSnap.data();
        if (language && language !== 'all' && d.language !== language) {
          return;
        }

        const currentUid = auth.currentUser?.uid;
        items.push({
          id: docSnap.id,
          rank: rank++,
          username: d.username || 'Candidate',
          wpm: d.grossWpm || d.netWpm || 0,
          netWpm: d.netWpm || 0,
          accuracy: d.accuracy || 100,
          examName: d.exam || 'All Exams',
          language: d.language || 'english',
          date: d.date || 'Recent',
          isCurrentUser: currentUid ? d.userId === currentUid : false,
          avatarSeed: (d.username || 'A').slice(0, 2).toUpperCase()
        });
      });

      return items;
    } catch (e) {
      console.warn('Leaderboard fetch note (falling back to cached data):', e);
      return [];
    }
  },

  getUserStats(): UserStatsSummary {
    const history = this.getTestHistory();
    if (history.length === 0) {
      return {
        bestWpm: 0,
        avgWpm: 0,
        avgAccuracy: 0,
        totalTests: 0,
        totalPracticeTimeSeconds: 0,
        recentTests: []
      };
    }

    let maxWpm = 0;
    let sumWpm = 0;
    let sumAcc = 0;
    let totalSecs = 0;

    history.forEach((t) => {
      if (t.metrics.netWpm > maxWpm) maxWpm = t.metrics.netWpm;
      sumWpm += t.metrics.netWpm;
      sumAcc += t.metrics.accuracy;
      totalSecs += t.durationSeconds;
    });

    return {
      bestWpm: maxWpm,
      avgWpm: Math.round(sumWpm / history.length),
      avgAccuracy: Number((sumAcc / history.length).toFixed(1)),
      totalTests: history.length,
      totalPracticeTimeSeconds: totalSecs,
      recentTests: history.slice(0, 10)
    };
  },

  // =========================================================================
  // --- Subscription & PRO State Management ---
  // =========================================================================

  getSubscription(): UserSubscription | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SUBSCRIPTION);
      if (data) {
        const sub: UserSubscription = JSON.parse(data);
        const isExpired = new Date(sub.expiryDate).getTime() < Date.now();
        if (isExpired && sub.status === 'active') {
          sub.status = 'expired';
          this.saveSubscription(sub);
        }
        return sub;
      }
    } catch (e) {
      console.warn('Error reading subscription:', e);
    }
    return null;
  },

  saveSubscription(sub: UserSubscription): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SUBSCRIPTION, JSON.stringify(sub));
      // Also update user profile isPro status
      const profile = this.getProfile();
      const isActive = sub.status === 'active' && new Date(sub.expiryDate).getTime() > Date.now();
      profile.isPro = isActive;
      profile.proExpiryDate = sub.expiryDate;
      this.saveProfile(profile);
    } catch (e) {
      console.warn('Error saving subscription:', e);
    }
  },

  isUserPro(): boolean {
    const profile = this.getProfile();
    if (profile.isPro) {
      if (profile.proExpiryDate) {
        return new Date(profile.proExpiryDate).getTime() > Date.now();
      }
      return true;
    }
    const sub = this.getSubscription();
    return !!(sub && sub.status === 'active' && new Date(sub.expiryDate).getTime() > Date.now());
  },

  async syncSubscriptionWithCloud(uid: string): Promise<UserSubscription | null> {
    try {
      const subDocRef = doc(db, 'subscriptions', uid);
      const snap = await getDoc(subDocRef);
      if (snap.exists()) {
        const d = snap.data();
        const sub: UserSubscription = {
          uid,
          plan: d.plan || 'pro_monthly',
          status: d.status || 'active',
          startDate: d.startDate || new Date().toISOString(),
          expiryDate: d.expiryDate || new Date(Date.now() + 30 * 86400000).toISOString(),
          source: d.source || 'payment',
          amountInr: d.amountInr
        };
        this.saveSubscription(sub);
        return sub;
      }
    } catch (e) {
      console.warn('Could not sync cloud subscription:', e);
    }
    return this.getSubscription();
  },

  // =========================================================================
  // --- Referral System: Share & Unlock Free Access ---
  // =========================================================================

  getReferralCode(userUid: string): string {
    const cleanId = (userUid || 'USER').replace(/[^a-zA-Z0-9]/g, '').slice(0, 6).toUpperCase();
    return `TW-${cleanId}`;
  },

  async recordReferralUnlock(referrerCode: string, newUserId: string, newUserEmail: string, newUserName: string): Promise<{ success: boolean; message: string; daysAdded?: number }> {
    try {
      if (!referrerCode || !referrerCode.trim()) {
        return { success: false, message: 'Invalid referral code' };
      }

      const cleanCode = referrerCode.trim().toUpperCase();
      const currentUser = auth.currentUser;
      const myCode = currentUser ? this.getReferralCode(currentUser.uid) : '';

      // Prevent self-referral
      if (myCode && cleanCode === myCode) {
        return { success: false, message: 'You cannot use your own referral code' };
      }

      // Check if already applied
      const appliedRefKey = `tw_applied_ref_${newUserId}`;
      if (localStorage.getItem(appliedRefKey)) {
        return { success: false, message: 'Referral code has already been applied on this account' };
      }

      // Calculate days reward: 1st referral = 7 days PRO
      const daysToAward = 7;
      const now = new Date();
      const newExpiry = new Date(now.getTime() + daysToAward * 24 * 60 * 60 * 1000).toISOString();

      // Record to Firestore referrals collection
      const referralRecord: ReferralRecord = {
        id: `ref_${Date.now()}_${newUserId.slice(0, 6)}`,
        referrerUid: cleanCode,
        referrerCode: cleanCode,
        referredUid: newUserId,
        referredEmail: newUserEmail,
        referredName: newUserName,
        timestamp: Date.now(),
        daysAwarded: daysToAward,
        status: 'verified'
      };

      try {
        await addDoc(collection(db, 'referrals'), {
          ...referralRecord,
          createdAt: serverTimestamp()
        });
      } catch (firestoreErr) {
        console.warn('Firestore referral record notice (proceeding locally):', firestoreErr);
      }

      // Activate PRO trial on current user profile
      const currentProfile = this.getProfile();
      currentProfile.isPro = true;
      currentProfile.referredBy = cleanCode;
      currentProfile.referralDaysEarned = (currentProfile.referralDaysEarned || 0) + daysToAward;
      currentProfile.proExpiryDate = newExpiry;
      this.saveProfile(currentProfile);

      // Save subscription record
      const sub: UserSubscription = {
        uid: newUserId,
        plan: 'referral_unlocked',
        status: 'active',
        startDate: now.toISOString(),
        expiryDate: newExpiry,
        source: 'referral'
      };
      this.saveSubscription(sub);

      localStorage.setItem(appliedRefKey, cleanCode);

      return {
        success: true,
        message: `🎉 Success! Referral code accepted. You have received ${daysToAward} days of Free PRO Exam Practice!`,
        daysAdded: daysToAward
      };
    } catch (e: any) {
      console.error('Referral application failed:', e);
      return { success: false, message: e?.message || 'Referral could not be applied' };
    }
  },

  async awardReferralToOwner(referrerUid: string, daysEarned: number = 7): Promise<void> {
    try {
      const userRef = doc(db, 'users', referrerUid);
      await updateDoc(userRef, {
        referralCount: increment(1),
        referralDaysEarned: increment(daysEarned),
        isPro: true
      });
    } catch (e) {
      console.warn('Could not increment owner referral in cloud:', e);
    }
  },

  // =========================================================================
  // --- Custom Passages & CMS Additions ---
  // =========================================================================

  getCustomPassages(): Passage[] {
    try {
      const data = localStorage.getItem('tw_custom_passages');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveCustomPassage(passage: Passage): void {
    try {
      const existing = this.getCustomPassages();
      existing.unshift(passage);
      localStorage.setItem('tw_custom_passages', JSON.stringify(existing));

      // Attempt sync to Firestore
      addDoc(collection(db, 'passages'), {
        ...passage,
        createdAt: serverTimestamp()
      }).catch(() => {});
    } catch (e) {
      console.warn('Error saving custom passage:', e);
    }
  }
};

// Listen to online events to drain any offline completed test results
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    StorageService.drainOfflineQueue().catch(() => {});
  });
}

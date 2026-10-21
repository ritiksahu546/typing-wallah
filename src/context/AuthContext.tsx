import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, withFirestoreTimeout } from '../services/firebase';
import { StorageService } from '../services/storageService';
import { ExamId, UserProfile } from '../types';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile;
  profile: UserProfile;
  isAuthenticated: boolean;
  isGuest: boolean;
  authLoading: boolean;
  isAdmin: boolean;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  signupWithEmail: (email: string, pass: string, name: string, targetExam: ExamId) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  continueAsGuest: (name?: string, targetExam?: ExamId) => void;
  updateTargetExam: (examId: ExamId) => Promise<void>;
}

const GUEST_STORAGE_KEY = 'typing_wallah_guest_profile';
const LEGACY_LOCAL_USERS_KEY = 'typing_wallah_local_accounts';

const DEFAULT_GUEST_PROFILE: UserProfile = {
  id: 'guest_aspirant',
  name: 'Guest Aspirant',
  email: 'guest@typingwallah.in',
  avatarSeed: 'GA',
  targetExam: 'cpct',
  joinedDate: 'Guest Session',
  isLoggedIn: false,
  isPro: false
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      // Purge any legacy plaintext local accounts storage
      localStorage.removeItem(LEGACY_LOCAL_USERS_KEY);
      const savedGuest = localStorage.getItem(GUEST_STORAGE_KEY);
      if (savedGuest) {
        const parsed = JSON.parse(savedGuest);
        // Never trust isLoggedIn or isPro from unverified storage on boot before Firebase Auth resolves
        return { ...parsed, isLoggedIn: false, isPro: false };
      }
    } catch {
      // ignore
    }
    return DEFAULT_GUEST_PROFILE;
  });

  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [isGuest, setIsGuest] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // Helper to generate initials seed
  const generateAvatarSeed = (name: string, email: string) => {
    const src = name.trim() || email.split('@')[0] || 'A';
    return src
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'TW';
  };

  /**
   * Verify admin status strictly via trusted server-side mechanisms:
   * 1. Firebase ID Token custom claims (claims.admin === true || claims.role === 'admin')
   * 2. Server-managed /admins/{uid} collection (client write-denied in firestore.rules)
   * Client-writable users/{uid}.role and unverified emails are NEVER trusted.
   */
  const verifyTrustedAdminAccess = async (fbUser: User): Promise<boolean> => {
    try {
      const tokenResult = await fbUser.getIdTokenResult();
      if (tokenResult.claims.admin === true || tokenResult.claims.role === 'admin') {
        return true;
      }
    } catch {
      // Continue to /admins/{uid} check
    }

    try {
      const adminDocRef = doc(db, 'admins', fbUser.uid);
      const adminSnap = await withFirestoreTimeout(getDoc(adminDocRef), 2500);
      if (adminSnap.exists() && adminSnap.data()?.revoked !== true) {
        return true;
      }
    } catch {
      // No admin document or offline
    }

    return false;
  };

  // Sync user profile with Firestore users collection
  const syncUserProfile = async (fbUser: User) => {
    const userRef = doc(db, 'users', fbUser.uid);
    let targetExam: ExamId = 'cpct';
    let joinedDate = 'Recent';
    let myReferralCode = StorageService.getReferralCode(fbUser.uid);

    // Clear any stale subscription cache if switching accounts, then verify for this UID
    await StorageService.syncSubscriptionWithCloud(fbUser.uid);
    const verifiedIsPro = StorageService.hasVerifiedPaidSubscription(fbUser.uid);
    const verifiedSub = StorageService.getSubscription(fbUser.uid);

    const immediateProfile: UserProfile = {
      id: fbUser.uid,
      name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Candidate',
      email: fbUser.email || '',
      avatarSeed: generateAvatarSeed(fbUser.displayName || '', fbUser.email || ''),
      photoURL: fbUser.photoURL || undefined,
      targetExam,
      joinedDate,
      isLoggedIn: true,
      isPro: verifiedIsPro,
      proExpiryDate: verifiedSub?.expiryDate || null,
      referralCode: myReferralCode
    };

    // Set state immediately from verified Firebase Auth user (default non-admin until verified)
    setUserProfile(immediateProfile);
    setIsGuest(false);
    setIsAdmin(false);

    try {
      localStorage.setItem('typing_wallah_profile', JSON.stringify(immediateProfile));
    } catch {
      // ignore
    }

    // Verify admin privileges via custom claims or server-only /admins/{uid}
    const trustedAdmin = await verifyTrustedAdminAccess(fbUser);
    setIsAdmin(trustedAdmin);

    try {
      // Register user's unique referral code against their owner UID in /referral_codes/{code}
      myReferralCode = await StorageService.registerUserReferralCode(fbUser.uid);

      const docSnap = await withFirestoreTimeout(getDoc(userRef), 3000);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.targetExam) targetExam = data.targetExam;
        if (data.joinedDate) joinedDate = data.joinedDate;
        const syncedProfile: UserProfile = {
          ...immediateProfile,
          name: data.displayName || immediateProfile.name,
          targetExam,
          joinedDate,
          isPro: StorageService.hasVerifiedPaidSubscription(fbUser.uid),
          proExpiryDate: StorageService.getSubscription(fbUser.uid)?.expiryDate || null,
          referralCode: myReferralCode
        };
        setUserProfile(syncedProfile);
        try {
          localStorage.setItem('typing_wallah_profile', JSON.stringify(syncedProfile));
        } catch {
          // ignore
        }
      } else {
        // Create initial document in users collection without privileged role/isPro fields
        await withFirestoreTimeout(
          setDoc(
            userRef,
            {
              uid: fbUser.uid,
              email: fbUser.email,
              displayName: fbUser.displayName || 'Candidate',
              photoURL: fbUser.photoURL || null,
              targetExam: 'cpct',
              referralCode: myReferralCode,
              createdAt: serverTimestamp(),
              joinedDate: new Date().toLocaleDateString('en-IN', {
                month: 'short',
                year: 'numeric'
              })
            },
            { merge: true }
          ),
          3000
        );
      }
    } catch {
      // Operating in offline / cached mode seamlessly
    }
  };

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setAuthLoading(true);
      if (fbUser) {
        setCurrentUser(fbUser);
        await syncUserProfile(fbUser);
      } else {
        StorageService.clearSubscriptionCache();
        setCurrentUser(null);
        setIsAdmin(false);
        setIsGuest(true);
        try {
          const savedGuest = localStorage.getItem(GUEST_STORAGE_KEY);
          if (savedGuest) {
            const parsed: UserProfile = JSON.parse(savedGuest);
            const safeGuest: UserProfile = {
              ...parsed,
              isLoggedIn: false,
              isPro: false,
              proExpiryDate: null
            };
            setUserProfile(safeGuest);
          } else {
            setUserProfile(DEFAULT_GUEST_PROFILE);
          }
        } catch {
          setUserProfile(DEFAULT_GUEST_PROFILE);
        }
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Email / Password Login via Firebase Authentication
  const loginWithEmail = async (email: string, pass: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const cred = await signInWithEmailAndPassword(auth, cleanEmail, pass);
    await syncUserProfile(cred.user);
  };

  // Email / Password Sign Up via Firebase Authentication
  const signupWithEmail = async (
    email: string,
    pass: string,
    displayName: string,
    targetExam: ExamId
  ) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = displayName.trim() || 'Candidate';
    const cred = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
    if (cleanName) {
      await updateProfile(cred.user, { displayName: cleanName });
    }
    const myReferralCode = await StorageService.registerUserReferralCode(cred.user.uid);
    try {
      await withFirestoreTimeout(
        setDoc(doc(db, 'users', cred.user.uid), {
          uid: cred.user.uid,
          email: cred.user.email,
          displayName: cleanName,
          targetExam,
          referralCode: myReferralCode,
          joinedDate: new Date().toLocaleDateString('en-IN', {
            month: 'short',
            year: 'numeric'
          }),
          createdAt: serverTimestamp()
        }),
        2500
      );
    } catch {
      // ignore offline firestore error
    }

    await syncUserProfile(cred.user);
  };

  // Password Reset
  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email.trim());
  };

  // Logout
  const logout = async () => {
    StorageService.clearSubscriptionCache();
    try {
      await signOut(auth);
    } catch {
      // ignore
    }
    try {
      localStorage.removeItem(GUEST_STORAGE_KEY);
    } catch {
      // ignore
    }
    setCurrentUser(null);
    setIsAdmin(false);
    setIsGuest(true);
    setUserProfile(DEFAULT_GUEST_PROFILE);
  };

  // Continue as Guest (explicitly unauthenticated)
  const continueAsGuest = (name?: string, targetExam: ExamId = 'cpct') => {
    StorageService.clearSubscriptionCache();
    const guestName = name?.trim() || 'Candidate (Guest)';
    const guest: UserProfile = {
      id: 'guest_' + Date.now(),
      name: guestName,
      email: 'guest@typingwallah.in',
      avatarSeed: generateAvatarSeed(guestName, 'guest'),
      targetExam,
      joinedDate: 'Guest Session',
      isLoggedIn: false,
      isPro: false,
      proExpiryDate: null
    };
    try {
      localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(guest));
    } catch {
      // ignore
    }
    setUserProfile(guest);
    setIsGuest(true);
  };

  // Update target exam
  const updateTargetExam = async (examId: ExamId) => {
    setUserProfile((prev) => ({ ...prev, targetExam: examId }));
    if (currentUser) {
      try {
        await withFirestoreTimeout(
          setDoc(
            doc(db, 'users', currentUser.uid),
            { targetExam: examId, updatedAt: serverTimestamp() },
            { merge: true }
          ),
          2500
        );
      } catch {
        // ignore
      }
    } else {
      try {
        const currentGuest = { ...userProfile, targetExam: examId };
        localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(currentGuest));
      } catch {
        // ignore
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        profile: userProfile,
        isAuthenticated: Boolean(currentUser),
        isGuest: !currentUser,
        authLoading,
        isAdmin: Boolean(currentUser && isAdmin),
        loginWithEmail,
        signupWithEmail,
        resetPassword,
        logout,
        continueAsGuest,
        updateTargetExam
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};

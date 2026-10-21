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
const LOCAL_USERS_STORAGE_KEY = 'typing_wallah_local_accounts';

const DEFAULT_GUEST_PROFILE: UserProfile = {
  id: 'guest_aspirant',
  name: 'Candidate (Guest)',
  email: 'guest@typingwallah.in',
  avatarSeed: 'CG',
  targetExam: 'cpct',
  joinedDate: 'Guest Session',
  isLoggedIn: false
};

// Known admin emails or admin UIDs for role verification
const ADMIN_EMAILS = [
  'admin@typingwallah.in',
  'gig.ritik546@gmail.com'
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const savedGuest = localStorage.getItem(GUEST_STORAGE_KEY);
      if (savedGuest) {
        return JSON.parse(savedGuest);
      }
    } catch {
      // ignore
    }
    return DEFAULT_GUEST_PROFILE;
  });

  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [isGuest, setIsGuest] = useState<boolean>(() => !userProfile.isLoggedIn);
  const [isAdmin, setIsAdmin] = useState<boolean>(() =>
    !!(userProfile.isLoggedIn && userProfile.email && ADMIN_EMAILS.includes(userProfile.email.toLowerCase()))
  );

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

  // Sync user profile with Firestore users collection
  const syncUserProfile = async (fbUser: User) => {
    const userRef = doc(db, 'users', fbUser.uid);
    let targetExam: ExamId = 'cpct';
    let joinedDate = 'Recent';

    const immediateProfile: UserProfile = {
      id: fbUser.uid,
      name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Candidate',
      email: fbUser.email || '',
      avatarSeed: generateAvatarSeed(fbUser.displayName || '', fbUser.email || ''),
      photoURL: fbUser.photoURL || undefined,
      targetExam,
      joinedDate,
      isLoggedIn: true
    };

    // Set state immediately from auth user so UI never blocks on Firestore latency
    setUserProfile(immediateProfile);
    setIsGuest(false);
    const emailMatch = fbUser.email && ADMIN_EMAILS.includes(fbUser.email.toLowerCase());
    setIsAdmin(!!emailMatch);

    try {
      const docSnap = await withFirestoreTimeout(getDoc(userRef), 3000);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.targetExam) targetExam = data.targetExam;
        if (data.joinedDate) joinedDate = data.joinedDate;
        setUserProfile((prev) => ({
          ...prev,
          targetExam,
          joinedDate
        }));
      } else {
        // Create initial document in users collection
        await withFirestoreTimeout(
          setDoc(userRef, {
            uid: fbUser.uid,
            email: fbUser.email,
            displayName: fbUser.displayName || 'Candidate',
            photoURL: fbUser.photoURL || null,
            targetExam: 'cpct',
            createdAt: serverTimestamp(),
            joinedDate: new Date().toLocaleDateString('en-IN', {
              month: 'short',
              year: 'numeric'
            }),
            role: ADMIN_EMAILS.includes(fbUser.email || '') ? 'admin' : 'student'
          }, { merge: true }),
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
        setCurrentUser(null);
        // Load saved local or guest profile
        try {
          const savedGuest = localStorage.getItem(GUEST_STORAGE_KEY);
          if (savedGuest) {
            const parsed: UserProfile = JSON.parse(savedGuest);
            setUserProfile(parsed);
            setIsGuest(!parsed.isLoggedIn);
            setIsAdmin(!!(parsed.isLoggedIn && parsed.email && ADMIN_EMAILS.includes(parsed.email.toLowerCase())));
          } else {
            setUserProfile(DEFAULT_GUEST_PROFILE);
            setIsGuest(true);
            setIsAdmin(false);
          }
        } catch {
          setUserProfile(DEFAULT_GUEST_PROFILE);
          setIsGuest(true);
          setIsAdmin(false);
        }
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Email / Password Login with local account fallback
  const loginWithEmail = async (email: string, pass: string) => {
    const cleanEmail = email.trim().toLowerCase();
    try {
      const cred = await signInWithEmailAndPassword(auth, cleanEmail, pass);
      await syncUserProfile(cred.user);
    } catch (err: any) {
      const code = err?.code || '';
      if (
        code === 'auth/operation-not-allowed' ||
        code === 'auth/configuration-not-found' ||
        code === 'auth/network-request-failed'
      ) {
        // Fallback to local stored account
        const raw = localStorage.getItem(LOCAL_USERS_STORAGE_KEY);
        const accounts: Record<string, { pass: string; profile: UserProfile }> = raw ? JSON.parse(raw) : {};
        const existing = accounts[cleanEmail];
        if (existing && existing.pass !== pass) {
          const wrongErr: any = new Error('Invalid email or password.');
          wrongErr.code = 'auth/wrong-password';
          throw wrongErr;
        }
        const localProfile: UserProfile = existing?.profile || {
          id: 'user_' + btoa(cleanEmail).replace(/[^a-zA-Z0-9]/g, '').slice(0, 12),
          name: cleanEmail.split('@')[0],
          email: cleanEmail,
          avatarSeed: generateAvatarSeed(cleanEmail.split('@')[0], cleanEmail),
          targetExam: 'cpct',
          joinedDate: new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
          isLoggedIn: true
        };
        localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(localProfile));
        setUserProfile(localProfile);
        setIsGuest(false);
        setIsAdmin(ADMIN_EMAILS.includes(cleanEmail));
        return;
      }
      throw err;
    }
  };

  // Email / Password Sign Up with local account fallback
  const signupWithEmail = async (
    email: string,
    pass: string,
    displayName: string,
    targetExam: ExamId
  ) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = displayName.trim() || 'Candidate';
    try {
      const cred = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
      if (cleanName) {
        await updateProfile(cred.user, { displayName: cleanName });
      }
      try {
        await withFirestoreTimeout(
          setDoc(doc(db, 'users', cred.user.uid), {
            uid: cred.user.uid,
            email: cred.user.email,
            displayName: cleanName,
            targetExam,
            joinedDate: new Date().toLocaleDateString('en-IN', {
              month: 'short',
              year: 'numeric'
            }),
            createdAt: serverTimestamp(),
            role: ADMIN_EMAILS.includes(cleanEmail) ? 'admin' : 'student'
          }),
          2500
        );
      } catch {
        // ignore offline firestore error
      }

      await syncUserProfile(cred.user);
    } catch (err: any) {
      const code = err?.code || '';
      if (
        code === 'auth/operation-not-allowed' ||
        code === 'auth/configuration-not-found' ||
        code === 'auth/network-request-failed'
      ) {
        const localProfile: UserProfile = {
          id: 'user_' + btoa(cleanEmail).replace(/[^a-zA-Z0-9]/g, '').slice(0, 12),
          name: cleanName,
          email: cleanEmail,
          avatarSeed: generateAvatarSeed(cleanName, cleanEmail),
          targetExam,
          joinedDate: new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
          isLoggedIn: true
        };
        try {
          const raw = localStorage.getItem(LOCAL_USERS_STORAGE_KEY);
          const accounts: Record<string, { pass: string; profile: UserProfile }> = raw ? JSON.parse(raw) : {};
          accounts[cleanEmail] = { pass, profile: localProfile };
          localStorage.setItem(LOCAL_USERS_STORAGE_KEY, JSON.stringify(accounts));
          localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(localProfile));
        } catch {
          // ignore
        }
        setUserProfile(localProfile);
        setIsGuest(false);
        setIsAdmin(ADMIN_EMAILS.includes(cleanEmail));
        return;
      }
      throw err;
    }
  };

  // Password Reset
  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email.trim());
  };

  // Logout
  const logout = async () => {
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
    const guestName = name?.trim() || 'Candidate (Guest)';
    const guest: UserProfile = {
      id: 'guest_' + Date.now(),
      name: guestName,
      email: 'guest@typingwallah.in',
      avatarSeed: generateAvatarSeed(guestName, 'guest'),
      targetExam,
      joinedDate: 'Guest Session',
      isLoggedIn: false
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
        isAuthenticated: !!currentUser || userProfile.isLoggedIn,
        isGuest,
        authLoading,
        isAdmin,
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

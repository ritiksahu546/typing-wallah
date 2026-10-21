import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from '../services/firebase';
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
  loginWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  continueAsGuest: (name?: string, targetExam?: ExamId) => void;
  updateTargetExam: (examId: ExamId) => Promise<void>;
}

const GUEST_STORAGE_KEY = 'typing_wallah_guest_profile';

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

  // Sync user profile with Firestore users collection
  const syncUserProfile = async (fbUser: User) => {
    const userRef = doc(db, 'users', fbUser.uid);
    let targetExam: ExamId = 'cpct';
    let joinedDate = 'Recent';

    try {
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.targetExam) targetExam = data.targetExam;
        if (data.joinedDate) joinedDate = data.joinedDate;
      } else {
        // Create initial document in users collection
        await setDoc(userRef, {
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
        }, { merge: true });
      }
    } catch (e) {
      console.warn('Firestore profile sync note (operating with auth credentials):', e);
    }

    const profile: UserProfile = {
      id: fbUser.uid,
      name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Candidate',
      email: fbUser.email || '',
      avatarSeed: generateAvatarSeed(fbUser.displayName || '', fbUser.email || ''),
      photoURL: fbUser.photoURL || undefined,
      targetExam,
      joinedDate,
      isLoggedIn: true
    };

    setUserProfile(profile);
    setIsGuest(false);

    // Check admin status
    const emailMatch = fbUser.email && ADMIN_EMAILS.includes(fbUser.email.toLowerCase());
    setIsAdmin(!!emailMatch);
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
        setIsAdmin(false);
        setIsGuest(true);
        // Load or keep guest profile
        try {
          const savedGuest = localStorage.getItem(GUEST_STORAGE_KEY);
          if (savedGuest) {
            setUserProfile(JSON.parse(savedGuest));
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

  // Email / Password Login
  const loginWithEmail = async (email: string, pass: string) => {
    const cred = await signInWithEmailAndPassword(auth, email.trim(), pass);
    await syncUserProfile(cred.user);
  };

  // Email / Password Sign Up
  const signupWithEmail = async (
    email: string,
    pass: string,
    displayName: string,
    targetExam: ExamId
  ) => {
    const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
    if (displayName.trim()) {
      await updateProfile(cred.user, { displayName: displayName.trim() });
    }
    // Save to Firestore users collection
    try {
      await setDoc(doc(db, 'users', cred.user.uid), {
        uid: cred.user.uid,
        email: cred.user.email,
        displayName: displayName.trim() || 'Candidate',
        targetExam,
        joinedDate: new Date().toLocaleDateString('en-IN', {
          month: 'short',
          year: 'numeric'
        }),
        createdAt: serverTimestamp(),
        role: ADMIN_EMAILS.includes(cred.user.email || '') ? 'admin' : 'student'
      });
    } catch (e) {
      console.warn('Initial user profile firestore write notice:', e);
    }

    await syncUserProfile(cred.user);
  };

  // Google Sign In
  const loginWithGoogle = async () => {
    const cred = await signInWithPopup(auth, googleProvider);
    await syncUserProfile(cred.user);
  };

  // Password Reset
  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email.trim());
  };

  // Logout
  const logout = async () => {
    await signOut(auth);
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
      isLoggedIn: false // Explicitly false per Phase 2 mandate
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
        await setDoc(
          doc(db, 'users', currentUser.uid),
          { targetExam: examId, updatedAt: serverTimestamp() },
          { merge: true }
        );
      } catch (e) {
        console.warn('Error updating target exam in Firestore:', e);
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
        isAuthenticated: !!currentUser,
        isGuest,
        authLoading,
        isAdmin,
        loginWithEmail,
        signupWithEmail,
        loginWithGoogle,
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

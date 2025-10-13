import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  sendEmailVerification,
  UserCredential,
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signup: (email: string, password: string) => Promise<UserCredential>;
  login: (email: string, password: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<UserCredential>;
  sendVerificationEmail: (user: User) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Sign up with email and password
  const signup = async (email: string, password: string): Promise<UserCredential> => {
    if (!auth) throw new Error('Firebase not configured');
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // Send verification email
    if (userCredential.user) {
      await sendEmailVerification(userCredential.user);
    }
    return userCredential;
  };

  // Login with email and password
  const login = async (email: string, password: string): Promise<UserCredential> => {
    if (!auth) throw new Error('Firebase not configured');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      console.log('Login successful, checking email verification...');
      console.log('User:', userCredential.user.email);
      console.log('Email verified:', userCredential.user.emailVerified);

      // Check if email is verified
      if (!userCredential.user.emailVerified) {
        console.log('Email not verified, throwing custom error');
        // Don't sign the user out - keep them authenticated so they can resend verification email
        // The ProtectedRoute component will handle blocking access to protected routes
        // Throw an error with a specific code for email verification
        const error: Error & { code?: string } = new Error('Email not verified');
        error.code = 'auth/email-not-verified';
        throw error;
      }

      console.log('Email is verified, login complete');
      return userCredential;
    } catch (error) {
      console.error('signInWithEmailAndPassword error:', error);
      // Re-throw the original error if it's from Firebase
      throw error;
    }
  };

  // Login with Google
  const loginWithGoogle = (): Promise<UserCredential> => {
    if (!auth || !googleProvider) throw new Error('Firebase not configured');
    return signInWithPopup(auth, googleProvider);
  };

  // Logout
  const logout = (): Promise<void> => {
    if (!auth) throw new Error('Firebase not configured');
    return signOut(auth);
  };

  // Send verification email
  const sendVerificationEmail = (user: User): Promise<void> => {
    return sendEmailVerification(user);
  };

  // Listen to auth state changes
  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    currentUser,
    loading,
    signup,
    login,
    logout,
    loginWithGoogle,
    sendVerificationEmail,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

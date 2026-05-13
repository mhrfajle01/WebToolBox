import { create } from 'zustand';
import { type User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';

interface AuthState {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  initialize: () => void;
  updateUserProfile: (updates: { displayName?: string; photoURL?: string }) => Promise<void>;
  sendPasswordReset: (email?: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  initialize: () => {
    onAuthStateChanged(auth, (user) => {
      set({ user, loading: false });
    });
  },
  updateUserProfile: async (updates) => {
    if (!auth.currentUser) throw new Error('No user logged in');

    const { updateProfile } = await import('firebase/auth');
    await updateProfile(auth.currentUser, updates);
    
    // Update store with the latest user object from Firebase
    set({ user: { ...auth.currentUser } });
  },
  sendPasswordReset: async (email) => {
    const targetEmail = email || auth.currentUser?.email;
    if (!targetEmail) throw new Error('No email address provided');
    
    const { sendPasswordResetEmail } = await import('firebase/auth');
    await sendPasswordResetEmail(auth, targetEmail);
  },
}));

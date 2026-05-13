import { create } from 'zustand';
import { 
  collection, 
  addDoc, 
  query, 
  getDocs, 
  serverTimestamp, 
  setDoc,
  doc,
  deleteDoc,
  orderBy,
  limit
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { CustomTool, SavedPassword } from '../types/tool';

interface ToolHistory {
  id: string;
  toolId: string;
  timestamp: Date | { toDate: () => Date } | null;
}

interface ToolStore {
  favorites: string[];
  history: ToolHistory[];
  customTools: CustomTool[];
  quickTools: string[];
  savedPasswords: SavedPassword[];
  loading: boolean;
  fetchUserData: (userId: string) => Promise<void>;
  toggleFavorite: (userId: string, toolId: string) => Promise<void>;
  toggleQuickTool: (userId: string, toolId: string) => Promise<void>;
  addToHistory: (userId: string, toolId: string) => Promise<void>;
  addCustomTool: (userId: string, tool: Omit<CustomTool, 'id' | 'createdAt'>) => Promise<void>;
  removeCustomTool: (userId: string, toolId: string) => Promise<void>;
  addSavedPassword: (userId: string, password: Omit<SavedPassword, 'id' | 'createdAt'>) => Promise<void>;
  removeSavedPassword: (userId: string, passwordId: string) => Promise<void>;
}

export const useToolStore = create<ToolStore>((set, get) => ({
  favorites: [],
  history: [],
  customTools: [],
  quickTools: [],
  savedPasswords: [],
  loading: false,

  fetchUserData: async (userId) => {
    set({ loading: true });
    try {
      // Fetch Favorites
      const favsRef = collection(db, 'users', userId, 'favorites');
      const favsSnap = await getDocs(favsRef);
      const favorites = favsSnap.docs.map(doc => doc.id);

      // Fetch Quick Tools
      const quickRef = collection(db, 'users', userId, 'quickTools');
      const quickSnap = await getDocs(quickRef);
      const quickTools = quickSnap.docs.map(doc => doc.id);

      // Fetch History
      const historyRef = collection(db, 'users', userId, 'history');
      const historyQuery = query(historyRef, orderBy('timestamp', 'desc'), limit(10));
      const historySnap = await getDocs(historyQuery);
      const history = historySnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ToolHistory[];

      // Fetch Custom Tools
      const customRef = collection(db, 'users', userId, 'customTools');
      const customSnap = await getDocs(customRef);
      const customTools = customSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CustomTool[];

      // Fetch Saved Passwords
      const passwordsRef = collection(db, 'users', userId, 'savedPasswords');
      const passwordsQuery = query(passwordsRef, orderBy('createdAt', 'desc'));
      const passwordsSnap = await getDocs(passwordsQuery);
      const savedPasswords = passwordsSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as SavedPassword[];

      set({ favorites, history, customTools, quickTools, savedPasswords, loading: false });
    } catch (error) {
      console.error('Error fetching user data:', error);
      set({ loading: false });
    }
  },

  toggleFavorite: async (userId, toolId) => {
    const { favorites } = get();
    const isFav = favorites.includes(toolId);
    const favDocRef = doc(db, 'users', userId, 'favorites', toolId);

    try {
      if (isFav) {
        await deleteDoc(favDocRef);
        set({ favorites: favorites.filter(id => id !== toolId) });
      } else {
        await setDoc(favDocRef, { timestamp: serverTimestamp() });
        set({ favorites: [...favorites, toolId] });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  },

  toggleQuickTool: async (userId, toolId) => {
    const { quickTools } = get();
    const isQuick = quickTools.includes(toolId);
    const quickDocRef = doc(db, 'users', userId, 'quickTools', toolId);

    try {
      if (isQuick) {
        await deleteDoc(quickDocRef);
        set({ quickTools: quickTools.filter(id => id !== toolId) });
      } else {
        // Limit to 4 tools for the dashboard
        if (quickTools.length >= 4) {
          throw new Error('Maximum 4 quick tools allowed');
        }
        await setDoc(quickDocRef, { timestamp: serverTimestamp() });
        set({ quickTools: [...quickTools, toolId] });
      }
    } catch (error) {
      console.error('Error toggling quick tool:', error);
      throw error;
    }
  },

  addToHistory: async (userId, toolId) => {
    try {
      const historyRef = collection(db, 'users', userId, 'history');
      await addDoc(historyRef, {
        toolId,
        timestamp: serverTimestamp()
      });
      // Refresh local history
      const { history } = get();
      // Simple optimistic update
      set({ 
        history: [{ id: `temp-${Date.now()}`, toolId, timestamp: new Date() }, ...history].slice(0, 10) 
      });
    } catch (error) {
      console.error('Error adding to history:', error);
    }
  },

  addCustomTool: async (userId, tool) => {
    try {
      const customRef = collection(db, 'users', userId, 'customTools');
      const docRef = await addDoc(customRef, {
        ...tool,
        createdAt: serverTimestamp()
      });
      
      const newTool: CustomTool = {
        id: docRef.id,
        ...tool,
        createdAt: new Date()
      };

      set(state => ({
        customTools: [...state.customTools, newTool]
      }));
    } catch (error) {
      console.error('Error adding custom tool:', error);
      throw error;
    }
  },

  removeCustomTool: async (userId, toolId) => {
    try {
      const toolDocRef = doc(db, 'users', userId, 'customTools', toolId);
      await deleteDoc(toolDocRef);
      
      set(state => ({
        customTools: state.customTools.filter(t => t.id !== toolId)
      }));
    } catch (error) {
      console.error('Error removing custom tool:', error);
    }
  },

  addSavedPassword: async (userId, password) => {
    try {
      const passwordsRef = collection(db, 'users', userId, 'savedPasswords');
      const docRef = await addDoc(passwordsRef, {
        ...password,
        createdAt: serverTimestamp()
      });
      
      const newPassword: SavedPassword = {
        id: docRef.id,
        ...password,
        createdAt: new Date()
      };

      set(state => ({
        savedPasswords: [newPassword, ...state.savedPasswords]
      }));
    } catch (error) {
      console.error('Error adding saved password:', error);
      throw error;
    }
  },

  removeSavedPassword: async (userId, passwordId) => {
    try {
      const passwordDocRef = doc(db, 'users', userId, 'savedPasswords', passwordId);
      await deleteDoc(passwordDocRef);
      
      set(state => ({
        savedPasswords: state.savedPasswords.filter(p => p.id !== passwordId)
      }));
    } catch (error) {
      console.error('Error removing saved password:', error);
    }
  }
}));

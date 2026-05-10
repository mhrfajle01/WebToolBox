import { create } from 'zustand';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  serverTimestamp, 
  setDoc,
  doc,
  deleteDoc,
  orderBy,
  limit
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { CustomTool } from '../types/tool';

interface ToolHistory {
  id: string;
  toolId: string;
  timestamp: any;
}

interface ToolStore {
  favorites: string[];
  history: ToolHistory[];
  customTools: CustomTool[];
  loading: boolean;
  fetchUserData: (userId: string) => Promise<void>;
  toggleFavorite: (userId: string, toolId: string) => Promise<void>;
  addToHistory: (userId: string, toolId: string) => Promise<void>;
  addCustomTool: (userId: string, tool: Omit<CustomTool, 'id' | 'createdAt'>) => Promise<void>;
  removeCustomTool: (userId: string, toolId: string) => Promise<void>;
}

export const useToolStore = create<ToolStore>((set, get) => ({
  favorites: [],
  history: [],
  customTools: [],
  loading: false,

  fetchUserData: async (userId) => {
    set({ loading: true });
    try {
      // Fetch Favorites
      const favsRef = collection(db, 'users', userId, 'favorites');
      const favsSnap = await getDocs(favsRef);
      const favorites = favsSnap.docs.map(doc => doc.id);

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

      set({ favorites, history, customTools, loading: false });
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
  }
}));

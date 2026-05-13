import { create } from 'zustand';
import { 
  collection, 
  addDoc, 
  getDocs, 
  serverTimestamp, 
  setDoc,
  doc,
  deleteDoc,
  updateDoc,
  getDoc
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Habit, HabitSession } from '../types/habit';

interface HabitStore {
  habits: Habit[];
  session: HabitSession | null;
  loading: boolean;
  fetchHabits: (userId: string) => Promise<void>;
  addHabit: (userId: string, habit: Omit<Habit, 'id' | 'streak' | 'history' | 'lastReset' | 'startDate' | 'currentCount'>) => Promise<void>;
  removeHabit: (userId: string, habitId: string) => Promise<void>;
  incrementGoodHabit: (userId: string, habitId: string) => Promise<void>;
  resetBadHabit: (userId: string, habitId: string) => Promise<void>;
  dailySignIn: (userId: string) => Promise<void>;
}

export const useHabitStore = create<HabitStore>((set, get) => ({
  habits: [],
  session: null,
  loading: false,

  fetchHabits: async (userId) => {
    set({ loading: true });
    try {
      const habitsRef = collection(db, 'users', userId, 'habits');
      const habitsSnap = await getDocs(habitsRef);
      const habits = habitsSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Habit[];

      const sessionRef = doc(db, 'users', userId, 'habitSession', 'current');
      const sessionSnap = await getDoc(sessionRef);
      let session: HabitSession | null = null;
      if (sessionSnap.exists()) {
        session = sessionSnap.data() as HabitSession;
      }

      set({ habits, session, loading: false });
    } catch (error) {
      console.error('Error fetching habits:', error);
      set({ loading: false });
    }
  },

  addHabit: async (userId, habitData) => {
    try {
      const habitsRef = collection(db, 'users', userId, 'habits');
      const newHabit = {
        ...habitData,
        streak: 0,
        history: {},
        lastReset: serverTimestamp(),
        startDate: serverTimestamp(),
        currentCount: 0
      };
      const docRef = await addDoc(habitsRef, newHabit);
      
      set(state => ({
        habits: [...state.habits, { 
          ...newHabit, 
          id: docRef.id,
          lastReset: new Date(),
          startDate: new Date()
        } as unknown as Habit]
      }));
    } catch (error) {
      console.error('Error adding habit:', error);
    }
  },

  removeHabit: async (userId, habitId) => {
    try {
      await deleteDoc(doc(db, 'users', userId, 'habits', habitId));
      set(state => ({
        habits: state.habits.filter(h => h.id !== habitId)
      }));
    } catch (error) {
      console.error('Error removing habit:', error);
    }
  },

  incrementGoodHabit: async (userId, habitId) => {
    const { habits } = get();
    const habit = habits.find(h => h.id === habitId);
    if (!habit || habit.type !== 'good') return;

    const today = new Date().toISOString().split('T')[0];
    const newCount = (habit.currentCount || 0) + 1;
    const newHistory = { ...habit.history, [today]: newCount };

    try {
      const habitRef = doc(db, 'users', userId, 'habits', habitId);
      await updateDoc(habitRef, {
        currentCount: newCount,
        history: newHistory
      });

      set(state => ({
        habits: state.habits.map(h => h.id === habitId ? { ...h, currentCount: newCount, history: newHistory } : h)
      }));
    } catch (error) {
      console.error('Error incrementing habit:', error);
    }
  },

  resetBadHabit: async (userId, habitId) => {
    try {
      const habitRef = doc(db, 'users', userId, 'habits', habitId);
      await updateDoc(habitRef, {
        lastRelapse: serverTimestamp(),
        streak: 0
      });

      set(state => ({
        habits: state.habits.map(h => h.id === habitId ? { ...h, lastRelapse: new Date(), streak: 0 } : h)
      }));
    } catch (error) {
      console.error('Error resetting bad habit:', error);
    }
  },

  dailySignIn: async (userId) => {
    const { session } = get();
    const today = new Date().toISOString().split('T')[0];
    
    if (session?.signInHistory.includes(today)) return;

    const newHistory = [...(session?.signInHistory || []), today];
    const lastSignIn = session?.lastSignIn ? (session.lastSignIn instanceof Date ? session.lastSignIn : (session.lastSignIn as { toDate: () => Date }).toDate()) : null;
    
    let newStreak = 1;
    if (lastSignIn) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      if (session?.signInHistory.includes(yesterdayStr)) {
        newStreak = (session?.signInStreak || 0) + 1;
      }
    }

    const sessionData: HabitSession = {
      lastSignIn: serverTimestamp() as unknown as Date,
      signInStreak: newStreak,
      signInHistory: newHistory
    };

    try {
      const sessionRef = doc(db, 'users', userId, 'habitSession', 'current');
      await setDoc(sessionRef, sessionData);

      set({ session: { ...sessionData, lastSignIn: new Date() } });
    } catch (error) {
      console.error('Error signing in:', error);
    }
  }
}));

import React, { useState, useEffect } from 'react';
import styles from './HabitTracker.module.css';
import { 
  Calendar as CalendarIcon, 
  Plus, 
  RotateCcw,
  Trash2,
  LayoutDashboard,
  BarChart3,
  ChevronRight,
  Activity,
  Award,
  Zap,
  Menu,
  X
} from 'lucide-react';
import { useAuthStore } from '../../../store/useAuthStore';
import { useHabitStore } from '../../../store/useHabitStore';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

type View = 'dashboard' | 'habits' | 'analytics' | 'calendar';

const HabitTracker: React.FC = () => {
  const { user } = useAuthStore();
  const { 
    habits, 
    session, 
    fetchHabits, 
    addHabit, 
    removeHabit, 
    incrementGoodHabit, 
    resetBadHabit,
    dailySignIn 
  } = useHabitStore();

  const [activeView, setActiveView] = useState<View>('dashboard');
  const [isAdding, setIsAdding] = useState(false);
  const [newHabit, setNewHabit] = useState({ name: '', type: 'good' as 'good' | 'bad', goal: 1 });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchHabits(user.uid);
    }
  }, [user, fetchHabits]);

  const handleSignIn = async () => {
    if (!user) return;
    await dailySignIn(user.uid);
    window.dispatchEvent(new CustomEvent('success-burst', { 
      detail: { x: window.innerWidth / 2, y: window.innerHeight / 2 } 
    }));
    toast.success('Sign-in achieved! Streak extended.');
  };

  const handleAddHabit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newHabit.name) return;
    await addHabit(user.uid, newHabit);
    setNewHabit({ name: '', type: 'good', goal: 1 });
    setIsAdding(false);
    toast.success('New habit forged in the fire!');
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const navigateTo = (view: View) => {
    setActiveView(view);
    setIsSidebarOpen(false);
  };

  const renderDashboard = () => (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={styles.viewContent}
    >
      <div className={styles.premiumHero}>
        <div className={styles.heroContent}>
          <div className={styles.streakBadge}>
            <Zap size={14} fill="currentColor" />
            <span>{session?.signInStreak || 0} DAY STREAK</span>
          </div>
          <h2>Hello, {user?.displayName?.split(' ')[0] || 'Warrior'}</h2>
          <p>Ready to level up your discipline today?</p>
          <button 
            onClick={handleSignIn}
            className={`${styles.actionBtn} ${session?.signInHistory.includes(formatDate(new Date())) ? styles.isDone : ''}`}
            disabled={session?.signInHistory.includes(formatDate(new Date()))}
          >
            {session?.signInHistory.includes(formatDate(new Date())) ? 'SIGNED IN TODAY' : 'CHECK-IN NOW'}
          </button>
        </div>
        <div className={styles.heroGlow} />
      </div>

      <div className={styles.statsRow}>
        <div className={styles.miniStat}>
          <Award color="#FFD700" size={20} />
          <div>
            <strong>{habits.filter(h => h.type === 'good' && h.currentCount >= (h.goal || 1)).length}</strong>
            <span>Goals Met</span>
          </div>
        </div>
        <div className={styles.miniStat}>
          <Activity color="#8b5cf6" size={20} />
          <div>
            <strong>{habits.length}</strong>
            <span>Active</span>
          </div>
        </div>
      </div>

      <div className={styles.focusSection}>
        <div className={styles.sectionTitle}>
          <h3>Daily Focus</h3>
          <button onClick={() => navigateTo('habits')}>View All <ChevronRight size={14} /></button>
        </div>
        <div className={styles.focusList}>
          {habits.slice(0, 4).map(habit => (
            <motion.div 
              key={habit.id} 
              className={styles.focusItem}
              whileHover={{ x: 5 }}
            >
              <div className={styles.focusInfo}>
                <div className={styles.statusDot} data-type={habit.type} />
                <span>{habit.name}</span>
              </div>
              <div className={styles.focusValue}>
                {habit.type === 'good' ? (
                  <div className={styles.miniProgress}>
                    <div className={styles.miniProgressFill} style={{ width: `${Math.min(((habit.currentCount || 0) / (habit.goal || 1)) * 100, 100)}%` }} />
                  </div>
                ) : (
                  <span className={styles.statusBadge}>CLEAN</span>
                )}
              </div>
            </motion.div>
          ))}
          {habits.length === 0 && <p className={styles.emptyText}>No habits active. Start your journey.</p>}
        </div>
      </div>
    </motion.div>
  );

  const renderHabits = () => (
    <motion.div 
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      className={styles.viewContent}
    >
      <div className={styles.headerArea}>
        <h2>My Habits</h2>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={styles.plusBtn} 
          onClick={() => setIsAdding(true)}
        >
          <Plus size={20} />
        </motion.button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.form 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onSubmit={handleAddHabit} 
            className={styles.compactForm}
          >
            <input 
              type="text" 
              placeholder="Habit name..." 
              value={newHabit.name}
              onChange={e => setNewHabit({ ...newHabit, name: e.target.value })}
              required
            />
            <div className={styles.choiceGroup}>
              <button 
                type="button" 
                className={newHabit.type === 'good' ? styles.picked : ''}
                onClick={() => setNewHabit({ ...newHabit, type: 'good' })}
              >
                GOOD
              </button>
              <button 
                type="button" 
                className={newHabit.type === 'bad' ? styles.picked : ''}
                onClick={() => setNewHabit({ ...newHabit, type: 'bad' })}
              >
                BAD
              </button>
            </div>
            {newHabit.type === 'good' && (
              <div className={styles.inputRow}>
                <label>Daily Goal:</label>
                <input 
                  type="number" 
                  min="1"
                  value={newHabit.goal}
                  onChange={e => setNewHabit({ ...newHabit, goal: parseInt(e.target.value) })}
                />
              </div>
            )}
            <div className={styles.formFooter}>
              <button type="button" onClick={() => setIsAdding(false)}>Cancel</button>
              <button type="submit" className={styles.submitBtn}>CREATE</button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <div className={styles.habitStack}>
        {habits.map(habit => (
          <motion.div 
            layout
            key={habit.id} 
            className={styles.premiumCard}
          >
            <div className={styles.cardMain}>
              <div className={styles.cardHeader}>
                <h3>{habit.name}</h3>
                <span className={styles.typeTag} data-type={habit.type}>{habit.type}</span>
              </div>
              {habit.type === 'good' ? (
                <div className={styles.progressSection}>
                  <div className={styles.ringContainer}>
                    <svg viewBox="0 0 36 36" className={styles.ring}>
                      <path className={styles.ringTrack} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      <motion.path 
                        className={styles.ringFill}
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: Math.min((habit.currentCount || 0) / (habit.goal || 1), 1) }}
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                      />
                    </svg>
                    <span>{habit.currentCount}</span>
                  </div>
                  <div className={styles.progressInfo}>
                    <span>Target: {habit.goal}</span>
                    <p>{Math.round(Math.min(((habit.currentCount || 0) / (habit.goal || 1)) * 100, 100))}% complete</p>
                  </div>
                </div>
              ) : (
                <div className={styles.badHabitInfo}>
                  <p>CLEAN STREAK</p>
                  <strong>{habit.lastRelapse ? Math.floor((new Date().getTime() - new Date(habit.lastRelapse instanceof Date ? habit.lastRelapse : (habit.lastRelapse as { toDate: () => Date }).toDate()).getTime()) / (1000 * 3600 * 24)) : 0} DAYS</strong>
                </div>
              )}
            </div>
            <div className={styles.cardActions}>
              {habit.type === 'good' ? (
                <motion.button 
                  whileTap={{ scale: 0.9 }}
                  className={styles.incBtn}
                  onClick={() => user && incrementGoodHabit(user.uid, habit.id)}
                >
                  <Plus size={18} />
                </motion.button>
              ) : (
                <motion.button 
                  whileTap={{ rotate: 180 }}
                  className={styles.resetBtn}
                  onClick={() => user && resetBadHabit(user.uid, habit.id)}
                >
                  <RotateCcw size={18} />
                </motion.button>
              )}
              <button onClick={() => user && removeHabit(user.uid, habit.id)} className={styles.trashBtn}>
                <Trash2 size={16} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  const renderCalendar = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    
    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={styles.viewContent}
      >
        <div className={styles.calendarPaper}>
          <div className={styles.calHeaderArea}>
            <h2>{new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(now)}</h2>
          </div>
          <div className={styles.modernCalGrid}>
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
              <div key={d} className={styles.calLabel}>{d}</div>
            ))}
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} className={styles.calSlotEmpty} />
            ))}
            {days.map(day => {
              const dStr = formatDate(day);
              const hasData = session?.signInHistory.includes(dStr);
              const isToday = dStr === formatDate(new Date());
              return (
                <div 
                  key={dStr}
                  className={`${styles.calSlot} ${hasData ? styles.activeSlot : ''} ${isToday ? styles.todaySlot : ''}`}
                >
                  {day.getDate()}
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    );
  };

  const renderAnalytics = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={styles.viewContent}
    >
      <div className={styles.insightsCard}>
        <div className={styles.insightsHeader}>
          <BarChart3 size={32} color="#8b5cf6" />
          <h2>Journey Insights</h2>
        </div>
        <p>Your performance metrics are being analyzed. Keep consistency to unlock deeper data.</p>
        <div className={styles.insightsStats}>
          <div className={styles.insightBox}>
            <span>BEST STREAK</span>
            <strong>{session?.signInStreak || 0}</strong>
          </div>
          <div className={styles.insightBox}>
            <span>TOTAL HABITS</span>
            <strong>{habits.length}</strong>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className={styles.habitForge}>
      {/* Mobile Header with Sidebar Toggle */}
      <header className={styles.appHeader}>
        <button className={styles.menuBtn} onClick={() => setIsSidebarOpen(true)}>
          <Menu size={24} />
        </button>
        <h1>HabitForge</h1>
        <div style={{ width: 24 }} /> {/* Spacer */}
      </header>

      {/* Sidebar Navigation */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={styles.sidebarOverlay}
              onClick={() => setIsSidebarOpen(false)}
            />
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={styles.sidebar}
            >
              <div className={styles.sidebarHeader}>
                <div className={styles.sidebarLogo}>
                  <Zap size={24} color="#8b5cf6" fill="#8b5cf6" />
                  <span>HabitForge</span>
                </div>
                <button onClick={() => setIsSidebarOpen(false)}>
                  <X size={20} />
                </button>
              </div>

              <nav className={styles.sidebarNav}>
                <button className={activeView === 'dashboard' ? styles.sidebarActive : ''} onClick={() => navigateTo('dashboard')}>
                  <LayoutDashboard size={20} />
                  <span>Dashboard</span>
                </button>
                <button className={activeView === 'habits' ? styles.sidebarActive : ''} onClick={() => navigateTo('habits')}>
                  <Plus size={20} />
                  <span>Habits</span>
                </button>
                <button className={activeView === 'calendar' ? styles.sidebarActive : ''} onClick={() => navigateTo('calendar')}>
                  <CalendarIcon size={20} />
                  <span>Log</span>
                </button>
                <button className={activeView === 'analytics' ? styles.sidebarActive : ''} onClick={() => navigateTo('analytics')}>
                  <BarChart3 size={20} />
                  <span>Analytics</span>
                </button>
              </nav>

              <div className={styles.sidebarFooter}>
                <div className={styles.footerStat}>
                  <span>Streak</span>
                  <strong>{session?.signInStreak || 0} Days</strong>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className={styles.viewport}>
        <AnimatePresence mode="wait">
          {activeView === 'dashboard' && renderDashboard()}
          {activeView === 'habits' && renderHabits()}
          {activeView === 'calendar' && renderCalendar()}
          {activeView === 'analytics' && renderAnalytics()}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default HabitTracker;

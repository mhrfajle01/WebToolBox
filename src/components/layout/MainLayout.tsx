import React, { useState, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import styles from './MainLayout.module.css';
import { useAuthStore } from '../../store/useAuthStore';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Wrench, 
  History, 
  Star, 
  Settings, 
  LogOut,
  Menu,
  X,
  Search,
  Moon,
  Sun,
  ChevronRight,
  User as UserIcon,
  Monitor
} from 'lucide-react';
import { auth } from '../../lib/firebase';
import { signOut } from 'firebase/auth';
import { useSound } from '../../hooks/useSound';
import { motion, AnimatePresence } from 'framer-motion';

import CommandPalette from '../ui/CommandPalette';

interface MainLayoutProps {
  children: ReactNode;
  isFullBleed?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, isFullBleed = false }) => {
  const { user } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const { play } = useSound();
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1024 && !isFullBleed);
  const [prevPathname, setPrevPathname] = useState(location.pathname);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [bursts, setBursts] = useState<{ id: number; x: number; y: number }[]>([]);

  // Auto-close sidebar on mobile when navigating
  if (location.pathname !== prevPathname) {
    setPrevPathname(location.pathname);
    if (window.innerWidth <= 1024) {
      setIsSidebarOpen(false);
    }
  }

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleBurst = (e: Event) => {
      const customEvent = e as CustomEvent<{ x: number; y: number }>;
      const id = Date.now();
      const x = customEvent.detail?.x ?? window.innerWidth / 2;
      const y = customEvent.detail?.y ?? window.innerHeight / 2;
      setBursts(prev => [...prev, { id, x, y }]);
      setTimeout(() => {
        setBursts(prev => prev.filter(b => b.id !== id));
      }, 1000);
    };

    window.addEventListener('success-burst', handleBurst);
    return () => window.removeEventListener('success-burst', handleBurst);
  }, []);

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme') as 'light' | 'dark';
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsPaletteOpen(prev => {
          if (!prev) play('palette');
          return !prev;
        });
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        setIsFocusMode(prev => !prev);
        play('switch');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [play]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }

      if (
        window.innerWidth <= 1024 && 
        isSidebarOpen && 
        sidebarRef.current && 
        !sidebarRef.current.contains(event.target as Node)
      ) {
        // Only close if we didn't click the menu toggle button
        const toggleBtn = document.querySelector(`.${styles.menuBtn}`);
        if (!toggleBtn?.contains(event.target as Node)) {
          setIsSidebarOpen(false);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSidebarOpen]);

  const toggleSidebar = () => {
    play('click');
    setIsSidebarOpen(prev => !prev);
  };

  const toggleTheme = () => {
    play('switch');
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const toggleFocusMode = () => {
    play('switch');
    setIsFocusMode(prev => !prev);
  };

  const handleLogout = async () => {
    play('click');
    await signOut(auth);
    navigate('/login');
  };

  const bottomNavItems = [
    { path: '/', icon: LayoutDashboard, label: 'Home' },
    { path: '/tools', icon: Wrench, label: 'Tools' },
    { path: '/favorites', icon: Star, label: 'Favorites' },
    { path: '/history', icon: History, label: 'History' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className={`${styles.layout} ${isFocusMode ? styles.focusMode : ''}`}>
      {/* Sidebar Overlay (Mobile only) */}
      <AnimatePresence>
        {isSidebarOpen && window.innerWidth <= 1024 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className={styles.overlay}
          />
        )}
      </AnimatePresence>

      {/* Success Bursts */}
      <AnimatePresence>
        {bursts.map(burst => (
          <motion.div
            key={burst.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              left: burst.x,
              top: burst.y,
              zIndex: 9999,
              pointerEvents: 'none'
            }}
          >
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ x: 0, y: 0, scale: 0 }}
                animate={{ 
                  x: Math.cos(i * 30 * (Math.PI / 180)) * 60,
                  y: Math.sin(i * 30 * (Math.PI / 180)) * 60,
                  scale: 1,
                  opacity: 0
                }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                style={{
                  position: 'absolute',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: 'var(--accent-primary)',
                  boxShadow: '0 0 10px var(--accent-primary)'
                }}
              />
            ))}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Sidebar */}
      <aside 
        ref={sidebarRef}
        className={`${styles.sidebar} ${isSidebarOpen ? styles.open : styles.closed} glass`}
      >
        <div className={styles.sidebarHeader}>
          <Link to="/" className={styles.logo} onClick={() => play('click')}>
            <motion.div
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.5 }}
            >
              <Wrench size={24} color="var(--accent-primary)" />
            </motion.div>
            <span>WebToolBox</span>
          </Link>
          <button className={styles.closeBtn} onClick={toggleSidebar}>
            <X size={20} />
          </button>
        </div>

        <nav className={styles.nav}>
          <div className={styles.navGroup}>
            <label>Overview</label>
            <motion.div key="overview" whileHover={{ x: 5 }}>
              <Link to="/" className={`${styles.navLink} ${isActive('/') ? styles.active : ''}`} onClick={() => play('click')}>
                <motion.div whileHover={{ scale: 1.2, rotate: 5 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                  <LayoutDashboard size={20} />
                </motion.div>
                <span>Dashboard</span>
                {isActive('/') && <ChevronRight size={14} className={styles.activeIndicator} />}
              </Link>
            </motion.div>
            <motion.div key="tools" whileHover={{ x: 5 }}>
              <Link to="/tools" className={`${styles.navLink} ${isActive('/tools') ? styles.active : ''}`} onClick={() => play('click')}>
                <motion.div whileHover={{ scale: 1.2, rotate: 5 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                  <Wrench size={20} />
                </motion.div>
                <span>Tools</span>
                {isActive('/tools') && <ChevronRight size={14} className={styles.activeIndicator} />}
              </Link>
            </motion.div>
          </div>

          <div className={styles.navGroup}>
            <label>Personal</label>
            <motion.div key="favorites" whileHover={{ x: 5 }}>
              <Link to="/favorites" className={`${styles.navLink} ${isActive('/favorites') ? styles.active : ''}`} onClick={() => play('click')}>
                <motion.div whileHover={{ scale: 1.2, rotate: 5 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                  <Star size={20} />
                </motion.div>
                <span>Favorites</span>
                {isActive('/favorites') && <ChevronRight size={14} className={styles.activeIndicator} />}
              </Link>
            </motion.div>
            <motion.div key="history" whileHover={{ x: 5 }}>
              <Link to="/history" className={`${styles.navLink} ${isActive('/history') ? styles.active : ''}`} onClick={() => play('click')}>
                <motion.div whileHover={{ scale: 1.2, rotate: 5 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                  <History size={20} />
                </motion.div>
                <span>History</span>
                {isActive('/history') && <ChevronRight size={14} className={styles.activeIndicator} />}
              </Link>
            </motion.div>
          </div>
        </nav>

        <div className={styles.sidebarFooter}>
          <Link to="/settings" className={`${styles.navLink} ${isActive('/settings') ? styles.active : ''}`} onClick={() => play('click')}>
            <motion.div whileHover={{ scale: 1.2, rotate: 45 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
              <Settings size={20} />
            </motion.div>
            <span>Settings</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={styles.main}>
        {/* Top Navbar */}
        {!isFullBleed && (
          <header className={`${styles.header} glass`}>
            <div className={styles.headerLeft}>
              {!isSidebarOpen && (
                <button className={styles.menuBtn} onClick={toggleSidebar}>
                  <Menu size={24} />
                </button>
              )}
            <div className={styles.searchBar} onClick={() => setIsPaletteOpen(true)} style={{ cursor: 'text' }}>
              <Search size={18} />
              <input 
                type="text" 
                placeholder={window.innerWidth <= 768 ? "Search..." : "Search tools (⌘+K)"} 
                readOnly 
              />
            </div>
          </div>

            <div className={styles.headerRight}>
              <button 
                className={`${styles.iconBtn} ${styles.hideOnMobile} ${isFocusMode ? styles.activeFocus : ''}`} 
                onClick={toggleFocusMode}
                title="Toggle Focus Mode (⌘+F)"
              >
                <motion.div animate={isFocusMode ? { scale: [1, 1.2, 1] } : {}}>
                  <Monitor size={20} />
                </motion.div>
              </button>
              <button className={styles.iconBtn} onClick={toggleTheme}>
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </button>
              
              {user ? (
                <div className={styles.userContainer} ref={userMenuRef}>
                  <button className={styles.avatarBtn} onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}>
                    {!avatarError ? (
                      <img 
                        src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email || 'User')}&background=random`} 
                        alt="User" 
                        onError={() => setAvatarError(true)}
                      />
                    ) : (
                      <UserIcon size={20} className={styles.fallbackIcon} />
                    )}
                  </button>
                  
                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className={`${styles.userMenu} glass`}
                      >
                        <div className={styles.menuHeader}>
                          <span className={styles.userName}>{user.displayName || 'User'}</span>
                          <span className={styles.userEmail}>{user.email}</span>
                        </div>
                        <div className={styles.menuDivider} />
                        <button className={styles.menuItem} onClick={() => { navigate('/profile'); setIsUserMenuOpen(false); play('click'); }}>
                          <UserIcon size={16} /> <span>Profile</span>
                        </button>
                        <button className={styles.menuItem} onClick={() => { navigate('/settings'); setIsUserMenuOpen(false); play('click'); }}>
                          <Settings size={16} /> <span>Settings</span>
                        </button>
                        <div className={styles.menuDivider} />
                        <button className={`${styles.menuItem} ${styles.logoutItem}`} onClick={handleLogout}>
                          <LogOut size={16} /> <span>Sign Out</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link to="/login" className={styles.loginBtn}>Login</Link>
              )}
            </div>
          </header>
        )}

        <section className={`${styles.content} ${isFullBleed ? styles.fullBleed : ''} ${!isFullBleed ? styles.hasBottomNav : ''}`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className={styles.pageWrapper}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </section>

        {/* Bottom Navigation for Mobile */}
        {!isFullBleed && (
          <nav className={`${styles.bottomNav} glass`}>
            {bottomNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`${styles.bottomNavItem} ${isActive(item.path) ? styles.bottomNavActive : ''}`}
                onClick={() => play('click')}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        )}

        <CommandPalette 
          isOpen={isPaletteOpen} 
          onClose={() => setIsPaletteOpen(false)} 
        />
      </main>
    </div>
  );
};

export default MainLayout;

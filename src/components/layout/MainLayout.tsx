import React, { ReactNode, useState, useEffect, useRef } from 'react';
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
  User as UserIcon
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
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);

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

  useEffect(() => {
    // Auto-close sidebar on mobile when navigating
    if (window.innerWidth <= 1024) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname]);

  const toggleSidebar = () => {
    play('click');
    setIsSidebarOpen(prev => !prev);
  };

  const toggleTheme = () => {
    play('switch');
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleLogout = async () => {
    play('click');
    await signOut(auth);
    navigate('/login');
  };

  return (
    <div className={styles.layout}>
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

      {/* Sidebar */}
      <aside 
        ref={sidebarRef}
        className={`${styles.sidebar} ${isSidebarOpen ? styles.open : styles.closed} glass`}
      >
        <div className={styles.sidebarHeader}>
          <Link to="/" className={styles.logo} onClick={() => play('click')}>
            <Wrench size={24} color="var(--accent-primary)" />
            <span>WebToolBox</span>
          </Link>
          <button className={styles.closeBtn} onClick={toggleSidebar}>
            <X size={20} />
          </button>
        </div>

        <nav className={styles.nav}>
          <div className={styles.navGroup}>
            <label>Overview</label>
            <Link to="/" className={`${styles.navLink} ${isActive('/') ? styles.active : ''}`} onClick={() => play('click')}>
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
              {isActive('/') && <ChevronRight size={14} className={styles.activeIndicator} />}
            </Link>
            <Link to="/tools" className={`${styles.navLink} ${isActive('/tools') ? styles.active : ''}`} onClick={() => play('click')}>
              <Wrench size={20} />
              <span>Tools</span>
              {isActive('/tools') && <ChevronRight size={14} className={styles.activeIndicator} />}
            </Link>
          </div>

          <div className={styles.navGroup}>
            <label>Personal</label>
            <Link to="/favorites" className={`${styles.navLink} ${isActive('/favorites') ? styles.active : ''}`} onClick={() => play('click')}>
              <Star size={20} />
              <span>Favorites</span>
              {isActive('/favorites') && <ChevronRight size={14} className={styles.activeIndicator} />}
            </Link>
            <Link to="/history" className={`${styles.navLink} ${isActive('/history') ? styles.active : ''}`} onClick={() => play('click')}>
              <History size={20} />
              <span>History</span>
              {isActive('/history') && <ChevronRight size={14} className={styles.activeIndicator} />}
            </Link>
          </div>
        </nav>

        <div className={styles.sidebarFooter}>
          <Link to="/settings" className={`${styles.navLink} ${isActive('/settings') ? styles.active : ''}`} onClick={() => play('click')}>
            <Settings size={20} />
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
              <button className={styles.iconBtn} onClick={toggleTheme}>
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </button>
              
              {user ? (
                <div className={styles.userContainer} ref={userMenuRef}>
                  <button className={styles.avatarBtn} onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}>
                    <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.email}`} alt="User" />
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

        <section className={`${styles.content} ${isFullBleed ? styles.fullBleed : ''}`}>
          {children}
        </section>

        <CommandPalette 
          isOpen={isPaletteOpen} 
          onClose={() => setIsPaletteOpen(false)} 
        />
      </main>
    </div>
  );
};

export default MainLayout;

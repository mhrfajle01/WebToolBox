import React, { useEffect, useMemo } from 'react';
import styles from './Dashboard.module.css';
import { 
  Zap, 
  Clock, 
  Star, 
  ArrowRight,
  ExternalLink,
  Settings as SettingsIcon,
  LayoutGrid
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useToolStore } from '../store/useToolStore';
import { useNavigate } from 'react-router-dom';
import { toolRegistry } from '../lib/toolRegistry';
import { motion, type Variants } from 'framer-motion';

import { useSound } from '../hooks/useSound';

import MainLayout from '../components/layout/MainLayout';
import Skeleton from '../components/ui/Skeleton';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 300, damping: 24 }
  }
};

const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { favorites, history, customTools, quickTools, loading, fetchUserData } = useToolStore();
  const navigate = useNavigate();
  const { play } = useSound();

  useEffect(() => {
    if (user) {
      fetchUserData(user.uid);
    }
  }, [user, fetchUserData]);

  // Merge built-in and custom tools for lookup
  const allTools = useMemo(() => {
    const builtIn = toolRegistry.map(t => ({ ...t, isCustom: false }));
    const custom = customTools.map(t => ({
      id: t.id,
      name: t.name,
      category: 'Personal',
      icon: t.icon,
      url: t.url,
      isCustom: true
    }));
    return [...builtIn, ...custom];
  }, [customTools]);

  // Map history IDs to tool items
  const recentTools = useMemo(() => {
    return history.map(h => {
      const tool = allTools.find(t => t.id === h.toolId);
      return tool ? { ...tool, historyId: h.id } : null;
    }).filter(Boolean).slice(0, 5);
  }, [history, allTools]);

  // Map quick tool IDs to tool items
  const selectedQuickTools = useMemo(() => {
    return quickTools.map(id => {
      return allTools.find(t => t.id === id);
    }).filter(Boolean);
  }, [quickTools, allTools]);

  const handleLaunch = (tool: { id: string, isCustom: boolean }) => {
    play('click');
    navigate(`/tools/${tool.id}`);
  };

  const renderStatsSkeletons = () => (
    <div className={styles.statsGrid}>
      {[1, 2, 3].map((i) => (
        <div key={i} className={`${styles.statCard} glass`}>
          <Skeleton width="48px" height="48px" borderRadius="12px" />
          <div className={styles.statInfo} style={{ width: '100%' }}>
            <Skeleton width="60%" height="16px" />
            <Skeleton width="40%" height="24px" style={{ marginTop: '8px' }} />
          </div>
        </div>
      ))}
    </div>
  );

  const renderRecentSkeletons = () => (
    <div className={styles.list}>
      {[1, 2, 3].map((i) => (
        <div key={i} className={styles.listItem}>
          <Skeleton width="40px" height="40px" borderRadius="10px" />
          <div className={styles.toolDetails} style={{ flex: 1, marginLeft: '12px' }}>
            <Skeleton width="120px" height="18px" />
            <Skeleton width="80px" height="14px" style={{ marginTop: '6px' }} />
          </div>
          <Skeleton width="70px" height="32px" borderRadius="8px" />
        </div>
      ))}
    </div>
  );

  const renderQuickSkeletons = () => (
    <div className={styles.quickGrid}>
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className={`${styles.quickCard} glass`}>
          <Skeleton width="32px" height="32px" borderRadius="10px" className={styles.quickIcon} />
          <div className={styles.quickInfo} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Skeleton width="90%" height="12px" style={{ marginTop: '4px' }} />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <MainLayout>
      <div className={styles.dashboard}>
        <header className={styles.header}>
          <div className={styles.headerDecor} />
          <motion.h1 
            className={styles.welcomeText}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            {loading ? <Skeleton width="300px" height="48px" /> : `Welcome back, ${user?.displayName || user?.email?.split('@')[0] || 'User'}! 👋`}
          </motion.h1>
          <motion.p
            className={styles.subtitle}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {loading ? <Skeleton width="250px" height="20px" style={{ marginTop: '8px' }} /> : 'Your premium utility suite is ready for action.'}
          </motion.p>
          
          <motion.div 
            className={styles.headerLine}
            initial={{ width: 0 }}
            animate={{ width: '60px' }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </header>

        {loading ? renderStatsSkeletons() : (
          <motion.div 
            className={styles.statsGrid}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className={`${styles.statCard} glass`}>
              <div className={styles.statIcon} style={{ background: '#dbeafe', color: '#3b82f6' }}>
                <Zap size={24} />
              </div>
              <div className={styles.statInfo}>
                <h3>Total Tools</h3>
                <p>{toolRegistry.length + customTools.length}</p>
              </div>
            </motion.div>
            <motion.div variants={itemVariants} className={`${styles.statCard} glass`}>
              <div className={styles.statIcon} style={{ background: '#fef3c7', color: '#f59e0b' }}>
                <Star size={24} />
              </div>
              <div className={styles.statInfo}>
                <h3>Favorites</h3>
                <p>{favorites.length}</p>
              </div>
            </motion.div>
            <motion.div variants={itemVariants} className={`${styles.statCard} glass`}>
              <div className={styles.statIcon} style={{ background: '#dcfce7', color: '#22c55e' }}>
                <Clock size={24} />
              </div>
              <div className={styles.statInfo}>
                <h3>Usage Sessions</h3>
                <p>{history.length}</p>
              </div>
            </motion.div>
          </motion.div>
        )}

        <div className={styles.mainGrid}>
          <motion.section 
            className={`${styles.section} glass`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className={styles.sectionHeader}>
              <h2>{loading ? <Skeleton width="140px" height="24px" /> : 'Recently Used'}</h2>
              {!loading && <button className={styles.viewAll} onClick={() => { play('click'); navigate('/tools'); }}>View Directory <ArrowRight size={16} /></button>}
            </div>
            
            {loading ? renderRecentSkeletons() : (
              <motion.div 
                className={styles.list}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {recentTools.length > 0 ? (
                  recentTools.map((tool) => {
                    if (!tool) return null;
                    return (
                      <motion.div 
                        key={tool.historyId} 
                        className={styles.listItem}
                        variants={itemVariants}
                        whileHover={{ x: 5 }}
                      >
                        <div className={styles.toolIcon}>
                          {typeof tool.icon === 'string' ? (
                            <span style={{ fontSize: '1.2rem' }}>{tool.icon}</span>
                          ) : (
                            <tool.icon size={18} />
                          )}
                        </div>
                        <div className={styles.toolDetails}>
                          <h4>{tool.name}</h4>
                          <p>{tool.category}</p>
                        </div>
                        <button className={styles.launchBtn} onClick={() => handleLaunch(tool)}>
                          {tool.isCustom ? <ExternalLink size={16} /> : 'Launch'}
                        </button>
                      </motion.div>
                    );
                  })
                ) : (
                  <p className={styles.emptyMsg}>You haven't used any tools yet.</p>
                )}
              </motion.div>
            )}
          </motion.section>

          <motion.section 
            className={`${styles.section} glass`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className={styles.sectionHeader}>
              <h2>{loading ? <Skeleton width="150px" height="24px" /> : 'Quick Access'}</h2>
              {!loading && (
                <button className={styles.iconLink} onClick={() => navigate('/settings')}>
                  <SettingsIcon size={18} />
                </button>
              )}
            </div>
            
            {loading ? renderQuickSkeletons() : (
              <div className={styles.quickContent}>
                {selectedQuickTools.length > 0 ? (
                  <div className={styles.quickGrid}>
                    {selectedQuickTools.map((tool) => {
                      if (!tool) return null;
                      return (
                        <motion.div 
                          key={tool.id} 
                          className={styles.quickCard}
                          whileHover={{ y: -4, scale: 1.02 }}
                          onClick={() => handleLaunch(tool)}
                        >
                          <div className={styles.quickIcon}>
                            {typeof tool.icon === 'string' ? (
                              <span>{tool.icon}</span>
                            ) : (
                              <tool.icon size={24} />
                            )}
                          </div>
                          <div className={styles.quickInfo}>
                            <h4>{tool.name}</h4>
                            <p>{tool.category}</p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <div className={styles.emptyQuick}>
                    <LayoutGrid size={40} />
                    <p>No quick tools selected.</p>
                    <button className={styles.setupBtn} onClick={() => navigate('/settings')}>
                      Setup Quick Tools
                    </button>
                  </div>
                )}
              </div>
            )}
          </motion.section>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;

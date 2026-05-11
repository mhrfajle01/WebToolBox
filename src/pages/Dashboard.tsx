import React, { useEffect, useMemo } from 'react';
import styles from './Dashboard.module.css';
import { 
  Zap, 
  Clock, 
  Star, 
  TrendingUp,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useToolStore } from '../store/useToolStore';
import { useNavigate } from 'react-router-dom';
import { toolRegistry } from '../lib/toolRegistry';
import { motion, type Variants } from 'framer-motion';

import { useSound } from '../hooks/useSound';

import MainLayout from '../components/layout/MainLayout';

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
  const { favorites, history, customTools, fetchUserData } = useToolStore();
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

  const handleLaunch = (tool: { id: string, isCustom: boolean }) => {
    play('click');
    navigate(`/tools/${tool.id}`);
  };

  return (
    <MainLayout>
      <div className={styles.dashboard}>
        <header className={styles.header}>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            Welcome back, {user?.displayName || user?.email?.split('@')[0] || 'User'}! 👋
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Explore your tools and stay productive.
          </motion.p>
        </header>

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

        <div className={styles.mainGrid}>
          <motion.section 
            className={`${styles.section} glass`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className={styles.sectionHeader}>
              <h2>Recently Used</h2>
              <button className={styles.viewAll} onClick={() => { play('click'); navigate('/tools'); }}>View Directory <ArrowRight size={16} /></button>
            </div>
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
          </motion.section>

          <motion.section 
            className={`${styles.section} glass`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className={styles.sectionHeader}>
              <h2>Usage Analytics</h2>
              <TrendingUp size={20} color="var(--text-secondary)" />
            </div>
            <div className={styles.chartPlaceholder}>
               {/* Recharts will go here later */}
               <p>Visualizing your productivity...</p>
               <div className={styles.barContainer}>
                  <motion.div 
                    className={styles.bar} 
                    initial={{ height: 0 }}
                    animate={{ height: '40%' }}
                    transition={{ delay: 0.6, duration: 1 }}
                  ></motion.div>
                  <motion.div 
                    className={styles.bar} 
                    initial={{ height: 0 }}
                    animate={{ height: '70%' }}
                    transition={{ delay: 0.7, duration: 1 }}
                  ></motion.div>
                  <motion.div 
                    className={styles.bar} 
                    initial={{ height: 0 }}
                    animate={{ height: '55%' }}
                    transition={{ delay: 0.8, duration: 1 }}
                  ></motion.div>
                  <motion.div 
                    className={styles.bar} 
                    initial={{ height: 0 }}
                    animate={{ height: '90%' }}
                    transition={{ delay: 0.9, duration: 1 }}
                  ></motion.div>
                  <motion.div 
                    className={styles.bar} 
                    initial={{ height: 0 }}
                    animate={{ height: '30%' }}
                    transition={{ delay: 1.0, duration: 1 }}
                  ></motion.div>
               </div>
            </div>
          </motion.section>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;

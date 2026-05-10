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

import { useSound } from '../hooks/useSound';

import MainLayout from '../components/layout/MainLayout';

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

  const handleLaunch = (tool: any) => {
    play('click');
    navigate(`/tools/${tool.id}`);
  };

  return (
    <MainLayout>
      <div className={styles.dashboard}>
        <header className={styles.header}>
          <h1>Welcome back, {user?.displayName || user?.email?.split('@')[0] || 'User'}! 👋</h1>
          <p>Explore your tools and stay productive.</p>
        </header>

        <div className={styles.statsGrid}>
          <div className={`${styles.statCard} glass`}>
            <div className={styles.statIcon} style={{ background: '#dbeafe', color: '#3b82f6' }}>
              <Zap size={24} />
            </div>
            <div className={styles.statInfo}>
              <h3>Total Tools</h3>
              <p>{toolRegistry.length + customTools.length}</p>
            </div>
          </div>
          <div className={`${styles.statCard} glass`}>
            <div className={styles.statIcon} style={{ background: '#fef3c7', color: '#f59e0b' }}>
              <Star size={24} />
            </div>
            <div className={styles.statInfo}>
              <h3>Favorites</h3>
              <p>{favorites.length}</p>
            </div>
          </div>
          <div className={`${styles.statCard} glass`}>
            <div className={styles.statIcon} style={{ background: '#dcfce7', color: '#22c55e' }}>
              <Clock size={24} />
            </div>
            <div className={styles.statInfo}>
              <h3>Usage Sessions</h3>
              <p>{history.length}</p>
            </div>
          </div>
        </div>

        <div className={styles.mainGrid}>
          <section className={`${styles.section} glass`}>
            <div className={styles.sectionHeader}>
              <h2>Recently Used</h2>
              <button className={styles.viewAll} onClick={() => { play('click'); navigate('/tools'); }}>View Directory <ArrowRight size={16} /></button>
            </div>
            <div className={styles.list}>
              {recentTools.length > 0 ? (
                recentTools.map((tool: any) => (
                  <div key={tool.historyId} className={styles.listItem}>
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
                  </div>
                ))
              ) : (
                <p className={styles.emptyMsg}>You haven't used any tools yet.</p>
              )}
            </div>
          </section>

          <section className={`${styles.section} glass`}>
            <div className={styles.sectionHeader}>
              <h2>Usage Analytics</h2>
              <TrendingUp size={20} color="var(--text-secondary)" />
            </div>
            <div className={styles.chartPlaceholder}>
               {/* Recharts will go here later */}
               <p>Visualizing your productivity...</p>
               <div className={styles.barContainer}>
                  <div className={styles.bar} style={{ height: '40%' }}></div>
                  <div className={styles.bar} style={{ height: '70%' }}></div>
                  <div className={styles.bar} style={{ height: '55%' }}></div>
                  <div className={styles.bar} style={{ height: '90%' }}></div>
                  <div className={styles.bar} style={{ height: '30%' }}></div>
               </div>
            </div>
          </section>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;

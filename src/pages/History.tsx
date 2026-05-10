import React, { useEffect } from 'react';
import styles from './History.module.css';
import { useAuthStore } from '../store/useAuthStore';
import { useToolStore } from '../store/useToolStore';
import { toolRegistry } from '../lib/toolRegistry';
import { Clock, ExternalLink, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSound } from '../hooks/useSound';
import MainLayout from '../components/layout/MainLayout';

const History: React.FC = () => {
  const { user } = useAuthStore();
  const { history, fetchUserData } = useToolStore();
  const navigate = useNavigate();
  const { play } = useSound();

  useEffect(() => {
    if (user) {
      fetchUserData(user.uid);
    }
  }, [user, fetchUserData]);

  const formatDate = (timestamp: Date | { toDate: () => Date } | null) => {
    if (!timestamp) return 'Just now';
    const date = (timestamp instanceof Date) 
      ? timestamp 
      : (typeof timestamp === 'object' && 'toDate' in timestamp) 
        ? (timestamp as { toDate: () => Date }).toDate() 
        : new Date(timestamp as string);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <MainLayout>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.headerTitle}>
            <h1>Usage History</h1>
            <p>A log of your recently used tools and utilities.</p>
          </div>
        </header>

        {history.length > 0 ? (
          <div className={styles.list}>
            {history.map((item) => {
              const tool = toolRegistry.find(t => t.id === item.toolId);
              if (!tool) return null;

              return (
                <div 
                  key={item.id} 
                  className={`${styles.historyItem} glass`}
                  onClick={() => {
                    play('click');
                    navigate(`/tools/${tool.id}`);
                  }}
                >
                  <div className={styles.toolIcon}>
                    <tool.icon size={20} />
                  </div>
                  <div className={styles.details}>
                    <h3>{tool.name}</h3>
                    <div className={styles.meta}>
                      <span className={styles.category}>{tool.category}</span>
                      <span className={styles.dot}>•</span>
                      <span className={styles.time}><Calendar size={14} /> {formatDate(item.timestamp)}</span>
                    </div>
                  </div>
                  <button className={styles.launchBtn}>
                    Launch <ExternalLink size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className={styles.empty}>
            <Clock size={64} color="var(--border-color)" />
            <h2>No history yet</h2>
            <p>Tools you use will appear here for quick access.</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default History;

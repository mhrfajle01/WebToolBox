import React, { useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toolRegistry } from '../lib/toolRegistry';
import styles from './ToolDetail.module.css';
import { ArrowLeft, Star, Share2, Info } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useToolStore } from '../store/useToolStore';
import MainLayout from '../components/layout/MainLayout';
import ToolBrowser from '../components/tools/ToolBrowser';

import { toast } from 'sonner';

import { useSound } from '../hooks/useSound';
import { type CustomTool, type ToolDefinition } from '../types/tool';

const ToolDetail: React.FC = () => {
  const { toolId } = useParams<{ toolId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { favorites, customTools, toggleFavorite, addToHistory } = useToolStore();
  const { play } = useSound();
  
  const tool = useMemo(() => {
    const builtIn = toolRegistry.find(t => t.id === toolId);
    if (builtIn) return { ...builtIn, isCustom: false } as (ToolDefinition & { isCustom: false });

    const custom = customTools.find(t => t.id === toolId);
    if (custom) return {
      ...custom,
      isCustom: true,
      category: 'Personal'
    } as (CustomTool & { isCustom: true, category: 'Personal' });

    return null;
  }, [toolId, customTools]);

  const isFavorite = tool ? favorites.includes(tool.id) : false;

  useEffect(() => {
    if (user && toolId) {
      addToHistory(user.uid, toolId);
    }
  }, [user, toolId, addToHistory]);

  const handleToggleFavorite = () => {
    if (user && toolId && tool) {
      toggleFavorite(user.uid, toolId);
      play('success');
      if (!isFavorite) {
        toast.success(`${tool.name} added to favorites`);
      } else {
        toast.info(`${tool.name} removed from favorites`);
      }
    }
  };

  const handleShare = () => {
    play('click');
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  if (!tool) {
    return (
      <MainLayout>
        <div className={styles.errorState}>
          <h2>Tool not found</h2>
          <p>The tool you're looking for doesn't exist or has been moved.</p>
          <Link to="/tools" className={styles.backBtn}>Back to Directory</Link>
        </div>
      </MainLayout>
    );
  }

  if (tool.isCustom) {
    return (
      <MainLayout>
        <ToolBrowser 
          url={tool.url} 
          name={tool.name} 
          icon={tool.icon} 
        />
      </MainLayout>
    );
  }

  // At this point, tool is a ToolDefinition
  const builtInTool = tool as ToolDefinition;

  return (
    <MainLayout>
      <div className={styles.toolDetail}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <button onClick={() => navigate('/tools')} className={styles.iconBtn}>
              <ArrowLeft size={20} />
            </button>
            <div className={styles.titleInfo}>
              <h1>{builtInTool.name}</h1>
              <span className={styles.categoryTag}>{builtInTool.category}</span>
            </div>
          </div>
          <div className={styles.headerRight}>
            <button 
              className={`${styles.iconBtn} ${isFavorite ? styles.activeFavorite : ''}`} 
              onClick={handleToggleFavorite}
              title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
            >
              <Star size={20} fill={isFavorite ? "var(--accent-primary)" : "none"} />
            </button>
            <button className={styles.iconBtn} onClick={handleShare} title="Share Tool">
              <Share2 size={20} />
            </button>
          </div>
        </header>

        <div className={styles.layout}>
          <div className={styles.mainContent}>
            <React.Suspense fallback={
              <div className={styles.loader}>
                <div className="spinner"></div>
                <p>Loading tool engine...</p>
              </div>
            }>
              {builtInTool.component && <builtInTool.component />}
            </React.Suspense>
          </div>

          <aside className={styles.infoSidebar}>
            <div className={`${styles.infoCard} glass`}>
              <h3><Info size={18} /> About this tool</h3>
              <p>{builtInTool.description}</p>
            </div>
            <div className={`${styles.infoCard} glass`}>
              <h3>Quick Actions</h3>
              <ul className={styles.actionList}>
                <li onClick={() => window.dispatchEvent(new CustomEvent('tool-action', { detail: 'copy' }))}>
                  Copy Results
                </li>
                <li onClick={() => window.dispatchEvent(new CustomEvent('tool-action', { detail: 'reset' }))}>
                  Reset Tool
                </li>
                <li onClick={() => window.dispatchEvent(new CustomEvent('tool-action', { detail: 'export' }))}>
                  Export Data
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </MainLayout>
  );
};

export default ToolDetail;

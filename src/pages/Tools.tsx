import React, { useState, useEffect, useMemo } from 'react';
import styles from './Tools.module.css';
import { toolRegistry } from '../lib/toolRegistry';
import { Search, Filter, Star, Plus, Trash2, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useToolStore } from '../store/useToolStore';
import type { ToolCategory } from '../types/tool';
import MainLayout from '../components/layout/MainLayout';
import { motion, AnimatePresence, type Variants } from 'framer-motion';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
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

const Tools: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<ToolCategory | 'All'>('All');
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { favorites, customTools, toggleFavorite, fetchUserData, removeCustomTool } = useToolStore();

  useEffect(() => {
    if (user && favorites.length === 0 && customTools.length === 0) {
      fetchUserData(user.uid);
    }
  }, [user, fetchUserData, favorites.length, customTools.length]);

  const categories: (ToolCategory | 'All')[] = ['All', 'Text', 'Calculator', 'Converter', 'Developer', 'Security', 'Design', 'Time', 'Files', 'Personal'];

  // Merge built-in tools with custom tools
  const allTools = useMemo(() => {
    const builtIn = toolRegistry.map(t => ({ ...t, isCustom: false }));
    const custom = customTools.map(t => ({
      id: t.id,
      name: t.name,
      description: t.description || t.url,
      category: 'Personal' as ToolCategory,
      icon: t.icon,
      url: t.url,
      isCustom: true
    }));
    return [...builtIn, ...custom];
  }, [customTools]);

  const filteredTools = allTools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || tool.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleToggleFavorite = (e: React.MouseEvent, toolId: string) => {
    e.stopPropagation();
    if (user) {
      toggleFavorite(user.uid, toolId);
    }
  };

  const handleToolClick = (tool: { id: string }) => {
    navigate(`/tools/${tool.id}`);
  };

  const handleDeleteCustom = (e: React.MouseEvent, toolId: string) => {
    e.stopPropagation();
    if (user && window.confirm('Are you sure you want to remove this custom tool?')) {
      removeCustomTool(user.uid, toolId);
    }
  };

  return (
    <MainLayout>
      <div className={styles.toolsPage}>
        <header className={styles.header}>
          <motion.div 
            className={styles.titleInfo}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1>Tool Directory</h1>
            <p>Browse our suite of {allTools.length} premium utilities.</p>
          </motion.div>
          
          <motion.div 
            className={styles.controls}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className={styles.searchBox}>
              <Search size={20} />
              <input 
                type="text" 
                placeholder="Search tools..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </motion.div>
        </header>

        <motion.div 
          className={styles.filterBar}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {categories.map(cat => (
            <button 
              key={cat} 
              className={`${styles.filterBtn} ${activeCategory === cat ? styles.active : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        <motion.div 
          className={styles.grid}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          layout
        >
          <AnimatePresence mode="popLayout">
            {filteredTools.map(tool => (
              <motion.div 
                layout
                key={tool.id} 
                className={`${styles.toolCard} glass`}
                onClick={() => handleToolClick(tool)}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                style={{ cursor: 'pointer' }}
              >
                <div className={styles.toolHeader}>
                  <div className={styles.iconWrapper}>
                    {typeof tool.icon === 'string' ? (
                      <span className={styles.customIcon}>{tool.icon}</span>
                    ) : (
                      <tool.icon size={24} />
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {tool.isCustom && (
                      <button 
                        className={styles.deleteBtn}
                        onClick={(e) => handleDeleteCustom(e, tool.id)}
                        title="Remove custom tool"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                    <button 
                      className={`${styles.favBtn} ${favorites.includes(tool.id) ? styles.activeFavorite : ''}`}
                      onClick={(e) => handleToggleFavorite(e, tool.id)}
                    >
                      <Star size={18} fill={favorites.includes(tool.id) ? "#f59e0b" : "none"} />
                    </button>
                  </div>
                </div>
                <div className={styles.toolBody}>
                  <h3>{tool.name}</h3>
                  <p>{tool.description}</p>
                </div>
                <div className={styles.toolFooter}>
                  <span className={styles.categoryTag}>{tool.category}</span>
                  <button className={styles.openBtn}>
                    {tool.isCustom ? <><ExternalLink size={16} /> Open Tool</> : 'Open Tool'}
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredTools.length === 0 && (activeCategory !== 'Personal' || customTools.length === 0) && (
          <motion.div 
            className={styles.emptyState}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Filter size={48} />
            <h2>No tools found</h2>
            <p>Try adjusting your search or filter to find what you're looking for.</p>
          </motion.div>
        )}

        {activeCategory === 'Personal' && customTools.length === 0 && (
          <motion.div 
            className={styles.emptyState}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Plus size={48} />
            <h2>No custom tools yet</h2>
            <p>Add your frequently used websites in Settings for quick access.</p>
            <button className={styles.addBtn} style={{ marginTop: '1rem' }} onClick={() => navigate('/settings')}>
              Go to Settings
            </button>
          </motion.div>
        )}
      </div>
    </MainLayout>
  );
};

export default Tools;

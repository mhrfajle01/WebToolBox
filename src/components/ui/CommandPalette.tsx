import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Command, X, ExternalLink } from 'lucide-react';
import { toolRegistry } from '../../lib/toolRegistry';
import { useToolStore } from '../../store/useToolStore';
import styles from './CommandPalette.module.css';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const { customTools } = useToolStore();

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

  const filteredTools = allTools.filter(tool =>
    tool.name.toLowerCase().includes(query.toLowerCase()) ||
    tool.category.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 8);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const handleSelect = (tool: any) => {
    if (tool.isCustom) {
      window.open(tool.url, '_blank');
    } else {
      navigate(`/tools/${tool.id}`);
    }
    onClose();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % Math.max(1, filteredTools.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredTools.length) % Math.max(1, filteredTools.length));
      } else if (e.key === 'Enter') {
        if (filteredTools[selectedIndex]) {
          handleSelect(filteredTools[selectedIndex]);
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredTools, selectedIndex, navigate, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={`${styles.palette} glass`} onClick={e => e.stopPropagation()}>
        <div className={styles.searchHeader}>
          <Search size={20} className={styles.searchIcon} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search tools or categories..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className={styles.input}
          />
          <div className={styles.escKey}>ESC</div>
        </div>

        <div className={styles.results}>
          {filteredTools.length > 0 ? (
            filteredTools.map((tool, index) => (
              <div
                key={tool.id}
                className={`${styles.item} ${index === selectedIndex ? styles.selected : ''}`}
                onMouseEnter={() => setSelectedIndex(index)}
                onClick={() => handleSelect(tool)}
              >
                <div className={styles.itemIcon}>
                  {typeof tool.icon === 'string' ? (
                    <span style={{ fontSize: '1.2rem' }}>{tool.icon}</span>
                  ) : (
                    <tool.icon size={18} />
                  )}
                </div>
                <div className={styles.itemDetails}>
                  <span className={styles.itemName}>{tool.name}</span>
                  <span className={styles.itemCategory}>{tool.category}</span>
                </div>
                {tool.isCustom && <ExternalLink size={14} style={{ opacity: 0.5, marginRight: '0.5rem' }} />}
                {index === selectedIndex && (
                  <Command size={14} className={styles.enterHint} />
                )}
              </div>
            ))
          ) : (
            <div className={styles.noResults}>
              No tools matching "{query}"
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <div className={styles.shortcut}>
            <kbd>↑↓</kbd> <span>Navigate</span>
          </div>
          <div className={styles.shortcut}>
            <kbd>↵</kbd> <span>Select</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;

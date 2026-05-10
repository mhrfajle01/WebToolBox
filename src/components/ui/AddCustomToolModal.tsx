import React, { useState } from 'react';
import styles from './AddCustomToolModal.module.css';
import { X, Link as LinkIcon, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToolStore } from '../../store/useToolStore';
import { useAuthStore } from '../../store/useAuthStore';
import { toast } from 'sonner';
import type { ToolCategory } from '../../types/tool';

interface AddCustomToolModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ICONS = ['🔗', '🛠️', '📱', '💻', '🌐', '📊', '📝', '🎨', '🔒', '⚡', '🚀', '⭐'];

const AddCustomToolModal: React.FC<AddCustomToolModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuthStore();
  const { addCustomTool } = useToolStore();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    description: '',
    category: 'Personal' as ToolCategory,
    icon: '🔗'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!formData.name || !formData.url) {
      toast.error('Please fill in at least the name and URL.');
      return;
    }

    // Basic URL validation
    try {
      new URL(formData.url.startsWith('http') ? formData.url : `https://${formData.url}`);
    } catch (e) {
      toast.error('Please enter a valid URL.');
      return;
    }

    setLoading(true);
    try {
      const finalUrl = formData.url.startsWith('http') ? formData.url : `https://${formData.url}`;
      await addCustomTool(user.uid, {
        ...formData,
        url: finalUrl
      });
      toast.success('Custom tool added successfully!');
      onClose();
      setFormData({
        name: '',
        url: '',
        description: '',
        category: 'Personal',
        icon: '🔗'
      });
    } catch (error) {
      toast.error('Failed to add custom tool.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className={styles.overlay} onClick={onClose}>
          <motion.div 
            className={`${styles.modal} glass`}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={e => e.stopPropagation()}
          >
            <div className={styles.header}>
              <h2>Add Custom Tool</h2>
              <button className={styles.closeBtn} onClick={onClose}>
                <X size={24} />
              </button>
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label>Tool Name</label>
                <input 
                  type="text" 
                  className={styles.input} 
                  placeholder="e.g. My Admin Panel"
                  value={formData.name}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>URL</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="text" 
                    className={styles.input} 
                    placeholder="example.com"
                    style={{ paddingLeft: '2.5rem' }}
                    value={formData.url}
                    onChange={e => setFormData(prev => ({ ...prev, url: e.target.value }))}
                    required
                  />
                  <LinkIcon size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Description (Optional)</label>
                <input 
                  type="text" 
                  className={styles.input} 
                  placeholder="What is this tool for?"
                  value={formData.description}
                  onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Choose Icon</label>
                <div className={styles.iconGrid}>
                  {ICONS.map(icon => (
                    <div 
                      key={icon}
                      className={`${styles.iconOption} ${formData.icon === icon ? styles.selectedIcon : ''}`}
                      onClick={() => setFormData(prev => ({ ...prev, icon }))}
                    >
                      {icon}
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.footer}>
                <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancel</button>
                <button type="submit" className={styles.submitBtn} disabled={loading}>
                  {loading ? 'Adding...' : 'Add Tool'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddCustomToolModal;

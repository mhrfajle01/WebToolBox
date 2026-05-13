import React from 'react';
import styles from './ConfirmModal.module.css';
import { AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger'
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className={styles.overlay}>
          <motion.div 
            className={styles.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div 
            className={`${styles.modal} glass`}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
          >
            <button className={styles.closeBtn} onClick={onClose}>
              <X size={20} />
            </button>
            
            <div className={styles.header}>
              <div className={`${styles.iconWrapper} ${styles[type]}`}>
                <AlertTriangle size={24} />
              </div>
              <h2>{title}</h2>
            </div>
            
            <div className={styles.body}>
              <p>{message}</p>
            </div>
            
            <div className={styles.footer}>
              <button className={styles.cancelBtn} onClick={onClose}>
                {cancelText}
              </button>
              <button 
                className={`${styles.confirmBtn} ${styles[`confirm_${type}`]}`} 
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;

import React from 'react';
import { Loader2 } from 'lucide-react';
import styles from './LoadingSpinner.module.css';

interface LoadingSpinnerProps {
  size?: number;
  fullPage?: boolean;
  label?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 40, 
  fullPage = false,
  label
}) => {
  const content = (
    <div className={styles.spinnerContainer}>
      <Loader2 className={styles.spinner} size={size} />
      {label && <p className={styles.label}>{label}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div className={styles.fullPage}>
        {content}
      </div>
    );
  }

  return content;
};

export default LoadingSpinner;

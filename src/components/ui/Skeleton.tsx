import React from 'react';
import styles from './Skeleton.module.css';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  className?: string;
  circle?: boolean;
}

const Skeleton: React.FC<SkeletonProps> = ({ 
  width, 
  height, 
  borderRadius, 
  className = '',
  circle = false
}) => {
  const style: React.CSSProperties = {
    width: width,
    height: height,
    borderRadius: circle ? '50%' : borderRadius,
  };

  return (
    <div 
      className={`${styles.skeleton} ${className}`} 
      style={style}
    />
  );
};

export default Skeleton;

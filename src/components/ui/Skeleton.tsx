import React from 'react';
import styles from './Skeleton.module.css';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  className?: string;
  circle?: boolean;
  style?: React.CSSProperties;
}

const Skeleton: React.FC<SkeletonProps> = ({ 
  width, 
  height, 
  borderRadius, 
  className = '',
  circle = false,
  style = {}
}) => {
  const internalStyle: React.CSSProperties = {
    width: width,
    height: height,
    borderRadius: circle ? '50%' : borderRadius,
    ...style
  };

  return (
    <div 
      className={`${styles.skeleton} ${className}`} 
      style={internalStyle}
    />
  );
};

export default Skeleton;

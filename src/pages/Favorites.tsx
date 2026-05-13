import React, { useEffect } from 'react';
import styles from './Favorites.module.css';
import { useAuthStore } from '../store/useAuthStore';
import { useToolStore } from '../store/useToolStore';
import { toolRegistry } from '../lib/toolRegistry';
import { Star, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import MainLayout from '../components/layout/MainLayout';
import Skeleton from '../components/ui/Skeleton';

const Favorites: React.FC = () => {
  const { user } = useAuthStore();
  const { favorites, loading, toggleFavorite, fetchUserData } = useToolStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && favorites.length === 0) {
      fetchUserData(user.uid);
    }
  }, [user, fetchUserData, favorites.length]);

  const favoriteTools = toolRegistry.filter(tool => favorites.includes(tool.id));

  const handleRemove = (e: React.MouseEvent, toolId: string, name: string) => {
    e.stopPropagation();
    if (user) {
      toggleFavorite(user.uid, toolId);
      toast.info(`${name} removed from favorites`);
    }
  };

  const renderSkeletons = () => (
    <div className={styles.grid}>
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className={`${styles.card} glass`}>
          <div className={styles.cardHeader}>
            <Skeleton width="48px" height="48px" borderRadius="12px" />
            <Skeleton width="24px" height="24px" circle />
          </div>
          <div className={styles.cardBody}>
            <Skeleton width="80%" height="24px" style={{ marginBottom: '8px' }} />
            <Skeleton width="50%" height="16px" />
          </div>
          <div className={styles.cardFooter}>
            <Skeleton width="100px" height="20px" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <MainLayout>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1>Your Favorites</h1>
          <p>Quick access to the tools you use most.</p>
        </header>

        {loading ? renderSkeletons() : (
          <>
            {favoriteTools.length > 0 ? (
              <div className={styles.grid}>
                {favoriteTools.map(tool => (
                  <div 
                    key={tool.id} 
                    className={`${styles.card} glass`}
                    onClick={() => navigate(`/tools/${tool.id}`)}
                  >
                    <div className={styles.cardHeader}>
                      <div className={styles.iconWrapper}>
                        <tool.icon size={24} />
                      </div>
                      <button 
                        className={styles.favBtn}
                        onClick={(e) => handleRemove(e, tool.id, tool.name)}
                      >
                        <Star size={20} fill="#f59e0b" color="#f59e0b" />
                      </button>
                    </div>
                    <div className={styles.cardBody}>
                      <h3>{tool.name}</h3>
                      <p>{tool.category}</p>
                    </div>
                    <div className={styles.cardFooter}>
                      <span>Open Tool</span>
                      <ArrowRight size={16} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.empty}>
                <Star size={64} color="var(--border-color)" />
                <h2>No favorites yet</h2>
                <p>Start starring tools in the directory to see them here.</p>
                <button onClick={() => navigate('/tools')} className={styles.browseBtn}>
                  Browse Tools
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default Favorites;

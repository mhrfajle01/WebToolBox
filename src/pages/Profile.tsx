import React, { useState } from 'react';
import styles from './Profile.module.css';
import { useAuthStore } from '../store/useAuthStore';
import { useToolStore } from '../store/useToolStore';
import { User, Mail, Calendar, ShieldCheck, Edit3, Camera } from 'lucide-react';
import { toast } from 'sonner';
import MainLayout from '../components/layout/MainLayout';
import EditProfileModal from '../components/ui/EditProfileModal';

const Profile: React.FC = () => {
  const { user, sendPasswordReset } = useAuthStore();
  const { favorites, history } = useToolStore();
  const [avatarError, setAvatarError] = React.useState(false);
  const [lastPhotoURL, setLastPhotoURL] = React.useState(user?.photoURL);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  if (user?.photoURL !== lastPhotoURL) {
    setLastPhotoURL(user?.photoURL);
    setAvatarError(false);
  }

  if (!user) return null;

  const handlePasswordReset = async () => {
    setIsResetting(true);
    try {
      await sendPasswordReset();
      toast.success("Password reset email sent! Please check your inbox.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to send reset email. Please try again later.");
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <MainLayout>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1>Account Profile</h1>
          <p>Manage your personal information and view your activity.</p>
        </header>

        <div className={styles.grid}>
          {/* Profile Card */}
          <section className={`${styles.card} ${styles.profileMain} glass`}>
            <div className={styles.avatarSection}>
              <div className={styles.avatarWrapper}>
                {user.photoURL && !avatarError ? (
                  <img 
                    src={user.photoURL} 
                    alt="Profile" 
                    onError={() => setAvatarError(true)}
                  />
                ) : (
                  <div className={styles.avatarPlaceholder}>
                    <User size={48} />
                  </div>
                )}
                <button 
                  className={styles.editAvatar} 
                  title="Change Avatar"
                  onClick={() => setIsEditModalOpen(true)}
                >
                  <Camera size={16} />
                </button>
              </div>
              <div className={styles.nameSection}>
                <h2>{user.displayName || 'WebToolBox User'}</h2>
                <span className={styles.badge}><ShieldCheck size={14} /> Verified Member</span>
              </div>
            </div>

            <div className={styles.infoList}>
              <div className={styles.infoItem}>
                <div className={styles.infoLabel}><Mail size={16} /> Email Address</div>
                <div className={styles.infoValue}>{user.email}</div>
              </div>
              <div className={styles.infoItem}>
                <div className={styles.infoLabel}><Calendar size={16} /> Member Since</div>
                <div className={styles.infoValue}>{user.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'N/A'}</div>
              </div>
              <div className={styles.infoItem}>
                <div className={styles.infoLabel}><User size={16} /> User ID</div>
                <div className={styles.infoValue} style={{ fontSize: '0.7rem', opacity: 0.6 }}>{user.uid}</div>
              </div>
            </div>

            <button className={styles.editBtn} onClick={() => setIsEditModalOpen(true)}>
              <Edit3 size={16} /> Edit Profile
            </button>
          </section>

          {/* Stats Column */}
          <div className={styles.statsColumn}>
            <section className={`${styles.card} glass`}>
              <h3>Usage Summary</h3>
              <div className={styles.miniStats}>
                <div className={styles.miniStat}>
                  <span className={styles.statVal}>{history.length}</span>
                  <span className={styles.statLabel}>Tools Used</span>
                </div>
                <div className={styles.miniStat}>
                  <span className={styles.statVal}>{favorites.length}</span>
                  <span className={styles.statLabel}>Favorites</span>
                </div>
              </div>
            </section>

            <section className={`${styles.card} glass`}>
              <h3>Account Security</h3>
              <p className={styles.secText}>Your account is protected with Firebase Authentication.</p>
              <button 
                className={styles.secBtn} 
                onClick={handlePasswordReset}
                disabled={isResetting}
              >
                {isResetting ? "Sending..." : "Reset Password"}
              </button>
            </section>
          </div>
        </div>
      </div>

      <EditProfileModal 
        key={isEditModalOpen ? 'open' : 'closed'}
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
      />
    </MainLayout>
  );
};

export default Profile;

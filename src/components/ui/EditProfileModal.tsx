import React, { useState, useRef } from 'react';
import styles from './EditProfileModal.module.css';
import { X, User, Camera, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../store/useAuthStore';
import { toast } from 'sonner';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../lib/firebase';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, updateUserProfile } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [photoUrlInput, setPhotoUrlInput] = useState(user?.photoURL || '');
  const [previewUrl, setPreviewUrl] = useState(user?.photoURL || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 25 * 1024) {
        toast.error('Image size must be less than 25KB');
        return;
      }
      setAvatarFile(file);
      setPhotoUrlInput(''); // Clear URL input if a file is selected
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setPhotoUrlInput(url);
    setAvatarFile(null); // Clear file if a URL is entered
    if (url) {
      setPreviewUrl(url);
    } else {
      setPreviewUrl(user?.photoURL || '');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      let photoURL = photoUrlInput || user.photoURL || '';

      if (avatarFile) {
        const storageRef = ref(storage, `avatars/${user.uid}_${Date.now()}`);
        const snapshot = await uploadBytes(storageRef, avatarFile);
        photoURL = await getDownloadURL(snapshot.ref);
      }

      await updateUserProfile({
        displayName,
        photoURL
      });

      toast.success('Profile updated successfully!');
      onClose();
    } catch (error) {
      console.error('Update profile error:', error);
      toast.error('Failed to update profile.');
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
              <h2>Edit Profile</h2>
              <button className={styles.closeBtn} onClick={onClose}>
                <X size={24} />
              </button>
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.avatarSection}>
                <div className={styles.avatarPreview}>
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" onError={() => setPreviewUrl('')} />
                  ) : (
                    <User size={48} className={styles.placeholderIcon} />
                  )}
                </div>
                <div className={styles.uploadBtn}>
                  <Camera size={16} />
                  <span>Change Photo (max 25KB)</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange}
                    ref={fileInputRef}
                  />
                </div>
              </div>

              <div className={styles.divider}>
                <span>OR</span>
              </div>

              <div className={styles.formGroup}>
                <label>Photo URL</label>
                <input 
                  type="url" 
                  className={styles.input} 
                  placeholder="https://example.com/photo.jpg"
                  value={photoUrlInput}
                  onChange={handleUrlChange}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Display Name</label>
                <input 
                  type="text" 
                  className={styles.input} 
                  placeholder="Your name"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  required
                />
              </div>

              <div className={styles.footer}>
                <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancel</button>
                <button type="submit" className={styles.submitBtn} disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Updating...
                    </>
                  ) : 'Save Changes'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default EditProfileModal;

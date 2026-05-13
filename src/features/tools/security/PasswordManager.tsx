import React, { useState } from 'react';
import styles from './PasswordManager.module.css';
import { 
  Plus, 
  Search, 
  ShieldCheck, 
  Trash2, 
  Eye, 
  EyeOff, 
  Copy, 
  ExternalLink,
  Lock,
  User,
  Globe,
  StickyNote
} from 'lucide-react';
import { useAuthStore } from '../../../store/useAuthStore';
import { useToolStore } from '../../../store/useToolStore';
import { toast } from 'sonner';

const PasswordManager: React.FC = () => {
  const { user } = useAuthStore();
  const { savedPasswords, addSavedPassword, removeSavedPassword, loading } = useToolStore();
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});

  const [newPassword, setNewPassword] = useState({
    service: '',
    username: '',
    passwordValue: '',
    notes: ''
  });

  const toggleVisibility = (id: string) => {
    setVisiblePasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopy = (value: string, label: string) => {
    navigator.clipboard.writeText(value);
    toast.success(`${label} copied!`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!newPassword.service || !newPassword.username || !newPassword.passwordValue) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await addSavedPassword(user.uid, newPassword);
      setNewPassword({ service: '', username: '', passwordValue: '', notes: '' });
      setIsAdding(false);
      toast.success('Password saved securely');
    } catch (error) {
      toast.error('Failed to save password');
    }
  };

  const handleDelete = (id: string, service: string) => {
    if (!user) return;
    if (window.confirm(`Are you sure you want to delete the password for ${service}?`)) {
      removeSavedPassword(user.uid, id);
      toast.info('Password removed');
    }
  };

  const filteredPasswords = savedPasswords.filter(p => 
    p.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`${styles.container} animate-fade-in`}>
      <header className={styles.header}>
        <div className={styles.headerTitle}>
          <ShieldCheck size={32} color="var(--accent-primary)" />
          <div>
            <h1>Password Manager</h1>
            <p>Securely store and manage your credentials.</p>
          </div>
        </div>
        <button 
          className={styles.addBtn}
          onClick={() => setIsAdding(!isAdding)}
        >
          {isAdding ? 'Cancel' : <><Plus size={18} /> Add Password</>}
        </button>
      </header>

      {isAdding && (
        <form className={`${styles.addForm} glass`} onSubmit={handleSubmit}>
          <div className={styles.formGrid}>
            <div className={styles.inputGroup}>
              <label><Globe size={16} /> Service Name</label>
              <input 
                type="text" 
                placeholder="e.g. GitHub, Netflix"
                value={newPassword.service}
                onChange={e => setNewPassword(prev => ({ ...prev, service: e.target.value }))}
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <label><User size={16} /> Username/Email</label>
              <input 
                type="text" 
                placeholder="Your username"
                value={newPassword.username}
                onChange={e => setNewPassword(prev => ({ ...prev, username: e.target.value }))}
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <label><Lock size={16} /> Password</label>
              <input 
                type="password" 
                placeholder="••••••••"
                value={newPassword.passwordValue}
                onChange={e => setNewPassword(prev => ({ ...prev, passwordValue: e.target.value }))}
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <label><StickyNote size={16} /> Notes (Optional)</label>
              <input 
                type="text" 
                placeholder="Any extra details"
                value={newPassword.notes}
                onChange={e => setNewPassword(prev => ({ ...prev, notes: e.target.value }))}
              />
            </div>
          </div>
          <button type="submit" className={styles.saveBtn}>Save Credential</button>
        </form>
      )}

      <div className={styles.searchBar}>
        <Search size={20} />
        <input 
          type="text" 
          placeholder="Search by service or username..." 
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      <div className={styles.passList}>
        {filteredPasswords.length > 0 ? (
          filteredPasswords.map(p => (
            <div key={p.id} className={`${styles.passCard} glass`}>
              <div className={styles.cardHeader}>
                <div className={styles.serviceIcon}>
                  {p.service.charAt(0).toUpperCase()}
                </div>
                <div className={styles.serviceInfo}>
                  <h3>{p.service}</h3>
                  <p>{p.username}</p>
                </div>
                <div className={styles.cardActions}>
                  <button onClick={() => handleDelete(p.id, p.service)} className={styles.deleteBtn}>
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              
              <div className={styles.cardBody}>
                <div className={styles.fieldRow}>
                  <div className={styles.fieldValue}>
                    {visiblePasswords[p.id] ? p.passwordValue : '••••••••••••'}
                  </div>
                  <div className={styles.fieldActions}>
                    <button onClick={() => toggleVisibility(p.id)}>
                      {visiblePasswords[p.id] ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                    <button onClick={() => handleCopy(p.passwordValue, 'Password')}>
                      <Copy size={18} />
                    </button>
                  </div>
                </div>
                {p.notes && (
                  <div className={styles.notesRow}>
                    <p>{p.notes}</p>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className={styles.empty}>
            <Lock size={48} />
            <p>{searchTerm ? 'No passwords found matching your search.' : "You haven't saved any passwords yet."}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PasswordManager;

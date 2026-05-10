import React, { useState } from 'react';
import styles from './HashGenerator.module.css';
import { Shield, Copy, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import CryptoJS from 'crypto-js';
import { useSound } from '../../../hooks/useSound';

const HashGenerator: React.FC = () => {
  const [text, setText] = useState('');
  const { play } = useSound();
  const [hashes, setHashes] = useState({
    md5: '',
    sha1: '',
    sha256: '',
    sha512: ''
  });

  const generateHashes = (val: string) => {
    setText(val);
    if (!val) {
      setHashes({ md5: '', sha1: '', sha256: '', sha512: '' });
      return;
    }
    setHashes({
      md5: CryptoJS.MD5(val).toString(),
      sha1: CryptoJS.SHA1(val).toString(),
      sha256: CryptoJS.SHA256(val).toString(),
      sha512: CryptoJS.SHA512(val).toString()
    });
  };

  const handleCopy = (hash: string, name: string) => {
    play('success');
    navigator.clipboard.writeText(hash);
    toast.success(`${name} hash copied`);
  };

  return (
    <div className={`${styles.container} glass animate-fade-in`}>
      <div className={styles.inputSection}>
        <label>Input Text</label>
        <textarea 
          className={styles.textarea}
          placeholder="Enter text to hash..."
          value={text}
          onChange={(e) => generateHashes(e.target.value)}
        />
      </div>

      <div className={styles.resultsGrid}>
        {Object.entries(hashes).map(([name, value]) => (
          <div key={name} className={styles.hashCard}>
            <div className={styles.cardHeader}>
              <span className={styles.hashName}>{name.toUpperCase()}</span>
              <button 
                onClick={() => handleCopy(value, name.toUpperCase())}
                className={styles.copyBtn}
                disabled={!value}
              >
                <Copy size={16} />
              </button>
            </div>
            <div className={styles.hashValue}>
              {value || 'Wait for input...'}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.footer}>
        <button onClick={() => generateHashes('')} className={styles.secondaryBtn} disabled={!text}>
          <Trash2 size={18} /> Clear Everything
        </button>
      </div>
    </div>
  );
};

export default HashGenerator;

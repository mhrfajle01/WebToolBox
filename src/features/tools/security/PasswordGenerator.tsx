import React, { useState, useEffect } from 'react';
import styles from './PasswordGenerator.module.css';
import { Lock, Copy, RefreshCw, Shield, Check } from 'lucide-react';

import { toast } from 'sonner';

const PasswordGenerator: React.FC = () => {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    uppercase: true,
    numbers: true,
    symbols: true
  });

  const generatePassword = () => {
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let chars = lower;
    if (options.uppercase) chars += upper;
    if (options.numbers) chars += numbers;
    if (options.symbols) chars += symbols;

    let generated = '';
    for (let i = 0; i < length; i++) {
      generated += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(generated);
  };

  useEffect(() => {
    generatePassword();
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
    toast.success('Password copied to clipboard');
  };

  const getStrength = () => {
    let score = 0;
    if (length > 12) score++;
    if (options.uppercase) score++;
    if (options.numbers) score++;
    if (options.symbols) score++;
    
    if (score <= 1) return { label: 'Weak', color: '#ef4444', width: '25%' };
    if (score === 2) return { label: 'Fair', color: '#f59e0b', width: '50%' };
    if (score === 3) return { label: 'Good', color: '#3b82f6', width: '75%' };
    return { label: 'Strong', color: '#22c55e', width: '100%' };
  };

  const strength = getStrength();

  return (
    <div className={`${styles.container} glass animate-fade-in`}>
      <div className={styles.displaySection}>
        <div className={styles.passwordOutput}>
          <span>{password}</span>
          <button onClick={copyToClipboard} className={styles.copyBtn} title="Copy to clipboard">
            <Copy size={20} />
          </button>
        </div>
        
        <div className={styles.strengthBar}>
          <div className={styles.progress} style={{ width: strength.width, backgroundColor: strength.color }}></div>
          <span className={styles.strengthLabel}>{strength.label}</span>
        </div>
      </div>

      <div className={styles.configSection}>
        <div className={styles.lengthGroup}>
          <div className={styles.labelRow}>
            <label>Password Length</label>
            <span>{length}</span>
          </div>
          <input 
            type="range" 
            min="6" 
            max="32" 
            value={length} 
            onChange={(e) => setLength(parseInt(e.target.value))}
            className={styles.rangeInput}
          />
        </div>

        <div className={styles.optionsGrid}>
          <label className={styles.checkbox}>
            <input 
              type="checkbox" 
              checked={options.uppercase} 
              onChange={() => setOptions(prev => ({ ...prev, uppercase: !prev.uppercase }))} 
            />
            <span>ABC</span>
          </label>
          <label className={styles.checkbox}>
            <input 
              type="checkbox" 
              checked={options.numbers} 
              onChange={() => setOptions(prev => ({ ...prev, numbers: !prev.numbers }))} 
            />
            <span>123</span>
          </label>
          <label className={styles.checkbox}>
            <input 
              type="checkbox" 
              checked={options.symbols} 
              onChange={() => setOptions(prev => ({ ...prev, symbols: !prev.symbols }))} 
            />
            <span>#$&</span>
          </label>
        </div>

        <button onClick={generatePassword} className={styles.generateBtn}>
          <RefreshCw size={20} /> Generate New
        </button>
      </div>
    </div>
  );
};

export default PasswordGenerator;

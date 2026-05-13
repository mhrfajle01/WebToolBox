import React, { useState, useCallback } from 'react';
import styles from './AgeCalculator.module.css';
import { Calendar, RefreshCcw, Copy } from 'lucide-react';
import { useToolActions } from '../../../hooks/useToolActions';
import { toast } from 'sonner';

const AgeCalculator: React.FC = () => {
  const [dob, setDob] = useState('');
  const [result, setResult] = useState<{ years: number; months: number; days: number } | null>(null);

  const calculateAge = () => {
    if (!dob) return;
    const birthDate = new Date(dob);
    const today = new Date();
    
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    if (days < 0) {
      months--;
      const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += lastMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    setResult({ years, months, days });
  };

  const handleReset = useCallback(() => {
    setDob('');
    setResult(null);
    toast.success('Tool reset');
  }, []);

  const handleCopy = useCallback(() => {
    if (!result) return;
    const text = `${result.years} years, ${result.months} months, ${result.days} days`;
    navigator.clipboard.writeText(text);
    toast.success('Age result copied to clipboard');
  }, [result]);

  const handleExport = useCallback(() => {
    if (!result) return;
    const text = `Age Calculation:\nDate of Birth: ${dob}\nAge: ${result.years} years, ${result.months} months, ${result.days} days`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'age-calculation.txt';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Result exported as text file');
  }, [dob, result]);

  useToolActions({
    onCopy: handleCopy,
    onReset: handleReset,
    onExport: handleExport
  });

  return (
    <div className={`${styles.toolContainer} glass animate-fade-in`}>
      <div className={styles.inputSection}>
        <div className={styles.inputGroup}>
          <label><Calendar size={18} /> Date of Birth</label>
          <input 
            type="date" 
            value={dob} 
            onChange={(e) => setDob(e.target.value)}
            className={styles.input}
          />
        </div>
        <div className={styles.actions}>
          <button onClick={calculateAge} className={styles.primaryBtn} disabled={!dob}>
            Calculate Age
          </button>
          <button onClick={handleReset} className={styles.secondaryBtn}>
            <RefreshCcw size={18} />
          </button>
        </div>
      </div>

      {result && (
        <div className={styles.resultSection}>
          <div className={styles.resultGrid}>
            <div className={styles.resultCard}>
              <span>{result.years}</span>
              <label>Years</label>
            </div>
            <div className={styles.resultCard}>
              <span>{result.months}</span>
              <label>Months</label>
            </div>
            <div className={styles.resultCard}>
              <span>{result.days}</span>
              <label>Days</label>
            </div>
          </div>
          <button className={styles.copyBtn} onClick={handleCopy}>
            <Copy size={16} /> Copy Result
          </button>
        </div>
      )}
    </div>
  );
};

export default AgeCalculator;

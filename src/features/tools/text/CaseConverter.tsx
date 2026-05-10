import React, { useState } from 'react';
import styles from './CaseConverter.module.css';
import { Type, Copy, Trash2, ArrowDown, ArrowUp } from 'lucide-react';
import { toast } from 'sonner';

const CaseConverter: React.FC = () => {
  const [text, setText] = useState('');

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const convert = (type: 'upper' | 'lower' | 'sentence' | 'title') => {
    if (!text) return;
    let result = '';
    switch (type) {
      case 'upper': result = text.toUpperCase(); break;
      case 'lower': result = text.toLowerCase(); break;
      case 'sentence': 
        result = text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase());
        break;
      case 'title':
        result = text.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        break;
    }
    setText(result);
    toast.success(`Converted to ${type} case`);
  };

  return (
    <div className={`${styles.container} glass animate-fade-in`}>
      <textarea 
        className={styles.textarea}
        placeholder="Type or paste your text here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div className={styles.stats}>
        <span>Words: {text.trim() ? text.trim().split(/\s+/).length : 0}</span>
        <span>Characters: {text.length}</span>
      </div>

      <div className={styles.buttonGrid}>
        <button onClick={() => convert('upper')} className={styles.btn}>UPPERCASE</button>
        <button onClick={() => convert('lower')} className={styles.btn}>lowercase</button>
        <button onClick={() => convert('sentence')} className={styles.btn}>Sentence case</button>
        <button onClick={() => convert('title')} className={styles.btn}>Title Case</button>
      </div>

      <div className={styles.footer}>
        <button onClick={handleCopy} className={styles.primaryBtn} disabled={!text}>
          <Copy size={18} /> Copy
        </button>
        <button onClick={() => setText('')} className={styles.secondaryBtn} disabled={!text}>
          <Trash2 size={18} /> Clear
        </button>
      </div>
    </div>
  );
};

export default CaseConverter;

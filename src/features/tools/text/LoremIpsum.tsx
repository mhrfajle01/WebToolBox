import React, { useState } from 'react';
import styles from './LoremIpsum.module.css';
import { Copy, Trash2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { useSound } from '../../../hooks/useSound';

const LOREM_TEXT = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

const LoremIpsum: React.FC = () => {
  const [paragraphs, setParagraphs] = useState(3);
  const [result, setResult] = useState('');
  const { play } = useSound();

  const generate = () => {
    const text = Array(paragraphs).fill(LOREM_TEXT).join('\n\n');
    setResult(text);
    play('success');
    toast.success(`Generated ${paragraphs} paragraphs`);
  };

  const handleCopy = () => {
    if (!result) return;
    play('click');
    navigator.clipboard.writeText(result);
    toast.success('Copied to clipboard');
  };

  return (
    <div className={`${styles.container} glass animate-fade-in`}>
      <div className={styles.config}>
        <div className={styles.inputGroup}>
          <label>Number of Paragraphs</label>
          <div className={styles.rangeWrapper}>
            <input 
              type="range" 
              min="1" 
              max="20" 
              value={paragraphs} 
              onChange={(e) => setParagraphs(parseInt(e.target.value))}
              className={styles.range}
            />
            <span className={styles.value}>{paragraphs}</span>
          </div>
        </div>
        <button onClick={generate} className={styles.primaryBtn}>
          <RefreshCw size={18} /> Generate
        </button>
      </div>

      <div className={styles.outputSection}>
        <textarea 
          className={styles.textarea}
          readOnly
          value={result}
          placeholder="Generated text will appear here..."
        />
        <div className={styles.actions}>
          <button onClick={handleCopy} className={styles.actionBtn} disabled={!result}>
            <Copy size={18} /> Copy All
          </button>
          <button onClick={() => setResult('')} className={styles.actionBtn} disabled={!result}>
            <Trash2 size={18} /> Clear
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoremIpsum;

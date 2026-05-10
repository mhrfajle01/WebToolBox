import React, { useState } from 'react';
import styles from './JsonFormatter.module.css';
import { Code, Copy, Trash2, AlignLeft, Minimize2 } from 'lucide-react';
import { toast } from 'sonner';

const JsonFormatter: React.FC = () => {
  const [json, setJson] = useState('');

  const format = () => {
    try {
      const obj = JSON.parse(json);
      setJson(JSON.stringify(obj, null, 2));
      toast.success('JSON formatted successfully');
    } catch (e: any) {
      toast.error('Invalid JSON: ' + e.message);
    }
  };

  const minify = () => {
    try {
      const obj = JSON.parse(json);
      setJson(JSON.stringify(obj));
      toast.success('JSON minified');
    } catch (e: any) {
      toast.error('Invalid JSON: ' + e.message);
    }
  };

  const handleCopy = () => {
    if (!json) return;
    navigator.clipboard.writeText(json);
    toast.success('Copied to clipboard');
  };

  return (
    <div className={`${styles.container} glass animate-fade-in`}>
      <textarea 
        className={styles.textarea}
        placeholder="Paste your JSON here..."
        value={json}
        onChange={(e) => setJson(e.target.value)}
      />

      <div className={styles.buttonGrid}>
        <button onClick={format} className={styles.btn}>
          <AlignLeft size={18} /> Format (Beautify)
        </button>
        <button onClick={minify} className={styles.btn}>
          <Minimize2 size={18} /> Minify
        </button>
      </div>

      <div className={styles.footer}>
        <button onClick={handleCopy} className={styles.primaryBtn} disabled={!json}>
          <Copy size={18} /> Copy
        </button>
        <button onClick={() => setJson('')} className={styles.secondaryBtn} disabled={!json}>
          <Trash2 size={18} /> Clear
        </button>
      </div>
    </div>
  );
};

export default JsonFormatter;

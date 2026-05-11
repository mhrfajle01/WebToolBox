import React, { useState } from 'react';
import styles from './JsonFormatter.module.css';
import { Copy, Trash2, AlignLeft, Minimize2 } from 'lucide-react';
import { toast } from 'sonner';

const JsonFormatter: React.FC = () => {
  const [json, setJson] = useState('');

  const format = () => {
    try {
      const obj = JSON.parse(json);
      setJson(JSON.stringify(obj, null, 2));
      toast.success('JSON formatted successfully');
    } catch (e) {
      toast.error('Invalid JSON: ' + (e instanceof Error ? e.message : String(e)));
    }
  };

  const minify = () => {
    try {
      const obj = JSON.parse(json);
      setJson(JSON.stringify(obj));
      toast.success('JSON minified');
    } catch (e) {
      toast.error('Invalid JSON: ' + (e instanceof Error ? e.message : String(e)));
    }
  };

  const handleCopy = (e: React.MouseEvent) => {
    if (!json) return;
    navigator.clipboard.writeText(json);
    toast.success('Copied to clipboard');

    // Dispatch burst event
    const event = new CustomEvent('success-burst', { 
      detail: { x: e.clientX, y: e.clientY } 
    });
    window.dispatchEvent(event);
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
        <button onClick={(e) => handleCopy(e)} className={styles.primaryBtn} disabled={!json}>
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

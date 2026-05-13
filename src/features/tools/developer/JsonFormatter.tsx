import React, { useState, useCallback } from 'react';
import styles from './JsonFormatter.module.css';
import { Copy, Trash2, AlignLeft, Minimize2 } from 'lucide-react';
import { toast } from 'sonner';
import { useToolActions } from '../../../hooks/useToolActions';

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

  const handleCopy = useCallback((e?: React.MouseEvent) => {
    if (!json) return;
    navigator.clipboard.writeText(json);
    toast.success('Copied to clipboard');

    // Dispatch burst event
    const x = e ? e.clientX : window.innerWidth / 2;
    const y = e ? e.clientY : window.innerHeight / 2;
    const event = new CustomEvent('success-burst', { 
      detail: { x, y } 
    });
    window.dispatchEvent(event);
  }, [json]);

  const handleReset = useCallback(() => {
    setJson('');
    toast.success('Tool reset');
  }, []);

  const handleExport = useCallback(() => {
    if (!json) return;
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted-json.json';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('JSON exported as file');
  }, [json]);

  useToolActions({
    onCopy: () => handleCopy(),
    onReset: handleReset,
    onExport: handleExport
  });

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
        <button onClick={handleReset} className={styles.secondaryBtn} disabled={!json}>
          <Trash2 size={18} /> Clear
        </button>
      </div>
    </div>
  );
};

export default JsonFormatter;

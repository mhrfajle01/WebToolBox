import React, { useState, useCallback } from 'react';
import styles from './ColorPicker.module.css';
import { Palette, Copy, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { useSound } from '../../../hooks/useSound';
import { useToolActions } from '../../../hooks/useToolActions';

const ColorPicker: React.FC = () => {
  const [color, setColor] = useState('#3b82f6');
  const { play } = useSound();

  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgb(${r}, ${g}, ${b})`;
  };

  const hexToHsl = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const l = (max + min) / 2;
    let h = 0;
    let s;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
  };

  const handleCopy = useCallback((e?: React.MouseEvent | null, value: string = color.toUpperCase()) => {
    play('success');
    navigator.clipboard.writeText(value);
    toast.success(`${value} copied!`);

    // Dispatch burst event
    const x = e ? (e as React.MouseEvent).clientX : window.innerWidth / 2;
    const y = e ? (e as React.MouseEvent).clientY : window.innerHeight / 2;
    const event = new CustomEvent('success-burst', { 
      detail: { x, y } 
    });
    window.dispatchEvent(event);
  }, [color, play]);

  const generateRandom = useCallback(() => {
    const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    play('click');
    setColor(randomColor);
  }, [play]);

  const handleExport = useCallback(() => {
    const text = `Color Palette:\nHEX: ${color.toUpperCase()}\nRGB: ${hexToRgb(color)}\nHSL: ${hexToHsl(color)}`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `color-${color.slice(1)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Color exported as text file');
  }, [color]);

  useToolActions({
    onCopy: () => handleCopy(null, color.toUpperCase()),
    onReset: () => {
      generateRandom();
      toast.success('Random color generated');
    },
    onExport: handleExport
  });

  return (
    <div className={`${styles.container} glass animate-fade-in`}>
      <div className={styles.pickerSection}>
        <div className={styles.preview} style={{ backgroundColor: color }}>
          <button onClick={generateRandom} className={styles.randomBtn}>
            <RefreshCw size={24} />
          </button>
        </div>
        <input 
          type="color" 
          value={color} 
          onChange={(e) => setColor(e.target.value)}
          className={styles.hiddenPicker}
          id="color-input"
        />
        <label htmlFor="color-input" className={styles.pickerLabel}>
          <Palette size={20} /> Select Color
        </label>
      </div>

      <div className={styles.valuesGrid}>
        <div className={styles.valueCard} onClick={(e) => handleCopy(e, color.toUpperCase())}>
          <label>HEX</label>
          <span>{color.toUpperCase()}</span>
          <Copy size={16} className={styles.copyIcon} />
        </div>
        <div className={styles.valueCard} onClick={(e) => handleCopy(e, hexToRgb(color))}>
          <label>RGB</label>
          <span>{hexToRgb(color)}</span>
          <Copy size={16} className={styles.copyIcon} />
        </div>
        <div className={styles.valueCard} onClick={(e) => handleCopy(e, hexToHsl(color))}>
          <label>HSL</label>
          <span>{hexToHsl(color)}</span>
          <Copy size={16} className={styles.copyIcon} />
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;

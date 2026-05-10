import React, { useState } from 'react';
import styles from './ColorPicker.module.css';
import { Palette, Copy, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { useSound } from '../../../hooks/useSound';

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
    let r = parseInt(hex.slice(1, 3), 16) / 255;
    let g = parseInt(hex.slice(3, 5), 16) / 255;
    let b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s, l = (max + min) / 2;

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

  const handleCopy = (value: string) => {
    play('success');
    navigator.clipboard.writeText(value);
    toast.success(`${value} copied!`);
  };

  const generateRandom = () => {
    const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    play('click');
    setColor(randomColor);
  };

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
        <div className={styles.valueCard} onClick={() => handleCopy(color.toUpperCase())}>
          <label>HEX</label>
          <span>{color.toUpperCase()}</span>
          <Copy size={16} className={styles.copyIcon} />
        </div>
        <div className={styles.valueCard} onClick={() => handleCopy(hexToRgb(color))}>
          <label>RGB</label>
          <span>{hexToRgb(color)}</span>
          <Copy size={16} className={styles.copyIcon} />
        </div>
        <div className={styles.valueCard} onClick={() => handleCopy(hexToHsl(color))}>
          <label>HSL</label>
          <span>{hexToHsl(color)}</span>
          <Copy size={16} className={styles.copyIcon} />
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;

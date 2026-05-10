import React, { useState, useEffect } from 'react';
import styles from './UnitConverter.module.css';
import { ArrowRightLeft, RefreshCw, Copy } from 'lucide-react';
import { toast } from 'sonner';

type UnitCategory = 'length' | 'mass' | 'temperature';

const units = {
  length: {
    meters: 1,
    kilometers: 0.001,
    centimeters: 100,
    millimeters: 1000,
    miles: 0.000621371,
    yards: 1.09361,
    feet: 3.28084,
    inches: 39.3701,
  },
  mass: {
    kilograms: 1,
    grams: 1000,
    milligrams: 1000000,
    pounds: 2.20462,
    ounces: 35.274,
  },
  temperature: {
    celsius: 'c',
    fahrenheit: 'f',
    kelvin: 'k',
  }
};

const UnitConverter: React.FC = () => {
  const [category, setCategory] = useState<UnitCategory>('length');
  const [value, setValue] = useState<string>('1');
  const [fromUnit, setFromUnit] = useState<string>('');
  const [toUnit, setToUnit] = useState<string>('');
  const [result, setResult] = useState<number | null>(null);

  useEffect(() => {
    const categoryUnits = Object.keys(units[category]);
    setFromUnit(categoryUnits[0]);
    setToUnit(categoryUnits[1] || categoryUnits[0]);
  }, [category]);

  const convert = () => {
    const val = parseFloat(value);
    if (isNaN(val)) return;

    if (category === 'temperature') {
      let celsius = val;
      if (fromUnit === 'fahrenheit') celsius = (val - 32) * 5/9;
      if (fromUnit === 'kelvin') celsius = val - 273.15;

      let finalResult = celsius;
      if (toUnit === 'fahrenheit') finalResult = (celsius * 9/5) + 32;
      if (toUnit === 'kelvin') finalResult = celsius + 273.15;
      
      setResult(finalResult);
    } else {
      const fromRate = (units[category] as any)[fromUnit];
      const toRate = (units[category] as any)[toUnit];
      const baseValue = val / fromRate;
      setResult(baseValue * toRate);
    }
  };

  useEffect(() => {
    convert();
  }, [value, fromUnit, toUnit, category]);

  const handleSwap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  const copyResult = () => {
    if (result !== null) {
      navigator.clipboard.writeText(result.toFixed(4));
      toast.success('Result copied to clipboard');
    }
  };

  return (
    <div className={`${styles.container} glass animate-fade-in`}>
      <div className={styles.categoryTabs}>
        {(['length', 'mass', 'temperature'] as UnitCategory[]).map(cat => (
          <button 
            key={cat}
            className={`${styles.tab} ${category === cat ? styles.activeTab : ''}`}
            onClick={() => setCategory(cat)}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      <div className={styles.converterBody}>
        <div className={styles.inputRow}>
          <div className={styles.inputGroup}>
            <input 
              type="number" 
              value={value} 
              onChange={(e) => setValue(e.target.value)}
              className={styles.input}
            />
            <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} className={styles.select}>
              {Object.keys(units[category]).map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>

          <button className={styles.swapBtn} onClick={handleSwap}>
            <ArrowRightLeft size={20} />
          </button>

          <div className={styles.inputGroup}>
            <div className={styles.resultDisplay}>
              {result !== null ? result.toLocaleString(undefined, { maximumFractionDigits: 4 }) : '0'}
            </div>
            <select value={toUnit} onChange={(e) => setToUnit(e.target.value)} className={styles.select}>
              {Object.keys(units[category]).map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
        </div>

        <div className={styles.footer}>
          <button className={styles.copyBtn} onClick={copyResult}>
            <Copy size={18} /> Copy Result
          </button>
          <button className={styles.resetBtn} onClick={() => setValue('1')}>
            <RefreshCw size={18} /> Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnitConverter;

import { useCallback } from 'react';

type SoundEffect = 'click' | 'success' | 'delete' | 'switch' | 'palette';

export const useSound = () => {
  const play = useCallback((effect: SoundEffect) => {
    const isSoundEnabled = localStorage.getItem('settings_sounds') !== 'false';
    if (!isSoundEnabled) return;

    const sounds: Record<SoundEffect, string> = {
      click: '/sounds/click.mp3',
      success: '/sounds/success.mp3',
      delete: '/sounds/click.mp3',
      switch: '/sounds/click.mp3',
      palette: '/sounds/success.mp3'
    };

    const audio = new Audio(sounds[effect]);
    audio.volume = 0.15;
    audio.play().catch(() => {});
  }, []);

  return { play };
};

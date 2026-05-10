import { useCallback } from 'react';

type SoundEffect = 'click' | 'success' | 'delete' | 'switch' | 'palette';

export const useSound = () => {
  const play = useCallback((effect: SoundEffect) => {
    const isSoundEnabled = localStorage.getItem('settings_sounds') !== 'false';
    if (!isSoundEnabled) return;

    const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, '');
    const sounds: Record<SoundEffect, string> = {
      click: `${baseUrl}/sounds/click.mp3`,
      success: `${baseUrl}/sounds/success.mp3`,
      delete: `${baseUrl}/sounds/click.mp3`,
      switch: `${baseUrl}/sounds/click.mp3`,
      palette: `${baseUrl}/sounds/success.mp3`
    };

    const audio = new Audio(sounds[effect]);
    audio.volume = 0.15;
    audio.play().catch(() => {});
  }, []);

  return { play };
};

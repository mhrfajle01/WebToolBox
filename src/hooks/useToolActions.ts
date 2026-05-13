import { useEffect } from 'react';

interface ToolActionHandlers {
  onCopy?: () => void;
  onReset?: () => void;
  onExport?: () => void;
}

export const useToolActions = ({ onCopy, onReset, onExport }: ToolActionHandlers) => {
  useEffect(() => {
    const handleAction = (event: Event) => {
      const customEvent = event as CustomEvent<string>;
      const action = customEvent.detail;

      switch (action) {
        case 'copy':
          onCopy?.();
          break;
        case 'reset':
          onReset?.();
          break;
        case 'export':
          onExport?.();
          break;
      }
    };

    window.addEventListener('tool-action', handleAction);
    return () => window.removeEventListener('tool-action', handleAction);
  }, [onCopy, onReset, onExport]);
};

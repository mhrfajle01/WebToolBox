import React, { useState, useRef, useEffect } from 'react';
import styles from './ToolBrowser.module.css';
import { 
  ArrowLeft, 
  RotateCw, 
  ExternalLink, 
  Copy, 
  Maximize2, 
  Minimize2,
  Lock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useSound } from '../../hooks/useSound';

interface ToolBrowserProps {
  url: string;
  name: string;
  icon?: string;
}

const ToolBrowser: React.FC<ToolBrowserProps> = ({ url, name, icon }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [key, setKey] = useState(0); // For forced refresh
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const navigate = useNavigate();
  const { play } = useSound();

  const handleRefresh = () => {
    play('click');
    setIsLoading(true);
    setKey(prev => prev + 1);
  };

  const handleCopyLink = () => {
    play('click');
    navigator.clipboard.writeText(url);
    toast.success('URL copied to clipboard');
  };

  const handleOpenExternal = () => {
    play('click');
    window.open(url, '_blank');
  };

  return (
    <div className={styles.browser}>
      <nav className={styles.navBar}>
        <div className={styles.navLeft}>
          <button className={styles.backBtn} onClick={() => navigate('/tools')}>
            <ArrowLeft size={20} />
          </button>
          <div className={styles.titleInfo}>
            {icon && <span style={{ fontSize: '1.2rem' }}>{icon}</span>}
            <h3>{name}</h3>
            <div className={styles.urlTag}>
              <Lock size={10} style={{ marginRight: '4px' }} />
              {new URL(url).hostname}
            </div>
          </div>
        </div>

        <div className={styles.navRight}>
          <button className={styles.actionBtn} onClick={handleRefresh} title="Refresh Tool">
            <RotateCw size={18} />
          </button>
          <button className={styles.actionBtn} onClick={handleCopyLink} title="Copy Tool Link">
            <Copy size={18} />
          </button>
          <button className={styles.actionBtn} onClick={handleOpenExternal} title="Open in New Tab">
            <ExternalLink size={18} />
          </button>
        </div>
      </nav>

      <div className={styles.iframeWrapper}>
        {isLoading && (
          <div className={styles.loaderOverlay}>
            <div className={styles.loadingSpinner} />
            <p>Connecting to tool interface...</p>
          </div>
        )}
        <iframe
          key={key}
          ref={iframeRef}
          src={url}
          className={styles.iframe}
          onLoad={() => setIsLoading(false)}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={name}
        />
      </div>
    </div>
  );
};

export default ToolBrowser;

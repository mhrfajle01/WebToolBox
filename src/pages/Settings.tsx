import React, { useState } from 'react';
import styles from './Settings.module.css';
import { 
  Volume2, 
  Monitor, 
  Shield, 
  Keyboard, 
  Database,
  Plus,
  Trash2,
  ExternalLink,
  Wrench,
  Check
} from 'lucide-react';
import { toast } from 'sonner';
import { useSound } from '../hooks/useSound';
import { useToolStore } from '../store/useToolStore';
import { useAuthStore } from '../store/useAuthStore';
import { toolRegistry } from '../lib/toolRegistry';
import AddCustomToolModal from '../components/ui/AddCustomToolModal';
import MainLayout from '../components/layout/MainLayout';
import { useNavigate } from 'react-router-dom';

const Settings: React.FC = () => {
  const { play } = useSound();
  const { user } = useAuthStore();
  const { customTools, quickTools, toggleQuickTool, removeCustomTool } = useToolStore();
  const [activeTab, setActiveTab] = useState('general');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  // Load initial states from localStorage
  const [soundEnabled, setSoundEnabled] = useState(() => localStorage.getItem('settings_sounds') !== 'false');
  const [hapticEnabled, setHapticEnabled] = useState(true);

  const handleToggleSound = (enabled: boolean) => {
    setSoundEnabled(enabled);
    localStorage.setItem('settings_sounds', enabled.toString());
    if (enabled) play('click');
    toast.success(`Sound effects ${enabled ? 'enabled' : 'disabled'}`);
  };

  const handleToggleQuickTool = async (toolId: string) => {
    if (!user) return;
    try {
      await toggleQuickTool(user.uid, toolId);
      play('click');
    } catch (error) {
      const err = error as Error;
      toast.error(err.message);
    }
  };

  const handleDeleteCustom = (toolId: string, name: string) => {
    if (user && window.confirm(`Remove "${name}" from your custom tools?`)) {
      removeCustomTool(user.uid, toolId);
      toast.info('Custom tool removed.');
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Monitor },
    { id: 'tools', label: 'My Tools', icon: Wrench },
    { id: 'sounds', label: 'Sensory', icon: Volume2 },
    { id: 'security', label: 'Privacy', icon: Shield },
    { id: 'shortcuts', label: 'Keyboard', icon: Keyboard },
    { id: 'data', label: 'Data', icon: Database },
  ];

  return (
    <MainLayout>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1>Settings</h1>
          <p>Configure WebToolBox to your workflow preferences.</p>
        </header>

        <div className={styles.layout}>
          <aside className={styles.sidebar}>
            {tabs.map(tab => (
              <button 
                key={tab.id}
                className={`${styles.tabBtn} ${activeTab === tab.id ? styles.activeTab : ''}`}
                onClick={() => { setActiveTab(tab.id); play('click'); }}
              >
                <tab.icon size={18} />
                <span>{tab.label}</span>
              </button>
            ))}
          </aside>

          <main className={`${styles.main} glass`}>
            {activeTab === 'general' && (
              <div className={styles.section}>
                <h3>Display Preferences</h3>
                <div className={styles.optionRow}>
                  <div className={styles.optionInfo}>
                    <label>Auto-Theme Detection</label>
                    <p>Sync app theme with your system settings.</p>
                  </div>
                  <div className={styles.toggle} onClick={() => toast.info("Feature coming soon!")}>
                    <div className={styles.toggleHandle} style={{ left: '2px' }} />
                  </div>
                </div>
                <div className={styles.optionRow}>
                  <div className={styles.optionInfo}>
                    <label>High Contrast</label>
                    <p>Increase accessibility by increasing contrast ratios.</p>
                  </div>
                  <div className={styles.toggle} onClick={() => toast.info("Feature coming soon!")}>
                    <div className={styles.toggleHandle} style={{ left: '2px' }} />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'tools' && (
              <div className={styles.section}>
                <div className={styles.subSection}>
                  <div className={styles.sectionHeader}>
                    <h3>Quick Tool System</h3>
                    <span className={styles.badge}>{quickTools.length}/4</span>
                  </div>
                  <p className={styles.helpText}>Choose up to 4 tools for your dashboard quick access.</p>
                  <div className={styles.quickToolGrid}>
                    {toolRegistry.map(tool => (
                      <button 
                        key={tool.id}
                        className={`${styles.quickToolItem} ${quickTools.includes(tool.id) ? styles.quickToolActive : ''}`}
                        onClick={() => handleToggleQuickTool(tool.id)}
                      >
                        <div className={styles.quickToolIcon}>
                          <tool.icon size={20} />
                        </div>
                        <span className={styles.quickToolName}>{tool.name}</span>
                        {quickTools.includes(tool.id) && <div className={styles.checkIcon}><Check size={12} /></div>}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={styles.divider} />

                <div className={styles.subSection}>
                  <div className={styles.sectionHeader}>
                    <h3>Custom Tools</h3>
                    <button className={styles.addBtn} onClick={() => setIsModalOpen(true)}>
                      <Plus size={16} /> Add New Tool
                    </button>
                  </div>
                  
                  <div className={styles.toolList}>
                    {customTools.length > 0 ? (
                      customTools.map(tool => (
                        <div key={tool.id} className={styles.toolItem}>
                          <div className={styles.toolIcon}>{tool.icon}</div>
                          <div className={styles.toolInfo}>
                            <h4>{tool.name}</h4>
                            <p>{tool.url}</p>
                          </div>
                          <div className={styles.toolActions}>
                            <button className={styles.iconBtn} onClick={() => navigate(`/tools/${tool.id}`)} title="Launch Tool">
                              <ExternalLink size={16} />
                            </button>
                            <button className={styles.iconBtn} onClick={() => handleDeleteCustom(tool.id, tool.name)} title="Remove Tool">
                              <Trash2 size={16} color="#ef4444" />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className={styles.emptyTools}>
                        <p>You haven't added any custom tools yet.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'sounds' && (
              <div className={styles.section}>
                <h3>Sensory Feedback</h3>
                <div className={styles.optionRow}>
                  <div className={styles.optionInfo}>
                    <label>Sound Effects</label>
                    <p>Enable subtle audio feedback for interactions.</p>
                  </div>
                  <div 
                    className={`${styles.toggle} ${soundEnabled ? styles.toggleOn : ''}`}
                    onClick={() => handleToggleSound(!soundEnabled)}
                  >
                    <div className={styles.toggleHandle} style={{ left: soundEnabled ? 'calc(100% - 22px)' : '2px' }} />
                  </div>
                </div>
                <div className={styles.optionRow}>
                  <div className={styles.optionInfo}>
                    <label>Tactile Haptics</label>
                    <p>Vibrate on mobile devices for key actions.</p>
                  </div>
                  <div 
                    className={`${styles.toggle} ${hapticEnabled ? styles.toggleOn : ''}`}
                    onClick={() => setHapticEnabled(!hapticEnabled)}
                  >
                    <div className={styles.toggleHandle} style={{ left: hapticEnabled ? 'calc(100% - 22px)' : '2px' }} />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className={styles.section}>
                <h3>Privacy & Security</h3>
                <div className={styles.optionRow}>
                  <div className={styles.optionInfo}>
                    <label>Share Usage Data</label>
                    <p>Anonymously share tool usage to help us improve.</p>
                  </div>
                  <div className={styles.toggle} onClick={() => toast.info("Data sharing is disabled by default.")}>
                    <div className={styles.toggleHandle} style={{ left: '2px' }} />
                  </div>
                </div>
                <button className={styles.dangerBtn}>Revoke All Sessions</button>
              </div>
            )}

            {['shortcuts', 'data'].includes(activeTab) && (
              <div className={styles.placeholder}>
                <Monitor size={48} />
                <p>Additional configuration options for <strong>{activeTab}</strong> are being developed.</p>
              </div>
            )}
          </main>
        </div>

        <AddCustomToolModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    </MainLayout>
  );
};

export default Settings;

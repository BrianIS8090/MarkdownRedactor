import { useAppStore } from '../../stores/appStore';
import { getTranslations } from '../../i18n';
import { openUrl } from '@tauri-apps/plugin-opener';
import './about.css';

const VERSION = '0.1.0';
const GITHUB_URL = 'https://github.com/BrianIS8090/';
const EMAIL = 'ilmir8090@gmail.com';

interface AboutDialogProps {
  onClose: () => void;
}

export function AboutDialog({ onClose }: AboutDialogProps) {
  const language = useAppStore((s) => s.language);
  const t = getTranslations(language);

  const handleOpenLink = async (url: string) => {
    try {
      await openUrl(url);
    } catch (e) {
      console.error('Ошибка открытия ссылки:', e);
    }
  };

  return (
    <div className="about-overlay" onClick={onClose}>
      <div className="about-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="about-header">
          <div className="about-icon">📝</div>
          <h2>Markdown Redactor</h2>
          <span className="about-version">{t.version}: {VERSION}</span>
        </div>
        
        <div className="about-content">
          <p className="about-description">{t.description}</p>
          
          <div className="about-section">
            <h3>{t.license}</h3>
            <p>{t.mitLicense}</p>
          </div>
          
          <div className="about-section">
            <h3>{t.author}</h3>
            <p>BrianIS</p>
          </div>
          
          <div className="about-section">
            <h3>{t.contact}</h3>
            <div className="about-links">
              <button 
                className="about-link" 
                onClick={() => handleOpenLink(GITHUB_URL)}
              >
                GitHub
              </button>
              <button 
                className="about-link" 
                onClick={() => handleOpenLink(`mailto:${EMAIL}`)}
              >
                {EMAIL}
              </button>
            </div>
          </div>
        </div>
        
        <div className="about-footer">
          <button className="about-close-btn" onClick={onClose}>
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
}

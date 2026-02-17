import { useState } from 'react';
import { useFile } from '../../hooks/useFile';
import { useSettings } from '../../hooks/useSettings';
import { useTheme } from '../../hooks/useTheme';
import { useAppStore } from '../../stores/appStore';
import { getTranslations } from '../../i18n';
import { HelpDialog } from '../Help/HelpDialog';
import { printToPdf } from '../../utils/pdfExport';
import './toolbar.css';

const FONT_OPTIONS = [
  'Segoe UI Variable',
  'Cascadia Code',
  'Consolas',
  'Arial',
  'Georgia',
  'Times New Roman',
  'Courier New',
];

export function Toolbar() {
  const [showHelp, setShowHelp] = useState(false);
  const { open, save, saveAs } = useFile();
  const { fontFamily, fontSize, language, changeFontFamily, changeFontSize, changeLanguage } = useSettings();
  const { theme, toggleTheme } = useTheme();
  const editorMode = useAppStore((s) => s.editorMode);
  const setEditorMode = useAppStore((s) => s.setEditorMode);
  const content = useAppStore((s) => s.content);
  
  const t = getTranslations(language);

  const themeLabel = theme === 'light' ? t.themeLight : theme === 'dark' ? t.themeDark : t.themeSystem;
  const modeLabel = editorMode === 'visual' ? t.visualMode : t.sourceMode;
  const langLabel = language === 'ru' ? 'RU' : 'EN';

  const toggleLanguage = () => {
    changeLanguage(language === 'ru' ? 'en' : 'ru');
  };

  const handlePrint = () => {
    printToPdf(content);
  };

  return (
    <>
      <div className="toolbar">
        <div className="toolbar-group">
          <button className="toolbar-btn" onClick={open} title={t.openTooltip}>
            {t.open}
          </button>
          <button className="toolbar-btn" onClick={save} title={t.saveTooltip}>
            {t.save}
          </button>
          <button className="toolbar-btn" onClick={saveAs} title={t.saveAsTooltip}>
            {t.saveAs}
          </button>
          <button className="toolbar-btn" onClick={handlePrint} title={t.printTooltip}>
            {t.print}
          </button>
        </div>

        <div className="toolbar-separator" />

        <div className="toolbar-group">
          <select
            className="toolbar-select"
            value={fontFamily}
            onChange={(e) => changeFontFamily(e.target.value)}
            title={t.fontTooltip}
          >
            {FONT_OPTIONS.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>

          <div className="toolbar-font-size">
            <button
              className="toolbar-btn-sm"
              onClick={() => changeFontSize(fontSize - 1)}
              title={t.decreaseFontTooltip}
            >
              −
            </button>
            <span className="toolbar-font-size-value">{fontSize}</span>
            <button
              className="toolbar-btn-sm"
              onClick={() => changeFontSize(fontSize + 1)}
              title={t.increaseFontTooltip}
            >
              +
            </button>
          </div>
        </div>

        <div className="toolbar-separator" />

        <div className="toolbar-group">
          <button
            className="toolbar-btn"
            onClick={toggleTheme}
            title={t.themeTooltip}
          >
            {themeLabel}
          </button>

          <button
            className="toolbar-btn"
            onClick={() => setEditorMode(editorMode === 'visual' ? 'source' : 'visual')}
            title={t.modeTooltip}
          >
            {modeLabel}
          </button>
        </div>

        <div className="toolbar-spacer" />

        <div className="toolbar-group">
          <button
            className="toolbar-btn"
            onClick={() => setShowHelp(true)}
          >
            {t.help}
          </button>
          <button
            className="toolbar-btn toolbar-lang-btn"
            onClick={toggleLanguage}
            title={language === 'ru' ? 'Switch to English' : 'Переключить на русский'}
          >
            {langLabel}
          </button>
        </div>
      </div>

      {showHelp && <HelpDialog onClose={() => setShowHelp(false)} />}
    </>
  );
}

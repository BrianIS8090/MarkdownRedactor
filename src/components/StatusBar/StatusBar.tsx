import { useAppStore } from '../../stores/appStore';
import { getTranslations, pluralize } from '../../i18n';
import './statusbar.css';

export function StatusBar() {
  const filePath = useAppStore((s) => s.filePath);
  const content = useAppStore((s) => s.content);
  const editorMode = useAppStore((s) => s.editorMode);
  const language = useAppStore((s) => s.language);
  const t = getTranslations(language);

  // Подсчёт слов и символов
  const text = content.trim();
  const wordCount = text ? text.split(/\s+/).length : 0;
  const charCount = content.length;

  const wordLabelStr = pluralize(wordCount, t.words);
  const charLabelStr = pluralize(charCount, t.chars);
  const modeLabel = editorMode === 'visual' ? t.visualMode : t.sourceMode;

  return (
    <div className="statusbar">
      <div className="statusbar-left">
        <span className="statusbar-path" title={filePath ?? ''}>
          {filePath ?? t.newFile}
        </span>
      </div>
      <div className="statusbar-right">
        <span className="statusbar-item">
          {modeLabel}
        </span>
        <span className="statusbar-item">
          {wordCount} {wordLabelStr} · {charCount} {charLabelStr}
        </span>
      </div>
    </div>
  );
}

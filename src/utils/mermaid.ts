import mermaid from 'mermaid';

let counter = 0;

// Определяет текущую тему по атрибуту data-theme на <html>
function isDarkTheme(): boolean {
  return document.documentElement.getAttribute('data-theme') === 'dark';
}

// Инициализирует mermaid с учётом текущей темы
function ensureInit() {
  const theme = isDarkTheme() ? 'dark' : 'default';
  mermaid.initialize({
    startOnLoad: false,
    theme,
    securityLevel: 'loose',
    fontFamily: "'Segoe UI Variable', 'Segoe UI', sans-serif",
  });
}

// Генерирует уникальный ID для рендеринга
export function generateMermaidId(): string {
  return `mermaid-${Date.now()}-${counter++}`;
}

// Стили внутри Shadow DOM для изоляции от ProseMirror CSS
const SHADOW_STYLES = `
  :host {
    display: flex;
    justify-content: center;
    padding: 16px;
    min-height: 48px;
    align-items: center;
  }
  svg {
    max-width: 100%;
    height: auto;
  }
`;

const ERROR_STYLES = `
  :host {
    display: flex;
    justify-content: center;
    padding: 16px;
    min-height: 48px;
    align-items: center;
    color: var(--crepe-color-error, #ba1a1a);
    font-size: 0.875em;
  }
`;

// Рендерит mermaid-диаграмму асинхронно через колбэк applyPreview
// Shadow DOM изолирует SVG от CSS ProseMirror
export function renderMermaidPreview(
  content: string,
  applyPreview: (el: HTMLElement) => void,
): undefined | null {
  if (!content.trim()) return null;

  ensureInit();

  const id = generateMermaidId();

  mermaid.render(id, content.trim()).then(({ svg }) => {
    const container = document.createElement('div');
    container.className = 'mermaid-preview';
    const shadow = container.attachShadow({ mode: 'open' });
    shadow.innerHTML = `<style>${SHADOW_STYLES}</style>${svg}`;
    applyPreview(container);
  }).catch(() => {
    const container = document.createElement('div');
    container.className = 'mermaid-preview mermaid-preview-error';
    const shadow = container.attachShadow({ mode: 'open' });
    shadow.innerHTML = `<style>${ERROR_STYLES}</style><span>Ошибка синтаксиса Mermaid</span>`;
    applyPreview(container);
  });

  return undefined;
}

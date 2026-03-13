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
    fontFamily: "'Segoe UI Variable', 'Segoe UI', sans-serif",
  });
}

// Генерирует уникальный ID для рендеринга
export function generateMermaidId(): string {
  return `mermaid-${Date.now()}-${counter++}`;
}

// Исправляет текст внутри foreignObject, который ломается CSS ProseMirror
function fixForeignObjectStyles(container: HTMLElement) {
  container.querySelectorAll('foreignObject div, foreignObject span, foreignObject p').forEach(el => {
    const htmlEl = el as HTMLElement;
    if (!htmlEl.style.color) {
      htmlEl.style.color = '#333';
    }
    htmlEl.style.fontSize = '14px';
    htmlEl.style.lineHeight = '1.4';
    htmlEl.style.overflow = 'visible';
    htmlEl.style.whiteSpace = 'normal';
    htmlEl.style.visibility = 'visible';
  });
}

// Рендерит mermaid-диаграмму асинхронно через колбэк applyPreview
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
    container.innerHTML = svg;
    fixForeignObjectStyles(container);
    applyPreview(container);
  }).catch(() => {
    const container = document.createElement('div');
    container.className = 'mermaid-preview mermaid-preview-error';
    container.textContent = 'Ошибка синтаксиса Mermaid';
    applyPreview(container);
  });

  return undefined;
}

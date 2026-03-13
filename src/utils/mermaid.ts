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

// Рендерит mermaid-диаграмму асинхронно через колбэк applyPreview.
// Используем iframe для полной изоляции SVG от CSS ProseMirror/Milkdown.
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

    const iframe = document.createElement('iframe');
    iframe.style.border = 'none';
    iframe.style.width = '100%';
    iframe.style.display = 'block';
    iframe.style.overflow = 'hidden';
    iframe.srcdoc = [
      '<!DOCTYPE html><html><head>',
      '<style>',
      'body { margin: 0; display: flex; justify-content: center; background: transparent; }',
      'svg { max-width: 100%; height: auto; }',
      '</style>',
      '</head><body>',
      svg,
      '<script>',
      'new ResizeObserver(() => {',
      '  window.parent.postMessage({ type: "mermaid-resize", height: document.body.scrollHeight }, "*");',
      '}).observe(document.body);',
      '</script>',
      '</body></html>',
    ].join('');

    // Авторесайз iframe под содержимое
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === 'mermaid-resize' && e.source === iframe.contentWindow) {
        iframe.style.height = e.data.height + 'px';
      }
    };
    window.addEventListener('message', handleMessage);

    // Запасной авторесайз через onload
    iframe.onload = () => {
      const doc = iframe.contentDocument;
      if (doc) {
        iframe.style.height = doc.body.scrollHeight + 'px';
      }
    };

    container.appendChild(iframe);
    applyPreview(container);
  }).catch(() => {
    const container = document.createElement('div');
    container.className = 'mermaid-preview mermaid-preview-error';
    container.textContent = 'Ошибка синтаксиса Mermaid';
    applyPreview(container);
  });

  return undefined;
}

import mermaid from 'mermaid';

let initialized = false;
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
  initialized = true;
}

// Рендерит mermaid-диаграмму в HTMLElement
export function renderMermaidPreview(content: string): HTMLElement | null {
  if (!content.trim()) return null;

  const container = document.createElement('div');
  container.className = 'mermaid-preview';
  container.textContent = 'Загрузка диаграммы...';

  // Реинициализируем при каждом рендере для актуальной темы
  ensureInit();

  const id = `mermaid-${Date.now()}-${counter++}`;

  mermaid.render(id, content.trim()).then(({ svg }) => {
    container.innerHTML = svg;
  }).catch(() => {
    container.textContent = 'Ошибка синтаксиса Mermaid';
    container.classList.add('mermaid-preview-error');
  });

  return container;
}

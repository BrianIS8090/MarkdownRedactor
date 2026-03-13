import { describe, it, expect, vi, beforeEach } from 'vitest';

// Мок mermaid до импорта утилиты
vi.mock('mermaid', () => ({
  default: {
    initialize: vi.fn(),
    render: vi.fn(),
  },
}));

import mermaid from 'mermaid';
import { renderMermaidPreview } from '../utils/mermaid';

describe('renderMermaidPreview', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.documentElement.removeAttribute('data-theme');
  });

  it('возвращает null при пустом содержимом', () => {
    expect(renderMermaidPreview('')).toBeNull();
    expect(renderMermaidPreview('   ')).toBeNull();
  });

  it('возвращает HTMLElement-контейнер', () => {
    vi.mocked(mermaid.render).mockResolvedValue({ svg: '<svg></svg>', bindFunctions: undefined });

    const result = renderMermaidPreview('graph TD; A-->B');

    expect(result).toBeInstanceOf(HTMLDivElement);
    expect(result!.className).toBe('mermaid-preview');
  });

  it('инициализирует mermaid со светлой темой по умолчанию', () => {
    vi.mocked(mermaid.render).mockResolvedValue({ svg: '<svg></svg>', bindFunctions: undefined });

    renderMermaidPreview('graph TD; A-->B');

    expect(mermaid.initialize).toHaveBeenCalledWith(
      expect.objectContaining({ theme: 'default', startOnLoad: false })
    );
  });

  it('инициализирует mermaid с тёмной темой', () => {
    document.documentElement.setAttribute('data-theme', 'dark');
    vi.mocked(mermaid.render).mockResolvedValue({ svg: '<svg></svg>', bindFunctions: undefined });

    renderMermaidPreview('graph TD; A-->B');

    expect(mermaid.initialize).toHaveBeenCalledWith(
      expect.objectContaining({ theme: 'dark' })
    );
  });

  it('вставляет SVG после рендеринга', async () => {
    const svgContent = '<svg><text>Диаграмма</text></svg>';
    vi.mocked(mermaid.render).mockResolvedValue({ svg: svgContent, bindFunctions: undefined });

    const container = renderMermaidPreview('graph TD; A-->B')!;

    // Ждём завершения промиса рендеринга
    await vi.waitFor(() => {
      expect(container.innerHTML).toBe(svgContent);
    });
  });

  it('показывает ошибку при невалидном синтаксисе', async () => {
    vi.mocked(mermaid.render).mockRejectedValue(new Error('Parse error'));

    const container = renderMermaidPreview('невалидный синтаксис')!;

    await vi.waitFor(() => {
      expect(container.textContent).toBe('Ошибка синтаксиса Mermaid');
      expect(container.classList.contains('mermaid-preview-error')).toBe(true);
    });
  });

  it('вызывает mermaid.render с уникальным id', () => {
    vi.mocked(mermaid.render).mockResolvedValue({ svg: '<svg></svg>', bindFunctions: undefined });

    renderMermaidPreview('graph TD; A-->B');
    renderMermaidPreview('graph LR; C-->D');

    const calls = vi.mocked(mermaid.render).mock.calls;
    expect(calls).toHaveLength(2);
    // ID должны быть разные
    expect(calls[0][0]).not.toBe(calls[1][0]);
  });
});

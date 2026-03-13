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
    const applyPreview = vi.fn();
    expect(renderMermaidPreview('', applyPreview)).toBeNull();
    expect(renderMermaidPreview('   ', applyPreview)).toBeNull();
    expect(applyPreview).not.toHaveBeenCalled();
  });

  it('возвращает undefined для асинхронного рендеринга', () => {
    vi.mocked(mermaid.render).mockResolvedValue({ svg: '<svg></svg>', bindFunctions: undefined });
    const applyPreview = vi.fn();

    const result = renderMermaidPreview('graph TD; A-->B', applyPreview);

    expect(result).toBeUndefined();
  });

  it('инициализирует mermaid со светлой темой по умолчанию', () => {
    vi.mocked(mermaid.render).mockResolvedValue({ svg: '<svg></svg>', bindFunctions: undefined });

    renderMermaidPreview('graph TD; A-->B', vi.fn());

    expect(mermaid.initialize).toHaveBeenCalledWith(
      expect.objectContaining({ theme: 'default', startOnLoad: false })
    );
  });

  it('инициализирует mermaid с тёмной темой', () => {
    document.documentElement.setAttribute('data-theme', 'dark');
    vi.mocked(mermaid.render).mockResolvedValue({ svg: '<svg></svg>', bindFunctions: undefined });

    renderMermaidPreview('graph TD; A-->B', vi.fn());

    expect(mermaid.initialize).toHaveBeenCalledWith(
      expect.objectContaining({ theme: 'dark' })
    );
  });

  it('вызывает applyPreview с SVG после рендеринга', async () => {
    const svgContent = '<svg><text>Диаграмма</text></svg>';
    vi.mocked(mermaid.render).mockResolvedValue({ svg: svgContent, bindFunctions: undefined });
    const applyPreview = vi.fn();

    renderMermaidPreview('graph TD; A-->B', applyPreview);

    await vi.waitFor(() => {
      expect(applyPreview).toHaveBeenCalledTimes(1);
    });

    const container = applyPreview.mock.calls[0][0] as HTMLElement;
    expect(container.className).toBe('mermaid-preview');
    expect(container.innerHTML).toBe(svgContent);
  });

  it('вызывает applyPreview с ошибкой при невалидном синтаксисе', async () => {
    vi.mocked(mermaid.render).mockRejectedValue(new Error('Parse error'));
    const applyPreview = vi.fn();

    renderMermaidPreview('невалидный синтаксис', applyPreview);

    await vi.waitFor(() => {
      expect(applyPreview).toHaveBeenCalledTimes(1);
    });

    const container = applyPreview.mock.calls[0][0] as HTMLElement;
    expect(container.textContent).toBe('Ошибка синтаксиса Mermaid');
    expect(container.classList.contains('mermaid-preview-error')).toBe(true);
  });

  it('вызывает mermaid.render с уникальным id', () => {
    vi.mocked(mermaid.render).mockResolvedValue({ svg: '<svg></svg>', bindFunctions: undefined });

    renderMermaidPreview('graph TD; A-->B', vi.fn());
    renderMermaidPreview('graph LR; C-->D', vi.fn());

    const calls = vi.mocked(mermaid.render).mock.calls;
    expect(calls).toHaveLength(2);
    expect(calls[0][0]).not.toBe(calls[1][0]);
  });
});

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTheme } from '../hooks/useTheme';
import { useAppStore } from '../stores/appStore';

describe('useTheme', () => {
  beforeEach(() => {
    useAppStore.setState({ theme: 'system' });
    document.documentElement.removeAttribute('data-theme');
  });

  it('должен определять системную тему при theme="system"', () => {
    // Мокаем matchMedia для светлой темы
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: query === '(prefers-color-scheme: dark)' ? false : true,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    });

    const { result } = renderHook(() => useTheme());
    expect(result.current.resolvedTheme).toBe('light');
    expect(result.current.theme).toBe('system');
  });

  it('должен возвращать dark при theme="dark"', () => {
    useAppStore.setState({ theme: 'dark' });
    const { result } = renderHook(() => useTheme());
    expect(result.current.resolvedTheme).toBe('dark');
    expect(result.current.theme).toBe('dark');
  });

  it('должен возвращать light при theme="light"', () => {
    useAppStore.setState({ theme: 'light' });
    const { result } = renderHook(() => useTheme());
    expect(result.current.resolvedTheme).toBe('light');
    expect(result.current.theme).toBe('light');
  });

  it('toggleTheme — должен циклически переключать тему', () => {
    useAppStore.setState({ theme: 'light' });
    const { result } = renderHook(() => useTheme());

    act(() => result.current.toggleTheme());
    expect(useAppStore.getState().theme).toBe('dark');

    act(() => result.current.toggleTheme());
    expect(useAppStore.getState().theme).toBe('system');

    act(() => result.current.toggleTheme());
    expect(useAppStore.getState().theme).toBe('light');
  });

  it('должен устанавливать data-theme атрибут на html', () => {
    useAppStore.setState({ theme: 'dark' });
    renderHook(() => useTheme());
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });
});

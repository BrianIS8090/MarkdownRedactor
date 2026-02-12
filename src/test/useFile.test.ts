import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFile } from '../hooks/useFile';
import { useAppStore } from '../stores/appStore';
import { invoke } from '@tauri-apps/api/core';

const mockedInvoke = vi.mocked(invoke);

describe('useFile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAppStore.setState({
      filePath: null,
      content: '',
      isDirty: false,
    });
  });

  it('open — должен загрузить файл и обновить состояние', async () => {
    mockedInvoke.mockResolvedValueOnce({
      path: 'C:\\test\\file.md',
      content: '# Тест',
    });

    const { result } = renderHook(() => useFile());

    await act(async () => {
      await result.current.open();
    });

    const state = useAppStore.getState();
    expect(state.filePath).toBe('C:\\test\\file.md');
    expect(state.content).toBe('# Тест');
    expect(state.isDirty).toBe(false);
  });

  it('open — при отмене диалога не должен менять состояние', async () => {
    mockedInvoke.mockRejectedValueOnce('Файл не выбран');

    const { result } = renderHook(() => useFile());

    await act(async () => {
      await result.current.open();
    });

    const state = useAppStore.getState();
    expect(state.filePath).toBeNull();
    expect(state.content).toBe('');
  });

  it('save — при наличии пути должен сохранить файл', async () => {
    useAppStore.setState({
      filePath: 'C:\\test\\file.md',
      content: '# Привет',
      isDirty: true,
    });
    mockedInvoke.mockResolvedValueOnce(true);

    const { result } = renderHook(() => useFile());

    await act(async () => {
      await result.current.save();
    });

    expect(mockedInvoke).toHaveBeenCalledWith('save_file', {
      path: 'C:\\test\\file.md',
      content: '# Привет',
    });
    expect(useAppStore.getState().isDirty).toBe(false);
  });

  it('save — без пути должен вызывать saveAs', async () => {
    useAppStore.setState({
      filePath: null,
      content: '# Новый файл',
      isDirty: true,
    });
    mockedInvoke.mockResolvedValueOnce('C:\\test\\new.md');

    const { result } = renderHook(() => useFile());

    await act(async () => {
      await result.current.save();
    });

    expect(mockedInvoke).toHaveBeenCalledWith('save_file_as', {
      content: '# Новый файл',
    });
  });

  it('saveAs — должен сохранить файл и обновить путь', async () => {
    useAppStore.setState({
      content: '# Сохранить как',
      isDirty: true,
    });
    mockedInvoke.mockResolvedValueOnce('C:\\test\\saved.md');

    const { result } = renderHook(() => useFile());

    await act(async () => {
      await result.current.saveAs();
    });

    const state = useAppStore.getState();
    expect(state.filePath).toBe('C:\\test\\saved.md');
    expect(state.isDirty).toBe(false);
  });
});

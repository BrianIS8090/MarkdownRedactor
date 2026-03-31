import { useCallback } from 'react';
import { useAppStore } from '../stores/appStore';
import * as tauri from '../utils/tauri';
import { findBaseDir, pickAndFormatAsset } from '../utils/paths';

export function useFile() {
  const {
    filePath,
    baseDir,
    content,
    isDirty,
    setContent,
    setFilePath,
    setBaseDir,
    setDirty,
  } = useAppStore();

  const open = useCallback(async () => {
    try {
      const file = await tauri.openFile();
      // Вычислить baseDir ДО установки контента,
      // чтобы редактор пересоздался с корректным baseDir
      const base = await findBaseDir(file.path);
      setFilePath(file.path);
      setBaseDir(base);
      setContent(file.content);
      setDirty(false);
    } catch {
      // Пользователь отменил диалог или произошла ошибка
    }
  }, [setContent, setDirty, setFilePath, setBaseDir]);

  const save = useCallback(async () => {
    if (!filePath) {
      return saveAs();
    }
    try {
      await tauri.saveFile(filePath, content);
      setDirty(false);
    } catch (e) {
      console.error('Ошибка сохранения:', e);
    }
  }, [filePath, content, setDirty]);

  const saveAs = useCallback(async () => {
    try {
      const path = await tauri.saveFileAs(content);
      if (path) {
        setFilePath(path);
        setDirty(false);
      }
    } catch (e) {
      console.error('Ошибка сохранения:', e);
    }
  }, [content, setDirty, setFilePath]);

  const reload = useCallback(async () => {
    if (!filePath) return;
    try {
      const text = await tauri.readFile(filePath);
      setContent(text);
      setDirty(false);
    } catch (e) {
      console.error('Ошибка перезагрузки:', e);
    }
  }, [filePath, setContent, setDirty]);

  // Выбрать файл из assets/ и вернуть готовый markdown
  const insertAsset = useCallback(async (): Promise<string | null> => {
    try {
      return await pickAndFormatAsset(baseDir);
    } catch {
      return null;
    }
  }, [baseDir]);

  return { filePath, content, isDirty, open, save, saveAs, reload, insertAsset, setContent };
}

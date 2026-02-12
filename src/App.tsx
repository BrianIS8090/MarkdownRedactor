import { useEffect, useCallback } from 'react';
import { TitleBar } from './components/TitleBar/TitleBar';
import { Toolbar } from './components/Toolbar/Toolbar';
import { Editor } from './components/Editor/Editor';
import { StatusBar } from './components/StatusBar/StatusBar';
import { useFile } from './hooks/useFile';
import { useSettings } from './hooks/useSettings';
import { useTheme } from './hooks/useTheme';
import { useAppStore } from './stores/appStore';
import * as tauri from './utils/tauri';
import './App.css';

function App() {
  const { open, save, saveAs } = useFile();
  const { changeFontSize, fontSize } = useSettings();
  const { toggleTheme } = useTheme();
  const editorMode = useAppStore((s) => s.editorMode);
  const setEditorMode = useAppStore((s) => s.setEditorMode);

  // Обработка открытия файла через ассоциацию (Windows)
  // Запрашиваем при монтировании приложения
  useEffect(() => {
    tauri.getPendingFile().then(async (filePath) => {
      if (filePath) {
        try {
          const content = await tauri.readFile(filePath);
          useAppStore.getState().setFilePath(filePath);
          useAppStore.getState().setContent(content);
          useAppStore.getState().setDirty(false);
        } catch (e) {
          console.error('Ошибка открытия файла:', e);
        }
      }
    });
  }, []);

  // Горячие клавиши
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Ctrl+O — Открыть файл
    if (e.ctrlKey && e.key === 'o') {
      e.preventDefault();
      open();
    }
    // Ctrl+S — Сохранить
    if (e.ctrlKey && !e.shiftKey && e.key === 's') {
      e.preventDefault();
      save();
    }
    // Ctrl+Shift+S — Сохранить как
    if (e.ctrlKey && e.shiftKey && e.key === 'S') {
      e.preventDefault();
      saveAs();
    }
    // Ctrl+Shift+T — Переключить тему
    if (e.ctrlKey && e.shiftKey && e.key === 'T') {
      e.preventDefault();
      toggleTheme();
    }
    // Ctrl+/ — Переключить режим редактора
    if (e.ctrlKey && e.key === '/') {
      e.preventDefault();
      setEditorMode(editorMode === 'visual' ? 'source' : 'visual');
    }
    // Ctrl+= или Ctrl++ — Увеличить шрифт
    if (e.ctrlKey && (e.key === '=' || e.key === '+')) {
      e.preventDefault();
      changeFontSize(fontSize + 1);
    }
    // Ctrl+- — Уменьшить шрифт
    if (e.ctrlKey && e.key === '-') {
      e.preventDefault();
      changeFontSize(fontSize - 1);
    }
  }, [open, save, saveAs, toggleTheme, editorMode, setEditorMode, changeFontSize, fontSize]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="app">
      <TitleBar />
      <Toolbar />
      <Editor />
      <StatusBar />
    </div>
  );
}

export default App;

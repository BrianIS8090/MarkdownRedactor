import { useState, useEffect, useCallback } from 'react';
import { TitleBar } from './components/TitleBar/TitleBar';
import { Toolbar } from './components/Toolbar/Toolbar';
import { Editor } from './components/Editor/Editor';
import { StatusBar } from './components/StatusBar/StatusBar';
import { ContextMenu } from './components/ContextMenu/ContextMenu';
import { useFile } from './hooks/useFile';
import { useSettings } from './hooks/useSettings';
import { useTheme } from './hooks/useTheme';
import { useAppStore } from './stores/appStore';
import { insertMarkdown, type MarkdownAction } from './utils/markdownInsert';
import * as tauri from './utils/tauri';
import './App.css';

function App() {
  const { open, save, saveAs } = useFile();
  const { changeFontSize, fontSize } = useSettings();
  const { toggleTheme } = useTheme();
  const editorMode = useAppStore((s) => s.editorMode);
  const setEditorMode = useAppStore((s) => s.setEditorMode);
  const setContent = useAppStore((s) => s.setContent);

  // Состояние контекстного меню
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

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

  // Применение Markdown-вставки к textarea в source-режиме
  const applyMarkdownAction = useCallback((action: MarkdownAction) => {
    const textarea = document.querySelector<HTMLTextAreaElement>('.editor-source');
    if (!textarea) return;

    const result = insertMarkdown(
      textarea.value,
      textarea.selectionStart,
      textarea.selectionEnd,
      action,
    );

    // Обновляем содержимое через нативное событие для корректной синхронизации
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLTextAreaElement.prototype, 'value',
    )?.set;
    nativeInputValueSetter?.call(textarea, result.value);
    textarea.dispatchEvent(new Event('input', { bubbles: true }));

    // Устанавливаем курсор/выделение
    textarea.setSelectionRange(result.selectionStart, result.selectionEnd);
    textarea.focus();

    setContent(result.value);
  }, [setContent]);

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
    if (e.ctrlKey && e.shiftKey && e.code === 'KeyS') {
      e.preventDefault();
      saveAs();
    }
    // Ctrl+Shift+T — Переключить тему
    if (e.ctrlKey && e.shiftKey && e.code === 'KeyT') {
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
    // Ctrl+- — Уменьшить шрифт (без Shift, иначе конфликт с горизонтальной линией)
    if (e.ctrlKey && !e.shiftKey && e.key === '-') {
      e.preventDefault();
      changeFontSize(fontSize - 1);
    }

    // Шорткаты вставки Markdown (только в source-режиме)
    if (editorMode !== 'source') return;

    // Ctrl+B — Жирный
    if (e.ctrlKey && !e.shiftKey && e.key === 'b') {
      e.preventDefault();
      applyMarkdownAction('bold');
    }
    // Ctrl+I — Курсив
    if (e.ctrlKey && !e.shiftKey && e.key === 'i') {
      e.preventDefault();
      applyMarkdownAction('italic');
    }
    // Ctrl+Shift+X — Зачёркнутый
    if (e.ctrlKey && e.shiftKey && e.code === 'KeyX') {
      e.preventDefault();
      applyMarkdownAction('strikethrough');
    }
    // Ctrl+K — Ссылка
    if (e.ctrlKey && !e.shiftKey && e.code === 'KeyK') {
      e.preventDefault();
      applyMarkdownAction('link');
    }
    // Ctrl+Shift+K — Изображение
    if (e.ctrlKey && e.shiftKey && e.code === 'KeyK') {
      e.preventDefault();
      applyMarkdownAction('image');
    }
    // Ctrl+E — Инлайн-код
    if (e.ctrlKey && !e.shiftKey && e.key === 'e') {
      e.preventDefault();
      applyMarkdownAction('inlineCode');
    }
    // Ctrl+Shift+. — Цитата
    if (e.ctrlKey && e.shiftKey && e.code === 'Period') {
      e.preventDefault();
      applyMarkdownAction('blockquote');
    }
    // Ctrl+Shift+8 — Маркированный список
    if (e.ctrlKey && e.shiftKey && e.code === 'Digit8') {
      e.preventDefault();
      applyMarkdownAction('unorderedList');
    }
    // Ctrl+Shift+7 — Нумерованный список
    if (e.ctrlKey && e.shiftKey && e.code === 'Digit7') {
      e.preventDefault();
      applyMarkdownAction('orderedList');
    }
    // Ctrl+1/2/3 — Заголовки
    if (e.ctrlKey && !e.shiftKey && e.key === '1') {
      e.preventDefault();
      applyMarkdownAction('heading1');
    }
    if (e.ctrlKey && !e.shiftKey && e.key === '2') {
      e.preventDefault();
      applyMarkdownAction('heading2');
    }
    if (e.ctrlKey && !e.shiftKey && e.key === '3') {
      e.preventDefault();
      applyMarkdownAction('heading3');
    }
    // Ctrl+T — Таблица
    if (e.ctrlKey && !e.shiftKey && e.code === 'KeyT') {
      e.preventDefault();
      applyMarkdownAction('table');
    }
    // Ctrl+Shift+C — Чекбокс
    if (e.ctrlKey && e.shiftKey && e.code === 'KeyC') {
      e.preventDefault();
      applyMarkdownAction('checkbox');
    }
    // Ctrl+Shift+E — Блок кода
    if (e.ctrlKey && e.shiftKey && e.code === 'KeyE') {
      e.preventDefault();
      applyMarkdownAction('codeBlock');
    }
    // Ctrl+Shift+- — Горизонтальная линия
    if (e.ctrlKey && e.shiftKey && e.code === 'Minus') {
      e.preventDefault();
      applyMarkdownAction('horizontalRule');
    }
  }, [open, save, saveAs, toggleTheme, editorMode, setEditorMode, changeFontSize, fontSize, applyMarkdownAction, setContent]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Контекстное меню (только в source-режиме)
  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    if (editorMode !== 'source') return;
    const target = e.target as HTMLElement;
    if (!target.closest('.editor-source')) return;
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  }, [editorMode]);

  const handleContextMenuAction = useCallback((action: MarkdownAction) => {
    setContextMenu(null);
    applyMarkdownAction(action);
  }, [applyMarkdownAction]);

  return (
    <div className="app" onContextMenu={handleContextMenu}>
      <TitleBar />
      <Toolbar />
      <Editor />
      <StatusBar />
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onAction={handleContextMenuAction}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
}

export default App;

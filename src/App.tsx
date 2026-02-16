import { useEffect, useCallback } from 'react';
import { editorViewCtx } from '@milkdown/kit/core';
import { TextSelection } from 'prosemirror-state';

import { TitleBar } from './components/TitleBar/TitleBar';
import { Toolbar } from './components/Toolbar/Toolbar';
import { Editor } from './components/Editor/Editor';
import { StatusBar } from './components/StatusBar/StatusBar';
import { useFile } from './hooks/useFile';
import { useSettings } from './hooks/useSettings';
import { useTheme } from './hooks/useTheme';
import { useAppStore } from './stores/appStore';
import { getActiveEditor } from './utils/editorBridge';
import * as tauri from './utils/tauri';
import './App.css';

type MarkdownAction =
  | {
      type: 'wrap';
      prefix: string;
      suffix: string;
      placeholder: string;
    }
  | {
      type: 'insert';
      text: string;
      cursorOffset?: number;
      selectionLength?: number;
    };

function App() {
  const { open, save, saveAs } = useFile();
  const { changeFontSize, fontSize, language } = useSettings();
  const { toggleTheme } = useTheme();
  const editorMode = useAppStore((s) => s.editorMode);
  const setEditorMode = useAppStore((s) => s.setEditorMode);
  const setContent = useAppStore((s) => s.setContent);

  const placeholders = language === 'ru'
    ? {
        text: 'текст',
        url: 'https://example.com',
        alt: 'описание',
        code: 'код',
        task: 'задача',
        tableHeader1: 'Колонка 1',
        tableHeader2: 'Колонка 2',
        tableCell: 'Ячейка',
      }
    : {
        text: 'text',
        url: 'https://example.com',
        alt: 'alt',
        code: 'code',
        task: 'task',
        tableHeader1: 'Column 1',
        tableHeader2: 'Column 2',
        tableCell: 'Cell',
      };

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

  const applyMarkdownAction = useCallback((action: MarkdownAction) => {
    if (editorMode === 'source') {
      const textarea = document.querySelector<HTMLTextAreaElement>('.editor-source');
      if (!textarea) return;

      const start = textarea.selectionStart ?? 0;
      const end = textarea.selectionEnd ?? 0;
      const hasSelection = start !== end;
      const value = textarea.value;

      let insertText = '';
      let selectionStart = start;
      let selectionEnd = start;

      if (action.type === 'wrap') {
        const selected = value.slice(start, end);
        const content = hasSelection ? selected : action.placeholder;
        insertText = `${action.prefix}${content}${action.suffix}`;
        selectionStart = start + action.prefix.length;
        selectionEnd = selectionStart + content.length;
      } else {
        insertText = action.text;
        const cursorOffset = action.cursorOffset ?? insertText.length;
        const selectionLength = action.selectionLength ?? 0;
        selectionStart = start + cursorOffset;
        selectionEnd = selectionStart + selectionLength;
      }

      const nextValue = value.slice(0, start) + insertText + value.slice(end);
      setContent(nextValue);

      requestAnimationFrame(() => {
        textarea.focus();
        textarea.setSelectionRange(selectionStart, selectionEnd);
      });
      return;
    }

    const editor = getActiveEditor();
    if (!editor) return;

    editor.action((ctx) => {
      const view = ctx.get(editorViewCtx);
      const { state } = view;
      const { from, to } = state.selection;
      const hasSelection = from !== to;
      const selected = state.doc.textBetween(from, to, '\n');

      let insertText = '';
      let selectionStart = from;
      let selectionEnd = from;

      if (action.type === 'wrap') {
        const content = hasSelection ? selected : action.placeholder;
        insertText = `${action.prefix}${content}${action.suffix}`;
        selectionStart = from + action.prefix.length;
        selectionEnd = selectionStart + content.length;
      } else {
        insertText = action.text;
        const cursorOffset = action.cursorOffset ?? insertText.length;
        const selectionLength = action.selectionLength ?? 0;
        selectionStart = from + cursorOffset;
        selectionEnd = selectionStart + selectionLength;
      }

      let tr = state.tr.insertText(insertText, from, to);
      const maxPos = tr.doc.content.size;
      const safeStart = Math.max(0, Math.min(selectionStart, maxPos));
      const safeEnd = Math.max(0, Math.min(selectionEnd, maxPos));
      tr = tr.setSelection(TextSelection.create(tr.doc, safeStart, safeEnd));
      view.dispatch(tr);
      view.focus();
    });
  }, [editorMode, setContent]);

  // Горячие клавиши
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const key = e.key.toLowerCase();

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

    // Markdown: Ctrl+B — Жирный
    if (e.ctrlKey && !e.shiftKey && !e.altKey && key === 'b') {
      e.preventDefault();
      applyMarkdownAction({
        type: 'wrap',
        prefix: '**',
        suffix: '**',
        placeholder: placeholders.text,
      });
    }
    // Markdown: Ctrl+I — Курсив
    if (e.ctrlKey && !e.shiftKey && !e.altKey && key === 'i') {
      e.preventDefault();
      applyMarkdownAction({
        type: 'wrap',
        prefix: '*',
        suffix: '*',
        placeholder: placeholders.text,
      });
    }
    // Markdown: Ctrl+Shift+X — Зачёркнутый
    if (e.ctrlKey && e.shiftKey && !e.altKey && key === 'x') {
      e.preventDefault();
      applyMarkdownAction({
        type: 'wrap',
        prefix: '~~',
        suffix: '~~',
        placeholder: placeholders.text,
      });
    }
    // Markdown: Ctrl+Shift+C — Инлайн-код
    if (e.ctrlKey && e.shiftKey && !e.altKey && key === 'c') {
      e.preventDefault();
      applyMarkdownAction({
        type: 'wrap',
        prefix: '`',
        suffix: '`',
        placeholder: placeholders.code,
      });
    }
    // Markdown: Ctrl+Alt+C — Блок кода
    if (e.ctrlKey && e.altKey && !e.shiftKey && key === 'c') {
      e.preventDefault();
      const codeBlock = `\`\`\`\n${placeholders.code}\n\`\`\``;
      applyMarkdownAction({
        type: 'insert',
        text: codeBlock,
        cursorOffset: 4,
        selectionLength: placeholders.code.length,
      });
    }
    // Markdown: Ctrl+K — Ссылка
    if (e.ctrlKey && !e.shiftKey && !e.altKey && key === 'k') {
      e.preventDefault();
      applyMarkdownAction({
        type: 'wrap',
        prefix: '[',
        suffix: `](${placeholders.url})`,
        placeholder: placeholders.text,
      });
    }
    // Markdown: Ctrl+Shift+K — Изображение
    if (e.ctrlKey && e.shiftKey && !e.altKey && key === 'k') {
      e.preventDefault();
      applyMarkdownAction({
        type: 'wrap',
        prefix: '![',
        suffix: `](${placeholders.url})`,
        placeholder: placeholders.alt,
      });
    }
    // Markdown: Ctrl+Alt+T — Таблица
    if (e.ctrlKey && e.altKey && !e.shiftKey && key === 't') {
      e.preventDefault();
      const table = `| ${placeholders.tableHeader1} | ${placeholders.tableHeader2} |\n| --- | --- |\n| ${placeholders.tableCell} | ${placeholders.tableCell} |`;
      applyMarkdownAction({
        type: 'insert',
        text: table,
        cursorOffset: 2,
        selectionLength: placeholders.tableHeader1.length,
      });
    }
    // Markdown: Ctrl+Alt+X — Чекбокс
    if (e.ctrlKey && e.altKey && !e.shiftKey && key === 'x') {
      e.preventDefault();
      const checkbox = `- [ ] ${placeholders.task}`;
      applyMarkdownAction({
        type: 'insert',
        text: checkbox,
        cursorOffset: 6,
        selectionLength: placeholders.task.length,
      });
    }
  }, [open, save, saveAs, toggleTheme, editorMode, setEditorMode, changeFontSize, fontSize, applyMarkdownAction, placeholders]);

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

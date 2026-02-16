import { describe, it, expect } from 'vitest';
import { insertMarkdown } from '../utils/markdownInsert';

describe('insertMarkdown', () => {
  describe('wrapSelection — оборачивание выделенного текста', () => {
    it('bold: оборачивает выделение в **', () => {
      const result = insertMarkdown('hello world', 6, 11, 'bold');
      expect(result.value).toBe('hello **world**');
      expect(result.selectionStart).toBe(8);
      expect(result.selectionEnd).toBe(13);
    });

    it('bold: вставляет плейсхолдер без выделения', () => {
      const result = insertMarkdown('hello ', 6, 6, 'bold');
      expect(result.value).toBe('hello **текст**');
      expect(result.selectionStart).toBe(8);
      expect(result.selectionEnd).toBe(13);
    });

    it('italic: оборачивает в *', () => {
      const result = insertMarkdown('test', 0, 4, 'italic');
      expect(result.value).toBe('*test*');
    });

    it('strikethrough: оборачивает в ~~', () => {
      const result = insertMarkdown('text', 0, 4, 'strikethrough');
      expect(result.value).toBe('~~text~~');
    });

    it('inlineCode: оборачивает в `', () => {
      const result = insertMarkdown('code', 0, 4, 'inlineCode');
      expect(result.value).toBe('`code`');
    });

    it('link: оборачивает в [](url)', () => {
      const result = insertMarkdown('click', 0, 5, 'link');
      expect(result.value).toBe('[click](url)');
    });

    it('link: без выделения — плейсхолдер', () => {
      const result = insertMarkdown('', 0, 0, 'link');
      expect(result.value).toBe('[текст](url)');
      expect(result.selectionStart).toBe(1);
      expect(result.selectionEnd).toBe(6);
    });

    it('image: оборачивает в ![](url)', () => {
      const result = insertMarkdown('pic', 0, 3, 'image');
      expect(result.value).toBe('![pic](url)');
    });
  });

  describe('prefixLine — вставка префикса в начало строки', () => {
    it('blockquote: добавляет > к строке с текстом', () => {
      const result = insertMarkdown('some text', 3, 3, 'blockquote');
      expect(result.value).toBe('> some text');
    });

    it('blockquote: пустая строка — плейсхолдер', () => {
      const result = insertMarkdown('', 0, 0, 'blockquote');
      expect(result.value).toBe('> цитата');
    });

    it('unorderedList: добавляет - к строке', () => {
      const result = insertMarkdown('item', 0, 0, 'unorderedList');
      expect(result.value).toBe('- item');
    });

    it('orderedList: добавляет 1. к строке', () => {
      const result = insertMarkdown('item', 0, 0, 'orderedList');
      expect(result.value).toBe('1. item');
    });

    it('heading1: добавляет # к строке', () => {
      const result = insertMarkdown('title', 0, 0, 'heading1');
      expect(result.value).toBe('# title');
    });

    it('heading2: добавляет ## к строке', () => {
      const result = insertMarkdown('title', 2, 2, 'heading2');
      expect(result.value).toBe('## title');
    });

    it('heading3: добавляет ### к строке', () => {
      const result = insertMarkdown('title', 0, 0, 'heading3');
      expect(result.value).toBe('### title');
    });

    it('работает со второй строкой в многострочном тексте', () => {
      const text = 'first line\nsecond line';
      // Выделяем "second line" (индексы 11-22)
      const result = insertMarkdown(text, 11, 22, 'bold');
      expect(result.value).toBe('first line\n**second line**');
    });

    it('heading на второй строке', () => {
      const text = 'first\nsecond';
      const result = insertMarkdown(text, 8, 8, 'heading1');
      expect(result.value).toBe('first\n# second');
    });
  });

  describe('новые действия: table, checkbox, codeBlock, horizontalRule', () => {
    it('table: вставляет шаблон таблицы', () => {
      const result = insertMarkdown('', 0, 0, 'table');
      expect(result.value).toBe('| Заголовок | Заголовок |\n|---|---|\n| Ячейка | Ячейка |');
      // Выделяет первый «Заголовок»
      expect(result.selectionStart).toBe(2);
      expect(result.selectionEnd).toBe(11);
    });

    it('table: добавляет перенос строки если вставка не в начале', () => {
      const result = insertMarkdown('текст', 5, 5, 'table');
      expect(result.value).toContain('\n| Заголовок');
    });

    it('checkbox: добавляет - [ ] к строке с текстом', () => {
      const result = insertMarkdown('задача', 0, 0, 'checkbox');
      expect(result.value).toBe('- [ ] задача');
    });

    it('checkbox: пустая строка — плейсхолдер', () => {
      const result = insertMarkdown('', 0, 0, 'checkbox');
      expect(result.value).toBe('- [ ] задача');
      expect(result.selectionStart).toBe(6);
      expect(result.selectionEnd).toBe(12);
    });

    it('codeBlock: оборачивает выделение в тройные кавычки', () => {
      const result = insertMarkdown('console.log()', 0, 13, 'codeBlock');
      expect(result.value).toBe('```\nconsole.log()\n```');
      expect(result.selectionStart).toBe(4);
      expect(result.selectionEnd).toBe(17);
    });

    it('codeBlock: без выделения — плейсхолдер', () => {
      const result = insertMarkdown('', 0, 0, 'codeBlock');
      expect(result.value).toBe('```\nкод\n```');
      expect(result.selectionStart).toBe(4);
      expect(result.selectionEnd).toBe(7);
    });

    it('horizontalRule: вставляет ---', () => {
      const result = insertMarkdown('', 0, 0, 'horizontalRule');
      expect(result.value).toBe('---\n');
      expect(result.selectionStart).toBe(0);
      expect(result.selectionEnd).toBe(3);
    });

    it('horizontalRule: добавляет перенос строки если не в начале', () => {
      const result = insertMarkdown('текст', 5, 5, 'horizontalRule');
      expect(result.value).toBe('текст\n---\n');
    });
  });
});

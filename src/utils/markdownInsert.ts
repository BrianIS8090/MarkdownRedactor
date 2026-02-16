// Утилита для вставки Markdown-разметки в textarea

export interface InsertResult {
  value: string;
  selectionStart: number;
  selectionEnd: number;
}

// Оборачивает выделенный текст или вставляет шаблон
function wrapSelection(
  text: string,
  start: number,
  end: number,
  before: string,
  after: string,
  placeholder: string,
): InsertResult {
  const selected = text.slice(start, end);
  if (selected) {
    const newText = text.slice(0, start) + before + selected + after + text.slice(end);
    return {
      value: newText,
      selectionStart: start + before.length,
      selectionEnd: start + before.length + selected.length,
    };
  }
  const insert = before + placeholder + after;
  const newText = text.slice(0, start) + insert + text.slice(end);
  return {
    value: newText,
    selectionStart: start + before.length,
    selectionEnd: start + before.length + placeholder.length,
  };
}

// Вставляет префикс в начало строки
function prefixLine(
  text: string,
  start: number,
  prefix: string,
  placeholder: string,
): InsertResult {
  // Находим начало текущей строки
  const lineStart = text.lastIndexOf('\n', start - 1) + 1;
  const lineEnd = text.indexOf('\n', start);
  const actualEnd = lineEnd === -1 ? text.length : lineEnd;
  const lineContent = text.slice(lineStart, actualEnd);

  if (lineContent.trim()) {
    const newText = text.slice(0, lineStart) + prefix + text.slice(lineStart);
    return {
      value: newText,
      selectionStart: lineStart + prefix.length,
      selectionEnd: actualEnd + prefix.length,
    };
  }
  const insert = prefix + placeholder;
  const newText = text.slice(0, lineStart) + insert + text.slice(lineStart);
  return {
    value: newText,
    selectionStart: lineStart + prefix.length,
    selectionEnd: lineStart + prefix.length + placeholder.length,
  };
}

// Вставляет блок текста на отдельной строке
function insertBlock(
  text: string,
  start: number,
  block: string,
  selectFrom: number,
  selectTo: number,
): InsertResult {
  // Определяем нужны ли переносы строки до/после
  const before = start > 0 && text[start - 1] !== '\n' ? '\n' : '';
  const newText = text.slice(0, start) + before + block + text.slice(start);
  return {
    value: newText,
    selectionStart: start + before.length + selectFrom,
    selectionEnd: start + before.length + selectTo,
  };
}

export type MarkdownAction =
  | 'bold' | 'italic' | 'strikethrough'
  | 'link' | 'image' | 'inlineCode'
  | 'blockquote' | 'unorderedList' | 'orderedList'
  | 'heading1' | 'heading2' | 'heading3'
  | 'table' | 'checkbox' | 'codeBlock' | 'horizontalRule';

export function insertMarkdown(
  text: string,
  selectionStart: number,
  selectionEnd: number,
  action: MarkdownAction,
): InsertResult {
  switch (action) {
    case 'bold':
      return wrapSelection(text, selectionStart, selectionEnd, '**', '**', 'текст');
    case 'italic':
      return wrapSelection(text, selectionStart, selectionEnd, '*', '*', 'текст');
    case 'strikethrough':
      return wrapSelection(text, selectionStart, selectionEnd, '~~', '~~', 'текст');
    case 'inlineCode':
      return wrapSelection(text, selectionStart, selectionEnd, '`', '`', 'код');
    case 'link':
      return wrapSelection(text, selectionStart, selectionEnd, '[', '](url)', 'текст');
    case 'image':
      return wrapSelection(text, selectionStart, selectionEnd, '![', '](url)', 'alt');
    case 'blockquote':
      return prefixLine(text, selectionStart, '> ', 'цитата');
    case 'unorderedList':
      return prefixLine(text, selectionStart, '- ', 'элемент');
    case 'orderedList':
      return prefixLine(text, selectionStart, '1. ', 'элемент');
    case 'heading1':
      return prefixLine(text, selectionStart, '# ', 'Заголовок');
    case 'heading2':
      return prefixLine(text, selectionStart, '## ', 'Заголовок');
    case 'heading3':
      return prefixLine(text, selectionStart, '### ', 'Заголовок');
    case 'table': {
      const tpl = '| Заголовок | Заголовок |\n|---|---|\n| Ячейка | Ячейка |';
      return insertBlock(text, selectionStart, tpl, 2, 11);
    }
    case 'checkbox':
      return prefixLine(text, selectionStart, '- [ ] ', 'задача');
    case 'codeBlock': {
      const selected = text.slice(selectionStart, selectionEnd);
      if (selected) {
        const block = '```\n' + selected + '\n```';
        const newText = text.slice(0, selectionStart) + block + text.slice(selectionEnd);
        return {
          value: newText,
          selectionStart: selectionStart + 4,
          selectionEnd: selectionStart + 4 + selected.length,
        };
      }
      const block = '```\nкод\n```';
      const newText = text.slice(0, selectionStart) + block + text.slice(selectionEnd);
      return {
        value: newText,
        selectionStart: selectionStart + 4,
        selectionEnd: selectionStart + 7,
      };
    }
    case 'horizontalRule': {
      return insertBlock(text, selectionStart, '---\n', 0, 3);
    }
  }
}

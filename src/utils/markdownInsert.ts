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

export type MarkdownAction =
  | 'bold' | 'italic' | 'strikethrough'
  | 'link' | 'image' | 'inlineCode'
  | 'blockquote' | 'unorderedList' | 'orderedList'
  | 'heading1' | 'heading2' | 'heading3';

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
  }
}

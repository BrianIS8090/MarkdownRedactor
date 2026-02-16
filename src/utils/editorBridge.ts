import type { Editor } from '@milkdown/kit/core';

let activeEditor: Editor | null = null;

export function setActiveEditor(editor: Editor | null) {
  activeEditor = editor;
}

export function getActiveEditor(): Editor | null {
  return activeEditor;
}

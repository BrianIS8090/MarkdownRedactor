import type { Translations } from './ru';

export const en: Translations = {
  // Menu
  open: 'Open',
  save: 'Save',
  saveAs: 'Save As',
  help: 'Help',
  
  // Theme
  themeLight: 'Light',
  themeDark: 'Dark',
  themeSystem: 'System',
  
  // Editor mode
  visualMode: 'Visual',
  sourceMode: 'Source',
  
  // Status bar
  newFile: 'New File',
  words: ['word', 'words', 'words'] as [string, string, string],
  chars: ['char', 'chars', 'chars'] as [string, string, string],
  
  // Editor
  placeholder: 'Start writing...',
  
  // About
  about: 'About',
  version: 'Version',
  description: 'Modern Markdown editor with visual and source editing modes. Built on Tauri 2 and Milkdown Crepe.',
  license: 'License',
  mitLicense: 'MIT License',
  author: 'Author',
  contact: 'Contact',
  close: 'Close',
  
  // Tooltips
  openTooltip: 'Open (Ctrl+O)',
  saveTooltip: 'Save (Ctrl+S)',
  saveAsTooltip: 'Save As (Ctrl+Shift+S)',
  themeTooltip: 'Toggle theme (Ctrl+Shift+T)',
  modeTooltip: 'Editor mode (Ctrl+/)',
  fontTooltip: 'Font',
  decreaseFontTooltip: 'Decrease font (Ctrl+-)',
  increaseFontTooltip: 'Increase font (Ctrl++)',
};

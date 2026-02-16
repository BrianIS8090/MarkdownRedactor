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

  // Help dialog tabs
  tabAbout: 'About',
  tabReference: 'Reference',
  tabShortcuts: 'Shortcuts',

  // Markdown reference
  markdownReference: 'Markdown Reference',
  refSyntax: 'Syntax',
  refDescription: 'Description',
  refExample: 'Example',
  refHeading1: 'Heading 1',
  refHeading2: 'Heading 2',
  refHeading3: 'Heading 3',
  refBold: 'Bold',
  refItalic: 'Italic',
  refStrikethrough: 'Strikethrough',
  refLink: 'Link',
  refImage: 'Image',
  refInlineCode: 'Inline code',
  refCodeBlock: 'Code block',
  refBlockquote: 'Blockquote',
  refUnorderedList: 'Unordered list',
  refOrderedList: 'Ordered list',
  refHorizontalRule: 'Horizontal rule',
  refTable: 'Table',
  refCheckbox: 'Checkbox',
  refCheckboxChecked: 'Checkbox (checked)',

  // Shortcuts
  shortcutsTitle: 'Keyboard Shortcuts',
  shortcutCategory_file: 'File',
  shortcutCategory_editor: 'Editor',
  shortcutCategory_markdown: 'Insert Markdown',
  shortcut_open: 'Open file',
  shortcut_save: 'Save',
  shortcut_saveAs: 'Save as',
  shortcut_toggleTheme: 'Toggle theme',
  shortcut_toggleMode: 'Toggle mode',
  shortcut_increaseFontSize: 'Increase font',
  shortcut_decreaseFontSize: 'Decrease font',
  shortcut_bold: 'Bold',
  shortcut_italic: 'Italic',
  shortcut_strikethrough: 'Strikethrough',
  shortcut_link: 'Link',
  shortcut_image: 'Image',
  shortcut_inlineCode: 'Inline code',
  shortcut_blockquote: 'Blockquote',
  shortcut_unorderedList: 'Unordered list',
  shortcut_orderedList: 'Ordered list',
  shortcut_heading1: 'Heading 1',
  shortcut_heading2: 'Heading 2',
  shortcut_heading3: 'Heading 3',
  shortcut_table: 'Table',
  shortcut_checkbox: 'Checkbox',
  shortcut_codeBlock: 'Code block',
  shortcut_horizontalRule: 'Horizontal rule',

  // Context menu
  contextMenu_formatting: 'Formatting',
  contextMenu_insert: 'Insert',
  contextMenu_blocks: 'Blocks',

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

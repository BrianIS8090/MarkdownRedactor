export const ru = {
  // Меню
  open: 'Открыть',
  save: 'Сохранить',
  saveAs: 'Сохранить как',
  help: 'Справка',

  // Тема
  themeLight: 'Светлая',
  themeDark: 'Тёмная',
  themeSystem: 'Системная',

  // Режим редактора
  visualMode: 'Визуальный',
  sourceMode: 'Исходный',

  // Статус-бар
  newFile: 'Новый файл',
  words: ['слово', 'слова', 'слов'] as [string, string, string],
  chars: ['символ', 'символа', 'символов'] as [string, string, string],

  // Редактор
  placeholder: 'Начните писать...',

  // О программе
  about: 'О программе',
  version: 'Версия',
  description: 'Современный Markdown-редактор с визуальным и исходным режимами редактирования. Построен на Tauri 2 и Milkdown Crepe.',
  license: 'Лицензия',
  mitLicense: 'MIT License',
  author: 'Автор',
  contact: 'Контакт',
  close: 'Закрыть',

  // Табы диалога справки
  tabAbout: 'О программе',
  tabReference: 'Справочник',
  tabShortcuts: 'Горячие клавиши',

  // Справочник Markdown
  markdownReference: 'Справочник Markdown',
  refSyntax: 'Синтаксис',
  refDescription: 'Описание',
  refExample: 'Пример',
  refHeading1: 'Заголовок 1',
  refHeading2: 'Заголовок 2',
  refHeading3: 'Заголовок 3',
  refBold: 'Жирный текст',
  refItalic: 'Курсив',
  refStrikethrough: 'Зачёркнутый',
  refLink: 'Ссылка',
  refImage: 'Изображение',
  refInlineCode: 'Инлайн-код',
  refCodeBlock: 'Блок кода',
  refBlockquote: 'Цитата',
  refUnorderedList: 'Маркированный список',
  refOrderedList: 'Нумерованный список',
  refHorizontalRule: 'Горизонтальная линия',
  refTable: 'Таблица',
  refCheckbox: 'Чекбокс',
  refCheckboxChecked: 'Чекбокс (отмечен)',

  // Горячие клавиши
  shortcutsTitle: 'Горячие клавиши',
  shortcutCategory_file: 'Файл',
  shortcutCategory_editor: 'Редактор',
  shortcutCategory_markdown: 'Вставка Markdown',
  shortcut_open: 'Открыть файл',
  shortcut_save: 'Сохранить',
  shortcut_saveAs: 'Сохранить как',
  shortcut_toggleTheme: 'Переключить тему',
  shortcut_toggleMode: 'Переключить режим',
  shortcut_increaseFontSize: 'Увеличить шрифт',
  shortcut_decreaseFontSize: 'Уменьшить шрифт',
  shortcut_bold: 'Жирный',
  shortcut_italic: 'Курсив',
  shortcut_strikethrough: 'Зачёркнутый',
  shortcut_link: 'Ссылка',
  shortcut_image: 'Изображение',
  shortcut_inlineCode: 'Инлайн-код',
  shortcut_blockquote: 'Цитата',
  shortcut_unorderedList: 'Маркированный список',
  shortcut_orderedList: 'Нумерованный список',
  shortcut_heading1: 'Заголовок 1',
  shortcut_heading2: 'Заголовок 2',
  shortcut_heading3: 'Заголовок 3',
  shortcut_table: 'Таблица',
  shortcut_checkbox: 'Чекбокс',
  shortcut_codeBlock: 'Блок кода',
  shortcut_horizontalRule: 'Горизонтальная линия',

  // Контекстное меню
  contextMenu_formatting: 'Форматирование',
  contextMenu_insert: 'Вставка',
  contextMenu_blocks: 'Блоки',

  // Подсказки
  openTooltip: 'Открыть (Ctrl+O)',
  saveTooltip: 'Сохранить (Ctrl+S)',
  saveAsTooltip: 'Сохранить как (Ctrl+Shift+S)',
  themeTooltip: 'Переключить тему (Ctrl+Shift+T)',
  modeTooltip: 'Режим редактора (Ctrl+/)',
  fontTooltip: 'Шрифт',
  decreaseFontTooltip: 'Уменьшить шрифт (Ctrl+-)',
  increaseFontTooltip: 'Увеличить шрифт (Ctrl++)',
};

export type Translations = typeof ru;

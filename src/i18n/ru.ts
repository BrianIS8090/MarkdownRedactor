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

// Справочник горячих клавиш

import type { Translations } from '../../i18n/ru';

interface ShortcutsReferenceProps {
  t: Translations;
}

interface ShortcutItem {
  keys: string;
  descKey: keyof Translations;
}

interface ShortcutGroup {
  titleKey: keyof Translations;
  items: ShortcutItem[];
}

const SHORTCUT_GROUPS: ShortcutGroup[] = [
  {
    titleKey: 'shortcutCategory_file',
    items: [
      { keys: 'Ctrl+O', descKey: 'shortcut_open' },
      { keys: 'Ctrl+S', descKey: 'shortcut_save' },
      { keys: 'Ctrl+Shift+S', descKey: 'shortcut_saveAs' },
    ],
  },
  {
    titleKey: 'shortcutCategory_editor',
    items: [
      { keys: 'Ctrl+Shift+T', descKey: 'shortcut_toggleTheme' },
      { keys: 'Ctrl+/', descKey: 'shortcut_toggleMode' },
      { keys: 'Ctrl++', descKey: 'shortcut_increaseFontSize' },
      { keys: 'Ctrl+-', descKey: 'shortcut_decreaseFontSize' },
    ],
  },
  {
    titleKey: 'shortcutCategory_markdown',
    items: [
      { keys: 'Ctrl+B', descKey: 'shortcut_bold' },
      { keys: 'Ctrl+I', descKey: 'shortcut_italic' },
      { keys: 'Ctrl+Shift+X', descKey: 'shortcut_strikethrough' },
      { keys: 'Ctrl+K', descKey: 'shortcut_link' },
      { keys: 'Ctrl+Shift+K', descKey: 'shortcut_image' },
      { keys: 'Ctrl+E', descKey: 'shortcut_inlineCode' },
      { keys: 'Ctrl+Shift+.', descKey: 'shortcut_blockquote' },
      { keys: 'Ctrl+Shift+8', descKey: 'shortcut_unorderedList' },
      { keys: 'Ctrl+Shift+7', descKey: 'shortcut_orderedList' },
      { keys: 'Ctrl+1', descKey: 'shortcut_heading1' },
      { keys: 'Ctrl+2', descKey: 'shortcut_heading2' },
      { keys: 'Ctrl+3', descKey: 'shortcut_heading3' },
      { keys: 'Ctrl+T', descKey: 'shortcut_table' },
      { keys: 'Ctrl+Shift+C', descKey: 'shortcut_checkbox' },
      { keys: 'Ctrl+Shift+E', descKey: 'shortcut_codeBlock' },
      { keys: 'Ctrl+Shift+-', descKey: 'shortcut_horizontalRule' },
    ],
  },
];

export function ShortcutsReference({ t }: ShortcutsReferenceProps) {
  return (
    <div className="shortcuts-reference">
      {SHORTCUT_GROUPS.map((group) => (
        <div key={group.titleKey} className="shortcuts-group">
          <h4 className="shortcuts-group-title">
            {t[group.titleKey] as string}
          </h4>
          <div className="shortcuts-list">
            {group.items.map((item) => (
              <div key={item.descKey} className="shortcut-row">
                <span className="shortcut-desc">
                  {t[item.descKey] as string}
                </span>
                <kbd className="shortcut-keys">{item.keys}</kbd>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

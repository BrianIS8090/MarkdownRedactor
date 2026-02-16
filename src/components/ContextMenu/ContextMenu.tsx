// Контекстное меню для вставки Markdown-разметки

import { useEffect, useRef } from 'react';
import { useAppStore } from '../../stores/appStore';
import { getTranslations, type Translations } from '../../i18n';
import type { MarkdownAction } from '../../utils/markdownInsert';
import './contextMenu.css';

interface ContextMenuProps {
  x: number;
  y: number;
  onAction: (action: MarkdownAction) => void;
  onClose: () => void;
}

interface MenuItem {
  action: MarkdownAction;
  labelKey: keyof Translations;
  shortcut: string;
}

interface MenuGroup {
  titleKey: keyof Translations;
  items: MenuItem[];
}

const MENU_GROUPS: MenuGroup[] = [
  {
    titleKey: 'contextMenu_formatting',
    items: [
      { action: 'bold', labelKey: 'shortcut_bold', shortcut: 'Ctrl+B' },
      { action: 'italic', labelKey: 'shortcut_italic', shortcut: 'Ctrl+I' },
      { action: 'strikethrough', labelKey: 'shortcut_strikethrough', shortcut: 'Ctrl+Shift+X' },
      { action: 'inlineCode', labelKey: 'shortcut_inlineCode', shortcut: 'Ctrl+E' },
    ],
  },
  {
    titleKey: 'contextMenu_insert',
    items: [
      { action: 'link', labelKey: 'shortcut_link', shortcut: 'Ctrl+K' },
      { action: 'image', labelKey: 'shortcut_image', shortcut: 'Ctrl+Shift+K' },
      { action: 'table', labelKey: 'shortcut_table', shortcut: 'Ctrl+T' },
      { action: 'checkbox', labelKey: 'shortcut_checkbox', shortcut: 'Ctrl+Shift+C' },
      { action: 'codeBlock', labelKey: 'shortcut_codeBlock', shortcut: 'Ctrl+Shift+E' },
      { action: 'horizontalRule', labelKey: 'shortcut_horizontalRule', shortcut: 'Ctrl+Shift+-' },
    ],
  },
  {
    titleKey: 'contextMenu_blocks',
    items: [
      { action: 'heading1', labelKey: 'shortcut_heading1', shortcut: 'Ctrl+1' },
      { action: 'heading2', labelKey: 'shortcut_heading2', shortcut: 'Ctrl+2' },
      { action: 'heading3', labelKey: 'shortcut_heading3', shortcut: 'Ctrl+3' },
      { action: 'blockquote', labelKey: 'shortcut_blockquote', shortcut: 'Ctrl+Shift+.' },
      { action: 'unorderedList', labelKey: 'shortcut_unorderedList', shortcut: 'Ctrl+Shift+8' },
      { action: 'orderedList', labelKey: 'shortcut_orderedList', shortcut: 'Ctrl+Shift+7' },
    ],
  },
];

export function ContextMenu({ x, y, onAction, onClose }: ContextMenuProps) {
  const language = useAppStore((s) => s.language);
  const t = getTranslations(language);
  const menuRef = useRef<HTMLDivElement>(null);

  // Закрытие по клику вне меню или Escape
  useEffect(() => {
    const handleClick = () => onClose();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('click', handleClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  // Корректировка позиции, чтобы меню не вышло за экран
  useEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;
    const rect = menu.getBoundingClientRect();
    if (rect.right > window.innerWidth) {
      menu.style.left = `${window.innerWidth - rect.width - 4}px`;
    }
    if (rect.bottom > window.innerHeight) {
      menu.style.top = `${window.innerHeight - rect.height - 4}px`;
    }
  }, [x, y]);

  return (
    <div
      ref={menuRef}
      className="context-menu"
      style={{ left: x, top: y }}
      onClick={(e) => e.stopPropagation()}
    >
      {MENU_GROUPS.map((group, gi) => (
        <div key={group.titleKey}>
          {gi > 0 && <div className="context-menu-separator" />}
          <div className="context-menu-group-title">
            {t[group.titleKey] as string}
          </div>
          {group.items.map((item) => (
            <button
              key={item.action}
              className="context-menu-item"
              onClick={() => onAction(item.action)}
            >
              <span className="context-menu-label">
                {t[item.labelKey] as string}
              </span>
              <span className="context-menu-shortcut">{item.shortcut}</span>
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}

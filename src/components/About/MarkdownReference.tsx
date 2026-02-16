// Справочник символов Markdown-разметки

import type { Translations } from '../../i18n/ru';

interface MarkdownReferenceProps {
  t: Translations;
}

interface RefItem {
  syntax: string;
  descKey: keyof Translations;
}

const REFERENCE_ITEMS: RefItem[] = [
  { syntax: '# текст', descKey: 'refHeading1' },
  { syntax: '## текст', descKey: 'refHeading2' },
  { syntax: '### текст', descKey: 'refHeading3' },
  { syntax: '**текст**', descKey: 'refBold' },
  { syntax: '*текст*', descKey: 'refItalic' },
  { syntax: '~~текст~~', descKey: 'refStrikethrough' },
  { syntax: '[текст](url)', descKey: 'refLink' },
  { syntax: '![alt](url)', descKey: 'refImage' },
  { syntax: '`код`', descKey: 'refInlineCode' },
  { syntax: '```\\nкод\\n```', descKey: 'refCodeBlock' },
  { syntax: '> цитата', descKey: 'refBlockquote' },
  { syntax: '- элемент', descKey: 'refUnorderedList' },
  { syntax: '1. элемент', descKey: 'refOrderedList' },
  { syntax: '---', descKey: 'refHorizontalRule' },
  { syntax: '| A | B |\\n|---|---|\\n| 1 | 2 |', descKey: 'refTable' },
  { syntax: '- [ ] задача', descKey: 'refCheckbox' },
  { syntax: '- [x] задача', descKey: 'refCheckboxChecked' },
];

export function MarkdownReference({ t }: MarkdownReferenceProps) {
  return (
    <div className="md-reference">
      <table className="md-reference-table">
        <thead>
          <tr>
            <th>{t.refSyntax}</th>
            <th>{t.refDescription}</th>
          </tr>
        </thead>
        <tbody>
          {REFERENCE_ITEMS.map((item) => (
            <tr key={item.descKey}>
              <td>
                <code className="md-reference-syntax">{item.syntax}</code>
              </td>
              <td>{t[item.descKey] as string}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

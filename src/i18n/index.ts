import { ru, type Translations } from './ru';
import { en } from './en';

export type Language = 'ru' | 'en';

const translations: Record<Language, Translations> = { ru, en };

export function getTranslations(lang: Language): Translations {
  return translations[lang];
}

export function pluralize(n: number, forms: [string, string, string]): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 19) return forms[2];
  if (mod10 === 1) return forms[0];
  if (mod10 >= 2 && mod10 <= 4) return forms[1];
  return forms[2];
}

export { ru, en, type Translations };

import { useEffect, useState } from 'react';
import { useAppStore } from '../stores/appStore';

export function useTheme() {
  const theme = useAppStore((s) => s.theme);
  const setTheme = useAppStore((s) => s.setTheme);
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    if (theme === 'system') {
      // Определить системную тему
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      const update = () => setResolvedTheme(mq.matches ? 'dark' : 'light');
      update();
      mq.addEventListener('change', update);
      return () => mq.removeEventListener('change', update);
    } else {
      setResolvedTheme(theme);
    }
  }, [theme]);

  // Применяем data-theme атрибут к документу
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', resolvedTheme);
  }, [resolvedTheme]);

  const toggleTheme = () => {
    const order: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system'];
    const idx = order.indexOf(theme);
    setTheme(order[(idx + 1) % order.length]);
  };

  return { theme, resolvedTheme, setTheme, toggleTheme };
}

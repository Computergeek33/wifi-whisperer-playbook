import { useState, useEffect, useCallback } from 'react';
const key = 'wifi-2027-theme';
export type Theme = 'light' | 'dark';
export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => {
    try { const stored = localStorage.getItem(key); if (stored === 'dark') return 'dark'; } catch {}
    return 'light';
  });
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    try { localStorage.setItem(key, theme); } catch {}
  }, [theme]);
  const toggle = useCallback(() => setThemeState(prev => prev === 'light' ? 'dark' : 'light'), []);
  return { theme, toggle } as const;
}

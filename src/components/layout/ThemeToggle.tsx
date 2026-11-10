'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

const storageKey = 'paldogangsan-theme';

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    function sync() {
      let preference: string | null = null;
      try { preference = localStorage.getItem(storageKey); } catch { /* Storage may be unavailable. */ }
      const next = preference === 'dark' || (preference !== 'light' && media.matches);
      document.documentElement.classList.toggle('dark', next);
      setDark(next);
    }
    sync();
    media.addEventListener('change', sync);
    window.addEventListener('storage', sync);
    return () => {
      media.removeEventListener('change', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  function toggle() {
    const next = !document.documentElement.classList.contains('dark');
    document.documentElement.classList.toggle('dark', next);
    setDark(next);
    try { localStorage.setItem(storageKey, next ? 'dark' : 'light'); } catch { /* Keep the current session usable. */ }
  }

  return <button type="button" onClick={toggle} aria-label={dark ? '라이트 모드로 전환' : '다크 모드로 전환'} title={dark ? '라이트 모드로 전환' : '다크 모드로 전환'} className="rounded-lg p-3 text-gray-600 hover:bg-gray-100 dark:text-slate-200 dark:hover:bg-slate-800">
    <Moon aria-hidden="true" className="h-5 w-5 dark:hidden" />
    <Sun aria-hidden="true" className="hidden h-5 w-5 dark:block" />
  </button>;
}

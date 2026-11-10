'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Tag, Store, Menu, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import ThemeToggle from './ThemeToggle';

export default function Navigation() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const navigation = useRef<HTMLElement>(null);
  useEffect(() => { setMenuOpen(false); }, [pathname]);
  useEffect(() => {
    if (!menuOpen) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') { setMenuOpen(false); menuButton.current?.focus(); }
    }
    function onPointer(event: PointerEvent) {
      if (!navigation.current?.contains(event.target as Node)) setMenuOpen(false);
    }
    const media = window.matchMedia('(min-width: 768px)');
    const close = () => { if (media.matches) setMenuOpen(false); };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    media.addEventListener('change', close);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
      media.removeEventListener('change', close);
    };
  }, [menuOpen]);

  const navItems = [
    { href: '/', label: '홈', icon: Home },
    { href: '/search', label: '검색', icon: Search },
    { href: '/categories', label: '카테고리', icon: Tag },
    { href: '/malls', label: '쇼핑몰', icon: Store }
  ];

  return (
    <nav ref={navigation} aria-label="주 메뉴" className="bg-white dark:bg-slate-900 shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between flex-wrap gap-3 py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-blue-600">팔도강산</span>

          </Link>

          {/* Nav Items */}
          <div className="flex items-center gap-1">
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
          <ThemeToggle />
          <button ref={menuButton} type="button" aria-expanded={menuOpen} aria-controls="mobile-navigation" aria-label={menuOpen ? '메뉴 닫기' : '메뉴 열기'} onClick={() => setMenuOpen(open => !open)} className="md:hidden rounded-lg p-3 hover:bg-gray-100 dark:hover:bg-slate-800">
            {menuOpen ? <X aria-hidden="true" className="h-6 w-6" /> : <Menu aria-hidden="true" className="h-6 w-6" />}
          </button>
          </div>
        </div>
        <div id="mobile-navigation" hidden={!menuOpen} className="md:hidden border-t py-3">
          {navItems.map(item => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return <Link key={item.href} href={item.href} aria-current={active ? 'page' : undefined} onClick={() => setMenuOpen(false)} className={`flex items-center gap-3 rounded-lg p-3 ${active ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'text-gray-600 hover:bg-gray-50 dark:text-slate-200 dark:hover:bg-slate-800'}`}><Icon aria-hidden="true" className="h-5 w-5" />{item.label}</Link>;
          })}
        </div>
      </div>
    </nav>
  );
}

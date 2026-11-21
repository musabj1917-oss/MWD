"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon } from 'lucide-react';

export function Header() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const current = document.documentElement.getAttribute('data-theme');
    if (current === 'dark') {
      setTheme('dark');
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('mwd-theme', next);
  };

  return (
    <header className="bg-white/90 dark:bg-[#09090B]/90 backdrop-blur-md border-b border-black/5 dark:border-white/10 sticky top-0 z-50 transition-colors">
      <div className="container flex items-center justify-between h-16">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-extrabold text-xl tracking-tight text-neutral-950 dark:text-white flex items-center gap-1.5">
            MWD<span className="w-2 h-2 rounded-full bg-red-600 inline-block" />
          </Link>
          <nav className="hidden md:flex items-center gap-6" aria-label="Primary navigation">
            <Link href="/" className="text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-red-600 dark:hover:text-red-500 transition-colors">Home</Link>
            <Link href="/services" className="text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-red-600 dark:hover:text-red-500 transition-colors">Services</Link>
            <Link href="/portfolio" className="text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-red-600 dark:hover:text-red-500 transition-colors">Portfolio</Link>
            <Link href="/pricing" className="text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-red-600 dark:hover:text-red-500 transition-colors">Pricing</Link>
            <Link href="/about" className="text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-red-600 dark:hover:text-red-500 transition-colors">About</Link>
            <Link href="/faq" className="text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-red-600 dark:hover:text-red-500 transition-colors">FAQ</Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 hover:text-red-600 dark:hover:text-red-500 transition-colors"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/request-quote" className="btn-primary text-xs px-4 py-2">
              Request Quote
            </Link>
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden">
            <button aria-label="Open menu" onClick={() => setOpen(true)} className="p-2 text-neutral-800 dark:text-neutral-200">
              <Menu size={22} />
            </button>
          </div>
        </div>

        {open && (
          <div className="fixed inset-0 bg-white dark:bg-[#09090B] z-50 p-6 md:hidden flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-black/5 dark:border-white/10 pb-4">
                <Link href="/" onClick={() => setOpen(false)} className="font-bold text-lg text-neutral-950 dark:text-white">
                  MWD<span className="w-2 h-2 rounded-full bg-red-600 inline-block ml-1" />
                </Link>
                <button aria-label="Close menu" onClick={() => setOpen(false)} className="p-2 text-neutral-800 dark:text-neutral-200">
                  <X size={22} />
                </button>
              </div>
              <nav className="mt-8 flex flex-col gap-4">
                <Link href="/" onClick={() => setOpen(false)} className="text-lg font-semibold text-neutral-900 dark:text-white">Home</Link>
                <Link href="/services" onClick={() => setOpen(false)} className="text-lg font-semibold text-neutral-900 dark:text-white">Services</Link>
                <Link href="/portfolio" onClick={() => setOpen(false)} className="text-lg font-semibold text-neutral-900 dark:text-white">Portfolio</Link>
                <Link href="/pricing" onClick={() => setOpen(false)} className="text-lg font-semibold text-neutral-900 dark:text-white">Pricing</Link>
                <Link href="/about" onClick={() => setOpen(false)} className="text-lg font-semibold text-neutral-900 dark:text-white">About</Link>
                <Link href="/faq" onClick={() => setOpen(false)} className="text-lg font-semibold text-neutral-900 dark:text-white">FAQ</Link>
                <Link href="/contact" onClick={() => setOpen(false)} className="text-lg font-semibold text-neutral-900 dark:text-white">Contact</Link>
              </nav>
            </div>

            <div className="pt-6 border-t border-black/5 dark:border-white/10">
              <Link href="/request-quote" onClick={() => setOpen(false)} className="btn-primary w-full text-center py-3">
                Request a Free Quote
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

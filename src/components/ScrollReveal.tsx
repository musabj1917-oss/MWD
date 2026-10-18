'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Elements inside <main> that fade and slide up as they scroll into view
const TARGETS = '#main section > *, #main header > *, #main article, #main .grid > *, #main details, #main form';

/** Scroll-reveal animation for the public site. Does nothing on /admin pages. */
export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname?.startsWith('/admin')) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const seen = new Set<Element>();
    const items: HTMLElement[] = [];
    document.querySelectorAll<HTMLElement>(TARGETS).forEach((el) => {
      if (seen.has(el)) return;
      seen.add(el);
      // Skip what is already on screen and anything nested inside an animated parent
      if (el.getBoundingClientRect().top < window.innerHeight * 0.95) return;
      if (el.parentElement?.closest('[data-reveal]')) return;
      items.push(el);
    });

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).classList.add('reveal-in');
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0 },
    );

    items.forEach((el) => {
      const siblings = el.parentElement ? Array.from(el.parentElement.children) : [];
      const index = Math.min(siblings.indexOf(el), 4);
      el.setAttribute('data-reveal', '');
      el.style.transitionDelay = `${index * 90}ms`;
      el.classList.add('reveal');
      observer.observe(el);
    });

    return () => {
      observer.disconnect();
      items.forEach((el) => {
        el.classList.remove('reveal', 'reveal-in');
        el.removeAttribute('data-reveal');
        el.style.transitionDelay = '';
      });
    };
  }, [pathname]);

  return null;
}

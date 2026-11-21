import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { TelegramButton } from '@/components/TelegramButton';
import { PublicOnly } from '@/components/PublicOnly';
import { ScrollReveal } from '@/components/ScrollReveal';
import { ThreeDBackground } from '@/components/ThreeDBackground';
import { SITE, siteUrl, telegramHref } from '@/lib/site';

const normalizedUrl = siteUrl;

export const metadata: Metadata = {
  title: 'MWD — Web Design & Digital Solutions',
  description: 'MWD delivers high-end website design, e-commerce stores, and digital menus for businesses in Ethiopia and beyond.',
  metadataBase: new URL(normalizedUrl),
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE.name,
  url: normalizedUrl,
  email: SITE.email,
  telephone: SITE.phoneTel,
  sameAs: [SITE.github, telegramHref],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem('mwd-theme');var p=window.matchMedia('(prefers-color-scheme: dark)').matches;var t=s||(p?'dark':'light');document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;600;700;800&family=Instrument+Sans:wght@400;500;600;700&display=swap"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-transparent text-black dark:text-[#EDEDED] relative">
        <ThreeDBackground />
        <div className="relative z-10 flex flex-col min-h-screen">
          <a href="#main" className="sr-only focus:not-sr-only">Skip to content</a>
          <PublicOnly><Header /></PublicOnly>
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
          <main id="main" className="flex-grow">
            {children}
          </main>
          <ScrollReveal />
          <PublicOnly>
            <Footer />
            <WhatsAppButton />
            <TelegramButton />
          </PublicOnly>
        </div>
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { TelegramButton } from '@/components/TelegramButton';
import { PublicOnly } from '@/components/PublicOnly';
import { SITE, telegramHref } from '@/lib/site';

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://mwd-xm8f.vercel.app').replace(/\/$/, '');
const normalizedUrl = /^https?:\/\//.test(siteUrl) ? siteUrl : `https://${siteUrl}`;

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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@400;600;700&display=swap"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-white text-black">
        <a href="#main" className="sr-only focus:not-sr-only">Skip to content</a>
        <PublicOnly><Header /></PublicOnly>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
        <main id="main" className="flex-grow">
          {children}
        </main>
        <PublicOnly>
          <Footer />
          <WhatsAppButton />
          <TelegramButton />
        </PublicOnly>
      </body>
    </html>
  );
}

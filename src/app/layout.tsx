import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400','600','700'], display: 'swap' });

export const metadata: Metadata = {
  title: 'MWD — Web Design & Digital Solutions',
  description: 'MWD delivers high-end website design, e-commerce stores, and digital menus for businesses in Ethiopia and beyond.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://mwd-xm8f.vercel.app'),
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mwd-xm8f.vercel.app';
const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'MWD',
  url: siteUrl,
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  url: siteUrl,
  potentialAction: {
    '@type': 'SearchAction',
    target: `${siteUrl}/?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.className} ${playfair.className}`}>
      <body className="min-h-screen flex flex-col bg-white text-black">
        <a href="#main" className="sr-only focus:not-sr-only">Skip to content</a>
        <Header />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
        <main id="main" className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

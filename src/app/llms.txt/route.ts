import { NextResponse } from 'next/server';
import { siteUrl } from '@/lib/site';

export async function GET() {
  const baseUrl = siteUrl;

  const content = `# MWD Site - Digital Agency

MWD Site is a full-stack digital agency specializing in empowering businesses with high-quality web solutions.

## Core Services
1. Website Development: Custom business websites, landing pages, and web apps built for performance and SEO.
2. Dropshipping & E-commerce: Complete online store setups, product catalogs, and secure checkouts.
3. Digital Menus: Modern, interactive QR-code digital menus for restaurants.

## Important Links
- Home: ${baseUrl}/
- Services: ${baseUrl}/services
- Portfolio: ${baseUrl}/portfolio
- Pricing: ${baseUrl}/pricing
- About: ${baseUrl}/about
- Contact: ${baseUrl}/contact
- Request a Quote: ${baseUrl}/request-quote
- FAQ: ${baseUrl}/faq
- Telegram: https://t.me/Ethiofreelancer_m
`;

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}

import { MetadataRoute } from 'next';
import { db } from '@/db';
import { portfolioProjects } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { siteUrl } from '@/lib/site';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteUrl;

  const publishedPortfolio = await db.select().from(portfolioProjects).where(eq(portfolioProjects.published, true));

  const portfolioUrls = publishedPortfolio.map((project) => ({
    url: `${baseUrl}/portfolio/${project.slug}`,
    lastModified: new Date(project.createdAt),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const staticRoutes = [
    '',
    '/services',
    '/services/website-development',
    '/services/ecommerce',
    '/services/digital-menus',
    '/portfolio',
    '/pricing',
    '/about',
    '/contact',
    '/request-quote',
    '/faq',
    '/privacy',
    '/terms',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  return [...staticRoutes, ...portfolioUrls];
}

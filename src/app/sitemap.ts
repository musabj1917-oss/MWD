import { MetadataRoute } from 'next';
import { db } from '@/db';
import { services, portfolioProjects, faqs } from '@/db/schema';
import { eq } from 'drizzle-orm';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const publishedServices = await db.select().from(services).where(eq(services.published, true));
  const publishedPortfolio = await db.select().from(portfolioProjects).where(eq(portfolioProjects.published, true));

  const serviceUrls = publishedServices.map((service: any) => ({
    url: `${baseUrl}/services/${service.slug}`,
    lastModified: new Date(service.createdAt),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  const portfolioUrls = publishedPortfolio.map((project: any) => ({
    url: `${baseUrl}/portfolio/${project.slug}`,
    lastModified: new Date(project.createdAt),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const staticRoutes = [
    '',
    '/services',
    '/portfolio',
    '/pricing',
    '/about',
    '/contact',
    '/request-quote',
    '/faq',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  return [...staticRoutes, ...serviceUrls, ...portfolioUrls] as any;
}

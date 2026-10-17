import { NextResponse } from 'next/server';
import { db } from '@/db';
import { faqs } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const publishedFaqs = await db.select().from(faqs).where(eq(faqs.published, true));

  let content = `# MWD Site - Comprehensive Overview\n\n`;
  content += `MWD Site is a full-stack digital agency building reliable, fast, and accessible digital solutions.\n\n`;

  content += `## Services Overview\n`;
  content += `We offer Website Development, E-commerce Solutions, and Digital Menus. Visit ${baseUrl}/services for details.\n\n`;

  content += `## Frequently Asked Questions\n`;
  if (publishedFaqs.length > 0) {
      publishedFaqs.forEach((faq: any) => {
          content += `**Q: ${faq.question}**\nA: ${faq.answer}\n\n`;
      });
  } else {
       content += `No FAQs are currently published. Visit ${baseUrl}/faq.\n\n`;
  }

  content += `## Contact & Quotes\n`;
  content += `To request a custom quote, visit ${baseUrl}/request-quote.\n`;
  content += `For general inquiries, visit ${baseUrl}/contact or email musabj1917@gmail.com.\n`;

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}

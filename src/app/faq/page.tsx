import { db } from '@/db';
import { faqs } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Frequently Asked Questions | MWD Site',
  description: 'Find answers to common questions about our web development and digital services.',
};


export default async function FAQPage() {
  const faqList = await db.select().from(faqs).where(eq(faqs.published, true)).orderBy(asc(faqs.displayOrder));

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold mb-4 text-center text-gray-900">Frequently Asked Questions</h1>
      <p className="text-xl text-center text-gray-600 mb-12">
        Find answers to common questions about working with us.
      </p>

      {faqList.length === 0 ? (
        <p className="text-center text-gray-500 bg-gray-50 py-10 rounded border">No FAQs available at the moment. Please contact us directly.</p>
      ) : (
        <div className="space-y-6">
          {faqList.map((faq: any) => (
            <div key={faq.id} className="bg-white p-6 rounded-lg border shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{faq.question}</h3>
              <p className="text-gray-700">{faq.answer}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

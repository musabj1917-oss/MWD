import Link from 'next/link';

export const metadata = {
  title: 'FAQ — MWD',
  description: 'Frequently asked questions about MWD services, collaboration, timelines, and project scope.',
};

const faqs = [
  {
    question: 'What kind of projects does MWD take on?',
    answer: 'MWD works on business websites, landing pages, e-commerce stores, digital menus, and other brand-focused digital experiences.',
  },
  {
    question: 'How long does a project usually take?',
    answer: 'Timeline depends on scope, but most projects move through discovery, design, build, and launch in a structured, phased workflow.',
  },
  {
    question: 'Do you offer custom packages?',
    answer: 'Yes. We can scope projects for your specific business goals and build a custom proposal around the work, timeline, and deliverables needed.',
  },
];

export default function FAQPage() {
  return (
    <div className="container py-20">
      <header className="max-w-3xl mb-12">
        <p className="text-red-600 font-semibold uppercase tracking-[0.2em] text-xs">FAQ</p>
        <h1 className="text-4xl md:text-5xl font-bold mt-4">Frequently asked questions.</h1>
      </header>

      <div className="space-y-6">
        {faqs.map((faq) => (
          <article key={faq.question} className="border p-6">
            <h2 className="text-xl font-semibold mb-3">{faq.question}</h2>
            <p className="text-gray-700">{faq.answer}</p>
          </article>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Link href="/contact" className="btn-primary">Have another question?</Link>
      </div>
    </div>
  );
}

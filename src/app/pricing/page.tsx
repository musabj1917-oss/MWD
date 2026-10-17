import Link from 'next/link';

export const metadata = {
  title: 'Pricing — MWD',
  description: 'Flexible project packages and custom quotes for MWD services.',
};

export default function PricingPage() {
  const packages = [
    {
      name: 'Business Launch',
      description: 'For founders who need a polished, conversion-ready website without the complexity of a full custom build.',
      price: 'Custom quote',
    },
    {
      name: 'Growth Store',
      description: 'For businesses that need storefront functionality, catalog structure, and a clear sales path.',
      price: 'Custom quote',
    },
    {
      name: 'Menu System',
      description: 'For restaurants and cafes that want a modern digital menu with easy content changes and mobile-first use.',
      price: 'Custom quote',
    },
  ];

  return (
    <div className="container py-20">
      <header className="max-w-3xl mb-12">
        <p className="text-red-600 font-semibold uppercase tracking-[0.2em] text-xs">Pricing</p>
        <h1 className="text-4xl md:text-5xl font-bold mt-4">Clear scope. Fair pricing. No guesswork.</h1>
      </header>

      <section className="grid md:grid-cols-3 gap-6 mb-12">
        {packages.map((pkg) => (
          <article key={pkg.name} className="border p-8">
            <h2 className="text-2xl font-semibold mb-3">{pkg.name}</h2>
            <p className="text-gray-700 mb-6">{pkg.description}</p>
            <div className="text-3xl font-bold mb-6">{pkg.price}</div>
            <Link href="/request-quote" className="btn-primary">Request this</Link>
          </article>
        ))}
      </section>

      <section className="border p-8 bg-gray-50">
        <h2 className="text-2xl font-semibold mb-3">Need a tailored quote?</h2>
        <p className="text-gray-700 mb-6">Large projects, multi-page sites, complex stores, or custom integrations may require a tailored scope and timeline. We can cover that with a short discovery call.</p>
        <Link href="/request-quote" className="btn-primary">Discuss your project</Link>
      </section>
    </div>
  );
}

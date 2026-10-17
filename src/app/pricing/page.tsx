import Link from 'next/link';
import { db } from '@/db';
import { packages } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const metadata = {
  title: 'Pricing | MWD Site',
  description: 'View our transparent pricing and service packages for digital solutions.',
};


export default async function PricingPage() {
  const allPackages = await db.select().from(packages).where(eq(packages.published, true));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Transparent Pricing</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Choose the right package for your business needs. No hidden fees.
        </p>
      </div>

      {allPackages.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-lg border">
          <h2 className="text-2xl font-semibold text-gray-600 mb-2">Packages Coming Soon</h2>
          <p className="text-gray-500 mb-6">We are currently structuring our packages. Please request a custom quote.</p>
          <Link href="/request-quote" className="bg-blue-600 text-white px-6 py-3 rounded font-semibold hover:bg-blue-700">Get a Custom Quote</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          {allPackages.map((pkg: any) => (
            <div key={pkg.id} className="bg-white border rounded-lg p-8 shadow-sm flex flex-col">
              <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
              <p className="text-gray-600 mb-6 h-12">{pkg.description}</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">${(pkg.price / 100).toFixed(2)}</span>
                <span className="text-gray-500 ml-2">/ {pkg.billingType}</span>
              </div>
              <ul className="mb-8 space-y-3 flex-grow text-gray-700">
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Standard features included</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Professional design</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Basic SEO setup</li>
              </ul>
              <Link href={`/request-quote?package=${pkg.slug}`} className="block w-full text-center bg-blue-600 text-white px-6 py-3 rounded font-semibold hover:bg-blue-700 mt-auto">
                Get Started
              </Link>
            </div>
          ))}
        </div>
      )}

       <div className="mt-20 text-center">
            <h2 className="text-2xl font-bold mb-4">Need something custom?</h2>
            <p className="text-gray-600 mb-8">We offer tailored solutions for complex projects.</p>
             <Link href="/request-quote" className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition">
                Contact Sales
             </Link>
       </div>
    </div>
  );
}

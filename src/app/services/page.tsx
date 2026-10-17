import Link from 'next/link';

export const metadata = {
    title: 'Services — MWD',
    description: 'Services at MWD: Website Development, E-commerce, and Digital Menus with a focus on performance and design.',
};

export default function ServicesPage() {
    return (
        <main className="container py-20">
            <header className="mb-12">
                <h1 className="text-4xl font-bold">Services</h1>
                <p className="text-gray-600 mt-4">We focus on a concise set of services so we can deliver thoughtful, well-executed work.</p>
            </header>

            <section className="grid md:grid-cols-2 gap-8 mb-12">
                <article className="border p-8">
                    <h2 className="text-2xl font-semibold mb-4">Website Development</h2>
                    <p className="text-gray-700 mb-4">Builds that balance design and technical performance: static and dynamic pages, CMS integrations, accessibility and SEO-first architecture.</p>
                    <ul className="list-disc pl-5 text-gray-700 mb-6">
                        <li>Responsive editorial designs</li>
                        <li>Next.js & performant front-end</li>
                        <li>Accessible markup and semantic HTML</li>
                    </ul>
                    <Link href="/services/website-development" className="text-red-600 font-medium">Explore →</Link>
                </article>

                <article className="border p-8">
                    <h2 className="text-2xl font-semibold mb-4">E-commerce</h2>
                    <p className="text-gray-700 mb-4">Storefronts optimized for conversion and reliability. Integrations with Stripe, inventory sync, and CMS-driven catalogs when required.</p>
                    <ul className="list-disc pl-5 text-gray-700 mb-6">
                        <li>Custom storefronts and cart flows</li>
                        <li>Secure checkout with Stripe</li>
                        <li>Integrations for shipping and fulfillment</li>
                    </ul>
                    <Link href="/services/ecommerce" className="text-red-600 font-medium">Explore →</Link>
                </article>
            </section>

            <section className="mb-12">
                <article className="border p-8">
                    <h2 className="text-2xl font-semibold mb-4">Digital Menus</h2>
                    <p className="text-gray-700 mb-4">QR-enabled menus designed for speed and clarity. Easy updates, accessible layout, and printed QR integration guidance.</p>
                    <ul className="list-disc pl-5 text-gray-700 mb-6">
                        <li>Mobile-first menu designs</li>
                        <li>Simple admin interface for menu changes</li>
                        <li>Offline-friendly caching for repeat visitors</li>
                    </ul>
                    <Link href="/services/digital-menus" className="text-red-600 font-medium">Explore →</Link>
                </article>
            </section>

            <section>
                <h3 className="text-xl font-semibold mb-3">How we work</h3>
                <ol className="list-decimal pl-5 text-gray-700">
                    <li>Discovery & scope — we align on objectives and success metrics.</li>
                    <li>Design — art-directed visuals and interaction design.</li>
                    <li>Build — performant, tested implementation.</li>
                    <li>Launch & iterate — measurement and phased improvements.</li>
                </ol>
            </section>
        </main>
    );
}

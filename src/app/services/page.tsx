import Link from 'next/link';

export const metadata = {
    title: 'Our Services | MWD Site',
    description: 'Explore our digital agency services including Website Development, E-commerce, and Digital Menus.',
};

export default function ServicesPage() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h1 className="text-4xl font-bold mb-8 text-center text-gray-900">Our Services</h1>
            <p className="text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">
                We provide comprehensive digital solutions to help your business thrive online. From custom websites to robust e-commerce platforms and modern restaurant menus.
            </p>

            <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white p-8 rounded-lg shadow-sm border flex flex-col">
                    <h2 className="text-2xl font-bold mb-4 text-blue-900">Website Development</h2>
                    <p className="text-gray-600 mb-6 flex-grow">
                        Professional business websites, landing pages, and custom web applications. We focus on performance, accessibility, and SEO to ensure your site reaches its full potential.
                    </p>
                    <Link href="/services/website-development" className="text-blue-600 font-semibold hover:underline mt-auto">
                        View Details &rarr;
                    </Link>
                </div>
                
                <div className="bg-white p-8 rounded-lg shadow-sm border flex flex-col">
                    <h2 className="text-2xl font-bold mb-4 text-blue-900">E-commerce Solutions</h2>
                    <p className="text-gray-600 mb-6 flex-grow">
                        End-to-end dropshipping and e-commerce store setup. We handle product catalogs, shopping carts, secure checkout, and order management.
                    </p>
                    <Link href="/services/ecommerce" className="text-blue-600 font-semibold hover:underline mt-auto">
                        View Details &rarr;
                    </Link>
                </div>

                <div className="bg-white p-8 rounded-lg shadow-sm border flex flex-col">
                    <h2 className="text-2xl font-bold mb-4 text-blue-900">Digital Menus</h2>
                    <p className="text-gray-600 mb-6 flex-grow">
                        Modernize your restaurant with interactive QR-code digital menus. Easy to update, mobile-friendly, and beautifully branded.
                    </p>
                    <Link href="/services/digital-menus" className="text-blue-600 font-semibold hover:underline mt-auto">
                        View Details &rarr;
                    </Link>
                </div>
            </div>
        </div>
    );
}

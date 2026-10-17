import Link from 'next/link';

export const metadata = {
    title: 'E-commerce & Dropshipping Services | MWD Site',
    description: 'Launch your online store with our comprehensive e-commerce and dropshipping development services.',
};

export default function EcommercePage() {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h1 className="text-4xl font-bold mb-6 text-gray-900">Dropshipping & E-commerce</h1>
            <div className="prose max-w-none text-gray-700 text-lg space-y-6">
                <p>
                    Sell products anywhere with a robust, scalable e-commerce platform. Whether you manage your own inventory or utilize dropshipping, we provide the technical foundation you need.
                </p>
                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">What's Included</h2>
                <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Store Creation:</strong> Complete setup of your online storefront.</li>
                    <li><strong>Product Catalogs:</strong> Organized categories, variants, and detailed product pages.</li>
                    <li><strong>Shopping Cart & Checkout:</strong> Secure, frictionless payment integrations.</li>
                    <li><strong>Order Management:</strong> Tools to track and fulfill customer orders.</li>
                </ul>
                
                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Key Features</h2>
                <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Mobile-Friendly Shopping:</strong> Optimized for on-the-go purchases.</li>
                    <li><strong>Technical SEO:</strong> Ensure your products can be found on search engines.</li>
                    <li><strong>Analytics Integration:</strong> Track visitor behavior and sales performance.</li>
                </ul>
            </div>
            
            <div className="mt-12 bg-gray-50 p-8 rounded-lg border">
                <h3 className="text-2xl font-bold mb-4">Start selling online today</h3>
                <p className="text-gray-600 mb-6">Contact us to get a custom quote for your e-commerce project.</p>
                <Link href="/request-quote" className="bg-blue-600 text-white px-6 py-3 rounded font-semibold hover:bg-blue-700 transition">
                    Request a Quote
                </Link>
            </div>
        </div>
    );
}

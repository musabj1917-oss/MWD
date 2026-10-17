import Link from 'next/link';

export const metadata = {
    title: 'Website Development Services | MWD Site',
    description: 'Custom business websites, landing pages, and web applications built for speed, SEO, and accessibility.',
};

export default function WebsiteDevelopmentPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h1 className="text-4xl font-bold mb-6 text-gray-900">Website Development</h1>
            <div className="prose max-w-none text-gray-700 text-lg space-y-6">
                <p>
                    Your website is often the first impression a potential customer has of your business. We create professional, fast, and secure websites tailored to your specific goals.
                </p>
                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">What We Build</h2>
                <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Business Websites:</strong> Establish trust and communicate your services clearly.</li>
                    <li><strong>Landing Pages:</strong> High-conversion pages designed for marketing campaigns.</li>
                    <li><strong>Portfolio Websites:</strong> Showcase your work with beautiful galleries.</li>
                    <li><strong>Website Redesigns:</strong> Modernize your outdated online presence.</li>
                </ul>
                
                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Our Approach</h2>
                <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Responsive Design:</strong> Perfect display on mobile phones, tablets, and desktops.</li>
                    <li><strong>SEO Optimization:</strong> Built with search engine discoverability in mind.</li>
                    <li><strong>Accessibility:</strong> Ensuring your site is usable by everyone.</li>
                    <li><strong>Performance:</strong> Fast loading times to reduce bounce rates.</li>
                </ul>
            </div>
            
            <div className="mt-12 bg-gray-50 p-8 rounded-lg border">
                <h3 className="text-2xl font-bold mb-4">Ready to build your website?</h3>
                <p className="text-gray-600 mb-6">Let's discuss your requirements and create a tailored plan for your business.</p>
                <Link href="/request-quote" className="bg-blue-600 text-white px-6 py-3 rounded font-semibold hover:bg-blue-700 transition">
                    Request a Quote
                </Link>
            </div>
        </div>
    );
}

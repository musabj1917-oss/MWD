import Link from 'next/link';

export const metadata = {
    title: 'Digital Restaurant Menus | MWD Site',
    description: 'Modern, interactive QR-code digital menus for restaurants and cafes.',
};

export default function DigitalMenusPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h1 className="text-4xl font-bold mb-6 text-gray-900">Digital Restaurant Menus</h1>
            <div className="prose max-w-none text-gray-700 text-lg space-y-6">
                <p>
                    Replace outdated paper menus with modern, hygienic, and easily updatable QR-code digital menus. Enhance your guests' dining experience with interactive catalogs.
                </p>
                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Core Features</h2>
                <ul className="list-disc pl-6 space-y-2">
                    <li><strong>QR-Code Access:</strong> Instant menu loading without downloading an app.</li>
                    <li><strong>Mobile-First Design:</strong> Beautifully formatted for smartphones.</li>
                    <li><strong>Categorized Items:</strong> Easy navigation through appetizers, mains, drinks, etc.</li>
                    <li><strong>Rich Imagery:</strong> Showcase your dishes with high-quality photos and descriptions.</li>
                </ul>
                
                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Benefits for Your Restaurant</h2>
                <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Instant Updates:</strong> Change prices or remove sold-out items immediately.</li>
                    <li><strong>Cost Savings:</strong> Eliminate recurring printing costs.</li>
                    <li><strong>Brand Consistency:</strong> Customized to match your restaurant's unique identity.</li>
                </ul>
            </div>
            
            <div className="mt-12 bg-gray-50 p-8 rounded-lg border">
                <h3 className="text-2xl font-bold mb-4">Upgrade your dining experience</h3>
                <p className="text-gray-600 mb-6">Get a professional digital menu setup for your restaurant.</p>
                <Link href="/request-quote" className="bg-blue-600 text-white px-6 py-3 rounded font-semibold hover:bg-blue-700 transition">
                    Request a Quote
                </Link>
            </div>
        </div>
    );
}

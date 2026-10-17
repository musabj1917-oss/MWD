import Link from 'next/link';

export function Header() {
  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="font-bold text-xl text-blue-900">
              MWD Site
            </Link>
          </div>
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600">Home</Link>
            <Link href="/services" className="text-gray-700 hover:text-blue-600">Services</Link>
            <Link href="/portfolio" className="text-gray-700 hover:text-blue-600">Portfolio</Link>
            <Link href="/pricing" className="text-gray-700 hover:text-blue-600">Pricing</Link>
            <Link href="/about" className="text-gray-700 hover:text-blue-600">About</Link>
          </nav>
          <div className="hidden md:flex items-center space-x-4">
             <Link href="/request-quote" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
              Request a Quote
             </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

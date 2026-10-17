import Link from 'next/link';

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-blue-900 text-white py-20 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Empowering Your Digital Presence
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            We build professional websites, scalable e-commerce stores, and innovative digital menus that drive results for your business.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/request-quote" className="bg-white text-blue-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
              Request a Quote
            </Link>
            <Link href="/services" className="border border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-900 transition">
              Explore Services
            </Link>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Our Core Services</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-xl font-bold mb-4">Website Development</h3>
              <p className="text-gray-600 mb-4">Custom business websites, landing pages, and web applications built for speed and conversion.</p>
              <Link href="/services/website-development" className="text-blue-600 font-semibold hover:underline">Learn more &rarr;</Link>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-xl font-bold mb-4">E-commerce Solutions</h3>
              <p className="text-gray-600 mb-4">Scalable dropshipping and online stores to help you sell products anywhere.</p>
              <Link href="/services/ecommerce" className="text-blue-600 font-semibold hover:underline">Learn more &rarr;</Link>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-xl font-bold mb-4">Digital Menus</h3>
              <p className="text-gray-600 mb-4">Interactive, QR-code based digital menus tailored for restaurants and cafes.</p>
              <Link href="/services/digital-menus" className="text-blue-600 font-semibold hover:underline">Learn more &rarr;</Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to action */}
      <section className="py-20 px-4 text-center">
         <h2 className="text-3xl font-bold mb-4 text-gray-900">Ready to start your project?</h2>
         <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">Contact us today to discuss your requirements and receive a detailed, no-obligation quote.</p>
         <Link href="/contact" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
            Contact Us Now
         </Link>
      </section>
    </div>
  );
}

import Link from 'next/link';

export const metadata = {
  title: 'About Us | MWD Site',
  description: 'Learn about MWD Site, our mission, and our approach to digital services.',
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-900">About MWD Site</h1>
      
      <div className="prose max-w-none text-gray-700 text-lg space-y-6">
        <p>
          At <strong>MWD Site</strong>, we believe that every business deserves a powerful digital presence. 
          We are a full-stack digital agency specializing in website development, dropshipping e-commerce stores, and digital restaurant menus.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Our Mission</h2>
        <p>
          Our mission is to bridge the gap between businesses and their online potential. We build reliable, fast, and accessible digital solutions that not only look great but also drive tangible results. We focus on modern technologies to provide our clients with the best possible platforms.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Our Approach</h2>
        <p>
          We don't just write code; we solve business problems. Our development process involves:
        </p>
        <ul className="list-disc pl-6 space-y-2">
            <li><strong>Understanding:</strong> Learning about your business goals and target audience.</li>
            <li><strong>Strategy:</strong> Planning the right architecture, design, and user experience.</li>
            <li><strong>Execution:</strong> Building the solution with modern frameworks like Next.js and secure databases.</li>
            <li><strong>Delivery:</strong> Testing thoroughly before launching your project to the world.</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Why Choose Us?</h2>
        <p>
          We prioritize quality, security, and performance. Unlike template-farm agencies, we build tailored solutions that can scale as your business grows. We keep our communication clear, our pricing transparent, and our code clean.
        </p>
      </div>

      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Let's build something great together.</h2>
        <Link href="/contact" className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
          Contact Us
        </Link>
      </div>
    </div>
  );
}

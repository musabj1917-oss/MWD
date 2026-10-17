import Link from 'next/link';
import { SITE, telHref, mailHref, whatsappHref } from '@/lib/site';

export function Footer() {
  return (
    <footer className="bg-black text-white py-12">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div>
            <span className="text-2xl font-bold">MWD</span>
            <p className="mt-4 text-gray-400">Web design and digital solutions focused on clarity, performance, and measurable results.</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">Services</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/services/website-development" className="hover:text-white">Website Design</Link></li>
              <li><Link href="/services/ecommerce" className="hover:text-white">E-commerce</Link></li>
              <li><Link href="/services/digital-menus" className="hover:text-white">Digital Menus</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">Company</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/about" className="hover:text-white">About</Link></li>
              <li><Link href="/portfolio" className="hover:text-white">Portfolio</Link></li>
              <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
              <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">Legal</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">Get in touch</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href={mailHref} className="hover:text-white" style={{ color: 'inherit' }}>{SITE.email}</a></li>
              <li><a href={telHref} className="hover:text-white" style={{ color: 'inherit' }}>{SITE.phoneDisplay}</a></li>
              <li><a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="hover:text-white" style={{ color: 'inherit' }}>WhatsApp</a></li>
              <li><a href={SITE.github} target="_blank" rel="noopener noreferrer" className="hover:text-white" style={{ color: 'inherit' }}>GitHub</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} MWD. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

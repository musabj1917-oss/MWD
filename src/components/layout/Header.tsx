"use client";
import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="container flex items-center justify-between h-16">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-bold text-lg text-black">MWD</Link>
          <nav className="hidden md:flex items-center gap-6" aria-label="Primary navigation">
            <Link href="/" className="text-gray-800 hover:text-red-600">Home</Link>
            <Link href="/services" className="text-gray-800 hover:text-red-600">Services</Link>
            <Link href="/portfolio" className="text-gray-800 hover:text-red-600">Portfolio</Link>
            <Link href="/pricing" className="text-gray-800 hover:text-red-600">Pricing</Link>
            <Link href="/about" className="text-gray-800 hover:text-red-600">About</Link>
          </nav>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Link href="/request-quote" className="btn-ghost">Request a Quote</Link>
          <Link href="/contact" className="btn-primary">Contact</Link>
        </div>

        {/* Mobile */}
        <div className="md:hidden">
          <button aria-label="Open menu" onClick={() => setOpen(true)} className="p-2">
            <Menu size={20} />
          </button>
        </div>

        {open && (
          <div className="fixed inset-0 bg-white z-50 p-6 md:hidden">
            <div className="flex items-center justify-between">
              <Link href="/" className="font-bold text-lg">MWD</Link>
              <button aria-label="Close menu" onClick={() => setOpen(false)} className="p-2">
                <X size={20} />
              </button>
            </div>
            <nav className="mt-8 flex flex-col gap-4">
              <Link href="/" onClick={() => setOpen(false)} className="text-black">Home</Link>
              <Link href="/services" onClick={() => setOpen(false)} className="text-black">Services</Link>
              <Link href="/portfolio" onClick={() => setOpen(false)} className="text-black">Portfolio</Link>
              <Link href="/pricing" onClick={() => setOpen(false)} className="text-black">Pricing</Link>
              <Link href="/about" onClick={() => setOpen(false)} className="text-black">About</Link>
              <Link href="/request-quote" onClick={() => setOpen(false)} className="btn-ghost mt-4">Request a Quote</Link>
              <Link href="/contact" onClick={() => setOpen(false)} className="btn-primary mt-2">Contact</Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

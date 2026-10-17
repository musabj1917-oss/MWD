import Link from 'next/link';

export const metadata = {
  title: 'Contact MWD — Digital Agency',
  description: 'Contact MWD for website design, e-commerce, digital menu, and growth-focused digital projects.',
};

export default function ContactPage() {
  return (
    <main className="container py-20">
      <div className="grid lg:grid-cols-2 gap-10">
        <div>
          <p className="text-red-600 font-semibold uppercase tracking-[0.2em] text-xs">Contact</p>
          <h1 className="text-4xl md:text-5xl font-bold mt-4 mb-6">Let’s talk about your next move.</h1>
          <p className="text-gray-700 mb-8">We’d love to hear what you are building. Use the form or send a direct message. We usually respond within one business day.</p>

          <div className="space-y-6 text-gray-700">
            <div>
              <h2 className="font-semibold text-lg mb-1">Email</h2>
              <p>hello@mwdsite.com</p>
            </div>
            <div>
              <h2 className="font-semibold text-lg mb-1">Phone</h2>
              <p>+251 9XX XXX XXX</p>
            </div>
            <div>
              <h2 className="font-semibold text-lg mb-1">Location</h2>
              <p>Addis Ababa, Ethiopia</p>
            </div>
          </div>
        </div>

        <div className="border p-8 bg-white">
          <h2 className="text-2xl font-semibold mb-6">Send a message</h2>
          <form className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input type="text" className="w-full border p-3" placeholder="Your name" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input type="email" className="w-full border p-3" placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Project details</label>
              <textarea rows={5} className="w-full border p-3" placeholder="Tell us about your project" />
            </div>
            <button type="submit" className="btn-primary w-full">Send enquiry</button>
          </form>
        </div>
      </div>
    </main>
  );
}

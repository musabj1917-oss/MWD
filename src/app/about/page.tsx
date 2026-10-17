import Link from 'next/link';

export const metadata = {
  title: 'About MWD — Digital Agency',
  description: 'Learn how MWD designs and builds high-performing websites, e-commerce stores, and digital menus for businesses that want to grow online.',
};

export default function AboutPage() {
  return (
    <main className="container py-20">
      <header className="max-w-3xl mb-12">
        <p className="text-red-600 font-semibold uppercase tracking-[0.2em] text-xs">About MWD</p>
        <h1 className="text-4xl md:text-5xl font-bold mt-4">We build digital experiences that earn trust.</h1>
      </header>

      <section className="grid md:grid-cols-2 gap-10 mb-16">
        <div className="border p-8">
          <h2 className="text-2xl font-semibold mb-4">Our story</h2>
          <p className="text-gray-700">MWD is a digital agency focused on clean design, smart strategy, and performance-minded execution. We help businesses move from fragmented online presence to a confident, conversion-ready digital presence.</p>
        </div>
        <div className="bg-gray-100 p-8">
          <p className="text-gray-700">We believe the strongest digital work is practical, well-crafted, and easy to use. That means clear messaging, fast sites, thoughtful UX, and technology that supports business goals instead of distracting from them.</p>
        </div>
      </section>

      <section className="mb-20">
        <h2 className="text-3xl font-semibold mb-8">What drives us</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <article className="border p-6">
            <h3 className="text-xl font-semibold mb-2">Clarity</h3>
            <p className="text-gray-700">We define the right strategy before design or development begins.</p>
          </article>
          <article className="border p-6">
            <h3 className="text-xl font-semibold mb-2">Performance</h3>
            <p className="text-gray-700">Speed, accessibility, and responsive implementation are part of the brief.</p>
          </article>
          <article className="border p-6">
            <h3 className="text-xl font-semibold mb-2">Trust</h3>
            <p className="text-gray-700">We design for credibility and conversion so people feel confident acting.</p>
          </article>
        </div>
      </section>

      <section className="mb-20">
        <h2 className="text-3xl font-semibold mb-8">How we work</h2>
        <div className="space-y-6">
          <div className="border p-6">
            <h3 className="text-xl font-semibold mb-2">1. Discover</h3>
            <p className="text-gray-700">We learn about your business, audience, current challenges, and what success looks like.</p>
          </div>
          <div className="border p-6">
            <h3 className="text-xl font-semibold mb-2">2. Design</h3>
            <p className="text-gray-700">We shape the experience around your brand voice, positioning, and conversion goals.</p>
          </div>
          <div className="border p-6">
            <h3 className="text-xl font-semibold mb-2">3. Build</h3>
            <p className="text-gray-700">We turn the design into a stable, maintainable front-end and product experience.</p>
          </div>
        </div>
      </section>

      <section className="text-center">
        <h2 className="text-3xl font-semibold mb-4">Let’s build something that feels unmistakably yours.</h2>
        <Link href="/request-quote" className="btn-primary">Start your project</Link>
      </section>
    </main>
  );
}

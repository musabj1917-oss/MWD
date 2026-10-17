import Link from 'next/link';

export const metadata = {
  title: 'MWD — Web Design & Digital Solutions',
  description: 'MWD is a creative digital agency delivering high-end websites, e-commerce, and digital menus with editorial design and measurable results.',
};

export default function Home() {
  return (
    <div>
      <header className="bg-white py-20">
        <div className="container grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7">
            <p className="text-sm text-red-600 font-semibold mb-4">Creative agency — Addis Ababa</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              We design distinct digital experiences that sharpen your brand and convert customers.
            </h1>
            <p className="lede mt-6">A small studio focused on elegant websites, scalable e-commerce, and pragmatic digital menus. We combine art-directed design with technical rigor to deliver measurable outcomes.</p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/request-quote" className="btn-primary">Request a quote</Link>
              <Link href="/portfolio" className="btn-ghost">View portfolio</Link>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="hero-media bg-gray-100 h-72 md:h-96 flex items-center justify-center" aria-hidden>
              {/* Replace with high-quality project image in /public/images when available */}
              <div className="text-gray-400">Project imagery</div>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section className="py-20 bg-white">
          <div className="container">
            <h2 className="text-3xl font-semibold mb-6">Core services</h2>
            <p className="text-gray-600 mb-8">We focus on a small set of services we do exceptionally well.</p>

            <div className="grid md:grid-cols-3 gap-6">
              <article className="border p-6">
                <h3 className="text-2xl font-bold mb-3">Website Development</h3>
                <p className="text-gray-700 mb-4">Custom business websites and landing pages crafted for clarity and performance. Accessible, SEO-friendly, and easy to maintain.</p>
                <Link href="/services/website-development" className="text-red-600 font-medium">Learn more →</Link>
              </article>

              <article className="border p-6">
                <h3 className="text-2xl font-bold mb-3">E-commerce</h3>
                <p className="text-gray-700 mb-4">Scalable storefronts with secure checkout and integrations for payments, inventory, and shipping.</p>
                <Link href="/services/ecommerce" className="text-red-600 font-medium">Learn more →</Link>
              </article>

              <article className="border p-6">
                <h3 className="text-2xl font-bold mb-3">Digital Menus</h3>
                <p className="text-gray-700 mb-4">Mobile-first QR menus that are easy to update and polished to match your brand.</p>
                <Link href="/services/digital-menus" className="text-red-600 font-medium">Learn more →</Link>
              </article>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="container">
            <h2 className="text-3xl font-semibold mb-6">Selected projects</h2>
            <p className="text-gray-600 mb-8">A curated selection of recent work. Click any project to view details.</p>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="border p-4">
                <div className="h-40 bg-gray-100 mb-4" aria-hidden>
                  <div className="text-gray-400 p-6">Project image</div>
                </div>
                <h4 className="font-semibold">Project name</h4>
                <p className="text-sm text-gray-600">Brief description preserved from source data when available.</p>
                <div className="mt-4">
                  <Link href="/portfolio" className="text-red-600">View case study</Link>
                </div>
              </div>

              <div className="border p-4">
                <div className="h-40 bg-gray-100 mb-4" aria-hidden>
                  <div className="text-gray-400 p-6">Project image</div>
                </div>
                <h4 className="font-semibold">Project name</h4>
                <p className="text-sm text-gray-600">Brief description preserved from source data when available.</p>
                <div className="mt-4">
                  <Link href="/portfolio" className="text-red-600">View case study</Link>
                </div>
              </div>

              <div className="border p-4">
                <div className="h-40 bg-gray-100 mb-4" aria-hidden>
                  <div className="text-gray-400 p-6">Project image</div>
                </div>
                <h4 className="font-semibold">Project name</h4>
                <p className="text-sm text-gray-600">Brief description preserved from source data when available.</p>
                <div className="mt-4">
                  <Link href="/portfolio" className="text-red-600">View case study</Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gray-50">
          <div className="container text-center">
            <h2 className="text-2xl font-semibold mb-4">Ready to start?</h2>
            <p className="text-gray-600 mb-6">Tell us about your project and we’ll respond with a clear plan and timetable.</p>
            <Link href="/request-quote" className="btn-primary">Request a quote</Link>
          </div>
        </section>
      </main>
    </div>
  );
}

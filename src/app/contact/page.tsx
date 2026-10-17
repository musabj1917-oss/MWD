
"use client";

export default function ContactPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h1 className="text-4xl font-bold mb-6 text-gray-900">Contact Us</h1>
          <p className="text-lg text-gray-600 mb-8">
            Have a question or want to discuss a potential project? We'd love to hear from you. Use the form on this page or reach out using the details below.
          </p>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Email</h3>
              <p className="text-gray-600">hello@mwdsite.placeholder</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Phone</h3>
              <p className="text-gray-600">+1 (555) 123-4567</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Office Hours</h3>
              <p className="text-gray-600">Monday - Friday, 9am - 5pm</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-8 rounded-lg border">
            <h2 className="text-2xl font-bold mb-6">Send a Message</h2>
            <form className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input type="text" className="w-full border p-2 rounded" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" className="w-full border p-2 rounded" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <textarea rows={4} className="w-full border p-2 rounded" required></textarea>
                </div>
                <button type="button" onClick={() => alert("Please use the 'Request a Quote' form for project inquiries. This is a static demo form.")} className="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700 w-full">Send Message</button>
            </form>
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Privacy Policy — MWD',
  description: 'Privacy Policy for MWD — Web Design & Digital Solutions.',
};

export default function PrivacyPolicyPage() {
  return (
    <main className="container py-20 max-w-3xl">
      <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
      <p className="text-gray-700 mb-6">We respect your privacy and only collect information needed to respond to enquiries, provide our services, and improve the experience on our site.</p>

      <section className="space-y-6 text-gray-700">
        <div>
          <h2 className="text-xl font-semibold mb-2">Information we collect</h2>
          <p>We may collect your name, email address, project details, and any information you choose to share through our contact or quote forms.</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">How we use it</h2>
          <p>We use this information to understand your project, respond to enquiries, and manage communications related to service requests.</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Sharing information</h2>
          <p>We do not sell personal information. We only share it when necessary to deliver our service or comply with applicable legal obligations.</p>
        </div>
      </section>
    </main>
  );
}

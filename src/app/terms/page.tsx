export const metadata = {
  title: 'Terms of Service — MWD',
  description: 'Terms of service for MWD — Web Design & Digital Solutions.',
};

export default function TermsPage() {
  return (
    <div className="container py-20 max-w-3xl">
      <h1 className="text-4xl font-bold mb-6">Terms of Service</h1>
      <div className="space-y-6 text-gray-700">
        <p>By engaging with MWD, you agree to work within the scope, timeline, and responsibilities defined in the project proposal and written agreement.</p>
        <p>All content, design direction, and development work produced for a client remain subject to the terms agreed during project scoping. We aim to provide clear communication and reliable delivery throughout the project lifecycle.</p>
        <p>Client content, brand assets, and project requirements should be shared in a timely manner to avoid delays. Final approvals are required before launch activities proceed.</p>
        <p>We reserve the right to refuse any project that does not align with our business standards or legal requirements.</p>
      </div>
    </div>
  );
}

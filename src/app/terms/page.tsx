export const metadata = {
  title: 'Terms of Service | MWD Site',
  description: 'Terms of Service for MWD Site.',
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 prose text-gray-900">
      <h1 className="text-4xl font-bold mb-8 text-gray-900">Terms of Service</h1>
      <p><em>Last updated: {new Date().toLocaleDateString()}</em></p>
      
      <h2>1. Terms</h2>
      <p>
        [Placeholder: By accessing the website at MWD Site, you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.]
      </p>

      <h2>2. Use License</h2>
      <p>
        [Placeholder: Permission is granted to temporarily download one copy of the materials (information or software) on MWD Site's website for personal, non-commercial transitory viewing only.]
      </p>

      <h2>3. Disclaimer</h2>
      <p>
        [Placeholder: The materials on MWD Site's website are provided on an 'as is' basis. MWD Site makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.]
      </p>

      <p className="mt-8 text-sm text-gray-700">
        Note: This is a placeholder terms of service document and must be reviewed by legal counsel before use in production.
      </p>
    </div>
  );
}

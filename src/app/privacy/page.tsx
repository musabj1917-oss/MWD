export const metadata = {
  title: 'Privacy Policy | MWD Site',
  description: 'Privacy Policy for MWD Site.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 prose">
      <h1 className="text-4xl font-bold mb-8 text-gray-900">Privacy Policy</h1>
      <p><em>Last updated: {new Date().toLocaleDateString()}</em></p>
      
      <h2>1. Introduction</h2>
      <p>
        [Placeholder: Welcome to MWD Site. We respect your privacy and are committed to protecting your personal data. 
        This privacy policy will inform you as to how we look after your personal data when you visit our website.]
      </p>

      <h2>2. The data we collect about you</h2>
      <p>
        [Placeholder: We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:
        Identity Data, Contact Data, Technical Data, Usage Data.]
      </p>

      <h2>3. How we use your personal data</h2>
      <p>
        [Placeholder: We will only use your personal data when the law allows us to. Most commonly, we will use your personal data to perform the contract we are about to enter into or have entered into with you.]
      </p>

      <p className="mt-8 text-sm text-gray-500">
        Note: This is a placeholder policy and must be reviewed by legal counsel before use in production.
      </p>
    </div>
  );
}

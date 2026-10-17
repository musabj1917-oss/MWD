'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const field = 'w-full border border-gray-300 bg-white p-3 text-sm focus:border-red-600';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await signIn('credentials', { redirect: false, email, password });

    if (res?.error) {
      setError('Invalid email or password');
      setLoading(false);
    } else {
      router.push('/admin');
      router.refresh();
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F4F4F2] px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-black px-8 py-6 text-center">
          <span className="text-3xl font-bold text-white" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            MWD<span className="text-red-600">.</span>
          </span>
          <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-gray-400">Admin</p>
        </div>
        <div className="h-1 bg-red-600" />

        <div className="border border-t-0 border-gray-300 bg-white p-8">
          <h1 className="mb-6 text-2xl font-bold">Sign in</h1>

          <form className="space-y-4" onSubmit={handleCredentialsLogin}>
            {error && <div className="border border-red-300 bg-red-50 p-3 text-sm text-red-800">{error}</div>}
            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium">Email</label>
              <input id="email" type="email" required className={field} value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <label htmlFor="password" className="mb-1 block text-sm font-medium">Password</label>
              <input id="password" type="password" required className={field} value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-red-600 px-4 py-3 text-sm font-semibold hover:bg-black disabled:opacity-70" style={{ color: '#fff' }}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

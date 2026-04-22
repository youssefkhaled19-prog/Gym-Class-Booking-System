'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        return;
      }

      Cookies.set('token', data.token, { expires: 7 });
      Cookies.set('user', JSON.stringify(data.user), { expires: 7 });

      if (data.user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/classes');
      }
    } catch (err) {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">GymBook</h1>
          <p className="text-gray-400 mt-2">Welcome back! Login to your account.</p>
        </div>
        <div className="bg-gray-900 border border-purple-900/30 p-8 rounded-2xl shadow-xl shadow-purple-900/10">
          <h2 className="text-2xl font-bold mb-6">Login</h2>
          {error && <p className="bg-red-500/20 border border-red-500/50 text-red-400 p-3 rounded-lg mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Email</label>
              <input
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 focus:border-purple-500 text-white p-3 rounded-lg outline-none transition"
                required
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 focus:border-purple-500 text-white p-3 rounded-lg outline-none transition"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-900 text-white p-3 rounded-lg font-semibold transition mt-2"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <p className="text-center mt-6 text-gray-400">
            Don't have an account? <Link href="/register" className="text-purple-400 hover:text-purple-300">Register</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
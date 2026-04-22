'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', currentPassword: '', newPassword: '', confirmPassword: '' });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userCookie = Cookies.get('user');
    if (!userCookie) {
      router.push('/login');
      return;
    }
    const userData = JSON.parse(userCookie);
    setUser(userData);
    setFormData({ ...formData, name: userData.name });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setMessage('New passwords do not match');
      setMessageType('error');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          name: formData.name,
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error);
        setMessageType('error');
      } else {
        setMessage('Profile updated successfully!');
        setMessageType('success');
        const updatedUser = { ...user, name: formData.name };
        Cookies.set('user', JSON.stringify(updatedUser), { expires: 7 });
        setUser(updatedUser);
        setFormData({ ...formData, currentPassword: '', newPassword: '', confirmPassword: '' });
      }

      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Something went wrong');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <nav className="border-b border-purple-900/30 px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">GymBook</h1>
        <div className="flex gap-3">
          <button onClick={() => router.push('/classes')} className="border border-purple-600/50 hover:border-purple-500 text-white px-4 py-2 rounded-lg text-sm transition">Browse Classes</button>
          <button onClick={() => router.push('/bookings')} className="border border-purple-600/50 hover:border-purple-500 text-white px-4 py-2 rounded-lg text-sm transition">My Bookings</button>
          <button onClick={() => { Cookies.remove('token'); Cookies.remove('user'); router.push('/'); }} className="bg-red-600/20 hover:bg-red-600/30 border border-red-600/50 text-red-400 px-4 py-2 rounded-lg text-sm transition">Logout</button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-10 max-w-lg">
        <h2 className="text-3xl font-bold mb-2">My Profile</h2>
        <p className="text-gray-400 mb-8">Update your personal information</p>

        <div className="bg-gray-900 border border-purple-900/30 p-8 rounded-2xl mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-2xl font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-xl font-bold">{user?.name}</p>
              <p className="text-gray-400 text-sm">{user?.email}</p>
              <span className="text-xs bg-purple-600/20 text-purple-400 border border-purple-600/30 px-2 py-1 rounded-full">{user?.role}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 border border-purple-900/30 p-8 rounded-2xl">
          <h3 className="text-xl font-bold mb-6">Edit Profile</h3>
          {message && (
            <div className={`p-4 rounded-lg mb-4 border ${messageType === 'success' ? 'bg-green-500/20 border-green-500/50 text-green-400' : 'bg-red-500/20 border-red-500/50 text-red-400'}`}>
              {message}
            </div>
          )}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Full Name</label>
              <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-gray-800 border border-gray-700 focus:border-purple-500 text-white p-3 rounded-lg outline-none transition" required />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Current Password</label>
              <input type="password" placeholder="Enter current password" value={formData.currentPassword} onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })} className="w-full bg-gray-800 border border-gray-700 focus:border-purple-500 text-white p-3 rounded-lg outline-none transition" />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">New Password</label>
              <input type="password" placeholder="Leave blank to keep current" value={formData.newPassword} onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })} className="w-full bg-gray-800 border border-gray-700 focus:border-purple-500 text-white p-3 rounded-lg outline-none transition" />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Confirm New Password</label>
              <input type="password" placeholder="Confirm new password" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} className="w-full bg-gray-800 border border-gray-700 focus:border-purple-500 text-white p-3 rounded-lg outline-none transition" />
            </div>
            <button type="submit" disabled={loading} className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-900 text-white p-3 rounded-xl font-semibold transition mt-2">
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
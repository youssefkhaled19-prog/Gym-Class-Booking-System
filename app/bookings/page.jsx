'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function BookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const userCookie = Cookies.get('user');
    if (!userCookie) {
      router.push('/login');
      return;
    }
    const userData = JSON.parse(userCookie);
    fetchBookings(userData.id);
  }, []);

  const fetchBookings = async (userId) => {
    try {
      const res = await fetch(`/api/bookings?userId=${userId}`);
      const data = await res.json();
      setBookings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, { method: 'DELETE' });
      if (res.ok) {
        setMessage('Booking cancelled successfully');
        const userCookie = Cookies.get('user');
        const userData = JSON.parse(userCookie);
        fetchBookings(userData.id);
      }
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Something went wrong');
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      <div className="text-purple-400 text-xl">Loading...</div>
    </div>
  );

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <nav className="border-b border-purple-900/30 px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">GymBook</h1>
        <div className="flex gap-3">
          <button onClick={() => router.push('/classes')} className="border border-purple-600/50 hover:border-purple-500 text-white px-4 py-2 rounded-lg text-sm transition">Browse Classes</button>
          <button onClick={() => { Cookies.remove('token'); Cookies.remove('user'); router.push('/'); }} className="bg-red-600/20 hover:bg-red-600/30 border border-red-600/50 text-red-400 px-4 py-2 rounded-lg text-sm transition">Logout</button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-10">
        <h2 className="text-3xl font-bold mb-2">My Bookings</h2>
        <p className="text-gray-400 mb-8">Manage your upcoming classes</p>

        {message && <div className="bg-green-500/20 border border-green-500/50 text-green-400 p-4 rounded-lg mb-6">{message}</div>}

        {bookings.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg mb-4">You have no bookings yet.</p>
            <button onClick={() => router.push('/classes')} className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl transition">Browse Classes</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-gray-900 border border-purple-900/30 p-6 rounded-2xl">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold">{booking.name}</h3>
                  <span className="bg-green-500/20 text-green-400 border border-green-500/30 text-xs px-2 py-1 rounded-full">Confirmed</span>
                </div>
                <p className="text-gray-400 text-sm mb-4">{booking.description}</p>
                <div className="space-y-1 mb-6">
                  <p className="text-sm text-gray-400">👤 {booking.instructor}</p>
                  <p className="text-sm text-gray-400">📅 {new Date(booking.date).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-400">🕐 {booking.time}</p>
                </div>
                <button
                  onClick={() => handleCancel(booking.id)}
                  className="w-full bg-red-600/20 hover:bg-red-600/30 border border-red-600/50 text-red-400 p-3 rounded-xl font-semibold transition"
                >
                  Cancel Booking
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
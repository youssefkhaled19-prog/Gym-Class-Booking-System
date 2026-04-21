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
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: 'DELETE',
      });

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

  if (loading) return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Loading...</div>;

  return (
    <main className="min-h-screen bg-gray-900 text-white">
      <nav className="bg-gray-800 p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">GymBook</h1>
        <div className="flex gap-4">
          <button onClick={() => router.push('/classes')} className="bg-gray-700 px-4 py-2 rounded-lg">Browse Classes</button>
          <button onClick={() => { Cookies.remove('token'); Cookies.remove('user'); router.push('/'); }} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg">Logout</button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-10">
        <h2 className="text-3xl font-bold mb-8">My Bookings</h2>
        {message && <p className="bg-blue-600 text-white p-3 rounded-lg mb-6">{message}</p>}
        {bookings.length === 0 ? (
          <p className="text-gray-400">You have no bookings yet. <span onClick={() => router.push('/classes')} className="text-blue-400 cursor-pointer hover:underline">Browse classes</span></p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking) => (
              <div key={booking._id} className="bg-gray-800 p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-2">{booking.gymClass?.name}</h3>
                <p className="text-gray-400 mb-2">{booking.gymClass?.description}</p>
                <p className="text-sm text-gray-400">Instructor: {booking.gymClass?.instructor}</p>
                <p className="text-sm text-gray-400">Date: {new Date(booking.gymClass?.date).toLocaleDateString()}</p>
                <p className="text-sm text-gray-400 mb-4">Time: {booking.gymClass?.time}</p>
                <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm mb-4 inline-block">Confirmed</span>
                <button
                  onClick={() => handleCancel(booking._id)}
                  className="w-full bg-red-600 hover:bg-red-700 text-white p-3 rounded-lg font-semibold mt-4"
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
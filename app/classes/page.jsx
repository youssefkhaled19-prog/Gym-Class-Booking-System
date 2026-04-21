'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function ClassesPage() {
  const router = useRouter();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const userCookie = Cookies.get('user');
    if (!userCookie) {
      router.push('/login');
      return;
    }
    setUser(JSON.parse(userCookie));
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const res = await fetch('/api/classes');
      const data = await res.json();
      setClasses(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async (classId) => {
    const userCookie = Cookies.get('user');
    const userData = JSON.parse(userCookie);

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userData.id, classId }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error);
      } else {
        setMessage('Class booked successfully!');
        fetchClasses();
      }

      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Something went wrong');
    }
  };

  const handleLogout = () => {
    Cookies.remove('token');
    Cookies.remove('user');
    router.push('/');
  };

  if (loading) return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Loading...</div>;

  return (
    <main className="min-h-screen bg-gray-900 text-white">
      <nav className="bg-gray-800 p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">GymBook</h1>
        <div className="flex gap-4 items-center">
          <span className="text-gray-400">Hi, {user?.name}</span>
          <button onClick={() => router.push('/bookings')} className="bg-gray-700 px-4 py-2 rounded-lg">My Bookings</button>
          <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg">Logout</button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-10">
        <h2 className="text-3xl font-bold mb-8">Available Classes</h2>
        {message && <p className="bg-blue-600 text-white p-3 rounded-lg mb-6">{message}</p>}
        {classes.length === 0 ? (
          <p className="text-gray-400">No classes available yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((gymClass) => (
              <div key={gymClass._id} className="bg-gray-800 p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-2">{gymClass.name}</h3>
                <p className="text-gray-400 mb-4">{gymClass.description}</p>
                <p className="text-sm text-gray-400">Instructor: {gymClass.instructor}</p>
                <p className="text-sm text-gray-400">Date: {new Date(gymClass.date).toLocaleDateString()}</p>
                <p className="text-sm text-gray-400">Time: {gymClass.time}</p>
                <p className="text-sm text-gray-400 mb-4">Spots: {gymClass.capacity - gymClass.enrolled} / {gymClass.capacity}</p>
                <button
                  onClick={() => handleBook(gymClass._id)}
                  disabled={gymClass.enrolled >= gymClass.capacity}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white p-3 rounded-lg font-semibold"
                >
                  {gymClass.enrolled >= gymClass.capacity ? 'Full' : 'Book Now'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
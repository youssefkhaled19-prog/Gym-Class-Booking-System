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
  const [messageType, setMessageType] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

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
        setMessageType('error');
      } else {
        setMessage('Class booked successfully!');
        setMessageType('success');
        fetchClasses();
      }

      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Something went wrong');
      setMessageType('error');
    }
  };

  const handleLogout = () => {
    Cookies.remove('token');
    Cookies.remove('user');
    router.push('/');
  };

  const filteredClasses = classes.filter((gymClass) => {
    const matchesSearch = gymClass.name.toLowerCase().includes(search.toLowerCase()) ||
      gymClass.instructor.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' ||
      (filter === 'available' && gymClass.enrolled < gymClass.capacity) ||
      (filter === 'full' && gymClass.enrolled >= gymClass.capacity);
    return matchesSearch && matchesFilter;
  });

  if (loading) return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      <div className="text-purple-400 text-xl">Loading...</div>
    </div>
  );

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <nav className="border-b border-purple-900/30 px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">GymBook</h1>
        <div className="flex gap-3 items-center">
          <span className="text-gray-400 text-sm">Hi, {user?.name}</span>
          <button onClick={() => router.push('/bookings')} className="border border-purple-600/50 hover:border-purple-500 text-white px-4 py-2 rounded-lg text-sm transition">My Bookings</button>
          <button onClick={handleLogout} className="bg-red-600/20 hover:bg-red-600/30 border border-red-600/50 text-red-400 px-4 py-2 rounded-lg text-sm transition">Logout</button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-10">
        <h2 className="text-3xl font-bold mb-2">Available Classes</h2>
        <p className="text-gray-400 mb-8">Book your spot before it's full</p>

        {message && (
          <div className={`p-4 rounded-lg mb-6 border ${messageType === 'success' ? 'bg-green-500/20 border-green-500/50 text-green-400' : 'bg-red-500/20 border-red-500/50 text-red-400'}`}>
            {message}
          </div>
        )}

        <div className="flex gap-4 mb-8">
          <input
            type="text"
            placeholder="Search by class name or instructor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-gray-900 border border-purple-900/30 focus:border-purple-500 text-white p-3 rounded-xl outline-none transition flex-1"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-gray-900 border border-purple-900/30 focus:border-purple-500 text-white p-3 rounded-xl outline-none transition"
          >
            <option value="all">All Classes</option>
            <option value="available">Available Only</option>
            <option value="full">Full Classes</option>
          </select>
        </div>

        {filteredClasses.length === 0 ? (
          <div className="text-center py-20 text-gray-500">No classes found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClasses.map((gymClass) => (
              <div key={gymClass.id} className="bg-gray-900 border border-purple-900/30 p-6 rounded-2xl hover:border-purple-600/50 transition">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold">{gymClass.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${gymClass.enrolled >= gymClass.capacity ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-green-500/20 text-green-400 border border-green-500/30'}`}>
                    {gymClass.enrolled >= gymClass.capacity ? 'Full' : 'Available'}
                  </span>
                </div>
                <p className="text-gray-400 text-sm mb-4">{gymClass.description}</p>
                <div className="space-y-1 mb-4">
                  <p className="text-sm text-gray-400">👤 {gymClass.instructor}</p>
                  <p className="text-sm text-gray-400">📅 {new Date(gymClass.date).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-400">🕐 {gymClass.time}</p>
                  <p className="text-sm text-gray-400">🪑 {gymClass.capacity - gymClass.enrolled} spots left</p>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-1.5 mb-4">
                  <div className="bg-purple-600 h-1.5 rounded-full" style={{width: `${(gymClass.enrolled / gymClass.capacity) * 100}%`}}></div>
                </div>
                <button
                  onClick={() => handleBook(gymClass.id)}
                  disabled={gymClass.enrolled >= gymClass.capacity}
                  className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:text-gray-500 text-white p-3 rounded-xl font-semibold transition"
                >
                  {gymClass.enrolled >= gymClass.capacity ? 'Class Full' : 'Book Now'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
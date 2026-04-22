'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function AdminPage() {
  const router = useRouter();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [formData, setFormData] = useState({
    name: '', description: '', instructor: '', date: '', time: '', capacity: '',
  });

  useEffect(() => {
    const userCookie = Cookies.get('user');
    if (!userCookie) {
      router.push('/login');
      return;
    }
    const userData = JSON.parse(userCookie);
    if (userData.role !== 'admin') {
      router.push('/classes');
      return;
    }
    fetchClasses();
    fetchStats();
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
  const fetchStats = async () => {
  try {
    const res = await fetch('/api/stats');
    const data = await res.json();
    setStats(data);
  } catch (err) {
    console.error(err);
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, capacity: Number(formData.capacity) }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error);
        setMessageType('error');
      } else {
        setMessage('Class created successfully!');
        setMessageType('success');
        setFormData({ name: '', description: '', instructor: '', date: '', time: '', capacity: '' });
        fetchClasses();
      }

      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Something went wrong');
      setMessageType('error');
    }
  };

  const handleDelete = async (classId) => {
    try {
      const res = await fetch(`/api/classes/${classId}`, { method: 'DELETE' });
      if (res.ok) {
        setMessage('Class deleted successfully');
        setMessageType('success');
        fetchClasses();
      }
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Something went wrong');
      setMessageType('error');
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
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">GymBook</h1>
          <p className="text-xs text-purple-400">Admin Dashboard</p>
        </div>
        <button onClick={() => { Cookies.remove('token'); Cookies.remove('user'); router.push('/'); }} className="bg-red-600/20 hover:bg-red-600/30 border border-red-600/50 text-red-400 px-4 py-2 rounded-lg text-sm transition">Logout</button>
      </nav>

      <div className="container mx-auto px-4 py-10">
        {stats && (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
    <div className="bg-gray-900 border border-purple-900/30 p-6 rounded-2xl text-center">
      <p className="text-3xl font-bold text-purple-400">{stats.totalUsers}</p>
      <p className="text-gray-400 text-sm mt-1">Total Users</p>
    </div>
    <div className="bg-gray-900 border border-purple-900/30 p-6 rounded-2xl text-center">
      <p className="text-3xl font-bold text-purple-400">{stats.totalClasses}</p>
      <p className="text-gray-400 text-sm mt-1">Total Classes</p>
    </div>
    <div className="bg-gray-900 border border-purple-900/30 p-6 rounded-2xl text-center">
      <p className="text-3xl font-bold text-purple-400">{stats.totalBookings}</p>
      <p className="text-gray-400 text-sm mt-1">Total Bookings</p>
    </div>
    <div className="bg-gray-900 border border-purple-900/30 p-6 rounded-2xl text-center">
      <p className="text-lg font-bold text-purple-400">{stats.popularClass?.name || 'N/A'}</p>
      <p className="text-gray-400 text-sm mt-1">Most Popular Class</p>
    </div>
  </div>
)}
        {message && (
          <div className={`p-4 rounded-lg mb-6 border ${messageType === 'success' ? 'bg-green-500/20 border-green-500/50 text-green-400' : 'bg-red-500/20 border-red-500/50 text-red-400'}`}>
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div>
            <h2 className="text-2xl font-bold mb-6">Add New Class</h2>
            <form onSubmit={handleSubmit} className="bg-gray-900 border border-purple-900/30 p-6 rounded-2xl flex flex-col gap-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Class Name</label>
                <input type="text" placeholder="e.g. Morning Yoga" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-gray-800 border border-gray-700 focus:border-purple-500 text-white p-3 rounded-lg outline-none transition" required />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Description</label>
                <textarea placeholder="Describe the class..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full bg-gray-800 border border-gray-700 focus:border-purple-500 text-white p-3 rounded-lg outline-none transition" required />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Instructor</label>
                <input type="text" placeholder="Instructor name" value={formData.instructor} onChange={(e) => setFormData({ ...formData, instructor: e.target.value })} className="w-full bg-gray-800 border border-gray-700 focus:border-purple-500 text-white p-3 rounded-lg outline-none transition" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Date</label>
                  <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="w-full bg-gray-800 border border-gray-700 focus:border-purple-500 text-white p-3 rounded-lg outline-none transition" required />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Time</label>
                  <input type="time" value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} className="w-full bg-gray-800 border border-gray-700 focus:border-purple-500 text-white p-3 rounded-lg outline-none transition" required />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Capacity</label>
                <input type="number" placeholder="Max number of students" value={formData.capacity} onChange={(e) => setFormData({ ...formData, capacity: e.target.value })} className="w-full bg-gray-800 border border-gray-700 focus:border-purple-500 text-white p-3 rounded-lg outline-none transition" required />
              </div>
              <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-xl font-semibold transition mt-2">Add Class</button>
            </form>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-6">Manage Classes ({classes.length})</h2>
            {classes.length === 0 ? (
              <div className="text-center py-20 text-gray-500">No classes yet.</div>
            ) : (
              <div className="flex flex-col gap-4">
                {classes.map((gymClass) => (
                  <div key={gymClass.id} className="bg-gray-900 border border-purple-900/30 p-5 rounded-2xl flex justify-between items-center hover:border-purple-600/50 transition">
                    <div>
                      <h3 className="text-lg font-bold">{gymClass.name}</h3>
                      <p className="text-gray-400 text-sm">👤 {gymClass.instructor}</p>
                      <p className="text-gray-400 text-sm">📅 {new Date(gymClass.date).toLocaleDateString()} at {gymClass.time}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="w-24 bg-gray-800 rounded-full h-1.5">
                          <div className="bg-purple-600 h-1.5 rounded-full" style={{width: `${(gymClass.enrolled / gymClass.capacity) * 100}%`}}></div>
                        </div>
                        <span className="text-xs text-gray-400">{gymClass.enrolled}/{gymClass.capacity}</span>
                      </div>
                    </div>
                    <button onClick={() => handleDelete(gymClass.id)} className="bg-red-600/20 hover:bg-red-600/30 border border-red-600/50 text-red-400 px-4 py-2 rounded-lg text-sm transition">Delete</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
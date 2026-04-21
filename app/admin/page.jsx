'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function AdminPage() {
  const router = useRouter();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
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
      } else {
        setMessage('Class created successfully!');
        setFormData({ name: '', description: '', instructor: '', date: '', time: '', capacity: '' });
        fetchClasses();
      }

      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Something went wrong');
    }
  };

  const handleDelete = async (classId) => {
    try {
      const res = await fetch(`/api/classes/${classId}`, { method: 'DELETE' });
      if (res.ok) {
        setMessage('Class deleted successfully');
        fetchClasses();
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
        <h1 className="text-2xl font-bold">GymBook Admin</h1>
        <button onClick={() => { Cookies.remove('token'); Cookies.remove('user'); router.push('/'); }} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg">Logout</button>
      </nav>

      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div>
            <h2 className="text-2xl font-bold mb-6">Add New Class</h2>
            {message && <p className="bg-blue-600 text-white p-3 rounded-lg mb-4">{message}</p>}
            <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-xl flex flex-col gap-4">
              <input type="text" placeholder="Class Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="bg-gray-700 text-white p-3 rounded-lg" required />
              <textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="bg-gray-700 text-white p-3 rounded-lg" required />
              <input type="text" placeholder="Instructor" value={formData.instructor} onChange={(e) => setFormData({ ...formData, instructor: e.target.value })} className="bg-gray-700 text-white p-3 rounded-lg" required />
              <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="bg-gray-700 text-white p-3 rounded-lg" required />
              <input type="time" value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} className="bg-gray-700 text-white p-3 rounded-lg" required />
              <input type="number" placeholder="Capacity" value={formData.capacity} onChange={(e) => setFormData({ ...formData, capacity: e.target.value })} className="bg-gray-700 text-white p-3 rounded-lg" required />
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-semibold">Add Class</button>
            </form>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-6">Manage Classes</h2>
            {classes.length === 0 ? (
              <p className="text-gray-400">No classes yet.</p>
            ) : (
              <div className="flex flex-col gap-4">
                {classes.map((gymClass) => (
                  <div key={gymClass._id} className="bg-gray-800 p-6 rounded-xl flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-bold">{gymClass.name}</h3>
                      <p className="text-gray-400 text-sm">{gymClass.instructor} — {new Date(gymClass.date).toLocaleDateString()} at {gymClass.time}</p>
                      <p className="text-gray-400 text-sm">Enrolled: {gymClass.enrolled} / {gymClass.capacity}</p>
                    </div>
                    <button onClick={() => handleDelete(gymClass._id)} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg">Delete</button>
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
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <nav className="border-b border-purple-900/30 px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">GymBook</h1>
        <div className="flex gap-3">
          <Link href="/login" className="text-gray-300 hover:text-white px-4 py-2 rounded-lg transition">Login</Link>
          <Link href="/register" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition">Get Started</Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-32 text-center">
        <div className="inline-block bg-purple-600/20 text-purple-400 text-sm px-4 py-2 rounded-full mb-6 border border-purple-600/30">
          🏋️ Your Premium Gym Experience
        </div>
        <h1 className="text-6xl font-bold mb-6 leading-tight">
          Book Your Classes
          <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Effortlessly</span>
        </h1>
        <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
          Discover and book premium gym classes. Track your fitness journey and never miss a session.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/register" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition shadow-lg shadow-purple-900/50">
            Start Booking
          </Link>
          <Link href="/login" className="border border-purple-600/50 hover:border-purple-500 text-white px-8 py-4 rounded-xl text-lg font-semibold transition">
            Login
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-gray-900 border border-purple-900/30 p-8 rounded-2xl">
          <div className="text-4xl mb-4">🧘</div>
          <h3 className="text-xl font-bold mb-2">Diverse Classes</h3>
          <p className="text-gray-400">From yoga to HIIT, find the perfect class for your fitness goals.</p>
        </div>
        <div className="bg-gray-900 border border-purple-900/30 p-8 rounded-2xl">
          <div className="text-4xl mb-4">⚡</div>
          <h3 className="text-xl font-bold mb-2">Easy Booking</h3>
          <p className="text-gray-400">Book your spot in seconds and manage your schedule with ease.</p>
        </div>
        <div className="bg-gray-900 border border-purple-900/30 p-8 rounded-2xl">
          <div className="text-4xl mb-4">🏆</div>
          <h3 className="text-xl font-bold mb-2">Expert Instructors</h3>
          <p className="text-gray-400">Train with certified professionals who are passionate about fitness.</p>
        </div>
      </div>
    </main>
  );
}
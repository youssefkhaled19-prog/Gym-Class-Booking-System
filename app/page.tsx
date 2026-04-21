import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold mb-6">Welcome to GymBook</h1>
        <p className="text-xl text-gray-400 mb-10">Book your gym classes easily and track your fitness journey</p>
        <div className="flex gap-4 justify-center">
          <Link href="/login" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold">
            Login
          </Link>
          <Link href="/register" className="bg-gray-700 hover:bg-gray-600 text-white px-8 py-3 rounded-lg text-lg font-semibold">
            Register
          </Link>
        </div>
      </div>
    </main>
  );
}
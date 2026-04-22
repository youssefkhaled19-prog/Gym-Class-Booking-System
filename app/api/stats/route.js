import { NextResponse } from 'next/server';
import sql, { initDB } from '@/lib/db';

export async function GET() {
  try {
    await initDB();

    const totalUsers = await sql`SELECT COUNT(*) as count FROM users`;
    const totalClasses = await sql`SELECT COUNT(*) as count FROM classes`;
    const totalBookings = await sql`SELECT COUNT(*) as count FROM bookings`;
    const popularClass = await sql`SELECT name, enrolled FROM classes ORDER BY enrolled DESC LIMIT 1`;

    return NextResponse.json({
      totalUsers: totalUsers[0].count,
      totalClasses: totalClasses[0].count,
      totalBookings: totalBookings[0].count,
      popularClass: popularClass[0] || null,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
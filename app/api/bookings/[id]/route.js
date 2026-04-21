import { NextResponse } from 'next/server';
import sql, { initDB } from '@/lib/db';

export async function DELETE(request, { params }) {
  try {
    await initDB();

    const booking = await sql`SELECT * FROM bookings WHERE id = ${params.id}`;
    if (booking.length === 0) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    await sql`UPDATE classes SET enrolled = enrolled - 1 WHERE id = ${booking[0].class_id}`;
    await sql`DELETE FROM bookings WHERE id = ${params.id}`;

    return NextResponse.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
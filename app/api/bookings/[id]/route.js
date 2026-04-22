import { NextResponse } from 'next/server';
import sql, { initDB } from '@/lib/db';

export async function DELETE(request, { params }) {
  try {
    await initDB();

    const { id } = await params;
    const bookingId = parseInt(id);

    const booking = await sql`SELECT * FROM bookings WHERE id = ${bookingId}`;
    if (booking.length === 0) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    await sql`UPDATE classes SET enrolled = enrolled - 1 WHERE id = ${booking[0].class_id}`;
    await sql`DELETE FROM bookings WHERE id = ${bookingId}`;

    return NextResponse.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    console.log('Cancel booking error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
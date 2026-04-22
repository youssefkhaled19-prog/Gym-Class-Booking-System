import { NextResponse } from 'next/server';
import sql, { initDB } from '@/lib/db';

export async function GET(request) {
  try {
    await initDB();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    let bookings;
    if (userId) {
      bookings = await sql`
        SELECT bookings.id as id, bookings.status, bookings.created_at, classes.name, classes.description, classes.instructor, classes.date, classes.time
        FROM bookings
        JOIN classes ON bookings.class_id = classes.id
        WHERE bookings.user_id = ${userId}
      `;
    } else {
      bookings = await sql`
        SELECT bookings.*, classes.name, classes.description, classes.instructor, classes.date, classes.time
        FROM bookings
        JOIN classes ON bookings.class_id = classes.id
      `;
    }

    return NextResponse.json(bookings);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { userId, classId } = await request.json();

    if (!userId || !classId) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    await initDB();

    const classResult = await sql`SELECT * FROM classes WHERE id = ${classId}`;
    if (classResult.length === 0) {
      return NextResponse.json({ error: 'Class not found' }, { status: 404 });
    }

    const gymClass = classResult[0];
    if (gymClass.enrolled >= gymClass.capacity) {
      return NextResponse.json({ error: 'Class is full' }, { status: 400 });
    }

    const existingBooking = await sql`
      SELECT * FROM bookings WHERE user_id = ${userId} AND class_id = ${classId}
    `;
    if (existingBooking.length > 0) {
      return NextResponse.json({ error: 'Already booked this class' }, { status: 400 });
    }

    const booking = await sql`
      INSERT INTO bookings (user_id, class_id)
      VALUES (${userId}, ${classId})
      RETURNING *
    `;

    await sql`UPDATE classes SET enrolled = enrolled + 1 WHERE id = ${classId}`;

    return NextResponse.json(booking[0], { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
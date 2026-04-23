import { NextResponse } from 'next/server';
import sql, { initDB } from '@/lib/db';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

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
        SELECT bookings.id as id, bookings.status, bookings.created_at, classes.name, classes.description, classes.instructor, classes.date, classes.time
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

    const userResult = await sql`SELECT * FROM users WHERE id = ${userId}`;
    const user = userResult[0];

    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: user.email,
      subject: `Booking Confirmed - ${gymClass.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0f0f1a; color: white; padding: 30px; border-radius: 12px;">
          <h1 style="color: #a855f7;">GymBook</h1>
          <h2>Booking Confirmed! 🎉</h2>
          <p>Hi ${user.name},</p>
          <p>Your booking has been confirmed. Here are the details:</p>
          <div style="background-color: #1a1a2e; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Class:</strong> ${gymClass.name}</p>
            <p><strong>Instructor:</strong> ${gymClass.instructor}</p>
            <p><strong>Date:</strong> ${new Date(gymClass.date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${gymClass.time}</p>
          </div>
          <p>See you there!</p>
          <p style="color: #a855f7;">The GymBook Team</p>
        </div>
      `,
    });

    return NextResponse.json(booking[0], { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Booking from '@/models/Booking';
import Class from '@/models/Class';

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    const query = userId ? { user: userId } : {};
    const bookings = await Booking.find(query)
      .populate('user', 'name email')
      .populate('gymClass');

    return NextResponse.json(bookings);
  } catch (error) {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { userId, classId } = await request.json();

    if (!userId || !classId) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    await connectDB();

    const gymClass = await Class.findById(classId);
    if (!gymClass) {
      return NextResponse.json({ error: 'Class not found' }, { status: 404 });
    }

    if (gymClass.enrolled >= gymClass.capacity) {
      return NextResponse.json({ error: 'Class is full' }, { status: 400 });
    }

    const existingBooking = await Booking.findOne({ user: userId, gymClass: classId });
    if (existingBooking) {
      return NextResponse.json({ error: 'Already booked this class' }, { status: 400 });
    }

    const booking = await Booking.create({ user: userId, gymClass: classId });
    await Class.findByIdAndUpdate(classId, { $inc: { enrolled: 1 } });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
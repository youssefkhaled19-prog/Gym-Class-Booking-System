import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Booking from '@/models/Booking';
import Class from '@/models/Class';

export async function DELETE(request, { params }) {
  try {
    await connectDB();

    const booking = await Booking.findById(params.id);
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    await Class.findByIdAndUpdate(booking.gymClass, { $inc: { enrolled: -1 } });
    await Booking.findByIdAndDelete(params.id);

    return NextResponse.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
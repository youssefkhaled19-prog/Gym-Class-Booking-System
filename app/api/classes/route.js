import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Class from '@/models/Class';

export async function GET() {
  try {
    await connectDB();
    const classes = await Class.find({}).sort({ date: 1 });
    return NextResponse.json(classes);
  } catch (error) {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { name, description, instructor, date, time, capacity } = await request.json();

    if (!name || !description || !instructor || !date || !time || !capacity) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    await connectDB();

    const gymClass = await Class.create({
      name,
      description,
      instructor,
      date,
      time,
      capacity,
    });

    return NextResponse.json(gymClass, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
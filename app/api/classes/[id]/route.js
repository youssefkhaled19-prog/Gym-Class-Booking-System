import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Class from '@/models/Class';

export async function GET(request, { params }) {
  try {
    await connectDB();
    const gymClass = await Class.findById(params.id);
    if (!gymClass) {
      return NextResponse.json({ error: 'Class not found' }, { status: 404 });
    }
    return NextResponse.json(gymClass);
  } catch (error) {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const body = await request.json();
    await connectDB();
    const gymClass = await Class.findByIdAndUpdate(params.id, body, { new: true });
    if (!gymClass) {
      return NextResponse.json({ error: 'Class not found' }, { status: 404 });
    }
    return NextResponse.json(gymClass);
  } catch (error) {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const gymClass = await Class.findByIdAndDelete(params.id);
    if (!gymClass) {
      return NextResponse.json({ error: 'Class not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Class deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
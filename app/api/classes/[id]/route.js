import { NextResponse } from 'next/server';
import sql, { initDB } from '@/lib/db';

export async function GET(request, { params }) {
  try {
    await initDB();
    const result = await sql`SELECT * FROM classes WHERE id = ${params.id}`;
    if (result.length === 0) {
      return NextResponse.json({ error: 'Class not found' }, { status: 404 });
    }
    return NextResponse.json(result[0]);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { name, description, instructor, date, time, capacity } = await request.json();
    await initDB();
    const result = await sql`
      UPDATE classes SET name=${name}, description=${description}, instructor=${instructor}, date=${date}, time=${time}, capacity=${capacity}
      WHERE id = ${params.id}
      RETURNING *
    `;
    if (result.length === 0) {
      return NextResponse.json({ error: 'Class not found' }, { status: 404 });
    }
    return NextResponse.json(result[0]);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await initDB();
    const result = await sql`DELETE FROM classes WHERE id = ${params.id} RETURNING *`;
    if (result.length === 0) {
      return NextResponse.json({ error: 'Class not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Class deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
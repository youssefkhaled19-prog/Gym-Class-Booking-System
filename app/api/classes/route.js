import { NextResponse } from 'next/server';
import sql, { initDB } from '@/lib/db';

export async function GET() {
  try {
    await initDB();
    const classes = await sql`SELECT * FROM classes ORDER BY date ASC`;
    return NextResponse.json(classes);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { name, description, instructor, date, time, capacity } = await request.json();

    if (!name || !description || !instructor || !date || !time || !capacity) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    await initDB();

    const result = await sql`
      INSERT INTO classes (name, description, instructor, date, time, capacity)
      VALUES (${name}, ${description}, ${instructor}, ${date}, ${time}, ${capacity})
      RETURNING *
    `;

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
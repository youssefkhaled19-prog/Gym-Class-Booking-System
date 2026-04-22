import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import sql, { initDB } from '@/lib/db';

export async function PUT(request) {
  try {
    const { userId, name, currentPassword, newPassword } = await request.json();

    await initDB();

    const result = await sql`SELECT * FROM users WHERE id = ${userId}`;
    if (result.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const user = result[0];

    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ error: 'Current password is required' }, { status: 400 });
      }

      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordValid) {
        return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await sql`UPDATE users SET name = ${name}, password = ${hashedPassword} WHERE id = ${userId}`;
    } else {
      await sql`UPDATE users SET name = ${name} WHERE id = ${userId}`;
    }

    return NextResponse.json({ message: 'Profile updated successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
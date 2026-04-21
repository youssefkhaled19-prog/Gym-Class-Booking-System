import { neon } from '@neondatabase/serverless';

const sql = neon('postgresql://neondb_owner:npg_8gzk5BKLeNdn@ep-restless-butterfly-anvduqzt.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require');

export async function initDB() {
  await sql`CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, name VARCHAR(255) NOT NULL, email VARCHAR(255) UNIQUE NOT NULL, password VARCHAR(255) NOT NULL, role VARCHAR(50) DEFAULT 'user', created_at TIMESTAMP DEFAULT NOW())`;
  await sql`CREATE TABLE IF NOT EXISTS classes (id SERIAL PRIMARY KEY, name VARCHAR(255) NOT NULL, description TEXT NOT NULL, instructor VARCHAR(255) NOT NULL, date DATE NOT NULL, time VARCHAR(50) NOT NULL, capacity INTEGER NOT NULL, enrolled INTEGER DEFAULT 0, created_at TIMESTAMP DEFAULT NOW())`;
  await sql`CREATE TABLE IF NOT EXISTS bookings (id SERIAL PRIMARY KEY, user_id INTEGER REFERENCES users(id), class_id INTEGER REFERENCES classes(id), status VARCHAR(50) DEFAULT 'confirmed', created_at TIMESTAMP DEFAULT NOW())`;
}

export default sql;
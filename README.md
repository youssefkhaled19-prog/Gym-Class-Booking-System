# 🏋️ Gym Class Booking System

A full-stack web application where users can browse and book gym classes, and admins can manage the schedule.

## 🔗 Links
- **Live App:** https://gym-class-booking-system.vercel.app
- **GitHub:** https://github.com/youssefkhaled19-prog/Gym-Class-Booking-System

## 👥 Team
| Name | Role |
|------|------|
| Youssef Khaled | Full-Stack Development |
| Abdelrahman Galal | Full-Stack Development |

## 🛠️ Tech Stack
| Layer | Technology |
|-------|------------|
| Frontend | React.js via Next.js |
| Backend | Next.js API Routes |
| Database | PostgreSQL (Neon) |
| Auth | JWT + bcrypt |
| Email | Resend |
| Deployment | Vercel |

## ✨ Features
### User
- Register and login securely
- Browse and search gym classes
- Filter classes by availability
- Book a class (capacity enforced)
- Receive email confirmation on booking
- View and cancel bookings
- Edit profile and change password

### Admin
- Add, edit, and delete gym classes
- View dashboard stats (total users, classes, bookings, most popular class)
- Monitor enrollment per class

## 🗄️ Database Schema
### users
| Field | Type |
|-------|------|
| id | SERIAL PRIMARY KEY |
| name | VARCHAR |
| email | VARCHAR (unique) |
| password | VARCHAR (hashed) |
| role | VARCHAR (user/admin) |
| created_at | TIMESTAMP |

### classes
| Field | Type |
|-------|------|
| id | SERIAL PRIMARY KEY |
| name | VARCHAR |
| description | TEXT |
| instructor | VARCHAR |
| date | DATE |
| time | VARCHAR |
| capacity | INTEGER |
| enrolled | INTEGER |
| created_at | TIMESTAMP |

### bookings
| Field | Type |
|-------|------|
| id | SERIAL PRIMARY KEY |
| user_id | INTEGER (FK → users) |
| class_id | INTEGER (FK → classes) |
| status | VARCHAR |
| created_at | TIMESTAMP |

## 📡 API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login and receive JWT |
| GET | /api/classes | Get all classes |
| POST | /api/classes | Add a class (admin) |
| PUT | /api/classes/:id | Update a class (admin) |
| DELETE | /api/classes/:id | Delete a class (admin) |
| GET | /api/bookings | Get bookings |
| POST | /api/bookings | Book a class (sends email) |
| DELETE | /api/bookings/:id | Cancel a booking |
| GET | /api/stats | Get admin dashboard stats |
| PUT | /api/profile | Update user profile |

## ⚙️ Local Setup
1. Clone the repo
2. Run `npm install`
3. Create `.env.local` and add your `DATABASE_URL`, `JWT_SECRET`, and `RESEND_API_KEY`
4. Run `npm run dev`
5. Open `http://localhost:3000`

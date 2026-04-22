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
| Deployment | Vercel |

## ✨ Features
### User
- Register and login securely
- Browse all available gym classes
- Book a class (capacity enforced)
- View and cancel bookings

### Admin
- Add new gym classes
- Delete existing classes
- View enrollment per class

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
| POST | /api/bookings | Book a class |
| DELETE | /api/bookings/:id | Cancel a booking |

## ⚙️ Local Setup
1. Clone the repo
2. Run `npm install`
3. Create `.env.local` and add your `DATABASE_URL` and `JWT_SECRET`
4. Run `npm run dev`
5. Open `http://localhost:3000`

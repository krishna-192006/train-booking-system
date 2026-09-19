# 🚆 RailExpress - Full-Stack Train Booking System

A production-ready, full-stack **Train Booking System** web application built with **Java 22 Spring Boot** and **React 19**, featuring automatic backend seat allocation, double-booking transaction protection, role-based JWT security, and dynamic Indian Railway-inspired aesthetics.

---

## 🌟 Key Features

### 👤 Passenger Features
- **Authentication**: JWT-based Secure Sign Up, Login, and Protected Route Access.
- **Train Search**: Real-time search across cities (e.g. Delhi, Lucknow, Mumbai, Jaipur, Kolkata, Bengaluru) with departure/arrival timings and live class seat counts (`SL`, `3A`, `2A`, `1A`).
- **Automatic Seat Allocation**:
  - **No Clickable Seat Grid** — seats, coaches, and berth types are assigned automatically by the backend.
  - **Dynamic Berth Calculation**: Calculates exact berth types based on class patterns (`Lower`, `Middle`, `Upper`, `Side Lower`, `Side Upper`).
  - **Coach Prefix Mapping**: Auto-assigns coach prefixes (e.g., `S1-S10` for Sleeper, `B1-B10` for 3A, `A1-A5` for 2A, `H1-H2` for 1A).
- **Instant 10-Digit PNR Ticket**: Real-time generation of unique PNR and printable ticket confirmation.
- **My Bookings & Cancellation**: History tracking with status badges (`CONFIRMED` / `CANCELLED`) and instant cancellation.

### 🛡️ Admin Features
- **Train Management**: Add new trains, update routes, change timings, and configure coach fares & seat capacities.
- **System Statistics**: Real-time counter metrics for Total Trains, Registered Users, and Active Bookings.

### 🔒 Concurrency & Security
- **Double-Booking Prevention**: Database `@Transactional` pessimistic write locking prevents two concurrent users from receiving the same seat for the same journey date.
- **Password Protection**: BCrypt salted password hashing.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 19, Vite, React Router v7, Axios, Bootstrap 5, Bootstrap Icons |
| **Backend** | Java 22, Spring Boot 3.3.3, Spring Security, Spring Web, Spring Data JPA |
| **Database** | MySQL 8.0 / H2 Database |
| **Authentication**| JSON Web Tokens (JJWT 0.11.5) & BCrypt Password Encoder |

---

## 🗄️ Database Schema

### `users`
- `id` (PK, BIGINT)
- `name` (VARCHAR)
- `email` (UNIQUE, VARCHAR)
- `password_hash` (VARCHAR)
- `role` (ENUM: `USER`, `ADMIN`)
- `created_at` (DATETIME)

### `trains`
- `id` (PK, BIGINT)
- `train_number` (UNIQUE, VARCHAR)
- `name` (VARCHAR)
- `source` (VARCHAR)
- `destination` (VARCHAR)
- `departure_time` (VARCHAR)
- `arrival_time` (VARCHAR)
- `duration` (VARCHAR)

### `train_classes`
- `id` (PK, BIGINT)
- `train_id` (FK -> trains.id)
- `class_code` (VARCHAR: `SL`, `3A`, `2A`, `1A`)
- `price` (DOUBLE)
- `total_seats` (INT)

### `bookings`
- `id` (PK, BIGINT)
- `pnr` (UNIQUE, VARCHAR)
- `user_id` (FK -> users.id)
- `train_id` (FK -> trains.id)
- `class_code` (VARCHAR)
- `journey_date` (DATE)
- `coach` (VARCHAR)
- `seat_number` (INT)
- `berth_type` (VARCHAR)
- `fare` (DOUBLE)
- `status` (ENUM: `CONFIRMED`, `CANCELLED`)
- `created_at` (DATETIME)

---

## 🔌 REST API Endpoints

### Auth APIs
- `POST /api/auth/signup` - Register a new user account
- `POST /api/auth/login` - Authenticate user & receive JWT token

### Train APIs
- `GET /api/trains/search?source={src}&destination={dest}&date={date}` - Search trains with live availability
- `GET /api/trains/{id}` - Get train details by ID

### Booking APIs
- `POST /api/bookings` - Create booking with backend auto seat allocation
- `GET /api/bookings/my` - Get current user's booking history
- `GET /api/bookings/{pnr}` - Get ticket details by PNR
- `DELETE /api/bookings/{id}` - Cancel ticket


### Admin APIs (Requires `ADMIN` role)
- `GET /api/admin/trains` - List all trains with full configurations
- `POST /api/admin/trains` - Add new train with coach classes
- `PUT /api/admin/trains/{id}` - Update train details
- `DELETE /api/admin/trains/{id}` - Delete train
- `GET /api/admin/stats` - System counters

---

## 🔑 Demo Account Credentials

Default seed accounts pre-populated on backend startup:

| Account Type | Email | Password | Role |
| :--- | :--- | :--- | :--- |
| **Admin Demo** | `admin@trains.com` | `admin123` | `ADMIN` |
| **User Demo** | `user@trains.com` | `user123` | `USER` |

---

## 🚀 Getting Started

### 1. Prerequisites
- Java JDK 17 or Java 22
- Node.js (v18+) & npm
- MySQL Server 8.0 running on localhost:3006 (or automatic H2 fallback)

### 2. Running Backend (Spring Boot)
```bash
cd backend
./mvnw spring-boot:run
```
The Spring Boot backend will run at: `http://localhost:8080`

### 3. Running Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
The Vite React app will run at: `http://localhost:5173`

---

## 📄 License
This project is licensed under the MIT License - feel free to use it for portfolio demonstrations.

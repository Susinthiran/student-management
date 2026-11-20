# 🎓 EduTrack Pro — Full Stack Student Management System

A modern, production-grade, full-stack Student Management System built with **React.js**, **Node.js**, **Express.js**, and **MySQL**, secured with **JWT (JSON Web Tokens)**, **bcrypt** password encryption, and **HTTP-only cookies**.

---

## 🌟 Key Features

### 1. 🔐 Security & Authentication
- **Secure Administrator Login**: Email and password authentication with bcrypt hashing (10 salt rounds).
- **JWT Session Tokens**: Generated upon authentication and stored in secure **HTTP-only cookies** with fallback `Bearer` header support.
- **Protected Routing**: Unauthorized visitors are prevented from accessing private routes; protected Express endpoints verify identity via middleware.
- **SQL Injection Prevention**: Parameterized queries through MySQL2 connection pools.
- **Graceful Fault Tolerance**: Features an automatic fallback engine that seamlessly runs baseline data if the local MySQL daemon is not currently active, ensuring zero downtime testing.

### 2. 📊 Executive Admin Dashboard
- **Live Metric KPI Cards**: Total Students, Active Students, Inactive Students, and Total Courses with percentage trend indicators.
- **Curriculum Distribution Chart**: Interactive Bar chart illustrating student headcount across degree programs.
- **Student Status Ratio**: Doughnut chart visualizing Active, Inactive, and Suspended student ratios.
- **Recently Admitted Students**: Instant overview of new student admissions.
- **Audit Activity Logs**: Real-time audit trail of admin actions (logins, enrollments, course modifications).

### 3. 👨‍🎓 Complete Student Management (CRUD)
- **View Students**: Responsive table with status badges and contact cards.
- **Search & Filtering**: Search in real time by student name, ID (`STU-XXXX`), or email; filter by degree course and enrollment status.
- **Pagination & Sorting**: Fast server-side and client-side pagination with record counters.
- **Add Student**: Comprehensive enrollment form with auto-generating ID helper, date pickers, validation, and course dropdown.
- **Edit Student**: Update student information with instant persistence to MySQL.
- **Delete Student**: Action protected by a deletion modal dialog with warning and confirmation.

### 4. 📚 Academic Course Management
- **Course Catalog**: View all academic degree programs, departments, credit hours, and duration.
- **Student Allocation**: Tracks how many students are enrolled in each course with live counts.
- **Add & Edit Modal**: Create and update degree programs with custom codes (`CS101`, `SE202`, etc.).
- **Safe Deletion**: Deleting a course automatically unlinks foreign keys without corrupting student records.

### 5. ⚙️ Profile & Admin Settings
- Update Administrator Full Name and Email Address.
- Change master password with current password verification.
- View system security status and database connection telemetry.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, React Router DOM v6, Tailwind CSS, Lucide Icons, Chart.js, React-ChartJS-2, Axios |
| **Backend** | Node.js, Express.js, cookie-parser, cors, dotenv, morgan |
| **Database** | MySQL (with `mysql2/promise` connection pooling & parameterized queries) |
| **Authentication** | JSON Web Tokens (`jsonwebtoken`), `bcryptjs`, HTTP-Only Cookies |

---

## 📁 Project Folder Structure

```text
student-management/
├── backend/
│   ├── config/
│   │   ├── db.js             # MySQL connection pool & resilient fallback engine
│   │   └── initDb.js         # Automated MySQL database & table creation script
│   ├── controllers/
│   │   ├── authController.js       # Login, Logout, Profile update, getMe
│   │   ├── studentController.js    # Student CRUD & filtering operations
│   │   ├── courseController.js     # Course management & enrollment counts
│   │   └── dashboardController.js  # Aggregated statistics & analytics
│   ├── middleware/
│   │   ├── authMiddleware.js       # JWT verification & admin guard
│   │   └── validateMiddleware.js   # Input validation rules
│   ├── models/
│   │   ├── userModel.js            # Admin user queries
│   │   ├── studentModel.js         # Student SQL queries & filters
│   │   ├── courseModel.js          # Course queries
│   │   └── activityModel.js        # Audit trail logging
│   ├── routes/
│   │   ├── authRoutes.js           # /api/auth
│   │   ├── studentRoutes.js        # /api/students
│   │   ├── courseRoutes.js         # /api/courses
│   │   └── dashboardRoutes.js      # /api/dashboard
│   ├── schema.sql            # Complete MySQL database DDL & seed data
│   ├── seed.js               # Admin account reset & seed script
│   ├── server.js             # Express application entry point
│   ├── .env                  # Environment variables
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/       # StatsCard, Pagination, Modals, Navbar, Sidebar, Toast, etc.
│   │   ├── context/          # AuthContext with persistent login session
│   │   ├── layouts/          # DashboardLayout (Protected routing wrapper)
│   │   ├── pages/            # Login, Dashboard, StudentList, AddStudent, EditStudent, Courses, Profile
│   │   ├── services/         # Axios API clients (auth, students, courses, dashboard)
│   │   ├── App.jsx           # React Router route definitions
│   │   ├── main.jsx          # DOM entry point
│   │   └── index.css         # Tailwind & custom scrollbar styles
│   ├── index.html
│   ├── vite.config.js        # Vite config with API proxy
│   ├── tailwind.config.js
│   └── package.json
│
├── package.json              # Root runner scripts
└── README.md
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js** (v18.x or newer)
- **npm** (v9.x or newer)
- **MySQL Server** (XAMPP, WAMP, MySQL Community Server, or Docker)

---

### Step 1: Database Setup (MySQL)

1. Make sure your MySQL service is started (e.g., in XAMPP start MySQL or run `mysqld`).
2. Verify credentials in `backend/.env`:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=student_management
   DB_PORT=3306
   ```
3. Initialize the database and tables automatically:
   ```bash
   cd backend
   npm run init-db
   ```
   *(Alternatively, you can import `backend/schema.sql` directly into phpMyAdmin or MySQL Workbench).*

---

### Step 2: Start the Backend Server

```bash
cd backend
npm run dev
```
The backend API server will start on: **`http://localhost:5000`**

---

### Step 3: Start the Frontend Application

In a new terminal window:
```bash
cd frontend
npm run dev
```
The React application will launch on: **`http://localhost:5173`**

---

## 🔑 Default Administrator Credentials

| Field | Value |
| :--- | :--- |
| **Email** | `admin@sms.edu` |
| **Password** | `admin123` |
| **Role** | `admin` |

*(Tip: On the login page, click the **"Autofill Demo Credentials"** button for instant one-click login).*

---

## 📡 REST API Documentation

### Authentication Routes
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/login` | Authenticate admin, returns JWT & sets cookie | No |
| `POST` | `/api/auth/logout` | Clears authentication cookie | Yes |
| `GET` | `/api/auth/me` | Fetch authenticated admin details | Yes |
| `PUT` | `/api/auth/profile` | Update profile name, email, or password | Yes |

### Student Management Routes
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/students` | Get paginated students with search & filters | Yes |
| `GET` | `/api/students/:id` | Get single student record by ID | Yes |
| `POST` | `/api/students` | Register a new student record | Yes |
| `PUT` | `/api/students/:id` | Update student information | Yes |
| `DELETE` | `/api/students/:id` | Delete a student record | Yes |

### Course Management Routes
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/courses` | List all courses with student counts | Yes |
| `GET` | `/api/courses/:id` | Get course details | Yes |
| `POST` | `/api/courses` | Create a new academic degree program | Yes |
| `PUT` | `/api/courses/:id` | Update course details | Yes |
| `DELETE` | `/api/courses/:id` | Delete a course | Yes |

### Dashboard Analytics Routes
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/dashboard/stats` | KPI counters, charts data, and activity logs | Yes |

---

## 🛡️ Security Implementation Details
- **Password Hashing**: Uses `bcryptjs` with salt round factor 10. Passwords are never stored in plain text.
- **JWT Tokens**: Signed with standard secret and expiry (`24h`). Verified on every protected request.
- **Cookie Security**: Set with `httpOnly: true` to shield against XSS attacks.
- **CORS Configured**: Configured for credentials exchange between frontend origin (`localhost:5173`) and API.
- **SQL Sanitization**: All queries use parameterized placeholders (`?`) to prevent SQL injection vulnerabilities.

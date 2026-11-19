# Student Registration Management System (MERN + Docker + Azure)

A modern full-stack web application built with React, Vite, Node.js, Express, and MongoDB Atlas. Features a public student registration portal and a protected administrator dashboard with search, filtering, statistics, and CSV export.

---

## Features
- **Public Portal**: Responsive student registration form with input validation (names, Bangladeshi phone support, date of birth, address).
- **Unique Reference ID**: Auto-generates unique IDs (`REG-YYYYMMDD-XXXX`) on registration.
- **Admin Dashboard**:
  - Secure JWT authentication with HTTP-only cookies.
  - Live statistics: Total, Pending, Approved, and Rejected registrations.
  - Search by student name, reference ID, or phone number.
  - Filter by status (`Pending`, `Approved`, `Rejected`).
  - One-click status change and delete actions.
  - Export all student records to CSV.
- **Security**: Helmet HTTP headers, express rate limiting, bcrypt password hashing, and CORS protection.
- **Production Ready**: Multi-stage Docker build with Caddy reverse proxy and automatic HTTPS.

---

## Tech Stack
- **Frontend**: React 18, Vite, React Router 6, CSS3
- **Backend**: Node.js 22 LTS, Express.js, Mongoose ODM
- **Database**: MongoDB Atlas (Cloud)
- **Deployment**: Docker, Docker Compose, Caddy 2, Microsoft Azure Linux VM

---

## Local Development (Without Docker)

### 1. Backend Setup
```bash
cd backend
npm install
# Configure backend/.env with your MONGO_URI, JWT_SECRET, etc.
node scripts/seedAdmin.js   # Seeds the initial admin account
npm start                  # Runs backend on http://localhost:5000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev                # Runs frontend on http://localhost:5173
```

---

## Production Deployment with Docker Compose
```bash
docker compose up -d --build
```
- Serves frontend on port 80 (and port 443 with domain).
- Internally connects to Express on port 5000.
- Persists SSL certificates via Docker volumes.

For full Azure Virtual Machine instructions, see [DEPLOY_AZURE.md](DEPLOY_AZURE.md).

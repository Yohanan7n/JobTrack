# 🚀 JobTrack — Full-Stack Job Application Management System

[![CI Pipeline](https://github.com/jobtrack/jobtrack/actions/workflows/ci.yml/badge.svg)](https://github.com/jobtrack/jobtrack/actions)
[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-22.x-339933?logo=node.js)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express-4.21-000000?logo=express)](https://expressjs.com/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-5.22-2D3748?logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql)](https://www.postgresql.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> A modern, reactive full-stack web application designed for software engineers and professionals to manage their job applications, track stages on a fluid Kanban board, log interview rounds, store documents & CVs, and unlock deep job search analytics.

---

## 🌟 Executive Preview & Live Demo

- **Live Demo Link**: [https://jobtrack-demo.vercel.app](https://jobtrack-demo.vercel.app) *(or run locally in 2 minutes)*
- **Demo Accounts (Pre-seeded with realistic data)**:
  - 👤 **Job Seeker**: `demo@jobtrack.dev` / `Password123!`
  - 🛡️ **Administrator**: `admin@jobtrack.dev` / `Password123!`

```
┌──────────────────────────────────────────────────────────────┐
│  JobTrack Pro                                     👤 Alex R. │
├──────────────┬───────────────────────────────────────────────┤
│ Applications │ Total Applications    42   (▲ 12% this month) │
│ Companies    │ In Interview Stage     8   (18.5% rate)       │
│ Interviews   │ Offers Received        2   (4.8% rate)        │
│ Documents    │ Rejected / Archived   12                      │
│ Analytics    │                                               │
│ Admin Panel  │ Application Statistics & Funnel               │
│ Settings     │     📊 Recharts Stage Breakdown & Velocity    │
└──────────────┴───────────────────────────────────────────────┘
```

---

## ✨ Features That Make It Stand Out

### 1. 🗂️ Interactive Kanban Board
- Seamless drag-and-drop between pipeline stages:
  $$\text{Applied} \longrightarrow \text{Screening} \longrightarrow \text{Interview} \longrightarrow \text{Offer} \longrightarrow \text{Rejected}$$
- Instant optimistic UI transitions backed by REST PATCH endpoints.
- Stage-specific quick add and action dropdown menus.

### 2. 📋 Comprehensive Application Management
- Track Company, Position, Workplace Type (Remote / Hybrid / On-site), Employment Type (Full-time / Contract), Salary ranges, and Job URLs.
- Priority scoring (1 to 5 stars) and recruiter contact details.
- Internal interview preparation notes, feedback, and CV tracking.
- Multi-field search, status filtering, location filtering, and fast table/list toggle.

### 3. 📈 Advanced Analytics & Data Visualization
- **Application Velocity**: Monthly application submission trends using Recharts Area charts.
- **Stage Funnel**: Bar charts visualizing conversion drops across pipeline stages.
- **Top Roles**: Donut charts analyzing target position types.
- **Key Metrics**: Dynamic calculation of Interview Conversion Rate, Offer Rate, and Employer Response Rate.

### 4. 📅 Interview Calendar & Tracker
- Log upcoming technical screens, live coding sessions, system design rounds, and behavioral chats.
- Direct 1-click meeting join links (Google Meet, Zoom, Teams).
- Round status updates (`SCHEDULED` $\rightarrow$ `COMPLETED` $\rightarrow$ `CANCELLED`) with interviewer feedback notes.

### 5. 📂 Document & CV Vault
- Attach customized resumes and cover letters with local disk storage via Multer.
- File type filtering, size indicators, and secure download links.
- Link specific documents directly to applications.

### 6. 🔐 Authentication & Role-Based Authorization
- Stateless JWT authentication with Bearer token header interceptors.
- Bcrypt password encryption with 10 salt rounds.
- Role-Based Access Control (`USER` and `ADMIN`).
- Automatic session invalidation on 401 and protected route navigation guards.

### 7. 🛡️ Administrator Panel
- System-wide user directory with application and interview counts.
- Real-time account moderation: Suspend or Reactivate accounts.
- Granular permission assignment: Promote or Demote administrators.
- Live system telemetry: Server uptime, Node.js environment, and global entity counts.

---

## 🛠️ Tech Stack & Architecture

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite 6, TypeScript, Tailwind CSS, React Router v7, TanStack Query, Recharts, Lucide Icons |
| **Backend** | Node.js 22, Express.js, TypeScript, Zod Schema Validation, Multer, Helmet, Morgan, CORS |
| **Database & ORM** | PostgreSQL 16 (production), SQLite (zero-config local dev), Prisma ORM 5.22 |
| **DevOps & CI/CD** | Docker, Docker Compose, GitHub Actions, Nginx |

---


## 🗄️ Database ER Diagram

```mermaid
erDiagram
    User ||--o{ Application : "owns"
    User ||--o{ Company : "tracks"
    User ||--o{ Interview : "schedules"
    User ||--o{ Document : "uploads"

    Company ||--o{ Application : "has"

    Application ||--o{ Interview : "includes"
    Application ||--o{ Document : "links"

    User {
        String id PK
        String name
        String email UK
        String password
        String role "USER | ADMIN"
        String status "ACTIVE | SUSPENDED"
        String avatar
        DateTime createdAt
        DateTime updatedAt
    }

    Company {
        String id PK
        String userId FK
        String name
        String website
        String location
        String industry
        String contactPerson
        String contactEmail
        String notes
        DateTime createdAt
        DateTime updatedAt
    }

    Application {
        String id PK
        String userId FK
        String companyId FK
        String companyName
        String position
        String location
        String locationType "REMOTE | HYBRID | ONSITE"
        String employmentType "FULL_TIME | PART_TIME | CONTRACT | INTERNSHIP"
        String salary
        String status "APPLIED | SCREENING | INTERVIEW | OFFER | REJECTED"
        DateTime applicationDate
        String jobDescription
        String jobUrl
        String contactPerson
        String contactEmail
        String cvUsed
        String notes
        Int rating "1 - 5 stars"
        DateTime createdAt
        DateTime updatedAt
    }

    Interview {
        String id PK
        String userId FK
        String applicationId FK
        String title
        String type "HR | TECHNICAL | BEHAVIORAL | SYSTEM_DESIGN | FINAL"
        DateTime scheduledAt
        String location "Video URL / Address"
        String interviewer
        String notes
        String status "SCHEDULED | COMPLETED | CANCELLED"
        String feedback
        DateTime createdAt
        DateTime updatedAt
    }

    Document {
        String id PK
        String userId FK
        String applicationId FK
        String title
        String fileName
        String fileType "RESUME | COVER_LETTER | PORTFOLIO | OTHER"
        String fileUrl
        Int fileSize
        DateTime createdAt
        DateTime updatedAt
    }
```

---

## 🚀 Quickstart Installation Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ or v22 LTS recommended)
- `npm` (v9+ or v10+)
- *(Optional)* [Docker & Docker Compose](https://www.docker.com/)

---

### Method A: Local Setup (Instant Out-of-the-Box)

The repository is configured to run instantly with zero database setup required (SQLite default, PostgreSQL ready).

1. **Clone the repository**:
   ```bash
   git clone https://github.com/jobtrack/jobtrack.git
   cd jobtrack
   ```

2. **Setup Backend**:
   ```bash
   cd backend
   npm install
   npx prisma generate
   npx prisma db push
   npm run seed
   npm run dev
   ```
   *The backend starts at `http://localhost:5000` with the database fully pre-populated.*

3. **Setup Frontend** *(in a second terminal)*:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   *The frontend starts at `http://localhost:5173`.*

4. **Open Browser**:
   Navigate to [http://localhost:5173](http://localhost:5173) and sign in using the 1-click demo button or credentials below.

---

### Method B: Docker Compose (Full-Stack Multi-Container)

To run the complete production stack (PostgreSQL 16 + Express API + Nginx Frontend):

```bash
docker compose up -d --build
```

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`
- PostgreSQL: `localhost:5432`

---

## 🔑 Test Credentials

| Account | Email | Password | Role | Description |
|---|---|---|---|---|
| **Demo Job Seeker** | `demo@jobtrack.dev` | `Password123!` | `USER` | 15+ pre-seeded applications, upcoming interviews, and documents across all stages |
| **Administrator** | `admin@jobtrack.dev` | `Password123!` | `ADMIN` | Full access to Admin Panel, user moderation, and server telemetry |

*(On the login screen, clicking either button will automatically populate these credentials for instant evaluation.)*

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)
```ini
PORT=5000
NODE_ENV=development
DATABASE_URL="file:./dev.db" # Or postgresql://user:pass@host:5432/db
JWT_SECRET=super_secret_jwt_key_jobtrack_2026_dev_secure
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
MAX_FILE_SIZE_MB=10
```

---

## 📡 API Overview

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new user | No |
| `POST` | `/api/auth/login` | Authenticate and obtain JWT token | No |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Yes |
| `PUT` | `/api/auth/profile` | Update profile and password | Yes |
| `GET` | `/api/applications` | List applications with search & filter | Yes |
| `POST` | `/api/applications` | Create application | Yes |
| `PATCH` | `/api/applications/:id/status` | Move application stage (Kanban) | Yes |
| `GET` | `/api/companies` | List companies & stats | Yes |
| `GET` | `/api/interviews` | List upcoming or past interviews | Yes |
| `POST` | `/api/interviews` | Schedule new interview round | Yes |
| `POST` | `/api/documents/upload` | Upload resume or cover letter | Yes |
| `GET` | `/api/analytics` | Retrieve metrics, trends & funnels | Yes |
| `GET` | `/api/admin/users` | Admin: List all users | Admin only |
| `PATCH` | `/api/admin/users/:id/status` | Admin: Suspend or activate user | Admin only |
| `GET` | `/api/admin/metrics` | Admin: Global server health | Admin only |

*For complete endpoint schemas and example payloads, view [docs/API.md](docs/API.md).*

---

## 🗺️ Roadmap & Future Improvements

- [ ] **Email Automation**: Automatic reminders for scheduled interviews 24 hours prior.
- [ ] **Cloudinary / S3 Integration**: Optional cloud object storage provider for document attachments.
- [ ] **AI Resume Matcher**: Score resume keywords against target job descriptions.
- [ ] **Browser Extension**: 1-click import from LinkedIn, Indeed, and Greenhouse.
- [ ] **Export to CSV / PDF**: Download application summaries and tax/unemployment logs.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

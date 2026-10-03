# 📡 JobTrack REST API Documentation

Base URL: `http://localhost:5000/api`

All protected endpoints require the HTTP Header:
```http
Authorization: Bearer <YOUR_JWT_TOKEN>
```

---

## 🔐 1. Authentication Endpoints

### Register User
- **POST** `/auth/register`
- **Body**:
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@domain.com",
    "password": "Password123!"
  }
  ```
- **Response** `(201 Created)`:
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "data": {
      "user": {
        "id": "cm1...",
        "name": "Jane Doe",
        "email": "jane@domain.com",
        "role": "USER",
        "status": "ACTIVE"
      },
      "token": "eyJhbGciOi..."
    }
  }
  ```

### Login
- **POST** `/auth/login`
- **Body**:
  ```json
  {
    "email": "demo@jobtrack.dev",
    "password": "Password123!"
  }
  ```
- **Response** `(200 OK)`:
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "user": { ... },
      "token": "eyJhbGciOi..."
    }
  }
  ```

### Get Current User Profile
- **GET** `/auth/me` *(Protected)*

### Update Profile & Password
- **PUT** `/auth/profile` *(Protected)*
- **Body**:
  ```json
  {
    "name": "Alex Rivera",
    "avatar": "https://example.com/avatar.jpg",
    "currentPassword": "Password123!",
    "newPassword": "NewPassword456!"
  }
  ```

---

## 💼 2. Job Applications Endpoints

### List Applications
- **GET** `/applications` *(Protected)*
- **Query Parameters**:
  - `status`: Filter by stage (`APPLIED`, `SCREENING`, `INTERVIEW`, `OFFER`, `REJECTED`)
  - `search`: Fuzzy search across company name, role position, location
  - `locationType`: `REMOTE`, `HYBRID`, or `ONSITE`
  - `page`: Page index (default: `1`)
  - `limit`: Records per page (default: `50`)
- **Response** `(200 OK)`:
  ```json
  {
    "success": true,
    "data": [ ... ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 42,
      "totalPages": 1
    }
  }
  ```

### Create Application
- **POST** `/applications` *(Protected)*
- **Body**:
  ```json
  {
    "companyName": "Stripe",
    "position": "Staff Software Engineer",
    "status": "APPLIED",
    "location": "San Francisco, CA / Remote",
    "locationType": "REMOTE",
    "employmentType": "FULL_TIME",
    "salary": "$160,000 - $185,000",
    "rating": 5,
    "jobUrl": "https://stripe.com/jobs",
    "notes": "Referred by engineering director"
  }
  ```

### Update Application Stage (Kanban Move)
- **PATCH** `/applications/:id/status` *(Protected)*
- **Body**:
  ```json
  {
    "status": "INTERVIEW"
  }
  ```

### Delete Application
- **DELETE** `/applications/:id` *(Protected)*

---

## 🏢 3. Companies Endpoints

- **GET** `/companies` — List companies with active application counts
- **POST** `/companies` — Add new company with contact details
- **GET** `/companies/:id` — Get company with full application history
- **PUT** `/companies/:id` — Update company profile
- **DELETE** `/companies/:id` — Delete company

---

## 📅 4. Interviews Endpoints

- **GET** `/interviews` — List interviews (query param `timeframe=upcoming|past`)
- **POST** `/interviews` — Schedule interview round
  ```json
  {
    "applicationId": "cm1...",
    "title": "System Design Round",
    "type": "TECHNICAL",
    "scheduledAt": "2026-10-15T14:00:00Z",
    "location": "https://meet.google.com/abc-xyz",
    "interviewer": "Kevin Zhang",
    "notes": "Prepare distributed cache and Kafka architecture"
  }
  ```
- **PUT** `/interviews/:id` — Update notes, status (`COMPLETED`, `CANCELLED`), or timing
- **DELETE** `/interviews/:id` — Remove scheduled round

---

## 📄 5. Documents & CV Endpoints

- **GET** `/documents` — List user documents (optional filter `?fileType=RESUME`)
- **POST** `/documents/upload` — Multipart form-data with `file`, `title`, `fileType`, `applicationId`
- **DELETE** `/documents/:id` — Delete document file and database entry

---

## 📊 6. Analytics Endpoints

- **GET** `/analytics` *(Protected)*
- Returns:
  - Total pipeline metrics & conversion rates (Interview Rate, Offer Rate, Response Rate)
  - Applications per month trend data
  - Stage distribution funnel counts
  - Top 6 applied job roles
  - Workplace distribution (Remote vs Hybrid vs On-site)

---

## 🛡️ 7. Admin Endpoints *(Role: ADMIN required)*

- **GET** `/admin/users` — List all registered users and activity counts
- **PATCH** `/admin/users/:id/status` — Suspend or activate account (`{ "status": "SUSPENDED" }`)
- **PATCH** `/admin/users/:id/role` — Assign or revoke admin role (`{ "role": "ADMIN" }`)
- **GET** `/admin/metrics` — Global system metrics (total users, applications, uptime, node version)

# 🗄️ Database Design & Entity Relationship Diagram

JobTrack uses **Prisma ORM** with **PostgreSQL** in production (and SQLite for instant zero-configuration local development).

---

## 📊 Entity Relationship Diagram (ERD)

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

## ⚡ Database Indexes

- `Application(userId, status)`: Accelerates Kanban column filtering and dashboard pipeline queries.
- `Interview(userId, scheduledAt)`: Optimizes calendar queries and upcoming interview lookups.
- `Company(userId, name)`: Ensures uniqueness of company names per user directory.
- `Document(userId)`: Fast user document retrieval.

# Scrizians Backend Architecture & Server API Specification

This directory provides the comprehensive backend reference, database model mapping, and API routing specs for the **Scrizians** platform.

---

## 🏗️ Backend System Architecture

In Next.js 14 App Router, backend code is structured as serverless Node.js REST API endpoints located in `src/app/api/` and powered by Mongoose ORM connecting to **MongoDB Atlas**.

```text
scrizians/
├── backend/
│   ├── README.md               # Backend overview & directory map (This File)
│   ├── API_ENDPOINTS.md        # Complete REST API route specifications
│   └── DATABASE_MODELS.md      # Mongoose MongoDB schema specifications
├── scripts/
│   ├── seed-atlas.js           # Database initialization seeder
│   ├── seed-10-items.js        # 10-item production sample dataset seeder
│   └── separate-databases.js   # Database migration and separation script
└── src/
    ├── app/api/                # Live REST API Endpoints (GET, POST, DELETE)
    │   ├── insights/route.ts   # Technical Articles & Hiring Guides API
    │   ├── jobs/route.ts       # Job Openings & Hiring Postings API
    │   ├── leads/route.ts      # Inbound Client Leads & CRM API
    │   └── talent/route.ts     # Developer Talent Roster API
    ├── lib/
    │   └── mongodb.ts          # MongoDB Atlas Singleton Connection Pool
    └── models/                 # Mongoose Database Schemas
        ├── Insight.ts          # Article & Technical Guide Schema
        ├── Job.ts              # Job Posting Schema
        ├── Lead.ts             # Inbound Lead & CRM Pipeline Schema
        ├── SeedMarker.ts       # Database Initialization Tracking Schema
        └── Talent.ts           # Developer Talent Profile Schema
```

---

## 📡 REST API Route Overview

| Endpoint | Supported Methods | Description | File Path |
| :--- | :--- | :--- | :--- |
| **`/api/leads`** | `GET`, `POST`, `DELETE` | Client Hiring Leads & CRM Pipeline | [`src/app/api/leads/route.ts`](../src/app/api/leads/route.ts) |
| **`/api/talent`** | `GET`, `POST`, `DELETE` | Developer Talent Roster Profiles | [`src/app/api/talent/route.ts`](../src/app/api/talent/route.ts) |
| **`/api/jobs`** | `GET`, `POST`, `DELETE` | Active Client Job Postings | [`src/app/api/jobs/route.ts`](../src/app/api/jobs/route.ts) |
| **`/api/insights`** | `GET`, `POST`, `DELETE` | Technical Articles & Guides | [`src/app/api/insights/route.ts`](../src/app/api/insights/route.ts) |

---

## 🗄️ Database Connection (`src/lib/mongodb.ts`)

The database layer utilizes a singleton Mongoose connection manager to avoid creating multiple open sockets during hot reloading and serverless function executions.

- **Target Database**: `scrizians` on MongoDB Atlas Cluster
- **Environment Variable**: `MONGODB_URI`
- **Connection Helper**: `connectToDatabase()`

---

## 📖 Related Backend Documentation
- For REST API Request & Response Schemas: Read **[API_ENDPOINTS.md](./API_ENDPOINTS.md)**
- For Database Mongoose Schemas: Read **[DATABASE_MODELS.md](./DATABASE_MODELS.md)**

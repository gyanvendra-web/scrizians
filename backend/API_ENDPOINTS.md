# Scrizians Backend API Endpoints Documentation

All API endpoints are implemented as Next.js 14 App Router Route Handlers in `src/app/api/`.

---

## 1. Leads API (`/api/leads`)
**Implementation**: [`src/app/api/leads/route.ts`](../src/app/api/leads/route.ts)

- **`GET /api/leads`**: Fetches all client hiring leads from MongoDB Atlas sorted by creation date.
- **`POST /api/leads`**: Creates a new inbound client lead or updates an existing lead.
  - Body payload:
    ```json
    {
      "name": "Michael Ross (VP Engineering)",
      "email": "m.ross@cloudscale.io",
      "phone": "+1 (555) 234-5678",
      "company": "CloudScale Inc (USA)",
      "serviceRequested": "Dedicated Developer / Staff Augmentation",
      "scrizianIdReferenced": "SCR-8841",
      "stage": "Requirement Confirmed",
      "message": "Looking for 2 Senior Next.js & Node.js architects."
    }
    ```
- **`DELETE /api/leads?id=<lead_id>`**: Permanently deletes a lead document from MongoDB Atlas by ID.

---

## 2. Talent Roster API (`/api/talent`)
**Implementation**: [`src/app/api/talent/route.ts`](../src/app/api/talent/route.ts)

- **`GET /api/talent`**: Fetches all developer talent profiles from MongoDB Atlas.
- **`POST /api/talent`**: Creates or updates a Scrizian developer profile.
  - Body payload:
    ```json
    {
      "id": "SCR-8841",
      "scrizianId": "SCR-8841",
      "displayName": "Aarav M.",
      "title": "Lead Full-Stack Architect",
      "category": "Full Stack Developers",
      "hourlyRateUSD": 42,
      "availability": "Available now",
      "status": "Verified"
    }
    ```
- **`DELETE /api/talent?id=<talent_id>`**: Permanently deletes a talent profile from MongoDB Atlas.

---

## 3. Jobs API (`/api/jobs`)
**Implementation**: [`src/app/api/jobs/route.ts`](../src/app/api/jobs/route.ts)

- **`GET /api/jobs`**: Fetches all active client job postings from MongoDB Atlas.
- **`POST /api/jobs`**: Creates or updates a job opening.
- **`DELETE /api/jobs?id=<job_id>`**: Permanently deletes a job posting from MongoDB Atlas.

---

## 4. Insights & Articles API (`/api/insights`)
**Implementation**: [`src/app/api/insights/route.ts`](../src/app/api/insights/route.ts)

- **`GET /api/insights`**: Fetches all published technical guides and hiring articles.
- **`POST /api/insights`**: Creates or updates an article.
- **`DELETE /api/insights?id=<article_id>`**: Permanently deletes an article from MongoDB Atlas.

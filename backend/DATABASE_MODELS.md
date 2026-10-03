# Scrizians Mongoose Database Schemas & Models

All database models reside in `src/models/` and interface directly with MongoDB Atlas (`scrizians` Database).

---

## Mongoose Models Overview

1. **`LeadModel`** (`src/models/Lead.ts`): Stores client contact submissions, target Scrizian IDs, and sales pipeline stages.
2. **`TalentModel`** (`src/models/Talent.ts`): Stores developer profiles, hourly rates, skills arrays, and verification badges.
3. **`JobModel`** (`src/models/Job.ts`): Stores client job postings, company logos, salary ranges, and applicant counts.
4. **`InsightModel`** (`src/models/Insight.ts`): Stores community articles, cover image banners, author attributions, and categories.
5. **`SeedMarkerModel`** (`src/models/SeedMarker.ts`): Tracks database initialization state to prevent deleted records from re-seeding on page refreshes.

# Backend Architecture & Guardrails

> [!IMPORTANT]
> **Philosophy**: "Boring is Safe." Do not innovate on plumbing. Innovate on the product.

## 1. Non-Negotiables (Zero Improvisation)
You must follow strict patterns for these components. "Vibing" here leads to data corruption or security breaches.
- **Authentication & Authorization**: Never write your own crypto or session logic.
- **Payment Webhooks**: Must verify signatures and handle idempotency (deduplication).
- **State Transitions**: A Job status change (e.g., `ASSIGNED` -> `COMPLETED`) must be a dedicated atomic transaction, not a generic "update" call.
- **Database Schema Changes**: Always use migrations. Never edit the DB manually in prod.

## 2. Auth & Persona System
**Goal**: Single Identity (Email/Phone), Multiple Personas (Customer, Provider).

### Database Schema
Do not mix profile data into the `users` (auth) table.
```sql
-- Identity (Managed by Clerk/Supabase)
-- Maps generic Auth ID to your system
TABLE users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE,
  created_at TIMESTAMP
);

-- Personas
TABLE profiles (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  type ENUM('customer', 'provider', 'admin'),
  -- Persona specific data is JSONB or separate tables if complex
  metadata JSONB, 
  UNIQUE(user_id, type) -- A user can only have ONE profile per type
);
```

### Flow
1. **Login**: User logs in via Auth Provider.
2. **Context**: Middleware checks `X-Persona-Type` header (sent by client app).
3. **Guard**: Middleware verifies `user_id` has a `profile` of that `type`.
4. **Result**: API handles request as "Provider-123" or "Customer-456".

## 3. Safe-by-Default API Structure
Use a **Controller-Service-Repository** (or similar layer) pattern to prevent logic leaks.
If using Next.js Server Actions or Route Handlers:

1.  **Input Layer (Zod)**: Strict validation. Strip unknown keys.
    ```typescript
    const schema = z.object({ jobId: z.string().uuid(), tip: z.number().min(0) });
    ```
2.  **Auth Guard**: Reject if no session or wrong persona.
3.  **Service Layer**: Business logic (e.g., "Can this job be tipped?").
4.  **Data Layer**: Database calls.

**Rule**: The API endpoint should look like a recipe list, not the cooking process.

## 4. Rate Limiting (Lightweight)
Don't overcomplicate. Use **Upstash (Redis)** + **@upstash/ratelimit**.
- **Global Limit**: 100 req/10s per IP (DDoS protection).
- **Sensitive Limit**: 5 req/1min per User for "Payment" or "SMS" endpoints.

## 5. Job Lifecycle (The State Machine)
Never allow a client to send `updateJob({ status: 'COMPLETED' })`.
Instead, use specific "Actions" (Verbs).

**Valid Transitions:**
1.  `createRequest()` -> **DRAFT**
2.  `submitRequest()` -> **OPEN** (Draft -> Open)
3.  `acceptJob(providerId)` -> **ASSIGNED** (Open -> Assigned)
4.  `startTravel()` -> **ON_WAY** (Assigned -> On Way)
5.  `startJob()` -> **IN_PROGRESS** (On Way -> In Progress)
6.  `completeJob()` -> **COMPLETED** (In Progress -> Completed)
7.  `cancelJob()` -> **CANCELLED** (From Open/Assigned only - strict rules on fees)

**Implementation**:
Write a state machine helper function.
```typescript
function transition(job, action) {
  if (job.status === 'OPEN' && action === 'ACCEPT') return 'ASSIGNED';
  throw new Error('Invalid Transition');
}
```

## 6. Common Vibe-Coder Mistakes
1.  **Trusting the Client**: "Client sent `price: $0` so I charged $0." -> **Fix**: Always recalculate price on backend.
2.  **God Endpoints**: `/api/update-job` that changes status, price, and driver all at once. -> **Fix**: Specific endpoints `/api/jobs/assign`.
3.  **Missing Idempotency**: User clicks "Pay" twice -> Charged twice. -> **Fix**: UI disable button + Backend check `idempotencyKey`.
4.  **N+1 Queries**: Fetching 50 jobs and then doing 50 separate queries for provider names. -> **Fix**: Join data or use batching.

## 7. Build vs Buy (Speed Stack)
| Component | Recommendation | Why? |
| :--- | :--- | :--- |
| **Auth** | **Clerk** | Best DX, handles multi-session, simple 2FA. |
| **Database** | **Supabase** (Postgres) | Scaling, GUI, Realtime built-in. |
| **Files** | **UploadThing** | No AWS S3 configuration hell. Type-safe. |
| **Cron/Queues** | **Inngest** or **Trigger.dev** | Serverless queues without setup. Essential for "Remind user in 1 hour". |
| **Email** | **Resend** | Developer friendly, reliable. |

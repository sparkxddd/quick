# Backend Security & Rate Limiting Design

> [!IMPORTANT]
> **Context**: B2B SaaS (Web + Mobile), Google OAuth, Razorpay.
> **Goal**: Prevent abuse, data scraping, and denial of service while ensuring legitimate mobile users are not blocked.

## 1. Threat Model & Endpoint Classification

We divide endpoints into 3 Risk Zones. "Mobile" assumes a native app using a dedicated API token flow (not just browser cookies).

### Zone A: Critical / High Risk (Auth & $$$)
**Target**: Account Takeover (ATO), Card Testing, SMS Pumping.
**Endpoints**:
1.  `POST /auth/google/callback` (Login/Signup exchange)
2.  `POST /auth/refresh` (Token rotation)
3.  `POST /payments/create-order` (Initiating a payment intent via Razorpay)
4.  `POST /payments/webhook` (Razorpay callback) - *Special handling required*

### Zone B: Resource Intensive / Scrapable
**Target**: Data Scraping (Competitors), DB Exhaustion.
**Endpoints**:
1.  `GET /jobs/search` (Listing available jobs)
2.  `GET /workers/profile/:id` (Worker details)
3.  `POST /jobs/book` (Creating a job draft)

### Zone C: Low Risk / Standard Traffic
**Target**: None specific (Standard usage).
**Endpoints**:
1.  `GET /user/me` (Profile fetch)
2.  `GET /history` (User job history)
3.  `PUT /user/settings`

## 2. Decision Table: Rate Limiting Rules

| Endpoint Class | Risk | Rate Limit Scope | Limit (Req/Window) | Burst | Logout/Block? |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Auth (Login/OTP)** | High | **Per IP** | 5 / 1 min | 0 | Yes (Block IP 15m) |
| **Token Refresh** | High | **Per Token+IP** | 10 / 1 min | 2 | No (Force Re-login) |
| **Payments (Create)** | High | **Per User** | 3 / 1 min | 0 | Yes (Alert Admins) |
| **Payments (Webhook)** | High | **Global Whitelist** | *Unlimited* | - | **MUST verify signature** |
| **Public Data (Jobs)** | Med | **Per IP/Token** | 60 / 1 min | 10 | No (429 Retry-After) |
| **Standard API** | Low | **Per User** | 300 / 1 min | 50 | No (429 Retry-After) |

## 3. Mobile-Specific Nuances

### Token Theft & Replay Attacks
Mobile apps maintain long-lived sessions (Access + Refresh Tokens).
-   **Risk**: If a Refresh Token is stolen, attacker has persistent access.
-   **Mitigation**: **Refresh Token Rotation**.
    -   Every time `/auth/refresh` is called, issue a *new* Refresh Token and invalidate the *old* one.
    -   **Replay Detection**: If an *old* Refresh Token is used again, invalidate *all* tokens for that user family (signaling theft).

### Emulator/Bot Traffic
Bots run on emulators to scrape data or register fake accounts.
-   **Mitigation**:
    -   **User-Agent Checks**: Block generic "okhttp / curl" user agents. (Warning: Easily spoofed, but filters low-effort bots).
    -   **App Check (Firebase)** / **Play Integrity API**: Use Google's managed service to verify the request comes from your genuine binary, not a script. **Result**: `X-Firebase-AppCheck` header on backend.

## 4. Implementation Guidance

### Infrastructure: Redis (Upstash)
Do not use in-memory (Node.js Map) rate limiting. It resets on deploy/serverless cold start and doesn't scale.

**Stack**:
-   **Store**: Upstash Redis (Serverless compatible).
-   **Library**: `@upstash/ratelimit` (Ideal for Next.js/Edge).

### Algorithm: Sliding Window
Use **Sliding Window** (not Fixed Window) to prevent "boundary hopping" attacks (e.g., 100 reqs at 11:59:59 and 100 reqs at 12:00:01).

### Code Pattern (Next.js Middleware)
Create a centralized `middleware.ts` that runs before your API logic.

```typescript
// middleware.ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(20, "10 s"), // Default: 20 reqs per 10s
  analytics: true,
});

export default async function middleware(req: NextRequest) {
  const ip = req.ip ?? "127.0.0.1";
  
  // 1. Identify "High Risk" paths
  if (req.nextUrl.pathname.startsWith("/api/auth")) {
     // Check specialized auth limiter (strict)
  }

  // 2. Standard Limiter
  const { success, limit, remaining, reset } = await ratelimit.limit(ip);

  if (!success) {
    return new NextResponse("Too Many Requests", { status: 429 });
  }
}
```

## 5. Security Checklist (Mistakes to Avoid)

1.  **Don't Rate Limit Webhooks by IP**: Razorpay sends webhooks from rotating IPs. Verify the `X-Razorpay-Signature` header instead.
2.  **Don't Expose IDs sequentially**: Use UUIDs. If I can guess `GET /jobs/101` after `100`, I can scrape your entire DB.
3.  **Don't Trust Client Time**: Mobile devices often have wrong clocks. Always use server time for timestamps.
4.  **Error Messages**: On 429 (Rate Limit), returned message should be generic. Don't say "Try again in 4.3 seconds" to bots (helps them optimize). Just say "Too Many Requests".
5.  **CORS**: Mobile apps don't respect CORS. CORS is a browser concept. Do not rely on it for API security.

## 6. Recommended Defaults
-   **Global Limit**: 20 requests / 10 seconds per IP.
-   **Auth Limit**: 5 requests / 60 seconds per IP.
-   **Block Duration**: 15 minutes if Auth Limit exceeded.

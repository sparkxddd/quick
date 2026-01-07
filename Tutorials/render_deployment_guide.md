# Deploying Quickfix Backend to Render

To solve the Android emulator "Failed to fetch" error, hosting your backend on Render is the most reliable solution. This guide will walk you through the process.

## 1. Prepare your Repository
Make sure all recent changes are committed and pushed to your GitHub/GitLab repository.

## 2. Create a New Web Service on Render
1.  Go to [Render Dashboard](https://dashboard.render.com/).
2.  Click **New +** and select **Web Service**.
3.  Connect your GitHub repository.
4.  Configure the service:
    *   **Name**: `quickfix-backend`
    *   **Runtime**: `Node`
    *   **Build Command**: `npm install`
    *   **Start Command**: `npm run backend:start`

## 3. Configure Environment Variables
In the **Environment** tab of your Render service, add the following variables:

| Variable | Value |
| :--- | :--- |
| `NODE_ENV` | `production` |
| `PORT` | `3001` |
| `JWT_ACCESS_SECRET` | *(Your choice, e.g., use a long random string)* |
| `JWT_REFRESH_SECRET` | *(Your choice, e.g., use a long random string)* |
| `REDIS_URL` | *(Use an Upstash Redis URL or Render's Redis URL)* |
| `GOOGLE_CLIENT_ID` | *(Your Google Client ID)* |
| `GOOGLE_CLIENT_SECRET` | *(Your Google Client Secret)* |
| `RAZORPAY_KEY_ID` | *(Your Razorpay Key)* |
| `RAZORPAY_KEY_SECRET` | *(Your Razorpay Secret)* |
| `SUPABASE_URL` | *(Your Supabase Project URL)* |
| `SUPABASE_SERVICE_KEY` | *(Your Supabase Service Role Key)* |

## 4. Update the App
Once Render gives you a URL (e.g., `https://quickfix-backend.onrender.com`), you need to update your app to use this URL.

### Update `app/book/page.tsx`
Replace `http://10.0.2.2:3001` with your new Render URL.

### Update `app/search/page.tsx`
Replace `http://10.0.2.2:3001` with your new Render URL.

> [!TIP]
> After updating the URLs, remember to run `npm run build` and `npx cap sync android` before testing on the emulator.

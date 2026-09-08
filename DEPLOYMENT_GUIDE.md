# 🚀 Free Deployment Guide for BhodBasha

This guide outlines the optimal **100% Free Tier** deployment architecture for **BhodBasha** across the Frontend, Backend, and Database/Auth layers.

---

## 🏛 Architecture Overview (Zero-Cost Stack)

```
                       ┌────────────────────────────────────────┐
                       │           Vercel (Free Tier)           │
                       │       Next.js 15 PWA Frontend          │
                       │    (Fast CDN, Auto SSL, Edge Cache)    │
                       └───────────────────┬────────────────────┘
                                           │
                    ┌──────────────────────┴──────────────────────┐
                    ▼                                             ▼
       ┌─────────────────────────┐                   ┌─────────────────────────┐
       │   Supabase (Free Tier)  │                   │   Render (Free Tier)    │
       │   • Supabase Auth (JWT) │                   │  FastAPI Python Backend │
       │   • PostgreSQL (500MB)  │                   │  • Ingestion Pipeline   │
       │   • 50,000 Free MAUs    │                   │  • AI Competency Engine │
       └─────────────────────────┘                   └─────────────────────────┘
```

---

## Step 1: Deploy Frontend on Vercel (Recommended #1)

**Why Vercel?**
* Next.js is created by Vercel; deployment requires zero configuration.
* Continuous deployment from GitHub with free SSL, global edge CDN, and PWA support.
* Unlimited preview branches for judge reviews.

### Instructions:
1. Push your repository to **GitHub**.
2. Go to [vercel.com](https://vercel.com) and log in with your GitHub account.
3. Click **"Add New Project"** and select the repository.
4. Set **Root Directory** to `frontend`.
5. Under **Environment Variables**, add:
   * `NEXT_PUBLIC_SUPABASE_URL` = *(Your Supabase project URL)*
   * `NEXT_PUBLIC_SUPABASE_ANON_KEY` = *(Your Supabase anon public key)*
   * `NEXT_PUBLIC_API_URL` = *(Your deployed Render backend URL, e.g. `https://bhodbasha-backend.onrender.com`)*
6. Click **Deploy**. Your site will be live within 90 seconds (e.g. `https://bhodbasha.vercel.app`).

---

## Step 2: Deploy Backend on Render (Free Web Service)

**Why Render?**
* Offers a native free tier Web Service with Docker support.
* Automatic HTTPS and Git integration (auto-deploys on `git push`).
* Fast setup via the provided `Dockerfile` and `render.yaml`.

### Instructions:
1. Go to [render.com](https://render.com) and log in.
2. Click **"New +"** → **"Web Service"**.
3. Connect your GitHub repository.
4. Choose **Docker** as the runtime.
5. In the settings:
   * **Dockerfile Path**: `./backend/Dockerfile`
   * **Instance Type**: `Free`
6. Add Environment Variables:
   * `MOCK_PROVIDERS` = `true` *(Enables deterministic offline AI mocks with zero paid API token costs)*
   * `SECRET_KEY` = *(Any random 32-character string)*
7. Click **Create Web Service**. Your backend will be accessible at `https://bhodbasha-backend.onrender.com`.

*(Alternative Free Providers for Backend: **Koyeb** or **Hugging Face Spaces**)*

---

## Step 3: Setup Supabase for Auth & Database

1. Go to [supabase.com](https://supabase.com) and create a free project.
2. In **Project Settings** → **API**, copy:
   * **Project URL**
   * **Project API Key (`anon` public)**
3. In **Authentication** → **Providers**, ensure **Email** is enabled.
4. Paste the URL and Anon Key into your Vercel frontend environment variables.

---

## ✅ Deployment Checklist

- [x] `frontend/vercel.json` configured for Next.js routing.
- [x] `backend/Dockerfile` created and optimized with Python 3.11.
- [x] `render.yaml` blueprint ready for 1-click cloud provisioning.
- [x] Supabase Auth client (`frontend/src/lib/supabase.ts`) wired with fallback for demo testing.
- [x] Offline IndexedDB PWA operational for low-connectivity evaluations.

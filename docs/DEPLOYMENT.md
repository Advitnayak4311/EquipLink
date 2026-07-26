# 🚀 EquipLink Deployment & Cloud Hosting Guide

This guide covers step-by-step instructions for hosting **EquipLink** live on the web for free using modern cloud providers.

---

## 🌟 Recommended Hosting Options

| Service | Hosting Target | Free Tier Available? | Setup Effort |
| :--- | :--- | :---: | :---: |
| **Render Blueprint** | Backend + Frontend + Postgres | ✅ Yes | ⚡ 1-Click (`render.yaml`) |
| **Vercel + Render + Neon** | Best Next.js performance | ✅ Yes | 🛠️ Step-by-Step |
| **Docker Compose** | Self-hosted VPS (DigitalOcean/AWS) | ❌ Paid VPS | 🐳 Containerized |

---

## ⚡ Option 1: 1-Click Hosting on Render (Render Blueprint)

Using the pre-configured [render.yaml](file:///d:/EquipLink/render.yaml), Render automatically provisions the PostgreSQL database, Spring Boot backend service, and Next.js frontend app together.

### Steps:
1. Push your code to your **GitHub** repository (`https://github.com/Advitnayak4311/EquipLink`).
2. Log in to [Render Dashboard](https://dashboard.render.com).
3. Click **New +** → **Blueprints**.
4. Connect your `EquipLink` GitHub repository.
5. Render will automatically detect `render.yaml` and prompt you to deploy:
   - **PostgreSQL Database** (`equiplink-postgres`)
   - **Backend Web Service** (`equiplink-backend`)
   - **Frontend Web Service** (`equiplink-frontend`)
6. Click **Apply**.
7. Once deployed, Render will provide live URLs:
   - **Frontend:** `https://equiplink-frontend.onrender.com`
   - **Backend API:** `https://equiplink-backend.onrender.com`

---

## 🛠️ Option 2: Vercel (Frontend) + Render / Railway (Backend) + Neon (Postgres)

For optimal Next.js performance with global CDN edge caching:

### 1. Database (Neon Serverless PostgreSQL)
1. Sign up at [Neon.tech](https://neon.tech) and create a database named `equiplink`.
2. Copy the PostgreSQL connection string (`postgres://...`).

### 2. Backend (Render / Railway)
1. Go to [Render](https://render.com) → **New Web Service**.
2. Connect `EquipLink` GitHub repo and set:
   - **Root Directory:** `backend`
   - **Environment:** `Docker` (or Java 21)
   - **Dockerfile Path:** `docker/Dockerfile.backend`
3. Set Environment Variables:
   - `SPRING_PROFILES_ACTIVE`: `prod`
   - `DATABASE_URL`: *(Your Neon PostgreSQL connection string)*
   - `JWT_SECRET`: *(Generate a secure random string)*
   - `CORS_ALLOWED_ORIGIN`: `https://your-app.vercel.app`
4. Click **Deploy**.

### 3. Frontend (Vercel)
1. Sign in to [Vercel](https://vercel.com) and click **Add New Project**.
2. Import `EquipLink` repository.
3. Set **Framework Preset:** Next.js, **Root Directory:** `frontend`.
4. Add Environment Variable:
   - `NEXT_PUBLIC_API_URL`: `https://your-backend.onrender.com/api`
5. Click **Deploy**.

---

## 🐳 Option 3: Docker Compose (VPS / Local Production Server)

To host on a VPS using Docker:

```bash
docker-compose up -d --build
```

Access your app at `http://<YOUR_VPS_IP>:3000`.

# Food Delivery App

Full-stack food delivery app (React + Express) with a single deployment URL — the backend serves both the API and the frontend.

## Local Development

```bash
npm install
npm run dev
```

Open http://localhost:8080

## Production Build

```bash
npm run build
npm start
```

Open http://localhost:3000

## Deploy (One Link)

This app is designed to run as **one web service**: Express serves `/api/*` and the React frontend from the same URL.

### Option 1: Render (Recommended — Free)

1. Push this repo to GitHub (if not already).
2. Go to [render.com](https://render.com) and sign up with GitHub.
3. Click **New → Blueprint** and connect this repository.
4. Render reads `render.yaml` automatically:
   - **Build:** `npm install && npm run build`
   - **Start:** `npm start`
5. Click **Apply**. In ~3–5 minutes you get one live URL like:
   `https://food-delivery-xxxx.onrender.com`

> **Note:** Free tier sleeps after 15 min of inactivity. First load may take ~30 seconds to wake up.

### Option 2: Netlify (Already configured)

1. Go to [netlify.com](https://netlify.com) → **Add new site → Import from Git**.
2. Connect this repo. Netlify uses `netlify.toml`:
   - Frontend: `dist/spa`
   - API: serverless functions at `/api/*`
3. Deploy — you get one URL like `https://your-app.netlify.app`.

### Option 3: Docker (Railway, Fly.io, any host)

```bash
docker build -t food-delivery .
docker run -p 3000:3000 food-delivery
```

Or connect the repo to [Railway](https://railway.app) / [Fly.io](https://fly.io) and point it at the Dockerfile.

## Demo Accounts

The app uses in-memory data (resets on server restart). Register new accounts or use seeded demo data from the app.

## Tech Stack

- **Frontend:** React 18, Vite, TailwindCSS, React Router
- **Backend:** Express 5, JWT auth
- **Database:** In-memory (demo)

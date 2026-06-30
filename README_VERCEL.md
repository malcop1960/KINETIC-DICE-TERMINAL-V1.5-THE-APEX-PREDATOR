# Kinetic-Dice Terminal V1.0 APEX – Vercel Deployment Guide

Deploying this app to Vercel is extremely straightforward because it is built entirely using **Vite, React, TypeScript**, and **Tailwind CSS v4** as a modern Single-Page Application (SPA).

We have already configured `/vercel.json` with the necessary rewrite rules to ensure that routing and deep links work flawlessly without 404 errors.

---

## ⚡ Option 1: Deploy with Vercel Web Dashboard (Recommended)

1. **Commit and Push to GitHub/GitLab/Bitbucket:**
   Push your project directory to a repository. Make sure to exclude `node_modules/` and `dist/` (they are ignored by default in the `.gitignore` file).

2. **Connect to Vercel:**
   - Go to [Vercel.com](https://vercel.com/) and sign in.
   - Click **Add New...** -> **Project**.
   - Input your Git repository URL or choose your connected GitHub account.

3. **Configure Project Settings:**
   - **Framework Preset:** Select **Vite** (Vercel should auto-detect this).
   - **Root Directory:** `./`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

4. **Click Deploy!**
   Your app will build and go live on a free `*.vercel.app` domain in less than 45 seconds.

---

## 💻 Option 2: Deploy with Vercel CLI (Super Fast)

If you have the node terminal installed locally:

```bash
# 1. Install the global vercel client
npm install -g vercel

# 2. Login to your account
vercel login

# 3. Trigger build and launch instant preview
vercel
```

When prompt messages appear:
- *Set up and deploy?* **Yes**
- *Which scope?* **Your account**
- *Link to existing project?* **No**
- *What's your project name?* **kinetic-dice-terminal**
- *In which directory is your code?* **./**
- *Want to modify settings?* **No** (Vercel automatically detects Vite settings)

To deploy to production live and get a permanent link:
```bash
vercel --prod
```

---

## 🔒 Environment Variable Precautions

Because **Kinetic-Dice Terminal V1.0 APEX** is an offline-first client application (operating fully in the browser to maintain absolute privacy and maximum prediction speeds), **no backend database secrets or API keys are required for standard prediction features**. 

Should you decide to add server integrations later, configure them directly in the **Vercel Project Settings > Environment Variables** tab.

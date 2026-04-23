# DevPulse — Developer Productivity & Code Health Analyzer

A full-stack web application that analyzes GitHub repositories and displays commit activity, pull request stats, and a code health score in real-time.

**Live Demo:** https://devpulse-analyzer-9biy.vercel.app
> Login with your GitHub account to view real-time data from your repositories.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js + Vite |
| Backend | Python + FastAPI |
| Authentication | GitHub OAuth |
| Charts | Recharts |
| GitHub Data | PyGithub |
| Deployment | Vercel + Render |

---

## Features

- **GitHub OAuth Login** — secure authentication via GitHub account
- **Repository Selector** — analyze any of your repositories
- **Commit Activity Chart** — visualize commits over the last 14 days
- **Code Health Score** — scored out of 100 based on commit frequency, team size, and PR merge rate
- **Pull Request Analysis** — breakdown of open, closed, and merged PRs
- **Smart Insights** — automated suggestions based on repository data

---

## How the Health Score Works

```
Health Score = Commit Frequency (40%)
             + Team Size        (30%)
             + PR Merge Rate    (30%)
             = Total out of 100
```

---

## Project Structure

```
devpulse-analyzer/
├── backend/
│   ├── main.py         # FastAPI server — GitHub OAuth + data endpoints
│   └── .env            # Secret keys (not tracked in version control)
└── frontend/
    ├── src/
    │   ├── App.jsx
    │   └── pages/
    │       ├── LoginPage.jsx
    │       └── DashboardPage.jsx
    ├── vercel.json
    └── index.html
```

---

## Local Setup

### 1. Create a GitHub OAuth App

- Go to https://github.com/settings/developers
- Click **New OAuth App**
- Homepage URL: `http://localhost:5173`
- Callback URL: `http://localhost:8000/auth/callback`

### 2. Backend Setup

```bash
cd backend
pip install fastapi uvicorn PyGithub python-dotenv httpx
```

Create a `.env` file:

```
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret
```

Run the backend:

```bash
uvicorn main:app --reload
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### 4. Open in browser

```
http://localhost:5173
```

---

## Privacy & Security

- Authentication is handled via GitHub OAuth — no passwords are stored
- Users can only access their own repository data
- `.env` file is excluded from version control via `.gitignore`

---

## Developer

**Prachi Chauhan** — Full Stack Developer | Open to Internships 2026

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=flat-square&logo=linkedin&logoColor=white)](https://linkedin.com/in/prachitechvision)
[![Email](https://img.shields.io/badge/Gmail-D14836?style=flat-square&logo=gmail&logoColor=white)](mailto:prachisisodia222@gmail.com)

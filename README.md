# DevPulse — Developer Productivity & Code Health Analyzer

A full-stack web app that analyzes your GitHub repositories and shows commit activity, pull request stats, and code health score.

## 🚀 Live Demo
> Login with your GitHub account to see real-time data from your repositories. 

## 🛠️ Tech Stack

| Part | Technology |
|------|-----------|
| Frontend | React + Vite |
| Backend | Python + FastAPI |
| Authentication | GitHub OAuth |
| Charts | Recharts |
| GitHub Data | PyGithub |  

## ✨ Features

- **GitHub OAuth Login** — secure login with your GitHub account
- **Repository Selector** — choose any of your repositories
- **Commit Activity Chart** — visualize commits over last 14 days
- **Code Health Score** — score out of 100 based on commit frequency, team size, and PR merge rate
- **Pull Request Analysis** — see open, closed, and merged PRs
- **Smart Insights** — automatic suggestions based on your repo data

## 📁 Project Structure
```
devpulse-analyzer/
├── backend/
│   ├── main.py        # FastAPI server — GitHub OAuth + data endpoints
│   └── .env           # Secret keys (not uploaded to GitHub)
└── frontend/
    ├── src/
    │   ├── App.jsx
    │   ├── pages/
    │   │   ├── LoginPage.jsx
    │   │   └── DashboardPage.jsx
    └── index.html
```

## ⚙️ Setup Instructions

### 1. Create GitHub OAuth App
- Go to https://github.com/settings/developers
- Click **New OAuth App**
- Homepage URL: `http://localhost:5173`
- Callback URL: `http://localhost:8000/auth/callback`

### 2. Backend Setup
```bash
cd backend
pip install fastapi uvicorn PyGithub python-dotenv httpx
```
Create `.env` file:
```
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret
```
Run backend:
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

## 📊 How Health Score Works
```
Health Score = Commit Frequency (40%)
             + Team Size        (30%)
             + PR Merge Rate    (30%)
             = Total out of 100
```

## 🔒 Privacy & Security
- GitHub OAuth is used — we never store your password
- Access token is only used locally on your machine
- `.env` file is never uploaded to GitHub

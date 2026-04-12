from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
import httpx
import os
from dotenv import load_dotenv
from github import Github
from datetime import datetime, timedelta
from collections import defaultdict

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://devpulse-analyzer-9biy.vercel.app"],
    allow_methods=["*"],
    allow_headers=["*"],
)

GITHUB_CLIENT_ID = os.getenv("GITHUB_CLIENT_ID")
GITHUB_CLIENT_SECRET = os.getenv("GITHUB_CLIENT_SECRET")

@app.get("/auth/login")
def login():
    return RedirectResponse(
        f"https://github.com/login/oauth/authorize?client_id={GITHUB_CLIENT_ID}&scope=repo,read:user"
    )
    
@app.get("/auth/callback")
async def callback(code: str = Query(...)):
    async with httpx.AsyncClient() as client:
        resp = await client.post(
            "https://github.com/login/oauth/access_token",
            data={
                "client_id": GITHUB_CLIENT_ID,
                "client_secret": GITHUB_CLIENT_SECRET,
                "code": code
            },
            headers={"Accept": "application/json"},
        )
    token_data = resp.json()
    access_token = token_data.get("access_token")
    if not access_token:
        raise HTTPException(status_code=400, detail="Failed to get access token")
    return RedirectResponse(f"https://devpulse-analyzer-9biy.vercel.app/dashboard?token={access_token}")

# Fetch logged-in user info
@app.get("/user")
def get_user(token: str = Query(...)):
    g = Github(token)        # connect to GitHub with token
    user = g.get_user()      # get user object
    return {
        "login": user.login,           # username
        "name": user.name,             # full name
        "avatar_url": user.avatar_url  # profile photo
    }


# Fetch user's repositories
@app.get("/repos")
def get_repos(token: str = Query(...)):
    g = Github(token)
    user = g.get_user()
    repos = []

    # Get top 20 repos sorted by recently updated
    for repo in user.get_repos(sort="updated", type="owner")[:20]:
        repos.append({
            "id": repo.id,
            "name": repo.name,
            "full_name": repo.full_name,       # e.g. "rahul/my-project"
            "description": repo.description,
            "language": repo.language,          # e.g. Python, JavaScript
            "stargazers_count": repo.stargazers_count,
            "private": repo.private
        })
    return repos

# Fetch detailed stats for a specific repo
@app.get("/repo/{owner}/{repo}/stats")
def get_repo_stats(owner: str, repo: str, token: str = Query(...)):
    g = Github(token)
    r = g.get_repo(f"{owner}/{repo}")  # get specific repo

    # --- COMMITS (last 30 days) ---
    since = datetime.utcnow() - timedelta(days=30)  # 30 days ago
    try:
        commits = list(r.get_commits(since=since))
        commit_count = len(commits)
    except:
        commits = []
        commit_count = 0

    # --- PULL REQUESTS ---
    open_prs = r.get_pulls(state="open").totalCount    # open PRs count
    closed_prs = r.get_pulls(state="closed").totalCount # closed PRs count

    # --- CONTRIBUTORS ---
    try:
        contributors = r.get_contributors().totalCount
    except:
        contributors = 0

    # --- COMMIT ACTIVITY (last 14 days) ---
    daily = defaultdict(int)
    for c in commits:
        day = c.commit.author.date.strftime("%Y-%m-%d")  # group by date
        daily[day] += 1

    # Build 14 day activity list
    activity = []
    for i in range(14):
        d = (datetime.utcnow() - timedelta(days=13 - i)).strftime("%Y-%m-%d")
        activity.append({"date": d, "commits": daily.get(d, 0)})

    # --- RECENT COMMITS (last 5) ---
    recent_commits = []
    for c in commits[:5]:
        recent_commits.append({
            "sha": c.sha[:7],          # short commit id
            "message": c.commit.message.split('\n')[0][:80],  # first line only
            "author": c.commit.author.name,
            "date": c.commit.author.date.isoformat()
        })

   # --- PR LIST (last 10) ---
    pr_list = []
    try:
        for pr in list(r.get_pulls(state="all"))[:10]:
            pr_list.append({
                "number": pr.number,
                "title": pr.title[:70],
                "state": pr.state,        # open or closed
                "user": pr.user.login,
                "created_at": pr.created_at.isoformat(),
                "merged": pr.merged
            })
    except:
        pr_list = []

    # --- HEALTH SCORE (0-100) ---
    # Based on: commit frequency + team size + PR merge rate
    health_score = min(100, max(0,
        (min(commit_count, 30) / 30) * 40 +   # 40% weight
        (min(contributors, 5) / 5) * 30 +      # 30% weight
        (30 if closed_prs > open_prs else 10)  # 30% weight
    ))

    return {
        "commits_30d": commit_count,
        "open_prs": open_prs,
        "closed_prs": closed_prs,
        "contributors": contributors,
        "activity": activity,
        "recent_commits": recent_commits,
        "pr_list": pr_list,
        "health_score": round(health_score),
        "language": r.language,
        "stars": r.stargazers_count,
        "forks": r.forks_count,
    }
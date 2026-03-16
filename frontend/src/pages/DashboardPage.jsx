import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const API = 'http://localhost:8000'

// Custom tooltip for chart
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: '#1a1a24', border: '1px solid #2a2a3a',
      borderRadius: 8, padding: '8px 12px',
      fontSize: 12, fontFamily: 'Space Mono, monospace'
    }}>
      <div style={{ color: '#6b6b80', marginBottom: 4 }}>{label}</div>
      <div style={{ color: '#7c6dfa', fontWeight: 700 }}>{payload[0].value} commits</div>
    </div>
  )
}

// Single stat card
function StatCard({ label, value, sub, accent, icon }) {
  return (
    <div style={{
      background: '#111118', border: '1px solid #1e1e2e',
      borderRadius: 16, padding: 24, flex: 1, minWidth: 160,
      position: 'relative', overflow: 'hidden'
    }}>
      <div style={{ position: 'absolute', top: 16, right: 16, fontSize: 22, opacity: 0.12 }}>{icon}</div>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#6b6b80', marginBottom: 12, fontFamily: 'Space Mono, monospace' }}>{label}</div>
      <div style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-2px', color: accent, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ marginTop: 8, fontSize: 12, color: '#4a4a5a', fontFamily: 'Space Mono, monospace' }}>{sub}</div>}
    </div>
  )
}

// Health score ring
function HealthRing({ score }) {
  const r = 54
  const circumference = 2 * Math.PI * r
  const dash = (score / 100) * circumference
  const color = score >= 70 ? '#4ade80' : score >= 40 ? '#fbbf24' : '#fa6d8f'

  return (
    <div style={{ position: 'relative', width: 140, height: 140 }}>
      <svg width={140} height={140} style={{ transform: 'rotate(-90deg)' }}>
        {/* Background circle */}
        <circle cx={70} cy={70} r={r} fill="none" stroke="#1e1e2e" strokeWidth={10} />
        {/* Score circle */}
        <circle cx={70} cy={70} r={r} fill="none" stroke={color} strokeWidth={10}
          strokeDasharray={`${dash} ${circumference}`} strokeLinecap="round" />
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center'
      }}>
        <span style={{ fontSize: 28, fontWeight: 800, color, letterSpacing: '-1px' }}>{score}</span>
        <span style={{ fontSize: 10, color: '#6b6b80', fontFamily: 'Space Mono, monospace' }}>/ 100</span>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const [params] = useSearchParams()
  const token = params.get('token')

  const [user, setUser] = useState(null)
  const [repos, setRepos] = useState([])
  const [selectedRepo, setSelectedRepo] = useState(null)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(false)
  const [activePage, setActivePage] = useState('dashboard')

  // Fetch user and repos on load
  useEffect(() => {
    if (!token) return
    fetch(`${API}/user?token=${token}`).then(r => r.json()).then(setUser)
    fetch(`${API}/repos?token=${token}`).then(r => r.json()).then(data => {
      setRepos(data)
      if (data.length) setSelectedRepo(data[0])
    })
  }, [token])

  // Fetch stats when repo changes
  useEffect(() => {
    if (!selectedRepo || !token) return
    setLoading(true)
    const [owner, repo] = selectedRepo.full_name.split('/')
    fetch(`${API}/repo/${owner}/${repo}/stats?token=${token}`)
      .then(r => r.json())
      .then(d => { setStats(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [selectedRepo, token])

  if (!token) return (
    <div style={{ color: '#fa6d8f', padding: 40, fontFamily: 'Space Mono, monospace' }}>
      No token found. Please login again.
    </div>
  )

  // Sidebar nav items
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '◈' },
    { id: 'health', label: 'Code Health', icon: '◉' },
    { id: 'prs', label: 'Pull Requests', icon: '⊞' },
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>

      {/* SIDEBAR */}
      <aside style={{
        width: 220, minHeight: '100vh', background: '#0d0d14',
        borderRight: '1px solid #1e1e2e', display: 'flex',
        flexDirection: 'column', position: 'fixed', left: 0, top: 0, bottom: 0
      }}>
        {/* Logo */}
        <div style={{ padding: '28px 20px 24px', borderBottom: '1px solid #1e1e2e', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 8,
            background: 'linear-gradient(135deg, #7c6dfa, #fa6d8f)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16
          }}>⚡</div>
          <span style={{ fontSize: 17, fontWeight: 800 }}>DevPulse</span>
        </div>

        {/* Nav links */}
        <nav style={{ flex: 1, padding: '16px 12px' }}>
          {navItems.map(item => (
            <button key={item.id} onClick={() => setActivePage(item.id)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 12px', borderRadius: 10, marginBottom: 4,
                background: activePage === item.id ? 'rgba(124,109,250,0.15)' : 'transparent',
                color: activePage === item.id ? '#7c6dfa' : '#6b6b80',
                fontSize: 14, fontWeight: activePage === item.id ? 700 : 500,
                border: activePage === item.id ? '1px solid rgba(124,109,250,0.3)' : '1px solid transparent',
                fontFamily: 'Syne, sans-serif', textAlign: 'left'
              }}>
              <span>{item.icon}</span> {item.label}
            </button>
          ))}
        </nav>

        {/* User info */}
        {user && (
          <div style={{ padding: '16px 20px', borderTop: '1px solid #1e1e2e', display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src={user.avatar_url} alt="" style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid #2a2a3a' }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{user.name || user.login}</div>
              <div style={{ fontSize: 11, color: '#6b6b80', fontFamily: 'Space Mono, monospace' }}>@{user.login}</div>
            </div>
          </div>
        )}
      </aside>

      {/* MAIN CONTENT */}
      <main style={{ marginLeft: 220, flex: 1, padding: '32px 36px', background: '#0a0a0f' }}>

        {/* Page heading */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: '#7c6dfa', marginBottom: 8, fontFamily: 'Space Mono, monospace' }}>
            {activePage === 'dashboard' ? 'Overview' : activePage === 'health' ? 'Analysis' : 'Review'}
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-1px' }}>
            {activePage === 'dashboard' ? 'Dashboard' : activePage === 'health' ? 'Code Health' : 'Pull Requests'}
          </h1>
        </div>

        {/* Repo selector — shown on all pages */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
          <span style={{ fontSize: 13, color: '#6b6b80', fontFamily: 'Space Mono, monospace' }}>Repository</span>
          <select value={selectedRepo?.full_name || ''} onChange={e => setSelectedRepo(repos.find(r => r.full_name === e.target.value))}
            style={{
              background: '#111118', border: '1px solid #2a2a3a', color: '#e8e8f0',
              borderRadius: 10, padding: '10px 16px', fontSize: 14,
              fontFamily: 'Syne, sans-serif', minWidth: 280, outline: 'none'
            }}>
            {repos.map(r => <option key={r.full_name} value={r.full_name}>{r.full_name}</option>)}
          </select>
          {selectedRepo?.language && (
            <span style={{
              background: 'rgba(124,109,250,0.1)', border: '1px solid rgba(124,109,250,0.25)',
              color: '#7c6dfa', borderRadius: 8, padding: '4px 12px',
              fontSize: 12, fontFamily: 'Space Mono, monospace'
            }}>{selectedRepo.language}</span>
          )}
          {loading && <span style={{ color: '#6b6b80', fontSize: 12, fontFamily: 'Space Mono, monospace' }}>Loading...</span>}
        </div>

        {/* DASHBOARD PAGE */}
        {activePage === 'dashboard' && stats && (
          <>
            {/* Stat cards */}
            <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
              <StatCard label="Commits (30d)" value={stats.commits_30d} sub="last 30 days" accent="#7c6dfa" icon="◎" />
              <StatCard label="Open PRs" value={stats.open_prs} sub={`${stats.closed_prs} closed`} accent="#fa6d8f" icon="⊞" />
              <StatCard label="Contributors" value={stats.contributors} sub="unique authors" accent="#4ade80" icon="◉" />
              <StatCard label="Stars" value={stats.stars} sub={`${stats.forks} forks`} accent="#fbbf24" icon="★" />
            </div>

            {/* Commit activity chart */}
            <div style={{ background: '#111118', border: '1px solid #1e1e2e', borderRadius: 16, padding: 24, marginBottom: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#6b6b80', fontFamily: 'Space Mono, monospace', marginBottom: 4 }}>Commit Activity</div>
              <div style={{ fontSize: 11, color: '#3a3a4a', fontFamily: 'Space Mono, monospace', marginBottom: 20 }}>Last 14 days</div>
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={stats.activity} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                  <defs>
                    <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7c6dfa" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#7c6dfa" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" tick={{ fill: '#3a3a4a', fontSize: 10, fontFamily: 'Space Mono' }}
                    tickFormatter={d => d.slice(5)} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#3a3a4a', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Area type="monotone" dataKey="commits" stroke="#7c6dfa" strokeWidth={2} fill="url(#cg)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Insights */}
            <div style={{ background: '#111118', border: '1px solid #1e1e2e', borderRadius: 16, padding: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#6b6b80', fontFamily: 'Space Mono, monospace', marginBottom: 20 }}>Insights</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[
                  { t: stats.commits_30d > 20 ? '🔥 Highly active repo' : '📦 Low activity', d: `${stats.commits_30d} commits in 30 days` },
                  { t: stats.open_prs > 5 ? '⚠️ PR backlog detected' : '✅ PR flow healthy', d: `${stats.open_prs} open, ${stats.closed_prs} closed` },
                  { t: stats.contributors >= 3 ? '👥 Active team' : '👤 Solo project', d: `${stats.contributors} contributors` },
                  { t: stats.health_score >= 70 ? '💚 Good code health' : stats.health_score >= 40 ? '🟡 Moderate health' : '🔴 Needs attention', d: `Health score: ${stats.health_score}/100` },
                ].map((ins, i) => (
                  <div key={i} style={{ background: '#0d0d14', border: '1px solid #1e1e2e', borderRadius: 12, padding: 16 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>{ins.t}</div>
                    <div style={{ fontSize: 12, color: '#6b6b80', fontFamily: 'Space Mono, monospace' }}>{ins.d}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* CODE HEALTH PAGE */}
        {activePage === 'health' && stats && (
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>

            {/* Health ring */}
            <div style={{ background: '#111118', border: '1px solid #1e1e2e', borderRadius: 16, padding: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, minWidth: 220 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#6b6b80', fontFamily: 'Space Mono, monospace' }}>Health Score</div>
              <HealthRing score={stats.health_score} />
              <div style={{ fontSize: 12, color: '#6b6b80', fontFamily: 'Space Mono, monospace', textAlign: 'center' }}>
                {stats.health_score >= 70 ? 'Great shape!' : stats.health_score >= 40 ? 'Room to improve' : 'Needs attention'}
              </div>
            </div>

            {/* Score breakdown */}
            <div style={{ flex: 1, background: '#111118', border: '1px solid #1e1e2e', borderRadius: 16, padding: 32, minWidth: 280 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#6b6b80', fontFamily: 'Space Mono, monospace', marginBottom: 20 }}>Score Breakdown</div>
              {[
                { label: 'Commit Frequency', val: Math.min(100, Math.round((stats.commits_30d / 30) * 100)), color: '#7c6dfa' },
                { label: 'Team Size', val: Math.min(100, stats.contributors * 20), color: '#4ade80' },
                { label: 'PR Merge Rate', val: stats.closed_prs + stats.open_prs > 0 ? Math.round((stats.closed_prs / (stats.closed_prs + stats.open_prs)) * 100) : 0, color: '#fbbf24' },
              ].map(m => (
                <div key={m.label} style={{ marginBottom: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
                    <span>{m.label}</span>
                    <span style={{ fontFamily: 'Space Mono, monospace', color: m.color, fontWeight: 700 }}>{m.val}%</span>
                  </div>
                  <div style={{ height: 6, background: '#1e1e2e', borderRadius: 3 }}>
                    <div style={{ height: '100%', width: `${m.val}%`, background: m.color, borderRadius: 3 }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Suggestions */}
            <div style={{ flex: 1, background: '#111118', border: '1px solid #1e1e2e', borderRadius: 16, padding: 32, minWidth: 280 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#6b6b80', fontFamily: 'Space Mono, monospace', marginBottom: 20 }}>Suggestions</div>
              {[
                stats.commits_30d < 10 && '📌 Increase commit frequency for better tracking',
                stats.open_prs > 5 && '🔁 Review and merge open pull requests',
                stats.contributors < 2 && '👥 Consider involving more contributors',
                stats.health_score < 50 && '⚡ Focus on consistent development cadence',
                stats.health_score >= 70 && '🎉 Keep up the great work!',
              ].filter(Boolean).map((s, i) => (
                <div key={i} style={{ padding: '12px 16px', background: '#0d0d14', border: '1px solid #1e1e2e', borderRadius: 10, marginBottom: 10, fontSize: 13, lineHeight: 1.5 }}>{s}</div>
              ))}
            </div>
          </div>
        )}

        {/* PULL REQUESTS PAGE */}
        {activePage === 'prs' && stats && (
          <>
            {/* PR stats */}
            <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
              <StatCard label="Open" value={stats.open_prs} accent="#fa6d8f" icon="○" />
              <StatCard label="Closed" value={stats.closed_prs} accent="#4ade80" icon="●" />
              <StatCard label="Merge Rate" value={`${stats.closed_prs + stats.open_prs > 0 ? Math.round((stats.closed_prs / (stats.closed_prs + stats.open_prs)) * 100) : 0}%`} accent="#fbbf24" icon="%" />
            </div>

            {/* PR list */}
            <div style={{ background: '#111118', border: '1px solid #1e1e2e', borderRadius: 16, overflow: 'hidden' }}>
              <div style={{ padding: '16px 24px', borderBottom: '1px solid #1e1e2e', fontSize: 11, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#6b6b80', fontFamily: 'Space Mono, monospace' }}>
                Recent Pull Requests
              </div>
              {stats.pr_list.length === 0 ? (
                <div style={{ padding: 32, color: '#6b6b80', fontFamily: 'Space Mono, monospace' }}>No pull requests found.</div>
              ) : stats.pr_list.map(pr => (
                <div key={pr.number} style={{ padding: '16px 24px', borderBottom: '1px solid #0d0d14', display: 'flex', alignItems: 'center', gap: 16 }}>
                  <span style={{
                    fontSize: 10, fontWeight: 700, fontFamily: 'Space Mono, monospace',
                    padding: '3px 8px', borderRadius: 6, minWidth: 52, textAlign: 'center',
                    background: pr.state === 'open' ? 'rgba(74,222,128,0.1)' : 'rgba(124,109,250,0.1)',
                    color: pr.state === 'open' ? '#4ade80' : '#7c6dfa',
                    border: `1px solid ${pr.state === 'open' ? 'rgba(74,222,128,0.2)' : 'rgba(124,109,250,0.2)'}`,
                  }}>{pr.state}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>#{pr.number} {pr.title}</div>
                    <div style={{ fontSize: 11, color: '#6b6b80', fontFamily: 'Space Mono, monospace' }}>
                      by @{pr.user} · {new Date(pr.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  {pr.merged && (
                    <span style={{ fontSize: 10, color: '#7c6dfa', fontFamily: 'Space Mono, monospace', background: 'rgba(124,109,250,0.1)', padding: '2px 8px', borderRadius: 6 }}>merged</span>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

      </main>
    </div>
  )
}
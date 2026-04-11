import React, { useEffect, useRef } from 'react'

export default function LoginPage() {
  const canvasRef = useRef(null)

  // Animated background particles
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // Create 60 random particles
    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3, // horizontal speed
      vy: (Math.random() - 0.5) * 0.3, // vertical speed
      r: Math.random() * 1.5 + 0.5,    // radius
      alpha: Math.random() * 0.4 + 0.1, // opacity
    }))

    let raf
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw each particle
      particles.forEach(p => {
        p.x += p.vx
        p.y += p.vy

        // Wrap around edges
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(124,109,250,${p.alpha})`
        ctx.fill()
      })

      // Draw lines between nearby particles
      particles.forEach((a, i) => {
        particles.slice(i + 1).forEach(b => {
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 120) {
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.strokeStyle = `rgba(124,109,250,${0.1 * (1 - dist / 120)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        })
      })
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      
      {/* Animated background */}
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, zIndex: 0 }} />

      {/* Purple glow effect */}
      <div style={{
        position: 'absolute', width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124,109,250,0.12) 0%, transparent 70%)',
        top: '20%', left: '30%', transform: 'translate(-50%,-50%)', zIndex: 0
      }} />

      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: 40 }}>
        
        {/* Logo */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: 48 }}>
          <div style={{
            width: 42, height: 42, borderRadius: 10,
            background: 'linear-gradient(135deg, #7c6dfa, #fa6d8f)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 800
          }}>⚡</div>
          <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.5px' }}>DevPulse</span>
        </div>

        {/* Login Card */}
        <div style={{
          background: 'rgba(17,17,24,0.85)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(124,109,250,0.2)',
          borderRadius: 24,
          padding: '56px 64px',
          maxWidth: 460,
          margin: '0 auto',
          boxShadow: '0 40px 80px rgba(0,0,0,0.5)'
        }}>
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: '3px',
            textTransform: 'uppercase', color: '#7c6dfa', marginBottom: 20,
            fontFamily: 'Space Mono, monospace'
          }}>Developer Intelligence</div>

          <h1 style={{
            fontSize: 42, fontWeight: 800, lineHeight: 1.1,
            letterSpacing: '-1.5px', marginBottom: 16,
            background: 'linear-gradient(135deg, #e8e8f0 0%, #7c6dfa 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
          }}>
            Analyze Your<br />Code Health
          </h1>

          <p style={{ color: '#6b6b80', fontSize: 15, lineHeight: 1.7, marginBottom: 40, fontFamily: 'Space Mono, monospace' }}>
            Connect your GitHub and get insights on commits, pull requests, and productivity.
          </p>

          {/* GitHub Login Button */}
          <a href="https://devpulse-backend-uqdz.onrender.com/auth/login">
            <button style={{
              width: '100%', padding: '16px 32px',
              background: 'linear-gradient(135deg, #7c6dfa, #6055e0)',
              color: '#fff', fontSize: 15, fontWeight: 700,
              borderRadius: 12, display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: 10,
              boxShadow: '0 8px 24px rgba(124,109,250,0.35)',
            }}>
              {/* GitHub Icon */}
              <svg height="20" width="20" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
              </svg>
              Login with GitHub
            </button>
          </a>

          <p style={{ marginTop: 24, color: '#3a3a4a', fontSize: 12, fontFamily: 'Space Mono, monospace' }}>
            We only request read access to your repositories
          </p>
        </div>
      </div>
    </div>
  )
}
#!/usr/bin/env python3
import os
import shutil

REDESIGN_DIR = "/data/data/com.termux/files/home/MWD/redesign"
DOWNLOAD_DIR = "/sdcard/Download"

os.makedirs(REDESIGN_DIR, exist_ok=True)
os.makedirs(DOWNLOAD_DIR, exist_ok=True)

# Shared CSS styles
SHARED_CSS = """
    :root {
      --primary: #E02020;
      --primary-hover: #c01818;
      --primary-glow: rgba(224, 32, 32, 0.22);
      --bg: #FAFAFA;
      --card-bg: #FFFFFF;
      --card-alt: #F4F4F5;
      --text-main: #0A0A0A;
      --text-muted: #666666;
      --border-subtle: rgba(0, 0, 0, 0.08);
      --nav-bg: rgba(250, 250, 250, 0.92);
      --box-shadow: 0 16px 32px rgba(0, 0, 0, 0.05);
      --radius-sm: 8px;
      --radius-md: 14px;
      --radius-lg: 20px;
      --font-display: 'Bricolage Grotesque', sans-serif;
      --font-body: 'Instrument Sans', sans-serif;
      --safe-top: env(safe-area-inset-top, 0px);
      --safe-bottom: env(safe-area-inset-bottom, 0px);
    }

    [data-theme="dark"] {
      --bg: #09090B;
      --card-bg: #121215;
      --card-alt: #18181C;
      --text-main: #EDEDED;
      --text-muted: #9E9EA4;
      --border-subtle: rgba(255, 255, 255, 0.09);
      --nav-bg: rgba(9, 9, 11, 0.92);
      --box-shadow: 0 16px 32px rgba(0, 0, 0, 0.4);
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      background-color: var(--bg);
      color: var(--text-main);
      font-family: var(--font-body);
      line-height: 1.5;
      -webkit-font-smoothing: antialiased;
      padding-top: calc(70px + var(--safe-top));
      padding-bottom: var(--safe-bottom);
      transition: background-color 0.3s ease, color 0.3s ease;
      position: relative;
      min-height: 100vh;
    }

    a {
      color: inherit;
      text-decoration: none;
    }

    button {
      font-family: inherit;
      cursor: pointer;
    }

    .container {
      width: 100%;
      max-width: 1160px;
      margin: 0 auto;
      padding: 0 20px;
    }

    /* 3D Canvas Background */
    #bg-canvas {
      position: fixed;
      inset: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: -1;
    }

    /* Header Nav */
    header.site-header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 70px;
      background: var(--nav-bg);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--border-subtle);
      z-index: 100;
      display: flex;
      align-items: center;
      transition: background-color 0.3s ease;
    }

    .nav-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
    }

    .brand {
      font-family: var(--font-display);
      font-weight: 800;
      font-size: 1.35rem;
      letter-spacing: -0.03em;
      display: inline-flex;
      align-items: center;
      gap: 5px;
    }

    .brand .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--primary);
    }

    .desktop-nav {
      display: flex;
      align-items: center;
      gap: 24px;
    }

    .desktop-nav a {
      font-size: 0.9rem;
      font-weight: 500;
      color: var(--text-muted);
      transition: color 0.2s ease;
    }

    .desktop-nav a:hover, .desktop-nav a.active {
      color: var(--primary);
    }

    .nav-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    /* Theme Toggle */
    .theme-toggle {
      background: var(--card-alt);
      border: 1px solid var(--border-subtle);
      color: var(--text-main);
      width: 38px;
      height: 38px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }
    .theme-toggle:hover {
      border-color: var(--primary);
      color: var(--primary);
    }

    .hamburger-btn {
      display: none;
      background: transparent;
      border: none;
      color: var(--text-main);
      padding: 6px;
    }

    /* Mobile drawer */
    .mobile-drawer {
      display: none;
      position: fixed;
      inset: 0;
      background: var(--bg);
      z-index: 1000;
      padding: 24px;
      flex-direction: column;
      justify-content: space-between;
    }
    .mobile-drawer.open {
      display: flex;
    }

    /* Buttons */
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      font-size: 0.9rem;
      font-weight: 600;
      padding: 12px 22px;
      border-radius: var(--radius-sm);
      transition: all 0.25s ease;
      cursor: pointer;
    }
    .btn-primary {
      background: var(--primary);
      color: #FFFFFF !important;
      border: none;
      box-shadow: 0 4px 14px var(--primary-glow);
    }
    .btn-primary:hover {
      background: var(--primary-hover);
      transform: translateY(-1px);
    }
    .btn-outline {
      background: transparent;
      color: var(--text-main);
      border: 1px solid var(--border-subtle);
    }
    .btn-outline:hover {
      border-color: var(--primary);
      color: var(--primary);
    }

    /* Badges */
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 12px;
      border-radius: 50px;
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      background: rgba(224, 32, 32, 0.08);
      border: 1px solid rgba(224, 32, 32, 0.2);
      color: var(--primary);
    }

    /* Cards */
    .card {
      background: var(--card-bg);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      padding: 30px;
      transition: all 0.3s ease;
    }
    .card:hover {
      border-color: rgba(224, 32, 32, 0.3);
      box-shadow: var(--box-shadow);
      transform: translateY(-2px);
    }

    /* Responsive Grid rule: zero phone overflow */
    .grid-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 310px), 1fr));
      gap: 24px;
    }

    /* Section headers */
    .section-head {
      margin-bottom: 48px;
      max-width: 720px;
    }
    .section-head h1 {
      font-family: var(--font-display);
      font-size: clamp(2.2rem, 5vw, 3.4rem);
      font-weight: 800;
      line-height: 1.12;
      letter-spacing: -0.03em;
      margin-top: 14px;
      color: var(--text-main);
    }
    .section-head p {
      font-size: 1.1rem;
      color: var(--text-muted);
      margin-top: 14px;
      line-height: 1.6;
    }

    /* Footer */
    footer.site-footer {
      background: #000000;
      color: #FFFFFF;
      padding: 60px 0 30px;
      margin-top: 80px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }
    .footer-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 36px;
      margin-bottom: 50px;
    }
    .footer-col h4 {
      font-size: 0.95rem;
      font-weight: 700;
      margin-bottom: 16px;
      color: #FFFFFF;
    }
    .footer-col ul {
      list-style: none;
    }
    .footer-col li {
      margin-bottom: 10px;
    }
    .footer-col a {
      color: #9E9EA4;
      font-size: 0.88rem;
      transition: color 0.2s ease;
    }
    .footer-col a:hover {
      color: #FFFFFF;
    }

    @media (max-width: 768px) {
      .desktop-nav, .desktop-quote-btn {
        display: none;
      }
      .hamburger-btn {
        display: block;
      }
    }
"""

# Shared 3D Spatial Canvas Script
SHARED_JS_3D = """
  <script>
    // Theme toggle logic
    function toggleTheme() {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('mwd-theme', next);
    }

    function toggleMobileMenu() {
      const d = document.getElementById('mobile-drawer');
      if (d) d.classList.toggle('open');
    }

    // 3D Spatial Canvas Engine
    (function init3DBackground() {
      const canvas = document.getElementById('bg-canvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      let w = (canvas.width = window.innerWidth);
      let h = (canvas.height = window.innerHeight);

      window.addEventListener('resize', () => {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
      });

      const numPoints = 42;
      const points = [];
      const fov = 350;

      for (let i = 0; i < numPoints; i++) {
        points.push({
          x: (Math.random() - 0.5) * w * 1.4,
          y: (Math.random() - 0.5) * h * 1.4,
          z: Math.random() * 600 + 100,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          vz: (Math.random() - 0.5) * 0.25,
          size: Math.random() * 2 + 1.2
        });
      }

      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      let angle = 0;

      function render() {
        ctx.clearRect(0, 0, w, h);
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const cx = w / 2;
        const cy = h / 2;

        // Ambient glow gradient
        const grad = ctx.createRadialGradient(cx, cy * 0.8, 20, cx, cy * 0.8, Math.max(w, h) * 0.7);
        if (isDark) {
          grad.addColorStop(0, 'rgba(224, 32, 32, 0.08)');
          grad.addColorStop(0.5, 'rgba(18, 18, 24, 0.4)');
          grad.addColorStop(1, 'rgba(9, 9, 11, 0)');
        } else {
          grad.addColorStop(0, 'rgba(224, 32, 32, 0.04)');
          grad.addColorStop(0.6, 'rgba(245, 245, 247, 0.3)');
          grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        }
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        if (!prefersReduced) angle += 0.0012;

        const proj = [];
        for (let i = 0; i < points.length; i++) {
          const p = points[i];
          if (!prefersReduced) {
            p.x += p.vx;
            p.y += p.vy;
            p.z += p.vz;
            if (p.z < 50) p.z = 700;
            if (p.z > 700) p.z = 50;
            if (Math.abs(p.x) > w * 0.8) p.vx *= -1;
            if (Math.abs(p.y) > h * 0.8) p.vy *= -1;
          }

          const cos = Math.cos(angle * 0.5);
          const sin = Math.sin(angle * 0.5);
          const rotX = p.x * cos - (p.z - 400) * sin;
          const rotZ = p.x * sin + (p.z - 400) * cos + 400;

          const scale = fov / (fov + rotZ);
          proj.push({
            px: rotX * scale + cx,
            py: p.y * scale + cy,
            scale: scale,
            alpha: Math.min(Math.max((700 - rotZ) / 650, 0.08), 0.85),
            size: p.size
          });
        }

        // Connecting lines
        for (let i = 0; i < proj.length; i++) {
          for (let j = i + 1; j < proj.length; j++) {
            const p1 = proj[i];
            const p2 = proj[j];
            const dx = p1.px - p2.px;
            const dy = p1.py - p2.py;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 135) {
              const alpha = (1 - dist / 135) * Math.min(p1.alpha, p2.alpha) * (isDark ? 0.35 : 0.18);
              ctx.beginPath();
              ctx.moveTo(p1.px, p1.py);
              ctx.lineTo(p2.px, p2.py);
              ctx.strokeStyle = `rgba(224, 32, 32, ${alpha})`;
              ctx.lineWidth = 0.8;
              ctx.stroke();
            }
          }
        }

        // Draw nodes
        for (let i = 0; i < proj.length; i++) {
          const p = proj[i];
          const r = Math.max(p.size * p.scale * 1.5, 1.2);
          ctx.beginPath();
          ctx.arc(p.px, p.py, r, 0, Math.PI * 2);
          if (isDark) {
            ctx.fillStyle = i % 3 === 0 ? `rgba(239, 68, 68, ${p.alpha * 0.9})` : `rgba(255, 255, 255, ${p.alpha * 0.6})`;
          } else {
            ctx.fillStyle = i % 3 === 0 ? `rgba(224, 32, 32, ${p.alpha * 0.7})` : `rgba(100, 116, 139, ${p.alpha * 0.5})`;
          }
          ctx.fill();
        }

        requestAnimationFrame(render);
      }
      render();
    })();
  </script>
"""

def generate_header(active_nav="services"):
    nav_links = [
        ("Home", "mwd_home_redesign.html", "home"),
        ("Services", "mwd_services_redesign.html", "services"),
        ("Portfolio", "mwd_portfolio_redesign.html", "portfolio"),
        ("Pricing", "mwd_pricing_redesign.html", "pricing"),
        ("About", "mwd_about_redesign.html", "about"),
        ("FAQ", "mwd_faq_redesign.html", "faq"),
        ("Contact", "mwd_contact_redesign.html", "contact"),
    ]
    
    desktop_links_html = "".join([
        f'<a href="{url}" class="{"active" if key == active_nav else ""}">{label}</a>'
        for label, url, key in nav_links
    ])
    
    mobile_links_html = "".join([
        f'<a href="{url}" onclick="toggleMobileMenu()" style="font-size:1.25rem;font-weight:700;padding:10px 0;border-bottom:1px solid var(--border-subtle);">{label}</a>'
        for label, url, key in nav_links
    ])

    return f"""
  <header class="site-header">
    <div class="container nav-inner">
      <a href="mwd_home_redesign.html" class="brand">
        MWD<span class="dot"></span>
      </a>

      <nav class="desktop-nav" aria-label="Main Navigation">
        {desktop_links_html}
      </nav>

      <div class="nav-actions">
        <button class="theme-toggle" onclick="toggleTheme()" aria-label="Toggle theme">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
        </button>

        <a href="mwd_quote_redesign.html" class="btn btn-primary desktop-quote-btn" style="padding:8px 16px;font-size:0.82rem;">
          Get a Quote
        </a>

        <button class="hamburger-btn" onclick="toggleMobileMenu()" aria-label="Open mobile menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>
      </div>
    </div>
  </header>

  <div id="mobile-drawer" class="mobile-drawer">
    <div>
      <div style="display:flex;align-items:center;justify-content:space-between;padding-bottom:16px;border-bottom:1px solid var(--border-subtle);">
        <span class="brand">MWD<span class="dot"></span></span>
        <button onclick="toggleMobileMenu()" style="background:none;border:none;color:var(--text-main);padding:8px;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
      <nav style="display:flex;flex-direction:column;margin-top:20px;">
        {mobile_links_html}
      </nav>
    </div>
    <div style="padding-top:20px;">
      <a href="mwd_quote_redesign.html" class="btn btn-primary" style="width:100%;">Request a Proposal</a>
    </div>
  </div>
"""

def generate_footer():
    return """
  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div style="grid-column: span 1.5;">
          <span style="font-family:var(--font-display);font-weight:800;font-size:1.4rem;">MWD<span style="color:var(--primary);">.</span></span>
          <p style="color:#9E9EA4;font-size:0.85rem;margin-top:12px;line-height:1.6;">
            Musab Web Development crafts bespoke business websites, high-conversion e-commerce stores, and digital menus in Addis Ababa, Ethiopia.
          </p>
        </div>
        <div class="footer-col">
          <h4>Services</h4>
          <ul>
            <li><a href="mwd_services_redesign.html">Website Development</a></li>
            <li><a href="mwd_services_redesign.html">E-Commerce</a></li>
            <li><a href="mwd_services_redesign.html">Digital Menus</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Pages</h4>
          <ul>
            <li><a href="mwd_about_redesign.html">About MWD</a></li>
            <li><a href="mwd_portfolio_redesign.html">Selected Work</a></li>
            <li><a href="mwd_pricing_redesign.html">Pricing Packages</a></li>
            <li><a href="mwd_faq_redesign.html">FAQ</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Direct Connect</h4>
          <ul>
            <li><a href="https://wa.me/251911000000" target="_blank">WhatsApp Chat</a></li>
            <li><a href="https://t.me/musab" target="_blank">Telegram @musab</a></li>
            <li><a href="mwd_contact_redesign.html">Direct Contact Form</a></li>
          </ul>
        </div>
      </div>
      <div style="border-top:1px solid rgba(255,255,255,0.1);padding-top:24px;text-align:center;font-size:0.8rem;color:#71717A;">
        &copy; 2026 Musab Web Development (MWD). All rights reserved. Built with Next.js & Lakebase Neon Postgres.
      </div>
    </div>
  </footer>
"""

# ----------------- PAGE TEMPLATES -----------------

def build_services_page():
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <title>Services — MWD | Web Design, E-Commerce & Digital Menus</title>
  <script>
    (function(){{var s=localStorage.getItem('mwd-theme');var p=window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.setAttribute('data-theme',s||(p?'dark':'light'));}})();
  </script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;700;800&family=Instrument+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>{SHARED_CSS}</style>
</head>
<body>
  <canvas id="bg-canvas" aria-hidden="true"></canvas>
  {generate_header("services")}

  <main class="container" style="padding-top:40px;">
    <div class="section-head">
      <div class="badge">Specialized Engineering</div>
      <h1>Services built for speed, conversion, and longevity.</h1>
      <p>We craft every project from source code for unmatched performance, airtight security, and lasting commercial impact across Ethiopia and worldwide.</p>
    </div>

    <div class="grid-cards" style="margin-bottom:60px;">
      <!-- Service 1 -->
      <article class="card" style="display:flex;flex-direction:column;justify-content:space-between;">
        <div>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
            <div style="width:44px;height:44px;border-radius:12px;background:rgba(224,32,32,0.1);display:flex;align-items:center;justify-content:center;color:var(--primary);">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
            </div>
            <span style="font-size:0.75rem;padding:3px 8px;border-radius:6px;background:var(--card-alt);color:var(--text-muted);font-weight:600;">5 – 10 days</span>
          </div>
          <span style="color:var(--primary);font-size:0.72rem;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;">Flagship Engineering</span>
          <h2 style="font-size:1.4rem;font-weight:700;margin:6px 0 12px;color:var(--text-main);">Website Development</h2>
          <p style="font-size:0.88rem;color:var(--text-muted);margin-bottom:20px;line-height:1.6;">
            Sub-second Next.js business websites that establish immediate credibility and turn Google search traffic into verified inquiries.
          </p>
          <div style="border-top:1px solid var(--border-subtle);padding-top:16px;margin-bottom:20px;">
            <span style="font-size:0.75rem;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.05em;display:block;margin-bottom:10px;">Key Deliverables</span>
            <ul style="list-style:none;font-size:0.82rem;color:var(--text-main);display:flex;flex-direction:column;gap:8px;">
              <li style="display:flex;align-items:flex-start;gap:8px;"><span style="color:var(--primary);">✓</span> Tailored UI/UX design (No template bloat)</li>
              <li style="display:flex;align-items:flex-start;gap:8px;"><span style="color:var(--primary);">✓</span> Sub-second page load times with Next.js</li>
              <li style="display:flex;align-items:flex-start;gap:8px;"><span style="color:var(--primary);">✓</span> Local & Global SEO structured data</li>
              <li style="display:flex;align-items:flex-start;gap:8px;"><span style="color:var(--primary);">✓</span> Contact forms with Telegram bot routing</li>
            </ul>
          </div>
        </div>
        <div style="border-top:1px solid var(--border-subtle);padding-top:16px;display:flex;justify-content:space-between;align-items:center;">
          <div>
            <span style="font-size:0.7rem;color:var(--text-muted);display:block;">Starting at</span>
            <span style="font-weight:700;font-size:1rem;color:var(--text-main);">$490 / 28k ETB</span>
          </div>
          <a href="mwd_quote_redesign.html" class="btn btn-primary" style="padding:8px 14px;font-size:0.8rem;">Select</a>
        </div>
      </article>

      <!-- Service 2 -->
      <article class="card" style="display:flex;flex-direction:column;justify-content:space-between;">
        <div>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
            <div style="width:44px;height:44px;border-radius:12px;background:rgba(224,32,32,0.1);display:flex;align-items:center;justify-content:center;color:var(--primary);">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
            </div>
            <span style="font-size:0.75rem;padding:3px 8px;border-radius:6px;background:var(--card-alt);color:var(--text-muted);font-weight:600;">7 – 14 days</span>
          </div>
          <span style="color:var(--primary);font-size:0.72rem;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;">Revenue Engine</span>
          <h2 style="font-size:1.4rem;font-weight:700;margin:6px 0 12px;color:var(--text-main);">E-Commerce Stores</h2>
          <p style="font-size:0.88rem;color:var(--text-muted);margin-bottom:20px;line-height:1.6;">
            Frictionless storefronts with fast slide-out cart, Telebirr & Stripe checkout, and automated inventory sync.
          </p>
          <div style="border-top:1px solid var(--border-subtle);padding-top:16px;margin-bottom:20px;">
            <span style="font-size:0.75rem;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.05em;display:block;margin-bottom:10px;">Key Deliverables</span>
            <ul style="list-style:none;font-size:0.82rem;color:var(--text-main);display:flex;flex-direction:column;gap:8px;">
              <li style="display:flex;align-items:flex-start;gap:8px;"><span style="color:var(--primary);">✓</span> Fast multi-step cart & checkout</li>
              <li style="display:flex;align-items:flex-start;gap:8px;"><span style="color:var(--primary);">✓</span> Payment gateway: Telebirr, CBE & Stripe</li>
              <li style="display:flex;align-items:flex-start;gap:8px;"><span style="color:var(--primary);">✓</span> Inventory tracking with low-stock alerts</li>
              <li style="display:flex;align-items:flex-start;gap:8px;"><span style="color:var(--primary);">✓</span> Order confirmation via email & SMS</li>
            </ul>
          </div>
        </div>
        <div style="border-top:1px solid var(--border-subtle);padding-top:16px;display:flex;justify-content:space-between;align-items:center;">
          <div>
            <span style="font-size:0.7rem;color:var(--text-muted);display:block;">Starting at</span>
            <span style="font-weight:700;font-size:1rem;color:var(--text-main);">$890 / 52k ETB</span>
          </div>
          <a href="mwd_quote_redesign.html" class="btn btn-primary" style="padding:8px 14px;font-size:0.8rem;">Select</a>
        </div>
      </article>

      <!-- Service 3 -->
      <article class="card" style="display:flex;flex-direction:column;justify-content:space-between;">
        <div>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
            <div style="width:44px;height:44px;border-radius:12px;background:rgba(224,32,32,0.1);display:flex;align-items:center;justify-content:center;color:var(--primary);">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>
            </div>
            <span style="font-size:0.75rem;padding:3px 8px;border-radius:6px;background:var(--card-alt);color:var(--text-muted);font-weight:600;">2 – 4 days</span>
          </div>
          <span style="color:var(--primary);font-size:0.72rem;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;">Hospitality Tech</span>
          <h2 style="font-size:1.4rem;font-weight:700;margin:6px 0 12px;color:var(--text-main);">Digital QR Menus</h2>
          <p style="font-size:0.88rem;color:var(--text-muted);margin-bottom:20px;line-height:1.6;">
            Instant dining menus for restaurants, lounges, and cafes. Opens in under 1 second without downloading any app.
          </p>
          <div style="border-top:1px solid var(--border-subtle);padding-top:16px;margin-bottom:20px;">
            <span style="font-size:0.75rem;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.05em;display:block;margin-bottom:10px;">Key Deliverables</span>
            <ul style="list-style:none;font-size:0.82rem;color:var(--text-main);display:flex;flex-direction:column;gap:8px;">
              <li style="display:flex;align-items:flex-start;gap:8px;"><span style="color:var(--primary);">✓</span> Fast scan-to-browse in < 1 second</li>
              <li style="display:flex;align-items:flex-start;gap:8px;"><span style="color:var(--primary);">✓</span> Owner portal for instant price changes</li>
              <li style="display:flex;align-items:flex-start;gap:8px;"><span style="color:var(--primary);">✓</span> Bilingual switching (English & Amharic)</li>
              <li style="display:flex;align-items:flex-start;gap:8px;"><span style="color:var(--primary);">✓</span> High-res vector printable table stands</li>
            </ul>
          </div>
        </div>
        <div style="border-top:1px solid var(--border-subtle);padding-top:16px;display:flex;justify-content:space-between;align-items:center;">
          <div>
            <span style="font-size:0.7rem;color:var(--text-muted);display:block;">Starting at</span>
            <span style="font-weight:700;font-size:1rem;color:var(--text-main);">$350 / 20k ETB</span>
          </div>
          <a href="mwd_quote_redesign.html" class="btn btn-primary" style="padding:8px 14px;font-size:0.8rem;">Select</a>
        </div>
      </article>
    </div>

    <!-- Process -->
    <div style="margin-bottom:60px;">
      <h3 style="font-family:var(--font-display);font-size:1.8rem;font-weight:800;margin-bottom:24px;text-align:center;">Our 4-Phase Delivery Framework</h3>
      <div class="grid-cards">
        <div class="card" style="padding:24px;">
          <span style="font-size:1.8rem;font-weight:800;color:var(--primary);opacity:0.3;display:block;margin-bottom:8px;">01</span>
          <h4 style="font-size:1.1rem;font-weight:700;margin-bottom:8px;">Strategic Discovery</h4>
          <p style="font-size:0.84rem;color:var(--text-muted);line-height:1.6;">We audit your brand, analyze local competitors, and define exact commercial metrics.</p>
        </div>
        <div class="card" style="padding:24px;">
          <span style="font-size:1.8rem;font-weight:800;color:var(--primary);opacity:0.3;display:block;margin-bottom:8px;">02</span>
          <h4 style="font-size:1.1rem;font-weight:700;margin-bottom:8px;">Interactive UI/UX</h4>
          <p style="font-size:0.84rem;color:var(--text-muted);line-height:1.6;">Drafting wireframes and design system tokens tailored specifically to your visual identity.</p>
        </div>
        <div class="card" style="padding:24px;">
          <span style="font-size:1.8rem;font-weight:800;color:var(--primary);opacity:0.3;display:block;margin-bottom:8px;">03</span>
          <h4 style="font-size:1.1rem;font-weight:700;margin-bottom:8px;">Next.js & Neon DB</h4>
          <p style="font-size:0.84rem;color:var(--text-muted);line-height:1.6;">Clean code implementation with Lakebase Neon Postgres, edge caching, and automated CI/CD.</p>
        </div>
        <div class="card" style="padding:24px;">
          <span style="font-size:1.8rem;font-weight:800;color:var(--primary);opacity:0.3;display:block;margin-bottom:8px;">04</span>
          <h4 style="font-size:1.1rem;font-weight:700;margin-bottom:8px;">QA & Handover</h4>
          <p style="font-size:0.84rem;color:var(--text-muted);line-height:1.6;">Lighthouse 95+ audits, mobile testing, full code handover, and a 30-day warranty.</p>
        </div>
      </div>
    </div>
  </main>

  {generate_footer()}
  {SHARED_JS_3D}
</body>
</html>"""

def build_pricing_page():
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <title>Pricing Packages — MWD | Transparent Scope & Fixed Rates</title>
  <script>
    (function(){{var s=localStorage.getItem('mwd-theme');var p=window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.setAttribute('data-theme',s||(p?'dark':'light'));}})();
  </script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;700;800&family=Instrument+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>{SHARED_CSS}</style>
</head>
<body>
  <canvas id="bg-canvas" aria-hidden="true"></canvas>
  {generate_header("pricing")}

  <main class="container" style="padding-top:40px;">
    <div class="section-head">
      <div class="badge">Transparent Investment</div>
      <h1>Clear scope. Fair pricing. No guesswork.</h1>
      <p>Fixed prices with full source code ownership, zero monthly agency markups, and Lakebase Neon Postgres database integration.</p>
    </div>

    <div class="grid-cards" style="margin-bottom:60px;">
      <!-- Tier 1 -->
      <div class="card" style="display:flex;flex-direction:column;justify-content:space-between;">
        <div>
          <span style="font-size:0.75rem;font-weight:700;color:var(--primary);text-transform:uppercase;">Business Launch</span>
          <h2 style="font-size:1.6rem;font-weight:800;margin:6px 0;">Corporate Platform</h2>
          <p style="font-size:0.85rem;color:var(--text-muted);margin-bottom:16px;">For founders and service firms establishing authority.</p>
          <div style="margin-bottom:20px;padding-bottom:16px;border-bottom:1px solid var(--border-subtle);">
            <div style="font-size:2.2rem;font-weight:800;color:var(--text-main);">$490 <span style="font-size:0.9rem;font-weight:500;color:var(--text-muted);">or 28,000 ETB</span></div>
            <span style="font-size:0.75rem;color:var(--text-muted);">One-time payment &bull; 5-7 days delivery</span>
          </div>
          <ul style="list-style:none;font-size:0.84rem;display:flex;flex-direction:column;gap:10px;margin-bottom:24px;">
            <li style="display:flex;align-items:flex-start;gap:8px;"><span style="color:var(--primary);">✓</span> Up to 5 custom-designed pages</li>
            <li style="display:flex;align-items:flex-start;gap:8px;"><span style="color:var(--primary);">✓</span> Next.js 15 & Tailwind 4 architecture</li>
            <li style="display:flex;align-items:flex-start;gap:8px;"><span style="color:var(--primary);">✓</span> Neon PostgreSQL database integration</li>
            <li style="display:flex;align-items:flex-start;gap:8px;"><span style="color:var(--primary);">✓</span> Local & Global SEO structured data</li>
            <li style="display:flex;align-items:flex-start;gap:8px;"><span style="color:var(--primary);">✓</span> Telegram bot instant form alerts</li>
            <li style="display:flex;align-items:flex-start;gap:8px;"><span style="color:var(--primary);">✓</span> 30-day post-launch warranty</li>
          </ul>
        </div>
        <a href="mwd_quote_redesign.html?plan=launch" class="btn btn-outline" style="width:100%;">Select Launch Build</a>
      </div>

      <!-- Tier 2 (Highlighted) -->
      <div class="card" style="display:flex;flex-direction:column;justify-content:space-between;border:2px solid var(--primary);position:relative;">
        <span style="position:absolute;top:-12px;left:50%;transform:translateX(-50%);background:var(--primary);color:#fff;font-size:0.7rem;font-weight:800;padding:3px 12px;border-radius:20px;text-transform:uppercase;">Most Popular</span>
        <div>
          <span style="font-size:0.75rem;font-weight:700;color:var(--primary);text-transform:uppercase;">Growth Store</span>
          <h2 style="font-size:1.6rem;font-weight:800;margin:6px 0;">E-Commerce Engine</h2>
          <p style="font-size:0.85rem;color:var(--text-muted);margin-bottom:16px;">For brands selling online with payment and stock control.</p>
          <div style="margin-bottom:20px;padding-bottom:16px;border-bottom:1px solid var(--border-subtle);">
            <div style="font-size:2.2rem;font-weight:800;color:var(--text-main);">$890 <span style="font-size:0.9rem;font-weight:500;color:var(--text-muted);">or 52,000 ETB</span></div>
            <span style="font-size:0.75rem;color:var(--text-muted);">One-time payment &bull; 7-14 days delivery</span>
          </div>
          <ul style="list-style:none;font-size:0.84rem;display:flex;flex-direction:column;gap:10px;margin-bottom:24px;">
            <li style="display:flex;align-items:flex-start;gap:8px;"><span style="color:var(--primary);">✓</span> Complete catalog with variant filtering</li>
            <li style="display:flex;align-items:flex-start;gap:8px;"><span style="color:var(--primary);">✓</span> Telebirr, CBE, Stripe checkout</li>
            <li style="display:flex;align-items:flex-start;gap:8px;"><span style="color:var(--primary);">✓</span> Slide-out fast cart drawer</li>
            <li style="display:flex;align-items:flex-start;gap:8px;"><span style="color:var(--primary);">✓</span> Automated inventory tracking & alerts</li>
            <li style="display:flex;align-items:flex-start;gap:8px;"><span style="color:var(--primary);">✓</span> Order confirmation via SMS/Email</li>
            <li style="display:flex;align-items:flex-start;gap:8px;"><span style="color:var(--primary);">✓</span> 45-day technical warranty</li>
          </ul>
        </div>
        <a href="mwd_quote_redesign.html?plan=ecommerce" class="btn btn-primary" style="width:100%;">Select Growth Store</a>
      </div>

      <!-- Tier 3 -->
      <div class="card" style="display:flex;flex-direction:column;justify-content:space-between;">
        <div>
          <span style="font-size:0.75rem;font-weight:700;color:var(--primary);text-transform:uppercase;">Digital Menu</span>
          <h2 style="font-size:1.6rem;font-weight:800;margin:6px 0;">Hospitality System</h2>
          <p style="font-size:0.85rem;color:var(--text-muted);margin-bottom:16px;">For cafes, restaurants & lounges wanting instant QR dining.</p>
          <div style="margin-bottom:20px;padding-bottom:16px;border-bottom:1px solid var(--border-subtle);">
            <div style="font-size:2.2rem;font-weight:800;color:var(--text-main);">$350 <span style="font-size:0.9rem;font-weight:500;color:var(--text-muted);">or 20,000 ETB</span></div>
            <span style="font-size:0.75rem;color:var(--text-muted);">One-time payment &bull; 2-4 days delivery</span>
          </div>
          <ul style="list-style:none;font-size:0.84rem;display:flex;flex-direction:column;gap:10px;margin-bottom:24px;">
            <li style="display:flex;align-items:flex-start;gap:8px;"><span style="color:var(--primary);">✓</span> Scan-to-browse in < 1 second</li>
            <li style="display:flex;align-items:flex-start;gap:8px;"><span style="color:var(--primary);">✓</span> Zero app download required for diners</li>
            <li style="display:flex;align-items:flex-start;gap:8px;"><span style="color:var(--primary);">✓</span> Owner portal for price & dish updates</li>
            <li style="display:flex;align-items:flex-start;gap:8px;"><span style="color:var(--primary);">✓</span> Bilingual interface (English & Amharic)</li>
            <li style="display:flex;align-items:flex-start;gap:8px;"><span style="color:var(--primary);">✓</span> Print-ready vector QR table tent files</li>
            <li style="display:flex;align-items:flex-start;gap:8px;"><span style="color:var(--primary);">✓</span> 1 full year hosting included</li>
          </ul>
        </div>
        <a href="mwd_quote_redesign.html?plan=menu" class="btn btn-outline" style="width:100%;">Select Digital Menu</a>
      </div>
    </div>
  </main>

  {generate_footer()}
  {SHARED_JS_3D}
</body>
</html>"""

def build_portfolio_page():
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <title>Portfolio — MWD | Case Studies & Selected Work</title>
  <script>
    (function(){{var s=localStorage.getItem('mwd-theme');var p=window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.setAttribute('data-theme',s||(p?'dark':'light'));}})();
  </script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;700;800&family=Instrument+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>{SHARED_CSS}</style>
</head>
<body>
  <canvas id="bg-canvas" aria-hidden="true"></canvas>
  {generate_header("portfolio")}

  <main class="container" style="padding-top:40px;">
    <div class="section-head">
      <div class="badge">Proof of Work</div>
      <h1>Selected digital case studies.</h1>
      <p>Explore recent projects engineered for speed, conversion, and effortless customer interaction across Addis Ababa and abroad.</p>
    </div>

    <div class="grid-cards" style="margin-bottom:60px;">
      <!-- Project 1 -->
      <article class="card" style="padding:0;overflow:hidden;display:flex;flex-direction:column;justify-content:space-between;">
        <div>
          <div style="aspect-ratio:16/9;background:linear-gradient(135deg, rgba(224,32,32,0.15), rgba(0,0,0,0.8));display:flex;align-items:center;justify-content:center;position:relative;">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="1.5"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path></svg>
            <span style="position:absolute;bottom:12px;right:12px;background:rgba(0,0,0,0.7);backdrop-filter:blur(4px);color:#fff;font-size:0.7rem;font-weight:700;padding:3px 8px;border-radius:4px;">&lt; 800ms load</span>
          </div>
          <div style="padding:24px;">
            <span style="font-size:0.72rem;font-weight:700;color:var(--primary);text-transform:uppercase;">Digital Menu</span>
            <h2 style="font-size:1.3rem;font-weight:700;margin:6px 0 10px;">Kuriftu Dining Experience</h2>
            <p style="font-size:0.85rem;color:var(--text-muted);line-height:1.6;">
              Instant QR menu architecture supporting 200+ dishes, bilingual English & Amharic switching, and offline caching.
            </p>
          </div>
        </div>
        <div style="padding:16px 24px;border-top:1px solid var(--border-subtle);display:flex;justify-content:space-between;align-items:center;">
          <span style="font-size:0.75rem;color:var(--text-muted);">Hospitality Tech</span>
          <a href="mwd_quote_redesign.html" style="font-size:0.8rem;font-weight:700;color:var(--primary);">Build Similar &rarr;</a>
        </div>
      </article>

      <!-- Project 2 -->
      <article class="card" style="padding:0;overflow:hidden;display:flex;flex-direction:column;justify-content:space-between;">
        <div>
          <div style="aspect-ratio:16/9;background:linear-gradient(135deg, rgba(0,0,0,0.8), rgba(224,32,32,0.25));display:flex;align-items:center;justify-content:center;position:relative;">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="1.5"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path></svg>
            <span style="position:absolute;bottom:12px;right:12px;background:rgba(0,0,0,0.7);backdrop-filter:blur(4px);color:#fff;font-size:0.7rem;font-weight:700;padding:3px 8px;border-radius:4px;">+42% Mobile Orders</span>
          </div>
          <div style="padding:24px;">
            <span style="font-size:0.72rem;font-weight:700;color:var(--primary);text-transform:uppercase;">E-Commerce</span>
            <h2 style="font-size:1.3rem;font-weight:700;margin:6px 0 10px;">Addis Artisan Roastery</h2>
            <p style="font-size:0.85rem;color:var(--text-muted);line-height:1.6;">
              Direct-to-consumer specialty coffee storefront with recurring subscription checkout and Telebirr integration.
            </p>
          </div>
        </div>
        <div style="padding:16px 24px;border-top:1px solid var(--border-subtle);display:flex;justify-content:space-between;align-items:center;">
          <span style="font-size:0.75rem;color:var(--text-muted);">Retail & Coffee</span>
          <a href="mwd_quote_redesign.html" style="font-size:0.8rem;font-weight:700;color:var(--primary);">Build Similar &rarr;</a>
        </div>
      </article>

      <!-- Project 3 -->
      <article class="card" style="padding:0;overflow:hidden;display:flex;flex-direction:column;justify-content:space-between;">
        <div>
          <div style="aspect-ratio:16/9;background:linear-gradient(135deg, rgba(224,32,32,0.2), rgba(20,20,25,0.9));display:flex;align-items:center;justify-content:center;position:relative;">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="1.5"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line></svg>
            <span style="position:absolute;bottom:12px;right:12px;background:rgba(0,0,0,0.7);backdrop-filter:blur(4px);color:#fff;font-size:0.7rem;font-weight:700;padding:3px 8px;border-radius:4px;">99/100 Lighthouse</span>
          </div>
          <div style="padding:24px;">
            <span style="font-size:0.72rem;font-weight:700;color:var(--primary);text-transform:uppercase;">Website Development</span>
            <h2 style="font-size:1.3rem;font-weight:700;margin:6px 0 10px;">Apex Ethiopian Logistics</h2>
            <p style="font-size:0.85rem;color:var(--text-muted);line-height:1.6;">
              Bilingual corporate portal with live cargo shipment tracking, interactive quote calculator, and sub-second speed.
            </p>
          </div>
        </div>
        <div style="padding:16px 24px;border-top:1px solid var(--border-subtle);display:flex;justify-content:space-between;align-items:center;">
          <span style="font-size:0.75rem;color:var(--text-muted);">Corporate & Logistics</span>
          <a href="mwd_quote_redesign.html" style="font-size:0.8rem;font-weight:700;color:var(--primary);">Build Similar &rarr;</a>
        </div>
      </article>
    </div>
  </main>

  {generate_footer()}
  {SHARED_JS_3D}
</body>
</html>"""

def build_contact_page():
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <title>Contact MWD — Direct Engineering Consultation</title>
  <script>
    (function(){{var s=localStorage.getItem('mwd-theme');var p=window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.setAttribute('data-theme',s||(p?'dark':'light'));}})();
  </script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;700;800&family=Instrument+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>{SHARED_CSS}
    input, textarea, select {{
      width: 100%;
      background: var(--card-alt);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-sm);
      padding: 12px 14px;
      color: var(--text-main);
      font-size: 0.9rem;
      font-family: inherit;
      outline: none;
      transition: border-color 0.2s;
    }}
    input:focus, textarea:focus, select:focus {{
      border-color: var(--primary);
    }}
    label {{
      display: block;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 6px;
      color: var(--text-muted);
    }}
  </style>
</head>
<body>
  <canvas id="bg-canvas" aria-hidden="true"></canvas>
  {generate_header("contact")}

  <main class="container" style="padding-top:40px;">
    <div class="section-head">
      <div class="badge">Direct Communication</div>
      <h1>Let’s talk about your next release.</h1>
      <p>Have an ambitious idea or need to modernize an existing setup? We respond directly in under 2 hours during active business hours.</p>
    </div>

    <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(min(100%, 320px), 1fr));gap:32px;margin-bottom:60px;">
      <!-- Direct Contact Channels -->
      <div>
        <div class="card" style="margin-bottom:24px;">
          <h3 style="font-size:1.1rem;font-weight:700;margin-bottom:16px;">Direct Messaging</h3>
          <div style="display:flex;flex-direction:column;gap:12px;">
            <a href="https://wa.me/251911000000" target="_blank" style="display:flex;align-items:center;justify-content:space-between;background:#25D366;color:#fff;padding:12px 16px;border-radius:8px;font-weight:600;font-size:0.9rem;">
              <span>💬 Chat on WhatsApp</span>
              <span style="font-size:0.75rem;opacity:0.9;">Fastest</span>
            </a>
            <a href="https://t.me/musab" target="_blank" style="display:flex;align-items:center;justify-content:space-between;background:#229ED9;color:#fff;padding:12px 16px;border-radius:8px;font-weight:600;font-size:0.9rem;">
              <span>✈️ Telegram @musab</span>
              <span style="font-size:0.75rem;opacity:0.9;">Direct</span>
            </a>
            <a href="tel:+251911000000" style="display:flex;align-items:center;justify-content:space-between;border:1px solid var(--border-subtle);padding:12px 16px;border-radius:8px;font-weight:600;font-size:0.9rem;">
              <span>📞 Phone Call</span>
              <span style="font-size:0.8rem;color:var(--text-muted);font-family:monospace;">+251 911 000 000</span>
            </a>
          </div>
        </div>

        <div class="card">
          <h3 style="font-size:1.1rem;font-weight:700;margin-bottom:14px;">Studio Details</h3>
          <p style="font-size:0.85rem;color:var(--text-muted);margin-bottom:8px;"><strong>Location:</strong> Addis Ababa, Ethiopia</p>
          <p style="font-size:0.85rem;color:var(--text-muted);margin-bottom:8px;"><strong>Email:</strong> contact@musab.dev</p>
          <p style="font-size:0.85rem;color:var(--text-muted);"><strong>Response Time:</strong> Within 2 hours during Addis business hours</p>
        </div>
      </div>

      <!-- Contact Form -->
      <div class="card">
        <h3 style="font-size:1.2rem;font-weight:700;margin-bottom:20px;">Send a Direct Message</h3>
        <form onsubmit="event.preventDefault(); alert('Inquiry recorded! Musab Web Development will reach out to you within 2 hours.');" style="display:flex;flex-direction:column;gap:16px;">
          <div>
            <label for="name">Your Name *</label>
            <input type="text" id="name" required placeholder="e.g. Dawit Tadesse">
          </div>
          <div>
            <label for="email">Email Address *</label>
            <input type="email" id="email" required placeholder="dawit@company.et">
          </div>
          <div>
            <label for="msg">Project Details *</label>
            <textarea id="msg" rows="5" required placeholder="Tell us about what you want to build..."></textarea>
          </div>
          <button type="submit" class="btn btn-primary" style="width:100%;padding:14px;">
            Send Inquiry &rarr;
          </button>
        </form>
      </div>
    </div>
  </main>

  {generate_footer()}
  {SHARED_JS_3D}
</body>
</html>"""

def build_faq_page():
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <title>FAQ — MWD | Frequently Asked Questions</title>
  <script>
    (function(){{var s=localStorage.getItem('mwd-theme');var p=window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.setAttribute('data-theme',s||(p?'dark':'light'));}})();
  </script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;700;800&family=Instrument+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>{SHARED_CSS}</style>
</head>
<body>
  <canvas id="bg-canvas" aria-hidden="true"></canvas>
  {generate_header("faq")}

  <main class="container" style="padding-top:40px;">
    <div class="section-head">
      <div class="badge">Clear Answers</div>
      <h1>Frequently asked questions.</h1>
      <p>Direct answers regarding timelines, Ethiopian payment methods, code ownership, and technical infrastructure.</p>
    </div>

    <div style="display:flex;flex-direction:column;gap:20px;max-width:840px;margin-bottom:60px;">
      <div class="card">
        <h3 style="font-size:1.15rem;font-weight:700;margin-bottom:10px;">How fast will my project be delivered?</h3>
        <p style="font-size:0.9rem;color:var(--text-muted);line-height:1.6;">
          Digital QR menus are ready in 2 to 4 business days. Standard business websites take 5 to 7 days, and full e-commerce stores take 7 to 14 days. We work in dedicated sprints so milestones are hit without delays.
        </p>
      </div>

      <div class="card">
        <h3 style="font-size:1.15rem;font-weight:700;margin-bottom:10px;">What technologies do you use, and why not WordPress?</h3>
        <p style="font-size:0.9rem;color:var(--text-muted);line-height:1.6;">
          We build with Next.js 15, Tailwind CSS, TypeScript, and Lakebase Neon PostgreSQL. Unlike WordPress, our sites load in under 1 second, never suffer plugin security breaches, and don't slow down on mobile connections.
        </p>
      </div>

      <div class="card">
        <h3 style="font-size:1.15rem;font-weight:700;margin-bottom:10px;">Who owns the code and domain after launch?</h3>
        <p style="font-size:0.9rem;color:var(--text-muted);line-height:1.6;">
          You own 100% of the intellectual property, full GitHub source code repository, database credentials, and domain. We never lock you into recurring agency traps.
        </p>
      </div>

      <div class="card">
        <h3 style="font-size:1.15rem;font-weight:700;margin-bottom:10px;">What payment methods do you accept in Ethiopia?</h3>
        <p style="font-size:0.9rem;color:var(--text-muted);line-height:1.6;">
          We accept local Ethiopian transfers via Commercial Bank of Ethiopia (CBE) and Telebirr, as well as international cards, Stripe, and wire transfers. A 50% deposit begins the build, and the remainder is due upon final sign-off.
        </p>
      </div>

      <div class="card">
        <h3 style="font-size:1.15rem;font-weight:700;margin-bottom:10px;">Are there monthly fees?</h3>
        <p style="font-size:0.9rem;color:var(--text-muted);line-height:1.6;">
          None from our side. You pay once for our engineering work. Hosting on modern platforms like Vercel & Neon Postgres is typically $0 to $10/month depending on traffic volume. All projects include a 30-day warranty.
        </p>
      </div>
    </div>
  </main>

  {generate_footer()}
  {SHARED_JS_3D}
</body>
</html>"""

def build_quote_page():
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <title>Request a Quote — MWD | Project Proposal Builder</title>
  <script>
    (function(){{var s=localStorage.getItem('mwd-theme');var p=window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.setAttribute('data-theme',s||(p?'dark':'light'));}})();
  </script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;700;800&family=Instrument+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>{SHARED_CSS}
    input, textarea, select {{
      width: 100%;
      background: var(--card-alt);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-sm);
      padding: 12px 14px;
      color: var(--text-main);
      font-size: 0.9rem;
      font-family: inherit;
      outline: none;
      transition: border-color 0.2s;
    }}
    input:focus, textarea:focus, select:focus {{
      border-color: var(--primary);
    }}
    label {{
      display: block;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 6px;
      color: var(--text-muted);
    }}
  </style>
</head>
<body>
  <canvas id="bg-canvas" aria-hidden="true"></canvas>
  {generate_header("services")}

  <main class="container" style="padding-top:40px;max-width:760px;">
    <div class="section-head" style="text-align:center;margin-left:auto;margin-right:auto;">
      <div class="badge">Direct Proposal Builder</div>
      <h1>Tell us about your project.</h1>
      <p>Fill out the specifications below. We will calculate an itemized proposal and timeline within 2 business hours.</p>
    </div>

    <div class="card" style="margin-bottom:60px;">
      <form onsubmit="event.preventDefault(); alert('Project brief received! Musab Web Development will review your details and send your quotation within 2 hours.');" style="display:flex;flex-direction:column;gap:18px;">
        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(min(100%, 280px), 1fr));gap:16px;">
          <div>
            <label for="q-name">Your Full Name *</label>
            <input type="text" id="q-name" required placeholder="e.g. Samuel Bekele">
          </div>
          <div>
            <label for="q-email">Business Email *</label>
            <input type="email" id="q-email" required placeholder="samuel@company.com">
          </div>
        </div>

        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(min(100%, 280px), 1fr));gap:16px;">
          <div>
            <label for="q-phone">Phone / WhatsApp (optional)</label>
            <input type="tel" id="q-phone" placeholder="+251 9...">
          </div>
          <div>
            <label for="q-service">Primary Service *</label>
            <select id="q-service">
              <option value="web">Website Development (Company / Portfolio)</option>
              <option value="ecom">E-Commerce Storefront (Stripe / Telebirr)</option>
              <option value="menu">Digital Restaurant QR Menu System</option>
              <option value="custom">Custom Web Application / API</option>
            </select>
          </div>
        </div>

        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(min(100%, 280px), 1fr));gap:16px;">
          <div>
            <label for="q-timeline">Desired Timeline</label>
            <select id="q-timeline">
              <option>Immediate / Sprint (< 1-2 weeks)</option>
              <option>Within 1 month</option>
              <option>Flexible / Planning</option>
            </select>
          </div>
          <div>
            <label for="q-budget">Estimated Budget</label>
            <select id="q-budget">
              <option>$490 – $1,000 / 28k – 55k ETB</option>
              <option>$1,000 – $2,500 / 55k – 140k ETB</option>
              <option>$2,500+ / 140,000+ ETB</option>
            </select>
          </div>
        </div>

        <div>
          <label for="q-details">Project Description & Requirements *</label>
          <textarea id="q-details" rows="6" required placeholder="What are your goals? Any websites you like, specific pages or features needed?"></textarea>
        </div>

        <button type="submit" class="btn btn-primary" style="padding:16px;font-size:1rem;margin-top:8px;">
          Submit Brief & Request Quotation &rarr;
        </button>

        <p style="text-align:center;font-size:0.75rem;color:var(--text-muted);margin-top:4px;">
          🔒 100% Confidentiality & Source Code Ownership Guaranteed.
        </p>
      </form>
    </div>
  </main>

  {generate_footer()}
  {SHARED_JS_3D}
</body>
</html>"""

def update_home_and_about_with_3d():
    # Update home.html
    home_path = os.path.join(REDESIGN_DIR, "home.html")
    if os.path.exists(home_path):
        with open(home_path, "r", encoding="utf-8") as f:
            content = f.read()
        if "id=\"bg-canvas\"" not in content:
            content = content.replace("<body>", "<body>\n  <canvas id=\"bg-canvas\" aria-hidden=\"true\"></canvas>")
        if "init3DBackground" not in content:
            content = content.replace("</body>", f"{SHARED_JS_3D}\n</body>")
        with open(home_path, "w", encoding="utf-8") as f:
            f.write(content)
        shutil.copy(home_path, os.path.join(DOWNLOAD_DIR, "mwd_home_redesign.html"))

    # Update about.html
    about_path = os.path.join(REDESIGN_DIR, "about.html")
    if os.path.exists(about_path):
        with open(about_path, "r", encoding="utf-8") as f:
            content = f.read()
        if "id=\"bg-canvas\"" not in content:
            content = content.replace("<body>", "<body>\n  <canvas id=\"bg-canvas\" aria-hidden=\"true\"></canvas>")
        if "init3DBackground" not in content:
            content = content.replace("</body>", f"{SHARED_JS_3D}\n</body>")
        with open(about_path, "w", encoding="utf-8") as f:
            f.write(content)
        shutil.copy(about_path, os.path.join(DOWNLOAD_DIR, "mwd_about_redesign.html"))

def main():
    pages = {
        "services.html": (build_services_page(), "mwd_services_redesign.html"),
        "pricing.html": (build_pricing_page(), "mwd_pricing_redesign.html"),
        "portfolio.html": (build_portfolio_page(), "mwd_portfolio_redesign.html"),
        "contact.html": (build_contact_page(), "mwd_contact_redesign.html"),
        "faq.html": (build_faq_page(), "mwd_faq_redesign.html"),
        "quote.html": (build_quote_page(), "mwd_quote_redesign.html"),
    }

    for filename, (html_content, dl_filename) in pages.items():
        repo_path = os.path.join(REDESIGN_DIR, filename)
        dl_path = os.path.join(DOWNLOAD_DIR, dl_filename)
        
        with open(repo_path, "w", encoding="utf-8") as f:
            f.write(html_content)
        with open(dl_path, "w", encoding="utf-8") as f:
            f.write(html_content)
        print(f"Generated {filename} -> {dl_filename}")

    update_home_and_about_with_3d()
    print("Updated home.html and about.html with 3D canvas!")

if __name__ == "__main__":
    main()

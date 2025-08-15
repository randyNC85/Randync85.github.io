<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Defend Dad — Our AI</title>
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <style>
    :root{
      --bg:#0e1117; --panel:#161b22; --line:#30363d;
      --text:#e6edf3; --muted:#9aa4b2; --gold:#d4af37; --good:#2ea043; --warn:#f0ad4e;
    }
    body{margin:0;font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;background:var(--bg);color:var(--text)}
    .wrap{max-width:980px;margin:0 auto;padding:28px 18px}
    /* Nav */
    .topnav{background:var(--panel);border-bottom:1px solid var(--line);padding:10px 0;position:sticky;top:0;z-index:999}
    .nav-container{max-width:980px;margin:0 auto;display:flex;gap:20px;justify-content:center;flex-wrap:wrap}
    .topnav a{color:var(--gold);text-decoration:none;font-weight:600;padding:6px 10px}
    .topnav a:hover{color:var(--text)}
    /* Panels */
    .panel{background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:20px;margin:18px 0}
    h1,h2{color:var(--gold);margin-top:0}
    p{line-height:1.6}
    .muted{color:var(--muted)}
    .center{text-align:center}
    .hero{max-width:720px;width:100%;height:auto;border:1px solid var(--line);border-radius:12px}
    .grid{display:grid;gap:14px}
    @media(min-width:860px){.grid-2{grid-template-columns:2fr 1fr}}
    .card{background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:16px}
    .btn{display:inline-block;background:var(--gold);color:#000;font-weight:700;padding:10px 14px;border-radius:10px;text-decoration:none}
    .btn:hover{filter:brightness(1.05)}
    /* Progress bars */
    .bar{position:relative;background:#0b0e13;border:1px solid var(--line);border-radius:12px;overflow:hidden;height:20px}
    .bar>span{display:block;height:100%;background:var(--gold);width:0%}
    .ticks{position:relative;height:22px;margin-top:6px}
    .tick{position:absolute;top:0;height:22px;border-left:1px dashed var(--line);font-size:.75rem;color:var(--muted);padding-left:6px;transform:translateX(-1px)}
    .stat{display:flex;justify-content:space-between;margin:6px 0 2px 0;font-weight:700}
    .pill{display:inline-block;padding:3px 8px;border-radius:999px;font-size:.8rem;border:1px solid var(--line);color:var(--muted)}
    .ok{color:#c7f5c4;border-color:#2ea043}
    .warn{color:#ffe2b3;border-color:#f0ad4e}
    .danger{color:#ffc0c0;border-color:#ff6b6b}
  </style>
</head>
<body>

  <!-- Nav -->
  <nav class="topnav">
    <div class="nav-container">
      <a href="/">Home</a>
      <a href="/resources/">Resources</a>
      <a href="/shop/">Shop</a>
      <a href="/our-ai/">Our AI</a>
      <a href="/community/">Community</a>
      <a href="/donations/">Donations</a>
    </div>
  </nav>

  <div class="wrap">

    <div class="panel">
      <h1>Our AI — Built to Help Dads Fight Fair</h1>
      <p>
        We’re building a publicly available, free AI assistant to help dads navigate
        custody, parenting time, and child support: clear guidance, organized case info,
        and motion/checklist help — all in plain language.
      </p>
      <p class="muted">
        This isn’t quick or cheap. We’ll fund it through donations, merchandise, and grants —
        and we’ll share progress here.
      </p>
      <div class="center" style="margin-top:14px">
        <img class="hero" src="/assets/Dad-ai-fix.PNG" alt="Defend Dad AI concept" />
      </div>
    </div>

    <!-- GOALS + MICRO-GRANTS -->
    <div class="grid grid-2">
      <!-- Left: AI build goal -->
      <div class="card">
        <h2>AI Build Goal — $350,000</h2>
        <div class="stat"><span>Total Raised</span><span id="ai-raised">$0</span></div>
        <div class="bar" aria-label="AI progress"><span id="ai-bar" style="width:0%"></span></div>
        <div class="ticks">
          <div class="tick" style="left:0%">$0</div>
          <div class="tick" style="left:0.86%">$3k</div>
          <div class="tick" style="left:12.3%">$43k</div>
          <div class="tick" style="left:100%">$350k</div>
        </div>
        <p class="muted" style="margin-top:8px">
          Milestones: <strong>$3k</strong> (bootstrap), <strong>$43k</strong> (training & infra start),
          <strong>$350k</strong> (fully integrated AI with case-specific tools).
        </p>
        <p class="muted"><span id="ai-percent" class="pill">0%</span></p>
      </div>

      <!-- Right: Micro-grants meter -->
      <div class="card">
        <h2>Micro-Grants (Filing Fees)</h2>
        <div class="stat"><span>Available Now</span><span id="grants-available">$0</span></div>
        <div class="bar" aria-label="Microgrants progress"><span id="grants-bar" style="width:0%"></span></div>
        <p class="muted" style="margin-top:8px">
          Grants open when reserve ≥ <strong id="min-grants-pill" class="pill"></strong>.
          These help dads pay court filing fees to get in the fight.
        </p>
        <p class="muted">Status: <span id="grants-status" class="pill danger">Closed</span></p>
      </div>
    </div>

    <!-- Support -->
    <div class="panel center">
      <p style="margin-bottom:12px"><strong>Want to support the build?</strong></p>
      <a class="btn" href="/shop/">Buy Merch</a>
      <span style="display:inline-block;width:10px"></span>
      <a class="btn" href="/donations/">Donate</a>
      <p class="muted" style="margin-top:10px">Or join the conversation in our <a href="/community/">Community</a>.</p>
    </div>

  </div>

  <script>
    // === CONFIGURE THESE ===
    const CSV_URL = "PASTE_YOUR_PUBLISHED_CSV_LINK_HERE"; // .../pub?gid=###&single=true&output=csv
    const GOAL_TOTAL = 350000;          // $350k
    const MIN_GRANTS_TO_OPEN = 500;     // set your threshold
    // Optional: column names from your Summary sheet (case-insensitive contains match is used)
    const COL_AI = "CurrentRaised_AI";
    const COL_GRANTS = "Available_Microgrants";

    // --- helpers ---
    const fmt = n => "$" + (Number(n)||0).toLocaleString();
    function parseCSV(text){
      const lines = text.trim().split(/\r?\n/);
      const headers = lines[0].split(",").map(h=>h.trim());
      const rows = lines.slice(1).map(l => {
        // naive CSV split (good for simple numeric sheet output)
        return l.split(",").map(s=>s.trim());
      });
      return { headers, rows };
    }
    function findByHeader(obj, headers, rows){
      // Return first row’s values by fuzzy header match
      const lower = headers.map(h=>h.toLowerCase());
      const idxAI = lower.findIndex(h => h.includes(COL_AI.toLowerCase()));
      const idxG  = lower.findIndex(h => h.includes(COL_GRANTS.toLowerCase()));
      const first = rows[0] || [];
      return {
        ai: idxAI >= 0 ? Number(first[idxAI]||0) : 0,
        grants: idxG >= 0 ? Number(first[idxG]||0) : 0
      };
    }

    async function load(){
      let ai = 0, grants = 0;
      try{
        const res = await fetch(CSV_URL, {cache:"no-store"});
        const text = await res.text();
        const {headers, rows} = parseCSV(text);
        const vals = findByHeader(null, headers, rows);
        ai = vals.ai || 0;
        grants = vals.grants || 0;
      }catch(e){
        // fall back to zero silently
      }

      // AI progress
      const pct = Math.max(0, Math.min(100, (ai/GOAL_TOTAL)*100));
      document.getElementById("ai-raised").textContent = fmt(ai);
      document.getElementById("ai-bar").style.width = pct.toFixed(2) + "%";
      document.getElementById("ai-percent").textContent = pct.toFixed(1) + "%";

      // Grants meter (visualize vs. MIN_GRANTS_TO_OPEN; cap bar at 100%)
      const gPct = Math.max(0, Math.min(100, (grants / Math.max(MIN_GRANTS_TO_OPEN,1))*100));
      document.getElementById("grants-available").textContent = fmt(grants);
      document.getElementById("grants-bar").style.width = gPct.toFixed(2) + "%";
      document.getElementById("min-grants-pill").textContent = fmt(MIN_GRANTS_TO_OPEN);

      const statusEl = document.getElementById("grants-status");
      if (grants >= MIN_GRANTS_TO_OPEN) {
        statusEl.textContent = "Open";
        statusEl.className = "pill ok";
      } else if (grants > 0) {
        statusEl.textContent = "Opening Soon";
        statusEl.className = "pill warn";
      } else {
        statusEl.textContent = "Closed";
        statusEl.className = "pill danger";
      }
    }
    load();
  </script>
</body>
</html>

/* ===== Defend Dad — AI Goal & Microgrants Widget (Google Sheets-powered) =====
   Configure per-page with:
   <script>
     window.DEFEND_DAD_CONFIG = {
       csvUrl: "https://docs.google.com/spreadsheets/d/e/.../pub?gid=461905329&single=true&output=csv",
       goalTotal: 350000,
       minGrantsToOpen: 500
     };
   </script>
*/

(function () {
  const fmt = n => "$" + (Number(n)||0).toLocaleString();

  // If the page only has <div id="ai-goal-widget"></div>, inject a compact widget markup.
  function ensureWidgetDom(){
    const host = document.getElementById("ai-goal-widget");
    const alreadyHasTargets =
      document.getElementById("ai-raised") &&
      document.getElementById("ai-bar") &&
      document.getElementById("grants-available") &&
      document.getElementById("grants-bar");

    if (!host || alreadyHasTargets) return; // full page mode or no host

    host.innerHTML = `
      <div style="background:#161b22;border:1px solid #30363d;border-radius:14px;padding:16px;margin:18px 0">
        <div style="display:flex;justify-content:space-between;align-items:baseline;gap:10px;flex-wrap:wrap">
          <h2 style="color:#d4af37;margin:0;font-size:1.05rem">AI Development Goal</h2>
          <div style="color:#9aa4b2">Raised: <strong id="ai-raised">$0</strong> of <strong id="ai-goal-total">$350,000</strong></div>
        </div>

        <div style="background:#0b0e13;border:1px solid #30363d;border-radius:12px;overflow:hidden;height:18px;margin-top:8px">
          <span id="ai-bar" style="display:block;height:100%;background:#d4af37;width:0%"></span>
        </div>
        <div style="margin-top:6px;color:#9aa4b2;font-size:.85rem">
          <span id="ai-percent" style="border:1px solid #30363d;border-radius:999px;padding:2px 8px;display:inline-block">0%</span>
          &nbsp;Milestones: $3k • $43k • $350k
        </div>

        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:8px;margin-top:12px">
          <div style="border:1px solid #30363d;border-radius:10px;padding:10px">
            <div style="color:#9aa4b2">Microgrants Available</div>
            <div id="grants-available" style="font-weight:800">$0</div>
            <div style="color:#9aa4b2;font-size:.9rem;margin-top:4px">Filing fee support reserve.</div>
            <div style="background:#0b0e13;border:1px solid #30363d;border-radius:12px;overflow:hidden;height:14px;margin-top:6px">
              <span id="grants-bar" style="display:block;height:100%;background:#d4af37;width:0%"></span>
            </div>
            <div style="color:#9aa4b2;font-size:.85rem;margin-top:6px">
              Opens at <strong id="min-grants-pill">$0</strong> — Status:
              <span id="grants-status" style="border:1px solid #30363d;border-radius:999px;padding:2px 8px">Closed</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function parseCSV(text){
    const lines = text.trim().split(/\r?\n/);
    const headers = lines[0].split(",").map(h=>h.trim());
    const rows = lines.slice(1).map(l => l.split(",").map(s=>s.trim()));
    return { headers, rows };
  }

  function pickValues(headers, rows){
    // fuzzy match on header names (case-insensitive, "contains")
    const lower = headers.map(h=>h.toLowerCase());
    const iAI = lower.findIndex(h => h.includes("currentraised_ai"));
    const iMG = lower.findIndex(h => h.includes("available_microgrants"));
    const r = rows[0] || [];
    return {
      ai: iAI >= 0 ? Number(r[iAI]||0) : 0,
      micro: iMG >= 0 ? Number(r[iMG]||0) : 0
    };
  }

  async function load(){
    const cfg = Object.assign({
      csvUrl: "",
      goalTotal: 350000,
      minGrantsToOpen: 500
    }, (window.DEFEND_DAD_CONFIG||{}));

    // Build widget markup if page only provided the placeholder
    ensureWidgetDom();

    // Show static goal total if that element exists (widget mode)
    const goalEl = document.getElementById("ai-goal-total");
    if (goalEl) goalEl.textContent = fmt(cfg.goalTotal);

    let ai = 0, micro = 0;
    try{
      const res = await fetch(cfg.csvUrl, {cache:"no-store"});
      const text = await res.text();
      const {headers, rows} = parseCSV(text);
      const vals = pickValues(headers, rows);
      ai = vals.ai || 0;
      micro = vals.micro || 0;
    }catch(e){
      console.warn("AI goal: could not fetch CSV. Using zeros.", e);
    }

    // Update AI bar (works for both full-page and widget)
    const pct = Math.max(0, Math.min(100, (ai/cfg.goalTotal)*100));
    const aiRaised = document.getElementById("ai-raised");
    const aiBar = document.getElementById("ai-bar");
    const aiPct = document.getElementById("ai-percent");
    if (aiRaised) aiRaised.textContent = fmt(ai);
    if (aiBar) aiBar.style.width = pct.toFixed(2) + "%";
    if (aiPct) aiPct.textContent = pct.toFixed(1) + "%";

    // Update Microgrants meter vs. threshold
    const gAvail = document.getElementById("grants-available");
    const gBar = document.getElementById("grants-bar");
    const gMin = document.getElementById("min-grants-pill");
    const gStatus = document.getElementById("grants-status");

    const gPct = Math.max(0, Math.min(100, (micro/Math.max(cfg.minGrantsToOpen,1))*100));
    if (gAvail) gAvail.textContent = fmt(micro);
    if (gBar) gBar.style.width = gPct.toFixed(2) + "%";
    if (gMin) gMin.textContent = fmt(cfg.minGrantsToOpen);

    if (gStatus){
      if (micro >= cfg.minGrantsToOpen){ gStatus.textContent="Open"; gStatus.style.color="#c7f5c4"; }
      else if (micro > 0){ gStatus.textContent="Opening Soon"; gStatus.style.color="#ffe2b3"; }
      else { gStatus.textContent="Closed"; gStatus.style.color="#ffc0c0"; }
    }
  }

  load();
})();

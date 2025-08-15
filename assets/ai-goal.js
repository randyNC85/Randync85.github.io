/* ===== Defend Dad — AI Goal & Microgrants Widget (Google Sheets-powered) =====
   Set window.DEFEND_DAD_CONFIG in the page with:
     { csvUrl: ".../pub?gid=###&single=true&output=csv", goalTotal: 350000, minGrantsToOpen: 500 }
*/

(function () {
  const fmt = n => "$" + (Number(n)||0).toLocaleString();

  function parseCSV(text){
    const lines = text.trim().split(/\r?\n/);
    const headers = lines[0].split(",").map(h=>h.trim());
    const rows = lines.slice(1).map(l => l.split(",").map(s=>s.trim()));
    return { headers, rows };
  }

  function pickValues(headers, rows){
    // fuzzy match on header names
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

    // Update AI bar
    const pct = Math.max(0, Math.min(100, (ai/cfg.goalTotal)*100));
    const aiRaised = document.getElementById("ai-raised");
    const aiBar = document.getElementById("ai-bar");
    const aiPct = document.getElementById("ai-percent");
    if (aiRaised) aiRaised.textContent = fmt(ai);
    if (aiBar) aiBar.style.width = pct.toFixed(2) + "%";
    if (aiPct) aiPct.textContent = pct.toFixed(1) + "%";

    // Update Microgrants meter (vs. threshold)
    const gAvail = document.getElementById("grants-available");
    const gBar = document.getElementById("grants-bar");
    const gMin = document.getElementById("min-grants-pill");
    const gStatus = document.getElementById("grants-status");

    const gPct = Math.max(0, Math.min(100, (micro/Math.max(cfg.minGrantsToOpen,1))*100));
    if (gAvail) gAvail.textContent = fmt(micro);
    if (gBar) gBar.style.width = gPct.toFixed(2) + "%";
    if (gMin) gMin.textContent = fmt(cfg.minGrantsToOpen);

    if (gStatus){
      if (micro >= cfg.minGrantsToOpen){ gStatus.textContent="Open"; gStatus.className="pill ok"; }
      else if (micro > 0){ gStatus.textContent="Opening Soon"; gStatus.className="pill warn"; }
      else { gStatus.textContent="Closed"; gStatus.className="pill danger"; }
    }
  }

  load();
})();

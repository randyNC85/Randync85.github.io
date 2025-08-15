/* ===== Defend Dad — AI Goal Widget =====
   Update this ONE number to refresh the site-wide bar. */
const DD_GOAL_DATA = {
  currentRaised: 0,        // <- update me (e.g., 1250, 30000)
  totalGoal: 350000,
  milestones: [3000, 43000, 300000]
};

(function renderAIGoal(){
  const host = document.getElementById('ai-goal-widget');
  if (!host) return;

  const dollars = n => `$${n.toLocaleString()}`;
  const pct = Math.max(0, Math.min(100, (DD_GOAL_DATA.currentRaised / DD_GOAL_DATA.totalGoal) * 100));

  host.innerHTML = `
    <div style="background:#161b22;border:1px solid #30363d;border-radius:14px;padding:16px;margin:18px 0">
      <div style="display:flex;justify-content:space-between;align-items:baseline;gap:10px;flex-wrap:wrap">
        <h2 style="color:#d4af37;margin:0;font-size:1.05rem">AI Development Goal</h2>
        <div style="color:#9aa4b2">Current: <strong>${dollars(DD_GOAL_DATA.currentRaised)}</strong> of <strong>${dollars(DD_GOAL_DATA.totalGoal)}</strong></div>
      </div>
      <div style="background:#30363d;border-radius:20px;overflow:hidden;margin:10px 0 8px;position:relative;height:18px">
        <div style="background:#d4af37;width:${pct}%;height:18px"></div>
        <div id="ai-ticks-mini" style="position:absolute;top:0;left:0;right:0;height:18px;pointer-events:none"></div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:8px">
        <div style="border:1px solid #30363d;border-radius:10px;padding:10px">
          <div style="color:#d4af37;font-weight:800">${dollars(3000)}</div>
          <div><strong>Stage 1:</strong> Basic Dad AI prototype.</div>
        </div>
        <div style="border:1px solid #30363d;border-radius:10px;padding:10px">
          <div style="color:#d4af37;font-weight:800">${dollars(43000)}</div>
          <div><strong>Stage 2:</strong> Model training + multi-state forms.</div>
        </div>
        <div style="border:1px solid #30363d;border-radius:10px;padding:10px">
          <div style="color:#d4af37;font-weight:800">${dollars(300000)}</div>
          <div><strong>Stage 3:</strong> Fully integrated AI with secure, case-specific tools & memory.</div>
        </div>
      </div>
    </div>
  `;

  // draw milestone ticks
  const ticksEl = document.getElementById('ai-ticks-mini');
  const addTick = (val) => {
    const left = (val / DD_GOAL_DATA.totalGoal) * 100;
    const t = document.createElement('div');
    Object.assign(t.style, {position:'absolute', left:`calc(${left}% - 1px)`, top:'0', width:'2px', height:'18px', background:'rgba(255,255,255,.25)'});
    ticksEl.appendChild(t);
  };
  DD_GOAL_DATA.milestones.forEach(addTick);
  addTick(DD_GOAL_DATA.totalGoal);
})();

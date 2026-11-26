// dashboard.js — the home view: month at a glance, donut chart, top categories, next bills, goals.
import { CATEGORIES, categoryById, escapeHtml, fmtDate, healthScore, money, money0, spendingPace, totalGoalsSaved, totalGoalsTarget, totalIncome, totalPlanned, totalSpent, spentByCategory } from './store.js';
import { drawDonut } from './charts.js';

export function renderDashboard(data) {
  const income = totalIncome(data);
  const planned = totalPlanned(data);
  const spent = totalSpent(data);
  const left = income - spent;
  const spentByCat = spentByCategory(data);
  const goalsSaved = totalGoalsSaved(data);
  const goalsTarget = totalGoalsTarget(data);
  const goalPct = goalsTarget > 0 ? Math.round((goalsSaved / goalsTarget) * 100) : 0;

  const slices = CATEGORIES
    .map((c) => ({ label: c.label, value: spentByCat[c.id] || 0, color: c.color }))
    .filter((s) => s.value > 0)
    .sort((a, b) => b.value - a.value);

  const topCats = CATEGORIES
    .map((c) => ({ ...c, planned: data.plan[c.id] || 0, spent: spentByCat[c.id] || 0 }))
    .sort((a, b) => b.spent - a.spent)
    .slice(0, 5);

  const unpaid = data.bills.filter((b) => !b.paid).sort((a, b) => a.due - b.due).slice(0, 3);
  const recent = [...data.transactions].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
  const health = healthScore(data);
  const pace = spendingPace(data);

  return `
  <section class="hero">
    <span class="pill pill-amber">${escapeHtml(data.month)} · ${escapeHtml(data.household)}</span>
    <h1>Your month, in one glance.</h1>
    <p>HomeLedger keeps the household budget in one place: what comes in, what goes out, what is saved, and what is still due — with real figures you can change.</p>
    <div class="hero-stats">
      <div><div class="stat-label">Income</div><div class="stat">${money0(income)}</div></div>
      <div><div class="stat-label">Spent so far</div><div class="stat">${money0(spent)}</div></div>
      <div><div class="stat-label">Left to spend</div><div class="stat ${left < 0 ? 'stat-bad' : ''}">${money0(left)}</div></div>
      <div><div class="stat-label">Planned</div><div class="stat">${money0(planned)}</div></div>
    </div>
    <div class="hero-cta">
      <a class="btn btn-amber" href="#/planner">Plan this month</a>
      <a class="btn btn-ghost" href="#/tracker">Add an expense</a>
    </div>
  </section>

  <div class="grid-2 stack" style="margin-top:18px">
    <div class="card">
      <h2>Budget health score — ${health.total} / 100 · ${health.grade}</h2>
      <p class="muted small">A live score from your own figures: savings rate, spending against the plan, the emergency fund, and bills paid.</p>
      ${health.parts.map((p) => `
        <div class="bar-row"><span>${escapeHtml(p.label)}</span><b>${p.pts} / ${p.max}</b></div>
        <div class="bar"><span style="width:${Math.round((p.pts / p.max) * 100)}%"></span></div>
        <p class="small muted" style="margin:2px 0 12px">${escapeHtml(p.note)}</p>`).join('')}
      <p class="small"><b>Spending pace:</b> day ${pace.dayOfMonth} of ${pace.daysInMonth} (${pace.elapsedPct}% of the month gone) and ${pace.usedPct}% of the plan spent — <b>${pace.status}</b>.</p>
    </div>
    <div class="card">
      <h2>Your data, yours to keep</h2>
      <p>Everything on this site lives in this browser's local storage. Take a copy with you, or bring one back.</p>
      <div style="display:flex;gap:10px;flex-wrap:wrap">
        <button class="btn" type="button" id="exportData">Download my data (JSON)</button>
        <button class="btn btn-ghost" type="button" id="importData" style="color:var(--green-700);border-color:var(--green-700)">Import data…</button>
        <input type="file" id="importFile" accept="application/json,.json" hidden>
      </div>
      <p class="small muted" style="margin-top:12px">Export writes a plain JSON file of your income, plan, expenses, goals and bills. Import replaces what is stored here, so export first if you want a safety copy.</p>
      <p class="small"><a href="#/tips">Ten habits that keep a budget working →</a></p>
    </div>
  </div>

  <div class="grid-2 stack" style="margin-top:18px">
    <div class="card">
      <h2>Where the money went</h2>
      <p class="muted small">Spending by category, ${escapeHtml(data.month)}.</p>
      <canvas id="donutChart" class="chart" role="img" aria-label="Donut chart of spending by category"></canvas>
      <ul class="legend">
        ${slices.map((s) => `<li><span><span class="cat-dot" style="background:${s.color}"></span>${escapeHtml(s.label)}</span><span class="amt">${money(s.value)}</span></li>`).join('')}
      </ul>
    </div>
    <div class="stack">
      <div class="card">
        <h2>Biggest categories</h2>
        ${topCats.map((c) => {
          const pct = c.planned > 0 ? Math.min(100, Math.round((c.spent / c.planned) * 100)) : 0;
          const over = c.spent > c.planned;
          return `<div class="bar-row"><span><span class="cat-dot" style="background:${c.color}"></span>${escapeHtml(c.label)}</span><b>${money0(c.spent)} of ${money0(c.planned)}</b></div>
          <div class="bar ${over ? 'bar-red' : ''}"><span style="width:${pct}%"></span></div>
          <p class="small ${over ? 'stat-bad' : 'muted'}" style="margin:2px 0 12px">${over ? 'Over budget by ' + money0(c.spent - c.planned) : pct + '% of the plan used'}</p>`;
        }).join('')}
        <a class="btn" href="#/planner">Adjust the plan</a>
      </div>
      <div class="card">
        <h2>Savings goals — ${goalPct}% funded</h2>
        <p class="muted">${money0(goalsSaved)} saved toward ${money0(goalsTarget)} across ${data.goals.length} goals.</p>
        <div class="bar"><span style="width:${goalPct}%"></span></div>
        <p style="margin-top:12px"><a class="btn" href="#/goals">See the goals</a></p>
      </div>
    </div>
  </div>

  <div class="grid-2 stack" style="margin-top:18px">
    <div class="card">
      <h2>Recent spending</h2>
      <table>
        <thead><tr><th>Date</th><th>What</th><th class="num">Amount</th></tr></thead>
        <tbody>
          ${recent.map((tx) => `<tr><td>${fmtDate(tx.date)}</td><td>${escapeHtml(tx.desc)} <span class="chip">${escapeHtml(categoryById(tx.cat).label)}</span></td><td class="num">${money(tx.amount)}</td></tr>`).join('')}
        </tbody>
      </table>
      <p style="margin-top:12px"><a class="btn" href="#/tracker">Open the expense tracker</a></p>
    </div>
    <div class="card">
      <h2>Bills still to pay</h2>
      ${unpaid.length === 0 ? '<p class="muted">Every bill this month is paid. Nice work.</p>' : unpaid.map((b) => `
        <div class="bar-row"><span>${escapeHtml(b.name)} <span class="muted">· due day ${b.due}</span></span><b>${money0(b.amount)}</b></div>`).join('')}
      <p style="margin-top:12px"><a class="btn" href="#/bills">See all bills</a></p>
      <h3 style="margin-top:18px">The 50 / 30 / 20 rule</h3>
      <p class="muted small">A healthy household budget aims for about 50% of take-home pay on needs, 30% on wants and 20% on savings and extra debt payments. This household currently plans ${money0(data.plan.savings)} a month for savings — ${Math.round(((data.plan.savings || 0) / income) * 100)}% of income. <a href="#/tips">Read the guide</a>.</p>
    </div>
  </div>`;
}

export function mountDashboard(data, save, rerender, toast) {
  const canvas = document.getElementById('donutChart');
  if (canvas) {
    const spentByCat = spentByCategory(data);
    const slices = CATEGORIES
      .map((c) => ({ label: c.label, value: spentByCat[c.id] || 0, color: c.color }))
      .filter((s) => s.value > 0)
      .sort((a, b) => b.value - a.value);
    drawDonut(canvas, slices);
  }

  const exportBtn = document.getElementById('exportData');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'homeledger-data.json';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast('Data downloaded as homeledger-data.json');
    });
  }
  const importBtn = document.getElementById('importData');
  const importFile = document.getElementById('importFile');
  if (importBtn && importFile) {
    importBtn.addEventListener('click', () => importFile.click());
    importFile.addEventListener('change', () => {
      const file = importFile.files && importFile.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const parsed = JSON.parse(String(reader.result));
          if (!parsed || !parsed.plan || !Array.isArray(parsed.transactions) || !Array.isArray(parsed.goals) || !Array.isArray(parsed.bills)) {
            throw new Error('bad shape');
          }
          const fresh = parsed;
          // Replace the live object in place so the router keeps its reference.
          for (const key of Object.keys(data)) delete data[key];
          Object.assign(data, fresh);
          save();
          rerender();
          toast('Data imported from ' + file.name);
        } catch {
          toast('That file is not HomeLedger data');
        }
        importFile.value = '';
      };
      reader.readAsText(file);
    });
  }
}

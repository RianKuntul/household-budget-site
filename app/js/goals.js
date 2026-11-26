// goals.js — savings goals: create a goal, add money, see the finish line and the date it lands.
import { escapeHtml, money, money0, newId } from './store.js';

export function renderGoals(data) {
  const totalSaved = data.goals.reduce((s, g) => s + Number(g.saved || 0), 0);
  const totalTarget = data.goals.reduce((s, g) => s + Number(g.target || 0), 0);
  const monthlySave = data.plan.savings || 0;

  return `
  <h1>Savings goals</h1>
  <p class="lede">Give every saved dollar a name and a finish line. ${money0(totalSaved)} of ${money0(totalTarget)} is already set aside across ${data.goals.length} goals.</p>

  <div class="grid-2">
    ${data.goals.map((g) => {
      const pct = g.target > 0 ? Math.min(100, Math.round((g.saved / g.target) * 100)) : 0;
      const remaining = Math.max(0, g.target - g.saved);
      const months = monthlySave > 0 && remaining > 0 ? Math.ceil(remaining / monthlySave) : null;
      return `<div class="card goal-card">
        <div class="goal-head"><h2>${escapeHtml(g.name)}</h2><span class="pill ${pct >= 100 ? '' : 'pill-amber'}">${pct}% funded</span></div>
        <p class="muted small">${escapeHtml(g.note || '')}</p>
        <div class="goal-big">${money0(g.saved)} <span class="muted" style="font-size:1rem">of ${money0(g.target)}</span></div>
        <div class="bar ${pct >= 100 ? '' : 'bar-amber'}"><span style="width:${pct}%"></span></div>
        <p class="small">${remaining === 0
          ? '<b class="stat-good">Goal reached — well done.</b>'
          : `${money0(remaining)} to go${months ? ` · about ${months} month${months === 1 ? '' : 's'} at the current ${money0(monthlySave)}/month savings rate` : ''}.`}</p>
        <div class="goal-actions">
          <input type="number" id="add-${g.id}" min="1" step="1" placeholder="Amount $" aria-label="Amount to add to ${escapeHtml(g.name)}">
          <button class="btn" type="button" data-add="${g.id}">Add money</button>
          <button class="btn btn-ghost" type="button" data-remove="${g.id}" style="color:var(--red);border-color:var(--red)">Remove</button>
        </div>
      </div>`;
    }).join('')}
  </div>

  <div class="grid-2" style="margin-top:18px">
    <div class="card">
      <h2>Start a new goal</h2>
      <form id="addGoal">
        <div class="field"><label for="goalName">Goal name</label>
          <input type="text" id="goalName" required maxlength="60" placeholder="e.g. New sofa"></div>
        <div class="form-row">
          <div class="field"><label for="goalTarget">Target amount ($)</label>
            <input type="number" id="goalTarget" required min="1" step="1" placeholder="1000"></div>
          <div class="field"><label for="goalSaved">Already saved ($)</label>
            <input type="number" id="goalSaved" min="0" step="1" value="0"></div>
        </div>
        <div class="field"><label for="goalNote">Why this goal? (optional)</label>
          <input type="text" id="goalNote" maxlength="120" placeholder="e.g. The old one sags in the middle"></div>
        <button class="btn" type="submit">Create goal</button>
      </form>
    </div>
    <div class="card">
      <h2>How fast will you get there?</h2>
      <p>Your plan sets aside <b>${money0(monthlySave)} a month</b> for savings. Split across goals, that is what moves each finish line closer.</p>
      <table>
        <thead><tr><th>Goal</th><th class="num">Left</th><th class="num">Months at ${money0(monthlySave)}/mo</th></tr></thead>
        <tbody>
          ${data.goals.map((g) => {
            const remaining = Math.max(0, g.target - g.saved);
            const months = monthlySave > 0 && remaining > 0 ? Math.ceil(remaining / monthlySave) : 0;
            return `<tr><td>${escapeHtml(g.name)}</td><td class="num">${money0(remaining)}</td><td class="num">${remaining === 0 ? 'Done' : months}</td></tr>`;
          }).join('')}
        </tbody>
      </table>
      <p class="small muted">Tip: pay yourself first — move the savings amount to its own account on payday, before the month's spending starts. <a href="#/tips">More in the guides</a>.</p>
    </div>
  </div>`;
}

export function mountGoals(data, save, rerender, toast) {
  document.getElementById('addGoal').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('goalName').value.trim();
    const target = Number(document.getElementById('goalTarget').value);
    const saved = Math.max(0, Number(document.getElementById('goalSaved').value) || 0);
    const note = document.getElementById('goalNote').value.trim();
    if (!name || !(target > 0)) return;
    data.goals.push({ id: newId('g'), name, target, saved, note });
    save();
    rerender();
    toast('Goal created: ' + name);
  });

  for (const btn of document.querySelectorAll('[data-add]')) {
    btn.addEventListener('click', () => {
      const goal = data.goals.find((g) => g.id === btn.dataset.add);
      const input = document.getElementById('add-' + goal.id);
      const amount = Number(input.value);
      if (!goal || !(amount > 0)) { toast('Enter an amount first'); return; }
      goal.saved = Math.round((Number(goal.saved) + amount) * 100) / 100;
      save();
      rerender();
      toast(money(amount) + ' added to ' + goal.name);
    });
  }

  for (const btn of document.querySelectorAll('[data-remove]')) {
    btn.addEventListener('click', () => {
      const goal = data.goals.find((g) => g.id === btn.dataset.remove);
      data.goals = data.goals.filter((g) => g.id !== btn.dataset.remove);
      save();
      rerender();
      toast('Goal removed' + (goal ? ': ' + goal.name : ''));
    });
  }
}

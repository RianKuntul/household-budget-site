// planner.js — the monthly budget planner: income, per-category amounts, live totals,
// a 50/30/20 comparison, and one-click suggested plans.
import { CATEGORIES, escapeHtml, money, money0, totalIncome, totalPlanned } from './store.js';

const NEEDS = ['housing', 'groceries', 'transport', 'utilities', 'health'];
const WANTS = ['dining', 'entertainment', 'clothing', 'other'];

export function renderPlanner(data) {
  const income = totalIncome(data);
  const planned = totalPlanned(data);
  const remaining = income - planned;
  const needs = NEEDS.reduce((s, id) => s + (data.plan[id] || 0), 0);
  const wants = WANTS.reduce((s, id) => s + (data.plan[id] || 0), 0);
  const saved = data.plan.savings || 0;
  const pct = (v) => (income > 0 ? Math.round((v / income) * 100) : 0);

  return `
  <h1>Budget planner</h1>
  <p class="lede">Set what each part of the household gets this month. The totals update as you type, and the 50 / 30 / 20 check shows how the plan stacks up.</p>

  <div class="grid-2-1">
    <div class="stack">
      <div class="card">
        <h2>Monthly income</h2>
        <div class="form-row">
          <div class="field"><label for="incSalary">Take-home pay</label>
            <input type="number" id="incSalary" min="0" step="1" value="${data.income.salary}"></div>
          <div class="field"><label for="incFreelance">Other income (freelance, refunds)</label>
            <input type="number" id="incFreelance" min="0" step="1" value="${data.income.freelance}"></div>
        </div>
        <p class="muted small">Total monthly income: <b id="incomeTotal">${money0(income)}</b></p>
      </div>

      <div class="card">
        <h2>Plan by category</h2>
        <p class="muted small">Drag a slider or type an amount. The plan is saved automatically.</p>
        ${CATEGORIES.map((c) => {
          const val = data.plan[c.id] || 0;
          return `<div class="slider-row">
            <label for="plan-${c.id}"><span class="cat-dot" style="background:${c.color}"></span>${escapeHtml(c.label)}</label>
            <input type="range" id="plan-${c.id}" data-cat="${c.id}" min="0" max="2000" step="5" value="${val}" aria-label="${escapeHtml(c.label)} budget">
            <span class="amount" id="amt-${c.id}">${money0(val)}</span>
          </div>`;
        }).join('')}
        <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:16px">
          <button class="btn" type="button" id="apply503020">Apply the 50 / 30 / 20 plan</button>
          <button class="btn btn-ghost" type="button" id="applyLastMonth" style="color:var(--green-700);border-color:var(--green-700)">Match last month's spending</button>
        </div>
      </div>
    </div>

    <div class="stack">
      <div class="card">
        <h2>Your plan at a glance</h2>
        <div class="bar-row"><span>Planned spending</span><b id="plannedTotal">${money0(planned)}</b></div>
        <div class="bar"><span style="width:${income > 0 ? Math.min(100, Math.round((planned / income) * 100)) : 0}%"></span></div>
        <p id="remainingLine" class="${remaining < 0 ? 'stat-bad' : 'stat-good'}" style="font-weight:700;margin-top:10px">
          ${remaining < 0 ? 'Over income by ' + money0(-remaining) + ' — trim a category.' : money0(remaining) + ' unassigned — give it a job or save it.'}
        </p>
        <table>
          <tbody>
            <tr><td>Needs (housing, food, transport, bills, health)</td><td class="num">${money0(needs)} · ${pct(needs)}%</td></tr>
            <tr><td>Wants (eating out, fun, clothes, extras)</td><td class="num">${money0(wants)} · ${pct(wants)}%</td></tr>
            <tr><td>Savings &amp; investing</td><td class="num">${money0(saved)} · ${pct(saved)}%</td></tr>
            <tr class="total"><td>Total planned</td><td class="num">${money0(planned)}</td></tr>
          </tbody>
        </table>
      </div>

      <div class="rule-box">
        <h3>The 50 / 30 / 20 rule</h3>
        <div class="rule-503020">
          <div><div class="pct">50%</div><div class="small">Needs</div><div class="small muted">${money0(income * 0.5)} of your income</div></div>
          <div><div class="pct">30%</div><div class="small">Wants</div><div class="small muted">${money0(income * 0.3)} of your income</div></div>
          <div><div class="pct">20%</div><div class="small">Savings</div><div class="small muted">${money0(income * 0.2)} of your income</div></div>
        </div>
        <p class="small" style="margin-top:12px">Your plan now: <b>${pct(needs)}% needs · ${pct(wants)}% wants · ${pct(saved)}% savings</b>. ${pct(saved) < 20 ? 'Savings are below the 20% target — the button above can rebalance the plan for you.' : 'Savings meet the 20% target. Well planned.'}</p>
      </div>

      <div class="card">
        <h2>How to use this planner</h2>
        <p class="small">Start with the costs that do not move — rent, bills, food — then set savings as a fixed line, not whatever is left over. A plan that adds up to more than the income is a plan that will fail quietly; trim wants first.</p>
        <p class="small"><a href="#/tracker">See what you actually spent →</a></p>
      </div>
    </div>
  </div>`;
}

export function mountPlanner(data, save, rerender, toast) {
  const incomeTotal = document.getElementById('incomeTotal');
  const plannedTotal = document.getElementById('plannedTotal');
  const remainingLine = document.getElementById('remainingLine');

  function refreshTotals() {
    const income = totalIncome(data);
    const planned = totalPlanned(data);
    const remaining = income - planned;
    incomeTotal.textContent = money0(income);
    plannedTotal.textContent = money0(planned);
    remainingLine.textContent = remaining < 0
      ? 'Over income by ' + money0(-remaining) + ' — trim a category.'
      : money0(remaining) + ' unassigned — give it a job or save it.';
    remainingLine.className = remaining < 0 ? 'stat-bad' : 'stat-good';
    remainingLine.style.fontWeight = '700';
    remainingLine.style.marginTop = '10px';
  }

  for (const input of document.querySelectorAll('#incSalary, #incFreelance')) {
    input.addEventListener('input', () => {
      data.income.salary = Math.max(0, Number(document.getElementById('incSalary').value) || 0);
      data.income.freelance = Math.max(0, Number(document.getElementById('incFreelance').value) || 0);
      save();
      refreshTotals();
    });
  }

  for (const slider of document.querySelectorAll('input[type="range"][data-cat]')) {
    slider.addEventListener('input', () => {
      const cat = slider.dataset.cat;
      data.plan[cat] = Number(slider.value);
      document.getElementById('amt-' + cat).textContent = money0(data.plan[cat]);
      save();
      refreshTotals();
    });
  }

  document.getElementById('apply503020').addEventListener('click', () => {
    const income = totalIncome(data);
    const needs = { housing: 0.30, groceries: 0.11, transport: 0.05, utilities: 0.03, health: 0.01 };
    const wants = { dining: 0.10, entertainment: 0.07, clothing: 0.05, other: 0.08 };
    for (const [id, frac] of Object.entries(needs)) data.plan[id] = Math.round((income * frac) / 5) * 5;
    for (const [id, frac] of Object.entries(wants)) data.plan[id] = Math.round((income * frac) / 5) * 5;
    data.plan.savings = Math.round((income * 0.20) / 5) * 5;
    save();
    rerender();
    toast('50 / 30 / 20 plan applied');
  });

  document.getElementById('applyLastMonth').addEventListener('click', () => {
    const spent = {};
    for (const tx of data.transactions) spent[tx.cat] = (spent[tx.cat] || 0) + Number(tx.amount || 0);
    for (const cat of CATEGORIES) {
      data.plan[cat.id] = Math.round((spent[cat.id] || 0) / 5) * 5;
    }
    save();
    rerender();
    toast('Plan set to match last month’s spending');
  });
}

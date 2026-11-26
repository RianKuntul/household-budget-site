// tracker.js — the expense tracker: add, filter, delete, and see spending vs plan per category.
import { CATEGORIES, categoryById, escapeHtml, fmtDate, money, money0, newId, spentByCategory, totalSpent } from './store.js';
import { drawBars } from './charts.js';

export function renderTracker(data, filter) {
  const spentByCat = spentByCategory(data);
  const total = totalSpent(data);
  let list = [...data.transactions].sort((a, b) => b.date.localeCompare(a.date));
  if (filter.cat && filter.cat !== 'all') list = list.filter((tx) => tx.cat === filter.cat);
  if (filter.q) {
    const q = filter.q.toLowerCase();
    list = list.filter((tx) => tx.desc.toLowerCase().includes(q));
  }

  const barRows = CATEGORIES.map((c) => ({
    label: c.label, value: spentByCat[c.id] || 0, max: Math.max(data.plan[c.id] || 0, spentByCat[c.id] || 0, 1), color: c.color,
  }));

  return `
  <h1>Expense tracker</h1>
  <p class="lede">Every dollar out, written down. Add an expense in seconds, filter the list, and see each category against its plan.</p>

  <div class="grid-2-1">
    <div class="stack">
      <div class="card">
        <h2>Add an expense</h2>
        <form id="addTx">
          <div class="form-row">
            <div class="field"><label for="txDesc">What was it?</label>
              <input type="text" id="txDesc" required maxlength="80" placeholder="e.g. Weekly shop — GreenMart"></div>
            <div class="field"><label for="txAmount">Amount ($)</label>
              <input type="number" id="txAmount" required min="0.01" step="0.01" placeholder="0.00"></div>
          </div>
          <div class="form-row">
            <div class="field"><label for="txCat">Category</label>
              <select id="txCat">${CATEGORIES.map((c) => `<option value="${c.id}">${escapeHtml(c.label)}</option>`).join('')}</select></div>
            <div class="field"><label for="txDate">Date</label>
              <input type="date" id="txDate" value="2026-11-26" required></div>
          </div>
          <button class="btn" type="submit">Add expense</button>
          <span class="muted small" style="margin-left:10px">${data.transactions.length} expenses recorded · total ${money(total)}</span>
        </form>
      </div>

      <div class="card">
        <h2>All expenses</h2>
        <div class="toolbar">
          <div class="field"><label for="filterCat">Category</label>
            <select id="filterCat">
              <option value="all">All categories</option>
              ${CATEGORIES.map((c) => `<option value="${c.id}"${filter.cat === c.id ? ' selected' : ''}>${escapeHtml(c.label)}</option>`).join('')}
            </select></div>
          <div class="field"><label for="filterQ">Search</label>
            <input type="text" id="filterQ" placeholder="Search descriptions…" value="${escapeHtml(filter.q || '')}"></div>
        </div>
        <div style="margin-top:14px">
          ${list.length === 0 ? '<p class="muted">No expenses match that filter.</p>' : list.map((tx) => `
          <div class="tx-row">
            <span class="tx-date">${fmtDate(tx.date)}</span>
            <span>${escapeHtml(tx.desc)}</span>
            <span class="tx-cat"><span class="chip">${escapeHtml(categoryById(tx.cat).label)}</span></span>
            <span class="tx-amount">${money(tx.amount)}</span>
            <span class="tx-del"><button class="btn btn-danger btn-small" type="button" data-del="${tx.id}">Delete</button></span>
          </div>`).join('')}
        </div>
        <p class="small muted" style="margin-top:14px">Showing ${list.length} of ${data.transactions.length} expenses · total in view ${money(list.reduce((s, t) => s + Number(t.amount), 0))}</p>
      </div>
    </div>

    <div class="stack">
      <div class="card">
        <h2>Spending vs plan</h2>
        <p class="muted small">Bars show what you spent; the grey track is the plan (or the spend, when the plan is smaller).</p>
        <canvas id="barsChart" class="chart" role="img" aria-label="Bar chart of spending versus plan by category"></canvas>
        <table style="margin-top:12px">
          <thead><tr><th>Category</th><th class="num">Spent</th><th class="num">Plan</th><th class="num">Left</th></tr></thead>
          <tbody>
            ${CATEGORIES.map((c) => {
              const spent = spentByCat[c.id] || 0;
              const plan = data.plan[c.id] || 0;
              const left = plan - spent;
              return `<tr><td><span class="cat-dot" style="background:${c.color}"></span>${escapeHtml(c.label)}</td><td class="num">${money0(spent)}</td><td class="num">${money0(plan)}</td><td class="num ${left < 0 ? 'stat-bad' : ''}">${money0(left)}</td></tr>`;
            }).join('')}
            <tr class="total"><td>Total</td><td class="num">${money0(total)}</td><td class="num">${money0(CATEGORIES.reduce((s, c) => s + (data.plan[c.id] || 0), 0))}</td><td class="num"></td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>`;
}

export function mountTracker(data, save, rerender, toast, filter) {
  const canvas = document.getElementById('barsChart');
  if (canvas) {
    const spentByCat = spentByCategory(data);
    drawBars(canvas, CATEGORIES.map((c) => ({
      label: c.label, value: spentByCat[c.id] || 0,
      max: Math.max(data.plan[c.id] || 0, spentByCat[c.id] || 0, 1), color: c.color,
    })));
  }

  document.getElementById('addTx').addEventListener('submit', (e) => {
    e.preventDefault();
    const desc = document.getElementById('txDesc').value.trim();
    const amount = Number(document.getElementById('txAmount').value);
    const cat = document.getElementById('txCat').value;
    const date = document.getElementById('txDate').value;
    if (!desc || !(amount > 0) || !date) return;
    data.transactions.push({ id: newId('t'), date, desc, cat, amount: Math.round(amount * 100) / 100 });
    save();
    rerender();
    toast('Expense added: ' + money(amount));
  });

  document.getElementById('filterCat').addEventListener('change', (e) => {
    filter.cat = e.target.value;
    rerender();
  });
  document.getElementById('filterQ').addEventListener('input', (e) => {
    filter.q = e.target.value;
    const rows = document.querySelectorAll('.tx-row');
    const q = e.target.value.toLowerCase();
    rows.forEach((row) => {
      row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none';
    });
  });

  for (const btn of document.querySelectorAll('[data-del]')) {
    btn.addEventListener('click', () => {
      const id = btn.dataset.del;
      data.transactions = data.transactions.filter((tx) => tx.id !== id);
      save();
      rerender();
      toast('Expense deleted');
    });
  }
}

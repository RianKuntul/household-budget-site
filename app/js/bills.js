// bills.js — bills and subscriptions: what is due, what is paid, the monthly total,
// and a subscription audit that totals the small recurring charges.
import { categoryById, escapeHtml, money0, newId } from './store.js';

export function renderBills(data) {
  const sorted = [...data.bills].sort((a, b) => a.due - b.due);
  const monthlyTotal = data.bills.reduce((s, b) => s + Number(b.amount || 0), 0);
  const unpaid = data.bills.filter((b) => !b.paid);
  const unpaidTotal = unpaid.reduce((s, b) => s + Number(b.amount || 0), 0);
  const paidTotal = monthlyTotal - unpaidTotal;
  const subs = data.bills.filter((b) => b.freq === 'Monthly' && (b.cat === 'entertainment' || /stream|music|gym|app/i.test(b.name)));
  const subsTotal = subs.reduce((s, b) => s + Number(b.amount || 0), 0);

  return `
  <h1>Bills &amp; subscriptions</h1>
  <p class="lede">Every recurring charge in one list, with its due day. Mark a bill paid and it stays paid for the month — nothing slips past because it was only in someone's head.</p>

  <div class="grid-3">
    <div class="card"><div class="stat-label">Monthly total</div><div class="stat">${money0(monthlyTotal)}</div><p class="muted small">Across ${data.bills.length} recurring bills.</p></div>
    <div class="card"><div class="stat-label">Paid so far</div><div class="stat stat-good">${money0(paidTotal)}</div><p class="muted small">${data.bills.length - unpaid.length} of ${data.bills.length} bills paid.</p></div>
    <div class="card"><div class="stat-label">Still to pay</div><div class="stat ${unpaidTotal > 0 ? 'stat-amber' : 'stat-good'}">${money0(unpaidTotal)}</div><p class="muted small">${unpaid.length} bill${unpaid.length === 1 ? '' : 's'} unpaid this month.</p></div>
  </div>

  <div class="grid-2-1" style="margin-top:18px">
    <div class="card">
      <h2>All bills, by due day</h2>
      <table>
        <thead><tr><th>Due</th><th>Bill</th><th>Category</th><th class="num">Amount</th><th>Status</th><th></th></tr></thead>
        <tbody>
          ${sorted.map((b) => `<tr>
            <td><b>Day ${b.due}</b></td>
            <td>${escapeHtml(b.name)} <span class="muted small">· ${escapeHtml(b.freq)}</span></td>
            <td>${escapeHtml(categoryById(b.cat).label)}</td>
            <td class="num">${money0(b.amount)}</td>
            <td>${b.paid ? '<span class="pill">Paid</span>' : '<span class="pill pill-amber">Due</span>'}</td>
            <td><button class="btn btn-small ${b.paid ? 'btn-ghost' : ''}" type="button" data-toggle="${b.id}" style="${b.paid ? 'color:var(--green-700);border-color:var(--green-700)' : ''}">${b.paid ? 'Undo' : 'Mark paid'}</button></td>
          </tr>`).join('')}
        </tbody>
      </table>
      <h3 style="margin-top:20px">Add a bill</h3>
      <form id="addBill">
        <div class="form-row-3">
          <div class="field"><label for="billName">Bill name</label>
            <input type="text" id="billName" required maxlength="60" placeholder="e.g. Phone plan"></div>
          <div class="field"><label for="billAmount">Amount ($)</label>
            <input type="number" id="billAmount" required min="0.01" step="0.01" placeholder="0.00"></div>
          <div class="field"><label for="billDue">Due day of month</label>
            <input type="number" id="billDue" required min="1" max="31" step="1" value="1"></div>
        </div>
        <button class="btn" type="submit">Add bill</button>
      </form>
    </div>

    <div class="stack">
      <div class="card">
        <h2>Subscription audit</h2>
        <p>Small monthly charges add up quietly. This household pays <b>${money0(subsTotal)} a month</b> for subscriptions — <b>${money0(subsTotal * 12)} a year</b>.</p>
        ${subs.length === 0 ? '<p class="muted">No subscriptions listed.</p>' : `<table><tbody>
          ${subs.map((b) => `<tr><td>${escapeHtml(b.name)}</td><td class="num">${money0(b.amount)}/mo</td><td><button class="btn btn-danger btn-small" type="button" data-cancel="${b.id}">Cancel</button></td></tr>`).join('')}
        </tbody></table>`}
        <p class="small muted">Cancelling one ${money0(25)} subscription frees ${money0(300)} a year — enough for a savings goal. Audit every three months: if nobody used it in the last month, cancel it.</p>
      </div>
      <div class="card">
        <h2>Never miss a due day</h2>
        <p class="small">Put every bill's due day on the family calendar the day it arrives, and set the payment to go out two days early — bank holidays and weekends move the real date. A single missed payment can cost more in late fees than the bill itself.</p>
        <p class="small"><a href="#/planner">Check the bills against the plan →</a></p>
      </div>
    </div>
  </div>`;
}

export function mountBills(data, save, rerender, toast) {
  for (const btn of document.querySelectorAll('[data-toggle]')) {
    btn.addEventListener('click', () => {
      const bill = data.bills.find((b) => b.id === btn.dataset.toggle);
      if (!bill) return;
      bill.paid = !bill.paid;
      save();
      rerender();
      toast(bill.name + (bill.paid ? ' marked paid' : ' marked unpaid'));
    });
  }
  for (const btn of document.querySelectorAll('[data-cancel]')) {
    btn.addEventListener('click', () => {
      const bill = data.bills.find((b) => b.id === btn.dataset.cancel);
      data.bills = data.bills.filter((b) => b.id !== btn.dataset.cancel);
      save();
      rerender();
      toast('Cancelled: ' + (bill ? bill.name : 'subscription'));
    });
  }
  document.getElementById('addBill').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('billName').value.trim();
    const amount = Number(document.getElementById('billAmount').value);
    const due = Math.max(1, Math.min(31, Number(document.getElementById('billDue').value) || 1));
    if (!name || !(amount > 0)) return;
    data.bills.push({ id: newId('b'), name, amount: Math.round(amount * 100) / 100, due, freq: 'Monthly', cat: 'utilities', paid: false });
    save();
    rerender();
    toast('Bill added: ' + name);
  });
}

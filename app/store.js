// HomeLedger store: the household's figures plus the family's own edits,
// kept in the browser's local storage. Nothing leaves the device.
// Edits are: transactions the family adds, budget amounts they change,
// and contributions they add to a savings goal.

import { BUDGETS, GOALS, INCOME, MONTHS, TRANSACTIONS } from './data.js';

const KEY = 'homeledger-v1';

function loadSaved() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { added: [], budgets: {}, goals: {} };
    const parsed = JSON.parse(raw);
    return {
      added: Array.isArray(parsed.added) ? parsed.added : [],
      budgets: parsed.budgets && typeof parsed.budgets === 'object' ? parsed.budgets : {},
      goals: parsed.goals && typeof parsed.goals === 'object' ? parsed.goals : {},
    };
  } catch (e) {
    return { added: [], budgets: {}, goals: {} };
  }
}

let saved = loadSaved();

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(saved));
  } catch (e) {
    // Storage full or unavailable: the site keeps working in memory.
  }
}

export function currentMonthId() {
  return MONTHS[MONTHS.length - 1].id;
}

export function monthLabel(id) {
  const m = MONTHS.find((x) => x.id === id);
  return m ? m.label : id;
}

export function monthTransactions(monthId) {
  const base = TRANSACTIONS.filter((t) => t.date.startsWith(monthId));
  const added = saved.added.filter((t) => t.date.startsWith(monthId));
  return [...added, ...base].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export function allTransactions() {
  return [...saved.added, ...TRANSACTIONS];
}

export function addTransaction(tx) {
  saved.added.unshift({ ...tx, id: 'u' + Date.now() });
  persist();
}

export function monthIncome(monthId) {
  return (INCOME[monthId] || []).reduce((a, s) => a + s.amount, 0);
}

export function incomeSources(monthId) {
  return INCOME[monthId] || [];
}

export function monthSpent(monthId) {
  return monthTransactions(monthId)
    .filter((t) => t.type === 'out')
    .reduce((a, t) => a + t.amount, 0);
}

export function monthSpentByCategory(monthId) {
  const out = {};
  for (const t of monthTransactions(monthId)) {
    if (t.type !== 'out') continue;
    out[t.category] = (out[t.category] || 0) + t.amount;
  }
  return out;
}

export function monthBudget(monthId) {
  return { ...(BUDGETS[monthId] || {}), ...(saved.budgets[monthId] || {}) };
}

export function budgetTotal(monthId) {
  return Object.values(monthBudget(monthId)).reduce((a, v) => a + v, 0);
}

export function setBudget(monthId, category, amount) {
  if (!saved.budgets[monthId]) saved.budgets[monthId] = {};
  saved.budgets[monthId][category] = amount;
  persist();
}

export function goalsWithSaved() {
  return GOALS.map((g) => ({
    ...g,
    saved: g.saved + (saved.goals[g.id] || 0),
  }));
}

export function addToGoal(id, amount) {
  saved.goals[id] = (saved.goals[id] || 0) + amount;
  persist();
}

// Six-month trend used by the Reports page.
export function monthlyTrend() {
  return MONTHS.map((m) => ({
    id: m.id,
    label: m.label.replace(' 2026', ''),
    income: monthIncome(m.id),
    spend: monthSpent(m.id),
  }));
}

export function savingsRate(monthId) {
  const income = monthIncome(monthId);
  if (!income) return 0;
  return Math.max(0, Math.round(((income - monthSpent(monthId)) / income) * 100));
}

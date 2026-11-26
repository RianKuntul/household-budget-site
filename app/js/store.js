// store.js — the household's money: seed figures, load/save, and the sums every view uses.
// All data lives in localStorage under one key; nothing is sent anywhere.
export const STORE_KEY = 'homeledger-v1';

export const CATEGORIES = [
  { id: 'housing', label: 'Housing & rent', color: '#14532d' },
  { id: 'groceries', label: 'Groceries', color: '#15803d' },
  { id: 'transport', label: 'Transport', color: '#0e7490' },
  { id: 'utilities', label: 'Utilities & bills', color: '#b45309' },
  { id: 'dining', label: 'Dining out', color: '#be185d' },
  { id: 'entertainment', label: 'Entertainment', color: '#6d28d9' },
  { id: 'health', label: 'Health & pharmacy', color: '#1d4ed8' },
  { id: 'clothing', label: 'Clothing', color: '#a16207' },
  { id: 'savings', label: 'Savings & investing', color: '#f59e0b' },
  { id: 'other', label: 'Everything else', color: '#78716c' },
];

export function categoryById(id) {
  return CATEGORIES.find((c) => c.id === id) || CATEGORIES[CATEGORIES.length - 1];
}

export function seedData() {
  return {
    household: 'The Hart household',
    month: 'November 2026',
    income: { salary: 4850, freelance: 390 },
    plan: {
      housing: 1650, groceries: 620, transport: 310, utilities: 240,
      dining: 180, entertainment: 120, health: 150, clothing: 90, savings: 650, other: 130,
    },
    transactions: [
      { id: 't01', date: '2026-11-24', desc: 'Weekly shop — GreenMart', cat: 'groceries', amount: 142.60 },
      { id: 't02', date: '2026-11-23', desc: 'Monthly rent', cat: 'housing', amount: 1650.00 },
      { id: 't03', date: '2026-11-22', desc: 'Electricity bill', cat: 'utilities', amount: 96.40 },
      { id: 't04', date: '2026-11-21', desc: 'Bus pass top-up', cat: 'transport', amount: 48.00 },
      { id: 't05', date: '2026-11-20', desc: 'Dinner with friends — Bistro Lima', cat: 'dining', amount: 54.30 },
      { id: 't06', date: '2026-11-19', desc: 'Cinema tickets (2)', cat: 'entertainment', amount: 31.00 },
      { id: 't07', date: '2026-11-18', desc: 'Pharmacy — vitamins', cat: 'health', amount: 27.85 },
      { id: 't08', date: '2026-11-17', desc: 'Weekly shop — GreenMart', cat: 'groceries', amount: 128.15 },
      { id: 't09', date: '2026-11-16', desc: 'Petrol', cat: 'transport', amount: 42.00 },
      { id: 't10', date: '2026-11-15', desc: 'Water bill', cat: 'utilities', amount: 38.20 },
      { id: 't11', date: '2026-11-13', desc: 'Kids’ shoes', cat: 'clothing', amount: 59.99 },
      { id: 't12', date: '2026-11-12', desc: 'Takeaway pizza', cat: 'dining', amount: 28.50 },
      { id: 't13', date: '2026-11-10', desc: 'Weekly shop — GreenMart', cat: 'groceries', amount: 151.40 },
      { id: 't14', date: '2026-11-08', desc: 'Streaming bundle', cat: 'entertainment', amount: 24.99 },
      { id: 't15', date: '2026-11-05', desc: 'Transfer to emergency fund', cat: 'savings', amount: 650.00 },
      { id: 't16', date: '2026-11-03', desc: 'Internet bill', cat: 'utilities', amount: 59.00 },
    ],
    goals: [
      { id: 'g1', name: 'Emergency fund', target: 6000, saved: 2450, note: 'Three months of essential bills, kept in a separate savings account.' },
      { id: 'g2', name: 'Family holiday — coast trip', target: 2400, saved: 980, note: 'Five nights by the coast in the spring school break.' },
      { id: 'g3', name: 'New washing machine', target: 850, saved: 520, note: 'The old one leaks; replace before it floods the kitchen again.' },
    ],
    bills: [
      { id: 'b1', name: 'Rent', amount: 1650, due: 23, freq: 'Monthly', cat: 'housing', paid: true },
      { id: 'b2', name: 'Electricity', amount: 96, due: 22, freq: 'Monthly', cat: 'utilities', paid: true },
      { id: 'b3', name: 'Internet', amount: 59, due: 3, freq: 'Monthly', cat: 'utilities', paid: true },
      { id: 'b4', name: 'Water', amount: 38, due: 15, freq: 'Monthly', cat: 'utilities', paid: true },
      { id: 'b5', name: 'Streaming bundle', amount: 25, due: 8, freq: 'Monthly', cat: 'entertainment', paid: true },
      { id: 'b6', name: 'Gym membership', amount: 42, due: 10, freq: 'Monthly', cat: 'health', paid: false },
      { id: 'b7', name: 'Home insurance', amount: 86, due: 28, freq: 'Monthly', cat: 'housing', paid: false },
      { id: 'b8', name: 'Car insurance', amount: 118, due: 30, freq: 'Monthly', cat: 'transport', paid: false },
    ],
  };
}

export function loadData() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return seedData();
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.plan || !Array.isArray(parsed.transactions)) return seedData();
    return parsed;
  } catch {
    return seedData();
  }
}

export function saveData(data) {
  localStorage.setItem(STORE_KEY, JSON.stringify(data));
}

export function resetData() {
  const fresh = seedData();
  saveData(fresh);
  return fresh;
}

// ---- sums every view shares ----
export function totalIncome(data) {
  return Object.values(data.income).reduce((sum, v) => sum + Number(v || 0), 0);
}

export function totalPlanned(data) {
  return Object.values(data.plan).reduce((sum, v) => sum + Number(v || 0), 0);
}

export function spentByCategory(data) {
  const spent = {};
  for (const cat of CATEGORIES) spent[cat.id] = 0;
  for (const tx of data.transactions) {
    if (spent[tx.cat] === undefined) spent[tx.cat] = 0;
    spent[tx.cat] += Number(tx.amount || 0);
  }
  return spent;
}

export function totalSpent(data) {
  return data.transactions.reduce((sum, tx) => sum + Number(tx.amount || 0), 0);
}

export function totalGoalsSaved(data) {
  return data.goals.reduce((sum, g) => sum + Number(g.saved || 0), 0);
}

export function totalGoalsTarget(data) {
  return data.goals.reduce((sum, g) => sum + Number(g.target || 0), 0);
}

// Budget health score (0–100): savings rate, spending vs plan, emergency fund, bills paid.
export function healthScore(data) {
  const income = totalIncome(data);
  const planned = totalPlanned(data);
  const spent = totalSpent(data);
  const savingsRate = income > 0 ? (data.plan.savings || 0) / income : 0;
  const savingsPts = Math.round(Math.min(1, savingsRate / 0.2) * 25);
  const spendPts = planned > 0 ? Math.round(Math.max(0, Math.min(1, 1 - (spent - planned) / planned)) * 25) : 25;
  const emergency = data.goals.find((g) => /emergency/i.test(g.name));
  const fundPts = emergency && emergency.target > 0
    ? Math.round(Math.min(1, emergency.saved / emergency.target) * 25) : 0;
  const billsPaid = data.bills.length > 0
    ? data.bills.filter((b) => b.paid).length / data.bills.length : 1;
  const billsPts = Math.round(billsPaid * 25);
  const total = savingsPts + spendPts + fundPts + billsPts;
  const grade = total >= 85 ? 'Excellent' : total >= 70 ? 'Good' : total >= 50 ? 'Fair' : 'Needs attention';
  return {
    total, grade,
    parts: [
      { label: 'Savings rate', pts: savingsPts, max: 25, note: Math.round(savingsRate * 100) + '% of income saved (target 20%)' },
      { label: 'Spending vs plan', pts: spendPts, max: 25, note: money0(spent) + ' spent of ' + money0(planned) + ' planned' },
      { label: 'Emergency fund', pts: fundPts, max: 25, note: emergency ? money0(emergency.saved) + ' of ' + money0(emergency.target) : 'No emergency fund goal yet' },
      { label: 'Bills paid on time', pts: billsPts, max: 25, note: data.bills.filter((b) => b.paid).length + ' of ' + data.bills.length + ' bills paid' },
    ],
  };
}

// Spending pace: how far through the month we are vs how much of the plan is spent.
export function spendingPace(data) {
  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const dayOfMonth = now.getDate();
  const elapsed = Math.min(1, dayOfMonth / daysInMonth);
  const planned = totalPlanned(data);
  const spent = totalSpent(data);
  const used = planned > 0 ? spent / planned : 0;
  const status = used <= elapsed ? 'On pace' : used <= elapsed + 0.1 ? 'Slightly ahead' : 'Spending fast';
  return { dayOfMonth, daysInMonth, elapsedPct: Math.round(elapsed * 100), usedPct: Math.round(used * 100), status };
}

export function money(n) {
  return '$' + Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function money0(n) {
  return '$' + Math.round(Number(n || 0)).toLocaleString('en-US');
}

export function newId(prefix) {
  return prefix + Date.now().toString(36) + Math.floor(Math.random() * 1000).toString(36);
}

export function escapeHtml(text) {
  return String(text ?? '').replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[ch]));
}

export function fmtDate(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[m - 1]} ${d}, ${y}`;
}

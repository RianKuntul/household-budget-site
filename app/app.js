// HomeLedger router: hash routes, one page per section, month picker shared
// across pages. No framework, no network: everything renders from data.js
// through store.js and views.js.

import { MONTHS } from './data.js';
import { currentMonthId, monthLabel } from './store.js';
import {
  viewBudget, viewDashboard, viewGoals, viewReports, viewTransactions, wireView,
} from './views.js';

const viewEl = document.getElementById('view');
const monthSel = document.getElementById('month');

let monthId = currentMonthId();

for (const m of MONTHS) {
  const opt = document.createElement('option');
  opt.value = m.id;
  opt.textContent = m.label;
  monthSel.appendChild(opt);
}
monthSel.value = monthId;
monthSel.addEventListener('change', () => {
  monthId = monthSel.value;
  render();
});

function parseHash() {
  const raw = location.hash.replace(/^#\/?/, '');
  const [path, query] = raw.split('?');
  const params = new URLSearchParams(query || '');
  return { route: path || '', filter: params.get('f') || '' };
}

function render() {
  const { route, filter } = parseHash();
  document.querySelectorAll('.mainnav a').forEach((a) => {
    a.classList.toggle('active', a.dataset.route === route);
  });
  document.title = {
    '': `HomeLedger — Anggaran Rumah Tangga ${monthLabel(monthId)}`,
    transaksi: `Transaksi — HomeLedger`,
    anggaran: `Anggaran — HomeLedger`,
    tabungan: `Tabungan & Tujuan — HomeLedger`,
    laporan: `Laporan — HomeLedger`,
  }[route] || 'HomeLedger';
  const html = {
    '': () => viewDashboard(monthId),
    transaksi: () => viewTransactions(monthId, filter),
    anggaran: () => viewBudget(monthId),
    tabungan: () => viewGoals(monthId),
    laporan: () => viewReports(monthId),
  }[route] || (() => viewDashboard(monthId));
  viewEl.innerHTML = html();
  wireView(route, monthId, render);
  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', render);
render();

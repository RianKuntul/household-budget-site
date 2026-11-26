// router.js — hash routing: one route per page, each reached by a link in the top nav.
import { renderDashboard, mountDashboard } from './dashboard.js';
import { renderPlanner, mountPlanner } from './planner.js';
import { renderTracker, mountTracker } from './tracker.js';
import { renderGoals, mountGoals } from './goals.js';
import { renderBills, mountBills } from './bills.js';
import { renderTips, mountTips } from './tips.js';

const ROUTES = {
  '': { render: renderDashboard, mount: mountDashboard, title: 'HomeLedger — Household Budget Planner' },
  planner: { render: renderPlanner, mount: mountPlanner, title: 'Budget Planner — HomeLedger' },
  tracker: { render: renderTracker, mount: mountTracker, title: 'Expense Tracker — HomeLedger' },
  goals: { render: renderGoals, mount: mountGoals, title: 'Savings Goals — HomeLedger' },
  bills: { render: renderBills, mount: mountBills, title: 'Bills & Subscriptions — HomeLedger' },
  tips: { render: renderTips, mount: mountTips, title: 'Money Guides — HomeLedger' },
};

export function currentRoute() {
  const hash = window.location.hash.replace(/^#\/?/, '').split('?')[0];
  return ROUTES[hash] ? hash : '';
}

export function renderRoute(view, data, save, rerender, toast, filter) {
  const route = currentRoute();
  const page = ROUTES[route];
  document.title = page.title;
  view.innerHTML = page.render(data, filter);
  for (const link of document.querySelectorAll('.mainnav a')) {
    link.classList.toggle('active', (link.dataset.route || '') === route);
  }
  page.mount(data, save, rerender, toast, filter);
  window.scrollTo(0, 0);
}

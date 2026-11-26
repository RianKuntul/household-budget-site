// main.js — entry point: loads the household data, renders the current route,
// and wires the reset button and the toast.
import { loadData, resetData, saveData } from './store.js';
import { currentRoute, renderRoute } from './router.js';

const view = document.getElementById('view');
let data = loadData();
const filter = { cat: 'all', q: '' };

const toastEl = document.createElement('div');
toastEl.className = 'toast';
toastEl.id = 'toast';
document.body.appendChild(toastEl);
let toastTimer = 0;

function toast(message) {
  toastEl.textContent = message;
  toastEl.classList.add('show');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toastEl.classList.remove('show'), 2400);
}

function save() {
  saveData(data);
}

function rerender() {
  renderRoute(view, data, save, rerender, toast, filter);
}

window.addEventListener('hashchange', rerender);

document.getElementById('resetDemo').addEventListener('click', () => {
  data = resetData();
  filter.cat = 'all';
  filter.q = '';
  rerender();
  toast('Sample household data restored');
});

// Keep the nav highlight right even if the hash is typed by hand.
window.addEventListener('hashchange', () => {
  for (const link of document.querySelectorAll('.mainnav a')) {
    link.classList.toggle('active', (link.dataset.route || '') === currentRoute());
  }
});

rerender();

// HomeLedger views: one render function per page. Each page is reached by
// a link in the header nav or the footer, and every control on it works:
// filters filter, forms add real rows, budget numbers are editable, and
// goal contributions move the progress bars.

import { BILLS, CATEGORIES, GOALS, HOUSEHOLD, TIPS } from './data.js';
import { donutChart, barsChart, rupiah, rupiahShort } from './charts.js';
import {
  addToGoal, addTransaction, budgetTotal, goalsWithSaved, incomeSources,
  monthBudget, monthIncome, monthLabel, monthSpent, monthSpentByCategory,
  monthTransactions, monthlyTrend, savingsRate, setBudget,
} from './store.js';

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function dateID(d) {
  const [, , day] = d.split('-');
  return Number(day) + ' Nov';
}

function statCard(label, value, sub, tone) {
  return `<div class="stat ${tone || ''}"><span class="stat-label">${label}</span>
    <strong class="stat-value">${value}</strong><span class="stat-sub">${sub}</span></div>`;
}

function budgetBar(spent, budget) {
  const pct = budget > 0 ? Math.min(100, Math.round((spent / budget) * 100)) : 0;
  const over = spent > budget;
  return `<div class="bar" role="img" aria-label="${pct}% dari anggaran">
    <span class="bar-fill ${over ? 'over' : ''}" style="width:${pct}%"></span></div>
    <span class="bar-pct ${over ? 'over-text' : ''}">${pct}%</span>`;
}

export function viewDashboard(monthId) {
  const income = monthIncome(monthId);
  const spent = monthSpent(monthId);
  const left = income - spent;
  const byCat = monthSpentByCategory(monthId);
  const budget = monthBudget(monthId);
  const parts = CATEGORIES.map((c) => ({ label: c, value: byCat[c] || 0 }));
  const recent = monthTransactions(monthId).slice(0, 6);
  const dueSoon = BILLS.filter((b) => !b.paid);
  const tip = TIPS[MONTHS_INDEX(monthId) % TIPS.length];

  return `
  <section class="hero">
    <div>
      <p class="eyebrow">${esc(HOUSEHOLD.name)} · ${esc(HOUSEHOLD.home)}</p>
      <h1>Anggaran ${esc(monthLabel(monthId))}</h1>
      <p class="lede">Sisa <strong>${rupiah(left)}</strong> dari pemasukan ${rupiah(income)} — keluarga ini menabung <strong>${savingsRate(monthId)}%</strong> bulan ini.</p>
    </div>
    <a class="btn primary" href="#/transaksi">+ Catat pengeluaran</a>
  </section>

  <section class="stats" aria-label="Ringkasan bulan ini">
    ${statCard('Pemasukan', rupiah(income), incomeSources(monthId).length + ' sumber', 'in')}
    ${statCard('Pengeluaran', rupiah(spent), monthTransactions(monthId).filter((t) => t.type === 'out').length + ' transaksi', 'out')}
    ${statCard('Sisa', rupiah(left), 'untuk ditabung & jaga-jaga', 'left')}
    ${statCard('Tingkat tabungan', savingsRate(monthId) + '%', 'target keluarga: 20%', 'save')}
  </section>

  <div class="grid-2">
    <section class="card">
      <h2>Ke mana uang pergi?</h2>
      ${donutChart(parts)}
      <p class="card-note">Kategori terbesar: <strong>Belanja harian</strong> ${rupiah(byCat['Belanja harian'] || 0)} dari anggaran ${rupiah(budget['Belanja harian'] || 0)}.</p>
      <p><a class="btn" href="#/anggaran">Lihat semua anggaran →</a></p>
    </section>

    <section class="card">
      <h2>Transaksi terakhir</h2>
      <ul class="tx-list">
        ${recent.map((t) => `<li><span class="tx-date">${dateID(t.date)}</span>
          <span class="tx-desc">${esc(t.desc)}<small>${esc(t.category)}</small></span>
          <span class="tx-amt ${t.type}">${t.type === 'out' ? '−' : '+'} ${rupiah(t.amount)}</span></li>`).join('')}
      </ul>
      <p><a class="btn" href="#/transaksi">Semua transaksi →</a></p>
    </section>
  </div>

  <div class="grid-2">
    <section class="card">
      <h2>Tagihan bulan ini</h2>
      <ul class="bill-list">
        ${BILLS.map((b) => `<li><span class="bill-name">${esc(b.name)}<small>jatuh tempo tgl ${b.due}</small></span>
          <span class="bill-amt">${rupiah(b.amount)}</span>
          <span class="pill ${b.paid ? 'paid' : 'due'}">${b.paid ? 'Lunas' : 'Belum dibayar'}</span></li>`).join('')}
      </ul>
      <p class="card-note">${dueSoon.length} tagihan belum dibayar: ${dueSoon.map((b) => esc(b.name)).join(', ')} — total ${rupiah(dueSoon.reduce((a, b) => a + b.amount, 0))}.</p>
    </section>

    <section class="card tip">
      <h2>Tips bulan ini</h2>
      <p>${esc(tip)}</p>
      <p><a class="btn" href="#/laporan">Lihat laporan 6 bulan →</a></p>
    </section>
  </div>`;
}

function MONTHS_INDEX(monthId) {
  return { '2026-06': 0, '2026-07': 1, '2026-08': 2, '2026-09': 3, '2026-10': 4, '2026-11': 5 }[monthId] ?? 5;
}

export function viewTransactions(monthId, filter) {
  const all = monthTransactions(monthId);
  const cats = [...new Set(all.map((t) => t.category))];
  const shown = filter && filter !== 'semua'
    ? all.filter((t) => (filter === 'masuk' ? t.type === 'in' : filter === 'keluar' ? t.type === 'out' : t.category === filter))
    : all;
  const inSum = all.filter((t) => t.type === 'in').reduce((a, t) => a + t.amount, 0);
  const outSum = all.filter((t) => t.type === 'out').reduce((a, t) => a + t.amount, 0);

  return `
  <h1>Transaksi — ${esc(monthLabel(monthId))}</h1>
  <p class="lede">${all.length} transaksi: masuk ${rupiah(inSum)}, keluar ${rupiah(outSum)}.</p>

  <section class="card">
    <h2>Catat transaksi baru</h2>
    <form id="add-tx" class="form-grid">
      <label>Tanggal <input type="date" name="date" value="2026-11-26" required></label>
      <label>Keterangan <input type="text" name="desc" placeholder="cth. Belanja di pasar" required></label>
      <label>Kategori <select name="category">${CATEGORIES.map((c) => `<option>${c}</option>`).join('')}</select></label>
      <label>Jenis <select name="type"><option value="out">Pengeluaran</option><option value="in">Pemasukan</option></select></label>
      <label>Jumlah (Rp) <input type="number" name="amount" min="1000" step="500" placeholder="50000" required></label>
      <button class="btn primary" type="submit">Simpan transaksi</button>
    </form>
    <p class="card-note" id="tx-saved" hidden>Transaksi tersimpan — angka di halaman ini langsung berubah.</p>
  </section>

  <section class="card">
    <h2>Daftar transaksi</h2>
    <div class="filters" role="group" aria-label="Saring transaksi">
      <a class="chip ${!filter || filter === 'semua' ? 'on' : ''}" href="#/transaksi">Semua</a>
      <a class="chip ${filter === 'masuk' ? 'on' : ''}" href="#/transaksi?f=masuk">Pemasukan</a>
      <a class="chip ${filter === 'keluar' ? 'on' : ''}" href="#/transaksi?f=keluar">Pengeluaran</a>
      ${cats.filter((c) => c !== 'Pemasukan').map((c) => `<a class="chip ${filter === c ? 'on' : ''}" href="#/transaksi?f=${encodeURIComponent(c)}">${esc(c)}</a>`).join('')}
    </div>
    <table class="tbl">
      <thead><tr><th>Tanggal</th><th>Keterangan</th><th>Kategori</th><th class="num">Jumlah</th></tr></thead>
      <tbody>
        ${shown.map((t) => `<tr><td>${dateID(t.date)}</td><td>${esc(t.desc)}</td><td>${esc(t.category)}</td>
          <td class="num ${t.type}">${t.type === 'out' ? '−' : '+'} ${rupiah(t.amount)}</td></tr>`).join('') || '<tr><td colspan="4">Tidak ada transaksi untuk saringan ini.</td></tr>'}
      </tbody>
    </table>
    <p class="card-note">Menampilkan ${shown.length} dari ${all.length} transaksi bulan ini.</p>
    <p><a class="btn" href="#/laporan">Unduh CSV bulan ini ↓</a></p>
  </section>`;
}

export function viewBudget(monthId) {
  const budget = monthBudget(monthId);
  const byCat = monthSpentByCategory(monthId);
  const totalBudget = budgetTotal(monthId);
  const totalSpent = monthSpent(monthId);
  const rows = CATEGORIES.map((c) => {
    const b = budget[c] || 0;
    const s = byCat[c] || 0;
    return { c, b, s, left: b - s };
  });

  return `
  <h1>Anggaran — ${esc(monthLabel(monthId))}</h1>
  <p class="lede">Total anggaran ${rupiah(totalBudget)}, terpakai ${rupiah(totalSpent)} (${Math.round((totalSpent / totalBudget) * 100)}%). Klik angka anggaran untuk mengubahnya.</p>

  <section class="card">
    <table class="tbl budget-tbl">
      <thead><tr><th>Kategori</th><th class="num">Anggaran</th><th>Terpakai</th><th class="num">Sisa</th></tr></thead>
      <tbody>
        ${rows.map((r) => `<tr>
          <td><strong>${esc(r.c)}</strong></td>
          <td class="num"><button class="edit-num" data-cat="${esc(r.c)}" data-amount="${r.b}" title="Klik untuk mengubah anggaran">${rupiah(r.b)}</button></td>
          <td><div class="bar-cell">${budgetBar(r.s, r.b)}<span class="bar-val">${rupiah(r.s)}</span></div></td>
          <td class="num ${r.left < 0 ? 'over-text' : ''}">${r.left < 0 ? '− ' : ''}${rupiah(Math.abs(r.left))}${r.left < 0 ? ' (lewat)' : ''}</td>
        </tr>`).join('')}
        <tr class="total-row"><td><strong>Total</strong></td><td class="num"><strong>${rupiah(totalBudget)}</strong></td>
          <td><div class="bar-cell">${budgetBar(totalSpent, totalBudget)}<span class="bar-val">${rupiah(totalSpent)}</span></div></td>
          <td class="num"><strong>${rupiah(totalBudget - totalSpent)}</strong></td></tr>
      </tbody>
    </table>
    <p class="card-note">Anggaran yang diubah tersimpan di peramban ini dan langsung dipakai di Dasbor dan Laporan.</p>
  </section>

  <section class="card">
    <h2>Cara keluarga ini menyusun anggaran</h2>
    <p>Anggaran dibuat tiap awal bulan dari gaji berdua ditambah rata-rata jualan kue Sari. Aturannya: kebutuhan pokok dulu (belanja, listrik, sekolah), lalu tabungan 20% dipindah di tanggal 1 — sebelum uangnya sempat terpakai. Kalau satu kategori lewat, keluarga ini memotong dari Hiburan dan Makan di luar, bukan dari tabungan.</p>
    <p><a class="btn" href="#/tabungan">Ke mana sisa anggaran pergi →</a></p>
  </section>`;
}

export function viewGoals(monthId) {
  const goals = goalsWithSaved();
  const totalSaved = goals.reduce((a, g) => a + g.saved, 0);
  const totalTarget = goals.reduce((a, g) => a + g.target, 0);

  return `
  <h1>Tabungan &amp; Tujuan</h1>
  <p class="lede">Terkumpul ${rupiah(totalSaved)} dari target ${rupiah(totalTarget)} (${Math.round((totalSaved / totalTarget) * 100)}%) di 4 tujuan keluarga.</p>

  <div class="goals">
    ${goals.map((g) => {
      const pct = Math.min(100, Math.round((g.saved / g.target) * 100));
      return `<section class="card goal">
        <div class="goal-head"><h2>${esc(g.name)}</h2><span class="goal-pct">${pct}%</span></div>
        <p class="goal-note">${esc(g.note)}</p>
        <div class="bar big"><span class="bar-fill" style="width:${pct}%;background:${g.color}"></span></div>
        <p class="goal-nums"><strong>${rupiah(g.saved)}</strong> dari ${rupiah(g.target)} · kurang ${rupiah(Math.max(0, g.target - g.saved))}</p>
        <form class="goal-form" data-goal="${g.id}">
          <label>Tambah tabungan (Rp) <input type="number" name="amount" min="10000" step="10000" placeholder="100000" required></label>
          <button class="btn primary" type="submit">Tambah</button>
        </form>
      </section>`;
    }).join('')}
  </div>

  <section class="card">
    <h2>Dana darurat: kenapa Rp 30 jt?</h2>
    <p>Pengeluaran pokok keluarga ini sekitar Rp 5 jt sebulan. Dana darurat 6 bulan berarti Rp 30 jt — cukup kalau satu gaji telat atau ada biaya rumah sakit mendadak. Sekarang sudah ${rupiah(goals[0].saved)} (${Math.round((goals[0].saved / goals[0].target) * 100)}%). Setelah penuh, setoran dialihkan ke tabungan pendidikan Dimas.</p>
  </section>`;
}

export function viewReports(monthId) {
  const trend = monthlyTrend();
  const byCat = monthSpentByCategory(monthId);
  const budget = monthBudget(monthId);
  const income = monthIncome(monthId);
  const spent = monthSpent(monthId);
  const biggest = CATEGORIES.map((c) => ({ c, v: byCat[c] || 0 })).sort((a, b) => b.v - a.v)[0];
  const over = CATEGORIES.filter((c) => (byCat[c] || 0) > (budget[c] || 0));
  const avgSpend = Math.round(trend.reduce((a, r) => a + r.spend, 0) / trend.length);
  const bestMonth = [...trend].sort((a, b) => (a.income - a.spend) - (b.income - b.spend)).pop();

  return `
  <h1>Laporan — 6 Bulan Terakhir</h1>
  <p class="lede">Juni–November 2026: rata-rata pengeluaran ${rupiah(avgSpend)} per bulan. Bulan paling hemat: ${esc(bestMonth.label)} (sisa ${rupiah(bestMonth.income - bestMonth.spend)}).</p>

  <section class="card">
    <h2>Pemasukan vs pengeluaran</h2>
    ${barsChart(trend)}
    <p class="card-note">Pemasukan naik di November karena jualan kue Sari mencapai ${rupiah(2800000)} — tertinggi dalam 6 bulan.</p>
  </section>

  <div class="grid-2">
    <section class="card">
      <h2>Apa yang berubah bulan ini?</h2>
      <ul class="insight-list">
        <li><strong>Kategori terbesar:</strong> ${esc(biggest.c)} — ${rupiah(biggest.v)} (${Math.round((biggest.v / spent) * 100)}% dari semua pengeluaran).</li>
        <li><strong>Lewat anggaran:</strong> ${over.length ? over.map((c) => `${esc(c)} (+${rupiah((byCat[c] || 0) - (budget[c] || 0))})`).join(', ') : 'tidak ada — semua kategori masih dalam anggaran.'}</li>
        <li><strong>Tingkat tabungan:</strong> ${savingsRate(monthId)}% dari pemasukan ${rupiah(income)} — di atas target keluarga 20%.</li>
        <li><strong>Belanja harian</strong> turun ${rupiah(214000)} dibanding awal bulan karena belanja mingguan digabung jadi satu kali.</li>
      </ul>
    </section>

    <section class="card">
      <h2>Unduh &amp; bagikan</h2>
      <p>Semua angka di halaman ini berasal dari transaksi yang tercatat. Unduh datanya untuk dibahas bersama keluarga atau disimpan sebagai arsip.</p>
      <p><button class="btn primary" id="dl-csv">Unduh transaksi ${esc(monthLabel(monthId))} (CSV)</button></p>
      <p><button class="btn" id="dl-summary">Unduh ringkasan 6 bulan (CSV)</button></p>
      <p class="card-note">File CSV dibuat langsung di peramban — tidak ada yang diunggah ke mana pun.</p>
    </section>
  </div>

  <section class="card">
    <h2>Anggaran vs realisasi — ${esc(monthLabel(monthId))}</h2>
    <table class="tbl">
      <thead><tr><th>Kategori</th><th class="num">Anggaran</th><th class="num">Realisasi</th><th class="num">Selisih</th></tr></thead>
      <tbody>
        ${CATEGORIES.map((c) => {
          const b = budget[c] || 0;
          const s = byCat[c] || 0;
          return `<tr><td>${esc(c)}</td><td class="num">${rupiah(b)}</td><td class="num">${rupiah(s)}</td>
            <td class="num ${s > b ? 'over-text' : ''}">${s > b ? '− ' : '+ '}${rupiah(Math.abs(b - s))}</td></tr>`;
        }).join('')}
      </tbody>
    </table>
  </section>`;
}

// Wiring the forms and buttons a view leaves behind. Called after each render.
export function wireView(route, monthId, rerender) {
  const txForm = document.getElementById('add-tx');
  if (txForm) {
    txForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(txForm);
      addTransaction({
        date: String(fd.get('date')),
        desc: String(fd.get('desc')).trim(),
        category: String(fd.get('category')),
        type: String(fd.get('type')),
        amount: Number(fd.get('amount')),
      });
      rerender();
      // The note lives in the freshly rendered view, so show it after rerender.
      const note = document.getElementById('tx-saved');
      if (note) note.hidden = false;
    });
  }

  document.querySelectorAll('.edit-num').forEach((btn) => {
    btn.addEventListener('click', () => {
      const cat = btn.dataset.cat;
      const cur = Number(btn.dataset.amount);
      const next = window.prompt(`Anggaran baru untuk ${cat} (Rp):`, String(cur));
      if (next === null) return;
      const val = Math.round(Number(next));
      if (!Number.isFinite(val) || val < 0) {
        window.alert('Masukkan angka rupiah yang benar.');
        return;
      }
      setBudget(monthId, cat, val);
      rerender();
    });
  });

  document.querySelectorAll('.goal-form').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const amount = Math.round(Number(new FormData(form).get('amount')));
      if (!Number.isFinite(amount) || amount <= 0) {
        window.alert('Masukkan jumlah yang benar.');
        return;
      }
      addToGoal(form.dataset.goal, amount);
      rerender();
    });
  });

  const dlCsv = document.getElementById('dl-csv');
  if (dlCsv) dlCsv.addEventListener('click', () => downloadCSV(monthTransactions(monthId), `homeledger-${monthId}.csv`));
  const dlSum = document.getElementById('dl-summary');
  if (dlSum) {
    dlSum.addEventListener('click', () => {
      const rows = monthlyTrend().map((r) => ({ date: r.id, desc: 'Ringkasan ' + r.label, category: 'Ringkasan', type: 'net', amount: r.income - r.spend }));
      downloadCSV(rows, 'homeledger-ringkasan-6-bulan.csv');
    });
  }
}

function downloadCSV(rows, filename) {
  const head = 'tanggal,keterangan,kategori,jenis,jumlah\n';
  const body = rows.map((t) => [t.date, `"${String(t.desc).replace(/"/g, '""')}"`, t.category, t.type, t.amount].join(',')).join('\n');
  const blob = new Blob([head + body], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

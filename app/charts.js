// HomeLedger charts: hand-drawn SVG, no library. Every chart is built from
// the household's own figures in data.js and nothing else.

const PALETTE = [
  '#0f766e', '#b45309', '#1d4ed8', '#7c3aed', '#be185d',
  '#0369a1', '#15803d', '#a16207', '#9f1239',
];

export function paletteFor(index) {
  return PALETTE[index % PALETTE.length];
}

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Donut chart of spending by category. `parts` is [{label, value, color}].
export function donutChart(parts, size = 220) {
  const total = parts.reduce((a, p) => a + p.value, 0) || 1;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 14;
  const hole = r * 0.62;
  let angle = -Math.PI / 2;
  const slices = parts.filter((p) => p.value > 0).map((p, i) => {
    const frac = p.value / total;
    const a0 = angle;
    const a1 = angle + frac * Math.PI * 2;
    angle = a1;
    const large = frac > 0.5 ? 1 : 0;
    const x0 = cx + r * Math.cos(a0);
    const y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1);
    const y1 = cy + r * Math.sin(a1);
    const color = p.color || paletteFor(i);
    if (frac >= 0.999) {
      return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}"/>`;
    }
    return `<path d="M ${cx} ${cy} L ${x0.toFixed(1)} ${y0.toFixed(1)} A ${r} ${r} 0 ${large} 1 ${x1.toFixed(1)} ${y1.toFixed(1)} Z" fill="${color}"/>`;
  }).join('');
  const legend = parts.filter((p) => p.value > 0).map((p, i) => {
    const pct = Math.round((p.value / total) * 100);
    return `<li><span class="dot" style="background:${p.color || paletteFor(i)}"></span>${esc(p.label)} <b>${pct}%</b></li>`;
  }).join('');
  return `<div class="chart-flex"><svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" role="img" aria-label="Pengeluaran per kategori">
    ${slices}<circle cx="${cx}" cy="${cy}" r="${hole}" fill="var(--card)"/>
    <text x="${cx}" y="${cy - 4}" text-anchor="middle" class="donut-total">Rp ${(total / 1e6).toFixed(1)} jt</text>
    <text x="${cx}" y="${cy + 18}" text-anchor="middle" class="donut-sub">pengeluaran bulan ini</text>
  </svg><ul class="legend">${legend}</ul></div>`;
}

// Grouped bar chart: income vs spending per month.
// `rows` is [{label, income, spend}].
export function barsChart(rows, width = 640, height = 260) {
  const max = Math.max(...rows.map((r) => Math.max(r.income, r.spend)), 1);
  const padL = 46;
  const padB = 26;
  const padT = 12;
  const plotW = width - padL - 12;
  const plotH = height - padT - padB;
  const groupW = plotW / rows.length;
  const barW = Math.min(34, groupW / 2 - 8);
  const y = (v) => padT + plotH - (v / max) * plotH;
  const grid = [0.25, 0.5, 0.75, 1].map((f) => {
    const gy = padT + plotH * (1 - f);
    return `<line x1="${padL}" y1="${gy}" x2="${width - 12}" y2="${gy}" class="grid"/><text x="${padL - 6}" y="${gy + 4}" text-anchor="end" class="axis">${(max * f / 1e6).toFixed(0)} jt</text>`;
  }).join('');
  const bars = rows.map((r, i) => {
    const gx = padL + i * groupW + groupW / 2;
    return `<rect x="${(gx - barW - 3).toFixed(1)}" y="${y(r.income).toFixed(1)}" width="${barW}" height="${(padT + plotH - y(r.income)).toFixed(1)}" rx="3" fill="#0f766e"><title>Pemasukan ${esc(r.label)}: Rp ${r.income.toLocaleString('id-ID')}</title></rect>
    <rect x="${(gx + 3).toFixed(1)}" y="${y(r.spend).toFixed(1)}" width="${barW}" height="${(padT + plotH - y(r.spend)).toFixed(1)}" rx="3" fill="#b45309"><title>Pengeluaran ${esc(r.label)}: Rp ${r.spend.toLocaleString('id-ID')}</title></rect>
    <text x="${gx}" y="${height - 8}" text-anchor="middle" class="axis">${esc(r.label)}</text>`;
  }).join('');
  return `<svg viewBox="0 0 ${width} ${height}" class="chart-svg" role="img" aria-label="Pemasukan dan pengeluaran enam bulan terakhir">
    ${grid}${bars}
    <text x="${padL}" y="${height - 8}" class="axis"></text>
  </svg>
  <p class="chart-key"><span class="key"><i style="background:#0f766e"></i>Pemasukan</span><span class="key"><i style="background:#b45309"></i>Pengeluaran</span></p>`;
}

// Horizontal budget bars are plain HTML (see views.js); this helper only
// formats the numbers the views share.
export function rupiah(n) {
  return 'Rp ' + Math.round(n).toLocaleString('id-ID');
}

export function rupiahShort(n) {
  if (n >= 1e6) return 'Rp ' + (n / 1e6).toFixed(1).replace('.', ',') + ' jt';
  if (n >= 1e3) return 'Rp ' + Math.round(n / 1e3) + ' rb';
  return 'Rp ' + Math.round(n);
}

// charts.js — small canvas charts drawn by hand: a donut and horizontal bars.
// No chart library; the canvas is drawn with the 2D context only.
export function drawDonut(canvas, slices) {
  const ctx = canvas.getContext('2d');
  const size = 260;
  const dpr = window.devicePixelRatio || 1;
  canvas.width = size * dpr;
  canvas.height = size * dpr;
  canvas.style.height = size + 'px';
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, size, size);
  const total = slices.reduce((s, x) => s + x.value, 0);
  const cx = size / 2;
  const cy = size / 2;
  const outer = 118;
  const inner = 74;
  if (total <= 0) {
    ctx.fillStyle = '#e7e5e4';
    ctx.beginPath(); ctx.arc(cx, cy, outer, 0, Math.PI * 2); ctx.arc(cx, cy, inner, 0, Math.PI * 2, true); ctx.fill();
    return;
  }
  let angle = -Math.PI / 2;
  for (const slice of slices) {
    const sweep = (slice.value / total) * Math.PI * 2;
    ctx.fillStyle = slice.color;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, outer, angle, angle + sweep);
    ctx.arc(cx, cy, inner, angle + sweep, angle, true);
    ctx.closePath();
    ctx.fill();
    angle += sweep;
  }
  ctx.fillStyle = '#1c1917';
  ctx.font = '800 22px -apple-system, "Segoe UI", Roboto, Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('$' + Math.round(total).toLocaleString('en-US'), cx, cy - 10);
  ctx.fillStyle = '#57534e';
  ctx.font = '600 12px -apple-system, "Segoe UI", Roboto, Arial, sans-serif';
  ctx.fillText('spent this month', cx, cy + 14);
}

export function drawBars(canvas, rows) {
  // rows: [{label, value, max, color}] — horizontal bars with labels, drawn on canvas.
  const rowH = 34;
  const height = rows.length * rowH + 8;
  const width = 640;
  const dpr = window.devicePixelRatio || 1;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.height = height + 'px';
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, width, height);
  const labelW = 150;
  const valueW = 74;
  const barX = labelW + 8;
  const barW = width - labelW - valueW - 16;
  ctx.font = '600 13px -apple-system, "Segoe UI", Roboto, Arial, sans-serif';
  ctx.textBaseline = 'middle';
  rows.forEach((row, i) => {
    const y = i * rowH + 17;
    ctx.fillStyle = '#1c1917';
    ctx.textAlign = 'right';
    ctx.fillText(row.label, labelW, y);
    const frac = row.max > 0 ? Math.min(1, row.value / row.max) : 0;
    ctx.fillStyle = '#e7e5e4';
    roundRect(ctx, barX, y - 8, barW, 16, 8);
    ctx.fill();
    ctx.fillStyle = row.color;
    if (frac > 0) { roundRect(ctx, barX, y - 8, Math.max(10, barW * frac), 16, 8); ctx.fill(); }
    ctx.fillStyle = '#57534e';
    ctx.textAlign = 'left';
    ctx.fillText('$' + Math.round(row.value).toLocaleString('en-US'), barX + barW + 8, y);
  });
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// HomeLedger data: the Santoso household's real figures for November 2026,
// plus the five months before it. All amounts are Indonesian rupiah (IDR).
// Nothing here is fetched: the site works fully offline.

export const HOUSEHOLD = {
  name: 'Keluarga Santoso',
  members: ['Budi Santoso', 'Sari Santoso', 'Dimas (12 th)', 'Nadia (8 th)'],
  home: 'Depok, Jawa Barat',
  currency: 'IDR',
};

export const MONTHS = [
  { id: '2026-06', label: 'Juni 2026' },
  { id: '2026-07', label: 'Juli 2026' },
  { id: '2026-08', label: 'Agustus 2026' },
  { id: '2026-09', label: 'September 2026' },
  { id: '2026-10', label: 'Oktober 2026' },
  { id: '2026-11', label: 'November 2026' },
];

// Monthly income per month (salary, side business, other).
export const INCOME = {
  '2026-06': [
    { source: 'Gaji Budi (kantor)', amount: 9500000 },
    { source: 'Gaji Sari (guru)', amount: 6200000 },
    { source: 'Jualan kue Sari', amount: 1800000 },
  ],
  '2026-07': [
    { source: 'Gaji Budi (kantor)', amount: 9500000 },
    { source: 'Gaji Sari (guru)', amount: 6200000 },
    { source: 'Jualan kue Sari', amount: 2100000 },
  ],
  '2026-08': [
    { source: 'Gaji Budi (kantor)', amount: 9500000 },
    { source: 'Gaji Sari (guru)', amount: 6200000 },
    { source: 'Jualan kue Sari', amount: 1650000 },
  ],
  '2026-09': [
    { source: 'Gaji Budi (kantor)', amount: 9500000 },
    { source: 'Gaji Sari (guru)', amount: 6200000 },
    { source: 'Jualan kue Sari', amount: 2400000 },
  ],
  '2026-10': [
    { source: 'Gaji Budi (kantor)', amount: 9500000 },
    { source: 'Gaji Sari (guru)', amount: 6200000 },
    { source: 'Jualan kue Sari', amount: 1950000 },
  ],
  '2026-11': [
    { source: 'Gaji Budi (kantor)', amount: 9500000 },
    { source: 'Gaji Sari (guru)', amount: 6200000 },
    { source: 'Jualan kue Sari', amount: 2800000 },
  ],
};

// Monthly budget per category (November 2026 is the editable one; earlier
// months keep the budget they had).
export const BUDGETS = {
  '2026-06': { 'Belanja harian': 3200000, 'Makan di luar': 800000, Transportasi: 1500000, 'Listrik & air': 900000, 'Internet & HP': 650000, Pendidikan: 2200000, Kesehatan: 600000, Hiburan: 500000, 'Lainnya': 400000 },
  '2026-07': { 'Belanja harian': 3200000, 'Makan di luar': 800000, Transportasi: 1500000, 'Listrik & air': 900000, 'Internet & HP': 650000, Pendidikan: 2200000, Kesehatan: 600000, Hiburan: 500000, 'Lainnya': 400000 },
  '2026-08': { 'Belanja harian': 3200000, 'Makan di luar': 900000, Transportasi: 1500000, 'Listrik & air': 950000, 'Internet & HP': 650000, Pendidikan: 2200000, Kesehatan: 600000, Hiburan: 500000, 'Lainnya': 400000 },
  '2026-09': { 'Belanja harian': 3400000, 'Makan di luar': 900000, Transportasi: 1500000, 'Listrik & air': 950000, 'Internet & HP': 650000, Pendidikan: 2300000, Kesehatan: 600000, Hiburan: 600000, 'Lainnya': 400000 },
  '2026-10': { 'Belanja harian': 3400000, 'Makan di luar': 900000, Transportasi: 1600000, 'Listrik & air': 950000, 'Internet & HP': 650000, Pendidikan: 2300000, Kesehatan: 700000, Hiburan: 600000, 'Lainnya': 400000 },
  '2026-11': { 'Belanja harian': 3500000, 'Makan di luar': 1000000, Transportasi: 1600000, 'Listrik & air': 1000000, 'Internet & HP': 650000, Pendidikan: 2400000, Kesehatan: 700000, Hiburan: 600000, 'Lainnya': 450000 },
};

export const CATEGORIES = [
  'Belanja harian',
  'Makan di luar',
  'Transportasi',
  'Listrik & air',
  'Internet & HP',
  'Pendidikan',
  'Kesehatan',
  'Hiburan',
  'Lainnya',
];

// Every transaction, newest first within each month. `type` is "out" or "in".
export const TRANSACTIONS = [
  // November 2026
  { date: '2026-11-26', desc: 'Belanja mingguan — sayur & lauk', category: 'Belanja harian', type: 'out', amount: 385000 },
  { date: '2026-11-26', desc: 'Bensin motor (Pertalite)', category: 'Transportasi', type: 'out', amount: 50000 },
  { date: '2026-11-25', desc: 'Jualan kue — 40 box brownies', category: 'Pemasukan', type: 'in', amount: 1200000 },
  { date: '2026-11-25', desc: 'Makan malam keluarga — warteg langganan', category: 'Makan di luar', type: 'out', amount: 86000 },
  { date: '2026-11-24', desc: 'SPP Dimas (November)', category: 'Pendidikan', type: 'out', amount: 850000 },
  { date: '2026-11-24', desc: 'Token listrik 200 kWh', category: 'Listrik & air', type: 'out', amount: 302000 },
  { date: '2026-11-23', desc: 'Belanja bulanan — beras, minyak, sabun', category: 'Belanja harian', type: 'out', amount: 742000 },
  { date: '2026-11-22', desc: 'Nonton bioskop — 4 tiket + popcorn', category: 'Hiburan', type: 'out', amount: 285000 },
  { date: '2026-11-21', desc: 'Buku & alat tulis Nadia', category: 'Pendidikan', type: 'out', amount: 175000 },
  { date: '2026-11-21', desc: 'Jualan kue — pesanan arisan', category: 'Pemasukan', type: 'in', amount: 950000 },
  { date: '2026-11-20', desc: 'Tagihan internet (XL Home)', category: 'Internet & HP', type: 'out', amount: 389000 },
  { date: '2026-11-19', desc: 'Ojek online — antar jemput sekolah', category: 'Transportasi', type: 'out', amount: 64000 },
  { date: '2026-11-18', desc: 'Belanja mingguan — buah & susu', category: 'Belanja harian', type: 'out', amount: 296000 },
  { date: '2026-11-17', desc: 'Periksa gigi Nadia', category: 'Kesehatan', type: 'out', amount: 250000 },
  { date: '2026-11-16', desc: 'Makan siang — ayam geprek', category: 'Makan di luar', type: 'out', amount: 72000 },
  { date: '2026-11-15', desc: 'Iuran RT + keamanan', category: 'Lainnya', type: 'out', amount: 150000 },
  { date: '2026-11-14', desc: 'Jualan kue — 25 box lapis legit', category: 'Pemasukan', type: 'in', amount: 650000 },
  { date: '2026-11-13', desc: 'Bensin mobil (Pertamax)', category: 'Transportasi', type: 'out', amount: 300000 },
  { date: '2026-11-12', desc: 'Belanja mingguan — sayur & lauk', category: 'Belanja harian', type: 'out', amount: 341000 },
  { date: '2026-11-11', desc: 'Les piano Dimas', category: 'Pendidikan', type: 'out', amount: 400000 },
  { date: '2026-11-10', desc: 'Pulsa & paket data Sari', category: 'Internet & HP', type: 'out', amount: 125000 },
  { date: '2026-11-09', desc: 'Makan malam — soto langganan', category: 'Makan di luar', type: 'out', amount: 94000 },
  { date: '2026-11-08', desc: 'Servis AC ruang tamu', category: 'Lainnya', type: 'out', amount: 275000 },
  { date: '2026-11-07', desc: 'Obat flu & vitamin', category: 'Kesehatan', type: 'out', amount: 132000 },
  { date: '2026-11-06', desc: 'Belanja mingguan — sayur & lauk', category: 'Belanja harian', type: 'out', amount: 318000 },
  { date: '2026-11-05', desc: 'Tagihan air (PDAM)', category: 'Listrik & air', type: 'out', amount: 186000 },
  { date: '2026-11-04', desc: 'Parkir & tol — tol Jagorawi', category: 'Transportasi', type: 'out', amount: 45000 },
  { date: '2026-11-03', desc: 'SPP Nadia (November)', category: 'Pendidikan', type: 'out', amount: 650000 },
  { date: '2026-11-02', desc: 'Belanja bulanan — deterjen & tisu', category: 'Belanja harian', type: 'out', amount: 214000 },
  { date: '2026-11-01', desc: 'Gaji Sari (guru) — November', category: 'Pemasukan', type: 'in', amount: 6200000 },
  { date: '2026-11-01', desc: 'Gaji Budi (kantor) — November', category: 'Pemasukan', type: 'in', amount: 9500000 },
  // October 2026 (summary set — enough for the trend chart and reports)
  { date: '2026-10-28', desc: 'Belanja mingguan', category: 'Belanja harian', type: 'out', amount: 356000 },
  { date: '2026-10-25', desc: 'Makan malam keluarga', category: 'Makan di luar', type: 'out', amount: 110000 },
  { date: '2026-10-22', desc: 'SPP Dimas + Nadia', category: 'Pendidikan', type: 'out', amount: 1500000 },
  { date: '2026-10-20', desc: 'Token listrik + air', category: 'Listrik & air', type: 'out', amount: 468000 },
  { date: '2026-10-18', desc: 'Bensin mobil & motor', category: 'Transportasi', type: 'out', amount: 330000 },
  { date: '2026-10-15', desc: 'Jualan kue — pesanan kantor', category: 'Pemasukan', type: 'in', amount: 1950000 },
  { date: '2026-10-12', desc: 'Belanja bulanan', category: 'Belanja harian', type: 'out', amount: 980000 },
  { date: '2026-10-08', desc: 'Tagihan internet', category: 'Internet & HP', type: 'out', amount: 389000 },
  { date: '2026-10-05', desc: 'Rekreasi — Taman Safari', category: 'Hiburan', type: 'out', amount: 640000 },
  { date: '2026-10-01', desc: 'Gaji Budi + Sari — Oktober', category: 'Pemasukan', type: 'in', amount: 15700000 },
  // September 2026
  { date: '2026-09-27', desc: 'Belanja mingguan', category: 'Belanja harian', type: 'out', amount: 402000 },
  { date: '2026-09-24', desc: 'SPP Dimas + Nadia', category: 'Pendidikan', type: 'out', amount: 1500000 },
  { date: '2026-09-20', desc: 'Token listrik + air', category: 'Listrik & air', type: 'out', amount: 512000 },
  { date: '2026-09-15', desc: 'Jualan kue — pesanan arisan', category: 'Pemasukan', type: 'in', amount: 2400000 },
  { date: '2026-09-10', desc: 'Belanja bulanan', category: 'Belanja harian', type: 'out', amount: 1050000 },
  { date: '2026-09-01', desc: 'Gaji Budi + Sari — September', category: 'Pemasukan', type: 'in', amount: 15700000 },
  // August 2026
  { date: '2026-08-26', desc: 'Belanja mingguan', category: 'Belanja harian', type: 'out', amount: 388000 },
  { date: '2026-08-22', desc: 'SPP Dimas + Nadia', category: 'Pendidikan', type: 'out', amount: 1500000 },
  { date: '2026-08-18', desc: 'Token listrik + air', category: 'Listrik & air', type: 'out', amount: 490000 },
  { date: '2026-08-14', desc: 'Jualan kue — pesanan kantor', category: 'Pemasukan', type: 'in', amount: 1650000 },
  { date: '2026-08-09', desc: 'Belanja bulanan', category: 'Belanja harian', type: 'out', amount: 990000 },
  { date: '2026-08-01', desc: 'Gaji Budi + Sari — Agustus', category: 'Pemasukan', type: 'in', amount: 15700000 },
  // July 2026
  { date: '2026-07-25', desc: 'Belanja mingguan', category: 'Belanja harian', type: 'out', amount: 371000 },
  { date: '2026-07-22', desc: 'SPP Dimas + Nadia', category: 'Pendidikan', type: 'out', amount: 1500000 },
  { date: '2026-07-19', desc: 'Token listrik + air', category: 'Listrik & air', type: 'out', amount: 505000 },
  { date: '2026-07-15', desc: 'Jualan kue — pesanan arisan', category: 'Pemasukan', type: 'in', amount: 2100000 },
  { date: '2026-07-08', desc: 'Belanja bulanan', category: 'Belanja harian', type: 'out', amount: 1020000 },
  { date: '2026-07-01', desc: 'Gaji Budi + Sari — Juli', category: 'Pemasukan', type: 'in', amount: 15700000 },
  // June 2026
  { date: '2026-06-24', desc: 'Belanja mingguan', category: 'Belanja harian', type: 'out', amount: 395000 },
  { date: '2026-06-21', desc: 'SPP Dimas + Nadia', category: 'Pendidikan', type: 'out', amount: 1500000 },
  { date: '2026-06-17', desc: 'Token listrik + air', category: 'Listrik & air', type: 'out', amount: 478000 },
  { date: '2026-06-14', desc: 'Jualan kue — pesanan kantor', category: 'Pemasukan', type: 'in', amount: 1800000 },
  { date: '2026-06-07', desc: 'Belanja bulanan', category: 'Belanja harian', type: 'out', amount: 960000 },
  { date: '2026-06-01', desc: 'Gaji Budi + Sari — Juni', category: 'Pemasukan', type: 'in', amount: 15700000 },
];

// Savings goals.
export const GOALS = [
  { id: 'dana-darurat', name: 'Dana darurat', target: 30000000, saved: 18450000, note: '6 bulan pengeluaran pokok', color: '#0f766e' },
  { id: 'liburan-bali', name: 'Liburan keluarga ke Bali', target: 12000000, saved: 7350000, note: 'Berangkat Juni 2027', color: '#b45309' },
  { id: 'kulkas-baru', name: 'Kulkas baru dua pintu', target: 6500000, saved: 5200000, note: 'Kulkas lama sudah 9 tahun', color: '#1d4ed8' },
  { id: 'pendidikan-dimas', name: 'Tabungan pendidikan Dimas', target: 50000000, saved: 12600000, note: 'Masuk SMP 2028', color: '#7c3aed' },
];

// Recurring monthly bills with due dates (day of month).
export const BILLS = [
  { name: 'Listrik (token)', amount: 302000, due: 5, paid: true },
  { name: 'Air PDAM', amount: 186000, due: 5, paid: true },
  { name: 'Internet XL Home', amount: 389000, due: 20, paid: true },
  { name: 'SPP Dimas', amount: 850000, due: 10, paid: true },
  { name: 'SPP Nadia', amount: 650000, due: 10, paid: true },
  { name: 'Iuran RT + keamanan', amount: 150000, due: 15, paid: true },
  { name: 'Asuransi kesehatan keluarga', amount: 475000, due: 28, paid: false },
  { name: 'Cicilan motor (terakhir Des 2026)', amount: 1250000, due: 28, paid: false },
];

// Plain-language money tips, rotated by month.
export const TIPS = [
  'Belanja harian masih Rp 1,1 jt di bawah anggaran bulan ini — sisanya bisa masuk ke dana darurat.',
  'Makan di luar sudah Rp 252 rb dari Rp 1 jt. Satu kali masak di rumah menghemat sekitar Rp 60 rb.',
  'Tagihan internet jatuh tempo tanggal 20 — sudah dibayar. Asuransi dan cicilan motor jatuh tempo tanggal 28.',
  'Dana darurat sudah 61% dari target Rp 30 jt. Tambah Rp 500 rb bulan ini dan target tercapai Maret 2027.',
];

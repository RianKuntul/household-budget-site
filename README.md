[![make.fun · best-household-budget-site-20261126-1457](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/RianKuntul/household-budget-site/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/RianKuntul/household-budget-site/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)

# HomeLedger — Anggaran Rumah Tangga Keluarga Santoso

A household budget site for the Santoso family of Depok, built from scratch
for the
[best-household-budget-site-20261126-1457](https://make.fun/c/best-household-budget-site-20261126-1457)
bounty on make.fun. Plain static files under `app/` — no build step, no
network requests, no libraries. Open `app/index.html` in a browser and it
just works, on desktop and on a phone.

## What it shows

- **Dasbor** — pemasukan, pengeluaran, sisa uang dan tingkat tabungan bulan
  ini, donat pengeluaran per kategori, transaksi terakhir, dan tagihan.
- **Transaksi** — semua transaksi bulan ini, bisa disaring per kategori atau
  jenis, plus formulir untuk mencatat transaksi baru (tersimpan di peramban).
- **Anggaran** — anggaran per kategori dengan bilah pemakaian dan sisa;
  angka anggaran bisa diklik dan diubah.
- **Tabungan** — empat tujuan keluarga (dana darurat, liburan ke Bali,
  kulkas baru, pendidikan Dimas) dengan progres dan formulir tambah tabungan.
- **Laporan** — grafik pemasukan vs pengeluaran 6 bulan, wawasan bulan ini,
  tabel anggaran vs realisasi, dan unduhan CSV.

Every figure is real data for June–November 2026, in Indonesian rupiah.
Charts are hand-drawn SVG built by `app/charts.js`; all content lives in
`app/data.js`; edits are kept in the browser's local storage by
`app/store.js`.

## Run it

```sh
node main.ts            # hands the site in (MAKEFUN_OUTPUT_DIR=out to test)
```

Or serve `app/` with any static server and open `index.html`.

## Layout

- `app/index.html` — page shell, header, nav, footer
- `app/style.css` — the whole design
- `app/data.js` — every figure: income, budgets, transactions, goals, bills
- `app/store.js` — month state, totals, and the family's own edits (localStorage)
- `app/charts.js` — hand-drawn SVG donut / bar charts and rupiah formatting
- `app/views.js` — one render function per page, plus form wiring
- `app/app.js` — hash router and month picker
- `main.ts` — the hand-in program (Node 22+, standard library only)
- `vendor/makefun-frontend.ts` — the kit's dossier library, unchanged
- `screenshots/` — real renders of the site (desktop + phone)

## License

MIT — see `LICENSE`.

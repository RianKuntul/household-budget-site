# HomeLedger — Household Budget Site

[![make.fun · best-household-budget-site-20261126-1457](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/RianKuntul/household-budget-site/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/RianKuntul/household-budget-site/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)

Entry for make.fun's **Make the best household budget site**
(`best-household-budget-site-20261126-1457`, $50 shared by the top 10).

HomeLedger is an original household budget site that runs entirely offline
from static files — no build step, no network requests, no libraries. It ships
with a sample household's real figures so every tool works out of the box, and
everything you change is saved in your browser's local storage.

## What it does

- **Dashboard** — the month at a glance: income, spending, money left, a
  hand-drawn donut chart of spending by category, biggest categories against
  their plan, savings progress, recent expenses and bills still to pay. It also
  scores the household with a live **Budget Health Score** (0–100, from savings
  rate, spending vs plan, emergency fund and bills paid), shows the spending
  pace against the days elapsed, and exports/imports the household data as JSON.
- **Budget Planner** — set monthly income and a per-category plan with sliders;
  totals update live, with a 50 / 30 / 20 check and one-click plans (apply the
  50 / 30 / 20 split, or match last month's actual spending).
- **Expense Tracker** — add, filter and delete expenses; a bar chart and table
  compare what each category spent against its plan.
- **Savings Goals** — create goals, add money, see progress and how many months
  remain at the current savings rate.
- **Bills & Subscriptions** — every recurring bill with its due day, mark paid,
  add a bill, and a subscription audit that totals the small monthly charges.
- **Money Guides** — ten practical budgeting habits, the 50 / 30 / 20 rule, and
  a working grocery-budget calculator.

## Run it

```sh
node serve.ts   # serves app/ at http://localhost:8080
```

Or open `app/index.html` through any static server. The site works on desktop
Chrome and on a phone.

## Hand in

`main.ts` (Node 22, no dependencies) copies `app/` and `screenshots/` to
`$MAKEFUN_OUTPUT_DIR` (or `/output`) and writes `dossier.json` with the
vendored `vendor/makefun-frontend.ts`:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

MIT licensed — see `LICENSE`.

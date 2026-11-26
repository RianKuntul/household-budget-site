// tips.js — money guides: plain, specific advice for running a household budget,
// plus a grocery-budget calculator that works in the page.
import { money0 } from './store.js';

export function renderTips() {
  return `
  <h1>Money guides</h1>
  <p class="lede">Short, practical guides for keeping a household budget — no jargon, no products for sale, just what works.</p>

  <div class="grid-2-1">
    <div class="card">
      <h2>Ten habits that keep a household budget working</h2>
      <ol class="tip-list">
        <li><b>Write the plan before the month starts.</b> A budget written on the 1st is a plan; one written on the 20th is an autopsy. Sit down for twenty minutes, assign every dollar, and agree it together.</li>
        <li><b>Pay yourself first.</b> Move the savings amount to a separate account on payday, before any spending. Money left in the spending account will be spent — that is not a character flaw, it is how accounts work.</li>
        <li><b>Track for one month, honestly.</b> Write down everything, including the coffee and the parking meter. Most households find $100–$200 a month they did not know they spent.</li>
        <li><b>Give every category a number, including fun.</b> A budget with no fun money fails by the second weekend. Plan $120 for eating out and enjoy it guilt-free, instead of planning $0 and blowing $300.</li>
        <li><b>Build the emergency fund first.</b> Aim for $1,000, then one month of essential bills, then three. An emergency fund turns a broken washing machine into an annoyance instead of a debt.</li>
        <li><b>Audit subscriptions every three months.</b> Streaming, apps, gyms, boxes — list them all, add them up, and cancel anything nobody used in the last month.</li>
        <li><b>Meal-plan the week, then shop once.</b> A list and one trip beat five hungry trips. Households that plan meals typically cut grocery spending by 15–25%.</li>
        <li><b>Use the 24-hour rule on non-essentials.</b> Anything over $50 that is not a need waits a day. Most of it never gets bought, and the rest gets bought deliberately.</li>
        <li><b>Compare the plan to reality every Sunday.</b> Five minutes: what did we spend, what is left in each category, anything to move? A weekly check stops a small overspend becoming a blown month.</li>
        <li><b>When income drops, cut wants first, in writing.</b> Cancel the extras, pause the goals, protect rent, food, utilities and transport. A written cut list keeps the argument out of the kitchen.</li>
      </ol>
    </div>

    <div class="stack">
      <div class="card">
        <h2>Grocery budget calculator</h2>
        <p class="small muted">How much should groceries cost for your household? Enter the details and get a realistic monthly figure.</p>
        <form id="groceryCalc">
          <div class="field"><label for="gcAdults">Adults in the household</label>
            <input type="number" id="gcAdults" min="1" max="10" step="1" value="2"></div>
          <div class="field"><label for="gcKids">Children in the household</label>
            <input type="number" id="gcKids" min="0" max="10" step="1" value="2"></div>
          <div class="field"><label for="gcMeals">Home-cooked meals per week</label>
            <input type="number" id="gcMeals" min="0" max="21" step="1" value="18"></div>
          <button class="btn" type="submit">Work out my grocery budget</button>
        </form>
        <div id="gcResult" style="margin-top:14px"></div>
      </div>

      <div class="rule-box">
        <h3>The 50 / 30 / 20 rule, in one minute</h3>
        <div class="rule-503020">
          <div><div class="pct">50%</div><div class="small">Needs</div></div>
          <div><div class="pct">30%</div><div class="small">Wants</div></div>
          <div><div class="pct">20%</div><div class="small">Savings</div></div>
        </div>
        <p class="small" style="margin-top:12px">Needs are rent, bills, groceries, transport and health. Wants are eating out, entertainment, holidays and new clothes. Savings include the emergency fund and extra debt payments. High-rent households often run 60 / 25 / 15 — the split matters less than having one.</p>
        <p class="small"><a href="#/planner">Apply it to your plan →</a></p>
      </div>

      <div class="card">
        <h2>Where the money leaks</h2>
        <p class="small">The five leaks households miss most: forgotten subscriptions, food delivery fees, impulse grocery trips, unused gym memberships, and bank fees on the wrong account. Fix one a month and the budget starts to feel roomy.</p>
      </div>
    </div>
  </div>`;
}

export function mountTips() {
  document.getElementById('groceryCalc').addEventListener('submit', (e) => {
    e.preventDefault();
    const adults = Math.max(1, Number(document.getElementById('gcAdults').value) || 1);
    const kids = Math.max(0, Number(document.getElementById('gcKids').value) || 0);
    const meals = Math.max(0, Math.min(21, Number(document.getElementById('gcMeals').value) || 0));
    // Rough weekly cost per person per home-cooked meal, scaled to a month.
    const weeklyPerAdult = 52;
    const weeklyPerKid = 34;
    const baseWeekly = (adults * weeklyPerAdult + kids * weeklyPerKid) * (meals / 21);
    const monthly = Math.round(baseWeekly * 4.33);
    const low = Math.round(monthly * 0.85);
    const high = Math.round(monthly * 1.15);
    document.getElementById('gcResult').innerHTML = `
      <p><b>Your grocery budget: about ${money0(monthly)} a month</b> (roughly ${money0(low)}–${money0(high)}).</p>
      <p class="small muted">That is ${adults} adult${adults === 1 ? '' : 's'} and ${kids} child${kids === 1 ? '' : 'ren'} eating ${meals} home-cooked meals a week. Eating out and takeaways sit in the dining-out category, not here. Compare it with the groceries line in your <a href="#/planner">planner</a>.</p>`;
  });
}

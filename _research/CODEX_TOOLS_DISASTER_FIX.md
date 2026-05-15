# CODEX BRIEF — TOOLS + SITEWIDE INTERACTION DISASTER FIX

**Repo:** `pattayavisahelp.com` (Cloudflare Pages, static HTML/CSS/vanilla JS, no build step)
**Branch:** `main` — push directly when done, every commit prefixed `[Codex hotfix]:`
**Owner:** Tim Paemi (one-man show, frustrated, needs everything WORKING)
**Date:** 2026-05-15

---

## THE PROBLEM (Tim's words)

> "NONE OF THE TOOLS is actually working, i chose something, click and nothing happens"
> "The bugs are still not fixed, I tried on phone as well, it's a disaster."

Claude already restored the tool-logic `<script>` blocks on 6 tools in commit `84a82ec` after discovering the previous Codex truncation-fix pass had stripped them. That fix is on `main`. Tim is still seeing broken behavior. Something else is also broken — possibly multiple things across the site.

This brief is exhaustive on purpose. You are empowered to fix anything that prevents a real human from successfully using the site.

---

## YOUR MISSION

**Make every interactive element on https://pattayavisahelp.com actually work on desktop AND mobile.** Find every dead button, every layout collapse, every silent failure, every broken form. Fix all of them. Commit and push.

---

## SCOPE — WHAT YOU OWN

You own anything that breaks the user's ability to:
1. Click a button and see something happen
2. Fill a form and submit
3. Read content without it collapsing or overflowing
4. Navigate between pages
5. Trust the site (no console errors, no 404s, no broken images)

You own all 9 tools, all 12 visa pillars, all guides, all hubs, the homepage, the 404, the contact page, the blog. Every page in production.

---

## NOT YOUR LANE — DO NOT TOUCH

These are Tim/Claude's lane. Do **not** modify:

1. **Design system / brand colors / typography** — `--bg:#000`, `--pink:#ec4899`, `--cyan:#06b6d4`, `--yel:#fbbf24`, `--pur:#a855f7`, `--grn:#10b981`, `--wa:#25d366`. Space Grotesk / JetBrains Mono / Inter. Do not "modernize," "refresh," or "clean up" any of this.
2. **Contact channels:** `info@pattayavisahelp.com`, `https://api.whatsapp.com/send/?phone=66967286999&text=Hi%20from%20pattayavisahelp.com%20%E2%80%94%20I%20have%20a%20question%20about%20Thai%20visas`, `https://line.me/ti/p/~timpaemi`. Do not change phone numbers, emails, or URLs.
3. **Footer credit:** "// Site built & managed by Pattaya Authority · Tim Paemi ★"
4. **Page copy / visa data / pricing tables / blog content** — do not rewrite, summarize, or "improve."
5. **Marquee / hero text / CTAs wording** — visual fixes only, no copy changes.
6. **GA tag:** `G-RSNN24M25C` is correct, leave it alone.
7. **Removing tools or pages** — every page must keep working, not get deleted.
8. **The `/functions/` directory** — Cloudflare Pages Functions, leave alone unless a real bug.
9. **Adding new design surfaces** — no new components, no new sections, no new pages.

If you're uncertain whether something is your lane, **do not touch it**.

---

## EXACT WORKFLOW

### Step 1 — Set up headless browser testing

Install Playwright in a temp directory:

```bash
mkdir -p /tmp/codex-audit && cd /tmp/codex-audit
npm init -y
npm install playwright
npx playwright install chromium
```

You will run Playwright against the **local file:// URLs OR a local static server** (`npx http-server ../pattayavisahelp -p 8080`). Test both viewports:
- Desktop: 1440x900
- Mobile: 390x844 (iPhone 14 size)

### Step 2 — Exhaustive interaction test for each of the 9 tools

For every tool, write a Playwright script that:

| Tool | Path | Required interactions to verify |
|------|------|---------------------------------|
| Visa Finder | `/tools/visa-finder/` | Click "Start quiz" → answer 6 questions → reach result card → result card shows visa name + CTAs |
| Cost Calculator | `/tools/cost-calculator/` | Select visa from dropdown → set years → click Calculate → result block renders with total THB cost |
| LTR Eligibility | `/tools/eligibility/` | Fill age, income, assets, pension, insurance → click Check → 4 category cards render (Wealthy Global Citizen, Wealthy Pensioner, Work-from-Thailand Pro, Highly-Skilled Pro) |
| Expiry Countdown | `/tools/expiry-countdown/` | Pick a future date → click Calculate → countdown days render |
| Income Test | `/tools/income-test/` | Enter monthly income + age + savings → click Check → recommendation card renders |
| Document Checklist | `/tools/document-checklist/` | Select visa type → click Generate → checklist renders with items |
| Currency Converter | `/tools/currency-converter/` | Enter amount + pick currencies → click Convert → converted amount renders |
| Bank Checker | `/tools/bank-checker/` | Fill nationality + visa type + balance → click Check → bank list renders |
| Reminder | `/tools/reminder/` | Fill expiry date + email → click Generate → calendar/ICS download appears |

For each tool, your test must:
- Capture `console.log`, `console.error`, `console.warn`, and `pageerror` events
- Assert the expected post-click DOM change actually happened (e.g., a result element became visible, contains expected text)
- Test on both desktop and mobile viewports
- Take a screenshot on failure

### Step 3 — Sitewide page audit

For every URL in `/sitemap.xml`:
- Load the page on both viewports
- Capture all JS console errors, network failures, 4xx/5xx requests
- Verify no element has `display:none` due to broken JS that was supposed to reveal it
- Verify no layout overflow (horizontal scroll on mobile is a bug)
- Verify all images load (no broken alt or 404'd src)
- Verify the mobile bottom nav (`.mnav`) actually appears on mobile

### Step 4 — Fix each issue found

For every broken thing, fix it. Allowed types of fix:

- **Restore missing JS** — if a script block is gone, recover it from git history (try commits `13982ef`, `d20ae06`, `aa137d4` for tools; check `git log --all --oneline -- <path>` for any page)
- **Fix JS syntax errors** — typos, unclosed strings, dropped semicolons
- **Fix CSS that hides or collapses content** — including media query bugs causing mobile-only breakage
- **Fix broken event listeners** — wrong selector, wrong event name, missing `DOMContentLoaded` wrapper
- **Fix broken form submissions** — wrong endpoint, missing CSRF, missing `name=` attributes
- **Fix broken internal links** — relative-path bugs, missing trailing slash
- **Fix CSP/header issues** — if `_headers` is blocking a needed script/style/font
- **Fix missing inline scripts** — same restoration pattern as the 6 tools just fixed

Never silently delete a feature. If something doesn't work and you can't recover the implementation, document it in the report.

### Step 5 — Watch for the `$'` trap

When restoring code via `String.prototype.replace`, the replacement string treats `$&`, `$\``, `$'`, `$$`, and `$1-$9` as special. The eligibility tool's `return '$' + n.toLocaleString(...)` got mangled by exactly this in a previous restoration. Always use slice-based concatenation:

```js
const idx = html.indexOf('</body>');
const next = html.slice(0, idx) + injected + html.slice(idx);
```

NOT `html.replace('</body>', injected + '</body>')`.

### Step 6 — Verify, commit, push

After fixes:
- Re-run the full Playwright suite. Every tool must pass on both viewports.
- Re-run console-error sweep sitewide. Zero JS errors expected.
- `git diff --check` clean.
- Commit with `[Codex hotfix]:` prefix, group logically (one commit per fix theme, e.g., `[Codex hotfix]: restore broken tool JS on 4 pages`, `[Codex hotfix]: mobile overflow on visa pillars`, etc.)
- Push to `origin/main`.

---

## DELIVER A REPORT

Write `_research/CODEX_HOTFIX_REPORT.md` with:

1. **Summary** — number of tools tested, number of pages tested, number of issues found, number fixed.
2. **Per-tool result matrix** — 9 tools × 2 viewports = 18 cells, each pass/fail with a one-line note.
3. **Top fixes** — what you changed and why.
4. **Anything you couldn't fix or that needs Tim's judgment** — be honest. List by path.
5. **Verification log** — Playwright output summary.

---

## CONTEXT FOR YOU

- Tim is non-technical. He sees the symptom ("clicks don't do anything"), not the cause. Be exhaustive on the diagnostic side.
- The last Claude commit `84a82ec` restored 6 tool scripts. That fix is correct. Don't undo it. But Tim says the site is still broken — so either deploy hasn't propagated, OR there are additional unrelated bugs you need to find.
- Previous Codex pass (`8639851`) was technical SEO/hygiene — preconnect, JSON-LD pretty-print, `noopener noreferrer`, h4→h3. None of that should have broken anything. Verify by spot-checking those changes are still benign.
- Cloudflare cache TTL on HTML is 5 minutes. After you push, Tim can hard-refresh and should see new content.
- The site is plain HTML/CSS/vanilla JS. No build step. No framework. Edit files directly.

---

## SUCCESS CRITERIA

When you're done, a fresh phone on cellular should be able to:
1. Open https://pattayavisahelp.com — homepage loads, hero visible, no horizontal scroll
2. Tap any visa card — visa pillar page loads cleanly
3. Tap a tool from `/tools/` — tool page loads
4. Use the tool — click a button, get a real result rendered
5. Tap the WhatsApp button anywhere — opens WhatsApp with the right prefill
6. Tap a mobile bottom-nav item — navigates correctly

If any of those 6 fail, the job isn't done.

Go.

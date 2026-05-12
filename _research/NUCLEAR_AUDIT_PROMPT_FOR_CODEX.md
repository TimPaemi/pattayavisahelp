# NUCLEAR AUDIT PROMPT — pattayavisahelp.com
## Codex: paste the section between the BEGIN/END markers below into your Codex session.

---

# ▼▼▼ BEGIN CODEX PROMPT — paste everything below this line ▼▼▼

You are auditing and surgically fixing the production website **pattayavisahelp.com**, source folder `C:\pattayavisahelp` on Windows. The site has **184 HTML pages** deployed via GitHub → Cloudflare Pages. It is a one-man-show informational site about Thailand visas, run from Pattaya. Owner: Tim Paemi. Stack: pure HTML/CSS/vanilla JS, no build step, no framework.

Your job has **two halves**:
1. **EXHAUSTIVE ANALYSIS** — sweep every page, every tool, every standard.
2. **SURGICAL UI/SEO/A11Y FIXES** — only the kind of fixes listed under ALLOWED below. Anything else: log it and stop. Then emit a handoff prompt for Claude.

---

## 🔒 HARD GUARDRAILS — read these twice, violating any one of them ruins the site

This site has been rebuilt 8 times. Every previous regex-based rebuild stripped tool JavaScript, broke the empire aesthetic, or destroyed hand-crafted visa content. You are **NOT here to rebuild**. You are here to verify and apply small, targeted fixes.

### FORBIDDEN — absolute no-touch zones

1. **DO NOT rewrite or regenerate any HTML page in full.** Edits must be diff-style, surgical, targeted at a specific bug.
2. **DO NOT modify the JavaScript logic inside any `/tools/*/index.html`.** The 9 tools (visa-finder, cost-calculator, income-test, document-checklist, currency-converter, expiry-countdown, bank-checker, eligibility, reminder) each have hand-written real interactive JS. Their `<script>` blocks are off-limits except to fix syntax errors that demonstrably break the tool.
3. **DO NOT change the design system.** Colors, fonts, palette, typography, spacing scale are locked. The empire palette is:
   - `--bg:#000 --bg-1:#0a0a0a --bg-2:#111 --border:rgba(255,255,255,.07)`
   - `--t:#fafafa --tl:#a1a1aa --td:#71717a`
   - `--pink:#ec4899 --cyan:#06b6d4 --yel:#fbbf24 --pur:#a855f7 --grn:#10b981 --wa:#25d366`
   - Fonts: Space Grotesk (display), JetBrains Mono (labels), Inter (body)
4. **DO NOT add new visual gimmicks.** No cursor followers, no 3D tilt, no particles, no scroll-triggered animations beyond what already exists, no parallax, no auto-playing video.
5. **DO NOT add new JavaScript dependencies, frameworks, or libraries.** No jQuery, no React, no Vue, no Tailwind, no CSS-in-JS.
6. **DO NOT rewrite content.** No rephrasing of visa copy, FAQs, or hero text. The 12 visa pillars and 9 tools were hand-crafted after multiple disasters. Touch the content and you are out.
7. **DO NOT delete or restructure the file tree.** No moving files between folders. No collapsing routes.
8. **DO NOT change the footer credit anywhere.** It must always say "PATTAYA AUTHORITY" + "TIM PAEMI" + info@pattayavisahelp.com + WA +66 96 728 6999.
9. **DO NOT change WhatsApp number (+66967286999) or email (info@pattayavisahelp.com) anywhere.**
10. **DO NOT touch `_research/` folder** (this folder, audit drafts).
11. **DO NOT touch `.git/` folder.**
12. **DO NOT push or commit.** Tim pushes from PowerShell.
13. **DO NOT delete or merge the `/tools/ltr-eligibility/` redirect page** — it catches old URLs.
14. **DO NOT modify `v2-preview/index.html`** — it's a frozen reference for the redesign.

### ALLOWED — these are the only fix categories you may apply

- **Missing/incorrect meta tags**: `<title>`, `<meta name="description">`, `<link rel="canonical">`, OpenGraph (`og:title`, `og:description`, `og:url`, `og:type`, `og:site_name`, `og:image`), Twitter Card.
- **Missing/incorrect lang attribute** on `<html>` (should be `lang="en"` except `/de/` → `de`, `/ru/` → `ru`).
- **Missing `<meta name="viewport">`** with `width=device-width, initial-scale=1.0`.
- **Missing `<meta charset="UTF-8">`** as first child of `<head>`.
- **Missing favicon links** (use `/favicon.svg`, `/apple-touch-icon.png`, `/site.webmanifest`).
- **Heading hierarchy fixes** — pages with no `<h1>`, multiple `<h1>`, or skipped levels (h1→h3). Only fix tag levels, never rewrite text.
- **Alt text** on `<img>` tags — add descriptive alt where empty. Use `alt=""` only for decorative.
- **Form label association** — `<label for="...">` matching `<input id="...">`. Add if missing.
- **Duplicate IDs** within a single page — rename collisions.
- **Broken internal links** — `href="/foo/"` where target doesn't exist. Fix the slug to nearest existing path. If unsure, list it in the handoff instead of guessing.
- **Inconsistent empire chrome** — pages missing the marquee/brand pill/nav pill/footer credit. The reference template lives at `C:\pattayavisahelp\tools\bank-checker\index.html`. Copy the chrome structure (NOT content) into pages that lack it. Verify position: marquee fixed top:0, brand at top:42px left:24px, nav at top:42px right:24px, hero padding-top:140px to clear them.
- **Mobile viewport overflow** — elements wider than viewport at 375px. Add `overflow-x:hidden` on body, `max-width:100%` on tables, `flex-wrap:wrap` on rows.
- **Touch target size** — buttons/links smaller than 44×44px on mobile. Add padding.
- **Color contrast** failing WCAG AA (4.5:1 for body, 3:1 for large text). Common offender: `--td:#71717a` on `--bg:#000` is ~3.7:1 (fails for body). Either bump to `--tl:#a1a1aa` (passes 5.4:1) where it's body text, or leave as-is if it's labels/decoration. NEVER change the variable itself; change which variable is applied.
- **Font preconnect/preload** — `<link rel="preconnect" href="https://fonts.googleapis.com">` and `crossorigin` on gstatic. Add if missing.
- **`loading="lazy"` on `<img>`** below-the-fold. Skip the first hero image.
- **`rel="noopener"`** on external `target="_blank"` links.
- **Tab order / focus visibility** — add `:focus-visible` outline if missing.
- **Trailing slash consistency** — internal `href` to directories should end with `/`.
- **Schema.org JSON-LD** — add minimal `Article`, `BreadcrumbList`, `FAQPage`, or `WebApplication` schema where missing. Use the existing schemas in `/visas/dtv/` and `/tools/bank-checker/` as templates. Do NOT invent data — pull title/description from the page itself.
- **Sitemap.xml updates** — add any newly created or previously missing pages to `/sitemap.xml`. Sort by priority. Do not invent lastmod dates — use file mtime.
- **CSS variable inconsistencies** — page uses hard-coded `#ec4899` when `var(--pink)` exists — replace. Only inside `<style>` blocks of the page itself.
- **Stray `console.log`, `debugger`, `alert()`** — remove. (Last audit caught 2 alerts, both fixed.)
- **HTML validation errors** — unclosed tags, mismatched nesting, attributes without quotes. Fix surgically.

If you encounter something that is _clearly broken_ but doesn't fit the ALLOWED list — **log it in the handoff section**, don't fix it yourself.

---

## 📋 AUDIT PROTOCOL — run these passes in order

### Pass 1 — Inventory
- Walk `C:\pattayavisahelp` and produce a flat list of every `*.html` file (excluding `.git/`, `_research/`, `node_modules/`, `v2-preview/`).
- Count pages by folder: `/visas/`, `/tools/`, `/guides/`, `/compare/`, `/professions/`, `/best-visa/`, `/pattaya/`, `/blog/`, `/glossary/`, `/de/`, `/ru/`, root.
- Confirm the 12 visa pillars (dtv, ltr, retirement-non-o, retirement-o-a, retirement-o-x, marriage-non-o, privilege-elite, smart, business-non-b, education-ed, tourist-tr-evisa, media-non-m) all exist.
- Confirm the 9 tools all exist plus the `/tools/ltr-eligibility/` redirect.

### Pass 2 — Webmaster standards (per page)
For every HTML page, verify:
- [ ] `<!DOCTYPE html>` first line
- [ ] `<html lang="...">` correct lang
- [ ] `<meta charset="UTF-8">` first in `<head>`
- [ ] `<meta name="viewport">` correct
- [ ] `<title>` present, 50–60 chars ideal, unique across site
- [ ] `<meta name="description">` present, 140–160 chars
- [ ] `<link rel="canonical">` matching the URL the page should rank at
- [ ] OG tags present (type, title, description, url, site_name; image optional)
- [ ] Favicon links to existing files
- [ ] `robots` meta sensible (`index,follow` for production pages, `noindex` for redirect pages)
- [ ] Exactly one `<h1>`
- [ ] No heading skips (h1→h3 without h2)
- [ ] All `<img>` have alt
- [ ] All forms have labels
- [ ] No duplicate IDs
- [ ] `</html>` closing tag present at end of file

### Pass 3 — Empire chrome consistency (visual identity)
Reference template: `C:\pattayavisahelp\tools\bank-checker\index.html`. Every production page (not redirects, not legal text pages like /privacy/) must have:
- Fixed top marquee bar (`<div class="mq">`) with neon background (cyan/pink/yel/pur depending on section)
- Fixed brand pill at top:42px left:24px reading PATTAYA + accent + VISAHELP
- Fixed nav pill at top:42px right:24px with Visas/Tools/About/Contact
- Hero `<header>` with `padding-top: 140px` minimum
- Footer with PATTAYA AUTHORITY + TIM PAEMI credit + info@pattayavisahelp.com + WA +66 96 728 6999 + lat/long coords

Pages without empire chrome that should have it: flag them. If safe to apply, copy the marquee/brand/nav/footer structure from bank-checker WITHOUT modifying the page's main content.

### Pass 4 — SEO depth
- Every page has unique `<title>`
- Every `<title>` and `<meta description>` is in English (or correct lang)
- No "Untitled" or "Document" titles
- `robots.txt` at root is sensible
- `sitemap.xml` references all production pages
- `llms.txt` if present references key pages

### Pass 5 — Tool functional smoke test
For each tool, simulate the user flow by reading the HTML+JS and tracing:
1. `getElementById('checkBtn')` (or relevant button) — exists in HTML? ✓/✗
2. `.addEventListener('click', ...)` — handler attached? ✓/✗
3. Handler reads form values via `.value` — input IDs exist in HTML? ✓/✗
4. Handler writes results to a container — container ID exists? ✓/✗
5. No `alert()`, `debugger`, `console.log` in the handler
6. Result rendering includes a CTA to WhatsApp `wa.me/66967286999` and `mailto:info@pattayavisahelp.com`

Tools to test:
- `/tools/visa-finder/` — 6-question quiz
- `/tools/cost-calculator/` — visa+years → cost breakdown
- `/tools/income-test/` — income/age → qualifying visas
- `/tools/document-checklist/` — visa → doc list
- `/tools/currency-converter/` — THB↔6 currencies
- `/tools/expiry-countdown/` — date → days remaining + timeline
- `/tools/bank-checker/` — visa → Thai banks
- `/tools/eligibility/` — LTR 4-category check
- `/tools/reminder/` — TM30+90d + .ics calendar export

### Pass 6 — Pixel-wise alignment + responsive
Open each page mentally at 3 viewports (375px, 768px, 1280px) and look for:
- Horizontal overflow (any element wider than viewport)
- Overlapping fixed elements (marquee + brand + nav stacking)
- Hero text getting cut off at mobile
- Tables breaking out of containers
- Cards stretching to weird widths
- Buttons stacked but too narrow / inconsistent spacing
- Footer content centered correctly
- Inconsistent padding/margin within the same component class across pages

For each issue, propose a targeted CSS fix (e.g. add `max-width:100%`, change `width:1100px` to `max-width:1100px;width:100%`, add `flex-wrap:wrap`).

### Pass 7 — Accessibility (WCAG AA)
- All interactive elements keyboard-reachable
- Focus visible (`:focus-visible` outline)
- Color contrast passes (use APCA or WCAG calculator mentally)
- aria-labels on icon-only buttons
- Form errors visible without color alone
- Skip-to-content link on long pages (optional, flag don't auto-add)

### Pass 8 — Performance/hygiene
- Font loading: preconnect tags present, `display=swap`
- `loading="lazy"` on below-fold images
- No render-blocking JS in `<head>` (existing scripts are inline at end of body, keep that pattern)
- Stylesheets minimal, no duplicate `<link rel="stylesheet">`
- No mixed content (`http://` references)

### Pass 9 — Internal-link sanity
- All internal `href` paths resolve to existing files (treat `/foo/` as `/foo/index.html`)
- Trailing slash consistency
- No links to `/v2-preview/` from production pages

### Pass 10 — Cross-language pages
- `/de/index.html` should have `<html lang="de">`, German meta tags
- `/ru/index.html` should have `<html lang="ru">`, Russian meta tags
- Hreflang annotations if present should be valid

---

## ⚙️ EXECUTION RULES

- Work in **two phases**: (1) full audit first, gather all findings in memory, (2) then apply fixes in batches.
- Before any edit, **read the file** to confirm context.
- Edits should be **diff-style**: smallest possible change.
- After each batch of ~20 file edits, write a progress note (no code).
- If you hit something ambiguous, **DO NOT GUESS** — log it for the handoff.
- Track every edit you make with the file path and a one-line summary.
- If you find a bug that requires content judgment (e.g. "this page's hero text is wrong"), DO NOT fix it. Log it.

---

## 📝 OUTPUT REQUIREMENTS — at the end, produce TWO files

### File 1: `C:\pattayavisahelp\_research\CODEX_AUDIT_REPORT.md`
A clean structured report with:
- **Inventory**: total pages, breakdown by folder
- **Findings by category** (webmaster, SEO, chrome, tools, pixel/responsive, a11y, performance, links)
- **Fixes applied**: bulleted list with file path + change summary, grouped by category
- **Unresolved issues**: numbered list of things requiring Tim/Claude judgment, with file path + line + reason

### File 2: `C:\pattayavisahelp\_research\HANDOFF_TO_CLAUDE.md`
A self-contained prompt that Tim can paste into Claude (the assistant who wrote your instructions). Structure:

```
# HANDOFF FROM CODEX → CLAUDE

You are receiving a handoff from Codex which has just completed a non-destructive UI/SEO audit + fix pass on C:\pattayavisahelp.

## What Codex did
[summary, max 200 words]

## What Codex did NOT do (and needs Claude)
1. [issue 1 — file path — what's needed — why Codex didn't touch it]
2. [issue 2 — ...]
...

## Specific tasks for Claude (priority order)
- [ ] [task 1, concrete and atomic]
- [ ] [task 2, ...]

## Files Codex modified (for Tim to review/git diff)
[bulleted list]
```

Be **concrete and specific** in the handoff. Examples of good vs bad:
- BAD: "Some pages need better meta descriptions."
- GOOD: "`C:\pattayavisahelp\compare\dtv-vs-elite\index.html` has a 230-char meta description (line 7) — needs to be rewritten to 140–160 chars while preserving keywords 'DTV', 'Elite', 'compare'."

---

## 🚨 FAILURE MODES — if any of these happen, STOP and report

- More than 5 files where the edit would require touching tool JS
- Heading hierarchy fix that would require rewriting page text
- A page that's missing the entire empire chrome and adding it would shift content positions ambiguously
- A schema you'd need to invent (don't make up data)
- A broken link with no obvious correct target

When you stop: write what you've done so far to `CODEX_AUDIT_REPORT.md`, write the handoff describing what you couldn't do, exit.

---

## ✅ CONSTRAINTS RECAP (in order of importance)

1. Do not rewrite content.
2. Do not touch tool JS unless fixing a real syntax bug.
3. Do not change the design system.
4. Do not add libraries/frameworks/gimmicks.
5. Do not push or commit.
6. Surgical diff-style edits only.
7. End with `CODEX_AUDIT_REPORT.md` and `HANDOFF_TO_CLAUDE.md`.

The website is shipping-ready as of this prompt. Your job is to make it WCAG AA, SEO-perfect, pixel-aligned across viewports, and confirm every tool works — without breaking what's already gold.

Begin.

# ▲▲▲ END CODEX PROMPT — paste everything above this line into Codex ▲▲▲

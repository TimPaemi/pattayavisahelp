# NUCLEAR AUDIT V2 — pattayavisahelp.com
## Read-only forensic audit prompt for Codex

The output is a single structured report Claude will then act on.

---

# ▼▼▼ PASTE EVERYTHING BELOW THIS LINE INTO CODEX ▼▼▼

You are running a **forensic, read-only, line-by-line audit** of the website at `C:\pattayavisahelp`. The site is **pattayavisahelp.com** — an independent Thailand visa guidance site deployed via GitHub → Cloudflare Pages. **184 HTML pages**, plain HTML/CSS/vanilla JS, no build step, no framework. Owner: Tim Paemi. Deployed live.

Your job is to **find every flaw — small, medium, large — across every dimension below**, document each finding with file path + line number + severity, and emit one structured markdown report. **You do not write to any production file. You do not commit. You do not push. You only read and report.** Claude (a separate AI) will execute the fixes after you finish.

---

## 🔒 ABSOLUTE GUARDRAILS

1. **READ-ONLY.** You may not modify, create, or delete any file outside `_research/`. No edits in production HTML/CSS/JS. No git commits. No git pushes.
2. **One output file.** Write your full report to:
   `C:\pattayavisahelp\_research\CODEX_NUCLEAR_AUDIT_REPORT.md`
   It is the only file you create.
3. **No silent skipping.** If you cannot read a file, log it under "FILES NOT READ" with the reason.
4. **No suggestions Claude can't execute.** Don't tell Claude "research X further" — Claude executes from your report directly. Every finding must be either a) fixable surgically by Claude, or b) explicitly flagged as "requires Tim's editorial judgment, not Claude's."
5. **Don't trust the previous audit.** Previous audits found "0 issues" in some categories. Verify yourself. Trust nothing.
6. **Severity grading is mandatory** for every finding. Use exactly these labels:
   - **BLOCKER** — site is broken / SEO is being penalized / users hit a 404 / a tool doesn't work
   - **HIGH** — measurable ranking loss, conversion loss, or accessibility failure
   - **MEDIUM** — quality regression, technical debt, minor accessibility gap
   - **LOW** — cosmetic, code-smell, minor inconsistency
   - **NICE-TO-HAVE** — pure polish, optional

---

## 📐 SCOPE — EVERY DIMENSION BELOW

You audit every dimension. Skip nothing. The order below is the priority order.

### A. HTML correctness (per file, every line)
- `<!DOCTYPE html>` present and first
- `<html lang="...">` set correctly (en/de/ru where applicable)
- Exactly one `<title>`, one `<h1>`, one `<main>` or main landmark
- No unclosed tags, no nested `<a>`, no `<p>` inside `<p>`, no block-level inside inline
- All `<img>` have `alt`, `width`, `height`, `loading` set
- All `<a>` either have `href` or are buttons styled as links
- All `<form>` have `action`, `method`, every input has `<label for="...">`, every required input has `required` + accessible error pattern
- No duplicate `id` attributes within a page
- All `target="_blank"` paired with `rel="noopener"` (and `rel="noreferrer"` for external)
- No deprecated tags (`<center>`, `<font>`, `<u>` semantically misused, `<b>` vs `<strong>`)
- Inline event handlers (`onclick="..."`) — flag every occurrence (CSP risk + a11y risk)
- HTML entity correctness — no `&amp;amp;`, no broken UTF-8, no orphaned `&` characters
- `<meta charset="UTF-8">` first child of `<head>`
- `<meta name="viewport">` present with `width=device-width, initial-scale=1.0`

### B. SEO 2026 (Google + AI-overview ready)
- **Title tag** unique per page, 30–65 chars (rendered length, after entity decode)
- **Meta description** unique per page, 120–160 chars
- **Canonical** — every page has `<link rel="canonical">` pointing to its production URL with trailing slash consistency
- **Open Graph**: `og:title`, `og:description`, `og:type`, `og:url`, `og:image`, `og:site_name` — all present, all matching `<title>` / meta description
- **Twitter Card**: `summary_large_image`, plus `twitter:title`, `twitter:description`, `twitter:image`
- **hreflang** clusters: every page in DE/RU should have symmetric `hreflang` pointing to all language variants; English pages with translations should point at DE/RU; verify `x-default` points to English homepage, not self
- **robots meta**: `index,follow` on production; `noindex` on redirect pages
- **Schema.org JSON-LD** validity: every JSON-LD block must parse as valid JSON, schema types must be Google-supported, no orphan or stale references (e.g., a `BreadcrumbList` on `/compare/` pointing at `/guides/setting-up-thai-company/` is wrong)
- Schema coverage check: Article on every visa pillar, WebApplication on every tool, FAQPage where FAQ exists, BreadcrumbList everywhere, LocalBusiness on homepage, ItemList on hub pages
- **Internal anchor text**: every internal link should have descriptive anchor text, not "click here" or "read more" by itself
- **Heading hierarchy**: every page has exactly one `<h1>`, no skipped levels (h1→h3 without h2), no h6 used decoratively
- **Image SEO**: every content image has descriptive `alt`, decorative images use `alt=""`, file names are semantic (not `IMG_1234.jpg`)
- **URL structure**: lowercase, hyphen-separated, no trailing query strings on canonical, consistent trailing slash policy
- **Page indexability**: spot-check `/robots.txt` doesn't block valid pages; `/sitemap.xml` matches actual page inventory exactly (no ghosts, no missing pages)
- **Crawl budget waste**: any duplicate content (same body across multiple URLs without canonical pointing to one)
- **Helpful Content signal**: every page should have at least one `<time>` element with `datetime` attribute, an author byline, a "last updated" stamp
- **AI Overviews readiness**: every page should answer one specific question in the first 2 paragraphs (Google's SGE / AI Overviews pulls from this); flag pages where the first paragraph is decorative or generic
- **EEAT signals**: author bio, methodology link, dated content, source citations where claiming facts (especially around money / legal info)
- **Speakable schema** on key pages for voice search

### C. Accessibility (WCAG 2.2 AA)
- All interactive elements keyboard-reachable
- Focus order is logical
- `:focus-visible` styles present and visible
- Color contrast: 4.5:1 for body text, 3:1 for large text, 3:1 for UI controls — measure every text-on-background combination (use APCA or WCAG 2.x calculation)
- All form inputs have programmatic labels (`<label for>` or `aria-label`)
- Buttons have accessible names (visible text or aria-label)
- Icon-only buttons have `aria-label`
- Images have alt or `alt=""`
- Decorative SVGs have `aria-hidden="true"`
- Skip-to-content link present, functional, and visible on focus
- `prefers-reduced-motion: reduce` respected — flag any animation, transition, or `scroll-behavior:smooth` that doesn't honor it
- Form errors announced (aria-live, role="alert", or `aria-describedby` linkage)
- No content depends on color alone
- Touch targets ≥44×44px on mobile
- Page works zoomed to 200% without horizontal scroll
- `lang` attribute correct on `<html>` and on any foreign-language inline spans
- ARIA landmarks (`<header>`, `<nav>`, `<main>`, `<aside>`, `<footer>`) used appropriately, no double-landmarks
- Tab traps: any modal/drawer must trap focus correctly

### D. Performance (Core Web Vitals 2026)
- **LCP target ≤ 2.5s**: identify the LCP element on each page, verify it's not lazy-loaded, not waiting on JS, not far below the fold. Check `<img>` LCP candidates have `fetchpriority="high"`.
- **CLS target ≤ 0.1**: every `<img>` and `<iframe>` has `width` + `height`. Web fonts use `font-display: swap` with adequate fallback metrics. No JS that injects layout-shifting content after first paint.
- **INP target ≤ 200ms**: identify any handler doing more than 16ms of work; flag inline `<script>` blocks > 5KB.
- Font loading: `<link rel="preconnect">` to fonts.googleapis.com + fonts.gstatic.com (with `crossorigin`); ideally a `<link rel="preload" as="font" crossorigin>` for the most-used variant.
- CSS: every page has its own inline CSS — flag any pages that load a redundant external sheet; check for unused selectors (estimate, don't deep-prove).
- JS: no render-blocking `<script>` in `<head>` without `defer`/`async`; inline scripts should be at end of body or deferred.
- Image formats: any `.jpg` or `.png` that could be `.webp` or `.avif`.
- Total page weight: flag any HTML file > 80 KB (after gzip estimate ~25 KB).
- No `@import` chains in CSS.
- Loading attribute audit: `loading="lazy"` on every below-fold `<img>`, never on LCP candidates.

### E. Mobile UX (real mobile, 375px viewport)
- Bottom nav doesn't overlap content
- Marquee + brand pill + nav pill don't collide with hero h1
- All tap targets ≥ 44×44px
- No horizontal overflow anywhere — check `<table>`, `<pre>`, long `<code>`, and any fixed-width element
- Touch-action / scroll behavior — modal scrolling traps, double-tap zoom prevention
- Forms: keyboard type matches input (`type="tel"`, `type="email"`, `inputmode="numeric"`, autocomplete tokens)
- Visible viewport at top after nav clearance ≥ 200px
- Pinch-to-zoom NOT disabled (the meta viewport should allow user-scalable=yes implicitly)

### F. Desktop UX (1280px)
- Maximum content width sensible (700–1200px depending on context — 100% width text columns are unreadable)
- Hover states present on every interactive element
- Cursor changes appropriately on hover (pointer for buttons, text for inputs)
- No content cut off at any container
- No orphan widows in any heading

### G. Security headers + cookies
- `_headers` file present, parsed by Cloudflare correctly
- `Content-Security-Policy`: strict, no `unsafe-eval`, no `*` wildcards in script-src; report any `'unsafe-inline'` and whether necessary
- `Strict-Transport-Security`: max-age ≥ 1 year, includeSubDomains, preload
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN` or `frame-ancestors` in CSP
- `Referrer-Policy: strict-origin-when-cross-origin` (or stricter)
- `Permissions-Policy`: deny geolocation/microphone/camera/payment unless used
- `Cache-Control`: HTML 5min must-revalidate; static assets long+immutable
- No tracking pixels, no third-party cookies, no Google Analytics without consent (or document if consent is provided)

### H. Internal link structure (graph analysis)
- **Zero broken internal links**: every `<a href="/...">` must resolve to an existing file
- **Trailing slash consistency**: all internal directory links end in `/`
- **No orphan pages**: every production page is linked from at least one other page (intentional redirects can be orphan — flag them as such, not as error)
- **No black-hole links**: no page linked from only one other page deeper than 3 clicks from the homepage
- **Hub-spoke completeness**: every visa pillar links back to `/visas/`; every tool links back to `/tools/`; every guide links to at least one related visa pillar
- **External-link hygiene**: every external link has `target="_blank"` + `rel="noopener noreferrer"`; flag any external links to known low-authority or competitor sites
- **Anchor link integrity**: every `#fragment` link points to an existing `id="fragment"`
- **Sitemap integrity**: every URL in `/sitemap.xml` exists; every production page is in the sitemap; `lastmod` dates plausible (no future dates beyond today)
- **Redirect-chain detection**: flag any internal link that goes through 2+ redirects (e.g., `/visa` → `/visas/` → `/visas/dtv/`)

### I. Text quality + authenticity (content audit)
- **Voice consistency**: does every page sound like the same author? Flag pages where the voice drifts (e.g., overly formal vs. casual mixed in the same paragraph).
- **Date currency**: any page claiming "2024" or "current as of 2024" — flag as stale.
- **Number/fact spot-checks**: cross-reference cost claims (THB 800k retirement, THB 500k DTV, 17% LTR tax, etc.) across pages. Any contradiction = HIGH severity.
- **Specific claims without source**: any sentence stating "Royal Decree 743" or "Section 112" or "THB 800,000" should be supported by either a citation, a `/glossary/` link, or a primary-source reference.
- **AI-tell phrases**: phrases like "in today's fast-paced world," "leverage synergies," "delve into," "unleash the power of," "comprehensive guide," "navigating the complexities," "in the realm of" — every occurrence flagged (these are AI-generated tells that hurt EEAT).
- **Hedge / weasel words**: "may be," "could potentially," "in some cases" — flag if used in a place where a definitive answer should appear.
- **Grammar / typos**: every page proofread for typos, misplaced apostrophes, double spaces, " " vs " ", missing Oxford commas if the rest of the site uses them.
- **Inclusive language**: avoid gendered defaults ("he," "his"), nationalistic generalizations beyond what's required for visa rules.
- **Money symbol consistency**: THB vs ฿ vs Thai Baht — pick one per context, flag inconsistencies.
- **Number formatting**: `THB 800,000` vs `THB 800k` vs `฿800,000` — pick a convention.
- **Em-dash vs en-dash**: should be em-dash (—) for parenthetical, en-dash (–) for ranges. Flag any hyphen (-) used as em-dash.
- **Quotation marks**: consistent use of curly quotes ("..." not "...") OR straight, but not mixed.
- **Trademark / official names**: "Thailand Privilege" (current official name) vs "Thailand Elite" (former name) — verify usage is consistent and accurate.
- **Brand pronunciation guidance** for less-known Thai terms (TM30 = "tee-em-thirty", etc.) — flag pages that introduce a term without explanation.

### J. CSS audit
- Every CSS variable used and defined — flag any usage of `var(--foo)` where `--foo` is not defined in `:root`
- Specificity wars — any `!important` flags
- Duplicate rules across pages where they could be consolidated
- Browser-prefix outdated (`-webkit-*` without spec equivalent)
- `@media (max-width: ...)` consistency — pick breakpoints and stick to them; flag any inconsistent breakpoints (we use 760px + 640px + 1024px — flag stragglers)
- Z-index sanity — flag any z-index ≥ 100 without a clear stack rationale
- Unused selectors per page (be conservative — estimate, don't promise eradication)

### K. JS audit
- No `console.log`, `console.warn`, `console.error` in production code
- No `alert()`, `confirm()`, `prompt()` (we replaced these earlier — verify zero remaining)
- Every `addEventListener` has a corresponding ID/selector that exists in HTML at the time of registration (account for dynamic injection like resetQuiz)
- No `eval()`, no `new Function()`, no `innerHTML` with user-controlled string interpolation
- No unhandled Promise rejections, no `.then` without `.catch`
- All `for` loops bounded, no infinite loops possible
- No `var` where `let`/`const` would be safer (low priority but flag)
- IIFE pattern used consistently for tool scripts
- No global namespace pollution beyond `window.__mnavLoaded`

### L. Schema.org JSON-LD deep validation
- Every `<script type="application/ld+json">` block:
  - Parses as valid JSON (try parsing each)
  - Has `@context` set to `"https://schema.org"` (with `https`, not `http`)
  - `@type` is a valid schema.org type
  - All required fields for that type present
  - URLs are absolute, not relative
  - Dates are ISO 8601
  - No leftover Codex-template data (e.g., "Setting Up a Thai Company" Article schema bleeding onto unrelated pages — flag any cross-contamination)
- Cross-page consistency: `Organization` properties (name, url, logo) identical everywhere

### M. Cross-language coverage (i18n)
- `/de/` and `/ru/` pages: verify content is actually translated, not just shell pages
- `hreflang` clusters symmetric (every language variant points at all others)
- `<html lang>` matches actual content language
- Currency / date formatting localized appropriately

### N. Cookie & privacy
- Privacy policy page exists, linked from footer of every page
- Terms page exists, linked from footer
- Any third-party scripts or pixels — document them; verify their privacy policy is referenced

### O. File-level forensics
For each HTML file (sampling allowed for repetitive page types like glossary subpages):
- Total file size in bytes
- Unique tag count (sanity check for hand-built consistency)
- BOM / encoding correctness
- Trailing whitespace / mixed line endings (CRLF vs LF) — flag if mixed
- Final closing `</html>` present
- No leftover comment blocks containing dev notes ("TODO", "FIXME", "tim", "claude", "codex", "fix later", "wip")

### P. Tool functional audit (the 9 interactive tools)
For each of:
- `/tools/visa-finder/`
- `/tools/cost-calculator/`
- `/tools/income-test/`
- `/tools/document-checklist/`
- `/tools/currency-converter/`
- `/tools/expiry-countdown/`
- `/tools/bank-checker/`
- `/tools/eligibility/`
- `/tools/reminder/`

Trace the user flow in HTML+JS only (no browser execution available to you):
- Form inputs match the IDs referenced in the JS
- Click handler attached at correct event
- Result rendering uses elements that exist in HTML
- No JS syntax errors
- Empty-state validation present
- Mobile auto-scroll behavior present
- Result CTA links go to current WhatsApp / mailto / LINE format

### Q. Brand-asset / pixel-level UI
- Brand pill at top-left always uses the exact wordmark: `PATTAYA<accent>VISA</accent>HELP` (with the pink "VISA")
- Marquee text is uppercase mono with `letter-spacing: .18em` consistently
- Footer credit always says "PART OF THE PATTAYA AUTHORITY NETWORK · BUILT BY TIM PAEMI"
- Coords always `12.9236°N · 100.8825°E · CHONBURI` (or accept `12.92` / `100.88` if that's what's deployed — but flag inconsistency between the two)
- Color usage of `--pink` / `--cyan` / `--yel` / `--pur` / `--grn` consistent per page type (each visa pillar has a primary accent — flag any pillar using the wrong one)

---

## 📋 OUTPUT FORMAT — exactly as below

Write to `C:\pattayavisahelp\_research\CODEX_NUCLEAR_AUDIT_REPORT.md` with this exact structure:

```markdown
# CODEX NUCLEAR AUDIT REPORT — pattayavisahelp.com
Generated: <ISO date>
Files scanned: <count>
Total findings: <count>

## EXECUTIVE SUMMARY
- BLOCKER count: N
- HIGH count: N
- MEDIUM count: N
- LOW count: N
- NICE-TO-HAVE count: N

The top 5 things Tim should fix today (regardless of category):
1. ...
2. ...
3. ...
4. ...
5. ...

---

## A. HTML CORRECTNESS
### A.1 — <severity> — <one-line summary>
File: `path/to/file.html`
Line: 42
Found: `<actual code or text>`
Why: <one-sentence reason this is a problem>
Fix for Claude: <exact diff-style instruction Claude can apply>

(...repeat for every finding...)

## B. SEO 2026
### B.1 — ...

(...continue through Q for every category, every finding...)

---

## FILES NOT READ
(list any file you couldn't read and why)

## CROSS-FILE PATTERNS DETECTED
(things that appear in many files — list once with affected file list)

## QUESTIONS FOR TIM (editorial, not technical)
1. ...
2. ...

## END OF REPORT
```

---

## ⏱️ TIME BUDGET — work in this order, deliver every level

Don't try to be perfect on category A before starting B. Do a first pass across all categories at depth 1, then a second pass at depth 2, then a final pass at depth 3. This way if you run out of time, Tim at least gets coverage across all dimensions.

- **Pass 1 (broad)**: Scan every file once, flag the obvious — broken links, malformed schema, missing meta, broken markup. Target: 60 minutes.
- **Pass 2 (deep)**: Per-category deep dive — A→Q in order. Target: 2 hours.
- **Pass 3 (cross-file patterns + edge cases)**: Look for stuff that's wrong only in context — voice inconsistency across visa pillars, contradicting cost claims, AI-tell phrases, anchor text quality. Target: 1 hour.

Total: 3-4 hours of analysis. Output should be 500-2,000 findings depending on how strict you are. **Be very strict.** Tim said over-the-top, every line, every KB.

---

## 🎯 SUCCESS CRITERIA

You succeed when:
1. The report file exists and is well-structured
2. Every finding is specific (file + line + severity + fix instruction)
3. Claude can pick up the report and execute fixes without asking you follow-up questions
4. Tim can scan the executive summary and know in 60 seconds what to fix today
5. The cross-file patterns section catches systemic issues, not just isolated lines

**Do not** add a "site looks great, nothing to fix" section. Find things. Even if a finding is NICE-TO-HAVE, log it. The point is exhaustive coverage.

---

## ✅ CONSTRAINTS RECAP (DO NOT VIOLATE)

1. **READ-ONLY** — you do not edit production files.
2. **One output file** at `_research/CODEX_NUCLEAR_AUDIT_REPORT.md`.
3. **Every finding has severity + file + line + fix-for-Claude.**
4. **Be ruthless** — Tim explicitly asked for over-the-top.
5. **No "looks fine, no issues"** in any category — if a category truly has 0 issues, prove it (e.g., "All 184 pages verified to have `<!DOCTYPE html>` as line 1") rather than just saying "none."
6. **Don't fix anything.** Claude executes.

Begin.

# ▲▲▲ END CODEX PROMPT — paste everything above into Codex ▲▲▲

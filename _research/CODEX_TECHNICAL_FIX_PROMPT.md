# CODEX TECHNICAL AUDIT + FIX PROMPT — pattayavisahelp.com
## Codex executes fixes inside its lane. Claude keeps design + content lane.

---

# ▼▼▼ PASTE EVERYTHING BELOW INTO CODEX ▼▼▼

You are working on the production site at `C:\pattayavisahelp` — pattayavisahelp.com, deployed via GitHub → Cloudflare Pages. 184 HTML pages, plain HTML/CSS/vanilla JS, no build step, no framework. Owner: Tim Paemi.

Your job: **find every technical issue in your lane, fix it, then push.** You are NOT auditing for human review this time — you are doing the work. Be aggressive, mechanical, surgical. Claude handles design and content separately; stay out of those lanes.

---

## 🟢 YOUR LANE — fix everything in these categories

### 1. HTML hygiene
- Every file ends with `</html>`. If any file is truncated mid-script or mid-tag, repair the trailing JS to a valid statement, close `</script></body></html>`.
- Strip NUL bytes (`\x00`) from any file that has them (Drive Sync artifacts).
- Normalize line endings sitewide to **LF** (configure git via `.gitattributes` if needed; convert existing files).
- Remove any leftover dev comments containing `TODO`, `FIXME`, `tim`, `claude`, `codex`, `wip`, `xxx`, `hack`.
- No inline `onclick=` / `onmouseover=` event handlers — convert to addEventListener if you find any.
- No duplicate `id` attributes within a single page — rename the lower-priority one.
- Fix any unclosed tags, mismatched nesting, attributes without quotes.
- Ensure every `<html>` has `lang="..."` matching the page (en / de / ru).
- Ensure every `<head>` starts with `<meta charset="UTF-8">` then `<meta name="viewport">`.

### 2. Performance + Core Web Vitals
- Add `defer` or `async` to every `<script src="...">` in `<head>` that doesn't already have it. The mnav inline script should stay `<script defer>`.
- Add `loading="lazy"` to every `<img>` below the fold; **never** to the LCP hero image (mark the LCP `<img>` with `fetchpriority="high"` instead).
- Ensure every `<img>` has both `width` and `height` attributes (prevents CLS). Use intrinsic dimensions where possible; if unknown, sensible defaults are acceptable.
- Add `<link rel="preconnect" href="https://fonts.googleapis.com">` + `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>` if missing.
- Add `<link rel="preconnect" href="https://www.googletagmanager.com">` + `<link rel="preconnect" href="https://www.google-analytics.com">` for the GA gtag.
- Verify Google Fonts URLs use `display=swap`.
- Detect any `<script>` blocks over 5KB inline in `<head>` and move them to the end of `<body>` or extract to `/assets/`.

### 3. SEO 2026 (technical only — DO NOT rewrite content)
- Every page has unique `<title>` ≤ 65 chars.
- Every page has `<meta name="description">` ≤ 160 chars.
- Every page has `<link rel="canonical">` matching the production URL with trailing slash.
- `og:type`, `og:title`, `og:description`, `og:url`, `og:image`, `og:site_name` all present.
- `twitter:card="summary_large_image"`, `twitter:title`, `twitter:description`, `twitter:image` all present and matching the og: equivalents.
- Cross-page: `og:title`/`twitter:title` matches `<title>`. If mismatch, sync them.
- `robots` meta: production pages have `index,follow`; redirect pages have `noindex,follow`.
- Hreflang clusters: every DE / RU page points to all language variants AND the English equivalent; `x-default` points at the English homepage (NOT self-pointing).
- Sitemap.xml: every production page is present, every URL in sitemap resolves to an existing file. Lastmod dates should not exceed today (no future dates).
- Strip any stale `<script type="application/ld+json">` blocks that reference pages they shouldn't (e.g., "Setting Up a Thai Company" BreadcrumbList showing up on unrelated pages).

### 4. Schema.org validity
- Every `<script type="application/ld+json">` block must parse as valid JSON. If you find one that doesn't, fix the JSON.
- `@context` must be exactly `"https://schema.org"` (not `http://`).
- Every Article needs: headline, author, publisher, datePublished, dateModified, mainEntityOfPage, image.
- Every BreadcrumbList: positions sequential, items have `name` + `item` (URL).
- Every WebApplication (the 9 tool pages): `applicationCategory`, `operatingSystem`, `offers` with `price="0"`.
- Cross-page consistency: `Organization` properties identical across every page (same name, url, logo).

### 5. Internal link integrity
- Every internal `href="/..."` must resolve to an existing file. If broken, fix the slug to the closest existing path (don't delete the link, repair it).
- Trailing slash consistency: directory links end in `/`.
- No links to `/v2-preview/` from production pages.
- No `<a>` with empty `href=""` or `href="#"` without a click handler — replace with `<button>` or remove.
- Every `target="_blank"` paired with `rel="noopener"` (and `rel="noreferrer"` for true external).
- Anchor fragments (`#fragment`) all resolve to existing `id` attributes.

### 6. Accessibility (WCAG 2.2 AA — code-level)
- Every `<img>` has `alt`. Decorative ones: `alt=""`. Content ones: descriptive.
- Every `<button>` has visible text or `aria-label`.
- Every `<form>` input has a `<label for="...">` matching its id.
- Decorative SVGs: `aria-hidden="true"` and `role="img"` removed.
- Every page has exactly one `<h1>`.
- No heading skips (h1 → h3 without h2).
- `<html lang>` correct.
- Skip-to-content link present and has a valid `#main` (or similar) target.
- `prefers-reduced-motion: reduce` respected — every animation/transition disabled inside that media query.

### 7. JS quality
- No `console.log`, `console.warn`, `console.error` in production scripts. Remove them.
- No `alert()`, `confirm()`, `prompt()`. Already replaced earlier — verify zero remaining.
- No `eval()`, no `new Function()`.
- IIFE pattern preserved on tool scripts.
- Every `addEventListener` references an element that exists in the same file (tool quiz scripts use dynamic injection — verify the target exists at handler-attach time).

### 8. CSS quality
- Every `var(--foo)` references a `--foo` defined on `:root` or an ancestor. If not, define it.
- No `!important` overrides except in the documented mobile-fix and a11y blocks.
- Browser prefix consistency.

### 9. CSP + security headers
- `_headers` file present and valid.
- CSP `script-src` includes: `'self'`, `'unsafe-inline'`, `https://www.googletagmanager.com`, `https://www.google-analytics.com`.
- CSP `connect-src` includes: `'self'`, `https://www.google-analytics.com`, `https://*.google-analytics.com`, `https://*.analytics.google.com`, `https://api.resend.com`.
- CSP `img-src` includes: `'self'`, `data:`, `https:`.
- CSP `style-src` includes: `'self'`, `'unsafe-inline'`, `https://fonts.googleapis.com`.
- CSP `font-src` includes: `'self'`, `https://fonts.gstatic.com`, `data:`.
- HSTS: `max-age=31536000; includeSubDomains; preload`.
- X-Content-Type-Options: `nosniff`.
- Referrer-Policy: `strict-origin-when-cross-origin`.
- Permissions-Policy: deny geolocation, microphone, camera, payment unless used.

### 10. Google Analytics (gtag) integrity
- Every production page (excluding redirect pages like `tools/ltr-eligibility/`) has the gtag snippet for `G-RSNN24M25C`.
- The snippet is in `<head>` and loaded `async`.
- No duplicates (one gtag block per page, not two).
- CSP allows the gtag domains (covered above).

---

## 🔴 NOT YOUR LANE — DO NOT TOUCH

1. **The empire design system.** Colors (`--bg`, `--pink`, `--cyan`, `--yel`, `--pur`, `--grn`, `--wa`), fonts (Space Grotesk / JetBrains Mono / Inter), the marquee, the brand pill at `top:42px left:24px`, the nav pill at `top:42px right:24px`, the hero `padding-top:140px` clearance, the mobile bottom nav. **These are locked.** Claude owns them.

2. **Page content text.** Visa pillar prose, FAQ answers, tool descriptions, blog posts, glossary definitions — do not rewrite. If a sentence is factually wrong, flag it; do not edit.

3. **The 12 visa pillars and the 9 tools' JavaScript.** The tools' JS is hand-written interactive logic. Don't rewrite it. The only edits allowed inside `<script>` blocks of tool pages are: remove `console.log`, replace `alert()` with the established empire-style inline error pattern, add `defer` to `<script>` in head.

4. **Footer credit text.** Must always say something equivalent to "Part of the Pattaya Authority network · Built by Tim Paemi · info@pattayavisahelp.com · WA +66 96 728 6999 · LINE @timpaemi". Don't reword.

5. **Contact channels.** The official channels are: `info@pattayavisahelp.com`, `https://api.whatsapp.com/send/?phone=66967286999&text=...`, `https://line.me/ti/p/~timpaemi`. Don't change them.

6. **Domain identity.** `pattayavisahelp.com` is the canonical. Don't introduce alt domains.

7. **Plugins / build tools / frameworks.** Do not add Tailwind, React, Vue, jQuery, npm, Webpack, Vite, Astro, Hugo, Jekyll, or any build step. The site is plain HTML/CSS/JS by design.

8. **Cloudflare Pages Functions** in `/functions/`. Don't touch unless you find a clear syntax error.

9. **The `_research/` folder.** Don't write there except for your own final report.

10. **Git commits.** You may push, but every commit message must start with `[Codex tech pass]:` so Tim can audit what came from you vs. Claude.

---

## 📋 WORKFLOW

1. **Pass 1 — Scan and queue.** Walk every file once. Build a list of every fixable issue per category 1–10. No edits yet.

2. **Pass 2 — Apply fixes in this priority order:**
   - HTML hygiene (truncations, NULs, missing closing tags) — these are BLOCKING
   - Schema validity
   - Internal link repair
   - Accessibility code fixes
   - Performance attributes (defer, lazy, fetchpriority, width/height)
   - SEO meta sync
   - JS cleanup
   - CSS variable validation
   - Security headers / CSP
   - GA gtag integrity

3. **Pass 3 — Verify.** Re-walk every file. Confirm fixes landed. Catch second-order issues introduced by fixes.

4. **Pass 4 — Commit + push.** Use commits like:
   - `[Codex tech pass]: Close 12 truncated HTML files`
   - `[Codex tech pass]: Add fetchpriority and width/height to LCP images`
   - `[Codex tech pass]: Fix 47 broken internal links`
   - Etc. Group by logical change. Keep commits ≤ 200 file diffs.

5. **Pass 5 — Final report.** Write a markdown summary at `C:\pattayavisahelp\_research\CODEX_TECH_FIX_REPORT.md` with: total files modified, count by category, top 10 most impactful fixes, anything you couldn't safely fix (for Claude to handle).

---

## ⚙️ EXECUTION RULES

- **Idempotent edits.** Re-running your own fix shouldn't double-apply. Use markers (CSS comments like `/* SEO-FIX-V1 */`, `<!-- TECH-FIX -->`) or before-edit content checks.
- **Don't touch files you don't need to.** If a page is clean in your lane, skip it. Smaller diffs = easier reviews.
- **Never break a working tool.** If a fix would touch tool JS, double-check the tool still works mentally before applying.
- **Trust nothing without verifying.** If you think a finding is a false positive, prove it (read the file, search for the term in context).
- **No design opinions.** If you find yourself thinking "the spacing here is wrong" or "this color is ugly" — stop. That's Claude's lane. Move on.
- **Commit frequently.** Small commits beat one mega-commit if something goes sideways.
- **Use git, not file copies.** Don't rename to `.bak`; if you need a checkpoint, commit.

---

## 🚨 ABORT CONDITIONS

Stop and write your partial report to `_research/CODEX_TECH_FIX_REPORT.md` if:

- More than 10 files fail to parse after your fix attempt
- Any fix would require rewriting > 50 lines of content
- You hit a "real" tool JS bug that needs Claude's design context to fix
- You're uncertain whether a fix is in your lane — when in doubt, log it for Claude instead of touching

---

## ✅ DEFINITION OF DONE

You're done when:

1. Zero files truncated (every file ends with `</html>`)
2. Zero JSON-LD parse errors
3. Zero broken internal links
4. Zero pages missing required meta tags (title, description, canonical, OG, Twitter, robots)
5. Zero `<img>` missing `alt`
6. Zero pages with multiple `<h1>` or skipped heading levels
7. Every `<script src>` in `<head>` has `defer` or `async`
8. Every `<img>` has `width` + `height`
9. `_headers` CSP includes all required Google Analytics + Resend + Cloudflare domains
10. Final report written to `_research/CODEX_TECH_FIX_REPORT.md`
11. All commits pushed to `origin/main` with `[Codex tech pass]:` prefix
12. You've left a clean handoff to Claude listing anything outside your lane that still needs work

Go.

# ▲▲▲ END CODEX PROMPT ▲▲▲

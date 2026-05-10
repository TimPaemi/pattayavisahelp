# NUCLEAR AUDIT PROMPT — Pattaya Visa Help

**Paste the section below into Codex / GPT-5 / Claude Opus / Cursor / o1-pro / any agentic coding assistant with file-system access to `C:\pattayavisahelp`.**

---

## Your role

You are a Principal Web Auditor with 15+ years experience across SEO, accessibility (WCAG 2.2 AA), Core Web Vitals, schema.org, Cloudflare Pages, and conversion optimization for lead-generation sites. You work for top-tier audit firms (Ahrefs, SEMrush enterprise tier, Backlinko).

You have **read access** to every file in `C:\pattayavisahelp` (this is a deployed static site at https://pattayavisahelp.com). The site is built with vanilla HTML + Tailwind CDN + Cloudflare Pages Functions for `/api/*` routes.

Your job: produce **the most exhaustive audit humanly possible**. Leave no rock unturned. Find every issue, every micro-improvement, every regression risk. **No false positives** — only flag things that are real problems with real impact. Cite file paths and line numbers for every finding.

## What this site is

- **Topic:** Independent Thailand visa guidance from Pattaya. Lead-generation site for visa consulting.
- **Stack:** Static HTML / Tailwind via cdn.tailwindcss.com / vanilla JS / Cloudflare Pages + Functions
- **Scale:** ~107 HTML pages, 209 JSON-LD schema blocks, 9 split XML sitemaps, RSS feed, llms.txt
- **Critical APIs:** `/functions/api/lead.js` (Resend + KV + Slack/Discord webhooks), `/functions/api/subscribe.js` (newsletter)
- **Critical config files:** `_headers`, `_redirects`, `robots.txt`, `sitemap_index.xml`, `llms.txt`, `feed.xml`, `site.webmanifest`
- **Brand:** Pattaya Visa Help (PVH). Logo: blue shield gradient (#0ea5e9 → #0c4a6e) with white "P". Plus Jakarta Sans display, Inter body, Instrument Serif italic accents, JetBrains Mono eyebrows. Gold (#fbbf24) accent color. Dark footer (#0a0e1a). Email `info@pattayavisahelp.com`. WhatsApp `+66967286999`.

## Audit dimensions — exhaustive list

For EACH dimension below, walk through the entire repo and report findings. Use the **severity rubric** at the end.

### 1. HTML structure & validity
- Doctype, `<html lang>`, `<head>`, `<body>`, `</body></html>` present and correctly closed on every page
- No orphan tags, no h3/h4 close-tag mismatches, no unclosed `<div>`/`<section>` runs
- Self-closing void elements not double-closed (`<br>`, `<hr>`, `<img>`, `<input>`, `<link>`, `<meta>`)
- No deprecated tags (`<center>`, `<font>`, `<marquee>`, `<blink>`)
- No `<table>` used for layout

### 2. SEO meta — per-page
- `<title>` 25-70 chars, unique, keyword-front-loaded
- `<meta name="description">` 80-175 chars, unique, persuasive
- `<link rel="canonical">` absolute URL, self-referential, correct trailing slash
- Full OG tag set: `og:title`, `og:description`, `og:type`, `og:url`, `og:image`, `og:site_name`
- Twitter Card: `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`
- `hreflang` tags for `en`, `en-th`, `x-default` — all self-referential
- RSS auto-discovery `<link rel="alternate" type="application/rss+xml">`
- Theme color, color-scheme, viewport meta
- Charset declared in first 1024 bytes

### 3. Schema.org / JSON-LD
- Every JSON-LD block is **valid JSON** (parse it)
- Types used: `LocalBusiness`, `Organization`, `WebSite` (with `SearchAction`), `WebPage` (with `Speakable`), `Service`, `Article`, `FAQPage`, `HowTo`, `BreadcrumbList`, `AboutPage`, `ContactPage`, `Person`
- `@id` graph: pages reference `#business`, `#website`, `#webpage` consistently
- BreadcrumbList present on every non-homepage page with correct hierarchy
- Article schema has `dateModified` within last 90 days
- Verify schema against schema.org spec — flag missing required properties
- Run through Google's Rich Results Test mental model — would it qualify?

### 4. Headings hierarchy
- Exactly one `<h1>` per page, contains primary keyword
- No skipped levels (h1→h3 is invalid; h2 must precede h3)
- No empty headings
- H1 between 20-70 chars, descriptive

### 5. Internal & external links
- Every internal `href` resolves to an existing file or `/`-rooted route
- No relative `..` paths beyond legitimate context
- `target="_blank"` always paired with `rel="noopener"` (also `noreferrer` recommended for external)
- No `href=""`, `href="#"`, or `href="javascript:"`
- All in-page anchor `#fragment` links point to elements with matching `id`
- WhatsApp links use canonical `wa.me/66967286999`
- Email links use `mailto:info@pattayavisahelp.com`

### 6. Images
- Every `<img>` has `alt` (descriptive, not filename), `loading="lazy"` (except above-fold hero), `decoding="async"`, `src`, explicit `width` + `height` to prevent CLS
- No oversized images (>200KB each, >5MB total)
- SVGs preferred over PNG for icons
- Flag URLs hotlinking to third-party CDNs without fallback

### 7. Mobile responsiveness (Core Web Vitals + UX)
- `<meta name="viewport" content="width=device-width, initial-scale=1.0">` on every page
- No fixed pixel widths > 100vw at 320px/375px/414px breakpoints
- Tap targets ≥ 44×44 px (WCAG 2.5.5)
- Body font ≥ 16px (prevents iOS zoom on input focus)
- Inputs `font-size: 16px+` to prevent zoom
- No horizontal scroll on any page at 320px
- Safe-area-inset respected for notched phones
- Mobile menu, sticky CTAs, floating WhatsApp button all reachable

### 8. Accessibility (WCAG 2.2 AA)
- Color contrast ≥ 4.5:1 for body text, 3:1 for large text (test palette pairs: ink-on-paper, slate-600-on-white, brand-700-on-brand-50, white-on-ink, gold-400-on-ink)
- Every interactive element keyboard-reachable, has visible focus state
- Icon-only buttons have `aria-label`
- Form inputs have associated `<label>` or `aria-label`
- Skip-to-content link present
- No `tabindex` > 0
- ARIA used correctly (no redundant roles, no invented attributes)
- Headings + landmarks support screen-reader navigation
- Reduced-motion media query respected for animations

### 9. Performance
- `<link rel="preconnect">` to fonts.googleapis.com, fonts.gstatic.com, cdn.tailwindcss.com
- Google Fonts URL includes `&display=swap`
- Tailwind CDN intentionally synchronous (acceptable for this site, but flag if there's a better path)
- Critical CSS could be inlined for faster LCP
- Total page weight per route < 500KB if possible
- HTML response time goal < 200ms (Cloudflare edge)
- Check `_headers` for proper Cache-Control on assets vs HTML
- HSTS, CSP, X-Frame-Options, Referrer-Policy headers present and sane

### 10. Cloudflare Pages Functions
- `/functions/api/lead.js` parses correctly (no truncation), handles OPTIONS preflight, validates input, sanitizes, integrates Resend + KV + Slack + Discord, has error handling
- `/functions/api/subscribe.js` same review
- All env vars documented in comments at top of file
- No secrets committed
- CORS headers correct for the origin

### 11. XML sitemaps
- `sitemap_index.xml` valid XML, references all child sitemaps
- Each `sitemap-*.xml` valid, every `<loc>` reachable, every `<lastmod>` ≤ today
- No duplicate URLs across sitemaps
- Priorities sensible (homepage = 1.0, pillars = 0.9, etc.)
- `<changefreq>` matches content type
- robots.txt references both `sitemap.xml` and `sitemap_index.xml`

### 12. robots.txt, llms.txt, feed.xml
- robots.txt allows all major crawlers, disallows `/api/`, `/functions/`, `/_research/`
- llms.txt starts with H1, lists canonical URLs, mentions tier-1 sources
- feed.xml is valid RSS 2.0, items have `<guid>`, `<pubDate>`, `<link>`, `<description>`

### 13. PWA + favicons
- `site.webmanifest` valid JSON, includes `name`, `short_name`, `icons`, `theme_color`, `background_color`, `start_url`, `display`
- All favicon sizes present (16, 32, 180 apple-touch-icon, SVG)
- Theme-color meta matches manifest

### 14. Content quality
- No "Lorem ipsum", "TODO", "FIXME", "placeholder", "example.com", "YOUR_TOKEN" outside HTML comments
- No typos in product/brand names: "Thailand" (not "Thialand"), "DTV" (not "DVT"), "Pattaya"
- Date references: any "2024" or "2023" that should be "2026"?
- Visa amounts consistent: ฿800k retirement bank, ฿65k/month income, ฿40k/month marriage
- Fact-check: Royal Decree 743 (LTR tax exemption), TM30 24-hour rule, 90-day reporting
- Reading-time stamps present on all guide/visa/profession pages

### 15. Brand consistency
- Email always `info@pattayavisahelp.com` (no other addresses except `leads@` for sender)
- WhatsApp always `+66 96 728 6999` or `wa.me/66967286999`
- Brand name always "Pattaya Visa Help" (not "PattayaVisaHelp" or "Pattaya Visahelp")
- Logo SVG identical sitewide (brand-500 → brand-900 gradient shield)
- Font stack consistent (no rogue system fonts)

### 16. Forms
- Every `<form>` has `method` attribute
- Every `<input>` (non-submit/button) has `name`
- Honeypot field present (typically `name="website"`)
- Submit buttons have `type="submit"` (default but explicit is better)
- Form action points to working endpoint
- Cloudflare Turnstile widget render placeholder present (currently commented out)

### 17. Navigation & footer
- Main nav has: Visas, Guides, Tools, Compare, About
- Footer has: About us, Methodology + sources, FAQ, Changelog, Contact, Privacy policy, Terms of service
- Footer has Pattaya Authority credit (https://pattaya-authority.com/) on every page
- WhatsApp floating button present, desktop sticky CTA + mobile sticky CTA configured

### 18. Conversion / CTAs
- Every page has at least one clear CTA above the fold
- Free consultation flow reachable in ≤ 2 clicks from anywhere
- Lead form fields minimal (name, email, visa interest, situation) — flag if more added
- Trust signals (methodology link, "real human reply within 24h") visible near CTAs

### 19. Information architecture
- No orphan pages (unreachable from internal nav)
- Pillar pages cross-link to relevant comparisons, professions, budgets
- Every category hub (`/visas/`, `/tools/`, `/compare/`, etc.) lists all its children
- Breadcrumbs reflect the URL hierarchy

### 20. Local SEO
- LocalBusiness schema has full address, geo coordinates, opening hours, area served
- Address: Pattaya, Chonburi 20150, TH
- Geo: lat 12.9236, lng 100.8825 (verify against actual Pattaya center)
- NAP (name, address, phone) consistent across schema, footer, contact page

### 21. Tax/legal disclaimers
- "Not a law firm" disclaimer present in footer
- "Information and matching service" framing consistent
- Privacy policy + terms of service reachable, current
- No false "guaranteed approval" claims anywhere

### 22. JavaScript health
- No inline `onclick` (use `data-action` + delegated listener instead)
- All event listeners attached, no broken handlers
- No console errors on page load
- Mobile menu, expiry countdown, currency converter, reminder tool, visa-finder quiz all functional
- No `localStorage`/`sessionStorage` API abuse

### 23. Regression risks
- Google Drive Sync has previously truncated files (homepage 3×, lead.js 1×, 404.html 1×, two tools 2×). Verify no current truncations.
- `.tmp.driveupload/` not tracked in git
- `.gitignore` includes drive temp patterns
- No committed files > 100MB

## Output format — REQUIRED

Produce a single markdown file `audit-report.md` with this structure:

```
# Audit Report — pattayavisahelp.com

**Run date:** YYYY-MM-DD
**Total findings:** N
**Critical:** X / **High:** X / **Medium:** X / **Low:** X / **Info:** X

## Executive summary
(3-5 sentences. What's the overall health? What's the single biggest risk? What's the biggest opportunity?)

## Findings — by severity

### CRITICAL (deploy blockers / SEO disasters / security holes)
1. **[FILE:LINE] Short title**
   - **Issue:** what's wrong
   - **Impact:** why it matters
   - **Fix:** exact change to make
   - **Effort:** 5min / 1hr / 1day

### HIGH (significant user/SEO impact, fix within a week)
...

### MEDIUM (best practice, fix within a month)
...

### LOW (polish, fix when convenient)
...

### INFO (observations, not action items)
...

## Quick-win checklist (top 10 highest impact, lowest effort)
1. ...
2. ...
...

## Strategic recommendations (longer-horizon, beyond simple fixes)
1. ...
2. ...
...

## Files inspected
- Total files: N
- Total HTML pages: N
- Total schema blocks: N
- Total internal links: N
- Sitemap URLs: N
```

## Severity rubric

- **CRITICAL** — breaks deployment, exposes secrets, breaks core functionality, causes Google to deindex, blocks visa lead conversion, broken on >20% of pages
- **HIGH** — measurable SEO/UX impact, broken on multiple pages, missing required schema, mobile broken, accessibility WCAG fail
- **MEDIUM** — best practice deviation, minor SEO miss, copy improvement, single-page issue
- **LOW** — cosmetic, edge case, future-proofing
- **INFO** — context-only, no action needed

## Final instructions

- Be **specific**. "Improve SEO" is useless. "On `/visas/dtv/` line 14, title is 72 chars — recommend trimming to `Destination Thailand Visa (DTV) — Eligibility, Cost, Apply`" is useful.
- Be **comprehensive**. Don't stop at 10 findings. Aim for 50-150 specific, actionable items. Even if 80% are MEDIUM/LOW, the volume creates a real roadmap.
- Be **brutal but accurate**. No fake findings to pad the list.
- **Validate everything programmatically** where possible (parse JSON-LD, regex-check meta lengths, count headings, fetch each `href`).
- **Group similar findings** — if 40 pages have the same issue, one finding lists all 40 paths, not 40 separate findings.

Now go.

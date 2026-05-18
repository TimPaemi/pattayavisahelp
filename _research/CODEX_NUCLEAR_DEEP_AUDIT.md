# CODEX NUCLEAR DEEP AUDIT — pattayavisahelp.com

**Mode:** READ-ONLY · NO COMMITS · NO FIXES · NO FILE MODIFICATIONS
**Deliverable:** single comprehensive markdown report at `_research/CODEX_NUCLEAR_DEEP_AUDIT_REPORT.md`
**Date initiated:** 2026-05-18
**Repo path:** `C:\pattayavisahelp` (local) / `https://github.com/TimPaemi/pattayavisahelp` (origin)
**Live URL:** `https://pattayavisahelp.com` (Cloudflare Pages, auto-deploy on push)

---

## CONTEXT

This is the most exhaustive audit ever requested on this codebase. Tim has spent 3 months building a one-man-show Thailand visa reference site and now wants a line-by-line, KB-by-KB analysis to identify literally everything that could be improved. The site has already been through 4 prior Codex passes (tech-SEO normalization, tool-interaction hotfix, performance/accessibility/schema nuclear pass, full audit) and 6 Claude trust-hardening commits.

**Your job:** find the things prior passes missed. Be relentlessly thorough. Read every file. Analyze every line. Flag every imperfection. Tim has explicitly asked for "100% perfect." Help him get there.

**Claude's job (after this audit):** read your report and ship the fixes. Lane separation: Codex audits, Claude fixes.

---

## ACCESS YOU HAVE

1. **Local repo** at `C:\pattayavisahelp` — 186 HTML files, 11 sitemap XML files, `_headers`, `_redirects`, `llms.txt`, `robots.txt`, `feed.xml`, `sitemap.html`, `api/visa-data.json`, IndexNow key file, favicon system, manifest, web functions at `functions/api/`, research notes at `_research/`.
2. **GitHub** at `github.com/TimPaemi/pattayavisahelp` — full git history, every commit, every diff.
3. **Live deployed site** at `pattayavisahelp.com` — Cloudflare Pages, full request/response inspection available.
4. **Web access** — competitor research, SERP checks, Lighthouse PSI calls, schema.org validator, axe-core, Pa11y, W3C HTML validator, W3C CSS validator, mobile-friendly test, robotstxt validator, sitemap validator, hreflang validator, IndexNow status.
5. **Install anything you need** — Playwright, Puppeteer, Lighthouse CLI, axe-core CLI, Pa11y CLI, html-validate, stylelint, eslint, broken-link-checker, image-optimization probes. Use `/tmp/codex-nuclear/` for any installations.

---

## SCOPE — WHAT TO AUDIT (THE 18 DIMENSIONS)

For each of the 18 dimensions below, you must: (a) survey every file/page where applicable, (b) report counts and percentages, (c) cite specific file paths + line numbers for every finding, (d) classify severity (P0/P1/P2/P3), (e) propose a concrete fix where you can.

### 1. CODE QUALITY — LITERAL LINE-BY-LINE

For every `.html` / `.css` / `.js` / `.xml` / `.json` / `.txt` file in the repo (excluding `.git/`, `_research/`, `node_modules/`):

- W3C HTML validation: zero errors, zero warnings target
- W3C CSS validation
- Unused CSS selectors per page (use PurgeCSS or coverage probe via Playwright)
- Duplicate CSS rules across `<style>` blocks
- Inline style vs class consistency
- Inline event handlers (`onclick=`) — flag as anti-pattern
- `!important` usage — count + justify each instance
- `id` uniqueness sitewide (no duplicate IDs across DOM)
- `class` naming consistency (BEM-ish or kebab-case discipline)
- Tag closure correctness (no implicit-close abuse beyond `<li>`, `<p>`)
- Void element formatting (`<br>` vs `<br />`)
- Attribute quoting consistency
- Boolean attribute formatting (`disabled` vs `disabled=""`)
- Mixed indentation (tab vs space) within a single file
- Trailing whitespace
- Final newline at EOF
- BOM presence
- Line ending consistency (LF only per `.gitattributes`)
- File size per KB — flag any file >100KB and explain why
- Inline `<script>` block size per file — flag any >50KB inline
- Inline `<style>` block size per file — flag duplication opportunities for shared CSS

### 2. JAVASCRIPT QUALITY

For every inline `<script>` block and every external JS:
- Syntax validity via `node --check`
- Strict mode usage
- `var` vs `let` vs `const` discipline
- Global namespace pollution (e.g. `window.X` leaks)
- Event listener cleanup (`removeEventListener` symmetry)
- Memory leaks (closures retaining DOM)
- Unused functions / dead code
- Browser compatibility (any ES2020+ feature usage that needs a polyfill)
- Async/await error handling (every `await` should have a `try/catch` or `.catch()`)
- Promise chain leaks (no unhandled `.then()` without `.catch()`)
- DOM API best practices: `textContent` vs `innerHTML`, `querySelector` vs `getElementById`
- XSS risk: any string concatenation building HTML with user input
- CSP compliance: any `eval()`, `new Function()`, inline event handlers
- All 9 tools' interaction JS — line-by-line review for the actual visa logic, ensure 2026 Thai immigration rules are correctly encoded
- The `mnav` deferred mobile-nav script — review for performance
- The delayed GA loader — review correctness and edge cases

### 3. CSS QUALITY

For every `<style>` block and CSS file:
- Specificity wars (overspecific selectors, e.g. `body > div > main > p`)
- `!important` justification per instance
- Unused custom properties (`--*` declared but never referenced)
- Undefined custom properties (referenced but never declared)
- Color contrast for every text/background pairing (WCAG AA = 4.5:1, AAA = 7:1)
- Color contrast for non-text UI components (3:1 minimum)
- Reduced-motion media query coverage (every animation/transition should be defanged)
- Print stylesheet absence/presence
- `prefers-color-scheme` support (we're dark-default; what happens on light?)
- `prefers-contrast: more` support
- Container queries opportunities
- Logical properties usage (`margin-inline-start` vs `margin-left`)
- Sticky positioning conflicts
- Z-index ladder consistency
- Stacking context inadvertent creation
- Font fallback chains
- `font-display: swap` confirmation
- Critical CSS extraction opportunity per page type

### 4. SEO 2026 — TOP-OF-INDUSTRY STANDARDS

Per Google's 2026 guidance + Bing + AI Overview citation patterns:
- **E-E-A-T per page:** Experience, Expertise, Authoritativeness, Trustworthiness signals. Score each pillar/guide/comparison page 0-10.
- **Helpful Content Update compliance:** does each page actually answer the user's question, or is it filler?
- **Spam Policy 2024+ compliance:** no doorway pages, no expired-domain abuse, no scaled content abuse, no site reputation abuse
- **Topical authority graph:** map cluster-pillar-spoke relationships. Identify under-connected clusters.
- **Core Web Vitals 2026:** LCP < 2.5s, CLS < 0.1, INP < 200ms — measure each page-type representative on mobile + desktop
- **AI Overview / SGE optimization:** structured Q&A blocks at top of page, schema completeness, llms.txt accuracy
- **Speakable schema:** is it on the right elements? Voice search optimization.
- **Schema graph cross-references:** every JSON-LD object that should link via `@id` actually does
- **Title tag SERP truncation:** flag any title >60 chars likely to truncate
- **Meta description CTR potential:** flag generic, keyword-stuffed, or duplicated descriptions
- **URL structure:** depth, hyphens, lowercase, no parameters, no trailing slash inconsistency
- **Canonical chains:** every canonical should resolve to a 200, not 301
- **hreflang reciprocity:** `/de/` ↔ `/ru/` ↔ root should all reference each other correctly
- **301/302 redirect inventory:** map every redirect, flag any chains >1 hop
- **Internal anchor text quality:** zero "click here" / "read more"; descriptive anchors; no over-optimization
- **Outbound link audit:** authority of every external link, `rel` attribute correctness, nofollow appropriateness
- **Page-speed per template:** homepage budget vs pillar budget vs tool budget vs guide budget
- **Title vs H1 vs OG title:** all three should be coherent but not identical
- **Image alt text quality:** descriptive, not keyword-stuffed; "Pattaya Immigration Office entrance, Soi 5 Jomtien" > "pattaya visa help immigration"
- **TF-IDF / semantic completeness:** for each pillar, compare entity coverage vs top-3 SERP competitors
- **Pillar/cluster gap analysis:** missing comparison pages, missing transition guides, missing profession landings
- **NLP-friendly Q&A formatting:** every FAQ entry should be answerable in <40 words

### 5. UI/UX — MOBILE + DESKTOP, EVERY VIEWPORT

Test every page in this representative URL set (homepage, all 12 visa pillars, all 9 tools, contact, about, methodology, 4 representative guides, 4 representative comparisons, 4 representative profession pages, blog, FAQ, glossary, changelog, sitemap, 404, /de/, /ru/) across:

- 320px (smallest iPhone SE)
- 360px (Android baseline)
- 375px (iPhone X-13)
- 390px (iPhone 14)
- 414px (iPhone XR)
- 430px (iPhone 14 Pro Max)
- 768px (iPad portrait)
- 820px (iPad Air)
- 1024px (iPad landscape / desktop minimum)
- 1280px (laptop common)
- 1366px (15" laptop common)
- 1440px (desktop common)
- 1920px (Full HD)
- 2560px (QHD)

Per viewport per page, check:
- **Layout integrity:** no horizontal scroll, no element overlap, no clipped text
- **Touch targets ≥44×44px** (WCAG 2.5.5 Level AAA) where touch is possible
- **Tap zone overlap:** no two interactive elements within 8px center-to-center
- **Focus order:** Tab navigation hits elements in visual order
- **Visible focus indicator:** every focusable element has a visible :focus or :focus-visible state
- **Scroll behavior:** smooth where appropriate, instant where appropriate
- **Sticky element collision:** brand pill, top nav, mobile bottom nav, back-to-top, contact CTA — no overlaps
- **Modal/overlay behavior:** if any, test escape key, click-outside, focus trap
- **Animation performance:** 60fps where animations exist
- **Reduced-motion:** every animation/transition disabled when preference set
- **Text legibility:** no text below 14px on mobile, no text below 12px on desktop
- **Hit target uniformity:** all buttons in same context same size
- **Loading state for tools:** does the tool show "calculating..." or similar?
- **Empty state for tools:** what shows before user input?
- **Error state for tools:** invalid input handling?
- **Success state for tools:** result rendering clarity

### 6. ACCESSIBILITY — WCAG 2.2 AA + AAA WHERE FEASIBLE

Run axe-core + Pa11y on every sitemap URL × mobile + desktop. Report all violations grouped by:
- Impact (critical, serious, moderate, minor)
- Rule (landmark-one-main, region, color-contrast, etc.)
- WCAG criterion (1.4.3, 2.4.7, etc.)

Beyond axe/Pa11y, manually verify:
- Skip-to-content link works on every page (Tab → Enter takes you to `<main>`)
- Heading hierarchy validity (one h1, no skipped levels)
- ARIA label accuracy (no decorative labels, no redundant labels)
- Live regions for tool results (`aria-live="polite"` where appropriate)
- Form label associations (`<label for="id">` or wrapper)
- Form error message associations (`aria-describedby`)
- Required field indicators (not just color)
- Required field announcement (`aria-required="true"`)
- Table header `scope` attribute on every `<th>`
- Image alt: decorative = `alt=""`, informative = descriptive
- Link purpose clear from context (no "click here")
- Focus indicator contrast ratio (3:1 minimum)
- Touch target size 44×44px (AAA)
- Time limits absent or adjustable
- Captions/transcripts for any video (none currently exist; flag if added)
- Language identification (`<html lang>` per page including `/de/`, `/ru/`)
- Reading order matches visual order

### 7. LINK STRUCTURE — INTERNAL + EXTERNAL

Internal:
- **Click depth map:** for every URL in sitemap, calculate shortest path from homepage. Flag any URL >3 clicks deep.
- **Orphan detection:** URLs in sitemap that no other page links to.
- **Click trap detection:** pages with no outbound internal links.
- **Anchor text diversity per target URL:** if 50 pages link to `/visas/dtv/`, what anchor text variations are used?
- **Anchor text appropriateness:** descriptive, contextual, not exact-match-stuffed
- **Reciprocal linking density:** related pages should link to each other in BOTH directions
- **Cluster cohesion:** all 12 visa pillars should link to all 9 tools and vice versa where contextually appropriate
- **Footer link sprawl:** flag if footer has >25 links (signal dilution)
- **Sidebar/nav consistency:** every internal navigation surface should be consistent

External:
- **Authority of every outbound link:** map to DR/DA estimates if possible
- **`rel` attribute correctness:** `noopener noreferrer` on all `target="_blank"`, `nofollow` where appropriate (paid links, comments)
- **Citation completeness:** every numeric claim should have a primary-source link
- **Authority source coverage:** every visa pillar should cite at least one official Thai government source
- **Broken external link detection:** check all external links for 200 status

Redirects:
- **Redirect chain mapping:** every 301/302 listed with destination
- **No chains >1 hop**
- **No redirect loops**

### 8. TEXT QUALITY + AUTHENTICITY (THIS IS THE BIG ONE FOR YMYL)

For every visa pillar + every guide + every comparison page:

- **AI-detection signature analysis:** run sample paragraphs through GPTZero/Originality.ai-style heuristics OR use your own pattern detection (em-dash density, "delve" / "robust" / "navigate" usage, sentence-length variance, hedge-word density). Score each page "human" vs "AI-generated" 0-100. Flag anything below 60.
- **First-person voice density:** does Tim sound like he's speaking? Count "I", "we", "our", "in my experience", "in Pattaya I've seen" etc.
- **Practitioner anecdote markers:** specific Pattaya/Jomtien references, named streets, real prices, real wait times, real names of immigration officers' offices ("Pattaya Immigration Soi 5"), specific bank branch names ("Bangkok Bank Jomtien Beach Rd")
- **Date stamp consistency:** `dateModified` (JSON-LD) vs `last_verified` (visible) vs sitemap `lastmod` vs git commit date — all four should agree per page
- **Citation density per 1000 words:** target 3-5 official-source citations per 1000 words of visa-rule content
- **Hedge language audit:** "may" / "might" / "could" / "generally" — flag overuse; visa rules are specific
- **Trust phrases:** "verified", "confirmed at the embassy", "we tested this in Pattaya last week" — count and audit accuracy
- **Tense consistency:** present-tense for current rules, past for historical
- **Reading level (Flesch-Kincaid):** target grade 8-10 (accessible to non-native speakers)
- **Sentence length variance:** range 5-30 words; flag pages with monotonous sentence length
- **Passive voice density:** target <15% of sentences
- **Jargon usage:** flag uncommon terms without explanation (must link to /glossary/)
- **Country/locale references:** verify "Royal Thai" / "Thai" / "Thailand" usage is correct and consistent
- **Real-world specificity:** every claim about Pattaya/Jomtien should be verifiable
- **Time-bound claims:** every "in 2026..." should be dated; "currently" should be replaced with specific dates
- **Disclaimer language quality:** "not legal advice" / "consult a licensed professional" — present where needed
- **Author voice consistency across pages:** all 186 pages should sound like the same person wrote them
- **Voice/tone vs brand positioning:** independent, no-commission, Pattaya-local, practitioner — does every page hold this?

### 9. CONTENT GAPS — WHAT'S MISSING

Compare to top 3 ranking competitors per query (Siam Legal, ThaiEmbassy.com, official BOI/MFA):
- Topic coverage gap analysis per visa pillar
- Missing entities (named things that should be mentioned)
- Missing comparison axes
- Missing FAQ questions (use Google PAA scraping for each pillar's query)
- Missing transition guides (visa-to-visa switches)
- Missing edge cases (overstay handling, denied entry, deportation, blacklist)
- Missing related pages (Pattaya Immigration office hours, holiday schedules, document apostille services)
- Missing comparison pages (DTV vs Tourist, LTR vs O-X, etc.)
- Missing profession pages (any high-search nomad professions absent?)
- Missing tools (visa expiry calendar export, automated reminder system already exist; what else?)

### 10. SCHEMA / STRUCTURED DATA

Beyond what was previously audited:
- **Schema graph completeness:** Organization, WebSite, Person, LocalBusiness, ProfessionalService, Article, BlogPosting, FAQPage, HowTo, WebApplication, ItemList, CollectionPage, BreadcrumbList, Speakable, ContactPoint, AggregateRating (if applicable)
- **`@id` cross-references:** every schema node that should reference another should use stable `@id` URIs
- **`sameAs` completeness:** Person sameAs should include real LinkedIn/X/etc. when Tim provides them
- **`mainEntityOfPage` correctness**
- **`isPartOf` hierarchy**
- **AggregateRating absence:** no fake reviews; flag if any exist (none should)
- **JobPosting absence:** flag if any exist
- **Product schema absence:** flag if any exist (visa info is not Product)
- **Rich Results Test pass rate** — every page through validator.schema.org and Google Rich Results Test
- **AI-friendly schema:** Speakable, DefinedTerm, DefinedTermSet for glossary

### 11. PERFORMANCE — DEEPER THAN LIGHTHOUSE

Per page, measure:
- LCP element identification (what's the largest content paint?)
- LCP image dimensions vs displayed dimensions (oversize ratio)
- CLS source identification (which elements cause shift?)
- INP measurement (real interaction delay)
- TTFB from Bangkok/Singapore latency
- Bundle size budget per template
- Unused JavaScript per page (Coverage tab)
- Unused CSS per page
- Render-blocking resource inventory
- Forced reflow source identification
- Long task analysis (>50ms tasks)
- Third-party impact (GA, Cloudflare beacon if enabled, fonts)
- Cache hit ratio per resource
- Brotli/gzip compression coverage
- HTTP/3 support verification
- Image format optimization (WebP/AVIF vs JPEG/PNG)
- Image compression quality (visual quality vs file size)
- Font subset opportunity (Latin-only loading on English pages?)
- Font preload correctness
- Critical CSS inline opportunity
- Above-fold render priority

### 12. SECURITY + HEADERS + PRIVACY

- `_headers` review against 2026 best practices: CSP, HSTS, COOP, COEP, CORP, Permissions-Policy, Referrer-Policy, X-Content-Type-Options, X-Frame-Options
- CSP completeness: every `script-src`, `style-src`, `connect-src`, `font-src`, `img-src` allowlist justified
- `'unsafe-inline'` exposure analysis
- Subresource Integrity (SRI) for external scripts
- CORS configuration
- Cookie usage audit (any `Set-Cookie` headers?)
- localStorage/sessionStorage usage
- Service Worker presence (none currently; should there be?)
- Tracking pixel audit (none beyond GA expected)
- Privacy policy compliance (GDPR, CCPA): does the site collect anything that requires disclosure?
- Email harvesting risk (mailto links in plain text)
- HTTPS-only (verify no mixed content)
- Cloudflare WAF rules (out of scope — flag for Tim)

### 13. MOBILE-FIRST INDEXING READINESS

Google indexes the mobile version. Verify mobile parity:
- Same content shown on mobile as desktop
- Same metadata on mobile as desktop
- Same structured data on mobile as desktop
- Same internal links on mobile as desktop
- No "tap to expand" content that hides info from crawlers
- No mobile-only redirects to a different URL
- `viewport` meta present + correct on every page
- Touch-friendly forms with correct `inputmode` / `type`
- Mobile-friendly font sizing (no zoom required)

### 14. AI SEARCH + LLM OPTIMIZATION

This site sells advice to a population that increasingly asks AI before Google:
- `llms.txt` completeness and accuracy
- `/api/visa-data.json` JSON quality
- AI-quotable answer blocks at top of every pillar
- Schema completeness for AI citation
- Plain-text content extractable without JS execution
- No content that requires JS to render visible text
- Citation-friendly format (every claim has a source link)
- Test queries against Perplexity/ChatGPT/Claude/Gemini — does the site get cited?

### 15. TOOLS — INTERACTION + LOGIC CORRECTNESS

For each of the 9 tools (Visa Finder, Cost Calculator, LTR Eligibility, Income Test, Document Checklist, Currency Converter, Bank Checker, Expiry Countdown, Reminder):

- Playwright end-to-end test happy path
- Edge case input handling
- Invalid input handling
- Internationalization of numbers (commas vs periods, ฿ vs USD)
- Result accuracy vs current 2026 Thai immigration rules
- Result share-ability (URL state, copyable result, downloadable PDF)
- Mobile keyboard type for each input field
- Autocomplete attributes on each input
- Loading/error/empty/success state quality
- Analytics tracking of tool starts/completions (currently none — flag)
- Conversion path: tool result → contact CTA — clear and frictionless?

### 16. CONVERSION + LEAD CAPTURE

- Email subject prefilling on every `mailto:` CTA per page topic
- WhatsApp message prefilling per page topic
- LINE link working
- Contact page form (if any)
- Lead capture API (`functions/api/lead.js`): syntax, env var requirements, Resend integration health
- Time-to-contact friction: how many clicks from any page to reach Tim?
- CTA placement: above-fold + mid-content + footer minimum on every pillar?
- CTA copy variety (not all "Email us")
- CTA differentiation (when to use email vs WhatsApp vs LINE)

### 17. CONTENT FRESHNESS + MAINTENANCE

- Last-modified date per page (visible + structured + sitemap + git all matching)
- Stale-content detection (any page with `last_verified` > 90 days old)
- Changelog page accuracy (every meaningful repo change reflected?)
- Methodology page accuracy
- About page accuracy (Tim's bio, credentials, areas served)
- Recurring update cadence detection (is there a pattern Google can detect?)
- Version badge from footer: does the displayed version match `git rev-parse HEAD`?

### 18. COMPETITIVE POSITIONING (DON'T BLOW THE BUDGET)

Light competitive analysis (don't redo the previous deep one):
- For top 5 high-intent queries, identify top 3 organic + top 3 AI-Overview-cited sources
- For each, calculate: domain authority, backlink count, content depth (word count), schema score, freshness signal, brand recognition
- Position pattayavisahelp.com relative to them per dimension
- Identify the single biggest competitive gap

---

## DELIVERABLE FORMAT — REQUIRED

Write ONE markdown file: `_research/CODEX_NUCLEAR_DEEP_AUDIT_REPORT.md`

Structure must be:

```
# CODEX NUCLEAR DEEP AUDIT REPORT — pattayavisahelp.com

## 0. Executive Summary (max 1 page)
- Overall score per dimension (0-100)
- Top 5 P0 blocker findings
- Top 10 P1 high-priority findings
- Single most important next move

## 1. Scorecard (table)
| Dimension | Pages audited | P0 | P1 | P2 | P3 | Score |

## 2. Per-Dimension Findings (one section per dimension above)
For each finding within a dimension:
- ID: `D{N}-F{NN}` (e.g., D5-F03 = Dimension 5, Finding 3)
- Severity: P0/P1/P2/P3
- File path + line number
- Description (1-3 sentences)
- Why it matters (1 sentence)
- Concrete fix suggestion (1-2 sentences)
- Effort estimate (minutes/hours/days)
- Affected page count

## 3. Top 50 Prioritized Action List
Sorted by (impact × effort_efficiency). One-line per item with severity tag.

## 4. Raw Data Appendix
- Per-page Lighthouse scorecard
- Per-page axe-core violations
- Per-page Pa11y violations
- HTML/CSS validator results
- Schema validator results
- AI-detection scores per long-form page
- Click-depth map
- Anchor text frequency table per target URL

## 5. What's Genuinely Strong
What did Tim and Claude build well? Specific praise with file citations.

## 6. What's Genuinely Weak
What's the single biggest structural problem? Be honest.

## 7. End-of-Report Verification
Confirm: zero files modified, zero commits made, zero pushes. Report file size + line count.
```

---

## HARD CONSTRAINTS — READ THIS TWICE

1. **READ-ONLY.** No `git add`, `git commit`, `git push`. No file modifications. No new branches. If you accidentally modify a file, revert it immediately and flag it in the report.
2. **Lane guards** (sacred — do NOT propose changes to any of these):
   - Brand palette: `--bg:#000`, `--pink:#ec4899`, `--cyan:#06b6d4`, `--yel:#fbbf24`, `--pur:#a855f7`, `--grn:#10b981`, `--wa:#25d366`
   - Fonts: Space Grotesk, JetBrains Mono, Inter
   - Contact channels: `info@pattayavisahelp.com`, the exact prefilled `api.whatsapp.com/send/?phone=66967286999&text=Hi%20from%20pattayavisahelp.com%20%E2%80%94%20I%20have%20a%20question%20about%20Thai%20visas` URL, `https://line.me/ti/p/~timpaemi`
   - Footer credit: "// Site built & managed by Pattaya Authority · Tim Paemi ★"
   - GA tag: `G-RSNN24M25C`
   - No proposal to remove pages
   - No proposal to redesign or change theme
   - No proposal to add a CMS/build step
3. **No content rewrites suggested unless factually wrong.** If a sentence is well-written but you'd phrase it differently, leave it alone.
4. **No new features proposed unless evidence-backed by competitive analysis.**
5. **No basic findings — go deeper than every prior pass.** Tim explicitly asked "literally every line of code and KB of every file." Match that ambition.
6. **Cite everything.** File path + line number for every finding. No vague "some pages have X" — name the pages.
7. **Be opinionated.** Tim wants 100% perfect. Tell him what's between him and perfect.

---

## TONE EXPECTATIONS

- **Exhaustive, not lazy.** If you finish in under 4 hours of compute, you didn't go deep enough.
- **Honest.** If something is great, say so. If something is bad, say so. Tim wants the real picture.
- **Specific.** Numbers over adjectives. File:line citations over hand-waving.
- **Opinionated.** Surface your judgment on what matters most.
- **Practical.** Every finding should be actionable — Claude reads this and ships fixes.

---

## TIMING + COMPUTE

Take the time. Tim is not in a hurry. The audit will take what it takes.

If you find yourself running short on context, prioritize:
1. Code quality (Dimensions 1, 2, 3)
2. SEO 2026 (Dimension 4)
3. Accessibility (Dimension 6)
4. Text authenticity (Dimension 8)
5. Performance (Dimension 11)
6. Link structure (Dimension 7)
7. Everything else

---

## CONTEXT FROM PRIOR PASSES (so you don't redo)

Prior audits already completed (read their reports in `_research/` for context):
- `CODEX_FULL_AUDIT_REPORT.md` — comprehensive audit dated 2026-05-17
- `CODEX_NUCLEAR_REPORT.md` — performance + accessibility + schema pass
- `CODEX_HOTFIX_REPORT.md` — tool interaction fixes
- `CODEX_TECH_FIX_REPORT.md` — initial tech SEO normalization

Recent Claude fixes since the last audit:
- DTV factual drift corrected (3-6 month seasoning)
- Privilege Bronze/Gold pricing fixed
- llms.txt O-X age corrected
- Axe landmarks fixed (388 violations resolved)
- Visa Finder mobile CLS fix (`min-height` on `#quizArea`)
- 72 schema validator errors fixed
- JSON-LD added to 5 hub pages
- Sitemap lastmod refreshed sitewide
- Reading-time normalized on DTV + Marriage Non-O
- `dateModified` refreshed on 102 pages
- Footer "Last updated · v2026.05.18" badge added sitewide
- `/api/visa-data.json` structured endpoint created
- `<link rel="alternate" type="application/json">` added to 13 pages
- IndexNow key file deployed
- IndexNow ping submitted to Bing/Yandex/Seznam (202 accepted)

Your job is to find the things STILL imperfect after all of this.

---

## END OF BRIEF

Codex: read this brief twice. Then go. Take 4 hours if you need 4 hours. Write the report. No fixes, no commits, no pushes. When done, the file `_research/CODEX_NUCLEAR_DEEP_AUDIT_REPORT.md` is your only deliverable.

Claude (reading this report next): your job is to ship the fixes for everything in Codex's prioritized action list, respecting lane guards. One commit per logical theme, `[Claude deep-fix]:` prefix.

Go nuclear.

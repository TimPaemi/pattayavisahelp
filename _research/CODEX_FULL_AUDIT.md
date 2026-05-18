# CODEX FULL AUDIT BRIEF — pattayavisahelp.com

**Mode:** READ-ONLY · AUDIT ONLY · NO FIXES · NO COMMITS
**Deliverable:** single comprehensive markdown report at `_research/CODEX_FULL_AUDIT_REPORT.md`
**Date:** 2026-05-18
**Owner:** Tim Paemi (one-man show · Jomtien, Pattaya · part of pattaya-authority.com network)

---

## ACCESS

You have full read access to:

1. **Local repo:** `C:\pattayavisahelp` (or `/sessions/.../mnt/pattayavisahelp` in your sandbox). 184 production HTML files, plain HTML/CSS/vanilla JS, no build step.
2. **GitHub:** https://github.com/TimPaemi/pattayavisahelp · branch `main`
3. **Live deployed site:** https://pattayavisahelp.com (Cloudflare Pages, auto-deploys on push)
4. **Web access:** for competitor research, SERP checks, Lighthouse PSI calls, schema validator calls, search-volume estimates

You may install Playwright, lighthouse-cli, axe-core, anything you need in a temp directory. You do NOT need to fix anything. You DO need to evaluate everything.

---

## THE QUESTION YOU ARE ANSWERING

> **"Is this site good enough — and competitive enough — to actually rank on Google for high-intent Thailand visa searches from Pattaya?"**

Tim has invested ~3 months of one-man-show work building this. The site is now in a "launch-ready" state. He's stepping back from active development for a while. Before he walks away, he needs an honest, exhaustive, evidence-based answer about:

1. Does the site meet 2026 SEO + UX + accessibility + performance bars?
2. What are the realistic chances of ranking in the Pattaya/Thailand visa niche over 3 / 6 / 12 months?
3. Who is he competing against, and what specifically separates them from him?
4. What are the highest-leverage things left to do, ranked by impact-to-effort?

This is not a fix list. This is a strategic audit. Tim and Claude will read your report and decide together what (if anything) to act on.

---

## SCOPE — WHAT TO AUDIT

### A. TECHNICAL SEO (every page on the site, sampled where exhaustive isn't feasible)

For every URL in `/sitemap.xml`:
- Canonical tag present, points to a 200 (not a 301 chain)
- Robots meta correct (indexable pages are `index,follow`, redirect pages are `noindex`)
- hreflang for `/de/` and `/ru/` landings reciprocates correctly
- OG + Twitter meta complete (title, description, image, type, url, site_name)
- Title tags under 60 chars where they should be, descriptive
- Meta descriptions under 160 chars, distinct per page, sell the click
- Heading hierarchy valid (no h3 without h2, no h2 without h1, no skipped levels)
- One h1 per page
- Image alt+width+height on every image
- No mixed content
- All internal links resolve (catch the 21 known vanity-URL deadlinks + anything else)
- All external links have `rel="noopener noreferrer"`
- Schema validates per https://validator.schema.org/ — Article, BreadcrumbList, FAQPage, HowTo, LocalBusiness, Organization, Person, WebSite, WebApplication, ItemList wherever present
- Schema graph cross-references valid (`@id` matching across documents)
- Sitemap.xml: every URL listed, `lastmod` accurate, `priority` sensible
- llms.txt present and lists authoritative content for AI crawlers
- robots.txt allows everything we want indexed
- 404 page is a real branded 404 with helpful navigation

Report counts of each issue type with examples (file path + line number where applicable).

### B. LIGHTHOUSE / PERFORMANCE (programmatic)

Run Lighthouse 12+ on the live site (pattayavisahelp.com), both Mobile and Desktop, on this representative sample:

- `/` (homepage)
- `/visas/` (hub)
- `/visas/dtv/`, `/visas/ltr/`, `/visas/privilege-elite/`, `/visas/retirement-non-o/`, `/visas/tourist-tr-evisa/`, `/visas/retirement-o-a/`, `/visas/media-non-m/`, `/visas/marriage-non-o/`, `/visas/smart/`, `/visas/business-non-b/`, `/visas/education-ed/`, `/visas/retirement-o-x/` (all 12 visa pillars)
- `/tools/visa-finder/`, `/tools/cost-calculator/`, `/tools/eligibility/`, `/tools/document-checklist/`
- `/blog/`, `/blog/tdac-step-by-step/`
- `/faq/`, `/glossary/`, `/changelog/`, `/methodology/`, `/about/`, `/contact/`, `/sitemap/`
- `/guides/visa-runs-vs-extensions/`, `/guides/90-day-reporting/`, `/guides/jomtien-immigration-office/`
- `/compare/dtv-vs-ltr/`, `/compare/non-o-vs-o-a/`
- `/professions/digital-nomad/`, `/best-visa/under-50k/`
- `/de/` and `/ru/`

For each: capture Performance / Accessibility / Best Practices / SEO scores, plus LCP / FCP / CLS / INP / TBT raw numbers, plus the top 5 "Opportunities" and "Diagnostics" issues. Save raw JSON to `_research/CODEX_AUDIT_LIGHTHOUSE.json` and surface the summary scorecard in the report.

Flag any page scoring below:
- Performance: Desktop < 95, Mobile < 85
- Accessibility: < 100
- Best Practices: < 95
- SEO: < 95

Also test from a Bangkok/Thailand network location if possible (PSI default is US — test from Thailand to reflect actual user latency for Pattaya-targeted visitors).

### C. ACCESSIBILITY (axe-core via Playwright on every page in sitemap)

For each page, both Mobile (390×844) and Desktop (1440×900):
- Run axe-core via Playwright
- Capture all violations (severity + element selector + WCAG criterion)
- Run a manual-style sweep: tap target sizes ≥ 44px, focus order logical, color-not-sole-conveyor, ARIA accuracy, skip-link works, keyboard navigability of every interactive element

Report any violation that isn't false-positive.

### D. CONTENT DEPTH + QUALITY (sample audit)

For each of the 12 visa pillars + 6 representative guides + 4 representative tools + 4 representative comparison pages:
- Word count
- Reading time (calculated vs displayed)
- Information density (does the page actually answer the question, or is it filler?)
- Accuracy of every numeric claim against current 2026 Thai immigration rules (sample-check 20-30 specific facts: visa fees, durations, financial thresholds, age limits, eligible nationalities — flag any that look outdated)
- E-E-A-T signals present: author bio with credentials, last-updated stamp, methodology link, source citations (official BOI / MFA / Immigration Bureau / Royal Gazette links?)
- Voice consistency (the site has a clear "independent, Pattaya-based, no-commissions" tone — does every page hold it?)
- CTAs clear and consistent (email + WhatsApp + LINE on every pillar)
- Internal linking from each pillar to related pages (comparisons, tools, guides)
- Trust positioning (no manipulative copy, no fake urgency, no agent-pump)
- Originality (do these pages read like AI-generated SEO slop, or like a real practitioner wrote them?)

Sample 10 pages for plagiarism / overlap with top competitor pages on the same query.

### E. UX + INTERACTION (Playwright sweep)

Run end-to-end tests on all 9 tools, both viewports:
- Visa Finder: complete all 6 questions, get a recommendation
- Cost Calculator: pick visa, set years, get THB total
- LTR Eligibility: fill all fields, get category result
- Expiry Countdown: pick date, get countdown
- Income Test: fill fields, get recommendation
- Document Checklist: pick visa, get list
- Currency Converter: amount + currencies, get conversion
- Bank Checker: fill criteria, get bank list
- Reminder: pick date + email, get ICS download

Confirm 18/18 pass + capture console errors per tool.

Also test:
- Mobile bottom nav appears on every page on mobile viewport
- Skip-link works on every page (Tab → Enter takes you to main)
- Reduced-motion preference respected
- All forms accessible by keyboard
- All external links have `rel="noopener noreferrer"`

### F. CONVERSION PATH AUDIT

Trace the actual journey:
- Land on homepage from Google → can a user identify the right visa within 30 seconds?
- Land on a pillar page → is there a clear path to either (a) Tim (email/WhatsApp/LINE) or (b) a relevant tool?
- Land on a comparison page → can the user click through to the winning visa's pillar in 1 click?
- Test the `mailto:` links — are subjects pre-filled?
- Test WhatsApp links — does the prefilled text load on web.whatsapp.com?
- Test LINE link — does it open LINE chat correctly?
- Form submission path (if any) — does `functions/api/lead.js` actually send? (Don't actually submit — just trace the code path and verify Cloudflare Pages Functions deployment + the Resend integration is real.)

### G. COMPETITIVE ANALYSIS (use web access)

Find and document the top 10 organic results for each of these high-intent Pattaya/Thailand visa queries (run from a Bangkok-localized search if possible, or via SERP API):

- `Thailand DTV visa`
- `Thailand DTV visa Pattaya`
- `LTR visa Thailand`
- `LTR visa Pattaya`
- `Thailand retirement visa Pattaya`
- `Non-O retirement visa Thailand`
- `Thailand visa agent Pattaya`
- `Jomtien immigration office`
- `Thailand 90-day reporting`
- `Thailand TM30 reporting`
- `Pattaya visa help`
- `Thailand Privilege visa`
- `Tourist visa Thailand 60 days`
- `Thailand digital nomad visa`
- `marriage visa Thailand Pattaya`

For each query, capture:
- Top 10 URLs + their root domains
- Visible domain authority signals (any Ahrefs DR / Moz DA approximation you can pull, or just qualitative — "large legal firm", "expat blog", "Reddit thread", "Thai government")
- The specific page that's ranking — page title, word count estimate, schema visible in source
- What's separating them from us — is it backlinks, content depth, age, schema, or brand recognition?

Identify our biggest 3 competitors by overlap of ranking pages, name them, profile each.

### H. SERP FEATURE ANALYSIS

For the same 15 queries:
- Is there a Featured Snippet? Which page owns it? Can we win it?
- Is there a "People Also Ask" box? List the questions — do we have FAQ entries answering them?
- Is there a Knowledge Panel? Map Pack? Video carousel?
- Is there "Discussions and forums" sourcing Reddit? If yes, which subreddits?
- Is there an AI Overview (Google SGE / AIO)? What sources does it cite?

Where we could realistically win a SERP feature, name the target page + the modification needed.

### I. LOCAL SEO + LOCAL BUSINESS POSITIONING

- LocalBusiness schema completeness audit (geo coords, areaServed, openingHours, contactPoint, sameAs)
- Is the site registered with Google Business Profile? If not, flag this as a major missing lever.
- NAP (Name / Address / Phone) consistency across the site
- Local citations potential — what Pattaya expat directories / business listings would link here?
- Map pack ranking potential for "visa help Pattaya" / "visa agent Jomtien" — what's the realistic ceiling?

### J. AI SEARCH OPTIMIZATION

Test the live site against:
- Perplexity.ai — search "best Thailand visa for digital nomad Pattaya" and see if the site is cited
- ChatGPT (if you have access) — same query
- Google AI Overview — same query
- Bing Copilot — same query

If not cited, identify what specifically prevents citation: missing structured data, sparse content, no clear authoritativeness signal, the site isn't indexed yet, the site is too new.

Audit `llms.txt`: does it accurately point AI crawlers at the authoritative content?

### K. BACKLINK PROFILE

Use whatever backlink data source you can access (Ahrefs free tier, Moz free, Ubersuggest, OpenLinkProfiler, manual referring-domains check):
- How many root domains link to pattayavisahelp.com today?
- What's the quality? (real expat blogs vs spam directories vs nothing)
- What's the competitive backlink gap vs our top 3 competitors?
- Identify 10 specific outreach targets — real expat blogs / forums / digital nomad sites / Reddit threads where a useful, non-spammy link from Tim could plausibly land.

### L. INDEXATION CHECK

- Use `site:pattayavisahelp.com` on Google + Bing — how many pages are actually indexed?
- Compare to the 184 pages in sitemap. Flag any major indexation gap.
- Check Cloudflare Pages deployment logs / DNS / SSL — site is fully accessible, no soft 404s, no orphans
- Check Google Search Console signals (if Tim has it set up — if not, flag as a must-do)

### M. SECURITY + HEADERS + PERFORMANCE BUDGETS

- Current `_headers` CSP / HSTS / COOP / Permissions-Policy review
- HTTPS-only via Cloudflare, no mixed content
- Page weight budget per page type (homepage < 1MB? pillar < 500KB? tool < 300KB?)
- Font loading strategy (currently preload + swap pattern + noscript — is this actually firing correctly?)
- GA delay-load actually delaying? (verify in DevTools Network)
- Cloudflare Web Analytics beacon actually loading post-CSP-fix?

### N. WHAT'S MISSING

Things that should arguably exist on a serious Thailand visa reference site but don't:
- Email newsletter signup (currently absent? check)
- Pricing transparency page (we say "no commissions" — is there a clear "how we make money" page?)
- Case studies with real outcomes (we mention `/case-studies/` — is it populated?)
- A `/changelog/` is good, but is it actively updated?
- Embeddable widgets (visa comparison matrix, cost calculator iframe) — would attract backlinks
- YouTube / video content footprint
- A clear "about the methodology" link from every pillar
- Thai-language version (we have DE + RU, no TH)
- Privacy policy + Terms of Service quality

---

## DELIVERABLE FORMAT

Write **one markdown file**: `_research/CODEX_FULL_AUDIT_REPORT.md`

Structure:

```
# CODEX FULL AUDIT REPORT — pattayavisahelp.com

## 1. Executive summary (½ page)
- Overall verdict: launch-ready / needs work / ranking-ready / etc.
- The 3 single most important findings.
- The single most important next move.

## 2. Scorecard
- Lighthouse table (page × viewport × P/A/BP/SEO)
- Schema validation summary
- Internal-link health
- Accessibility findings count by severity
- Content-quality assessment per page type
- Competitive position assessment

## 3. Technical SEO findings
(Bullets with file:line citations)

## 4. Performance findings
(Per-page breakdown, top opportunities ranked by impact)

## 5. Accessibility findings
(Severity-grouped)

## 6. Content + quality findings
(Per-page-type, including any factual-accuracy concerns)

## 7. UX + interaction findings
(Tool test results, mobile UX, conversion paths)

## 8. Competitive analysis
(Top 3 named competitors with profile, gap analysis)

## 9. SERP feature opportunities
(Concrete targets per query)

## 10. Local SEO + Google Business Profile assessment

## 11. AI search readiness assessment

## 12. Backlink profile + outreach targets

## 13. Indexation status

## 14. What's missing (gap analysis)

## 15. Realistic ranking forecast
- 3 months: which queries are realistically achievable?
- 6 months: which queries with effort?
- 12 months: which queries are aspirational?

## 16. Prioritized action list (top 15 things to do, ranked by impact-to-effort ratio)
- Format: "[impact: high/med/low] [effort: hours/days/weeks] [item description] — [why it matters]"

## 17. What NOT to do (warnings)
- Specific things that look tempting but would be wasted effort or counterproductive

## 18. Raw data appendix
- Links to JSON files saved alongside the report
- Citations + screenshots if helpful
```

---

## TONE + DEPTH EXPECTATIONS

- **Be exhaustive, not lazy.** Skipping pages or sampling too thin makes the report worthless.
- **Be honest.** If something is great, say so. If something is mid, say so. If something is a structural weakness, say so. Tim wants the real picture, not flattery.
- **Be specific.** "Improve content quality" is useless. "The DTV pillar at line 482 makes a tax claim that contradicts Royal Decree 743 — see X source" is useful.
- **Be opinionated.** Surface your own judgment on what matters most. Tim and Claude can disagree, but they need your assessment to push against.
- **Bring receipts.** Every finding needs a citation: file path + line number, URL, screenshot path, JSON output reference, or competitor URL.
- **Quantify wherever possible.** Numbers > adjectives.

---

## HARD CONSTRAINTS

1. **READ-ONLY.** Do not modify any production file. Do not create branches. Do not commit. Do not push.
2. **No design opinions.** Don't tell Tim the dark theme is wrong — it's a brand decision. Audit it against accessibility AA (already met) and bounce-rate signals if you can find them, but no aesthetic recommendations.
3. **No content rewrites suggested.** If content is factually wrong, flag it. If content is fine but you'd phrase it differently, don't bother.
4. **No new features suggested unless evidence-backed.** "Add a calculator" isn't useful. "Top 3 competitors have a Y feature that ranks well — adding one could close gap on query X" is useful.
5. **Stay in the audit lane.** This is not a fix pass. The follow-up fix pass will be a separate prompt with explicit lane guards.

---

## TOOLS YOU SHOULD USE

- `bash` for repo traversal, grep, find
- `python3` + `requests` / `httpx` for web fetches against the live site, competitor pages, Lighthouse PSI API
- `npx lighthouse` or `npx lhci` for full Lighthouse runs
- `npx playwright` for tool interaction tests + axe-core
- `curl` for header + robots.txt + sitemap inspection
- `https://validator.schema.org/` for JSON-LD validation (programmatic if possible)
- Web search for SERP analysis + competitor identification
- `git log` for site history context if relevant

If you need to install tools, install them in a temp directory outside the repo (e.g. `/tmp/codex-audit/`). Do not pollute the repo with `node_modules` or build artifacts.

---

## TIMELINE EXPECTATION

This is a thorough audit. Take the time it needs. If it takes 4 hours of compute, that's fine. Tim is stepping away from the site for a week — he'd rather get one exhaustive report than three shallow ones.

---

## CONTEXT YOU NEED

- Site is a static plain-HTML/CSS/vanilla-JS Cloudflare Pages deployment. No build step. No framework. Edit files = source of truth.
- Tim is a one-man show. He uses Claude + Codex + ChatGPT + Perplexity Premium + Firefly + CapCut as his stack. He's smart and capable but not a developer — frame technical findings clearly.
- The site has been through multiple Codex passes (tech SEO normalization, tool-interaction hotfix, nuclear performance + accessibility + schema pass). It's in good shape. You're not auditing a fresh build — you're auditing a polished but recent launch.
- Tim's lane guards (sacred — do not violate even in suggestions):
  - Brand palette: `--bg:#000`, `--pink:#ec4899`, `--cyan:#06b6d4`, `--yel:#fbbf24`, `--pur:#a855f7`, `--grn:#10b981`, `--wa:#25d366`
  - Fonts: Space Grotesk, JetBrains Mono, Inter
  - Contact channels: `info@pattayavisahelp.com`, the prefilled `api.whatsapp.com/send/?phone=66967286999...` URL, `https://line.me/ti/p/~timpaemi`
  - Footer credit: "// Site built & managed by Pattaya Authority · Tim Paemi ★"
  - GA tag: `G-RSNN24M25C`
  - No removal of pages

If any audit finding suggests changing one of these, flag it but acknowledge it's a Tim/Claude decision, not a Codex one.

---

## SUCCESS CRITERIA FOR YOUR REPORT

When Tim and Claude read your report, they should walk away with:
1. A clear, evidence-backed assessment of where the site stands today
2. A realistic ranking forecast with specific queries and timelines
3. A prioritized action list where every item has impact and effort estimated
4. Confidence that nothing important got overlooked

Go nuclear. This is the last audit before Tim steps away. Make it count.

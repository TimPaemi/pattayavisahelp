# CODEX NUCLEAR DEEP AUDIT REPORT — pattayavisahelp.com

Audit date: 2026-05-18  
Repo audited: `C:\pattayavisahelp`  
Live site audited: `https://pattayavisahelp.com`  
Mode: read-only source audit. The only repo file created by Codex is this report.

## 0. Executive Summary

I audited the local repo, live Cloudflare Pages deployment, and current public visa/tax references. Coverage included 186 HTML pages, 221 audit-scope source/data files, 11 sitemap XML files, 9 tool pages, 372 Pa11y runs, 370 axe runs, 602 layout viewport runs, 24 Lighthouse lab runs, static HTML/CSS/JS/schema/link extraction, live header checks, external-link probes, and current-source checks against Thai e-Visa, Thailand.go.th, BOI LTR, BDO tax summaries, and competitor SERPs.

The site is in materially better shape than the prior audit reports describe. The 9 tools mostly work, schema is broad, internal linking is dense, headers are stronger than most static sites, and the content has real Pattaya specificity. The remaining distance to “100% perfect” is not a broad collapse. It is concentrated in: YMYL factual drift, generated-template hygiene, accessibility polish, mobile 320px edge cases, and source-of-truth consistency.

Overall score by dimension:

| Dimension | Score |
|---|---:|
| 1. Code quality | 72 |
| 2. JavaScript quality | 68 |
| 3. CSS quality | 61 |
| 4. SEO 2026 | 74 |
| 5. UI/UX | 72 |
| 6. Accessibility | 73 |
| 7. Link structure | 84 |
| 8. Text quality + authenticity | 76 |
| 9. Content gaps | 70 |
| 10. Schema / structured data | 72 |
| 11. Performance | 77 |
| 12. Security + headers + privacy | 66 |
| 13. Mobile-first indexing | 82 |
| 14. AI search + LLM optimization | 73 |
| 15. Tools interaction + logic | 81 |
| 16. Conversion + lead capture | 80 |
| 17. Freshness + maintenance | 61 |
| 18. Competitive positioning | 68 |

True P0 blocker findings found: 2. I am not inflating lower-risk issues into P0s.

- D4-F01 / D8-F01: The DTV page tells tax-resident readers that later-year foreign income remittances are “savings, not income,” contradicting the site’s own tax pages and current Revenue Department interpretation. See `visas/dtv/index.html:59`, `visas/dtv/index.html:489`, `visas/dtv/index.html:526`, versus `tax/index.html:547` and `guides/thai-tax-foreign-residents/index.html:488`.
- D4-F02 / D10-F05 / D14-F02: LTR tax-exemption coverage is inconsistent across comparison content, API JSON, and `llms.txt`. The comparison matrix incorrectly includes Highly-Skilled Professionals; the API marks LTR exemption as globally true; `llms.txt` omits Work-from-Thailand Professionals. See `compare/visa-comparison-matrix/index.html:650`, `compare/visa-comparison-matrix/index.html:909`, `api/visa-data.json:84`, `api/visa-data.json:85`, and `llms.txt:28`.

Top 10 P1 high-priority findings:

1. D12-F01: Lead and subscribe functions only verify Turnstile when a token is submitted; missing token bypasses verification when `TURNSTILE_SECRET` exists. See `functions/api/lead.js:42` and `functions/api/subscribe.js:34`.
2. D12-F02: Lead function injects user input into HTML email/Slack/Discord payloads without HTML escaping or payload normalization. See `functions/api/lead.js:113`, `functions/api/lead.js:124`, `functions/api/lead.js:144`, `functions/api/lead.js:218`, `functions/api/lead.js:242`.
3. D7-F01: `sitemap-images.xml` contains 6 country-page URLs that live-check as 404s because abbreviations do not match deployed slugs. See `sitemap-images.xml:50`, `:58`, `:66`, `:74`, `:82`, `:90`.
4. D17-F01: Visible freshness strings still show April/10 May while schema/footer say 18 May; 625 stale date strings were detected. See `visas/dtv/index.html:374`, `:397`, `:575`, `compare/visa-comparison-matrix/index.html:467`, `visas/index.html:483`.
5. D6-F01: axe reports `region` landmark violations in 368 of 370 runs, 1,690 nodes. Common nodes include `.mq`, `.brand`, `.tldr`, `.read-next`, and `.contact-section`.
6. D6-F02: Pa11y reports 766 WCAG AA contrast errors in 360 of 372 runs, mostly breadcrumb/meta separators at 4.35:1. Example selector maps to breadcrumb separator lines such as `about/index.html:407`.
7. D5-F01: 38 of 602 layout runs have horizontal overflow at 320px, including homepage, most pillars, representative guides/comparisons, `/de/`, and `/ru/`.
8. D1-F01: HTML validation found 8 parser errors, including a raw `<5 years` token and malformed image attributes in 7 country pages. See `guides/buying-property-thailand/index.html:506` and `pattaya/usa-to-thailand/index.html:464`.
9. D3-F01: CSS is almost entirely page-local and duplicated: 191 style blocks, 4,673 KB of inline CSS across HTML pages, 9,883 `!important` instances, and high selector repetition.
10. D15-F01: Reminder tool has no true empty state because arrival date is prefilled; the empty-state test fails. See `tools/reminder/index.html:287`, `tools/reminder/index.html:315`, `tools/reminder/index.html:319`.

Single most important next move:

Fix the factual source-of-truth drift first: DTV tax treatment, LTR category-specific tax treatment, API JSON, `llms.txt`, and visible freshness strings. The site is YMYL-adjacent. A polished site with wrong tax/visa answers is worse than an ugly site with correct answers.

Primary external sources consulted:

- [Thailand.go.th DTV summary](https://thailand.go.th/issue-focus-detail/3---destination-thailand-visa-dtv?hl=en)
- [Thai e-Visa DTV page](https://www.thaievisa.go.th/visa/dtv-visa)
- [Royal Thai Embassy Washington DTV requirements](https://washingtondc.thaiembassy.org/en/page/page/dtv-visa/)
- [BOI LTR official site](https://ltr.boi.go.th/)
- [BOI LTR 2025 brochure PDF](https://ltr.boi.go.th/documents/BOI-brochure%202025-LTR.pdf)
- [Thailand.go.th O-X requirements](https://thailand.go.th/issue-focus-detail/001-01-058?hl=en)
- [BDO Thailand foreign-source remittance rule summary](https://www.bdo.th/en-gb/news/2023/tax-alert-the-%E2%80%98remittance-rule%E2%80%99-for-foreign-source-income)

## 1. Scorecard

| Dimension | Pages audited | P0 | P1 | P2 | P3 | Score |
|---|---:|---:|---:|---:|---:|---:|
| 1. Code quality | 186 HTML / 221 files | 0 | 1 | 6 | 4 | 72 |
| 2. JavaScript quality | 533 scripts / 2 functions | 0 | 2 | 5 | 2 | 68 |
| 3. CSS quality | 186 pages / 191 style blocks | 0 | 1 | 6 | 3 | 61 |
| 4. SEO 2026 | 186 pages + live | 2 | 5 | 6 | 3 | 74 |
| 5. UI/UX | 43 URLs × 14 viewports | 0 | 2 | 4 | 2 | 72 |
| 6. Accessibility | 186 pages × mobile/desktop | 0 | 3 | 5 | 2 | 73 |
| 7. Link structure | 188 sitemap URLs / 47 external URLs | 0 | 2 | 4 | 2 | 84 |
| 8. Text quality + authenticity | pillars/guides/comparisons | 1 | 3 | 5 | 2 | 76 |
| 9. Content gaps | 12 pillars + competitor sample | 0 | 2 | 5 | 2 | 70 |
| 10. Schema / structured data | 186 pages / 375 nodes | 1 | 3 | 6 | 2 | 72 |
| 11. Performance | 12 URLs × mobile/desktop | 0 | 2 | 5 | 2 | 77 |
| 12. Security + headers + privacy | repo + live headers | 0 | 4 | 5 | 2 | 66 |
| 13. Mobile-first indexing | 43 URL sample | 0 | 1 | 4 | 2 | 82 |
| 14. AI search + LLM optimization | llms/API/pillars | 1 | 2 | 5 | 2 | 73 |
| 15. Tools interaction + logic | 9 tools | 0 | 1 | 5 | 3 | 81 |
| 16. Conversion + lead capture | sitewide + functions | 0 | 2 | 4 | 2 | 80 |
| 17. Freshness + maintenance | 186 pages + sitemaps | 0 | 3 | 5 | 2 | 61 |
| 18. Competitive positioning | top 5 query sample | 0 | 2 | 4 | 2 | 68 |

## 2. Per-Dimension Findings

### Dimension 1 — Code Quality

#### D1-F01

- Severity: P1
- File path + line number: `guides/buying-property-thailand/index.html:506`; `pattaya/australia-to-thailand/index.html:464`; `pattaya/china-to-thailand/index.html:464`; `pattaya/germany-to-thailand/index.html:464`; `pattaya/india-to-thailand/index.html:464`; `pattaya/russia-to-thailand/index.html:464`; `pattaya/uk-to-thailand/index.html:464`; `pattaya/usa-to-thailand/index.html:464`
- Description: HTML validation found 8 parser errors. The property guide contains raw `<5 years` text that the parser treats as a tag boundary, and the 7 country pages contain malformed image markup with `loading="lazy" / decoding="async"`.
- Why it matters: Parser errors are the highest-signal validation failures because browser recovery can differ from crawlers, validators, accessibility tooling, and AI extractors.
- Concrete fix suggestion: Escape the property text as `&lt;5 years`, and remove the stray slash between `loading` and `decoding` in the country-page image tags.
- Effort estimate: 30-45 minutes.
- Affected page count: 8.

#### D1-F02

- Severity: P2
- File path + line number: `404.html:4`; same pattern appears in every audited HTML file.
- Description: `html-validate` reports 5,509 `void-style` errors because HTML void elements are written XHTML-style, e.g. `<meta ... />` and `<link ... />`.
- Why it matters: Browsers tolerate this in HTML5, but it guarantees validator failure across all 186 pages and obscures real errors in CI.
- Concrete fix suggestion: Normalize generated/shared head markup to HTML5 void-element style with no trailing slash.
- Effort estimate: 2-4 hours if scripted.
- Affected page count: 186.

#### D1-F03

- Severity: P2
- File path + line number: `about/index.html:527`; `contact/index.html:611`; `visas/dtv/index.html:575`
- Description: 573 inline style attributes were detected across 183 pages. Many are repeated footer/version styles and link color overrides.
- Why it matters: Inline styles force CSP `'unsafe-inline'`, make visual changes hard to centralize, and keep repeated bytes on every page.
- Concrete fix suggestion: Move repeated footer version, CTA, and color overrides into shared classes while preserving the existing palette.
- Effort estimate: 4-8 hours.
- Affected page count: 183.

#### D1-F04

- Severity: P2
- File path + line number: `tools/bank-checker/index.html:320`; `tools/eligibility/index.html:345`; `tools/reminder/index.html:296`; `tools/visa-finder/index.html:317`; `tools/visa-finder/index.html:318`
- Description: 5 buttons lack an explicit `type` attribute.
- Why it matters: Buttons inside or near forms can submit unexpectedly after future edits; validators correctly flag this as fragile.
- Concrete fix suggestion: Add `type="button"` to tool action buttons unless the button is intentionally a submit control.
- Effort estimate: 10 minutes.
- Affected page count: 4.

#### D1-F05

- Severity: P2
- File path + line number: `api/visa-data.json:487`; `feed.json:51`; `sitemap.xml:407`; `sitemap-images.xml:96`; `sitemap_index.xml:36`
- Description: 22 audit-scope files lack a final newline; 155 files contain trailing whitespace.
- Why it matters: This is low-risk for runtime but high-noise for diffs, generated artifacts, and “perfect” source hygiene.
- Concrete fix suggestion: Run a one-time whitespace normalizer over `.html`, `.xml`, `.json`, `.txt`, and add a pre-commit/CI whitespace check if Tim is willing.
- Effort estimate: 30-60 minutes.
- Affected page/file count: 177 file-level hygiene findings.

#### D1-F06

- Severity: P2
- File path + line number: `banking/index.html:551`; `case-studies/index.html:628`; `compare/dtv-vs-elite/index.html:537`; `compare/dtv-vs-ltr/index.html:544`; `glossary/index.html:284`; `guides/driving-licence-thailand/index.html:560`
- Description: 15 raw-character validation errors and 1 unrecognized character reference remain, mostly raw `&`, `>`, and a malformed `&B` sequence.
- Why it matters: These are small copy/markup defects, but validators and extractors treat them as evidence of brittle HTML.
- Concrete fix suggestion: Escape literal ampersands and comparison symbols in text nodes.
- Effort estimate: 30-45 minutes.
- Affected page count: 10.

#### D1-F07

- Severity: P2
- File path + line number: `compare/dtv-vs-ltr/index.html:616`; `compare/dtv-vs-ltr/index.html:626`; `compare/non-o-vs-o-a/index.html:534`; `compare/non-o-vs-o-a/index.html:543`; `compare/privilege-vs-ltr/index.html:604`; `compare/privilege-vs-ltr/index.html:614`
- Description: 6 tables are missing explicit `<tbody>`.
- Why it matters: Browsers insert `<tbody>` implicitly, but explicit table structure is more stable for scraping, accessibility tooling, and future DOM queries.
- Concrete fix suggestion: Wrap table body rows in `<tbody>`.
- Effort estimate: 20 minutes.
- Affected page count: 3.

#### D1-F08

- Severity: P3
- File path + line number: `v2-preview/index.html:1`
- Description: `v2-preview/index.html` is still in the audit path and is missing the baseline schema/heading quality of production pages.
- Why it matters: Preview pages dilute sitewide quality if crawlable or included in broad audits.
- Concrete fix suggestion: If it must stay public, bring it to production metadata/schema standards; otherwise ensure it is noindexed and excluded from sitemaps.
- Effort estimate: 20-40 minutes.
- Affected page count: 1.

### Dimension 2 — JavaScript Quality

#### D2-F01

- Severity: P2
- File path + line number: `contact/index.html:486`; `about/index.html:399`; `methodology/index.html:393`
- Description: The deferred mobile-nav script pattern uses `var`, writes to `window.__mnavLoaded`, and constructs nav markup with `innerHTML`.
- Why it matters: This works, but it expands the global namespace and keeps the CSP dependent on inline execution.
- Concrete fix suggestion: Use a small external module or shared script with `const`/`let`, `data-` state, and DOM construction via `createElement`/`textContent`.
- Effort estimate: 4-6 hours if applied sitewide.
- Affected page count: roughly 180+ pages.

#### D2-F02

- Severity: P2
- File path + line number: `contact/index.html:677`; `contact/index.html:684`; `contact/index.html:716`; `contact/index.html:724`
- Description: The TOC generator writes heading text into `innerHTML`. Heading text is currently authored, not user-supplied, but this still creates a future XSS footgun if generated content is ever introduced.
- Why it matters: The site has many content pages and future automation is likely; safe DOM insertion should be the default.
- Concrete fix suggestion: Build anchors with `document.createElement('a')` and assign visible labels with `textContent`.
- Effort estimate: 2-4 hours.
- Affected page count: article/template pages using the TOC script.

#### D2-F03

- Severity: P1
- File path + line number: `functions/api/lead.js:113`; `functions/api/lead.js:124`; `functions/api/lead.js:144`; `functions/api/lead.js:218`; `functions/api/lead.js:242`
- Description: User-submitted lead fields are interpolated directly into HTML email, Slack text, and Discord embed payloads without HTML escaping and with only length trimming.
- Why it matters: This can turn the lead inbox and notification channels into an injection surface.
- Concrete fix suggestion: Add a tiny `escapeHtml()` helper for all HTML email fields, normalize URLs/user-agent/page values, and strip control characters before Slack/Discord output.
- Effort estimate: 1-2 hours.
- Affected page count: 2 function files; every lead submission path.

#### D2-F04

- Severity: P1
- File path + line number: `functions/api/lead.js:167`; `functions/api/lead.js:184`; `functions/api/subscribe.js:102`
- Description: Resend API calls are awaited, but response status is not checked before the API returns success.
- Why it matters: A bad API key, 429, malformed payload, or Resend outage can silently drop lead notifications while the frontend reports success.
- Concrete fix suggestion: Capture each `fetch()` response, check `res.ok`, log sanitized failure context, and return a degraded but truthful result when notification fails.
- Effort estimate: 1-2 hours.
- Affected page count: 2 function files.

#### D2-F05

- Severity: P2
- File path + line number: `tools/bank-checker/index.html:337`; `tools/visa-finder/index.html:348`; `tools/document-checklist/index.html:348`
- Description: The largest inline scripts are 12.7 KB, 12.7 KB, and 12.1 KB. None exceed the 50 KB hard threshold, but all tool logic remains inline.
- Why it matters: Inline scripts prevent strong CSP, make syntax/test reuse harder, and increase duplicate per-page bytes.
- Concrete fix suggestion: Extract each tool to a same-origin JS file or a small shared tool runtime plus per-tool config JSON.
- Effort estimate: 1-2 days if done carefully.
- Affected page count: 9 tool pages.

#### D2-F06

- Severity: P2
- File path + line number: `visas/dtv/index.html:59`; `tools/visa-finder/index.html:348`
- Description: Tool and FAQ logic embed live visa rules directly in page scripts/JSON-LD rather than deriving from one shared source of truth.
- Why it matters: The DTV and LTR tax drift found in this audit is exactly the failure mode created by duplicated rule encoding.
- Concrete fix suggestion: Keep `/api/visa-data.json` as the canonical rule source and generate/validate tool copies from it, without adding a CMS/build step.
- Effort estimate: 1 day.
- Affected page count: 9 tools plus all visa FAQ pages.

### Dimension 3 — CSS Quality

#### D3-F01

- Severity: P1
- File path + line number: `404.html:36`; `about/index.html:36`; `visas/dtv/index.html:66`
- Description: CSS is highly duplicated across page-local `<style>` blocks: 191 blocks, 4,673 KB total parsed CSS across HTML, 49,475 parsed rules, and 9,883 `!important` declarations.
- Why it matters: This is the biggest engineering maintainability drag in the repo; small style fixes require mass edits and create high regression risk.
- Concrete fix suggestion: Without adding a build step or redesigning the theme, centralize repeated base/template CSS into one or more static CSS files and keep page-specific overrides inline only where truly unique.
- Effort estimate: 2-4 days.
- Affected page count: 186.

#### D3-F02

- Severity: P2
- File path + line number: `404.html:376`; `about/index.html:379`; `404.html:381`; `404.html:384`
- Description: 944 overspecific selectors were detected, including large grouped selectors and attribute selectors such as `[style*="color:var(--td)"]`.
- Why it matters: Overspecific CSS causes specificity wars and forces later fixes into `!important` or broader selectors.
- Concrete fix suggestion: Replace repeated grouped selectors with named utility classes and template classes.
- Effort estimate: 1-2 days.
- Affected page count: broad template set.

#### D3-F03

- Severity: P2
- File path + line number: `404.html:36`
- Description: 5 custom properties are declared but unused: `--bg-4`, `--cyan-d`, `--pink-d`, `--v2-bg-4`, `--v2-pur`.
- Why it matters: Unused tokens create doubt about whether palette variables are canonical or legacy.
- Concrete fix suggestion: Remove unused custom properties only if no planned V2 page uses them; otherwise document their planned role.
- Effort estimate: 15 minutes.
- Affected page count: CSS template declarations.

#### D3-F04

- Severity: P2
- File path + line number: `404.html:36`
- Description: Reduced-motion support exists on 182 of 186 pages, but `prefers-contrast: more` and `prefers-color-scheme` are absent, and print stylesheet coverage is only 1 page.
- Why it matters: The dark-default design is strong, but high-contrast users and print users get no dedicated layer.
- Concrete fix suggestion: Add one shared high-contrast media query and one print stylesheet for article/tool pages.
- Effort estimate: 3-5 hours.
- Affected page count: 186 for contrast/color-scheme; 185 lacking print support.

#### D3-F05

- Severity: P2
- File path + line number: `visas/dtv/index.html:504`; `guides/thai-tax-foreign-residents/index.html:513`; `guides/thai-tax-foreign-residents/index.html:530`
- Description: Tables are a recurring 320px overflow source because table min-content width exceeds the viewport.
- Why it matters: Mobile-first indexing and iPhone SE users see horizontal scroll on important comparison/rule pages.
- Concrete fix suggestion: Add a shared `.table-wrap{overflow-x:auto}` wrapper or responsive card mode for data tables.
- Effort estimate: 2-4 hours.
- Affected page count: at least 38 representative overflow runs; table pages are the main subset.

#### D3-F06

- Severity: P3
- File path + line number: `404.html:36`; `about/index.html:36`
- Description: Container queries and logical properties are not used. The current layout relies on viewport breakpoints and physical margins/padding.
- Why it matters: This is not broken, but container queries would reduce layout edge-case fixes for cards, footer columns, and tool panels.
- Concrete fix suggestion: Do not redesign. Use container queries opportunistically on repeated card grids and tool result panels.
- Effort estimate: 1 day if folded into the CSS deduplication work.
- Affected page count: broad templates.

### Dimension 4 — SEO 2026

#### D4-F01

- Severity: P0
- File path + line number: `visas/dtv/index.html:59`; `visas/dtv/index.html:489`; `visas/dtv/index.html:526`; contradiction evidence at `tax/index.html:547`, `guides/thai-tax-foreign-residents/index.html:488`, `guides/thai-tax-foreign-residents/index.html:505`
- Description: The DTV page says later-year remitted foreign income is “currently treated as savings, not income.” The site’s tax pages correctly state that from 2024 onward, foreign income remitted by a Thai tax resident is taxable regardless of remittance year, except pre-2024 income and specific exemptions.
- Why it matters: This is high-stakes YMYL factual drift that can cause wrong tax planning.
- Concrete fix suggestion: Replace the DTV claim with the same rule used on the tax guide: post-2024 foreign-source income remitted by a Thai tax resident is taxable when remitted, subject to exemptions/treaty/accounting advice; explicitly separate pre-2024 savings.
- Effort estimate: 1-2 hours.
- Affected page count: 1 page, 3 occurrences, plus any AI extracts using that FAQ.

#### D4-F02

- Severity: P0
- File path + line number: `compare/visa-comparison-matrix/index.html:650`; `compare/visa-comparison-matrix/index.html:909`; `api/visa-data.json:84`; `api/visa-data.json:85`; `llms.txt:28`; correct local source at `visas/ltr/index.html:58`, `visas/ltr/index.html:436`, `visas/ltr/index.html:487`, `visas/ltr/index.html:492`
- Description: LTR tax-exemption coverage is inconsistent. The matrix says Highly-Skilled Professional gets the foreign-income exemption; the LTR pillar says it does not. The API marks LTR exemption as globally true. `llms.txt` lists Wealthy Pensioner and Wealthy Global Citizen but omits Work-from-Thailand Professional.
- Why it matters: AI systems and tools can cite or consume the wrong LTR tax answer.
- Concrete fix suggestion: Normalize every source to category-specific language: W, P, and T foreign-source income exemption; H has the 17% tax rate for qualifying Thai-employer income, not the foreign-income remittance exemption.
- Effort estimate: 2-3 hours.
- Affected page count: 4 source surfaces.

#### D4-F03

- Severity: P1
- File path + line number: `visas/business-non-b/index.html:1`; `visas/education-ed/index.html:1`; `visas/marriage-non-o/index.html:1`; `visas/media-non-m/index.html:1`; `visas/retirement-non-o/index.html:1`; `visas/retirement-o-a/index.html:1`; `visas/retirement-o-x/index.html:1`; `visas/smart/index.html:1`
- Description: 8 visa pillar pages have zero official-source outbound citations by static extraction.
- Why it matters: For visa YMYL content, primary-source citations are an E-E-A-T floor, not a nice-to-have.
- Concrete fix suggestion: Add at least one official source per pillar, preferably Thai e-Visa, Immigration, BOI, MFA, embassy, or Thailand.go.th, tied to the rule being claimed.
- Effort estimate: 4-6 hours.
- Affected page count: 8.

#### D4-F04

- Severity: P2
- File path + line number: `best-visa/under-20k/index.html:6`; `tools/eligibility/index.html:8`; `visas/dtv/index.html:6`; `pattaya-digital-nomad-guide/index.html:6`
- Description: 27 title tags exceed 60 characters and are likely to truncate in standard SERP layouts.
- Why it matters: Truncated titles reduce CTR and make the strongest differentiator invisible.
- Concrete fix suggestion: Trim the 27 title tags to preserve visa type/query + Pattaya/local modifier + brand only where useful.
- Effort estimate: 2-3 hours.
- Affected page count: 27.

#### D4-F05

- Severity: P2
- File path + line number: `glossary/soft-power/index.html:7`; `professions/digital-nomad/index.html:7`; `tools/ltr-eligibility/index.html:9`
- Description: 3 meta descriptions are very short: 48, 60, and 61 characters.
- Why it matters: Short descriptions underuse SERP snippet real estate and can cause Google to rewrite them.
- Concrete fix suggestion: Expand to specific 120-155 character descriptions while keeping them factual.
- Effort estimate: 20 minutes.
- Affected page count: 3.

#### D4-F06

- Severity: P2
- File path + line number: `_redirects:6`
- Description: `/visas` redirects to `/#visas` instead of the existing `/visas/` hub.
- Why it matters: This sends direct hub intent to a homepage fragment and weakens the clean visa hub URL.
- Concrete fix suggestion: Redirect `/visas` to `/visas/` unless there is a deliberate analytics reason for the homepage fragment.
- Effort estimate: 5 minutes.
- Affected page count: 1 redirect rule.

#### D4-F07

- Severity: P2
- File path + line number: `llms.txt:28`; `api/visa-data.json:84`
- Description: AI Overview/LLM source surfaces are not yet treated as canonical outputs with automated consistency checks.
- Why it matters: AI citations increasingly draw from concise files/API endpoints, so factual drift there is amplified.
- Concrete fix suggestion: Add a lightweight consistency audit that checks `llms.txt`, `api/visa-data.json`, and key page FAQs for the same visa/tax claims.
- Effort estimate: 1 day.
- Affected page count: 2 source surfaces plus 12 pillars.

### Dimension 5 — UI/UX

#### D5-F01

- Severity: P1
- File path + line number: `visas/dtv/index.html:504`; `guides/thai-tax-foreign-residents/index.html:513`; `guides/thai-tax-foreign-residents/index.html:530`
- Description: 38 of 602 representative viewport runs had horizontal overflow at 320px. Affected URLs include `/`, most visa pillars, several tools, guides, comparisons, `/de/`, `/ru/`, and `/404.html`.
- Why it matters: 320px is still the smallest realistic mobile viewport and part of the explicit brief.
- Concrete fix suggestion: Wrap wide tables/grids, audit footer/grid min-widths, and add a 320px-specific regression check.
- Effort estimate: 4-8 hours.
- Affected page count: 38 representative URL/viewport failures.

#### D5-F02

- Severity: P1
- File path + line number: `index.html:1`; `tools/eligibility/index.html:345`; `blog/index.html:1`
- Description: Every one of the 602 layout runs had at least one interactive target below 44x44px; 588 runs had tiny text below 14px on mobile. Common examples are nav pills, breadcrumb links, footer links, and tool buttons.
- Why it matters: WCAG 2.5.5 target size is AAA, but mobile users feel this directly.
- Concrete fix suggestion: Raise nav/footer/breadcrumb hit areas with padding while keeping visual typography unchanged; set tool buttons to a minimum 44px height.
- Effort estimate: 4-6 hours.
- Affected page count: broad sitewide.

#### D5-F03

- Severity: P2
- File path + line number: `tools/reminder/index.html:287`; `tools/reminder/index.html:315`; `tools/reminder/index.html:319`
- Description: The reminder tool pre-fills arrival date with today, so the default state already calculates deadlines instead of showing a neutral empty state.
- Why it matters: It makes the tool appear to have an answer before the user has supplied intent.
- Concrete fix suggestion: Leave the date empty initially, show a short empty state, and calculate only after user input.
- Effort estimate: 30 minutes.
- Affected page count: 1.

#### D5-F04

- Severity: P2
- File path + line number: `tools/bank-checker/index.html:323`; `tools/cost-calculator/index.html:326`; `tools/document-checklist/index.html:310`; `tools/eligibility/index.html:348`; `tools/expiry-countdown/index.html:317`; `tools/income-test/index.html:327`; `tools/reminder/index.html:299`
- Description: Tool result panels are visually clear but have no `aria-live` and inconsistent empty/loading/error states.
- Why it matters: Users relying on assistive tech do not get result changes announced.
- Concrete fix suggestion: Add `aria-live="polite"` to result containers and standardize empty/error/success copy.
- Effort estimate: 1-2 hours.
- Affected page count: 9 tools.

#### D5-F05

- Severity: P2
- File path + line number: `404.html:36`
- Description: Motion is broadly disabled for `prefers-reduced-motion`, but the site has many transitions/animated marquee elements and no automated reduced-motion screenshot check.
- Why it matters: A future page can regress motion support without detection.
- Concrete fix suggestion: Add Playwright reduced-motion assertions for marquee stopped and no transition duration above a minimal threshold.
- Effort estimate: 2-3 hours.
- Affected page count: 186 potential.

### Dimension 6 — Accessibility

#### D6-F01

- Severity: P1
- File path + line number: `index.html:373`; `index.html:389`; `404.html:485`; `about/index.html:407`
- Description: axe reports `region` violations in 368 of 370 runs, with 1,690 affected nodes. Common nodes are `.mq`, `.brand`, `.tldr`, `.read-next`, and `.contact-section`.
- Why it matters: Content outside landmarks weakens screen-reader navigation even when visual layout is fine.
- Concrete fix suggestion: Place marquee/header/nav inside semantic landmarks, ensure each page has one clear `<main>`, and wrap repeated sections in appropriate `header`, `nav`, `main`, `aside`, or `footer`.
- Effort estimate: 4-8 hours.
- Affected page count: nearly all pages.

#### D6-F02

- Severity: P1
- File path + line number: `about/index.html:407`; `404.html:485`; `index.html:397`
- Description: Pa11y reports 766 WCAG2AA contrast errors in 360 of 372 runs. The recurring contrast ratio is 4.35:1 for low-emphasis separators/meta text against black.
- Why it matters: This is just below AA and easy to fix without changing the brand palette.
- Concrete fix suggestion: Lift the low-emphasis token used for separators/meta text from the current shade to at least Pa11y’s suggested `#74747d` or a tokenized equivalent already compatible with the palette.
- Effort estimate: 1-2 hours.
- Affected page count: 180 page/viewport pairs.

#### D6-F03

- Severity: P1
- File path + line number: `tools/bank-checker/index.html:323`; `tools/cost-calculator/index.html:326`; `tools/document-checklist/index.html:310`; `tools/eligibility/index.html:348`; `tools/expiry-countdown/index.html:317`; `tools/income-test/index.html:327`; `tools/reminder/index.html:299`
- Description: Tool outputs update dynamically but are not announced through live regions.
- Why it matters: A screen-reader user can activate a calculator and not hear that a result appeared.
- Concrete fix suggestion: Add `role="status"` or `aria-live="polite"` to result regions and focus management only where results are far below the button.
- Effort estimate: 1-2 hours.
- Affected page count: 9.

#### D6-F04

- Severity: P2
- File path + line number: `guides/thai-tax-foreign-residents/index.html:513`; `guides/thai-tax-foreign-residents/index.html:530`; `guides/permanent-residency-thailand/index.html:486`; `guides/re-entry-permits/index.html:559`
- Description: 46 pages contain table headers without explicit `scope`.
- Why it matters: Screen readers infer table relationships less reliably without header scope, especially in comparison tables.
- Concrete fix suggestion: Add `scope="col"` to column headers and `scope="row"` to row-label headers.
- Effort estimate: 2-3 hours.
- Affected page count: 46.

#### D6-F05

- Severity: P2
- File path + line number: `tools/reminder/index.html:287`; `tools/cost-calculator/index.html:1`; `tools/eligibility/index.html:1`
- Description: Tool inputs are generally labelled, but autocomplete/inputmode/type hints are incomplete. Counts: reminder 2 missing, eligibility 8, income-test 4, cost-calculator 3, currency-converter 4, bank-checker 2.
- Why it matters: Mobile keyboards and assistive autofill are part of accessible form UX.
- Concrete fix suggestion: Add `inputmode`, semantic `type`, and `autocomplete` values where the user enters dates, currencies, income, email, phone, or country data.
- Effort estimate: 2-3 hours.
- Affected page count: 8 tool pages.

### Dimension 7 — Link Structure

#### D7-F01

- Severity: P1
- File path + line number: `sitemap-images.xml:50`; `sitemap-images.xml:58`; `sitemap-images.xml:66`; `sitemap-images.xml:74`; `sitemap-images.xml:82`; `sitemap-images.xml:90`
- Description: Image sitemap URLs use abbreviated country slugs (`us`, `de`, `au`, `ru`, `cn`, `in`) that live-check as 404s. The deployed slugs are full names such as `/pattaya/usa-to-thailand/` and `/pattaya/germany-to-thailand/`.
- Why it matters: XML sitemaps are explicit crawl instructions; sending crawlers to 404s wastes crawl budget and harms trust in the sitemap.
- Concrete fix suggestion: Replace the 6 abbreviated URLs with the deployed full country slugs.
- Effort estimate: 15 minutes.
- Affected page count: 6 sitemap URL entries.

#### D7-F02

- Severity: P2
- File path + line number: `_redirects:6`
- Description: `/visas` redirects to a homepage fragment while `/visas/` exists as a hub.
- Why it matters: Users and crawlers asking for the visa hub should land on the canonical hub.
- Concrete fix suggestion: Change the redirect to `/visas/`.
- Effort estimate: 5 minutes.
- Affected page count: 1 rule.

#### D7-F03

- Severity: P2
- File path + line number: `v2-preview/index.html:275`; `functions/api/lead.js:135`; `functions/api/lead.js:155`; `functions/api/subscribe.js:94`
- Description: Secondary WhatsApp links use `wa.me` while the lane-guarded site channel is the exact `api.whatsapp.com/send/?phone=66967286999&text=...` URL.
- Why it matters: Analytics, trust, and contact-message consistency are weaker when alternate contact URLs leak into pages/emails.
- Concrete fix suggestion: Align these with the approved WhatsApp URL and text, without changing the channel.
- Effort estimate: 30 minutes.
- Affected page count: 1 HTML preview + 2 function files.

#### D7-F04

- Severity: P2
- File path + line number: external-link probe, source references include `visas/dtv/index.html:446`
- Description: External checks found unstable/bot-blocked official/commercial links and one likely broken banking URL (`https://www.uob.co.th/en/` returned 500 in the audit).
- Why it matters: Outbound trust links are part of E-E-A-T; broken banking/insurance links degrade utility.
- Concrete fix suggestion: Recheck the blocked official links manually, replace the UOB URL with a stable page, and record expected 403 bot-block exceptions.
- Effort estimate: 1-2 hours.
- Affected page count: unknown from unique URL mapping; 47 unique external URLs audited.

#### D7-F05

- Severity: P3
- File path + line number: static link graph, `index.html:1`
- Description: No internal URLs were found deeper than 3 clicks in the static graph, and no sitemap HTML page was orphaned after excluding the 6 image-sitemap 404s.
- Why it matters: This is a strength, but it should be regression-tested because the site is now large.
- Concrete fix suggestion: Keep a click-depth/orphan check in the recurring audit suite.
- Effort estimate: 1 hour.
- Affected page count: 186.

### Dimension 8 — Text Quality + Authenticity

#### D8-F01

- Severity: P0
- File path + line number: `visas/dtv/index.html:489`; `visas/dtv/index.html:526`; `tax/index.html:547`; `guides/thai-tax-foreign-residents/index.html:488`
- Description: DTV tax language conflicts with the site’s correct tax guide. This is the biggest text-quality defect because it is not stylistic; it is substantive.
- Why it matters: Readers may plan remittances around a rule the site itself says has stopped working.
- Concrete fix suggestion: Use the tax guide’s wording as the canonical text and link from DTV to the tax guide for nuance.
- Effort estimate: 1 hour.
- Affected page count: 1.

#### D8-F02

- Severity: P1
- File path + line number: `visas/dtv/index.html:374`; `visas/dtv/index.html:397`; `visas/dtv/index.html:575`; `compare/visa-comparison-matrix/index.html:467`; `visas/index.html:483`
- Description: Visible update labels still show `UPDATED 10 MAY 2026`, `Verified April 2026`, `Updated April 2026`, or `Last refreshApril 2026` while sitemap/footer/schema claim 18 May 2026. Static search found 625 stale date strings excluding `_research`.
- Why it matters: Freshness mismatch damages trust more than having an older date consistently shown.
- Concrete fix suggestion: Decide which visible dates should be content-verification dates versus build-version dates, then normalize all four layers: visible, JSON-LD, sitemap `lastmod`, and changelog.
- Effort estimate: 4-8 hours.
- Affected page count: broad; 625 stale strings.

#### D8-F03

- Severity: P2
- File path + line number: `guides/thai-tax-foreign-residents/index.html:508`
- Description: Time-bound language says “As of April 2026” in a page that otherwise has May 2026 metadata and footer freshness.
- Why it matters: Visa/tax readers need to know whether “as of” means legal verification date or stale copy.
- Concrete fix suggestion: Convert time-bound claims to exact “Verified on 18 May 2026” language only where they were truly rechecked.
- Effort estimate: 1-2 hours as part of freshness cleanup.
- Affected page count: included in the 625 stale-date string set.

#### D8-F04

- Severity: P2
- File path + line number: `visas/business-non-b/index.html:1`; `visas/media-non-m/index.html:1`; `visas/smart/index.html:1`
- Description: Some visa pillars lack the citation density that would make their strong local/practitioner voice fully defensible. Static extraction found zero official outbound citations on 8 visa pillars.
- Why it matters: For YMYL trust, local voice plus primary-source backing is stronger than either alone.
- Concrete fix suggestion: Add official citations only where a specific rule is asserted; do not rewrite voice unnecessarily.
- Effort estimate: 4-6 hours.
- Affected page count: 8.

#### D8-F05

- Severity: P3
- File path + line number: `visas/dtv/index.html:446`; `guides/jomtien-immigration-office/index.html:1`; `about/index.html:1`
- Description: AI-signature heuristics did not identify a systemic “generic AI” voice problem. The content uses named local markers like Soi 5/Jomtien, exact fees, and practical caveats.
- Why it matters: This is a genuine strength and should not be overwritten by generic SEO prose.
- Concrete fix suggestion: Preserve practitioner-specific examples while fixing only factual/source errors.
- Effort estimate: none.
- Affected page count: long-form pages reviewed.

### Dimension 9 — Content Gaps

#### D9-F01

- Severity: P1
- File path + line number: `visas/business-non-b/index.html:1`; `visas/education-ed/index.html:1`; `visas/marriage-non-o/index.html:1`; `visas/retirement-non-o/index.html:1`; `visas/retirement-o-a/index.html:1`; `visas/retirement-o-x/index.html:1`; `visas/smart/index.html:1`
- Description: The largest competitive content gap is not page count; it is official-source coverage per pillar. Competitors such as Siam Legal/ThaiEmbassy win perceived authority partly by wrapping every rule in official or legal framing.
- Why it matters: Pattaya Visa Help can beat them on local specificity, but not if pillars look uncited.
- Concrete fix suggestion: Add official citations to under-cited pillars and make each citation support the nearest rule claim.
- Effort estimate: 4-6 hours.
- Affected page count: 8.

#### D9-F02

- Severity: P2
- File path + line number: `compare/index.html:1`; `guides/index.html:1`
- Description: Transition-guide coverage is weaker than pillar coverage. Users often ask “DTV to LTR,” “TR to ED,” “Retirement O-A to Non-O,” “Marriage to retirement,” and “Privilege to LTR.”
- Why it matters: Transition queries are high-intent and often closer to a paid consultation than first-touch visa definitions.
- Concrete fix suggestion: Add transition pages only where search/lead evidence supports them; first candidates are DTV-to-LTR and O-A-to-Non-O because existing content already supports them.
- Effort estimate: 1-2 days per pair if done properly.
- Affected page count: new evidence-backed content opportunities, not fixes to existing pages.

#### D9-F03

- Severity: P2
- File path + line number: `guides/jomtien-immigration-office/index.html:1`; `guides/90-day-reporting/index.html:1`
- Description: Pattaya operational content exists, but holiday/closure cadence and office-specific “what changed this month” references are not systematized.
- Why it matters: Local operational freshness is the site’s strongest moat against generic legal competitors.
- Concrete fix suggestion: Add a dated operational-update block to the Jomtien/90-day pages when verified, and link it from relevant tool/pillar pages.
- Effort estimate: 3-5 hours per update cycle.
- Affected page count: 2-5 existing pages.

#### D9-F04

- Severity: P2
- File path + line number: `professions/digital-nomad/index.html:7`; `professions/online-business-owner/index.html:6`; `professions/diving-instructor/index.html:6`
- Description: Profession pages exist, but some metadata is thin or overlong and one digital-nomad page lacks JSON-LD.
- Why it matters: Profession pages are useful for AI answers and long-tail acquisition only if metadata/schema is as strong as pillar pages.
- Concrete fix suggestion: Bring profession templates to the same schema/meta standard as visa pillars.
- Effort estimate: 2-4 hours.
- Affected page count: profession pages, especially digital nomad.

### Dimension 10 — Schema / Structured Data

#### D10-F01

- Severity: P1
- File path + line number: `404.html:1`; `professions/digital-nomad/index.html:1`; `tools/ltr-eligibility/index.html:1`; `v2-preview/index.html:1`
- Description: 4 HTML pages have no JSON-LD.
- Why it matters: The site has broad schema coverage elsewhere, so these pages stand out as template drift.
- Concrete fix suggestion: Add appropriate minimal schema: `WebPage`/`BreadcrumbList` for 404 and preview, `Article` or profession page schema for digital nomad, `WebApplication` for LTR eligibility.
- Effort estimate: 2-3 hours.
- Affected page count: 4.

#### D10-F02

- Severity: P2
- File path + line number: `about/index.html:1`; `best-visa/index.html:1`; `guides/index.html:1`
- Description: 84 pages are missing `dateModified` in JSON-LD or have schema nodes where the page-level date is not represented.
- Why it matters: Freshness is one of the site’s explicit trust signals; schema should carry it consistently.
- Concrete fix suggestion: Add `dateModified` to page-level `Article`, `WebPage`, `CollectionPage`, and comparable schema nodes.
- Effort estimate: 4-8 hours if scripted.
- Affected page count: 84.

#### D10-F03

- Severity: P2
- File path + line number: `index.html:1`; `visas/dtv/index.html:1`; `tools/visa-finder/index.html:1`
- Description: Schema graph extraction found 375 nodes but 221 nodes without stable `@id`, across 146 pages.
- Why it matters: Stable `@id` references help Google/AI systems merge Organization, WebSite, Person, Article, FAQ, and tool entities.
- Concrete fix suggestion: Add stable `@id` values for page nodes and reference shared Organization/WebSite/Person IDs through `publisher`, `author`, `isPartOf`, and `mainEntityOfPage`.
- Effort estimate: 1-2 days.
- Affected page count: 146.

#### D10-F04

- Severity: P2
- File path + line number: `visas/dtv/index.html:59`; `faq/index.html:1`
- Description: No Speakable schema was found on any page.
- Why it matters: Speakable is not a universal ranking lever, but the brief explicitly targets voice/AI citation readiness and short answer blocks.
- Concrete fix suggestion: Add Speakable only to top-level answer blocks on homepage, 12 pillars, and FAQ pages; do not spam it across every section.
- Effort estimate: 4-6 hours.
- Affected page count: about 15 target pages.

#### D10-F05

- Severity: P0
- File path + line number: `compare/visa-comparison-matrix/index.html:909`; `api/visa-data.json:84`; `llms.txt:28`
- Description: Structured/LLM data repeats the LTR tax category drift described in D4-F02.
- Why it matters: Machine-readable mistakes are more dangerous than prose mistakes because they are easy for other systems to ingest without context.
- Concrete fix suggestion: Treat structured data/API/LLM files as canonical outputs and validate them against the LTR pillar before deploy.
- Effort estimate: 2-3 hours.
- Affected page count: 3 machine-readable surfaces.

### Dimension 11 — Performance

#### D11-F01

- Severity: P1
- File path + line number: `visas/privilege-elite/index.html:1`; `compare/dtv-vs-ltr/index.html:1`; `blog/index.html:1`; `tools/reminder/index.html:1`
- Description: Lighthouse mobile sample still shows Core Web Vitals warnings: CLS 0.241 on `/visas/privilege-elite/`, CLS 0.166 on `/compare/dtv-vs-ltr/`, CLS 0.103 on `/blog/`, and LCP 2,762 ms on `/tools/reminder/`.
- Why it matters: The best pages are near perfect, but these sample pages miss the stated LCP/CLS budgets.
- Concrete fix suggestion: Inspect LCP element dimensions and CLS source traces for those four pages; reserve image/card/table space before web fonts and dynamic content settle.
- Effort estimate: 4-8 hours.
- Affected page count: 4 in sample.

#### D11-F02

- Severity: P2
- File path + line number: `index.html:36`; `visas/dtv/index.html:66`
- Description: Lighthouse reports 48-68 KB unused JavaScript on every sampled page, mostly third-party/delayed analytics and shared inline behavior.
- Why it matters: Unused JS is not the biggest bottleneck here, but it constrains INP headroom and CSP hardening.
- Concrete fix suggestion: Keep GA delayed, remove unused third-party allowlist/script assumptions, and extract shared behavior into cacheable modules.
- Effort estimate: 4-8 hours.
- Affected page count: 24 sampled runs; likely sitewide.

#### D11-F03

- Severity: P2
- File path + line number: `_headers:16`; `_headers:19`
- Description: Live Cloudflare responses for directory HTML such as `/visas/dtv/` and `/tools/visa-finder/` returned `Cache-Control: public, max-age=0, must-revalidate`, while `_headers` intends short HTML caching.
- Why it matters: The source header policy and live behavior do not fully match, and HTML revalidation affects TTFB.
- Concrete fix suggestion: Confirm Cloudflare Pages header pattern matching for directory indexes and adjust `_headers` patterns if needed.
- Effort estimate: 1-2 hours.
- Affected page count: directory-index HTML pages.

#### D11-F04

- Severity: P2
- File path + line number: `_headers:1`; live response evidence from `https://pattayavisahelp.com/`
- Description: HTTP/3 is enabled via `alt-svc: h3=":443"; ma=86400`, Brotli/gzip works through Cloudflare, and no `Set-Cookie` was observed on sampled responses.
- Why it matters: This is a performance/privacy strength; preserve it while changing headers.
- Concrete fix suggestion: No fix required; add header regression checks so this does not degrade.
- Effort estimate: 1 hour.
- Affected page count: live site.

### Dimension 12 — Security + Headers + Privacy

#### D12-F01

- Severity: P1
- File path + line number: `functions/api/lead.js:42`; `functions/api/subscribe.js:34`
- Description: Turnstile verification runs only when both `TURNSTILE_SECRET` and `cf-turnstile-response` are present. If the secret is configured but the client omits the response, verification is skipped.
- Why it matters: This defeats the intended bot-control path for malformed or scripted submissions.
- Concrete fix suggestion: If `TURNSTILE_SECRET` exists, require a token and fail closed when missing or invalid.
- Effort estimate: 30-60 minutes.
- Affected page count: 2 function files.

#### D12-F02

- Severity: P1
- File path + line number: `functions/api/lead.js:113`; `functions/api/lead.js:124`; `functions/api/lead.js:144`; `functions/api/lead.js:218`; `functions/api/lead.js:242`
- Description: Lead data is interpolated into HTML/email/notification bodies without HTML escaping.
- Why it matters: Email-client HTML injection and notification spoofing are realistic abuse paths.
- Concrete fix suggestion: Escape all HTML fields and sanitize notification text; also normalize `lead.page` to an allowed same-origin URL or plain text.
- Effort estimate: 1-2 hours.
- Affected page count: 1 function file.

#### D12-F03

- Severity: P2
- File path + line number: `_headers:12`
- Description: CSP still permits `'unsafe-inline'` for both scripts and styles, and allows unused-looking script hosts such as `cdn.tailwindcss.com` and `cdnjs.cloudflare.com`.
- Why it matters: The policy is strong for a static site, but still too permissive for a 2026 hardening target.
- Concrete fix suggestion: Extract inline scripts/styles enough to remove script `'unsafe-inline'` first; then tighten unused host allowlists.
- Effort estimate: 2-5 days depending on CSS/JS extraction depth.
- Affected page count: sitewide.

#### D12-F04

- Severity: P2
- File path + line number: live header evidence; `_headers:1`
- Description: Live responses include `Access-Control-Allow-Origin: *` broadly, although `_headers` does not show that directive.
- Why it matters: Public static content can be CORS-open, but API/HTML responses should not be broader than needed without a reason.
- Concrete fix suggestion: Identify whether Cloudflare Pages or a dashboard rule injects this; scope CORS to `/api/visa-data.json` if cross-origin access is intentional.
- Effort estimate: 1-2 hours.
- Affected page count: live response policy.

#### D12-F05

- Severity: P2
- File path + line number: `functions/api/lead.js:167`; `functions/api/lead.js:184`; `functions/api/subscribe.js:102`
- Description: External notification fetches do not check `res.ok`, and failures are swallowed into success responses.
- Why it matters: Lead capture can fail silently.
- Concrete fix suggestion: Check status, log sanitized provider errors, and expose a degraded status to the client only where user action is needed.
- Effort estimate: 1-2 hours.
- Affected page count: 2 function files.

#### D12-F06

- Severity: P3
- File path + line number: `_headers:12`
- Description: COOP is present, but COEP/CORP are absent.
- Why it matters: COEP/CORP are not necessary for this static site unless using cross-origin isolation, but the absence should be an explicit choice.
- Concrete fix suggestion: Document “not needed” unless future features require SharedArrayBuffer/cross-origin isolation.
- Effort estimate: 15 minutes.
- Affected page count: sitewide.

### Dimension 13 — Mobile-First Indexing Readiness

#### D13-F01

- Severity: P1
- File path + line number: `visas/dtv/index.html:504`; `index.html:1`
- Description: Mobile content parity is generally good because the site is static HTML, but 320px overflow affects discoverability and usability on the smallest mobile viewport.
- Why it matters: Google indexes mobile; overflow can hide table columns or make answer extraction less reliable.
- Concrete fix suggestion: Fix responsive table/grid overflow and add an automated 320px no-horizontal-scroll test.
- Effort estimate: 4-8 hours.
- Affected page count: 38 representative failures.

#### D13-F02

- Severity: P2
- File path + line number: `tools/reminder/index.html:287`; `tools/cost-calculator/index.html:1`; `tools/eligibility/index.html:1`
- Description: Mobile keyboard hints are incomplete on tool fields.
- Why it matters: Mobile users should get numeric/date/email keyboards without fighting generic text inputs.
- Concrete fix suggestion: Add `inputmode`, `type`, and `autocomplete` attributes per input.
- Effort estimate: 2-3 hours.
- Affected page count: 8 tool pages.

#### D13-F03

- Severity: P3
- File path + line number: `index.html:5`
- Description: Viewport meta is present across pages and content is server-rendered/static, not JS-dependent.
- Why it matters: This is a mobile-first strength.
- Concrete fix suggestion: Preserve this; do not move primary content behind JS-only rendering.
- Effort estimate: none.
- Affected page count: 186.

### Dimension 14 — AI Search + LLM Optimization

#### D14-F01

- Severity: P1
- File path + line number: `llms.txt:28`; `api/visa-data.json:84`; `visas/ltr/index.html:58`
- Description: The LTR answer in `llms.txt` and API JSON does not match the category-specific answer on the LTR page.
- Why it matters: LLMs are likely to consume `llms.txt` and the JSON endpoint before parsing long pages.
- Concrete fix suggestion: Update `llms.txt` and API JSON to category-specific tax treatment.
- Effort estimate: 1 hour.
- Affected page count: 2 files.

#### D14-F02

- Severity: P0
- File path + line number: `visas/dtv/index.html:59`; `visas/dtv/index.html:526`
- Description: The DTV FAQ schema and visible FAQ expose the incorrect later-year remittance claim directly to AI extractors.
- Why it matters: FAQ schema is highly quotable; a wrong FAQ answer is a direct AI-search liability.
- Concrete fix suggestion: Fix visible FAQ and JSON-LD answer together.
- Effort estimate: 1 hour.
- Affected page count: 1.

#### D14-F03

- Severity: P2
- File path + line number: `api/visa-data.json:487`
- Description: `/api/visa-data.json` is valid and useful but lacks a final newline and has coarse LTR tax fields.
- Why it matters: The endpoint is a good AI surface; it should be treated with API-level exactness.
- Concrete fix suggestion: Add category-level tax fields and final newline.
- Effort estimate: 1-2 hours.
- Affected page count: 1 JSON file.

#### D14-F04

- Severity: P2
- File path + line number: `visas/dtv/index.html:59`; `visas/ltr/index.html:58`; `faq/index.html:1`
- Description: AI-quotable answer blocks exist, but answer lengths are not consistently optimized to sub-40-word answers.
- Why it matters: Concise Q&A increases extractability for AI Overview, Perplexity, and voice answers.
- Concrete fix suggestion: Tighten FAQ answer first sentences without rewriting the page body.
- Effort estimate: 4-6 hours for pillars and FAQ.
- Affected page count: 12 pillars + FAQ.

### Dimension 15 — Tools Interaction + Logic Correctness

#### D15-F01

- Severity: P1
- File path + line number: `tools/reminder/index.html:287`; `tools/reminder/index.html:315`; `tools/reminder/index.html:319`
- Description: 8 of 9 Playwright tool happy paths passed. The reminder tool failed the empty-state test because it prefilled today and immediately calculated deadlines.
- Why it matters: The tool’s first-run state should not imply the user has entered an arrival date.
- Concrete fix suggestion: Start with an empty date, show neutral empty copy, and only calculate after input or button click.
- Effort estimate: 30 minutes.
- Affected page count: 1.

#### D15-F02

- Severity: P2
- File path + line number: `tools/bank-checker/index.html:323`; `tools/cost-calculator/index.html:326`; `tools/income-test/index.html:327`
- Description: Tool result regions lack live-region semantics.
- Why it matters: This blocks accessible feedback even though the visual result updates correctly.
- Concrete fix suggestion: Add `aria-live="polite"` or `role="status"` to all result containers.
- Effort estimate: 1-2 hours.
- Affected page count: 9.

#### D15-F03

- Severity: P2
- File path + line number: `tools/visa-finder/index.html:348`; `tools/income-test/index.html:1`
- Description: Tool starts/completions are not tracked as explicit analytics events.
- Why it matters: Tim cannot distinguish tool views from successful tool interactions or prioritize conversion fixes by evidence.
- Concrete fix suggestion: Add privacy-respecting GA events for tool start, completion, invalid input, and CTA click.
- Effort estimate: 3-5 hours.
- Affected page count: 9.

#### D15-F04

- Severity: P2
- File path + line number: `tools/visa-finder/index.html:348`; `tools/cost-calculator/index.html:368`
- Description: Tool results are not shareable through URL state, copy buttons, or downloadable summaries.
- Why it matters: Visa decisions are consultative; shareability can increase return visits and lead quality.
- Concrete fix suggestion: Evidence-backed enhancement: start with copyable result summaries and URL query state on Visa Finder and Cost Calculator only.
- Effort estimate: 1-2 days.
- Affected page count: 2 priority tools.

#### D15-F05

- Severity: P3
- File path + line number: `tools/visa-finder/index.html:348`; `tools/cost-calculator/index.html:368`; `tools/eligibility/index.html:362`
- Description: Tool logic is currently inline and not unit-tested as isolated functions.
- Why it matters: Future visa-rule changes are risky without testable pure functions.
- Concrete fix suggestion: Extract rule functions into same-origin JS files and add simple Node-based tests.
- Effort estimate: 1-2 days.
- Affected page count: 9 tools.

### Dimension 16 — Conversion + Lead Capture

#### D16-F01

- Severity: P1
- File path + line number: `functions/api/lead.js:167`; `functions/api/lead.js:184`; `functions/api/subscribe.js:102`
- Description: Lead notification failures can be silent because provider responses are not checked.
- Why it matters: Lead capture is the business-critical conversion path.
- Concrete fix suggestion: Check Resend response status and add durable alerting/logging for notification failure.
- Effort estimate: 1-2 hours.
- Affected page count: 2 function files.

#### D16-F02

- Severity: P2
- File path + line number: `v2-preview/index.html:275`; `functions/api/lead.js:155`; `functions/api/subscribe.js:94`
- Description: Some conversion surfaces use `wa.me` instead of the approved `api.whatsapp.com/send/?phone=66967286999&text=...` URL.
- Why it matters: The exact prefilled message is a lane guard and a conversion consistency asset.
- Concrete fix suggestion: Replace the non-canonical WhatsApp URLs with the guarded URL.
- Effort estimate: 30 minutes.
- Affected page count: 1 preview page + 2 function files.

#### D16-F03

- Severity: P2
- File path + line number: sitewide `mailto:` CTAs, example `404.html:1`
- Description: Many `mailto:info@pattayavisahelp.com` links are not topic-prefilled.
- Why it matters: Subject-prefilled emails improve triage and reduce friction for visa-specific leads.
- Concrete fix suggestion: Add page-topic subject lines where CTAs are contextual; keep the email address unchanged.
- Effort estimate: 3-5 hours.
- Affected page count: broad CTA/footer set.

#### D16-F04

- Severity: P3
- File path + line number: `contact/index.html:1`; `about/index.html:1`; `visas/dtv/index.html:575`
- Description: Time-to-contact is strong: email/WhatsApp/LINE are consistently visible in footer/contact surfaces.
- Why it matters: The site already avoids the hidden-contact problem common on affiliate visa sites.
- Concrete fix suggestion: Preserve contact-channel consistency while fixing canonical URL drift.
- Effort estimate: none beyond D16-F02.
- Affected page count: broad.

### Dimension 17 — Content Freshness + Maintenance

#### D17-F01

- Severity: P1
- File path + line number: `visas/dtv/index.html:374`; `visas/dtv/index.html:397`; `visas/dtv/index.html:575`; `compare/visa-comparison-matrix/index.html:467`; `visas/index.html:483`
- Description: 625 stale visible date strings remain outside `_research`, while sitemap/footer/schema have been refreshed to 18 May 2026.
- Why it matters: Mismatched dates make the visible “updated” signal look cosmetic rather than verified.
- Concrete fix suggestion: Add a page-level freshness audit that compares visible date strings, JSON-LD `dateModified`, sitemap `lastmod`, and footer version.
- Effort estimate: 1 day.
- Affected page count: broad.

#### D17-F02

- Severity: P1
- File path + line number: `guides/thai-tax-foreign-residents/index.html:508`
- Description: Time-bound legal/tax claims mention April 2026 on a report run dated 18 May 2026.
- Why it matters: “As of” claims are trust claims; they need exact verification dates.
- Concrete fix suggestion: Only update legal freshness labels when the underlying source was actually rechecked; otherwise leave older dates intentionally.
- Effort estimate: 2-4 hours.
- Affected page count: included in stale-date set.

#### D17-F03

- Severity: P2
- File path + line number: `api/visa-data.json:487`; `feed.json:51`; `sitemap.xml:407`
- Description: Generated data/sitemap files miss final newlines.
- Why it matters: Generated artifacts should be deterministic and clean.
- Concrete fix suggestion: Normalize generator output or run a final newline pass after generating data feeds and sitemaps.
- Effort estimate: 20 minutes.
- Affected file count: 22.

#### D17-F04

- Severity: P2
- File path + line number: `changelog/index.html:1`; footer version example `visas/dtv/index.html:575`
- Description: Footer shows `v2026.05.18` sitewide, but visible article labels do not always match that release date.
- Why it matters: Users may interpret footer version as content verification rather than build version.
- Concrete fix suggestion: Label footer as “site version” and page labels as “verified” only when page-specific verification occurred.
- Effort estimate: 2-3 hours.
- Affected page count: 186.

### Dimension 18 — Competitive Positioning

#### D18-F01

- Severity: P1
- File path + line number: `visas/business-non-b/index.html:1`; `visas/retirement-o-x/index.html:1`; `visas/smart/index.html:1`
- Description: For top high-intent queries, competitors’ biggest advantage is perceived authority: official/legal brand names, heavier backlink profiles, and denser primary-source references.
- Why it matters: Pattaya Visa Help’s local specificity is a real differentiator, but authority gaps limit citation/ranking against Siam Legal, ThaiEmbassy.com, BOI/MFA/embassy pages, and Thailand.go.th.
- Concrete fix suggestion: Prioritize official citations and factual consistency before adding new content.
- Effort estimate: 1 day.
- Affected page count: 8 uncited pillars first.

#### D18-F02

- Severity: P2
- File path + line number: `guides/jomtien-immigration-office/index.html:1`; `guides/90-day-reporting/index.html:1`
- Description: The single biggest defensible competitive moat is local Pattaya/Jomtien operational accuracy, not generic visa definitions.
- Why it matters: Official sites and law firms are hard to beat on authority; local execution details are easier to own.
- Concrete fix suggestion: Keep investing in dated, verifiable Jomtien/Pattaya operational observations and cite them clearly as local field notes.
- Effort estimate: ongoing.
- Affected page count: local guide cluster.

#### D18-F03

- Severity: P2
- File path + line number: `api/visa-data.json:1`; `llms.txt:1`
- Description: API/LLM surfaces are a competitive advantage if they remain exact; right now, they also amplify drift.
- Why it matters: Few competitors expose clean machine-readable visa data.
- Concrete fix suggestion: Treat these as product surfaces with tests, not static afterthoughts.
- Effort estimate: 1 day.
- Affected file count: 2.

## 3. Top 50 Prioritized Action List

Sorted by impact × effort efficiency.

1. [P0] Fix DTV later-year foreign-income remittance claim in visible text and FAQ JSON-LD.
2. [P0] Normalize LTR tax-exemption categories across matrix, API JSON, `llms.txt`, and LTR page.
3. [P1] Fix Turnstile fail-open behavior in `lead.js` and `subscribe.js`.
4. [P1] Escape user-submitted lead fields before HTML email and notification rendering.
5. [P1] Check Resend API response status before returning lead/subscribe success.
6. [P1] Replace 6 broken image-sitemap country URLs with deployed slugs.
7. [P1] Normalize stale visible freshness strings versus schema/footer/sitemap dates.
8. [P1] Fix 8 HTML parser errors.
9. [P1] Add official citations to the 8 uncited visa pillars.
10. [P1] Fix axe `region` landmark violations across shared templates.
11. [P1] Fix Pa11y contrast token for separators/meta text.
12. [P1] Fix 320px horizontal overflow on tables/grids/footer.
13. [P1] Give tool result containers `aria-live`/`role="status"`.
14. [P1] Remove reminder tool’s prefilled date and add real empty state.
15. [P2] Change `/visas` redirect to `/visas/`.
16. [P2] Add explicit `type="button"` to 5 tool buttons.
17. [P2] Add `scope` attributes to table headers on 46 pages.
18. [P2] Expand 3 too-short meta descriptions.
19. [P2] Trim 27 title tags likely to truncate.
20. [P2] Replace non-canonical `wa.me` links with the guarded WhatsApp URL.
21. [P2] Add inputmode/type/autocomplete hints to tool inputs.
22. [P2] Fix raw character validation errors.
23. [P2] Add missing `<tbody>` wrappers to 6 tables.
24. [P2] Add JSON-LD to 4 pages missing it.
25. [P2] Add `dateModified` to schema nodes missing it.
26. [P2] Add stable schema `@id` values and cross-references.
27. [P2] Add concise Speakable schema only to core answer blocks.
28. [P2] Add category-level LTR tax data to `/api/visa-data.json`.
29. [P2] Fix live cache header mismatch for directory-index HTML.
30. [P2] Scope broad live CORS behavior.
31. [P2] Remove unused CSP host allowlist entries after confirming no dependency.
32. [P2] Extract mobile-nav/TOC scripts enough to reduce inline script dependency.
33. [P2] Replace TOC `innerHTML` insertion with safe DOM/textContent.
34. [P2] Add copyable result summaries to Visa Finder and Cost Calculator.
35. [P2] Add GA events for tool start/completion/error/CTA clicks.
36. [P2] Add table overflow wrappers or responsive table mode.
37. [P2] Add high-contrast media query support.
38. [P2] Add print stylesheet for article/tool pages.
39. [P2] Normalize whitespace and final newlines.
40. [P2] Reduce repeated inline footer/version styles to classes.
41. [P2] Reduce the highest-volume duplicated CSS rules.
42. [P2] Convert broad overspecific selectors to utility/template classes.
43. [P2] Fix UOB/external unstable links or document expected bot-block exceptions.
44. [P2] Topic-prefill contextual `mailto:` CTAs.
45. [P2] Add freshness consistency audit.
46. [P2] Add a 320px no-horizontal-scroll Playwright regression test.
47. [P2] Add reduced-motion regression screenshot/check.
48. [P3] Remove or document unused custom properties.
49. [P3] Bring `v2-preview` to noindex/schema parity or keep it out of crawl paths.
50. [P3] Preserve local practitioner voice; do not generic-SEO rewrite content that is already specific and true.

## 4. Raw Data Appendix

### Audit Inventory

| Item | Count |
|---|---:|
| HTML pages audited | 186 |
| Audit-scope files | 221 |
| Sitemap URL entries parsed | 188 |
| Inline/external JS scripts checked | 533 |
| CSS style blocks parsed | 191 |
| Parsed CSS size across HTML | 4,673.3 KB |
| Tool pages E2E-tested | 9 |
| Layout runs | 602 |
| axe runs | 370 |
| Pa11y runs | 372 |
| Lighthouse runs | 24 |

### Lighthouse Scorecard

| URL | Form | Perf | LCP ms | CLS | TBT ms | Unused JS |
|---|---|---:|---:|---:|---:|---:|
| `/` | mobile | 98 | 1937 | 0.007 | 47 | 65 KB |
| `/visas/dtv/` | mobile | 92 | 1832 | 0.164 | 18 | 67 KB |
| `/visas/ltr/` | mobile | 99 | 1831 | 0.032 | 18 | 67 KB |
| `/visas/privilege-elite/` | mobile | 87 | 1831 | 0.241 | 39 | 55 KB |
| `/visas/retirement-non-o/` | mobile | 99 | 1837 | 0.021 | 60 | 68 KB |
| `/tools/visa-finder/` | mobile | 99 | 1680 | 0.022 | 58 | 62 KB |
| `/tools/cost-calculator/` | mobile | 99 | 1708 | 0.055 | 20 | 66 KB |
| `/tools/reminder/` | mobile | 91 | 2762 | 0.042 | 47 | 66 KB |
| `/compare/dtv-vs-ltr/` | mobile | 91 | 1837 | 0.166 | 64 | 66 KB |
| `/blog/` | mobile | 97 | 1678 | 0.103 | 55 | 66 KB |
| `/de/` | mobile | 98 | 1689 | 0.062 | 76 | 62 KB |
| `/ru/` | mobile | 93 | 2622 | 0.001 | 24 | 62 KB |
| `/` | desktop | 63 | 3365 | 0.056 | 54 | 67 KB |
| `/visas/dtv/` | desktop | 84 | 1871 | 0.036 | 60 | 68 KB |
| `/visas/ltr/` | desktop | 84 | 1864 | 0.020 | 19 | 68 KB |
| `/visas/privilege-elite/` | desktop | 68 | 2762 | 0.068 | 23 | 66 KB |
| `/tools/visa-finder/` | desktop | 87 | 1683 | 0.009 | 60 | 68 KB |
| `/compare/dtv-vs-ltr/` | desktop | 64 | 3216 | 0.053 | 18 | 67 KB |
| `/blog/` | desktop | 66 | 3062 | 0.039 | 50 | 67 KB |

### axe-core Violations

| Rule | Impact | Runs with violation | Nodes | Notes |
|---|---|---:|---:|---|
| `region` | moderate | 368 / 370 | 1,690 | Content outside landmarks; common targets `.mq`, `.brand`, `.tldr`, `.read-next`, `.contact-section`. |

No axe critical or serious violations were found in the full sweep.

### Pa11y Violations

| Code | Type | Count | Page/viewport runs | Sample |
|---|---|---:|---:|---|
| `WCAG2AA.Principle1.Guideline1_4.1_4_3.G18.Fail` | error | 766 | 360 / 372 | Low-emphasis separator/meta text at 4.35:1, e.g. breadcrumb separator in `about/index.html`. |

### HTML/CSS Validator Results

| Rule / Signal | Count |
|---|---:|
| HTML files failing current `html-validate` profile | 186 / 186 |
| Total HTML validator messages | 6,494 |
| `void-style` | 5,509 |
| `no-inline-style` | 573 |
| `no-trailing-whitespace` | 377 |
| `no-raw-characters` | 15 |
| `parser-error` | 8 |
| `prefer-tbody` | 6 |
| `no-implicit-button-type` | 5 |
| `unrecognized-char-ref` | 1 |
| CSS `!important` declarations | 9,883 |
| Unused custom properties | 5 |
| Undefined custom properties | 0 |
| Pages with reduced-motion query | 182 / 186 |
| Pages with print stylesheet | 1 / 186 |
| Pages with `prefers-contrast: more` | 0 / 186 |

### Schema Validator / Structured Data Summary

| Schema signal | Count |
|---|---:|
| JSON-LD schema nodes parsed | 375 |
| Pages missing JSON-LD | 4 |
| Nodes missing stable `@id` | 221 |
| Pages with at least one missing `@id` node | 146 |
| Pages missing/omitting `dateModified` in schema extraction | 84 |
| Speakable schema nodes | 0 |
| WebApplication schema pages | 9 |
| FAQPage schema pages | 10 |
| Article schema nodes | 102 |
| BreadcrumbList schema nodes | 115 |

### AI-Detection / Authenticity Scores

Heuristic checks used sentence-length variance, generic AI phrase density, em-dash density, hedge density, first-person/local markers, citation density, and Pattaya/Jomtien specificity. No long-form page sampled scored below 60/100 for human/practitioner signal. The quality problem is not generic AI voice; it is factual/source consistency.

| Page family | Human/practitioner signal | Main risk |
|---|---:|---|
| Visa pillars | 70-88 | Official citation gaps and factual drift |
| Long guides | 72-90 | Stale verification wording |
| Comparison pages | 68-84 | Category-specific rule precision |
| Profession pages | 64-80 | Thin metadata/schema on some pages |

### Click-Depth Map

| Depth | Result |
|---|---|
| 0 | Homepage |
| 1-2 | Core hubs, visa pillars, tools, contact/about, language homes |
| 3 | Guides, comparisons, profession/local pages reachable from hubs/nav/footer |
| >3 | None found for valid sitemap HTML pages |
| Orphans | 6 image-sitemap URLs only; all are wrong slug variants and live-check as 404 |

### Anchor Text Frequency Table Per Target URL

Static anchor extraction showed dense internal linking and no systemic “click here”/“read more” anchor problem. Highest-frequency targets are navigational and conversion destinations.

| Target pattern | Anchor pattern | Assessment |
|---|---|---|
| `/visas/dtv/` | DTV, Destination Thailand Visa, DTV breakdown | Good variety |
| `/visas/ltr/` | LTR, Long-Term Resident, LTR breakdown | Good variety |
| `/tools/visa-finder/` | Visa Finder, find your visa, start tool | Strong contextual destination |
| `/contact/` | contact, message us, send us a message | Clear |
| WhatsApp URL | WhatsApp, message on WhatsApp | Strong, but non-canonical `wa.me` leaks exist |

### Tool E2E Results

| Tool | Result | Notes |
|---|---|---|
| Visa Finder | PASS | Recommendation rendered |
| Cost Calculator | PASS | Non-zero THB total rendered |
| LTR Eligibility | PASS | Eligibility result rendered |
| Income Test | PASS | Eligible visa list rendered |
| Document Checklist | PASS | Checklist rendered |
| Currency Converter | PASS | Conversion rendered |
| Bank Checker | PASS | Bank result rendered |
| Expiry Countdown | PASS | Countdown rendered |
| Reminder | FAIL | Empty-state test fails due prefilled today date |

### Live Header Notes

| Signal | Result |
|---|---|
| HTTPS | OK |
| HSTS | Present |
| CSP | Present but allows `'unsafe-inline'` |
| COOP | Present |
| COEP / CORP | Not present |
| X-Content-Type-Options | Present |
| X-Frame-Options | Present |
| Referrer-Policy | Present |
| Permissions-Policy | Present |
| HTTP/3 | Present via `alt-svc` |
| Set-Cookie | None observed |
| Broad CORS | `Access-Control-Allow-Origin: *` observed live |

## 5. What's Genuinely Strong

- The DTV page correctly captures embassy-specific bank-statement nuance after prior fixes: `visas/dtv/index.html:446` distinguishes 3-month versus 6-month missions and links Budapest.
- The LTR pillar itself is more precise than the surrounding matrix/API: `visas/ltr/index.html:58`, `visas/ltr/index.html:436`, `visas/ltr/index.html:487`, and `visas/ltr/index.html:492` correctly separate W/P/T exemption from H-category 17% treatment.
- The tax hub correctly explains the post-2024 remittance shift: `tax/index.html:547`, `guides/thai-tax-foreign-residents/index.html:488`, and `guides/thai-tax-foreign-residents/index.html:505`.
- The 9 tools are mostly functional. 8 of 9 passed Playwright happy-path checks; the failure is a state-design issue, not broken calculation.
- Headers are stronger than most one-person static sites: `_headers:5` through `_headers:12` include HSTS, CSP, Permissions-Policy, Referrer-Policy, X-Content-Type-Options, X-Frame-Options, and COOP.
- Internal click depth is healthy. Valid HTML sitemap pages are reachable within 3 clicks; the only orphan-like cases are the 6 broken image-sitemap slug variants.
- The site has a real local voice. Pages reference Jomtien/Soi 5/Pattaya-specific processes, exact fees, and practical local caveats rather than pure generic visa definitions.
- No fake AggregateRating, Product, or JobPosting schema was detected in the schema type summary, which is the right call for this site.
- Live responses did not set cookies in sampled requests, which supports the privacy posture.
- The machine-readable `/api/visa-data.json` idea is genuinely useful; it just needs category-specific precision and tests.

## 6. What's Genuinely Weak

The single biggest structural problem is source-of-truth fragmentation. The same legal/tax facts live in prose, FAQ JSON-LD, comparison pages, tool scripts, `/api/visa-data.json`, and `llms.txt`, and they are already drifting after multiple hardening passes. This is why the LTR pillar can be correct while the comparison matrix, API, and LLM file disagree; it is why the DTV page can contradict the tax guide; and it is why visible freshness labels can disagree with sitemap/schema/footer dates.

The second structural weakness is template duplication. The site is static and fast enough, but 4.6 MB of repeated inline CSS across pages, almost 10,000 `!important` declarations, inline JS, inline styles, and duplicated head/footer patterns make every “small” sitewide fix risky. Claude can fix the top issues without a build step or redesign, but long-term perfection will require turning the current repeated page snapshots into a smaller set of static shared assets and consistency checks.

## 7. End-of-Report Verification

- Source files modified by Codex: 0.
- Commits made by Codex: 0.
- Pushes made by Codex: 0.
- Branches created by Codex: 0.
- Existing untracked file left untouched: `_research/CODEX_NUCLEAR_DEEP_AUDIT.md`.
- Report file created: `_research/CODEX_NUCLEAR_DEEP_AUDIT_REPORT.md`.
- Report file size: 76,125 bytes / 74.3 KB.
- Report line count: 1,010.

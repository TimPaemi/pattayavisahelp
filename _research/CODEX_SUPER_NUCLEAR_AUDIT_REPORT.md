# CODEX SUPER-NUCLEAR AUDIT REPORT - pattayavisahelp.com

Audit date: 2026-05-22  
Mode followed: read-only source audit; no commits; no source fixes; only this report was written.  
Target reviewed: `C:\pattayavisahelp`  
Official YMYL sources used: Thailand.go.th LTR tax page (`https://www.thailand.go.th/public/event-detail/010_024`) and Thai Revenue Department foreign-sourced-income PDF (`https://www.rd.go.th/fileadmin/user_upload/lorkhor/newspr/2024/FOREIGNERS_PAY_TAX2024.pdf`).

## 1. Executive summary

Overall site health score: **74/100**.

Single most important finding: **production is stale versus `origin/main`**. Local `main` matches `origin/main` at `94b3209`, but the live site still serves `v2026.05.18` content while local/source files and sitemaps advertise `v2026.05.19`. Until Cloudflare Pages is proven to deploy the current commit, every source-level fix can be silently absent from the public site.

Finding counts:

| Severity | Count |
|---|---:|
| P0 | 4 |
| P1 | 10 |
| P2 | 12 |
| P3 | 6 |

High-signal positives:

- 186 HTML files and 226 total text/support files were read end-to-end, excluding `.git/`, `node_modules/`, and prior `_research/` reports as requested.
- 301 JSON-LD blocks parse as valid JSON; `v2-preview/index.html` is the only HTML file without JSON-LD, and it is `noindex,nofollow`.
- `sitemap.xml` contains 182 URLs, matching the 182 indexable HTML pages after excluding `404.html`, `v2-preview/`, and two legacy noindex stubs.
- Playwright mobile checks at 360/390/414 widths found no horizontal overflow on the sampled high-value templates and all 9 active tools had wired JS/click paths, so the prior "dead tool shell" class has not regressed.
- Internal HTML page links did not produce real 404s; the two crawler flags were `/feed.xml` links from blog pages, and `feed.xml` exists.

## 2. P0 blocker list

| Severity | File:Line | Finding | Concrete fix |
|---|---|---|---|
| P0 | `index.html:737`, `api/visa-data.json:18-19`, `llms.txt:93-94` | Live Cloudflare site is stale. Live `/`, `/visas/dtv/`, `/visas/ltr/`, `/contact/`, `/tools/visa-finder/`, `/llms.txt`, and `/api/visa-data.json` all differed from local HEAD. Live pages serve `v2026.05.18`; local footer says `v2026.05.19`; local API says `2026.05.19`; local `llms.txt` still says `2026.05.18`. | Before: deploy status accepted because `main...origin/main` is clean. After: trigger a fresh Cloudflare Pages deploy for commit `94b3209`, then verify live `/api/visa-data.json` returns `"version": "2026.05.19"` and live `/` footer returns `v2026.05.19`. Also update `llms.txt:93-94` from `Version: 2026.05.18` / `Updated: 2026-05-18` to `Version: 2026.05.19` / `Updated: 2026-05-19`. |
| P0 | `index.html:670`, `index.html:679`, `visas/dtv/index.html:490`, `visas/ltr/index.html:475` | Outdated "same-year remittance" tax wording remains on visible YMYL pages. Thai Revenue Department guidance says foreign-sourced income earned from 1 Jan 2024 onward by a Thai tax resident is taxable when remitted to Thailand, even in a later tax year. | Replace `Foreign income remitted in year-of-earning is taxable.` with `Foreign-source income earned from 1 Jan 2024 onward by a Thai tax resident is taxable when remitted to Thailand, even in a later tax year, subject to pre-2024 savings, treaty relief, and LTR exemptions.` Replace `foreign income remitted within the tax year of earning is taxable above 150K฿` with `foreign-source income earned from 2024 onward and remitted to Thailand is taxable if you are Thai tax resident, subject to deductions, treaties, and exemptions.` Replace `Taxable if remitted same year` with `Taxable when remitted if earned from 2024 onward.` |
| P0 | `guides/best-visa-digital-nomads/index.html:474`, `faq/index.html:610`, `faq/index.html:997`, `glossary/index.html:323`, `api/visa-data.json:119-127` | Royal Decree 743 / LTR category handling is inconsistent or wrong. Official Thailand.go.th states the foreign-income exemption applies to high-net-worth individuals, foreign retirees, and foreigners wishing to work from Thailand; Highly-Skilled receives 17% personal-income-tax treatment instead. | Replace `LTR holders (Wealthy Pensioner, Wealthy Global Citizen, Highly-Skilled Professional) get tax exemption` with `LTR Wealthy Global Citizen, Wealthy Pensioner, and Work-from-Thailand Professional holders get the foreign-income exemption; Highly-Skilled Professional does not, but may receive the 17% flat PIT treatment on eligible Thai-employer income.` Replace `Royal Decree 743 (2024)` in API basis fields with `Royal Decree 743 (dated 23 May 2022; relevant to post-2024 remittance planning)`. |
| P0 | `functions/api/lead.js:22-31`, `functions/api/lead.js:93-104`, `functions/api/lead.js:124-152`, `functions/api/lead.js:237`, `functions/api/lead.js:257-261` | `escapeHtml()` exists but user input is interpolated raw into HTML emails, mailto links, Slack, and Discord payloads. A malicious lead can inject HTML into notification/auto-reply surfaces. | Before: `${lead.firstName}`, `${lead.email}`, `${lead.situation}`, `${lead.userAgent}` are used raw. After: create escaped values before templates, e.g. `const safe = { firstName: escapeHtml(lead.firstName), lastName: escapeHtml(lead.lastName), email: escapeHtml(lead.email), phone: escapeHtml(lead.phone), situation: escapeHtml(lead.situation), page: escapeHtml(lead.page), userAgent: escapeHtml(lead.userAgent), visaLabel: escapeHtml(visaLabel) }; const mailtoEmail = encodeURIComponent(lead.email);` Then use only `safe.*` in HTML/body text and encoded values in `href` attributes. |

## 3. Six pillar chapters

### Pillar 1 - SEO (technical + on-page + off-page signals)

Score: **78/100**

Narrative: the core static SEO system is strong: all 182 indexable pages are in the XML sitemap, canonical coverage is effectively complete, JSON-LD syntax is valid, and no indexable money page has `noindex`. The defects that remain are subtle but important: live deployment drift, stale structured freshness, two legacy pages served as 200/noindex instead of server-side 301s, a blocked machine-readable API, and metadata polish issues.

| Severity | File:Line | Finding | Fix |
|---|---|---|---|
| P0 | `index.html:737`, `api/visa-data.json:18-19`, `llms.txt:93-94` | Live site is stale versus local/origin; see P0 list. | Redeploy commit `94b3209`; verify live footer/API/llms versions match `2026.05.19`. |
| P1 | `robots.txt:5`, `llms.txt:91` | `llms.txt` advertises `/api/visa-data.json` for AI crawlers, but `robots.txt` blocks all `/api/`. | Before: `Disallow: /api/`. After: `Allow: /api/visa-data.json` then `Disallow: /api/lead` and `Disallow: /api/subscribe` (or remove the broad `/api/` block and block only private endpoints). |
| P1 | `index.html:160`, `visas/dtv/index.html:38`, `visas/ltr/index.html:37`, `contact/index.html:122` | 178 JSON-LD `dateModified` values remain `2026-05-18` while visible footers and `sitemap.xml` say `2026-05-19`. This gives crawlers and AI systems conflicting freshness signals. | Before: `"dateModified": "2026-05-18"`. After: `"dateModified": "2026-05-19"` on all pages actually updated on 19 May, or restore the visible footer/sitemap to the true last modified date if 19 May was mechanical only. |
| P1 | `tools/ltr-eligibility/index.html:13-15`, `professions/digital-nomad/index.html:12-14`, `_redirects:14-27` | Two legacy URLs are still real 200 pages with meta/JS redirects and `noindex`, and `_redirects` has no server-side 301 for them. This wastes crawl signals and creates duplicate canonical crawl paths. | Add to `_redirects` after line 27: `/tools/ltr-eligibility/ /tools/eligibility/ 301` and `/professions/digital-nomad/ /digital-nomad/ 301`. Also add non-slash variants if Cloudflare does not normalize them. |
| P1 | `glossary/royal-decree-743/index.html:7`, `glossary/royal-decree-743/index.html:513`, `glossary/royal-decree-743/index.html:521` | Royal Decree 743 glossary meta/lede/TLDR are visibly truncated at `Wealt`, which is a YMYL trust failure. | Replace the truncated text with: `Royal Decree 743, dated 23 May 2022, exempts foreign-source income remitted to Thailand for LTR Wealthy Global Citizen, Wealthy Pensioner, and Work-from-Thailand Professional holders; Highly-Skilled Professionals instead receive 17% PIT treatment on eligible Thai-employer income.` |
| P2 | `v2-preview/index.html:6-8`, `v2-preview/index.html:630` | Noindex preview page has no canonical/schema and a heading skip `h2 -> h4`. It is not a money page, but it is production-addressable. | Either remove from production or add a server-side redirect/block. If retained, add a self canonical, basic JSON-LD, and change the first skipped `h4` under the `h2` to `h3`. |
| P2 | `changelog/index.html:6`, `visas/dtv/index.html:6`, `tools/eligibility/index.html:8`, `best-visa/under-20k/index.html:6` | 27 titles exceed 60 characters. This is not catastrophic, but market-leading SERP snippets should not rely on truncation. | Trim to <=60 chars. Example: before `DTV Thailand 2026 — Destination Thailand Visa Guide from Pattaya`; after `DTV Thailand 2026 — Destination Thailand Visa Guide`. |
| P2 | `404.html:7`, `best-visa/index.html:7`, `glossary/soft-power/index.html:7`, `compare/pattaya-vs-bangkok/index.html:7` | 23 meta descriptions are outside the 120-160 char band; `glossary/soft-power/index.html:7` is especially generic at 48 chars. | Expand/trim descriptions. Example: before `Independent Thailand visa guidance from Pattaya.`; after `Soft Power visa meaning in Thailand: DTV categories, Muay Thai and cooking-school evidence, document risks, and when Non-ED is safer.` |
| P2 | `_headers:12` | CSP is good for a static site but misses hardening directives a leading publisher would set. | Append to CSP: `base-uri 'self'; object-src 'none'; form-action 'self'; upgrade-insecure-requests;`. Keep `unsafe-inline` only until inline scripts/styles are reduced. |

### Pillar 2 - Usability: mobile and desktop

Score: **76/100**

Narrative: no sampled mobile viewport showed horizontal scroll, and the tools are no longer dead shells. The main usability damage is smaller: tap targets and body text are under the mobile bar in repeated CSS, tool result announcements are inconsistent, and the contact page promises a form without shipping one.

| Severity | File:Line | Finding | Fix |
|---|---|---|---|
| P1 | `contact/index.html:575`, `contact/index.html:590`, `contact/index.html:619-625` | The page links to `#leadForm` and says "CONTACT FORM / Use the form", but the section only contains cards; no `<form>` exists. This breaks the primary conversion path and leaves `functions/api/lead.js` effectively unused on production pages. | Replace the self-loop card at `contact/index.html:625` with a real form: `<form id="leadForm" class="lead-form" action="/api/lead" method="POST">` containing labeled `firstName`, `lastName`, `email type="email"`, `phone type="tel" inputmode="tel"`, `visaInterest`, `situation`, `page`, honeypot, and Turnstile token fields. |
| P2 | `index.html:436`, `index.html:497`, `tools/cost-calculator/index.html:144`, `tools/visa-finder/index.html:167` | Mobile nav/buttons fall below the 44x44px tap-target standard. Playwright measured top nav links around 30px high and bottom nav around 34-35px high on 360px. | Before: `.nav a:not(.cta){padding:4px 6px}` and `.mnav a{...padding:8px 4px...font-size:9.5px...}`. After: `.nav a:not(.cta){min-height:44px;padding:10px 8px}` and `.mnav a{min-height:44px;padding:10px 6px;font-size:10px}`. For tool buttons, add `.btn{min-height:44px;padding:14px 20px}` in mobile rules. |
| P2 | `index.html:451`, `tools/cost-calculator/index.html:137`, `tools/currency-converter/index.html:129`, `tools/visa-finder/index.html:160` | Mobile body paragraphs are set to 15px in repeated template CSS. YMYL guidance should not drop below 16px body copy on mobile. | Before: `p{font-size:15px;line-height:1.6}`. After: `p{font-size:16px;line-height:1.65}`. Keep mono labels/caps small only where they are not body content. |
| P2 | `tools/cost-calculator/index.html:327`, `tools/currency-converter/index.html:316`, `tools/visa-finder/index.html:316` | Several dynamic tool result regions lack `aria-live`, while other tools already use it. Screen-reader users may not hear updated outcomes. | Before: `<div class="result-card" id="result">`. After: `<div class="result-card" id="result" aria-live="polite" aria-atomic="true">`. For visa finder: `<div id="quizArea" aria-live="polite" aria-atomic="true"></div>`. |
| P2 | `tools/bank-checker/index.html:147`, `tools/bank-checker/index.html:152`, `tools/cost-calculator/index.html:142` | Inputs are usable, but repeated mobile field rules keep form text at 15px. Mobile keyboards and zoom behavior are better at 16px. | Before: `.fld input,.fld select,.fld textarea{padding:12px 14px;font-size:15px...}`. After: `.fld input,.fld select,.fld textarea{padding:13px 14px;font-size:16px...}`. |
| P3 | `tools/visa-finder/index.html:60-63` | `prefers-reduced-motion` sets `#quizArea{min-height:0}`, which can reintroduce layout jumps for users who requested reduced motion. | Before: `@media (prefers-reduced-motion: reduce){#quizArea{min-height:0}}`. After: remove this override or set `#quizArea{min-height:560px}` and disable animations separately. |

### Pillar 3 - Future-proofing: SEO + AI / answer-engine discoverability

Score: **74/100**

Narrative: `llms.txt` is a real advantage and the structured JSON API is exactly the right direction. The problem is that the API is blocked by robots, `llms.txt` is one version behind the local API, and freshness/dateModified inconsistencies undermine the machine-readable trust layer.

| Severity | File:Line | Finding | Fix |
|---|---|---|---|
| P1 | `robots.txt:5`, `llms.txt:91` | AI crawlers are pointed to the JSON API but disallowed from crawling `/api/`. | Allow `/api/visa-data.json` explicitly and block only private API endpoints. |
| P1 | `llms.txt:93-94`, `api/visa-data.json:18-19` | `llms.txt` says API version/update is `2026.05.18`; the local API says `2026.05.19`. | Before: `Version: 2026.05.18` / `Updated: 2026-05-18`. After: `Version: 2026.05.19` / `Updated: 2026-05-19`. |
| P1 | `api/visa-data.json:119`, `api/visa-data.json:123`, `api/visa-data.json:127` | API says `Royal Decree 743 (2024)`. Official source says Royal Decree No. 743 is dated 23 May 2022; 2024 is the remittance-tax context, not the decree date. | Replace each `Royal Decree 743 (2024)` with `Royal Decree 743 (dated 23 May 2022; relevant to post-2024 remittance planning)`. |
| P1 | `index.html:160`, `faq/index.html:50`, `visas/dtv/index.html:38` | Structured `dateModified` is stale across 178 blocks compared with visible `v2026.05.19`. AI systems weight freshness on YMYL pages; contradictory dates reduce confidence. | Bulk update `dateModified` to true page-level review dates and keep it in sync with visible footer and sitemap `lastmod`. |
| P2 | `faq/index.html:526`, `faq/index.html:901`, `tax/index.html:548` | FAQ/tax hubs mention only Wealthy Pensioner and Wealthy Global Citizen for the LTR exemption, omitting Work-from-Thailand Professional. | Add Work-from-Thailand Professional everywhere the exemption is summarized; explicitly say Highly-Skilled is not foreign-income exempt. |
| P2 | `visas/index.html:569` | The site promises updates "within 14 days of any meaningful change"; there is no visible methodology link attached to that claim. | After this paragraph, add `See our update methodology` linking to `/methodology/` and state which sources are monitored. |
| P3 | `llms.txt:98-108` | Network section is useful but should add parent-child semantics, not only prose. | Add one line: `Relationship: Pattaya Authority is the parent media/network brand; Pattaya Visa Help is the Thailand visa vertical in that network.` |

### Pillar 4 - Connection between all network sites

Score: **70/100**

Narrative: the homepage and `llms.txt` understand the network, but the rest of the site mostly emits a footer link to `pattaya-authority.com`. Contextual sibling links are sparse: only `pattaya-gym.com` and `pattaya-school-guide.com` appear in body content. `pattaya-restaurant-guide.com`, `pattaya-coffee.com`, and `pattayastream.com` are listed in `llms.txt`/homepage schema but have no body links.

Existing network-link map from source:

| Domain | Count in HTML links | Existing examples |
|---|---:|---|
| `pattaya-authority.com` | 361 | `index.html:700`, `index.html:704`, `index.html:731`, `index.html:734`, `contact/index.html:648`, `contact/index.html:651` |
| `timpaemi.com` | 9 | `index.html:702`, `index.html:706`, `glossary/index.html:339`, `tools/bank-checker/index.html:331`, `tools/eligibility/index.html:356`, `tools/reminder/index.html:307` |
| `pattaya-gym.com` | 1 | `visas/dtv/index.html:432` |
| `pattaya-school-guide.com` | 1 | `visas/education-ed/index.html:376` |
| `pattaya-restaurant-guide.com` | 0 | Listed only in `index.html:100` schema and `llms.txt:102` |
| `pattaya-coffee.com` | 0 | Listed only in `index.html:103` schema and `llms.txt:105` |
| `pattayastream.com` | 0 | Listed only in `index.html:102` schema and `llms.txt:106` |

| Severity | File:Line | Finding | Fix |
|---|---|---|---|
| P1 | `about/index.html:47`, `visas/dtv/index.html:39-51`, `visas/ltr/index.html:38-50` | Homepage `Organization`/`Person` schema lists the full network, but About and article publisher/author schema generally do not include `sameAs` or `parentOrganization`. | Add `sameAs` with all network domains and `parentOrganization":{"@type":"Organization","name":"Pattaya Authority","url":"https://pattaya-authority.com"}` to the reusable Organization/LocalBusiness graph, then reference it by `@id` from article publisher/author nodes. |
| P1 | `tools/bank-checker/index.html:331`, `tools/eligibility/index.html:356`, `tools/reminder/index.html:307` | Tool footer labels `PATTAYA AUTHORITY` but links it to `https://timpaemi.com`, splitting the brand signal. | Before: `PART OF THE <a href="https://timpaemi.com"...>PATTAYA AUTHORITY</a> NETWORK · BUILT BY <a href="https://timpaemi.com"...>TIM PAEMI</a>`. After: `PART OF THE <a href="https://pattaya-authority.com"...>PATTAYA AUTHORITY</a> NETWORK · BUILT BY <a href="https://timpaemi.com"...>TIM PAEMI</a>`. |
| P2 | `visas/dtv/index.html:432`, `visas/education-ed/index.html:376`, `llms.txt:102-108` | Only two contextual sibling links exist. The network is mostly a footer/schema signal, not an editorial graph. | Add contextual links: `digital-nomad/index.html` anchor `Pattaya cafes for remote work` -> `https://pattaya-coffee.com/`; `guides/cost-of-living-pattaya/index.html` anchor `restaurant costs in Pattaya` -> `https://pattaya-restaurant-guide.com/`; `blog/2026-annual-review/index.html` anchor `local video updates` -> `https://pattayastream.com/`. |
| P2 | `visas/education-ed/index.html:376` | Copy typo: closing phrase reads `providers in Pattaya)s`. | Before: `providers in Pattaya)s`. After: `providers in Pattaya)`. |
| P3 | `llms.txt:98-108` | Good network section, but no canonical network hub URL on this site. | Add a `/network/` or `/about/#network` section listing all sibling properties and link it from footer near `Pattaya Authority`. |

Recommended network-linking blueprint:

| Layer | Recommended structure |
|---|---|
| Parent entity | `pattaya-authority.com` as `parentOrganization` in schema on this site. |
| Site entity | `pattayavisahelp.com/#business` as the LocalBusiness/ProfessionalService node; every article `publisher` should reference this `@id`. |
| Founder entity | `#tim-paemi` Person node with `sameAs` to `timpaemi.com` and network sites, referenced from About/methodology pages. |
| Footer | Keep one dofollow `Pattaya Authority` link sitewide; do not dump all siblings sitewide. |
| Contextual links | Add sibling links only where user intent matches: DTV/Muay Thai -> gym; ED/families -> school; digital nomads -> coffee/coworking; cost-of-living -> restaurant guide; local media/news -> Pattayastream. |
| AI layer | Mirror this topology in `llms.txt` and Organization `sameAs`. |

### Pillar 5 - Internal linking

Score: **84/100**

Narrative: the internal graph is much healthier than expected after previous passes. There are no real broken internal HTML links, every money page is within three clicks from the homepage, and the sitemap matches indexable HTML. The remaining gap is link equity concentration: 66 indexable pages have only one inbound internal link, including several comparison and guide pages that deserve more than a single hub link.

Graph results:

| Metric | Result |
|---|---:|
| HTML files | 186 |
| Indexable HTML in sitemap | 182 |
| Internal links parsed | 6,936 |
| External links parsed | 1,106 |
| Broken internal HTML links | 0 |
| Feed links to existing XML, not HTML pages | 2 (`blog/index.html:529`, `blog/30-day-visa-exempt-rollback/index.html:555`) |
| Zero-inbound HTML pages | 4 (`404.html`, `v2-preview/index.html`, `tools/ltr-eligibility/index.html`, `professions/digital-nomad/index.html`) |
| Money/support pages with only one inbound internal link | 66 |
| Pages deeper than 3 clicks from home | 0 |

Priority near-orphan groups:

| Severity | File:Line | Finding | Fix |
|---|---|---|---|
| P1 | `compare/index.html:636`, `compare/dtv-vs-elite/index.html`, `compare/dtv-vs-smart/index.html`, `compare/ed-vs-dtv/index.html`, `compare/marriage-vs-retirement/index.html`, `compare/smart-vs-ltr/index.html` | Several comparison pages have only one inbound internal link. These are high-intent decision pages and should receive contextual links from relevant visa pillars. | Add contextual links: from `visas/dtv/index.html:497` add `Compare DTV vs LTR` -> `/compare/dtv-vs-ltr/` and `Compare DTV vs Privilege` -> `/compare/dtv-vs-elite/`; from `visas/smart/index.html:473` add `SMART vs LTR comparison` -> `/compare/smart-vs-ltr/`; from `visas/education-ed/index.html` add `ED vs DTV switch comparison` -> `/compare/ed-vs-dtv/`; from `visas/marriage-non-o/index.html` add `Marriage vs Retirement Non-O` -> `/compare/marriage-vs-retirement/`. |
| P2 | `guides/index.html:436`, `guides/best-visa-couples/index.html`, `guides/best-visa-digital-nomads/index.html`, `guides/best-visa-retirees-over-50/index.html` | High-intent guide spokes have only one inbound link. | Add "Best visa by profile" block to `visas/index.html` linking to `/guides/best-visa-digital-nomads/`, `/guides/best-visa-retirees-over-50/`, `/guides/best-visa-couples/`, and `/guides/best-visa-families/`. |
| P2 | `pattaya/index.html:436`, `pattaya/china-to-thailand/index.html`, `pattaya/india-to-thailand/index.html` | Country-origin pages for China and India have only one inbound link, despite high-search demand. | From `pattaya/index.html`, add a visible "High-demand origin guides" row linking `China to Thailand visa help` -> `/pattaya/china-to-thailand/` and `India to Thailand visa help` -> `/pattaya/india-to-thailand/`. |
| P2 | `work-permit/index.html:510`, `professions/affiliate-marketer/index.html`, `professions/ai-engineer/index.html`, `professions/crypto-trader/index.html`, `professions/saas-founder/index.html` | Profession pages with commercial intent have only one inbound link from the work-permit hub. | Add profession-specific links from `digital-nomad/index.html`: `AI engineers` -> `/professions/ai-engineer/`, `SaaS founders` -> `/professions/saas-founder/`, `affiliate marketers` -> `/professions/affiliate-marketer/`, `crypto traders` -> `/professions/crypto-trader/`. |
| P3 | `blog/index.html:529`, `blog/30-day-visa-exempt-rollback/index.html:555` | `/feed.xml` links are fine because the XML exists, but HTML-only link checkers flag them as non-HTML. | No functional fix required. Optional: add `type="application/rss+xml"` to the RSS anchors. |

Orphan/depth table:

| Page | Inbound count | Click depth | Notes |
|---|---:|---:|---|
| `404.html` | 0 | n/a | Expected noindex utility page. |
| `v2-preview/index.html` | 0 | n/a | Noindex preview; remove or block if no longer needed. |
| `tools/ltr-eligibility/index.html` | 0 | n/a | Legacy noindex stub; should be server-side 301 to `/tools/eligibility/`. |
| `professions/digital-nomad/index.html` | 0 | n/a | Legacy noindex stub; should be server-side 301 to `/digital-nomad/`. |
| All reachable money pages | >=1 | <=3 | Good depth; strengthen inbound volume on priority spokes. |

### Pillar 6 - Ideas: what to improve

Score: **82/100**

Narrative: this site has the raw material of a serious authority property. The upside is in productizing trust: real form capture, official-source update logs, a public methodology, cross-network editorial assets, and more answer-engine-friendly calculators.

Prioritized idea backlog:

| Priority | Idea | Impact | Effort | Why |
|---|---|---|---|---|
| 1 | Ship the real contact/lead form on `/contact/` and wire it to `/api/lead`. | High | M | The API exists, but production CTAs route to a page with no form. This is direct lost conversion. |
| 2 | Add a "Tax resident remittance checker" tool. | High | M | 2024 remittance rules are confusing, high-stakes, and link-worthy; it can route high earners to LTR content. |
| 3 | Add a public "Legal/tax source tracker" page. | High | S | A market-leading YMYL site should show which official sources changed, when, and which pages were updated. |
| 4 | Create `/network/` or `/about/#network` as the canonical Pattaya Authority network hub. | Med | S | Gives humans, crawlers, and LLMs one clean entity map. |
| 5 | Add profile landing pages: "Thailand visa for families", "for retirees", "for remote workers", "for business owners". | High | M | Several guide pages already exist but are under-linked; turn them into rankable intent hubs. |
| 6 | Add "document risk scanner" wizard for DTV/LTR/Retirement. | High | M | Users need to know what will fail before paying; strong lead-gen. |
| 7 | Add official-source citation boxes on every YMYL page. | High | M | Increases E-E-A-T and answer-engine extractability. |
| 8 | Add comparison widgets inside visa pillars. | Med | S | Pushes users from a single visa page into decision pages; improves internal link equity. |
| 9 | Add Thai embassy/eVisa country rule tracker. | High | L | Embassy-specific DTV requirements are a high-intent, fast-changing moat. |
| 10 | Publish "Pattaya immigration office live guide" with queue, parking, documents, map. | Med | M | Local authority asset; can cross-link to Jomtien/90-day/TM30 pages. |
| 11 | Add review/testimonial schema only where real source evidence exists. | Med | S | `case-studies` exists; structured proof can increase trust if ethically sourced. |
| 12 | Add Thai/English glossary pronunciation/audio snippets for common immigration terms. | Low | M | Differentiates the glossary, but lower conversion value. |

## 4. Cross-cutting findings

### YMYL fact-check results

Official reference points:

- Thailand.go.th says Royal Decree No. 743 is dated 23 May 2022; foreign-income exemption is for LTR high-net-worth individuals, foreign retirees, and foreigners wishing to work from Thailand; Highly-Skilled receives 17% PIT treatment.
- Thai Revenue Department PDF says foreign-sourced income earned from 1 Jan 2024 onward by a person staying in Thailand 180+ days is taxable when remitted to Thailand, even if remitted in a later tax year. It also preserves the pre-2024 savings carveout and foreign tax credit/DTA concepts.

| Severity | File:Line | Finding | Fix |
|---|---|---|---|
| P0 | `index.html:670`, `index.html:679`, `visas/dtv/index.html:490`, `visas/ltr/index.html:475` | Same-year remittance wording contradicts the 2024 Revenue Department position. | Use the corrected 2024 remittance wording from the P0 list. |
| P0 | `guides/best-visa-digital-nomads/index.html:474` | Says Highly-Skilled Professional gets foreign-source tax exemption. | Replace with W/P/T exemption and H 17% PIT treatment. |
| P0 | `faq/index.html:610`, `faq/index.html:997`, `glossary/index.html:323`, `api/visa-data.json:119-127` | RD743 date/category summaries are incomplete or wrong. | Use `dated 23 May 2022`; include Work-from-Thailand; exclude Highly-Skilled from foreign-income exemption. |
| P1 | `glossary/royal-decree-743/index.html:513`, `glossary/royal-decree-743/index.html:521` | Truncated RD743 copy. | Replace with the full corrected sentence. |
| P2 | `tax/index.html:548`, `faq/index.html:526`, `faq/index.html:901` | Tax hub/FAQ omit Work-from-Thailand from the exemption summary. | Add Work-from-Thailand Professional and clarify H category. |

### Consistency contradictions

| Severity | File:Line | Finding | Fix |
|---|---|---|---|
| P1 | `llms.txt:93-94`, `api/visa-data.json:18-19` | API version in `llms.txt` is stale versus API file. | Update `llms.txt` to `2026.05.19` / `2026-05-19`. |
| P1 | `sitemap.xml:5`, `index.html:160`, `index.html:737` | Sitemap and visible footer say 19 May 2026; structured `dateModified` says 18 May 2026. | Synchronize `dateModified`, sitemap `lastmod`, and visible footer dates. |
| P1 | `visas/dtv/index.html:490`, `visas/dtv/index.html:528` | Same DTV page contains old same-year tax language and corrected 2024 language. | Replace line 490 with the same corrected language used in line 528. |

### Security

| Severity | File:Line | Finding | Fix |
|---|---|---|---|
| P0 | `functions/api/lead.js:22-31`, `functions/api/lead.js:124-152`, `functions/api/lead.js:237`, `functions/api/lead.js:257-261` | User input is not escaped before email/Slack/Discord interpolation. | Use `escapeHtml()` for HTML/text contexts and `encodeURIComponent()` for URLs before interpolation. |
| P1 | `functions/api/lead.js:56`, `functions/api/subscribe.js:34` | Turnstile only verifies when `env.TURNSTILE_SECRET` exists; missing production secret silently disables bot protection. | Before: `if (env.TURNSTILE_SECRET) { ... }`. After: `if (!env.TURNSTILE_SECRET && env.ENVIRONMENT === 'production') return new Response(JSON.stringify({ error: 'Anti-spam verification is unavailable.' }), { status: 503, headers });` then verify token. |
| P2 | `_headers:12` | CSP lacks `base-uri`, `object-src`, `form-action`, and `upgrade-insecure-requests`. | Add those directives to the existing CSP. |

### Git hygiene

| Check | Result |
|---|---|
| Branch | `main...origin/main` |
| Ahead/behind | `0 0` |
| HEAD | `94b3209 audit-pass-3: 6 mechanical a11y/schema/UX wins` |
| Untracked files before this report | `_research/CODEX_SUPER_NUCLEAR_AUDIT.md` |
| Local-only commits | None |
| Source modifications by this audit | None, except this report file |

### Live-vs-local

| URL | Live result | Local result | Finding |
|---|---|---|---|
| `/` | live hash `944083a37195`, `v2026.05.18` | local hash `e6949c84ce73`, `v2026.05.19` | Mismatch |
| `/visas/dtv/` | live hash `6c55e04d462d`, `v2026.05.18` | local hash `4da65d54fa16`, `v2026.05.19` | Mismatch |
| `/visas/ltr/` | live hash `4374bc7aa330`, `v2026.05.18` | local hash `eb3a6784eab3`, `v2026.05.19` | Mismatch |
| `/contact/` | live hash `123f318683eb`, `v2026.05.18` | local hash `5cf8ace8a9bb`, `v2026.05.19` | Mismatch |
| `/tools/visa-finder/` | live hash `37b4010f1b89`, `v2026.05.18` | local hash `2972b2567dd6`, `v2026.05.19` | Mismatch |
| `/api/visa-data.json` | live `"version": "2026.05.18"` | local `"version": "2026.05.19"` | Mismatch |

### 404 / error handling

`404.html` is styled, has `noindex,follow`, and links users back to tools/FAQ/blog/contact. No P0. It has a short meta description at `404.html:7`; improve only as P2 metadata polish.

## 5. Coverage statement

I read every eligible text/source/support file in `C:\pattayavisahelp` end-to-end, excluding only `.git/`, `node_modules/`, and prior reports inside `_research/` per the instructions.

Total files reviewed: **226**

| Type | Count |
|---|---:|
| `.html` | 186 |
| `.xml` | 16 |
| `.json` | 9 |
| `.txt` | 5 |
| `.md` | 3 |
| `.js` | 2 |
| `.css` | 1 |
| `.svg` | 1 |
| `.webmanifest` | 1 |
| `_headers` | 1 |
| `_redirects` | 1 |

Files not fully line-read:

- Prior reports inside `_research/` were intentionally skipped as instructed.
- Binary image assets were not line-read; they were checked only indirectly by referenced asset existence/live response where relevant.

Validation performed:

- Full text read of all 226 eligible files.
- Parsed 301 JSON-LD blocks: 0 JSON syntax errors.
- Parsed all HTML head metadata: 27 title length issues, 23 meta-description length issues, 1 noindex preview missing schema/canonical, 1 duplicate canonical caused by a legacy noindex stub.
- Parsed internal link graph: 6,936 internal links, 1,106 external links, 0 broken internal HTML links, 4 zero-inbound utility/legacy pages, 66 indexable near-orphan support pages.
- Playwright smoke-tested sampled high-value pages and 9 active tools at 360/390/414/1280/1440 widths.

## 6. Master fix punch list

| Severity | File:Line | Exact change (before -> after) |
|---|---|---|
| P0 | `index.html:737`, `api/visa-data.json:18-19` | Live deploy: before live serves `v2026.05.18` / API `2026.05.18`; after live serves local HEAD `v2026.05.19` / API `2026.05.19` from commit `94b3209`. |
| P0 | `llms.txt:93-94` | Before: `Version: 2026.05.18` and `Updated: 2026-05-18` -> After: `Version: 2026.05.19` and `Updated: 2026-05-19`. |
| P0 | `index.html:670` | Before: `Foreign income remitted in year-of-earning is taxable.` -> After: `Foreign-source income earned from 1 Jan 2024 onward by a Thai tax resident is taxable when remitted to Thailand, even if remitted in a later tax year, subject to pre-2024 savings, treaty relief, and LTR exemptions.` |
| P0 | `index.html:679` | Before: `foreign income remitted within the tax year of earning is taxable above 150K฿ if you stay 180+ days.` -> After: `foreign-source income earned from 2024 onward and remitted to Thailand is taxable if you are Thai tax resident, subject to deductions, treaties, and exemptions.` |
| P0 | `visas/dtv/index.html:490` | Before: `Foreign-sourced income remitted to Thailand in the year of earning is taxable` -> After: `Foreign-source income earned from 1 Jan 2024 onward by a Thai tax resident is taxable when remitted to Thailand, even in a later tax year.` |
| P0 | `visas/ltr/index.html:475` | Before: `Taxable if remitted same year` -> After: `Taxable when remitted if earned from 2024 onward`. |
| P0 | `guides/best-visa-digital-nomads/index.html:474` | Before: `LTR holders (Wealthy Pensioner, Wealthy Global Citizen, Highly-Skilled Professional) get tax exemption` -> After: `LTR Wealthy Global Citizen, Wealthy Pensioner, and Work-from-Thailand Professional holders get the foreign-income exemption; Highly-Skilled Professional does not, but may receive 17% PIT treatment on eligible Thai-employer income.` |
| P0 | `faq/index.html:610`, `faq/index.html:997` | Before: `exempts ... LTR Wealthy Pensioner and Wealthy Global Citizen visa holders ... (subject to specific timing conditions)` -> After: `exempts foreign-source income remitted to Thailand for LTR Wealthy Global Citizen, Wealthy Pensioner, and Work-from-Thailand Professional holders; Highly-Skilled Professionals are not foreign-income exempt but may receive 17% PIT treatment on eligible Thai-employer income.` |
| P0 | `glossary/index.html:323` | Before: `2023 decree establishing 17% flat tax for LTR Wealthy Professional category.` -> After: `Royal Decree 743, dated 23 May 2022, gives the foreign-income exemption to LTR Wealthy Global Citizen, Wealthy Pensioner, and Work-from-Thailand Professional holders; Highly-Skilled receives 17% PIT treatment instead.` |
| P0 | `api/visa-data.json:119`, `api/visa-data.json:123`, `api/visa-data.json:127` | Before: `"basis": "Royal Decree 743 (2024)"` -> After: `"basis": "Royal Decree 743 (dated 23 May 2022; relevant to post-2024 remittance planning)"`. |
| P0 | `functions/api/lead.js:124-152` | Before: raw `${lead.firstName}`, `${lead.email}`, `${lead.situation}` in HTML -> After: define `safe.* = escapeHtml(...)` and use only `safe.*` in HTML; use `encodeURIComponent()` in `mailto:` and WhatsApp URLs. |
| P0 | `functions/api/lead.js:237`, `functions/api/lead.js:257-261` | Before: raw lead fields in Slack/Discord -> After: use sanitized/escaped and length-limited values in all webhook fields. |
| P1 | `robots.txt:5` | Before: `Disallow: /api/` -> After: `Allow: /api/visa-data.json` then `Disallow: /api/lead` and `Disallow: /api/subscribe`. |
| P1 | `_redirects:27` | Before: no legacy rules -> After add `/tools/ltr-eligibility/ /tools/eligibility/ 301` and `/professions/digital-nomad/ /digital-nomad/ 301`. |
| P1 | `glossary/royal-decree-743/index.html:513`, `glossary/royal-decree-743/index.html:521` | Before: text ends `... Wealthy Pensioner and Wealt` -> After: full RD743 sentence covering W/P/T exemption and H 17% PIT treatment. |
| P1 | `contact/index.html:619-625` | Before: contact-card section pretending to be a form -> After: a real `<form id="leadForm" action="/api/lead" method="POST">` with associated labels and mobile-friendly input types. |
| P1 | `functions/api/lead.js:56`, `functions/api/subscribe.js:34` | Before: `if (env.TURNSTILE_SECRET) { ... }` -> After: fail closed in production if missing secret, then verify token. |
| P1 | `about/index.html:47` | Before: `sameAs` only WhatsApp -> After: include `https://pattaya-authority.com`, `https://timpaemi.com`, `https://pattaya-restaurant-guide.com`, `https://pattaya-gym.com`, `https://pattayastream.com`, `https://pattaya-coffee.com`, `https://pattaya-school-guide.com`, and WhatsApp. |
| P1 | `tools/bank-checker/index.html:331`, `tools/eligibility/index.html:356`, `tools/reminder/index.html:307` | Before: `PATTAYA AUTHORITY` anchor points to `https://timpaemi.com` -> After: `PATTAYA AUTHORITY` anchor points to `https://pattaya-authority.com`; keep `TIM PAEMI` anchor on `https://timpaemi.com`. |
| P1 | `index.html:160` and 177 similar blocks | Before: `"dateModified": "2026-05-18"` with visible `v2026.05.19` -> After: update `dateModified` to the true visible/update date or revert visible dates to the true content-review date. |
| P1 | `compare/index.html:636` and near-orphan comparison pages | Before: comparison spokes have one inbound link -> After: add contextual links from visa pillars to relevant comparison pages as listed in Pillar 5. |
| P2 | `_headers:12` | Before CSP lacks hardening directives -> After append `base-uri 'self'; object-src 'none'; form-action 'self'; upgrade-insecure-requests;`. |
| P2 | `index.html:436`, `index.html:497` | Before mobile nav padding creates sub-44px targets -> After add `min-height:44px` and larger padding to `.nav a` and `.mnav a`. |
| P2 | `index.html:451`, `tools/cost-calculator/index.html:137`, `tools/currency-converter/index.html:129` | Before: `p{font-size:15px;line-height:1.6}` -> After: `p{font-size:16px;line-height:1.65}`. |
| P2 | `tools/cost-calculator/index.html:327` | Before: `<div class="result-card" id="result">` -> After: `<div class="result-card" id="result" aria-live="polite" aria-atomic="true">`. |
| P2 | `tools/currency-converter/index.html:316` | Before: `<div class="result-card">` -> After: `<div class="result-card" aria-live="polite" aria-atomic="true">`. |
| P2 | `tools/visa-finder/index.html:316` | Before: `<div id="quizArea"></div>` -> After: `<div id="quizArea" aria-live="polite" aria-atomic="true"></div>`. |
| P2 | `visas/education-ed/index.html:376` | Before: `providers in Pattaya)s` -> After: `providers in Pattaya)`. |
| P2 | `digital-nomad/index.html:552` area | Add contextual sibling link: `Pattaya cafes for remote work` -> `https://pattaya-coffee.com/`. |
| P2 | `guides/cost-of-living-pattaya/index.html` body | Add contextual sibling link: `restaurant costs in Pattaya` -> `https://pattaya-restaurant-guide.com/`. |
| P2 | `blog/2026-annual-review/index.html:519-521` | Add contextual sibling link: `local video updates` -> `https://pattayastream.com/`. |
| P2 | `changelog/index.html:6`, `visas/dtv/index.html:6`, `tools/eligibility/index.html:8` | Trim title tags to <=60 chars while preserving target keyword first. |
| P2 | `glossary/soft-power/index.html:7` | Before: `Independent Thailand visa guidance from Pattaya.` -> After: write a specific 120-160 char soft-power/DTV description. |
| P3 | `v2-preview/index.html:8`, `v2-preview/index.html:630` | Remove preview from production or fix canonical/schema/heading hierarchy. |
| P3 | `tools/visa-finder/index.html:60-63` | Before reduced-motion removes reserved height -> After preserve min-height and disable animation only. |
| P3 | `blog/index.html:529`, `blog/30-day-visa-exempt-rollback/index.html:555` | Optional: add `type="application/rss+xml"` to `/feed.xml` anchors. |
| P3 | `llms.txt:98-108` | Add explicit parent-network relationship sentence for Pattaya Authority. |
| P3 | `visas/index.html:569` | Add a `See our update methodology` link to `/methodology/` after the update-promise paragraph. |
| P3 | `v2-preview/index.html` | If unused, remove from deploy output or block from public routing; it is noindex but still publicly addressable. |

## 7. Idea backlog

| Rank | Idea | Impact | Effort | Why |
|---:|---|---|---|---|
| 1 | Real `/contact/` lead form wired to `/api/lead` | High | M | Direct conversion path is currently promised but absent. |
| 2 | Tax resident/remittance checker | High | M | Turns the 2024 tax change into a linkable tool and LTR lead filter. |
| 3 | Embassy-specific DTV requirement tracker | High | L | DTV embassy variance is painful, high-search, and hard for competitors to maintain. |
| 4 | Source/update methodology page with official source log | High | S | YMYL authority needs visible maintenance discipline. |
| 5 | Network hub page/section | Med | S | Makes the Pattaya Authority ecosystem legible to humans and AI. |
| 6 | Document risk scanner | High | M | Converts uncertain users before they make expensive mistakes. |
| 7 | Profile hubs for retirees/families/remote workers/business owners | High | M | Repackages existing content into rankable decision journeys. |
| 8 | Decision mini-widgets inside visa pillars | Med | S | Helps users move from "learn" to "choose" and strengthens internal links. |
| 9 | Official citation boxes on every visa/tax/legal page | High | M | Direct E-E-A-T and answer-engine extraction gain. |
| 10 | Pattaya immigration office live guide | Med | M | Local authority asset; likely to attract links/screenshots. |
| 11 | Case-study schema and proof notes | Med | S | Use only with real anonymized evidence; improves credibility. |
| 12 | Glossary rich snippets with Thai terms/pronunciation | Low | M | Nice moat, lower lead value. |

## 8. What prior passes missed

These are the findings that make this pass materially different from previous mechanical audits:

1. **Deployment drift survived a clean git state**: local `main` equals `origin/main`, yet live Cloudflare is still serving `v2026.05.18` while source advertises `v2026.05.19`.
2. **The advertised AI data API is blocked by robots**: `llms.txt:91` promotes `/api/visa-data.json`, but `robots.txt:5` disallows `/api/`.
3. **The production contact funnel is a false promise**: `/contact/` links to `#leadForm`, but no real form exists, even though `functions/api/lead.js` is present.
4. **`escapeHtml()` exists but is unused** in the lead function, leaving raw user input in HTML/email/webhook contexts.
5. **Royal Decree 743 category errors remain in high-intent pages**: especially the digital nomad guide's inclusion of Highly-Skilled Professional in the exemption.
6. **Structured freshness is internally inconsistent at scale**: 178 `dateModified` values are still 18 May while visible footers/sitemaps are 19 May.
7. **Network schema was only fixed on the homepage**: About/article publisher schema still fails to express the full Pattaya Authority network.
8. **Legacy moved pages still need server 301s**, not noindex meta/JS redirects.
9. **Contextual sibling-site linking is almost absent** despite a strong network list in `llms.txt`.
10. **The Royal Decree 743 glossary page is visibly truncated**, which is easy to miss in code but obvious to a careful reader.

# CODEX FULL AUDIT REPORT - pattayavisahelp.com

Audit date: 2026-05-18 Thailand business date / generated from Codex session dated 2026-05-17 America/Los_Angeles.  
Mode: READ-ONLY audit. No production files were changed, no branch was created, no commit was made.

## 1. Executive Summary

Overall verdict: launch-ready technically, not yet authority-ready for broad Thailand visa head terms. The site is substantially better than the average Pattaya visa-agent site on structure, speed, tooling, transparency, and local usefulness. It is already credible for branded, Pattaya-local, and long-tail informational searches. It is not yet competitive enough to expect durable top-3 rankings for broad queries such as "Thailand DTV visa", "LTR visa Thailand", or "Thailand Privilege visa" because those SERPs are dominated by official sources, older legal/agent domains, and high-authority expat publishers.

The three most important findings:

- Technical foundation is unusually strong: 182 sitemap URLs, no live broken internal links found, no canonical redirect/error chains, strong security headers, excellent Lighthouse scores on nearly every tested page, and all 9 interactive tools passed in both mobile and desktop. Raw evidence: _research/CODEX_AUDIT_LOCAL.json, _research/CODEX_AUDIT_LIGHTHOUSE.json, _research/CODEX_AUDIT_UX_TOOLS.json.
- The remaining technical blockers are concentrated and fixable: 72 URLs show schema.org validator errors, 5 indexable pages have no JSON-LD, all sitemap lastmod values are stale versus the latest git commit, and the axe sweep found recurring landmark-region issues across the site.
- The main strategic weakness is authority, not page construction. The content is useful and original, but many visa pillars have zero official outbound citations, the backlink footprint appears near-zero from manual public checks, Google Business Profile status is unverified/possibly absent, and broad SERPs are owned by official/government pages, Siam Legal/ThaiEmbassy-style domains, and established agent/legal publishers.

The single most important next move: verify and harden factual authority on the 12 visa pillars before doing more growth work. That means official-source citations on every pillar, schema validator cleanup, and correction/clarification of the DTV seasoning, Thailand Privilege Bronze/Gold pricing, and O-X summary drift. Once the site is source-clean, the highest-leverage growth move is local authority: Google Business Profile plus Pattaya/Jomtien citations and outreach around the existing tools.

## 2. Scorecard

| Area | Result | Verdict |
| --- | ---: | --- |
| Sitemap URLs audited | 182 | Good coverage |
| Production HTML files | 185 | 2 production HTML files not in sitemap |
| Live internal broken links | 0 | Pass |
| Canonical redirect/error chains | 0 | Pass |
| Stale sitemap lastmod entries | 182 | Needs update |
| Long title tags >60 chars | 26 | Low/medium SEO polish |
| Missing JSON-LD locally | 5 | Needs schema cleanup |
| External links missing rel noopener noreferrer | 13 | Low security/quality cleanup |
| Schema.org validator | 182 URLs tested; 72 URLs with errors; 17 URLs with warnings; 5 with no objects | Needs cleanup |
| Axe accessibility | 364 viewport-pages; 392 violations; 2254 nodes | Needs landmark/tap target pass |
| Tool UX | 18/18 passed | Pass |
| Lighthouse | 70 scored page/viewport runs; 3 threshold misses; 1 requested URL was 404/no score | Strong |
| Backlinks | Manual public search found no meaningful independent referring-domain footprint | Major growth gap |
| Competitive position | Strong on utility/local specificity; weak on domain age, citations, GBP/citations, links | Needs authority building |

### Lighthouse Summary Table

Scores are Performance/Accessibility/Best Practices/SEO. Metrics are LCP / CLS / TBT.

| Page | Mobile scores | Mobile LCP/CLS/TBT | Desktop scores | Desktop LCP/CLS/TBT | Flag |
| --- | --- | --- | --- | --- | --- |
| / | 98/100/100/100 | 1.9 s / 0.035 / 80 ms | 96/100/100/100 | 0.9 s / 0.098 / 0 ms | pass |
| /visas/ | 99/100/100/100 | 1.8 s / 0.039 / 20 ms | 98/100/100/100 | 0.8 s / 0.073 / 0 ms | pass |
| /visas/dtv/ | 99/100/100/100 | 1.8 s / 0.036 / 50 ms | 100/100/100/100 | 0.6 s / 0.03 / 0 ms | pass |
| /visas/ltr/ | 95/100/100/100 | 1.8 s / 0.114 / 20 ms | 99/100/100/100 | 0.7 s / 0.017 / 0 ms | pass |
| /visas/privilege-elite/ | 87/100/100/100 | 1.8 s / 0.229 / 20 ms | 99/100/100/100 | 0.5 s / 0.075 / 0 ms | pass |
| /visas/retirement-non-o/ | 99/100/100/100 | 1.8 s / 0.026 / 30 ms | 99/100/100/100 | 0.8 s / 0.033 / 0 ms | pass |
| /visas/tourist-tr-evisa/ | 99/100/100/100 | 1.8 s / 0.029 / 20 ms | 98/100/100/100 | 0.5 s / 0.089 / 0 ms | pass |
| /visas/retirement-o-a/ | 93/100/100/100 | 2.6 s / 0.02 / 20 ms | 96/100/100/100 | 0.7 s / 0.11 / 0 ms | pass |
| /visas/media-non-m/ | 98/100/100/100 | 1.8 s / 0.045 / 20 ms | 98/100/100/100 | 0.8 s / 0.074 / 0 ms | pass |
| /visas/marriage-non-o/ | 92/100/100/100 | 1.8 s / 0.158 / 50 ms | 98/100/100/100 | 0.5 s / 0.092 / 0 ms | pass |
| /visas/smart/ | 94/100/100/100 | 1.7 s / 0.134 / 50 ms | 99/100/100/100 | 0.7 s / 0.013 / 0 ms | pass |
| /visas/business-non-b/ | 95/100/100/100 | 1.8 s / 0.116 / 20 ms | 91/100/100/100 | 0.7 s / 0.175 / 0 ms | desktop perf 91<95 |
| /visas/education-ed/ | 94/100/100/100 | 2.5 s / 0.046 / 20 ms | 99/100/100/100 | 0.7 s / 0.035 / 0 ms | pass |
| /visas/retirement-o-x/ | 99/100/100/100 | 1.8 s / 0.025 / 20 ms | 95/100/100/100 | 0.5 s / 0.137 / 0 ms | pass |
| /tools/visa-finder/ | 77/100/96/100 | 2.5 s / 0.35 / 20 ms | 94/100/100/100 | 0.5 s / 0.155 / 0 ms | mobile perf 77<85; desktop perf 94<95 |
| /tools/cost-calculator/ | 99/100/96/100 | 1.7 s / 0.054 / 50 ms | 99/100/100/100 | 0.8 s / 0.031 / 0 ms | pass |
| /tools/eligibility/ | 88/100/96/100 | 2.9 s / 0.086 / 50 ms | 99/100/100/100 | 0.8 s / 0.043 / 0 ms | pass |
| /tools/document-checklist/ | 93/100/96/100 | 1.7 s / 0.16 / 20 ms | 100/100/100/100 | 0.5 s / 0.014 / 0 ms | pass |
| /blog/ | 99/100/96/100 | 1.7 s / 0.039 / 80 ms | 99/100/100/100 | 0.8 s / 0.037 / 0 ms | pass |
| /blog/tdac-step-by-step/ | 99/100/100/100 | 1.8 s / 0.028 / 50 ms | 99/100/100/100 | 0.8 s / 0.011 / 0 ms | pass |
| /faq/ | 93/100/100/100 | 2.6 s / 0.025 / 20 ms | 99/100/100/100 | 0.8 s / 0.033 / 0 ms | pass |
| /glossary/ | 98/100/100/100 | 1.7 s / 0.06 / 70 ms | 99/100/100/100 | 0.8 s / 0.029 / 0 ms | pass |
| /changelog/ | 90/100/100/100 | 2.9 s / 0.039 / 50 ms | 99/100/100/100 | 0.8 s / 0.032 / 0 ms | pass |
| /methodology/ | 93/100/100/100 | 1.8 s / 0.147 / 50 ms | 98/100/100/100 | 0.8 s / 0.076 / 0 ms | pass |
| /about/ | 94/100/100/100 | 1.8 s / 0.124 / 10 ms | 99/100/100/100 | 0.8 s / 0.031 / 0 ms | pass |
| /contact/ | 98/100/96/100 | 1.8 s / 0.041 / 20 ms | 99/100/100/100 | 0.8 s / 0.032 / 0 ms | pass |
| /sitemap/ | 100/100/96/100 | 0.8 s / 0 / 30 ms | 100/100/100/100 | 0.4 s / 0 / 0 ms | pass |
| /guides/visa-runs-vs-extensions/ | 89/100/100/100 | 1.8 s / 0.197 / 10 ms | 98/100/100/100 | 0.8 s / 0.062 / 0 ms | pass |
| /guides/90-day-reporting/ | 98/100/100/100 | 1.8 s / 0.048 / 10 ms | 98/100/100/100 | 0.8 s / 0.042 / 0 ms | pass |
| /guides/jomtien-immigration-office/ | 99/100/100/100 | 1.8 s / 0.004 / 20 ms | 98/100/100/100 | 1.0 s / 0.05 / 0 ms | pass |
| /compare/dtv-vs-ltr/ | 98/100/100/100 | 1.8 s / 0.041 / 60 ms | 97/100/100/100 | 0.8 s / 0.076 / 0 ms | pass |
| /compare/non-o-vs-o-a/ | 98/100/100/100 | 1.8 s / 0.065 / 20 ms | 98/100/100/100 | 0.8 s / 0.041 / 0 ms | pass |
| /professions/digital-nomad/ | no score | n/a | no score | n/a | live 404/no Lighthouse score |
| /best-visa/under-50k/ | 99/100/96/100 | 1.8 s / 0 / 10 ms | 99/100/100/100 | 0.8 s / 0.038 / 0 ms | pass |
| /de/ | 99/100/100/100 | 1.7 s / 0.003 / 10 ms | 99/100/100/100 | 0.8 s / 0.033 / 0 ms | pass |
| /ru/ | 99/100/100/100 | 1.7 s / 0 / 50 ms | 99/100/100/100 | 0.8 s / 0.001 / 0 ms | pass |

Threshold misses:
- /visas/business-non-b/: desktop perf 91<95.
- /tools/visa-finder/: mobile perf 77<85; desktop perf 94<95.
- /professions/digital-nomad/: live 404/no Lighthouse score.

### Accessibility Findings Count

| Rule | Impact | Affected viewport-pages | Nodes |
| --- | --- | ---: | ---: |
| landmark-one-main | moderate | 26 viewport-pages | 26 |
| region | moderate | 362 viewport-pages | 2224 |
| empty-table-header | minor | 4 viewport-pages | 4 |

Manual-style checks from Playwright:

- Skip link activation: 0 failures using the script's activation check; every tested page exposed a first-focus skip link and activation target in the raw data.
- Mobile bottom navigation: 0 mobile failures across 182 mobile pages.
- Reduced motion: 0 pages still had running animations under prefers-reduced-motion: reduce.
- Tap target size: 364 of 364 viewport-pages had at least one target below the 44px manual target, mostly skip/nav/footer/contact-link patterns. Treat as a manual UX/accessibility risk even though Lighthouse accessibility is 100 on the performance sample.

### Content Sample Table

| Page | Words | Reading minutes | Official citations counted | Email/WA/LINE CTA | Methodology link |
| --- | ---: | --- | ---: | --- | --- |
| / | 1198 | 6 | 0 | Y/Y/Y | Y |
| /visas/dtv/ | 2245 | 12 / displayed 8 | 1 | Y/Y/Y | Y |
| /visas/ltr/ | 1728 | 9 / displayed 9 | 1 | Y/Y/Y | Y |
| /visas/privilege-elite/ | 1665 | 9 / displayed 7 | 0 | Y/Y/Y | Y |
| /visas/retirement-non-o/ | 1848 | 10 / displayed 7 | 0 | Y/Y/Y | Y |
| /visas/tourist-tr-evisa/ | 1418 | 8 / displayed 7 | 1 | Y/Y/Y | Y |
| /visas/retirement-o-a/ | 1800 | 9 / displayed 8 | 0 | Y/Y/Y | Y |
| /visas/media-non-m/ | 1603 | 9 / displayed 6 | 0 | Y/Y/Y | Y |
| /visas/marriage-non-o/ | 2015 | 11 / displayed 7 | 0 | Y/Y/Y | Y |
| /visas/smart/ | 1185 | 6 / displayed 6 | 0 | Y/Y/Y | Y |
| /visas/business-non-b/ | 1614 | 9 / displayed 6 | 0 | Y/Y/Y | Y |
| /visas/education-ed/ | 1389 | 7 / displayed 6 | 0 | Y/Y/Y | Y |
| /visas/retirement-o-x/ | 1409 | 8 / displayed 7 | 0 | Y/Y/Y | Y |
| /guides/visa-runs-vs-extensions/ | 1910 | 10 / displayed 7 | 2 | Y/Y/Y | Y |
| /guides/90-day-reporting/ | 2390 | 12 / displayed 9 | 4 | Y/Y/Y | Y |
| /guides/jomtien-immigration-office/ | 1584 | 8 / displayed 5 | 0 | Y/Y/Y | Y |
| /guides/tm30-reporting/ | 1339 | 7 / displayed 4 | 1 | Y/Y/Y | Y |
| /guides/thai-bank-account-as-foreigner/ | 1251 | 7 / displayed 4 | 0 | Y/Y/Y | Y |
| /guides/re-entry-permits/ | 1191 | 6 / displayed 4 | 0 | Y/Y/Y | Y |
| /tools/visa-finder/ | 179 | 1 | 0 | Y/Y/Y | Y |
| /tools/cost-calculator/ | 284 | 2 | 0 | Y/Y/Y | Y |
| /tools/eligibility/ | 237 | 2 | 0 | Y/Y/N | N |
| /tools/document-checklist/ | 194 | 1 | 0 | Y/Y/Y | Y |
| /compare/dtv-vs-ltr/ | 1489 | 8 / displayed 5 | 0 | Y/Y/Y | Y |
| /compare/non-o-vs-o-a/ | 1511 | 8 / displayed 5 | 0 | Y/Y/Y | Y |
| /compare/dtv-vs-elite/ | 2040 | 11 / displayed 7 | 0 | Y/Y/Y | Y |
| /compare/privilege-vs-ltr/ | 2117 | 11 / displayed 8 | 0 | Y/Y/Y | Y |

## 3. Technical SEO Findings

Strong points:

- Canonicals resolve cleanly. The local/live crawler found zero canonical targets returning redirects/errors. Raw: _research/CODEX_AUDIT_LOCAL.json.
- Live internal link health is good. The live internal crawl found 0 broken internal URLs across sitemap pages.
- Robots.txt is sane. Live robots allows the public site, disallows /api/, /functions/, and /_research/, lists both sitemap URLs, and points AI crawlers to llms.txt. Evidence: live https://pattayavisahelp.com/robots.txt.
- llms.txt is present and discoverable. Evidence: C:\pattayavisahelp\llms.txt:3 and live https://pattayavisahelp.com/llms.txt.
- OG/Twitter metadata is broadly present on audited pages; local issues were concentrated in schema/title/link hygiene, not basic social metadata.

Issues:

- Sitemap lastmod is stale across all 182 sitemap URLs. Example: C:\pattayavisahelp\sitemap.xml:5 is 2026-05-10, while latest git commit is b09598a at 2026-05-16T01:25:44Z. This weakens freshness signals for a recent launch and can slow recrawl prioritization.
- 26 title tags exceed 60 chars. Examples: C:\pattayavisahelp\tools\eligibility\index.html:8, C:\pattayavisahelp\visas\dtv\index.html:6, C:\pattayavisahelp\visas\education-ed\index.html:6, C:\pattayavisahelp\compare\o-a-vs-o-x\index.html:6. This is not a blocker, but snippets may truncate on competitive SERPs.
- 5 pages have no JSON-LD: /best-visa/, /guides/, /pattaya/, /changelog/, /sitemap/. Local rg found no application/ld+json or @context in C:\pattayavisahelp\best-visa\index.html, C:\pattayavisahelp\guides\index.html, C:\pattayavisahelp\pattaya\index.html, C:\pattayavisahelp\changelog\index.html, and C:\pattayavisahelp\sitemap\index.html.
- Schema.org validator reported errors on 72/182 URLs and warnings on 17/182. Common affected examples include /compare/dtv-vs-ltr/, /compare/non-o-vs-o-a/, /guides/90-day-reporting/, and many guide/budget pages. Local source shows a recurring minimal WebPage + SpeakableSpecification pattern such as C:\pattayavisahelp\compare\dtv-vs-ltr\index.html:29. DTV itself validated cleanly in direct sample testing, so the issue is not universal.
- 13 external links are missing rel="noopener noreferrer". Examples: C:\pattayavisahelp\tools\bank-checker\index.html:330, C:\pattayavisahelp\tools\eligibility\index.html:355, C:\pattayavisahelp\guides\glossary\index.html:567, C:\pattayavisahelp\blog\tdac-step-by-step\index.html:577.
- The local checker flagged /feed.xml references as missing local HTML targets at C:\pattayavisahelp\blog\index.html:512 and C:\pattayavisahelp\blog\30-day-visa-exempt-rollback\index.html:533. Live /feed.xml resolves, so this is not a live broken link, but the local audit script correctly exposed that non-HTML generated assets need separate handling.
- Two production HTML files are not in sitemap: C:\pattayavisahelp\tools\ltr-eligibility\index.html and C:\pattayavisahelp\v2-preview\index.html. If intentional, they should be noindex or blocked; if not, they should be linked/sitemapped/redirected.
- The requested audit URL /professions/digital-nomad/ is a live 404/no Lighthouse score. The actual live/sitemap topic appears to be /digital-nomad/ and /guides/best-visa-digital-nomads/. This is exactly the kind of vanity URL drift the brief warned about.

## 4. Performance Findings

The performance story is strong. Total page weights in the Lighthouse sample are generally ~176-320 KiB, server response times were low, and most pages scored 95-100 on desktop and 90-99 on mobile. The homepage scored 98 mobile and 96 desktop; /visas/dtv/ scored 99 mobile and 100 desktop.

Failures against the requested thresholds:

- /tools/visa-finder/ mobile: Performance 77, LCP 2.5s, CLS 0.35, TBT 20ms. This is the most important performance issue because Visa Finder is a conversion tool and an internal-link hub.
- /tools/visa-finder/ desktop: Performance 94, CLS 0.155.
- /visas/business-non-b/ desktop: Performance 91, CLS 0.175, despite fast LCP/TBT. This looks like layout shift, not JavaScript CPU.
- /professions/digital-nomad/: no Lighthouse category scores because the live URL is 404/no valid page.

Top recurring opportunities/diagnostics in raw Lighthouse JSON:

- Layout shift on several pages, with Visa Finder the most severe.
- Unused JavaScript diagnostics around ~65-68 KiB on multiple pages.
- Static resource cache TTL warnings on a subset of assets.
- Legacy JavaScript warnings on some pages.
- No large image-weight problem surfaced; page-weight budgets are already under the requested thresholds.

Thailand/Bangkok network note: I did not have a separate paid Thailand Lighthouse runner. However, live curl responses were served through Cloudflare's Bangkok colo in prior header checks, and Lighthouse runs were against the live Cloudflare Pages site, not local files. Treat these results as good evidence for deployed performance, but not a substitute for field Core Web Vitals from Thai users in Search Console/CrUX.

## 5. Accessibility Findings

The site is close, but it does not meet a strict 2026 accessibility bar yet because the same structural issue repeats everywhere.

Findings:

- axe region: 362 viewport-pages / 2224 nodes. This means content exists outside landmark regions. The likely pattern is header/marquee/footer content sitting outside recognized landmarks. It is a best-practice violation, but at this scale it is worth fixing.
- axe landmark-one-main: 26 viewport-pages / 26 nodes, affecting homepage plus the 12 visa pillars in both viewports. The source pattern uses a skip target on the hero/header instead of a true main landmark, while many article pages correctly use <main id="main">, e.g. C:\pattayavisahelp\compare\dtv-vs-ltr\index.html:503.
- axe empty-table-header: 4 viewport-pages / 4 nodes. Examples: C:\pattayavisahelp\compare\pattaya-vs-hua-hin\index.html:475 and C:\pattayavisahelp\guides\pattaya-vs-phuket-vs-chiang-mai-retirement\index.html:473.
- Tap targets: every viewport-page had at least one target below 44px in the script's geometry pass. This mostly appears to be skip links, compact nav/footer links, and some contact/link controls. It is less severe than a form-control failure, but it falls short of the manual standard in the brief.
- Positive: mobile bottom nav appeared on all mobile sitemap pages tested; reduced-motion emulation showed 0 pages with running animations; the first-focus skip link existed and activated in the raw data.

## 6. Content + Quality Findings

Overall content verdict: better than SEO slop, but not yet citation-hardened enough for YMYL-adjacent visa queries. The tone is distinct: local, independent, no-commission, anti-agent-pump. The pages mostly answer real user intent with practical caveats. The weakness is not voice; it is verifiability and a few factual-drift points.

Strengths:

- The 12 visa pillar pages have meaningful depth: DTV 2245 words, LTR 1728, Privilege 1665, Retirement Non-O 1848, Marriage 2015, Business Non-B 1614, etc.
- Internal links and CTAs are strong. Most pillars have email, WhatsApp, LINE, methodology links, and many related links.
- The voice is consistent with the stated positioning: independent, Pattaya-based, no fake urgency, no agent-pump.
- Originality sample did not show plagiarism-style overlap. The 10-page shingle sample had 5-word Jaccard overlap of 0.0006 at highest and 0 for most pairs. Caveat: this is a simple public-web overlap check, not Copyscape/Ahrefs Content Explorer. Raw: _research/CODEX_AUDIT_CONTENT_OVERLAP.json.

Overlap sample:

| Local page | Competitor/source domain | HTTP | 5-gram Jaccard |
| --- | --- | ---: | ---: |
| visas/dtv/index.html | www.siam-legal.com | 200 | 0.0006 |
| visas/dtv/index.html | budapest.thaiembassy.org | 200 | 0 |
| visas/ltr/index.html | ltr.boi.go.th | 200 | 0 |
| visas/privilege-elite/index.html | www.thailandprivilege.co.th | 200 | 0 |
| visas/retirement-o-x/index.html | thailand.go.th | 200 | 0 |
| visas/retirement-non-o/index.html | www.conciergepattaya.com | 200 | 0 |
| guides/90-day-reporting/index.html | www.thaiembassy.com | 200 | 0 |
| guides/tm30-reporting/index.html | www.thai-visa-services.com | 200 | 0 |
| guides/best-visa-digital-nomads/index.html | www.thaiembassy.com | 200 | 0 |
| visas/marriage-non-o/index.html | www.conciergepattaya.com | 200 | 0 |

Factual/source concerns:

- DTV financial seasoning is over-stated in places. The site repeatedly says 6 months is non-negotiable: C:\pattayavisahelp\visas\dtv\index.html:58, :410, :444, :473, :512. Official embassy guidance varies; Royal Thai Embassy Budapest says evidence of at least 500,000 THB may be a 6-month official bank statement, while other embassies and agent/legal pages commonly cite 3 months. Evidence: Royal Thai Embassy Budapest DTV page lines 167-205 and Siam Legal DTV result noting 3-month enforcement. Recommendation: treat 6 months as conservative advice, not a universal rule, and cite embassy variation clearly.
- DTV tax text is appropriately cautious but under-cited. C:\pattayavisahelp\visas\dtv\index.html:484-493 and :524 discuss tax residency, current-year remittance, later-year savings, and Royal Decree 743. Because this is high-stakes tax guidance, it needs official Revenue Department / Royal Gazette / BOI citation support or a stronger accountant disclaimer.
- Thailand Privilege pricing is internally inconsistent/outdated. The page says "Gold" from THB 650K at C:\pattayavisahelp\visas\privilege-elite\index.html:347 and says Gold up to Reserve at C:\pattayavisahelp\visas\privilege-elite\index.html:356, while later it correctly says Gold is THB 900K at :459. Official Thailand Privilege material lists Bronze at THB 650K and Gold at THB 900K; Thailand Privilege's own health-insurance guide lists Bronze 650K, Gold 900K, Platinum 1.5M, Diamond 2.5M, Reserve 5M. Evidence: https://www.thailandprivilege.co.th/why-thailand/expat-health-insurance-thailand-guide and official Bronze PDF https://cms.thailandprivilege.co.th/stocks/download/o0x0/xa/kb/ah5vxakbog8/670910_brochure-BRONZE_1.pdf.
- llms.txt has an O-X factual drift: C:\pattayavisahelp\llms.txt:32 says O-X is for "over-60s". The O-X pillar itself correctly says age 50+ at C:\pattayavisahelp\visas\retirement-o-x\index.html:7, :419, :479. Thailand.go.th confirms O-X applicants must be over 50 and meet the 14-nationality/3M-baht rules. Evidence: https://thailand.go.th/public/issue-focus-detail/001-01-058.
- Official citations are too sparse for a serious visa reference site. Local content audit counted 0 official citations on Privilege, Retirement Non-O, O-A, Media, Marriage, SMART, Business, Education, O-X, and several guides. The site claims primary-source methodology in llms.txt, so the visible pages should back that up.
- Reading-time labels are sometimes lower than calculated text length. DTV calculates ~12 min but displays 8; Privilege calculates ~9 but displays 7; Retirement Non-O calculates ~10 but displays 7. This is trust polish, not a ranking blocker.

## 7. UX + Interaction Findings

All 18 tool/viewport tests passed with zero console errors.

| Tool | Viewport | Result | Console errors | Evidence |
| --- | --- | --- | ---: | --- |
| /tools/visa-finder/ | mobile | PASS | 0 | // YOUR RECOMMENDED VISA TOURIST TR (60-DAY)  60-day Tourist Visa (TR) is the right call for a stay under 90 days. Visa-exempt entry available for 93 nationalities (also up to 60 d |
| /tools/visa-finder/ | desktop | PASS | 0 | // YOUR RECOMMENDED VISA TOURIST TR (60-DAY)  60-day Tourist Visa (TR) is the right call for a stay under 90 days. Visa-exempt entry available for 93 nationalities (also up to 60 d |
| /tools/cost-calculator/ | mobile | PASS | 0 | // TOTAL ESTIMATED COST ฿18K ~$503 USD · 5 YEARS ON DTV Government fee ฿10K Annual extensions (4 × ฿1900) ฿8K TOTAL (5-year all-in) ฿18K  Apply from any Thai embassy. ฿500K seasoni |
| /tools/cost-calculator/ | desktop | PASS | 0 | // TOTAL ESTIMATED COST ฿18K ~$503 USD · 5 YEARS ON DTV Government fee ฿10K Annual extensions (4 × ฿1900) ฿8K TOTAL (5-year all-in) ฿18K  Apply from any Thai embassy. ฿500K seasoni |
| /tools/eligibility/ | mobile | PASS | 0 | Your LTR eligibility results Wealthy Global Citizen (W) NO Assets ≥ $1M ($1,000,000) Income ≥ $80k/yr ($80,000) Thai investment must be ≥ $500k (you: $250,000). Options: Thai gover |
| /tools/eligibility/ | desktop | PASS | 0 | Your LTR eligibility results Wealthy Global Citizen (W) NO Assets ≥ $1M ($1,000,000) Income ≥ $80k/yr ($80,000) Thai investment must be ≥ $500k (you: $250,000). Options: Thai gover |
| /tools/expiry-countdown/ | mobile | PASS | 0 | // DAYS UNTIL VISA EXPIRY 228 EXPIRES 31 DEC 2026 · YOU HAVE TIME // Upcoming dates 30 JUL 2026 90-day report (TM47) File at Jomtien Immigration or online · 74 days away 01 DEC 202 |
| /tools/expiry-countdown/ | desktop | PASS | 0 | // DAYS UNTIL VISA EXPIRY 228 EXPIRES 31 DEC 2026 · YOU HAVE TIME // Upcoming dates 30 JUL 2026 90-day report (TM47) File at Jomtien Immigration or online · 74 days away 01 DEC 202 |
| /tools/income-test/ | mobile | PASS | 0 | You qualify for 5 visas based on this input. Monthly income: $6,000 USD-equivalent. Liquid: ฿200K+. // YOUR ELIGIBILITY VISAS YOU QUALIFY FOR YES Marriage Non-O → YES SMART Visa →  |
| /tools/income-test/ | desktop | PASS | 0 | You qualify for 5 visas based on this input. Monthly income: $6,000 USD-equivalent. Liquid: ฿200K+. // YOUR ELIGIBILITY VISAS YOU QUALIFY FOR YES Marriage Non-O ฿40K+/m ✓ (need Tha |
| /tools/document-checklist/ | mobile | PASS | 0 | // YOUR DOCUMENT CHECKLIST DTV — DESTINATION THAILAND VISA IDENTITY & TRAVEL Passport — minimum 6 months validity, 2+ blank pages Digital passport photo (white background, recent)  |
| /tools/document-checklist/ | desktop | PASS | 0 | // YOUR DOCUMENT CHECKLIST DTV — DESTINATION THAILAND VISA IDENTITY & TRAVEL Passport — minimum 6 months validity, 2+ blank pages Digital passport photo (white background, recent)  |
| /tools/currency-converter/ | mobile | PASS | 0 | ฿1,000 / ฿1,000 = ฿1,000 · 1 THB ≈ ฿1 |
| /tools/currency-converter/ | desktop | PASS | 0 | ฿1,000 / ฿1,000 = ฿1,000 · 1 THB ≈ ฿1 |
| /tools/bank-checker/ | mobile | PASS | 0 | DTV (Destination Thailand Visa) Bangkok Bank BRANCH-DEPENDENT Some Pattaya branches open with DTV + lease + TM30. South Pattaya and Jomtien Beach Rd branches are friendliest. Bring |
| /tools/bank-checker/ | desktop | PASS | 0 | DTV (Destination Thailand Visa) Bangkok Bank BRANCH-DEPENDENT Some Pattaya branches open with DTV + lease + TM30. South Pattaya and Jomtien Beach Rd branches are friendliest. Bring |
| /tools/reminder/ | mobile | PASS | 0 | Your immigration deadlines TM30 — Address Registration Tuesday, 19 May 2026 Within 24 hours of arrival/move. Your landlord (or you) must file TM30 at Pattaya Immigration (Soi 5) or |
| /tools/reminder/ | desktop | PASS | 0 | Your immigration deadlines TM30 — Address Registration Tuesday, 19 May 2026 Within 24 hours of arrival/move. Your landlord (or you) must file TM30 at Pattaya Immigration (Soi 5) or |

Conversion-path assessment:

- Homepage from Google: strong. A user can identify a path within 30 seconds: quiz, visa hub, contact shortcut, visa playbook, and tool grid all appear high enough. Evidence: C:\pattayavisahelp\index.html:466-568.
- Pillar pages: strong path to Tim and relevant tools. Example DTV contact cards include subject-prefilled email, WhatsApp, and LINE in footer at C:\pattayavisahelp\visas\dtv\index.html:542-553.
- Comparison pages: generally good one-click flow to winner/related visa pages through internal links; no broken internal links found live.
- Mailto: main CTAs are subject-prefilled, e.g. homepage C:\pattayavisahelp\index.html:566 and DTV C:\pattayavisahelp\visas\dtv\index.html:542. Some footer email links are plain mailto without subject, e.g. C:\pattayavisahelp\index.html:475 and C:\pattayavisahelp\visas\dtv\index.html:553.
- WhatsApp links are structurally correct and rel-protected where they open new tabs, e.g. C:\pattayavisahelp\index.html:567 and C:\pattayavisahelp\visas\dtv\index.html:543. I did not complete an authenticated web.whatsapp.com handoff.
- LINE link is present in homepage and many footers, e.g. C:\pattayavisahelp\index.html:568 and C:\pattayavisahelp\visas\dtv\index.html:553. The LTR eligibility tool result CTA only includes WhatsApp/email at C:\pattayavisahelp\tools\eligibility\index.html:461-462.
- Lead form backend is real code, but delivery config cannot be verified from repo. C:\pattayavisahelp\functions\api\lead.js:21 defines onRequestPost, validates submissions, optional Turnstile, and uses Resend if RESEND_API_KEY exists at :162-193. If RESEND_API_KEY is missing, it logs the lead and still continues at :199. That is operationally risky because users could see success while no email is delivered unless KV/webhooks are configured.

## 8. Competitive Analysis

Important limitation: automated localized Google extraction was blocked by Google/captcha for all 15 requested queries. Raw: _research/CODEX_AUDIT_SERP.json (15 blocked/error query runs). I used public web search, live source review, and official/competitor pages as a proxy. The report does not pretend to have a clean Bangkok Google top-10 export.

Competitor classes by query family:

| Query family | Visible competitors/sources | What separates them from PVH |
| --- | --- | --- |
| DTV / digital nomad | Siam Legal, ThaiEmbassy.com, Thai Visa Services, ThaiLawOnline, Terms.Law, official embassy/MFA PDFs, Reddit threads | Older domains, broad Thailand authority, legal/agent backlinks, more citations, discussion/forum freshness |
| LTR | BOI LTR official, Thailand.go.th, Phuket/expat guide sites, legal firms | Official authority for BOI, stronger trust for tax/work permit claims |
| Retirement / Non-O | Official MFA/Immigration PDFs, ThaiEmbassy/Siam Legal, local Pattaya agents, forum threads | Established local offices/GBP, brand trust, offline citations, forum mentions |
| Pattaya visa agent/help | MM-Thai Visa, J&E/Concierge Pattaya, Key Visa, local directories, Reddit recommendations | Physical addresses, GBP/map-pack potential, years in market, reviews |
| Jomtien immigration / 90-day / TM30 | ThaiEmbassy.com, Thai Visa Services, ThailandKnowledge, Reddit/AseanNow-style discussions, official immigration portals | Broader backlinks and forum citations; PVH can compete via local Jomtien specificity |
| Privilege | Thailand Privilege official/GSSA pages, Siam Legal/ThaiElite agents, ThaiLawOnline | Official/GSSA status, direct sales intent, current package brochures |
| Tourist 60 days | Thai eVisa/MFA, Thai Visa Centre, ThaiEmbassy.com, Reddit | Official intent and high-volume tourist forum demand |
| Marriage Pattaya | Local agents and legal firms | Local office/reviews and conversion copy, not necessarily better content |

Top 3 practical competitors:

1. Siam Legal / ThaiEmbassy.com network. This is the biggest broad informational competitor. It has old domain authority, legal credibility, GSSA/agent relationships, huge visa topic coverage, and frequent updates. PVH can beat it only on local Pattaya specificity, sharper decision tools, and independent/no-commission positioning, not raw authority.
2. Official Thai sources: BOI LTR, Thai eVisa/MFA, Immigration Bureau, Thailand Privilege. PVH should not try to outrank them for official/navigational intent. It should cite them, summarize them, and win "which applies to me" and "Pattaya process" queries.
3. Local Pattaya agents: MM-Thai Visa, J&E/Concierge Pattaya, Key Visa, ThaiVisaCare, and long-running informal agent names mentioned in forums. They often have weaker content but stronger local business signals: offices, reviews, citations, phone numbers, and brand memory.

PVH's competitive advantages:

- Existing tools are materially better than most competitor pages.
- Local Jomtien/Pattaya voice is credible and differentiated.
- No-commission positioning is a trust wedge against agent-heavy SERPs.
- Static performance and security are better than many WordPress/legal sites.

PVH's competitive disadvantages:

- Domain is new and appears lightly linked.
- Official-source citations are insufficient relative to the claims.
- No confirmed GBP/review footprint.
- Some schema validator errors reduce eligibility for rich-result confidence.
- Broad terms have entrenched official/legal results and discussion features.

## 9. SERP Feature Opportunities

Because clean Google SERP extraction was blocked, these are proxy-based opportunities from public search and common SERP behavior for these query classes.

| Query | Likely SERP features | PVH target | Realistic modification needed |
| --- | --- | --- | --- |
| Thailand DTV visa | PAA, forums, official/agent explainers, possible AI Overview | /visas/dtv/ | Add official-source citation block, clarify 3-6 month embassy variation, add concise answer boxes for PAA |
| Thailand DTV visa Pattaya | Forums/local pages, fewer strong local guides | /visas/dtv/ + /digital-nomad/ | Add Pattaya-specific application/extension/Jomtien section and link to Visa Finder |
| LTR visa Thailand | Official BOI dominates | /visas/ltr/ | Cite BOI requirements visibly; target comparison snippets, not official navigational intent |
| LTR visa Pattaya | Lower competition local-intent | /visas/ltr/ | Add Pattaya/Jomtien handling note and local consultation CTA |
| retirement visa Pattaya | Local agents/map pack/forums | /visas/retirement-non-o/ | GBP/citations plus a crisp Non-O Pattaya checklist |
| Non-O retirement visa Thailand | Official/legal pages | /visas/retirement-non-o/ | Add Immigration PDF citations and FAQ snippets |
| Thailand visa agent Pattaya | Map pack/local agent sites | /contact/ or /services/ | GBP is required; also clarify independent/non-agent positioning |
| Jomtien immigration office | Map/local guide/forums | /guides/jomtien-immigration-office/ | Add office hours/source citation, map/NAP, service-specific FAQ |
| Thailand 90-day reporting | Official/ThaiEmbassy/forum | /guides/90-day-reporting/ | Add concise filing window answer and official portal links |
| Thailand TM30 reporting | Guide/forum/PAA | /guides/tm30-reporting/ | Add PAA-style landlord/foreigner responsibility answers |
| Pattaya visa help | Branded/local | Homepage/contact | GBP and citations should make this winnable quickly |
| Thailand Privilege visa | Official/GSSA/legal | /visas/privilege-elite/ | Correct Bronze/Gold pricing; cite Thailand Privilege brochures |
| Tourist visa Thailand 60 days | Official/MFA/ThaiVisaCentre/Reddit | /visas/tourist-tr-evisa/ | Add official tourist visa PDF citation and 60+30 answer box |
| Thailand digital nomad visa | DTV pages/forums | /guides/best-visa-digital-nomads/ and /visas/dtv/ | PVH already appears in public web search proxy for a long-tail version; strengthen citations/FAQ |
| marriage visa Thailand Pattaya | Local agent guides | /visas/marriage-non-o/ | Add Jomtien-specific process and official financial-rule citations |

## 10. Local SEO + Google Business Profile Assessment

LocalBusiness schema is strong but incomplete for map-pack dominance.

Evidence:

- Homepage LocalBusiness/ProfessionalService schema includes name, URL, logo, image, telephone, email, postal locality, geo coordinates 12.9236/100.8825, areaServed, opening hours, sameAs, contactPoint, languages, and knowsAbout. Source: C:\pattayavisahelp\index.html:36.
- About page repeats LocalBusiness data but sameAs is thinner and language list differs. Source: C:\pattayavisahelp\about\index.html:32.
- Contact page has LocalBusiness/ProfessionalService schema. Source: C:\pattayavisahelp\contact\index.html:64-112.
- Visible NAP is mostly consistent: Jomtien/Pattaya, info@pattayavisahelp.com, +66 96 728 6999, LINE @timpaemi.

Risks:

- No street address is present. That may be intentional for a one-man service, but map-pack ranking for "visa agent Pattaya" or "visa help Jomtien" is hard without a verified Google Business Profile and physical/service-area consistency.
- I did not find public evidence of a Google Business Profile in the accessible search proxies. If GBP is absent, that is one of the highest-leverage missing local SEO levers.
- The site positions as independent guidance, not a visa agent. That is strategically honest, but it means "visa agent Pattaya" map-pack intent may convert less cleanly unless the page explains the difference.

Realistic map-pack ceiling:

- Without GBP: essentially no map-pack ceiling.
- With a verified service-area GBP, consistent citations, and reviews: realistic for branded and lower-competition "visa help Pattaya" / "visa help Jomtien". Harder for "visa agent Pattaya" against physical offices with years of reviews.

## 11. AI Search Readiness Assessment

What is good:

- llms.txt exists and gives AI crawlers a compact map of authoritative pages. Source: C:\pattayavisahelp\llms.txt:3 and live https://pattayavisahelp.com/llms.txt.
- Pages have readable static HTML and many JSON-LD objects.
- The site's opinionated decision framing is useful for AI citation if the crawler trusts it.

What is weak:

- llms.txt currently contains factual drift: Thailand Privilege 650K-5M without Bronze context at C:\pattayavisahelp\llms.txt:29, and O-X "over-60s" at C:\pattayavisahelp\llms.txt:32.
- AI systems prefer sources with clear official citations and entity trust. Many pillars lack visible official citations.
- Schema validator errors on 72 URLs can reduce machine confidence.
- The site is new and likely lightly linked, which hurts citation probability.

Test limitation: I did not have authenticated Perplexity, ChatGPT browsing, Bing Copilot, or live Google AI Overview access from this environment. Public web search for "best Thailand visa for digital nomad Pattaya" did surface PVH's /guides/best-visa-digital-nomads/ result in the proxy search, which is encouraging, but it is not proof of AI Overview citation.

## 12. Backlink Profile + Outreach Targets

Manual public checks:

- Search for site:pattayavisahelp.com surfaced the homepage and at least one visa page, so the site is discoverable/indexed by public search proxies.
- Search for "pattayavisahelp.com" -site:pattayavisahelp.com did not surface meaningful independent editorial links; it mostly surfaced backlink-tool pages and a new-domain list. Treat the live backlink profile as near-zero until Google Search Console/Ahrefs/Moz proves otherwise.
- No authenticated Ahrefs/Moz/Ubersuggest backlink database was available in this environment.

Backlink gap:

- Siam Legal/ThaiEmbassy-style competitors have years of links, legal citations, press releases, and agent-network mentions.
- Official sources are unbeatable on authority.
- Local Pattaya agents have citations/reviews/directories even when their content is weaker.
- PVH currently has better tools/content than many local competitors, but that advantage is invisible without links/citations.

10 realistic outreach targets:

1. AseanNow visa forum: answer specific DTV/Jomtien/90-day questions with no-spam useful citations.
2. Reddit r/ThailandTourism DTV and 90-day/TM30 threads: provide helpful answers; avoid link dropping unless directly relevant.
3. Reddit r/digitalnomad Thailand visa threads: link the DTV vs LTR/Privilege decision guide when it directly answers the question.
4. Pattaya Mail / Pattaya People local resource pages: pitch the Jomtien immigration guide or visa tools as a public resource.
5. Local Pattaya coworking spaces: offer the Visa Finder or DTV guide as a resource page link for incoming remote workers.
6. Muay Thai gyms and cooking schools serving DTV soft-power applicants: provide a DTV document checklist link they can send students.
7. ExpatDen / Thailand expat blogs: pitch a no-commission Pattaya visa decision tool update.
8. Local condo/property agents serving retirees: provide retirement/Non-O and TM30 guides as tenant resources.
9. International school / expat family groups: provide family/marriage/dependent visa guide links.
10. Pattaya Authority network: add more contextual links from relevant articles, not just footer/sitewide links.

## 13. Indexation Status

- Sitemap lists 182 URLs; local production HTML count is 185.
- Public search proxy confirms at least homepage and /visas/privilege-elite/ indexed/crawled recently. Example: site:pattayavisahelp.com result showed homepage crawled 2 days ago and Privilege page crawled last week.
- Direct Google site: count could not be captured because automated Google requests were blocked. Raw: _research/CODEX_AUDIT_SERP.json.
- Bing/search-proxy coverage is not equivalent to Google Search Console. The only reliable next evidence source is GSC Indexing -> Pages plus sitemap submitted/processed counts.
- Cloudflare Pages delivery appears healthy: HTTPS works, 404s return real 404, and live security headers are present.
- There is a possible stale-index/cache issue around /visas/privilege-elite/: public search snippet showed older Bronze-tier copy that is not fully aligned with current live source. Live source still has the underlying pricing inconsistency, so correcting that page and requesting reindex is important.

## 14. What's Missing

Missing or weak items that matter:

- Google Business Profile/review footprint: not verified publicly. Major local lever if absent.
- Official citations on pillars: biggest E-E-A-T gap. Many pages have zero official citations despite high-stakes visa/tax claims.
- Source-clean llms.txt: present, but factual drift makes it less safe for AI crawlers.
- Pricing/how-we-make-money clarity: About says no agent commissions and mentions possible paid newsletter/PDFs at C:\pattayavisahelp\about\index.html:498-518; Terms says referral fees may exist at C:\pattayavisahelp\terms\index.html:480. This tension should be clarified because trust positioning is central.
- Newsletter signup: absent. Lower priority. It is useful for retention but not a ranking blocker.
- Thai-language version: absent. Lower priority unless Tim wants Thai partners/landlords/local citation value. English/DE/RU are more aligned with foreign-visa demand.
- Video/YouTube footprint: absent. Useful for trust and SERP diversity, but not the first move.
- Embeddable widgets: not present. Evidence-backed only if outreach targets ask for calculators/checklists they can embed; do not build this before citation/GBP/link basics.
- Case studies exist at /case-studies/ and are populated, so this is not missing. Evidence: C:\pattayavisahelp\case-studies\index.html:6-36 and footer/disclaimer at :689.
- Privacy and Terms exist. Terms/privacy are materially present, but the commission/referral-fee language tension should be reconciled.

## 15. Realistic Ranking Forecast

3 months:

- Realistically achievable: branded "Pattaya Visa Help", "pattayavisahelp", some long-tail pages already discovered, "best Thailand visa for digital nomad Pattaya", "DTV visa Pattaya" lower positions, tool-intent searches like "Thailand visa cost calculator" if indexed.
- Possible with GBP/citations: "visa help Pattaya", "Jomtien visa help", "Jomtien immigration office" long-tail variations.
- Not realistic yet: top 3 for "Thailand DTV visa", "LTR visa Thailand", "Thailand Privilege visa".

6 months with source cleanup + local citations + steady outreach:

- Realistic: "Thailand DTV visa Pattaya", "LTR visa Pattaya", "retirement visa Pattaya", "Jomtien immigration office", "90-day reporting Pattaya/Jomtien", "TM30 Pattaya", comparison queries like "DTV vs LTR Thailand" outside the strongest national SERPs.
- Moderate difficulty: "Thailand digital nomad visa" long-tail variants, "Non-O retirement visa Thailand" mid-page rankings, "marriage visa Thailand Pattaya".

12 months with real links/reviews and continued updates:

- Aspirational but possible: page-one for broader informational terms such as "Thailand digital nomad visa", "DTV visa Thailand" variants, "Retirement visa Thailand" variants.
- Still unlikely to dominate: official/navigational terms like "LTR visa Thailand" where BOI/government pages deserve to win, or "Thailand Privilege visa" where official/GSSA pages have direct product authority.

Overall probability judgment:

- Local/Pattaya long-tail: good, if GBP/citations are handled.
- National informational mid-tail: fair, if citations and backlinks improve.
- National head terms: low in 3-6 months; possible page-one in 12 months only with link acquisition and continued freshness.

## 16. Prioritized Action List

1. [impact: high] [effort: hours] Correct factual drift on Privilege pricing, llms.txt O-X age, and DTV seasoning wording - these are trust and AI-citation risks on money/visa pages.
2. [impact: high] [effort: hours-days] Add official-source citation blocks to every visa pillar - many pillars currently have zero official citations, which is weak for visa/YMYL-style content.
3. [impact: high] [effort: hours-days] Fix schema.org validator errors and add JSON-LD to the 5 missing pages - 72 validator-error URLs is the largest machine-readability defect.
4. [impact: high] [effort: hours] Refresh sitemap lastmod values from git/content dates - all 182 entries are stale versus latest commit.
5. [impact: high] [effort: hours] Resolve /professions/digital-nomad/ 404 by redirecting or aligning links/expectations - it is a high-intent vanity URL and was in the audit brief sample.
6. [impact: high] [effort: days] Verify/create Google Business Profile and collect first real reviews/citations - this is the biggest local SEO lever.
7. [impact: high] [effort: days] Fix axe landmark structure and empty table headers - recurring sitewide accessibility issue with contained effort.
8. [impact: medium] [effort: hours] Fix Visa Finder layout shift - it is the only serious mobile Lighthouse failure and a conversion tool.
9. [impact: medium] [effort: hours] Fix external rel noopener noreferrer misses - low effort, removes a security/quality nit.
10. [impact: medium] [effort: hours] Clarify no-commission vs Terms referral-fee language - trust positioning currently has a mismatch.
11. [impact: medium] [effort: hours] Confirm Cloudflare Pages Functions env vars for Resend/KV/webhooks - lead form code is real, but missing envs can silently degrade delivery.
12. [impact: medium] [effort: days] Build 10-20 local citations from Pattaya/Jomtien directories, coworking spaces, gyms, and expat resources - closes the local authority gap.
13. [impact: medium] [effort: days] Add PAA-style concise answer blocks to priority pages - supports snippets/AIO citation without rewriting core content.
14. [impact: low-med] [effort: hours] Normalize reading-time labels - trust polish.
15. [impact: low-med] [effort: days] Promote existing tools as linkable assets - do this before building new widgets or pages.

## 17. What NOT To Do

- Do not mass-generate more visa pages. The site already has breadth; authority and citations are the bottleneck.
- Do not buy spam directory backlinks or exact-match anchor packages. A new visa site with unnatural links is fragile.
- Do not chase top rankings for official-intent queries by trying to out-official the government. Cite official pages and win interpretation/local process searches.
- Do not change the brand palette/theme for SEO. No evidence suggests the dark brand is the ranking blocker; accessibility specifics are the audit lane.
- Do not add new calculators before promoting and stabilizing the existing ones. All 9 tools work; Visa Finder needs layout stability, not replacement.
- Do not hide the independent/non-agent positioning to chase "visa agent" intent. It is the site's differentiation; clarify it instead.
- Do not publish tax claims without official/accountant support. Tax content is high-risk and easy to quote out of context.
- Do not rely on AI search citation until llms.txt and official citations are clean.

## 18. Raw Data Appendix

Raw files written alongside this report:

- _research/CODEX_AUDIT_LOCAL.json - local technical SEO, sitemap, link, schema-type, and content-sample audit.
- _research/CODEX_AUDIT_LIGHTHOUSE.json - Lighthouse 12.8.2 raw JSON summaries for the requested live sample, mobile and desktop.
- _research/CODEX_AUDIT_ACCESSIBILITY.json - Playwright + axe-core results across every sitemap URL in mobile and desktop.
- _research/CODEX_AUDIT_UX_TOOLS.json - 9-tool interaction tests in both viewports.
- _research/CODEX_AUDIT_SCHEMA_VALIDATOR.json - schema.org validator batch results for 182 URLs.
- _research/CODEX_AUDIT_SERP.json - Google localized SERP attempt; all queries blocked/captcha, used as limitation evidence.
- _research/CODEX_AUDIT_CONTENT_OVERLAP.json - simple 10-page competitor/source text-overlap sample.

External sources used for current-rule checks and competitive context:

- Royal Thai Embassy Budapest DTV page: https://budapest.thaiembassy.org/en/publicservice/destination-thailand-visa-dtv?cate=698497c323290a095267d1c3
- BOI LTR official program page: https://ltr.boi.go.th/
- Thailand.go.th O-X requirements: https://thailand.go.th/public/issue-focus-detail/001-01-058
- Thailand Privilege current tier/pricing context: https://www.thailandprivilege.co.th/why-thailand/expat-health-insurance-thailand-guide
- Thailand Privilege Bronze official brochure PDF: https://cms.thailandprivilege.co.th/stocks/download/o0x0/xa/kb/ah5vxakbog8/670910_brochure-BRONZE_1.pdf
- Siam Legal DTV competitor/reference page: https://www.siam-legal.com/thailand-visa/dtv-visa-thailand.php
- ThaiEmbassy digital-nomad competitor/reference page: https://www.thaiembassy.com/thailand-visa/the-best-visas-for-digital-nomads-in-thailand
- Thai Visa Services TM30 competitor/reference page: https://www.thai-visa-services.com/guides/tm30-reporting
- J&E/Concierge Pattaya local competitor examples: https://www.conciergepattaya.com/ and https://www.conciergepattaya.com/thailand-visa-services/thailand-retirement-visa-pattaya/
- MM-Thai Visa local competitor example: https://www.mmthaivisa.com/

Final audit judgment: Tim can step away without the site being technically broken. The site is launch-ready. It is not yet ranking-ready for the hardest national visa SERPs because authority, citations, GBP/local proof, and backlinks lag behind the quality of the build. The highest-return work is not another design/content pass; it is trust hardening and local authority.

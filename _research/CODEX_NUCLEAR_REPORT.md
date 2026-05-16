# CODEX NUCLEAR REPORT

Generated: 2026-05-16T00:45:00Z  
Site: pattayavisahelp.com  
Repo: `C:\pattayavisahelp`  
Branch: `main`

## 1. Lighthouse Scorecard

Baseline and final Lighthouse were run against the local static server at `http://127.0.0.1:8090` on the requested sample set: homepage, DTV, LTR, Retirement Non-O, Visa Finder, Cost Calculator, Eligibility, and Contact.

| Page | Viewport | Baseline P/A/BP/SEO | Final P/A/BP/SEO |
| --- | --- | ---: | ---: |
| `/` | mobile | 71 / 94 / 100 / 100 | 81 / 100 / 100 / 100 |
| `/` | desktop | 93 / 94 / 100 / 100 | 96 / 100 / 100 / 100 |
| `/visas/dtv/` | mobile | 69 / 95 / 100 / 100 | 79 / 100 / 100 / 100 |
| `/visas/dtv/` | desktop | 97 / 93 / 100 / 100 | 99 / 100 / 100 / 100 |
| `/visas/ltr/` | mobile | 72 / 95 / 100 / 100 | 82 / 100 / 100 / 100 |
| `/visas/ltr/` | desktop | 96 / 93 / 100 / 100 | 99 / 100 / 100 / 100 |
| `/visas/retirement-non-o/` | mobile | 76 / 95 / 100 / 100 | 86 / 100 / 100 / 100 |
| `/visas/retirement-non-o/` | desktop | 97 / 86 / 100 / 100 | 99 / 100 / 100 / 100 |
| `/tools/visa-finder/` | mobile | n/a / 95 / 96 / 100 | n/a / 100 / 96 / 100 |
| `/tools/visa-finder/` | desktop | n/a / 92 / 100 / 100 | n/a / 100 / 100 / 100 |
| `/tools/cost-calculator/` | mobile | 78 / 95 / 96 / 100 | 89 / 100 / 96 / 100 |
| `/tools/cost-calculator/` | desktop | 97 / 93 / 100 / 100 | 100 / 100 / 100 / 100 |
| `/tools/eligibility/` | mobile | 88 / 90 / 96 / 100 | 88 / 100 / 96 / 100 |
| `/tools/eligibility/` | desktop | 98 / 86 / 100 / 100 | 99 / 100 / 100 / 100 |
| `/contact/` | mobile | 78 / 94 / 96 / 100 | 86 / 100 / 96 / 100 |
| `/contact/` | desktop | 97 / 94 / 100 / 100 | 100 / 100 / 100 / 100 |

Notes:
- Accessibility reached 100 on every sampled page.
- SEO stayed at 100 on every sampled page.
- Desktop performance reached 96-100 on every sampled page with a numeric score.
- Mobile performance improved but did not reach 95 on the sampled content pages. The remaining Lighthouse pressure is mostly Google Analytics unused JavaScript and page weight. GA is now delayed, but Lighthouse still waits long enough to see the Google bundle.
- Lighthouse returned no numeric performance score for `/tools/visa-finder/` in both baseline and final runs, so only A/BP/SEO are comparable there.

## 2. Findings Count

Initial nuclear sweep:
- URLs scanned from sitemap: 182
- Runtime page loads: 364
- Findings: 428
- Categories: 390 axe/accessibility findings, 38 link-depth findings

Final nuclear sweep:
- URLs scanned from sitemap: 182
- Runtime page loads: 364
- Findings: 0
- Categories: none

The final sweep file is `C:\pattayavisahelp\_research\CODEX_NUCLEAR_FINDINGS_FINAL.json`.

## 3. Fixes Shipped

Commit group: `[Codex nuclear]: optimize performance accessibility and authority signals`

### Performance
- Removed the `googletagmanager.com` preconnect from production HTML pages to reduce the preconnect count.
- Converted blocking Google Fonts stylesheet loads to a preload plus `media="print"` swap pattern with a `noscript` fallback.
- Replaced the eager GA loader on 184 pages with a delayed loader that starts on first user interaction or idle timeout.
- Kept the GA measurement ID `G-RSNN24M25C` unchanged.

### Accessibility
- Applied a sitewide contrast patch using existing palette variables, primarily moving low-contrast secondary text from `--td` to `--tl`.
- Fixed Lighthouse/axe contrast failures for nav CTA text, mobile nav text, footer links, metadata text, breadcrumbs, labels, table wrappers, and small supporting text.
- Added keyboard focusability to scrollable tables where axe required it.
- Verified the final axe sweep reports zero findings across 364 viewport loads.

### Best Practices / Security
- Updated `_headers` so Cloudflare Web Analytics can load:
  - `script-src` now allows `https://static.cloudflareinsights.com`
  - `connect-src` now allows `https://cloudflareinsights.com`
- Added `Cross-Origin-Opener-Policy: same-origin`.
- Expanded `Permissions-Policy` denials for unused sensitive APIs and privacy surfaces.

### Schema / Authority Signals
- Added richer homepage `LocalBusiness` / `ProfessionalService` data with Pattaya/Jomtien/Chonburi/Thailand area coverage, geo coordinates, WhatsApp, LINE, and email contact points.
- Added homepage `Person` schema for Tim Paemi with `worksFor` and `knowsAbout` visa topics.
- Added contact-page `LocalBusiness` / `ProfessionalService` schema and contact points.
- Re-validated all JSON-LD blocks after changes; zero parse errors.

### Internal Linking / Authority
- Expanded homepage footer hub links so more hubs are reachable within three clicks.
- Added the two orphan blog articles to the blog index:
  - `/blog/tdac-step-by-step/`
  - `/blog/30-day-visa-exempt-rollback/`
- Final graph sweep reports zero link-depth findings.

## 4. Authority Ideas Implemented

- Strengthened local authority schema around Pattaya, Jomtien, Chonburi, and Thailand without changing visible copy.
- Strengthened Tim/owner E-E-A-T signals with structured `Person` data.
- Improved crawl paths to supporting hubs and orphan blog posts.
- Kept `llms.txt` in place and verified it already lists key visa pillars, tools, hubs, and authoritative sources.

## 5. Authority Ideas Not Implemented

- Homepage decision tree: not shipped because the existing `/tools/visa-finder/` is working and adding a second quiz surface would create product/design risk.
- Visa price tracker: not shipped because it touches legal/pricing content and needs Tim/Claude editorial control.
- Case-study homepage expansion: not shipped because real photos/outcomes were not available in the repo.
- Sitewide external citation rewrites: not shipped because this is a content/editorial pass, not a technical optimization pass.
- Full CSP nonce/hash migration: not shipped because the site uses many inline scripts by design; removing `'unsafe-inline'` safely needs a planned refactor.
- Trusted Types: not implemented because it is too invasive for this static vanilla site without a build step.

## 6. Open Recommendations For Tim / Claude

1. Disable Cloudflare Email Address Obfuscation in the Cloudflare dashboard. The `email-decode.min.js` render-blocking script is injected by Cloudflare, not by repo code.
2. Verify GA in Google Analytics DebugView after deployment. The delayed loader preserves `gtag` calls, but only Tim can confirm account-side receipt.
3. Decide whether GA should become interaction-only. That may improve Lighthouse by hiding the unused Google bundle from the audit window, but it will reduce passive analytics coverage.
4. For true mobile Lighthouse 95+ on every page, the next structural move is to extract repeated inline CSS/JS into cacheable assets. That is a bigger architecture/design-system decision.
5. Add Tim's real LinkedIn/X/profile URLs to the `sameAs` array if he wants stronger public Person identity signals.
6. Submit the sitemap again in Google Search Console and Bing Webmaster Tools after this deploy.

## 7. Verification Log

- Baseline Lighthouse: `C:\pattayavisahelp\_research\CODEX_NUCLEAR_BASELINE.json`
- Final Lighthouse: `C:\pattayavisahelp\_research\CODEX_NUCLEAR_LIGHTHOUSE_FINAL.json`
- Initial sweep: `C:\pattayavisahelp\_research\CODEX_NUCLEAR_FINDINGS.json`
- Final sweep: `C:\pattayavisahelp\_research\CODEX_NUCLEAR_FINDINGS_FINAL.json`
- Tool interaction suite: 18 / 18 passed across desktop and mobile.
- Sitewide page runtime suite: 364 / 364 passed with zero page failures.
- JSON-LD parse sweep: zero parse errors.
- HTML close-tag sweep: zero truncated HTML files.
- `git diff --check`: clean.

## END OF REPORT

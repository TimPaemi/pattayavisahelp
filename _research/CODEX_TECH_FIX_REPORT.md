# CODEX TECH FIX REPORT
Generated: 2026-05-15

## Summary
- Production HTML files scanned: 184
- Tracked files modified before this report: 185
- New repo config added: `.gitattributes`
- Validation status: passed

## Count By Category
- HTML hygiene: normalized LF endings sitewide, stripped NUL bytes from `.gitignore`, repaired 9 truncated/invalid HTML endings, repaired `sitemap/index.html`, added the missing homepage skip target, and added `.gitattributes`.
- Performance/Core Web Vitals: added GA preconnect hints to 184 pages, added missing Google Fonts preconnect hints on 2 lightweight pages, and moved 3 large head JSON-LD blocks out of `<head>`.
- SEO technical meta: synced 36 OG/Twitter meta sets, added or synced robots meta on 17 pages, fixed 1 canonical, and corrected 1 double-encoded meta description.
- Schema.org: completed/normalized 36 JSON-LD blocks, including Article required fields, WebApplication offers/OS/category fields, and `https://schema.org` context.
- Internal/external links: added `noreferrer` to 871 true external `target="_blank"` links; internal link and fragment sweep now passes.
- Accessibility code-level: fixed heading hierarchy issues across tools/visa pages, added a valid skip target, ensured decorative homepage SVG is hidden, and verified zero missing image alt/width/height attributes.
- CSS quality: added 2 missing CSS variables and verified zero unresolved `var(--*)` references.
- Security headers/GA: verified `_headers` CSP/HSTS/referrer/permissions requirements and one GA source snippet per indexed page.

## Top 10 Impactful Fixes
1. Repaired 8 visa pillar pages with truncated footer HTML before `</footer>`.
2. Repaired the truncated footer in `tools/index.html`.
3. Rebuilt `sitemap/index.html` into valid HTML with body content and metadata.
4. Added `noreferrer` to 871 external blank-target links.
5. Normalized line endings to LF and added `.gitattributes` to keep them stable.
6. Added GA preconnect hints sitewide for faster analytics connection setup.
7. Completed/normalized Article and WebApplication JSON-LD fields.
8. Synced mismatched OG/Twitter metadata to page titles/descriptions.
9. Fixed heading hierarchy skips, including generated visa finder result markup.
10. Added the missing homepage `#main` target for the skip-to-content link.

## Verification Performed
- `git diff --check`: passed.
- JSON-LD parse sweep across 184 HTML files: passed.
- Required meta sweep: title, description, canonical, robots, OG, Twitter: passed.
- HTML close-tag sweep with scripts/styles ignored: 0 issues.
- Internal-link and fragment sweep: 0 broken links/fragments.
- Image attribute sweep: 0 missing `alt`, `width`, or `height`.
- Duplicate ID sweep: 0 duplicate IDs.
- CSS variable sweep: 0 missing variables.
- Head script loading sweep: 0 blocking `<script src>` tags in `<head>`.
- GA integrity sweep: one async GA source snippet per indexed page, redirect pages excluded.
- `_headers` CSP/security sweep: required GA, Resend, image, style, font, HSTS, referrer, nosniff, and permissions entries present.

## Not Safely Fixed
1. `functions/api/lead.js` and `functions/api/subscribe.js` still contain `console.log`/`console.error`. I did not touch them because `/functions/` was explicitly out of scope unless a clear syntax error exists. Tim/Claude should decide whether production function logging should stay for operational debugging or be replaced with a structured logger/no-op pattern.
2. `_research/CODEX_TECHNICAL_FIX_PROMPT.md` existed as an untracked research prompt and was not staged for commit.

## Notes For Claude
- No design-system changes were made.
- No page copy rewrites were made beyond completing already-truncated footer/disclaimer HTML.
- Tool JavaScript logic was not rewritten. The only tool script content change was a tag-level heading fix in the visa finder generated result markup (`h4` to `h3`) to remove an accessibility heading skip.

# CODEX BRIEF — TRUST HARDENING + AUDIT-CLEAN PASS

**Repo:** `pattayavisahelp.com` (Cloudflare Pages · static HTML/CSS/vanilla JS · no build step)
**Branch:** `main` — commit directly with `[Codex trust-hardening]:` prefix · push to `origin/main`
**Date:** 2026-05-18
**Source of findings:** `_research/CODEX_FULL_AUDIT_REPORT.md` (the audit you just wrote)

---

## CONTEXT

You just audited the full site and produced a 485-line report. Tim and Claude reviewed it. Out of the 15 prioritized action items, the following are the **mechanical fixes** you can ship cleanly in one focused pass — items 1, 2, 3, 4, 5, 7, 8, 9, 10 from your prioritized list. The other items (Google Business Profile, backlink outreach, content depth, content marketing) are out of scope here — Tim handles those separately.

Mode: fix-and-ship, not audit. Commit each logical group separately with the `[Codex trust-hardening]:` prefix. Push to origin/main when done. Write a short follow-up report.

---

## WHAT TO FIX (exact items from your audit, with the file:line citations you already produced)

### 1. Factual drift on three high-stakes claims

**1a. DTV seasoning wording is over-stated as "non-negotiable 6 months."**

Royal Thai Embassy Budapest specifies a 6-month bank statement; other embassies enforce 3 months. The site should reflect this variation honestly.

Files to update:
- `visas/dtv/index.html:58` (FAQPage JSON-LD answer about seasoning)
- `visas/dtv/index.html:410` (callout copy in the "common trap" callout)
- `visas/dtv/index.html:444` (the ฿500,000 seasoning section bullet list)
- `visas/dtv/index.html:473` (Step 02 in application steps)
- `visas/dtv/index.html:512` (the "5 mistakes we see weekly" item about crypto/seasoning)

Change pattern: replace any "at least 3-6 months (embassies vary — assume 6 to be safe)" with the equally-honest "embassies vary: Vientiane and Penang have accepted 3-month statements; Budapest and a few European embassies want 6. Plan for 6 months if you can — that's the upper bound."

For the FAQPage JSON-LD answer at line 58, update the text accordingly so structured data matches visible content.

**Cite a primary source** in the DTV page where the seasoning is discussed (visible link). Suggested: link to https://budapest.thaiembassy.org/en/publicservice/destination-thailand-visa-dtv as a footnote/inline citation.

**1b. Thailand Privilege pricing is internally inconsistent.**

`visas/privilege-elite/index.html` says "Gold from THB 650K" at line 347 and again at line 356, but later correctly says Gold is THB 900K at line 459. The official Thailand Privilege brochures confirm: **Bronze THB 650K · Gold THB 900K · Platinum THB 1.5M · Diamond THB 2.5M · Reserve THB 5M**.

Source: https://www.thailandprivilege.co.th/why-thailand/expat-health-insurance-thailand-guide
Bronze brochure: https://cms.thailandprivilege.co.th/stocks/download/o0x0/xa/kb/ah5vxakbog8/670910_brochure-BRONZE_1.pdf

Fix lines 347 and 356 to reflect correct tier pricing. Also check whether the stat-grid value (currently might say "฿650K FROM (GOLD)") is correctly labeled — it should say "FROM (BRONZE)" if the number is 650K, OR "FROM (GOLD)" with the number updated to 900K. Pick whichever matches the page's narrative about tier-entry pricing.

Add a citation link to the Thailand Privilege Bronze official brochure inline near the pricing table.

**1c. `llms.txt` says O-X is for "over-60s" — wrong, it's age 50+.**

Files:
- `llms.txt:32` — change "over-60s" to "50+ retirees" (the pillar at `visas/retirement-o-x/index.html:7,419,479` already says 50+ correctly)

Source: https://thailand.go.th/public/issue-focus-detail/001-01-058 confirms age 50+.

### 2. Schema validator cleanup (72 URLs with errors)

You ran the schema validator (`_research/CODEX_AUDIT_SCHEMA_VALIDATOR.json`). The recurring pattern is a minimal WebPage + SpeakableSpecification block that doesn't validate clean.

Example flagged page: `compare/dtv-vs-ltr/index.html:29`.

Fix the recurring pattern across the 72 URLs. Most likely fix: either complete the WebPage schema to validator-pass shape (add required fields like `name`, `url`, `inLanguage`), or remove the malformed minimal block and rely on the page's other JSON-LD blocks (Article, BreadcrumbList, FAQPage) which already pass.

Your call which approach. Use your judgment based on what's actually in those blocks. Verify zero validator errors after the fix.

### 3. Five pages missing JSON-LD entirely

Add appropriate schema to:

- `best-visa/index.html` — ItemList of budget-tier landing pages (mirror what `/visas/` hub has)
- `guides/index.html` — ItemList of guides (mirror `/visas/` hub pattern)
- `pattaya/index.html` — CollectionPage + Place (Pattaya) with sub-locations as part of geo coverage
- `changelog/index.html` — ItemList of changelog entries, or a single CreativeWork with `dateModified`
- `sitemap/index.html` — CollectionPage with no special schema beyond BreadcrumbList; this is fine, just add the basic schema so it doesn't read as "schema-less"

Match the existing pattern in your codebase. Validate after.

### 4. Refresh all 182 sitemap `lastmod` values from git commit dates

Current state: all 182 URLs have `lastmod: 2026-05-10` (stale).
Latest commit touching content: `b09598a` at `2026-05-16T01:25:44Z`.

Programmatic approach: for each URL in sitemap.xml, run `git log -1 --format=%cI -- <corresponding file path>` and use that ISO date as the new `lastmod`. This gives accurate per-file modification dates rather than a uniform stamp.

Also: refresh `sitemap_index.xml` (if exists) lastmod values the same way.

### 5. Resolve `/professions/digital-nomad/` 404

The audit found `/professions/digital-nomad/` is a 404 (no Lighthouse score available). The actual page is at `/digital-nomad/` and `/guides/best-visa-digital-nomads/`.

Pick one:
- Option A: Create `/professions/digital-nomad/index.html` as a redirect page (meta refresh + canonical to `/digital-nomad/`).
- Option B: Sweep the repo for any internal link pointing to `/professions/digital-nomad/` and rewrite to `/digital-nomad/`. Then leave the 404 alone (no one will hit it).

Pick whichever leaves fewer breakages. Same approach for any other vanity-URL deadlinks you find while in there.

### 6. Fix Visa Finder mobile layout shift (CLS 0.35, LCP 2.5s)

Audit identified `/tools/visa-finder/` mobile Performance score of 77 with CLS 0.35 as the only serious performance failure. It's a conversion-critical tool.

Diagnose the layout shift source. Most likely:
- Quiz step transitions cause height changes (results card appearing pushes content)
- Result card has variable height — reserve min-height
- Animation/transition without `transform` (uses height/margin, which is layout-shifting)
- Missing `width`/`height` on an image or icon used in the result

Fix without changing the tool's behavior or styling. CSS-level fix preferred.

### 7. Fix axe accessibility landmark structure (388 violations from 2 rules)

Recurring patterns:
- `landmark-one-main` on homepage + 12 visa pillars (26 viewport-pages) — currently uses `<header class="hero" id="main">` with skip target on header instead of a proper `<main>` landmark
- `region` on 362 viewport-pages — content outside landmark regions (marquee/header/footer)

Fix:
- Wrap the article body content in `<main>` (or move the `id="main"` skip target to a proper main element)
- Use proper landmark roles: `<header>` for top nav, `<main>` for article content, `<aside>` for sidebars, `<footer>` for footer
- Marquee can be wrapped in a `<div role="marquee" aria-label="Site updates">` or just left outside the landmark structure since it's decorative

Verify with axe-core after.

### 8. Fix empty table headers (4 viewport-pages)

Examples:
- `compare/pattaya-vs-hua-hin/index.html:475`
- `guides/pattaya-vs-phuket-vs-chiang-mai-retirement/index.html:473`

Add visible header text or `aria-label` to the empty `<th>` cells.

### 9. Add `rel="noopener noreferrer"` to 13 external links missing it

Examples from audit:
- `tools/bank-checker/index.html:330`
- `tools/eligibility/index.html:355`
- `guides/glossary/index.html:567`
- `blog/tdac-step-by-step/index.html:577`

Sweep the rest with grep and fix all instances.

### 10. Reconcile "no-commission" vs "referral fees" language

Tension flagged in audit:
- `about/index.html:498-518` — "no agent commissions" claim + mentions of paid newsletter/PDFs
- `terms/index.html:480` — "referral fees may exist" language

Tim's position: **no commissions, ever, from agents.** He may make money from paid content (newsletter, PDFs, courses) but never agent referrals. The Terms language is legacy/template boilerplate that doesn't reflect reality and creates a trust mismatch.

Fix: Update `terms/index.html:480` (and surrounding sentence if needed) to clearly state "Pattaya Visa Help does not accept referral fees, commissions, or kickbacks from visa agents or law firms. Tim may earn money from paid educational content (newsletter, guides, training) which is always clearly labeled." Match the About-page positioning exactly.

---

## HARD CONSTRAINTS

1. **Brand palette is sacred:** `--bg:#000`, `--pink:#ec4899`, `--cyan:#06b6d4`, `--yel:#fbbf24`, `--pur:#a855f7`, `--grn:#10b981`, `--wa:#25d366`. Do not touch.
2. **Fonts sacred:** Space Grotesk, JetBrains Mono, Inter. Do not swap.
3. **Contact channels sacred:** `info@pattayavisahelp.com`, the prefilled `api.whatsapp.com/send/?phone=66967286999...` URL, `https://line.me/ti/p/~timpaemi`. Do not modify.
4. **Footer credit sacred:** "// Site built & managed by Pattaya Authority · Tim Paemi ★"
5. **No new pages.** No new features. No new tools. No design rewrites. No content rewrites beyond the 3 factual drift fixes specified in section 1 and the Terms reconciliation in section 10.
6. **Tool JS sacred:** don't rewrite the Visa Finder logic — only CSS/layout fix for the CLS issue.
7. **GA tag sacred:** `G-RSNN24M25C`. Don't change.

---

## WORKFLOW

1. Read `_research/CODEX_FULL_AUDIT_REPORT.md` (your prior audit) for full context on each finding.
2. Read the raw artifacts in `_research/` (you already wrote them) for evidence:
   - `CODEX_AUDIT_LOCAL.json` — link/schema/title audit
   - `CODEX_AUDIT_SCHEMA_VALIDATOR.json` — 72 validator errors with details
   - `CODEX_AUDIT_LIGHTHOUSE.json` — Visa Finder CLS source clues
   - `CODEX_AUDIT_ACCESSIBILITY.json` — axe landmark/region details
3. Group fixes logically. Suggested commits:
   - `[Codex trust-hardening]: factual drift on DTV/Privilege/O-X + add primary citations`
   - `[Codex trust-hardening]: schema validator cleanup (72 URLs) + JSON-LD on 5 missing pages`
   - `[Codex trust-hardening]: sitemap lastmod refresh from per-file git history`
   - `[Codex trust-hardening]: a11y landmark + empty-table-header sweep`
   - `[Codex trust-hardening]: Visa Finder mobile CLS fix + 13 external link rel fix + /professions/digital-nomad/ 404 + commission/Terms reconciliation`
4. After each commit, re-run the relevant audit to confirm the fix. Don't commit a "fix" that doesn't fix.
5. Push to `origin/main`.

---

## VERIFICATION

After everything is committed and pushed:

- Re-run schema validator on the 72 previously-failing URLs → expect 0 errors
- Re-run axe-core on the previously-affected pages → expect 0 region/landmark-one-main/empty-table-header violations
- Re-run Lighthouse on `/tools/visa-finder/` mobile → expect Performance ≥ 85, CLS < 0.1
- Verify `/professions/digital-nomad/` no longer returns 404 (or no internal links point to it)
- Verify all 4 DTV seasoning lines + 2 Privilege pricing lines + 1 llms.txt line are factually corrected and consistent
- `git diff --check` clean
- Re-run the tool interaction tests (Playwright) on Visa Finder → expect PASS

---

## DELIVERABLE

Write a short report at `_research/CODEX_TRUST_HARDENING_REPORT.md` summarizing:

1. What was fixed (grouped by commit)
2. Before/after numbers (schema errors: 72 → 0, axe violations: 392 → expected count, Visa Finder CLS: 0.35 → new value)
3. Files modified count
4. Anything you couldn't fix in this scope with reason
5. Push confirmation (`origin/main` SHA + timestamp)

---

## TIMING

This is a focused mechanical pass. Should take a few hours of automated work. No iteration cycles — single pass, audit, ship.

If you find a fix isn't safe or breaks something else, flag it in the report and skip rather than push something broken.

Go.

# Research Index

This folder holds all raw research and content drops from Perplexity, Codex, and other AI tools. Files here are the source of truth for building site pages.

**Workflow:** Tim pastes content → saved as a numbered markdown file → tracked in this index → assembled into site pages later.

---

## Status legend

- 🟢 = saved & reviewed
- 🟡 = saved, not yet reviewed
- 🔴 = missing
- ✅ = built into site

---

## Visa pillar pages

| # | Visa type | Slug | Research file | Page status |
|---|---|---|---|---|
| 01 | Destination Thailand Visa (DTV) | `dtv` | 🟡 [`01-dtv.md`](./01-dtv.md) | 🔴 not built |
| 02 | Retirement O-A | `retirement-o-a` | 🟡 [`02-retirement-o-a.md`](./02-retirement-o-a.md) | 🔴 |
| 03 | Retirement O-X (10-year) | `retirement-o-x` | 🔴 | 🔴 |
| 04 | Retirement Non-O (1-year) | `retirement-non-o` | 🔴 | 🔴 |
| 05 | Long-Term Resident (LTR) | `ltr` | 🔴 | 🔴 |
| 06 | Thailand Privilege (Elite) | `privilege-elite` | 🟡 [`03-privilege-elite.md`](./03-privilege-elite.md) | 🔴 |
| 07 | Marriage Non-O | `marriage-non-o` | 🟡 [`04-marriage-non-o.md`](./04-marriage-non-o.md) | 🔴 |
| 08 | Education ED | `education-ed` | 🟡 [`05-education-ed.md`](./05-education-ed.md) | 🔴 |
| 09 | Business Non-B + Work Permit | `business-non-b` | 🟡 [`06-business-non-b.md`](./06-business-non-b.md) | 🔴 |
| 10 | SMART Visa | `smart` | 🔴 | 🔴 |
| 11 | Tourist (TR / SETV / METV) + Visa Exempt | `tourist-tr-evisa` | 🔴 | 🔴 |
| 12 | Media Non-M | `media-non-m` | 🔴 | 🔴 |

## Cross-cutting guides

| # | Topic | Slug | Research file | Page status |
|---|---|---|---|---|
| G1 | 90-day reporting | `90-day-reporting` | 🔴 | 🔴 |
| G2 | TM30 reporting | `tm30-reporting` | 🔴 | 🔴 |
| G3 | Re-entry permits | `re-entry-permits` | 🔴 | 🔴 |
| G4 | Visa runs vs extensions | `visa-runs-vs-extensions` | 🔴 | 🔴 |
| G5 | Jomtien Immigration Office | `jomtien-immigration-office` | 🔴 | 🔴 |
| G6 | Thai bank account as foreigner | `thai-bank-account-as-foreigner` | 🔴 | 🔴 |
| G7 | Health insurance for visas | `health-insurance-for-thai-visas` | 🔴 | 🔴 |
| G8 | Master document checklist | `document-checklist-master` | 🔴 | 🔴 |

## Comparison pages

| # | Comparison | Slug | Status |
|---|---|---|---|
| C1 | DTV vs Elite | `dtv-vs-elite` | 🔴 |
| C2 | Elite vs LTR | `elite-vs-ltr` | 🔴 |
| C3 | Retirement O-A vs Non-O | `retirement-o-a-vs-non-o` | 🔴 |
| C4 | Master visa comparison matrix | `visa-comparison-matrix` | 🔴 |

## Pattaya local pages

| # | Topic | Slug | Status |
|---|---|---|---|
| P1 | Living in Pattaya | `living-in-pattaya` | 🔴 |
| P2 | Jomtien Immigration practical guide | `jomtien-immigration` | 🔴 |
| P3 | Cost of living Pattaya | `cost-of-living-pattaya` | 🔴 |
| P4 | Neighborhoods guide | `neighborhoods-guide` | 🔴 |

---

## Phase 2 status: ✅ COMPLETE (6/6 pillar pages researched)

All six highest-priority visa pages have research saved and are ready for build. Next phase options:

1. **Build pages** — feed each research file into Codex/Claude to generate `/visas/[slug]/index.html`
2. **More research** — Phase 3 visas (LTR, SMART, Tourist, Media), then guides (90-day reporting, TM30, re-entry permits, etc.)
3. **Cross-cutting guides first** — every visa page references 90-day reporting, TM30, re-entry permits, health insurance. Building these as `/guides/` pages first means visa pages can link to them with confidence.

## Notes

- Research drops are saved with the next available number (01.md, 02.md...) regardless of topic, then linked in the table above by topic.
- If a research drop covers multiple visas, it gets one file but is referenced from multiple rows above.
- When a page is built and live, mark its row ✅ in the "Page status" column.

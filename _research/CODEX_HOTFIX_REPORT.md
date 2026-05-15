# CODEX HOTFIX REPORT
Generated: 2026-05-15

## Summary
- Tools tested: 9
- Tool viewport runs: 18
- Sitemap URLs tested: 182
- Page viewport runs: 364
- Issues found: 3 fix groups
- Issues fixed: 3 fix groups
- Final Playwright status: 0 tool failures, 0 page failures

## Per-Tool Result Matrix
| Tool | Desktop 1440x900 | Mobile 390x844 |
|---|---|---|
| Visa Finder | PASS — result card rendered after 6 answers | PASS — result card rendered after 6 answers |
| Cost Calculator | PASS — result block rendered with THB total | PASS — result block rendered with THB total |
| LTR Eligibility | PASS — all 4 category cards rendered | PASS — all 4 category cards rendered |
| Expiry Countdown | PASS — countdown/timeline rendered | PASS — countdown/timeline rendered |
| Income Test | PASS — recommendation results rendered | PASS — recommendation results rendered |
| Document Checklist | PASS — checklist rendered for DTV | PASS — checklist rendered for DTV |
| Currency Converter | PASS — reactive conversion and swap worked | PASS — reactive conversion and swap worked |
| Bank Checker | PASS — bank guidance rendered | PASS — bank guidance rendered |
| Reminder | PASS — deadlines and ICS download rendered | PASS — deadlines and ICS download rendered |

## Top Fixes
1. `tools/cost-calculator/index.html` — fixed a runtime `TypeError` caused by replacing the result subtitle with spans that no longer had the `years-out` and `visa-name` IDs, then immediately trying to update those IDs. The calculator now renders results on desktop and mobile.
2. `sitemap/index.html` — added the existing mobile bottom-nav style and script so the sitemap page behaves like the rest of the site on mobile.
3. `tools/bank-checker/index.html`, `tools/eligibility/index.html`, `tools/reminder/index.html` — replaced generated bare `wa.me` CTA links with the approved prefilled WhatsApp API URL.

## Anything Not Changed
1. `tools/currency-converter/index.html` is reactive and has a swap button, not a dedicated “Convert” button. It works, so I did not add a new UI control.
2. `tools/reminder/index.html` asks for arrival date and name, not email. It generates the ICS download correctly, so I did not add a new field.
3. `_research/CODEX_TOOLS_DISASTER_FIX.md` existed as an untracked prompt file and was not staged.

## Verification Log
- Playwright setup: Chromium installed in `%TEMP%\codex-audit-pvh`.
- Local server: `http://127.0.0.1:8080`.
- First Playwright run: 18 tool runs, 2 tool failures, 364 page runs, 1 page failure.
- First-run failures:
  - Cost Calculator desktop/mobile: `TypeError: Cannot set properties of null (setting 'textContent')`.
  - `/sitemap/` mobile: mobile bottom nav missing or hidden.
- Final Playwright run after fixes: 18 tool runs, 0 tool failures, 364 page runs, 0 page failures.
- Static WhatsApp sweep after fixes: no remaining `wa.me` links in production HTML.
- `git diff --check`: passed.

# Claude Review Prompt

You are reviewing Codex work in `C:\pattayavisahelp`.

Codex made audit fixes directly in the working tree, but Tim is worried they may be risky. Do not assume the changes should be kept. Review them first and decide what is worth keeping.

Read these files first:

- `C:\pattayavisahelp\_research\HANDOFF_TO_CLAUDE.md`
- `C:\pattayavisahelp\_research\CODEX_AUDIT_REPORT.md`

Then inspect the actual proposed changes with:

```powershell
cd C:\pattayavisahelp
git status
git diff --stat
git diff
```

Your task:

1. Decide which Codex changes are safe and worth keeping.
2. Identify any dangerous or unnecessary changes.
3. Tell Tim exactly what to keep, revert, or rework.
4. Do not rewrite the site.
5. Do not touch tool JavaScript unless you prove a tool is broken.
6. Do not commit or push.

Main known unresolved items:

- `C:\pattayavisahelp\contact\index.html` has two `#leadForm` links but no matching `id="leadForm"` target.
- `C:\pattayavisahelp\glossary\index.html` has a truncated Soft Power description ending `DTV-`.
- `tools/visa-finder/index.html` has a static audit warning for `resetQuiz`, but Codex believes it is dynamically injected and should not be edited unless browser testing proves failure.

Give Tim a simple decision list: KEEP / REVERT / NEEDS MANUAL REVIEW.

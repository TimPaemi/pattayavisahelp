# Pattaya Visa Help

Trusted Thailand visa guidance from Pattaya. Lead-generation site that connects visitors with vetted local visa specialists across all major visa categories (Retirement, DTV, Elite, Marriage, Education, Business / Work Permit).

## Stack

- Plain HTML + Tailwind CSS (CDN for now)
- Hosted on Cloudflare Pages
- Source on GitHub, auto-deploys on push to `main`

## Local development

This is a static site — no build step. Just open `index.html` in your browser, or use any local server:

```bash
npx serve .
# or
python -m http.server 8000
```

## Deployment

Pushing to `main` triggers an automatic Cloudflare Pages deploy.

## Structure

```
/
├── index.html        # Homepage
├── visas/            # Per-visa-type landing pages (to be added)
├── articles/         # Long-form SEO content (to be added)
├── assets/           # Images, icons
└── README.md
```

## Goals

1. Maximum SEO coverage on every Thailand visa keyword
2. Convert traffic to consultation requests (leads)
3. Route qualified leads to vetted expert partners

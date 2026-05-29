# Pattaya Visa Help

Trusted Thailand visa guidance from Pattaya. Lead-generation site that connects visitors with vetted local visa specialists across all major visa categories (Retirement, DTV, Elite, Marriage, Education, Business / Work Permit).

**Live:** https://pattayavisahelp.com  
**Repo:** https://github.com/TimPaemi/pattayavisahelp  
**Hosting:** Cloudflare Pages (auto-deploy on push to `main`)

## Stack

- Plain HTML + Tailwind CSS (CDN)
- Vanilla JavaScript (tools, nav, forms)
- Cloudflare Pages Functions (`functions/api/`) for lead/subscribe endpoints
- No build step — files in repo are what gets deployed

## Local development

```bash
npx serve .
# or
python -m http.server 8000
```

Open http://localhost:3000 (or :8000) and browse `/visas/dtv/`, `/tools/visa-finder/`, etc.

## Deployment

Push to `main` → GitHub → Cloudflare Pages builds and deploys automatically (~1–2 min).

Custom domain and SSL are managed in Cloudflare. HTML cache TTL is 5 minutes (`_headers`).

## Structure

```
/
├── index.html              # Homepage
├── visas/                  # 12 visa pillar pages
├── guides/                 # Long-form how-to guides
├── compare/                # Visa comparison pages
├── tools/                  # Visa finder, calculators, checklists
├── glossary/               # Immigration term definitions
├── professions/            # Visa advice by profession
├── pattaya/                # Pattaya-specific + origin-country guides
├── blog/                   # News and policy updates
├── functions/api/          # Cloudflare Pages Functions (lead, subscribe)
├── _headers                # Security headers + CSP
├── _redirects              # Legacy URL 301 rules
├── sitemap.xml             # Monolithic sitemap (182 URLs)
├── sitemap_index.xml       # Split sitemap index for crawlers
└── robots.txt
```

## Goals

1. Maximum SEO coverage on every Thailand visa keyword
2. Convert traffic to consultation requests (leads)
3. Route qualified leads to vetted expert partners

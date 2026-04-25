# PATTAYAVISAHELP.COM — MASTER BRIEF

**Use this brief as the source of truth when prompting Perplexity, Codex, GPT, Claude, or any AI tool to work on this project.**
**Always paste the relevant section, not the whole document. Keep this file updated as the project evolves.**

---

## 0. How to use this document

| Tool | Feed it these sections |
|---|---|
| **Perplexity Premium** (research / current data) | §1, §2, §11 (Research Mission) — one visa type per query |
| **Codex / GPT / Claude** (code generation) | §1, §2, §6, §7, §8, §9, §10, §12 (Build Mission) |
| **Image generators** (Firefly, Midjourney) | §7 (Visual direction) |
| **Copywriting AI** | §1, §2, §4, §5 |

Always include §1 + §2 in any prompt, regardless of tool — it's the project DNA.

---

## 1. PROJECT AT A GLANCE

**Site:** pattayavisahelp.com
**Tagline (working):** *Your Thailand visa, handled the right way.*
**Location:** Pattaya, Chonburi, Thailand
**Live URL:** https://pattayavisahelp.com (custom domain), https://pattayavisahelp.pages.dev (Cloudflare Pages)
**Repo:** https://github.com/TimPaemi/pattayavisahelp

**Mission:**
The most comprehensive, trustworthy, easy-to-read English-language resource on Thailand visas — written from Pattaya, for the people who actually live and arrive there. Every visa category covered in depth with current 2026 rules, fees, and processing times.

**Business model:**
1. Generate massive organic traffic via SEO content (every Thailand visa keyword and long-tail question).
2. Convert traffic into leads via clear consultation CTAs and forms.
3. Route qualified leads to a private network of vetted Pattaya-based specialists (lawyers, agents, accountants, school owners, BOI consultants, real estate, hospitals for medical letters, etc.).
4. The site is the *front door*; the expert network is the *engine room*. We control distribution, they deliver service.

**This is not a law firm.** The site is information + matching. We never give legal advice ourselves. All legal/financial work is handed to vetted partners. This must be reflected in every page's tone and disclaimers.

---

## 2. TARGET AUDIENCE

Five primary personas. Every page should feel like it's written *for one of them*, not "for everyone".

| Persona | Age | Visa fit | Pain point | What they search |
|---|---|---|---|---|
| **Mark — the retiree** | 60+ | O-A, O-X, O | Banking 800k THB, health insurance, year-after-year extension | "thailand retirement visa requirements", "800,000 baht deposit rule" |
| **Sarah — the digital nomad** | 28–40 | DTV | Income proof, can I work remotely, tax | "DTV visa thailand 2026", "destination thailand visa requirements" |
| **David — the long-stayer** | 35–55 | Privilege (Elite), LTR | Which tier, ROI, vs DTV vs Elite vs LTR | "thailand elite vs LTR", "thailand privilege visa cost 2026" |
| **John — married to a Thai** | 30–60 | Non-O Marriage | Document checklist, 400k baht rule, wife's paperwork | "thailand marriage visa documents", "400000 baht marriage visa" |
| **Anna — the language student** | 20–40 | ED | Approved schools, attendance rules, can I run a business | "education visa thailand pattaya", "ED visa muay thai" |

Plus secondary: Business/Non-B applicants, BOI talent (SMART visa), media (Non-M), retirees considering switching from Elite to O-A, expats facing 90-day reporting / TM30 confusion.

**Tone of voice:** plainspoken, confident, honest. Treats the reader like an adult. No legalese. No fearmongering. Acknowledges uncertainty when rules genuinely are ambiguous (and they often are). British / international English, not American.

---

## 3. SITE ARCHITECTURE (SITEMAP)

```
/
├── index.html                              # Homepage
├── visas/
│   ├── retirement-o-a/                     # Non-O-A
│   ├── retirement-o-x/                     # Non-O-X (10-year)
│   ├── retirement-non-o/                   # Non-O (1-year, sub-50)
│   ├── dtv/                                # Destination Thailand Visa
│   ├── ltr/                                # Long-Term Resident
│   ├── privilege-elite/                    # Thailand Privilege Visa
│   ├── marriage-non-o/                     # Marriage to Thai
│   ├── education-ed/                       # Education
│   ├── business-non-b/                     # Business + Work Permit
│   ├── smart/                              # SMART Visa (talent)
│   ├── tourist-tr-evisa/                   # Tourist + visa exempt
│   └── media-non-m/                        # Media
├── guides/
│   ├── 90-day-reporting/
│   ├── tm30-reporting/
│   ├── re-entry-permits/
│   ├── visa-runs-vs-extensions/
│   ├── jomtien-immigration-office/         # Pattaya-specific gold
│   ├── thai-bank-account-as-foreigner/
│   ├── health-insurance-for-thai-visas/
│   └── document-checklist-master/
├── compare/
│   ├── dtv-vs-elite/
│   ├── elite-vs-ltr/
│   ├── retirement-o-a-vs-non-o/
│   └── visa-comparison-matrix/             # Big interactive table
├── pattaya/
│   ├── living-in-pattaya/
│   ├── jomtien-immigration/
│   ├── cost-of-living-pattaya/
│   └── neighborhoods-guide/
├── about/
├── contact/
├── privacy/
└── terms/
```

**Routing convention:** every page is `/folder/index.html` (clean URLs, no `.html` in browser bar). Cloudflare Pages handles this natively.

---

## 4. CONTENT SCOPE — every Thailand visa

For **each** visa type, we publish a long-form pillar page (3,000–5,000 words) with this exact structure:

1. **Hero** — visa name, who it's for in one line, key numbers (cost / duration / processing time)
2. **Quick verdict** — "Is this visa right for you?" (3–4 bullet checklist)
3. **Eligibility** — exact requirements
4. **Required documents** — full checklist with source links
5. **Financial requirements** — deposit / income with current 2026 figures in THB and USD
6. **Application process** — step by step, where to apply (consulate vs in-Thailand), realistic timeline
7. **Fees** — application fee, extension fee, agent service fee (rough range), other costs
8. **Duration & extensions** — how long, how to extend, can it be converted
9. **90-day reporting** — does it apply, how it works
10. **Re-entry permits** — required? cost?
11. **Common pitfalls** — what trips people up (e.g. seasoning the 800k for 2 months, insurance loopholes for O-A)
12. **Pattaya-specific notes** — Jomtien Immigration quirks, agent options
13. **FAQ** — 8–15 real questions (use Perplexity to mine "People Also Ask" + Reddit r/Thailand)
14. **Compare to** — links to similar visas (DTV vs Elite vs LTR etc.)
15. **CTA** — "Get matched with a specialist" form

Plus **how-to articles** under `/guides/` for cross-cutting topics (90-day reporting, TM30, etc.)
Plus **comparison pages** under `/compare/` (massive SEO value)
Plus **Pattaya-local pages** under `/pattaya/` (local intent traffic = warm leads)

---

## 5. SEO & SCHEMA

**Primary keyword targets** (cluster heads):
- thailand retirement visa
- thailand DTV visa
- thailand elite visa / thailand privilege visa
- thailand marriage visa
- thailand education visa
- thailand business visa
- 90 day reporting thailand
- tm30 thailand
- thailand visa agent pattaya
- jomtien immigration office

**Long-tail to dominate** (10+ per visa type — Perplexity job):
- "how much money do I need for thailand retirement visa 2026"
- "can I work on a DTV visa"
- "thailand elite visa cost 2026"
- "do I need health insurance for thailand retirement visa"
- "best visa for digital nomads thailand"

**On-page SEO requirements** (every page):
- Unique `<title>` ≤60 chars with primary keyword + brand
- Unique meta description ≤160 chars with CTA
- One H1, hierarchical H2/H3
- Internal linking (every page links to ≥3 related pages)
- Open Graph + Twitter Card
- Canonical URL
- `<link rel="alternate" hreflang="en">` (we'll add Thai/German/Russian later)
- Schema.org JSON-LD: `Article`, `FAQPage` (where FAQ exists), `BreadcrumbList`, `LocalBusiness` (homepage + contact)
- Sitemap.xml + robots.txt at root
- Image alt text on every image
- Lazy-load images (`loading="lazy"`)
- Page speed: <1.5s LCP target; minify HTML; compress images to WebP

**Technical SEO:**
- HTTPS (Cloudflare auto)
- 301 redirects from www to apex (or vice-versa, choose one)
- Mobile-first (responsive obvious)
- Clean URLs (no `.html` in path)
- No 404s, no orphan pages

---

## 6. LEAD CAPTURE & CONVERSION

**Three lead capture types** (offer all three):

1. **Quick consultation form** (top of every page in sticky sidebar or banner)
   - Fields: Name, Email, WhatsApp/Telegram (optional), Visa type interest, Message
   - Subject: "Free 15-min consultation"
   - Goal: capture maximum top-of-funnel volume

2. **Visa-specific lead magnet** (per page)
   - On retirement page: *"Download the Pattaya Retirement Visa Checklist (PDF)"* → email gate
   - On DTV page: *"Free DTV income-proof template"* → email gate
   - Goal: warmer leads who self-segment

3. **WhatsApp Click-to-chat** (floating button bottom-right)
   - Link: `https://wa.me/66XXXXXXXXX?text=Hi%20I%20need%20help%20with...`
   - Goal: instant-gratification audience (massive in Thailand)

**Form backend:** Cloudflare Pages Functions (free) → email to `leads@pattayavisahelp.com` + log to a Google Sheet via webhook for now. Later: a proper CRM (HubSpot free tier or Notion).

**Lead routing logic** (manual at first, automated later):
- Visa type → matched specialist in network
- Budget signals → premium tier (Elite/LTR) vs standard
- Urgency (e.g. "visa expires in 7 days") → priority queue

---

## 7. VISUAL DESIGN DIRECTION — modern 2026

**Reference brands** (study how these look on desktop AND mobile):
- linear.app — typography, dark sections
- stripe.com — generous whitespace, bento layouts, gradient meshes
- vercel.com — bold display type, tight UI
- attio.com — modern SaaS marketing
- anthropic.com — calm, premium, editorial
- arc.net — playful but clean

**Design tokens:**

```
COLORS
--brand-50:  #f0f9ff
--brand-100: #e0f2fe
--brand-500: #0ea5e9    (sky blue — Thailand sky / sea)
--brand-600: #0284c7
--brand-700: #0369a1    (deep ocean)
--brand-900: #0c4a6e
--accent:    #f59e0b    (warm amber — Thai gold accent, used sparingly for highlights)
--ink:       #0f172a    (near-black)
--paper:     #ffffff
--muted:     #64748b

TYPOGRAPHY
- Display: "Plus Jakarta Sans" 700–800 (headings)
- Body:    "Inter" 400/500/600 (everything else)
- Optional accent: "Instrument Serif" italic for pull quotes only

SPACING
- 4px base unit (Tailwind default)
- Section padding: py-20 (mobile py-16)
- Max content width: max-w-6xl (1152px)
- Reading width for prose: max-w-prose (~65ch)

BORDERS / RADII
- Cards: rounded-2xl
- Buttons: rounded-lg
- Inputs: rounded-lg
- Avatar/icon containers: rounded-xl

SHADOWS
- Default cards: shadow-sm + border-slate-200
- Hover lift: shadow-lg + border-brand-500 transition
- Hero CTA: shadow-md, no over-design

MOTION
- Transitions: 200–300ms ease-out
- Scroll reveals: subtle fade-up with intersection observer (not Framer-Motion-level fancy)
- Hover: 1–2px lift, color shift, never bouncy
```

**Layout patterns to use:**
- Sticky semi-transparent nav with `backdrop-blur` (already in starter)
- Hero with eyebrow tag → big headline → subhead → dual CTA → trust microcopy
- Bento grid for "Every visa explained" (asymmetric tiles, not boring 3×2)
- Compare tables (large, sticky-header, sortable later)
- Testimonial cards with real photos (we'll source these — must be real)
- Stat blocks ("2,000+ cases", animated count-up on scroll)
- Pull quotes from articles in editorial style
- "Last updated: 25 April 2026" badge on every visa page (huge trust signal in this niche)
- Sticky "On this page" TOC on long-form pages (desktop right side)
- Floating WhatsApp button bottom-right
- Footer with full sitemap, not just 3 links

**Avoid (these scream "AI-generated 2023"):**
- Generic stock photos of "businesspeople pointing at laptops"
- Emoji-heavy headers
- Boring 3-card service rows
- Hero images that are just a gradient with text on top
- "Lorem ipsum" anywhere — write real copy or use placeholder labels like `[copy: retirement hero subhead]`

---

## 8. TECHNICAL CONSTRAINTS

- **Stack:** Plain HTML + Tailwind CSS (CDN script for now, can switch to compiled later)
- **No frameworks** (no React, Vue, Astro, Next)
- **No build step required** — every file should work when opened directly
- **Vanilla JS only** — small islands of interactivity (mobile menu, FAQ accordion, smooth scroll, count-up animations)
- **Hosting:** Cloudflare Pages, auto-deploy on push to `main`
- **No backend**, except Cloudflare Pages Functions for form submission (and we'll add that later)
- **No CMS** — every page is hand-written or AI-generated HTML committed to the repo
- **Images:** WebP preferred, lazy-loaded, hosted in `/assets/img/`
- **Icons:** inline SVG (no icon font, no extra requests). Use Lucide or Heroicons SVGs copy-pasted.
- **Fonts:** Google Fonts via `<link>` tag with preconnect (already in starter)
- **Browser support:** modern evergreen (Chrome, Edge, Firefox, Safari last 2 versions). No IE.

---

## 9. LEGAL & COMPLIANCE

- **Disclaimer on every visa page footer:** "This information is provided for general guidance only. Visa rules change frequently. Always verify with the Royal Thai Embassy / Consulate or Thai Immigration before acting. We are an information and matching service, not a law firm."
- **Privacy policy** — required because we collect leads. GDPR-compliant baseline (we get EU/UK visitors).
- **Terms of service** — disclaim liability for visa outcomes.
- **Cookie banner** — only required if we add analytics that drop tracking cookies. Cloudflare Web Analytics is cookieless, so we can skip the banner if we use that.
- **Sources policy** — when claiming a fact (fees, requirements, processing times), link to the official source: thaiembassy.com, immigration.go.th, mfa.go.th, royal thai embassy of [country].

---

## 10. DEVELOPER STYLE GUIDE

- Every HTML file is fully self-contained, no shared partials yet (we'll factor out a header/footer with a tiny build script when we hit 20+ pages)
- Indent: 2 spaces
- Comments: `<!-- ============== SECTION NAME ============== -->` between major sections
- Class order in HTML: layout → spacing → typography → color → state (Tailwind's recommended order)
- Use semantic HTML5: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`
- Every interactive element has a focus-visible state (accessibility)
- ARIA labels on icon-only buttons

---

## 11. RESEARCH MISSION (for Perplexity / GPT-research / Claude with web)

**One query per visa type. Always include this preamble:**

> You are researching Thailand visa rules as of April 2026 for a Pattaya-based information site. Cite official Thai government sources (immigration.go.th, mfa.go.th, royal Thai embassy sites) and reputable expat resources (ASEAN Now, Thaiger, Bangkok Post). Where rules genuinely differ between consulates, note the variation. Output in clean Markdown with the exact section headings I specify.

**Then per visa, ask for these sections** (copy-paste this template, swap `[VISA TYPE]`):

```
Research the [VISA TYPE] for Thailand as of 2026.

Output sections (use these exact H2 headings):

## Who it's for
## Eligibility (full list)
## Required documents (numbered checklist with source links)
## Financial requirements (THB and USD, current 2026 figures)
## Application process — step by step
## Where to apply (consulate vs in-Thailand)
## Realistic processing time (best/typical/worst case)
## Fees (official fees + typical agent service fee range in THB)
## Duration & extensions
## 90-day reporting applicability
## Re-entry permit need + cost
## Common pitfalls (5+ specific ones, real examples)
## Pattaya-specific considerations (Jomtien Immigration office quirks, local agents)
## FAQ (12 real questions from Reddit r/Thailand, ThaiVisa forum, Quora — paraphrase, don't copy)
## What changed in 2025–2026 (recent rule changes)
## Sources (links to official government pages)

Be precise on numbers. If a number is ambiguous or recently changed, say so explicitly. No fluff.
```

**Run that for each visa:**
- Non-O-A Retirement Visa
- Non-O-X Retirement Visa (10-year)
- Non-O Retirement Visa (1-year, sub-50 / based on age)
- Destination Thailand Visa (DTV)
- Long-Term Resident Visa (LTR) — all 4 categories
- Thailand Privilege (Elite) Visa — all current tiers and 2026 pricing
- Non-O Marriage Visa
- Education Visa (ED)
- Non-B Business Visa + Work Permit
- SMART Visa — all 5 categories (T, I, E, S, O)
- Tourist Visa (TR / SETV / METV) + Visa Exemption
- Non-M Media Visa

**Cross-cutting research queries:**
- 90-day reporting: rules, online TM47, penalty for missing, who's exempt
- TM30 reporting: who reports (landlord vs tenant), penalty enforcement 2026
- Re-entry permits: single vs multiple, cost, where to get
- Border runs vs visa extensions: which is currently viable in 2026
- Jomtien Immigration Office (Pattaya): address, hours, queue strategies, what to bring
- Thai bank account as a foreigner: which banks accept which visas in 2026 (Bangkok Bank, Krungsri, Kasikorn, SCB)
- Health insurance for visas: minimum coverage required, approved providers, vs self-insurance options

---

## 12. BUILD MISSION (for Codex / GPT-4 / Claude code)

**System prompt to use:**

> You are a senior front-end developer building pages for pattayavisahelp.com — a static site (plain HTML + Tailwind CSS via CDN, no framework, no build step) hosted on Cloudflare Pages. Follow the Master Brief exactly. Output complete, valid, production-ready HTML files. No placeholders. No "lorem ipsum". Every page must include: full SEO meta, JSON-LD schema, Open Graph, semantic HTML5, accessible markup, Tailwind utility classes consistent with the existing design tokens, and the standard header/footer matching index.html.

**Per-page build prompt template:**

```
Build a full-length pillar page for [VISA TYPE] at /visas/[slug]/index.html.

Use the research output below as the source of truth for facts. Match the visual style of the homepage exactly (study index.html in the repo). The page must have:

1. Full <head> with unique title, meta description, canonical, Open Graph, Twitter Card
2. JSON-LD: Article + FAQPage + BreadcrumbList
3. Standard sticky nav (copy from index.html)
4. Hero section with eyebrow tag, H1, subhead, key facts row (cost / duration / processing), dual CTA
5. Sticky "On this page" TOC on the right at lg+ breakpoint
6. All 15 sections from §4 of the Master Brief (Quick verdict → CTA)
7. FAQ section with accordion (vanilla JS, no library)
8. "Compare to" cards linking to 3 similar visas
9. Lead capture form (matches homepage style) with hidden field `visa_interest = [slug]`
10. Standard footer (copy from index.html)

Length: 3,000–5,000 words of real content. No filler. Every claim sourced or marked [verify].

Research input:
[paste Perplexity output here]
```

**Component prompts** (when you need just one piece):

- *"Build the visa comparison matrix table — 12 columns (Visa name, Min age, Duration, Cost, Bank deposit required, Income required, Health insurance, Work allowed, Convertible, Best for), sortable client-side with vanilla JS, sticky header row, mobile-friendly horizontal scroll."*
- *"Build the FAQ accordion component — vanilla JS, ARIA-compliant (aria-expanded, aria-controls), smooth height transitions, only one open at a time."*
- *"Build the floating WhatsApp button — fixed bottom-right, hides when scrolled past footer, pulse animation on first load only."*
- *"Build the lead form with Cloudflare Pages Functions handler — POST to /api/lead, validate, send email via Resend, return JSON."*

---

## 13. DELIVERABLE PHASES

**Phase 1 — Foundation (DONE)**
- Repo + Cloudflare Pages + custom domain ✓
- Homepage scaffold ✓
- Master Brief ✓

**Phase 2 — Pillar pages (next)**
- Build 6 highest-traffic visa pages first: Retirement O-A, DTV, Privilege/Elite, Marriage, Education, Business
- Add `/about/`, `/contact/`, `/privacy/`, `/terms/`
- Add sitemap.xml, robots.txt, 404.html

**Phase 3 — Lead capture**
- Cloudflare Pages Function for form POST
- Email integration (Resend or Mailchannels)
- WhatsApp Business setup + click-to-chat
- Lead-magnet PDFs (per visa)

**Phase 4 — Long-tail content**
- Remaining visa types
- All `/guides/` cross-cutting articles
- All `/compare/` comparison pages
- All `/pattaya/` local pages

**Phase 5 — SEO push**
- Submit sitemap to Google Search Console + Bing
- Backlink outreach (expat forums, ASEAN Now, Reddit, Pattaya Facebook groups)
- Schema audit
- Core Web Vitals optimisation

**Phase 6 — Conversion optimisation**
- A/B test CTA copy
- Heatmap (Cloudflare Web Analytics → Microsoft Clarity later)
- Add testimonials (real, with consent)
- Trust badges (chambers of commerce, professional licenses if specialists are licensed)

---

## 14. QUALITY BAR / ACCEPTANCE CRITERIA

A page ships only when **all** of these are true:

- [ ] Loads in <1.5s on 4G mobile
- [ ] Mobile and desktop both perfect (no horizontal scroll, no overlapping)
- [ ] All links work, no 404s
- [ ] No console errors
- [ ] Passes Lighthouse: Performance >90, SEO 100, Accessibility >95
- [ ] Every claim is sourced or marked `[verify]`
- [ ] Reads like a real person wrote it (not "As an AI...")
- [ ] No "lorem ipsum", no placeholder text
- [ ] FAQ has at least 8 real-world questions
- [ ] CTA appears at least 3 times on the page
- [ ] Last-updated date is current
- [ ] Internal links to ≥3 related pages
- [ ] Schema validates on schema.org validator
- [ ] OG image renders correctly when shared on WhatsApp / Facebook / LinkedIn

---

## 15. AGENT NETWORK (private, never show on site)

This section is internal only — never published. Used to know who gets which lead.

| Visa type | Lead routes to | Backup |
|---|---|---|
| Retirement O-A / O-X / Non-O | [TBD — partner #1] | [TBD] |
| DTV | [TBD] | [TBD] |
| Privilege / Elite | Cloudflare Pages Function emails to specific Elite agent | — |
| LTR | [TBD] | [TBD] |
| Marriage | [TBD] | [TBD] |
| Education | [TBD — language school partner] | [TBD] |
| Business / Work Permit | [TBD — accounting + legal partner] | [TBD] |
| SMART | [TBD] | [TBD] |
| Tourist extension | [TBD — Pattaya agent] | [TBD] |

Tim to fill in once partners confirmed. Lead distribution rules to follow.

---

## 16. CHANGELOG (this file)

- 2026-04-25 — Initial brief written. Phase 1 complete (repo, domain, scaffold).

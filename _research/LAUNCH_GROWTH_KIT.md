# Pattaya Visa Help — Launch & Growth Kit

The website itself is finished and technically excellent. What's left is **getting it found**.
This file is everything you need for that — copy-paste-and-go. None of it touches code.
Work top to bottom; items 1–3 are the priorities.

Prepared 22 May 2026.

---

## 0. Confirm the deploy is live (5 minutes — do this first)

1. Cloudflare dashboard → **Workers & Pages** → `pattayavisahelp` → **Deployments**.
2. Confirm the newest deployment shows **Success** and matches your latest commit.
3. Open `https://pattayavisahelp.com`, scroll to the footer — it should read **v2026.05.22**.
4. Open `https://pattayavisahelp.com/contact/` — you should see the clean direct-contact page.
5. Open `https://pattayavisahelp.com/glossary/royal-decree-743/` — it should show real content.

If the footer still shows an older version, the deploy didn't run — in Cloudflare, hit
**Retry deployment** or **Create deployment** on the latest commit.

---

## 1. Google Search Console (~20 min — HIGHEST PRIORITY)

This is what puts you in Google. Without it, indexing takes months instead of days.

1. Go to **search.google.com/search-console**.
2. **Add property** → choose **Domain** → enter `pattayavisahelp.com`.
3. Google gives you a **TXT verification record**. Your DNS is on Cloudflare, so:
   - Cloudflare dashboard → `pattayavisahelp.com` → **DNS** → **Add record**.
   - Type: `TXT`, Name: `@`, Content: paste the value Google gave you. Save.
   - Back in Search Console → **Verify** (may take a few minutes for DNS to propagate).
4. Once verified: left menu → **Sitemaps** → enter `sitemap.xml` → **Submit**.
5. Use **URL Inspection** (top search bar) on these 6 pages and click **Request indexing** for each:
   - `https://pattayavisahelp.com/`
   - `https://pattayavisahelp.com/visas/`
   - `https://pattayavisahelp.com/visas/dtv/`
   - `https://pattayavisahelp.com/visas/ltr/`
   - `https://pattayavisahelp.com/visas/retirement-non-o/`
   - `https://pattayavisahelp.com/tools/visa-finder/`

Check back in a week — "Pages" will show how many are indexed.

---

## 2. Bing Webmaster Tools (~10 min)

Bing's index also feeds **ChatGPT Search and Microsoft Copilot** — so this is your
AI-discoverability step as well as Bing SEO.

1. Go to **bing.com/webmasters** and sign in.
2. Choose **Import from Google Search Console** — one click, pulls the verified site across.
   (Or add `pattayavisahelp.com` manually and verify with the CNAME/XML option.)
3. Submit the sitemap: `https://pattayavisahelp.com/sitemap.xml`.

Your site already ships an IndexNow key file, so once Bing is connected it picks up
new and changed pages quickly with no extra work.

---

## 3. Google Business Profile (~30 min — your single biggest LOCAL lever)

You have a real Pattaya presence. A Business Profile puts you in **Google Maps** and the
local pack for searches like "visa help Pattaya". For a local authority brand this is
arguably worth more than anything on the website. It's free.

1. Go to **google.com/business** → **Manage now** → add your business.
2. Use the details below.

**Business name:** Pattaya Visa Help
**Primary category:** Immigration & Naturalization Service
**Additional category:** Consultant
**Service area:** Pattaya, Jomtien, Chonburi, Thailand
**Address:** your Jomtien address — or, if you don't want it public, set it up as a
**service-area business** (Google lets you hide the address and just show the area).
**Phone:** +66 96 728 6999
**Website:** https://pattayavisahelp.com
**Hours:** Monday–Saturday 09:00–18:00 · Sunday closed

**Description** (paste this — it's within Google's 750-character limit):

> Pattaya Visa Help is an independent Thailand visa guidance service based in Jomtien,
> Pattaya. We map all 12 long-stay and short-stay visa pathways — DTV, LTR, Thailand
> Privilege, Retirement (Non-O, O-A, O-X), Marriage, Education, Business, SMART and more —
> with real costs, honest timelines and no agent commissions.
>
> Message us by WhatsApp, email or LINE and a real person replies within 24 hours with the
> right visa for your situation, the document list, and the realistic cost. We don't file
> visas and we don't take commissions — just straight answers, and if you want it, a match
> to a vetted Pattaya specialist.
>
> Free visa-finder and cost-calculator tools, 12 in-depth visa guides and a full Thai visa
> glossary at pattayavisahelp.com.

**Services to add** (Google lets you list these): DTV guidance · LTR visa guidance ·
Retirement visa guidance · Marriage visa guidance · Education visa guidance ·
Visa comparison & matching · 90-day reporting help · TM30 help

**First three Business Profile posts** (post one per week to keep the profile active):

- Post 1 — *"New to the DTV?"* The Destination Thailand Visa gives 5 years and 180 days
  per entry for remote workers and Muay Thai / cooking students. See the full breakdown
  and real costs: pattayavisahelp.com/visas/dtv/

- Post 2 — *"Thinking about retiring in Pattaya?"* We map every retirement route — Non-O,
  O-A and the 10-year O-X — with the real bank-deposit and insurance requirements:
  pattayavisahelp.com/visas/retirement-non-o/

- Post 3 — *"Not sure which visa fits?"* Take our free 5-question Visa Finder and get a
  ranked match in under two minutes: pattayavisahelp.com/tools/visa-finder/

**Verification:** Google verifies by video call, phone or postcard. Have proof of the
business ready (a utility bill, rental contract, or similar).

---

## 4. Wire the network for real (~15 min — free authority you fully control)

The website links **out** to your sister sites. Search engines and AI pass authority when
those sites link **back**. You control all of them, so this is free link equity.

On each site you control, add this to the footer (most already have a "network" area):

```html
<a href="https://pattayavisahelp.com" target="_blank" rel="noopener">Pattaya Visa Help</a>
```

Add it on: `timpaemi.com`, `pattaya-authority.com`, `pattaya-restaurant-guide.com`,
`pattaya-gym.com`, `pattayastream.com`, `pattaya-coffee.com`, `pattaya-school-guide.com`.

Use the anchor text **"Pattaya Visa Help"** or **"Thailand visa guidance"** — keep it
natural, don't stuff keywords. One link per site, in the footer, is exactly right.

---

## 5. Get a few real external links (ongoing — this is what actually ranks a new site)

A new site climbs on backlinks. You don't need many — a handful of genuine local links
moves the needle hard. Four ready-to-use plays:

**A. ASEAN NOW forum** (the big Thailand expat forum, formerly Thaivisa)
Create an account. Find genuine visa questions in the Visas & Migration section and
answer them properly — link a relevant guide only where it truly helps the person.
Add `pattayavisahelp.com` to your forum profile. Be helpful, never spammy.

**B. Pattaya / Thailand expat Facebook groups**
Where group rules allow a resource share, post something like:

> Built a free, independent Thailand visa resource focused on Pattaya — all 12 visa
> types mapped with real costs and no agent commissions, plus free tools (a visa finder
> and a cost calculator) and a full glossary. Not selling anything, just straight info:
> pattayavisahelp.com — happy to answer visa questions in the comments too.

**C. Free directory and listing sites**
Submit the business to Thailand and Pattaya expat directories and local business
listings. Also: once your Google Business Profile is live, that itself is a strong
local citation.

**D. Cross-promotion within your network**
On your other Pattaya sites, where it's genuinely relevant (a "moving to Pattaya"
article on the restaurant or gym site, for example), link to the relevant visa guide.
Contextual links inside content are worth more than footer links.

---

## 6. Turn on analytics (5 min)

Cloudflare dashboard → `pattayavisahelp.com` → **Analytics & Logs** → **Web Analytics**
→ **Enable**. It's free, privacy-friendly, and needs no code because your site is already
proxied through Cloudflare. You can't improve what you can't measure.

---

## 7. Keep it alive (monthly — 1–2 hours)

- [ ] Publish 1–2 short blog posts on current Thai visa news (the blog and changelog
      sections are built for this — fresh content gives Google a reason to re-crawl).
- [ ] Check Google Search Console for crawl errors and see which search queries are
      bringing people in — then write content around the ones that are working.
- [ ] Post one Google Business Profile update.
- [ ] **Quarterly:** re-check visa fees, tax rules and processing times against the
      official sources. This is YMYL content — accuracy is the whole brand.

---

## What I (Claude) can do for any of the above

I can't create your accounts or click the buttons, but I can prepare anything else:
draft the blog posts, write more outreach messages, expand the directory list, draft
Business Profile updates, or wire any code changes on the site. Just ask.

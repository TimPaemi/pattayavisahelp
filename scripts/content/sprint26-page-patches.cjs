/** Sprint 26 — hub intro patches. */
module.exports = {
  '/pattaya/': [
    [
      /Pattaya: countries \+ neighborhoods\s*\n\s*Country pages7[^\n]+\n\s*From your country to Thailand\s*\n\s*<h2>Country to Thailand — visa pathways<\/h2>/,
      `<p><strong>Hub stats:</strong> 7 country guides · 6 neighborhoods · On-ground coverage · Last refresh Apr 2026</p>

<p><strong>Quick orientation:</strong> Pick your origin country for entry-specific rules, then a neighborhood for where you'll actually live. Visa logistics follow from both.</p>

<h2>Country to Thailand — visa pathways</h2>`,
    ],
    [
      /\n\s*Where to live in Pattaya\s*\n\s*(<h2>Pattaya neighborhoods)/,
      '\n\n$1',
    ],
    [
      /\n\s*Practical Pattaya\s*\n\s*(<h2>Living in Pattaya)/,
      '\n\n$1',
    ],
    [
      /\n\s*Free 15-min consultation\s*\n\s*<h2>Not sure which page applies to you\?<\/h2>\s*\n\s*<p>Tell us your situation in one short message\. A real human in Pattaya replies within 24 hours\.<\/p>\s*\n\s*\n\s*<a href="\/contact\/">Book free consult →<\/a>\s*\n\s*<a href="https:\/\/api\.whatsapp\.com[^"]+"[^>]*>WhatsApp \+66 96 728 6999<\/a>/,
      `\n\n<p><strong>Free 15-min consultation</strong></p>
<h2>Not sure which page applies to you?</h2>
<p>Tell us your situation in one short message. A real human in Pattaya replies within 24 hours.</p>
<p><a href="/contact/">Book free consult →</a> · <a href="https://api.whatsapp.com/send/?phone=66967286999&amp;text=Hi%20from%20pattayavisahelp.com%20%E2%80%94%20I%20have%20a%20question%20about%20Thai%20visas" target="_blank" rel="noopener noreferrer">WhatsApp +66 96 728 6999</a></p>`,
    ],
  ],

  '/guides/': [
    [
      /In-depth Thailand guides\s*\n\s*Guides38[^\n]+\n\s*Pillars \+ transitions\s*\n\s*<h2>/,
      `<p><strong>Hub stats:</strong> 38 guides · 7 categories · Last refresh May 2026 · Avg. depth ~3,000 words</p>

<p><strong>Start here:</strong> Visa transitions if you're switching status, compliance if you're already long-stay, money/property for infrastructure setup.</p>

<p><strong>Pillars + transitions</strong></p>

<h2>`,
    ],
    [
      /\n\s*Free 15-min consultation\s*\n\s*<h2>Not sure which page applies to you\?<\/h2>\s*\n\s*<p>Tell us your situation in one short message\. A real human in Pattaya replies within 24 hours\.<\/p>\s*\n\s*\n\s*<a href="\/contact\/">Book free consult →<\/a>\s*\n\s*<a href="https:\/\/api\.whatsapp\.com[^"]+"[^>]*>WhatsApp \+66 96 728 6999<\/a>/,
      `\n\n<p><strong>Free 15-min consultation</strong></p>
<h2>Not sure which page applies to you?</h2>
<p>Tell us your situation in one short message. A real human in Pattaya replies within 24 hours.</p>
<p><a href="/contact/">Book free consult →</a> · <a href="https://api.whatsapp.com/send/?phone=66967286999&amp;text=Hi%20from%20pattayavisahelp.com%20%E2%80%94%20I%20have%20a%20question%20about%20Thai%20visas" target="_blank" rel="noopener noreferrer">WhatsApp +66 96 728 6999</a></p>`,
    ],
  ],

  '/faq/': [
    [
      /Master FAQ\s*\n\s*Questions30\s*\n\s*Last refreshApr 2026\s*\n\s*SourcesTier-1\s*\n\s*BiasNone\s*\n/,
      `<p><strong>Master FAQ:</strong> 30 questions · Last refresh Apr 2026 · Tier-1 sources · No affiliate bias</p>

<p><strong>Quick start:</strong> Not sure which visa? Run the <a href="/tools/visa-finder/">visa finder</a>. Need Pattaya-specific help? <a href="/contact/">Book a free consult</a>.</p>

`,
    ],
  ],

  '/methodology/': [
    [
      /\n\s*Methodology \+ sources\s*\n\s*\n\s*<table/,
      `\n<h2>Methodology + sources</h2>\n<table`,
    ],
    [
      /\n\s*Free 15-min consultation\s*\n\s*<h2>Want a personal answer\?<\/h2>[\s\S]*?WhatsApp \+66 96 728 6999<\/a>\s*\n(?=\s*<p><strong>Free 15-min consultation)/,
      '\n',
    ],
  ],

  '/blog/2026-thailand-visa-changes-recap/': [
    [
      /\nSources\n([^\n<]+)\n\n\s*<p>Year-end recap:/,
      `\n<p><strong>Sources:</strong> $1</p>

<p>Year-end recap:`,
    ],
  ],
};

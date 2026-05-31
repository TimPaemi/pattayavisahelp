/**
 * Sprint 18 — work-permit UI rebuild, internal linking, weak-inbound gate prep.
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const workPermitBody = require('./content/sprint18-work-permit.cjs');

function read(rel) {
  return fs.readFileSync(path.join(ROOT, rel), 'utf8');
}

function write(rel, html) {
  fs.writeFileSync(path.join(ROOT, rel), html);
}

function insertOnce(html, marker, insert, label) {
  const snippet = insert.trim().slice(0, 40);
  if (html.includes(snippet)) return { html, changed: false };
  if (!html.includes(marker)) {
    console.warn(`WARN: marker not found for ${label}`);
    return { html, changed: false };
  }
  if (marker === '</main>') {
    return { html: html.replace('</main>', insert + '</main>'), changed: true };
  }
  return { html: html.replace(marker, insert + marker), changed: true };
}

function replaceMainBody(rel, body) {
  let html = read(rel);
  const re = /<main id="main"[^>]*>[\s\S]*?<\/main>/;
  if (!re.test(html)) {
    console.warn(`WARN: no main in ${rel}`);
    return false;
  }
  html = html.replace(re, `<main id="main" class="article-body">\n${body}\n</main>`);
  write(rel, html);
  return true;
}

// 1. Rebuild /work-permit/ — corrupted card HTML + wrong TL;DR/lede
let wp = read('work-permit/index.html');
wp = wp.replace(
  /<p class="lede">[^<]*<\/p>/,
  '<p class="lede">Non-B + WP10 for Thai employers. SMART/LTR include work rights. DTV covers foreign-paid remote work only — not Thai payroll.</p>'
);
wp = wp.replace(
  /<p class="tldr-text">[^<]*<\/p>/,
  '<p class="tldr-text">Thai work requires a work permit tied to Non-B, SMART, or LTR — except DTV remote work for foreign employers. 39 occupations are reserved for Thai nationals.</p>'
);
wp = wp.replace(/<span class="read">[^<]*<\/span>/, '<span class="read">8 MIN READ</span>');
wp = wp.replace(/"dateModified": "2026-05-18"/, '"dateModified": "2026-06-04"');
write('work-permit/index.html', wp);
replaceMainBody('work-permit/index.html', workPermitBody);

// Fix read-next on work-permit
wp = read('work-permit/index.html');
wp = wp.replace(
  /<div class="rn-grid">\s*<a href="\/visas\/" class="rn pk">[\s\S]*?<\/div>\s*<\/section>/,
  `<div class="rn-grid">
<a href="/guides/working-in-thailand/" class="rn pk"><div class="cat">// GUIDES</div><h3>Working in Thailand</h3><p>Legal framework</p><span class="arr">→</span></a><a href="/visas/business-non-b/" class="rn cy"><div class="cat">// VISAS</div><h3>Non-B Visa</h3><p>Employer-sponsored route</p><span class="arr">→</span></a><a href="/blog/work-permit-renewal-pattaya-2026/" class="rn yl"><div class="cat">// BLOG</div><h3>WP renewal Pattaya</h3><p>2026 walkthrough</p><span class="arr">→</span></a>
</div>
</section>`
);
write('work-permit/index.html', wp);

// 2. Fix professions hub stat strip corruption
let prof = read('professions/index.html');
if (prof.includes('Profession-specific visa guidesProfession guides6')) {
  prof = prof.replace(
    'Profession-specific visa guidesProfession guides6Updated2026Real income dataYesPattaya-specificYes',
    '<p><strong>Hub stats:</strong> 17 profession guides · Updated 2026 · Pattaya-specific income and sponsorship data · <a href="/work-permit/">Work permit hub</a></p>'
  );
  write('professions/index.html', prof);
}

// 3. Internal link injections (indexed EN weak inbound)
const injections = [
  {
    file: 'blog/index.html',
    marker: '<h2>Most-read recent articles</h2>',
    insert: `<p><strong>Policy &amp; recap:</strong> <a href="/blog/2026-annual-review/">2026 visa year in review</a> · <a href="/blog/2026-thailand-visa-changes-recap/">Thailand visa changes recap</a> · <a href="/blog/tdac-step-by-step/">TDAC arrival card step-by-step</a></p>\n`,
    label: 'blog hub policy links',
  },
  {
    file: 'blog/index.html',
    marker: '<li><a href="/blog/extension-timeline-jomtien-2026/">',
    insert: `<li><a href="/blog/permanent-residency-eligibility-2026/">Permanent residency eligibility 2026</a> — quota, points, and Pattaya filing window</li>
<li><a href="/blog/re-entry-permit-pattaya-2026/">Re-entry permit at Pattaya/Jomtien</a> — single vs multiple, airport vs office</li>
<li><a href="/blog/work-permit-renewal-pattaya-2026/">Work permit renewal in Pattaya</a> — DOE + Immigration sequence</li>
<li><a href="/blog/o-a-health-insurance-2026/">O-A health insurance requirements 2026</a></li>
<li><a href="/blog/overstay-voluntary-surrender-2026/">Voluntary overstay surrender</a> — penalties and exit strategy</li>
<li><a href="/blog/visa-agent-red-flags-2026/">Visa agent red flags in Pattaya</a></li>
<li><a href="/blog/privilege-elite-renewal-2026/">Privilege Elite renewal 2026</a></li>
<li><a href="/blog/tourist-visa-extension-2026/">Tourist visa extension at Jomtien</a></li>
<li><a href="/blog/30-day-visa-exempt-rollback/">30-day visa-exempt rollback analysis</a></li>
`,
    label: 'blog hub article list',
  },
  {
    file: 'guides/permanent-residency-thailand/index.html',
    marker: '<h2>If PR is right for you</h2>',
    insert: `<p><strong>Latest:</strong> <a href="/blog/permanent-residency-eligibility-2026/">PR eligibility checklist 2026</a> · <a href="/glossary/pr/">PR glossary term</a> · <a href="/guides/marriage-non-o-to-pr/">Marriage Non-O to PR pathway</a></p>\n`,
    label: 'PR guide blog link',
  },
  {
    file: 'guides/re-entry-permits/index.html',
    marker: '<h2>Related guides</h2>',
    insert: `<p><strong>Pattaya walkthrough:</strong> <a href="/blog/re-entry-permit-pattaya-2026/">Re-entry permit at Jomtien 2026</a> · <a href="/glossary/re-entry-permit/">Re-entry permit glossary</a> · <a href="/glossary/tm8/">TM8 form</a></p>\n`,
    label: 're-entry guide blog link',
  },
  {
    file: 'glossary/pr/index.html',
    marker: '<h2>Related terms</h2>',
    insert: `<p>Deep dive: <a href="/blog/permanent-residency-eligibility-2026/">PR eligibility 2026</a> · <a href="/guides/permanent-residency-thailand/">Permanent residency guide</a></p>\n`,
    label: 'glossary pr blog',
  },
  {
    file: 'glossary/wp10/index.html',
    marker: '<h2>Related terms</h2>',
    insert: `<p>Practical: <a href="/blog/work-permit-renewal-pattaya-2026/">Work permit renewal Pattaya 2026</a> · <a href="/work-permit/">Work permit hub</a></p>\n`,
    label: 'glossary wp10 blog',
  },
  {
    file: 'glossary/re-entry-permit/index.html',
    marker: '<h2>Related terms</h2>',
    insert: `<p>Walkthrough: <a href="/blog/re-entry-permit-pattaya-2026/">Re-entry permit Pattaya 2026</a> · <a href="/guides/re-entry-permits/">Re-entry permits guide</a></p>\n`,
    label: 'glossary re-entry blog',
  },
  {
    file: 'blog/30-day-visa-exempt-rollback/index.html',
    marker: '<h2>Related reading</h2>',
    insert: '',
    label: '30-day blog tdac',
  },
  {
    file: 'compare/index.html',
    marker: '<p><strong>Comparison hub:</strong>',
    insert: '',
    label: 'compare hub matrix',
  },
  {
    file: 'visas/index.html',
    marker: '<p>The most common comparisons our clients need to make are:',
    insert: '',
    label: 'visas hub matrix',
  },
  {
    file: 'glossary/index.html',
    marker: '<div class="search-box">',
    insert: `<p style="margin:0 0 1.25rem;font-size:.95rem;color:var(--tl,#a1a1aa)">Legal context and Pattaya usage notes: <a href="/guides/glossary/">extended glossary guide</a></p>\n`,
    label: 'glossary hub crosslink',
  },
  {
    file: 'guides/glossary/index.html',
    marker: '<main id="main"',
    insert: '',
    label: 'guides glossary crosslink',
  },
  {
    file: 'blog/2026-thailand-visa-changes-recap/index.html',
    marker: '<h2>Related guides</h2>',
    insert: `<p>Year-end recap: <a href="/blog/2026-annual-review/">2026 annual review</a> · <a href="/blog/">All blog posts</a></p>\n`,
    label: 'recap to annual review',
  },
  {
    file: 'blog/tourist-visa-extension-2026/index.html',
    marker: '</main>',
    insert: `<p><strong>Related:</strong> <a href="/blog/30-day-visa-exempt-rollback/">30-day visa-exempt rollback</a> · <a href="/blog/overstay-voluntary-surrender-2026/">Voluntary overstay surrender</a></p>\n`,
    label: 'tourist extension links',
  },
  {
    file: 'blog/non-o-extension-documents-2026/index.html',
    marker: '</main>',
    insert: `<p><strong>Related:</strong> <a href="/blog/o-a-health-insurance-2026/">O-A health insurance 2026</a></p>\n`,
    label: 'non-o to o-a insurance',
  },
  {
    file: 'blog/ed-visa-moe-accreditation-2026/index.html',
    marker: '</main>',
    insert: `<p><strong>Related:</strong> <a href="/blog/visa-agent-red-flags-2026/">Visa agent red flags in Pattaya</a></p>\n`,
    label: 'ed to agent red flags',
  },
  {
    file: 'best-visa/under-500k/index.html',
    marker: '</main>',
    insert: `<p><strong>Related:</strong> <a href="/blog/privilege-elite-renewal-2026/">Privilege Elite renewal 2026</a></p>\n`,
    label: '500k privilege blog',
  },
  {
    file: 'de/index.html',
    marker: '<footer>',
    insert: `<p style="text-align:center;margin:1rem 0;font-size:.85rem;color:var(--tl,#a1a1aa)"><a href="/de/sitemap/">Deutsche Seitenübersicht</a></p>\n`,
    label: 'de sitemap link',
  },
  {
    file: 'ru/index.html',
    marker: '<footer>',
    insert: `<p style="text-align:center;margin:1rem 0;font-size:.85rem;color:var(--tl,#a1a1aa)"><a href="/ru/sitemap/">Карта сайта на русском</a></p>\n`,
    label: 'ru sitemap link',
  },
];

// Special cases
let b30 = read('blog/30-day-visa-exempt-rollback/index.html');
if (!b30.includes('/blog/tdac-step-by-step/')) {
  b30 = b30.replace(
    '</main>',
    `<p>Arrival paperwork: <a href="/blog/tdac-step-by-step/">TDAC digital arrival card — step-by-step</a></p>\n</main>`
  );
  write('blog/30-day-visa-exempt-rollback/index.html', b30);
}

let cmp = read('compare/index.html');
if (!cmp.includes('/compare/visa-comparison-matrix/')) {
  cmp = cmp.replace(
    '<p><strong>Comparison hub:</strong>',
    '<p><strong>Comparison hub:</strong> <a href="/compare/visa-comparison-matrix/">Full visa comparison matrix</a> ·'
  );
  cmp = cmp.replace(
    '<h2>How to read these comparisons</h2>',
    `<p><strong>All visas at a glance:</strong> <a href="/compare/visa-comparison-matrix/">Visa comparison matrix</a> — side-by-side fees, duration, work rights, and Pattaya fit for all 12 pathways.</p>\n<h2>How to read these comparisons</h2>`
  );
  write('compare/index.html', cmp);
}

let visas = read('visas/index.html');
if (!visas.includes('/compare/visa-comparison-matrix/')) {
  visas = visas.replace(
    '<p>The most common comparisons our clients need to make are:',
    '<p>Compare all pathways in one table: <a href="/compare/visa-comparison-matrix/">visa comparison matrix</a>. The most common comparisons our clients need to make are:'
  );
  write('visas/index.html', visas);
}

let gg = read('guides/glossary/index.html');
if (!gg.includes('href="/glossary/"')) {
  gg = gg.replace(
    /<main id="main" class="article-body">/,
    `<main id="main" class="article-body">\n<p><strong>Term index:</strong> Browse all 36 defined terms at <a href="/glossary/">/glossary/</a> — this guide adds legal context and Pattaya-specific usage notes.</p>\n`
  );
  write('guides/glossary/index.html', gg);
}

let changed = 0;
for (const inj of injections) {
  if (!inj.insert) continue;
  let html = read(inj.file);
  const r = insertOnce(html, inj.marker, inj.insert, inj.label);
  if (r.changed) {
    write(inj.file, r.html);
    changed++;
  }
}

// 4. Run audit suite
execSync('node scripts/audit-internal-links.cjs', { cwd: ROOT, stdio: 'inherit' });
execSync('node scripts/audit-weak-inbound-indexed.cjs', { cwd: ROOT, stdio: 'inherit' });
execSync('node scripts/audit-broken-links.cjs', { cwd: ROOT, stdio: 'inherit' });
execSync('node scripts/audit-comprehensive.cjs', { cwd: ROOT, stdio: 'inherit' });
execSync('node scripts/audit-content-quality.cjs', { cwd: ROOT, stdio: 'inherit' });

console.log(JSON.stringify({ injectionsApplied: changed, workPermitRebuilt: true }, null, 2));

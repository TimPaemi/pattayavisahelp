/**
 * Sprint 36 — Pattaya Authority network hub note on partners page.
 */
const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'partners/index.html');
let h = fs.readFileSync(file, 'utf8');

const marker = 'data-speakable="network-hub"';
if (h.includes(marker)) {
  console.log('partners network hub: already present');
  process.exit(0);
}

const block = `<h2 data-speakable="network-hub">Pattaya Authority network hub</h2>
<p>Pattaya Visa Help is the visa pillar of the <a href="https://pattaya-authority.com/work/pattaya-visa-help/" target="_blank" rel="noopener noreferrer">Pattaya Authority</a> topical network — independent guides for visas, healthcare, schools, gyms, neighbourhoods, and daily life in Pattaya. Sister sites (e.g. <a href="https://pattaya-medical.com/" target="_blank" rel="noopener noreferrer">Pattaya Medical</a>, <a href="https://pattaya-school-guide.com/" target="_blank" rel="noopener noreferrer">Pattaya School Guide</a>) link here for immigration questions; we link out when healthcare, education, or lifestyle context helps you choose the right visa path.</p>
<p><strong>Reciprocal links:</strong> The hub page at Pattaya Authority should point back to this site as the canonical Thailand visa resource — if you manage a sister property and need the correct anchor text, use <em>Pattaya Visa Help</em> → <code>https://pattayavisahelp.com/</code>.</p>

`;

h = h.replace(
  '<p>Pattaya Visa Help works with a network of trusted professionals',
  block + '<p>Pattaya Visa Help works with a network of trusted professionals'
);
fs.writeFileSync(file, h);
console.log('partners: network hub section added');

// Programmatic SEO/AEO page generator for Paje Farm Houses.
// Usage: node site/generate.mjs
// Reads site/data.json, writes menu/<slug>/index.html, experiences/<slug>/index.html
// and rewrites the root sitemap.xml. Commit the output. No dependencies.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://www.pajefarmhouses.com';
const TODAY = new Date().toISOString().slice(0, 10);
const data = JSON.parse(readFileSync(join(ROOT, 'site', 'data.json'), 'utf8'));
const B = data.business;

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

function head(p, sectionLabel) {
  const url = `${SITE}/${sectionLabel}/${p.slug}/`;
  const title = `${p.name} in Paje, Zanzibar | ${B.name}`;
  const desc = `${p.name} at ${B.name} — ${p.tagline}. ${p.desc[0]}`;
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title><meta name="description" content="${esc(desc.slice(0, 155))}"><link rel="canonical" href="${url}"><meta name="robots" content="index, follow, max-image-preview:large"><meta name="theme-color" content="#183d2b"><meta property="og:type" content="website"><meta property="og:site_name" content="${B.name}"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc.slice(0, 155))}"><meta property="og:url" content="${url}"><meta property="og:image" content="${SITE}${p.image}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(desc.slice(0, 155))}"><meta name="twitter:image" content="${SITE}${p.image}"><link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='22' fill='%23f7f4eb'/%3E%3Ctext x='50' y='70' font-size='62' text-anchor='middle' fill='%23183d2b'%3E%E2%9C%B3%3C/text%3E%3C/svg%3E">`;
}

const CSS = `<style>@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Playfair+Display:wght@400;500&display=swap');*{box-sizing:border-box}body{margin:0;background:#faf7f0;color:#183d2b;font-family:'DM Sans',sans-serif}main{max-width:860px;margin:0 auto;padding:28px 5% 60px}header.top{display:flex;align-items:center;justify-content:space-between;padding:16px 5%;background:#faf7f0;border-bottom:1px solid #e7dfcb;position:sticky;top:0}.brand{font-family:'Playfair Display',serif;font-size:22px;color:#183d2b;text-decoration:none}.btn{display:inline-block;background:#bc4b36;color:#fff;padding:13px 24px;border-radius:30px;font-weight:700;font-size:14px;text-decoration:none}nav.crumb{font-size:13px;margin:6px 0 18px;color:#6a756c}nav.crumb a{color:#183d2b}h1{font-family:'Playfair Display',serif;font-weight:400;font-size:clamp(38px,6vw,58px);line-height:1.08;letter-spacing:-1px;margin:14px 0}.eyebrow{font-size:11px;letter-spacing:2.5px;text-transform:uppercase;font-weight:700}.lede{font-size:17px;line-height:1.75;color:#43544a}img.hero{width:100%;height:auto;border-radius:16px;margin:20px 0}table.facts{width:100%;border-collapse:collapse;background:#fff;border:1px solid #e7dfcb;font-size:15px;margin:26px 0}table.facts th{background:#183d2b;color:#fff;text-align:left;padding:11px 14px;font-size:11px;letter-spacing:1.5px;text-transform:uppercase}table.facts td{padding:11px 14px;border-top:1px solid #e7dfcb;vertical-align:top;line-height:1.6}h2{font-family:'Playfair Display',serif;font-weight:400;font-size:30px;margin:36px 0 6px}details{border-bottom:1px solid #233d3030;padding:18px 0}summary{font-weight:700;cursor:pointer;font-size:16px}details p{font-size:15px;line-height:1.75;color:#43544a}.cta{background:#1d4028;color:#f4efe2;border-radius:16px;padding:28px;margin:34px 0;text-align:center}.cta h2{color:#f4efe2;margin-top:0}.cta p{opacity:.9}.cta .btn{margin-top:8px}ul.more{list-style:none;padding:0;display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:14px 0 0}ul.more a{display:block;background:#fff;border:1px solid #e7dfcb;border-radius:12px;padding:13px 14px;color:#183d2b;text-decoration:none;font-size:14px}footer{border-top:1px solid #e7dfcb;padding:26px 5%;font-size:13px;color:#6a756c}footer a{color:#183d2b}@media(max-width:640px){ul.more{grid-template-columns:1fr}}</style>`;

function schema(p, url, sectionLabel, sectionName) {
  const nodes = [
    { '@type': 'WebPage', '@id': url + '#webpage', url, name: `${p.name} in Paje, Zanzibar | ${B.name}`, inLanguage: 'en', isPartOf: { '@id': `${SITE}/#website` }, about: { '@id': `${SITE}/#restaurant` }, dateModified: TODAY },
    { '@type': 'BreadcrumbList', '@id': url + '#breadcrumb', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE + '/' },
      { '@type': 'ListItem', position: 2, name: sectionName, item: `${SITE}/#${sectionLabel === 'menu' ? 'menu' : 'farm'}` },
      { '@type': 'ListItem', position: 3, name: p.name, item: url } ] },
    { '@type': 'FAQPage', '@id': url + '#faq', mainEntity: p.faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
  ];
  const GBP = B.googleBusinessProfileUrl || 'https://share.google/OVQm5wAHdnRMCpDGL';
  if (sectionLabel === 'experiences') {
    const svc = { '@type': 'Service', name: p.name, description: p.desc[0], provider: { '@id': `${SITE}/#restaurant`, name: B.name, sameAs: [GBP] }, areaServed: 'Paje, Zanzibar' };
    if (p.price) svc.offers = { '@type': 'Offer', price: p.price, priceCurrency: 'USD' };
    nodes.push(svc);
  } else if (p.price) {
    nodes.push({ '@type': 'MenuItem', name: p.name, description: p.desc[0], offers: { '@type': 'Offer', price: p.price, priceCurrency: 'USD' } });
  }
  return `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': nodes })}</script>`;
}

function page(p, sectionLabel, sectionName, siblings) {
  const url = `${SITE}/${sectionLabel}/${p.slug}/`;
  const rows = p.facts.map(([k, v]) => `<tr><td><strong>${esc(k)}</strong></td><td>${esc(v)}</td></tr>`).join('');
  const faqs = p.faqs.map((f) => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('');
  const more = siblings.filter((s) => s.slug !== p.slug).map((s) => `<li><a href="/${sectionLabel}/${s.slug}/">${esc(s.name)} →</a></li>`).join('');
  return `${head(p, sectionLabel)}${CSS}${schema(p, url, sectionLabel, sectionName)}</head><body><header class="top"><a class="brand" href="/">Paje Farm Houses</a><a class="btn" href="/#reserve">Reserve a Table</a></header><main><nav class="crumb" aria-label="Breadcrumb"><a href="/">Home</a> › <a href="/#${sectionLabel === 'menu' ? 'menu' : 'farm'}">${sectionName}</a> › ${esc(p.name)}</nav><div class="eyebrow">${esc(p.category)} · Paje, Zanzibar</div><h1>${esc(p.name)}</h1><p class="lede">${esc(p.desc[0])} ${esc(p.desc[1])}</p><img class="hero" src="${p.image}" width="${p.w}" height="${p.h}" alt="${esc(p.alt)}" fetchpriority="high"><table class="facts"><caption style="text-align:left;font-family:'Playfair Display',serif;font-size:20px;padding-bottom:10px">${esc(p.name)} — facts</caption><tbody>${rows}</tbody></table><h2>Questions about ${esc(p.name)}</h2>${faqs}<div class="cta"><h2>Ready when you are</h2><p>${esc(p.category)} in Paje, East Coast Zanzibar — the team confirms availability before your visit.</p><a class="btn" href="/#reserve">Enquire now →</a><p style="font-size:13px">Or reach us: <a style="color:#fff" href="mailto:${B.email}">${B.email}</a> · <a style="color:#fff" href="tel:${B.phone}">${B.phoneDisplay}</a><br><a style="color:#fff" href="${B.googleMapsUrl}">Get directions ↗</a> · <a style="color:#fff" href="${B.googleBusinessProfileUrl}">Find us on Google ↗</a></p></div><h2>More ${sectionName.toLowerCase()}</h2><ul class="more">${more}</ul></main><footer><strong>${B.name}</strong> · ${esc(B.address)}<br><a href="mailto:${B.email}">${B.email}</a> · <a href="tel:${B.phone}">${B.phoneDisplay}</a> · <a href="/">pajefarmhouses.com</a><br><a href="${B.googleMapsUrl}">Get directions ↗</a> · <a href="${B.googleBusinessProfileUrl}">Find us on Google ↗</a> · <a href="${B.googleReviewUrl}">Review us ↗</a></footer></body></html>`;
}

const pages = [];
for (const p of data.dishes) pages.push({ loc: `/menu/${p.slug}/`, html: page(p, 'menu', 'Menu', data.dishes) });
for (const p of data.experiences) pages.push({ loc: `/experiences/${p.slug}/`, html: page(p, 'experiences', 'Experiences', data.experiences) });

for (const pg of pages) {
  const dir = join(ROOT, pg.loc);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), pg.html);
}
const urls = [{ loc: '/', pr: '1.0', img: '/assets/paje-farm-houses-garden-dining-hero.jpg' }, ...pages.map((p) => ({ loc: p.loc, pr: '0.8' }))];
writeFileSync(join(ROOT, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${urls.map((u) => {
    const item = [...data.dishes.map((d) => ({ ...d, _loc: `/menu/${d.slug}/` })), ...data.experiences.map((d) => ({ ...d, _loc: `/experiences/${d.slug}/` }))].find((d) => d._loc === u.loc);
    const img = item ? `\n    <image:image>\n      <image:loc>${SITE}${item.image}</image:loc>\n      <image:title>${esc(item.name)}</image:title>\n    </image:image>` : (u.img ? `\n    <image:image>\n      <image:loc>${SITE}${u.img}</image:loc>\n    </image:image>` : '');
    return `  <url>\n    <loc>${SITE}${u.loc}</loc>\n    <lastmod>${TODAY}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${u.pr}</priority>${img}\n  </url>`;
  }).join('\n')}\n</urlset>\n`);
console.log(`generated ${pages.length} pages + sitemap (${TODAY})`);

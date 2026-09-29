/**
 * Pré-rendu SEO (exécuté après `vite build`).
 * Pour chaque page indexable (accueil, catégories, 24 fiches produit, pages d'information) :
 *  - écrit dist/<chemin>/index.html avec le bon <title>, la meta description, l'URL canonique,
 *    les balises Open Graph / Twitter et les données structurées JSON-LD (Product, Breadcrumb, FAQ…),
 *  - ajoute un contenu <noscript> (titre, prix, liens) lisible par les robots sans JavaScript.
 * Génère aussi sitemap.xml, robots.txt et 404.html.
 * L'application React prend ensuite le relais dans le navigateur.
 */
import fs from 'node:fs'
import path from 'node:path'
import { createServer } from 'vite'

const DIST = 'dist'
if (!fs.existsSync(path.join(DIST, 'index.html'))) {
  console.error('dist/index.html introuvable : lancez d\'abord `vite build`.')
  process.exit(1)
}

const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' })
const seo = await vite.ssrLoadModule('/src/seo.ts')
const data = await vite.ssrLoadModule('/src/data/products.ts')
const { SITE, abs, allSeoRoutes, DEMO_MODE } = seo
const { PRODUCTS, CATEGORIES, fcfa, discountPct } = data

const template = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8')
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const json = (o) => JSON.stringify(o).replace(/</g, '\\u003c')

function headBlock(d, { noindex = d.noindex } = {}) {
  const url = abs(d.path)
  const image = d.image ?? SITE.ogImage
  const lines = [
    `<title>${esc(d.title)}</title>`,
    `<meta name="description" content="${esc(d.description)}" />`,
    `<meta name="robots" content="${DEMO_MODE ? 'noindex,nofollow' : noindex ? 'noindex,follow' : 'index,follow,max-image-preview:large'}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:title" content="${esc(d.title)}" />`,
    `<meta property="og:description" content="${esc(d.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:type" content="${d.type === 'product' ? 'product' : 'website'}" />`,
    `<meta property="og:image" content="${esc(image)}" />`,
    `<meta property="og:site_name" content="${SITE.name}" />`,
    `<meta property="og:locale" content="${SITE.locale}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(d.title)}" />`,
    `<meta name="twitter:description" content="${esc(d.description)}" />`,
    `<meta name="twitter:image" content="${esc(image)}" />`,
    ...(d.ld ?? []).map((o) => `<script type="application/ld+json" data-seo-ld="1">${json(o)}</script>`),
  ]
  return `<!--seo:start-->\n    ${lines.join('\n    ')}\n    <!--seo:end-->`
}

const navLinks = () =>
  `<nav><ul>${[
    ['/', 'Accueil'],
    ['/collection', 'Toute la collection Black Friday'],
    ...CATEGORIES.map((c) => [`/collection/${c.id}`, c.label]),
    ['/livraison-retours', 'Livraison et retours'],
    ['/faq', 'FAQ'],
    ['/a-propos', 'À propos'],
    ['/contact', 'Contact'],
  ].map(([h, l]) => `<li><a href="${h}">${esc(l)}</a></li>`).join('')}</ul></nav>`

function bodyFor(d) {
  const product = PRODUCTS.find((p) => d.path === `/produit/${p.id}`)
  const category = CATEGORIES.find((c) => d.path === `/collection/${c.id}`)
  let inner = ''
  if (product) {
    inner = `<h1>${esc(product.name)}</h1><p>${fcfa(product.price)} au lieu de ${fcfa(product.oldPrice)} (-${discountPct(product)}%)</p>` +
      product.description.map((t) => `<p>${esc(t)}</p>`).join('') +
      `<ul>${product.specs.map(([k, v]) => `<li>${esc(k)} : ${esc(v)}</li>`).join('')}</ul>`
  } else if (category || d.path === '/collection') {
    const list = category ? PRODUCTS.filter((p) => p.category === category.id) : PRODUCTS
    inner = `<h1>${esc(category ? category.label : 'Collection Black Friday')}</h1><p>${esc(d.description)}</p>` +
      `<ul>${list.map((p) => `<li><a href="/produit/${p.id}">${esc(p.name)}</a> : ${fcfa(p.price)}</li>`).join('')}</ul>`
  } else {
    inner = `<h1>${esc(d.title.split('|')[0].trim())}</h1><p>${esc(d.description)}</p>`
  }
  return `<!--seo:noscript-->\n    <noscript>${inner}${navLinks()}<p>Activez JavaScript pour commander, ou écrivez-nous sur WhatsApp au +229 50 00 00 00.</p></noscript>\n    <!--seo:noscript-end-->`
}

function render(d, opts) {
  return template
    .replace(/<!--seo:start-->[\s\S]*?<!--seo:end-->/, () => headBlock(d, opts))
    .replace(/<!--seo:noscript-->[\s\S]*?<!--seo:noscript-end-->/, () => bodyFor(d))
}

const routes = allSeoRoutes()
// pages privées (panier, paiement, compte…) : générées aussi, pour qu'un rechargement renvoie un statut 200,
// mais en noindex et absentes du sitemap
const { STATIC_SEO, staticSeo } = seo
const privateRoutes = Object.keys(STATIC_SEO).filter((p) => !STATIC_SEO[p].index).map((p) => staticSeo(p))
for (const d of [...routes, ...privateRoutes]) {
  const file = d.path === '/' ? path.join(DIST, 'index.html') : path.join(DIST, d.path.replace(/^\//, ''), 'index.html')
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, render(d))
}

// page 404 (GitHub Pages, Netlify, Vercel) : jamais indexée
fs.writeFileSync(path.join(DIST, '404.html'), render({ title: 'Page introuvable | StyleVibe', description: "Cette page n'existe pas.", path: '/404', ld: [] }, { noindex: true }))

// sitemap.xml
const today = new Date().toISOString().slice(0, 10)
const priority = (p) => (p === '/' ? '1.0' : p.startsWith('/produit/') ? '0.9' : p.startsWith('/collection') ? '0.8' : '0.5')
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  routes.map((d) => `  <url><loc>${abs(d.path)}</loc><lastmod>${today}</lastmod><changefreq>${d.path.startsWith('/produit/') ? 'weekly' : 'monthly'}</changefreq><priority>${priority(d.path)}</priority></url>`).join('\n') +
  `\n</urlset>\n`
// robots.txt : en mode démo, tout le site est fermé aux robots et le sitemap n'est pas publié
const robots = DEMO_MODE
  ? ['# Site de démonstration : ne pas indexer', 'User-agent: *', 'Disallow: /', ''].join('\n')
  : [
      'User-agent: *',
      'Allow: /',
      'Disallow: /panier',
      'Disallow: /paiement',
      'Disallow: /confirmation',
      'Disallow: /compte',
      'Disallow: /suivi',
      'Disallow: /favoris',
      '',
      `Sitemap: ${SITE.url}/sitemap.xml`,
      '',
    ].join('\n')
fs.writeFileSync(path.join(DIST, 'robots.txt'), robots)
if (DEMO_MODE) fs.rmSync(path.join(DIST, 'sitemap.xml'), { force: true })
else fs.writeFileSync(path.join(DIST, 'sitemap.xml'), sitemap)

await vite.close()
console.log(`Pré-rendu terminé : ${routes.length} pages + ${privateRoutes.length} pages privées, robots.txt, 404.html${DEMO_MODE ? ' (MODE DÉMO : site noindex, sans sitemap)' : ', sitemap.xml'}`)

import { useEffect } from 'react'
import { CATEGORIES, CATEGORY_SEO, IMG, PRODUCTS, SALE_END, discountPct, fcfa, type Product } from './data/products'
import { generateReviews } from './data/reviews'

/** Domaine de production. Adresse Vercel pour l'instant : la remplacer par le vrai nom de domaine une fois acheté. */
export const SITE = {
  name: 'StyleVibe',
  url: 'https://black-fridayz.vercel.app',
  locale: 'fr_BJ',
  phone: '+22950000000',
  email: 'contact@stylevibe.bj',
  whatsapp: '22950000000',
  ogImage: IMG.hero,
}

/**
 * Mode démonstration : le site reste visible et utilisable pour qui a le lien, mais il est caché des moteurs de
 * recherche (noindex + robots.txt « Disallow: / ») et n'expose plus les avis ni la note dans les données structurées,
 * puisque ce sont des données fictives. Passer à `false` le jour où le site devient réel (vrais produits, vrais avis).
 */
export const DEMO_MODE = true

export const abs = (path: string) => SITE.url + (path.startsWith('/') ? path : `/${path}`)

export interface SeoData {
  title: string
  description: string
  path: string
  image?: string
  type?: 'website' | 'product'
  ld?: object[]
  noindex?: boolean
}

const clip = (s: string, n = 158) => (s.length <= n ? s : s.slice(0, n - 1).replace(/\s+\S*$/, '') + '…')

export const ORG_LD = {
  '@context': 'https://schema.org',
  '@type': ['Organization', 'ClothingStore'],
  '@id': `${SITE.url}/#organization`,
  name: SITE.name,
  url: SITE.url,
  logo: abs('/favicon.svg'),
  image: SITE.ogImage,
  description: "Boutique de mode et lifestyle en ligne au Bénin : prêt-à-porter, sneakers, sacs, montres, lunettes et parfums, livrés à Cotonou, Calavi et Porto-Novo.",
  telephone: SITE.phone,
  email: SITE.email,
  priceRange: '₣₣',
  currenciesAccepted: 'XOF',
  paymentAccepted: 'MTN Mobile Money, Moov Money, Visa, Mastercard, Espèces à la livraison',
  address: { '@type': 'PostalAddress', streetAddress: 'Fidjrossè, Rue de la Plage', addressLocality: 'Cotonou', addressCountry: 'BJ' },
  areaServed: ['Cotonou', 'Abomey-Calavi', 'Porto-Novo', 'Parakou', 'Bénin'],
  openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], opens: '09:00', closes: '19:00' }],
}

export const WEBSITE_LD = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE.url}/#website`,
  url: SITE.url,
  name: SITE.name,
  inLanguage: 'fr-BJ',
  publisher: { '@id': `${SITE.url}/#organization` },
  potentialAction: { '@type': 'SearchAction', target: `${SITE.url}/collection?q={search_term_string}`, 'query-input': 'required name=search_term_string' },
}

export const breadcrumbLd = (items: { name: string; path: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: abs(it.path) })),
})

export const faqLd = (faqs: [string, string][]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
})

export const itemListLd = (name: string, products: Product[]) => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name,
  itemListElement: products.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(`/produit/${p.id}`), name: p.name })),
})

export function productLd(p: Product, now = Date.now(), withReviews = !DEMO_MODE) {
  const reviews = withReviews ? generateReviews(p, now).slice(0, 5) : []
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': abs(`/produit/${p.id}`) + '#product',
    name: p.name,
    sku: p.id,
    image: p.images,
    description: p.description.join(' '),
    category: CATEGORIES.find((c) => c.id === p.category)?.label,
    brand: { '@type': 'Brand', name: SITE.name },
    offers: {
      '@type': 'Offer',
      url: abs(`/produit/${p.id}`),
      priceCurrency: 'XOF',
      price: String(p.price),
      priceValidUntil: new Date(SALE_END).toISOString().slice(0, 10),
      itemCondition: 'https://schema.org/NewCondition',
      availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: { '@id': `${SITE.url}/#organization` },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: { '@type': 'MonetaryAmount', value: p.price >= 50000 ? '0' : '1500', currency: 'XOF' },
        shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'BJ' },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: { '@type': 'QuantitativeValue', minValue: 0, maxValue: 1, unitCode: 'DAY' },
          transitTime: { '@type': 'QuantitativeValue', minValue: 1, maxValue: 2, unitCode: 'DAY' },
        },
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'BJ',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 7,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/ReturnShippingFees',
      },
    },
    ...(withReviews && {
      aggregateRating: { '@type': 'AggregateRating', ratingValue: String(p.rating), reviewCount: String(p.reviews), bestRating: '5', worstRating: '1' },
      review: reviews.map((r) => ({
        '@type': 'Review',
        author: { '@type': 'Person', name: r.name },
        datePublished: new Date(r.date).toISOString().slice(0, 10),
        name: r.title,
        reviewBody: r.text,
        reviewRating: { '@type': 'Rating', ratingValue: String(r.rating), bestRating: '5', worstRating: '1' },
      })),
    }),
  }
}

/* --------- métadonnées par page --------- */

export const homeSeo = (): SeoData => ({
  title: "StyleVibe | Black Friday Bénin : mode, sneakers, montres jusqu'à -60%",
  description: "Black Friday StyleVibe : jusqu'à -60% sur mode, sneakers, sacs, montres et parfums. Livraison 24h à Cotonou, paiement MoMo et Moov, échange gratuit.",
  path: '/',
  ld: [ORG_LD, WEBSITE_LD],
})

export const catalogSeo = (cat?: string): SeoData => {
  const c = CATEGORIES.find((x) => x.id === cat)
  if (!c) {
    return {
      title: 'Collection Black Friday : mode, sneakers, sacs, montres | StyleVibe',
      description: "Collection Black Friday StyleVibe : 24 pièces jusqu'à -60%, livrées en 24h à Cotonou, Calavi et Porto-Novo. Paiement mobile money, échange gratuit.",
      path: '/collection',
      ld: [breadcrumbLd([{ name: 'Accueil', path: '/' }, { name: 'Collection Black Friday', path: '/collection' }]), itemListLd('Collection Black Friday', PRODUCTS)],
    }
  }
  const s = CATEGORY_SEO[c.id]
  return {
    title: `${s.title} | StyleVibe`,
    description: clip(s.description),
    path: `/collection/${c.id}`,
    image: PRODUCTS.find((p) => p.category === c.id)?.images[0],
    ld: [
      breadcrumbLd([{ name: 'Accueil', path: '/' }, { name: 'Collection', path: '/collection' }, { name: c.label, path: `/collection/${c.id}` }]),
      itemListLd(s.h1, PRODUCTS.filter((p) => p.category === c.id)),
    ],
  }
}

export const productSeo = (p: Product): SeoData => {
  const c = CATEGORIES.find((x) => x.id === p.category)!
  return {
    title: `${p.name} à ${fcfa(p.price)} (-${discountPct(p)}%) | StyleVibe Bénin`,
    // description orientée achat : prix barré, remise, livraison, paiement, réassurance
    description: clip(`${p.name} à ${fcfa(p.price)} au lieu de ${fcfa(p.oldPrice)} (-${discountPct(p)}%). Livraison 24h à Cotonou, paiement MoMo, échange gratuit. Stock limité.`),
    path: `/produit/${p.id}`,
    image: p.images[0],
    type: 'product',
    ld: [
      productLd(p),
      breadcrumbLd([{ name: 'Accueil', path: '/' }, { name: c.label, path: `/collection/${c.id}` }, { name: p.name, path: `/produit/${p.id}` }]),
    ],
  }
}

export const STATIC_SEO: Record<string, Omit<SeoData, 'path'> & { index: boolean }> = {
  '/a-propos': { title: 'À propos de StyleVibe, la boutique mode du Bénin', description: "StyleVibe sélectionne les meilleures pièces mode et lifestyle et les rend accessibles à Cotonou. Qualité contrôlée, prix en FCFA, paiement MoMo.", index: true },
  '/contact': { title: 'Contact et showroom à Cotonou | StyleVibe', description: 'Contactez StyleVibe par WhatsApp, email ou passez au showroom de Fidjrossè, Cotonou. Ouvert du lundi au samedi de 9h à 19h. Réponse en moins de 3 heures.', index: true },
  '/faq': { title: 'FAQ : livraison, paiement MoMo, échanges | StyleVibe', description: "Toutes les réponses : commande, délais de livraison à Cotonou et au Bénin, paiement MTN MoMo et Moov, échange de taille, authenticité et SAV.", index: true },
  '/livraison-retours': { title: 'Livraison et retours au Bénin : tarifs et délais | StyleVibe', description: 'Livraison à Cotonou dès 1 500 FCFA en 1 à 2 jours, gratuite dès 50 000 FCFA. Retours et échanges sous 7 jours. Tous les tarifs par ville.', index: true },
  '/panier': { title: 'Mon panier', description: 'Votre panier StyleVibe.', index: false },
  '/paiement': { title: 'Paiement sécurisé', description: 'Finalisez votre commande StyleVibe.', index: false },
  '/confirmation': { title: 'Commande confirmée', description: 'Votre commande StyleVibe est confirmée.', index: false },
  '/compte': { title: 'Mon compte', description: 'Votre compte StyleVibe.', index: false },
  '/suivi': { title: 'Suivre ma commande', description: 'Suivez votre commande StyleVibe.', index: false },
  '/favoris': { title: 'Mes favoris', description: 'Vos articles favoris StyleVibe.', index: false },
}

export const staticSeo = (path: string, ld: object[] = []): SeoData => {
  const s = STATIC_SEO[path]
  return { title: s.title.includes('|') ? s.title : `${s.title} | StyleVibe`, description: s.description, path, noindex: !s.index, ld }
}

/** Toutes les pages indexables (sitemap + pré-rendu). */
export function allSeoRoutes(): SeoData[] {
  const statics = Object.entries(STATIC_SEO).filter(([, s]) => s.index).map(([path]) => staticSeo(path))
  return [homeSeo(), catalogSeo(), ...CATEGORIES.map((c) => catalogSeo(c.id)), ...PRODUCTS.map(productSeo), ...statics]
}

/* --------- application dans le <head> --------- */

function setMeta(attr: 'name' | 'property', key: string, value: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) { el = document.createElement('meta'); el.setAttribute(attr, key); document.head.appendChild(el) }
  el.setAttribute('content', value)
}

export function applySeo(d: SeoData) {
  const url = abs(d.path)
  const image = d.image ?? SITE.ogImage
  document.title = d.title
  setMeta('name', 'description', d.description)
  setMeta('name', 'robots', DEMO_MODE ? 'noindex,nofollow' : d.noindex ? 'noindex,follow' : 'index,follow,max-image-preview:large')
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link) }
  link.href = url
  setMeta('property', 'og:title', d.title)
  setMeta('property', 'og:description', d.description)
  setMeta('property', 'og:url', url)
  setMeta('property', 'og:type', d.type === 'product' ? 'product' : 'website')
  setMeta('property', 'og:image', image)
  setMeta('property', 'og:site_name', SITE.name)
  setMeta('property', 'og:locale', SITE.locale)
  setMeta('name', 'twitter:card', 'summary_large_image')
  setMeta('name', 'twitter:title', d.title)
  setMeta('name', 'twitter:description', d.description)
  setMeta('name', 'twitter:image', image)
  document.head.querySelectorAll('script[data-seo-ld]').forEach((s) => s.remove())
  for (const obj of d.ld ?? []) {
    const s = document.createElement('script')
    s.type = 'application/ld+json'
    s.dataset.seoLd = '1'
    s.textContent = JSON.stringify(obj)
    document.head.appendChild(s)
  }
}

export function useSeo(d: SeoData) {
  const key = JSON.stringify([d.title, d.description, d.path, d.image, d.noindex])
  useEffect(() => { applySeo(d) }, [key]) // eslint-disable-line react-hooks/exhaustive-deps
}

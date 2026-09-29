import { describe, expect, it } from 'vitest'
import { CATEGORIES, PRODUCTS } from '../data/products'
import { SITE, abs, allSeoRoutes, breadcrumbLd, faqLd, productLd } from '../seo'

describe('référencement', () => {
  const routes = allSeoRoutes()

  it('couvre l’accueil, la collection, 6 catégories, 24 produits et 4 pages d’information', () => {
    expect(routes).toHaveLength(1 + 1 + CATEGORIES.length + PRODUCTS.length + 4)
  })

  it('chaque page a une URL, un titre et une description uniques', () => {
    expect(new Set(routes.map((r) => r.path)).size).toBe(routes.length)
    expect(new Set(routes.map((r) => r.title)).size).toBe(routes.length)
    expect(new Set(routes.map((r) => r.description)).size).toBe(routes.length)
  })

  it('les titres et descriptions respectent les longueurs conseillées', () => {
    for (const r of routes) {
      expect(r.title.length, r.path).toBeLessThanOrEqual(80)
      expect(r.description.length, r.path).toBeGreaterThanOrEqual(50)
      expect(r.description.length, r.path).toBeLessThanOrEqual(160)
    }
  })

  it('aucun tiret cadratin dans les textes de référencement', () => {
    for (const r of routes) expect(`${r.title}${r.description}`).not.toMatch(/[—–]/)
  })

  it('les fiches produit ont des données structurées Product complètes', () => {
    for (const p of PRODUCTS) {
      const ld = productLd(p) as Record<string, any>
      expect(ld['@type']).toBe('Product')
      expect(ld.offers.priceCurrency).toBe('XOF')
      expect(ld.offers.price).toBe(String(p.price))
      expect(ld.offers.availability).toContain('InStock')
      expect(ld.aggregateRating.reviewCount).toBe(String(p.reviews))
      expect(ld.review).toHaveLength(5)
      expect(ld.image.length).toBeGreaterThan(0)
      expect(() => JSON.stringify(ld)).not.toThrow()
    }
  })

  it('génère un fil d’Ariane et une FAQ valides', () => {
    const b = breadcrumbLd([{ name: 'Accueil', path: '/' }, { name: 'Collection', path: '/collection' }]) as any
    expect(b.itemListElement[1].item).toBe(abs('/collection'))
    const f = faqLd([['Question ?', 'Réponse.']]) as any
    expect(f.mainEntity[0].acceptedAnswer.text).toBe('Réponse.')
  })

  it('l’accueil déclare l’organisation et la recherche du site', () => {
    const home = routes.find((r) => r.path === '/')!
    const types = home.ld!.map((o: any) => [o['@type']].flat().join(','))
    expect(types.join(' ')).toContain('Organization')
    expect(types.join(' ')).toContain('WebSite')
  })

  it('les URL absolues utilisent le domaine du site', () => {
    expect(abs('/produit/x')).toBe(`${SITE.url}/produit/x`)
  })
})

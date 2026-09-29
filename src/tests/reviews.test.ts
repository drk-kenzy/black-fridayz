import { describe, expect, it } from 'vitest'
import { PRODUCTS } from '../data/products'
import { HOME_TESTIMONIALS, generateReviews, ratingBreakdown } from '../data/reviews'

describe('avis générés', () => {
  it('génère exactement le nombre d’avis annoncé pour chaque produit', () => {
    for (const p of PRODUCTS) expect(generateReviews(p)).toHaveLength(p.reviews)
  })

  it('la moyenne des notes correspond à la note affichée (à 0,1 près)', () => {
    for (const p of PRODUCTS) {
      const rs = generateReviews(p)
      const avg = rs.reduce((n, r) => n + r.rating, 0) / rs.length
      expect(Math.abs(avg - p.rating)).toBeLessThan(0.1)
    }
  })

  it('est déterministe : mêmes avis à chaque visite', () => {
    const p = PRODUCTS[0]
    const now = Date.now()
    expect(generateReviews(p, now)).toEqual(generateReviews(p, now))
  })

  it('produit des avis valides, datés dans le passé, sans photo de profil', () => {
    const now = Date.now()
    for (const p of PRODUCTS) {
      for (const r of generateReviews(p, now)) {
        expect(r.rating).toBeGreaterThanOrEqual(1)
        expect(r.rating).toBeLessThanOrEqual(5)
        expect(r.text.length).toBeGreaterThan(15)
        expect(r.name).toMatch(/^\S+ [A-Z]\.$/)
        expect(r.date).toBeLessThan(now)
        expect(Object.keys(r)).not.toContain('avatar')
      }
    }
  })

  it('varie les textes (pas de copier-coller sur tout le catalogue)', () => {
    const texts = new Set(PRODUCTS.flatMap((p) => generateReviews(p).map((r) => r.text)))
    expect(texts.size).toBeGreaterThan(150)
  })

  it('la répartition des notes fait bien le total et reste cohérente avec la moyenne', () => {
    for (const [rating, total] of [[4.9, 156], [4.3, 41], [4.6, 87], [4.8, 124]] as const) {
      const b = ratingBreakdown(rating, total)
      expect(b.reduce((a, c) => a + c, 0)).toBe(total)
      expect(b.every((c) => c >= 0)).toBe(true)
      const avg = b.reduce((n, c, i) => n + c * (5 - i), 0) / total
      expect(Math.abs(avg - rating)).toBeLessThan(0.12)
    }
  })

  it('les témoignages de l’accueil n’ont pas de photo', () => {
    expect(HOME_TESTIMONIALS.length).toBeGreaterThanOrEqual(6)
    for (const t of HOME_TESTIMONIALS) expect(Object.keys(t)).not.toContain('avatar')
  })
})

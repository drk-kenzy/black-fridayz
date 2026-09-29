import { describe, expect, it } from 'vitest'
import { PRODUCTS, discountPct, fcfa, getProduct } from '../data/products'
import { COUPON_CODE, computeTotals } from '../store/cart'
import { orderStep } from '../store/account'

describe('catalogue', () => {
  it('a 24 produits aux identifiants uniques', () => {
    expect(PRODUCTS).toHaveLength(24)
    expect(new Set(PRODUCTS.map((p) => p.id)).size).toBe(24)
  })
  it('chaque produit a un prix inférieur à l’ancien prix et au moins une photo', () => {
    for (const p of PRODUCTS) {
      expect(p.price).toBeLessThan(p.oldPrice)
      expect(p.images.length).toBeGreaterThan(0)
      p.colors?.forEach((c) => c.image === undefined || expect(p.images[c.image]).toBeDefined())
      if (p.sizes) expect(p.sizes).toContain(p.defaultSize)
    }
  })
  it('calcule les remises des maquettes', () => {
    expect(discountPct(getProduct('sneakers-urban-x')!)).toBe(41)
    expect(discountPct(getProduct('sac-messenger-cuir')!)).toBe(42)
    expect(discountPct(getProduct('trench-coat-luxe-camel')!)).toBe(60)
  })
  it('formate les montants en FCFA', () => {
    expect(fcfa(49900)).toBe('49 900 FCFA')
    expect(fcfa(134700)).toBe('134 700 FCFA')
  })
})

describe('panier', () => {
  const lines = [
    { productId: 'sneakers-urban-x', qty: 1 },
    { productId: 'sac-messenger-cuir', qty: 1 },
    { productId: 'parfum-elegance-100ml', qty: 1 },
  ]
  it('reproduit les totaux de la maquette (154 700 − 20 000 = 134 700)', () => {
    const t = computeTotals(lines, COUPON_CODE, 'Cotonou')
    expect(t.subtotal).toBe(154700)
    expect(t.discount).toBe(20000)
    expect(t.total).toBe(134700)
    expect(t.freeShipping).toBe(true)
  })
  it('applique les frais de livraison sous le seuil de gratuité', () => {
    const t = computeTotals([{ productId: 'bracelet-cuir-tresse', qty: 1 }], null, 'Parakou')
    expect(t.shipping).toBe(3500)
    expect(t.total).toBe(14900 + 3500)
    expect(t.remaining).toBe(50000 - 14900)
  })
  it('la livraison est « à calculer » sans ville', () => {
    expect(computeTotals([{ productId: 'bracelet-cuir-tresse', qty: 1 }], null).shipping).toBeNull()
  })
  it('un panier vide ne coûte rien', () => {
    const t = computeTotals([], COUPON_CODE, 'Cotonou')
    expect(t.total).toBe(0)
    expect(t.discount).toBe(0)
  })
  it('ignore les produits inconnus', () => {
    expect(computeTotals([{ productId: 'inconnu', qty: 2 }], null).count).toBe(0)
  })
})

describe('suivi de commande', () => {
  const base = { number: 'SV-1', name: 'A', city: 'Cotonou', pay: 'mtn', total: 1, lines: 1, items: [] }
  it('avance avec le temps', () => {
    const h = 3600000
    expect(orderStep({ ...base, date: Date.now() - 10 * 60000 })).toBe(0)
    expect(orderStep({ ...base, date: Date.now() - 3 * h })).toBe(1)
    expect(orderStep({ ...base, date: Date.now() - 10 * h })).toBe(2)
    expect(orderStep({ ...base, date: Date.now() - 30 * h })).toBe(3)
  })
})

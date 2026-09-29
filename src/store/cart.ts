import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getProduct } from '../data/products'
import { useUi } from './ui'

export const FREE_SHIPPING_THRESHOLD = 50000
export const COUPON_CODE = 'BLACKVIBE'
export const COUPON_AMOUNT = 20000

export const CITIES: Record<string, number> = {
  Cotonou: 1500,
  'Abomey-Calavi': 2000,
  'Porto-Novo': 2000,
  Parakou: 3500,
  'Autre ville du Bénin': 3500,
}

export interface CartLine {
  productId: string
  qty: number
  size?: string
  color?: string
}

interface CartState {
  lines: CartLine[]
  coupon: string | null
  add: (line: CartLine) => void
  remove: (i: number) => void
  setQty: (i: number, qty: number) => void
  applyCoupon: (code: string) => boolean
  clear: () => void
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      // le panier démarre vide : c'est le client qui le remplit, et qui saisit lui-même son code promo
      lines: [],
      coupon: null,
      add: (line) => {
        const lines = [...get().lines]
        const i = lines.findIndex((l) => l.productId === line.productId && l.size === line.size && l.color === line.color)
        if (i >= 0) lines[i] = { ...lines[i], qty: Math.min(10, lines[i].qty + line.qty) }
        else lines.push(line)
        set({ lines })
        useUi.getState().openCart()
      },
      remove: (i) => set({ lines: get().lines.filter((_, j) => j !== i) }),
      setQty: (i, qty) => {
        if (qty < 1) return
        set({ lines: get().lines.map((l, j) => (j === i ? { ...l, qty: Math.min(10, qty) } : l)) })
      },
      applyCoupon: (code) => {
        const ok = code.trim().toUpperCase() === COUPON_CODE
        if (ok) set({ coupon: COUPON_CODE })
        return ok
      },
      clear: () => set({ lines: [], coupon: null }),
    }),
    // « v2 » : abandonne l'ancien panier de démonstration éventuellement resté dans le navigateur
    { name: 'stylevibe-cart-v2', partialize: (s) => ({ lines: s.lines, coupon: s.coupon }) },
  ),
)

export function computeTotals(lines: CartLine[], coupon: string | null, city?: string) {
  const items = lines
    .map((l, index) => ({ ...l, index, product: getProduct(l.productId)! }))
    .filter((l) => l.product)
  const count = items.reduce((n, l) => n + l.qty, 0)
  const subtotal = items.reduce((n, l) => n + l.product.price * l.qty, 0)
  const discount = coupon && subtotal > 0 ? Math.min(COUPON_AMOUNT, subtotal) : 0
  const net = subtotal - discount
  const freeShipping = net >= FREE_SHIPPING_THRESHOLD
  const shipping = freeShipping || items.length === 0 ? 0 : city ? (CITIES[city] ?? 3500) : null
  const total = net + (shipping ?? 0)
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - net)
  return { items, count, subtotal, discount, net, freeShipping, shipping, total, remaining }
}

export function useTotals(city?: string) {
  const { lines, coupon } = useCart()
  return computeTotals(lines, coupon, city)
}

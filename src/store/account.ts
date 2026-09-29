import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Order {
  number: string
  date: number
  name: string
  city: string
  pay: string
  total: number
  lines: number
  items: string[]
}

export interface User {
  name: string
  contact: string
}

interface AccountState {
  user: User | null
  orders: Order[]
  login: (u: User) => void
  logout: () => void
  addOrder: (o: Order) => void
}

export const useAccount = create<AccountState>()(
  persist(
    (set, get) => ({
      user: null,
      orders: [],
      login: (user) => set({ user }),
      logout: () => set({ user: null }),
      addOrder: (o) => set({ orders: [o, ...get().orders] }),
    }),
    { name: 'stylevibe-account' },
  ),
)

export const ORDER_STEPS = ['Commande confirmée', 'En préparation', 'En cours de livraison', 'Livrée'] as const

/** Statut de démonstration : avance avec le temps écoulé depuis la commande. */
export function orderStep(o: Order) {
  const hours = (Date.now() - o.date) / 3600000
  return hours < 1 ? 0 : hours < 6 ? 1 : hours < 24 ? 2 : 3
}

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface UserReview {
  name: string
  rating: number
  text: string
  date: number
}

interface ReviewState {
  byProduct: Record<string, UserReview[]>
  add: (productId: string, r: UserReview) => void
}

export const useReviews = create<ReviewState>()(
  persist(
    (set, get) => ({
      byProduct: {},
      add: (productId, r) => set({ byProduct: { ...get().byProduct, [productId]: [r, ...(get().byProduct[productId] ?? [])] } }),
    }),
    { name: 'stylevibe-reviews' },
  ),
)

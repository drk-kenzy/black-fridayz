import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface FavState {
  ids: string[]
  toggle: (id: string) => void
}

export const useFavorites = create<FavState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) => set({ ids: get().ids.includes(id) ? get().ids.filter((x) => x !== id) : [...get().ids, id] }),
    }),
    { name: 'stylevibe-favorites' },
  ),
)

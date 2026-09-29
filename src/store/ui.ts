import { create } from 'zustand'

interface UiState {
  cartOpen: boolean
  menuOpen: boolean
  openCart: () => void
  closeCart: () => void
  openMenu: () => void
  closeMenu: () => void
}

export const useUi = create<UiState>()((set) => ({
  cartOpen: false,
  menuOpen: false,
  openCart: () => set({ cartOpen: true, menuOpen: false }),
  closeCart: () => set({ cartOpen: false }),
  openMenu: () => set({ menuOpen: true, cartOpen: false }),
  closeMenu: () => set({ menuOpen: false }),
}))

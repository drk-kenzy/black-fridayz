import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach } from 'vitest'
import { useAccount } from '../store/account'
import { useCart } from '../store/cart'
import { useFavorites } from '../store/favorites'
import { useReviews } from '../store/reviews'
import { useUi } from '../store/ui'

// jsdom n'implémente pas ces API : on les neutralise pour éviter le bruit dans les tests
window.scrollTo = () => {}
Element.prototype.scrollIntoView = () => {}

beforeEach(() => {
  localStorage.clear()
  history.replaceState({}, '', '/')
  // les stores vivent en mémoire d'un test à l'autre : on repart d'un site neuf
  useCart.setState({ lines: [], coupon: null })
  useUi.setState({ cartOpen: false, menuOpen: false })
  useFavorites.setState({ ids: [] })
  useReviews.setState({ byProduct: {} })
  useAccount.setState({ user: null, orders: [] })
})
afterEach(() => cleanup())

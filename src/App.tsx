import { BrowserRouter, HashRouter, Route, Routes } from 'react-router-dom'
import { CheckoutLayout, Layout } from './components/Layout'
import Home from './pages/Home'
import Catalog from './pages/Catalog'
import ProductPage from './pages/Product'
import Cart from './pages/Cart'
import { Checkout, Confirmation } from './pages/Checkout'
import { About, Contact, Faq, Shipping } from './pages/Info'
import { Account, Track } from './pages/Account'
import { ErrorBoundary, Favorites, NotFound } from './pages/Misc'

/**
 * URL propres (/produit/…) quand le site est servi en HTTP(S), indispensable au référencement.
 * Ouvert directement depuis un fichier (double-clic), le navigateur ne sait pas gérer ces URL :
 * on bascule alors sur des URL en « # ».
 */
const Router = typeof location !== 'undefined' && location.protocol === 'file:' ? HashRouter : BrowserRouter

export default function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="collection" element={<Catalog />} />
            <Route path="collection/:cat" element={<Catalog />} />
            <Route path="produit/:id" element={<ProductPage />} />
            <Route path="panier" element={<Cart />} />
            <Route path="a-propos" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="faq" element={<Faq />} />
            <Route path="livraison-retours" element={<Shipping />} />
            <Route path="compte" element={<Account />} />
            <Route path="suivi" element={<Track />} />
            <Route path="favoris" element={<Favorites />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route element={<CheckoutLayout />}>
            <Route path="paiement" element={<Checkout />} />
            <Route path="confirmation" element={<Confirmation />} />
          </Route>
        </Routes>
      </Router>
    </ErrorBoundary>
  )
}

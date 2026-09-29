import { act, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from '../App'
import { useCart } from '../store/cart'
import { SITE } from '../seo'
import { useUi } from '../store/ui'

const visit = (path: string) => {
  history.pushState({}, '', path)
  return render(<App />)
}

describe('panier', () => {
  it('démarre vide, sans code promo appliqué', () => {
    visit('/')
    expect(useCart.getState().lines).toHaveLength(0)
    expect(useCart.getState().coupon).toBeNull()
    expect(screen.getByRole('button', { name: /ouvrir le panier, 0 articles/i })).toBeInTheDocument()
  })

  it('affiche un panier vide avec un lien vers la collection', () => {
    visit('/panier')
    expect(screen.getByRole('heading', { name: /votre panier est vide/i })).toBeInTheDocument()
  })

  it('ajouter un produit ouvre le tiroir et met à jour le compteur', async () => {
    const user = userEvent.setup()
    visit('/produit/sneakers-urban-x')
    await user.click(screen.getAllByRole('button', { name: /^ajouter au panier$/i })[0])
    const drawer = await screen.findByRole('dialog', { name: /panier/i })
    expect(within(drawer).getAllByText(/sneakers urban x/i).length).toBeGreaterThan(0)
    expect(useCart.getState().lines).toHaveLength(1)
    expect(useCart.getState().lines[0].size).toBe('42')
    expect(screen.getByRole('button', { name: /ouvrir le panier, 1 articles/i })).toBeInTheDocument()
  })

  it('le code promo n’est appliqué que s’il est saisi', async () => {
    const user = userEvent.setup()
    act(() => useCart.getState().add({ productId: 'sneakers-urban-x', qty: 1, size: '42' }))
    act(() => useUi.getState().closeCart())
    visit('/panier')
    expect(screen.queryByText(/réduction bf/i)).not.toBeInTheDocument()
    await user.type(screen.getByLabelText(/code promo/i), 'BLACKVIBE')
    await user.click(screen.getByRole('button', { name: /appliquer/i }))
    expect(await screen.findByText(/réduction bf/i)).toBeInTheDocument()
  })
})

describe('catalogue', () => {
  it('une page catégorie n’affiche que ses produits, avec un vrai titre H1', () => {
    visit('/collection/sneakers')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/sneakers/i)
    expect(screen.getAllByRole('article')).toHaveLength(4)
  })

  it('la collection est paginée sur 3 pages de 8 produits', () => {
    visit('/collection')
    expect(screen.getAllByRole('article')).toHaveLength(8)
    expect(screen.getByRole('link', { name: '3' })).toBeInTheDocument()
  })

  it('une catégorie inconnue renvoie vers la collection', () => {
    visit('/collection/nimportequoi')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/collection/i)
  })
})

describe('recherche', () => {
  it('propose des suggestions de produits', async () => {
    const user = userEvent.setup()
    visit('/')
    await user.type(screen.getAllByRole('combobox')[0], 'mont')
    const list = await screen.findByRole('listbox')
    expect(within(list).getAllByRole('option').length).toBeGreaterThan(0)
    expect(within(list).getByText(/montre classic gold/i)).toBeInTheDocument()
  })
})

describe('référencement dans le navigateur', () => {
  it('la fiche produit met à jour titre, description, canonique et JSON-LD', async () => {
    visit('/produit/montre-classic-gold')
    await waitFor(() => expect(document.title).toMatch(/montre classic gold/i))
    expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute('href', `${SITE.url}/produit/montre-classic-gold`)
    expect(document.querySelector('meta[name="description"]')?.getAttribute('content')).toMatch(/59 900 FCFA/)
    const ld = [...document.querySelectorAll('script[data-seo-ld]')].map((s) => JSON.parse(s.textContent!))
    expect(ld.some((o) => o['@type'] === 'Product')).toBe(true)
    expect(ld.some((o) => o['@type'] === 'BreadcrumbList')).toBe(true)
  })

  it('les pages privées ne sont pas indexées', async () => {
    visit('/panier')
    await waitFor(() => expect(document.querySelector('meta[name="robots"]')?.getAttribute('content')).toMatch(/noindex/))
  })

  it('une seule balise H1 par page', () => {
    for (const path of ['/', '/collection', '/produit/sneakers-urban-x', '/faq', '/a-propos']) {
      const { unmount } = visit(path)
      expect(screen.getAllByRole('heading', { level: 1 }), path).toHaveLength(1)
      unmount()
    }
  })
})

describe('paiement', () => {
  it('redirige vers le panier s’il est vide', () => {
    visit('/paiement')
    expect(screen.getByRole('heading', { name: /votre panier est vide/i })).toBeInTheDocument()
  })

  it('refuse un formulaire incomplet et signale les erreurs', async () => {
    const user = userEvent.setup()
    act(() => useCart.getState().add({ productId: 'bracelet-cuir-tresse', qty: 1 }))
    act(() => useUi.getState().closeCart())
    visit('/paiement')
    await user.click(screen.getByRole('button', { name: /confirmer ma commande/i }))
    expect(await screen.findByText(/indiquez votre nom complet/i)).toBeInTheDocument()
    expect(screen.getByText(/numéro mtn momo invalide/i)).toBeInTheDocument()
  })

  it('ajoute les frais de livraison sous 50 000 FCFA', () => {
    act(() => useCart.getState().add({ productId: 'bracelet-cuir-tresse', qty: 1 }))
    act(() => useUi.getState().closeCart())
    visit('/paiement')
    expect(screen.getByText(/16 400 FCFA/)).toBeInTheDocument()
  })
})

describe('avis', () => {
  it('affiche 6 avis puis en charge 6 de plus', async () => {
    const user = userEvent.setup()
    visit('/produit/sneakers-urban-x')
    expect(screen.getAllByText(/achat vérifié/i)).toHaveLength(6)
    await user.click(screen.getByRole('button', { name: /voir plus d'avis/i }))
    expect(screen.getAllByText(/achat vérifié/i)).toHaveLength(12)
  })

  it('un avis publié apparaît en tête de liste', async () => {
    const user = userEvent.setup()
    visit('/produit/sneakers-urban-x')
    await user.type(screen.getByLabelText(/votre prénom/i), 'Awa')
    await user.type(screen.getByLabelText(/votre avis/i), 'Très confortables, livraison rapide.')
    await user.click(screen.getByRole('button', { name: /publier mon avis/i }))
    expect(await screen.findByText(/merci pour votre avis/i)).toBeInTheDocument()
    expect(screen.getByText(/très confortables, livraison rapide\./i)).toBeInTheDocument()
  })
})

import { useEffect, useRef, type ReactNode } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { ArrowRight, Heart, Minus, Plus, ShoppingBag, Trash2, User, X } from 'lucide-react'
import { fcfa } from '../data/products'
import { useCart, useTotals } from '../store/cart'
import { useAccount } from '../store/account'
import { useFavorites } from '../store/favorites'
import { useUi } from '../store/ui'
import { Img, ShippingBar } from './ui'
import { SearchBox } from './SearchBox'

function Panel({ open, onClose, side, label, children }: { open: boolean; onClose: () => void; side: 'left' | 'right'; label: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const prev = document.activeElement as HTMLElement | null
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'Tab' && ref.current) {
        const f = ref.current.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),input,select,textarea')
        if (!f.length) return
        const first = f[0], last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    ref.current?.querySelector<HTMLElement>('[data-autofocus]')?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      prev?.focus?.()
    }
  }, [open, onClose])

  return (
    <div className={`fixed inset-0 z-[60] ${open ? '' : 'pointer-events-none'}`} aria-hidden={!open}>
      <div onClick={onClose} className={`absolute inset-0 bg-black/45 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`} />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        className={`absolute top-0 flex h-full w-full max-w-[420px] flex-col bg-cream shadow-2xl transition-transform duration-300 ${side === 'right' ? 'right-0' : 'left-0'} ${
          open ? 'translate-x-0' : side === 'right' ? 'translate-x-full' : '-translate-x-full'
        }`}
      >
        {open && children}
      </div>
    </div>
  )
}

export function CartDrawer() {
  const { cartOpen, closeCart } = useUi()
  const navigate = useNavigate()
  const { remove, setQty } = useCart()
  const t = useTotals()
  const go = (to: string) => { closeCart(); navigate(to) }

  return (
    <Panel open={cartOpen} onClose={closeCart} side="right" label="Panier">
      <div className="flex items-center justify-between border-b border-line px-6 py-5">
        <h2 className="font-display text-3xl">Panier ({t.count})</h2>
        <button data-autofocus onClick={closeCart} aria-label="Fermer le panier" className="grid size-9 place-items-center hover:bg-sand"><X size={18} /></button>
      </div>
      {t.items.length === 0 ? (
        <div className="grid flex-1 place-items-center px-6 text-center">
          <div>
            <ShoppingBag size={34} className="mx-auto text-tan-dark" />
            <p className="mt-4 font-display text-2xl">Votre panier est vide</p>
            <button onClick={() => go('/collection')} className="btn-dark mt-6 px-7 py-3.5">Voir la collection</button>
          </div>
        </div>
      ) : (
        <>
          <div className="px-6 pt-5"><ShippingBar /></div>
          <ul className="flex-1 divide-y divide-line overflow-y-auto px-6">
            {t.items.map((l) => (
              <li key={`${l.productId}-${l.index}`} className="flex gap-4 py-5">
                <Link to={`/produit/${l.productId}`} onClick={closeCart} className="block size-20 shrink-0 overflow-hidden bg-sand"><Img src={l.product.images[0]} alt={l.product.name} className="size-full object-cover" /></Link>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[15px] font-semibold">{l.product.name}</p>
                  <p className="text-xs text-ink/60">{[l.size && `Taille ${l.size}`, l.color].filter(Boolean).join(' • ')}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="inline-flex items-center border border-line bg-white">
                      <button onClick={() => setQty(l.index, l.qty - 1)} aria-label="Diminuer" className="grid size-8 place-items-center"><Minus size={12} /></button>
                      <span className="w-7 text-center text-sm">{l.qty}</span>
                      <button onClick={() => setQty(l.index, l.qty + 1)} aria-label="Augmenter" className="grid size-8 place-items-center"><Plus size={12} /></button>
                    </div>
                    <span className="text-sm font-semibold text-brand">{fcfa(l.product.price * l.qty)}</span>
                  </div>
                </div>
                <button onClick={() => remove(l.index)} aria-label={`Supprimer ${l.product.name}`} className="self-start p-1 text-ink/65 hover:text-brand"><Trash2 size={15} /></button>
              </li>
            ))}
          </ul>
          <div className="border-t border-line bg-white px-6 py-5">
            <div className="flex justify-between text-sm"><span className="text-ink/60">Sous-total</span><span className="font-medium">{fcfa(t.subtotal)}</span></div>
            {t.discount > 0 && <div className="mt-1 flex justify-between text-sm text-brand"><span>Réduction BF</span><span>-{fcfa(t.discount)}</span></div>}
            <div className="mt-3 flex items-baseline justify-between"><span className="font-semibold">Total</span><span className="text-xl font-bold">{fcfa(t.total)}</span></div>
            <button onClick={() => go('/paiement')} className="btn-dark mt-4 flex w-full items-center justify-center gap-3 py-4">Commander <ArrowRight size={15} /></button>
            <button onClick={() => go('/panier')} className="btn-outline mt-2 w-full py-3">Voir le panier</button>
          </div>
        </>
      )}
    </Panel>
  )
}

const MENU = [
  { to: '/', label: 'Accueil', end: true },
  { to: '/collection', label: 'Collection' },
  { to: '/collection?sort=popular', label: 'Tendances', match: false },
  { to: '/a-propos', label: 'À Propos' },
  { to: '/faq', label: 'FAQ' },
  { to: '/livraison-retours', label: 'Livraison & Retours' },
  { to: '/contact', label: 'Contact' },
]

export function MobileMenu() {
  const { menuOpen, closeMenu } = useUi()
  const user = useAccount((s) => s.user)
  const favs = useFavorites((s) => s.ids.length)
  const { pathname } = useLocation()

  useEffect(() => { closeMenu() }, [pathname, closeMenu])

  return (
    <Panel open={menuOpen} onClose={closeMenu} side="left" label="Menu">
      <div className="flex items-center justify-between border-b border-line px-6 py-5">
        <span className="font-display text-3xl italic">StyleVibe</span>
        <button data-autofocus onClick={closeMenu} aria-label="Fermer le menu" className="grid size-9 place-items-center hover:bg-sand"><X size={18} /></button>
      </div>
      <div className="px-6 pt-5"><SearchBox onDone={closeMenu} /></div>
      <nav className="flex-1 overflow-y-auto px-6 py-4" aria-label="Menu principal">
        {MENU.map((m) => (
          <NavLink key={m.label} to={m.to} end={m.end} className={({ isActive }) => `block border-b border-line py-4 text-lg ${isActive && m.match !== false ? 'font-semibold' : 'text-ink/75'}`}>{m.label}</NavLink>
        ))}
      </nav>
      <div className="grid grid-cols-2 gap-3 border-t border-line px-6 py-5">
        <Link to="/compte" className="btn-outline flex items-center justify-center gap-2 py-3"><User size={14} /> {user ? user.name.split(' ')[0] : 'Compte'}</Link>
        <Link to="/favoris" className="btn-outline flex items-center justify-center gap-2 py-3"><Heart size={14} /> Favoris ({favs})</Link>
      </div>
    </Panel>
  )
}

import { useEffect } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { Check, Heart, Mail, MapPin, Menu, Phone, RefreshCw, ShieldCheck, ShoppingBag, Truck, User, MessageCircle } from 'lucide-react'
import { useTotals } from '../store/cart'
import { useAccount } from '../store/account'
import { useFavorites } from '../store/favorites'
import { useUi } from '../store/ui'
import { SearchBox } from './SearchBox'
import { CartDrawer, MobileMenu } from './Drawers'
import { CATEGORIES } from '../data/products'
import { SITE } from '../seo'

const Instagram = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".6" fill="currentColor" /></svg>
)
const Facebook = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
)

export const Logo = ({ light = false }: { light?: boolean }) => (
  <Link to="/" className="inline-block leading-none">
    <span className={`font-display text-[34px] italic ${light ? 'text-white' : 'text-ink'}`}>StyleVibe</span>
    <span className="mt-0.5 block text-[8px] font-semibold uppercase tracking-[.14em] text-tan-dark">L'élégance béninoise</span>
  </Link>
)

function TopBar() {
  return (
    <div className="bg-ink px-4 py-2 text-center text-[12px] text-white">
      <span className="mr-2.5 bg-brand px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide">Black Friday</span>
      Livraison gratuite à partir de 50 000 FCFA partout au Bénin. Code: BLACKVIBE
    </div>
  )
}

const shopNav = [
  { to: '/', label: 'Accueil', end: true },
  { to: '/collection', label: 'Collection' },
  { to: '/collection?sort=popular', label: 'Tendances', match: false },
  { to: '/contact', label: 'Contact' },
]
const infoNav = [
  { to: '/', label: 'Accueil', end: true },
  { to: '/a-propos', label: 'À Propos' },
  { to: '/faq', label: 'FAQ' },
  { to: '/livraison-retours', label: 'Livraison & Retours' },
]

function Header() {
  const { pathname } = useLocation()
  const { count } = useTotals()
  const user = useAccount((s) => s.user)
  const favs = useFavorites((s) => s.ids.length)
  const { openCart, openMenu } = useUi()
  const info = ['/a-propos', '/faq', '/livraison-retours', '/contact'].includes(pathname)
  const nav = info ? infoNav : shopNav

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-cream/95 backdrop-blur">
      <div className="container-x grid h-[76px] grid-cols-[1fr_auto_1fr] items-center gap-4">
        <div className="flex items-center">
          <button onClick={openMenu} aria-label="Ouvrir le menu" className="-ml-2 grid size-10 place-items-center lg:hidden"><Menu size={22} /></button>
          <nav className="hidden items-center gap-7 text-sm lg:flex" aria-label="Navigation principale">
            {nav.map((n) => (
              <NavLink
                key={n.label}
                to={n.to}
                end={'end' in n ? n.end : false}
                className={({ isActive }) => `transition hover:text-ink ${isActive && (n as { match?: boolean }).match !== false ? 'font-semibold text-ink' : 'text-ink/70'}`}
              >
                {n.label}
              </NavLink>
            ))}
          </nav>
        </div>
        <Logo />
        <div className="flex items-center justify-end gap-4 sm:gap-5">
          <SearchBox className="hidden w-52 md:block" />
          {info ? (
            <Link to="/contact" className="hidden items-center gap-2 text-sm font-medium xl:flex"><Phone size={16} /> Contact</Link>
          ) : (
            <Link to="/compte" className="hidden items-center gap-2 text-sm font-medium sm:flex"><User size={16} /> {user ? user.name.split(' ')[0] : 'Compte'}</Link>
          )}
          <Link to="/favoris" className="relative hidden sm:block" aria-label={`Favoris, ${favs}`}>
            <Heart size={18} />
            {favs > 0 && <span className="absolute -right-2 -top-2 grid size-4 place-items-center rounded-full bg-brand text-[9px] font-bold text-white">{favs}</span>}
          </Link>
          <button onClick={openCart} className="relative flex items-center gap-2 text-sm font-medium" aria-label={`Ouvrir le panier, ${count} articles`}>
            <span className="relative">
              <ShoppingBag size={18} />
              {count > 0 && <span className="absolute -right-2 -top-2 grid size-4 place-items-center rounded-full bg-brand text-[9px] font-bold text-white">{count}</span>}
            </span>
            <span className="hidden sm:inline">Panier</span>
          </button>
        </div>
      </div>
    </header>
  )
}

export function TrustBar() {
  const items = [
    { icon: Truck, t: 'Livraison express', s: 'Cotonou, Calavi & Porto-Novo sous 24h' },
    { icon: ShieldCheck, t: 'Paiement sécurisé', s: 'MTN MoMo, Moov Money & Cartes' },
    { icon: RefreshCw, t: 'Échange gratuit', s: 'Sous 3 jours si la taille ne convient pas' },
    { icon: MessageCircle, t: 'Service WhatsApp', s: 'Conseiller dédié au +229 50 00 00 00' },
  ]
  return (
    <section className="bg-sand/70">
      <div className="container-x grid gap-6 py-9 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(({ icon: Icon, t, s }) => (
          <div key={t} className="flex items-center gap-4">
            <span className="grid size-12 shrink-0 place-items-center rounded-full bg-white text-tan-dark"><Icon size={19} /></span>
            <div>
              <p className="text-[13px] font-bold uppercase tracking-wide">{t}</p>
              <p className="text-xs text-ink/60">{s}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export function Footer({ minimal = false }: { minimal?: boolean }) {
  const col = 'text-[13px] font-semibold uppercase tracking-wider text-tan-dark'
  const link = 'text-sm text-white/75 transition hover:text-white'
  return (
    <footer className="bg-[#121212] text-white">
      <div className="container-x py-14">
        <div className={`grid gap-10 ${minimal ? 'md:grid-cols-[2fr_1fr_1fr]' : 'md:grid-cols-[2fr_1fr_1fr_1.3fr]'}`}>
          <div>
            <Logo light />
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/65">
              {minimal
                ? "La destination mode & lifestyle d'exception au Bénin. Qualité supérieure garantie et service client ultra-réactif."
                : "La destination mode & lifestyle incontournable au Bénin. Notre mission est de vous proposer des collections d'exception sélectionnées pour sublimer votre quotidien."}
            </p>
          </div>
          {!minimal && (
            <div className="space-y-3.5">
              <h2 className={col}>Boutique</h2>
              <Link className={`block ${link}`} to="/collection">Toutes les Collections</Link>
              <Link className={`block ${link}`} to="/collection?sort=discount">Promotions Black Friday</Link>
              <Link className={`block ${link}`} to="/collection?sort=new">Nouveautés</Link>
              <Link className={`block ${link}`} to="/collection?sort=popular">Bestsellers</Link>
              {CATEGORIES.map((c) => <Link key={c.id} className={`block ${link}`} to={`/collection/${c.id}`}>{c.label}</Link>)}
            </div>
          )}
          <div className="space-y-3.5">
            <h2 className={col}>Aide &amp; Service</h2>
            {!minimal && <Link className={`block ${link}`} to="/suivi">Suivre ma commande</Link>}
            <Link className={`block ${link}`} to="/livraison-retours">{minimal ? 'Échanges & Retours' : 'Politique de retour'}</Link>
            <Link className={`block ${link}`} to="/faq">{minimal ? 'FAQ' : 'Foire aux questions'}</Link>
            {!minimal && <a className={`block ${link}`} href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noreferrer">WhatsApp Assistant</a>}
          </div>
          <div className="space-y-3.5">
            <h2 className={col}>{minimal ? 'Contact' : 'Nous contacter'}</h2>
            <p className={`flex items-center gap-3 ${link}`}><Phone size={15} /> +229 50 00 00 00</p>
            <p className={`flex items-center gap-3 ${link}`}><Mail size={15} /> contact@stylevibe.bj</p>
            {!minimal && <p className={`flex items-center gap-3 ${link}`}><MapPin size={15} /> Fidjrossè, Cotonou, Bénin</p>}
          </div>
        </div>
        <div className="mt-14 flex items-center justify-between border-t border-white/15 pt-7 text-[13px] text-white/60">
          <p>© {new Date().getFullYear()} StyleVibe. Tous droits réservés.{minimal ? '' : ' Conçu pour le Bénin.'}</p>
          <div className="flex gap-3">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="grid size-9 place-items-center rounded-full bg-white/10 hover:bg-white/20"><Instagram size={15} /></a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="grid size-9 place-items-center rounded-full bg-white/10 hover:bg-white/20"><Facebook size={15} /></a>
          </div>
        </div>
      </div>
    </footer>
  )
}

/** Bouton WhatsApp flottant : en Afrique de l'Ouest, beaucoup d'achats se concluent par message. */
function WhatsAppFloat() {
  const { pathname } = useLocation()
  // sur les fiches produit (mobile), la barre d'achat collante occupe le bas de l'écran
  const hideOnMobile = pathname.startsWith('/produit')
  return (
    <a
      href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent('Bonjour StyleVibe, j’ai une question sur la collection Black Friday.')}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Discuter avec un conseiller sur WhatsApp"
      className={`fixed bottom-5 left-5 z-30 place-items-center rounded-full bg-[#1f8f4d] text-white shadow-lg transition hover:scale-105 size-12 sm:size-14 ${hideOnMobile ? 'hidden lg:grid' : 'grid'}`}
    >
      <MessageCircle size={26} />
    </a>
  )
}

export function Layout() {
  const { pathname, search } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname, search])
  return (
    <>
      <a href="#contenu" onClick={(e) => { e.preventDefault(); document.getElementById('contenu')?.focus() }} className="sr-only z-[70] bg-ink px-4 py-2 text-white focus:not-sr-only focus:fixed focus:left-2 focus:top-2">Aller au contenu</a>
      <TopBar />
      <Header />
      <main id="contenu" tabIndex={-1} className="outline-none"><Outlet /></main>
      <Footer />
      <WhatsAppFloat />
      <CartDrawer />
      <MobileMenu />
    </>
  )
}

export function CheckoutLayout() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  const done = pathname === '/confirmation'
  const steps = [
    { label: 'Panier', state: 'done' },
    { label: 'Informations', state: done ? 'done' : 'current' },
    { label: 'Confirmation', state: done ? 'current' : 'todo' },
  ]
  return (
    <>
      <header className="border-b border-line bg-cream">
        <div className="container-x grid h-[88px] grid-cols-[1fr_auto_1fr] items-center">
          <Logo />
          <ol className="hidden items-center gap-5 text-sm md:flex">
            {steps.map((s, i) => (
              <li key={s.label} className="flex items-center gap-5">
                {i > 0 && <span className="h-px w-10 bg-line" />}
                <span className={`flex items-center gap-2 ${s.state === 'done' ? 'text-tan-dark' : s.state === 'current' ? 'font-semibold' : 'text-ink/65'}`}>
                  <span className={`grid size-6 place-items-center rounded-full text-xs text-white ${s.state === 'done' ? 'bg-tan' : s.state === 'current' ? 'bg-ink' : 'bg-line text-ink/60'}`}>
                    {s.state === 'done' ? <Check size={13} /> : i + 1}
                  </span>
                  {s.label}
                </span>
              </li>
            ))}
          </ol>
          <Link to="/collection" className="justify-self-end text-sm font-medium">← Retour au shopping</Link>
        </div>
      </header>
      <main><Outlet /></main>
      <Footer minimal />
    </>
  )
}

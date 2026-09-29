import { useEffect, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, Heart, Plus, ShoppingBag, Star, Truck } from 'lucide-react'
import { discountPct, fcfa, type Product } from '../data/products'
import { FREE_SHIPPING_THRESHOLD, useCart, useTotals } from '../store/cart'
import { useFavorites } from '../store/favorites'

type ImgProps = { src: string; alt: string; className?: string; eager?: boolean; sizes?: string }

const WIDTHS = [320, 480, 640, 900, 1200, 1600]
/** Unsplash sait redimensionner à la volée : on sert une image adaptée à chaque écran (LCP et données mobiles). */
const resize = (src: string, w: number) => src.replace(/([?&])w=\d+/, `$1w=${w}`)
const isUnsplash = (src: string) => src.includes('images.unsplash.com')

/** `key={src}` remet l'état de chargement à zéro quand la photo change. */
export const Img = (props: ImgProps) => <ImgInner key={props.src} {...props} />

function ImgInner({ src, alt, className = '', eager = false, sizes = '100vw' }: ImgProps) {
  const [state, setState] = useState<'loading' | 'ok' | 'failed'>('loading')
  if (state === 'failed') return <div className={`bg-gradient-to-br from-sand to-line ${className}`} role="img" aria-label={alt} />
  const responsive = isUnsplash(src)
  return (
    <img
      src={responsive ? resize(src, 640) : src}
      srcSet={responsive ? WIDTHS.map((w) => `${resize(src, w)} ${w}w`).join(', ') : undefined}
      sizes={responsive ? sizes : undefined}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      // @ts-expect-error fetchpriority n'est pas encore typé dans React 19
      fetchpriority={eager ? 'high' : undefined}
      onLoad={() => setState('ok')}
      onError={() => setState('failed')}
      className={`${className} transition-opacity duration-500 ${state === 'ok' ? 'opacity-100' : 'animate-pulse bg-sand opacity-0'}`}
    />
  )
}

const CARD_SIZES = '(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw'

export function useDocTitle(title: string) {
  useEffect(() => {
    document.title = title ? `${title} | StyleVibe` : "StyleVibe | Black Friday, l'élégance béninoise"
  }, [title])
}

export function HeartButton({ id, className = '' }: { id: string; className?: string }) {
  const { ids, toggle } = useFavorites()
  const on = ids.includes(id)
  return (
    <button
      type="button"
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(id) }}
      aria-pressed={on}
      aria-label={on ? 'Retirer des favoris' : 'Ajouter aux favoris'}
      className={`grid size-9 place-items-center rounded-full bg-white/90 shadow transition hover:scale-110 ${className}`}
    >
      <Heart size={16} className={on ? 'fill-brand text-brand' : 'text-ink'} />
    </button>
  )
}

export function Avatar({ src, name }: { src?: string; name: string }) {
  const [failed, setFailed] = useState(!src)
  if (failed)
    return (
      <span className="grid size-9 place-items-center rounded-full bg-sand text-[11px] font-semibold text-tan-dark">
        {name.slice(0, 1)}
      </span>
    )
  return <img src={src} alt="" onError={() => setFailed(true)} className="size-9 rounded-full object-cover" />
}

export function Stars({ value, size = 12 }: { value: number; size?: number }) {
  return (
    <span className="inline-flex gap-0.5" aria-label={`Note ${value} sur 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={size} className={i <= Math.round(value) ? 'fill-tan text-tan-dark' : 'text-tan/40'} />
      ))}
    </span>
  )
}

export function useCountdown(target: number) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])
  const s = Math.max(0, Math.floor((target - now) / 1000))
  return { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 }
}

export const pad = (n: number) => String(n).padStart(2, '0')

export function Price({ p, size = 'md' }: { p: Pick<Product, 'price' | 'oldPrice'>; size?: 'md' | 'lg' }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className={`font-semibold text-brand ${size === 'lg' ? 'text-3xl' : 'text-[17px]'}`}>{fcfa(p.price)}</span>
      <span className={`text-ink/60 line-through ${size === 'lg' ? 'text-base' : 'text-xs'}`}>{fcfa(p.oldPrice)}</span>
    </div>
  )
}

export function ProductCard({ p, label = 'StyleVibe Exclusif', cta = 'Ajouter au panier', priority = false }: { p: Product; label?: string; cta?: string; priority?: boolean }) {
  const add = useCart((s) => s.add)
  return (
    <article className="group flex flex-col border border-line bg-white">
      <div className="relative aspect-[4/3.4] overflow-hidden bg-sand">
        <Link to={`/produit/${p.id}`} tabIndex={-1} className="block size-full">
          <Img src={p.images[0]} alt={p.name} sizes={CARD_SIZES} eager={priority} className="size-full object-cover transition duration-500 group-hover:scale-105" />
        </Link>
        <span className="pointer-events-none absolute right-0 top-3 bg-brand px-2 py-1 text-[11px] font-semibold text-white">-{discountPct(p)}%</span>
        <HeartButton id={p.id} className="absolute left-3 top-3" />
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-tan-dark">{label}</span>
        <h3 className="text-[15px] font-medium"><Link to={`/produit/${p.id}`} className="hover:underline">{p.name}</Link></h3>
        <div className="flex items-center gap-1.5 text-xs text-ink/70">
          <Stars value={p.rating} /> {p.rating}
        </div>
        <div className="mt-1"><Price p={p} /></div>
        <button
          onClick={() => add({ productId: p.id, qty: 1, size: p.defaultSize, color: p.colors?.[0]?.name })}
          className="btn-outline mt-3 flex w-full items-center justify-center gap-2 py-2.5"
        >
          <ShoppingBag size={14} /> {cta}
        </button>
      </div>
    </article>
  )
}

export function ShippingBar() {
  const { net, remaining, freeShipping } = useTotals()
  const pct = Math.min(100, (net / FREE_SHIPPING_THRESHOLD) * 100)
  return (
    <div className="border border-line bg-sand/70 px-5 py-4">
      <p className="flex items-center gap-2.5 text-sm">
        <Truck size={18} />
        {freeShipping ? (
          <span className="font-medium">Bravo ! Vous bénéficiez de la livraison gratuite partout au Bénin.</span>
        ) : (
          <span>
            Plus que <b className="text-brand">{fcfa(remaining)}</b> d'achats pour obtenir la livraison gratuite dans tout le Bénin !
          </span>
        )}
      </p>
      <div className="mt-3 flex items-center gap-3 text-xs font-medium">
        <span>{fcfa(net)}</span>
        <div className="h-1.5 flex-1 bg-white">
          <div className="h-full bg-tan transition-all" style={{ width: `${pct}%` }} />
        </div>
        <span>{fcfa(FREE_SHIPPING_THRESHOLD)}</span>
      </div>
    </div>
  )
}

export function SectionTitle({ eyebrow, title, right, center, id }: { eyebrow?: string; title: string; right?: ReactNode; center?: boolean; id?: string }) {
  return (
    <div className={`mb-8 flex gap-4 ${center ? 'flex-col items-center text-center' : 'items-end justify-between'}`}>
      <div>
        {eyebrow && <p className={`mb-2 text-[11px] font-semibold uppercase tracking-wider ${center ? 'text-tan-dark' : 'text-brand'}`}>{eyebrow}</p>}
        <h2 id={id} className="font-display text-4xl leading-none md:text-[40px]">{title}</h2>
      </div>
      {right}
    </div>
  )
}

export function Breadcrumb({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <nav className="container-x py-5 text-[13px] text-ink/60" aria-label="Fil d'Ariane">
      {items.map((it, i) => (
        <span key={i}>
          {i > 0 && <span className="mx-2.5">›</span>}
          {it.to ? <Link to={it.to} className="hover:text-ink">{it.label}</Link> : <span className="font-medium text-ink">{it.label}</span>}
        </span>
      ))}
    </nav>
  )
}

export function AccordionItem({ q, a, defaultOpen = false, plus = false }: { q: string; a: ReactNode; defaultOpen?: boolean; plus?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border border-line bg-white">
      <button onClick={() => setOpen(!open)} aria-expanded={open} className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left text-[15px] font-semibold">
        {q}
        {plus ? (
          <span className="grid size-7 shrink-0 place-items-center rounded-full bg-sand text-tan-dark">
            <Plus size={14} className={`transition ${open ? 'rotate-45' : ''}`} />
          </span>
        ) : (
          <ChevronDown size={16} className={`shrink-0 transition ${open ? 'rotate-180' : ''}`} />
        )}
      </button>
      {open && <div className="px-6 pb-5 text-sm leading-relaxed text-ink/70">{a}</div>}
    </div>
  )
}

import { useMemo } from 'react'
import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import { Breadcrumb, ProductCard } from '../components/ui'
import { TrustBar } from '../components/Layout'
import { CATEGORIES, CATEGORY_SEO, PRODUCTS, discountPct } from '../data/products'
import { catalogSeo, useSeo } from '../seo'

const PAGE_SIZE = 8
const SORTS = [
  ['popular', 'Popularité'],
  ['new', 'Nouveautés'],
  ['discount', 'Meilleures remises'],
  ['price-asc', 'Prix croissant'],
  ['price-desc', 'Prix décroissant'],
] as const
const PRICES = [
  ['', 'Tous les prix'],
  ['0-25000', 'Moins de 25 000 FCFA'],
  ['25000-50000', 'De 25 000 à 50 000 FCFA'],
  ['50000-', 'Plus de 50 000 FCFA'],
] as const

const plain = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

export default function Catalog() {
  const { cat: catParam } = useParams()
  const [params, setParams] = useSearchParams()
  // ancien format /collection?cat=… conservé pour les liens existants
  const cat = catParam ?? params.get('cat') ?? ''
  const category = CATEGORIES.find((c) => c.id === cat)
  const sort = params.get('sort') ?? 'popular'
  const price = params.get('price') ?? ''
  const disc = Number(params.get('disc') ?? 0)
  const rawQ = params.get('q') ?? ''
  const q = plain(rawQ)
  const page = Math.max(1, Number(params.get('page') ?? 1))
  const filtering = Boolean(rawQ || price || disc || sort !== 'popular')

  const seo = catalogSeo(category?.id)
  useSeo({
    ...seo,
    // les pages filtrées ne sont pas indexées (contenu dupliqué) ; la pagination garde sa propre URL
    noindex: filtering,
    path: page > 1 && !filtering ? `${seo.path}?page=${page}` : seo.path,
  })

  const set = (patch: Record<string, string>) => {
    const next = new URLSearchParams(params)
    Object.entries(patch).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)))
    if (!('page' in patch)) next.delete('page')
    setParams(next)
  }
  const query = (patch: Record<string, string> = {}) => {
    const next = new URLSearchParams(params)
    next.delete('cat')
    Object.entries(patch).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)))
    const s = next.toString()
    return s ? `?${s}` : ''
  }

  const filtered = useMemo(() => {
    const [min, max] = price ? price.split('-').map((x) => (x ? Number(x) : null)) : [null, null]
    const list = PRODUCTS.filter(
      (p) =>
        (!cat || p.category === cat) &&
        (!q || plain(`${p.name} ${p.category}`).includes(q)) &&
        discountPct(p) >= disc &&
        (min === null || p.price >= min) &&
        (max === null || p.price < max),
    )
    const by: Record<string, (a: (typeof list)[number], b: (typeof list)[number]) => number> = {
      popular: (a, b) => b.reviews - a.reviews,
      new: (a, b) => b.createdAt - a.createdAt,
      discount: (a, b) => discountPct(b) - discountPct(a),
      'price-asc': (a, b) => a.price - b.price,
      'price-desc': (a, b) => b.price - a.price,
    }
    return [...list].sort(by[sort] ?? by.popular)
  }, [cat, q, price, sort, disc])

  if (catParam && !category) return <Navigate to="/collection" replace />

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const current = Math.min(page, pages)
  const visible = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE)
  const selectCls = 'cursor-pointer appearance-none bg-transparent pr-5 font-semibold outline-none'
  const s = category ? CATEGORY_SEO[category.id] : null
  const pageLink = (n: number) => `${category ? `/collection/${category.id}` : '/collection'}${query({ page: n > 1 ? String(n) : '' })}`

  return (
    <>
      <Breadcrumb items={category ? [{ label: 'Accueil', to: '/' }, { label: 'Collection', to: '/collection' }, { label: category.label }] : [{ label: 'Accueil', to: '/' }, { label: 'Collection Black Friday' }]} />
      <section className="container-x pt-4">
        <span className="inline-block bg-brand px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-white">Promo limitée</span>
        <h1 className="mt-6 font-display text-5xl uppercase leading-none md:text-[64px]">
          {s ? <>{s.h1} <span className="text-brand">Black Friday</span></> : <>Collection <span className="text-brand">Black Friday</span></>}
        </h1>
        <p className="mt-6 max-w-3xl text-[15px] leading-relaxed text-ink/70">
          {s ? s.intro : "Toutes nos pièces d'exception à prix exclusifs, garanties authentiques et prêtes pour livraison immédiate sur Cotonou, Calavi & environs."}
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border border-line bg-white px-5 py-4">
          <nav aria-label="Catégories" className="flex flex-wrap gap-2.5">
            {[{ id: '', label: 'Tous' }, ...CATEGORIES].map((c) => (
              <Link
                key={c.id}
                to={`${c.id ? `/collection/${c.id}` : '/collection'}${query()}`}
                aria-current={cat === c.id ? 'page' : undefined}
                className={`rounded-full border px-5 py-2 text-[13px] font-medium transition ${cat === c.id ? 'border-ink bg-ink text-white' : 'border-line bg-white hover:border-ink'}`}
              >
                {c.label}
              </Link>
            ))}
          </nav>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-[13px]">
            <label className="relative flex items-center gap-1.5 text-ink/70">
              Prix:
              <select value={price} onChange={(e) => set({ price: e.target.value })} className={`${selectCls} text-ink`}>
                {PRICES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
              <ChevronDown size={13} className="pointer-events-none absolute right-0 text-ink" />
            </label>
            <span className="hidden h-5 w-px bg-line sm:block" />
            <label className="relative flex items-center gap-1.5 text-ink/70">
              Remise:
              <select value={String(disc || '')} onChange={(e) => set({ disc: e.target.value })} className={`${selectCls} text-ink`}>
                <option value="">Toutes</option>
                <option value="40">-40% et plus</option>
                <option value="50">-50% et plus</option>
              </select>
              <ChevronDown size={13} className="pointer-events-none absolute right-0 text-ink" />
            </label>
            <span className="hidden h-5 w-px bg-line sm:block" />
            <label className="relative flex items-center gap-1.5 text-ink/70">
              Trier par:
              <select value={sort} onChange={(e) => set({ sort: e.target.value })} className={`${selectCls} text-ink`}>
                {SORTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
              <ChevronDown size={13} className="pointer-events-none absolute right-0 text-ink" />
            </label>
          </div>
        </div>

        <p className="mt-4 text-[13px] text-ink/70" role="status" aria-live="polite">
          {filtered.length} article{filtered.length > 1 ? 's' : ''}{rawQ ? ` pour « ${rawQ} »` : ''}
        </p>
        {visible.length === 0 ? (
          <div className="py-24 text-center">
            <p className="font-display text-3xl">Aucun article ne correspond à votre recherche</p>
            <Link to="/collection" className="btn-dark mt-6 inline-block px-6 py-3">Voir toute la collection</Link>
          </div>
        ) : (
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {visible.map((p, i) => <ProductCard key={p.id} p={p} priority={i < 4} />)}
          </div>
        )}

        {pages > 1 && (
          <nav className="mt-14 flex flex-wrap justify-center gap-2 pb-20" aria-label="Pagination">
            {current > 1 && <Link to={pageLink(current - 1)} rel="prev" className="border border-line bg-white px-5 py-2.5 text-[13px]">Précédent</Link>}
            {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
              <Link key={n} to={pageLink(n)} aria-current={n === current ? 'page' : undefined} className={`grid size-10 place-items-center border text-[13px] font-medium ${n === current ? 'border-ink bg-ink text-white' : 'border-line bg-white'}`}>{n}</Link>
            ))}
            {current < pages && <Link to={pageLink(current + 1)} rel="next" className="border border-line bg-white px-5 py-2.5 text-[13px]">Suivant</Link>}
          </nav>
        )}
        {pages <= 1 && <div className="pb-20" />}
      </section>
      <TrustBar />
    </>
  )
}

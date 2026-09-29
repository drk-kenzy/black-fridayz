import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { AlertTriangle, BadgeCheck, ChevronLeft, ChevronRight, MessageCircle, Maximize2, ShoppingBag, ShieldCheck, Star, Tag, Truck, X } from 'lucide-react'
import { AccordionItem, Avatar, Breadcrumb, HeartButton, Img, Price, ProductCard, SectionTitle, Stars } from '../components/ui'
import { CATEGORIES, PRODUCTS, discountPct, fcfa, getProduct, type Product } from '../data/products'
import { generateReviews, ratingBreakdown } from '../data/reviews'
import { SITE, abs, productSeo, useSeo } from '../seo'
import { useCart } from '../store/cart'
import { useReviews, type UserReview } from '../store/reviews'
import { useUi } from '../store/ui'

const NO_REVIEWS: UserReview[] = []
const SHOE_GUIDE: [string, string][] = [['39', '24,5 cm'], ['40', '25,4 cm'], ['41', '26,2 cm'], ['42', '27 cm'], ['43', '27,9 cm'], ['44', '28,6 cm'], ['45', '29,5 cm']]
const CLOTH_GUIDE: [string, string][] = [['S', '92 à 98 cm'], ['M', '98 à 104 cm'], ['L', '104 à 110 cm'], ['XL', '110 à 118 cm'], ['XXL', '118 à 126 cm']]
const fmtDate = (d: number) => new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })

function Modal({ label, onClose, children, wide = false }: { label: string; onClose: () => void; children: ReactNode; wide?: boolean }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [onClose])
  return (
    <div role="dialog" aria-modal="true" aria-label={label} className="fixed inset-0 z-[70] grid place-items-center bg-black/70 p-4" onClick={onClose}>
      <div className={`relative w-full ${wide ? 'max-w-5xl' : 'max-w-sm bg-white p-7'}`} onClick={(e) => e.stopPropagation()}>{children}</div>
    </div>
  )
}

function SizeGuide({ shoes, onClose }: { shoes: boolean; onClose: () => void }) {
  const rows = shoes ? SHOE_GUIDE : CLOTH_GUIDE
  return (
    <Modal label="Guide des tailles" onClose={onClose}>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-3xl">Guide des tailles</h2>
        <button onClick={onClose} aria-label="Fermer" autoFocus><X size={18} /></button>
      </div>
      <p className="mt-2 text-xs text-ink/70">{shoes ? 'Pointure EU et longueur du pied.' : 'Taille et tour de poitrine.'} Entre deux tailles, prenez la plus grande.</p>
      <table className="mt-5 w-full text-sm">
        <thead><tr className="border-b border-line text-left text-[11px] uppercase tracking-wider text-ink/65"><th className="py-2">{shoes ? 'Pointure' : 'Taille'}</th><th>{shoes ? 'Pied' : 'Poitrine'}</th></tr></thead>
        <tbody>{rows.map(([a, b]) => <tr key={a} className="border-b border-line"><td className="py-2.5 font-semibold">{a}</td><td>{b}</td></tr>)}</tbody>
      </table>
    </Modal>
  )
}

function Lightbox({ images, index, alt, onIndex, onClose }: { images: string[]; index: number; alt: string; onIndex: (i: number) => void; onClose: () => void }) {
  const go = (d: number) => onIndex((index + d + images.length) % images.length)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'ArrowRight') go(1); if (e.key === 'ArrowLeft') go(-1) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  })
  return (
    <Modal label="Galerie photo" onClose={onClose} wide>
      <img src={images[index].replace(/w=\d+/, 'w=1600')} alt={alt} className="max-h-[85vh] w-full object-contain" />
      <button onClick={onClose} autoFocus aria-label="Fermer" className="absolute right-2 top-2 grid size-10 place-items-center rounded-full bg-white"><X size={18} /></button>
      {images.length > 1 && (
        <>
          <button onClick={() => go(-1)} aria-label="Photo précédente" className="absolute left-2 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-white"><ChevronLeft size={20} /></button>
          <button onClick={() => go(1)} aria-label="Photo suivante" className="absolute right-2 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-white"><ChevronRight size={20} /></button>
          <p className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-white px-3 py-1 text-xs">{index + 1} / {images.length}</p>
        </>
      )}
    </Modal>
  )
}

function ReviewForm({ productId }: { productId: string }) {
  const add = useReviews((s) => s.add)
  const [name, setName] = useState('')
  const [rating, setRating] = useState(5)
  const [text, setText] = useState('')
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (name.trim().length < 2) return setError('Indiquez votre prénom.')
    if (text.trim().length < 10) return setError('Votre avis doit contenir au moins 10 caractères.')
    add(productId, { name: name.trim(), rating, text: text.trim(), date: Date.now() })
    setDone(true)
  }

  if (done) return <p role="status" className="mx-auto mt-10 max-w-2xl border border-line bg-white p-6 text-center text-sm">Merci pour votre avis ! Il apparaît en haut de la liste.</p>
  const inp = 'w-full border border-line bg-white px-4 py-3 text-sm outline-none focus:border-ink'
  return (
    <form onSubmit={submit} noValidate className="mx-auto mt-10 max-w-2xl space-y-4 border border-line bg-white p-6">
      <h3 className="font-display text-2xl">Donnez votre avis</h3>
      <div role="radiogroup" aria-label="Votre note" className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} type="button" role="radio" aria-checked={rating === n} aria-label={`${n} étoile${n > 1 ? 's' : ''}`} onClick={() => setRating(n)}>
            <Star size={22} className={n <= rating ? 'fill-tan text-tan-dark' : 'text-tan/40'} />
          </button>
        ))}
      </div>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Votre prénom" aria-label="Votre prénom" className={inp} />
      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={3} placeholder="Votre expérience avec ce produit..." aria-label="Votre avis" className={inp} />
      {error && <p role="alert" className="text-xs text-brand">{error}</p>}
      <button className="btn-dark px-7 py-3.5">Publier mon avis</button>
    </form>
  )
}

const PAGE = 6

function Reviews({ p }: { p: Product }) {
  const mine = useReviews((s) => s.byProduct[p.id] ?? NO_REVIEWS)
  const [sort, setSort] = useState<'recent' | 'best' | 'worst'>('recent')
  const [shown, setShown] = useState(PAGE)
  const generated = useMemo(() => generateReviews(p), [p])
  const total = p.reviews + mine.length
  const avg = (p.rating * p.reviews + mine.reduce((n, r) => n + r.rating, 0)) / total
  const bars = ratingBreakdown(p.rating, p.reviews).map((c, i) => c + mine.filter((r) => r.rating === 5 - i).length)
  const list = useMemo(() => {
    const own = mine.map((r) => ({ id: `mine-${r.date}`, name: r.name, city: 'Vous', rating: r.rating, title: 'Votre avis', text: r.text, date: r.date, own: true }))
    const rest = [...generated]
    if (sort === 'best') rest.sort((a, b) => b.rating - a.rating || b.date - a.date)
    if (sort === 'worst') rest.sort((a, b) => a.rating - b.rating || b.date - a.date)
    return [...own, ...rest.map((r) => ({ ...r, own: false }))]
  }, [generated, mine, sort])

  return (
    <section id="avis" className="container-x py-16 sm:py-20" aria-labelledby="h-avis">
      <SectionTitle center eyebrow="Communauté StyleVibe" title="Avis Clients Vérifiés" id="h-avis" />
      <div className="mx-auto grid max-w-4xl gap-8 border border-line bg-white p-6 sm:grid-cols-[200px_minmax(0,1fr)] sm:p-8">
        <div className="text-center sm:border-r sm:border-line sm:pr-8">
          <p className="font-display text-6xl leading-none">{avg.toFixed(1).replace('.', ',')}</p>
          <div className="mt-2 flex justify-center"><Stars value={avg} size={16} /></div>
          <p className="mt-2 text-xs text-ink/70">{total} avis clients</p>
        </div>
        <ul className="space-y-2" aria-label="Répartition des notes">
          {bars.map((c, i) => (
            <li key={i} className="flex items-center gap-3 text-xs">
              <span className="w-8 shrink-0">{5 - i} ★</span>
              <span className="h-2 flex-1 bg-line"><span className="block h-full bg-tan-dark" style={{ width: `${(c / total) * 100}%` }} /></span>
              <span className="w-10 shrink-0 text-right text-ink/70">{c}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mx-auto mt-8 flex max-w-4xl items-center justify-between gap-4">
        <p className="text-sm text-ink/70" role="status" aria-live="polite">{Math.min(shown, list.length)} avis affichés sur {total}</p>
        <label className="flex items-center gap-2 text-[13px] text-ink/70">
          Trier par
          <select value={sort} onChange={(e) => { setSort(e.target.value as typeof sort); setShown(PAGE) }} className="border border-line bg-white px-3 py-2 font-semibold text-ink outline-none">
            <option value="recent">Plus récents</option>
            <option value="best">Mieux notés</option>
            <option value="worst">Moins bien notés</option>
          </select>
        </label>
      </div>

      <ul className="mx-auto mt-4 grid max-w-4xl gap-4">
        {list.slice(0, shown).map((r) => (
          <li key={r.id}>
            <article className={`border bg-white p-6 ${r.own ? 'border-tan' : 'border-line'}`}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2"><Stars value={r.rating} /><h3 className="text-sm font-semibold">{r.title}</h3></div>
                <time dateTime={new Date(r.date).toISOString()} className="text-xs text-ink/65">{fmtDate(r.date)}</time>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-ink/80">{r.text}</p>
              <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink/70">
                <span className="flex items-center gap-2"><Avatar name={r.name} /> <b className="text-ink">{r.name}</b></span>
                <span>{r.city}</span>
                {!r.own && <span className="flex items-center gap-1 text-emerald-800"><BadgeCheck size={13} /> Achat vérifié</span>}
              </p>
            </article>
          </li>
        ))}
      </ul>
      {shown < list.length && (
        <div className="mt-6 text-center">
          <button onClick={() => setShown(shown + PAGE)} className="btn-outline px-8 py-3.5">Voir plus d'avis</button>
        </div>
      )}
      <ReviewForm productId={p.id} />
    </section>
  )
}

/** Date de livraison estimée à Cotonou : 1 à 2 jours ouvrés (hors dimanche). */
function deliveryWindow(from = new Date()) {
  const add = (n: number) => {
    const d = new Date(from)
    while (n > 0) { d.setDate(d.getDate() + 1); if (d.getDay() !== 0) n-- }
    return d
  }
  const f = (d: Date) => d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
  return `${f(add(1))} et ${f(add(2))}`
}

function ProductView({ p }: { p: Product }) {
  const navigate = useNavigate()
  const add = useCart((s) => s.add)
  const [img, setImg] = useState(0)
  const [color, setColor] = useState(0)
  const [size, setSize] = useState<string | undefined>(p.defaultSize)
  const [sizeError, setSizeError] = useState(false)
  const [guide, setGuide] = useState(false)
  const [zoom, setZoom] = useState(false)
  const [ctaVisible, setCtaVisible] = useState(true)
  const cta = useRef<HTMLButtonElement>(null)
  const mineCount = useReviews((s) => (s.byProduct[p.id] ?? NO_REVIEWS).length)
  useSeo(productSeo(p))

  useEffect(() => {
    const el = cta.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(([e]) => setCtaVisible(e.isIntersecting), { threshold: 0 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const cat = CATEGORIES.find((c) => c.id === p.category)!
  const colorName = p.colors?.[color]?.name
  const line = () => ({ productId: p.id, qty: 1, size, color: colorName })
  const guard = () => {
    if (p.sizes && !size) { setSizeError(true); cta.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }); return false }
    return true
  }
  const pickColor = (i: number) => {
    setColor(i)
    const target = p.colors?.[i]?.image
    if (target !== undefined && p.images[target]) setImg(target)
  }
  const related = [...PRODUCTS.filter((x) => x.id !== p.id && x.category === p.category), ...PRODUCTS.filter((x) => x.id !== p.id && x.category !== p.category)].slice(0, 4)
  const stockPct = Math.max(10, Math.min(100, p.stock * 10))
  const onGalleryKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') setImg((img + 1) % p.images.length)
    if (e.key === 'ArrowLeft') setImg((img - 1 + p.images.length) % p.images.length)
  }
  const waText = `Bonjour StyleVibe, je souhaite commander : ${p.name}${size ? `, taille ${size}` : ''}${colorName ? `, couleur ${colorName}` : ''} à ${fcfa(p.price)}. ${abs(`/produit/${p.id}`)}`
  const totalReviews = p.reviews + mineCount
  const buyNow = () => { if (guard()) { add(line()); useUi.getState().closeCart(); navigate('/paiement') } }

  return (
    <>
      <Breadcrumb items={[{ label: 'Accueil', to: '/' }, { label: cat.label, to: `/collection/${cat.id}` }, { label: p.name }]} />

      <section className="container-x grid grid-cols-[minmax(0,1fr)] gap-8 pb-16 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-14">
        <div onKeyDown={onGalleryKey}>
          <div className="relative aspect-[4/3.3] overflow-hidden bg-sand">
            <button onClick={() => setZoom(true)} aria-label="Agrandir la photo" className="group block size-full cursor-zoom-in">
              <Img src={p.images[img]} alt={`${p.name}, photo ${img + 1}`} sizes="(min-width: 1024px) 55vw, 100vw" className="size-full object-cover" eager />
              <span className="absolute bottom-3 right-3 grid size-9 place-items-center rounded-full bg-white/90 opacity-0 shadow transition group-hover:opacity-100 group-focus-visible:opacity-100"><Maximize2 size={15} /></span>
            </button>
            <HeartButton id={p.id} className="absolute left-3 top-3" />
          </div>
          {p.images.length > 1 && (
            <div className="mt-3 grid grid-cols-4 gap-3">
              {p.images.slice(0, 4).map((src, i) => (
                <button key={src} onClick={() => setImg(i)} aria-label={`Photo ${i + 1}`} aria-current={i === img} className={`aspect-square overflow-hidden bg-sand ring-1 ${i === img ? 'ring-2 ring-tan-dark' : 'ring-line'}`}>
                  <Img src={src} alt="" sizes="160px" className="size-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-tan-dark">Sélection premium</p>
          <h1 className="mt-2 font-display text-[40px] leading-none sm:text-[44px] md:text-5xl">{p.name}</h1>
          <a href="#avis" className="mt-3 flex flex-wrap items-center gap-2 text-sm hover:underline">
            <Stars value={p.rating} size={13} /> <b>{p.rating.toFixed(1)}/5</b> <span className="text-ink/70">({totalReviews} avis clients)</span>
          </a>
          <hr className="my-5 border-line" />
          <div className="flex flex-wrap items-center gap-4">
            <Price p={p} size="lg" />
            <span className="bg-brand px-2 py-1 text-[11px] font-bold text-white">-{discountPct(p)}% OFF</span>
          </div>
          <p className="mt-3 inline-flex items-center gap-2 bg-emerald-50 px-3 py-2 text-[13px] text-emerald-900">
            <Tag size={14} /> Vous économisez {fcfa(p.oldPrice - p.price)} sur ce modèle
          </p>

          {p.colors && (
            <div className="mt-7">
              <p className="text-[11px] font-semibold uppercase tracking-wider">Couleur : <span className="text-tan-dark">{p.colors[color].name}</span></p>
              <div className="mt-3 flex gap-3">
                {p.colors.map((c, i) => (
                  <button key={c.name} onClick={() => pickColor(i)} aria-label={c.name} aria-pressed={i === color}
                    className={`size-8 rounded-full border border-ink/25 ring-offset-2 ring-offset-cream ${i === color ? 'ring-2 ring-ink' : ''}`} style={{ background: c.hex }} />
                ))}
              </div>
            </div>
          )}

          {p.sizes && (
            <div className="mt-6">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold uppercase tracking-wider">Sélectionner la taille {p.category === 'sneakers' ? '(EU)' : ''}</p>
                <button type="button" onClick={() => setGuide(true)} className="text-[11px] font-semibold underline">Guide des tailles</button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2.5">
                {p.sizes.map((s) => (
                  <button key={s} onClick={() => { setSize(s); setSizeError(false) }} aria-pressed={s === size}
                    className={`grid h-11 min-w-11 place-items-center border px-3 text-[13px] ${s === size ? 'border-2 border-ink bg-white font-semibold' : 'border-line bg-white hover:border-ink'}`}>{s}</button>
                ))}
              </div>
              {sizeError && <p role="alert" className="mt-2 text-xs font-medium text-brand">Veuillez choisir une taille.</p>}
            </div>
          )}

          {p.stock <= 5 && (
            <div className="mt-6 border border-brand/20 bg-rose-50 px-4 py-3">
              <p className="flex items-center gap-2 text-xs font-semibold text-brand"><AlertTriangle size={13} /> Plus que {p.stock} {p.sizes ? 'exemplaires' : 'pièces'} disponibles en stock !</p>
              <div className="mt-2 h-1 bg-white"><div className="h-full bg-brand" style={{ width: `${stockPct}%` }} /></div>
            </div>
          )}

          <button ref={cta} onClick={() => guard() && add(line())} className="btn-dark mt-6 flex w-full items-center justify-center gap-2.5 py-4"><ShoppingBag size={15} /> Ajouter au panier</button>
          <button onClick={buyNow} className="mt-3 w-full bg-tan-dark py-4 text-[13px] font-semibold uppercase tracking-wide text-white transition hover:bg-[#7a4c2c]">Acheter maintenant</button>
          <a href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(waText)}`} target="_blank" rel="noreferrer" className="mt-3 flex w-full items-center justify-center gap-2.5 border border-emerald-700 py-3.5 text-[13px] font-semibold uppercase tracking-wide text-emerald-800 transition hover:bg-emerald-50">
            <MessageCircle size={16} /> Commander sur WhatsApp
          </a>

          <ul className="mt-6 space-y-2.5 border-t border-line pt-5 text-[13px] text-ink/80">
            <li className="flex items-start gap-2.5"><Truck size={15} className="mt-0.5 shrink-0 text-tan-dark" /><span>Livraison estimée à Cotonou : <b className="capitalize">{deliveryWindow()}</b>. Gratuite dès 50 000 FCFA.</span></li>
            <li className="flex items-start gap-2.5"><ShieldCheck size={15} className="mt-0.5 shrink-0 text-tan-dark" /><span>Paiement sécurisé : MTN MoMo, Moov Money, carte ou à la livraison.</span></li>
            <li className="flex items-start gap-2.5"><BadgeCheck size={15} className="mt-0.5 shrink-0 text-tan-dark" /><span>Garantie satisfaction de 7 jours. Échange facile par WhatsApp.</span></li>
          </ul>
        </div>
      </section>

      {guide && p.sizes && <SizeGuide shoes={p.category === 'sneakers'} onClose={() => setGuide(false)} />}
      {zoom && <Lightbox images={p.images} index={img} alt={p.name} onIndex={setImg} onClose={() => setZoom(false)} />}

      <section className="border-y border-line bg-white">
        <div className="container-x grid grid-cols-[minmax(0,1fr)] gap-12 py-14 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <div>
            <h2 className="font-display text-3xl">{p.id === 'sneakers-urban-x' ? 'Confort Absolu & Allure Urbaine' : `Pourquoi choisir ${p.name}`}</h2>
            <div className="mt-5 space-y-4 text-sm leading-relaxed text-ink/80">
              {p.description.map((t, i) => <p key={i}>{t}</p>)}
            </div>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-tan-dark">Fiche technique</p>
            <dl className="mt-3">
              {p.specs.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-6 border-b border-line py-3.5 text-[13px]">
                  <dt className="text-ink/70">{k}</dt><dd className="text-right font-semibold">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="bg-sand/70">
        <div className="container-x grid gap-10 py-12 md:grid-cols-2">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-tan-dark">Livraison en 24/48h</p>
            <h2 className="mt-2 font-display text-[26px]">Expédition Rapide &amp; Retours Faciles</h2>
            <p className="mt-3 text-[13px] leading-relaxed text-ink/75">Nous livrons à Cotonou et Calavi sous 1 à 2 jours ouvrables, et dans le reste du Bénin sous 3 à 5 jours. Les retours sont acceptés dans les 7 jours suivant la réception si l'article est non porté. <Link to="/livraison-retours" className="font-semibold underline">Voir les tarifs</Link>.</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-tan-dark">Paiement sécurisé</p>
            <h2 className="mt-2 font-display text-[26px]">Réglez en Toute Confiance</h2>
            <p className="mt-3 text-[13px] leading-relaxed text-ink/75">Nous acceptons MTN Mobile Money, Moov Money, les cartes Visa/Mastercard ainsi que le paiement à la livraison pour faciliter vos transactions en toute sécurité.</p>
          </div>
        </div>
      </section>

      <Reviews p={p} />

      <section className="container-x max-w-4xl pb-20">
        <SectionTitle center eyebrow="Des questions ?" title="Foire aux Questions" />
        <div className="space-y-3">
          <AccordionItem defaultOpen q="Comment taille ce modèle ?" a="Le modèle taille normalement. Nous vous conseillons de choisir votre taille habituelle. Si vous êtes entre deux tailles, optez pour la taille supérieure." />
          <AccordionItem q="Quelles sont les modalités de paiement ?" a="Vous pouvez régler directement en ligne via MTN MoMo, Moov Money, carte de crédit ou choisir le règlement en espèces au moment de la livraison." />
          <AccordionItem q="Est-il possible d'échanger en cas de mauvaise taille ?" a="Oui, tout à fait ! Nous offrons les frais d'échange sous 3 jours si la pointure ne convient pas. Écrivez-nous simplement sur WhatsApp." />
        </div>
      </section>

      <section className="container-x pb-28 lg:pb-24" aria-labelledby="h-rel">
        <SectionTitle eyebrow="Produits recommandés" title="Complétez Votre Look" id="h-rel" right={<Link to="/collection" className="whitespace-nowrap text-[13px] font-semibold underline underline-offset-4">Voir tout le catalogue</Link>} />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((r) => <ProductCard key={r.id} p={r} label="StyleVibe Sélection" />)}
        </div>
      </section>

      {/* Barre d'achat collante sur mobile : le bouton reste à portée de pouce */}
      <div aria-hidden={ctaVisible} className={`fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 p-3 backdrop-blur transition-transform duration-300 lg:hidden ${ctaVisible ? 'pointer-events-none translate-y-full' : 'translate-y-0'}`}>
        <div className="mx-auto flex max-w-xl items-center gap-3">
          <div className="min-w-0 flex-1 leading-tight">
            <p className="truncate text-[13px] font-semibold">{p.name}</p>
            <p className="text-sm font-bold text-brand">{fcfa(p.price)}</p>
          </div>
          <button tabIndex={ctaVisible ? -1 : 0} onClick={() => guard() && add(line())} className="btn-dark flex shrink-0 items-center gap-2 px-5 py-3.5"><ShoppingBag size={14} /> Ajouter</button>
        </div>
      </div>
    </>
  )
}

export default function ProductPage() {
  const { id } = useParams()
  const p = id ? getProduct(id) : undefined
  if (!p) return <Navigate to="/collection" replace />
  return <ProductView key={p.id} p={p} />
}

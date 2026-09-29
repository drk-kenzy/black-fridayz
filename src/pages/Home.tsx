import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronRight, Clock, CreditCard, MessageCircle, Smartphone, Truck } from 'lucide-react'
import { Avatar, Img, ProductCard, Price, SectionTitle, ShippingBar, Stars, pad, useCountdown } from '../components/ui'
import { TrustBar } from '../components/Layout'
import { CATEGORIES, IMG, PRODUCTS, SALE_END, SALE_END_LABEL, discountPct, type Product } from '../data/products'
import { HOME_TESTIMONIALS } from '../data/reviews'
import { homeSeo, SITE, useSeo } from '../seo'
import { useCart } from '../store/cart'

function Hero() {
  const { d, h, m, s } = useCountdown(SALE_END)
  const over = d + h + m + s === 0
  const cells: [number, string][] = [[d, 'Jours'], [h, 'Hrs'], [m, 'Min'], [s, 'Sec']]
  return (
    <section className="container-x grid items-center gap-8 py-8 sm:py-10 lg:grid-cols-2 lg:gap-10 lg:py-0">
      <div className="max-w-xl lg:py-24">
        <p className="mb-5 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-wider text-brand sm:mb-6">
          Édition spéciale Black Friday <span className="h-px w-8 bg-brand" />
        </p>
        <h1 className="font-display text-[46px] leading-[1.04] sm:text-[56px] md:text-[64px] xl:text-[72px]">
          Le style que tu veux, au prix que tu attendais.
        </h1>
        <p className="mt-5 max-w-md text-[15px] leading-relaxed text-ink/70 sm:mt-6">
          Jusqu'à -60% sur toute la collection de prêt-à-porter de luxe, sneakers d'exception et accessoires d'horlogerie.{' '}
          {over ? "L'opération Black Friday est terminée, merci !" : `Offres exclusives valables uniquement jusqu'au ${SALE_END_LABEL}.`}
        </p>
        <div className="mt-6" role="timer" aria-label="Temps restant avant la fin de l'opération">
          <p className="mb-1.5 text-[9px] font-semibold uppercase tracking-wider text-ink/65">{over ? 'Opération terminée' : 'Temps restant'}</p>
          <div className="flex gap-4">
            {cells.map(([v, l]) => (
              <div key={l} className="min-w-9 text-center">
                <div className="font-display text-[34px] leading-none tabular-nums">{pad(v)}</div>
                <div className="mt-1 text-[8px] font-semibold uppercase tracking-wider text-tan-dark">{l}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
          <Link to="/collection?sort=discount" className="btn-dark inline-flex items-center gap-3 px-7 py-4">Profiter des offres <ArrowRight size={15} /></Link>
          <Link to="/collection" className="text-[13px] font-semibold underline underline-offset-4">Voir le catalogue</Link>
        </div>
        <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-ink/70">
          <Stars value={5} size={14} /> <b className="text-ink">4,8/5</b> · plus de 8 000 clients · livré en 24h à Cotonou
        </p>
      </div>
      <div className="relative aspect-[4/5] overflow-hidden bg-sand lg:aspect-auto lg:h-[620px] lg:self-stretch">
        <Img eager src={IMG.hero} alt="Couple en tenues wax élégantes, collection Black Friday StyleVibe" sizes="(min-width: 1024px) 50vw, 100vw" className="size-full object-cover" />
      </div>
    </section>
  )
}

function Categories() {
  return (
    <section className="container-x py-16 sm:py-20" aria-labelledby="h-cat">
      <SectionTitle center title="Inspirations de Saison" eyebrow="Explorer les catégories lifestyle" id="h-cat" />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        {CATEGORIES.map((c) => (
          <Link key={c.id} to={`/collection/${c.id}`} className="group relative block aspect-[3/4.4] overflow-hidden bg-sand">
            <Img src={c.image} alt={`${c.label} en promotion Black Friday`} sizes="(min-width: 1024px) 16vw, (min-width: 768px) 33vw, 50vw" className="size-full object-cover transition duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />
            <div className="absolute bottom-4 left-4 text-white">
              <p className="font-display text-[26px] uppercase leading-none">{c.label}</p>
              <p className="mt-1.5 flex items-center gap-1 text-[10px] text-white/90">{c.count} modèles <ChevronRight size={11} /></p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

function Popular() {
  const list = PRODUCTS.filter((p) => p.popular).slice(0, 4)
  return (
    <section className="container-x pb-16 sm:pb-20" aria-labelledby="h-pop">
      <SectionTitle eyebrow="Tendances du moment" title="Les Plus Populaires" id="h-pop" right={<Link to="/collection?sort=popular" className="whitespace-nowrap text-[13px] font-semibold underline underline-offset-4">Tout afficher</Link>} />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {list.map((p) => <ProductCard key={p.id} p={p} />)}
      </div>
    </section>
  )
}

function FlashCard({ p, offset }: { p: Product; offset: number }) {
  const target = useMemo(() => Date.now() + offset * 1000, [offset])
  const { h, m, s } = useCountdown(target)
  const add = useCart((st) => st.add)
  const pct = Math.max(12, Math.min(90, 100 - p.stock * 12))
  return (
    <article className="grid grid-cols-[110px_minmax(0,1fr)] bg-white sm:grid-cols-[140px_minmax(0,1fr)] lg:grid-cols-[110px_minmax(0,1fr)]">
      <Link to={`/produit/${p.id}`} className="relative block min-h-44 bg-sand">
        <Img src={p.images[0]} alt={p.name} sizes="140px" className="absolute inset-0 size-full object-cover" />
        <span className="absolute left-0 top-3 bg-brand px-2 py-1 text-[11px] font-semibold text-white">-{discountPct(p)}%</span>
      </Link>
      <div className="flex flex-col gap-2.5 p-4 sm:p-5">
        <p className="flex items-center gap-1.5 text-[11px] font-semibold text-brand"><Clock size={12} /> Expire dans {pad(h)}:{pad(m)}:{pad(s)}</p>
        <h3 className="text-[17px] font-semibold leading-tight"><Link to={`/produit/${p.id}`} className="hover:underline">{p.name}</Link></h3>
        <Price p={p} />
        <div>
          <div className="flex justify-between text-[10px] text-ink/70">
            <span>Unités restantes: {p.stock}</span><span className="font-semibold text-brand">Presque épuisé</span>
          </div>
          <div className="mt-1.5 h-1 bg-line"><div className="h-full bg-brand" style={{ width: `${pct}%` }} /></div>
        </div>
        <button onClick={() => add({ productId: p.id, qty: 1, size: p.defaultSize, color: p.colors?.[0]?.name })} className="btn-dark mt-auto py-3 text-[11px]">Réserver maintenant</button>
      </div>
    </article>
  )
}

function Flash() {
  const list = PRODUCTS.filter((p) => p.flash)
  const offsets = [12 * 3600 + 14 * 60 + 5, 4 * 3600 + 32 * 60 + 11, 18 * 3600 + 2 * 60 + 49]
  return (
    <section className="bg-sand/60 py-16 sm:py-20" aria-labelledby="h-flash">
      <div className="container-x">
        <SectionTitle
          eyebrow="● Offres flash limitées"
          title="Sélection Spéciale -60%"
          id="h-flash"
          right={<span className="hidden text-[11px] font-semibold uppercase tracking-wider sm:block">Stock ultra limité</span>}
        />
        <div className="grid gap-5 lg:grid-cols-3">
          {list.map((p, i) => <FlashCard key={p.id} p={p} offset={offsets[i] ?? 3600} />)}
        </div>
      </div>
    </section>
  )
}

function HowItWorks() {
  const steps = [
    ['1', 'Choisissez', "Parcourez la collection, sélectionnez votre taille avec notre guide et ajoutez au panier."],
    ['2', 'Payez comme vous voulez', 'MTN MoMo, Moov Money, carte bancaire ou en espèces à la livraison. Aucun frais caché.'],
    ['3', 'Recevez en 24h', "Livraison express à Cotonou, Calavi et Porto-Novo. Échange gratuit sous 3 jours si la taille ne va pas."],
  ]
  return (
    <section className="container-x py-16 sm:py-20" aria-labelledby="h-how">
      <SectionTitle center eyebrow="Simple et rassurant" title="Commander en 3 étapes" id="h-how" />
      <ol className="grid gap-5 md:grid-cols-3">
        {steps.map(([n, t, d]) => (
          <li key={n} className="border border-line bg-white p-7">
            <span className="grid size-10 place-items-center rounded-full bg-ink font-display text-xl text-white">{n}</span>
            <h3 className="mt-5 font-display text-2xl">{t}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink/70">{d}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}

function Testimonials() {
  return (
    <section className="container-x pb-16 sm:pb-20" aria-labelledby="h-avis">
      <SectionTitle center eyebrow="Déjà clients chez StyleVibe" title="Ce qu'ils en disent" id="h-avis" />
      <p className="-mt-4 mb-8 flex flex-wrap items-center justify-center gap-2 text-sm text-ink/70">
        <Stars value={5} size={15} /> <b className="text-ink">4,8/5</b> sur plus de 8 000 clients satisfaits
      </p>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {HOME_TESTIMONIALS.map((t) => (
          <figure key={t.name} className="flex flex-col border border-line bg-white p-7">
            <Stars value={5} />
            <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-ink/80">« {t.text} »</blockquote>
            <figcaption className="mt-6 flex items-center gap-3">
              <Avatar name={t.name} />
              <div>
                <p className="text-[13px] font-semibold">{t.name} <span className="font-normal text-ink/65">· {t.city}</span></p>
                <p className="text-[11px] text-tan-dark">Achat vérifié : {t.product}</p>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}

function WhatsAppBand() {
  return (
    <section className="bg-ink text-white">
      <div className="container-x flex flex-col items-start justify-between gap-5 py-10 md:flex-row md:items-center">
        <div>
          <h2 className="font-display text-3xl sm:text-4xl">Un doute sur une taille ? Écrivez-nous.</h2>
          <p className="mt-2 max-w-xl text-sm text-white/75">Un conseiller vous répond sur WhatsApp en quelques minutes, du lundi au samedi de 9h à 19h. Vous pouvez même commander directement par message.</p>
        </div>
        <a href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent('Bonjour StyleVibe, j’aimerais un conseil avant de commander.')}`} target="_blank" rel="noreferrer" className="inline-flex shrink-0 items-center gap-3 bg-white px-7 py-4 text-[13px] font-semibold uppercase tracking-wide text-ink transition hover:bg-sand">
          <MessageCircle size={17} /> Discuter sur WhatsApp
        </a>
      </div>
    </section>
  )
}

/** Bloc de texte de référencement : mots-clés naturels et maillage interne vers les catégories. */
function SeoCopy() {
  return (
    <section className="container-x py-16 sm:py-20" aria-labelledby="h-seo">
      <div className="mx-auto max-w-3xl">
        <h2 id="h-seo" className="font-display text-4xl">Votre boutique de mode en ligne au Bénin</h2>
        <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-ink/75">
          <p>
            StyleVibe réunit les tendances mode et lifestyle de la saison à des prix accessibles en FCFA. Pendant la <b>Black Friday</b>, profitez de remises allant jusqu'à -60% sur le prêt-à-porter, les{' '}
            <Link className="underline" to="/collection/sneakers">sneakers et chaussures</Link>, les <Link className="underline" to="/collection/sacs">sacs en cuir</Link>, les{' '}
            <Link className="underline" to="/collection/montres">montres</Link>, les <Link className="underline" to="/collection/lunettes">lunettes de soleil</Link> et les{' '}
            <Link className="underline" to="/collection/parfums">parfums</Link>.
          </p>
          <p>
            Nous livrons à <b>Cotonou</b>, Abomey-Calavi et Porto-Novo en 24 à 48h, et dans toutes les villes du Bénin en 3 à 6 jours. La livraison est gratuite dès 50 000 FCFA.
            Réglez par <b>MTN MoMo</b>, <b>Moov Money</b>, carte bancaire ou en espèces à la livraison, et échangez gratuitement votre article sous 3 jours si la taille ne convient pas.
            Consultez nos <Link className="underline" to="/livraison-retours">tarifs de livraison et conditions de retour</Link> ou notre <Link className="underline" to="/faq">foire aux questions</Link>.
          </p>
          <p>
            Chaque pièce est contrôlée avant expédition. Notre showroom de Fidjrossè vous accueille pour vos essayages, et notre équipe répond à vos questions sur WhatsApp.{' '}
            <Link className="underline" to="/a-propos">Découvrez l'histoire de StyleVibe</Link>.
          </p>
        </div>
      </div>
    </section>
  )
}

export function PaymentStrip() {
  const items = [[Smartphone, 'MTN MoMo'], [Smartphone, 'Moov Money'], [CreditCard, 'Visa'], [CreditCard, 'Mastercard'], [Truck, 'Livraison']] as const
  return (
    <section className="border-y border-line bg-white py-8">
      <div className="container-x text-center">
        <p className="mb-4 text-[10px] font-semibold uppercase tracking-wider text-ink/65">Modes de paiement sécurisés acceptés</p>
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
          {items.map(([Icon, label]) => (
            <span key={label} className="flex items-center gap-2 text-[13px] font-medium"><Icon size={16} /> {label}</span>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  useSeo(homeSeo())
  return (
    <>
      <Hero />
      <TrustBar />
      <Categories />
      <Popular />
      <Flash />
      <div className="container-x py-8"><ShippingBar /></div>
      <HowItWorks />
      <Testimonials />
      <WhatsAppBand />
      <SeoCopy />
      <PaymentStrip />
    </>
  )
}

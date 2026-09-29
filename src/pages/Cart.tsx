import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Minus, Plus, RefreshCw, ShieldCheck, Trash2, Truck } from 'lucide-react'
import { Img, ProductCard, SectionTitle, ShippingBar } from '../components/ui'
import { PaymentStrip } from './Home'
import { PRODUCTS, discountPct, fcfa } from '../data/products'
import { useCart, useTotals } from '../store/cart'
import { staticSeo, useSeo } from '../seo'

export default function Cart() {
  useSeo(staticSeo('/panier'))
  const navigate = useNavigate()
  const { remove, setQty, applyCoupon, coupon } = useCart()
  const t = useTotals()
  const [code, setCode] = useState(coupon ?? '')
  const [error, setError] = useState(false)
  const suggestions = PRODUCTS.filter((p) => p.flash && !t.items.some((i) => i.productId === p.id)).slice(0, 3)

  const submitCode = () => setError(!applyCoupon(code))

  if (t.items.length === 0)
    return (
      <>
        <section className="container-x py-28 text-center">
          <p className="eyebrow">Votre commande</p>
          <h1 className="mt-3 font-display text-5xl">Votre panier est vide</h1>
          <p className="mt-4 text-ink/60">Découvrez nos offres Black Friday jusqu'à -60%.</p>
          <Link to="/collection" className="btn-dark mt-8 inline-flex items-center gap-3 px-8 py-4">Voir la collection <ArrowRight size={15} /></Link>
        </section>
        <PaymentStrip />
      </>
    )

  return (
    <>
      <section className="container-x grid grid-cols-[minmax(0,1fr)] gap-10 py-14 lg:grid-cols-[minmax(0,1fr)_400px]">
        <div>
          <p className="eyebrow !text-tan-dark">Votre commande</p>
          <h1 className="mt-2 font-display text-5xl leading-none">Votre Sélection ({t.count} article{t.count > 1 ? 's' : ''})</h1>
          <div className="mt-8"><ShippingBar /></div>

          <ul className="mt-6 divide-y divide-line border-b border-line">
            {t.items.map((l) => (
              <li key={`${l.productId}-${l.index}`} className="grid grid-cols-[96px_minmax(0,1fr)] items-center gap-x-5 gap-y-3 py-6 sm:grid-cols-[96px_minmax(0,1fr)_auto_auto]">
                <Link to={`/produit/${l.productId}`} className="block aspect-[5/6] overflow-hidden bg-sand"><Img src={l.product.images[0]} alt={l.product.name} className="size-full object-cover" /></Link>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-brand">StyleVibe Exclusif</p>
                  <Link to={`/produit/${l.productId}`} className="text-[17px] font-semibold hover:underline">{l.product.name}</Link>
                  <p className="mt-1 text-xs text-ink/60">
                    {l.size ? `Taille: ${l.size}` : l.product.category === 'parfums' ? 'Contenance: 100ml' : 'Taille: Unique'}
                    {l.color ? ` • ${l.product.category === 'parfums' ? 'Notes' : 'Couleur'}: ${l.product.category === 'parfums' ? 'Ambrées & Boisées' : l.color}` : ''}
                  </p>
                  <button onClick={() => remove(l.index)} className="mt-3 inline-flex items-center gap-1.5 text-xs underline underline-offset-2"><Trash2 size={13} /> Supprimer</button>
                </div>
                <div className="col-start-2 inline-flex w-fit items-center border border-line bg-white sm:col-start-auto">
                  <button onClick={() => setQty(l.index, l.qty - 1)} aria-label="Diminuer la quantité" className="grid size-10 place-items-center"><Minus size={13} /></button>
                  <span className="w-8 text-center text-sm font-medium" aria-live="polite">{l.qty}</span>
                  <button onClick={() => setQty(l.index, l.qty + 1)} aria-label="Augmenter la quantité" className="grid size-10 place-items-center"><Plus size={13} /></button>
                </div>
                <div className="col-start-2 sm:col-start-auto sm:min-w-32 sm:text-right">
                  <p className="text-[17px] font-semibold text-brand">{fcfa(l.product.price * l.qty)}</p>
                  <p className="text-xs text-ink/60 line-through">{fcfa(l.product.oldPrice * l.qty)}</p>
                </div>
              </li>
            ))}
          </ul>
          <Link to="/collection" className="mt-8 inline-flex items-center gap-2 text-sm underline underline-offset-4"><ArrowLeft size={14} /> Continuer mes achats</Link>
        </div>

        <aside className="space-y-4 lg:pt-3">
          <div className="border border-line bg-white p-7">
            <h2 className="font-display text-[30px]">Résumé de la commande</h2>
            <div className="mt-5 flex">
              <input value={code} onChange={(e) => { setCode(e.target.value); setError(false) }} onKeyDown={(e) => e.key === 'Enter' && submitCode()} placeholder="Code promo" aria-label="Code promo" className="min-w-0 flex-1 border border-line bg-cream px-4 text-sm uppercase outline-none focus:border-ink" />
              <button onClick={submitCode} className="btn-dark px-5 py-3.5 text-xs">Appliquer</button>
            </div>
            {error && <p className="mt-2 text-xs text-brand">Code invalide.</p>}
            <dl className="mt-6 space-y-3.5 border-t border-line pt-6 text-sm">
              <div className="flex justify-between"><dt className="text-ink/60">Sous-total</dt><dd className="font-medium">{fcfa(t.subtotal)}</dd></div>
              {t.discount > 0 && <div className="flex justify-between text-brand"><dt>Réduction BF</dt><dd className="font-medium">-{fcfa(t.discount)}</dd></div>}
              <div className="flex justify-between"><dt className="text-ink/60">Livraison</dt><dd className="font-medium text-tan-dark">{t.freeShipping ? 'Gratuite' : 'Calculée à la commande'}</dd></div>
            </dl>
            <div className="mt-6 flex items-baseline justify-between border-t border-line pt-6">
              <span className="font-semibold">Total</span>
              <span className="text-2xl font-bold">{fcfa(t.total)}</span>
            </div>
            <button onClick={() => navigate('/paiement')} className="btn-dark mt-6 flex w-full items-center justify-center gap-3 py-4">Passer la commande <ArrowRight size={15} /></button>
          </div>
          <ul className="space-y-3.5 border border-line bg-sand/70 p-6 text-[13px] font-medium">
            <li className="flex items-center gap-3"><ShieldCheck size={16} className="text-tan-dark" /> Paiement 100% sécurisé (MTN, Moov, Carte)</li>
            <li className="flex items-center gap-3"><RefreshCw size={16} className="text-tan-dark" /> Échange gratuit sous 3 jours si mauvaise taille</li>
            <li className="flex items-center gap-3"><Truck size={16} className="text-tan-dark" /> Livraison suivie avec notre service express</li>
          </ul>
        </aside>
      </section>

      {suggestions.length > 0 && (
        <section className="container-x pb-20">
          <SectionTitle title="Vous aimerez aussi" right={<Link to="/collection" className="text-[13px] font-semibold underline underline-offset-4">Tout le catalogue</Link>} />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {suggestions.map((p) => <ProductCard key={p.id} p={p} label={`Offre flash limitée · -${discountPct(p)}%`} cta="Ajouter" />)}
          </div>
        </section>
      )}
      <PaymentStrip />
    </>
  )
}

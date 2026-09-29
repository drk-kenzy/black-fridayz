import { useRef, useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { ArrowRight, Banknote, Check, ChevronDown, Clock, CreditCard, HandCoins, ShieldCheck, Wallet } from 'lucide-react'
import { Img } from '../components/ui'
import { fcfa } from '../data/products'
import { CITIES, useCart, useTotals } from '../store/cart'
import { useAccount } from '../store/account'
import { staticSeo, useSeo } from '../seo'

const PAYMENTS = [
  { id: 'mtn', title: 'MTN MoMo', desc: 'Payer instantanément via votre compte MTN Bénin', icon: Wallet },
  { id: 'moov', title: 'Moov Money', desc: 'Payer instantanément via votre compte Moov Bénin', icon: Wallet },
  { id: 'card', title: 'Carte Bancaire (Visa/Mastercard)', desc: 'Paiement international sécurisé', icon: CreditCard },
  { id: 'cod', title: 'Paiement à la Livraison', desc: "Payez en espèces ou MoMo à l'agent de livraison", icon: HandCoins },
] as const

type Fields = { name: string; phone: string; address: string; district: string; notes: string; momo: string; cardName: string; cardNumber: string; cardExp: string; cardCvc: string }

const digits = (v: string) => v.replace(/\D/g, '')
const luhn = (num: string) => {
  let sum = 0
  num.split('').reverse().forEach((d, i) => { let n = Number(d); if (i % 2) { n *= 2; if (n > 9) n -= 9 } sum += n })
  return num.length >= 13 && sum % 10 === 0
}
const validBeninPhone = (v: string) => { const d = digits(v).replace(/^229/, ''); return d.length === 8 || (d.length === 10 && d.startsWith('01')) }
const formatCard = (v: string) => digits(v).slice(0, 19).replace(/(.{4})/g, '$1 ').trim()
const formatExp = (v: string) => { const d = digits(v).slice(0, 4); return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d }

export function Checkout() {
  useSeo(staticSeo('/paiement'))
  const navigate = useNavigate()
  const clear = useCart((s) => s.clear)
  const addOrder = useAccount((s) => s.addOrder)
  const [city, setCity] = useState('Cotonou')
  const [pay, setPay] = useState<(typeof PAYMENTS)[number]['id']>('mtn')
  const [f, setF] = useState<Fields>({ name: '', phone: '', address: '', district: '', notes: '', momo: '', cardName: '', cardNumber: '', cardExp: '', cardCvc: '' })
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({})
  const [paying, setPaying] = useState(false)
  const t = useTotals(city)
  const done = useRef(false)

  if (t.items.length === 0 && !done.current) return <Navigate to="/panier" replace />

  const validate = () => {
    const e: typeof errors = {}
    if (f.name.trim().length < 3) e.name = 'Indiquez votre nom complet.'
    if (!validBeninPhone(f.phone)) e.phone = 'Numéro invalide (ex: +229 50 00 00 00).'
    if ((pay === 'mtn' || pay === 'moov') && !validBeninPhone(f.momo)) e.momo = `Numéro ${pay === 'mtn' ? 'MTN MoMo' : 'Moov Money'} invalide.`
    if (pay === 'card') {
      if (f.cardName.trim().length < 3) e.cardName = 'Nom du titulaire requis.'
      if (!luhn(digits(f.cardNumber))) e.cardNumber = 'Numéro de carte invalide.'
      const [mm, yy] = f.cardExp.split('/').map(Number)
      if (!mm || mm > 12 || !yy || new Date(2000 + yy, mm, 0, 23, 59) < new Date()) e.cardExp = 'Date invalide ou expirée.'
      if (!/^\d{3,4}$/.test(f.cardCvc)) e.cardCvc = 'CVC invalide.'
    }
    if (f.address.trim().length < 4) e.address = 'Indiquez votre adresse.'
    if (f.district.trim().length < 2) e.district = 'Indiquez un quartier ou un repère.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = (ev: FormEvent) => {
    ev.preventDefault()
    if (paying || !validate()) return
    setPaying(true)
    // Paiement simulé : à remplacer par l'appel à FedaPay / Stripe côté serveur.
    setTimeout(finalize, pay === 'cod' ? 600 : 2600)
  }

  const finalize = () => {
    const order = { number: `SV-${Date.now().toString().slice(-6)}`, name: f.name.trim(), city, pay, total: t.total, lines: t.count }
    addOrder({ number: order.number, date: Date.now(), name: order.name, city, pay, total: t.total, lines: t.count, items: t.items.map((l) => l.product.name) })
    done.current = true
    navigate('/confirmation', { state: order })
    clear()
  }

  const bind = (k: keyof Fields) => ({
    value: f[k],
    onChange: (e: { target: { value: string } }) => { setF({ ...f, [k]: e.target.value }); setErrors({ ...errors, [k]: undefined }) },
  })
  const input = (k: keyof Fields) => `w-full border bg-white px-4 py-3.5 text-sm outline-none placeholder:text-ink/65 focus:border-ink ${errors[k] ? 'border-brand' : 'border-line'}`
  const label = 'mb-2 block text-[11px] font-semibold uppercase tracking-wider'
  const err = (k: keyof Fields) => errors[k] && <p className="mt-1.5 text-xs text-brand">{errors[k]}</p>

  return (
    <form onSubmit={submit} noValidate className="container-x grid grid-cols-[minmax(0,1fr)] gap-10 py-14 lg:grid-cols-[minmax(0,1fr)_440px]">
      <div>
        <h1 className="font-display text-5xl leading-none">Informations de Livraison</h1>
        <div className="mt-8 space-y-5">
          <div><label className={label} htmlFor="name">Nom complet <span className="text-brand">*</span></label><input id="name" autoComplete="name" placeholder="Ex: Jean Houndonougbo" className={input('name')} {...bind('name')} />{err('name')}</div>
          <div><label className={label} htmlFor="phone">Numéro de téléphone <span className="text-brand">*</span></label><input id="phone" type="tel" autoComplete="tel" placeholder="Ex: +229 50 00 00 00 (WhatsApp recommandé)" className={input('phone')} {...bind('phone')} />{err('phone')}</div>
          <div><label className={label} htmlFor="address">Adresse de livraison complète <span className="text-brand">*</span></label><input id="address" autoComplete="street-address" placeholder="Ex: Lot 104, Rue pavée Fidjrossè" className={input('address')} {...bind('address')} />{err('address')}</div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={label} htmlFor="city">Ville <span className="text-brand">*</span></label>
              <div className="relative">
                <select id="city" value={city} onChange={(e) => setCity(e.target.value)} className="w-full appearance-none border border-line bg-white px-4 py-3.5 text-sm outline-none focus:border-ink">
                  {Object.keys(CITIES).map((c) => <option key={c}>{c}</option>)}
                </select>
                <ChevronDown size={15} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>
            <div><label className={label} htmlFor="district">Quartier / Repères <span className="text-brand">*</span></label><input id="district" placeholder="Ex: Près de l'Eglise Saint Jean" className={input('district')} {...bind('district')} />{err('district')}</div>
          </div>
          <div><label className={label} htmlFor="notes">Notes de livraison (optionnel)</label><input id="notes" placeholder="Ex: Sonner à la barrière noire, appeler avant de venir" className={input('notes')} {...bind('notes')} /></div>
        </div>

        <h2 className="mb-5 mt-14 font-display text-4xl leading-none">Moyen de Paiement</h2>
        <div role="radiogroup" aria-label="Moyen de paiement" className="space-y-3">
          {PAYMENTS.map(({ id, title, desc, icon: Icon }) => {
            const on = pay === id
            return (
              <button type="button" key={id} role="radio" aria-checked={on} onClick={() => setPay(id)}
                className={`flex w-full items-center gap-4 border px-5 py-5 text-left transition ${on ? 'border-tan bg-sand/80' : 'border-line bg-white hover:border-ink/40'}`}>
                <span className={`grid size-5 shrink-0 place-items-center rounded-full border-2 ${on ? 'border-tan' : 'border-line'}`}>{on && <span className="size-2.5 rounded-full bg-tan" />}</span>
                <span className="flex-1"><span className="block text-[15px] font-semibold">{title}</span><span className="text-xs text-ink/60">{desc}</span></span>
                <span className="grid size-10 place-items-center bg-sand"><Icon size={18} /></span>
              </button>
            )
          })}
        </div>

        {(pay === 'mtn' || pay === 'moov') && (
          <div className="mt-5 border border-line bg-white p-5">
            <label className={label} htmlFor="momo">Numéro {pay === 'mtn' ? 'MTN MoMo' : 'Moov Money'} à débiter <span className="text-brand">*</span></label>
            <input id="momo" type="tel" inputMode="tel" placeholder={pay === 'mtn' ? 'Ex: +229 50 00 00 00' : 'Ex: +229 99 00 00 00'} className={input('momo')} {...bind('momo')} />
            {err('momo')}
            <p className="mt-2 text-xs text-ink/65">Vous recevrez une demande de confirmation sur ce numéro. Saisissez votre code PIN pour valider.</p>
          </div>
        )}
        {pay === 'card' && (
          <div className="mt-5 grid gap-4 border border-line bg-white p-5 sm:grid-cols-2">
            <div className="sm:col-span-2"><label className={label} htmlFor="cardName">Nom sur la carte <span className="text-brand">*</span></label><input id="cardName" autoComplete="cc-name" className={input('cardName')} {...bind('cardName')} />{err('cardName')}</div>
            <div className="sm:col-span-2"><label className={label} htmlFor="cardNumber">Numéro de carte <span className="text-brand">*</span></label>
              <input id="cardNumber" inputMode="numeric" autoComplete="cc-number" placeholder="0000 0000 0000 0000" className={input('cardNumber')} value={f.cardNumber} onChange={(e) => { setF({ ...f, cardNumber: formatCard(e.target.value) }); setErrors({ ...errors, cardNumber: undefined }) }} />{err('cardNumber')}</div>
            <div><label className={label} htmlFor="cardExp">Expiration <span className="text-brand">*</span></label>
              <input id="cardExp" inputMode="numeric" autoComplete="cc-exp" placeholder="MM/AA" className={input('cardExp')} value={f.cardExp} onChange={(e) => { setF({ ...f, cardExp: formatExp(e.target.value) }); setErrors({ ...errors, cardExp: undefined }) }} />{err('cardExp')}</div>
            <div><label className={label} htmlFor="cardCvc">CVC <span className="text-brand">*</span></label>
              <input id="cardCvc" inputMode="numeric" autoComplete="cc-csc" placeholder="123" maxLength={4} className={input('cardCvc')} value={f.cardCvc} onChange={(e) => { setF({ ...f, cardCvc: digits(e.target.value) }); setErrors({ ...errors, cardCvc: undefined }) }} />{err('cardCvc')}</div>
            <p className="text-xs text-ink/65 sm:col-span-2">Démo : aucune donnée de carte n'est envoyée ni enregistrée.</p>
          </div>
        )}
        {pay === 'cod' && <p className="mt-5 border border-line bg-white p-5 text-sm text-ink/75">Vous réglez en espèces ou par MoMo directement à l'agent de livraison. Merci de préparer l'appoint si possible.</p>}
      </div>

      <aside className="space-y-5 lg:pt-1">
        <div className="border border-line bg-white p-7">
          <h2 className="font-display text-[30px]">Résumé de la commande</h2>
          <ul className="mt-5 divide-y divide-line">
            {t.items.map((l) => (
              <li key={`${l.productId}-${l.index}`} className="flex gap-4 py-5">
                <div className="size-[72px] shrink-0 overflow-hidden border border-line bg-sand"><Img src={l.product.images[0]} alt="" className="size-full object-cover" /></div>
                <div className="text-sm">
                  <p className="font-semibold">{l.product.name}{l.qty > 1 && <span className="font-normal text-ink/65"> × {l.qty}</span>}</p>
                  <p className="text-xs text-ink/65">{[l.size && `Pointure: ${l.size}`, l.color && `Couleur: ${l.color}`].filter(Boolean).join(' • ') || 'Édition Limitée'}</p>
                  <p className="mt-1"><b className="text-brand">{fcfa(l.product.price)}</b> <span className="text-xs text-ink/60 line-through">{fcfa(l.product.oldPrice)}</span></p>
                </div>
              </li>
            ))}
          </ul>
          <dl className="space-y-3 border-t border-line pt-5 text-sm">
            <div className="flex justify-between"><dt className="text-ink/60">Sous-total</dt><dd className="font-medium">{fcfa(t.subtotal)}</dd></div>
            {t.discount > 0 && <div className="flex justify-between text-brand"><dt>Remise Black Friday</dt><dd className="font-medium">-{fcfa(t.discount)}</dd></div>}
            <div className="flex items-center justify-between"><dt className="text-ink/60">Livraison ({city === 'Autre ville du Bénin' ? 'Bénin' : city})</dt>
              <dd>{t.freeShipping ? <span className="bg-sand px-2 py-0.5 text-[10px] font-bold uppercase text-tan-dark">Gratuite</span> : <b>{fcfa(t.shipping ?? 0)}</b>}</dd></div>
          </dl>
          <div className="mt-5 flex items-baseline justify-between border-t border-line pt-5">
            <span className="font-semibold">Total à payer</span><span className="text-2xl font-bold">{fcfa(t.total)}</span>
          </div>
          <button type="submit" className="btn-dark mt-6 flex w-full items-center justify-center gap-3 py-4">Confirmer ma commande <ArrowRight size={15} /></button>
          <p className="mt-4 flex items-center justify-center gap-2 text-xs text-ink/60"><Clock size={13} className="text-tan-dark" /> Livré sous 2 à 4 jours partout au Bénin</p>
        </div>
        <div className="border border-line bg-white p-6">
          <p className="flex items-center gap-2 text-sm font-semibold"><ShieldCheck size={16} className="text-tan-dark" /> Sécurisé à 100%</p>
          <p className="mt-2 text-xs leading-relaxed text-ink/60">Toutes les transactions sont cryptées et gérées en partenariat avec FedaPay pour garantir la sécurité absolue de vos fonds.</p>
        </div>
      </aside>
      {paying && (
        <div role="alertdialog" aria-live="assertive" aria-label="Paiement en cours" className="fixed inset-0 z-[80] grid place-items-center bg-black/60 p-4">
          <div className="w-full max-w-sm bg-white p-8 text-center">
            <span className="mx-auto block size-10 animate-spin rounded-full border-4 border-line border-t-ink" />
            <p className="mt-5 font-display text-3xl">{pay === 'cod' ? 'Enregistrement...' : pay === 'card' ? 'Paiement en cours...' : 'Confirmez sur votre téléphone'}</p>
            <p className="mt-2 text-sm text-ink/65">{pay === 'cod' ? 'Nous enregistrons votre commande.' : pay === 'card' ? 'Ne fermez pas cette page.' : 'Saisissez votre code PIN pour valider le paiement.'}</p>
          </div>
        </div>
      )}
    </form>
  )
}

export function Confirmation() {
  useSeo(staticSeo('/confirmation'))
  const { state } = useLocation() as { state: { number: string; name: string; city: string; pay: string; total: number; lines: number } | null }
  if (!state) return <Navigate to="/" replace />
  const payLabel = PAYMENTS.find((p) => p.id === state.pay)?.title
  return (
    <section className="container-x max-w-2xl py-24 text-center">
      <span className="mx-auto grid size-16 place-items-center rounded-full bg-emerald-100 text-emerald-700"><Check size={30} /></span>
      <h1 className="mt-8 font-display text-5xl">Merci {state.name.split(' ')[0]} !</h1>
      <p className="mt-4 text-ink/65">Votre commande <b>{state.number}</b> est bien enregistrée. Notre assistant de livraison vous contactera sur WhatsApp pour fixer l'heure exacte de livraison à {state.city}.</p>
      <dl className="mx-auto mt-8 max-w-sm space-y-3 border border-line bg-white p-6 text-left text-sm">
        <div className="flex justify-between"><dt className="text-ink/60">Articles</dt><dd className="font-medium">{state.lines}</dd></div>
        <div className="flex justify-between"><dt className="text-ink/60">Paiement</dt><dd className="flex items-center gap-1.5 font-medium"><Banknote size={14} /> {payLabel}</dd></div>
        <div className="flex justify-between border-t border-line pt-3"><dt className="font-semibold">Total</dt><dd className="font-bold">{fcfa(state.total)}</dd></div>
      </dl>
      <Link to="/collection" className="btn-dark mt-10 inline-flex items-center gap-3 px-8 py-4">Continuer mes achats <ArrowRight size={15} /></Link>
    </section>
  )
}

import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Check, LogOut, Package, Search } from 'lucide-react'
import { Breadcrumb } from '../components/ui'
import { fcfa } from '../data/products'
import { ORDER_STEPS, orderStep, useAccount } from '../store/account'
import { staticSeo, useSeo } from '../seo'

const inp = 'w-full border border-line bg-white px-4 py-3.5 text-sm outline-none placeholder:text-ink/65 focus:border-ink'
const lab = 'mb-2 block text-[11px] font-semibold uppercase tracking-wider'
const fmt = (d: number) => new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })

function Timeline({ step }: { step: number }) {
  return (
    <ol className="mt-5 grid grid-cols-4 gap-2">
      {ORDER_STEPS.map((s, i) => (
        <li key={s} className="text-center">
          <span className={`mx-auto grid size-7 place-items-center rounded-full text-xs text-white ${i <= step ? 'bg-tan' : 'bg-line text-ink/65'}`}>
            {i <= step ? <Check size={13} /> : i + 1}
          </span>
          <p className={`mt-2 text-[11px] leading-tight ${i === step ? 'font-semibold' : 'text-ink/65'}`}>{s}</p>
        </li>
      ))}
    </ol>
  )
}

export function Account() {
  useSeo(staticSeo('/compte'))
  const { user, orders, login, logout } = useAccount()
  const [mode, setMode] = useState<'in' | 'up'>('in')
  const [f, setF] = useState({ name: '', contact: '', password: '' })
  const [error, setError] = useState('')

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (mode === 'up' && f.name.trim().length < 2) return setError('Indiquez votre nom.')
    if (!/^\S+@\S+\.\S+$/.test(f.contact) && f.contact.replace(/\D/g, '').length < 8) return setError('Email ou numéro de téléphone invalide.')
    if (f.password.length < 6) return setError('Le mot de passe doit contenir au moins 6 caractères.')
    login({ name: f.name.trim() || f.contact.split('@')[0], contact: f.contact.trim() })
  }

  if (user)
    return (
      <>
        <Breadcrumb items={[{ label: 'Accueil', to: '/' }, { label: 'Mon compte' }]} />
        <section className="container-x pb-24">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow !text-tan-dark">Mon compte</p>
              <h1 className="mt-2 font-display text-5xl">Bonjour {user.name.split(' ')[0]}</h1>
              <p className="mt-2 text-sm text-ink/60">{user.contact}</p>
            </div>
            <button onClick={logout} className="btn-outline flex items-center gap-2 px-5 py-3"><LogOut size={14} /> Se déconnecter</button>
          </div>
          <h2 className="mb-5 mt-12 font-display text-3xl">Mes commandes</h2>
          {orders.length === 0 ? (
            <div className="border border-line bg-white p-10 text-center">
              <Package className="mx-auto text-tan-dark" size={30} />
              <p className="mt-4 text-ink/65">Vous n'avez pas encore passé de commande.</p>
              <Link to="/collection" className="btn-dark mt-6 inline-block px-7 py-3.5">Découvrir la collection</Link>
            </div>
          ) : (
            <ul className="space-y-4">
              {orders.map((o) => (
                <li key={o.number} className="border border-line bg-white p-6">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="font-semibold">Commande {o.number} <span className="ml-2 text-xs font-normal text-ink/65">{fmt(o.date)}</span></p>
                    <p className="font-bold">{fcfa(o.total)}</p>
                  </div>
                  <p className="mt-1 text-sm text-ink/60">{o.items.join(' · ')}, livraison à {o.city}</p>
                  <Timeline step={orderStep(o)} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </>
    )

  return (
    <>
      <Breadcrumb items={[{ label: 'Accueil', to: '/' }, { label: 'Mon compte' }]} />
      <section className="container-x max-w-md pb-24 pt-4">
        <h1 className="font-display text-5xl">{mode === 'in' ? 'Connexion' : 'Créer un compte'}</h1>
        <p className="mt-3 text-sm text-ink/65">Suivez vos commandes et commandez plus vite.</p>
        <form onSubmit={submit} className="mt-8 space-y-5 border border-line bg-white p-8" noValidate>
          {mode === 'up' && (
            <div><label className={lab} htmlFor="a-name">Nom complet</label><input id="a-name" className={inp} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} placeholder="Ex: Prudence Tossou" /></div>
          )}
          <div><label className={lab} htmlFor="a-contact">Email ou téléphone</label><input id="a-contact" className={inp} value={f.contact} onChange={(e) => setF({ ...f, contact: e.target.value })} placeholder="votremail@example.com" /></div>
          <div><label className={lab} htmlFor="a-pass">Mot de passe</label><input id="a-pass" type="password" className={inp} value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} placeholder="6 caractères minimum" /></div>
          {error && <p role="alert" className="text-xs text-brand">{error}</p>}
          <button className="btn-dark w-full py-4">{mode === 'in' ? 'Se connecter' : "S'inscrire"}</button>
          <p className="text-center text-sm text-ink/60">
            {mode === 'in' ? 'Pas encore de compte ?' : 'Déjà un compte ?'}{' '}
            <button type="button" onClick={() => { setMode(mode === 'in' ? 'up' : 'in'); setError('') }} className="font-semibold text-ink underline">{mode === 'in' ? "S'inscrire" : 'Se connecter'}</button>
          </p>
        </form>
        <p className="mt-4 text-xs text-ink/65">Démo : le compte est enregistré uniquement dans ce navigateur.</p>
      </section>
    </>
  )
}

export function Track() {
  useSeo(staticSeo('/suivi'))
  const orders = useAccount((s) => s.orders)
  const [q, setQ] = useState('')
  const [searched, setSearched] = useState('')
  const found = orders.find((o) => o.number.toLowerCase() === searched.trim().toLowerCase())

  return (
    <>
      <Breadcrumb items={[{ label: 'Accueil', to: '/' }, { label: 'Suivre ma commande' }]} />
      <section className="container-x max-w-2xl pb-24 pt-4">
        <h1 className="font-display text-5xl">Suivre ma commande</h1>
        <p className="mt-3 text-sm text-ink/65">Entrez le numéro reçu à la confirmation (ex: SV-123456).</p>
        <form onSubmit={(e) => { e.preventDefault(); setSearched(q) }} className="mt-8 flex">
          <input value={q} onChange={(e) => setQ(e.target.value)} aria-label="Numéro de commande" placeholder="SV-123456" className={`${inp} uppercase`} />
          <button className="btn-dark flex items-center gap-2 px-6"><Search size={14} /> Suivre</button>
        </form>
        {searched && (found ? (
          <div className="mt-8 border border-line bg-white p-6">
            <p className="font-semibold">Commande {found.number} <span className="ml-2 text-xs font-normal text-ink/65">{fmt(found.date)}</span></p>
            <p className="mt-1 text-sm text-ink/60">{found.items.join(' · ')}, {fcfa(found.total)}</p>
            <Timeline step={orderStep(found)} />
          </div>
        ) : (
          <p role="alert" className="mt-8 border border-line bg-white p-6 text-sm text-ink/70">
            Aucune commande trouvée avec ce numéro sur cet appareil. Écrivez-nous sur{' '}
            <a className="font-semibold underline" href="https://wa.me/22950000000" target="_blank" rel="noreferrer">WhatsApp</a> avec votre numéro.
          </p>
        ))}
      </section>
    </>
  )
}

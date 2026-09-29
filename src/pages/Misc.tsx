import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Heart } from 'lucide-react'
import { Breadcrumb, ProductCard } from '../components/ui'
import { PRODUCTS } from '../data/products'
import { useFavorites } from '../store/favorites'
import { staticSeo, useSeo } from '../seo'

export function Favorites() {
  useSeo(staticSeo('/favoris'))
  const ids = useFavorites((s) => s.ids)
  const list = PRODUCTS.filter((p) => ids.includes(p.id))
  return (
    <>
      <Breadcrumb items={[{ label: 'Accueil', to: '/' }, { label: 'Mes favoris' }]} />
      <section className="container-x pb-24 pt-4">
        <h1 className="font-display text-5xl">Mes favoris</h1>
        {list.length === 0 ? (
          <div className="mt-10 border border-line bg-white p-14 text-center">
            <Heart size={32} className="mx-auto text-tan-dark" />
            <p className="mt-4 text-ink/70">Vous n'avez pas encore de favoris. Touchez le cœur d'un article pour le retrouver ici.</p>
            <Link to="/collection" className="btn-dark mt-6 inline-flex items-center gap-3 px-7 py-3.5">Voir la collection <ArrowRight size={14} /></Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{list.map((p) => <ProductCard key={p.id} p={p} />)}</div>
        )}
      </section>
    </>
  )
}

export function NotFound() {
  useSeo({ title: 'Page introuvable | StyleVibe', description: "Cette page n'existe pas.", path: '/404', noindex: true })
  return (
    <section className="container-x py-28 text-center">
      <p className="eyebrow">Erreur 404</p>
      <h1 className="mt-3 font-display text-6xl">Page introuvable</h1>
      <p className="mx-auto mt-4 max-w-md text-ink/65">Cette page n'existe pas ou a été déplacée. Revenez à la boutique pour continuer vos achats.</p>
      <div className="mt-8 flex justify-center gap-3">
        <Link to="/" className="btn-dark px-7 py-3.5">Accueil</Link>
        <Link to="/collection" className="btn-outline px-7 py-3.5">Collection</Link>
      </div>
    </section>
  )
}

export class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null }
  static getDerivedStateFromError(error: Error) { return { error } }
  private reset = () => this.setState({ error: null })
  componentDidMount() { window.addEventListener('hashchange', this.reset); window.addEventListener('popstate', this.reset) }
  componentWillUnmount() { window.removeEventListener('hashchange', this.reset); window.removeEventListener('popstate', this.reset) }
  componentDidCatch(error: Error, info: ErrorInfo) { console.error(error, info) }
  render() {
    if (!this.state.error) return this.props.children
    return (
      <section className="mx-auto max-w-lg px-6 py-28 text-center">
        <h1 className="font-display text-5xl">Oups, une erreur est survenue</h1>
        <p className="mt-4 text-sm text-neutral-600">La page n'a pas pu s'afficher. Rechargez-la, ou videz vos données si le problème persiste.</p>
        <div className="mt-8 flex justify-center gap-3">
          <button onClick={() => location.reload()} className="btn-dark px-7 py-3.5">Recharger</button>
          <button onClick={() => { localStorage.clear(); location.href = location.protocol === 'file:' ? location.pathname : '/' }} className="btn-outline px-7 py-3.5">Réinitialiser</button>
        </div>
      </section>
    )
  }
}

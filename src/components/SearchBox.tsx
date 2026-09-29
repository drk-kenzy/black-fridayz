import { useEffect, useMemo, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { CATEGORIES, PRODUCTS, fcfa } from '../data/products'

const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

export function SearchBox({ className = '', onDone }: { className?: string; onDone?: () => void }) {
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const box = useRef<HTMLDivElement>(null)

  const results = useMemo(() => {
    const n = norm(q.trim())
    if (n.length < 2) return []
    const cat = (id: string) => CATEGORIES.find((c) => c.id === id)?.label ?? ''
    return PRODUCTS.filter((p) => norm(`${p.name} ${cat(p.category)}`).includes(n)).slice(0, 5)
  }, [q])

  useEffect(() => {
    const close = (e: MouseEvent) => { if (!box.current?.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  const done = () => { setOpen(false); setActive(-1); onDone?.() }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (active >= 0 && results[active]) navigate(`/produit/${results[active].id}`)
    else navigate(`/collection${q.trim() ? `?q=${encodeURIComponent(q.trim())}` : ''}`)
    done()
  }

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(results.length - 1, a + 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(-1, a - 1)) }
    else if (e.key === 'Escape') setOpen(false)
  }

  return (
    <div ref={box} className={`relative ${className}`}>
      <form onSubmit={submit} role="search" className="flex items-center gap-2 bg-sand px-3.5 py-2.5 text-sm">
        <Search size={14} className="shrink-0 text-ink/60" />
        <input
          value={q}
          onChange={(e) => { setQ(e.target.value); setOpen(true); setActive(-1) }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKey}
          placeholder="Rechercher un style..."
          aria-label="Rechercher un produit"
          aria-expanded={open && results.length > 0}
          aria-controls="search-results"
          role="combobox"
          aria-autocomplete="list"
          className="w-full min-w-0 bg-transparent outline-none placeholder:text-ink/65"
        />
      </form>
      {open && q.trim().length >= 2 && (
        <ul id="search-results" role="listbox" className="absolute left-0 right-0 top-full z-50 mt-1 min-w-72 border border-line bg-white shadow-xl">
          {results.length === 0 ? (
            <li className="px-4 py-3 text-sm text-ink/60">Aucun résultat pour « {q} »</li>
          ) : (
            <>
              {results.map((p, i) => (
                <li key={p.id} role="option" aria-selected={i === active}>
                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onClick={() => { navigate(`/produit/${p.id}`); done() }}
                    className={`flex w-full items-center gap-3 px-3 py-2.5 text-left ${i === active ? 'bg-sand' : ''}`}
                  >
                    <img src={p.images[0]} alt="" className="size-10 object-cover" />
                    <span className="flex-1 text-sm font-medium">{p.name}</span>
                    <span className="text-xs font-semibold text-brand">{fcfa(p.price)}</span>
                  </button>
                </li>
              ))}
              <li>
                <button type="button" onClick={() => { navigate(`/collection?q=${encodeURIComponent(q.trim())}`); done() }} className="w-full border-t border-line px-4 py-2.5 text-left text-xs font-semibold underline">
                  Voir tous les résultats
                </button>
              </li>
            </>
          )}
        </ul>
      )}
    </div>
  )
}

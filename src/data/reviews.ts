import type { Category, Product } from './products'

/**
 * Avis de démonstration, générés de façon déterministe (mêmes avis à chaque visite).
 * À REMPLACER par de vrais avis clients avant la mise en ligne : publier de faux avis
 * est interdit par la réglementation sur la protection des consommateurs.
 */
export interface Review {
  id: string
  name: string
  city: string
  rating: number
  title: string
  text: string
  /** timestamp */
  date: number
}

const FIRST = ['Prudence', 'Marc-Aurèle', 'Sonia', 'Kévin', 'Fatou', 'Rodrigue', 'Ornella', 'Judicaël', 'Christelle', 'Éric', 'Nadège', 'Yannick', 'Carine', 'Habib', 'Flora', 'Arnaud', 'Gildas', 'Laurelle', 'Cédric', 'Mariam', 'Ulrich', 'Espérance', 'Thierry', 'Dorcas', 'Landry', 'Aïcha', 'Franck', 'Lydie', 'Serge', 'Josiane', 'Bertrand', 'Nicole', 'Damien', 'Rachidath', 'Wilfried', 'Colette']
const LAST = ['T.', 'B.', 'D.', 'A.', 'S.', 'H.', 'K.', 'M.', 'G.', 'Z.', 'L.', 'O.', 'P.', 'F.', 'C.', 'N.', 'R.', 'Y.', 'E.', 'V.']
const CITIES = ['Cotonou', 'Cotonou', 'Cotonou', 'Abomey-Calavi', 'Abomey-Calavi', 'Porto-Novo', 'Parakou', 'Ouidah', 'Bohicon', 'Natitingou', 'Lokossa', 'Djougou']

const OPEN = [
  'Franchement,', 'Très satisfait(e) :', 'Commande reçue rapidement.', 'Je recommande.', 'Bonne surprise !', "Ça valait l'attente.", 'Achat plaisir.', 'Super expérience.', 'Livraison rapide,', 'Premier achat sur StyleVibe,',
]
const CLOSE = [
  'Je repasserai commande.', 'Le service WhatsApp est très réactif.', 'Livré à Cotonou en moins de 24h.', 'Bon rapport qualité prix.', 'Le colis était bien emballé.', 'Merci StyleVibe !', 'Exactement comme sur les photos.', "J'en parle déjà autour de moi.",
]

const BODY: Record<Category, string[]> = {
  sneakers: ['confortables dès la première sortie, la semelle amortit bien.', 'la finition est propre et la pointure taille juste.', "je les porte tous les jours à Cotonou, elles tiennent bien.", 'le style est top, on me pose la question à chaque fois.', 'la matière est agréable et facile à nettoyer.'],
  vetements: ['la coupe est parfaite et le tissu de bonne qualité.', "la taille correspond au guide, j'ai pris ma taille habituelle.", 'les finitions sont soignées, on dirait une pièce plus chère.', 'très agréable à porter avec cette chaleur.', 'les couleurs sont fidèles à la photo.'],
  sacs: ["le cuir est souple et l'odeur est agréable.", 'spacieux, je fais tenir mon ordinateur et mes affaires.', 'les coutures sont solides, rien à redire.', 'très élégant, il va avec toutes mes tenues.', 'les fermetures fonctionnent très bien.'],
  montres: ["le cadran est superbe et la montre est précise.", "belle finition, elle a de l'allure au poignet.", 'plus belle en vrai que sur les photos.', 'le bracelet est confortable, même en journée chaude.', "j'ai eu plusieurs compliments dès le premier jour."],
  lunettes: ['légères et solides, les verres protègent bien du soleil.', 'la monture est confortable, pas de marque derrière les oreilles.', 'elles vont bien avec mon visage, très stylées.', 'la qualité est là pour ce prix.', 'livrées avec un bel étui.'],
  parfums: ['la tenue est excellente, encore présent le soir.', 'un parfum élégant, pas trop fort.', 'le flacon est magnifique, parfait pour offrir.', 'le sillage est agréable et durable.', "c'est exactement ce que je cherchais."],
}

const MIXED = [
  "Produit conforme, la livraison a pris un jour de plus que prévu mais l'équipe m'a prévenu.",
  "Très bien dans l'ensemble, j'aurais aimé plus de choix de couleurs.",
  "Bonne qualité, l'emballage pourrait être plus soigné.",
]
const TITLES_5 = ['Excellent', 'Parfait', 'Très satisfaite', 'Je recommande', 'Superbe qualité', 'Top !', 'Coup de cœur', 'Rien à redire']
const TITLES_4 = ['Très bien', 'Bon achat', 'Satisfait', 'Bon rapport qualité prix']
const TITLES_3 = ['Correct', 'Pas mal']

/** générateur pseudo-aléatoire déterministe */
function mulberry32(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const hash = (s: string) => [...s].reduce((h, c) => (Math.imul(h, 31) + c.charCodeAt(0)) | 0, 7)

/** Répartition des notes (5 → 1) cohérente avec la note moyenne annoncée. */
export function ratingBreakdown(rating: number, total: number): [number, number, number, number, number] {
  const p1 = 0.01, p2 = 0.01
  const p3 = Math.max(0.01, (5 - rating) * 0.09)
  const p5 = Math.min(0.97 - p3, Math.max(0.05, rating - 3.95 + p3))
  const p4 = Math.max(0, 1 - p1 - p2 - p3 - p5)
  const raw = [p5, p4, p3, p2, p1].map((p) => Math.round(p * total))
  raw[0] += total - raw.reduce((a, b) => a + b, 0)
  // ajustement fin : les arrondis peuvent décaler la moyenne sur les produits à peu d'avis
  const mean = () => raw.reduce((n, c, i) => n + c * (5 - i), 0) / total
  const tolerance = Math.max(0.02, 0.5 / total)
  for (let guard = 0; guard < total && Math.abs(mean() - rating) > tolerance; guard++) {
    if (mean() < rating) {
      const i = [1, 2, 3].reduce((best, k) => (raw[k] > raw[best] ? k : best), 1) // note la plus fréquente sous 5
      if (raw[i] === 0) break
      raw[i]--; raw[i - 1]++
    } else {
      const i = raw[0] > raw[1] ? 0 : 1 // 5 vers 4, ou 4 vers 3
      if (raw[i] === 0) break
      raw[i]--; raw[i + 1]++
    }
  }
  return raw as [number, number, number, number, number]
}

const cache = new Map<string, Review[]>()

export function generateReviews(p: Pick<Product, 'id' | 'category' | 'rating' | 'reviews'>, now = Date.now()): Review[] {
  const key = `${p.id}:${p.reviews}:${Math.floor(now / 86400000)}`
  const hit = cache.get(key)
  if (hit) return hit

  const rnd = mulberry32(hash(p.id))
  const pick = <T,>(arr: T[]) => arr[Math.floor(rnd() * arr.length)]
  const counts = ratingBreakdown(p.rating, p.reviews)
  const ratings: number[] = []
  counts.forEach((c, i) => { for (let n = 0; n < c; n++) ratings.push(5 - i) })
  for (let i = ratings.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [ratings[i], ratings[j]] = [ratings[j], ratings[i]] }

  const out: Review[] = ratings.map((rating, i) => {
    const text = rating <= 3
      ? pick(MIXED)
      : `${pick(OPEN)} ${pick(BODY[p.category])} ${rnd() > 0.35 ? pick(CLOSE) : ''}`.trim()
    const title = rating === 5 ? pick(TITLES_5) : rating === 4 ? pick(TITLES_4) : pick(TITLES_3)
    // plus l'avis est bas dans la liste, plus il est ancien (de 1 à ~120 jours)
    const days = 1 + Math.floor((i / Math.max(1, ratings.length)) * 110 + rnd() * 6)
    return {
      id: `${p.id}-${i}`,
      name: `${pick(FIRST)} ${pick(LAST)}`,
      city: pick(CITIES),
      rating,
      title,
      text: text.charAt(0).toUpperCase() + text.slice(1),
      date: now - days * 86400000,
    }
  })
  cache.set(key, out)
  return out
}

/** Témoignages mis en avant sur l'accueil (démonstration). */
export const HOME_TESTIMONIALS = [
  { name: 'Prudence T.', city: 'Cotonou', product: 'Sac Messenger Cuir', text: 'La qualité du cuir et les finitions sont incroyables. Reçu le lendemain à Fidjrossè. Je recommande sans hésiter StyleVibe pour leur réactivité.' },
  { name: 'Marc-Aurèle B.', city: 'Porto-Novo', product: 'Sneakers Urban X', text: "Les sneakers sont authentiques et ultra confortables. Le service d'échange de taille par WhatsApp m'a rassuré sur mon achat à distance." },
  { name: 'Sonia D.', city: 'Abomey-Calavi', product: 'Parfum Élégance', text: "Un parfum d'une sophistication remarquable. Parfait pour les occasions spéciales. Le packaging est digne de grands couturiers." },
  { name: 'Kévin A.', city: 'Parakou', product: 'Montre Classic Gold', text: "Commande passée le soir, confirmation par WhatsApp tout de suite. La montre est encore plus belle en vrai. Paiement MoMo sans problème." },
  { name: 'Fatou S.', city: 'Cotonou', product: 'Robe Wax Élégance', text: "J'ai eu des compliments toute la soirée. Le tissu est superbe et la taille correspond parfaitement au guide." },
  { name: 'Rodrigue H.', city: 'Ouidah', product: 'Blazer Beige Tailleur', text: "Échange de taille gratuit et rapide, comme promis. Une boutique sérieuse, je commande déjà pour un ami." },
]

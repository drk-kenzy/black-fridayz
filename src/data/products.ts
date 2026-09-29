export type Category = 'sneakers' | 'vetements' | 'sacs' | 'montres' | 'lunettes' | 'parfums'

export interface ProductColor {
  name: string
  hex: string
  /** index de la photo à afficher quand cette couleur est choisie */
  image?: number
}

export interface Product {
  id: string
  name: string
  category: Category
  price: number
  oldPrice: number
  rating: number
  reviews: number
  images: string[]
  description: string[]
  specs: [string, string][]
  colors?: ProductColor[]
  sizes?: string[]
  defaultSize?: string
  stock: number
  popular?: boolean
  flash?: boolean
  createdAt: number
}

export const u = (id: string, w = 900) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`

/** Fin de l'opération : Black Friday, vendredi 27 novembre 2026 à minuit (heure du Bénin, UTC+1). */
export const SALE_END = new Date('2026-11-27T23:59:59+01:00').getTime()
export const SALE_END_LABEL = 'vendredi 27 novembre à minuit'

export const IMG = {
  hero: u('1653242832879-d730d48617f9', 1400),
  showroom: u('1490481651871-ab68de25d43d', 1200),
}

export const CATEGORIES: { id: Category; label: string; count: number; image: string }[] = [
  { id: 'sneakers', label: 'Sneakers', count: 124, image: u('1597350584914-55bb62285896', 700) },
  { id: 'vetements', label: 'Vêtements', count: 210, image: u('1490481651871-ab68de25d43d', 700) },
  { id: 'sacs', label: 'Sacs', count: 95, image: u('1473188588951-666fce8e7c68', 700) },
  { id: 'montres', label: 'Montres', count: 42, image: u('1662333084914-3eea84762671', 700) },
  { id: 'lunettes', label: 'Lunettes', count: 67, image: u('1511499767150-a48a237f0083', 700) },
  { id: 'parfums', label: 'Parfums', count: 38, image: u('1588405748880-12d1d2a59f75', 700) },
]

/** Textes de référencement des pages catégories (URL /collection/<catégorie>). */
export const CATEGORY_SEO: Record<Category, { title: string; description: string; h1: string; intro: string }> = {
  sneakers: {
    title: 'Sneakers et chaussures Black Friday au Bénin, jusqu\'à -60%',
    description: 'Sneakers, bottes et chaussures de ville en promotion Black Friday. Livraison en 24h à Cotonou, Calavi et Porto-Novo, paiement MTN MoMo et Moov Money, échange gratuit.',
    h1: 'Sneakers & chaussures',
    intro: 'Sneakers urbaines, runners et bottes de ville à prix Black Friday. Choisissez votre pointure avec notre guide des tailles, réglez par MTN MoMo, Moov Money ou à la livraison, et échangez gratuitement sous 3 jours si la taille ne convient pas.',
  },
  vetements: {
    title: 'Vêtements homme et femme Black Friday à Cotonou, jusqu\'à -60%',
    description: 'Trench, blazer, robe wax, chemise en lin, polo : le prêt-à-porter en promotion Black Friday. Livraison express à Cotonou, paiement mobile money, échange gratuit.',
    h1: 'Vêtements',
    intro: 'Du blazer tailleur à la robe wax, retrouvez le prêt-à-porter de la saison à prix réduit. Chaque pièce est contrôlée avant expédition et livrée sous 24 à 48h à Cotonou, Calavi et Porto-Novo.',
  },
  sacs: {
    title: 'Sacs en cuir Black Friday au Bénin : messenger, cabas, weekender',
    description: 'Sacs en cuir en promotion Black Friday : messenger, sac à main, cabas et weekender. Livraison rapide au Bénin, paiement sécurisé MTN MoMo et Moov Money.',
    h1: 'Sacs',
    intro: 'Sacs messenger, cabas, sacs à main et weekenders en cuir véritable, à prix Black Friday. Coutures solides, finitions soignées et livraison express à Cotonou.',
  },
  montres: {
    title: 'Montres et bracelets Black Friday au Bénin, jusqu\'à -40%',
    description: 'Montres dorées, chronographes, montres or rose et bracelets en cuir en promotion Black Friday. Livraison en 24h à Cotonou, garantie satisfaction 7 jours.',
    h1: 'Montres & bracelets',
    intro: 'Montres classiques, chronographes et bracelets en cuir pour sublimer votre poignet. Garantie satisfaction de 7 jours et service client WhatsApp pour vous conseiller.',
  },
  lunettes: {
    title: 'Lunettes de soleil Black Friday au Bénin : aviator, montures or',
    description: 'Lunettes de soleil polarisées UV400 en promotion Black Friday : aviator, montures cerclées or. Livraison express à Cotonou, échange gratuit.',
    h1: 'Lunettes de soleil',
    intro: 'Aviator, montures fines cerclées or ou acétate noir : des lunettes légères, protégées UV400, à prix Black Friday.',
  },
  parfums: {
    title: 'Parfums Black Friday au Bénin : ambré, boisé, nuit noire',
    description: 'Eaux de parfum homme et femme en promotion Black Friday. Flacons en édition limitée, livraison en 24h à Cotonou, paiement MTN MoMo et Moov Money.',
    h1: 'Parfums',
    intro: 'Eaux de parfum ambrées, boisées ou florales, dans leur coffret d\'édition limitée. Le cadeau idéal, livré rapidement et soigneusement emballé.',
  },
}

const SHOE_SIZES =['39', '40', '41', '42', '43', '44', '45']
const CLOTH_SIZES = ['S', 'M', 'L', 'XL', 'XXL']

export const PRODUCTS: Product[] = [
  {
    id: 'sneakers-urban-x', name: 'Sneakers Urban X', category: 'sneakers', price: 49900, oldPrice: 85000,
    rating: 4.8, reviews: 124, stock: 4, popular: true, createdAt: 24,
    images: [u('1597350584914-55bb62285896'), u('1544441892-794166f1e3be'), u('1608229751021-ed4bd8677753'), u('1625860191460-10a66c7384fb')],
    colors: [{ name: 'Blanc exclusif', hex: '#ffffff', image: 0 }, { name: 'Blanc & Noir', hex: '#161616', image: 1 }, { name: 'Gris', hex: '#8b8b90', image: 2 }],
    sizes: SHOE_SIZES, defaultSize: '42',
    description: [
      "Les sneakers Urban X combinent un confort exceptionnel et un style d'inspiration rétro-futuriste. Pensées pour les passionnés de mode urbaine au Bénin, elles sont dotées d'une semelle amortissante innovante qui absorbe les chocs quotidiens de la ville. Confectionnées dans un cuir synthétique haut de gamme facile d'entretien, elles conservent leur éclat originel saison après saison.",
      "Idéales pour toutes vos sorties à Fidjrossè ou vos journées de travail actives à Cotonou, elles s'accordent aussi bien avec un short chic qu'un pantalon tailleur.",
    ],
    specs: [['Matière', 'Cuir synthétique premium texturé'], ['Semelle', 'Caoutchouc naturel vulcanisé'], ['Fermeture', 'Lacets plats en coton'], ['Poids', '320g par chaussure (taille 42)']],
  },
  {
    id: 'sneakers-sunset-runner', name: 'Sneakers Sunset Runner', category: 'sneakers', price: 42900, oldPrice: 72000,
    rating: 4.6, reviews: 61, stock: 9, createdAt: 23,
    images: [u('1549298916-b41d501d3772'), u('1552346154-21d32810aba3')],
    colors: [{ name: 'Ambre', hex: '#c98a3a', image: 0 }, { name: 'Rouge & Noir', hex: '#b3202a', image: 1 }],
    sizes: SHOE_SIZES, defaultSize: '42',
    description: ['Une silhouette de running revisitée pour la ville, aux teintes chaudes et à la semelle très amortie.'],
    specs: [['Matière', 'Cuir et mesh respirant'], ['Semelle', 'Mousse EVA'], ['Poids', '290 g (taille 42)']],
  },
  {
    id: 'sneakers-court-pastel', name: 'Sneakers Court Pastel', category: 'sneakers', price: 38900, oldPrice: 65000,
    rating: 4.5, reviews: 47, stock: 14, createdAt: 15,
    images: [u('1595950653106-6c9ebd614d3a')],
    colors: [{ name: 'Pastel', hex: '#bcd3f0', image: 0 }],
    sizes: SHOE_SIZES, defaultSize: '41',
    description: ['Des sneakers basses aux touches pastel, pour une allure fraîche et décontractée toute la saison.'],
    specs: [['Matière', 'Cuir vegan'], ['Semelle', 'Caoutchouc'], ['Fermeture', 'Lacets']],
  },
  {
    id: 'bottes-ville-suedine', name: 'Bottes de Ville Suédine', category: 'sneakers', price: 44000, oldPrice: 110000,
    rating: 4.7, reviews: 33, stock: 2, flash: true, createdAt: 20,
    images: [u('1608629601270-a0007becead3'), u('1643226354613-260043e30011')],
    colors: [{ name: 'Marron', hex: '#7a4a2c', image: 0 }],
    sizes: SHOE_SIZES, defaultSize: '42',
    description: ['Chelsea boots en suédine souple avec élastiques latéraux et semelle crantée. Un incontournable élégant.'],
    specs: [['Matière', 'Suédine premium'], ['Semelle', 'Caoutchouc'], ['Fermeture', 'Élastiques latéraux']],
  },
  {
    id: 'chemise-lin-premium', name: 'Chemise Lin Premium', category: 'vetements', price: 22900, oldPrice: 38000,
    rating: 4.4, reviews: 52, stock: 20, createdAt: 19,
    images: [u('1602810316498-ab67cf68c8e1'), u('1602810318383-e386cc2a3ccf')],
    colors: [{ name: 'Blanc', hex: '#f4efe4', image: 0 }, { name: 'Bordeaux & Marine', hex: '#5a2a3a', image: 1 }],
    sizes: CLOTH_SIZES, defaultSize: 'M',
    description: ['Une chemise en lin lavé, respirante et fluide, parfaite pour le climat de Cotonou. Coupe droite, col italien.'],
    specs: [['Matière', '100% lin'], ['Coupe', 'Droite'], ['Entretien', 'Lavage 30°C'], ['Col', 'Italien']],
  },
  {
    id: 'polo-classic-fit', name: 'Polo Classic Fit', category: 'vetements', price: 19900, oldPrice: 32000,
    rating: 4.6, reviews: 73, stock: 25, createdAt: 18,
    images: [u('1761956260682-fe12109d7878'), u('1761956255479-484d7d4fe68a')],
    colors: [{ name: 'Beige', hex: '#cdb08b', image: 0 }, { name: 'Sable', hex: '#b9a07a', image: 1 }],
    sizes: CLOTH_SIZES, defaultSize: 'L',
    description: ["Polo en coton piqué, coupe classique et col structuré. Le basique chic à porter toute l'année."],
    specs: [['Matière', 'Coton piqué 220 g/m²'], ['Coupe', 'Classic fit'], ['Entretien', 'Lavage 30°C']],
  },
  {
    id: 'trench-coat-luxe-camel', name: 'Trench Coat Luxe Camel', category: 'vetements', price: 58000, oldPrice: 145000,
    rating: 4.8, reviews: 39, stock: 4, flash: true, createdAt: 22,
    images: [u('1633821879282-0c4e91f96232'), u('1676716105765-e19fe6a01851'), u('1539533113208-f6df8cc8b543')],
    colors: [{ name: 'Camel', hex: '#b98b5c', image: 0 }],
    sizes: CLOTH_SIZES, defaultSize: 'M',
    description: ["Le trench double boutonnage en gabardine de coton, ceinture nouée et doublure satinée. Une pièce d'exception à prix Black Friday."],
    specs: [['Matière', 'Gabardine de coton'], ['Doublure', 'Satin'], ['Coupe', 'Droite, longueur genou']],
  },
  {
    id: 'blazer-beige-tailleur', name: 'Blazer Beige Tailleur', category: 'vetements', price: 47900, oldPrice: 89000,
    rating: 4.7, reviews: 36, stock: 8, popular: true, createdAt: 21,
    images: [u('1595358418264-f94eca33666a'), u('1595358418435-4765e059d4c8')],
    colors: [{ name: 'Beige', hex: '#cbb694', image: 0 }],
    sizes: CLOTH_SIZES, defaultSize: 'L',
    description: ['Un blazer structuré coupe ajustée, doublé et légèrement stretch. Il habille aussi bien un jean qu’un pantalon de costume.'],
    specs: [['Matière', 'Mélange laine et polyester'], ['Doublure', 'Viscose'], ['Coupe', 'Ajustée']],
  },
  {
    id: 'robe-wax-elegance', name: 'Robe Wax Élégance', category: 'vetements', price: 36900, oldPrice: 62000,
    rating: 4.9, reviews: 88, stock: 6, popular: true, createdAt: 17,
    images: [u('1628144029346-8a98676311b6'), u('1709809081557-78f803ce93a0'), u('1601653233006-5c9fd30eab12')],
    colors: [{ name: 'Wax multicolore', hex: '#d9822b', image: 0 }, { name: 'Kente', hex: '#3b6ea8', image: 2 }],
    sizes: CLOTH_SIZES, defaultSize: 'M',
    description: ["Une robe en tissu wax aux motifs vifs, coupée pour sublimer la silhouette. Confectionnée avec des tissus d'Afrique de l'Ouest."],
    specs: [['Matière', 'Coton wax'], ['Longueur', 'Midi'], ['Entretien', 'Lavage à froid']],
  },
  {
    id: 'veste-bomber-camel', name: 'Veste Bomber Camel', category: 'vetements', price: 31900, oldPrice: 52000,
    rating: 4.5, reviews: 29, stock: 11, createdAt: 12,
    images: [u('1591047139829-d91aecb6caea')],
    colors: [{ name: 'Camel', hex: '#b97a4a', image: 0 }],
    sizes: CLOTH_SIZES, defaultSize: 'L',
    description: ['Un bomber léger à col rond, zippé, parfait pour les soirées fraîches de l’harmattan.'],
    specs: [['Matière', 'Polyester déperlant'], ['Fermeture', 'Zip métal'], ['Poches', '2 poches latérales']],
  },
  {
    id: 'pantalon-lin-sable', name: 'Pantalon Lin Sable', category: 'vetements', price: 24900, oldPrice: 42000,
    rating: 4.3, reviews: 24, stock: 17, createdAt: 8,
    images: [u('1715233749622-3216fe49e682')],
    colors: [{ name: 'Sable', hex: '#d1bfa0', image: 0 }],
    sizes: ['38', '40', '42', '44', '46'], defaultSize: '42',
    description: ['Pantalon droit en lin mélangé, taille élastiquée et coupe fluide pour les journées chaudes.'],
    specs: [['Matière', 'Lin et coton'], ['Coupe', 'Droite'], ['Taille', 'Élastiquée']],
  },
  {
    id: 'sac-messenger-cuir', name: 'Sac Messenger Cuir', category: 'sacs', price: 69900, oldPrice: 120000,
    rating: 4.7, reviews: 98, stock: 6, popular: true, createdAt: 16,
    images: [u('1473188588951-666fce8e7c68'), u('1657603738389-951c374b740c'), u('1510783891783-80cda42ebfd2')],
    colors: [{ name: 'Camel', hex: '#a9683a', image: 0 }, { name: 'Cognac', hex: '#8a4b25', image: 1 }],
    description: [
      'Un sac messenger en cuir de veau pleine fleur, pensé pour accompagner vos journées de bureau comme vos escapades du week-end.',
      'Compartiment principal spacieux pour ordinateur 15 pouces, poches intérieures organisées et bandoulière réglable.',
    ],
    specs: [['Matière', 'Cuir de veau pleine fleur'], ['Dimensions', '38 × 28 × 10 cm'], ['Fermeture', 'Boucles métalliques dorées'], ['Poids', '1,1 kg']],
  },
  {
    id: 'sac-weekender-cuir', name: 'Sac Weekender Cuir', category: 'sacs', price: 54900, oldPrice: 92000,
    rating: 4.4, reviews: 27, stock: 10, createdAt: 11,
    images: [u('1608731267464-c0c889c2ff92'), u('1657603738389-951c374b740c')],
    colors: [{ name: 'Marron', hex: '#7a4a2c', image: 0 }],
    description: ['Sac de voyage en cuir avec finitions cousues main, idéal pour un week-end à Ouidah ou Grand-Popo.'],
    specs: [['Matière', 'Cuir de vachette'], ['Volume', '38 L'], ['Poids', '1,4 kg']],
  },
  {
    id: 'sac-a-main-cuir', name: 'Sac à Main Cuir Chaîne', category: 'sacs', price: 45900, oldPrice: 78000,
    rating: 4.6, reviews: 44, stock: 7, createdAt: 14,
    images: [u('1598532163257-ae3c6b2524b6'), u('1691480150204-66dd1eb77391')],
    colors: [{ name: 'Cognac', hex: '#a2622e', image: 0 }, { name: 'Marron', hex: '#6b4226', image: 1 }],
    description: ['Un sac porté épaule en cuir souple, agrémenté d’une chaîne dorée. Élégant de jour comme de nuit.'],
    specs: [['Matière', 'Cuir souple'], ['Fermeture', 'Aimant'], ['Bandoulière', 'Chaîne amovible']],
  },
  {
    id: 'sac-cabas-camel', name: 'Sac Cabas Camel', category: 'sacs', price: 39900, oldPrice: 68000,
    rating: 4.5, reviews: 31, stock: 12, createdAt: 9,
    images: [u('1624687943971-e86af76d57de'), u('1635866091268-87ca924abc9a')],
    colors: [{ name: 'Camel', hex: '#b5773f', image: 0 }],
    description: ['Un grand cabas structuré pour le quotidien : il accueille un ordinateur, vos documents et vos essentiels.'],
    specs: [['Matière', 'Cuir grainé'], ['Dimensions', '40 × 32 × 14 cm'], ['Poids', '900 g']],
  },
  {
    id: 'montre-classic-gold', name: 'Montre Classic Gold', category: 'montres', price: 59900, oldPrice: 95000,
    rating: 4.9, reviews: 156, stock: 8, popular: true, createdAt: 13,
    images: [u('1662333084914-3eea84762671'), u('1765446904789-f3b65e0334e3'), u('1773414753637-2738750cfbb6')],
    colors: [{ name: 'Or', hex: '#c9a45c', image: 0 }, { name: 'Or / Cuir', hex: '#8a5a2c', image: 1 }],
    description: [
      "Boîtier doré, cadran profond et bracelet maillé : la Classic Gold s'impose comme la pièce élégante de votre poignet.",
      'Mouvement à quartz fiable, verre minéral résistant aux rayures et étanchéité 3 ATM.',
    ],
    specs: [['Boîtier', 'Acier doré 40 mm'], ['Bracelet', 'Acier doré'], ['Mouvement', 'Quartz japonais'], ['Étanchéité', '3 ATM']],
  },
  {
    id: 'montre-rose-gold', name: 'Montre Rose Gold Skeleton', category: 'montres', price: 64900, oldPrice: 110000,
    rating: 4.7, reviews: 52, stock: 5, createdAt: 10,
    images: [u('1771734038899-f8c42dbc800f'), u('1771734038750-ff6269568e38')],
    colors: [{ name: 'Or rose', hex: '#c58c72', image: 0 }],
    description: ['Un cadran squelette et un boîtier or rose : une montre statement pour les grandes occasions.'],
    specs: [['Boîtier', 'Acier or rose 42 mm'], ['Mouvement', 'Automatique'], ['Étanchéité', '5 ATM']],
  },
  {
    id: 'montre-chrono-silver', name: 'Montre Chrono Silver', category: 'montres', price: 74900, oldPrice: 125000,
    rating: 4.8, reviews: 67, stock: 6, createdAt: 7,
    images: [u('1523170335258-f5ed11844a49'), u('1547996160-81dfa63595aa')],
    colors: [{ name: 'Argent / Bleu', hex: '#8c98a8', image: 0 }, { name: 'Argent / Noir', hex: '#2b2b2b', image: 1 }],
    description: ['Un chronographe sportif en acier brossé, cadran bleu profond et lunette graduée.'],
    specs: [['Boîtier', 'Acier 44 mm'], ['Mouvement', 'Quartz chronographe'], ['Étanchéité', '10 ATM']],
  },
  {
    id: 'bracelet-cuir-tresse', name: 'Bracelet Cuir Tressé', category: 'montres', price: 14900, oldPrice: 25000,
    rating: 4.3, reviews: 41, stock: 30, createdAt: 6,
    images: [u('1715446929992-3f3d2b7a9467'), u('1631039839751-f11934661702')],
    colors: [{ name: 'Brun / Or', hex: '#7a4a2c', image: 0 }],
    description: ['Bracelet en cuir tressé à la main avec fermoir doré. Un accessoire discret et raffiné.'],
    specs: [['Matière', 'Cuir tressé'], ['Fermoir', 'Acier doré'], ['Longueur', '21 cm']],
  },
  {
    id: 'lunettes-aviator-pro', name: 'Lunettes Aviator Pro', category: 'lunettes', price: 27900, oldPrice: 45000,
    rating: 4.5, reviews: 64, stock: 15, createdAt: 5,
    images: [u('1511499767150-a48a237f0083'), u('1572635196237-14b3f281503f')],
    colors: [{ name: 'Or', hex: '#c9a45c', image: 0 }, { name: 'Noir', hex: '#161616', image: 1 }],
    description: ['La forme aviateur indémodable, revisitée avec des verres polarisés dégradés et une monture métallique légère.'],
    specs: [['Monture', 'Métal doré'], ['Verres', 'Polarisés UV400'], ['Largeur', '58 mm'], ['Poids', '28 g']],
  },
  {
    id: 'lunettes-vibe-gold-rim', name: 'Lunettes Vibe Gold Rim', category: 'lunettes', price: 18000, oldPrice: 45000,
    rating: 4.6, reviews: 58, stock: 7, flash: true, createdAt: 4,
    images: [u('1572635196237-14b3f281503f'), u('1511499767150-a48a237f0083')],
    colors: [{ name: 'Noir', hex: '#161616', image: 0 }, { name: 'Or', hex: '#c9a45c', image: 1 }],
    description: ["Monture épaisse noire ou fine cerclée or : l'accessoire solaire de la saison."],
    specs: [['Monture', 'Acétate / métal'], ['Verres', 'UV400'], ['Poids', '26 g']],
  },
  {
    id: 'parfum-elegance-100ml', name: 'Parfum Élégance 100ml', category: 'parfums', price: 34900, oldPrice: 55000,
    rating: 4.6, reviews: 87, stock: 12, popular: true, createdAt: 3,
    images: [u('1588405748880-12d1d2a59f75'), u('1733660227168-444e3c751a1e'), u('1622618991746-fe6004db3a47')],
    description: [
      "Une eau de parfum sophistiquée aux notes d'ambre et de boisées, pour un sillage chaleureux et durable.",
      "Présenté dans un flacon de verre épais et son coffret d'édition limitée, il fait un cadeau idéal.",
    ],
    specs: [['Contenance', '100 ml'], ['Famille olfactive', 'Ambrée boisée'], ['Notes de tête', 'Bergamote, poivre rose'], ['Tenue', '8 à 10 heures']],
  },
  {
    id: 'parfum-nuit-noire', name: 'Parfum Nuit Noire 75ml', category: 'parfums', price: 39900, oldPrice: 65000,
    rating: 4.7, reviews: 49, stock: 9, createdAt: 2,
    images: [u('1643797517590-c44cb552ddcc'), u('1643797519086-cc9a821fbcfe')],
    description: ['Un parfum intense aux notes de cuir, de vétiver et de vanille noire, pour les soirées.'],
    specs: [['Contenance', '75 ml'], ['Famille olfactive', 'Boisée cuirée'], ['Tenue', '10 heures']],
  },
  {
    id: 'parfum-ambre-dore', name: 'Parfum Ambre Doré 50ml', category: 'parfums', price: 29900, oldPrice: 48000,
    rating: 4.5, reviews: 38, stock: 13, createdAt: 1,
    images: [u('1759793500112-c588839cfc6e')],
    description: ['Un sillage chaud et solaire d’ambre, de miel et de fleur d’oranger.'],
    specs: [['Contenance', '50 ml'], ['Famille olfactive', 'Ambrée florale'], ['Tenue', '7 heures']],
  },
]

export const discountPct = (p: Pick<Product, 'price' | 'oldPrice'>) =>
  Math.round((1 - p.price / p.oldPrice) * 100)

export const getProduct = (id: string) => PRODUCTS.find((p) => p.id === id)

export const fcfa = (n: number) =>
  new Intl.NumberFormat('fr-FR').format(Math.round(n)).replace(/[  ]/g, ' ') + ' FCFA'

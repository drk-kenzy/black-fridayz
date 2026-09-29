# StyleVibe : Black Friday

Front-end e-commerce (React + TypeScript + Vite + Tailwind CSS v4), d'après les maquettes du dossier `maquettes/`.

**Le plus simple (Windows) :** double-cliquer sur `Lancer le site.bat` (installe, démarre et ouvre le navigateur).

```bash
npm install
npm run dev            # http://localhost:5173
npm run build          # site de production dans dist/ (URL propres + pré-rendu SEO + sitemap)
npm run build:offline  # un seul fichier dist-offline/index.html, qui s'ouvre par double-clic
npm test               # 41 tests
```

⚠️ Ne pas ouvrir le `index.html` **de la racine** par double-clic : c'est le fichier source. Utiliser `npm run dev`, ou `dist-offline/index.html` après `npm run build:offline`.

## Mise en ligne (Netlify, Vercel, Cloudflare Pages, GitHub Pages)
1. **Changer le domaine** dans `src/seo.ts` (`SITE.url`, actuellement `https://stylevibe.bj`) puis relancer `npm run build`.
2. Publier le dossier `dist/`. Les fichiers `public/_redirects` (Netlify) et `vercel.json` gèrent les URL inconnues ; `dist/404.html` sert GitHub Pages.
3. Déclarer `https://<domaine>/sitemap.xml` dans Google Search Console et Bing Webmaster Tools.
4. Remplacer les coordonnées de démonstration (`+229 50 00 00 00`, `contact@stylevibe.bj`, adresse) par les vraies, partout de façon identique (cohérence NAP pour le référencement local).

## Référencement (SEO) et conversion
- **URL propres** (`/produit/montre-classic-gold`, `/collection/sneakers`) ; retour automatique aux URL en `#` quand le site est ouvert depuis un fichier.
- **Pré-rendu** de 36 pages au build : `<title>`, description, URL canonique, Open Graph / Twitter et JSON-LD propres à chaque page, plus un contenu `<noscript>` pour les robots sans JavaScript.
- **Données structurées** : Organization / ClothingStore, WebSite (recherche), Product + Offer (prix XOF, stock, livraison, retours) + AggregateRating + Review, BreadcrumbList, FAQPage, ItemList.
- **Pages catégories** indexables (`/collection/<catégorie>`) avec texte de référencement ; pages filtrées, recherche, panier, paiement et compte en `noindex`.
- `sitemap.xml`, `robots.txt`, `404.html`, favicon, manifest.
- **Performance** : images Unsplash servies en `srcset` adaptés à chaque écran, hero en priorité haute, chargement différé du reste, polices en `display=swap`.
- **Conversion** : barre d'achat collante sur mobile, commande directe sur WhatsApp (bouton flottant et bouton sur chaque fiche produit avec message prérempli), date de livraison estimée, preuve sociale (avis, note, nombre de clients), rareté du stock, code promo, barre de livraison gratuite, réassurance paiement / retours / garantie, explication « commander en 3 étapes ».

## Fonctionnalités
- 24 produits, 6 catégories, recherche avec suggestions, filtres (catégorie, prix, remise), tri, pagination
- Fiche produit : galerie avec zoom plein écran (flèches clavier), couleurs liées aux photos, guide des tailles, avis (répartition des notes, tri, « voir plus », publication d'un avis), favoris
- Tiroir panier, menu mobile, code promo `BLACKVIBE` (-20 000 FCFA, saisi par le client), livraison gratuite dès 50 000 FCFA
- Paiement : MTN MoMo / Moov (numéro validé), carte (contrôle de Luhn, expiration, CVC), paiement à la livraison ; paiement simulé
- Compte local (inscription/connexion), historique et suivi de commande, favoris
- Page 404, écran d'erreur, navigation clavier, focus visible, contrastes AA, animations réduites si demandé
- Responsive vérifié à 320, 375, 768, 1024, 1440 et 1920 px (aucun débordement horizontal)

## Tests
`npm test` : catalogue, totaux du panier et livraison, suivi de commande, générateur d'avis (nombre, moyenne, cohérence, absence de photo), SEO (unicité des titres et descriptions, longueurs, JSON-LD, pas de tiret cadratin) et parcours réels dans un navigateur simulé (panier vide au départ, ajout au panier, code promo, catalogue, recherche, validation du paiement, avis).

## Notes importantes
- **Les avis sont des données de démonstration**, générées automatiquement (`src/data/reviews.ts`) et les témoignages de l'accueil sont fictifs. **Ils doivent être remplacés par de vrais avis clients avant la mise en ligne** : publier de faux avis est interdit par la réglementation sur la protection des consommateurs et peut être sanctionné par Google (données structurées) comme par les autorités.
- Le nombre de clients (« 8 000+ »), la note (« 4,8/5 ») et les stocks affichés sont aussi des valeurs de démonstration.
- Front-end uniquement : produits dans `src/data/products.ts`, panier dans `src/store/cart.ts` (persisté dans `localStorage`).
- Le paiement est **simulé** ; le formulaire de contact n'envoie rien ; le compte est stocké dans le navigateur (mot de passe non vérifié). À brancher sur un back-end (ex. FedaPay, Supabase) plus tard.
- Le panier démarre vide : c'est le client qui le remplit. Le code promo `BLACKVIBE` n'est appliqué que s'il le saisit.
- Fin de l'opération : `SALE_END` dans `src/data/products.ts` (vendredi 27 novembre 2026 à minuit).
- Images : photos Unsplash référencées par URL ; internet est nécessaire pour les afficher.

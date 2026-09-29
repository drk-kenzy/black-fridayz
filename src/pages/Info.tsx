import { useState, type FormEvent } from 'react'
import { ArrowRight, Check, Clock, Lightbulb, MapPin, Mail, MessageCircle, RefreshCw, ShieldCheck, Sparkles, Truck, Wallet } from 'lucide-react'
import { AccordionItem, Breadcrumb, Img } from '../components/ui'
import { IMG } from '../data/products'
import { faqLd, staticSeo, useSeo } from '../seo'

export function About() {
  useSeo(staticSeo('/a-propos'))
  const stats = [['8000+', 'Clients satisfaits'], ['500+', 'Produits curés'], ['24h', 'Livraison Cotonou'], ['100%', 'Qualité garantie']]
  const values = [
    { icon: Sparkles, t: 'Le Style', d: 'Des silhouettes intemporelles et des tendances de pointe conçues pour sublimer votre singularité béninoise.' },
    { icon: ShieldCheck, t: 'La Qualité', d: "Aucun compromis sur les matériaux. Nos textiles, cuirs de sacs et sneakers sont d'une authenticité absolue." },
    { icon: Wallet, t: "L'Accessibilité", d: 'Les meilleurs prix du marché local en FCFA, couplés à des solutions de paiement fluides (MoMo & Moov).' },
  ]
  return (
    <>
      <Breadcrumb items={[{ label: 'Accueil', to: '/' }, { label: 'À Propos de Nous' }]} />
      <section className="container-x grid items-center gap-12 py-10 lg:grid-cols-2">
        <div>
          <p className="mb-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-brand">Qui sommes-nous ? <span className="h-px w-8 bg-brand" /></p>
          <h1 className="font-display text-6xl leading-none md:text-7xl">Notre Histoire</h1>
          <p className="mt-8 text-xl leading-relaxed text-ink/70">StyleVibe est née de la passion pour la mode accessible au Bénin. Nous curons méticuleusement les meilleures pièces mode et lifestyle internationales pour les rendre disponibles à Cotonou et ses environs.</p>
          <p className="mt-6 leading-relaxed text-ink/65">Chaque vêtement, chaque paire de sneakers et chaque accessoire présent dans notre catalogue fait l'objet d'un contrôle rigoureux de qualité. Nous pensons que le style ne devrait pas être un luxe inatteignable, mais une expression quotidienne de votre propre vibration.</p>
        </div>
        <div className="aspect-[4/4.6] overflow-hidden rounded-xl bg-sand"><Img src={IMG.showroom} alt="Portants de vêtements dans le showroom StyleVibe" className="size-full object-cover" /></div>
      </section>
      <section className="my-16 border-y border-line bg-sand/70">
        <div className="container-x grid grid-cols-2 gap-8 py-14 text-center lg:grid-cols-4">
          {stats.map(([n, l]) => (
            <div key={l}><p className="font-display text-6xl leading-none">{n}</p><p className="mt-3 text-[11px] font-semibold uppercase tracking-wider text-tan-dark">{l}</p></div>
          ))}
        </div>
      </section>
      <section className="container-x pb-24">
        <div className="mb-12 text-center"><h2 className="font-display text-5xl">Nos Valeurs Fondatrices</h2><p className="mt-3 text-xs font-medium uppercase tracking-wider text-tan-dark">Ce qui guide chaque sélection</p></div>
        <div className="grid gap-6 md:grid-cols-3">
          {values.map(({ icon: Icon, t, d }) => (
            <div key={t} className="border border-line bg-white p-8">
              <span className="grid size-12 place-items-center rounded-full bg-sand text-tan-dark"><Icon size={19} /></span>
              <h3 className="mt-5 font-display text-3xl">{t}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink/65">{d}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

export function Contact() {
  useSeo(staticSeo('/contact'))
  const [sent, setSent] = useState(false)
  const [f, setF] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF({ ...f, [k]: e.target.value })
  const submit = (e: FormEvent) => { e.preventDefault(); setSent(true) }
  const inp = 'w-full border border-line bg-white px-4 py-3.5 text-sm outline-none placeholder:text-ink/65 focus:border-ink'
  const lab = 'mb-2 block text-[11px] font-semibold uppercase tracking-wider'
  const info = [
    { icon: MessageCircle, l: 'Assistant WhatsApp', v: '+229 50 00 00 00', href: 'https://wa.me/22950000000' },
    { icon: Mail, l: 'Email support', v: 'hello@stylevibe.bj', href: 'mailto:hello@stylevibe.bj' },
    { icon: MapPin, l: 'Notre showroom', v: 'Fidjrossè, Rue de la Plage, Cotonou' },
    { icon: Clock, l: "Heures d'ouverture", v: 'Lundi - Samedi : 09h00 - 19h00' },
  ]
  return (
    <>
      <Breadcrumb items={[{ label: 'Accueil', to: '/' }, { label: 'Contactez-nous' }]} />
      <section className="container-x grid grid-cols-[minmax(0,1fr)] gap-14 pb-24 pt-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <div className="border border-line bg-white p-8 sm:p-10">
          {sent ? (
            <div className="py-16 text-center">
              <span className="mx-auto grid size-14 place-items-center rounded-full bg-emerald-100 text-emerald-700"><Check size={26} /></span>
              <h2 className="mt-6 font-display text-4xl">Message envoyé</h2>
              <p className="mt-3 text-sm text-ink/65">Merci {f.name.split(' ')[0]} ! Notre équipe vous répond en moins de 3 heures.</p>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-5">
              <h1 className="font-display text-4xl">Envoyez-nous un Message</h1>
              <p className="text-sm text-ink/65">Une question sur une taille ? Besoin d'un conseil mode ? Remplissez ce formulaire et notre équipe reviendra vers vous en moins de 3 heures.</p>
              <div><label className={lab} htmlFor="c-name">Nom complet</label><input id="c-name" required placeholder="Ex: Prudence Tossou" className={inp} value={f.name} onChange={set('name')} /></div>
              <div><label className={lab} htmlFor="c-mail">Adresse email</label><input id="c-mail" type="email" required placeholder="votremail@example.com" className={inp} value={f.email} onChange={set('email')} /></div>
              <div><label className={lab} htmlFor="c-tel">Numéro de téléphone</label><input id="c-tel" type="tel" placeholder="Ex: +229 50 00 00 00" className={inp} value={f.phone} onChange={set('phone')} /></div>
              <div><label className={lab} htmlFor="c-sub">Objet</label><input id="c-sub" required placeholder="Ex: Échange de taille Sneakers" className={inp} value={f.subject} onChange={set('subject')} /></div>
              <div><label className={lab} htmlFor="c-msg">Votre message</label><textarea id="c-msg" required rows={4} placeholder="Écrivez vos détails ici..." className={inp} value={f.message} onChange={set('message')} /></div>
              <button className="flex w-full items-center justify-center gap-2 bg-tan-dark py-4 text-[13px] font-semibold uppercase tracking-wide text-white transition hover:bg-[#7a4c2c]">Envoyer ma demande <ArrowRight size={15} /></button>
            </form>
          )}
        </div>
        <div className="lg:pt-2">
          <p className="mb-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-brand">StyleVibe à votre écoute <span className="h-px w-8 bg-brand" /></p>
          <h2 className="font-display text-6xl leading-none">Contactez-nous</h2>
          <p className="mt-8 max-w-md leading-relaxed text-ink/65">Notre showroom physique à Cotonou vous accueille pour vos essayages. Vous pouvez également nous joindre directement par WhatsApp pour un conseil instantané.</p>
          <ul className="mt-10 space-y-6">
            {info.map(({ icon: Icon, l, v, href }) => (
              <li key={l} className="flex items-center gap-5">
                <span className="grid size-12 shrink-0 place-items-center rounded-full bg-sand text-tan-dark"><Icon size={19} /></span>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-tan-dark">{l}</p>
                  {href ? <a href={href} className="font-semibold hover:underline" target="_blank" rel="noreferrer">{v}</a> : <p className="font-semibold">{v}</p>}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}

const FAQS: [string, string][] = [
  ['Comment passer commande sur StyleVibe ?', "C'est très simple ! Parcourez notre catalogue, ajoutez vos articles préférés au panier et passez à la caisse. Vous pouvez également commander directement par message sur notre WhatsApp au +229 50 00 00 00 en envoyant la capture d'écran de l'article."],
  ['Quels sont les délais de livraison ?', 'Pour Cotonou, Calavi et Porto-Novo, vous êtes livré en 24h à 48h. Pour les autres villes du Bénin (Parakou, Natitingou, Bohicon), comptez un délai moyen de 4 à 6 jours ouvrés par transporteur terrestre.'],
  ['Puis-je échanger un article si la taille ne me convient pas ?', "Absolument. Nous acceptons les échanges sous 3 jours après réception pour Cotonou et Calavi, à condition que l'article soit resté non porté, non lavé, et avec toutes ses étiquettes d'origine intactes."],
  ['Comment fonctionne le paiement par MTN MoMo ?', 'Lors du checkout, sélectionnez le paiement Mobile Money. Vous recevrez une demande de confirmation de débit automatique directement sur votre téléphone. Saisissez votre code PIN secret pour valider le paiement sécurisé de manière instantanée.'],
  ['À partir de quel montant la livraison est-elle gratuite ?', "La livraison est entièrement offerte partout au Bénin pour toute commande supérieure ou égale à 50 000 FCFA pendant l'édition Black Friday, jusqu'au vendredi 27 novembre à minuit."],
  ["Comment puis-je suivre l'état de ma commande ?", "Une fois votre panier validé, notre assistant de livraison dédié vous contacte directement sur votre numéro pour fixer l'heure exacte et l'itinéraire de livraison."],
  ['Les articles vendus sur StyleVibe sont-ils authentiques ?', 'Oui, la totalité de nos collections (sneakers, vêtements, horlogerie, parfums) proviennent directement des canaux officiels et de distributeurs vérifiés de chaque marque.'],
  ['Disposez-vous d\'un service après-vente (SAV) ?', 'Notre service client est à votre disposition de 9h à 19h par appel ou WhatsApp au +229 50 00 00 00 pour résoudre tout incident lié à vos commandes ou remboursements.'],
]

export function Faq() {
  useSeo(staticSeo('/faq', [faqLd(FAQS)]))
  return (
    <>
      <Breadcrumb items={[{ label: 'Accueil', to: '/' }, { label: 'Questions Fréquentes' }]} />
      <section className="container-x max-w-3xl pb-24 pt-6">
        <div className="mb-12 text-center">
          <h1 className="font-display text-6xl">Questions Fréquentes</h1>
          <p className="mx-auto mt-5 max-w-lg text-ink/65">Trouvez des réponses immédiates à toutes vos questions concernant vos achats, livraisons et modes de paiement au Bénin.</p>
        </div>
        <div className="space-y-4">
          {FAQS.map(([q, a], i) => <AccordionItem key={q} q={q} a={a} plus defaultOpen={i === 0} />)}
        </div>
      </section>
    </>
  )
}

export function Shipping() {
  useSeo(staticSeo('/livraison-retours'))
  const rows: [string, string][] = [['Cotonou (Intra-muros)', '1 500 FCFA (1-2 jours)'], ['Abomey-Calavi', '2 000 FCFA (2-3 jours)'], ['Porto-Novo', '2 000 FCFA (2-3 jours)'], ['Parakou & Nord Bénin', '3 500 FCFA (4-6 jours)']]
  const returns = [
    ['1. Délai de rétractation', 'Vous disposez de 7 jours après la livraison pour demander un échange ou un avoir.'],
    ['2. État requis des pièces', "L'article doit être retourné non porté, non lavé, avec son étiquette d'origine attachée, et dans son emballage d'origine."],
    ['3. Frais de retour', "Pour Cotonou et Calavi, notre coursier passe récupérer l'article à vos frais (1 500 FCFA). Pour les autres villes, le renvoi se fait par colis sécurisé."],
  ]
  return (
    <>
      <Breadcrumb items={[{ label: 'Accueil', to: '/' }, { label: 'Livraison & Retours' }]} />
      <section className="container-x pb-24 pt-2">
        <p className="mb-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-brand">Expéditions locales sécurisées <span className="h-px w-8 bg-brand" /></p>
        <h1 className="font-display text-6xl leading-none">Livraison &amp; Retours</h1>
        <div className="mt-12 grid items-start gap-6 lg:grid-cols-2">
          <div className="border border-line bg-white p-8 sm:p-10">
            <h2 className="flex items-center gap-3 font-display text-3xl"><Truck size={22} className="text-tan-dark" /> Modes de Livraison</h2>
            <p className="mt-6 text-sm leading-relaxed text-ink/65">Nous offrons un service de livraison express personnalisé directement à votre domicile ou à votre bureau grâce à notre flotte de livreurs partenaires au Bénin.</p>
            <ul className="mt-8">
              {rows.map(([l, r]) => (
                <li key={l} className="flex justify-between gap-4 border-b border-line py-4 text-sm"><span className="font-semibold">{l}</span><span className="text-right font-semibold text-brand">{r}</span></li>
              ))}
            </ul>
            <p className="mt-6 flex items-start gap-2.5 bg-sand/80 p-4 text-[13px]"><Lightbulb size={15} className="mt-0.5 shrink-0 text-tan-dark" /><span><b>LIVRAISON GRATUITE :</b> Obtenez la gratuité des frais de port pour tout panier supérieur à 50 000 FCFA.</span></p>
          </div>
          <div className="border border-line bg-white p-8 sm:p-10">
            <h2 className="flex items-center gap-3 font-display text-3xl"><RefreshCw size={22} className="text-tan-dark" /> Politique de Retours</h2>
            <p className="mt-6 text-sm leading-relaxed text-ink/65">Nous souhaitons que vos nouveaux articles de luxe s'adaptent parfaitement à votre garde-robe. Si une taille ne convient pas, l'échange est simple et rapide.</p>
            <div className="mt-8 space-y-5">
              {returns.map(([t, d]) => (<div key={t}><h3 className="text-sm font-bold">{t}</h3><p className="mt-1 text-[13px] leading-relaxed text-ink/60">{d}</p></div>))}
            </div>
            <a href="https://wa.me/22950000000?text=Bonjour%2C%20je%20souhaite%20initier%20un%20retour" target="_blank" rel="noreferrer" className="btn-dark mt-8 inline-block px-6 py-4">Initier un retour sur WhatsApp</a>
          </div>
        </div>
      </section>
    </>
  )
}

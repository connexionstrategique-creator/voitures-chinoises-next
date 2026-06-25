import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 't3ow1rmc',
  dataset: 'production',
  token: 'skyztPiIY9B6QnGxPk1LGpDi4AbqNDaoHoPCDmSxsvBhzLFCjt198UNt8b3Hp7lq7eWIMWsJ9PVsYfDlE',
  apiVersion: '2021-06-07',
  useCdn: false,
})

let _k = 0
const key = () => `k${++_k}`
const block = (text, style = 'normal') => ({
  _type: 'block', _key: key(), style, markDefs: [],
  children: [{ _type: 'span', _key: key(), text, marks: [] }],
})
const h2 = t => block(t, 'h2')
const h3 = t => block(t, 'h3')
const bullet = text => ({
  _type: 'block', _key: key(), style: 'normal', listItem: 'bullet', level: 1,
  markDefs: [], children: [{ _type: 'span', _key: key(), text, marks: [] }],
})
const numbered = text => ({
  _type: 'block', _key: key(), style: 'normal', listItem: 'number', level: 1,
  markDefs: [], children: [{ _type: 'span', _key: key(), text, marks: [] }],
})
const quote = t => block(t, 'blockquote')
const img = (id, alt = '') => ({
  _type: 'image', _key: key(), alt,
  asset: { _type: 'reference', _ref: id },
})

async function uploadPexels(photoId, alt) {
  const url = `https://images.pexels.com/photos/${photoId}/pexels-photo-${photoId}.jpeg?auto=compress&cs=tinysrgb&w=1920`
  console.log(`  Telechargement Pexels #${photoId}...`)
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'voiturechinoise-bot/1.0' } })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const buf = Buffer.from(await res.arrayBuffer())
    const asset = await client.assets.upload('image', buf, {
      filename: `pexels-${photoId}.jpg`, contentType: 'image/jpeg',
    })
    console.log(`  Image uploadee : ${asset._id}`)
    return asset._id
  } catch (e) {
    console.warn(`  Image #${photoId} ignoree : ${e.message}`)
    return null
  }
}

async function slugExists(slug) {
  const r = await client.fetch(`*[_type=="post"&&slug.current==$s][0]._id`, { s: slug })
  return !!r
}

async function publish(post) {
  if (await slugExists(post.slug.current)) {
    console.log(`  Deja publie : ${post.slug.current}`)
    return null
  }
  const doc = await client.create({ _type: 'post', ...post })
  console.log(`  Publie : ${post.title}`)
  return doc
}

async function article1() {
  console.log('\nArticle 1 : Salon de Pekin 2026')
  const i1 = await uploadPexels(1519192, 'SUV electrique au salon automobile')
  const i2 = await uploadPexels(3764984, 'Technologie auto 2026')
  const body = [
    block("Chaque deux ans, le Salon International de l'Automobile de Pekin donne le la a toute l'industrie mondiale. L'edition 2026, du 25 avril au 3 mai, a fracasse tous les records. Avec 1,28 million de visiteurs, 1 451 vehicules exposes et 181 premieres mondiales, cet evenement n'est plus seulement le miroir de l'industrie automobile chinoise : il en est le moteur."),
    block("Pour les passionnes de voitures chinoises en Afrique francophone, ce salon est une boussole. Il dessine les contours des modeles que l'on trouvera a Dakar, Abidjan, Lome, Cotonou et Douala dans les 12 a 18 prochains mois."),
    h2("Des Chiffres Records qui Parlent d'Eux-Memes"),
    block("L'edition 2026 du Salon de Pekin a battu tous les precedents records de l'histoire des salons automobiles mondiaux :"),
    bullet("1 280 000 visiteurs sur 10 jours — le plus grand salon auto de l'histoire"),
    bullet("380 000 m² d'exposition sur 17 halls dans deux sites distincts"),
    bullet("1 451 vehicules exposes, dont 181 premieres mondiales et 71 concepts"),
    bullet("Plus de 1 000 exposants venus de 20 pays"),
    block("Pour mettre ces chiffres en perspective : le Salon de Geneve n'accueillait que 600 000 visiteurs en bonne annee. La Chine a non seulement rattrape l'Occident, elle l'a definitivement depasse."),
    i1 ? img(i1, 'SUV electrique chinois Auto China 2026') : null,
    h2("Les Grandes Innovations Technologiques"),
    block("Auto China 2026 a confirme une tendance lourde : la voiture chinoise n'est plus seulement un objet de transport. Elle est une plateforme technologique mobile."),
    h3("L'Intelligence Artificielle Integree au Coeur du Vehicule"),
    block("Presque tous les constructeurs chinois de premier plan ont presente des vehicules equipes de modeles de langage embarques (LLM). Ces assistants IA comprennent le langage naturel, anticipent les besoins du conducteur et planifient les itineraires en temps reel. BYD, Geely, NIO et Xpeng ont tous demontre des systemes capables de tenir une conversation complexe tout en gerant navigation, climatisation et divertissement simultanement."),
    h3("De l'Autonomie Niveau 2+ au Niveau 4"),
    block("Le niveau L2+ est devenu standard sur la quasi-totalite des nouveaux modeles, y compris en entree de gamme. Les constructeurs les plus avances annoncent des fonctions L3 en 2026 et ciblent le L4 (robotaxi) dans des villes chinoises selectionnees des 2027. Cette progression est rendue possible par des puces autonomes chinoises : Huawei, Horizon Robotics, Black Sesame Technologies."),
    i2 ? img(i2, 'Technologie autonomie Salon Pekin 2026') : null,
    h2("Les Modeles Stars d'Auto China 2026"),
    block("Parmi les 1 451 vehicules exposes, voici ceux qui ont retenu l'attention pour les marches africains :"),
    bullet("Xiaomi YU7 GT : SUV haute performance double moteur, 0-100 km/h en moins de 2 secondes, prix entre 450 000 et 500 000 yuan"),
    bullet("BYD Han L : berline electrique haut de gamme, batterie Blade 2e generation, 800 km d'autonomie"),
    bullet("Geely Galaxy E8 : flagship electrique avec OS Flyme Auto integre"),
    bullet("Chery Tiggo 9 : hybride rechargeable avec 1 200 km d'autonomie totale"),
    bullet("JAECOO J8 : SUV 7 places robuste cible explicitement les marches africains et moyen-orientaux"),
    h2("Ce Que Cela Signifie pour l'Afrique Francophone"),
    block("Les modeles presentes a Pekin arrivent generalement sur les marches africains avec 12 a 24 mois de decalage. Le JAECOO J8, le Chery Tiggo 9 hybride et le Geely Galaxy seront potentiellement disponibles aux ports de Cotonou ou de Lome d'ici fin 2026 ou debut 2027. Les prix en FCFA restent tres competitifs : un SUV moyen de gamme chinois coute generalement entre 12 et 18 millions de FCFA livre et dedouane au Senegal, contre 25 a 35 millions pour un equivalent japonais ou coreen."),
    quote('"La Chine ne rattrape plus personne. Elle redefinit les termes de la competition mondiale." — McKinsey Automotive, analyse post-salon Pekin 2026'),
    h2("Conclusion"),
    block("Auto China 2026 n'etait pas seulement un salon automobile. C'etait une demonstration de force. Pour les passionnes d'automobiles chinoises en Afrique francophone, le message est simple : les meilleurs produits au meilleur rapport qualite-prix se trouvent desormais sous le pavillon du Dragon. Restez connectes sur voiturechinoise.com pour suivre l'arrivee de ces nouveaux modeles dans vos pays."),
  ].filter(Boolean)

  return {
    title: "Salon de Pekin 2026 : La Chine Impose Sa Revolution Electrique au Monde Entier",
    slug: { current: 'salon-de-pekin-2026-revolution-electrique-chine' },
    publishedAt: new Date().toISOString(),
    category: 'actualites',
    tags: ['salon automobile', 'Pekin 2026', 'SUV electrique', 'BYD', 'Geely', 'Chine'],
    seoTitle: 'Salon de Pekin 2026 : La Revolution Electrique Chinoise',
    seoDescription: 'Retour sur les temps forts du Salon de Pekin 2026 : 181 premieres mondiales, IA embarquee et nouveaux SUV electriques. Ce que cela change pour l\'Afrique.',
    mainImage: i1 ? { _type: 'image', asset: { _type: 'reference', _ref: i1 } } : undefined,
    body,
  }
}

async function article2() {
  console.log('\nArticle 2 : Comparatif SUV Chinois Afrique 2026')
  const i1 = await uploadPexels(1519192, 'SUV blanc sur route africaine')
  const i2 = await uploadPexels(116675, 'Concessionnaire voiture chinoise Afrique')
  const body = [
    block("Le marche de l'importation de vehicules neufs en Afrique de l'Ouest connait une revolution silencieuse. La ou Toyota, Mitsubishi et Nissan regnaient sans partage, les SUV chinois grignotent chaque annee des parts de marche significatives. En 2026, trois modeles s'imposent comme les references : l'Omoda C5, le Chery Tiggo 8 Pro et le Geely Atlas. Mais lequel choisir pour les routes du Senegal, du Mali, du Cameroun ou de la Cote d'Ivoire ?"),
    block("Ce comparatif vous aide a trancher en analysant les performances, les prix en FCFA, la disponibilite des pieces de rechange et l'adequation avec les conditions de conduite locales."),
    h2("Pourquoi les SUV Chinois Seduisent les Conducteurs Africains"),
    block("Il y a cinq ans, acheter un SUV chinois en Afrique relevait du pari audacieux. Aujourd'hui, c'est souvent la decision la plus rationnelle :"),
    bullet("Rapport equipement/prix sans equivalent : vitres electriques, regulateur, camera de recul, ecran tactile — standard meme en entree de gamme"),
    bullet("Garantie 3 ans ou 100 000 km, desormais comparable aux constructeurs japonais"),
    bullet("Garde au sol elevee (180 a 220 mm) adaptee aux pistes lateritiques"),
    bullet("Reseau en expansion : Dakar, Abidjan, Cotonou et Douala ont des concessionnaires officiels"),
    h2("Omoda C5 : Le Challenger au Design Europeen"),
    block("Lance par Chery sous une marque dediee aux marches internationaux, l'Omoda C5 est le SUV qui a le plus surpris les observateurs en 2025-2026. Son design, signe par des equipes basees a Barcelone, se distingue clairement de l'esthetique asiatique classique."),
    h3("Fiche Technique Omoda C5 2026"),
    bullet("Moteur : 1.6 TGDI turbo, 197 ch / 290 Nm"),
    bullet("Boite : automatique 7 rapports DCT"),
    bullet("Garde au sol : 191 mm"),
    bullet("Coffre : 410 litres (1 304 L banquettes rabattues)"),
    bullet("Ecran : 14,8 pouces tactile"),
    h3("Prix Omoda C5 en Afrique de l'Ouest"),
    bullet("Finition Comfort 2WD : 14,5 a 15,5 millions de FCFA (port de Lome ou Cotonou)"),
    bullet("Finition Premium 4WD : 18 a 20 millions de FCFA"),
    i1 ? img(i1, 'SUV chinois Omoda sur piste africaine') : null,
    h2("Chery Tiggo 8 Pro : Le Veteran Polyvalent"),
    block("Le Chery Tiggo 8 Pro est le SUV chinois le plus vendu en Afrique subsaharienne depuis trois ans consecutifs. Sa solidite et son espace interieur exceptionnel en font le choix de predilection des familles nombreuses."),
    h3("Fiche Technique Tiggo 8 Pro 2026"),
    bullet("Moteur : 2.0 TGDI turbo, 254 ch / 390 Nm"),
    bullet("Configuration : 7 places sur 3 rangees"),
    bullet("Traction : 4WD integrale avec blocage electronique"),
    bullet("Garde au sol : 215 mm"),
    bullet("Equipement : toit panoramique, audio Sony 12 HP, sieges ventiles"),
    h3("Prix et Disponibilite Tiggo 8 Pro"),
    bullet("Version 5 places 2.0T : 16,5 a 18 millions FCFA a Dakar"),
    bullet("Version 7 places 4WD : 19 a 22 millions FCFA a Abidjan"),
    bullet("Version PHEV hybride rechargeable : 24 a 27 millions FCFA (disponible mi-2026)"),
    block("Avantage majeur : concessionnaires officiels dans 12 pays d'Afrique subsaharienne, pieces de rechange disponibles au Mali, Burkina Faso, Niger."),
    h2("Geely Atlas 2026 : Le Premium Accessible"),
    block("Geely, actionnaire de Volvo, incarne la montee en gamme de l'industrie automobile chinoise. L'Atlas 2026 rivalise avec les marques coreennes premium en termes de qualite percue."),
    h3("Fiche Technique Geely Atlas 2026"),
    bullet("Moteur : 2.0TD turbo, 238 ch / 380 Nm — option hybride MHEV 48V"),
    bullet("Boite : automatique 8 rapports Aisin"),
    bullet("Modes 4WD : Neige, Sable, Boue"),
    bullet("Garde au sol : 204 mm ajustable electroniquement"),
    bullet("Securite : 6 airbags, AEB, vision 360°"),
    h3("Prix Geely Atlas en Afrique"),
    bullet("Atlas 2.0TD 2WD : 17 a 19 millions FCFA"),
    bullet("Atlas 2.0TD 4WD Premium : 21 a 24 millions FCFA"),
    bullet("Atlas MHEV 4WD : 23 a 26 millions FCFA"),
    i2 ? img(i2, 'Showroom SUV chinois en Afrique de l\'Ouest 2026') : null,
    h2("Comparatif Rapide"),
    bullet("Puissance : Omoda C5 (197 ch) | Tiggo 8 Pro (254 ch) | Atlas (238 ch)"),
    bullet("7 places : Non (Omoda) | Oui (Tiggo) | Non (Atlas)"),
    bullet("Garde au sol : 191 mm (Omoda) | 215 mm (Tiggo) | 204 mm (Atlas)"),
    bullet("Prix entree FCFA : ~14,5M (Omoda) | ~16,5M (Tiggo) | ~17M (Atlas)"),
    bullet("Reseau SAV Afrique : Moyen (Omoda) | Excellent (Tiggo) | Bon (Atlas)"),
    h2("Notre Verdict"),
    numbered("Famille nombreuse + pistes + budget maitrise → Chery Tiggo 8 Pro"),
    numbered("Design europeen + budget serree → Omoda C5"),
    numbered("Conduite premium + technologie avancee → Geely Atlas"),
    quote('"En 2026, acheter un SUV chinois en Afrique n\'est plus un compromis. C\'est souvent le meilleur choix." — Voiture Chinoise, Guide Acheteurs 2026'),
    h2("Conclusion"),
    block("L'Omoda C5, le Chery Tiggo 8 Pro et le Geely Atlas representent le meilleur de la production automobile chinoise actuelle. A Dakar, Bamako, Abidjan, Cotonou, Yaounde ou Libreville, ces modeles sont accessibles via des reseaux officiels qui garantissent support, pieces et garantie. Consultez nos guides pratiques sur voiturechinoise.com pour les modalites d'importation et les droits de douane par pays."),
  ].filter(Boolean)

  return {
    title: "Omoda C5, Chery Tiggo 8 Pro ou Geely Atlas : Quel SUV Chinois Choisir en Afrique en 2026 ?",
    slug: { current: 'comparatif-suv-chinois-omoda-chery-geely-afrique-2026' },
    publishedAt: new Date().toISOString(),
    category: 'guides',
    tags: ['SUV', 'Omoda', 'Chery', 'Geely', 'Afrique', 'comparatif'],
    seoTitle: 'Comparatif SUV Chinois 2026 : Omoda, Chery ou Geely en Afrique ?',
    seoDescription: 'Omoda C5, Chery Tiggo 8 Pro ou Geely Atlas : notre comparatif pour choisir le meilleur SUV chinois pour les routes africaines en 2026. Prix en FCFA inclus.',
    mainImage: i1 ? { _type: 'image', asset: { _type: 'reference', _ref: i1 } } : undefined,
    body,
  }
}

async function article3() {
  console.log('\nArticle 3 : CATL Batteries 2026')
  const i1 = await uploadPexels(3802508, 'Voiture electrique en charge rapide')
  const i2 = await uploadPexels(3764984, 'Technologie batterie vehicule electrique')
  const body = [
    block("Le 22 avril 2026, CATL — le plus grand fabricant mondial de batteries de vehicules electriques — a tenu son Super Tech Day annuel a Pekin. Ce qui a ete presente ce jour-la n'est pas une evolution : c'est une rupture. En l'espace d'une conference, CATL a rendu obsoletes plusieurs arguments des sceptiques de la voiture electrique."),
    block("Charge trop longue ? Autonomie insuffisante ? Technologie trop couteuse pour l'Afrique ? Les six nouveaux produits devoiles repondent a chacune de ces objections."),
    h2("La Shenxing SuperFast : Rechargez a 80% en Moins de 4 Minutes"),
    block("La troisieme generation de la batterie Shenxing SuperFast de CATL etablit un record mondial : recharge de 10% a 80% en 3 minutes et 44 secondes. La recharge complete, de 10% a 98%, s'effectue en 6 minutes et 27 secondes. A titre de comparaison, remplir le reservoir d'une voiture a essence prend generalement 3 a 5 minutes — le fosse se comble."),
    block("Cette performance est rendue possible par une architecture cellulaire repensee et un systeme de gestion thermique avance. La batterie supporte une puissance de charge maximale de 3 000 kW. Les premiers vehicules compatibles sont attendus en Chine fin 2026."),
    i1 ? img(i1, 'Vehicule electrique branche borne recharge rapide CATL 2026') : null,
    h2("La Batterie Qilin Compressed : 1 500 km sur une Seule Charge"),
    block("Si la Shenxing revolutionne la vitesse, la Qilin Compressed bouleverse l'autonomie. Cette batterie en etat semi-solide atteint une densite energetique de 350 Wh/kg et promet jusqu'a 1 500 km d'autonomie par charge dans un vehicule optimise."),
    block("Pour mettre ce chiffre en perspective : 1 500 km, c'est la distance entre Dakar et Abidjan, ou entre Lome et N'Djamena. Imaginez un taxi longue distance qui ne s'arrete qu'une seule fois pour recharger sur un trajet Senegal–Cote d'Ivoire. La batterie cible les segments premium avec une production de masse prevue pour 2027."),
    h2("Le Sodium-Ion en Production de Masse : Une Revolution Discrete"),
    block("L'annonce la plus strategique du CATL Super Tech Day est aussi potentiellement la plus transformatrice pour les marches emergents, dont l'Afrique : le lancement en serie de la batterie sodium-ion Naxtra."),
    h3("Pourquoi le Sodium-Ion Represente une Percee Majeure"),
    block("Les batteries sodium-ion n'utilisent ni lithium, ni cobalt — deux materiaux dont l'extraction est concentree geographiquement et volatile en prix. Le sodium est l'un des elements les plus abondants de la croute terrestre. Il se trouve litteralement dans l'eau de mer."),
    bullet("Autonomie Naxtra : jusqu'a 500 km par charge"),
    bullet("Meilleures performances a froid que le lithium-ion standard"),
    bullet("Cout : 15 a 20% moins cher que le LFP a volume equivalent"),
    bullet("Premier vehicule de serie : Changan Automobile avec la Naxtra en 2026"),
    i2 ? img(i2, 'Batterie sodium-ion CATL Naxtra production serie 2026') : null,
    h2("L'Infrastructure de Recharge : 4 000 Stations d'ici Fin 2026"),
    block("CATL n'a pas seulement presente des batteries. Le geant de Ningde a devoile un plan d'infrastructure ambitieux : 4 000 stations de recharge et d'echange de batteries d'ici fin 2026, couvrant 190 villes chinoises. Ces stations Choco Swap permettent d'echanger une batterie dechargee contre une batterie pleine en moins de 5 minutes."),
    block("Si ce modele est exporte vers l'Afrique — plusieurs pays africains discutent deja de partenariats avec des acteurs chinois — il pourrait resoudre le probleme de la recharge dans des zones ou le reseau electrique est intermittent."),
    h2("Ce Que les Innovations CATL 2026 Signifient pour l'Afrique Francophone"),
    block("Les annonces de CATL n'impacteront pas le marche africain du jour au lendemain. Les vehicules integrant ces technologies arriveront avec 2 a 3 ans de decalage. Mais plusieurs signaux sont encourageants :"),
    numbered("La batterie sodium-ion pourrait reduire le prix des VE a 10–12 millions de FCFA d'ici 2028"),
    numbered("BYD, Chery et Geely deployent deja des vehicules electriques en Afrique du Nord et explorent l'Afrique de l'Ouest"),
    numbered("Les ports de Cotonou, Lome et Abidjan sont des points d'entree naturels pour les VE chinois"),
    numbered("Dakar, Abidjan, Libreville et Douala developpent des flottes de taxis electriques en partenariat avec des acteurs chinois"),
    quote('"La batterie sodium-ion de CATL est l\'une des plus grandes percees de la decennie dans l\'energie mobile." — The Driven, avril 2026'),
    h2("Conclusion"),
    block("Avec six nouvelles technologies presentees en une seule conference, CATL confirme sa position de premier acteur mondial de l'energie pour la mobilite. La batterie qui se recharge en 4 minutes, l'autonomie de 1 500 km, le sodium-ion en serie : chacune de ces innovations repond a un frein reel a l'adoption des vehicules electriques. Sur voiturechinoise.com, nous continuerons a vous informer sur l'arrivee de ces technologies en Afrique francophone et les premieres opportunites d'acquisition a Dakar, Abidjan, Lome et Cotonou."),
  ].filter(Boolean)

  return {
    title: "CATL 2026 : La Batterie qui Charge en 4 Minutes et Offre 1 500 km d'Autonomie",
    slug: { current: 'catl-2026-batterie-charge-rapide-1500km-sodium-ion' },
    publishedAt: new Date().toISOString(),
    category: 'actualites',
    tags: ['CATL', 'batterie', 'electrique', 'sodium-ion', 'charge rapide'],
    seoTitle: "CATL 2026 : 1 500 km d'Autonomie et Charge en 4 Minutes",
    seoDescription: "CATL devoile ses batteries revolutionnaires en 2026 : 1 500 km d'autonomie, charge a 80% en 4 min et sodium-ion en serie. Ce que cela change pour l'Afrique.",
    mainImage: i1 ? { _type: 'image', asset: { _type: 'reference', _ref: i1 } } : undefined,
    body,
  }
}

async function main() {
  console.log('Voiture Chinoise — Publication de 3 articles dans Sanity')
  console.log('='.repeat(55))
  const builders = [article1, article2, article3]
  const published = []
  for (const build of builders) {
    try {
      const post = await build()
      const doc = await publish(post)
      if (doc) published.push(post)
    } catch (e) {
      console.error('Erreur :', e.message)
    }
  }
  console.log('\n' + '='.repeat(55))
  console.log(`\nResultat : ${published.length}/3 articles publies\n`)
  published.forEach(p => console.log(`  - ${p.title}\n    /blog/${p.slug.current}\n`))
}

main().catch(e => { console.error(e); process.exit(1) })

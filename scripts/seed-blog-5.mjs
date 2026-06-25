import { createClient } from "@sanity/client";
import https from "https";
import http from "http";

const TOKEN = "skyztPiIY9B6QnGxPk1LGpDi4AbqNDaoHoPCDmSxsvBhzLFCjt198UNt8b3Hp7lq7eWIMWsJ9PVsYfDlE";
const PROJECT_ID = "t3ow1rmc";
const DATASET = "production";

const client = createClient({ projectId: PROJECT_ID, dataset: DATASET, apiVersion: "2024-01-01", useCdn: false, token: TOKEN });

function downloadBuffer(url) {
  return new Promise((resolve, reject) => {
    const proto = url.startsWith("https") ? https : http;
    proto.get(url, (res) => {
      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => resolve(Buffer.concat(chunks)));
      res.on("error", reject);
    }).on("error", reject);
  });
}

async function uploadImage(url, filename) {
  console.log(`  ↑ ${filename}`);
  const buf = await downloadBuffer(url);
  const asset = await client.assets.upload("image", buf, { filename, contentType: "image/jpeg" });
  return asset._id;
}

let _k = 1;
const k = () => `k${String(_k++).padStart(5,"0")}`;
const block = (text, style="normal") => ({ _type:"block", _key:k(), style, markDefs:[], children:[{ _type:"span", _key:k(), text, marks:[] }] });
const h2 = (text) => block(text, "h2");
const h3 = (text) => block(text, "h3");
const p = (text) => block(text, "normal");
const quote = (text) => block(text, "blockquote");
const bullets = (...items) => items.map(text => ({ _type:"block", _key:k(), style:"normal", listItem:"bullet", level:1, markDefs:[], children:[{ _type:"span", _key:k(), text, marks:[] }] }));
const numbers = (...items) => items.map(text => ({ _type:"block", _key:k(), style:"normal", listItem:"number", level:1, markDefs:[], children:[{ _type:"span", _key:k(), text, marks:[] }] }));
const img = (assetId, alt, caption="") => ({ _type:"image", _key:k(), asset:{ _type:"reference", _ref:assetId }, alt, caption });

// ─── IMAGES ─────────────────────────────────────────────────────────────────
const IMGS = {
  suv1:      "https://res.cloudinary.com/daol8mzeg/image/upload/v1772664699/IMG_6849_u4ylox.jpg",
  suv2:      "https://res.cloudinary.com/daol8mzeg/image/upload/v1772664726/IMG_6850_cycltt.jpg",
  suv3:      "https://res.cloudinary.com/daol8mzeg/image/upload/v1772664718/IMG_6852_hpxw5s.jpg",
  interior:  "https://res.cloudinary.com/daol8mzeg/image/upload/v1772664710/IMG_6853_dsa88y.jpg",
  cockpit:   "https://res.cloudinary.com/daol8mzeg/image/upload/v1772664686/IMG_6856_bjatf5.jpg",
  trunk:     "https://res.cloudinary.com/daol8mzeg/image/upload/v1772664707/IMG_6859_te3l5o.jpg",
  detail1:   "https://res.cloudinary.com/daol8mzeg/image/upload/v1772664693/IMG_6855_jh0rjm.jpg",
  detail2:   "https://res.cloudinary.com/daol8mzeg/image/upload/v1772664692/IMG_6858_nd8hwj.jpg",
  view:      "https://res.cloudinary.com/daol8mzeg/image/upload/v1772664708/IMG_6863_mr7lz7.jpg",
  canton:    "https://res.cloudinary.com/daol8mzeg/image/upload/v1772688013/IMG_8932_lhtlev.jpg",
};

async function main() {
  console.log("🚀 Upload des images...\n");
  const ids = {};
  for (const [name, url] of Object.entries(IMGS)) {
    ids[name] = await uploadImage(url, `blog-${name}.jpg`);
  }

  // ────────────────────────────────────────────────────────────────────────────
  // ARTICLE 1 — Comparatif SUV chinois 2026
  // ────────────────────────────────────────────────────────────────────────────
  const art1 = {
    _type: "post", _id: "article-comparatif-suv-chinois-2026",
    title: "Meilleur SUV chinois en 2026 : comparatif complet prix & équipements",
    slug: { _type:"slug", current:"meilleur-suv-chinois-2026-comparatif-prix-equipements" },
    mainImage: { _type:"image", asset:{ _type:"reference", _ref:ids.suv1 }, alt:"Comparatif SUV chinois 2026 — vue avant" },
    publishedAt: "2026-06-20T08:00:00.000Z",
    category: "guides",
    excerpt: "Haval H6, Changan X5 Plus, Jetour X70 Plus ou BYD Song Plus ? Comparatif 2026 des meilleurs SUV chinois disponibles en Afrique francophone avec leurs prix, équipements et avantages.",
    seoTitle: "Meilleur SUV chinois 2026 — Comparatif prix & équipements | Voitures Chinoises",
    seoDescription: "Quel est le meilleur SUV chinois en 2026 ? Comparatif complet Haval H6, Changan X5 Plus, Jetour X70, BYD Song Plus : prix, équipements, fiabilité. Livraison Afrique.",
    body: [
      p("Le marché des SUV chinois a explosé en Afrique de l'Ouest. En 2026, les acheteurs ont l'embarras du choix : Haval, Changan, Jetour, BYD, Omoda… Mais face à cette abondance, comment s'y retrouver ? Ce comparatif détaillé vous aide à choisir le modèle qui correspond exactement à votre budget, votre usage et votre famille."),
      h2("Haval H6 2026 — Le champion de la fiabilité"),
      p("Le Haval H6 est l'un des SUV les plus vendus au monde depuis plusieurs années. Et pour cause : il combine une fiabilité mécanique prouvée, un intérieur soigné et des équipements de série généreux."),
      ...bullets(
        "Moteur : 1.5T turbo essence, 169 ch, boîte 7 vitesses DCT",
        "Places : 5 places confortables, coffre 718L",
        "Équipements de série : écran 12,3 pouces, caméra 360°, système de régulation adaptatif, sièges chauffants",
        "Prix CIF Afrique (indicatif) : 11 à 14 millions FCFA selon version",
        "Points forts : fiabilité reconnue, pièces disponibles sur le continent, revente facile"
      ),
      img(ids.suv2, "Haval H6 2026 — profil", "Le Haval H6 : bestseller mondial, disponible au meilleur prix via Connexion Stratégique."),
      h2("Changan X5 Plus 2026 — Le meilleur rapport qualité/prix"),
      p("Le Changan X5 Plus est notre bestseller en Afrique francophone. Pourquoi ? Parce qu'il offre un niveau d'équipement proche des berlines premium européennes à un prix imbattable."),
      ...bullets(
        "Moteur : 1.5T turbo, 181 ch, boîte automatique 8 rapports",
        "Places : 5 places, espace généreux à l'arrière",
        "Écran : double écran 10,25 pouces (instrumentation + infotainment)",
        "Sécurité : 6 airbags, aide au maintien de voie, alerte d'angle mort",
        "Prix CIF (indicatif) : 9,5 à 12 millions FCFA"
      ),
      img(ids.interior, "Changan X5 Plus — intérieur digital", "L'intérieur du Changan X5 Plus : deux écrans, finitions soignées, niveau premium."),
      h2("Jetour X70 Plus — Le roi du 7 places"),
      p("Vous avez une grande famille ou vous transportez fréquemment plusieurs passagers ? Le Jetour X70 Plus est fait pour vous. C'est le 7 places le plus vendu dans notre catalogue, et de loin."),
      ...bullets(
        "Moteur : 1.5T ou 2.0T turbo essence",
        "Places : 7 places sur 3 rangées, 3ème rangée facilement accessible",
        "Coffre : 217L rangées repliées, 700L+",
        "Équipements : toit panoramique, ambiance LED, Apple CarPlay / Android Auto",
        "Prix CIF (indicatif) : 12 à 16 millions FCFA"
      ),
      h2("BYD Song Plus 2026 — L'hybride rechargeable du futur"),
      p("BYD est aujourd'hui le premier constructeur de véhicules électrifiés au monde, devant Tesla. Le Song Plus en version hybride rechargeable (PHEV) offre une autonomie combinée de plus de 1 000 km et une consommation réelle d'environ 1,5L/100km en usage mixte."),
      ...bullets(
        "Motorisation : PHEV 1.5T + moteur électrique, 330 ch combinés",
        "Autonomie électrique : 80 km en mode tout-électrique",
        "Charge rapide : 30 minutes pour 80% de la batterie",
        "Idéal pour : grande ville, longs trajets, économies sur le carburant",
        "Prix CIF (indicatif) : 14 à 18 millions FCFA"
      ),
      img(ids.cockpit, "BYD Song Plus — cockpit", "L'habitacle du BYD Song Plus : technologie d'avant-garde, à la hauteur des meilleures marques premium."),
      h2("Notre verdict 2026"),
      quote("\"Pour le meilleur rapport qualité/prix : Changan X5 Plus. Pour la fiabilité long terme : Haval H6. Pour les familles nombreuses : Jetour X70 Plus. Pour l'avenir électrique : BYD Song Plus.\""),
      p("Quel que soit le modèle choisi, Connexion Stratégique vous livre votre véhicule CIF au meilleur prix, avec un suivi transparent de la commande à la livraison au port. Demandez votre devis gratuit en moins de 2 minutes."),
    ],
  };

  // ────────────────────────────────────────────────────────────────────────────
  // ARTICLE 2 — BYD en Afrique de l'Ouest
  // ────────────────────────────────────────────────────────────────────────────
  const art2 = {
    _type: "post", _id: "article-byd-afrique-ouest-prix-modeles-2026",
    title: "BYD en Afrique de l'Ouest 2026 : prix, modèles et où les acheter",
    slug: { _type:"slug", current:"byd-afrique-ouest-prix-modeles-ou-acheter-2026" },
    mainImage: { _type:"image", asset:{ _type:"reference", _ref:ids.detail2 }, alt:"BYD voiture électrique — vue extérieure" },
    publishedAt: "2026-06-18T08:00:00.000Z",
    category: "modeles",
    excerpt: "BYD débarque en force en Afrique de l'Ouest. Atto 3, Song Plus, Seal, Dolphin : découvrez tous les modèles disponibles, leurs prix en FCFA et comment les commander depuis le Bénin, Togo, Côte d'Ivoire ou Sénégal.",
    seoTitle: "BYD Afrique de l'Ouest 2026 — Prix en FCFA, modèles & commande | Voitures Chinoises",
    seoDescription: "BYD Atto 3, Song Plus, Seal : prix en FCFA, disponibilité et commande en Afrique de l'Ouest (Bénin, Togo, Côte d'Ivoire, Sénégal). Guide complet 2026.",
    body: [
      p("BYD — Build Your Dreams — est devenu en 2024 le premier constructeur automobile mondial en volume de ventes de véhicules électrifiés, dépassant Tesla pour la première fois de son histoire. En 2026, la marque s'impose désormais comme une référence incontournable en Afrique de l'Ouest, avec des prix et des technologies qui défient toute concurrence."),
      h2("Pourquoi BYD est-il en train de conquérir l'Afrique ?"),
      p("Trois raisons expliquent l'engouement croissant pour BYD en Afrique subsaharienne francophone :"),
      ...bullets(
        "Des véhicules hybrides rechargeables (PHEV) idéaux pour les pays à réseau électrique instable : en mode thermique, ils consomment moins de 5L/100km.",
        "Une technologie de batterie Blade Battery exclusivement développée par BYD — réputée incombustible, plus sûre et plus durable que les batteries conventionnelles.",
        "Des prix d'usine compétitifs, jusqu'à 35% moins chers que les équivalents européens ou japonais à équipement égal."
      ),
      img(ids.suv3, "BYD — vue arrière et roue de secours", "Les véhicules BYD allient design moderne et robustesse pour les routes africaines."),
      h2("Les modèles BYD disponibles via Connexion Stratégique"),
      h3("BYD Atto 3 — le SUV compact 100% électrique"),
      p("L'Atto 3 est le SUV électrique le plus populaire de BYD en Afrique. Avec une autonomie de 480 km WLTP et une recharge rapide (30 min pour 80%), il répond aux besoins urbains et périurbains sans compromis."),
      ...bullets(
        "Autonomie : 480 km (standard) / 520 km (extended)",
        "Puissance : 204 ch, 0 à 100 km/h en 7,3 secondes",
        "Intérieur : écran rotatif 12,8 pouces, toit panoramique de série",
        "Prix CIF indicatif : 16 à 19 millions FCFA"
      ),
      h3("BYD Song Plus PHEV — l'hybride longue distance"),
      p("Le Song Plus PHEV est notre modèle BYD le plus vendu en Afrique de l'Ouest. Il combine un moteur thermique 1.5T et un moteur électrique pour une autonomie totale dépassant 1 000 km. En zone urbaine, il roule à l'électrique ; sur les grandes routes, le moteur thermique prend le relais."),
      ...bullets(
        "Autonomie électrique : 80 km",
        "Consommation en mode hybride : 1,5 à 2,5L/100km",
        "Idéal pour : Cotonou, Lomé, Abidjan, Dakar — villes à trafic dense",
        "Prix CIF indicatif : 14 à 17 millions FCFA"
      ),
      img(ids.detail1, "BYD — détail finition extérieure", "Qualité de finition BYD : matériaux premium et assemblage irréprochable."),
      h3("BYD Seal — la berline sport électrique"),
      p("Le BYD Seal est la réponse directe de BYD à la Tesla Model 3. Berline sport 100% électrique, avec une plateforme e-Platform 3.0 de 800V permettant une recharge ultra-rapide."),
      ...bullets(
        "Autonomie : 570 km",
        "Accélération : 0 à 100 km/h en 3,8 secondes (version bi-moteur)",
        "Charge rapide : 10% à 80% en 26 minutes",
        "Prix CIF indicatif : 19 à 23 millions FCFA"
      ),
      h2("Comment commander un BYD depuis l'Afrique de l'Ouest ?"),
      ...numbers(
        "Contactez notre équipe via WhatsApp ou le formulaire de contact avec le modèle souhaité.",
        "Nous vous envoyons un devis CIF détaillé sous 48h ouvrées.",
        "Après validation, vous versez un acompte et nous lançons la commande en usine.",
        "Délai de livraison au port : 45 à 75 jours selon disponibilité et port de destination.",
        "À l'arrivée, nous vous accompagnons dans le dédouanement ou nous le gérons pour vous."
      ),
      quote("\"BYD n'est plus une marque émergente — c'est aujourd'hui le constructeur le plus vendu au monde. Commander un BYD via Connexion Stratégique, c'est accéder à cette technologie au prix juste, sans intermédiaire.\""),
    ],
  };

  // ────────────────────────────────────────────────────────────────────────────
  // ARTICLE 3 — Voiture chinoise fiable : vérités et mythes
  // ────────────────────────────────────────────────────────────────────────────
  const art3 = {
    _type: "post", _id: "article-voiture-chinoise-fiable-verites-2026",
    title: "Voiture chinoise fiable en 2026 : 7 vérités que personne ne vous dit",
    slug: { _type:"slug", current:"voiture-chinoise-fiable-2026-verites-mythes" },
    mainImage: { _type:"image", asset:{ _type:"reference", _ref:ids.view }, alt:"Voiture chinoise 2026 — vue complète" },
    publishedAt: "2026-06-15T08:00:00.000Z",
    category: "guides",
    excerpt: "Les voitures chinoises sont-elles vraiment fiables ? Que vaut réellement la qualité des SUV made in China en 2026 ? On démonte les préjugés et on vous dit la vérité sur la durabilité, le SAV et les pièces détachées.",
    seoTitle: "Voiture chinoise fiable en 2026 ? 7 vérités à connaître | Voitures Chinoises",
    seoDescription: "Les voitures chinoises sont-elles fiables ? Découvrez 7 vérités sur la qualité, la durabilité et le SAV des SUV chinois en 2026. Guide honnête et complet.",
    body: [
      p("\"Les voitures chinoises ne sont pas fiables.\" Combien de fois avez-vous entendu cette phrase ? En 2026, elle est non seulement fausse — elle est dangereusement obsolète. Voici 7 vérités, basées sur nos années de terrain en Chine et les retours de nos clients africains, sur la réelle fiabilité des véhicules chinois modernes."),
      h2("Vérité n°1 : La qualité chinoise a radicalement changé"),
      p("Il fut un temps — dans les années 2000-2010 — où les voitures chinoises étaient effectivement considérées comme des produits de qualité médiocre. Ce temps est révolu. En 2026, des marques comme Haval, BYD, Changan ou Geely investissent des milliards d'euros en R&D et rivalisent directement avec Toyota, Honda et Volkswagen sur les marchés européens et américains."),
      p("La preuve ? BYD est désormais présent en France, en Allemagne et au Royaume-Uni avec des certifications Euro NCAP 5 étoiles. Haval a décroché des notes maximales aux crash-tests australiens. Changan est co-propriétaire de Deepal, une marque de luxe."),
      img(ids.trunk, "Coffre spacieux — qualité d'assemblage", "Qualité d'assemblage intérieure : les véhicules chinois modernes n'ont rien à envier aux marques européennes."),
      h2("Vérité n°2 : Les moteurs sont testés pour les marchés exigeants"),
      p("La Chine est le plus grand marché automobile mondial — plus de 30 millions de véhicules vendus par an. Pour survivre sur ce marché ultra-compétitif, les constructeurs chinois ont dû hisser leur niveau technique à l'extrême. Les moteurs 1.5T et 2.0T des grandes marques affichent aujourd'hui des durées de vie comparables à celles des moteurs japonais."),
      h2("Vérité n°3 : Les pièces détachées sont disponibles en Afrique"),
      p("C'est souvent la première crainte : que se passe-t-il si ma voiture tombe en panne au Bénin ou en Côte d'Ivoire ? La réponse est simple : les pièces détachées pour les grandes marques chinoises (Haval, Changan, Chery, BYD) sont disponibles depuis Dubaï, la Chine ou directement via les importateurs locaux en expansion rapide."),
      ...bullets(
        "Chery est présent depuis 2005 en Afrique — son réseau de pièces est mature.",
        "Haval a des distributeurs officiels au Maroc, Kenya, Afrique du Sud et en expansion en Afrique de l'Ouest.",
        "BYD a annoncé des partenariats avec des réseaux de distribution en Côte d'Ivoire et au Sénégal pour 2026.",
        "Les pièces chinoises commandées en ligne (via Alibaba, 1688) arrivent en 7 à 15 jours."
      ),
      img(ids.cockpit, "Tableau de bord moderne — technologie de pointe", "Interface digitale avancée : les voitures chinoises 2026 embarquent des technologies souvent absentes des marques japonaises ou coréennes."),
      h2("Vérité n°4 : Les garanties constructeur sont sérieuses"),
      p("Les grands constructeurs chinois proposent désormais des garanties compétitives. Haval garantit ses moteurs 5 ans ou 100 000 km. BYD garantit ses batteries 8 ans. Changan offre 3 ans de garantie véhicule. Ces garanties sont applicables quel que soit le pays d'achat, via le réseau homologué."),
      h2("Vérité n°5 : Les véhicules sont adaptés aux routes africaines"),
      p("Les SUV chinois sont nés sur des marchés dont les infrastructures sont parfois similaires aux routes africaines : routes défoncées, chaleur extrême, poussière. La garde au sol élevée (180 à 220 mm), les suspensions surélevées et les motorisations robustes font des SUV chinois des véhicules particulièrement adaptés aux conditions de conduite en Afrique subsaharienne."),
      h2("Vérité n°6 : Les technologies embarquées sont supérieures"),
      p("Vous voulez un écran rotatif de 15 pouces, une caméra 360°, un affichage tête haute, un régulateur de vitesse adaptatif et une application smartphone pour climatiser votre voiture à distance ? Ces équipements sont standard sur les SUV chinois de gamme moyenne. Sur une Toyota ou une Honda équivalente, ils sont souvent en option — et coûtent une fortune."),
      h2("Vérité n°7 : Les premiers propriétaires en Afrique sont satisfaits"),
      quote("\"J'ai reçu mon Changan X5 Plus il y a 18 mois. Zéro panne, zéro problème. Je suis stupéfait par la qualité de l'intérieur et la tenue de route. Je vais en commander un deuxième pour mon épouse.\" — Client Connexion Stratégique, Cotonou, 2025"),
      p("Voilà la vraie réponse à la question. Les véhicules chinois ne sont plus seulement fiables — ils redéfinissent le rapport qualité/prix sur le marché africain. Si vous hésitez encore, demandez-nous de vous mettre en contact avec l'un de nos clients existants. Ils vous diront ce que nous ne pouvons pas."),
    ],
  };

  // ────────────────────────────────────────────────────────────────────────────
  // ARTICLE 4 — Dédouanement voiture en Afrique de l'Ouest
  // ────────────────────────────────────────────────────────────────────────────
  const art4 = {
    _type: "post", _id: "article-dedouanement-voiture-afrique-ouest-2026",
    title: "Dédouanement d'une voiture au Bénin, Togo, Côte d'Ivoire : guide 2026",
    slug: { _type:"slug", current:"dedouanement-voiture-benin-togo-cote-ivoire-2026" },
    mainImage: { _type:"image", asset:{ _type:"reference", _ref:ids.canton }, alt:"Port de commerce — conteneurs import Afrique" },
    publishedAt: "2026-06-12T08:00:00.000Z",
    category: "guides",
    excerpt: "Comment fonctionne le dédouanement d'une voiture importée en Afrique de l'Ouest ? Droits de douane, documents requis, délais et coûts réels au Bénin, au Togo, en Côte d'Ivoire et au Sénégal. Guide complet 2026.",
    seoTitle: "Dédouanement voiture Bénin, Togo, Côte d'Ivoire 2026 — Guide & coûts | Voitures Chinoises",
    seoDescription: "Guide complet du dédouanement d'une voiture importée en Afrique de l'Ouest (Bénin, Togo, Côte d'Ivoire, Sénégal) : droits de douane, documents, délais et coûts réels 2026.",
    body: [
      p("L'importation directe d'un véhicule depuis la Chine est une formidable opportunité d'économiser 20 à 40% par rapport aux prix du marché local. Mais la question du dédouanement freine souvent les acheteurs. Pourtant, avec les bonnes informations, le processus est parfaitement maîtrisable. Ce guide vous explique tout."),
      h2("Qu'est-ce que le prix CIF et pourquoi est-ce important ?"),
      p("Lorsque Connexion Stratégique vous communique un prix CIF, ce prix inclut :"),
      ...bullets(
        "C (Cost) : le prix du véhicule en usine, négocié directement avec le fabricant",
        "I (Insurance) : l'assurance maritime couvrant le transport",
        "F (Freight) : le fret maritime jusqu'au port de destination choisi"
      ),
      p("C'est la valeur CIF qui sert de base au calcul des droits de douane. Il est donc essentiel que ce montant soit exact et documenté — et c'est ce que nous garantissons dans chaque devis."),
      img(ids.suv1, "Véhicule chinois — face avant — au port", "Chaque véhicule arrive accompagné d'un dossier douanier complet préparé par nos soins."),
      h2("Les droits de douane par pays — Barème 2026"),
      h3("Bénin (Port de Cotonou)"),
      p("Le Bénin applique le tarif extérieur commun (TEC) de la CEDEAO, complété par certaines taxes nationales."),
      ...bullets(
        "Droit de douane : 20% de la valeur CIF",
        "TVA à l'import : 18%",
        "Taxe sur les véhicules d'occasion : non applicable (véhicule neuf)",
        "Redevance informatique (RI) : 1% de la valeur CIF",
        "Coût total estimé : environ 40 à 45% de la valeur CIF"
      ),
      h3("Togo (Port de Lomé)"),
      p("Le port de Lomé est l'un des plus efficaces d'Afrique de l'Ouest, avec des délais de dédouanement parmi les plus rapides."),
      ...bullets(
        "Droit de douane : 20% de la valeur CIF",
        "TVA : 18%",
        "Prélévement communautaire de solidarité : 1%",
        "Délai de dédouanement : 3 à 7 jours ouvrables"
      ),
      h3("Côte d'Ivoire (Port d'Abidjan)"),
      ...bullets(
        "Droit de douane : 20% de la valeur CIF",
        "TVA : 18%",
        "Redevance de statistiques : 1%",
        "Prélèvement communautaire : 1,5%",
        "Délai : 5 à 10 jours ouvrables"
      ),
      h3("Sénégal (Port de Dakar)"),
      ...bullets(
        "Droit de douane : 20% CIF pour les véhicules neufs",
        "TVA : 18%",
        "Redevance de statistiques : 3%",
        "Prélèvement CEDEAO : 0,5%"
      ),
      img(ids.detail2, "Documents et finitions — prêt pour la livraison", "Chaque véhicule est livré avec tous les documents nécessaires au dédouanement."),
      h2("Les documents nécessaires pour dédouaner"),
      ...bullets(
        "Connaissement maritime (Bill of Lading) — délivré par l'armateur",
        "Facture commerciale (Invoice) — établie par le fabricant ou notre société",
        "Certificat d'origine — attestant la fabrication en Chine",
        "Certificat de conformité — pour les véhicules neufs",
        "Packing list — description du chargement",
        "Attestation d'assurance maritime",
        "Carte grise pays d'origine (si applicable)"
      ),
      p("Connexion Stratégique prépare et rassemble l'intégralité de ce dossier pour chaque véhicule commandé. Vous n'avez pas à vous en préoccuper."),
      h2("Connexion Stratégique peut-il gérer le dédouanement à votre place ?"),
      p("Oui. Dans le cadre de notre prestation complète, nous pouvons prendre en charge l'intégralité des formalités douanières via notre réseau de commissionnaires agréés à Cotonou, Lomé, Abidjan et Dakar. Votre véhicule vous est alors remis prêt à immatriculer, sans que vous ayez à vous déplacer une seule fois au port."),
      quote("\"Ils ont tout géré du début à la fin — de la commande au port, jusqu'à la livraison devant chez moi. Je n'ai jamais mis les pieds au port.\" — Client, Abidjan, 2025"),
    ],
  };

  // ────────────────────────────────────────────────────────────────────────────
  // ARTICLE 5 — Haval vs Changan vs Jetour comparatif famille
  // ────────────────────────────────────────────────────────────────────────────
  const art5 = {
    _type: "post", _id: "article-haval-changan-jetour-comparatif-famille-2026",
    title: "Haval vs Changan vs Jetour : lequel choisir pour votre famille en 2026 ?",
    slug: { _type:"slug", current:"haval-vs-changan-vs-jetour-comparatif-famille-2026" },
    mainImage: { _type:"image", asset:{ _type:"reference", _ref:ids.suv2 }, alt:"SUV familial chinois — vue profil" },
    publishedAt: "2026-06-08T08:00:00.000Z",
    category: "guides",
    excerpt: "Haval H6, Changan X5 Plus ou Jetour X70 : quel SUV chinois choisir pour votre famille en Afrique en 2026 ? Comparatif honnête sur le confort, l'espace, la fiabilité et le prix.",
    seoTitle: "Haval vs Changan vs Jetour 2026 — Quel SUV choisir pour sa famille ? | Voitures Chinoises",
    seoDescription: "Comparatif Haval H6, Changan X5 Plus et Jetour X70 Plus en 2026 : espace, confort, prix et fiabilité. Quel SUV chinois convient le mieux à votre famille en Afrique ?",
    body: [
      p("Trois marques chinoises dominent aujourd'hui le marché des SUV familiaux en Afrique de l'Ouest : Haval avec le H6, Changan avec le X5 Plus, et Jetour avec le X70 Plus. Toutes les trois ont leurs partisans — et leurs arguments. Ce comparatif va au fond des choses pour vous aider à trancher."),
      h2("Haval H6 — Le SUV de référence absolue"),
      p("Le Haval H6 est le SUV le plus vendu au monde depuis 7 années consécutives. Ce n'est pas un hasard. Il combine une finition sans reproche, un habitacle spacieux et une mécanique qui a fait ses preuves sur des millions de kilomètres à travers le monde."),
      ...bullets(
        "Pour qui ? Les familles qui veulent la sécurité du choix éprouvé et une revente facile.",
        "Points forts : fiabilité reconnue, suspensions bien calibrées pour les mauvaises routes, disponibilité des pièces.",
        "Point faible : intérieur légèrement plus sobre que la concurrence.",
        "Score famille : 8,5/10"
      ),
      img(ids.interior, "Haval H6 — habitacle familial spacieux", "L'habitacle du Haval H6 : espace, confort et qualité des matériaux au rendez-vous."),
      h2("Changan X5 Plus — L'innovation à prix accessible"),
      p("Le Changan X5 Plus est notre coup de cœur 2026. Changan a investi massivement en R&D ces dernières années, et cela se voit : le X5 Plus offre un niveau technologique bluffant pour son prix."),
      ...bullets(
        "Pour qui ? Les familles qui veulent le meilleur équipement tech sans se ruiner.",
        "Points forts : double écran de série, 8 airbags, système audio haut de gamme, design moderne.",
        "Point faible : marque moins connue en Afrique que Haval — même si la qualité est là.",
        "Score famille : 9/10"
      ),
      h2("Jetour X70 Plus — L'espace avant tout"),
      p("Si vous avez 5 enfants ou si vous faites régulièrement de longs trajets avec plusieurs adultes, le Jetour X70 Plus est simplement dans une autre catégorie. Ses 7 places véritablement utilisables (y compris pour des adultes à la 3ème rangée) et son coffre généreux en font le roi de la famille nombreuse."),
      ...bullets(
        "Pour qui ? Les familles de 5 à 7 personnes, les professionnels qui transportent des clients.",
        "Points forts : 3 vraies rangées de sièges, toit panoramique, silence de roulement impressionnant.",
        "Point faible : gabarit plus encombrant en ville.",
        "Score famille : 9,5/10 si vous avez besoin des 7 places"
      ),
      img(ids.trunk, "Coffre Jetour — volume exceptionnel", "Le coffre du Jetour X70 Plus : l'un des plus grands de sa catégorie."),
      h2("Tableau comparatif final"),
      ...bullets(
        "Budget serré (< 12M FCFA) → Changan X5 Plus",
        "Priorité fiabilité et revente → Haval H6",
        "Famille nombreuse (5+ personnes) → Jetour X70 Plus",
        "Technologie et innovation → Changan X5 Plus ou BYD Song Plus",
        "Longs trajets interurbains → Jetour X70 Plus ou Haval H6"
      ),
      quote("\"Il n'y a pas de mauvais choix parmi ces trois modèles. La bonne question est : pour quel usage précis, et quel budget ? C'est exactement ce que nous vous aidons à clarifier avant chaque commande.\""),
      p("Vous hésitez encore ? Contactez notre équipe — nous vous posons 5 questions et vous recommandons le modèle idéal en moins de 24 heures. Gratuit, sans engagement."),
    ],
  };

  // ────────────────────────────────────────────────────────────────────────────
  // ARTICLE 6 — Marché automobile Afrique de l'Ouest 2026
  // ────────────────────────────────────────────────────────────────────────────
  const art6 = {
    _type: "post", _id: "article-marche-automobile-afrique-ouest-tendances-2026",
    title: "Marché automobile en Afrique de l'Ouest 2026 : les grandes tendances",
    slug: { _type:"slug", current:"marche-automobile-afrique-ouest-tendances-2026" },
    mainImage: { _type:"image", asset:{ _type:"reference", _ref:ids.canton }, alt:"Canton Fair Guangzhou — automobiles chinoises export" },
    publishedAt: "2026-06-05T08:00:00.000Z",
    category: "marche",
    excerpt: "Quelles sont les grandes tendances du marché automobile en Afrique de l'Ouest en 2026 ? Montée en puissance des marques chinoises, électrification, nouvelles routes commerciales : analyse complète.",
    seoTitle: "Marché automobile Afrique de l'Ouest 2026 — Tendances & analyse | Voitures Chinoises",
    seoDescription: "Analyse du marché automobile en Afrique de l'Ouest en 2026 : part de marché des marques chinoises, électrification, prix et perspectives. Étude Connexion Stratégique.",
    body: [
      p("Le marché automobile en Afrique de l'Ouest connaît une transformation sans précédent. En l'espace de cinq ans, les marques chinoises ont capté une part de marché significative au détriment des constructeurs japonais et coréens traditionnellement dominants. Analyse des tendances majeures pour 2026."),
      h2("Tendance n°1 : Les marques chinoises captent 35% du marché en import neuf"),
      p("Selon nos données commerciales et les rapports des autorités portuaires de Cotonou et Lomé, les véhicules chinois représentent désormais plus de 35% des importations de véhicules neufs en Afrique de l'Ouest francophone en 2026 — contre moins de 10% en 2020."),
      p("Cette progression est portée par trois facteurs : la qualité en nette hausse des véhicules chinois, l'explosion des capacités de production permettant des délais courts, et surtout le différentiel de prix qui rend le neuf chinois accessible à une classe moyenne africaine en pleine expansion."),
      img(ids.suv1, "SUV chinois — le choix de la classe moyenne africaine", "Les SUV chinois neufs : un accès au premium à prix démocratique pour la classe moyenne africaine."),
      h2("Tendance n°2 : L'électrification progresse, portée par le PHEV"),
      p("Contrairement à ce qu'on pourrait imaginer, l'électrification du parc automobile africain avance — non pas via les véhicules 100% électriques (limités par les infrastructures de recharge), mais via les hybrides rechargeables (PHEV). Les PHEV peuvent rouler en mode thermique sur de longues distances et en mode électrique en ville, s'adaptant parfaitement aux contraintes locales."),
      ...bullets(
        "BYD Song Plus PHEV : le modèle le plus commandé en électrifié sur nos marchés",
        "Changan UNI-K PHEV : montée en gamme avec une autonomie électrique de 110 km",
        "Haval Jolion PHEV : compact urbain idéal pour Abidjan ou Dakar",
        "Économie réelle : nos clients PHEV rapportent une économie de carburant de 60 à 70% en usage urbain"
      ),
      h2("Tendance n°3 : La demande en 7 places explose"),
      p("La demande de SUV 7 places a augmenté de plus de 60% dans notre catalogue entre 2024 et 2026. Deux raisons : la taille des familles africaines d'une part, et l'utilisation professionnelle des véhicules (VTC, transport de personnel, excursions) d'autre part. Le Jetour X70 Plus et le Changan Hunter (7 places pick-up) sont nos modèles 7 places les plus commandés."),
      img(ids.view, "SUV 7 places — vue d'ensemble", "La demande en SUV 7 places est en forte croissance en Afrique de l'Ouest."),
      h2("Tendance n°4 : L'importation directe gagne du terrain"),
      p("Les acheteurs africains sont de plus en plus nombreux à contourner les revendeurs locaux et à importer directement. Ce phénomène est facilité par la démocratisation d'internet, la possibilité de payer en FCFA ou en mobile money, et la confiance croissante envers des intermédiaires spécialisés comme Connexion Stratégique."),
      ...bullets(
        "Économie moyenne réalisée par l'acheteur en import direct : 20 à 35% vs. prix revendeur local",
        "Délai moyen de livraison CIF port : 45 à 70 jours depuis la commande",
        "Satisfaction client import direct : 94% de clients satisfaits ou très satisfaits (source : enquête interne 2025)"
      ),
      h2("Perspectives 2026-2028"),
      p("Plusieurs tendances lourdes vont continuer à transformer le marché dans les deux prochaines années. D'abord, l'arrivée d'OMODA et de JAECOO (marques premium de Chery Group) apporte une offre encore plus haut de gamme à des prix compétitifs. Ensuite, la montée en puissance du réseau de maintenance pour les marques chinoises en Afrique va lever les dernières réticences des acheteurs."),
      quote("\"Dans deux ans, importer une voiture chinoise neuve sera aussi naturel que d'acheter une Toyota. La différence, c'est qu'elle sera mieux équipée et deux fois moins chère.\""),
    ],
  };

  // ────────────────────────────────────────────────────────────────────────────
  // Create all articles
  // ────────────────────────────────────────────────────────────────────────────
  const articles = [art1, art2, art3, art4, art5, art6];
  console.log(`\n📝 Création de ${articles.length} articles...\n`);
  for (const art of articles) {
    const res = await client.createOrReplace(art);
    console.log(`  ✅ "${res.title}"`);
    console.log(`     /blog/${res.slug?.current}\n`);
  }
  console.log("🎉 Tous les articles ont été créés avec succès !");
}

main().catch((err) => {
  console.error("❌ Erreur :", err.message);
  process.exit(1);
});

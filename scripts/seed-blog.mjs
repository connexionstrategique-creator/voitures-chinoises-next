import { createClient } from "@sanity/client";
import https from "https";
import http from "http";

const TOKEN = "skyztPiIY9B6QnGxPk1LGpDi4AbqNDaoHoPCDmSxsvBhzLFCjt198UNt8b3Hp7lq7eWIMWsJ9PVsYfDlE";
const PROJECT_ID = "t3ow1rmc";
const DATASET = "production";

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: "2024-01-01",
  useCdn: false,
  token: TOKEN,
});

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
  console.log(`  Uploading ${filename}...`);
  const buf = await downloadBuffer(url);
  const asset = await client.assets.upload("image", buf, {
    filename,
    contentType: "image/jpeg",
  });
  console.log(`  ✓ ${filename} → ${asset._id}`);
  return asset._id;
}

function key(n) {
  return `k${String(n).padStart(4, "0")}`;
}

function textBlock(text, style = "normal", k) {
  return {
    _type: "block",
    _key: key(k),
    style,
    children: [{ _type: "span", _key: key(k) + "s", text, marks: [] }],
    markDefs: [],
  };
}

function boldSpan(text, normalAfter, k) {
  return {
    _type: "block",
    _key: key(k),
    style: "normal",
    children: [
      { _type: "span", _key: key(k) + "a", text, marks: ["strong"] },
      { _type: "span", _key: key(k) + "b", text: normalAfter, marks: [] },
    ],
    markDefs: [],
  };
}

function listBlock(items, listItem = "bullet", k) {
  return items.map((text, i) => ({
    _type: "block",
    _key: key(k + i),
    style: "normal",
    listItem,
    level: 1,
    children: [{ _type: "span", _key: key(k + i) + "s", text, marks: [] }],
    markDefs: [],
  }));
}

function quoteBlock(text, k) {
  return {
    _type: "block",
    _key: key(k),
    style: "blockquote",
    children: [{ _type: "span", _key: key(k) + "s", text, marks: [] }],
    markDefs: [],
  };
}

function imgBlock(assetId, alt, caption, k) {
  return {
    _type: "image",
    _key: key(k),
    asset: { _type: "reference", _ref: assetId },
    alt,
    caption,
  };
}

async function main() {
  console.log("🚀 Création de l'article de blog test...\n");

  // Upload cover image + 2 body images
  const coverId = await uploadImage(
    "https://res.cloudinary.com/daol8mzeg/image/upload/v1772664699/IMG_6849_u4ylox.jpg",
    "blog-cover-importation.jpg"
  );
  const img1Id = await uploadImage(
    "https://res.cloudinary.com/daol8mzeg/image/upload/v1772664726/IMG_6850_cycltt.jpg",
    "blog-body-voiture-profil.jpg"
  );
  const img2Id = await uploadImage(
    "https://res.cloudinary.com/daol8mzeg/image/upload/v1772664718/IMG_6852_hpxw5s.jpg",
    "blog-body-voiture-arriere.jpg"
  );
  const img3Id = await uploadImage(
    "https://res.cloudinary.com/daol8mzeg/image/upload/v1772664710/IMG_6853_dsa88y.jpg",
    "blog-body-interieur.jpg"
  );

  console.log("\n📝 Construction de l'article...");

  const body = [
    // Intro
    textBlock(
      "Importer une voiture neuve directement depuis la Chine vers l'Afrique francophone est aujourd'hui l'un des leviers les plus puissants pour acquérir un véhicule premium à prix compétitif. Mais avant de se lancer, il est indispensable de comprendre les étapes, les acteurs en jeu et les erreurs à éviter. Ce guide complet vous accompagne de A à Z.",
      "normal", 10
    ),

    // Section 1
    textBlock("Pourquoi les voitures chinoises ont-elles la cote en Afrique ?", "h2", 20),
    textBlock(
      "En l'espace de dix ans, les constructeurs automobiles chinois ont réalisé un bond technologique spectaculaire. Des marques comme BYD, Changan, Haval ou Jetour proposent aujourd'hui des véhicules équipés de boîtes automatiques, d'écrans tactiles larges et de systèmes d'assistance à la conduite — le tout à un tarif bien en dessous des équivalents japonais ou européens.",
      "normal", 21
    ),
    textBlock(
      "Trois raisons expliquent cet engouement sur le continent africain :",
      "normal", 22
    ),
    ...listBlock([
      "Un rapport qualité/prix imbattable : 30 à 40 % moins cher qu'un véhicule japonais ou coréen de gamme équivalente.",
      "Des équipements de série généreux : climatisation automatique, caméra de recul, aide au stationnement, régulateur de vitesse adaptatif.",
      "Une disponibilité immédiate : contrairement aux importateurs traditionnels, les délais de fabrication et de livraison sont maîtrisés directement à la source.",
    ], "bullet", 23),

    // Image 1
    imgBlock(img1Id, "Changan X5 Plus — vue de profil", "Le Changan X5 Plus : l'un des SUV les plus vendus sur le marché africain en 2026.", 30),

    // Section 2
    textBlock("Comment fonctionne l'importation directe depuis la Chine ?", "h2", 40),
    textBlock(
      "L'importation directe, c'est acheter le véhicule à l'usine ou chez un distributeur officiel en Chine, puis le faire livrer CIF (Cost, Insurance, Freight) jusqu'au port de destination. C'est là que Connexion Stratégique intervient.",
      "normal", 41
    ),
    textBlock("Les 5 étapes clés de l'importation", "h3", 42),
    ...listBlock([
      "Sélection du modèle : vous choisissez la marque, la version, la couleur et les options souhaitées.",
      "Devis personnalisé : nous vous envoyons un devis détaillé incluant le prix usine, le fret maritime, les assurances et nos frais de service.",
      "Commande et paiement : après validation, nous lançons la commande directement auprès du fabricant.",
      "Production et expédition : le véhicule est fabriqué (si besoin) puis chargé sur un navire. Délai moyen : 45 à 75 jours selon le port de destination.",
      "Dédouanement et livraison : à l'arrivée au port, nous vous accompagnons dans les formalités douanières ou prenons en charge l'ensemble de la procédure.",
    ], "number", 43),

    // Blockquote
    quoteBlock(
      "\"Nous avons commandé un Haval H6 en mars et il est arrivé à Cotonou en mai. Le processus était transparent de bout en bout — aucune mauvaise surprise.\" — Client, Bénin, 2025",
      50
    ),

    // Image 2
    imgBlock(img2Id, "Vue arrière du véhicule au port de Cotonou", "À l'arrivée au port : le véhicule est vérifié, documenté et remis en parfait état.", 60),

    // Section 3
    textBlock("Quels sont les coûts réels à prévoir ?", "h2", 70),
    textBlock(
      "Au prix du véhicule s'ajoutent plusieurs lignes de coût qu'il faut anticiper dès le départ pour éviter les mauvaises surprises :",
      "normal", 71
    ),
    boldSpan("Le fret maritime : ", "comptez entre 800 000 et 1 500 000 FCFA selon le port de destination (Cotonou, Lomé, Abidjan, Dakar).", 72),
    boldSpan("Les droits de douane : ", "variables selon le pays d'entrée (généralement 25 à 35 % de la valeur CIF pour les pays de l'UEMOA).", 73),
    boldSpan("Les frais de service Connexion Stratégique : ", "forfait fixe communiqué dans votre devis, sans surprise.", 74),
    textBlock(
      "À titre indicatif, un SUV chinois à 12 000 USD départ usine revient, toutes taxes et frais inclus, entre 11 et 14 millions de FCFA livré au port de Cotonou. Contre 18 à 22 millions pour un véhicule équivalent importé par les circuits classiques.",
      "normal", 75
    ),

    // Image 3
    imgBlock(img3Id, "Intérieur premium — tableau de bord digital", "Les intérieurs des véhicules chinois modernes rivalisent avec les standards européens.", 80),

    // Section 4
    textBlock("Les marques les plus recommandées pour 2026", "h2", 90),
    textBlock(
      "Après plusieurs années d'expérience sur le terrain africain, voici les marques qui offrent le meilleur équilibre fiabilité / entretien / disponibilité des pièces :",
      "normal", 91
    ),
    ...listBlock([
      "Changan — leader en termes de rapport qualité/prix. Le X5 Plus et l'UNI-K sont nos bestsellers.",
      "Haval — spécialiste du SUV premium. Le H6 et le Jolion ont une cote de revente excellente.",
      "Jetour — montée en gamme fulgurante. Le X70 Plus 7 places séduit les familles nombreuses.",
      "BYD — référence mondiale dans l'électrique et l'hybride. Idéal pour les grandes villes.",
      "Chery — constructeur historique, dense réseau de pièces détachées sur le continent.",
    ], "bullet", 92),

    // Conclusion
    textBlock("Prêt à passer à l'action ?", "h2", 100),
    textBlock(
      "Importer une voiture directement depuis la Chine n'est plus réservé aux professionnels. Avec un partenaire fiable et transparent, c'est une démarche accessible, encadrée et sécurisée. Connexion Stratégique vous accompagne à chaque étape : de la sélection du modèle à la livraison au port, en passant par le suivi douanier.",
      "normal", 101
    ),
    textBlock(
      "Contactez-nous dès aujourd'hui pour un devis gratuit et sans engagement. Notre équipe vous répond sous 48h ouvrées.",
      "normal", 102
    ),
  ];

  const post = {
    _type: "post",
    _id: "article-guide-importation-voitures-chinoises-afrique",
    title: "Importer une voiture chinoise en Afrique : le guide complet 2026",
    slug: { _type: "slug", current: "guide-importation-voiture-chinoise-afrique-2026" },
    mainImage: {
      _type: "image",
      asset: { _type: "reference", _ref: coverId },
      alt: "SUV chinois importé — face avant, Changan X5 Plus",
    },
    publishedAt: "2026-06-25T08:00:00.000Z",
    category: "guides",
    excerpt:
      "Tout ce qu'il faut savoir avant d'importer votre véhicule chinois en Afrique francophone : démarches, délais, coûts réels et erreurs à éviter. Guide complet 2026 par Connexion Stratégique.",
    seoTitle:
      "Importer une voiture chinoise en Afrique en 2026 — Guide complet | Voitures Chinoises",
    seoDescription:
      "Découvrez comment importer une voiture neuve depuis la Chine vers l'Afrique francophone : étapes, coûts, marques recommandées et conseils d'experts. Guide 2026.",
    body,
  };

  console.log("  Création du document Sanity...");
  const result = await client.createOrReplace(post);
  console.log(`\n✅ Article créé avec succès !`);
  console.log(`   ID      : ${result._id}`);
  console.log(`   Slug    : ${result.slug?.current}`);
  console.log(`   Titre   : ${result.title}`);
  console.log(`\n🔗 /blog/guide-importation-voiture-chinoise-afrique-2026`);
}

main().catch((err) => {
  console.error("❌ Erreur :", err.message);
  process.exit(1);
});

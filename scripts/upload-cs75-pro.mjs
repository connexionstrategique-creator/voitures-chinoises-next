import { createClient } from "@sanity/client";
import { createReadStream, readdirSync } from "fs";
import { join, extname } from "path";

const client = createClient({
  projectId: "t3ow1rmc",
  dataset: "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_TOKEN,
  useCdn: false,
});

const PHOTOS_DIR = "/Users/apple/Documents/Dossier photos voitures chinoises/Changan CS75 PRO";
const CAR_ID = "car-cs75pro";

async function uploadPhotos() {
  const files = readdirSync(PHOTOS_DIR)
    .filter(f => [".jpg", ".jpeg", ".png"].includes(extname(f).toLowerCase()))
    .sort();

  console.log(`Uploading ${files.length} photos...`);
  const assets = [];

  for (const file of files) {
    const path = join(PHOTOS_DIR, file);
    console.log(`  Uploading ${file}...`);
    const asset = await client.assets.upload("image", createReadStream(path), { filename: file });
    assets.push({ _type: "image", _key: asset._id.slice(-8), asset: { _type: "reference", _ref: asset._id } });
    console.log(`  ✓ ${file} → ${asset._id}`);
  }
  return assets;
}

async function createCarDocument(photos) {
  const doc = {
    _id: CAR_ID,
    _type: "car",
    brand: "Changan",
    model: "CS75 PRO 2026",
    price: "9 900 000",
    autohomeId: null,
    colors: [],
    photos,
    tags: null,
    specs: [
      { _key: "s0",  key: "— PARAMÈTRES GÉNÉRAUX —", value: "" },
      { _key: "s1",  key: "Modèle",                   value: "Changan CS75 PRO 2026 — 1.5T DCT Confort · 7 places" },
      { _key: "s2",  key: "Mise sur le marché",        value: "Octobre 2025" },
      { _key: "s3",  key: "Carrosserie",               value: "SUV compact · 5 portes · 7 places (2-3-2)" },
      { _key: "s4",  key: "Transmission",              value: "Traction avant (FWD)" },
      { _key: "s5",  key: "Carburant",                 value: "Essence 92" },
      { _key: "s6",  key: "Masse à vide",              value: "1 575 kg" },
      { _key: "s7",  key: "Masse totale autorisée",    value: "2 100 kg" },
      { _key: "s8",  key: "Réservoir",                 value: "55 L" },
      { _key: "s9",  key: "Garde au sol",              value: "—" },
      { _key: "s10", key: "Angle d'attaque / de fuite", value: "20° / 24°" },
      { _key: "s11", key: "— MOTORISATION 1.5T 7DCT —", value: "" },
      { _key: "s12", key: "Moteur",                    value: "JL473ZQD — 1.5T · 4 cylindres en ligne · DOHC" },
      { _key: "s13", key: "Cylindrée",                 value: "1 494 cm³ (1,5 L)" },
      { _key: "s14", key: "Alimentation",              value: "Turbocompressé · injection directe" },
      { _key: "s15", key: "Puissance maximale",        value: "141 kW / 192 ch à 5 500 tr/min" },
      { _key: "s16", key: "Couple maximal",            value: "310 N·m de 1 500 à 4 000 tr/min" },
      { _key: "s17", key: "Boîte de vitesses",         value: "7DCT — double embrayage humide (7 rapports)" },
      { _key: "s18", key: "Vitesse maximale",          value: "190 km/h" },
      { _key: "s19", key: "0-100 km/h",               value: "8,4 s" },
      { _key: "s20", key: "Consommation WLTC",         value: "7,75 L/100 km" },
      { _key: "s21", key: "— DIMENSIONS & CHÂSSIS —",  value: "" },
      { _key: "s22", key: "Longueur × Largeur × Hauteur", value: "4 742 × 1 870 × 1 720 mm" },
      { _key: "s23", key: "Empattement",               value: "2 786 mm" },
      { _key: "s24", key: "Voie avant / arrière",      value: "1 590 / 1 590 mm" },
      { _key: "s25", key: "Pneumatiques",              value: "225/55 R19 · Jantes alliage aluminium" },
      { _key: "s26", key: "Suspension avant",          value: "MacPherson — indépendante" },
      { _key: "s27", key: "Suspension arrière",        value: "Multi-bras — indépendante" },
      { _key: "s28", key: "Direction",                 value: "Assistance électrique" },
      { _key: "s29", key: "Freins avant / arrière",    value: "Disques ventilés / Disques" },
      { _key: "s30", key: "Frein de stationnement",    value: "Électronique (EPB)" },
      { _key: "s31", key: "Roue de secours",           value: "Non pleine mesure — sous le châssis" },
      { _key: "s32", key: "— SÉCURITÉ PASSIVE —",      value: "" },
      { _key: "s33", key: "Airbags frontaux",          value: "Conducteur + passager avant" },
      { _key: "s34", key: "Airbags latéraux / rideaux", value: "Rangée avant + rangée arrière" },
      { _key: "s35", key: "ABS / EBD / ESP",           value: "Oui" },
      { _key: "s36", key: "TPMS",                      value: "Affichage pression pneus" },
      { _key: "s37", key: "ISOFIX",                    value: "Oui" },
      { _key: "s38", key: "— SÉCURITÉ ACTIVE ADAS —",  value: "" },
      { _key: "s39", key: "Caméra 360°",               value: "Vue panoramique 360° · 4 caméras 100 Mpx" },
      { _key: "s40", key: "Radars",                    value: "3 radars ultrasoniques AV · Radars AR" },
      { _key: "s41", key: "Régulateur adaptatif",      value: "ACC — régulateur de vitesse constant" },
      { _key: "s42", key: "Aide démarrage en côte",    value: "Oui" },
      { _key: "s43", key: "— EXTÉRIEUR & ÉCLAIRAGE —", value: "" },
      { _key: "s44", key: "Phares avant / arrière",    value: "Full LED" },
      { _key: "s45", key: "Toit",                      value: "Toit panoramique — ouverture électrique" },
      { _key: "s46", key: "Rétroviseurs",              value: "Réglage électrique · rabattement" },
      { _key: "s47", key: "Essuie-glaces",             value: "Détection de pluie" },
      { _key: "s48", key: "Accès / démarrage",         value: "Accès sans clé · démarrage bouton" },
      { _key: "s49", key: "Hayon électrique",          value: "Oui" },
      { _key: "s50", key: "— COCKPIT & CONNECTIVITÉ —", value: "" },
      { _key: "s51", key: "Instrumentation",           value: "10,25\" — LCD full digital" },
      { _key: "s52", key: "Écran central",             value: "14,6\" — tactile" },
      { _key: "s53", key: "Processeur",                value: "MTK8675" },
      { _key: "s54", key: "Compatibilité",             value: "Apple CarPlay · CarLink · Huawei HiCar" },
      { _key: "s55", key: "IA vocale",                 value: "«Hello, Xiao'an» — reconnaissance vocale" },
      { _key: "s56", key: "Réseau",                    value: "4G intégré" },
      { _key: "s57", key: "Navigation",                value: "Oui — intégrée" },
      { _key: "s58", key: "Interfaces USB",            value: "1× USB Type-C avant · 2× USB Type-C arrière" },
      { _key: "s59", key: "Audio",                     value: "4 haut-parleurs" },
      { _key: "s60", key: "— SIÈGES & HABITACLE —",    value: "" },
      { _key: "s61", key: "Configuration",             value: "7 places · disposition 2-3-2" },
      { _key: "s62", key: "Revêtement",                value: "Simili-cuir" },
      { _key: "s63", key: "Siège conducteur",          value: "Réglage électrique" },
      { _key: "s64", key: "Siège passager avant",      value: "Réglage électrique (dossier + avant/arrière)" },
      { _key: "s65", key: "Sièges arrière",            value: "Rabattement proportionnel" },
      { _key: "s66", key: "Accoudoir",                 value: "Rangée avant + rangée arrière" },
      { _key: "s67", key: "Climatisation",             value: "Automatique · filtre PM2,5" },
      { _key: "s68", key: "Vitres",                    value: "Électriques · fermeture one-touch · anti-pincement" },
    ],
  };

  console.log(`\nCreating document ${CAR_ID}...`);
  const result = await client.createOrReplace(doc);
  console.log(`✓ Document created: ${result._id}`);
  return result;
}

async function main() {
  if (!process.env.SANITY_TOKEN) {
    console.error("Missing SANITY_TOKEN env variable");
    process.exit(1);
  }
  const photos = await uploadPhotos();
  await createCarDocument(photos);
  console.log("\nDone!");
}

main().catch(console.error);

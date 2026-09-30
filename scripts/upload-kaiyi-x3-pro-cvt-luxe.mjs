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

const PHOTOS_DIR = "/Users/apple/Documents/Dossier photos voitures chinoises/Kaiyi X3 Pro";
const CAR_ID = "car-kaiyi-x3-pro-1-5l-cvt-edition-luxe";

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
    brand: "Kaiyi",
    model: "X3 Pro — 1.5L CVT Édition Luxe",
    price: "7 650 000",
    autohomeId: null,
    colors: [],
    photos,
    tags: null,
    specs: [
      { _key: "s0",  key: "— PARAMÈTRES GÉNÉRAUX —",        value: "" },
      { _key: "s1",  key: "Modèle",                          value: "Kaiyi X3 Pro 2025 · 1.5L CVT · Édition Luxe" },
      { _key: "s2",  key: "Fabricant",                       value: "Kaiyi Automobile — joint-venture SAIC × Chery" },
      { _key: "s3",  key: "Finition",                        value: "Édition Luxe (精英版)" },
      { _key: "s4",  key: "Mise sur le marché",              value: "Mars 2025" },
      { _key: "s5",  key: "Carrosserie",                     value: "Mini SUV · 5 portes · 5 places" },
      { _key: "s6",  key: "Énergie",                         value: "Essence SP92 · Norme nationale VI (équiv. Euro 6)" },
      { _key: "s7",  key: "Transmission",                    value: "Traction avant (FWD)" },
      { _key: "s8",  key: "Poids à vide",                    value: "1 346 kg" },
      { _key: "s9",  key: "PTAC",                            value: "1 780 kg" },
      { _key: "s10", key: "Vitesse maximale",                value: "165 km/h" },
      { _key: "s11", key: "Consommation WLTC",               value: "7,6 L/100 km" },
      { _key: "s12", key: "— MOTORISATION 1.5L CVT —",      value: "" },
      { _key: "s13", key: "Moteur",                          value: "SQRE4G15C — 1.5L · 4 cylindres en ligne · DOHC · atmosphérique" },
      { _key: "s14", key: "Cylindrée",                       value: "1 499 cm³ (1,5 L)" },
      { _key: "s15", key: "Distribution",                    value: "DOHC · 4 soupapes par cylindre" },
      { _key: "s16", key: "Alimentation",                    value: "Injection multipoint (MPI) — aspiration naturelle" },
      { _key: "s17", key: "Matériau culasse / bloc",         value: "Alliage d'aluminium / Fonte grise" },
      { _key: "s18", key: "Puissance maximale",              value: "85 kW / 116 ch à 6 150 tr/min" },
      { _key: "s19", key: "Puissance nette",                 value: "83 kW" },
      { _key: "s20", key: "Couple maximal",                  value: "143 N·m à 4 000 tr/min" },
      { _key: "s21", key: "Boîte de vitesses",               value: "CVT — transmission à variation continue" },
      { _key: "s22", key: "Modes de conduite",               value: "Standard · Économique · Sport" },
      { _key: "s23", key: "— DIMENSIONS & CHÂSSIS —",        value: "" },
      { _key: "s24", key: "Longueur × Largeur × Hauteur",   value: "4 420 × 1 831 × 1 677 mm" },
      { _key: "s25", key: "Empattement",                     value: "2 632 mm" },
      { _key: "s26", key: "Voie avant / arrière",            value: "1 551 / 1 563 mm" },
      { _key: "s27", key: "Suspension avant",                value: "MacPherson — indépendante" },
      { _key: "s28", key: "Suspension arrière",              value: "Barre de torsion — semi-indépendante" },
      { _key: "s29", key: "Direction",                       value: "Assistance électrique (EPS)" },
      { _key: "s30", key: "Freins avant / arrière",          value: "Disques ventilés / Disques" },
      { _key: "s31", key: "Frein de stationnement",          value: "Électronique (EPB)" },
      { _key: "s32", key: "Pneumatiques",                    value: "215/60 R17 · Jantes alliage aluminium" },
      { _key: "s33", key: "— SÉCURITÉ PASSIVE —",            value: "" },
      { _key: "s34", key: "Airbags frontaux",                value: "Conducteur + passager avant" },
      { _key: "s35", key: "Airbags latéraux",                value: "Avant + arrière (toutes rangées)" },
      { _key: "s36", key: "Airbags rideaux",                 value: "Avant + arrière" },
      { _key: "s37", key: "ABS / EBD / EBA",                value: "Oui" },
      { _key: "s38", key: "ESP / TCS",                       value: "Oui" },
      { _key: "s39", key: "TPMS",                            value: "Surveillance pression pneus — affichage numérique" },
      { _key: "s40", key: "ISOFIX",                          value: "Oui — interface siège enfant" },
      { _key: "s41", key: "Rappel ceinture / Prétensionneurs", value: "Oui · conducteur" },
      { _key: "s42", key: "— AIDE À LA CONDUITE —",          value: "" },
      { _key: "s43", key: "Régulateur de vitesse",           value: "Vitesse constante" },
      { _key: "s44", key: "Caméra de recul",                 value: "1 caméra arrière" },
      { _key: "s45", key: "Radars ultrasoniques",            value: "3 capteurs — avant + arrière" },
      { _key: "s46", key: "Radars millimétriques",           value: "Non" },
      { _key: "s47", key: "Aide démarrage en côte (HSA)",   value: "Oui" },
      { _key: "s48", key: "Frein de stationnement auto",     value: "Oui" },
      { _key: "s49", key: "Ouverture coffre",                value: "Électrique à distance" },
      { _key: "s50", key: "— EXTÉRIEUR & ÉCLAIRAGE —",       value: "" },
      { _key: "s51", key: "Phares avant",                    value: "LED · allumage automatique" },
      { _key: "s52", key: "Feux de route",                   value: "LED" },
      { _key: "s53", key: "Antibrouillards",                 value: "Halogène" },
      { _key: "s54", key: "Feux arrière",                    value: "LED" },
      { _key: "s55", key: "Toit",                            value: "Toit ouvrant électrique" },
      { _key: "s56", key: "Calandre",                        value: "Active — fermeture automatique" },
      { _key: "s57", key: "Rétroviseurs extérieurs",         value: "Réglage électrique" },
      { _key: "s58", key: "Rétroviseur intérieur",           value: "Anti-éblouissement manuel" },
      { _key: "s59", key: "Essuie-glaces",                   value: "Détection de pluie automatique · essuie-glace arrière" },
      { _key: "s60", key: "Accès / démarrage",               value: "Accès sans clé (conducteur) · coffre électrique · démarrage électronique · clé télécommande" },
      { _key: "s61", key: "Vitres",                          value: "Électriques — copilote one-touch" },
      { _key: "s62", key: "— COCKPIT & CONNECTIVITÉ —",      value: "" },
      { _key: "s63", key: "Instrumentation",                 value: "LCD 7\" couleur" },
      { _key: "s64", key: "Écran central",                   value: "Tactile 10,25\" couleur" },
      { _key: "s65", key: "HUD",                             value: "Affichage tête haute couleur" },
      { _key: "s66", key: "Compatibilité smartphone",        value: "Baidu CarLife" },
      { _key: "s67", key: "Reconnaissance vocale",           value: "Oui — multimédia · navigation · téléphone" },
      { _key: "s68", key: "Bluetooth",                       value: "Oui — téléphonie mains libres" },
      { _key: "s69", key: "Navigation",                      value: "GPS intégrée" },
      { _key: "s70", key: "Charge sans fil",                 value: "Non" },
      { _key: "s71", key: "Interfaces USB",                  value: "2× USB — rangée avant" },
      { _key: "s72", key: "Prise",                           value: "Allume-cigare 12V" },
      { _key: "s73", key: "Audio",                           value: "4 haut-parleurs" },
      { _key: "s74", key: "— SIÈGES & HABITACLE —",          value: "" },
      { _key: "s75", key: "Configuration",                   value: "5 places" },
      { _key: "s76", key: "Revêtement",                      value: "Simili-cuir" },
      { _key: "s77", key: "Siège conducteur",                value: "Réglage électrique — hauteur · dossier · longitudinal" },
      { _key: "s78", key: "Siège passager avant",            value: "Réglage électrique — dossier · longitudinal" },
      { _key: "s79", key: "Chauffage sièges",                value: "Non" },
      { _key: "s80", key: "Sièges arrière",                  value: "Rabattement proportionnel (split)" },
      { _key: "s81", key: "Accoudoir central AV / AR",       value: "Oui / Oui" },
      { _key: "s82", key: "Volant",                          value: "Cuir multifonctions · réglage manuel hauteur + profondeur" },
      { _key: "s83", key: "Climatisation",                   value: "Manuelle monozone" },
      { _key: "s84", key: "Miroirs de courtoisie",           value: "Conducteur + passager" },
    ],
  };

  console.log(`\nCreating/replacing document ${CAR_ID}...`);
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

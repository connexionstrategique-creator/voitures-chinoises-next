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

const PHOTOS_DIR = "/Users/apple/Documents/Dossier photos voitures chinoises/GAC GS3 (1)";
const CAR_ID = "car-gac-gs3-2026";

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
    brand: "GAC",
    model: "GS3 2026 — Shadow Speed 270T · Édition Dynamique",
    price: "7 700 000",
    autohomeId: null,
    colors: [],
    photos,
    tags: null,
    specs: [
      { _key: "s0",  key: "— PARAMÈTRES GÉNÉRAUX —",         value: "" },
      { _key: "s1",  key: "Modèle",                           value: "GAC Trumpchi GS3 2026 · Shadow Speed 270T · Édition Dynamique" },
      { _key: "s2",  key: "Nom chinois",                      value: "传祺GS3 影速 270T 劲取版" },
      { _key: "s3",  key: "Mise sur le marché",               value: "Octobre 2025" },
      { _key: "s4",  key: "Carrosserie",                      value: "Mini SUV · 5 portes · 5 places" },
      { _key: "s5",  key: "Transmission",                     value: "Traction avant (FWD)" },
      { _key: "s6",  key: "Carburant",                        value: "Essence 92 · Norme nationale VI" },
      { _key: "s7",  key: "Poids à vide",                     value: "1 370 kg" },
      { _key: "s8",  key: "PTAC",                             value: "1 795 kg" },
      { _key: "s9",  key: "Réservoir",                        value: "47 L" },
      { _key: "s10", key: "Volume coffre",                    value: "341 L — sièges rabattus : 1 271 L" },
      { _key: "s11", key: "Vitesse maximale",                 value: "190 km/h" },
      { _key: "s12", key: "Consommation WLTC",                value: "6,18 L/100 km" },
      { _key: "s13", key: "— MOTORISATION 1.5T 7DCT —",      value: "" },
      { _key: "s14", key: "Moteur",                           value: "4A15J2 — 1.5T · 4 cylindres · DOHC · DVVT · turbocompressé" },
      { _key: "s15", key: "Cylindrée",                        value: "1 497 cm³ (1,5 L)" },
      { _key: "s16", key: "Distribution",                     value: "DOHC · calage variable DVVT · 4 soupapes/cylindre" },
      { _key: "s17", key: "Alimentation",                     value: "Injection directe" },
      { _key: "s18", key: "Puissance maximale",               value: "130 kW / 177 ch à 5 500 tr/min" },
      { _key: "s19", key: "Couple maximal",                   value: "270 N·m de 1 400 à 4 500 tr/min" },
      { _key: "s20", key: "Boîte de vitesses",                value: "7DCT — double embrayage humide (7 rapports)" },
      { _key: "s21", key: "Récupération d'énergie",           value: "Freinage régénératif" },
      { _key: "s22", key: "Modes de conduite",                value: "Économique · Standard · Sport · Récupération d'énergie" },
      { _key: "s23", key: "— DIMENSIONS & CHÂSSIS —",         value: "" },
      { _key: "s24", key: "Longueur × Largeur × Hauteur",    value: "4 410 × 1 850 × 1 600 mm" },
      { _key: "s25", key: "Empattement",                      value: "2 650 mm" },
      { _key: "s26", key: "Voie avant / arrière",             value: "1 600 / 1 600 mm" },
      { _key: "s27", key: "Garde au sol",                     value: "145 mm" },
      { _key: "s28", key: "Angle d'attaque / de fuite",      value: "16° / 28°" },
      { _key: "s29", key: "Suspension avant",                 value: "MacPherson — indépendante" },
      { _key: "s30", key: "Suspension arrière",               value: "Barre de torsion — semi-indépendante" },
      { _key: "s31", key: "Direction",                        value: "Assistance électrique (EPS)" },
      { _key: "s32", key: "Freins avant / arrière",           value: "Disques ventilés / Disques" },
      { _key: "s33", key: "Frein de stationnement",           value: "Électronique (EPB)" },
      { _key: "s34", key: "Pneumatiques",                     value: "215/60 R17 · Jantes alliage aluminium" },
      { _key: "s35", key: "Roue de secours",                  value: "Format réduit" },
      { _key: "s36", key: "— SÉCURITÉ PASSIVE —",             value: "" },
      { _key: "s37", key: "Airbags frontaux",                 value: "Conducteur + passager avant" },
      { _key: "s38", key: "Airbags latéraux / rideaux",      value: "Toutes rangées (avant + arrière)" },
      { _key: "s39", key: "ABS / EBD / EBA",                 value: "Oui" },
      { _key: "s40", key: "ESP / TCS",                        value: "Oui" },
      { _key: "s41", key: "TPMS",                             value: "Alerte pression pneus" },
      { _key: "s42", key: "ISOFIX",                           value: "Oui" },
      { _key: "s43", key: "Prétensionneurs / rappel ceinture", value: "Oui" },
      { _key: "s44", key: "— SÉCURITÉ ACTIVE —",              value: "" },
      { _key: "s45", key: "Régulateur de vitesse",            value: "Vitesse constante" },
      { _key: "s46", key: "Caméra de recul",                  value: "1 caméra arrière" },
      { _key: "s47", key: "Radars de stationnement",          value: "Avant + arrière" },
      { _key: "s48", key: "Aide démarrage en côte (HSA)",    value: "Oui" },
      { _key: "s49", key: "Descente contrôlée (HDC)",        value: "Oui" },
      { _key: "s50", key: "Phares adaptatifs (AFS)",         value: "Oui — feux directionnels" },
      { _key: "s51", key: "— EXTÉRIEUR & ÉCLAIRAGE —",        value: "" },
      { _key: "s52", key: "Phares avant / DRL",               value: "Full LED · allumage auto · AFS directionnels" },
      { _key: "s53", key: "Feux arrière",                     value: "LED" },
      { _key: "s54", key: "Calandre active",                  value: "Fermeture automatique" },
      { _key: "s55", key: "Rétroviseurs",                     value: "Réglage électrique · rabattement automatique" },
      { _key: "s56", key: "Essuie-glaces",                    value: "Détection de pluie automatique" },
      { _key: "s57", key: "Accès / démarrage",                value: "Clé télécommande · démarrage électronique" },
      { _key: "s58", key: "Vitres",                           value: "Avant one-touch · arrière électriques" },
      { _key: "s59", key: "— COCKPIT & CONNECTIVITÉ —",       value: "" },
      { _key: "s60", key: "Instrumentation",                  value: "7\" LCD couleur" },
      { _key: "s61", key: "Écran central",                    value: "10,25\" tactile couleur" },
      { _key: "s62", key: "Compatibilité",                    value: "Apple CarPlay · Huawei HiCar · Baidu CarLife" },
      { _key: "s63", key: "Bluetooth",                        value: "Oui — mains libres" },
      { _key: "s64", key: "Navigation",                       value: "GPS intégrée" },
      { _key: "s65", key: "Interfaces USB",                   value: "1× USB avant" },
      { _key: "s66", key: "Audio",                            value: "2 haut-parleurs" },
      { _key: "s67", key: "Application mobile",               value: "Localisation · diagnostic à distance" },
      { _key: "s68", key: "— SIÈGES & HABITACLE —",           value: "" },
      { _key: "s69", key: "Configuration",                    value: "5 places" },
      { _key: "s70", key: "Revêtement",                       value: "Simili-cuir" },
      { _key: "s71", key: "Siège conducteur",                 value: "Réglage électrique (hauteur · dossier · longitudinal)" },
      { _key: "s72", key: "Siège passager avant",             value: "Réglage manuel (dossier · longitudinal)" },
      { _key: "s73", key: "Sièges arrière",                   value: "Rabattement proportionnel (split)" },
      { _key: "s74", key: "Accoudoir central",                value: "Avant (avec rangement) + arrière" },
      { _key: "s75", key: "Volant",                           value: "Multifonctions · réglage manuel hauteur + profondeur" },
      { _key: "s76", key: "Climatisation",                    value: "Manuelle monozone" },
      { _key: "s77", key: "Miroirs de courtoisie",            value: "Conducteur + passager" },
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

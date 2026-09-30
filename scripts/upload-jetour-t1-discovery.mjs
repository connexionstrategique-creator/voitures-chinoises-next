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

const PHOTOS_DIR = "/Users/apple/Documents/Dossier photos voitures chinoises/Jetour T1 (2)";
const CAR_ID = "car-jetour-t1-discovery";

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
    brand: "Jetour",
    model: "T1 Discovery 2025",
    price: "14 400 000",
    autohomeId: null,
    colors: [],
    photos,
    tags: null,
    specs: [
      { _key: "s0",  key: "— PARAMÈTRES GÉNÉRAUX —",       value: "" },
      { _key: "s1",  key: "Modèle",                         value: "Jetour T1 Discovery 2025 · 1.5T 7DCT L2 · 5 places" },
      { _key: "s2",  key: "Nom chinois",                    value: "捷途自由者 发现 (Zhiyouzhe Faxian)" },
      { _key: "s3",  key: "Mise sur le marché",             value: "Mars 2025" },
      { _key: "s4",  key: "Carrosserie",                    value: "SUV compact · 5 portes · 5 places · style aventure" },
      { _key: "s5",  key: "Transmission",                   value: "Traction avant (FWD)" },
      { _key: "s6",  key: "Carburant",                      value: "Essence 92" },
      { _key: "s7",  key: "Masse à vide",                   value: "1 656 kg" },
      { _key: "s8",  key: "Réservoir",                      value: "70 L" },
      { _key: "s9",  key: "Volume coffre",                  value: "574 – 1 455 L" },
      { _key: "s10", key: "Garde au sol",                   value: "200 mm" },
      { _key: "s11", key: "Angle d'attaque / de fuite",    value: "28° / 29°" },
      { _key: "s12", key: "Profondeur de gué",              value: "700 mm" },
      { _key: "s13", key: "— MOTORISATION 1.5T 7DCT —",    value: "" },
      { _key: "s14", key: "Moteur",                         value: "SQRG4J15 — 1.5T · 4 cylindres en ligne · DOHC" },
      { _key: "s15", key: "Cylindrée",                      value: "1 499 cm³ (1,5 L)" },
      { _key: "s16", key: "Alésage",                        value: "74,5 mm" },
      { _key: "s17", key: "Alimentation",                   value: "Turbocompressé · injection directe" },
      { _key: "s18", key: "Puissance maximale",             value: "135 kW / 184 ch à 5 500 tr/min" },
      { _key: "s19", key: "Couple maximal",                 value: "290 N·m de 2 000 à 3 500 tr/min" },
      { _key: "s20", key: "Boîte de vitesses",              value: "7DCT — double embrayage humide (7 rapports)" },
      { _key: "s21", key: "Vitesse maximale",               value: "180 km/h" },
      { _key: "s22", key: "Consommation WLTC",              value: "8,15 L/100 km" },
      { _key: "s23", key: "— DIMENSIONS & CHÂSSIS —",       value: "" },
      { _key: "s24", key: "Longueur × Largeur × Hauteur",  value: "4 706 × 1 967 × 1 845 mm" },
      { _key: "s25", key: "Empattement",                    value: "2 810 mm" },
      { _key: "s26", key: "Voie avant / arrière",           value: "1 690 / 1 700 mm" },
      { _key: "s27", key: "Pneumatiques",                   value: "235/65 R18 · Jantes alliage aluminium" },
      { _key: "s28", key: "Suspension avant",               value: "MacPherson — indépendante" },
      { _key: "s29", key: "Suspension arrière",             value: "Multi-bras — indépendante" },
      { _key: "s30", key: "Direction",                      value: "Assistance électrique" },
      { _key: "s31", key: "Freins avant / arrière",         value: "Disques ventilés / Disques" },
      { _key: "s32", key: "Frein de stationnement",         value: "Électronique (EPB)" },
      { _key: "s33", key: "Roue de secours",                value: "Non pleine mesure — dans le coffre" },
      { _key: "s34", key: "— SÉCURITÉ PASSIVE —",           value: "" },
      { _key: "s35", key: "Airbags frontaux",               value: "Conducteur + passager avant" },
      { _key: "s36", key: "Airbags latéraux / rideaux",    value: "Rangée avant + rangée arrière" },
      { _key: "s37", key: "ABS / EBD / ESP",               value: "Oui" },
      { _key: "s38", key: "TPMS",                           value: "Affichage pression pneus" },
      { _key: "s39", key: "ISOFIX",                         value: "Oui" },
      { _key: "s40", key: "— SÉCURITÉ ACTIVE ADAS L2 —",   value: "" },
      { _key: "s41", key: "Niveau d'assistance",            value: "L2 — conduite semi-autonome" },
      { _key: "s42", key: "Caméra 360°",                    value: "Vue panoramique 360° · 5 caméras" },
      { _key: "s43", key: "Radars",                         value: "6 ultrasoniques · 3 radars millimétriques" },
      { _key: "s44", key: "Surveillance angle mort",        value: "540° — détection latérale" },
      { _key: "s45", key: "Maintien de voie",               value: "Alerte + assistance active" },
      { _key: "s46", key: "Régulateur adaptatif",           value: "ACC full speed — régulateur adaptatif toutes vitesses" },
      { _key: "s47", key: "— EXTÉRIEUR & ÉCLAIRAGE —",      value: "" },
      { _key: "s48", key: "Phares avant / DRL",             value: "Full LED · matrix adaptatif · feux de jour LED" },
      { _key: "s49", key: "Correction assiette",            value: "Automatique (correcteur de portée)" },
      { _key: "s50", key: "Antibrouillard",                 value: "LED" },
      { _key: "s51", key: "Toit",                           value: "Toit panoramique — ouverture électrique" },
      { _key: "s52", key: "Éclairage ambiance",             value: "64 couleurs — ambiance intérieure" },
      { _key: "s53", key: "Rétroviseurs",                   value: "Réglage électrique · rabattement auto (verrouillage) · chauffage" },
      { _key: "s54", key: "Essuie-glaces",                  value: "Détection de pluie" },
      { _key: "s55", key: "Accès / démarrage",              value: "Accès sans clé · démarrage bouton · Bluetooth key · carte NFC" },
      { _key: "s56", key: "Hayon électrique",               value: "Oui — kick sensor" },
      { _key: "s57", key: "— COCKPIT & CONNECTIVITÉ —",     value: "" },
      { _key: "s58", key: "Instrumentation",                value: "10,25\" — LCD full digital" },
      { _key: "s59", key: "Écran central",                  value: "15,6\" — tactile" },
      { _key: "s60", key: "Processeur",                     value: "Qualcomm Snapdragon 8155" },
      { _key: "s61", key: "Compatibilité",                  value: "Apple CarPlay · Huawei HiCar" },
      { _key: "s62", key: "IA vocale",                      value: "«Hello, Xiao Jie» — reconnaissance vocale" },
      { _key: "s63", key: "Réseau",                         value: "4G intégré" },
      { _key: "s64", key: "Navigation",                     value: "Oui — intégrée" },
      { _key: "s65", key: "Interfaces USB",                 value: "2× USB Type-C avant · 2× USB Type-C arrière" },
      { _key: "s66", key: "Chargement sans-fil",            value: "Oui — 50W · rangée avant" },
      { _key: "s67", key: "Prise 220V",                     value: "220V / 230V" },
      { _key: "s68", key: "Audio",                          value: "8 haut-parleurs" },
      { _key: "s69", key: "— SIÈGES & HABITACLE —",         value: "" },
      { _key: "s70", key: "Configuration",                  value: "5 places" },
      { _key: "s71", key: "Revêtement",                     value: "Simili-cuir" },
      { _key: "s72", key: "Siège conducteur",               value: "Réglage électrique · mémoire de position" },
      { _key: "s73", key: "Siège passager avant",           value: "Réglage électrique · appuie-jambes · mémoire de position" },
      { _key: "s74", key: "Sièges avant",                   value: "Ventilation + chauffage" },
      { _key: "s75", key: "Sièges arrière",                 value: "Dossier inclinable · rabattement proportionnel" },
      { _key: "s76", key: "Accoudoir",                      value: "Rangée avant + rangée arrière" },
      { _key: "s77", key: "Climatisation",                  value: "Automatique · filtre 2,5 microns" },
      { _key: "s78", key: "Commutation de vitesses",        value: "Électronique" },
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

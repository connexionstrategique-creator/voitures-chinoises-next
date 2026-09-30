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

const PHOTOS_DIR = "/Users/apple/Documents/Dossier photos voitures chinoises/Tiggo 8 Pro 2025";
const CAR_ID = "car-chery-tiggo-8-pro-phev-2025";

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
    brand: "Chery",
    model: "Tiggo 8 Pro PHEV 2025 — 1.5T 100 km · Édition Champion",
    price: "13 500 000",
    autohomeId: null,
    colors: [],
    photos,
    tags: null,
    specs: [
      { _key: "s0",  key: "— PARAMÈTRES GÉNÉRAUX —",          value: "" },
      { _key: "s1",  key: "Modèle",                            value: "Chery Tiggo 8 Pro New Energy 2025 · 1.5T 100 km · Édition Champion · Finition Prestige" },
      { _key: "s2",  key: "Fabricant",                         value: "Chery Automobile (奇瑞汽车)" },
      { _key: "s3",  key: "Finition",                          value: "Édition Champion (冠军版) · Prestige (尊贵型)" },
      { _key: "s4",  key: "Mise sur le marché",                value: "Novembre 2024" },
      { _key: "s5",  key: "Carrosserie",                       value: "SUV intermédiaire · 5 portes · 5 / 7 places" },
      { _key: "s6",  key: "Type de motorisation",              value: "PHEV — Hybride rechargeable" },
      { _key: "s7",  key: "Transmission",                      value: "Traction avant (FWD)" },
      { _key: "s8",  key: "Autonomie électrique CLTC",         value: "100 km" },
      { _key: "s9",  key: "Vitesse maximale",                  value: "180 km/h" },
      { _key: "s10", key: "Consommation WLTC intégrée",        value: "1,7 L/100 km" },
      { _key: "s11", key: "Consommation électrique",           value: "16,9 kWh / 100 km" },
      { _key: "s12", key: "Poids à vide",                      value: "1 789 kg" },
      { _key: "s13", key: "PTAC",                              value: "2 362 kg" },
      { _key: "s14", key: "Réservoir",                         value: "60 L" },
      { _key: "s15", key: "Volume coffre",                     value: "889 L — sièges rabattus : 1 930 L" },
      { _key: "s16", key: "Garantie",                          value: "Kilométrage illimité à vie (premier propriétaire, hors cas exonération)" },
      { _key: "s17", key: "— MOTEUR THERMIQUE 1.5T —",         value: "" },
      { _key: "s18", key: "Moteur",                            value: "SQRE4T15C — 1.5L · 4 cylindres · DOHC · turbocompressé" },
      { _key: "s19", key: "Cylindrée",                         value: "1 498 cm³ (1,5 L)" },
      { _key: "s20", key: "Alimentation",                      value: "Injection multipoint (MPI) — turbocompresseur" },
      { _key: "s21", key: "Distribution",                      value: "DOHC · 4 soupapes par cylindre" },
      { _key: "s22", key: "Matériau culasse / bloc",           value: "Alliage d'aluminium / Fonte grise" },
      { _key: "s23", key: "Puissance thermique",               value: "115 kW / 156 ch à 5 500 tr/min" },
      { _key: "s24", key: "Puissance nette thermique",         value: "108 kW" },
      { _key: "s25", key: "Couple thermique",                  value: "230 N·m à 1 750 – 4 000 tr/min" },
      { _key: "s26", key: "Carburant",                         value: "Essence 92" },
      { _key: "s27", key: "— MOTEUR ÉLECTRIQUE & PHEV —",      value: "" },
      { _key: "s28", key: "Moteur électrique",                 value: "112ABD/112ABE — synchrone à aimant permanent — moteur avant" },
      { _key: "s29", key: "Puissance moteur électrique",       value: "125 kW / 170 ch" },
      { _key: "s30", key: "Couple moteur électrique",          value: "315 N·m" },
      { _key: "s31", key: "Puissance système total",           value: "240 kW" },
      { _key: "s32", key: "Couple système total",              value: "545 N·m" },
      { _key: "s33", key: "Boîte de vitesses",                 value: "DHT 3 rapports — transmission hybride dédiée" },
      { _key: "s34", key: "— BATTERIE & RECHARGE —",           value: "" },
      { _key: "s35", key: "Autonomie électrique CLTC",         value: "100 km" },
      { _key: "s36", key: "Recharge rapide DC",                value: "Jusqu'à 80% en ~25 minutes (0,42 h)" },
      { _key: "s37", key: "— DIMENSIONS & CHÂSSIS —",          value: "" },
      { _key: "s38", key: "Longueur × Largeur × Hauteur",     value: "4 745 × 1 860 × 1 747 mm" },
      { _key: "s39", key: "Empattement",                       value: "2 710 mm" },
      { _key: "s40", key: "Suspension avant",                  value: "MacPherson — indépendante" },
      { _key: "s41", key: "Suspension arrière",                value: "Multi-bras — indépendante" },
      { _key: "s42", key: "Direction",                         value: "Assistance électrique (EPS)" },
      { _key: "s43", key: "Freins avant / arrière",            value: "Disques ventilés / Disques" },
      { _key: "s44", key: "Frein de stationnement",            value: "Électronique (EPB)" },
      { _key: "s45", key: "Pneumatiques",                      value: "235/55 R18 · Jantes alliage aluminium" },
      { _key: "s46", key: "— SÉCURITÉ PASSIVE —",              value: "" },
      { _key: "s47", key: "Airbags frontaux",                  value: "Conducteur + passager avant" },
      { _key: "s48", key: "Airbags latéraux",                  value: "Avant + arrière" },
      { _key: "s49", key: "Airbags rideaux",                   value: "Avant + arrière" },
      { _key: "s50", key: "ABS / ESC / TCS",                  value: "Oui" },
      { _key: "s51", key: "TPMS",                              value: "Surveillance pression pneus — affichage numérique" },
      { _key: "s52", key: "Rappel ceintures",                  value: "Rangée avant" },
      { _key: "s53", key: "Modes de conduite",                 value: "Économique · Standard / Confort · Sport · Récupération au freinage (électronique)" },
      { _key: "s54", key: "— AIDE À LA CONDUITE L2 —",         value: "" },
      { _key: "s55", key: "Niveau ADAS",                       value: "L2 — conduite assistée" },
      { _key: "s56", key: "Régulateur adaptatif",              value: "ACC pleine vitesse — toutes vitesses" },
      { _key: "s57", key: "Vue panoramique",                   value: "360° + 540° — 5 caméras périmétrique + 1 caméra habitacle" },
      { _key: "s58", key: "Caméra frontale",                   value: "Monoculaire — détection voie et obstacles" },
      { _key: "s59", key: "Radars ultrasoniques",              value: "8 capteurs" },
      { _key: "s60", key: "Radars millimétriques",             value: "1 — avant longue portée" },
      { _key: "s61", key: "Aide au stationnement",             value: "Avant + arrière" },
      { _key: "s62", key: "— EXTÉRIEUR & ÉCLAIRAGE —",         value: "" },
      { _key: "s63", key: "Toit",                              value: "Panoramique ouvrant" },
      { _key: "s64", key: "Calandre",                          value: "Active — refermable automatiquement" },
      { _key: "s65", key: "Phares avant",                      value: "LED · allumage automatique · réglage hauteur" },
      { _key: "s66", key: "Feux de route",                     value: "LED" },
      { _key: "s67", key: "HUD",                               value: "Affichage tête haute couleur" },
      { _key: "s68", key: "Ambiance intérieure",               value: "Éclairage d'ambiance 64 couleurs" },
      { _key: "s69", key: "Rétroviseurs extérieurs",           value: "Réglage élec. · pliage élec. · chauffants · repli auto au verrouillage" },
      { _key: "s70", key: "Rétroviseur intérieur",             value: "Anti-éblouissement manuel" },
      { _key: "s71", key: "Essuie-glaces",                     value: "Capteur de pluie — avant + arrière" },
      { _key: "s72", key: "Vitres",                            value: "Électriques one-touch — toutes · copilote" },
      { _key: "s73", key: "Accès / démarrage",                 value: "Clé télécommande · accès sans clé · coffre électrique intelligent · démarrage électronique" },
      { _key: "s74", key: "— COCKPIT & CONNECTIVITÉ —",        value: "" },
      { _key: "s75", key: "Instrumentation",                   value: "LCD couleur 12,3\" — plein écran" },
      { _key: "s76", key: "Écran central",                     value: "Tactile LCD 12,3\" couleur" },
      { _key: "s77", key: "Système infotainment",              value: "Lion Male System — processeur Qualcomm Snapdragon 8155" },
      { _key: "s78", key: "Réseau",                            value: "4G intégré" },
      { _key: "s79", key: "Réveil vocal",                      value: "«  Hello, Kiki  »" },
      { _key: "s80", key: "Compatibilité smartphone",          value: "Apple CarPlay · Huawei HiCar" },
      { _key: "s81", key: "Reconnaissance vocale",             value: "Multimédia · navigation · téléphone · climatisation · toit · portes · phares" },
      { _key: "s82", key: "Bluetooth",                         value: "Oui — téléphonie mains libres" },
      { _key: "s83", key: "Navigation",                        value: "GPS intégrée" },
      { _key: "s84", key: "Charge sans fil",                   value: "Oui — rangée avant" },
      { _key: "s85", key: "Interfaces USB",                    value: "2× USB/Type-C avant · 1× USB/Type-C arrière" },
      { _key: "s86", key: "Prise / réfrigérateur",            value: "12V · réfrigérateur coffre" },
      { _key: "s87", key: "Audio",                             value: "8 haut-parleurs SONY" },
      { _key: "s88", key: "Application mobile",                value: "Localisation · diagnostic · charge · climatisation · démarrage · vitres" },
      { _key: "s89", key: "— SIÈGES & HABITACLE —",            value: "" },
      { _key: "s90", key: "Configuration",                     value: "5 à 7 places (disposition 2-3-2 en version 7 places)" },
      { _key: "s91", key: "Revêtement",                        value: "Simili-cuir" },
      { _key: "s92", key: "Siège conducteur",                  value: "Réglage électrique — hauteur (2 dir.) · dossier · longitudinal · mémoire" },
      { _key: "s93", key: "Siège passager avant",              value: "Réglage électrique — dossier · longitudinal" },
      { _key: "s94", key: "Sièges arrière",                    value: "Rabattement proportionnel (split)" },
      { _key: "s95", key: "Accoudoir central AV / AR",         value: "Oui / Oui" },
      { _key: "s96", key: "Climatisation",                     value: "Automatique · filtre PM2,5 · sorties d'air arrière" },
      { _key: "s97", key: "Miroirs de courtoisie",             value: "Conducteur + passager" },
    ],
  };

  console.log(`\nCreating document ${CAR_ID}...`);
  const result = await client.createOrReplace(doc);
  console.log(`✓ Document created: ${result._id}`);
  return result;
}

async function main() {
  if (!process.env.SANITY_TOKEN) { console.error("Missing SANITY_TOKEN"); process.exit(1); }
  const photos = await uploadPhotos();
  await createCarDocument(photos);
  console.log("\nDone!");
}

main().catch(console.error);

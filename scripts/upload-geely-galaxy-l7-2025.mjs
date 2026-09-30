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

const PHOTOS_DIR = "/Users/apple/Documents/Dossier photos voitures chinoises/Geely Galaxy L7 2025";
const CAR_ID = "car-geely-galaxy-l7-2025-em-i";

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
    brand: "Geely",
    model: "Galaxy L7 2025 — EM-i 115 km · Édition Explorer",
    price: "13 000 000",
    autohomeId: null,
    colors: [],
    photos,
    tags: null,
    specs: [
      { _key: "s0",  key: "— PARAMÈTRES GÉNÉRAUX —",          value: "" },
      { _key: "s1",  key: "Modèle",                            value: "Geely Galaxy L7 2025 · EM-i 115 km · Édition Explorer (探索版)" },
      { _key: "s2",  key: "Fabricant",                         value: "Geely Automobile (吉利汽车)" },
      { _key: "s3",  key: "Finition",                          value: "Édition Explorer (探索版)" },
      { _key: "s4",  key: "Mise sur le marché",                value: "Février 2025" },
      { _key: "s5",  key: "Carrosserie",                       value: "SUV compact · 5 portes · 5 places" },
      { _key: "s6",  key: "Type de motorisation",              value: "PHEV — Hybride rechargeable" },
      { _key: "s7",  key: "Transmission",                      value: "Traction avant (FWD)" },
      { _key: "s8",  key: "Autonomie électrique CLTC",         value: "115 km" },
      { _key: "s9",  key: "Vitesse maximale",                  value: "180 km/h" },
      { _key: "s10", key: "Consommation WLTC intégrée",        value: "1,05 L/100 km" },
      { _key: "s11", key: "Poids à vide",                      value: "1 810 kg" },
      { _key: "s12", key: "Réservoir",                         value: "60 L" },
      { _key: "s13", key: "Garantie",                          value: "6 ans ou 150 000 km" },
      { _key: "s14", key: "— MOTEUR THERMIQUE 1.5L —",         value: "" },
      { _key: "s15", key: "Moteur",                            value: "BHE15-BFN — 1.5L · 4 cylindres · DOHC · atmosphérique" },
      { _key: "s16", key: "Cylindrée",                         value: "1 499 cm³ (1,5 L)" },
      { _key: "s17", key: "Alimentation",                      value: "Injection multipoint (MPI) — aspiration naturelle" },
      { _key: "s18", key: "Distribution",                      value: "DOHC · 4 soupapes par cylindre" },
      { _key: "s19", key: "Matériau culasse / bloc",           value: "Alliage d'aluminium / Alliage d'aluminium" },
      { _key: "s20", key: "Puissance thermique",               value: "82 kW / 112 ch" },
      { _key: "s21", key: "Puissance nette thermique",         value: "79 kW" },
      { _key: "s22", key: "Couple thermique",                  value: "136 N·m" },
      { _key: "s23", key: "Carburant",                         value: "Essence 92" },
      { _key: "s24", key: "— MOTEUR ÉLECTRIQUE & PHEV —",      value: "" },
      { _key: "s25", key: "Moteur électrique",                 value: "Synchrone à aimant permanent — moteur frontal unique" },
      { _key: "s26", key: "Puissance totale PHEV",             value: "160 kW / 218 ch" },
      { _key: "s27", key: "Couple total PHEV",                 value: "262 N·m" },
      { _key: "s28", key: "Boîte de vitesses",                 value: "DHT — transmission hybride dédiée 1 rapport" },
      { _key: "s29", key: "— BATTERIE & RECHARGE —",           value: "" },
      { _key: "s30", key: "Autonomie électrique",              value: "115 km" },
      { _key: "s31", key: "Recharge rapide DC",                value: "30 → 80% en 20 minutes (0,33 h)" },
      { _key: "s32", key: "Recharge lente AC",                 value: "2,7 heures (pleine charge)" },
      { _key: "s33", key: "— DIMENSIONS & CHÂSSIS —",          value: "" },
      { _key: "s34", key: "Longueur × Largeur × Hauteur",     value: "4 710 × 1 905 × 1 685 mm" },
      { _key: "s35", key: "Empattement",                       value: "2 785 mm" },
      { _key: "s36", key: "Voie avant / arrière",              value: "1 630 / 1 630 mm" },
      { _key: "s37", key: "Angle d'attaque / de fuite",       value: "18° / 23°" },
      { _key: "s38", key: "Suspension avant",                  value: "MacPherson — indépendante" },
      { _key: "s39", key: "Suspension arrière",                value: "Multi-bras — indépendante" },
      { _key: "s40", key: "Direction",                         value: "Assistance électrique (EPS)" },
      { _key: "s41", key: "Freins avant / arrière",            value: "Disques ventilés / Disques" },
      { _key: "s42", key: "Frein de stationnement",            value: "Électronique (EPB)" },
      { _key: "s43", key: "Pneumatiques",                      value: "235/50 R19 (AV et AR) · Jantes alliage aluminium" },
      { _key: "s44", key: "Roue de secours",                   value: "Kit de réparation pneu" },
      { _key: "s45", key: "— SÉCURITÉ PASSIVE —",              value: "" },
      { _key: "s46", key: "Airbags frontaux",                  value: "Conducteur + passager avant" },
      { _key: "s47", key: "Airbags latéraux",                  value: "Avant + arrière" },
      { _key: "s48", key: "Airbags rideaux",                   value: "Avant + arrière" },
      { _key: "s49", key: "ABS / ESC / TCS",                  value: "Oui" },
      { _key: "s50", key: "TPMS",                              value: "Surveillance pression pneus — affichage numérique" },
      { _key: "s51", key: "ISOFIX",                            value: "Oui" },
      { _key: "s52", key: "Rappel ceintures",                  value: "Rangée avant" },
      { _key: "s53", key: "Aide démarrage en côte (HSA)",     value: "Oui" },
      { _key: "s54", key: "— AIDE À LA CONDUITE L2 —",         value: "" },
      { _key: "s55", key: "Niveau ADAS",                       value: "L2 — conduite assistée" },
      { _key: "s56", key: "Régulateur adaptatif",              value: "ACC pleine vitesse — toutes vitesses" },
      { _key: "s57", key: "Vue panoramique 360°",              value: "Oui — 5 caméras périmétrique" },
      { _key: "s58", key: "Caméra frontale",                   value: "Monoculaire — détection voie et obstacles" },
      { _key: "s59", key: "Radars ultrasoniques",              value: "6 capteurs" },
      { _key: "s60", key: "Radars millimétriques",             value: "Avant — longue portée" },
      { _key: "s61", key: "Aide au stationnement",             value: "Avant + arrière" },
      { _key: "s62", key: "— EXTÉRIEUR & ÉCLAIRAGE —",         value: "" },
      { _key: "s63", key: "Toit",                              value: "Panoramique ouvrant" },
      { _key: "s64", key: "Calandre",                          value: "Active — refermable automatiquement" },
      { _key: "s65", key: "Phares avant",                      value: "LED · allumage automatique · réglage hauteur" },
      { _key: "s66", key: "Feux de route",                     value: "LED" },
      { _key: "s67", key: "HUD",                               value: "AR-HUD — affichage tête haute augmenté · LCD couleur" },
      { _key: "s68", key: "Rétroviseurs extérieurs",           value: "Réglage élec. · pliage élec. · chauffants · repli auto verrouillage" },
      { _key: "s69", key: "Rétroviseur intérieur",             value: "Anti-éblouissement manuel" },
      { _key: "s70", key: "Essuie-glaces",                     value: "Détection de pluie — avant · arrière" },
      { _key: "s71", key: "Vitres",                            value: "Électriques one-touch — toutes les vitres" },
      { _key: "s72", key: "Accès / démarrage",                 value: "Clé Bluetooth · clé télécommande · accès sans clé avant · coffre électrique intelligent" },
      { _key: "s73", key: "— COCKPIT & CONNECTIVITÉ —",        value: "" },
      { _key: "s74", key: "Instrumentation",                   value: "LCD couleur 10,25\" — plein écran" },
      { _key: "s75", key: "Écran central",                     value: "Tactile LCD 13,2\" couleur" },
      { _key: "s76", key: "Écran passager",                    value: "16,2\" — divertissement copilote" },
      { _key: "s77", key: "Système infotainment",              value: "Flyme Auto (Meizu) — processeur Qualcomm Snapdragon 8155" },
      { _key: "s78", key: "Réseau",                            value: "4G / 5G intégré" },
      { _key: "s79", key: "Réveil vocal",                      value: "«  Hello, Voie Lactée  » — double zone d'activation" },
      { _key: "s80", key: "Compatibilité smartphone",          value: "Apple CarPlay · Flyme Link · Huawei HiCar" },
      { _key: "s81", key: "Reconnaissance vocale",             value: "Multimédia · navigation · téléphone · climatisation · vitres · toit · démarrage" },
      { _key: "s82", key: "Bluetooth",                         value: "Oui — téléphonie mains libres" },
      { _key: "s83", key: "Navigation",                        value: "GPS intégrée — cartographie embarquée" },
      { _key: "s84", key: "Charge sans fil",                   value: "50W — rangée avant" },
      { _key: "s85", key: "Interfaces USB",                    value: "2× USB/Type-C avant · 2× USB/Type-C arrière" },
      { _key: "s86", key: "Prise / réfrigérateur",            value: "12V · réfrigérateur coffre" },
      { _key: "s87", key: "Audio",                             value: "8 haut-parleurs" },
      { _key: "s88", key: "Application mobile",                value: "Localisation · état véhicule · démarrage · climatisation · contrôle vitres" },
      { _key: "s89", key: "— SIÈGES & HABITACLE —",            value: "" },
      { _key: "s90", key: "Configuration",                     value: "5 places" },
      { _key: "s91", key: "Revêtement",                        value: "Simili-cuir" },
      { _key: "s92", key: "Siège conducteur",                  value: "Réglage électrique — hauteur (2 dir.) · dossier · longitudinal · mémoire" },
      { _key: "s93", key: "Siège passager avant",              value: "Réglage électrique — dossier · longitudinal" },
      { _key: "s94", key: "Ventilation sièges avant",          value: "Oui — conducteur + passager" },
      { _key: "s95", key: "Chauffage sièges avant",            value: "Oui — conducteur + passager" },
      { _key: "s96", key: "Sièges arrière",                    value: "Rabattement proportionnel (split)" },
      { _key: "s97", key: "Accoudoir central AV / AR",         value: "Oui / Oui" },
      { _key: "s98", key: "Climatisation",                     value: "Automatique double zone · filtre PM2,5 · sorties d'air arrière" },
      { _key: "s99", key: "Miroirs de courtoisie",             value: "Conducteur + passager" },
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

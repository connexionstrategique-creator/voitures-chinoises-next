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

const PHOTOS_DIR = "/Users/apple/Documents/Dossier photos voitures chinoises/TIGGO 9 2026 2.0T";
const CAR_ID = "car-chery-tiggo-9-2026-9x-2t";

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
    model: "Tiggo 9 2026 — 2.0T 254 ch · Édition Pilote · 7 Places",
    price: "16 000 000",
    autohomeId: "ext/74952",
    autohomeInteriorId: "pano/74952",
    colors: [],
    photos,
    tags: null,
    specs: [
      { _key: "s0",  key: "— PARAMÈTRES GÉNÉRAUX —",          value: "" },
      { _key: "s1",  key: "Modèle",                            value: "Chery Tiggo 9 2026 · 9X · 2.0T 254 ch AT8 · Édition Pilote · 7 Places" },
      { _key: "s2",  key: "Fabricant",                         value: "Chery Automobile" },
      { _key: "s3",  key: "Finition",                          value: "Édition Pilote" },
      { _key: "s4",  key: "Mise sur le marché",                value: "Septembre 2025" },
      { _key: "s5",  key: "Carrosserie",                       value: "SUV intermédiaire · 5 portes · 7 places (2+3+2)" },
      { _key: "s6",  key: "Énergie",                           value: "Essence 92" },
      { _key: "s7",  key: "Transmission",                      value: "Traction avant (FWD)" },
      { _key: "s8",  key: "Vitesse maximale",                  value: "200 km/h" },
      { _key: "s9",  key: "Consommation WLTC",                 value: "7,8 L/100 km" },
      { _key: "s10", key: "Poids à vide",                      value: "1 725 kg" },
      { _key: "s11", key: "PTAC",                              value: "2 351 kg" },
      { _key: "s12", key: "Réservoir",                         value: "65 L" },
      { _key: "s13", key: "Volume coffre",                     value: "2 065 L — toutes rangées rabattues" },
      { _key: "s14", key: "Garantie",                          value: "Kilométrage illimité à vie (premier propriétaire, hors cas exonération)" },
      { _key: "s15", key: "— MOTEUR 2.0T —",                   value: "" },
      { _key: "s16", key: "Moteur",                            value: "SQRF4J20 — 2.0L · 4 cylindres · DOHC · turbocompressé" },
      { _key: "s17", key: "Cylindrée",                         value: "1 998 cm³ (2,0 L)" },
      { _key: "s18", key: "Alimentation",                      value: "Turbocompresseur · injection directe" },
      { _key: "s19", key: "Distribution",                      value: "DOHC · 4 soupapes par cylindre" },
      { _key: "s20", key: "Matériau culasse / bloc",           value: "Alliage d'aluminium / Alliage d'aluminium" },
      { _key: "s21", key: "Puissance maximale",                value: "187 kW / 254 ch à 5 500 tr/min" },
      { _key: "s22", key: "Puissance nette",                   value: "180 kW" },
      { _key: "s23", key: "Couple maximal",                    value: "390 N·m à 1 750 – 4 000 tr/min" },
      { _key: "s24", key: "Carburant",                         value: "Essence 92" },
      { _key: "s25", key: "Norme dépollution",                 value: "National VI (équivalent Euro 6)" },
      { _key: "s26", key: "— BOÎTE DE VITESSES —",             value: "" },
      { _key: "s27", key: "Boîte de vitesses",                 value: "8 vitesses — boîte automatique (AT)" },
      { _key: "s28", key: "Sélection des rapports",            value: "Sélecteur électronique — levier escamotable" },
      { _key: "s29", key: "Modes de conduite",                 value: "Économique · Standard / Confort · Sport" },
      { _key: "s30", key: "Récupération d'énergie",            value: "Système de récupération au freinage" },
      { _key: "s31", key: "— DIMENSIONS & CHÂSSIS —",          value: "" },
      { _key: "s32", key: "Longueur × Largeur × Hauteur",     value: "4 817 × 1 930 × 1 729 mm" },
      { _key: "s33", key: "Empattement",                       value: "2 770 mm" },
      { _key: "s34", key: "Voie avant / arrière",              value: "1 638 / 1 638 mm" },
      { _key: "s35", key: "Angle d'attaque / de fuite",       value: "18° / 19°" },
      { _key: "s36", key: "Suspension avant",                  value: "MacPherson — indépendante" },
      { _key: "s37", key: "Suspension arrière",                value: "Multi-bras — indépendante" },
      { _key: "s38", key: "Direction",                         value: "Assistance électrique (EPS)" },
      { _key: "s39", key: "Freins avant / arrière",            value: "Disques ventilés / Disques" },
      { _key: "s40", key: "Frein de stationnement",            value: "Électronique (EPB)" },
      { _key: "s41", key: "Pneumatiques",                      value: "245/50 R20 (AV et AR) · Jantes alliage aluminium" },
      { _key: "s42", key: "Roue de secours",                   value: "Galette (format réduit) — rangée dans le coffre" },
      { _key: "s43", key: "— SÉCURITÉ PASSIVE —",              value: "" },
      { _key: "s44", key: "Airbags frontaux",                  value: "Conducteur + passager avant" },
      { _key: "s45", key: "Airbags latéraux",                  value: "Avant + arrière" },
      { _key: "s46", key: "Airbags rideaux",                   value: "Avant + arrière" },
      { _key: "s47", key: "ABS / ESC / TCS",                  value: "Oui" },
      { _key: "s48", key: "TPMS",                              value: "Surveillance pression pneus — affichage numérique" },
      { _key: "s49", key: "ISOFIX",                            value: "Oui" },
      { _key: "s50", key: "Rappel ceintures",                  value: "Rangée avant" },
      { _key: "s51", key: "Auto Hold",                         value: "Oui" },
      { _key: "s52", key: "— AIDE À LA CONDUITE L2 —",         value: "" },
      { _key: "s53", key: "Niveau ADAS",                       value: "L2 — conduite assistée" },
      { _key: "s54", key: "Régulateur adaptatif",              value: "ACC pleine vitesse — toutes vitesses" },
      { _key: "s55", key: "Vue panoramique 360°",              value: "Oui — 5 caméras périmétrique + châssis transparent 540°" },
      { _key: "s56", key: "Caméra frontale",                   value: "Monoculaire — détection voie et obstacles" },
      { _key: "s57", key: "Radars ultrasoniques",              value: "12 capteurs" },
      { _key: "s58", key: "Aide au stationnement",             value: "Avant + arrière — stationnement automatique" },
      { _key: "s59", key: "— EXTÉRIEUR & ÉCLAIRAGE —",         value: "" },
      { _key: "s60", key: "Toit",                              value: "Panoramique ouvrant" },
      { _key: "s61", key: "Calandre",                          value: "Active — refermable automatiquement" },
      { _key: "s62", key: "Phares avant",                      value: "LED · allumage automatique · réglage hauteur" },
      { _key: "s63", key: "Feux de route",                     value: "LED" },
      { _key: "s64", key: "Rétroviseurs extérieurs",           value: "Réglage élec. · pliage élec. · chauffants · mémoire · repli auto verrouillage · retournement recul" },
      { _key: "s65", key: "Rétroviseur intérieur",             value: "Anti-éblouissement manuel" },
      { _key: "s66", key: "Essuie-glaces",                     value: "Détection de pluie — avant + arrière" },
      { _key: "s67", key: "Vitres",                            value: "Électriques one-touch — toutes les vitres" },
      { _key: "s68", key: "Accès / démarrage",                 value: "Clé Bluetooth · clé télécommande · accès sans clé avant · coffre électrique · démarrage électronique" },
      { _key: "s69", key: "— COCKPIT & CONNECTIVITÉ —",        value: "" },
      { _key: "s70", key: "Instrumentation",                   value: "LCD couleur 10,25\" — plein écran" },
      { _key: "s71", key: "Écran central",                     value: "Tactile LCD 15,6\" · résolution 2,5K" },
      { _key: "s72", key: "Système infotainment",              value: "Smart Internet — processeur Qualcomm 8255" },
      { _key: "s73", key: "Réseau",                            value: "4G intégré" },
      { _key: "s74", key: "Réveil vocal",                      value: "« Hello, Kiki »" },
      { _key: "s75", key: "Compatibilité smartphone",          value: "Apple CarPlay · Carlink · Huawei HiCar" },
      { _key: "s76", key: "Reconnaissance vocale",             value: "Multimédia · navigation · téléphone · climatisation · toit · portes · démarrage · diagnostic" },
      { _key: "s77", key: "Double zone d'activation",          value: "Oui" },
      { _key: "s78", key: "Bluetooth",                         value: "Oui — téléphonie mains libres" },
      { _key: "s79", key: "Navigation",                        value: "GPS intégrée — cartographie embarquée" },
      { _key: "s80", key: "Charge sans fil",                   value: "50W — rangée avant" },
      { _key: "s81", key: "Interfaces USB",                    value: "2× USB/Type-C avant · 2× USB/Type-C arrière" },
      { _key: "s82", key: "Prise / réfrigérateur",            value: "12V · réfrigérateur coffre" },
      { _key: "s83", key: "Audio",                             value: "14 haut-parleurs" },
      { _key: "s84", key: "Ambiance intérieure",               value: "Éclairage d'ambiance multicolore" },
      { _key: "s85", key: "Application mobile",                value: "Localisation · diagnostic · charge · démarrage · climatisation" },
      { _key: "s86", key: "— SIÈGES & HABITACLE —",            value: "" },
      { _key: "s87", key: "Configuration",                     value: "7 places — disposition 2+3+2" },
      { _key: "s88", key: "Revêtement",                        value: "Simili-cuir" },
      { _key: "s89", key: "Siège conducteur",                  value: "Réglage électrique — lombaires (4 dir.) · hauteur (2 dir.) · dossier · longitudinal · mémoire" },
      { _key: "s90", key: "Siège passager avant",              value: "Réglage électrique — repose-jambes · dossier · longitudinal" },
      { _key: "s91", key: "Siège conducteur — fonctions",      value: "Haut-parleur appui-tête · massage · ventilation · chauffage · mémoire position" },
      { _key: "s92", key: "Siège passager avant — fonctions",  value: "Ventilation · chauffage" },
      { _key: "s93", key: "Sièges 2e rangée",                  value: "Réglage électrique — dossier · longitudinal · rabattement proportionnel (split)" },
      { _key: "s94", key: "Sièges 3e rangée",                  value: "Réglage électrique — dossier · rabattement électrique" },
      { _key: "s95", key: "Accoudoir central AV / AR",         value: "Oui / Oui" },
      { _key: "s96", key: "Climatisation",                     value: "Automatique double zone · filtre PM2,5 · sorties d'air 2e et 3e rangée" },
      { _key: "s97", key: "Rétroviseur intérieur",             value: "Anti-éblouissement manuel" },
      { _key: "s98", key: "Miroirs de courtoisie",             value: "Conducteur + passager" },
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

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

const PHOTOS_DIR = "/Users/apple/Documents/Dossier photos voitures chinoises/Kaiyi X7 PRO 5 PLACES high original";
const CAR_ID = "car-kaiyi-x7-pro-5-places-2026";

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
    model: "X7 Pro — 5 Places 2026 · Édition Hautes Terres",
    price: "10 000 000",
    autohomeId: "ext/68615",
    autohomeInteriorId: "pano/75534",
    colors: [],
    photos,
    tags: null,
    specs: [
      { _key: "s0",  key: "— PARAMÈTRES GÉNÉRAUX —",         value: "" },
      { _key: "s1",  key: "Modèle",                           value: "Kaiyi Kunlun 2026 · 1.5T 6DCT · Édition Hautes Terres · 5 Places" },
      { _key: "s2",  key: "Fabricant",                        value: "Kaiyi Automobile — joint-venture SAIC × Chery" },
      { _key: "s3",  key: "Finition",                         value: "Édition Hautes Terres (高原版) — configuration complète 5 places" },
      { _key: "s4",  key: "Mise sur le marché",               value: "Novembre 2025" },
      { _key: "s5",  key: "Carrosserie",                      value: "SUV intermédiaire · 5 portes · 5 places" },
      { _key: "s6",  key: "Énergie",                          value: "Essence SP92 · Norme nationale VI (équiv. Euro 6)" },
      { _key: "s7",  key: "Transmission",                     value: "Traction avant (FWD)" },
      { _key: "s8",  key: "Vitesse maximale",                 value: "176 km/h" },
      { _key: "s9",  key: "Consommation WLTC",                value: "8,4 L/100 km" },
      { _key: "s10", key: "Poids à vide",                     value: "1 600 kg" },
      { _key: "s11", key: "PTAC",                             value: "2 155 kg" },
      { _key: "s12", key: "Réservoir",                        value: "60 L" },
      { _key: "s13", key: "Volume coffre",                    value: "518 L — sièges rabattus : 1 566 L" },
      { _key: "s14", key: "Coefficient de traînée (Cx)",      value: "0,328" },
      { _key: "s15", key: "— MOTORISATION 1.5T TURBO —",     value: "" },
      { _key: "s16", key: "Moteur",                           value: "SQRE4T15C — 1.5L · 4 cylindres en ligne · DOHC · turbocompressé" },
      { _key: "s17", key: "Cylindrée",                        value: "1 498 cm³ (1,5 L)" },
      { _key: "s18", key: "Alimentation",                     value: "Turbocompresseur · injection multipoint (MPI)" },
      { _key: "s19", key: "Distribution",                     value: "DOHC · 4 soupapes par cylindre" },
      { _key: "s20", key: "Matériau culasse / bloc",          value: "Alliage d'aluminium / Fonte grise" },
      { _key: "s21", key: "Puissance maximale",               value: "115 kW / 156 ch à 5 500 tr/min" },
      { _key: "s22", key: "Puissance nette",                  value: "108 kW" },
      { _key: "s23", key: "Couple maximal",                   value: "230 N·m à 1 750 – 4 000 tr/min" },
      { _key: "s24", key: "Carburant",                        value: "Essence 92" },
      { _key: "s25", key: "Norme dépollution",                value: "National VI (équivalent Euro 6)" },
      { _key: "s26", key: "— BOÎTE DE VITESSES —",            value: "" },
      { _key: "s27", key: "Boîte de vitesses",                value: "6 vitesses DCT humide — double embrayage" },
      { _key: "s28", key: "Sélection des rapports",           value: "Sélecteur électronique" },
      { _key: "s29", key: "Récupération d'énergie",           value: "Système de récupération au freinage" },
      { _key: "s30", key: "Modes de conduite",                value: "Économique · Standard / Confort · Sport" },
      { _key: "s31", key: "— DIMENSIONS & CHÂSSIS —",         value: "" },
      { _key: "s32", key: "Longueur × Largeur × Hauteur",    value: "4 738 × 1 968 × 1 708 mm" },
      { _key: "s33", key: "Empattement",                      value: "2 820 mm" },
      { _key: "s34", key: "Voie avant / arrière",             value: "1 652 / 1 652 mm" },
      { _key: "s35", key: "Angle d'attaque / de fuite",      value: "19° / 21°" },
      { _key: "s36", key: "Structure caisse",                 value: "Autoporteuse — carrosserie monocoque" },
      { _key: "s37", key: "Suspension avant",                 value: "MacPherson — indépendante" },
      { _key: "s38", key: "Suspension arrière",               value: "Multi-bras — indépendante" },
      { _key: "s39", key: "Direction",                        value: "Assistance électrique (EPS)" },
      { _key: "s40", key: "Freins avant / arrière",           value: "Disques ventilés / Disques" },
      { _key: "s41", key: "Frein de stationnement",           value: "Électronique (EPB)" },
      { _key: "s42", key: "Pneumatiques",                     value: "245/60 R18 · Jantes alliage aluminium" },
      { _key: "s43", key: "Roue de secours",                  value: "Galette (format réduit)" },
      { _key: "s44", key: "— SÉCURITÉ PASSIVE —",             value: "" },
      { _key: "s45", key: "Airbags frontaux",                 value: "Conducteur + passager avant" },
      { _key: "s46", key: "Airbags latéraux",                 value: "Avant + arrière" },
      { _key: "s47", key: "Airbags rideaux",                  value: "Avant + arrière" },
      { _key: "s48", key: "ABS / EBD / EBA",                 value: "Oui" },
      { _key: "s49", key: "ESP / TCS",                        value: "Oui — contrôle de stabilité et de traction" },
      { _key: "s50", key: "TPMS",                             value: "Surveillance pression pneus — affichage numérique" },
      { _key: "s51", key: "ISOFIX",                           value: "Oui — interface siège enfant" },
      { _key: "s52", key: "Rappel ceinture",                  value: "Conducteur" },
      { _key: "s53", key: "Aide démarrage en côte (HSA)",    value: "Oui" },
      { _key: "s54", key: "— AIDE À LA CONDUITE —",           value: "" },
      { _key: "s55", key: "Régulateur de vitesse",            value: "Vitesse constante (non adaptatif)" },
      { _key: "s56", key: "Caméra de recul",                  value: "Oui — vue arrière avec lignes de guidage dynamiques" },
      { _key: "s57", key: "Radars ultrasoniques",             value: "4 capteurs — couverture arrière" },
      { _key: "s58", key: "Vue panoramique 360°",             value: "Non" },
      { _key: "s59", key: "Aide au stationnement",            value: "Oui" },
      { _key: "s60", key: "Frein automatique d'urgence",      value: "Oui" },
      { _key: "s61", key: "Auto Hold",                        value: "Oui" },
      { _key: "s62", key: "— EXTÉRIEUR & ÉCLAIRAGE —",        value: "" },
      { _key: "s63", key: "Phares avant",                     value: "LED · allumage automatique · hauteur ajustable" },
      { _key: "s64", key: "Feux de route",                    value: "LED" },
      { _key: "s65", key: "Feux antibrouillard",              value: "LED — avant + arrière" },
      { _key: "s66", key: "Rétroviseurs extérieurs",          value: "Réglage électrique · rétractables électriquement" },
      { _key: "s67", key: "Essuie-glaces",                    value: "Avant + arrière — capteur de pluie" },
      { _key: "s68", key: "Vitres",                           value: "Électriques one-touch avant · copilote" },
      { _key: "s69", key: "Accès / démarrage",                value: "Clé télécommande · accès sans clé · démarrage électronique" },
      { _key: "s70", key: "— COCKPIT & CONNECTIVITÉ —",       value: "" },
      { _key: "s71", key: "Instrumentation",                  value: "LCD 7\" couleur — plein écran" },
      { _key: "s72", key: "Écran central",                    value: "Tactile LCD 12,8\" couleur — flottant" },
      { _key: "s73", key: "Compatibilité smartphone",         value: "Apple CarPlay · Huawei HiCar" },
      { _key: "s74", key: "Navigation",                       value: "GPS intégrée — cartographie embarquée" },
      { _key: "s75", key: "Reconnaissance vocale",            value: "Oui — multimédia · navigation · téléphone" },
      { _key: "s76", key: "Bluetooth",                        value: "Oui — téléphonie mains libres" },
      { _key: "s77", key: "Interfaces USB",                   value: "2× USB avant · 2× USB arrière" },
      { _key: "s78", key: "Prise 12V",                        value: "Oui — habitacle + coffre" },
      { _key: "s79", key: "Audio",                            value: "6 haut-parleurs" },
      { _key: "s80", key: "Volant",                           value: "Cuir multifonctions · réglage manuel H+V" },
      { _key: "s81", key: "— SIÈGES & HABITACLE —",           value: "" },
      { _key: "s82", key: "Configuration",                    value: "5 places" },
      { _key: "s83", key: "Revêtement",                       value: "Simili-cuir" },
      { _key: "s84", key: "Siège conducteur",                 value: "Réglage électrique — hauteur · dossier · longitudinal" },
      { _key: "s85", key: "Siège passager avant",             value: "Réglage manuel — dossier · longitudinal" },
      { _key: "s86", key: "Sièges arrière",                   value: "Rabattement proportionnel (split)" },
      { _key: "s87", key: "Accoudoir central AV / AR",        value: "Oui / Oui" },
      { _key: "s88", key: "Climatisation",                    value: "Manuelle · filtre PM2,5 · sorties d'air arrière" },
      { _key: "s89", key: "Miroirs de courtoisie",            value: "Conducteur + passager" },
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

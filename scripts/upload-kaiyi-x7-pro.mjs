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

const PHOTOS_DIR = "/Users/apple/Documents/Dossier photos voitures chinoises/KAIYI X7 PRO";
const CAR_ID = "car-kaiyi-x7-pro-7-places-2026";

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
    model: "X7 Pro — 7 Places 2026",
    price: "10 800 000",
    autohomeId: null,
    colors: [],
    photos,
    tags: null,
    specs: [
      { _key: "s0",  key: "— PARAMÈTRES GÉNÉRAUX —",         value: "" },
      { _key: "s1",  key: "Modèle",                           value: "Kaiyi Kunlun 2026 · 1.5T 6DCT · Édition Sommets · 7 Places" },
      { _key: "s2",  key: "Fabricant",                        value: "Kaiyi Automobile — joint-venture SAIC × Chery" },
      { _key: "s3",  key: "Finition",                         value: "Édition Sommets (巅峰版)" },
      { _key: "s4",  key: "Mise sur le marché",               value: "Novembre 2025" },
      { _key: "s5",  key: "Carrosserie",                      value: "SUV · 5 portes · 7 places · 3 rangées" },
      { _key: "s6",  key: "Configuration sièges",             value: "2-3-2 — deux sièges individuels R1 · banquette 3 places R2 · banquette 2 places R3" },
      { _key: "s7",  key: "Énergie",                          value: "Essence SP92 · Norme nationale VI (équiv. Euro 6)" },
      { _key: "s8",  key: "Transmission",                     value: "Traction avant (FWD)" },
      { _key: "s9",  key: "Poids à vide",                     value: "1 630 kg" },
      { _key: "s10", key: "PTAC",                             value: "2 155 kg" },
      { _key: "s11", key: "Réservoir",                        value: "60 L" },
      { _key: "s12", key: "Volume coffre",                    value: "518 L — R2+R3 rabattus : 1 566 L" },
      { _key: "s13", key: "Vitesse maximale",                 value: "176 km/h" },
      { _key: "s14", key: "Coefficient de traînée (Cx)",      value: "0,328" },
      { _key: "s15", key: "Garantie",                         value: "Kilométrage illimité à vie — premier propriétaire" },
      { _key: "s16", key: "— MOTORISATION 1.5T 6DCT —",      value: "" },
      { _key: "s17", key: "Moteur",                           value: "SQRE4T15C — 1.5T · 4 cylindres en ligne · DOHC · turbocompressé" },
      { _key: "s18", key: "Cylindrée",                        value: "1 498 cm³ (1,5 L)" },
      { _key: "s19", key: "Distribution",                     value: "DOHC · 4 soupapes par cylindre" },
      { _key: "s20", key: "Alimentation",                     value: "Injection multipoint (MPI) turbocompressée" },
      { _key: "s21", key: "Matériau culasse / bloc",          value: "Alliage d'aluminium / Fonte grise" },
      { _key: "s22", key: "Puissance maximale",               value: "115 kW / 156 ch à 5 500 tr/min" },
      { _key: "s23", key: "Puissance nette",                  value: "108 kW" },
      { _key: "s24", key: "Couple maximal",                   value: "230 N·m de 1 750 à 4 000 tr/min" },
      { _key: "s25", key: "Boîte de vitesses",                value: "6DCT — double embrayage humide (6 rapports)" },
      { _key: "s26", key: "Modes de conduite",                value: "Économique · Standard / Confort · Sport" },
      { _key: "s27", key: "Récupération d'énergie",           value: "Freinage régénératif" },
      { _key: "s28", key: "— DIMENSIONS & CHÂSSIS —",         value: "" },
      { _key: "s29", key: "Longueur × Largeur × Hauteur",    value: "4 738 × 1 968 × 1 708 mm" },
      { _key: "s30", key: "Empattement",                      value: "2 820 mm" },
      { _key: "s31", key: "Voie avant / arrière",             value: "1 652 / 1 652 mm" },
      { _key: "s32", key: "Angle d'attaque / de fuite",      value: "19° / 20°" },
      { _key: "s33", key: "Suspension avant",                 value: "MacPherson — indépendante" },
      { _key: "s34", key: "Suspension arrière",               value: "Multi-bras — indépendante" },
      { _key: "s35", key: "Direction",                        value: "Assistance électrique (EPS)" },
      { _key: "s36", key: "Freins avant / arrière",           value: "Disques ventilés / Disques" },
      { _key: "s37", key: "Frein de stationnement",           value: "Électronique (EPB)" },
      { _key: "s38", key: "Pneumatiques",                     value: "245/60 R18 · Jantes alliage aluminium" },
      { _key: "s39", key: "Roue de secours",                  value: "Format réduit" },
      { _key: "s40", key: "— SÉCURITÉ PASSIVE —",             value: "" },
      { _key: "s41", key: "Airbags frontaux",                 value: "Conducteur + passager avant" },
      { _key: "s42", key: "Airbags latéraux",                 value: "Avant + arrière" },
      { _key: "s43", key: "Airbags rideaux",                  value: "Avant + arrière" },
      { _key: "s44", key: "ABS / EBD / EBA",                 value: "Oui" },
      { _key: "s45", key: "ESP / TCS",                        value: "Oui" },
      { _key: "s46", key: "TPMS",                             value: "Surveillance pression pneus — affichage numérique" },
      { _key: "s47", key: "ISOFIX",                           value: "Oui — interface siège enfant" },
      { _key: "s48", key: "Rappel ceinture / Prétensionneurs", value: "Oui · conducteur" },
      { _key: "s49", key: "Aide démarrage en côte (HSA)",    value: "Oui" },
      { _key: "s50", key: "— AIDE À LA CONDUITE —",           value: "" },
      { _key: "s51", key: "Régulateur de vitesse",            value: "Vitesse constante" },
      { _key: "s52", key: "Vue panoramique 360°",             value: "Oui — 4 caméras" },
      { _key: "s53", key: "Radars ultrasoniques",             value: "4 capteurs — avant + arrière" },
      { _key: "s54", key: "Radars millimétriques",            value: "Non" },
      { _key: "s55", key: "Frein de stationnement auto",      value: "Oui" },
      { _key: "s56", key: "— EXTÉRIEUR & ÉCLAIRAGE —",        value: "" },
      { _key: "s57", key: "Phares avant",                     value: "LED · allumage automatique" },
      { _key: "s58", key: "Feux de route",                    value: "LED" },
      { _key: "s59", key: "Feux arrière",                     value: "LED" },
      { _key: "s60", key: "Toit",                             value: "Toit panoramique ouvrant" },
      { _key: "s61", key: "Rétroviseurs extérieurs",          value: "Réglage électrique · rabattement électrique · chauffants · fermeture auto au verrouillage" },
      { _key: "s62", key: "Rétroviseur intérieur",            value: "Anti-éblouissement manuel" },
      { _key: "s63", key: "Essuie-glaces",                    value: "Détection de pluie automatique — avant" },
      { _key: "s64", key: "Accès / démarrage",                value: "Accès sans clé · démarrage électronique · clé télécommande" },
      { _key: "s65", key: "Vitres",                           value: "Électriques one-touch — toutes · copilote" },
      { _key: "s66", key: "— COCKPIT & CONNECTIVITÉ —",       value: "" },
      { _key: "s67", key: "Instrumentation",                  value: "LCD couleur 12,3\"" },
      { _key: "s68", key: "Écran central",                    value: "Tactile 12,8\" couleur" },
      { _key: "s69", key: "Réseau",                           value: "4G / 5G intégré" },
      { _key: "s70", key: "Compatibilité smartphone",         value: "Baidu CarLife · Huawei HiCar" },
      { _key: "s71", key: "Assistant vocal",                  value: "Double zone d'activation" },
      { _key: "s72", key: "Reconnaissance vocale",            value: "Multimédia · navigation · téléphone · climatisation · vitres · toit" },
      { _key: "s73", key: "Bluetooth",                        value: "Oui — téléphonie mains libres" },
      { _key: "s74", key: "Navigation",                       value: "GPS intégrée" },
      { _key: "s75", key: "Charge sans fil",                  value: "Non" },
      { _key: "s76", key: "Interfaces USB",                   value: "2× USB/Type-C avant · 2× USB/Type-C arrière" },
      { _key: "s77", key: "Prise",                            value: "12V" },
      { _key: "s78", key: "Audio",                            value: "6 haut-parleurs" },
      { _key: "s79", key: "Application mobile",               value: "Démarrage à distance · localisation · diagnostic" },
      { _key: "s80", key: "— SIÈGES & HABITACLE — 7 PLACES", value: "" },
      { _key: "s81", key: "Configuration",                    value: "7 places — 2-3-2" },
      { _key: "s82", key: "Rangée 1",                         value: "2 sièges individuels — conducteur + passager" },
      { _key: "s83", key: "Rangée 2",                         value: "Banquette 3 places — accoudoir central" },
      { _key: "s84", key: "Rangée 3",                         value: "Banquette 2 places" },
      { _key: "s85", key: "Revêtement",                       value: "Simili-cuir" },
      { _key: "s86", key: "Siège conducteur",                 value: "Réglage électrique — hauteur · dossier · longitudinal" },
      { _key: "s87", key: "Siège passager avant",             value: "Réglage électrique — dossier · longitudinal" },
      { _key: "s88", key: "Chauffage sièges avant",           value: "Oui — conducteur + passager" },
      { _key: "s89", key: "Ventilation sièges avant",         value: "Oui — conducteur + passager" },
      { _key: "s90", key: "Sièges arrière",                   value: "Rabattement proportionnel (split)" },
      { _key: "s91", key: "Accoudoir central AV / AR",        value: "Oui / Oui" },
      { _key: "s92", key: "Volant",                           value: "Cuir multifonctions · réglage manuel hauteur + profondeur" },
      { _key: "s93", key: "Climatisation",                    value: "Manuelle monozone · filtre air habitacle" },
      { _key: "s94", key: "Miroirs de courtoisie",            value: "Conducteur + passager" },
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

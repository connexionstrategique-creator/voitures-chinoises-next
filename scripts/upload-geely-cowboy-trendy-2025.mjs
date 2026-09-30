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

const PHOTOS_DIR = "/Users/apple/Documents/Dossier photos voitures chinoises/Geely Cowbow Trendy Edition 2025";
const CAR_ID = "car-geely-cowboy-trendy-2025";

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
    model: "Cowboy 2025 — 1.5TD · Édition Trendy",
    price: "10 750 000",
    autohomeId: "ext/70391",
    autohomeInteriorId: "pano/70391",
    colors: [],
    photos,
    tags: null,
    specs: [
      { _key: "s0",  key: "— PARAMÈTRES GÉNÉRAUX —",          value: "" },
      { _key: "s1",  key: "Modèle",                            value: "Geely Cowboy 2025 · 1.5TD 133 ch DCT 7 · Édition Trendy · 5 Places" },
      { _key: "s2",  key: "Fabricant",                         value: "Geely Automobile" },
      { _key: "s3",  key: "Finition",                          value: "Édition Trendy" },
      { _key: "s4",  key: "Mise sur le marché",                value: "Novembre 2024" },
      { _key: "s5",  key: "Carrosserie",                       value: "Mini SUV · 5 portes · 5 places" },
      { _key: "s6",  key: "Énergie",                           value: "Essence 92" },
      { _key: "s7",  key: "Transmission",                      value: "Traction avant (FWD)" },
      { _key: "s8",  key: "Vitesse maximale",                  value: "200 km/h" },
      { _key: "s9",  key: "Consommation WLTC",                 value: "6,97 L/100 km" },
      { _key: "s10", key: "Poids à vide",                      value: "1 415 kg" },
      { _key: "s11", key: "PTAC",                              value: "1 815 kg" },
      { _key: "s12", key: "Réservoir",                         value: "51 L" },
      { _key: "s13", key: "— MOTORISATION 1.5TD —",            value: "" },
      { _key: "s14", key: "Moteur",                            value: "BHE15-EFZ — 1.5L · 4 cylindres · DOHC · turbocompressé" },
      { _key: "s15", key: "Cylindrée",                         value: "1 499 cm³ (1,5 L)" },
      { _key: "s16", key: "Alimentation",                      value: "Turbocompresseur · injection directe" },
      { _key: "s17", key: "Distribution",                      value: "DOHC · DVVT · 4 soupapes par cylindre" },
      { _key: "s18", key: "Matériau culasse / bloc",           value: "Alliage d'aluminium / Alliage d'aluminium" },
      { _key: "s19", key: "Puissance maximale",                value: "133 kW / 181 ch à 5 500 tr/min" },
      { _key: "s20", key: "Puissance nette",                   value: "128 kW" },
      { _key: "s21", key: "Couple maximal",                    value: "290 N·m à 2 000 – 3 500 tr/min" },
      { _key: "s22", key: "Carburant",                         value: "Essence 92" },
      { _key: "s23", key: "Norme dépollution",                 value: "National VI (équivalent Euro 6)" },
      { _key: "s24", key: "— BOÎTE DE VITESSES —",             value: "" },
      { _key: "s25", key: "Boîte de vitesses",                 value: "7 vitesses DCT humide — double embrayage" },
      { _key: "s26", key: "Modes de conduite",                 value: "Économique · Standard / Confort · Sport" },
      { _key: "s27", key: "Récupération d'énergie",            value: "Système de récupération au freinage" },
      { _key: "s28", key: "— DIMENSIONS & CHÂSSIS —",          value: "" },
      { _key: "s29", key: "Longueur × Largeur × Hauteur",     value: "4 442 × 1 860 × 1 770 mm" },
      { _key: "s30", key: "Empattement",                       value: "2 640 mm" },
      { _key: "s31", key: "Voie avant / arrière",              value: "1 565 / 1 590 mm" },
      { _key: "s32", key: "Angle d'attaque / de fuite",       value: "19° / 24°" },
      { _key: "s33", key: "Structure",                         value: "SUV monocoque autoporteuse · 5 portes" },
      { _key: "s34", key: "Suspension avant",                  value: "MacPherson — indépendante" },
      { _key: "s35", key: "Suspension arrière",                value: "Multi-bras — indépendante" },
      { _key: "s36", key: "Direction",                         value: "Assistance électrique (EPS)" },
      { _key: "s37", key: "Freins avant / arrière",            value: "Disques ventilés / Disques" },
      { _key: "s38", key: "Frein de stationnement",            value: "Électronique (EPB)" },
      { _key: "s39", key: "Pneumatiques",                      value: "215/55 R18 (AV et AR) · Jantes alliage aluminium" },
      { _key: "s40", key: "Roue de secours",                   value: "Galette (format réduit) — rangée dans le coffre" },
      { _key: "s41", key: "— SÉCURITÉ PASSIVE —",              value: "" },
      { _key: "s42", key: "Airbags frontaux",                  value: "Conducteur + passager avant" },
      { _key: "s43", key: "Airbags latéraux",                  value: "Rangée avant" },
      { _key: "s44", key: "Airbags rideaux",                   value: "Avant + arrière" },
      { _key: "s45", key: "ABS / ESC / TCS",                  value: "Oui" },
      { _key: "s46", key: "TPMS",                              value: "Surveillance pression pneus — affichage numérique" },
      { _key: "s47", key: "ISOFIX",                            value: "Oui" },
      { _key: "s48", key: "Rappel ceintures",                  value: "Rangée avant" },
      { _key: "s49", key: "Auto Hold",                         value: "Oui" },
      { _key: "s50", key: "Aide démarrage en côte (HSA)",     value: "Oui" },
      { _key: "s51", key: "— AIDE À LA CONDUITE —",            value: "" },
      { _key: "s52", key: "Régulateur de vitesse",             value: "Vitesse constante (non adaptatif)" },
      { _key: "s53", key: "Vue panoramique 360°",              value: "Oui — 4 caméras périmétrique + châssis transparent 540°" },
      { _key: "s54", key: "Caméra frontale",                   value: "Monoculaire — détection voie et obstacles" },
      { _key: "s55", key: "Radars ultrasoniques",              value: "4 capteurs" },
      { _key: "s56", key: "Aide au stationnement",             value: "Avant + arrière" },
      { _key: "s57", key: "— EXTÉRIEUR & ÉCLAIRAGE —",         value: "" },
      { _key: "s58", key: "Toit",                              value: "Panoramique fixe (non ouvrant)" },
      { _key: "s59", key: "Calandre",                          value: "Active — refermable automatiquement" },
      { _key: "s60", key: "Phares avant",                      value: "LED · allumage automatique" },
      { _key: "s61", key: "Feux de route",                     value: "LED" },
      { _key: "s62", key: "HUD",                               value: "AR-HUD — affichage tête haute augmenté · couleur" },
      { _key: "s63", key: "Rétroviseurs extérieurs",           value: "Réglage élec. · pliage élec. · chauffants · repli auto verrouillage" },
      { _key: "s64", key: "Rétroviseur intérieur",             value: "Anti-éblouissement manuel" },
      { _key: "s65", key: "Essuie-glaces",                     value: "Détection de pluie — avant + arrière" },
      { _key: "s66", key: "Vitres",                            value: "Électriques one-touch — toutes les vitres" },
      { _key: "s67", key: "Accès / démarrage",                 value: "Clé Bluetooth · clé télécommande · accès sans clé · démarrage électronique" },
      { _key: "s68", key: "Coffre",                            value: "Motorisé — ouverture électrique" },
      { _key: "s69", key: "— COCKPIT & CONNECTIVITÉ —",        value: "" },
      { _key: "s70", key: "Instrumentation",                   value: "LCD couleur 8,8\" — plein écran" },
      { _key: "s71", key: "Écran central",                     value: "Tactile LCD 14,6\" couleur · 1 920 × 1 080 px" },
      { _key: "s72", key: "Système infotainment",              value: "Flyme Auto" },
      { _key: "s73", key: "Réseau",                            value: "4G intégré" },
      { _key: "s74", key: "Réveil vocal",                      value: "« Hello, Geely »" },
      { _key: "s75", key: "Compatibilité smartphone",          value: "Carlink · Flyme Link · Huawei HiCar" },
      { _key: "s76", key: "Reconnaissance vocale",             value: "Multimédia · navigation · téléphone · climatisation · vitres" },
      { _key: "s77", key: "Double zone d'activation",          value: "Oui" },
      { _key: "s78", key: "Bluetooth",                         value: "Oui — téléphonie mains libres" },
      { _key: "s79", key: "Navigation",                        value: "GPS intégrée — cartographie embarquée" },
      { _key: "s80", key: "Interfaces USB",                    value: "1× USB/Type-C avant · 2× USB/Type-C arrière" },
      { _key: "s81", key: "Prise / réfrigérateur",            value: "12V · réfrigérateur coffre" },
      { _key: "s82", key: "Audio",                             value: "6 haut-parleurs" },
      { _key: "s83", key: "Ambiance intérieure",               value: "Éclairage d'ambiance 256 couleurs" },
      { _key: "s84", key: "— SIÈGES & HABITACLE —",            value: "" },
      { _key: "s85", key: "Configuration",                     value: "5 places" },
      { _key: "s86", key: "Revêtement",                        value: "Mixte cuir / tissu" },
      { _key: "s87", key: "Siège conducteur",                  value: "Réglage électrique — hauteur (2 dir.) · dossier · longitudinal" },
      { _key: "s88", key: "Siège passager avant",              value: "Réglage électrique — dossier · longitudinal" },
      { _key: "s89", key: "Ventilation sièges avant",          value: "Oui — conducteur + passager" },
      { _key: "s90", key: "Chauffage sièges avant",            value: "Oui — conducteur + passager" },
      { _key: "s91", key: "Sièges arrière",                    value: "Rabattement proportionnel (split)" },
      { _key: "s92", key: "Accoudoir central AV",              value: "Oui" },
      { _key: "s93", key: "Climatisation",                     value: "Automatique · filtre PM2,5 · sorties d'air arrière" },
      { _key: "s94", key: "Volant",                            value: "Cuir multifonctions · réglage manuel H+V" },
      { _key: "s95", key: "Miroirs de courtoisie",             value: "Conducteur + passager" },
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

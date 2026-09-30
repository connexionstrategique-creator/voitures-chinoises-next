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

const BASE_DIR = "/Users/apple/Documents/Dossier photos voitures chinoises/SWM Sawy Tiger ";
const COLOR_DIRS = ["Noir", "Blanc "];
const CAR_ID = "car-swm-sawy-tiger-2025";

async function uploadPhotos() {
  const assets = [];
  for (const colorDir of COLOR_DIRS) {
    const dir = join(BASE_DIR, colorDir);
    const files = readdirSync(dir)
      .filter(f => [".jpg", ".jpeg", ".png"].includes(extname(f).toLowerCase()))
      .sort();
    console.log(`Uploading ${files.length} photos from ${colorDir}...`);
    for (const file of files) {
      const path = join(dir, file);
      console.log(`  Uploading ${colorDir}/${file}...`);
      const asset = await client.assets.upload("image", createReadStream(path), { filename: `${colorDir}-${file}` });
      assets.push({ _type: "image", _key: asset._id.slice(-8), asset: { _type: "reference", _ref: asset._id } });
      console.log(`  ✓ ${colorDir}/${file} → ${asset._id}`);
    }
  }
  return assets;
}

async function createCarDocument(photos) {
  const doc = {
    _id: CAR_ID,
    _type: "car",
    brand: "SWM",
    model: "Sawy Tiger 2025 — 1.5L 116 ch · Édition Luxe · 7 Places",
    price: "7 600 000",
    autohomeId: null,
    autohomeInteriorId: null,
    colors: [],
    photos,
    tags: null,
    specs: [
      { _key: "s0",  key: "— PARAMÈTRES GÉNÉRAUX —",          value: "" },
      { _key: "s1",  key: "Modèle",                            value: "SWM Sawy Tiger 2025 · 1.5L 116 ch MT5 · Édition Luxe · 7 Places" },
      { _key: "s2",  key: "Fabricant",                         value: "SWM Motors" },
      { _key: "s3",  key: "Finition",                          value: "Édition Luxe" },
      { _key: "s4",  key: "Mise sur le marché",                value: "Août 2025" },
      { _key: "s5",  key: "Carrosserie",                       value: "SUV intermédiaire · 5 portes · 7 places (2+3+2)" },
      { _key: "s6",  key: "Énergie",                           value: "Essence 92" },
      { _key: "s7",  key: "Transmission",                      value: "Traction avant (FWD)" },
      { _key: "s8",  key: "Vitesse maximale",                  value: "165 km/h" },
      { _key: "s9",  key: "Consommation WLTC",                 value: "6,9 L/100 km" },
      { _key: "s10", key: "Poids à vide",                      value: "1 400 kg" },
      { _key: "s11", key: "PTAC",                              value: "1 925 kg" },
      { _key: "s12", key: "Garde au sol",                      value: "195 mm" },
      { _key: "s13", key: "— MOTORISATION 1.5L —",             value: "" },
      { _key: "s14", key: "Moteur",                            value: "SWD15 — 1.5L · 4 cylindres · DOHC · aspiration naturelle" },
      { _key: "s15", key: "Cylindrée",                         value: "1 498 cm³ (1,5 L)" },
      { _key: "s16", key: "Alimentation",                      value: "Injection multipoint (MPI) — aspiration naturelle" },
      { _key: "s17", key: "Distribution",                      value: "DOHC · 4 soupapes par cylindre" },
      { _key: "s18", key: "Matériau culasse / bloc",           value: "Alliage d'aluminium / Fonte grise" },
      { _key: "s19", key: "Puissance maximale",                value: "85 kW / 116 ch" },
      { _key: "s20", key: "Puissance nette",                   value: "81 kW" },
      { _key: "s21", key: "Couple maximal",                    value: "155 N·m" },
      { _key: "s22", key: "Carburant",                         value: "Essence 92" },
      { _key: "s23", key: "Norme dépollution",                 value: "National VI (équivalent Euro 6)" },
      { _key: "s24", key: "— BOÎTE DE VITESSES —",             value: "" },
      { _key: "s25", key: "Boîte de vitesses",                 value: "5 vitesses — boîte manuelle (MT)" },
      { _key: "s26", key: "Sélection des rapports",            value: "Levier manuel" },
      { _key: "s27", key: "— DIMENSIONS & CHÂSSIS —",          value: "" },
      { _key: "s28", key: "Longueur × Largeur × Hauteur",     value: "4 605 × 1 815 × 1 810 mm" },
      { _key: "s29", key: "Empattement",                       value: "2 780 mm" },
      { _key: "s30", key: "Voie avant / arrière",              value: "1 526 / 1 530 mm" },
      { _key: "s31", key: "Angle d'attaque / de fuite",       value: "24° / 26°" },
      { _key: "s32", key: "Suspension avant",                  value: "MacPherson — indépendante" },
      { _key: "s33", key: "Suspension arrière",                value: "Cinq bras — ressorts hélicoïdaux" },
      { _key: "s34", key: "Direction",                         value: "Assistance électrique (EPS)" },
      { _key: "s35", key: "Freins avant / arrière",            value: "Disques ventilés / Tambours" },
      { _key: "s36", key: "Frein de stationnement",            value: "Frein à main (mécanique)" },
      { _key: "s37", key: "Pneumatiques",                      value: "215/60 R17 (AV et AR) · Jantes acier" },
      { _key: "s38", key: "Roue de secours",                   value: "Galette (format réduit)" },
      { _key: "s39", key: "— SÉCURITÉ PASSIVE —",              value: "" },
      { _key: "s40", key: "Airbags frontaux",                  value: "Conducteur + passager avant" },
      { _key: "s41", key: "Airbags latéraux",                  value: "Avant + arrière" },
      { _key: "s42", key: "Airbags rideaux",                   value: "Avant + arrière" },
      { _key: "s43", key: "ABS / EBD",                         value: "Oui" },
      { _key: "s44", key: "TPMS",                              value: "Surveillance pression pneus — affichage numérique" },
      { _key: "s45", key: "ISOFIX",                            value: "Oui" },
      { _key: "s46", key: "Rappel ceintures",                  value: "Conducteur" },
      { _key: "s47", key: "— AIDE À LA CONDUITE —",            value: "" },
      { _key: "s48", key: "Caméra de recul",                   value: "Oui — 1 caméra" },
      { _key: "s49", key: "Aide au stationnement",             value: "Avant + arrière — radars ultrasoniques" },
      { _key: "s50", key: "— EXTÉRIEUR & ÉCLAIRAGE —",         value: "" },
      { _key: "s51", key: "Phares avant",                      value: "Halogène · allumage automatique" },
      { _key: "s52", key: "Feux de route",                     value: "Halogène" },
      { _key: "s53", key: "Rétroviseurs extérieurs",           value: "Réglage élec. · chauffants" },
      { _key: "s54", key: "Rétroviseur intérieur",             value: "Anti-éblouissement manuel" },
      { _key: "s55", key: "Essuie-glaces",                     value: "Avant + arrière" },
      { _key: "s56", key: "Vitres",                            value: "Électriques — conducteur one-touch" },
      { _key: "s57", key: "Accès / démarrage",                 value: "Clé télécommande · démarrage électronique" },
      { _key: "s58", key: "— COCKPIT & CONNECTIVITÉ —",        value: "" },
      { _key: "s59", key: "Instrumentation",                   value: "LCD monochrome 3,5\"" },
      { _key: "s60", key: "Écran central",                     value: "Tactile LCD 7\" couleur" },
      { _key: "s61", key: "Système infotainment",              value: "Smart Internet — multimédia connecté" },
      { _key: "s62", key: "Bluetooth",                         value: "Oui — téléphonie mains libres" },
      { _key: "s63", key: "Interfaces USB",                    value: "1× USB/Type-C avant" },
      { _key: "s64", key: "Prise 12V",                         value: "Oui" },
      { _key: "s65", key: "Audio",                             value: "2 haut-parleurs" },
      { _key: "s66", key: "Volant",                            value: "Cuir multifonctions · réglage manuel H+V" },
      { _key: "s67", key: "— SIÈGES & HABITACLE —",            value: "" },
      { _key: "s68", key: "Configuration",                     value: "7 places — disposition 2+3+2" },
      { _key: "s69", key: "Revêtement",                        value: "Simili-cuir" },
      { _key: "s70", key: "Siège conducteur",                  value: "Réglage manuel — hauteur (2 dir.) · dossier · longitudinal" },
      { _key: "s71", key: "Siège passager avant",              value: "Réglage manuel — dossier · longitudinal" },
      { _key: "s72", key: "Sièges arrière",                    value: "Rabattement proportionnel (split) — rangées 2 et 3" },
      { _key: "s73", key: "Accoudoir central AV / AR",         value: "Oui / Oui" },
      { _key: "s74", key: "Climatisation",                     value: "Manuelle · filtre · sorties d'air arrière" },
      { _key: "s75", key: "Miroirs de courtoisie",             value: "Conducteur + passager" },
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

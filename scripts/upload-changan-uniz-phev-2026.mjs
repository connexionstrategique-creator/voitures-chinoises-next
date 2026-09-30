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

const PHOTOS_DIR = "/Users/apple/Documents/Dossier photos voitures chinoises/Changan UNIZ HYBRID 2026";
const CAR_ID = "car-changan-uni-z-phev-2026-vaisseau";

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
    brand: "Changan",
    model: "UNI-Z PHEV 2026 — 130 km · Édition Vaisseau",
    price: "11 700 000",
    autohomeId: null,
    colors: [],
    photos,
    tags: null,
    specs: [
      { _key: "s0",  key: "— PARAMÈTRES GÉNÉRAUX —",           value: "" },
      { _key: "s1",  key: "Modèle",                             value: "Changan UNI-Z PHEV 2026 · Nouvelle Baleine Bleue 130 km · Édition Vaisseau" },
      { _key: "s2",  key: "Fabricant",                          value: "Changan Automobile (长安汽车)" },
      { _key: "s3",  key: "Finition",                           value: "Édition Vaisseau (飞船版) — finition supérieure" },
      { _key: "s4",  key: "Motorisation",                       value: "Groupe Nouvelle Baleine Bleue (新蓝鲸) — PHEV hybride rechargeable" },
      { _key: "s5",  key: "Mise sur le marché",                 value: "Février 2026" },
      { _key: "s6",  key: "Carrosserie",                        value: "SUV compact · 5 portes · 5 places" },
      { _key: "s7",  key: "Type de motorisation",               value: "PHEV — Hybride rechargeable" },
      { _key: "s8",  key: "Autonomie électrique CLTC",          value: "130 km" },
      { _key: "s9",  key: "Transmission",                       value: "Traction avant (FWD)" },
      { _key: "s10", key: "Poids à vide",                       value: "1 710 kg" },
      { _key: "s11", key: "PTAC",                               value: "2 140 kg" },
      { _key: "s12", key: "Réservoir",                          value: "51 L" },
      { _key: "s13", key: "Volume coffre",                      value: "638 L — sièges rabattus : 1 425 L" },
      { _key: "s14", key: "Vitesse maximale",                   value: "180 km/h" },
      { _key: "s15", key: "0 – 100 km/h",                      value: "7,4 s" },
      { _key: "s16", key: "Consommation PHEV WLTC",             value: "1,3 L/100 km · intégrée : 3,06 L/100 km" },
      { _key: "s17", key: "— MOTEUR THERMIQUE 1.5L —",         value: "" },
      { _key: "s18", key: "Moteur thermique",                   value: "JL469Q1 — 1.5L · 4 cylindres · DOHC · atmosphérique" },
      { _key: "s19", key: "Cylindrée",                          value: "1 497 cm³ (1,5 L)" },
      { _key: "s20", key: "Distribution",                       value: "DOHC · 4 soupapes par cylindre" },
      { _key: "s21", key: "Alimentation",                       value: "Injection multipoint (MPI) — aspiration naturelle" },
      { _key: "s22", key: "Matériau bloc / culasse",            value: "Alliage d'aluminium / Alliage d'aluminium" },
      { _key: "s23", key: "Puissance thermique",                value: "72 kW / 98 ch à 5 600 tr/min" },
      { _key: "s24", key: "Puissance nette thermique",          value: "70 kW" },
      { _key: "s25", key: "Couple thermique",                   value: "125 N·m à 3 000 tr/min" },
      { _key: "s26", key: "Carburant",                          value: "Essence 92" },
      { _key: "s27", key: "— MOTEUR ÉLECTRIQUE & PHEV —",      value: "" },
      { _key: "s28", key: "Moteur électrique",                  value: "ATDM68 — synchrone à aimant permanent" },
      { _key: "s29", key: "Puissance totale PHEV",              value: "160 kW / 218 ch" },
      { _key: "s30", key: "Couple total PHEV",                  value: "251 N·m" },
      { _key: "s31", key: "Boîte de vitesses",                  value: "E-CVT — transmission électronique à variation continue" },
      { _key: "s32", key: "Consommation électrique",            value: "15,2 kWh / 100 km" },
      { _key: "s33", key: "Modes de conduite",                  value: "Économique · Standard / Confort · Sport · Personnalisé" },
      { _key: "s34", key: "Récupération d'énergie",             value: "Freinage régénératif — sélecteur électronique" },
      { _key: "s35", key: "— BATTERIE & RECHARGE —",            value: "" },
      { _key: "s36", key: "Autonomie CLTC",                     value: "130 km" },
      { _key: "s37", key: "Recharge DC rapide",                 value: "30 → 80% en 15 minutes" },
      { _key: "s38", key: "Modes de recharge",                  value: "Charge rapide DC · charge lente AC" },
      { _key: "s39", key: "— DIMENSIONS & CHÂSSIS —",           value: "" },
      { _key: "s40", key: "Longueur × Largeur × Hauteur",      value: "4 730 × 1 890 × 1 680 mm" },
      { _key: "s41", key: "Empattement",                        value: "2 795 mm" },
      { _key: "s42", key: "Voie avant / arrière",               value: "1 603 / 1 603 mm" },
      { _key: "s43", key: "Garde au sol",                       value: "183 mm" },
      { _key: "s44", key: "Angle d'attaque / de fuite",        value: "19° / 25°" },
      { _key: "s45", key: "Suspension avant",                   value: "MacPherson — indépendante" },
      { _key: "s46", key: "Suspension arrière",                 value: "Multi-bras — indépendante" },
      { _key: "s47", key: "Direction",                          value: "Assistance électrique (EPS)" },
      { _key: "s48", key: "Freins avant / arrière",             value: "Disques ventilés / Disques" },
      { _key: "s49", key: "Frein de stationnement",             value: "Électronique (EPB)" },
      { _key: "s50", key: "Pneumatiques",                       value: "245/50 R20 · Jantes alliage aluminium" },
      { _key: "s51", key: "— SÉCURITÉ PASSIVE —",               value: "" },
      { _key: "s52", key: "Airbags frontaux",                   value: "Conducteur + passager avant" },
      { _key: "s53", key: "Airbags latéraux",                   value: "Avant + arrière (rangées 1 et 2)" },
      { _key: "s54", key: "Airbags rideaux",                    value: "Avant + arrière" },
      { _key: "s55", key: "ABS / EBD / EBA",                   value: "Oui" },
      { _key: "s56", key: "ESP / TCS",                          value: "Oui" },
      { _key: "s57", key: "TPMS",                               value: "Surveillance pression pneus — affichage numérique" },
      { _key: "s58", key: "ISOFIX",                             value: "Oui — interface siège enfant" },
      { _key: "s59", key: "Rappel ceintures / Prétensionneurs", value: "Oui · rangée avant" },
      { _key: "s60", key: "Aide démarrage en côte (HSA)",      value: "Oui" },
      { _key: "s61", key: "— AIDE À LA CONDUITE TIANSHU L2 —", value: "" },
      { _key: "s62", key: "Système ADAS",                       value: "Tianshu Intelligent Driving — Niveau L2" },
      { _key: "s63", key: "Régulateur adaptatif",               value: "ACC pleine vitesse — toutes vitesses" },
      { _key: "s64", key: "Vue panoramique 360°",               value: "Oui — caméras périmétrique" },
      { _key: "s65", key: "Caméra frontale",                    value: "Monoculaire — détection voie · obstacle · signalisation" },
      { _key: "s66", key: "Radars ultrasoniques",               value: "12 capteurs — couverture tous angles" },
      { _key: "s67", key: "Radars millimétriques",              value: "5 — détection longue portée" },
      { _key: "s68", key: "Reconnaissance signaux",             value: "Oui — panneaux et signalisation routière" },
      { _key: "s69", key: "Frein de stationnement auto",        value: "Oui" },
      { _key: "s70", key: "— EXTÉRIEUR & ÉCLAIRAGE —",          value: "" },
      { _key: "s71", key: "Phares avant",                       value: "LED · allumage automatique" },
      { _key: "s72", key: "Feux de route",                      value: "LED" },
      { _key: "s73", key: "Feux arrière",                       value: "LED" },
      { _key: "s74", key: "Toit",                               value: "Toit panoramique ouvrant" },
      { _key: "s75", key: "Calandre",                           value: "Active — fermeture automatique" },
      { _key: "s76", key: "Rétroviseurs extérieurs",            value: "Réglage élec. · pliage élec. · mémoire · chauffants · retournement auto · fermeture auto verrouillage" },
      { _key: "s77", key: "Rétroviseur intérieur",              value: "Anti-éblouissement manuel" },
      { _key: "s78", key: "Essuie-glaces",                      value: "Détection de pluie automatique · essuie-glace arrière" },
      { _key: "s79", key: "Accès / démarrage",                  value: "Clé Bluetooth · accès sans clé (conducteur) · démarrage électronique · clé télécommande" },
      { _key: "s80", key: "Vitres",                             value: "Électriques one-touch — toutes · copilote" },
      { _key: "s81", key: "— COCKPIT & CONNECTIVITÉ —",         value: "" },
      { _key: "s82", key: "Instrumentation",                    value: "LCD couleur 10,25\"" },
      { _key: "s83", key: "Écran central",                      value: "Tactile LCD couleur" },
      { _key: "s84", key: "Réseau",                             value: "4G intégré" },
      { _key: "s85", key: "Compatibilité smartphone",           value: "Apple CarPlay · Bluetooth · projection écran" },
      { _key: "s86", key: "Reconnaissance vocale",              value: "Multimédia · navigation · téléphone · climatisation · vitres · toit" },
      { _key: "s87", key: "Bluetooth",                          value: "Oui — téléphonie mains libres" },
      { _key: "s88", key: "Navigation",                         value: "GPS intégrée" },
      { _key: "s89", key: "Charge sans fil",                    value: "50W — rangée avant" },
      { _key: "s90", key: "Interfaces USB",                     value: "1× USB avant · 2× USB arrière" },
      { _key: "s91", key: "Prise / réfrigérateur",             value: "12V · réfrigérateur coffre" },
      { _key: "s92", key: "Audio",                              value: "6 haut-parleurs + 1 tweeter" },
      { _key: "s93", key: "Application mobile",                 value: "Climatisation à distance · localisation · diagnostic · démarrage" },
      { _key: "s94", key: "— SIÈGES & HABITACLE —",             value: "" },
      { _key: "s95", key: "Configuration",                      value: "5 places" },
      { _key: "s96", key: "Revêtement",                         value: "Simili-cuir" },
      { _key: "s97", key: "Siège conducteur",                   value: "Réglage électrique — hauteur · dossier · longitudinal · mémoire de position" },
      { _key: "s98", key: "Siège passager avant",               value: "Réglage électrique — dossier · longitudinal" },
      { _key: "s99", key: "Massage sièges",                     value: "Conducteur uniquement" },
      { _key: "s100", key: "Ventilation sièges avant",          value: "Oui — conducteur + passager" },
      { _key: "s101", key: "Chauffage sièges avant",            value: "Oui — conducteur + passager" },
      { _key: "s102", key: "Mémoire conducteur",                value: "Siège + rétroviseurs" },
      { _key: "s103", key: "Sièges arrière",                    value: "Rabattement proportionnel (split)" },
      { _key: "s104", key: "Accoudoir central AV / AR",         value: "Oui / Oui" },
      { _key: "s105", key: "Volant",                            value: "Cuir multifonctions · réglage manuel hauteur + profondeur" },
      { _key: "s106", key: "Climatisation",                     value: "Automatique · filtre PM2,5 · sorties d'air arrière" },
      { _key: "s107", key: "Miroirs de courtoisie",             value: "Conducteur + passager" },
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

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

async function uploadPhotos(dir, label) {
  const files = readdirSync(dir)
    .filter(f => [".jpg", ".jpeg", ".png"].includes(extname(f).toLowerCase()))
    .sort();
  console.log(`\n[${label}] Uploading ${files.length} photos from ${dir}`);
  const assets = [];
  for (const file of files) {
    process.stdout.write(`  ${file}... `);
    const asset = await client.assets.upload("image", createReadStream(join(dir, file)), { filename: file });
    assets.push({ _type: "image", _key: asset._id.slice(-8), asset: { _type: "reference", _ref: asset._id } });
    console.log(`✓`);
  }
  return assets;
}

const SPECS_ELITE = [
  { _key: "s0",  key: "— PARAMÈTRES GÉNÉRAUX —", value: "" },
  { _key: "s1",  key: "Modèle", value: "Changan CS55 PLUS 2026 — 4e Génération — 1.5T Élite" },
  { _key: "s2",  key: "Année de mise sur le marché", value: "2026" },
  { _key: "s3",  key: "Carrosserie", value: "SUV compact · 5 portes · 5 places" },
  { _key: "s4",  key: "Transmission", value: "Traction avant (FWD)" },
  { _key: "s5",  key: "Carburant", value: "Essence 92" },
  { _key: "s6",  key: "Masse à vide", value: "1 430 kg" },
  { _key: "s7",  key: "Réservoir", value: "51 L" },
  { _key: "s8",  key: "Coffre", value: "475 L — sièges rabattus : 1 415 L" },
  { _key: "s9",  key: "Garde au sol", value: "188 mm" },
  { _key: "s10", key: "Angle d'attaque / de fuite", value: "20° / 27°" },
  { _key: "s11", key: "— MOTORISATION 1.5T 7DCT —", value: "" },
  { _key: "s12", key: "Moteur", value: "JL473ZQD — Blue Whale 1.5T · 4 cylindres DOHC · turbocompressé" },
  { _key: "s13", key: "Cylindrée", value: "1 494 cm³ (1,5 L)" },
  { _key: "s14", key: "Alimentation", value: "Turbocompressé · injection directe" },
  { _key: "s15", key: "Puissance maximale", value: "141 kW / 192 ch à 5 500 tr/min" },
  { _key: "s16", key: "Couple maximal", value: "310 N·m de 1 500 à 4 000 tr/min" },
  { _key: "s17", key: "Boîte de vitesses", value: "7DCT — double embrayage humide (7 rapports)" },
  { _key: "s18", key: "Vitesse maximale", value: "190 km/h" },
  { _key: "s19", key: "Consommation WLTC", value: "6,9 L/100 km" },
  { _key: "s20", key: "— DIMENSIONS & CHÂSSIS —", value: "" },
  { _key: "s21", key: "Longueur × Largeur × Hauteur", value: "4 550 × 1 868 × 1 675 mm" },
  { _key: "s22", key: "Empattement", value: "2 656 mm" },
  { _key: "s23", key: "Voie avant / arrière", value: "1 600 / 1 600 mm" },
  { _key: "s24", key: "Pneumatiques", value: "225/60 R18 · Jantes alliage aluminium" },
  { _key: "s25", key: "Suspension avant", value: "MacPherson — indépendante" },
  { _key: "s26", key: "Suspension arrière", value: "Multi-bras — indépendante" },
  { _key: "s27", key: "Direction", value: "Assistance électrique (EPS)" },
  { _key: "s28", key: "Freins avant / arrière", value: "Disques ventilés / Disques" },
  { _key: "s29", key: "Frein de stationnement", value: "Électronique (EPB)" },
  { _key: "s30", key: "Roue de secours", value: "Format réduit (galette)" },
  { _key: "s31", key: "— SÉCURITÉ PASSIVE —", value: "" },
  { _key: "s32", key: "Airbags frontaux", value: "Conducteur + passager avant" },
  { _key: "s33", key: "Airbags latéraux / rideaux", value: "Rangée avant" },
  { _key: "s34", key: "ABS / EBD / ESP / TCS", value: "Oui" },
  { _key: "s35", key: "TPMS", value: "Surveillance pression pneus — affichage numérique" },
  { _key: "s36", key: "ISOFIX", value: "Oui — interface siège enfant" },
  { _key: "s37", key: "Rappel ceintures", value: "Rangée avant" },
  { _key: "s38", key: "— SÉCURITÉ ACTIVE — ADAS L2 —", value: "" },
  { _key: "s39", key: "Niveau d'assistance", value: "L2 — conduite semi-autonome" },
  { _key: "s40", key: "Régulateur adaptatif", value: "ACC — pleine plage de vitesse" },
  { _key: "s41", key: "Freinage urgence (AEB)", value: "Oui" },
  { _key: "s42", key: "Alerte collision (FCW)", value: "Oui — frontale" },
  { _key: "s43", key: "Maintien de voie", value: "Centrage et maintien actif" },
  { _key: "s44", key: "Angles morts (BSM)", value: "Oui · DOW alerte ouverture de porte" },
  { _key: "s45", key: "Aide démarrage en côte", value: "Oui (HSA)" },
  { _key: "s46", key: "Descente contrôlée", value: "Oui (HDC)" },
  { _key: "s47", key: "Caméra 360°", value: "Vue panoramique 360°" },
  { _key: "s48", key: "Radars", value: "3 radars ultrasoniques · avant + arrière" },
  { _key: "s49", key: "Stationnement auto.", value: "APA — stationnement automatique" },
  { _key: "s50", key: "— EXTÉRIEUR & ÉCLAIRAGE —", value: "" },
  { _key: "s51", key: "Phares avant", value: "Full LED — allumage automatique" },
  { _key: "s52", key: "Feux de jour", value: "LED intégrés" },
  { _key: "s53", key: "Feux arrière", value: "LED" },
  { _key: "s54", key: "Toit", value: "Toit panoramique — ouverture électrique" },
  { _key: "s55", key: "Rétroviseurs", value: "Réglage électrique · dégivrage · rabattement auto" },
  { _key: "s56", key: "Essuie-glaces", value: "Détection de pluie" },
  { _key: "s57", key: "Accès / démarrage", value: "Sans clé · bouton · clé Bluetooth · démarrage à distance" },
  { _key: "s58", key: "Hayon électrique", value: "Capteur de pied · mémoire de position" },
  { _key: "s59", key: "— COCKPIT & CONNECTIVITÉ —", value: "" },
  { _key: "s60", key: "Instrumentation", value: "10,25\" — LCD full digital" },
  { _key: "s61", key: "Écran central", value: "12,8\" — tactile" },
  { _key: "s62", key: "IA vocale", value: "«Bonjour Xiao'an» — reconnaissance vocale" },
  { _key: "s63", key: "Compatibilité", value: "Apple CarPlay · CarLink · Huawei HiCar" },
  { _key: "s64", key: "Réseau", value: "4G intégré · Wi-Fi hotspot" },
  { _key: "s65", key: "Mise à jour", value: "OTA (over-the-air)" },
  { _key: "s66", key: "Interfaces", value: "2× USB/Type-C avant · 1× USB arrière" },
  { _key: "s67", key: "Audio", value: "4 haut-parleurs" },
  { _key: "s68", key: "Application mobile", value: "Démarrage à distance · climatisation · localisation" },
  { _key: "s69", key: "— SIÈGES & HABITACLE —", value: "" },
  { _key: "s70", key: "Revêtement", value: "Simili-cuir" },
  { _key: "s71", key: "Siège conducteur", value: "Réglage électrique" },
  { _key: "s72", key: "Siège passager avant", value: "Réglage électrique" },
  { _key: "s73", key: "Sièges arrière", value: "Rabattement proportionnel (split)" },
  { _key: "s74", key: "Climatisation", value: "Automatique · sorties d'air arrière · filtre PM2,5" },
  { _key: "s75", key: "Vitres", value: "Électriques one-touch · anti-pincement" },
  { _key: "s76", key: "Accoudoir central AV / AR", value: "Oui — avec rangement / avec porte-gobelet" },
];

const SPECS_ADVANCED = [
  { _key: "s0",  key: "— PARAMÈTRES GÉNÉRAUX —", value: "" },
  { _key: "s1",  key: "Modèle", value: "Changan CS55 PLUS 2026 — 4e Génération — 1.5T Advanced" },
  { _key: "s2",  key: "Année de mise sur le marché", value: "2026" },
  { _key: "s3",  key: "Carrosserie", value: "SUV compact · 5 portes · 5 places" },
  { _key: "s4",  key: "Transmission", value: "Traction avant (FWD)" },
  { _key: "s5",  key: "Carburant", value: "Essence 92" },
  { _key: "s6",  key: "Masse à vide", value: "1 430 kg" },
  { _key: "s7",  key: "Réservoir", value: "51 L" },
  { _key: "s8",  key: "Coffre", value: "475 L — sièges rabattus : 1 415 L" },
  { _key: "s9",  key: "Garde au sol", value: "188 mm" },
  { _key: "s10", key: "Angle d'attaque / de fuite", value: "20° / 27°" },
  { _key: "s11", key: "— MOTORISATION 1.5T 7DCT —", value: "" },
  { _key: "s12", key: "Moteur", value: "JL473ZQD — Blue Whale 1.5T · 4 cylindres DOHC · turbocompressé" },
  { _key: "s13", key: "Cylindrée", value: "1 494 cm³ (1,5 L)" },
  { _key: "s14", key: "Alimentation", value: "Turbocompressé · injection directe" },
  { _key: "s15", key: "Puissance maximale", value: "141 kW / 192 ch à 5 500 tr/min" },
  { _key: "s16", key: "Couple maximal", value: "310 N·m de 1 500 à 4 000 tr/min" },
  { _key: "s17", key: "Boîte de vitesses", value: "7DCT — double embrayage humide (7 rapports)" },
  { _key: "s18", key: "Vitesse maximale", value: "190 km/h" },
  { _key: "s19", key: "Consommation WLTC", value: "6,9 L/100 km" },
  { _key: "s20", key: "Modes de conduite", value: "Éco · Standard · Confort · Sport" },
  { _key: "s21", key: "— DIMENSIONS & CHÂSSIS —", value: "" },
  { _key: "s22", key: "Longueur × Largeur × Hauteur", value: "4 550 × 1 868 × 1 675 mm" },
  { _key: "s23", key: "Empattement", value: "2 656 mm" },
  { _key: "s24", key: "Voie avant / arrière", value: "1 600 / 1 600 mm" },
  { _key: "s25", key: "Pneumatiques", value: "225/60 R18 · Jantes alliage aluminium" },
  { _key: "s26", key: "Suspension avant", value: "MacPherson — indépendante" },
  { _key: "s27", key: "Suspension arrière", value: "Multi-bras — indépendante" },
  { _key: "s28", key: "Direction", value: "Assistance électrique (EPS)" },
  { _key: "s29", key: "Freins avant / arrière", value: "Disques ventilés / Disques" },
  { _key: "s30", key: "Frein de stationnement", value: "Électronique (EPB)" },
  { _key: "s31", key: "Roue de secours", value: "Format réduit (galette)" },
  { _key: "s32", key: "— SÉCURITÉ PASSIVE —", value: "" },
  { _key: "s33", key: "Airbags frontaux", value: "Conducteur + passager avant" },
  { _key: "s34", key: "Airbags latéraux", value: "Avant + arrière" },
  { _key: "s35", key: "Airbags rideaux", value: "Avant + arrière — 2 rangées" },
  { _key: "s36", key: "ABS / EBD / EBA / ESP / TCS", value: "Oui" },
  { _key: "s37", key: "TPMS", value: "Surveillance pression pneus — affichage numérique" },
  { _key: "s38", key: "ISOFIX", value: "Oui — interface siège enfant" },
  { _key: "s39", key: "Rappel ceintures", value: "Rangée avant" },
  { _key: "s40", key: "— SÉCURITÉ ACTIVE — ADAS L2 —", value: "" },
  { _key: "s41", key: "Niveau d'assistance", value: "L2 — conduite semi-autonome" },
  { _key: "s42", key: "Régulateur adaptatif", value: "ACC — pleine plage de vitesse" },
  { _key: "s43", key: "Freinage urgence (AEB)", value: "Oui" },
  { _key: "s44", key: "Alerte collision (FCW)", value: "Oui — frontale" },
  { _key: "s45", key: "Maintien de voie (LKA)", value: "Oui — maintien actif" },
  { _key: "s46", key: "Alerte sortie de voie", value: "LDW — avertissement" },
  { _key: "s47", key: "Angles morts (BSD)", value: "Oui — alerte arrière" },
  { _key: "s48", key: "Fatigue conducteur", value: "Détection — alerte" },
  { _key: "s49", key: "Reconn. panneaux routiers", value: "TSR — oui" },
  { _key: "s50", key: "Aide changement de voie", value: "Oui" },
  { _key: "s51", key: "Aide démarrage en côte", value: "HSA — oui" },
  { _key: "s52", key: "Descente contrôlée", value: "HDC — oui" },
  { _key: "s53", key: "Caméra 360°", value: "Vue panoramique 360° — 5 caméras" },
  { _key: "s54", key: "Radars de stationnement", value: "Avant + Arrière — ultrasoniques" },
  { _key: "s55", key: "Dashcam", value: "Enregistreur de bord intégré" },
  { _key: "s56", key: "— EXTÉRIEUR & ÉCLAIRAGE —", value: "" },
  { _key: "s57", key: "Phares avant", value: "LED — allumage automatique · feux hauts adaptatifs (AHB)" },
  { _key: "s58", key: "Feux de jour", value: "LED intégrés" },
  { _key: "s59", key: "Feux de brouillard avant", value: "Oui" },
  { _key: "s60", key: "Feux arrière", value: "LED" },
  { _key: "s61", key: "Toit", value: "Toit panoramique ouvrant" },
  { _key: "s62", key: "Grille d'air active", value: "Volet de calandre actif" },
  { _key: "s63", key: "Barres de toit", value: "Oui" },
  { _key: "s64", key: "Rétroviseurs extérieurs", value: "Réglage électrique · dégivrage" },
  { _key: "s65", key: "Essuie-glaces", value: "Détection de pluie · essuie-glace arrière" },
  { _key: "s66", key: "Hayon", value: "Électrique motorisé" },
  { _key: "s67", key: "Accès / démarrage", value: "Sans clé · bouton · clé Bluetooth · télécommande" },
  { _key: "s68", key: "Vitres", value: "Électriques one-touch · anti-pincement · vitres AR teintées" },
  { _key: "s69", key: "Rétroviseur intérieur", value: "Anti-éblouissement manuel" },
  { _key: "s70", key: "— COCKPIT & CONNECTIVITÉ —", value: "" },
  { _key: "s71", key: "Instrumentation", value: "LCD 10,25\" — full digital" },
  { _key: "s72", key: "Écran central", value: "Tactile 12,8\" couleur" },
  { _key: "s73", key: "IA vocale", value: "Oui — «Bonjour Xiao'an»" },
  { _key: "s74", key: "Compatibilité", value: "Apple CarPlay · CarLink · Huawei HiCar" },
  { _key: "s75", key: "Réseau", value: "4G intégré · Wi-Fi hotspot" },
  { _key: "s76", key: "Mise à jour", value: "OTA (over-the-air)" },
  { _key: "s77", key: "Navigation GPS", value: "Intégrée — infotrafic" },
  { _key: "s78", key: "Interfaces", value: "2× USB/Type-C avant · 1× USB arrière · prise 12V coffre" },
  { _key: "s79", key: "Audio", value: "4 haut-parleurs" },
  { _key: "s80", key: "Application mobile", value: "Démarrage à distance · portes · vitres · phares · climatisation · localisation" },
  { _key: "s81", key: "— SIÈGES & HABITACLE —", value: "" },
  { _key: "s82", key: "Revêtement", value: "Simili-cuir bi-ton rouge brique / noir" },
  { _key: "s83", key: "Siège conducteur", value: "Réglage électrique — hauteur · dossier · longitudinal" },
  { _key: "s84", key: "Siège passager avant", value: "Réglage électrique · rabattement depuis banquette AR" },
  { _key: "s85", key: "Sièges arrière", value: "Rabattement proportionnel (split)" },
  { _key: "s86", key: "Volant", value: "Simili-cuir multifonctions · palettes de vitesses · réglage manuel H+V" },
  { _key: "s87", key: "Accoudoir central AV / AR", value: "Oui — avec rangement / avec porte-gobelet" },
  { _key: "s88", key: "Climatisation", value: "Automatique · sorties d'air arrière · filtre PM2,5 · purificateur d'air" },
  { _key: "s89", key: "Miroirs de courtoisie", value: "Conducteur + passager" },
];

async function main() {
  if (!process.env.SANITY_TOKEN) { console.error("Missing SANITY_TOKEN"); process.exit(1); }

  // Upload photos for both cars in sequence
  const photosElite = await uploadPhotos(
    "/Users/apple/Documents/Dossier photos voitures chinoises/CS55 PLUS basic",
    "CS55 PLUS Élite"
  );
  const photosAdvanced = await uploadPhotos(
    "/Users/apple/Documents/Dossier photos voitures chinoises/CS55 PLUS Medium",
    "CS55 PLUS Advanced"
  );

  // Create both documents
  const cars = [
    {
      _id: "car-cs55plus-elite",
      _type: "car",
      brand: "Changan",
      model: "CS55 PLUS Élite",
      price: "9 600 000",
      autohomeId: "ext/72642",
      colors: ["Blanc", "Gris", "Noir", "Bleu"],
      photos: photosElite,
      specs: SPECS_ELITE,
      tags: null,
    },
    {
      _id: "car-cs55plus-advanced",
      _type: "car",
      brand: "Changan",
      model: "CS55 PLUS Advanced",
      price: "9 800 000",
      autohomeId: "ext/72642",
      colors: ["Blanc", "Gris", "Noir", "Bleu"],
      photos: photosAdvanced,
      specs: SPECS_ADVANCED,
      tags: null,
    },
  ];

  for (const car of cars) {
    console.log(`\nCreating ${car._id}...`);
    const result = await client.createOrReplace(car);
    console.log(`✓ ${result._id} created`);
  }

  console.log("\n✅ Done! Both cars created in Sanity (draft state).");
}

main().catch(console.error);

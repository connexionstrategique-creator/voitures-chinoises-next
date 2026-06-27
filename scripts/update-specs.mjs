/**
 * Update car specs in Sanity from extracted PDF data
 * Usage: node scripts/update-specs.mjs
 */

const PROJECT_ID = "t3ow1rmc";
const DATASET = "production";
const TOKEN = "skyztPiIY9B6QnGxPk1LGpDi4AbqNDaoHoPCDmSxsvBhzLFCjt198UNt8b3Hp7lq7eWIMWsJ9PVsYfDlE";
const API = `https://${PROJECT_ID}.api.sanity.io/v2021-06-07/data/mutate/${DATASET}`;

function specs(arr) {
  return arr.map(([key, value]) => ({
    _type: "spec",
    _key: key.toLowerCase().replace(/[^a-z0-9]/g, "-").slice(0, 40),
    key,
    value,
  }));
}

const SPECS = {

  // BYD LÉOPARD 8 — 5 Places (PHEV Smart Flagship)
  "car-2": specs([
    ["Année",           "2025"],
    ["Type",            "SUV tout-terrain PHEV 4×4"],
    ["Places",          "5"],
    ["Portes",          "5"],
    ["Moteur",          "2.0T turbo PHEV + moteur électrique"],
    ["Transmission",    "E-CVT · 4×4 double moteur AV+AR"],
    ["Puissance",       "550 kW (système combiné)"],
    ["Couple",          "760 N·m"],
    ["0-100 km/h",      "4,8 s"],
    ["Batterie",        "36,8 kWh LFP lame"],
    ["Autonomie",       "125 km élec. / >1 200 km combiné"],
    ["Charge rapide",   "DC 30→80% en ~16 min"],
    ["Longueur",        "5 195 mm"],
    ["Largeur",         "1 994 mm"],
    ["Hauteur",         "1 905 mm"],
    ["Traction",        "4×4 intégral · Mode 4L"],
    ["Roues",           "20 pouces alliage tout-terrain"],
    ["Airbags",         "6 airbags (frontaux, latéraux, rideaux)"],
    ["Freins",          "Disques ventilés 4 roues + EPB"],
    ["Aide à la conduite", "Huawei ADS 4.0 · L2+"],
    ["Écran",           "12,3\" + HUD · HarmonyOS 4"],
    ["Caméra",          "360° + LIDAR + longue portée"],
  ]),

  // BYD TITANIUM 7 — 7 Places (PHEV Smart Luxury)
  "car-1": specs([
    ["Année",           "2025"],
    ["Type",            "SUV tout-terrain PHEV 4×4"],
    ["Places",          "7 (2+3+2)"],
    ["Portes",          "5"],
    ["Moteur",          "2.0T turbo PHEV + moteur électrique"],
    ["Transmission",    "E-CVT · 4×4 double moteur AV+AR"],
    ["Puissance",       "550 kW (système combiné)"],
    ["Couple",          "760 N·m"],
    ["0-100 km/h",      "4,8 s"],
    ["Batterie",        "36,8 kWh LFP lame"],
    ["Autonomie",       "125 km élec. / >1 200 km combiné"],
    ["Charge rapide",   "DC 30→80% en ~16 min"],
    ["Longueur",        "5 195 mm"],
    ["Largeur",         "1 994 mm"],
    ["Hauteur",         "1 905 mm"],
    ["Traction",        "4×4 intégral · Mode 4L"],
    ["Sièges",          "7 places · 3e rang escamotable"],
    ["Roues",           "20 pouces alliage tout-terrain"],
    ["Airbags",         "6 airbags (frontaux, latéraux, rideaux)"],
    ["Freins",          "Disques ventilés 4 roues + EPB"],
    ["Aide à la conduite", "Huawei ADS 4.0 · L2+"],
    ["Écran",           "Double écran · HUD · HarmonyOS 4"],
    ["Audio",           "DEVIATEL premium"],
    ["Caméra",          "360° + LIDAR + longue portée"],
  ]),

  // Changan CS55 — 2026 1.5T 7DCT Tianshu Premium
  "car-7": specs([
    ["Année",           "2026"],
    ["Type",            "SUV compact · 5 portes"],
    ["Places",          "5"],
    ["Moteur",          "BlueCore 1.5T JL473ZQD — 4 cyl. turbo"],
    ["Puissance",       "141 kW / 192 ch"],
    ["Couple",          "310 N·m (1 500–4 000 tr/min)"],
    ["Boîte",           "7DCT humide (double embrayage)"],
    ["Transmission",    "Traction avant (FWD)"],
    ["Consommation",    "6,9 L/100 km WLTC"],
    ["Réservoir",       "55 L"],
    ["Longueur",        "4 550 mm"],
    ["Largeur",         "1 868 mm"],
    ["Hauteur",         "1 675 mm"],
    ["Empattement",     "2 656 mm"],
    ["Coffre",          "475 L — 1 415 L siège rabattu"],
    ["Poids",           "≈ 1 430 kg"],
    ["Pneus",           "225/55 R19"],
    ["Jantes",          "19\" biton 5 branches"],
    ["Toit",            "Panoramique électrique"],
    ["Écran",           "14,6\" Tianshu OS · Snapdragon 8155"],
    ["Airbags",         "6 airbags"],
    ["Caméra",          "540° + châssis transparent"],
    ["Aide à la conduite", "ADAS L2+ · AEB · BSD · APA 5.0"],
  ]),

  // Changan CS75 PLUS ULTRA — 2026 1.5T Aisin 8 Triple Écrans
  "car-4": specs([
    ["Année",           "2026"],
    ["Type",            "SUV compact · 5 portes"],
    ["Places",          "5"],
    ["Moteur",          "1.5T Baleine Bleue — injection directe 500 bar"],
    ["Puissance",       "141 kW / 192 ch"],
    ["Couple",          "310 N·m"],
    ["Boîte",           "Automatique Aisin 8 rapports"],
    ["Transmission",    "Traction avant (FWD)"],
    ["0-100 km/h",      "7,9 s"],
    ["Consommation",    "6,89 L/100 km WLTC"],
    ["Pneus",           "225/55 R19"],
    ["Écran",           "Triple écrans 37\" total"],
    ["Freins",          "Disques ventilés AV / Disques pleins AR"],
    ["Suspension",      "MacPherson AV · Multi-bras AR"],
  ]),

  // Changan UNI-K — 2025 2.0T 4WD
  "car-3": specs([
    ["Année",           "2025"],
    ["Type",            "SUV mid-size · 5 portes"],
    ["Places",          "5"],
    ["Moteur",          "2.0T turbo 4 cyl. DOHC — B-48Q725"],
    ["Puissance",       "171 kW (233 ch) à 5 000 tr/min"],
    ["Couple",          "390 N·m (1 900–3 300 tr/min)"],
    ["Boîte",           "Automatique 8 rapports"],
    ["Traction",        "4×4 intégral — différentiel multi-disques"],
    ["0-100 km/h",      "6,95 s"],
    ["Vitesse max",     "200 km/h"],
    ["Longueur",        "4 865 mm"],
    ["Largeur",         "1 948 mm"],
    ["Hauteur",         "1 690 mm"],
    ["Empattement",     "2 890 mm"],
    ["Réservoir",       "70 L"],
    ["Poids",           "1 930 kg"],
    ["Garde au sol",    "171 mm"],
    ["Pneus",           "255/55 R20"],
    ["Jantes",          "20 pouces alliage"],
    ["Toit",            "Panoramique ouvrant électrique"],
    ["Phares",          "Full LED · AFS adaptatifs"],
    ["Airbags",         "Frontaux + latéraux + rideaux AV/AR"],
    ["Aide à la conduite", "ACC · AEB · BSD · LDW · L2"],
    ["Audio",           "Sony premium"],
  ]),

  // Changan UNI-Z — 2026 1.5T 7DCT Vision Tianshu
  "car-5": specs([
    ["Année",           "2026"],
    ["Type",            "SUV compact coupé · 5 portes"],
    ["Places",          "5"],
    ["Moteur",          "1.5T Blue Whale — injection directe 500 bar"],
    ["Puissance",       "141 kW / 192 ch"],
    ["Couple",          "310 N·m"],
    ["Boîte",           "7DCT humide (double embrayage)"],
    ["Transmission",    "Traction avant (FWD)"],
    ["0-100 km/h",      "7,8 s"],
    ["Consommation",    "7,13 L/100 km WLTC"],
    ["Longueur",        "4 730 mm"],
    ["Largeur",         "1 890 mm"],
    ["Hauteur",         "1 660 mm"],
    ["Empattement",     "2 795 mm"],
    ["Coffre",          "638 L — 1 425 L rabattu"],
    ["Pneus",           "Alliage 20 pouces"],
    ["Toit",            "Panoramique"],
    ["Écran",           "10,25\" + 14,6\" tactile"],
    ["Climatisation",   "Automatique · sorties d'air arrière"],
    ["Aide à la conduite", "ADAS L2 avancé · 5 radars millim."],
    ["Caméra",          "540°"],
  ]),

  // Changan X5 PLUS — 2026 1.5T 7DCT Excellence PRO
  "car-6": specs([
    ["Année",           "2026"],
    ["Type",            "SUV compact sportif · 5 portes"],
    ["Places",          "5"],
    ["Moteur",          "Blue Whale JL473ZQD 1.5T DOHC — 500 bar"],
    ["Cylindrée",       "1 494 mL — bloc aluminium"],
    ["Puissance",       "141 kW / 192 ch à 5 500 tr/min"],
    ["Couple",          "310 N·m (1 500–4 000 tr/min)"],
    ["Boîte",           "7DCT humide 7 rapports"],
    ["Transmission",    "Traction avant (FWD)"],
    ["0-100 km/h",      "7,51 s"],
    ["Vitesse max",     "205 km/h"],
    ["Consommation",    "6,95 L/100 km WLTC"],
    ["Réservoir",       "51 L"],
    ["Longueur",        "4 540 mm"],
    ["Largeur",         "1 860 mm"],
    ["Hauteur",         "1 590 mm"],
    ["Empattement",     "2 715 mm"],
    ["Coffre",          "584 L — 1 318 L rabattu"],
    ["Poids",           "1 370 kg"],
    ["Garde au sol",    "159 mm"],
    ["Pneus",           "225/55 R18"],
    ["Écran",           "Double écran 12,3\" panoramique"],
    ["Audio",           "Sony 6 HP"],
    ["Freins",          "Disques ventilés AV + disques AR + EPB"],
    ["Aide à la conduite", "ADAS L2 · 540° châssis transparent"],
  ]),

  // Jetour DASHING — 2026 1.5T 6DCT Édition Luxe
  "car-9": specs([
    ["Année",           "2026"],
    ["Type",            "SUV fastback · 5 portes"],
    ["Places",          "5"],
    ["Moteur",          "SQRE4T15C 1.5T turbo DOHC"],
    ["Cylindrée",       "1 498 mL"],
    ["Puissance",       "115 kW (156 ch)"],
    ["Couple",          "230 N·m (1 750–4 000 tr/min)"],
    ["Boîte",           "6DCT humide 6 rapports"],
    ["Transmission",    "Traction avant (FWD)"],
    ["Consommation",    "7,8 L/100 km NEDC"],
    ["Vitesse max",     "180 km/h"],
    ["Réservoir",       "57 L"],
    ["Poids",           "1 530 kg"],
    ["Longueur",        "4 590 mm"],
    ["Largeur",         "1 900 mm"],
    ["Hauteur",         "1 685 mm"],
    ["Empattement",     "2 720 mm"],
    ["Garde au sol",    "190 mm"],
    ["Pneus",           "235/60 R18"],
    ["Airbags",         "Frontaux + latéraux AV"],
    ["Freins",          "Disques ventilés AV · Disques AR · EPB"],
    ["Écran",           "12,8\" flottant + 8\" combiné"],
    ["Toit",            "Panoramique électrique"],
  ]),

  // Jetour TRAVELER T2 — 7 Places (LWB 2025)
  "car-11": specs([
    ["Année",           "2025"],
    ["Type",            "MPV grand gabarit · 4×4 · LWB"],
    ["Places",          "7 (2+3+2)"],
    ["Portes",          "5"],
    ["Moteur",          "2.0TGDI Kunpeng Power — turbo essence"],
    ["Puissance",       "187 kW (254 ch)"],
    ["Couple",          "390 N·m"],
    ["Boîte",           "Automatique 8 rapports Chery AT"],
    ["Traction",        "4×4 XWD BorgWarner 6e génération"],
    ["Modes conduite",  "7 modes : Éco · Sport · Neige · Boue · Sable · Rocher"],
    ["Longueur",        "5 034 mm (LWB)"],
    ["Largeur",         "2 006 mm"],
    ["Hauteur",         "1 880 mm"],
    ["Empattement",     "2 800 mm"],
    ["Garde au sol",    "220 mm minimum"],
    ["Profondeur gué",  "700 mm"],
    ["Pneus",           "255/60 R19"],
    ["Toit",            "Panoramique 62 pouces"],
    ["Écran",           "15,6\" Snapdragon 8155 + 10,25\""],
    ["Audio",           "16 HP surround"],
    ["Climatisation",   "Automatique · filtre PM2,5"],
    ["Charge",          "Sans fil 50 W · Type-C"],
  ]),

  // Jetour TRAVELER T2 — 5 Places (2026 XWD Conquer)
  "car-10": specs([
    ["Année",           "2026"],
    ["Type",            "MPV tout-terrain · 4×4 XWD"],
    ["Places",          "5"],
    ["Portes",          "5"],
    ["Moteur",          "2.0TD — essence turbo"],
    ["Puissance",       "187 kW (254 ch)"],
    ["Couple",          "390 N·m"],
    ["Boîte",           "Automatique ZF 8 rapports"],
    ["Traction",        "4×4 XWD BorgWarner 6e génération"],
    ["Modes conduite",  "7+X modes tout-terrain · reptation intel."],
    ["Longueur",        "4 795 mm"],
    ["Largeur",         "2 006 mm"],
    ["Hauteur",         "1 880 mm"],
    ["Empattement",     "2 800 mm"],
    ["Écran",           "15,6\" Snapdragon 8155"],
    ["Audio",           "16 HP surround"],
    ["Sièges",          "Élec. + chauffage + ventilation + massage"],
    ["Climatisation",   "Automatique multi-zones"],
    ["Caméra",          "540° panoramique"],
    ["Aide à la conduite", "L2 · APA · DMS fatigue"],
  ]),

  // Jetour X70 PLUS — 7 Places (2026 1.5T 7DCT)
  "car-12": specs([
    ["Année",           "2025"],
    ["Type",            "SUV 7 places · 5 portes"],
    ["Places",          "7 (2+3+2)"],
    ["Moteur",          "1.5T 4 cyl. turbo DOHC — SQRG4J15"],
    ["Cylindrée",       "1 499 mL — bloc aluminium"],
    ["Puissance",       "135 kW / 184 ch"],
    ["Couple",          "290 N·m (2 000–3 500 tr/min)"],
    ["Boîte",           "7DCT double embrayage humide"],
    ["Transmission",    "Traction avant (FWD)"],
    ["Consommation",    "7,44 L/100 km WLTC"],
    ["Vitesse max",     "180 km/h"],
    ["Réservoir",       "57 L"],
    ["Poids",           "1 612 kg"],
    ["Longueur",        "4 749 mm"],
    ["Largeur",         "1 900 mm"],
    ["Hauteur",         "1 720 mm"],
    ["Empattement",     "2 745 mm"],
    ["Pneus",           "235/55 R19"],
    ["Jantes",          "Aluminium 19\""],
    ["Phares",          "LED matriciels"],
    ["Toit",            "Panoramique électrique"],
    ["Airbags",         "Frontaux + latéraux + rideaux AV/AR"],
    ["Caméra",          "540° (5 caméras)"],
    ["Aide à la conduite", "L2 · ACC · AEB · BSD · LKA"],
    ["Écran",           "Double écran 12,3\""],
  ]),

  // Livan X3 PRO — 2024 1.5L CVT Xiaosa
  "car-15": specs([
    ["Année",           "2024"],
    ["Type",            "Mini SUV · 5 portes"],
    ["Places",          "5"],
    ["Moteur",          "JLC-4G15C 1.5L atmosphérique DOHC"],
    ["Puissance",       "83 kW / 113 ch à 5 600 tr/min"],
    ["Couple",          "143 N·m (4 400–4 800 tr/min)"],
    ["Boîte",           "CVT à variation continue"],
    ["Transmission",    "Traction avant (FWD)"],
    ["Consommation",    "6,8 L/100 km WLTC"],
    ["Vitesse max",     "160 km/h"],
    ["Longueur",        "4 005 mm"],
    ["Largeur",         "1 760 mm"],
    ["Hauteur",         "1 575 mm"],
    ["Empattement",     "2 480 mm"],
    ["Coffre",          "400 L"],
    ["Poids",           "1 190 kg"],
    ["Garde au sol",    "185 mm"],
    ["Pneus",           "205/60 R16"],
    ["Écran",           "8\" tactile LCD"],
    ["Audio",           "6 HP"],
    ["Navigation",      "GPS satellite · trafic temps réel"],
    ["Phares",          "LED de jour · halogène croisement"],
  ]),

};

// ─── Update Sanity ─────────────────────────────────────────────────────────────
async function patchSpecs(carId, specsArr) {
  const res = await fetch(API, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      mutations: [{ patch: { id: carId, set: { specs: specsArr } } }],
    }),
  });
  if (!res.ok) throw new Error(`${carId}: HTTP ${res.status} ${await res.text()}`);
  return res.json();
}

async function main() {
  console.log(`Mise à jour des fiches techniques pour ${Object.keys(SPECS).length} voitures...\n`);
  for (const [carId, specsArr] of Object.entries(SPECS)) {
    try {
      await patchSpecs(carId, specsArr);
      console.log(`✓  ${carId} — ${specsArr.length} specs`);
    } catch (e) {
      console.error(`✗  ${carId}: ${e.message}`);
    }
  }
  console.log("\n✅ Terminé !");
}

main().catch(console.error);

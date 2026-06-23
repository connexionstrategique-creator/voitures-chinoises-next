import { createClient } from "@sanity/client";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const env = readFileSync(resolve(__dirname, "../.env.local"), "utf-8");
const projectId = env.match(/NEXT_PUBLIC_SANITY_PROJECT_ID="?([^"\n]+)"?/)?.[1];
const dataset = env.match(/NEXT_PUBLIC_SANITY_DATASET="?([^"\n]+)"?/)?.[1];

if (!projectId || !dataset) {
  console.error("❌ Impossible de lire .env.local");
  process.exit(1);
}

const client = createClient({ projectId, dataset, apiVersion: "2024-01-01", useCdn: false, token: process.env.SANITY_TOKEN });

// ─── PHOTOS ────────────────────────────────────────────────────────────────
const CAR_PHOTOS = {
  1: [
    { label: "Face avant", src: "https://res.cloudinary.com/daol8mzeg/image/upload/v1772664699/IMG_6849_u4ylox.jpg" },
    { label: "Profil · Vue latérale", src: "https://res.cloudinary.com/daol8mzeg/image/upload/v1772664726/IMG_6850_cycltt.jpg" },
    { label: "Arrière · Roue de secours", src: "https://res.cloudinary.com/daol8mzeg/image/upload/v1772664718/IMG_6852_hpxw5s.jpg" },
    { label: "Intérieur · Cockpit", src: "https://res.cloudinary.com/daol8mzeg/image/upload/v1772664710/IMG_6853_dsa88y.jpg" },
    { label: "Commandes · Détail", src: "https://res.cloudinary.com/daol8mzeg/image/upload/v1772664686/IMG_6856_bjatf5.jpg" },
    { label: "Coffre · Grand volume", src: "https://res.cloudinary.com/daol8mzeg/image/upload/v1772664707/IMG_6859_te3l5o.jpg" },
    { label: "Détail intérieur", src: "https://res.cloudinary.com/daol8mzeg/image/upload/v1772664693/IMG_6855_jh0rjm.jpg" },
    { label: "Détail extérieur", src: "https://res.cloudinary.com/daol8mzeg/image/upload/v1772664692/IMG_6858_nd8hwj.jpg" },
    { label: "Vue complémentaire", src: "https://res.cloudinary.com/daol8mzeg/image/upload/v1772664708/IMG_6863_mr7lz7.jpg" },
  ],
  2: [
    { label: "Face avant", src: "https://res.cloudinary.com/daol8mzeg/image/upload/v1772668417/IMG_6865_yror0u.jpg" },
    { label: "Face avant · Angle", src: "https://res.cloudinary.com/daol8mzeg/image/upload/v1772668401/IMG_6866_gcibd8.jpg" },
    { label: "Profil · Vue latérale", src: "https://res.cloudinary.com/daol8mzeg/image/upload/v1772668405/IMG_6867_lapcgw.jpg" },
    { label: "Arrière", src: "https://res.cloudinary.com/daol8mzeg/image/upload/v1772668410/IMG_6869_qyjxcm.jpg" },
    { label: "Intérieur · Cockpit", src: "https://res.cloudinary.com/daol8mzeg/image/upload/v1772668423/IMG_6874_jmlgga.jpg" },
    { label: "Tableau de bord", src: "https://res.cloudinary.com/daol8mzeg/image/upload/v1772668419/IMG_6875_t8frlq.jpg" },
    { label: "Sièges avant", src: "https://res.cloudinary.com/daol8mzeg/image/upload/v1772668673/IMG_6881_zx0ko3.jpg" },
    { label: "Sièges arrière", src: "https://res.cloudinary.com/daol8mzeg/image/upload/v1772668708/IMG_6884_f8miiv.jpg" },
    { label: "Coffre · Vue", src: "https://res.cloudinary.com/daol8mzeg/image/upload/v1772668717/IMG_6891_yylrtp.jpg" },
  ],
  4: [
    { label: "Face avant", src: "https://res.cloudinary.com/daol8mzeg/image/upload/v1772671136/IMG_6908_c10cra.jpg" },
    { label: "Face avant · Angle", src: "https://res.cloudinary.com/daol8mzeg/image/upload/v1772671137/IMG_6909_guobmf.jpg" },
    { label: "Profil · Vue latérale", src: "https://res.cloudinary.com/daol8mzeg/image/upload/v1772671136/IMG_6910_wmibwh.jpg" },
    { label: "Arrière", src: "https://res.cloudinary.com/daol8mzeg/image/upload/v1772671155/IMG_6916_d494md.jpg" },
    { label: "Intérieur · Cockpit", src: "https://res.cloudinary.com/daol8mzeg/image/upload/v1772671161/IMG_6922_kjbhmd.jpg" },
    { label: "Tableau de bord", src: "https://res.cloudinary.com/daol8mzeg/image/upload/v1772671174/IMG_6923_vq15tc.jpg" },
    { label: "Sièges avant", src: "https://res.cloudinary.com/daol8mzeg/image/upload/v1772671173/IMG_6928_z2vw2q.jpg" },
    { label: "Coffre · Vue", src: "https://res.cloudinary.com/daol8mzeg/image/upload/v1772671183/IMG_6932_pofk4d.jpg" },
  ],
  12: [
    { label: "Profil · Vue latérale", src: "https://res.cloudinary.com/daol8mzeg/image/upload/v1772675011/IMG_6963_fp6v3n.jpg" },
    { label: "Face avant", src: "https://res.cloudinary.com/daol8mzeg/image/upload/v1772675014/IMG_6948_mygqbq.jpg" },
    { label: "Arrière", src: "https://res.cloudinary.com/daol8mzeg/image/upload/v1772674998/IMG_6969_teo1ey.jpg" },
    { label: "Intérieur · Cockpit", src: "https://res.cloudinary.com/daol8mzeg/image/upload/v1772675043/IMG_6980_dgpioq.jpg" },
    { label: "Tableau de bord", src: "https://res.cloudinary.com/daol8mzeg/image/upload/v1772675017/IMG_6982_qiniyh.jpg" },
    { label: "Espace 7 places", src: "https://res.cloudinary.com/daol8mzeg/image/upload/v1772675038/IMG_6986_gom7tn.jpg" },
    { label: "Coffre · Vue", src: "https://res.cloudinary.com/daol8mzeg/image/upload/v1772675032/IMG_6987_eoksig.jpg" },
  ],
  15: [
    { label: "Face avant", src: "https://res.cloudinary.com/daol8mzeg/image/upload/v1772667370/Image_JPEG-4B64-A6CE-71-0_lqdtvo.jpg" },
    { label: "Face avant · Angle", src: "https://res.cloudinary.com/daol8mzeg/image/upload/v1772667373/Image_JPEG-4B64-A6CE-71-1_jxijib.jpg" },
    { label: "Profil · Vue latérale", src: "https://res.cloudinary.com/daol8mzeg/image/upload/v1772667374/Image_JPEG-4B64-A6CE-71-2_n4xem7.jpg" },
    { label: "Arrière", src: "https://res.cloudinary.com/daol8mzeg/image/upload/v1772667383/Image_JPEG-4B64-A6CE-71-3_b7aai7.jpg" },
    { label: "Intérieur · Cockpit", src: "https://res.cloudinary.com/daol8mzeg/image/upload/v1772667373/Image_JPEG-4B64-A6CE-71-6_qviben.jpg" },
    { label: "Tableau de bord", src: "https://res.cloudinary.com/daol8mzeg/image/upload/v1772667378/Image_JPEG-4B64-A6CE-71-7_voizs6.jpg" },
    { label: "Sièges avant", src: "https://res.cloudinary.com/daol8mzeg/image/upload/v1772667378/Image_JPEG-4B64-A6CE-71-10_jfpuoj.jpg" },
    { label: "Vue complémentaire", src: "https://res.cloudinary.com/daol8mzeg/image/upload/v1772667385/Image_JPEG-4B64-A6CE-71-15_ckv6h1.jpg" },
  ],
};

// ─── VOITURES ──────────────────────────────────────────────────────────────
const CARS = [
  { id: 1,  brand: "BYD",       model: "TITANIUM 7",               year: "2026", cat: "hybride", badge: "new",  badgeText: "Nouveau",       featured: true,  price: "24 900 000", color: "#1A3A5C", colors: ["Vert Paysage","Argent Étoilé","Bleu Matin","Or Aurore","Noir Obsidien"], specs: {Moteur:"2.0 Turbo Hybride Plug-in",Type:"Hybride rechargeable PHEV",Places:"5 places",Année:"2026",Kilométrage:"0 km — Neuf",Transmission:"Automatique",Garantie:"Garantie constructeur"}, mini: {v1:"2.0T",k1:"hybride plug-in",v2:"5",k2:"places",v3:"0",k3:"kilomètre"}, desc: "Le BYD Titanium 7 incarne le haut de gamme hybride rechargeable de BYD. Motorisation 2.0 Turbo PHEV alliant performance et économie de carburant, finitions premium et technologies embarquées de pointe. Sorti directement d'usine, livré neuf en Afrique francophone.", order: 1 },
  { id: 2,  brand: "BYD",       model: "LÉOPARD 8",                year: "2026", cat: "hybride", badge: "new",  badgeText: "Full Option",    featured: false, price: "36 900 000", color: "#2A2A2A", colors: ["Noir","Blanc","Gris","Bleu Nuit","Argent"], specs: {Moteur:"2.0 Turbo Hybride Plug-in",Type:"Hybride rechargeable PHEV",Places:"5 places",Finition:"Full Option",Année:"2026",Kilométrage:"0 km — Neuf",Garantie:"Garantie constructeur"}, mini: {v1:"2.0T",k1:"hybride plug-in",v2:"5",k2:"places",v3:"Full",k3:"option"}, desc: "Le BYD Léopard 8 Full Option est le SUV hybride rechargeable premium de BYD. Motorisation 2.0 Turbo PHEV, équipements haut de gamme complets, design imposant et technologie de batterie Blade. Le summum de l'import chinois en Afrique francophone.", order: 2 },
  { id: 3,  brand: "Changan",   model: "UNI-K",                    year: "2025", cat: "suv",     badge: "pop",  badgeText: "Populaire",      featured: false, price: "13 800 000", color: "#7A0F0F", colors: ["Blanc","Noir","Argent","Gris","Marron"], specs: {Moteur:"Essence",Places:"5 places",Année:"2025",Kilométrage:"0 km — Neuf",Transmission:"Automatique",Garantie:"Garantie constructeur"}, mini: {v1:"5",k1:"places",v2:"Essence",k2:"motorisation",v3:"0",k3:"kilomètre"}, desc: "Le Changan Uni-K allie design futuriste et motorisation essence fiable. SUV au positionnement premium avec une silhouette coupée remarquée, intérieur technologique et confort routier supérieur. Livré jusqu'aux ports de Cotonou, Lomé et Abidjan.", order: 3 },
  { id: 4,  brand: "Changan",   model: "CS75 PLUS ULTRA",          year: "2026", cat: "suv",     badge: "new",  badgeText: "Nouveau",        featured: false, price: "12 600 000", color: "#8B1A1A", colors: ["Bleu","Argent","Noir","Blanc","Gris"], specs: {Moteur:"2.0T Essence",Places:"5 places",Année:"2026",Kilométrage:"0 km — Neuf",Transmission:"Automatique",Garantie:"Garantie constructeur"}, mini: {v1:"2.0T",k1:"essence",v2:"5",k2:"places",v3:"0",k3:"kilomètre"}, desc: "Le Changan CS75 Plus Ultra 2026 est l'évolution premium du bestseller CS75. Moteur 2.0T performant, finitions ultra soignées, connectivité avancée. Prix CIF inclus vers tous les ports d'Afrique francophone — le meilleur rapport qualité-prix du marché.", order: 4 },
  { id: 5,  brand: "Changan",   model: "UNI-Z",                    year: "2026", cat: "suv",     badge: "new",  badgeText: "Nouveau",        featured: false, price: "11 000 000", color: "#1C3A5C", colors: ["Gris","Blanc","Bleu","Vert"], specs: {Moteur:"Essence",Places:"5 places",Année:"2026",Kilométrage:"0 km — Neuf",Transmission:"Automatique",Garantie:"Garantie constructeur"}, mini: {v1:"5",k1:"places",v2:"Essence",k2:"motorisation",v3:"2026",k3:"millésime"}, desc: "Le Changan Uni-Z est le SUV compact nouvelle génération de Changan. Design coupé sportif, habitacle technologique et motorisation essence économique. Sortie d'usine 2026, livré neuf 0km vers Cotonou, Lomé, Abidjan et Dakar.", order: 5 },
  { id: 6,  brand: "Changan",   model: "X5 PLUS",                  year: "2026", cat: "suv",     badge: "pop",  badgeText: "Populaire",      featured: false, price: "8 976 150",  color: "#2A4A6E", colors: ["Blanc","Gris","Noir","Bleu","Argent"], specs: {Moteur:"Essence",Places:"5 places",Année:"2026",Kilométrage:"0 km — Neuf",Transmission:"Automatique",Garantie:"Garantie constructeur"}, mini: {v1:"5",k1:"places",v2:"Essence",k2:"motorisation",v3:"0",k3:"kilomètre"}, desc: "Le Changan X5 Plus 2026 est le SUV compact accessible de Changan. Rapport qualité-prix exceptionnel, fiabilité reconnue et design moderne. Prix CIF compétitif livré vers tous les ports d'Afrique francophone — idéal pour les familles.", order: 6 },
  { id: 7,  brand: "Changan",   model: "CS55",                     year: "2026", cat: "suv",     badge: "new",  badgeText: "Nouveau",        featured: false, price: "10 000 000", color: "#3A5C1A", colors: ["Blanc","Gris Fluorite","Noir","Rouge","Bleu"], specs: {Moteur:"Essence",Places:"5 places",Année:"2026",Kilométrage:"0 km — Neuf",Transmission:"Automatique",Garantie:"Garantie constructeur"}, mini: {v1:"5",k1:"places",v2:"Essence",k2:"motorisation",v3:"2026",k3:"millésime"}, desc: "Le Changan CS55 2026 est le SUV urbain par excellence. Compact, agile et économique, il offre tout le confort d'un SUV dans un gabarit maîtrisé. Moteur essence, finitions soignées, livré neuf 0km vers les ports d'Afrique francophone.", order: 7 },
  { id: 8,  brand: "Jetour",    model: "T1",                       year: "2026", cat: "suv",     badge: "new",  badgeText: "Full Option",    featured: false, price: "14 000 000", color: "#1C5E3F", colors: ["Blanc","Noir","Gris","Bleu","Rouge"], specs: {Moteur:"1.5 Turbo Essence",Places:"5 places",Finition:"Full Option",Année:"2026",Kilométrage:"0 km — Neuf",Transmission:"Automatique",Garantie:"Garantie constructeur"}, mini: {v1:"1.5T",k1:"turbo essence",v2:"5",k2:"places",v3:"Full",k3:"option"}, desc: "Le Jetour T1 Full Option 2026 est le SUV compact premium de Jetour. Motorisation 1.5 Turbo vive, équipements full option complets, design sportif. Sorti directement d'usine, livré neuf vers Cotonou, Lomé, Abidjan et Dakar.", order: 8 },
  { id: 9,  brand: "Jetour",    model: "DASHING",                  year: "2026", cat: "suv",     badge: "pop",  badgeText: "Populaire",      featured: false, price: "12 000 000", color: "#5C3A1A", colors: ["Noir","Bleu","Vert","Gris","Rouge"], specs: {Moteur:"1.5T Essence",Places:"5 places",Finition:"Full Option",Année:"2026",Kilométrage:"0 km — Neuf",Transmission:"Automatique DCT",Garantie:"Garantie constructeur"}, mini: {v1:"1.5T",k1:"essence",v2:"5",k2:"places",v3:"0",k3:"kilomètre"}, desc: "Le Jetour Dashing Full Option 2026, le SUV coupé au style remarqué. Silhouette sportive, intérieur technologique avec grand écran numérique, motorisation 1.5T dynamique. Un choix qui fait tourner les têtes, livré neuf en Afrique francophone.", order: 9 },
  { id: 10, brand: "Jetour",    model: "TRAVELER T2 — 5 Places",   year: "2026", cat: "suv",     badge: "new",  badgeText: "Full Option",    featured: false, price: "19 800 000", color: "#2A2A4A", colors: ["Blanc","Sable","Noir Highway","Gris Highway","Cyan Brumeux"], specs: {Moteur:"2.0 Turbo Essence",Places:"5 places",Finition:"Full Option",Année:"2026",Kilométrage:"0 km — Neuf",Transmission:"Automatique",Garantie:"Garantie constructeur"}, mini: {v1:"2.0T",k1:"turbo essence",v2:"5",k2:"places",v3:"Full",k3:"option"}, desc: "Le Jetour Traveler T2 en version 5 places Full Option est le grand SUV familial premium. Motorisation 2.0 Turbo puissante, équipements haut de gamme, espace intérieur généreux. Le choix de ceux qui voyagent en grand confort.", order: 10 },
  { id: 11, brand: "Jetour",    model: "TRAVELER T2 — 7 Places",   year: "2026", cat: "suv",     badge: "new",  badgeText: "Full Option",    featured: false, price: "20 216 000", color: "#1A3A2A", colors: ["Blanc","Sable","Noir Highway","Gris Highway","Cyan Brumeux"], specs: {Moteur:"2.0 Turbo Essence",Places:"7 places",Finition:"Full Option",Année:"2026",Kilométrage:"0 km — Neuf",Transmission:"Automatique",Garantie:"Garantie constructeur"}, mini: {v1:"2.0T",k1:"turbo essence",v2:"7",k2:"places",v3:"Full",k3:"option"}, desc: "Le Jetour Traveler T2 7 places Full Option est le grand SUV familial par excellence. Motorisation 2.0 Turbo, 3 rangées confortables, équipements complets. Idéal pour les grandes familles et les voyages longue distance en Afrique francophone.", order: 11 },
  { id: 17, brand: "Jetour",    model: "TRAVELER T2 — 7 Pl. Premium", year: "2026", cat: "suv",  badge: "new",  badgeText: "Full Option",    featured: false, price: "20 744 000", color: "#2A1A3A", colors: ["Blanc","Sable","Noir Highway","Gris Highway","Cyan Brumeux"], specs: {Moteur:"2.0 Turbo Essence",Places:"7 places",Finition:"Full Option Premium",Année:"2026",Kilométrage:"0 km — Neuf",Transmission:"Automatique",Garantie:"Garantie constructeur"}, mini: {v1:"2.0T",k1:"turbo essence",v2:"7",k2:"places",v3:"Premium",k3:"finition"}, desc: "Le Jetour Traveler T2 7 places version Premium Full Option. Motorisation 2.0 Turbo, finition supérieure avec équipements additionnels, 3 rangées de sièges. Le grand SUV familial dans sa configuration la plus complète, livré neuf en Afrique francophone.", order: 12 },
  { id: 12, brand: "Jetour",    model: "X70 PLUS — 7 Places",      year: "2026", cat: "suv",     badge: "pop",  badgeText: "Populaire",      featured: false, price: "13 935 000", color: "#4A1A1A", colors: ["Blanc","Sable","Noir Highway","Gris Highway","Cyan Brumeux","Bleu Gris"], specs: {Moteur:"Essence",Places:"7 places",Année:"2026",Kilométrage:"0 km — Neuf",Transmission:"Automatique",Garantie:"Garantie constructeur"}, mini: {v1:"7",k1:"places",v2:"Essence",k2:"motorisation",v3:"0",k3:"kilomètre"}, desc: "Le Jetour X70 Plus 7 places 2026 est le SUV familial spacieux de Jetour. Trois rangées de sièges, motorisation essence fiable et finitions modernes. Le rapport espace-prix le plus compétitif du marché, livré neuf vers tous les ports d'Afrique francophone.", order: 13 },
  { id: 13, brand: "GAC Motor", model: "S7",                        year: "2026", cat: "hybride", badge: "new",  badgeText: "Full Option",    featured: false, price: "15 700 000", color: "#1A2A5C", colors: ["Blanc Ivoire","Gris Graphène","Bleu Lac de Sel","Argent Superstar"], specs: {Moteur:"1.5T Hybride",Places:"7 places",Finition:"Full Option",Année:"2026",Kilométrage:"0 km — Neuf",Transmission:"Automatique",Garantie:"Garantie constructeur"}, mini: {v1:"1.5T",k1:"hybride",v2:"7",k2:"places",v3:"Full",k3:"option"}, desc: "Le GAC S7 Full Option 2026 est le grand SUV hybride 7 places de GAC Motor. Motorisation 1.5T hybride alliant puissance et économie, 3 rangées confortables, équipements full option. Livré neuf vers Cotonou, Lomé et Abidjan.", order: 14 },
  { id: 14, brand: "GAC Motor", model: "GS3",                       year: "2026", cat: "suv",     badge: "pop",  badgeText: "Populaire",      featured: false, price: "8 300 000",  color: "#3A3A3A", colors: ["Blanc","Noir","Gris","Bleu","Argent"], specs: {Moteur:"Essence",Places:"5 places",Année:"2026",Kilométrage:"0 km — Neuf",Sièges:"Conducteur électrique 6 positions",Audio:"6 haut-parleurs",Couleurs:"Argent, Gris Graphène, Gris Clair de Lune",Garantie:"Garantie constructeur"}, mini: {v1:"5",k1:"places",v2:"6",k2:"haut-parleurs",v3:"0",k3:"kilomètre"}, desc: "Le GAC GS3 2026 version HT2A est le SUV compact accessible de GAC Motor. Siège conducteur électrique 6 positions, système audio 6 haut-parleurs, contrôle de descente HDC. Disponible en 3 coloris : Argent, Gris Graphène, Gris Clair de Lune.", order: 15 },
  { id: 15, brand: "Livan",     model: "X3 PRO",                   year: "2026", cat: "suv",     badge: "new",  badgeText: "Nouveau",        featured: false, price: "7 100 000",  color: "#5C1A5C", colors: ["Blanc Ivoire","Gris Graphène","Bleu Lac de Sel","Argent Superstar"], specs: {Moteur:"1.5T Essence",Places:"5 places",Toit:"Toit ouvrant",Année:"2026",Kilométrage:"0 km — Neuf",Transmission:"Automatique",Garantie:"Garantie constructeur"}, mini: {v1:"1.5T",k1:"essence",v2:"5",k2:"places",v3:"Toit",k3:"ouvrant"}, desc: "Le Livan X3 Pro 2026 est le SUV compact le plus accessible du catalogue. Motorisation 1.5T, transmission automatique, toit ouvrant de série et finitions soignées. Le meilleur point d'entrée pour accéder à un véhicule neuf chinois 0km.", order: 16 },
  { id: 16, brand: "G700",      model: "IIIC FULL OPTION",         year: "2026", cat: "suv",     badge: "new",  badgeText: "Haut de Gamme",  featured: false, price: "38 234 000", color: "#1A1A1A", colors: ["Blanc","Gris","Noir","Bleu"], specs: {Moteur:"2.0 Turbo Essence",Places:"6 places premium",Traction:"4×4 — Différentiels AV+AR verrouillables",Suspension:"Pneumatique adaptative",Autonomie_L2:"AEB, ACC, LKA, Angle mort",Caméra:"360° + 12 radars",Jantes:"20 pouces",Écran_arrière:"17.3 pouces",Climatisation:"Tri-zone",Garantie:"Garantie constructeur"}, mini: {v1:"4×4",k1:"traction intégrale",v2:"6",k2:"places premium",v3:"L2",k3:"conduite autonome"}, desc: "Le G700 Version IIIC Full Option est le SUV haut de gamme absolu du catalogue. 4×4 avec différentiels verrouillables avant et arrière, suspension pneumatique, conduite semi-autonome L2, caméra 360° et 12 radars, écran passagers arrière 17.3 pouces. L'excellence à prix d'import direct.", order: 17 },
];

// ─── MARQUES ──────────────────────────────────────────────────────────────
const BRANDS = [
  { name: "BYD",       desc: "Hybride & Premium",       logo: "https://res.cloudinary.com/daol8mzeg/image/upload/v1772673064/byd_kja47f.png", order: 1 },
  { name: "Changan",   desc: "SUV & Berlines",           logo: "https://res.cloudinary.com/daol8mzeg/image/upload/v1772673170/changan-seeklogo_wzuvcy.png", order: 2 },
  { name: "Jetour",    desc: "SUV & Familiaux",          logo: "https://res.cloudinary.com/daol8mzeg/image/upload/v1772673217/jetour-logo-png_seeklogo-524224_gukfmp.png", order: 3 },
  { name: "GAC Motor", desc: "SUV premium",              logo: "https://res.cloudinary.com/daol8mzeg/image/upload/v1772673266/gac-motor-logo-png_seeklogo-622724_rcnqwl.png", order: 4 },
  { name: "Livan",     desc: "SUV accessibles",          logo: "https://res.cloudinary.com/daol8mzeg/image/upload/v1772673384/Livan_Automotive_logo.svg_ffez0b.png", order: 5 },
  { name: "G700",      desc: "By Jetour · Haut de gamme", logo: "https://res.cloudinary.com/daol8mzeg/image/upload/v1772673217/jetour-logo-png_seeklogo-524224_gukfmp.png", order: 6 },
  { name: "Geely",     desc: "Technologie Volvo",        logo: "https://res.cloudinary.com/daol8mzeg/image/upload/v1772673620/geely-2023-seeklogo_il12la.png", order: 7 },
  { name: "Haval",     desc: "SUV robustes",             logo: "https://res.cloudinary.com/daol8mzeg/image/upload/v1772673678/haval-logo-png_seeklogo-316169_lujkw4.png", order: 8 },
  { name: "Chery",     desc: "Tiggo Series",             logo: "https://res.cloudinary.com/daol8mzeg/image/upload/v1772673726/chery-logo-png_seeklogo-215310_oamtmz.png", order: 9 },
  { name: "MG",        desc: "Design moderne",           logo: "https://res.cloudinary.com/daol8mzeg/image/upload/v1772673758/mg-logo-png_seeklogo-91883_bjqmra.png", order: 10 },
  { name: "GWM",       desc: "Pickups premium",          logo: "https://res.cloudinary.com/daol8mzeg/image/upload/v1772673813/gwm-group-logo-png_seeklogo-385828_fiprgm.png", order: 11 },
  { name: "Omoda",     desc: "Chery premium",            logo: "https://res.cloudinary.com/daol8mzeg/image/upload/v1772673856/omoda-logo-png_seeklogo-483702_nqjtlu.png", order: 12 },
  { name: "Li Auto",   desc: "SUV hybrides",             logo: "https://res.cloudinary.com/daol8mzeg/image/upload/v1772673894/li-auto-logo-png_seeklogo-473371_eqosmv.png", order: 13 },
  { name: "Deepal",    desc: "Changan EV",               logo: "https://res.cloudinary.com/daol8mzeg/image/upload/v1772673944/deepal-global-changan-logo-png_seeklogo-613982_k02cly.png", order: 14 },
  { name: "Nio",       desc: "Électrique luxe",          logo: "https://res.cloudinary.com/daol8mzeg/image/upload/v1772674008/nio-logo-png_seeklogo-427872_fk4ost.png", order: 15 },
  { name: "BAIC",      desc: "Crossovers",               logo: "https://res.cloudinary.com/daol8mzeg/image/upload/v1772674053/baic-logo-png_seeklogo-391483_nsvlyb.png", order: 16 },
  { name: "Dongfeng",  desc: "Utilitaires",              logo: "https://res.cloudinary.com/daol8mzeg/image/upload/v1772674112/dongfeng-logo-png_seeklogo-511934_lwapab.png", order: 17 },
  { name: "Voyah",     desc: "Dongfeng premium",         logo: "https://res.cloudinary.com/daol8mzeg/image/upload/v1772674157/voyah-logo-png_seeklogo-657358_rlinm8.png", order: 18 },
  { name: "Zeekr",     desc: "Geely électrique",         logo: "https://res.cloudinary.com/daol8mzeg/image/upload/v1772674198/zeekr-logo-png_seeklogo-506013_pacfom.png", order: 19 },
  { name: "SAIC",      desc: "Multi-segments",           logo: "https://res.cloudinary.com/daol8mzeg/image/upload/v1772674247/saic-motor-logo-png_seeklogo-385836_dnt5zb.png", order: 20 },
];

// ─── IMPORT ───────────────────────────────────────────────────────────────
async function seed() {
  console.log(`\n🚀 Import vers Sanity (project: ${projectId}, dataset: ${dataset})\n`);

  // Marques
  console.log("📦 Import des marques...");
  for (const brand of BRANDS) {
    await client.createOrReplace({
      _id: `brand-${brand.name.toLowerCase().replace(/\s+/g, "-")}`,
      _type: "brand",
      name: brand.name,
      desc: brand.desc,
      logo: brand.logo,
      order: brand.order,
    });
    process.stdout.write(`  ✓ ${brand.name}\n`);
  }

  // Voitures
  console.log("\n🚗 Import des voitures...");
  for (const car of CARS) {
    const specs = Object.entries(car.specs).map(([key, value]) => ({ _key: key, key, value }));
    const photos = (CAR_PHOTOS[car.id] || []).map((p, i) => ({ _key: `photo-${i}`, label: p.label, src: p.src }));

    await client.createOrReplace({
      _id: `car-${car.id}`,
      _type: "car",
      brand: car.brand,
      model: car.model,
      year: car.year,
      cat: car.cat,
      badge: car.badge,
      badgeText: car.badgeText,
      featured: car.featured || false,
      price: car.price,
      color: car.color,
      colors: car.colors || [],
      photos,
      specs,
      mini_v1: car.mini.v1, mini_k1: car.mini.k1,
      mini_v2: car.mini.v2, mini_k2: car.mini.k2,
      mini_v3: car.mini.v3, mini_k3: car.mini.k3,
      desc: car.desc,
      order: car.order,
    });
    process.stdout.write(`  ✓ ${car.brand} ${car.model}\n`);
  }

  console.log("\n✅ Import terminé ! Rafraîchis le studio pour voir les données.");
}

seed().catch((err) => {
  console.error("❌ Erreur :", err.message);
  process.exit(1);
});

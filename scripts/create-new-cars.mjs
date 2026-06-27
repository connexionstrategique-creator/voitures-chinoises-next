import { createClient } from '@sanity/client'
import { loadEnvConfig } from '@next/env'

loadEnvConfig(process.cwd())

const sanity = createClient({
  projectId: 't3ow1rmc', dataset: 'production',
  token: process.env.SANITY_TOKEN,
  apiVersion: '2024-01-01', useCdn: false,
})

const img = (ref, i) => ({ _type: 'image', _key: 'p' + i, asset: { _type: 'reference', _ref: ref } })

// ── Photos uploadées ──────────────────────────────────────────────────────────
const unizH = [
  'image-de04e5ae3a8508588644d804d4234ed99da09b6a-1041x659-jpg',
  'image-21be24168eb339b8d1d16ca5564ed62a6d8a84b0-1004x651-jpg',
  'image-8d5fdcd8b9f71aa80e4ea6e5d5e5489d24ca5933-997x707-jpg',
  'image-b749d465ae55b69e59da275b32dfc6c7735ff2f0-1039x698-jpg',
  'image-c51aa9ace5b29e2ad59be36315a8568a463d1097-1031x665-jpg',
  'image-fbd0af4a6195b7d2695acf4e74a61df21243c7b0-1045x714-jpg',
  'image-e482e72b006f19ee64543eb369da34b3bc5c8b77-857x630-jpg',
  'image-fbf206c041482c042d291233796b102a64c2d6e4-990x607-jpg',
  'image-4ea67dfe23a6db6310f9f44c9cf2b0425186299f-1018x548-jpg',
  'image-77f7e0b4021a2c918103a074534e7d2ed8565b53-819x629-jpg',
  'image-7fb977990d2eadd7240455dafc76e2ac70a0b086-977x605-jpg',
  'image-1ac5f295d531ccaeaf4485a834a163cf0098a68a-979x704-jpg',
  'image-c689a4341c99378efd456b6e91e69e053d2d6dd8-1037x709-jpg',
  'image-91e891713e5298e80fe9fd5e84d32b8d81f5f24e-1049x708-jpg',
].map(img)

const pony = [
  'image-6e36846375cd03e14e51aa69994069ff2e70de12-662x455-jpg',
  'image-78db8b77dcaf7aab63988a443d860e1c0f9b11fc-590x511-jpg',
  'image-9546f6240d682a546428e2df355250f86317cceb-599x497-jpg',
  'image-cb2b89410164fd97ca6012a6bc66b30dbfae8e54-660x466-jpg',
  'image-08fcfe6ab7cd42614c75fb84788b1143b47bcd22-805x594-jpg',
  'image-b2697d6a527d17ebdaba81af9c404f33e7dda0dd-818x611-jpg',
  'image-c19b0af18213a58a73bf767d1f80dcbe5f751eba-810x607-jpg',
  'image-066b1d9d16561eb9e06b0b2cab2bb32ac8464690-811x610-jpg',
  'image-ac6b5a4e225f36ccf2ffc47ab51d350cff142dbf-800x615-jpg',
  'image-df8bd754bee065ea61994a165bbce33f1a646989-813x614-jpg',
  'image-363b6f4c6232daf299f4da091f9ec2d118e16cad-753x488-jpg',
  'image-73e0fc604c44eefddbd1e121eb87cc7f150a71f2-734x471-jpg',
].map(img)

const tangL = [
  'image-c4c61c2f6b58e0bd155db1c543f46daeb3c5b775-771x494-jpg',
  'image-efc9dbd503cb2fb20dac7b5234549732c5885fd1-741x522-jpg',
  'image-2828e29b17d991ca22ed54b001902a0f68df8490-580x479-jpg',
  'image-38c88dc6471962eff065e923c46d9329a7bcc220-717x531-jpg',
  'image-ffcf39e5b81c361adc9f2505c9669928572721f8-822x614-jpg',
  'image-b4044df0770028acdb539396e570ad7964152f13-754x477-jpg',
  'image-6568ac50012acdd6aeeb8d0b957446638eac658e-824x622-jpg',
  'image-3c2875b8eccd21c16a48a10e26df05d699d36e33-814x618-jpg',
  'image-2905b465c565f8b06e5d5a9f6dfcba7cb15fd3fa-824x622-jpg',
  'image-606538365b3b9511a22efc1e12f2fa698017ccbb-817x617-jpg',
  'image-3a763e2c2c94dbfc211fc712e695e6357fbeff5f-819x606-jpg',
  'image-0e819084f681c13a610d0dbdeea72f37c911c167-816x620-jpg',
].map(img)

const qin = [
  'image-90e1861f72f0c87cbf6c4bc7a65bb937ded1089a-738x459-jpg',
  'image-3a8ade032134ff401540b4f38a62ae9fa56d18b2-704x430-jpg',
  'image-634d50beb56bac871df086b89b0dc242deaa2b73-564x449-jpg',
  'image-cf02952649d5003f9e22fc0f47cd445caebc28b7-537x474-jpg',
  'image-e02d7a3f2f4d02e21b694359d96abfe395fbae45-861x635-jpg',
  'image-e6f624f16a777ea0284ae56f1991b1ec7a8c72e3-848x631-jpg',
  'image-7d4c99c620d313668671af63a7672ed2de39ec1f-878x651-jpg',
  'image-8ba1e7f49eac8904e34ccc335b97a22304e59518-734x468-jpg',
  'image-eafe821a53de75a636821b31b02975cf8668524c-850x655-jpg',
  'image-8758d1ca142d6266d5a26489483c3c663c9a2783-869x622-jpg',
  'image-f07b9e356738d5ed61540c09b193bd2d76157148-872x666-jpg',
  'image-29c7664c8fdfb4734c356bac4e4b7ce82c77995e-858x645-jpg',
].map(img)

const unitBlanc = [
  'image-0839877050d354deefeb64c0f43b612577132e89-928x569-jpg',
  'image-ed4db9a1f43d13b51c825dda5d06e3bb38af1c78-946x605-jpg',
  'image-9ded95c9b3f4cdaac32a17fb56ba3b5fd8b779a2-773x569-jpg',
  'image-28d6c9cc3f4ffe5703278891fb796d620136cf68-1017x650-jpg',
  'image-e0ef50c6f8ee4faa8ab494a3cf114469aee6d0ce-1065x730-jpg',
  'image-d26ab9c18375a73e2e414970b8f25879485e4b7a-1037x717-jpg',
  'image-1e689bd33b4aa44f899f3095cf1fc98fb906edd0-1028x667-jpg',
  'image-c75879d0c3afcad7e200e806834d55df01190f62-1022x665-jpg',
  'image-862d5095509544b17c2d33bd607f03bca633f996-1022x691-jpg',
].map(img)

const unitBleu = [
  'image-153a40b7988b814d22378a9c3faf82f941b61363-895x560-jpg',
  'image-4f3dcaaef8bb222d0cace1ec370c8c0c8412573b-746x566-jpg',
  'image-db5af1d9c434aafdcc8e9e2ddae0933d46743552-856x479-jpg',
  'image-15613ad40eb210352b2eaef67e7acaa743caede5-846x484-jpg',
  'image-203721a7c21a3ccf45917f7793181c4ec3d67dba-962x485-jpg',
  'image-c9f710acb93eee6a60414732f910569080d2c501-763x528-jpg',
].map(img)

// ── 1. Changan UNI-Z Hybride 2025 ────────────────────────────────────────────
await sanity.createOrReplace({
  _type: 'car', _id: 'car-31',
  brand: 'Changan', model: 'UNI-Z Hybride 2025', cat: 'SUV hybride', year: 2025,
  price: '11 700 000', photos: unizH,
  desc: "Le Changan UNI-Z Hybride 2025 est un SUV compact PHEV iDD de nouvelle génération. Son moteur électrique de 214 ch offre 125 km d'autonomie électrique et 1 200 km en combiné avec seulement 1,3 L/100 km. Batterie LFP 18,4 kWh garantie à vie. Équipé du double écran 14,6\", de l'IA vocale, du CarPlay sans fil, de la caméra 540° et d'une sellerie cuir caramel premium. Livré CIF à Cotonou, Lomé et Abidjan.",
  specs: {
    moteur: '1.5L + électrique 158 kW (214 ch)',
    batterie: '18,4 kWh LFP — garantie à vie',
    autonomie_elec: '125 km CLTC',
    autonomie_totale: '1 200 km',
    conso: '1,3 L/100 km WLTC',
    zero_cent: '7,4 s',
    longueur: '4 730 mm',
    largeur: '1 890 mm',
    hauteur: '1 680 mm',
    empattement: '2 795 mm',
    coffre: '638 L (1 425 L sièges rabattus)',
    places: '5',
    traction: 'Avant',
    carburant: 'PHEV — électrique + essence',
  },
})
console.log('✅ car-31 Changan UNI-Z Hybride 2025')

// ── 2. Bestune PONY 2026 ─────────────────────────────────────────────────────
await sanity.createOrReplace({
  _type: 'car', _id: 'car-32',
  brand: 'Bestune', model: 'PONY 2026 — Édition Colorful', cat: 'Citadine électrique', year: 2026,
  price: '4 000 000', photos: pony,
  desc: "La Bestune Pony 2026 Édition Colorful est une micro citadine électrique 4 places signée FAW Bestune, idéale pour la ville africaine. Son moteur de 30 kW et sa batterie LFP de 18,11 kWh offrent 222 km d'autonomie CLTC. Recharge complète en 6 heures. Équipée d'un écran tactile 10,1\", d'un assistant vocal IA, du CarPlay, d'une caméra de recul et de couleurs exclusives Rose Cerise et Bleu Glace Coco. Prix CIF tout inclus livré à Cotonou, Lomé et Abidjan.",
  specs: {
    moteur: 'Synchrone aimants permanents 30 kW / 110 N·m',
    batterie: '18,11 kWh LFP',
    autonomie: '222 km CLTC (180-200 km réels)',
    recharge: 'Lente uniquement — 6h pleine charge',
    longueur: '3 000 mm',
    largeur: '1 510 mm',
    hauteur: '1 630 mm',
    empattement: '1 953 mm',
    places: '4',
    traction: 'Arrière',
    carburant: '100% Électrique',
  },
})
console.log('✅ car-32 Bestune PONY 2026')

// ── 3. BYD TANG L 2025 ───────────────────────────────────────────────────────
await sanity.createOrReplace({
  _type: 'car', _id: 'car-33',
  brand: 'BYD', model: 'TANG L 2025', cat: 'SUV électrique', year: 2025,
  price: '25 800 000', photos: tangL,
  desc: 'Le BYD TANG L 2025 est le SUV 100% électrique Flagship de BYD, doté d\'un double moteur 4WD développant 810 kW (1 102 ch) pour un 0-100 km/h en 3,9 s. Autonomie CLTC 600 km. Équipé du LiDAR ADAS, d\'un triple écran, de sièges Nappa chauffants/ventilés/massants, d\'un système audio premium, du V2L et de la charge sans fil 50W. Prix CIF tout inclus livré à Cotonou, Lomé et Abidjan. Dédouanement non inclus.',
  specs: {
    moteur: 'Double moteur électrique 4WD — 810 kW (1 102 ch)',
    couple: '860 N·m',
    autonomie: '600 km CLTC',
    zero_cent: '3,9 s',
    places: '7',
    traction: '4WD intégral',
    carburant: '100% Électrique',
    adas: 'LiDAR, ACC, AEB, centrage voie, 540°',
  },
})
console.log('✅ car-33 BYD TANG L 2025')

// ── 4. Changan UNI-T 2024 (colorGroups) ─────────────────────────────────────
await sanity.createOrReplace({
  _type: 'car', _id: 'car-34',
  brand: 'Changan', model: 'UNI-T 2024', cat: 'SUV', year: 2024,
  price: '10 100 000',
  colorGroups: [
    { _key: 'blanc', color: 'Blanc', photos: unitBlanc },
    { _key: 'bleu',  color: 'Bleu',  photos: unitBleu  },
  ],
  desc: "Le Changan UNI-T 2024 est un SUV compact sportif équipé du moteur Blue Whale 1.5T de 188 ch et de la boîte DCT 7 rapports. Design futuriste, double écran 12,3\"+12,8\", assistant vocal sans mot de réveil, reconnaissance faciale, contrôle gestuel, ACC pleine vitesse, caméra 540° et châssis transparent. Jantes 20 pouces, toit panoramique sky roof. Prix CIF tout inclus livré à Cotonou, Lomé et Abidjan.",
  specs: {
    moteur: 'Blue Whale 1.5T 138 kW / 188 ch',
    couple: '300 N·m',
    boite: 'DCT double embrayage humide 7 rapports',
    conso: '6,45 L/100 km WLTC',
    longueur: '4 535 mm',
    largeur: '1 870 mm',
    hauteur: '1 565 mm',
    empattement: '2 710 mm',
    places: '5',
    traction: 'Avant',
    carburant: 'Essence RON92',
    jantes: '20 pouces',
  },
})
console.log('✅ car-34 Changan UNI-T 2024')

// ── 5. BYD QIN PLUS DM-i 2025 ───────────────────────────────────────────────
await sanity.createOrReplace({
  _type: 'car', _id: 'car-35',
  brand: 'BYD', model: 'QIN PLUS DM-i 2025', cat: 'Berline hybride', year: 2025,
  price: '8 400 000', photos: qin,
  desc: "La BYD QIN PLUS DM-i 2025 est une berline hybride rechargeable 5 places alliant économie et technologie. Son système EHS offre 55 km d'autonomie électrique et seulement 1,74 L/100 km en mixte. Batterie LFP à refroidissement liquide avec garantie illimitée (durée & kilométrage) pour le 1er propriétaire. Équipée du système DiLink, d'une caméra de recul, du frein de stationnement électronique et de la clé NFC. Prix CIF tout inclus livré à Cotonou, Lomé et Abidjan.",
  specs: {
    moteur: '1.5L hybride + système EHS E-CVT',
    autonomie_elec: '55 km CLTC',
    conso: '1,74 L/100 km mixte',
    batterie: 'LFP refroidissement liquide — garantie illimitée',
    longueur: '4 780 mm',
    largeur: '1 837 mm',
    hauteur: '1 515 mm',
    empattement: '2 718 mm',
    places: '5',
    traction: 'Avant',
    carburant: 'PHEV — hybride rechargeable',
  },
})
console.log('✅ car-35 BYD QIN PLUS DM-i 2025')

// ── Mise à jour BYD Léopard 8 / Fangchengbao BA 8 ───────────────────────────
await sanity.patch('car-2').set({
  desc: "Le Fangchengbao BA 8 (BYD Léopard 8) est un SUV 7 places 5 portes sur châssis sur longerons, propulsé par le système DMO tout-terrain. Son moteur 2.0T 272 ch associé à deux moteurs électriques délivre 550 kW de puissance combinée et 760 N·m. Batterie 36,8 kWh — autonomie électrique 100 km WLTC, autonomie totale 1 200 km, consommation 1,79 L/100 km. Équipé du système Huawei ADS 3.0 avec LiDAR, de 14 airbags, de 4 écrans (17,3\"+12,3\"+12,3\"+AR-HUD 50\"), de sièges Nappa complets et du système audio Devialet 18 haut-parleurs. Prix CIF tout inclus.",
  specs: {
    moteur: '2.0T 272 ch + double moteur électrique 4WD',
    puissance_systeme: '550 kW / 760 N·m',
    zero_cent: '4,8 s',
    vmax: '180 km/h',
    batterie: '36,8 kWh',
    autonomie_elec: '100 km WLTC',
    autonomie_totale: '1 200 km',
    conso: '1,79 L/100 km WLTC',
    charge_rapide: '30→80% en 0,27h',
    dimensions: '5 195 × 1 994 × 1 905 mm',
    places: '7 (2+3+2)',
    airbags: '14 airbags',
    adas: 'Huawei ADS 3.0 L2+ — LiDAR',
    ecrans: '17,3" + 12,3" + 12,3" + AR-HUD 50"',
    audio: 'Devialet 18 haut-parleurs',
    offroad: 'Gué 900 mm · Pivot sur place · 4WD basse vitesse · Diff arrière verrouillable',
    suspension: 'Hydraulique intelligente Yunlian-P (rigidité et hauteur ajustables)',
  },
}).commit()
console.log('✅ BYD Léopard 8 (BA 8) specs mis à jour')

// ── Mise à jour G700 — International Edition III ─────────────────────────────
await sanity.patch('car-16').set({
  model: 'IIIC FULL OPTION — Édition III',
  desc: "Le G700 IIIC est un SUV 6 places sur châssis sur longerons, hybride rechargeable de très haute gamme. Son moteur 2.0TD 211 ch et son double moteur électrique 4WD délivrent 665 kW de puissance système et 1 135 N·m de couple. Batterie 34,13 kWh, autonomie électrique 110 km WLTC (138 km CLTC), autonomie totale 1 100 km. Plateforme 800V à charge rapide. Suspension pneumatique + électromagnétique, différentiels avant et arrière verrouillables, gué 900 mm, capacité de remorquage 2 500 kg. Écran central 15,6\" + écran arrière 17,3\". Audio Lexicon 18 haut-parleurs. Prix CIF tout inclus.",
  specs: {
    moteur: '2.0TD 155 kW / 211 ch, Miller cycle',
    moteur_avant: '210 kW / 360 N·m',
    moteur_arriere: '300 kW / 435 N·m',
    puissance_systeme: '665 kW / 1 135 N·m',
    batterie: '34,13 kWh — Plateforme 800V',
    autonomie_elec: '110 km WLTC / 138 km CLTC',
    autonomie_totale: '1 100 km',
    zero_cent: '4,8 s',
    dimensions: '5 153 × 2 050 × 1 960 mm',
    empattement: '2 850 mm',
    garde_au_sol: '230 mm',
    places: '6 (2+2+2)',
    reservoir: '100 L',
    remorquage: '2 500 kg',
    pneus: '275/60 R20',
    suspension: 'Pneumatique + électromagnétique (Éd. III)',
    offroad: 'Gué 900 mm · Pente 45° · Pivot sur place · 4WD basse · Diff AV+AR verrouillables',
    ecrans: '15,6" central + 17,3" arrière',
    audio: 'Lexicon 18 haut-parleurs',
    carburant: 'PHEV — hybride rechargeable',
  },
}).commit()
console.log('✅ G700 IIIC specs mis à jour (Édition III)')

console.log('\n🎉 Tout terminé !')

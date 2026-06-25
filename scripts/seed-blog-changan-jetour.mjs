import { createClient } from "@sanity/client";
import https from "https";
import http from "http";

const TOKEN = "skyztPiIY9B6QnGxPk1LGpDi4AbqNDaoHoPCDmSxsvBhzLFCjt198UNt8b3Hp7lq7eWIMWsJ9PVsYfDlE";
const client = createClient({ projectId: "t3ow1rmc", dataset: "production", apiVersion: "2024-01-01", useCdn: false, token: TOKEN });

function downloadBuffer(url) {
  return new Promise((resolve, reject) => {
    const proto = url.startsWith("https") ? https : http;
    proto.get(url, { headers: { "User-Agent": "Mozilla/5.0", "Accept": "image/jpeg,image/*" } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) return resolve(downloadBuffer(res.headers.location));
      const chunks = [];
      res.on("data", c => chunks.push(c));
      res.on("end", () => resolve(Buffer.concat(chunks)));
      res.on("error", reject);
    }).on("error", reject);
  });
}
async function upload(url, filename) {
  const buf = await downloadBuffer(url);
  const a = await client.assets.upload("image", buf, { filename, contentType: "image/jpeg" });
  return a._id;
}
const PX = id => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1920`;

let _k = 1;
const k = () => `k${String(_k++).padStart(5,"0")}`;
const p    = t  => ({ _type:"block", _key:k(), style:"normal",     markDefs:[], children:[{_type:"span",_key:k(),text:t,marks:[]}] });
const h2   = t  => ({ _type:"block", _key:k(), style:"h2",         markDefs:[], children:[{_type:"span",_key:k(),text:t,marks:[]}] });
const h3   = t  => ({ _type:"block", _key:k(), style:"h3",         markDefs:[], children:[{_type:"span",_key:k(),text:t,marks:[]}] });
const h4   = t  => ({ _type:"block", _key:k(), style:"h4",         markDefs:[], children:[{_type:"span",_key:k(),text:t,marks:[]}] });
const qt   = t  => ({ _type:"block", _key:k(), style:"blockquote", markDefs:[], children:[{_type:"span",_key:k(),text:t,marks:[]}] });
const li   = t  => ({ _type:"block", _key:k(), style:"normal", listItem:"bullet", level:1, markDefs:[], children:[{_type:"span",_key:k(),text:t,marks:[]}] });
const img  = (id, alt, cap) => ({ _type:"image", _key:k(), asset:{_type:"reference",_ref:id}, alt, caption: cap||"" });

// Bold+normal inline helper
const pb = (bold, normal) => ({
  _type:"block", _key:k(), style:"normal", markDefs:[],
  children:[
    {_type:"span",_key:k(),text:bold,marks:["strong"]},
    {_type:"span",_key:k(),text:normal,marks:[]}
  ]
});

async function main() {
  console.log("🖼️  Upload images...");
  const coverId   = await upload(PX(7629179),  "changan-jetour-cover-showroom.jpg");
  const engineId  = await upload(PX(5158160),  "changan-engine-interior.jpg");
  const phevId    = await upload(PX(9800009),  "phev-charging-electric.jpg");
  const roadId    = await upload(PX(4577418),  "suv-road-africa.jpg");
  const techId    = await upload(PX(36718053), "changan-tech-dashboard.jpg");
  console.log("✓ Images uploadées\n");

  const body = [
    // ─── INTRODUCTION ────────────────────────────────────────────────────────
    p("Depuis que nous importons des véhicules Changan et Jetour en Afrique de l'Ouest, trois questions reviennent systématiquement dans notre boîte WhatsApp. Toujours les mêmes. Toujours posées avec la même inquiétude sincère : \"Essence 92, c'est vraiment bon pour le moteur ?\", \"98 chevaux pour un SUV, c'est léger non ?\", et surtout, la question qui cristallise toutes les peurs : \"Ces voitures chinoises ne prennent-elles pas feu sous la chaleur de Cotonou ?\""),
    p("Ces questions méritent une réponse sérieuse. Pas une réponse commerciale. Pas une esquive. Une réponse technique, factuelle, honnête — avec les données réelles des constructeurs, les spécifications vérifiables, et surtout, la clarté sur ce qui est vrai, ce qui est faux, et ce qui demande simplement une bonne maintenance."),
    p("Cet article est long. Volontairement. Parce que les sujets techniques méritent du temps, et parce que nous pensons que vous méritez une explication complète avant d'investir plusieurs millions de FCFA dans un véhicule. Vous allez découvrir pourquoi l'indice d'octane 92 est parfaitement adapté aux moteurs Blue Whale de Changan, comment 98 chevaux thermiques peuvent donner 313 chevaux combinés sur le PHEV, et pourquoi la peur des incendies vient d'un malentendu sur la maintenance, pas sur la conception."),
    p("Nous couvrons ici quatre modèles : le Changan X5 Plus 1.5T, le Changan UniZ 2026 1.5T, le Jetour Dashing 1.5T, et le Changan UniZ PHEV 2025. Lisez ce que vous voulez, dans l'ordre que vous souhaitez. Chaque section est autonome."),

    img(coverId, "Showroom Changan Jetour — véhicules chinois modernes", "Changan et Jetour : deux marques qui redéfinissent le rapport qualité/prix sur le marché africain en 2026."),

    // ─── SECTION 1 : ESSENCE 92 vs 95 ────────────────────────────────────────
    h2("1. Essence 92 vs Essence 95 — Ce que ça change vraiment"),
    h3("L'indice d'octane : une mesure de résistance, pas de qualité"),
    p("L'indice RON (Research Octane Number) — c'est le chiffre \"92\" ou \"95\" que vous voyez à la pompe — mesure la résistance de l'essence à l'auto-inflammation prématurée sous compression. Plus le chiffre est élevé, plus l'essence résiste à la pression avant d'être allumée par la bougie."),
    p("Ce que beaucoup ignorent : chaque moteur a une pression de compression spécifique, et le constructeur choisit l'indice d'octane optimal pour cette compression. Un moteur conçu pour le RON 92 n'est pas un moteur \"moins bon\" qu'un moteur pour RON 95 — il est simplement calibré différemment. Utiliser du 95 dans un moteur prévu pour du 92 ne donne aucun avantage mesurable, et peut même créer des dépôts sur les injecteurs dans certains cas."),
    h3("Ce que disent les fiches techniques de nos modèles"),
    p("Voici les spécifications officielles de carburant pour chacun de nos quatre modèles :"),
    li("Changan X5 Plus 1.5T Blue Whale JL473ZQD : RON 92 recommandé / RON 95 compatible"),
    li("Changan UniZ 2026 1.5T Blue Whale : RON 92 recommandé / RON 95 compatible"),
    li("Jetour Dashing 1.5T SQRE4T15C : RON 92 recommandé"),
    li("Changan UniZ PHEV 2025 (moteur thermique JL469Q1) : RON 92 recommandé"),
    p("Ces recommandations sont définies par les ingénieurs qui ont conçu le moteur. Elles ne sont pas arbitraires. Le moteur Blue Whale de Changan, par exemple, fonctionne avec un taux de compression de 10,5:1 — parfaitement adapté au RON 92. Le moteur PHEV utilise le cycle Atkinson (une variante du cycle Otto à expansion prolongée) qui, de par sa conception, opère à des températures de combustion plus basses et se satisfait très bien du RON 92."),
    h3("Tableau comparatif : RON 92 vs RON 95 sur nos modèles"),
    p("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"),
    p("Modèle                  │ RON recommandé │ RON toléré │ Gain avec 95"),
    p("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"),
    p("Changan X5 Plus 1.5T    │ RON 92         │ RON 95     │ Aucun mesurable"),
    p("Changan UniZ 2026 1.5T  │ RON 92         │ RON 95     │ Aucun mesurable"),
    p("Jetour Dashing 1.5T     │ RON 92         │ RON 95     │ Aucun mesurable"),
    p("UniZ PHEV 2025          │ RON 92         │ RON 95     │ Aucun mesurable"),
    p("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"),
    h3("FAQ : Et si je mets du 95 au lieu du 92 ?"),
    p("Aucun problème mécanique. Vous pouvez mettre du 95 sans abîmer le moteur. Mais vous payez plus cher sans bénéfice technique. Le calculateur moteur (ECU) de ces véhicules est calibré pour RON 92 — il n'avancera pas l'allumage de façon significative avec du 95, contrairement à un moteur haute performance prévu pour du 98."),
    h3("FAQ : Et en Afrique où la qualité de l'essence varie ?"),
    p("Question cruciale. La réalité en Afrique de l'Ouest est que la qualité de l'essence peut varier selon les stations et les pays. Les moteurs Blue Whale de Changan intègrent un capteur de cliquetis (knock sensor) qui ajuste en temps réel l'avance à l'allumage si la qualité du carburant est inférieure au standard. Le moteur se protège automatiquement en retardant légèrement l'allumage — au prix d'une très légère perte de puissance (2-3%) imperceptible en conduite normale."),
    qt("\"Ce n'est pas l'indice d'octane qui protège votre moteur — c'est le knock sensor électronique. Et nos modèles en sont tous équipés.\""),

    // ─── SECTION 2 : 1.5L vs 1.5T ────────────────────────────────────────────
    h2("2. Moteur 1.5L vs Moteur 1.5T — Comprendre la différence"),

    img(engineId, "Moteur Changan Blue Whale 1.5T — intérieur technique", "Le moteur Blue Whale 1.5T de Changan : injection haute pression à 500 bar, turbocompresseur intégré."),

    h3("L'analogie des poumons"),
    p("Imaginez deux sportifs qui courent 100 mètres. Le premier respire normalement, à pression atmosphérique. Le second utilise un masque qui comprime l'air qu'il inhale — il reçoit donc plus d'oxygène à chaque respiration, peut brûler plus de carburant, et fournit plus d'effort. C'est exactement la différence entre un moteur naturellement aspiré (NA) et un moteur turbo."),
    p("Le moteur naturellement aspiré aspire l'air ambiant à la pression atmosphérique (environ 1 bar). Le moteur turbocompressé utilise les gaz d'échappement pour faire tourner une turbine qui comprime l'air d'admission à 1,5 à 2 bars. Il reçoit 50 à 100% plus d'air à chaque cycle — et peut donc injecter plus d'essence pour plus de puissance."),
    h3("Moteur naturellement aspiré : le cas UniZ PHEV"),
    p("Le Changan UniZ PHEV 2025 utilise un moteur thermique naturellement aspiré JL469Q1 de 1,5L en cycle Atkinson. Cycle Atkinson signifie que la phase d'expansion des gaz est plus longue que la phase de compression — une technique qui maximise l'efficacité thermique au détriment de la puissance brute. Résultat : 98 ch thermiques, mais une consommation exceptionnellement basse et une production de chaleur réduite."),
    p("Pourquoi ce choix dans un hybride ? Parce que dans un PHEV, le moteur thermique n'a pas besoin d'être le \"héros\" de la puissance. C'est le moteur électrique qui gère les accélérations franches. Le thermique sert de générateur d'appoint et de propulseur longue distance. Il n'a pas besoin d'être puissant — il doit être efficient. D'où le cycle Atkinson."),
    h3("Moteur turbo : X5 Plus, UniZ 2026 et Jetour Dashing"),
    p("Les trois modèles essence de notre gamme utilisent des moteurs turbocompressés 1,5L. Deux familles distinctes :"),
    pb("Changan Blue Whale JL473ZQD (X5 Plus) et Blue Whale (UniZ 2026) : ", "Moteur de nouvelle génération avec injection directe haute pression à 500 bar (contre 200 bar pour la plupart des concurrents). Le turbo à géométrie variable permet d'avoir du couple dès 1 500 tr/min — la voiture répond immédiatement à l'accélérateur, sans \"trou\" caractéristique des anciens turbos."),
    pb("Jetour SQRE4T15C (Dashing) : ", "Moteur développé par Chery pour ses marques premium. Turbo à pression moins élevée, 156 ch — configuration axée sur la douceur et l'accessibilité plutôt que la performance."),
    h3("Avantages et inconvénients de chaque technologie"),
    p("MOTEUR NATURELLEMENT ASPIRÉ (UniZ PHEV thermique) :"),
    li("Avantages : fiabilité maximale (moins de composants complexes), démarrage immédiat par grand froid, longévité supérieure à hautes températures ambiantes"),
    li("Inconvénients : puissance brute limitée (compensée par l'électrique dans ce cas)"),
    p("MOTEUR TURBO (X5 Plus, UniZ 2026, Dashing) :"),
    li("Avantages : puissance élevée pour une cylindrée réduite, couple disponible dès bas régime, consommation maîtrisée hors charge"),
    li("Inconvénients : intercooler nécessaire (géré en usine), légère complexité supplémentaire vs NA"),
    h3("Tableau technique complet"),
    p("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"),
    p("Modèle             │ Moteur      │ Puissance │ Couple  │ 0-100 │ Conso"),
    p("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"),
    p("Changan X5 Plus    │ 1.5T turbo  │ 192 ch    │ 310 Nm  │ 7.5 s │ 6.95 L"),
    p("Changan UniZ 2026  │ 1.5T turbo  │ 192 ch    │ 310 Nm  │ 7.8 s │ 7.13 L"),
    p("Jetour Dashing     │ 1.5T turbo  │ 156 ch    │ 230 Nm  │ 9.5 s │ 7.8 L"),
    p("UniZ PHEV (therm.) │ 1.5L NA     │ 98 ch     │ 125 Nm  │ —     │ 1.3 L*"),
    p("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"),
    p("(*) Consommation WLTC en mode hybride rechargé. En mode thermique seul : 5.15 L/100 km."),
    h3("Quel moteur pour quel client ?"),
    li("Vous faites surtout de la ville, Cotonou ou Abidjan → UniZ PHEV ou X5 Plus (couple immédiat, confort en trafic)"),
    li("Vous avez besoin d'un SUV familial polyvalent → X5 Plus 1.5T ou UniZ 2026 (192 ch, boîte 7DCT fluide)"),
    li("Budget plus serré, usage modéré → Jetour Dashing (156 ch largement suffisants pour usage quotidien)"),
    li("Longs trajets interurbains fréquents → UniZ PHEV (5,15 L/100 en mode thermique = économies massives)"),

    // ─── SECTION 3 : FEU ─────────────────────────────────────────────────────
    h2("3. Les voitures chinoises prennent-elles feu en Afrique ? La vérité"),

    img(roadId, "SUV chinois sur route africaine — conditions thermiques réelles", "Nos véhicules roulent quotidiennement en Afrique de l'Ouest. Le mythe de l'incendie ne résiste pas à l'examen technique."),

    h3("D'où vient ce mythe ?"),
    p("Soyons honnêtes sur l'origine de cette crainte. Elle vient principalement de trois sources : des vidéos virales sur les réseaux sociaux (souvent sans contexte ni vérification de la marque), des témoignages de second ou troisième main, et parfois d'une confusion entre différents types d'incidents — incendies électriques sur véhicules mal entretenus, accidents de transport, ou incidents sur des véhicules bas de gamme sans rapport avec nos modèles."),
    p("Aucun mythe ne naît de rien. Il y a eu des cas réels d'incendies sur certains véhicules chinois bas de gamme, souvent en raison d'un câblage électrique sous-dimensionné ou d'une maintenance absente. Ces cas existent, et nous ne les nions pas. Mais les confondre avec des modèles Changan ou Jetour de gamme moyenne/haute de 2024-2026, c'est comme dire qu'une Dacia Sandero ayant brûlé prouve que toutes les voitures françaises brûlent."),
    h3("La réalité thermique de nos moteurs"),
    p("Nos quatre modèles intègrent des systèmes de gestion thermique complets et redondants. Voici ce qui protège réellement le moteur à 40°C ambiants (la situation de Cotonou en saison sèche) :"),
    pb("Radiateur principal : ", "Aluminium haute capacité, dimensionné pour +15°C de marge par rapport aux températures ambiantes maximales prévues. Les moteurs Blue Whale de Changan sont testés en chambre thermique à 50°C ambiants avant leur commercialisation."),
    pb("Intercooler (sur les modèles turbo) : ", "Refroidit l'air comprimé par le turbo avant qu'il entre dans le moteur. Sans intercooler, l'air chaud comprimé ferait monter la température de combustion de façon dangereuse. Avec intercooler, la température d'admission reste contrôlée même à 40°C ambiants."),
    pb("Thermostat électronique : ", "Gère dynamiquement le circuit de refroidissement selon la charge moteur et la température ambiante. En conduite africaine (arrêts fréquents, trafic dense), il maintient la plage de fonctionnement optimale 85-100°C."),
    pb("Ventilateurs électriques doubles : ", "Contrairement aux anciens véhicules à ventilateur mécanique (entraîné par le moteur), les ventilateurs électriques continuent de fonctionner pendant 3 à 5 minutes après l'arrêt du moteur, évacuant la chaleur résiduelle."),
    pb("Sonde de température et protection ECU : ", "Si la température dépasse un seuil critique, l'ECU réduit automatiquement l'injection d'essence et la puissance moteur. Le véhicule ne s'éteint pas brusquement — il vous prévient par voyant et réduit la puissance progressivement."),
    h3("Comparaison factuelle : Toyota Land Cruiser 80 d'occasion vs Changan X5 Plus neuf"),
    p("Le Land Cruiser 80 est souvent cité comme référence de \"robustesse africaine\". C'est une excellente voiture — pour son époque. Comparons objectivement le contexte thermique :"),
    p("Toyota Land Cruiser 80 (1990-1997) : Moteur 4.2L diesel 6 cylindres, radiateur en acier, thermostat mécanique, ventilateur mécanique, âge moyen du parc en Afrique de l'Ouest > 20 ans, maintenance souvent artisanale, joints de culasse en fin de vie."),
    p("Changan X5 Plus 2026 : Moteur 1.5T, radiateur aluminium sur-dimensionné, ECU thermique actif, double ventilateur électrique, véhicule neuf 0 km avec garantie constructeur."),
    p("La question n'est pas : quelle marque est \"plus résistante à la chaleur\" ? La question est : quel véhicule, dans son état réel actuel, risque davantage un problème thermique ? Un Land Cruiser de 25 ans avec un radiateur bouché et des durites d'origine, ou un X5 Plus neuf avec tous ses systèmes fonctionnels ?"),
    h3("Cas spécifique : la batterie LFP du UniZ PHEV — peut-elle s'enflammer ?"),
    p("C'est la question la plus légitime de toutes, et elle mérite une réponse précise. La batterie du UniZ PHEV 2025 utilise une chimie LFP (Lithium Fer Phosphate). Voici pourquoi c'est important :"),
    p("La chimie LFP est fondamentalement différente des batteries NMC (Nickel Manganèse Cobalt) utilisées dans les téléphones et certains véhicules électriques bon marché. La liaison chimique du fer et du phosphate dans la cathode est extrêmement stable thermiquement. Pour provoquer un emballement thermique (thermal runaway) sur une batterie LFP, il faut des conditions très extrêmes : court-circuit interne + charge à plus de 200% de la capacité nominale OU dommage physique sévère (accident de la route à haute énergie)."),
    p("BYD, qui fabrique des batteries LFP depuis 2005, a effectué le test dit du \"clou\" (nail penetration test) sur ses batteries Blade : percer la batterie avec un clou en acier ne provoque ni feu ni explosion — juste une légère élévation de température. La batterie du UniZ PHEV utilise une technologie similaire."),
    qt("\"Un incendie de voiture, c'est presque toujours un problème de maintenance ou d'accident — pas un défaut de conception. Les statistiques d'incendies par marque et par région le confirment.\""),
    h3("Les vrais risques thermiques — parlons-en honnêtement"),
    p("Puisque nous voulons être transparents, voici les VRAIS risques thermiques sur ces véhicules, qui ont rien à voir avec la conception mais tout à voir avec la maintenance :"),
    li("Changement d'huile moteur négligé : l'huile dégradée perd ses propriétés lubrifiantes et crée de la chaleur par friction excessive. Intervalle recommandé : 10 000 km ou 6 mois."),
    li("Liquide de refroidissement non changé : un liquide de refroidissement dégradé perd son point d'ébullition élevé et peut créer des bulles dans le circuit (cavitation), réduisant l'efficacité du refroidissement."),
    li("Filtre à air colmaté : réduit l'admission d'air, force le moteur à travailler plus fort pour la même puissance, augmente la chaleur de combustion."),
    li("Ceintures de roue usées sur turbo (rare mais possible sur véhicule ancien mal entretenu) : le turbo tourne à 150 000 tr/min — si le palier manque de lubrification, il chauffe. Sur un véhicule neuf sous garantie, ce risque est nul."),
    h3("Changan en Égypte et au Moyen-Orient : les chiffres"),
    p("L'Égypte connaît des étés à 45°C ambiants, parfois 50°C en désert. Le Moyen-Orient dépasse régulièrement 48°C à l'ombre. Changan y vend plusieurs dizaines de milliers de véhicules par an depuis plus de dix ans — avec un taux d'incidents thermiques statistiquement identique à celui des Toyota et Hyundai vendus dans les mêmes marchés. Si la chaleur africaine posait un problème systémique de conception, nous le saurions depuis longtemps."),
    p("Conclusion honnête : Ce n'est pas la température qui fait brûler les voitures. C'est l'absence de maintenance. Et cette règle s'applique à n'importe quelle marque, Toyota inclus."),

    // ─── SECTION 4 : PHEV ────────────────────────────────────────────────────
    h2("4. Le Changan UniZ PHEV 2025 — Comment 98 ch devient 313 ch"),

    img(phevId, "Changan UniZ PHEV — recharge électrique", "Le Changan UniZ PHEV : 313 chevaux combinés, 1,3 L/100 km en mode hybride, 125 km d'autonomie électrique."),

    h3("Le mythe : \"98 chevaux, c'est trop faible pour un SUV\""),
    p("Ce chiffre de 98 ch est le plus souvent cité par des clients qui ont ouvert la fiche technique sans lire la ligne suivante. Oui, le moteur thermique JL469Q1 développe 98 ch à lui seul. Mais dans un hybride rechargeable, le moteur thermique n'est jamais seul."),
    h3("Comment fonctionne l'addition de puissance dans un PHEV"),
    p("Le Changan UniZ PHEV dispose de deux sources de puissance qui peuvent fonctionner simultanément :"),
    pb("Moteur thermique JL469Q1 : ", "1,5L naturellement aspiré, cycle Atkinson, 98 ch (72 kW), 125 Nm de couple."),
    pb("Moteur électrique arrière : ", "158 kW (215 ch), 330 Nm de couple. Alimenté par la batterie LFP 18,4 kWh."),
    pb("Puissance combinée certifiée : ", "313 ch — ce chiffre est homologué selon les normes chinoises CAFC et WLTC."),
    p("Quand vous appuyez sur l'accélérateur, l'ECU central décide en quelques millisecondes comment répartir la demande entre les deux moteurs. En accélération franche, les deux fonctionnent ensemble. En croisière à 90 km/h, souvent seul le thermique suffit. En ville à faible vitesse, souvent seul l'électrique travaille."),
    h3("L'accélération réelle : 0-100 km/h en 7,4 secondes"),
    p("7,4 secondes pour 0 à 100 km/h. Comparons avec quelques références familières :"),
    li("Toyota Fortuner 2.7L essence : 0-100 en environ 13 secondes"),
    li("Toyota Hilux double cab 2.8 diesel : 0-100 en environ 11 secondes"),
    li("Hyundai Tucson 1.6T : 0-100 en environ 8,5 secondes"),
    li("Changan UniZ PHEV : 0-100 en 7,4 secondes"),
    p("Le PHEV est significativement plus véloce que les SUV diesel et les SUV essence de cylindrée supérieure. La raison : le couple électrique (330 Nm) est disponible instantanément dès 0 tr/min. Il n'y a pas de \"montée en régime\" à attendre. L'accélération est immédiate, linéaire, et se maintient jusqu'à la vitesse maximale."),
    h3("Consommation hybride : 1,3 L/100 km — est-ce réaliste ?"),
    p("Ce chiffre WLTC est réel — dans les conditions de mesure standardisées, avec une batterie pleine au départ. En usage réel africain (batterie rechargée chaque soir), voici ce que constatent nos clients :"),
    li("Usage urbain Cotonou/Abidjan (50-80% en électrique) : 1,5 à 2,5 L/100 km"),
    li("Usage mixte ville/route nationale : 3 à 4 L/100 km"),
    li("Long trajet interurbain (batterie déchargée dès le départ) : 5,15 L/100 km"),
    p("5,15 L/100 km en mode purement thermique, c'est la vraie consommation de référence si vous ne rechargez jamais. C'est toujours inférieur aux SUV concurrents de même gabarit (7 à 9 L/100 pour un Toyota Rush ou un Hyundai Tucson)."),
    h3("Que se passe-t-il si la batterie est déchargée ?"),
    p("Question légitime pour un pays où la recharge n'est pas toujours évidente. Réponse simple : la voiture continue de rouler normalement, propulsée par le moteur thermique de 98 ch. À titre de comparaison, une Toyota Vios, une Honda Fit ou une Suzuki Swift développent entre 90 et 110 ch pour un poids inférieur. Le UniZ PHEV pèse plus, mais 98 ch suffisent pour rouler normalement, dépasser sur route et monter les côtes — avec une consommation de 5,15 L/100."),
    qt("\"98 ch thermiques, c'est la puissance de confort — celle que vous n'utilisez presque jamais en ville. 313 ch combinés, c'est la puissance de dépassement et d'accélération. Vous bénéficiez des deux selon le besoin.\""),
    h3("Comment recharger le UniZ PHEV au Bénin ou en Côte d'Ivoire ?"),
    p("La batterie de 18,4 kWh se recharge de trois façons :"),
    li("Prise domestique 220V standard : recharge complète en 4 à 5 heures (recharge lente, mode nuit)"),
    li("Borne de recharge AC 7,4 kW : recharge complète en 2h30 à 3 heures"),
    li("Régénération en roulant : le freinage et la décélération rechargent partiellement la batterie (10-15% en usage quotidien)"),
    p("Pour une utilisation quotidienne à Cotonou ou Abidjan : vous branchez le soir sur votre prise 220V habituelle, vous roulez le lendemain en électrique pour 80 à 120 km. Pour les jours où vous ne rechargez pas, le thermique prend le relais."),

    // ─── SECTION 5 : TABLEAU COMPARATIF ──────────────────────────────────────
    h2("5. Tableau comparatif complet — Tous nos modèles"),

    img(techId, "Tableau de bord digital Changan — technologie embarquée 2026", "L'interface digitale Changan UniZ : double écran, systèmes d'aide à la conduite, connectivité avancée — de série."),

    h3("Performances et caractéristiques"),
    p("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"),
    p("Critère              │ X5 Plus 1.5T │ UniZ 2026 1.5T │ Dashing 1.5T │ UniZ PHEV"),
    p("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"),
    p("Puissance max        │ 192 ch        │ 192 ch         │ 156 ch        │ 313 ch*"),
    p("Couple max           │ 310 Nm        │ 310 Nm         │ 230 Nm        │ 330 Nm élec."),
    p("0 à 100 km/h         │ 7,5 s         │ 7,8 s          │ ~9,5 s        │ 7,4 s"),
    p("Consommation réelle  │ ~7,5 L/100    │ ~7,5 L/100     │ ~8 L/100      │ 1,5-5,2 L/100"),
    p("Boîte de vitesses    │ 7 DCT         │ 7 DCT          │ 6 DCT         │ E-CVT"),
    p("Carburant            │ Essence RON92 │ Essence RON92  │ Essence RON92 │ Essence RON92"),
    p("Robustesse thermique │ ★★★★☆         │ ★★★★☆          │ ★★★★☆         │ ★★★★★"),
    p("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"),
    p("(*) Puissance combinée thermique + électrique homologuée"),
    h3("Quel modèle pour quel besoin ?"),
    p("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"),
    p("Profil d'usage                    │ Modèle recommandé"),
    p("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"),
    p("Budget maîtrisé, SUV polyvalent   │ Jetour Dashing 1.5T"),
    p("SUV familial premium, budget moyen│ Changan X5 Plus 1.5T"),
    p("SUV design + performances         │ Changan UniZ 2026 1.5T"),
    p("Économies carburant + performance │ Changan UniZ PHEV 2025"),
    p("Usage urbain 80%+ + longs trajets │ Changan UniZ PHEV 2025"),
    p("Pas d'accès fiable à la recharge  │ X5 Plus ou UniZ 2026"),
    p("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"),

    // ─── FAQ ─────────────────────────────────────────────────────────────────
    h2("6. FAQ — Les 10 questions les plus posées"),
    h3("Q1. Essence 92, ça suffit réellement pour protéger le moteur ?"),
    p("Oui. Le moteur est conçu pour fonctionner de façon optimale avec du RON 92. Le constructeur garantit la durée de vie moteur sur cette base. Utiliser du 95 n'améliorera pas la durée de vie."),
    h3("Q2. Pourquoi certains disent que les Changan prennent feu ?"),
    p("Ces témoignages concernent rarement les modèles Changan récents. Ils peuvent concerner d'autres marques chinoises bas de gamme, des incidents d'accident, ou des véhicules anciens mal entretenus. Les modèles que nous importons — X5 Plus, UniZ, Dashing — sont des véhicules de gamme moyenne à supérieure avec des systèmes thermiques complets."),
    h3("Q3. 98 ch sur le PHEV, c'est rapide ?"),
    p("Le moteur thermique seul n'est pas \"sportif\". Mais le PHEV ne roule jamais au seul thermique en accélération — le moteur électrique (215 ch, 330 Nm) intervient immédiatement. Résultat : 0-100 en 7,4 secondes, soit plus vite qu'un Toyota Fortuner ou un Prado diesel."),
    h3("Q4. La batterie PHEV peut-elle exploser sous la chaleur ?"),
    p("Non. La chimie LFP (Lithium Fer Phosphate) utilisée est la plus stable thermiquement de toutes les chimies lithium-ion. Elle nécessite des conditions extrêmes (choc physique violent + court-circuit interne simultanés) pour s'emballer. En usage normal africain, sous 45°C ambiants, la batterie est dans sa plage de fonctionnement."),
    h3("Q5. Quel modèle choisir si je vis à Cotonou avec 40°C ?"),
    p("N'importe lequel de nos quatre modèles. Tous sont testés et vendus en Égypte et au Moyen-Orient à des températures encore supérieures. Si vous conduisez principalement en ville, le PHEV est idéal pour les économies de carburant. Pour un usage mixte, le X5 Plus ou l'UniZ 2026."),
    h3("Q6. Comment recharger le PHEV à Cotonou ?"),
    p("Sur n'importe quelle prise 220V domestique avec le câble fourni de série. Branchement le soir, batterie pleine le matin. Pas besoin de borne spéciale pour la recharge lente quotidienne."),
    h3("Q7. Ça consomme vraiment 1,3 L/100 km ?"),
    p("En conditions WLTC avec batterie pleine au départ, oui. En usage quotidien réel à Cotonou avec recharge nocturne, comptez 1,5 à 2,5 L/100 en usage urbain. Sans jamais recharger : 5,15 L/100. Tous ces chiffres sont meilleurs que la concurrence essence non hybride."),
    h3("Q8. Turbo = plus chaud = plus dangereux ?"),
    p("Non. L'intercooler refroidit l'air comprimé par le turbo. La chaleur produite par un turbo est gérée par le circuit de refroidissement dédié. Les moteurs Blue Whale 1.5T fonctionnent à la même température de fonctionnement (85-100°C) qu'un moteur naturellement aspiré. Le turbo n'augmente pas la température interne du moteur — il augmente la puissance."),
    h3("Q9. Ces voitures durent combien de temps en Afrique ?"),
    p("Question de maintenance, pas de marque. Un X5 Plus entretenu selon le carnet (vidange tous les 10 000 km, filtre tous les 20 000, révision complète tous les 40 000) durera 300 000 km ou plus. Les premiers X5 Plus exportés en Afrique du Nord en 2020-2021 approchent ou dépassent les 150 000 km sans problèmes majeurs."),
    h3("Q10. Combien coûte la maintenance par rapport à Toyota ?"),
    p("Pour les services courants (vidange, filtres), les coûts sont comparables. Les pièces d'origine Changan sont disponibles via notre réseau et via les importateurs locaux. Sur les interventions spécifiques (boîte DCT, systèmes électroniques), un technicien formé est nécessaire — comme pour n'importe quel véhicule moderne à transmission automatique, Toyota inclus."),

    // ─── CONCLUSION ──────────────────────────────────────────────────────────
    h2("Conclusion — Ce que vous devez retenir"),
    p("Nous avons couvert beaucoup de terrain dans cet article. Résumons l'essentiel en six points :"),
    li("L'essence RON 92 est le carburant optimal pour ces moteurs — pas un compromis, mais une spécification précise adaptée à la compression moteur."),
    li("La différence entre 1.5L et 1.5T n'est pas une question de taille — c'est une différence de technologie d'admission d'air qui donne au turbo une puissance disproportionnée par rapport à sa cylindrée."),
    li("Les voitures chinoises modernes ne brûlent pas à cause de la chaleur africaine — elles disposent de systèmes thermiques complets, testés à 50°C. Les incendies viennent d'une maintenance absente, quelle que soit la marque."),
    li("Le UniZ PHEV a 98 ch thermiques et 313 ch combinés. Ces 98 ch suffisent seuls pour circuler normalement. Les 313 ch sont disponibles à l'accélération."),
    li("La batterie LFP du PHEV est la chimie lithium la plus sûre thermiquement disponible — plus stable que les batteries dans vos téléphones."),
    li("Le meilleur indicateur de durée de vie d'un véhicule n'est pas sa marque. C'est la régularité de sa maintenance."),
    p("Nous ne cherchons pas à vous convaincre que Changan et Jetour sont les meilleures voitures du monde. Nous cherchons à vous donner les éléments factuels pour que vous puissiez comparer équitablement. Un Toyota Land Cruiser d'occasion de 15 ans à 15 millions de FCFA ou un Changan X5 Plus neuf 2026 à 11 millions : les questions à poser sont différentes de ce qu'on imagine habituellement."),
    p("Si vous avez d'autres questions techniques — sur des spécifications précises, des composants spécifiques, ou des comparaisons que nous n'avons pas couvertes — contactez-nous directement. Nous préférons une conversation honnête avant la vente à une déception après."),
    qt("\"La technologie de nos véhicules est documentée, vérifiable, et testée sur des marchés bien plus chauds que Cotonou. Le reste, c'est de la maintenance.\""),
  ];

  const post = {
    _type: "post",
    _id: "article-changan-jetour-essence92-phev-guide-technique-2026",
    title: "Changan X5 Plus, UniZ PHEV, Jetour Dashing : tout ce que vous voulez savoir sur l'essence 92, le turbo et les incendies",
    slug: { _type: "slug", current: "changan-uniz-phev-jetour-dashing-guide-technique-essence-turbo-2026" },
    mainImage: { _type: "image", asset: { _type: "reference", _ref: coverId }, alt: "Changan UniZ PHEV et X5 Plus — guide technique complet" },
    publishedAt: "2026-06-25T10:00:00.000Z",
    category: "guides",
    excerpt: "Essence 92, moteur 1.5T, 98 ch sur le PHEV, risque d'incendie... Toutes les vraies réponses techniques sur le Changan X5 Plus, l'UniZ PHEV 2025 et le Jetour Dashing. Guide factuel complet par un importateur de terrain.",
    seoTitle: "Changan X5 Plus & UniZ PHEV — Essence 92, Turbo & Sécurité : Guide Complet 2026",
    seoDescription: "Essence 92 suffisante ? UniZ PHEV vraiment 313 ch ? Les voitures Changan brûlent-elles en Afrique ? Toutes les réponses techniques factuelle sur Changan et Jetour.",
    body,
  };

  console.log("📝 Création de l'article dans Sanity...");
  const res = await client.createOrReplace(post);
  console.log(`\n✅ Article publié !`);
  console.log(`   Titre : ${res.title}`);
  console.log(`   URL   : /blog/${res.slug.current}`);
  console.log(`   Mots  : ~4 200 mots`);
}

main().catch(e => { console.error("❌", e.message); process.exit(1); });

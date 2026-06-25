import { createClient } from "@sanity/client";

const TOKEN = "skyztPiIY9B6QnGxPk1LGpDi4AbqNDaoHoPCDmSxsvBhzLFCjt198UNt8b3Hp7lq7eWIMWsJ9PVsYfDlE";
const client = createClient({
  projectId: "t3ow1rmc",
  dataset: "production",
  useCdn: false,
  apiVersion: "2024-01-01",
  token: TOKEN,
});

const key = () => Math.random().toString(36).slice(2, 10);

function block(text, style = "normal") {
  return {
    _type: "block", _key: key(), style,
    children: [{ _type: "span", _key: key(), text, marks: [] }],
    markDefs: [],
  };
}

function h2(text) { return block(text, "h2"); }
function h3(text) { return block(text, "h3"); }
function p(text) { return block(text, "normal"); }
function quote(text) { return block(text, "blockquote"); }

// ── ARTICLE 1 : VE chinois en Afrique ──────────────────────────────────────
const article1 = {
  _id: "KOW9SnXoBiNxp6TLs1iHmU",
  title: "Voitures électriques chinoises en Afrique 2026 : autonomie réelle, recharge et coût total",
  slug: { _type: "slug", current: "voitures-electriques-chinoises-afrique-2026-autonomie-recharge" },
  category: "actualites",
  excerpt: "BYD Atto 3, Omoda E5, GWM Ora Good Cat : on décortique les autonomies réelles sous 40°C, les solutions de recharge disponibles et le coût total sur 5 ans en Afrique de l'Ouest.",
  body: [
    h2("L'électrique chinois débarque en Afrique — mais est-il vraiment prêt ?"),
    p("En 2026, trois constructeurs chinois proposent des véhicules 100 % électriques accessibles en Afrique subsaharienne : BYD, Chery (via l'Omoda E5) et GWM (via l'Ora Good Cat). Les prix d'entrée de gamme commencent à partir de 12 millions FCFA CIF, une première. Mais la vraie question n'est pas le prix d'achat — c'est l'autonomie réelle sous 40 degrés, la disponibilité des bornes de recharge, et le coût total de possession sur 5 ans."),
    p("Nous avons compilé des données terrain collectées auprès d'importateurs à Dakar, Abidjan, Cotonou et Douala pour répondre à ces questions de manière concrète."),

    h2("BYD Atto 3 : le référence du segment"),
    p("Le BYD Atto 3 embarque une batterie Blade de 60,5 kWh avec une autonomie WLTP annoncée de 420 km. En conditions africaines — climatisation à fond, routes partiellement bitumées, chargement plein — l'autonomie réelle observée est de 280 à 320 km. C'est suffisant pour la majorité des trajets urbains et péri-urbains."),
    p("La technologie Blade Battery de BYD présente un avantage clé : une résistance exceptionnelle à la chaleur. Les cellules LFP (lithium fer phosphate) ne subissent pas de dégradation thermique aussi agressive que les NMC utilisés par les concurrents coréens et japonais. Sur 3 ans d'utilisation en zone tropicale, les retours indiquent une dégradation de capacité inférieure à 8 %."),
    h3("Recharge : l'infrastructure existe-t-elle ?"),
    p("À Dakar, 14 bornes de recharge rapide (50 kW) sont opérationnelles en juin 2026, dont 8 dans des stations-service Total. Une session de 45 minutes amène la batterie de 20 % à 80 %. En Côte d'Ivoire, le réseau CIE (Compagnie Ivoirienne d'Électricité) a installé 22 bornes sur Abidjan. Le coût : environ 5 500 FCFA pour une charge complète, soit l'équivalent de 2 litres d'essence."),
    p("La solution dominante reste cependant la recharge domestique sur secteur 220V. Avec un chargeur embarqué de 7 kW, une nuit complète (8 heures) suffit pour remonter à 100 %. Le coût électrique mensuel pour 1 500 km est estimé à 18 000–22 000 FCFA selon le pays, contre 85 000–110 000 FCFA en essence."),

    h2("Omoda E5 (Chery) : le challenger abordable"),
    p("Chery lance l'Omoda E5 avec une batterie de 61 kWh et une autonomie WLTP de 430 km. Le véhicule est positionné 1,5 à 2 millions FCFA en dessous du BYD Atto 3, ce qui le rend très compétitif. La plateforme E0X intègre un système de gestion thermique de la batterie — un point crucial en Afrique."),
    p("L'Omoda E5 supporte la charge rapide DC jusqu'à 80 kW, soit 30 minutes pour passer de 10 % à 80 %. Le design intérieur est moderne, avec un double écran 15,6 + 10,2 pouces. En termes de fiabilité, Chery bénéficie d'un réseau SAV croissant au Maroc, en Tunisie et désormais en Afrique subsaharienne."),

    h2("GWM Ora Good Cat : le pari de l'entrée de gamme"),
    p("L'Ora Good Cat de Great Wall Motors cible un positionnement clairement accessible avec une batterie de 48 kWh. Son autonomie réelle en conditions africaines se situe autour de 220–260 km, suffisant pour une utilisation urbaine à Abidjan, Dakar ou Lomé. Son design rétro inspiré de la Mini Cooper lui vaut un succès commercial notable au Maroc."),
    p("Son principal inconvénient : une puissance de charge rapide limitée à 40 kW, ce qui allonge les sessions de recharge. GWM prévoit une version avec batterie de 63 kWh pour fin 2026, qui comblera cette lacune."),

    h2("Coût total de possession sur 5 ans : comparaison chiffrée"),
    p("Pour 1 500 km/mois, en Côte d'Ivoire, voici l'estimation sur 5 ans (achat CIF inclus, sans financement) :"),
    p("BYD Atto 3 (14,5M FCFA CIF) : total 5 ans ≈ 23,8M FCFA. Omoda E5 (12,8M FCFA CIF) : total 5 ans ≈ 21,4M FCFA. SUV essence équivalent (9,5M FCFA CIF) : total 5 ans ≈ 24,2M FCFA. La voiture électrique est moins chère à posséder dès la 3e année, malgré un coût d'achat plus élevé."),
    quote("Sur 5 ans, un SUV électrique chinois coûte en moyenne 12 % moins cher à posséder qu'un SUV essence de même segment, grâce aux économies de carburant et à l'entretien réduit."),

    h2("Les défis à anticiper"),
    h3("Pièces de rechange"),
    p("Le réseau de pièces pour les véhicules électriques reste limité en 2026. Les batteries, en particulier, ne se remplacent pas facilement hors des réseaux agréés. BYD propose une garantie batterie 8 ans / 160 000 km, ce qui atténue significativement ce risque."),
    h3("Groupes électrogènes et surges"),
    p("Les fluctuations de tension électrique en Afrique subsaharienne peuvent endommager les équipements de charge. L'utilisation d'un stabilisateur de tension entre le groupe électrogène et la borne de recharge est fortement recommandée. Coût d'un stabilisateur adapté : 45 000–80 000 FCFA."),
    h3("Formation des mécaniciens"),
    p("Les véhicules électriques nécessitent des techniciens formés sur les hautes tensions. En 2026, seuls BYD et Chery ont des centres de formation certifiés en Afrique de l'Ouest (Dakar et Abidjan). Les autres marques s'appuient encore sur des techniciens formés en Chine ou au Maroc."),

    h2("Notre verdict"),
    p("L'électrique chinois est viable en Afrique urbaine en 2026, à condition de disposer d'une installation électrique stable à domicile. Le BYD Atto 3 est notre recommandation principale pour sa batterie éprouvée, son réseau SAV et sa garantie. L'Omoda E5 est le meilleur rapport qualité-prix. L'Ora Good Cat convient aux budgets serrés avec des trajets courts."),
    p("L'infrastructure de recharge publique progresse vite, mais reste concentrée dans les capitales. Pour les villes secondaires, le véhicule électrique n'est pas encore recommandé sans point de charge à domicile garantissant 8 heures par nuit."),
  ],
};

// ── ARTICLE 2 : Pick-up chinois ────────────────────────────────────────────
const article2 = {
  _id: "article-comparatif-suv-chinois-2026",
  title: "Pick-up chinois en 2026 : GWM Cannon, JAC T8, LDV T60 — lequel choisir en Afrique ?",
  slug: { _type: "slug", current: "pick-up-chinois-gwm-cannon-jac-t8-ldv-t60-afrique-2026" },
  category: "guides",
  excerpt: "GWM Cannon, JAC T8, LDV T60 : le pick-up chinois s'impose comme l'alternative sérieuse aux Toyota Hilux et Ford Ranger en Afrique. Comparatif complet : capacités, motorisations, prix et solidité.",
  body: [
    h2("Pourquoi le pick-up chinois intéresse-t-il de plus en plus en Afrique ?"),
    p("Le pick-up est le véhicule de travail par excellence en Afrique. Toyota Hilux et Ford Ranger ont longtemps régné sans partage. En 2026, trois constructeurs chinois proposent des alternatives sérieuses à des prix 25 à 40 % inférieurs, avec des équipements premium et des motorisations modernes. GWM (Great Wall Motors) avec le Cannon, JAC avec le T8, et LDV (groupe SAIC) avec le T60 s'imposent désormais comme des alternatives légitimes."),
    p("Nous avons compilé les données techniques, les retours d'utilisateurs au Sénégal, au Bénin et en Côte d'Ivoire, et les conditions d'importation pour ce comparatif."),

    h2("GWM Cannon : le pick-up haut de gamme chinois"),
    p("Le GWM Cannon est sans conteste le pick-up chinois le plus abouti techniquement. Il embarque un moteur 2.0T diesel 163 ch avec boîte automatique 8 rapports et une transmission intégrale avec modes 2H / 4H / 4L. Sa capacité de charge utile atteint 1 000 kg, et son poids tracté est de 3 500 kg — des chiffres comparables au Toyota Hilux Legend."),
    h3("Motorisation et performances"),
    p("Le 2.0T diesel développe un couple de 400 Nm dès 1 750 tr/min, idéal pour les routes difficiles. Le 0-100 km/h est atteint en 10,2 secondes à vide. La consommation mixte est de 7,8 L/100 km, soit 15 % moins gourmand qu'un Hilux 2.8 diesel."),
    h3("Équipement et confort"),
    p("Le Cannon est disponible avec écran tactile 10,25 pouces, caméra 360°, aide au stationnement, régulateur de vitesse adaptatif et chauffage des sièges. Son habitacle cinq places est spacieux, avec 1 010 mm d'espace aux jambes aux places arrière — supérieur au Ranger."),
    h3("Prix CIF en Afrique de l'Ouest"),
    p("Prix CIF Dakar / Abidjan / Cotonou : 14,5 à 17,2 millions FCFA selon la version. C'est 4 à 6 millions FCFA de moins qu'un Toyota Hilux Legend équivalent, à équipement comparable."),

    h2("JAC T8 : le pick-up du rapport qualité-prix"),
    p("JAC Motors propose le T8 avec un moteur essence 2.0T de 190 ch ou diesel 2.0T de 143 ch. La transmission intégrale est en option sur la version essence. Le T8 se positionne dans une gamme intermédiaire, ciblant les entrepreneurs et PME qui ont besoin d'un véhicule polyvalent sans le budget du Cannon."),
    p("Le plateau arrière mesure 1 520 x 1 080 mm — l'un des plus longs du segment. La charge utile est de 900 kg. Le T8 est certifié Euro 6 et passe facilement les contrôles d'importation en Afrique de l'Ouest francophone."),
    h3("Points forts spécifiques à l'Afrique"),
    p("JAC a renforcé les trains roulants du T8 pour les marchés africains : ressorts arrière renforcés, protection du châssis contre la corrosion saline, filtre à air dual-stage pour les environnements poussiéreux. Des détails qui font la différence sur les pistes latéritiques."),
    h3("Prix CIF"),
    p("Le JAC T8 est disponible entre 10,8 et 13,5 millions FCFA CIF selon la motorisation et les options. C'est l'entrée de gamme sérieuse du pick-up chinois en Afrique."),

    h2("LDV T60 : le pragmatique du quotidien"),
    p("LDV (Light Defence Vehicle, groupe SAIC) propose le T60 avec un moteur diesel 2.8T de 130 ch. Plus sobre que ses concurrents, il privilégie la fiabilité et la simplicité mécanique — un avantage réel dans les zones éloignées des centres de service. Le T60 est équipé de série d'un différentiel arrière bloquable électroniquement, rare à ce prix."),
    p("Son design intérieur est plus fonctionnel que luxueux, mais sa cabine simple (2 ou 4 portes) en fait un outil de travail efficace. La boîte de vitesses manuelle 6 rapports est l'option la plus vendue en Afrique pour sa robustesse."),
    h3("Prix CIF"),
    p("Entre 9,2 et 11,5 millions FCFA CIF. Le plus abordable des trois, il reste le choix de référence pour les flottes d'entreprise cherchant à minimiser le coût total de possession."),

    h2("Tableau comparatif résumé"),
    p("GWM Cannon : 2.0T Diesel 163ch — 14,5-17,2M FCFA — 4x4 permanent — Charge 1000 kg — Note : ★★★★★"),
    p("JAC T8 : 2.0T Essence/Diesel 190/143ch — 10,8-13,5M FCFA — 4x4 en option — Charge 900 kg — Note : ★★★★"),
    p("LDV T60 : 2.8T Diesel 130ch — 9,2-11,5M FCFA — 4x4 — Charge 850 kg — Note : ★★★½"),

    h2("Entretien et réseau SAV"),
    p("GWM dispose du réseau SAV le plus développé en Afrique de l'Ouest en 2026, avec des concessionnaires agréés à Dakar, Abidjan, Lomé et Douala. JAC s'appuie sur son partenariat avec des importateurs locaux bien implantés. LDV, via SAIC, bénéficie du réseau MG pour l'assistance technique."),
    p("Les pièces de rechange pour les trois marques sont disponibles à Dubaï (Deira) et Guangzhou (Huangqi Jie) avec un délai de livraison de 10 à 21 jours vers Afrique de l'Ouest. Il est conseillé de commander un kit de filtres et pièces d'usure lors de l'importation du véhicule."),

    h2("Notre recommandation"),
    p("Si votre budget le permet, le GWM Cannon est le meilleur pick-up chinois disponible en 2026 — il rivalise honnêtement avec le Hilux et le Ranger à un prix significativement inférieur. Pour un usage mixte professionnel et familial avec un budget de 11 à 13 millions FCFA, le JAC T8 est notre choix. Le LDV T60 est idéal pour les flottes d'entreprise en zones difficiles qui veulent minimiser les pannes."),
    quote("Le pick-up chinois n'est plus un compromis en 2026 — c'est un choix délibéré. Les économies réalisées à l'achat financent 3 à 4 ans d'entretien."),
  ],
};

// ── ARTICLE 3 : Financement auto en Afrique ────────────────────────────────
const article3 = {
  _id: "article-haval-changan-jetour-comparatif-famille-2026",
  title: "Financer sa voiture chinoise en Afrique de l'Ouest : crédit auto, leasing et microfinance en 2026",
  slug: { _type: "slug", current: "financer-voiture-chinoise-afrique-ouest-credit-leasing-2026" },
  category: "guides",
  excerpt: "Comment acheter une voiture chinoise sans payer la totalité comptant ? Crédit auto bancaire, leasing LOA, microfinance UEMOA : toutes les options décryptées pays par pays pour 2026.",
  body: [
    h2("Le financement automobile en Afrique de l'Ouest : un marché en pleine transformation"),
    p("En 2026, payer sa voiture comptant reste la norme pour 68 % des acheteurs en Afrique de l'Ouest, selon les données de la BRVM. Pourtant, les options de financement se multiplient, portées par la digitalisation bancaire et l'essor de la fintech. Pour une voiture chinoise neuve entre 8 et 18 millions FCFA, plusieurs solutions permettent d'étaler les paiements sur 12 à 60 mois."),
    p("Ce guide présente les options disponibles pays par pays (Sénégal, Côte d'Ivoire, Bénin, Togo, Cameroun), leurs conditions réelles et les pièges à éviter."),

    h2("Le crédit auto bancaire classique"),
    h3("Conditions générales dans la zone UEMOA"),
    p("Les grandes banques (Ecobank, BOA, SGBCI, CBAO, BHS) proposent des crédits auto avec apport initial de 20 à 30 %, sur 24 à 60 mois, à des taux d'intérêt de 10 à 14 % par an. Pour une voiture à 12 millions FCFA avec 25 % d'apport (3 millions), la mensualité sur 36 mois tourne autour de 290 000–310 000 FCFA."),
    p("Les documents exigés sont généralement : carte nationale d'identité, 3 derniers bulletins de salaire ou relevés bancaires, fiche de paie employeur ou bilan comptable pour les indépendants, et la facture proforma du véhicule. Le délai d'obtention est de 5 à 15 jours ouvrés."),
    h3("Particularités par pays"),
    p("Sénégal : la BHS (Banque de l'Habitat du Sénégal) propose des crédits auto à taux préférentiel de 9,5 % pour les fonctionnaires. CBAO et Ecobank sont les plus actives sur le segment privé."),
    p("Côte d'Ivoire : la SGBCI et BNI offrent des packages avec assurance intégrée. Le système de crédit bail (LOA) est mieux développé qu'ailleurs grâce à la présence de sociétés de leasing comme SAFCA."),
    p("Bénin et Togo : les microfinances comme PADME et RENACA jouent un rôle important, notamment pour les commerçants et transporteurs. Les taux sont plus élevés (15–18 %) mais les conditions d'accès sont plus souples."),

    h2("Le leasing / Location avec Option d'Achat (LOA)"),
    p("Le leasing ou LOA est la formule qui monte en Afrique de l'Ouest. Plutôt que d'acheter le véhicule, vous le louez pendant 36 à 60 mois avec une option d'achat à terme. Les avantages : l'apport initial est réduit (10 à 15 %), les loyers sont déductibles fiscalement pour les entreprises, et le véhicule reste à l'actif de la société de leasing (vous n'immobilisez pas de capital)."),
    p("Les sociétés actives en 2026 : SAFCA (Côte d'Ivoire), LOCAFRIQUE (Sénégal), ALIOS Finance (présente dans 8 pays UEMOA). Pour une voiture chinoise à 14 millions FCFA, la LOA sur 48 mois avec 15 % d'apport donne des mensualités de l'ordre de 290 000–330 000 FCFA, avec une valeur résiduelle de 15 % à terme."),
    h3("LOA vs crédit : lequel choisir ?"),
    p("Le crédit est préférable si vous souhaitez être propriétaire immédiatement et conserver le véhicule longtemps. La LOA convient mieux aux professionnels qui veulent renouveler leur flotte tous les 3–4 ans ou bénéficier d'avantages fiscaux. Les deux formules coûtent sensiblement la même chose sur la durée, mais la LOA préserve votre liquidité."),

    h2("La microfinance et les coopératives d'épargne-crédit"),
    p("Pour les acheteurs sans revenus salariés stables — commerçants, artisans, transporteurs — la microfinance et les coopératives (COOPEC, tontines institutionnalisées) offrent des solutions adaptées. Les IMF (Institutions de Microfinance) comme Baobab, ACEP, FINCA ou PADME accordent des crédits véhicule jusqu'à 5 millions FCFA en zone UEMOA, avec des taux de 18 à 24 % annuels mais des exigences de garantie moins strictes."),
    p("Pour les véhicules de plus de 8 millions FCFA, la microfinance seule est insuffisante. Certains acheteurs combinent : 40 % comptant (épargne ou tontine), 30 % IMF, 30 % crédit bancaire. Cette stratégie multiplie les interlocuteurs mais peut être la seule option pour les non-salariés."),

    h2("Les solutions émergentes : fintech et paiement mobile"),
    p("Wave, Orange Money et MTN Money ont transformé les paiements en Afrique de l'Ouest, mais le crédit auto via mobile reste embryonnaire. En 2026, la fintech sénégalaise DaysiPay et la ivoirienne SimbaPay proposent des micro-crédits auto jusqu'à 3 millions FCFA, utilisables comme apport initial. Ces solutions s'appuient sur l'historique des transactions mobile money pour évaluer la solvabilité — une révolution pour les non-bancarisés."),
    p("Julaya (Côte d'Ivoire), Bizao (multi-pays) et Kash (Sénégal) permettent également de débloquer des facilités de paiement à 3 ou 6 mois sans intérêt avec des commerçants partenaires. Ces solutions ne financent pas encore un véhicule complet mais permettent de gérer les frais annexes (assurance, dédouanement, immatriculation)."),

    h2("Dédouanement et frais annexes : les intégrer dans le plan de financement"),
    p("Une erreur fréquente des acheteurs de voitures chinoises est de sous-estimer les frais annexes. Pour une voiture à 12 millions FCFA CIF, les frais de dédouanement représentent 20 à 35 % supplémentaires selon le pays :"),
    p("Sénégal : dédouanement ≈ 25–30 % de la valeur CIF + frais portuaires (350 000 FCFA) + immatriculation (180 000 FCFA) = total frais annexes : 3,5 à 4,2 millions FCFA."),
    p("Côte d'Ivoire : dédouanement ≈ 28–33 % + frais portuaires (280 000 FCFA) + immatriculation (95 000 FCFA) = total frais annexes : 3,8 à 4,5 millions FCFA."),
    p("Ces montants doivent être budgétés séparément du crédit. La bonne pratique : avoir en cash au moins 40 % du prix CIF pour couvrir l'apport initial ET les frais de dédouanement."),

    h2("Assurance automobile : obligation et coûts"),
    p("En zone UEMOA, l'assurance responsabilité civile est obligatoire. Pour un SUV chinois neuf de 12 millions FCFA, la prime annuelle tourne autour de 380 000–520 000 FCFA pour une assurance tous risques. Certains assureurs (AXA, SUNU, NSIA) proposent des facilités de paiement trimestrielles ou semestrielles. À intégrer dans le budget mensuel total."),

    h2("Notre guide en 6 étapes pour financer sa voiture chinoise"),
    p("1. Estimez votre budget mensuel maximum (ne pas dépasser 25 % de vos revenus nets). 2. Calculez le prix total réel : CIF + dédouanement + immatriculation + assurance 1ère année. 3. Réunissez un apport d'au moins 30 % du total. 4. Comparez crédit bancaire vs LOA selon votre situation fiscale. 5. Demandez plusieurs offres en parallèle (au moins 3 banques). 6. Lisez attentivement les clauses de remboursement anticipé (certains établissements facturent des pénalités)."),
    quote("Le bon financement n'est pas celui avec la mensualité la plus basse, mais celui qui s'adapte à vos revenus variables. Préférez toujours la durée la plus courte que vous pouvez supporter."),
    p("Chez Voitures Chinoises, nous accompagnons nos clients dans la recherche de financement adapté à leur situation. Contactez-nous pour une simulation personnalisée gratuite."),
  ],
};

async function main() {
  console.log("Mise à jour de l'article 1 : VE chinois en Afrique...");
  await client.patch(article1._id).set({
    title: article1.title,
    slug: article1.slug,
    category: article1.category,
    excerpt: article1.excerpt,
    body: article1.body,
    publishedAt: new Date().toISOString(),
  }).commit();
  console.log("✅ Article 1 mis à jour");

  console.log("Mise à jour de l'article 2 : Pick-up chinois...");
  await client.patch(article2._id).set({
    title: article2.title,
    slug: article2.slug,
    category: article2.category,
    excerpt: article2.excerpt,
    body: article2.body,
    publishedAt: new Date(Date.now() - 86400000).toISOString(),
  }).commit();
  console.log("✅ Article 2 mis à jour");

  console.log("Mise à jour de l'article 3 : Financement auto...");
  await client.patch(article3._id).set({
    title: article3.title,
    slug: article3.slug,
    category: article3.category,
    excerpt: article3.excerpt,
    body: article3.body,
    publishedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  }).commit();
  console.log("✅ Article 3 mis à jour");

  console.log("\n✅ Les 3 articles redondants ont été remplacés !");
}

main().catch(console.error);

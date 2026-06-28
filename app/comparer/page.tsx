import Link from "next/link";
import Image from "next/image";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { getCars } from "@/sanity/queries";
import { carSlug } from "@/lib/slug";
import type { Car } from "@/data/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Comparateur — Voitures Chinoises",
  description: "Comparez côte à côte les voitures chinoises disponibles.",
};

const WA = "8619587439774";

const SPEC_LABELS: Record<string, string> = {
  "Motorisation":     "Motorisation",
  "Moteur":           "Moteur",
  "Moteur avant":     "Moteur avant",
  "Moteur arrière":   "Moteur arrière",
  "Puissance":        "Puissance",
  "Puissance système":"Puissance système",
  "Couple":           "Couple",
  "Boîte":            "Boîte",
  "Transmission":     "Transmission",
  "Places":           "Places",
  "Longueur":         "Longueur",
  "Largeur":          "Largeur",
  "Hauteur":          "Hauteur",
  "Dimensions":       "Dimensions",
  "Empattement":      "Empattement",
  "Garde au sol":     "Garde au sol",
  "Poids":            "Poids",
  "Coffre":           "Coffre",
  "Réservoir":        "Réservoir",
  "Autonomie":        "Autonomie",
  "Autonomie élec.":  "Autonomie élec.",
  "Autonomie totale": "Autonomie totale",
  "Batterie":         "Batterie",
  "Recharge":         "Recharge",
  "Conso. mixte":     "Conso. mixte",
  "0-100 km/h":       "0-100 km/h",
  "Vitesse max":      "Vitesse max",
  "Pneus":            "Pneus",
  "Suspension":       "Suspension",
  "Remorquage":       "Remorquage",
  "Off-road":         "Off-road",
  "Écrans":           "Écrans",
  "Caméra":           "Caméra",
  "Audio":            "Audio",
  "Toit":             "Toit ouvrant",
};

// Specs where a lower number wins
const LOWER_BETTER = new Set(["0-100 km/h", "Conso. mixte"]);
// Specs where a higher number wins
const HIGHER_BETTER = new Set([
  "Puissance", "Puissance système", "Couple", "Places",
  "Coffre", "Réservoir", "Autonomie", "Autonomie élec.", "Autonomie totale",
  "Vitesse max", "Garde au sol", "Empattement", "Batterie", "Poids", "Pneus",
]);

function extractNum(val: string): number | null {
  if (!val || val === "—") return null;
  const m = val.replace(/\s/g, "").replace(/,/g, ".").match(/\d+\.?\d*/);
  return m ? parseFloat(m[0]) : null;
}

function getWinnerIdx(key: string, values: string[]): number | null {
  if (!LOWER_BETTER.has(key) && !HIGHER_BETTER.has(key)) return null;
  const nums = values.map(extractNum);
  const valid = nums.filter(n => n !== null) as number[];
  if (valid.length < 2) return null;
  const best = LOWER_BETTER.has(key) ? Math.min(...valid) : Math.max(...valid);
  const winners = nums.reduce<number[]>((acc, n, i) => (n === best ? [...acc, i] : acc), []);
  return winners.length === 1 ? winners[0] : null;
}

function parsePrice(p: string): number {
  return parseInt(p.replace(/\D/g, "")) || 0;
}

function specVal(car: Car, key: string): string {
  return car.specs?.[key] ?? "—";
}

function buildVerdict(car: Car, allCars: Car[]): { bullets: string[]; quote: string; forWho: string } {
  const myPrice = parsePrice(car.price);
  const prices = allCars.map(c => parsePrice(c.price));
  const isLowest = myPrice > 0 && myPrice === Math.min(...prices);
  const isHighest = myPrice === Math.max(...prices);

  const bullets: string[] = [];

  if (isLowest) bullets.push("Prix le plus accessible du comparatif");

  const myPow = extractNum(specVal(car, "Puissance") !== "—" ? specVal(car, "Puissance") : specVal(car, "Puissance système"));
  const allPow = allCars.map(c => extractNum(specVal(c, "Puissance") !== "—" ? specVal(c, "Puissance") : specVal(c, "Puissance système")));
  const maxPow = Math.max(...(allPow.filter(n => n !== null) as number[]));
  if (myPow !== null && myPow === maxPow && allPow.filter(n => n === maxPow).length === 1)
    bullets.push("Moteur le plus puissant du comparatif");

  const myAcc = extractNum(specVal(car, "0-100 km/h"));
  const allAcc = allCars.map(c => extractNum(specVal(c, "0-100 km/h"))).filter(n => n !== null) as number[];
  if (myAcc !== null && allAcc.length >= 2 && myAcc === Math.min(...allAcc) && allAcc.filter(n => n === myAcc).length === 1)
    bullets.push("L'accélération la plus vive");

  const myRange = extractNum(specVal(car, "Autonomie totale") !== "—" ? specVal(car, "Autonomie totale") : specVal(car, "Autonomie"));
  const allRange = allCars.map(c => extractNum(specVal(c, "Autonomie totale") !== "—" ? specVal(c, "Autonomie totale") : specVal(c, "Autonomie"))).filter(n => n !== null) as number[];
  if (myRange !== null && allRange.length >= 2 && myRange === Math.max(...allRange) && allRange.filter(n => n === myRange).length === 1)
    bullets.push("L'autonomie la plus longue");

  const mySeats = extractNum(specVal(car, "Places"));
  const allSeats = allCars.map(c => extractNum(specVal(c, "Places"))).filter(n => n !== null) as number[];
  if (mySeats !== null && allSeats.length >= 2 && mySeats === Math.max(...allSeats) && allSeats.filter(n => n === mySeats).length === 1)
    bullets.push("Plus d'espace pour toute la famille");

  if (specVal(car, "Off-road") !== "—") bullets.push("Taillé pour les routes difficiles");

  let quote = "";
  let forWho = "";

  if (isLowest) {
    quote = `Vous montez à bord — l'intérieur vous surprend. Le tableau de bord vous enveloppe, la technologie vous répond. Dehors, il ne ressemble pas à une voiture ordinaire. La ${car.brand} ${car.model} prouve qu'on peut rouler beau, rouler bien — sans compromis sur le budget.`;
    forWho = `La famille ambitieuse qui veut accéder au segment premium sans sacrifier le bon sens. Ceux qui savent reconnaître une vraie bonne affaire.`;
  } else if (isHighest) {
    quote = `Une présence qui impose le respect dès le premier regard. À l'intérieur, toute la famille est à l'aise — personne ne se sent à l'étroit. La ${car.brand} ${car.model} n'est pas faite pour ceux qui font des concessions. Elle est faite pour ceux qui ont choisi le meilleur.`;
    forWho = `La grande famille qui refuse de choisir entre espace, confort, prestige et robustesse. Pour qui arriver quelque part, ça se voit.`;
  } else {
    quote = `Ni trop, ni trop peu — exactement ce qu'il faut. La ${car.brand} ${car.model} coche toutes les cases qui comptent vraiment : fiabilité, confort, équipement, présence sur la route. Le choix de ceux qui savent précisément ce qu'ils veulent.`;
    forWho = `L'acheteur polyvalent qui veut tout : un beau véhicule, bien équipé, au prix juste — sans avoir à s'expliquer.`;
  }

  return { bullets, quote, forWho };
}

export default async function ComparerPage({
  searchParams,
}: {
  searchParams: Promise<{ v?: string }>;
}) {
  const params = await searchParams;
  const slugs = (params.v ?? "").split(",").filter(Boolean).slice(0, 3);
  const all = await getCars();
  const cars = slugs
    .map(s => all.find(c => carSlug(c.brand, c.model) === s))
    .filter(Boolean) as typeof all;

  if (cars.length === 0) {
    return (
      <>
        <Nav />
        <main style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24, padding: "80px 24px" }}>
          <p style={{ color: "#555", fontSize: 18 }}>Aucun véhicule sélectionné.</p>
          <Link href="/catalogue" style={{ color: "#A01414", fontWeight: 600, textDecoration: "underline" }}>
            ← Retour au catalogue
          </Link>
        </main>
        <Footer minimal />
      </>
    );
  }

  const allKeys = Array.from(new Set(
    cars.flatMap(c => Object.keys(c.specs || {})).filter(k => k in SPEC_LABELS)
  ));
  const orderedKeys = Object.keys(SPEC_LABELS).filter(k => allKeys.includes(k));
  const cols = cars.length;
  const verdicts = cars.map(car => buildVerdict(car, cars));
  const prices = cars.map(c => parsePrice(c.price));
  const lowestPriceIdx = prices.indexOf(Math.min(...prices));

  return (
    <>
      <Nav />
      <main className="comparer-page">
        <div className="comparer-inner">
          <div className="comparer-header">
            <Link href="/catalogue" className="comparer-back">← Retour au catalogue</Link>
            <h1 className="comparer-title">Comparaison</h1>
          </div>

          <div className="comparer-body" style={{ "--cols": cols } as React.CSSProperties}>

            {/* Car header cards */}
            <div className="comparer-cars-row">
              <div className="comparer-label-spacer" />
              {cars.map((car, ci) => {
                const photo = car.photos?.[0]?.src;
                const slug = carSlug(car.brand, car.model);
                const waMsg = encodeURIComponent(`Bonjour, je suis intéressé par la ${car.brand} ${car.model}. Pouvez-vous me donner plus d'informations ?`);
                return (
                  <div key={car.id} className="comparer-car-card">
                    <div className="comparer-car-photo-wrap">
                      {photo ? (
                        <Image src={photo} alt={`${car.brand} ${car.model}`} fill
                          style={{ objectFit: "contain", padding: "8px" }}
                          sizes="(max-width: 600px) 45vw, 220px" />
                      ) : (
                        <div style={{ width: "100%", height: "100%", background: "#f0f0f0" }} />
                      )}
                    </div>
                    <Link href={`/voitures/${slug}`} className="comparer-car-name-link">
                      <div className="comparer-car-brand">{car.brand}</div>
                      <div className="comparer-car-model">{car.model}</div>
                    </Link>
                    <div className={`comparer-car-price${ci === lowestPriceIdx && cars.length > 1 ? " best-price" : ""}`}>
                      {car.price} <span>FCFA</span>
                      {ci === lowestPriceIdx && cars.length > 1 && (
                        <span className="comparer-price-badge">Meilleur prix</span>
                      )}
                    </div>
                    <a href={`https://wa.me/${WA}?text=${waMsg}`} target="_blank" rel="noopener noreferrer"
                      className="comparer-wa-btn">Commander</a>
                  </div>
                );
              })}
            </div>

            {/* Spec rows */}
            {orderedKeys.map((key, i) => {
              const values = cars.map(c => c.specs?.[key] ?? "—");
              const allSame = values.every(v => v === values[0]);
              const winnerIdx = getWinnerIdx(key, values);
              return (
                <div key={key} className={`comparer-spec-row${i % 2 === 0 ? " even" : ""}`}>
                  <div className="comparer-spec-label">{SPEC_LABELS[key]}</div>
                  <div className="comparer-spec-vals">
                    {values.map((val, j) => {
                      const isWinner = winnerIdx === j;
                      const isDiff = !allSame && val !== "—" && winnerIdx === null;
                      return (
                        <div key={j} className={`comparer-spec-val${isWinner ? " winner" : isDiff ? " diff" : ""}`}>
                          {isWinner && <span className="winner-check">✓</span>}
                          {val}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Verdict section */}
          <div className="comparer-verdict">
            <div className="comparer-verdict-title">
              <span className="comparer-verdict-icon">◆</span> Verdict
            </div>
            <div className="comparer-verdict-cards">
              {cars.map((car, ci) => {
                const { bullets, quote, forWho } = verdicts[ci];
                return (
                  <div key={car.id} className="comparer-verdict-card">
                    <div className="comparer-verdict-car">
                      <span className="comparer-verdict-brand">{car.brand}</span>
                      <span className="comparer-verdict-model">{car.model}</span>
                    </div>
                    {bullets.length > 0 && (
                      <ul className="comparer-verdict-bullets">
                        {bullets.map((b, bi) => <li key={bi}>{b}</li>)}
                      </ul>
                    )}
                    <p className="comparer-verdict-quote">{quote}</p>
                    <div className="comparer-verdict-for-label">Pour qui ?</div>
                    <p className="comparer-verdict-for-who">{forWho}</p>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </main>
      <Footer minimal />
    </>
  );
}

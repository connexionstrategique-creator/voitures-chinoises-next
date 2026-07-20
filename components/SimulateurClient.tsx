"use client";
import { useState, useMemo } from "react";
import Link from "next/link";

const COUNTRIES = [
  { code: "bj", name: "Bénin",        flag: "🇧🇯", port: "Cotonou",  dd: 0.20, rs: 0.01, pcc: 0.005, pcs: 0.01, tva: 0.18, immat: 350_000 },
  { code: "tg", name: "Togo",          flag: "🇹🇬", port: "Lomé",    dd: 0.20, rs: 0.01, pcc: 0.005, pcs: 0.01, tva: 0.18, immat: 280_000 },
  { code: "ci", name: "Côte d'Ivoire", flag: "🇨🇮", port: "Abidjan", dd: 0.20, rs: 0.01, pcc: 0.005, pcs: 0.01, tva: 0.18, immat: 400_000 },
  { code: "sn", name: "Sénégal",       flag: "🇸🇳", port: "Dakar",   dd: 0.20, rs: 0.01, pcc: 0.005, pcs: 0.01, tva: 0.18, immat: 300_000 },
];

function fmt(n: number) {
  return Math.round(n).toLocaleString("fr-FR") + " FCFA";
}
function pct(n: number) {
  return (n * 100).toFixed(1) + "%";
}

export default function SimulateurClient({ waNumber }: { waNumber: string }) {
  const [cifStr, setCifStr] = useState("");
  const [countryCode, setCountryCode] = useState("bj");

  const country = COUNTRIES.find((c) => c.code === countryCode)!;

  const cif = useMemo(() => {
    const n = parseInt(cifStr.replace(/\D/g, ""), 10);
    return isNaN(n) ? 0 : n;
  }, [cifStr]);

  const result = useMemo(() => {
    if (!cif) return null;
    const dd  = cif * country.dd;
    const rs  = cif * country.rs;
    const pcc = cif * country.pcc;
    const pcs = cif * country.pcs;
    const tvaBase = cif + dd + rs + pcc + pcs;
    const tva     = tvaBase * country.tva;
    const taxes   = dd + rs + pcc + pcs + tva;
    const subTotal = cif + taxes;
    const total    = subTotal + country.immat;
    const txRate   = taxes / cif;
    return { dd, rs, pcc, pcs, tva, taxes, subTotal, total, txRate };
  }, [cif, country]);

  const waMsg = result
    ? encodeURIComponent(
        `Bonjour, j'ai utilisé votre simulateur de coût.\n\n` +
        `Prix CIF : ${fmt(cif)}\n` +
        `Pays : ${country.name} — port de ${country.port}\n` +
        `Coût total estimé : ${fmt(result.total)}\n\n` +
        `Pouvez-vous me proposer un véhicule correspondant ?`
      )
    : "";

  return (
    <main className="simulateur-page">
      {/* Hero */}
      <div className="sim-hero">
        <div className="sim-hero-inner">
          <div className="sim-breadcrumb">
            <Link href="/">Accueil</Link>
            <span> › </span>
            <span>Simulateur</span>
          </div>
          <h1 className="sim-title">Simulateur de coût d'acquisition</h1>
          <p className="sim-subtitle">
            Droits de douane · TVA · Immatriculation — estimez le coût total
            avant d'acheter.
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="sim-body">
        <div className="sim-card">
          {/* Inputs */}
          <div className="sim-inputs">
            <div className="sim-field">
              <label className="sim-label">Prix CIF du véhicule (FCFA)</label>
              <input
                className="sim-input"
                type="text"
                inputMode="numeric"
                placeholder="Ex : 11 300 000"
                value={cifStr}
                onChange={(e) => setCifStr(e.target.value)}
              />
              <div className="sim-hint">
                Le prix CIF est affiché sur chaque fiche du catalogue.{" "}
                <Link href="/catalogue" className="sim-hint-link">
                  Voir le catalogue →
                </Link>
              </div>
            </div>

            <div className="sim-field">
              <label className="sim-label">Pays de livraison</label>
              <div className="sim-countries">
                {COUNTRIES.map((c) => (
                  <button
                    key={c.code}
                    className={`sim-country-btn${countryCode === c.code ? " active" : ""}`}
                    onClick={() => setCountryCode(c.code)}
                  >
                    <span className="sim-country-flag">{c.flag}</span>
                    <span className="sim-country-name">{c.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Result */}
          {result ? (
            <div className="sim-result">
              <div className="sim-result-head">
                Estimation — {country.name} · port de {country.port}
              </div>

              <div className="sim-breakdown">
                <div className="sim-row sim-row-base">
                  <span>Prix CIF</span>
                  <span>{fmt(cif)}</span>
                </div>

                <div className="sim-section-label">Droits &amp; taxes à l'importation</div>

                {[
                  { label: `Droit de douane (${pct(country.dd)})`,        val: result.dd  },
                  { label: `Redevance statistique (${pct(country.rs)})`,  val: result.rs  },
                  { label: `Prélèvement CEDEAO (${pct(country.pcc)})`,    val: result.pcc },
                  { label: `Prélèvement UEMOA (${pct(country.pcs)})`,     val: result.pcs },
                  { label: `TVA (${pct(country.tva)})`,                   val: result.tva },
                ].map(({ label, val }) => (
                  <div key={label} className="sim-row">
                    <span>{label}</span>
                    <span className="sim-row-plus">+ {fmt(val)}</span>
                  </div>
                ))}

                <div className="sim-row sim-row-sub">
                  <span>Sous-total</span>
                  <span>{fmt(result.subTotal)}</span>
                </div>

                <div className="sim-section-label">Frais nationaux estimés</div>

                <div className="sim-row">
                  <span>Immatriculation &amp; carte grise</span>
                  <span className="sim-row-plus">+ {fmt(country.immat)}</span>
                </div>

                <div className="sim-row sim-row-total">
                  <span>COÛT TOTAL ESTIMÉ</span>
                  <span>{fmt(result.total)}</span>
                </div>
              </div>

              <div className="sim-tax-summary">
                Taxes sur le prix CIF :{" "}
                <strong>{pct(result.txRate)}</strong> soit{" "}
                <strong>{fmt(result.taxes)}</strong>
              </div>

              <a
                href={`https://wa.me/${waNumber}?text=${waMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="sim-cta"
              >
                📱 Confirmer avec notre équipe
              </a>

              <p className="sim-disclaimer">
                ⚠️ Estimations indicatives basées sur les taux UEMOA/CEDEAO en
                vigueur. Les montants exacts dépendent de la valeur en douane,
                du régime fiscal et des frais portuaires variables. Consultez
                un transitaire agréé pour un devis précis.
              </p>
            </div>
          ) : (
            <div className="sim-empty">
              <div className="sim-empty-icon">🧮</div>
              <div>Entrez un prix CIF pour voir l'estimation</div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

import Link from "next/link";
import type { ReactNode } from "react";

function IconCar() {
  return (
    <svg width="52" height="38" viewBox="0 0 52 38" fill="none">
      <path d="M3 28h46v-4l-4-3-8-13H15L7 21l-4 3v4Z" stroke="white" strokeWidth="1.7" strokeLinejoin="round" fill="rgba(255,255,255,0.05)"/>
      <circle cx="13" cy="28" r="5.5" stroke="white" strokeWidth="1.7" fill="rgba(255,255,255,0.05)"/>
      <circle cx="39" cy="28" r="5.5" stroke="white" strokeWidth="1.7" fill="rgba(255,255,255,0.05)"/>
      <path d="M15 21l5-9h12l5 9" stroke="white" strokeWidth="1.7" strokeLinejoin="round"/>
      <path d="M24 28h4" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity=".4"/>
    </svg>
  );
}

function IconContract() {
  return (
    <svg width="42" height="50" viewBox="0 0 42 50" fill="none">
      <rect x="3" y="2" width="30" height="38" rx="3" stroke="white" strokeWidth="1.7" fill="rgba(255,255,255,0.05)"/>
      <path d="M10 13h16M10 20h16M10 27h10" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity=".7"/>
      <circle cx="32" cy="38" r="8" fill="rgba(160,20,20,0.18)" stroke="#A01414" strokeWidth="1.5"/>
      <path d="M28.5 38l2.5 2.5 4-4" stroke="#A01414" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function IconFactory() {
  return (
    <svg width="52" height="46" viewBox="0 0 52 46" fill="none">
      <rect x="2" y="28" width="48" height="16" rx="2" stroke="white" strokeWidth="1.7" fill="rgba(255,255,255,0.05)"/>
      <path d="M10 28V18l10 7V18l10 7V18l10-5v15" stroke="white" strokeWidth="1.7" strokeLinejoin="round" fill="rgba(255,255,255,0.04)"/>
      <rect x="22" y="4" width="8" height="14" rx="1" stroke="white" strokeWidth="1.7" fill="rgba(255,255,255,0.04)"/>
      <circle cx="14" cy="36" r="2.5" fill="rgba(255,255,255,0.25)"/>
      <circle cx="26" cy="36" r="2.5" fill="rgba(255,255,255,0.25)"/>
      <circle cx="38" cy="36" r="2.5" fill="rgba(255,255,255,0.25)"/>
    </svg>
  );
}

function IconShip() {
  return (
    <svg width="56" height="42" viewBox="0 0 56 42" fill="none">
      <path d="M4 34l6 6h36l6-6H4Z" stroke="white" strokeWidth="1.7" strokeLinejoin="round" fill="rgba(255,255,255,0.05)"/>
      <path d="M10 34V22h36v12" stroke="white" strokeWidth="1.7" strokeLinejoin="round" fill="rgba(255,255,255,0.04)"/>
      <path d="M18 22V13h20v9" stroke="white" strokeWidth="1.7" strokeLinejoin="round" fill="rgba(255,255,255,0.04)"/>
      <path d="M28 13V5" stroke="white" strokeWidth="1.7" strokeLinecap="round"/>
      <path d="M22 7h12" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity=".6"/>
      <path d="M2 38h52" stroke="rgba(255,255,255,0.12)" strokeWidth="1.4" strokeDasharray="5 4"/>
    </svg>
  );
}

interface Step {
  num: string;
  label: string;
  title: string;
  desc: string;
  callout: string | null;
  icon: ReactNode;
}

const STEPS: Step[] = [
  {
    num: "01",
    label: "CATALOGUE",
    title: "Vous choisissez",
    desc: "Parcourez nos modèles neufs 0 km. Vous ne trouvez pas votre véhicule ? On source sur mesure directement en Chine.",
    callout: null,
    icon: <IconCar />,
  },
  {
    num: "02",
    label: "CONTRAT",
    title: "On signe ensemble",
    desc: "Contrat de commissionnaire à l'achat et ordre de mission signés. Votre commande est protégée légalement dès le premier jour.",
    callout: "Protection légale garantie",
    icon: <IconContract />,
  },
  {
    num: "03",
    label: "PRODUCTION",
    title: "Commande en usine",
    desc: "Votre véhicule est commandé directement en usine en Chine. Paiement sécurisé en deux versements, sans surprise.",
    callout: "70 % commande · 30 % expédition",
    icon: <IconFactory />,
  },
  {
    num: "04",
    label: "LIVRAISON CIF",
    title: "Réception à votre port",
    desc: "Votre véhicule neuf 0 km arrive à votre port. Coût, assurance maritime et fret sont déjà inclus dans votre prix.",
    callout: "CIF — Tout compris",
    icon: <IconShip />,
  },
];

export default function ProcessSection() {
  return (
    <section className="section proc-section" id="comment-ca-marche">
      <div className="section-inner proc-inner">

        {/* Header */}
        <div className="proc-header">
          <span className="proc-eyebrow">LE PROCESS</span>
          <h2 className="h2 proc-title">Comment ça marche&nbsp;?</h2>
          <p className="proc-sub">
            De votre choix jusqu&apos;à la livraison — un process clair, protégé par contrat, sans surprise.
          </p>
        </div>

        {/* Infographic */}
        <div className="proc-infographic">

          {/* Rail line (desktop) */}
          <div className="proc-rail-line" aria-hidden />

          {/* Steps */}
          <div className="proc-steps">
            {STEPS.map((step) => (
              <div key={step.num} className="proc-step">
                {/* Node on the rail */}
                <div className="proc-node">
                  <span className="proc-node-num">{step.num}</span>
                </div>

                {/* Card */}
                <div className="proc-card">
                  <div className="proc-card-label">{step.label}</div>
                  <div className="proc-card-icon">{step.icon}</div>
                  <h3 className="proc-card-title">{step.title}</h3>
                  <p className="proc-card-desc">{step.desc}</p>
                  {step.callout && (
                    <div className="proc-callout">{step.callout}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="proc-footer">
          <div className="proc-duration">
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden>
              <circle cx="7.5" cy="7.5" r="6.5" stroke="rgba(255,255,255,0.3)" strokeWidth="1.3"/>
              <path d="M7.5 4.5v3.5L10 10" stroke="rgba(255,255,255,0.55)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>45 à 90 jours en fonction de votre port · De la commande à la réception</span>
          </div>
          <Link href="/catalogue" className="proc-cta-btn">
            Voir le catalogue
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden>
              <path d="M2.5 6.5h8M7 2.5l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>

      </div>
    </section>
  );
}

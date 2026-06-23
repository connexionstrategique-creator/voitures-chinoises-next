import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Programme Apporteurs — Voitures Chinoises | Connexion Stratégique",
  description: "Devenez apporteur d'affaires pour Connexion Stratégique. Gagnez une commission sur chaque vente de véhicule chinois que vous apportez.",
};

const WA_NUMBER = "22941765341";

export default function ApporteursPage() {
  const waMsg = encodeURIComponent("Bonjour, je souhaite rejoindre le programme apporteurs de Connexion Stratégique.");

  return (
    <>
      <Nav />
      <section className="section" style={{ paddingTop: "120px", background: "var(--yellow, #f5f0e8)" }}>
        <div className="section-inner">
          <div className="tag">Programme partenaires</div>
          <h1 className="h2">
            Devenez apporteur.<br />
            <em>Gagnez à chaque vente.</em>
          </h1>
          <p style={{ fontSize: 18, maxWidth: 600, lineHeight: 1.7, color: "var(--mid, #555)", marginTop: 24 }}>
            Vous connaissez des entrepreneurs, des professionnels ou des particuliers qui souhaitent s&apos;offrir un véhicule chinois neuf ?
            Mettez-les en contact avec nous — et percevez une <strong>commission sur chaque vente conclue</strong>.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="section-inner">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 32, marginBottom: 64 }}>
            {[
              { num: "01", icon: "🤝", title: "Vous présentez un client", desc: "Vous recommandez Connexion Stratégique à quelqu'un de votre réseau qui cherche un véhicule." },
              { num: "02", icon: "📋", title: "On signe un accord", desc: "Un contrat d'apport d'affaires est signé entre vous et Connexion Stratégique avant toute démarche." },
              { num: "03", icon: "🚗", title: "La vente se conclut", desc: "Votre client commande son véhicule. Nous gérons tout : usine, transport, livraison." },
              { num: "04", icon: "💰", title: "Vous percevez votre commission", desc: "Une commission fixée dans votre contrat vous est versée dès réception du paiement client." },
            ].map((step) => (
              <div key={step.num} style={{ background: "var(--yellow, #f5f0e8)", borderRadius: 16, padding: "32px 28px" }}>
                <div style={{ fontSize: 32, marginBottom: 16 }}>{step.icon}</div>
                <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", color: "var(--red, #A01414)", marginBottom: 8 }}>{step.num}</div>
                <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>{step.title}</h3>
                <p style={{ fontSize: 15, color: "var(--mid, #666)", lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ background: "#111", borderRadius: 24, padding: "48px", color: "#fff", textAlign: "center" }}>
            <div style={{ fontSize: 13, letterSpacing: "0.15em", color: "rgba(255,255,255,0.4)", marginBottom: 16 }}>REJOINDRE LE PROGRAMME</div>
            <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 16 }}>Intéressé par le programme apporteurs ?</h2>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.6)", marginBottom: 32, maxWidth: 500, margin: "0 auto 32px" }}>
              Contactez-nous sur WhatsApp pour discuter des conditions et signer votre contrat d&apos;apport d&apos;affaires.
            </p>
            <a
              href={`https://wa.me/${WA_NUMBER}?text=${waMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="sourcing-btn-primary"
              style={{ display: "inline-block" }}
            >
              📱 Rejoindre sur WhatsApp →
            </a>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

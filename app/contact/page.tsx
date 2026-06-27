import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { getSiteSettings } from "@/sanity/queries";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — Voitures Chinoises",
  description: "Contactez-nous par WhatsApp ou téléphone. Livraison CIF depuis la Chine vers le Bénin, Togo et toute l'Afrique de l'Ouest.",
};

export default async function ContactPage() {
  let settings;
  try { settings = await getSiteSettings(); } catch {}

  const wa = settings?.whatsappNumber ?? "8619587439774";
  const phone = settings?.phoneDisplay ?? "+229 01 41 76 53 41";
  const phoneCN = settings?.phoneCN ?? "+86 195 8743 9774";
  const waMsg = encodeURIComponent("Bonjour, je souhaite obtenir des informations sur vos véhicules.");

  return (
    <>
      <Nav />
      <section className="section">
        <div className="section-inner" style={{ maxWidth: 680 }}>

          <h1 className="page-title">
            Une question ?<br />
            <em>On vous répond.</em>
          </h1>

          <div className="contact-cards">
            <a
              href={`https://wa.me/${wa}?text=${waMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-card contact-card--primary"
            >
              <div className="contact-card-icon">📱</div>
              <div>
                <div className="contact-card-label">WhatsApp — Réponse rapide</div>
                <div className="contact-card-value">{phone}</div>
              </div>
              <span className="contact-card-arrow">→</span>
            </a>

            <div className="contact-card">
              <div className="contact-card-icon">📞</div>
              <div>
                <div className="contact-card-label">Bureau Chine</div>
                <div className="contact-card-value">{phoneCN}</div>
              </div>
            </div>

            <div className="contact-card">
              <div className="contact-card-icon">📍</div>
              <div>
                <div className="contact-card-label">Bureau Bénin</div>
                <div className="contact-card-value">Cotonou, Étoile Rouge</div>
              </div>
            </div>

            <div className="contact-card">
              <div className="contact-card-icon">📍</div>
              <div>
                <div className="contact-card-label">Bureau Chine</div>
                <div className="contact-card-value">Guangzhou Baiyun, Chine</div>
              </div>
            </div>
          </div>

          <p className="contact-note">
            Nous répondons sous 24h ouvrées. Pour un devis sur mesure, précisez le modèle souhaité, votre port de destination et votre budget.
          </p>

        </div>
      </section>
      <Footer waNumber={wa} phoneDisplay={phone} phoneCN={phoneCN} minimal />
    </>
  );
}

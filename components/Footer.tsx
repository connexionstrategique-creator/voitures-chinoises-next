import Image from "next/image";

const WA_NUMBER = "22941765341";

export default function Footer() {
  const waMsg = encodeURIComponent("Bonjour, je souhaite obtenir des informations sur vos véhicules.");

  return (
    <>
      {/* Sourcing Banner */}
      <section className="sourcing-banner" id="contact">
        <div className="sourcing-inner">
          <div className="sourcing-eyebrow">
            <span className="sourcing-line" />
            VOUS N&apos;AVEZ PAS TROUVÉ CE QUE VOUS CHERCHEZ ?
          </div>
          <h2 className="sourcing-title">Pas de problème.<br /><em>On vous trouve la voiture.</em></h2>
          <p className="sourcing-desc">
            Dites-nous ce que vous recherchez — marque, modèle, budget, destination.<br />
            Nous vous faisons un devis personnalisé sous 48h ouvrées.
          </p>
          <div className="sourcing-actions">
            <a
              href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Bonjour, je souhaite un devis sur mesure pour un véhicule spécifique.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="sourcing-btn-primary"
            >
              DEMANDER UN DEVIS SPÉCIFIQUE →
            </a>
            <a href="#catalogue" className="sourcing-btn-outline">EXPLORER LE CATALOGUE</a>
          </div>
        </div>
      </section>

      {/* SAV */}
      <section className="section" style={{ background: "var(--yellow)", paddingTop: 0, paddingBottom: 80 }}>
        <div className="section-inner">
          <div className="sav-box">
            <div className="sav-col">
              <h4>🔧 SAV — Ce que nous ne faisons pas</h4>
              <p>Voitures Chinoises est un <strong>importateur, pas un garagiste</strong>. Nous ne prenons pas en charge le service après-vente, les réparations ou la maintenance des véhicules vendus.</p>
              <p>Chaque véhicule est livré neuf avec sa <strong>garantie constructeur</strong>. Pour la maintenance, nous vous recommandons de vous rapprocher des ateliers spécialisés en véhicules asiatiques au Bénin.</p>
            </div>
            <div className="sav-col">
              <h4>📦 Pièces détachées — Ce que nous pouvons faire</h4>
              <p>En revanche, nous pouvons <em>commander toute pièce détachée à votre demande</em>, directement auprès des fabricants et fournisseurs chinois.</p>
              <p>Pièces d&apos;origine, prix compétitifs, <strong>délai de livraison rapide depuis la Chine</strong>. Transmettez-nous la référence ou la description de la pièce souhaitée et nous vous faisons un retour sous 48h.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <div className="footer-top">
        <div>
          <Image
            src="https://res.cloudinary.com/daol8mzeg/image/upload/v1772665987/LOGO_VOITURES_CHINOISE_ROUGE_600x_pfafuh.png"
            alt="Voitures Chinoises"
            width={180}
            height={48}
            style={{ height: 48, width: "auto", filter: "brightness(0) invert(1)", marginBottom: 16, opacity: 0.85 }}
            unoptimized
          />
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", lineHeight: 1.7, maxWidth: 260 }}>
            Import direct Chine → Afrique francophone.<br />
            Prix usine CIF — Cotonou · Lomé · Abidjan · Dakar.
          </p>
        </div>
        <div>
          <div className="footer-col-title">Navigation</div>
          <ul className="footer-links">
            <li><a href="#catalogue">Catalogue</a></li>
            <li><a href="#marques">Marques</a></li>
            <li><a href="#pourquoi">Pourquoi nous</a></li>
            <li><a href="#comment-ca-marche">Process</a></li>
            <li><a href="#faq">FAQ</a></li>
          </ul>
        </div>
        <div>
          <div className="footer-col-title">Contact</div>
          <ul className="footer-links">
            <li>📞 +229 01 41 76 53 41</li>
            <li>📞 +86 196 8743 9774</li>
            <li>📍 Cotonou, Étoile Rouge</li>
            <li>📍 Guangzhou Baiyun, Chine</li>
          </ul>
        </div>
        <div>
          <div className="footer-col-title">Commander</div>
          <a
            href={`https://wa.me/${WA_NUMBER}?text=${waMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="footer-wa-btn"
          >
            📱 WhatsApp
          </a>
        </div>
      </div>
      <footer>
        <span>© 2026 Connexion Stratégique — Voitures Chinoises. Tous droits réservés.</span>
        <span style={{ color: "rgba(255,255,255,0.3)" }}>CIF · Cotonou · Lomé · Abidjan · Dakar</span>
      </footer>
    </>
  );
}

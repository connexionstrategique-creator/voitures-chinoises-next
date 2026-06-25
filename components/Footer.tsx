interface FooterProps {
  waNumber?: string;
  phoneDisplay?: string;
  phoneCN?: string;
  minimal?: boolean;
}

export default function Footer({
  waNumber = "8619587439774",
  phoneDisplay = "+229 01 41 76 53 41",
  phoneCN = "+86 195 8743 9774",
  minimal = false,
}: FooterProps) {
  const waMsg = encodeURIComponent("Bonjour, je souhaite obtenir des informations sur vos véhicules.");
  const waDevis = encodeURIComponent("Bonjour, je souhaite un devis sur mesure pour un véhicule spécifique.");

  return (
    <>
      {/* Sourcing Banner */}
      {!minimal && (
        <section className="sourcing-banner" id="contact">
          <div className="sourcing-inner">
            <h2 className="sourcing-title">Vous n&apos;avez pas trouvé<br /><em>ce que vous cherchez ?</em></h2>
            <p className="sourcing-desc">
              Pas de problème — on vous trouve la voiture. Dites-nous la marque, le modèle, votre budget et votre destination.<br />
              Nous vous faisons un devis personnalisé sous 48h ouvrées.
            </p>
            <div className="sourcing-actions">
              <a
                href={`https://wa.me/${waNumber}?text=${waDevis}`}
                target="_blank"
                rel="noopener noreferrer"
                className="sourcing-btn-primary"
              >
                DEMANDER UN DEVIS SPÉCIFIQUE →
              </a>
            </div>
          </div>
        </section>
      )}

      {/* SAV */}
      {!minimal && (
        <section className="section" style={{ background: "var(--yellow)", paddingTop: 0, paddingBottom: 80 }}>
          <div className="section-inner">
            <div className="sav-box">
              <div className="sav-col">
                <h4>✅ Véhicule neuf, jamais immatriculé</h4>
                <p>Chaque véhicule est livré <strong>neuf, 0 km, sorti directement d&apos;usine</strong>. Vous repartez avec un véhicule en parfait état, documenté et conforme aux standards de la marque.</p>
                <p>Pour l&apos;entretien courant, nous vous orientons vers les <strong>ateliers spécialisés en véhicules chinois</strong> présents au Bénin et dans la sous-région.</p>
              </div>
              <div className="sav-col">
                <h4>📦 Pièces détachées depuis la Chine</h4>
                <p>Besoin d&apos;une pièce spécifique ? Nous <em>commandons toute pièce détachée directement auprès des fabricants chinois</em>, à prix d&apos;usine.</p>
                <p>Pièces d&apos;origine garanties, <strong>délai rapide depuis la Chine</strong>. Transmettez-nous la référence ou une description — retour sous 48h.</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <div className="footer-top">
        <div>
          <ul className="footer-links">
            <li><a href="/catalogue">Catalogue</a></li>
            <li><a href="/marques">Marques</a></li>
            <li><a href="/pourquoi">Pourquoi nous</a></li>
            <li><a href="/process">Process</a></li>
            <li><a href="/faq">FAQ</a></li>
            <li><a href="/blog">Blog</a></li>
          </ul>
        </div>
        <div>
          <div className="footer-col-title">Contact</div>
          <ul className="footer-links">
            <li>
              <a href={`https://wa.me/${waNumber}?text=${waMsg}`} target="_blank" rel="noopener noreferrer" style={{ color: "inherit" }}>
                📞 {phoneDisplay}
              </a>
            </li>
            <li>📞 {phoneCN}</li>
            <li><a href="https://share.google/HqE0ij0QAgsbYwo3H" target="_blank" rel="noopener noreferrer" style={{ color: "inherit" }}>📍 Cotonou, Étoile Rouge</a></li>
            <li>📍 Guangzhou Baiyun, Chine</li>
          </ul>
        </div>
      </div>
      <footer>
        <span>© 2026 Voitures Chinoises — Tous droits réservés</span>
      </footer>
    </>
  );
}

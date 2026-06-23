import Image from "next/image";

export default function AboutSection() {
  return (
    <section className="about-section" id="about">
      <div className="about-headline-band">
        <div className="about-headline-inner">
          <div className="about-hl-tag">
            <span className="about-hl-line" />
            QUI SOMMES-NOUS
          </div>
          <h2 className="about-hl-title">Connexion<br /><em>Stratégique</em></h2>
          <p className="about-hl-mission">Faciliter la connexion des entrepreneurs<br />au monde des affaires.</p>
        </div>
        <div className="about-headline-stats">
          <div className="about-hs"><span className="about-hs-num">3<sup>+</sup></span><span className="about-hs-label">Ans terrain Chine</span></div>
          <div className="about-hs"><span className="about-hs-num">5</span><span className="about-hs-label">Éditions business</span></div>
          <div className="about-hs"><span className="about-hs-num">6</span><span className="about-hs-label">Pays africains</span></div>
          <div className="about-hs"><span className="about-hs-num">600M</span><span className="about-hs-label">FCFA transactions</span></div>
        </div>
      </div>

      <div className="about-split">
        <div className="about-split-photos">
          <div className="about-photo-big" style={{ position: "relative" }}>
            <Image
              src="https://res.cloudinary.com/daol8mzeg/image/upload/v1772688013/IMG_8932_lhtlev.jpg"
              alt="Canton Fair"
              fill
              style={{ objectFit: "cover", filter: "brightness(0.9)" }}
              unoptimized
            />
            <div className="about-photo-tag">Canton Fair · Guangzhou</div>
          </div>
          <div className="about-photo-row">
            {[
              { src: "https://res.cloudinary.com/daol8mzeg/image/upload/v1772688013/IMG_9965_nfbdrz.jpg", alt: "Terrain Chine" },
              { src: "https://res.cloudinary.com/daol8mzeg/image/upload/v1772688087/IMG_6559_dg62ce.jpg", alt: "Avec clients" },
              { src: "https://res.cloudinary.com/daol8mzeg/image/upload/f_jpg/v1772688552/IMG_2067_ncolye.heic", alt: "Livraison port" },
            ].map((photo) => (
              <div className="about-photo-sm-wrap" key={photo.alt} style={{ position: "relative" }}>
                <Image src={photo.src} alt={photo.alt} fill style={{ objectFit: "cover", filter: "brightness(0.8)" }} unoptimized />
              </div>
            ))}
          </div>
        </div>

        <div className="about-split-text">
          <p className="about-intro">
            Depuis plus de 3 ans, nous sillonnons la Chine pour le compte d&apos;entrepreneurs qui veulent acheter en usine, sécuriser leurs importations et développer leur activité à plus grande échelle.
          </p>
          <p className="about-body-p">
            Nous ne sommes pas un agent commercial. Nous sommes sur le terrain, avec vous — à négocier, vérifier, et organiser chaque commande.
          </p>

          <div className="about-services">
            {[
              { num: "01", title: "Voyages d'affaires", icon: "✈️", desc: "Canton Fair, marchés spécialisés, visites d'usines avec interprètes professionnels." },
              { num: "02", title: "Import véhicules", icon: "🚗", desc: "Négociation directe avec les usines chinoises. Prix CIF, livraison Afrique francophone." },
              { num: "03", title: "Sourcing produits", icon: "📦", desc: "Sourcing sur mesure pour tous types de produits manufacturés en Chine." },
              { num: "04", title: "Formation import Chine", icon: "🎓", desc: "Programmes de formation pour entrepreneurs qui veulent maîtriser l'import depuis la Chine." },
            ].map((svc) => (
              <div className="about-svc" key={svc.num}>
                <div className="about-svc-num">{svc.num}</div>
                <div className="about-svc-content">
                  <div className="about-svc-title">{svc.title} <span>{svc.icon}</span></div>
                  <div className="about-svc-desc">{svc.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="about-sig-block">
            <div className="about-sig-bar" />
            <div>
              <div className="about-sig-name">Connexion Stratégique</div>
              <div className="about-sig-role">Votre pont vers les usines chinoises · Depuis 2021</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

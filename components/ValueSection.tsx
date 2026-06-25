export default function ValueSection() {
  return (
    <>
      {/* CIF Narrative */}
      <section className="section cif-section" id="pourquoi">
        <div className="section-inner">
          <div className="cif-inner">
            <div className="tag">Notre engagement prix</div>
            <h2 className="h2">
              La Chine produit <em>30% des véhicules</em><br />mondiaux. Vous méritez leurs vrais prix.
            </h2>
            <p>La Chine est devenue le premier producteur automobile mondial, dépassant même les États-Unis et l&apos;Allemagne. Derrière cette puissance se cache une réalité : <strong>des véhicules de qualité exceptionnelle</strong>, bourrés de technologie, à des prix que l&apos;Europe ne peut pas concurrencer.</p>
            <p>Connexion Stratégique vous ouvre l&apos;accès direct à ce marché. <em>Plus d&apos;intermédiaires, plus de marges cachées.</em> Nos équipes négocient directement avec les usines et vous livrent au meilleur prix possible, CIF — même prix vers Cotonou, Lomé, Abidjan et Dakar.</p>
            <div className="pull-quote">
              &ldquo;Nos prix sont CIF — c&apos;est-à-dire coût du véhicule, assurance maritime et fret inclus jusqu&apos;à destination. Même prix vers Cotonou, Lomé, Abidjan et Dakar. Ce que vous voyez est ce que vous payez.&rdquo;
            </div>
            <p>Et contrairement à la seconde main, <strong>tous nos véhicules sont neufs, 0 kilomètre, sortis d&apos;usine</strong>. Chaque véhicule embarque les dernières technologies et arrive dans un état irréprochable à la livraison.</p>
          </div>
          <div className="highlight-box">
            <p>Nos clients économisent en moyenne <strong>20 à 35%</strong> par rapport aux prix du marché local — sur des véhicules neufs 0 km, livrés directement par bateau depuis les meilleures usines de Chine.</p>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section" style={{ background: "var(--cream)", paddingTop: 0 }}>
        <div className="section-inner">
          <div className="value-layout">
            <div>
              <div className="tag">Ce que ça change pour vous</div>
              <h2 className="h2">Quatre raisons<br />de choisir <em>Voitures Chinoises.</em></h2>
              <p className="lead">Connexion Stratégique est votre pont direct entre les usines chinoises et Cotonou. Voici ce que cela signifie concrètement.</p>
            </div>
            <div>
              {[
                { num: "01", title: "Prix directs d'usine, sans gonflement", desc: "Nous négocions en direct avec les fabricants. Zéro agent de transit inutile — vous bénéficiez des vrais prix de gros." },
                { num: "02", title: "100% neuf, 0 kilomètre, jamais immatriculé", desc: "Aucun véhicule d'occasion dans notre catalogue. Chaque voiture est neuve, scellée, sortie directement d'usine." },
                { num: "03", title: "Prix CIF — tout compris, transparent", desc: "Coût du véhicule, assurance maritime et fret inclus dans nos prix. Livraison vers tous les ports d'Afrique francophone. Pas de surprise à l'arrivée." },
                { num: "04", title: "Devis sous 48h, livraison en Afrique francophone", desc: "Demandez votre devis, recevez une réponse en 48h ouvrées. Nous gérons la logistique jusqu'à vous — Bénin, Togo, Côte d'Ivoire, Sénégal et au-delà." },
              ].map((b) => (
                <div className="benefit" key={b.num}>
                  <div className="benefit-num">{b.num}</div>
                  <div>
                    <h4>{b.title}</h4>
                    <p>{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default function ProcessSection() {
  const steps = [
    { num: "01", emoji: "🚗", title: "Vous choisissez", desc: "Parcourez le catalogue et trouvez votre véhicule. Vous ne trouvez pas ? On sourcera sur mesure." },
    { num: "02", emoji: "📋", title: "On signe ensemble", desc: "Contrat de commissionnaire à l'achat + ordre de mission. Votre commande est protégée légalement dès le départ." },
    { num: "03", emoji: "🏭", title: "On lance en usine", desc: "70% à la commande pour lancer la production. 30% restants avant expédition vers votre port." },
    { num: "04", emoji: "🚢", title: "Livraison CIF à votre port", desc: "Votre véhicule neuf 0 km arrive à votre port. Coût, assurance maritime et fret déjà inclus dans votre prix." },
  ];

  return (
    <section className="section steps-section" id="comment-ca-marche">
      <div className="section-inner">
        <div className="steps-header">
          <h2 className="h2">Comment ça marche ?</h2>
          <p className="steps-sub">De votre choix jusqu&apos;à la livraison — un process clair, sans surprise.</p>
        </div>
        <div className="steps-timeline">
          <div className="step-line" />
          {steps.map((step) => (
            <div className="step-row" key={step.num}>
              <div className="step-dot"><span>{step.num}</span></div>
              <div className="step-content">
                <div className="step-emoji">{step.emoji}</div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-desc" dangerouslySetInnerHTML={{ __html: step.desc.replace("70%", "<strong>70%</strong>").replace("30%", "<strong>30%</strong>") }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

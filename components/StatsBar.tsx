export default function StatsBar() {
  return (
    <div className="statsbar">
      <div className="statb">
        <div className="statb-num">20<em>+</em></div>
        <div className="statb-label">Marques disponibles</div>
      </div>
      <div className="statb">
        <div className="statb-num">60<em>+</em></div>
        <div className="statb-label">Modèles disponibles</div>
      </div>
      <div className="statb">
        <div className="statb-num"><em>100%</em></div>
        <div className="statb-label">Véhicules neufs</div>
      </div>
      <div className="statb">
        <div className="statb-num"><em>CIF</em></div>
        <div className="statb-label">Prix tout inclus</div>
      </div>
      <div className="statb">
        <div className="statb-num">0<em>km</em></div>
        <div className="statb-label">Garantie origine</div>
      </div>
    </div>
  );
}

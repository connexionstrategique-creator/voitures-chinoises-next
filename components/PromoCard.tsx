interface PromoCardProps {
  vehicleName: string;
  version?: string;
  year?: string;
  price: string;
  imageUrl?: string;
  includedItems?: string[];
  bonusItems?: string[];
  availableUnits?: number;
  paymentDeadline?: string;
  shippingDate?: string;
  ctaLabel?: string;
  whatsappMessage?: string;
}

const WA_NUMBER = "22941765341";

export default function PromoCard({
  vehicleName,
  version,
  year,
  price,
  imageUrl,
  includedItems = [],
  bonusItems = [],
  availableUnits,
  paymentDeadline,
  shippingDate,
  ctaLabel = "Réserver ma place",
  whatsappMessage,
}: PromoCardProps) {
  const defaultMsg = `Bonjour, je souhaite réserver un ${vehicleName}${year ? ` ${year}` : ""}. Merci de me contacter.`;
  const waMsg = whatsappMessage || defaultMsg;
  const waUrl = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(waMsg)}`;

  return (
    <div className="promo-card">
      {/* Header */}
      <div className="promo-card-header">
        <div className="promo-card-badge">OFFRE GROUPAGE</div>
        <div className="promo-card-name">{vehicleName}</div>
        {(version || year) && (
          <div className="promo-card-version">
            {version && <span>{version}</span>}
            {version && year && <span className="promo-card-dot">·</span>}
            {year && <span>ANNÉE {year}</span>}
          </div>
        )}
        <div className="promo-card-price-label">PRIX TTC EN FCFA</div>
        <div className="promo-card-price">{price}</div>
      </div>

      {/* Photo + body */}
      <div className="promo-card-body">
        {imageUrl && (
          <div className="promo-card-img-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageUrl} alt={vehicleName} className="promo-card-img" />
          </div>
        )}

        <div className="promo-card-cols">
          {/* Included */}
          {includedItems.length > 0 && (
            <div className="promo-card-section">
              <div className="promo-card-section-title">INCLUS DANS LE PRIX</div>
              <ul className="promo-card-list">
                {includedItems.map((item, i) => (
                  <li key={i}>
                    <span className="promo-card-check">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Bonus */}
          {bonusItems.length > 0 && (
            <div className="promo-card-section promo-card-bonus">
              <div className="promo-card-section-title">BONUS GRATUITS</div>
              <ul className="promo-card-list">
                {bonusItems.map((item, i) => (
                  <li key={i}>
                    <span className="promo-card-star">★</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Dates */}
        {(paymentDeadline || shippingDate || availableUnits) && (
          <div className="promo-card-dates">
            {availableUnits && (
              <div className="promo-card-date-item promo-card-units">
                <span className="promo-card-date-val">{String(availableUnits).padStart(2, "0")}</span>
                <span className="promo-card-date-key">VÉHICULES DISPONIBLES</span>
              </div>
            )}
            {paymentDeadline && (
              <div className="promo-card-date-item">
                <span className="promo-card-date-key">DATE LIMITE PAIEMENT</span>
                <span className="promo-card-date-val">{paymentDeadline}</span>
              </div>
            )}
            {shippingDate && (
              <div className="promo-card-date-item">
                <span className="promo-card-date-key">CHARGEMENT CONTENEUR</span>
                <span className="promo-card-date-val">{shippingDate}</span>
              </div>
            )}
          </div>
        )}

        {/* CTA */}
        <a href={waUrl} target="_blank" rel="noopener noreferrer" className="promo-card-cta">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          {ctaLabel}
        </a>

        <div className="promo-card-footer">
          <span>Voitures Chinoises</span>
          <span className="promo-card-dot">·</span>
          <span>by Connexion Stratégique</span>
          <span className="promo-card-dot">·</span>
          <span>Cotonou, Étoile Rouge</span>
        </div>
      </div>
    </div>
  );
}

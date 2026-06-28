interface PromoInlineProps {
  imageUrl?: string;
  title?: string;
  description?: string;
  ctaLabel?: string;
  whatsappMessage?: string;
  label?: string;
}

const WA = "22941765341";

export default function PromoInline({
  imageUrl,
  title,
  description,
  ctaLabel = "En savoir plus",
  whatsappMessage,
  label = "PUBLICITÉ",
}: PromoInlineProps) {
  if (!imageUrl && !title) return null;

  const href = whatsappMessage
    ? `https://wa.me/${WA}?text=${encodeURIComponent(whatsappMessage)}`
    : `https://wa.me/${WA}`;

  return (
    <div className="promo-inline">
      <div className="promo-inline-label">{label}</div>
      {imageUrl && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={imageUrl}
          alt={title || "Publicité"}
          className="promo-inline-img"
        />
      )}
      {title && <div className="promo-inline-title">{title}</div>}
      {description && <p className="promo-inline-desc">{description}</p>}
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="promo-inline-cta"
      >
        {ctaLabel}
      </a>
    </div>
  );
}

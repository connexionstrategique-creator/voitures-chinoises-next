interface PromoBannerProps {
  imageUrl?: string;
  alt?: string;
  linkUrl?: string;
}

export default function PromoBanner({ imageUrl, alt, linkUrl }: PromoBannerProps) {
  if (!imageUrl) return null;

  const img = (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={imageUrl}
      alt={alt || "Offre promotionnelle"}
      style={{ width: "100%", display: "block", borderRadius: 10 }}
    />
  );

  if (linkUrl) {
    return (
      <div style={{ margin: "36px 0" }}>
        <a href={linkUrl} target="_blank" rel="noopener noreferrer" style={{ display: "block" }}>
          {img}
        </a>
      </div>
    );
  }

  return <div style={{ margin: "36px 0" }}>{img}</div>;
}

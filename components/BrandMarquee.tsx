import { BRANDS } from "@/data/brands";

export default function BrandMarquee() {
  const items = [...BRANDS, ...BRANDS];

  return (
    <div className="marquee-section">
      <div className="marquee-track">
        <div className="marquee-inner">
          {items.map((brand, i) => (
            <span key={i} className="marquee-item">
              <span className="marquee-name">{brand.name.toUpperCase()}</span>
              <span className="marquee-dot">·</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

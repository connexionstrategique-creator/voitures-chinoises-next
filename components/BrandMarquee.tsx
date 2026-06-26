import { BRANDS } from "@/data/brands";

// Hauteur individuelle par marque (px) — ajuster ici si besoin
const LOGO_HEIGHTS: Record<string, number> = {
  "BYD":       22,
  "Changan":   32,
  "Jetour":    22,
  "GAC Motor": 32,
  "Livan":     20,
  "G700":      22,
  "Geely":     28,
  "Haval":     20,
  "Chery":     28,
  "MG":        36,
  "GWM":       22,
  "Omoda":     28,
  "Li Auto":   24,
  "Deepal":    20,
  "Nio":       26,
  "BAIC":      36,
  "Dongfeng":  36,
  "Voyah":     20,
  "Zeekr":     18,
  "SAIC":      40,
};

export default function BrandMarquee() {
  const items = [...BRANDS, ...BRANDS];

  return (
    <div className="marquee-section">
      <div className="marquee-track">
        <div className="marquee-inner">
          {items.map((brand, i) => (
            <span key={i} className="marquee-item">
              {brand.logo ? (
                <span className="marquee-logo-box">
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="marquee-logo"
                    style={{ height: `${LOGO_HEIGHTS[brand.name] ?? 28}px` }}
                    loading={i < 10 ? "eager" : "lazy"}
                  />
                </span>
              ) : (
                <span className="marquee-name">{brand.name.toUpperCase()}</span>
              )}
              <span className="marquee-dot">·</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

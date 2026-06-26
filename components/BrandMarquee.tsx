import { BRANDS } from "@/data/brands";

// Logos carrés (600×600) → grande hauteur pour visibilité
// Logos wordmarks larges → hauteur réduite (ils sont déjà visuellement larges)
const LOGO_HEIGHTS: Record<string, number> = {
  "BYD":       72,
  "Changan":   32,
  "Jetour":    80,
  "GAC Motor": 80,
  "Livan":     38,
  "G700":      72,
  "Geely":     52,
  "Haval":     80,
  "Chery":     72,
  "MG":        72,
  "GWM":       72,
  "Omoda":     80,
  "Li Auto":   72,
  "Deepal":    72,
  "Nio":       72,
  "BAIC":      72,
  "Dongfeng":  80,
  "Voyah":     72,
  "Zeekr":     80,
  "SAIC":      72,
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

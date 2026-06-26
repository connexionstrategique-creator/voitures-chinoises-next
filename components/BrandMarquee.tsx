import { BRANDS } from "@/data/brands";

// Logos carrés (600×600) → grande hauteur pour visibilité
// Logos wordmarks larges → hauteur réduite (ils sont déjà visuellement larges)
const LOGO_HEIGHTS: Record<string, number> = {
  "BYD":       48,
  "Changan":   26,  // wordmark 2000×352 → 182px wide à 32px, trop dominant
  "Jetour":    64,
  "GAC Motor": 64,
  "Livan":     30,  // wordmark 330×116
  "G700":      48,
  "Geely":     40,  // wordmark 2000×1075
  "Haval":     64,
  "Chery":     48,
  "MG":        48,
  "GWM":       48,
  "Omoda":     64,
  "Li Auto":   48,
  "Deepal":    48,
  "Nio":       48,
  "BAIC":      48,
  "Dongfeng":  64,
  "Voyah":     48,
  "Zeekr":     64,
  "SAIC":      48,
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

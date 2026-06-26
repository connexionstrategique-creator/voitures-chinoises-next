import { BRANDS } from "@/data/brands";

// SVG worldvectorlogo = propres, pas de marge → hauteur normale
// PNG Cloudinary = marge excessive → hauteur augmentée pour compenser
const LOGO_HEIGHTS: Record<string, number> = {
  "BYD":       36,  // SVG propre
  "Changan":   28,  // SVG wordmark large
  "Jetour":    80,  // PNG padded
  "GAC Motor": 34,  // SVG propre
  "Livan":     36,  // PNG wordmark
  "Geely":     38,  // SVG propre
  "Haval":     80,  // PNG padded
  "Chery":     50,  // SVG propre (emblème étoile)
  "MG":        48,  // SVG propre
  "GWM":       38,  // SVG propre
  "Omoda":     80,  // PNG padded
  "Li Auto":   72,  // PNG padded
  "Deepal":    72,  // PNG padded
  "Nio":       36,  // SVG propre
  "BAIC":      72,  // PNG padded
  "Dongfeng":  80,  // PNG padded
  "Voyah":     80,  // PNG padded
  "Zeekr":     80,  // PNG padded
  "SAIC":      72,  // PNG padded
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

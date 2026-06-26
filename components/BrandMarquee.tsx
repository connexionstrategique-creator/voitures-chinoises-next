import { BRANDS } from "@/data/brands";

// SVG worldvectorlogo (clean, no padding) vs PNG Cloudinary (heavy padding ~60%)
// Cible visuelle : logo perçu ~40px de hauteur effective
const LOGO_HEIGHTS: Record<string, number> = {
  "BYD":       44,  // SVG rond → 44×73px
  "Changan":   34,  // SVG wordmark → 34×133px
  "Jetour":    80,  // PNG padded (effectif ~30px)
  "GAC Motor": 26,  // SVG très large → 26×121px
  "Livan":     38,  // PNG wordmark → 38×107px
  "Geely":     20,  // SVG extrêmement large 6:1 → 20×120px
  "Haval":     80,  // PNG padded
  "Chery":     46,  // SVG emblème → 46×113px
  "MG":        80,  // PNG padded (Cloudinary)
  "GWM":       44,  // SVG propre → 44×71px
  "Omoda":     80,  // PNG padded
  "Li Auto":   72,  // PNG padded
  "Deepal":    72,  // PNG padded
  "Nio":       42,  // SVG wordmark → 42×113px
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

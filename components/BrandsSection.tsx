import Image from "next/image";
import type { Brand } from "@/data/types";

export default function BrandsSection({ brands }: { brands: Brand[] }) {
  return (
    <section className="section brands-section" id="marques">
      <div className="section-inner">
        <div className="tag">Marques disponibles à la commande</div>
        <h2 className="h2">
          Les grandes marques chinoises.<br />
          <em>Sélection disponible à la commande.</em>
        </h2>
        <div className="brands-grid">
          {brands.map((brand) => (
            <div className="brand-item" key={brand.name}>
              <div className="brand-logo-wrap">
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  width={150}
                  height={72}
                  className="brand-logo-img"
                  unoptimized
                />
              </div>
              <span className="brand-desc">{brand.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";
import Image from "next/image";
import type { Car } from "@/data/types";
import { carSlug } from "@/lib/slug";

export default function Nouveautes({ cars }: { cars: Car[] }) {
  const display = cars.slice(0, 5);
  if (!display.length) return null;
  return (
    <section className="nouveautes-section">
      <div className="nouveautes-inner">
        <div className="nouveautes-head">
          <div className="nouveautes-label">Nouveautés</div>
          <h2 className="nouveautes-title">Derniers modèles ajoutés</h2>
          <Link href="/catalogue" className="nouveautes-see-all">Voir tout le catalogue →</Link>
        </div>
        <div className="nouveautes-grid">
          {display.map(car => {
            const slug = carSlug(car.brand, car.model);
            const photo = car.photos?.[0]?.src || car.colorGroups?.[0]?.photos?.[0]?.src;
            return (
              <Link key={car.id} href={`/voitures/${slug}`} className="nouveaute-card">
                <div className="nouveaute-img-wrap">
                  {photo ? (
                    <Image
                      src={photo}
                      alt={`${car.brand} ${car.model}`}
                      fill
                      style={{ objectFit: "cover" }}
                      sizes="(max-width: 600px) 100vw, 280px"
                    />
                  ) : (
                    <div className="nouveaute-img-placeholder" />
                  )}
                  <span className="nouveaute-badge">Nouveau</span>
                </div>
                <div className="nouveaute-info">
                  <div className="nouveaute-brand">{car.brand}</div>
                  <div className="nouveaute-model">{car.model}</div>
                  <div className="nouveaute-price">{car.price} <span>FCFA</span></div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

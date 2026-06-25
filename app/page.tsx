import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import FeaturedCar from "@/components/FeaturedCar";
import BrandMarquee from "@/components/BrandMarquee";
import Catalogue from "@/components/Catalogue";
import Footer from "@/components/Footer";
import SchemaOrg from "@/components/SchemaOrg";
import { CARS } from "@/data/cars";
import { getCars, getSiteSettings } from "@/sanity/queries";

export const revalidate = 10;

export default async function Home() {
  let cars = CARS;
  let settings;

  try {
    const [sanityCars, s] = await Promise.all([getCars(), getSiteSettings()]);
    if (sanityCars && sanityCars.length > 0) cars = sanityCars;
    settings = s;
  } catch {}

  return (
    <>
      <SchemaOrg />
      <Nav dark />
      <Hero
        line1={settings?.heroLine1}
        line2={settings?.heroLine2}
        line3={settings?.heroLine3}
        subtitle={settings?.heroSubtitle}
        waNumber={settings?.whatsappNumber}
      />
      <BrandMarquee />
      {(() => {
        const featured = cars.find((c) => c.featured) || cars[0];
        return featured ? <FeaturedCar car={featured} waNumber={settings?.whatsappNumber} /> : null;
      })()}
      <Catalogue cars={cars} />
      <Footer
        waNumber={settings?.whatsappNumber}
        phoneDisplay={settings?.phoneDisplay}
        phoneCN={settings?.phoneCN}
      />
    </>
  );
}

import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import BrandMarquee from "@/components/BrandMarquee";
import Catalogue from "@/components/Catalogue";
import Nouveautes from "@/components/Nouveautes";
import Footer from "@/components/Footer";
import SchemaOrg from "@/components/SchemaOrg";
import { Suspense } from "react";
import { CARS } from "@/data/cars";
import { getCars, getSiteSettings, getNewestCars } from "@/sanity/queries";

export const metadata: Metadata = {
  alternates: { canonical: "https://www.voitureschinoises.com/" },
};

export const revalidate = 10;

export default async function Home() {
  let cars = CARS;
  let newest: typeof CARS = [];
  let settings;

  try {
    const [sanityCars, newestCars, s] = await Promise.all([getCars(), getNewestCars(10), getSiteSettings()]);
    if (sanityCars && sanityCars.length > 0) cars = sanityCars;
    newest = newestCars;
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
      {newest.length > 0 && <Nouveautes cars={newest} />}
      <Suspense>
        <Catalogue cars={cars} />
      </Suspense>
      <Footer
        waNumber={settings?.whatsappNumber}
        phoneDisplay={settings?.phoneDisplay}
        phoneCN={settings?.phoneCN}
      />
    </>
  );
}

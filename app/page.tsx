import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Catalogue from "@/components/Catalogue";
import Footer from "@/components/Footer";
import SchemaOrg from "@/components/SchemaOrg";
import { CARS } from "@/data/cars";
import { getCars } from "@/sanity/queries";

export const revalidate = 60;

export default async function Home() {
  let cars = CARS;

  try {
    const sanityCars = await getCars();
    if (sanityCars && sanityCars.length > 0) cars = sanityCars;
  } catch {}

  return (
    <>
      <SchemaOrg />
      <Nav />
      <Hero />
      <Catalogue cars={cars} />
      <Footer />
    </>
  );
}

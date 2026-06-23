import Nav from "@/components/Nav";
import Catalogue from "@/components/Catalogue";
import Footer from "@/components/Footer";
import { CARS } from "@/data/cars";
import { getCars } from "@/sanity/queries";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Catalogue 2026 — Voitures Chinoises | Connexion Stratégique",
  description: "Tous nos véhicules chinois disponibles à la commande. SUV, hybrides, 7 places. Prix CIF livraison Cotonou, Lomé, Abidjan, Dakar.",
};

export default async function CataloguePage() {
  let cars = CARS;
  try {
    const c = await getCars();
    if (c && c.length > 0) cars = c;
  } catch {}

  return (
    <>
      <Nav />
      <Catalogue cars={cars} />
      <Footer />
    </>
  );
}

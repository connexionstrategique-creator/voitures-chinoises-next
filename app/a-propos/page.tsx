import Nav from "@/components/Nav";
import AboutSection from "@/components/AboutSection";
import ValueSection from "@/components/ValueSection";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Qui sommes-nous & Pourquoi nous — Connexion Stratégique | Voitures Chinoises",
  description: "Connexion Stratégique : 3 ans de terrain en Chine, import direct véhicules neufs vers l'Afrique francophone. Prix CIF directs d'usine, 0 intermédiaire.",
};

export default function AProposPage() {
  return (
    <>
      <Nav />
      <AboutSection />
      <ValueSection />
      <Footer minimal />
    </>
  );
}

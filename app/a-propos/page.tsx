import Nav from "@/components/Nav";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Qui sommes-nous — Connexion Stratégique | Voitures Chinoises",
  description: "Connexion Stratégique : 3 ans de terrain en Chine, import direct véhicules neufs vers l'Afrique francophone. Canton Fair, usines, prix CIF.",
};

export default function AProposPage() {
  return (
    <>
      <Nav />
      <div style={{ paddingTop: "80px" }}>
        <AboutSection />
      </div>
      <Footer />
    </>
  );
}

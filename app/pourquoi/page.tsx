import Nav from "@/components/Nav";
import ValueSection from "@/components/ValueSection";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pourquoi nous — Voitures Chinoises | Connexion Stratégique",
  description: "Prix CIF directs d'usine, véhicules neufs 0km, livraison Afrique francophone. Découvrez pourquoi choisir Connexion Stratégique pour votre import véhicule.",
};

export default function PourquoiPage() {
  return (
    <>
      <Nav />
      <div style={{ paddingTop: "80px" }}>
        <ValueSection />
      </div>
      <Footer />
    </>
  );
}

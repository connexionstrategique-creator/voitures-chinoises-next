import Nav from "@/components/Nav";
import ProcessSection from "@/components/ProcessSection";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Comment ça marche — Voitures Chinoises | Connexion Stratégique",
  description: "4 étapes simples pour commander votre véhicule chinois neuf : choix, contrat, commande usine, livraison CIF à votre port.",
};

export default function ProcessPage() {
  return (
    <>
      <Nav />
      <ProcessSection />
      <Footer minimal />
    </>
  );
}

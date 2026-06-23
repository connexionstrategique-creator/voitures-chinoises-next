import Nav from "@/components/Nav";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ — Voitures Chinoises | Connexion Stratégique",
  description: "Toutes les réponses à vos questions sur l'achat de voitures chinoises : paiement, garantie, livraison CIF, contrat, délais.",
};

export default function FAQPage() {
  return (
    <>
      <Nav />
      <div style={{ paddingTop: "80px" }}>
        <FAQSection />
      </div>
      <Footer />
    </>
  );
}

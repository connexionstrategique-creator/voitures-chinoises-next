import Nav from "@/components/Nav";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ — Voitures Chinoises neuves Afrique | Connexion Stratégique",
  description: "Toutes les réponses à vos questions : paiement, garantie, prix CIF, contrat, délais de livraison. Importation de voitures chinoises neuves vers Cotonou, Lomé, Abidjan, Dakar.",
  openGraph: {
    title: "FAQ — Voitures Chinoises neuves Afrique",
    description: "Paiement, garantie, prix CIF, contrat, délais — toutes vos questions sur l'importation de voitures chinoises neuves en Afrique.",
    url: "https://www.voitureschinoises.com/faq",
  },
  alternates: { canonical: "https://www.voitureschinoises.com/faq" },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Quels modes de paiement acceptez-vous ?",
      "acceptedAnswer": { "@type": "Answer", "text": "Virement bancaire sur notre compte société, ou paiement en espèces à notre bureau de Cotonou. Chaque paiement est accompagné d'un contrat officiel et d'un ordre de mission d'achat signé." }
    },
    {
      "@type": "Question",
      "name": "Peut-on payer en plusieurs fois ?",
      "acceptedAnswer": { "@type": "Answer", "text": "Oui. Le paiement s'effectue en deux tranches : 70% à la commande pour lancer la production, et 30% avant expédition. Vous pouvez aussi régler 100% en une seule fois." }
    },
    {
      "@type": "Question",
      "name": "Y a-t-il un contrat ?",
      "acceptedAnswer": { "@type": "Answer", "text": "Oui, systématiquement. Avant toute commande, nous signons un contrat de commissionnaire à l'achat et un ordre de mission. Votre achat est protégé légalement selon le droit OHADA." }
    },
    {
      "@type": "Question",
      "name": "Quelle garantie sur les véhicules ?",
      "acceptedAnswer": { "@type": "Answer", "text": "Tous les véhicules sont livrés neufs 0 km. La garantie constructeur est de 10 ans pour les véhicules utilisés sur le territoire chinois. En dehors de la Chine, il n'y a pas de garantie constructeur — c'est une réalité du marché à l'export que nous communiquons en toute transparence." }
    },
    {
      "@type": "Question",
      "name": "Qu'est-ce que le prix CIF ?",
      "acceptedAnswer": { "@type": "Answer", "text": "CIF signifie Coût + Assurance + Fret. Le prix affiché inclut le transport maritime depuis la Chine, l'assurance de la cargaison et les frais de port. Vous ne payez rien de plus à la livraison, sauf les droits de douane locaux." }
    },
    {
      "@type": "Question",
      "name": "Pourquoi le même prix vers tous les ports ?",
      "acceptedAnswer": { "@type": "Answer", "text": "Nous avons négocié des tarifs groupés avec nos partenaires logistiques. Que vous soyez à Cotonou, Lomé, Abidjan ou Dakar, le prix CIF est identique." }
    },
    {
      "@type": "Question",
      "name": "Où se trouve votre bureau ?",
      "acceptedAnswer": { "@type": "Answer", "text": "Deux bureaux : Cotonou (Étoile Rouge, à côté de la BOA) et Guangzhou Baiyun, Chine, depuis où nous passons directement les commandes en usine." }
    },
    {
      "@type": "Question",
      "name": "Comment vous contacter ?",
      "acceptedAnswer": { "@type": "Answer", "text": "Bureau Cotonou : +229 01 41 76 53 41. Équipe Chine : +86 195 8743 9774. Nous répondons sous 48h ouvrées." }
    }
  ]
};

export default function FAQPage() {
  return (
    <>
      <Nav />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <FAQSection />
      <Footer minimal />
    </>
  );
}

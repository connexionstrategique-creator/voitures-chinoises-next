import { CARS } from "@/data/cars";

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Quels modes de paiement acceptez-vous ?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Nous acceptons deux modes : virement bancaire sur notre compte société, ou paiement en espèces directement à notre bureau de Cotonou. Chaque paiement est accompagné d'un contrat officiel et d'un ordre de mission d'achat signé."
      }
    },
    {
      "@type": "Question",
      "name": "Peut-on payer en plusieurs fois ?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Oui. Le paiement s'effectue en deux tranches : 70% à la commande pour lancer la production, et 30% avant expédition vers votre port. Vous pouvez aussi régler les 100% en une seule fois."
      }
    },
    {
      "@type": "Question",
      "name": "Y a-t-il un contrat ?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Oui, systématiquement. Avant toute commande, nous signons ensemble un contrat de commissionnaire à l'achat et un ordre de mission. Votre achat est protégé légalement selon le droit OHADA."
      }
    },
    {
      "@type": "Question",
      "name": "Quelle garantie sur les véhicules ?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Tous les véhicules sont livrés neufs 0 km. La garantie constructeur est de 10 ans pour les véhicules utilisés sur le territoire chinois. En dehors de la Chine, il n'y a pas de garantie constructeur — c'est une réalité du marché à l'export que nous vous communiquons en toute transparence."
      }
    },
    {
      "@type": "Question",
      "name": "Qu'est-ce que le prix CIF ?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "CIF signifie Coût + Assurance + Fret. Le prix affiché inclut déjà le transport maritime depuis la Chine, l'assurance de la cargaison, et les frais de port d'arrivée. Vous ne payez rien de plus à la livraison — sauf les droits de douane locaux, à votre charge."
      }
    },
    {
      "@type": "Question",
      "name": "Pourquoi le même prix vers tous les ports ?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Nous avons négocié des tarifs groupés avec nos partenaires logistiques. Que vous soyez à Cotonou (Bénin), Lomé (Togo), Abidjan (Côte d'Ivoire) ou Dakar (Sénégal), le prix CIF est identique."
      }
    },
    {
      "@type": "Question",
      "name": "Où se trouve votre bureau ?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Nous avons deux bureaux : Cotonou, Étoile Rouge, à côté de la BOA — et Guangzhou Baiyun, Chine, depuis où nous passons directement les commandes en usine."
      }
    },
    {
      "@type": "Question",
      "name": "Comment vous contacter ?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Bureau Cotonou : +229 01 41 76 53 41. Équipe Chine : +86 195 8743 9774. Nous répondons sous 48h ouvrées."
      }
    }
  ]
};

const carListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Catalogue voitures chinoises neuves — Connexion Stratégique",
  "description": "Sélection de voitures chinoises neuves 0km disponibles à l'import CIF vers l'Afrique francophone.",
  "url": "https://www.voitureschinoises.com/#catalogue",
  "numberOfItems": CARS.length,
  "itemListElement": CARS.map((car, i) => ({
    "@type": "ListItem",
    "position": i + 1,
    "item": {
      "@type": "Car",
      "@id": `https://www.voitureschinoises.com/#car-${car.id}`,
      "name": `${car.brand} ${car.model} ${car.year}`,
      "brand": { "@type": "Brand", "name": car.brand },
      "model": car.model,
      "modelDate": car.year,
      "description": car.desc,
      "vehicleCondition": "https://schema.org/NewCondition",
      "mileageFromOdometer": { "@type": "QuantitativeValue", "value": 0, "unitCode": "KMT" },
      "offers": {
        "@type": "Offer",
        "price": car.price.replace(/\s/g, ""),
        "priceCurrency": "XOF",
        "availability": "https://schema.org/InStock",
        "seller": { "@id": "https://www.voitureschinoises.com/#business" },
        "areaServed": ["Bénin", "Togo", "Côte d'Ivoire", "Sénégal"]
      }
    }
  }))
};

export default function SchemaOrg() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(carListSchema) }}
      />
    </>
  );
}

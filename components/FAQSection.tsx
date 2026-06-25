"use client";
import { useState } from "react";

const FAQS = [
  {
    icon: "⏱️",
    q: "Quel est le délai de livraison ?",
    a: "Le délai moyen est de <strong>45 à 75 jours</strong> à partir de la confirmation de commande et du premier versement. Ce délai comprend : la fabrication ou la préparation du véhicule en usine, le chargement, le transport maritime, et la livraison au port de destination. Nous vous tenons informé à chaque étape.",
  },
  {
    icon: "🏛️",
    q: "Gérez-vous le dédouanement ?",
    a: "Oui. Nous prenons en charge l'ensemble des formalités douanières à l'arrivée au port. Nos transitaires partenaires s'occupent de la déclaration en douane, du paiement des droits et taxes, et de la mainlevée du véhicule. Vous n'avez aucune démarche à effectuer auprès des services douaniers.",
  },
  {
    icon: "📝",
    q: "Incluez-vous l'immatriculation ?",
    a: "Oui, nous gérons également l'immatriculation locale du véhicule. Une fois dédouané, nous accompagnons le processus d'enregistrement auprès des services compétents jusqu'à l'obtention de vos plaques d'immatriculation et du certificat de propriété à votre nom.",
  },
  {
    icon: "🎨",
    q: "Puis-je choisir la couleur et les options ?",
    a: "Absolument. Vous choisissez parmi les <strong>coloris disponibles en usine</strong> pour le modèle souhaité, ainsi que les finitions et options proposées par le constructeur. Certaines configurations nécessitent un délai de production supplémentaire de 2 à 3 semaines — nous vous le précisons avant la commande.",
  },
  {
    icon: "📄",
    q: "Quels documents sont fournis avec le véhicule ?",
    a: "À la livraison, vous recevez : la <strong>facture d'achat originale</strong> du constructeur, le <strong>certificat de conformité</strong>, le <strong>certificat d'origine</strong>, le <strong>carnet d'entretien</strong>, ainsi que tous les documents douaniers et le certificat d'immatriculation à votre nom.",
  },
  {
    icon: "🔍",
    q: "Importez-vous des modèles hors catalogue ?",
    a: "Oui. Notre catalogue présente les modèles les plus demandés, mais nous pouvons sourcer <strong>n'importe quel véhicule neuf disponible en Chine</strong> — marque, modèle, finition et motorisation de votre choix. Contactez-nous avec vos spécifications, nous vous faisons un devis sous 48h ouvrées.",
  },
  {
    icon: "💳",
    q: "Quels modes de paiement acceptez-vous ?",
    a: "Nous acceptons deux modes : <strong>virement bancaire</strong> sur notre compte société, ou <strong>paiement en espèces</strong> directement à notre bureau de Cotonou. Chaque paiement est accompagné d'un contrat officiel et d'un ordre de mission d'achat signé.",
  },
  {
    icon: "💰",
    q: "Peut-on payer en plusieurs fois ?",
    a: "Oui. Le paiement s'effectue en <strong>deux tranches</strong> : <strong>70%</strong> à la commande pour lancer la production, et <strong>30%</strong> avant expédition vers votre port. Vous pouvez aussi régler les <strong>100% en une seule fois</strong>.",
  },
  {
    icon: "📋",
    q: "Y a-t-il un contrat ?",
    a: "Oui, systématiquement. Avant toute commande, nous signons ensemble un <strong>contrat de commissionnaire à l'achat</strong> et un <strong>ordre de mission</strong>. Votre achat est protégé légalement selon le droit OHADA.",
  },
  {
    icon: "🛡️",
    q: "Quelle garantie sur les véhicules ?",
    a: "Tous les véhicules sont livrés <strong>neufs 0 km</strong>. La garantie constructeur est de <strong>10 ans</strong> pour les véhicules utilisés sur le territoire chinois. <strong>En dehors de la Chine, il n'y a pas de garantie constructeur</strong> — c'est une réalité du marché à l'export que nous vous communiquons en toute transparence.",
  },
  {
    icon: "🚢",
    q: "Qu'est-ce que le prix CIF ?",
    a: "CIF signifie <strong>Coût + Assurance + Fret</strong>. Le prix affiché inclut déjà le transport maritime depuis la Chine, l'assurance de la cargaison, et les frais de port d'arrivée. Vous ne payez rien de plus à la livraison — sauf les droits de douane locaux, à votre charge.",
  },
  {
    icon: "🌍",
    q: "Pourquoi le même prix vers tous les ports ?",
    a: "Nous avons négocié des tarifs groupés avec nos partenaires logistiques. Que vous soyez à <strong>🇧🇯 Cotonou, 🇹🇬 Lomé, 🇨🇮 Abidjan ou 🇸🇳 Dakar</strong>, le prix CIF est identique.",
  },
  {
    icon: "📍",
    q: "Où se trouve votre bureau ?",
    a: "Nous avons deux bureaux : <strong>Cotonou, Étoile Rouge</strong>, à côté de la BOA — et <strong>Guangzhou Baiyun, Chine</strong>, depuis où nous passons directement les commandes en usine.",
  },
  {
    icon: "📞",
    q: "Comment vous contacter ?",
    a: "<strong>Bureau Cotonou :</strong> +229 01 41 76 53 41<br><strong>Équipe Chine :</strong> +86 195 8743 9774<br>Nous répondons sous <strong>48h ouvrées</strong>.",
  },
];

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section className="section faq-section" id="faq">
      <div className="section-inner">
        <div className="faq-header" style={{ textAlign: "center" }}>
          <h2 className="h2" style={{ textAlign: "center" }}>
            Tout ce que vous devez<br />savoir avant de <em>commander.</em>
          </h2>
        </div>
        <div className="faq-list">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className={`faq-item${openIdx === i ? " open" : ""}`}
              onClick={() => setOpenIdx(openIdx === i ? null : i)}
            >
              <div className="faq-q">
                <span className="faq-q-icon">{faq.icon}</span>
                {faq.q}
                <span className="faq-chevron">›</span>
              </div>
              <div
                className="faq-a"
                style={{ maxHeight: openIdx === i ? 400 : 0, padding: openIdx === i ? "0 0 20px 0" : "0" }}
                dangerouslySetInnerHTML={{ __html: faq.a }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

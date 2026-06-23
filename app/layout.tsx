import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Voitures Chinoises Neuves — Prix Usine CIF Afrique | Connexion Stratégique",
  description:
    "Voitures chinoises neuves 0km, prix usine CIF livré Cotonou, Lomé, Abidjan, Dakar. BYD, Jetour, Changan, Geely — 20 marques. Devis sous 48h. Connexion Stratégique.",
  keywords:
    "voitures chinoises, voitures chinoises neuves, import Chine Afrique, BYD Afrique, Jetour X70, Changan CS75, prix CIF Afrique, véhicules neufs Cotonou, véhicules neufs Lomé, voitures neuves Abidjan, voitures neuves Dakar, importateur voiture Chine Bénin, Connexion Stratégique, achat voiture usine Chine, SUV pas cher Afrique",
  authors: [{ name: "Connexion Stratégique" }],
  robots: "index, follow",
  metadataBase: new URL("https://www.voitureschinoises.com"),
  alternates: {
    canonical: "https://www.voitureschinoises.com/",
  },
  openGraph: {
    type: "website",
    title: "Voitures Chinoises Neuves — Prix Usine CIF Afrique",
    description:
      "BYD, Changan, Jetour et 20 marques. Neuf 0km, livré CIF vers Cotonou · Lomé · Abidjan · Dakar. Commandez directement depuis l'usine.",
    images: [
      {
        url: "https://res.cloudinary.com/daol8mzeg/image/upload/w_1200,h_630,c_fill/v1772665987/LOGO_VOITURES_CHINOISE_ROUGE_600x_pfafuh.png",
        width: 1200,
        height: 630,
      },
    ],
    url: "https://www.voitureschinoises.com",
    locale: "fr_FR",
    siteName: "Voitures Chinoises — Connexion Stratégique",
  },
  twitter: {
    card: "summary_large_image",
    title: "Voitures Chinoises Neuves — Prix Usine CIF Afrique",
    description:
      "BYD, Changan, Jetour et 20 marques. Neuf 0km, livré CIF vers Cotonou · Lomé · Abidjan · Dakar.",
    images: [
      "https://res.cloudinary.com/daol8mzeg/image/upload/w_1200,h_630,c_fill/v1772665987/LOGO_VOITURES_CHINOISE_ROUGE_600x_pfafuh.png",
    ],
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "AutoDealer",
      "@id": "https://www.voitureschinoises.com/#business",
      "name": "Connexion Stratégique — Voitures Chinoises",
      "description": "Importateur officiel de voitures chinoises neuves 0km. Prix usine CIF livré Cotonou, Lomé, Abidjan, Dakar. BYD, Changan, Jetour, Geely et 20 marques.",
      "url": "https://www.voitureschinoises.com",
      "telephone": "+22941765341",
      "email": "contact@voitureschinoises.com",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Étoile Rouge, à côté de la BOA",
        "addressLocality": "Cotonou",
        "addressRegion": "Littoral",
        "addressCountry": "BJ"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 6.3703,
        "longitude": 2.3912
      },
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        "opens": "08:00",
        "closes": "18:00"
      },
      "priceRange": "FCFA 8 000 000 - 36 900 000",
      "currenciesAccepted": "XOF",
      "paymentAccepted": "Virement bancaire, Espèces",
      "areaServed": [
        { "@type": "Country", "name": "Bénin" },
        { "@type": "Country", "name": "Togo" },
        { "@type": "Country", "name": "Côte d'Ivoire" },
        { "@type": "Country", "name": "Sénégal" }
      ],
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Catalogue voitures chinoises neuves",
        "url": "https://www.voitureschinoises.com/#catalogue"
      }
    },
    {
      "@type": "WebSite",
      "@id": "https://www.voitureschinoises.com/#website",
      "url": "https://www.voitureschinoises.com",
      "name": "Voitures Chinoises — Connexion Stratégique",
      "description": "Voitures chinoises neuves 0km, prix usine CIF livré en Afrique francophone.",
      "inLanguage": "fr-FR",
      "publisher": { "@id": "https://www.voitureschinoises.com/#business" }
    }
  ]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${cormorant.variable} ${dmSans.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

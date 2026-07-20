import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import SimulateurClient from "@/components/SimulateurClient";
import { getSiteSettings } from "@/sanity/queries";

export const metadata: Metadata = {
  title: "Simulateur de coût d'acquisition | Voitures Chinoises",
  description:
    "Estimez le coût total d'un véhicule chinois : droits de douane, TVA et frais d'immatriculation pour le Bénin, Togo, Côte d'Ivoire et Sénégal.",
  alternates: { canonical: "https://www.voitureschinoises.com/simulateur" },
};

export default async function SimulateurPage() {
  const settings = await getSiteSettings().catch(() => null);
  const waNumber = settings?.whatsappNumber ?? "22941765341";
  return (
    <>
      <Nav />
      <SimulateurClient waNumber={waNumber} />
      <Footer
        waNumber={waNumber}
        phoneDisplay={settings?.phoneDisplay}
        phoneCN={settings?.phoneCN}
      />
    </>
  );
}

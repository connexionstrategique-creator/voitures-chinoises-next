import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialité — Voitures Chinoises",
  description: "Politique de confidentialité de Voitures Chinoises (Connexion Stratégique) — collecte, utilisation et protection de vos données personnelles.",
  alternates: { canonical: "https://www.voitureschinoises.com/politique-confidentialite" },
  robots: "noindex",
};

export default function PolitiqueConfidentialite() {
  return (
    <>
      <Nav />
      <main style={{ background: "#fff", minHeight: "100vh" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "80px 24px 100px" }}>

          <h1 style={{ fontSize: "clamp(24px,4vw,36px)", fontWeight: 700, color: "#0D0D0D", marginBottom: 8, fontFamily: "Syne, sans-serif" }}>
            Politique de confidentialité
          </h1>
          <p style={{ fontSize: 13, color: "#A01414", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 40 }}>
            Voitures Chinoises · Connexion Stratégique — Dernière mise à jour : 30 juillet 2026
          </p>

          <Section title="1. Introduction et responsable du traitement">
            <p>Voitures Chinoises, filiale automobile de Connexion Stratégique, accorde une grande importance à la protection des données personnelles de ses visiteurs, prospects et clients. La présente politique explique quelles données nous collectons, pourquoi nous les collectons, comment nous les utilisons et protégeons, et quels sont vos droits.</p>
            <p>Cette politique s&apos;applique à l&apos;ensemble de nos canaux de collecte : le site voitureschinoises.com, nos formulaires de contact, nos formulaires publicitaires sur Meta (Facebook, Instagram…), TikTok, ainsi que nos outils de mesure d&apos;audience.</p>
            <p><strong>Responsable du traitement :</strong></p>
            <ul>
              <li><strong>Entité :</strong> Voitures Chinoises, filiale de Connexion Stratégique</li>
              <li><strong>Siège :</strong> Cotonou, Bénin, Étoile Rouge, Bâtiment C955, rue avant la BOA en allant vers l&apos;Église Catholique Saint Jean / Guangzhou Baiyun, Chine</li>
              <li><strong>Site web :</strong> <a href="https://www.voitureschinoises.com" style={{ color: "#A01414" }}>voitureschinoises.com</a></li>
              <li><strong>Email :</strong> <a href="mailto:contact@connexionstrategique.com" style={{ color: "#A01414" }}>contact@connexionstrategique.com</a></li>
              <li><strong>Téléphone :</strong> +229 01 41 76 53 41 (Bénin) · +86 195 8743 9774 (Chine)</li>
            </ul>
          </Section>

          <Section title="2. Données que nous collectons">
            <p>Selon la manière dont vous interagissez avec nous, nous pouvons collecter les catégories de données suivantes.</p>
            <h3>2.1 Données d&apos;identité et de contact</h3>
            <p>Lorsque vous remplissez un formulaire publicitaire (Facebook, Instagram, TikTok…) ou un formulaire de contact sur notre site : nom complet, numéro de téléphone, adresse e-mail, pays et ville.</p>
            <h3>2.2 Préférences d&apos;achat</h3>
            <p>Pour mieux répondre à votre demande, nous recueillons les réponses aux questions de qualification de nos formulaires : le modèle de véhicule qui vous intéresse et l&apos;horizon de votre projet d&apos;achat (achat immédiat, sous un mois, ou projet à plus long terme).</p>
            <h3>2.3 Données de navigation</h3>
            <p>Lorsque vous visitez notre site, nous recueillons automatiquement certaines données techniques via des cookies et des pixels de suivi (notamment le Pixel Meta) : pages consultées, actions réalisées sur le site et données de connexion. Ces informations servent à mesurer l&apos;audience et à améliorer nos services (voir la section 7).</p>
            <p><em>Nous ne collectons jamais de données sensibles telles que des données de santé, des opinions politiques ou religieuses, ou des numéros d&apos;identification officiels.</em></p>
          </Section>

          <Section title="3. Finalités du traitement">
            <p>Vos données sont collectées et utilisées pour les finalités suivantes :</p>
            <ul>
              <li>Répondre à vos demandes de renseignements sur nos véhicules et nos offres commerciales.</li>
              <li>Vous recontacter, notamment par WhatsApp, téléphone ou e-mail, afin d&apos;organiser des rendez-vous commerciaux en ligne ou à notre bureau à Cotonou.</li>
              <li>Assurer le suivi de la relation commerciale, de la commande jusqu&apos;au dédouanement, l&apos;immatriculation, la mutation du véhicule et la livraison.</li>
              <li>Vous envoyer, si vous y avez consenti, des offres promotionnelles et des informations sur nos nouveaux modèles.</li>
              <li>Mesurer l&apos;efficacité de nos publicités et améliorer nos campagnes et notre site.</li>
            </ul>
          </Section>

          <Section title="4. Base légale et consentement">
            <p>Nous traitons vos données sur la base de votre consentement (formulaires, inscription aux offres promotionnelles) et de notre intérêt légitime à développer notre relation commerciale et à répondre à vos demandes. Vous pouvez retirer votre consentement à tout moment, sans que cela remette en cause la licéité des traitements déjà effectués (voir la section 6).</p>
          </Section>

          <Section title="5. Durée de conservation et sécurité">
            <p>Nous conservons vos données uniquement le temps nécessaire aux finalités décrites ci-dessus, soit au maximum 3 ans à compter de notre dernier contact avec vous. Au-delà, vos données sont supprimées ou anonymisées.</p>
            <p>Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données contre tout accès, perte, altération ou divulgation non autorisés. L&apos;accès à vos informations est limité aux membres de notre équipe qui en ont besoin dans le cadre de la relation commerciale.</p>
            <p>Nous ne vendons pas et ne louons pas vos données personnelles à des tiers. Elles peuvent uniquement être partagées avec nos prestataires techniques (hébergement, outils de communication) et avec Meta dans le cadre décrit à la section 7.</p>
          </Section>

          <Section title="6. Vos droits">
            <p>Conformément à la réglementation applicable sur la protection des données personnelles (y compris le Règlement général sur la protection des données pour les personnes situées dans l&apos;Union européenne, ainsi que les lois en vigueur au Bénin), vous disposez à tout moment des droits suivants :</p>
            <ul>
              <li><strong>Droit d&apos;accès :</strong> obtenir la confirmation que vos données sont traitées et en recevoir une copie.</li>
              <li><strong>Droit de rectification :</strong> corriger des données inexactes ou incomplètes.</li>
              <li><strong>Droit de suppression :</strong> demander l&apos;effacement de vos données.</li>
              <li><strong>Droit d&apos;opposition et de retrait du consentement :</strong> vous opposer au traitement de vos données ou cesser de recevoir nos communications commerciales.</li>
            </ul>
            <p>Pour exercer ces droits, il vous suffit de nous écrire à <a href="mailto:contact@connexionstrategique.com" style={{ color: "#A01414" }}>contact@connexionstrategique.com</a> ou de nous appeler au <a href="tel:+22901417653241" style={{ color: "#A01414" }}>+229 01 41 76 53 41</a>. Nous répondrons à votre demande dans les meilleurs délais.</p>
          </Section>

          <Section title="7. Cookies et technologies de suivi — Pixel Meta">
            <p>Notre site utilise le Pixel Meta, un outil d&apos;analyse fourni par Meta Platforms, Inc. Cet outil nous permet de suivre les actions des utilisateurs après qu&apos;ils ont été redirigés vers notre site en cliquant sur une publicité Facebook ou Instagram.</p>
            <p>Nous utilisons ces données pour :</p>
            <ul>
              <li>Mesurer l&apos;efficacité de nos publicités pour nos véhicules.</li>
              <li>Créer des audiences personnalisées afin de vous proposer des offres adaptées à vos intérêts (retargeting).</li>
              <li>Optimiser la diffusion de nos futures campagnes publicitaires.</li>
            </ul>
            <p>Les données collectées via le Pixel sont anonymes pour nous, mais Meta peut les associer à votre compte utilisateur et les utiliser à ses propres fins publicitaires, conformément à sa <a href="https://www.facebook.com/privacy/policy" target="_blank" rel="noopener noreferrer" style={{ color: "#A01414" }}>politique d&apos;utilisation des données</a>.</p>
            <p><strong>Gérer vos préférences :</strong> vous pouvez à tout moment modifier vos préférences publicitaires directement dans les paramètres de votre compte Facebook ou Instagram. Vous pouvez également refuser ou supprimer les cookies via les réglages de votre navigateur.</p>
          </Section>

          <Section title="8. Modifications de cette politique">
            <p>Nous pouvons mettre à jour cette politique de confidentialité afin de refléter l&apos;évolution de nos activités ou de la réglementation. La date de la dernière mise à jour figure en haut de cette page. Nous vous invitons à la consulter régulièrement.</p>
          </Section>

          <Section title="9. Nous contacter">
            <ul>
              <li><strong>Email :</strong> <a href="mailto:contact@connexionstrategique.com" style={{ color: "#A01414" }}>contact@connexionstrategique.com</a></li>
              <li><strong>Téléphone :</strong> +229 01 41 76 53 41 (Bénin) · +86 195 8743 9774 (Chine)</li>
              <li><strong>Adresse :</strong> Cotonou, Bénin, Étoile Rouge, Bâtiment C955, rue avant la BOA en allant vers l&apos;Église Catholique Saint Jean / Guangzhou Baiyun, Chine</li>
            </ul>
          </Section>

        </div>
      </main>
      <Footer />
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 48 }}>
      <h2 style={{
        fontSize: "clamp(16px,2vw,20px)", fontWeight: 700, color: "#0D0D0D",
        borderBottom: "2px solid #A01414", paddingBottom: 8, marginBottom: 20,
        fontFamily: "Syne, sans-serif",
      }}>
        {title}
      </h2>
      <div style={{ fontSize: 15, lineHeight: 1.75, color: "#333" }}>
        {children}
      </div>
    </section>
  );
}

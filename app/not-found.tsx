import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Nav />
      <main style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 24px", textAlign: "center" }}>
        <p style={{ fontSize: 13, letterSpacing: "0.15em", color: "var(--mid)", marginBottom: 24, textTransform: "uppercase" }}>Erreur 404</p>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 300, fontSize: "clamp(36px, 6vw, 72px)", lineHeight: 1.05, marginBottom: 24 }}>
          Page introuvable
        </h1>
        <p style={{ fontSize: 16, color: "var(--mid)", maxWidth: 440, lineHeight: 1.7, marginBottom: 40 }}>
          Cette page n&apos;existe pas ou a été déplacée. Revenez au catalogue pour découvrir nos véhicules.
        </p>
        <Link href="/catalogue" style={{ display: "inline-block", background: "var(--red)", color: "#fff", padding: "14px 32px", borderRadius: 4, fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: 14, letterSpacing: "0.06em", textDecoration: "none" }}>
          Voir le catalogue
        </Link>
      </main>
      <Footer />
    </>
  );
}

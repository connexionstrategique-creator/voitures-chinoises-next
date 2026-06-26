import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";
import { getPosts } from "@/sanity/queries";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blog — Guides d'achat & actualités voitures chinoises Afrique",
  description: "Guides d'achat, comparatifs SUV chinois, actualités BYD, Changan, Jetour et analyses du marché automobile africain. Tout ce qu'il faut savoir avant d'importer votre voiture.",
  alternates: { canonical: "https://www.voitureschinoises.com/blog" },
  openGraph: {
    title: "Blog Voitures Chinoises — Guides & actualités Afrique",
    description: "Guides d'achat, comparatifs SUV, actualités BYD Changan Jetour et analyses marché auto africain.",
    url: "https://www.voitureschinoises.com/blog",
    type: "website",
  },
};

const CAT_LABELS: Record<string, string> = {
  actualites: "Actualités",
  guides: "Guides d'achat",
  modeles: "Nouveaux modèles",
  marche: "Marché auto",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

const PAGE_SIZE = 6;

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const currentPage = Math.max(1, parseInt(pageParam || "1", 10));

  const allPosts = await getPosts().catch(() => []);
  const totalPages = Math.ceil(allPosts.length / PAGE_SIZE);
  const safePage = Math.min(currentPage, Math.max(1, totalPages));

  // Page 1 : featured (1st) + 5 others. Pages suivantes : 6 articles.
  let featured = null;
  let gridPosts = [];

  if (safePage === 1) {
    const [first, ...rest] = allPosts;
    featured = first ?? null;
    gridPosts = rest.slice(0, PAGE_SIZE); // 6 articles en grille
  } else {
    const offset = (safePage - 1) * PAGE_SIZE;
    gridPosts = allPosts.slice(offset, offset + PAGE_SIZE);
  }

  return (
    <>
      <Nav dark />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": "Blog Voitures Chinoises",
            "description": "Actualités et guides sur l'automobile chinoise en Afrique",
            "url": "https://www.voitureschinoises.com/blog",
            "publisher": { "@type": "Organization", "name": "Connexion Stratégique" },
          }),
        }}
      />

      {/* Hero */}
      <section className="blog-page-hero">
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ fontSize: 11, letterSpacing: "0.22em", color: "rgba(255,255,255,0.4)", marginBottom: 16, textTransform: "uppercase" }}>
            Voitures Chinoises · Blog
          </div>
          <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: "clamp(36px,5vw,64px)", fontWeight: 300, lineHeight: 1.1, marginBottom: 16 }}>
            Actualités &amp; guides<br />
            <em style={{ color: "#A01414", fontStyle: "italic" }}>sur l&apos;automobile chinoise.</em>
          </h1>
          <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 15, color: "rgba(255,255,255,0.5)", maxWidth: 520 }}>
            Conseils d&apos;achat, nouveaux modèles, analyses du marché — tout ce qu&apos;il faut savoir avant d&apos;importer votre véhicule en Afrique.
          </p>
        </div>
      </section>

      <main style={{ background: "#F5F5F5", minHeight: "60vh" }}>
        <div className="blog-page-inner">

          {allPosts.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0", color: "#888", fontFamily: "DM Sans, sans-serif" }}>
              <p style={{ fontSize: 16 }}>Les articles arrivent bientôt.</p>
            </div>
          ) : (
            <>
              {/* Featured — page 1 uniquement */}
              {safePage === 1 && featured && (
                <Link href={`/blog/${featured.slug}`} style={{ textDecoration: "none", display: "block", marginBottom: 32 }}>
                  <article
                    className="blog-gallery-hero"
                    style={{ position: "relative", height: 360, borderRadius: 16, overflow: "hidden", background: "#111" }}
                  >
                    {featured.imageUrl && (
                      <Image
                        src={featured.imageUrl}
                        alt={featured.imageAlt || featured.title}
                        fill
                        priority
                        sizes="(max-width: 768px) 100vw, 1200px"
                        className="blog-gallery-hero-img"
                      />
                    )}
                    <div style={{
                      position: "absolute", inset: 0,
                      background: "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.05) 100%)",
                    }} />
                    <div className="blog-hero-overlay-text">
                      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
                        <span style={{
                          background: "#A01414", color: "#fff",
                          fontFamily: "DM Sans, sans-serif", fontSize: 10, fontWeight: 700,
                          letterSpacing: "0.18em", textTransform: "uppercase",
                          padding: "5px 12px", borderRadius: 2,
                        }}>
                          {CAT_LABELS[featured.category] || featured.category}
                        </span>
                        <span style={{ fontFamily: "DM Sans, sans-serif", fontSize: 11, color: "rgba(255,255,255,0.45)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                          À la une
                        </span>
                      </div>
                      <h2 style={{
                        fontFamily: "Syne, sans-serif",
                        fontSize: "clamp(24px,3vw,44px)",
                        fontWeight: 700, lineHeight: 1.15, color: "#fff",
                        marginBottom: 12, maxWidth: 700,
                      }}>
                        {featured.title}
                      </h2>
                      {featured.excerpt && (
                        <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.65, maxWidth: 560, marginBottom: 20 }}>
                          {featured.excerpt}
                        </p>
                      )}
                      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                        <span style={{ fontFamily: "DM Sans, sans-serif", fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
                          {featured.publishedAt ? formatDate(featured.publishedAt) : ""}
                        </span>
                        <span style={{ fontFamily: "DM Sans, sans-serif", fontSize: 13, fontWeight: 700, color: "#fff", letterSpacing: "0.06em" }}>
                          Lire l&apos;article →
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              )}

              {/* Grille galerie */}
              {gridPosts.length > 0 && (
                <div className="blog-gallery-grid">
                  {gridPosts.map((post) => (
                    <Link key={post._id} href={`/blog/${post.slug}`} style={{ textDecoration: "none", display: "block" }}>
                      <article className="blog-gallery-card">
                        <div className="blog-gallery-card-img">
                          {post.imageUrl ? (
                            <Image
                              src={post.imageUrl}
                              alt={post.imageAlt || post.title}
                              fill
                              style={{ objectFit: "cover", transition: "transform .5s ease" }}
                              className="blog-gallery-card-photo"
                            />
                          ) : (
                            <div style={{ background: "#111", width: "100%", height: "100%" }} />
                          )}
                          <div className="blog-gallery-card-overlay" />
                          <span style={{
                            position: "absolute", top: 14, left: 14, zIndex: 2,
                            background: "#A01414", color: "#fff",
                            fontFamily: "DM Sans, sans-serif", fontSize: 9, fontWeight: 700,
                            letterSpacing: "0.18em", textTransform: "uppercase",
                            padding: "4px 10px", borderRadius: 2,
                          }}>
                            {CAT_LABELS[post.category] || post.category}
                          </span>
                          <div className="blog-gallery-cta">Lire l&apos;article →</div>
                        </div>
                        <div style={{ padding: "20px 4px 0" }}>
                          <div style={{ fontFamily: "DM Sans, sans-serif", fontSize: 10, color: "#aaa", letterSpacing: "0.06em", marginBottom: 8, textTransform: "uppercase" }}>
                            {post.publishedAt ? formatDate(post.publishedAt) : ""}
                          </div>
                          <h3 style={{
                            fontFamily: "Syne, sans-serif",
                            fontSize: "clamp(18px,1.8vw,22px)",
                            fontWeight: 700, lineHeight: 1.25, color: "#0D0D0D",
                          }}>
                            {post.title}
                          </h3>
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="blog-pagination" style={{
                  display: "flex", alignItems: "center", justifyContent: "center",
                  gap: 8, marginTop: 56,
                }}>
                  {/* Précédent */}
                  {safePage > 1 ? (
                    <Link
                      href={safePage === 2 ? "/blog" : `/blog?page=${safePage - 1}`}
                      style={{
                        fontFamily: "DM Sans, sans-serif", fontSize: 13, fontWeight: 600,
                        color: "#0D0D0D", textDecoration: "none",
                        padding: "10px 20px", border: "1px solid #E0E0E0",
                        borderRadius: 4, background: "#fff",
                        transition: "all .2s",
                      }}
                      className="blog-page-btn"
                    >
                      ← Précédent
                    </Link>
                  ) : (
                    <span style={{
                      fontFamily: "DM Sans, sans-serif", fontSize: 13, fontWeight: 600,
                      color: "#ccc", padding: "10px 20px",
                      border: "1px solid #F0F0F0", borderRadius: 4, background: "#fafafa",
                    }}>
                      ← Précédent
                    </span>
                  )}

                  {/* Pages numérotées */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <Link
                      key={p}
                      href={p === 1 ? "/blog" : `/blog?page=${p}`}
                      style={{
                        fontFamily: "DM Sans, sans-serif", fontSize: 13, fontWeight: p === safePage ? 700 : 500,
                        color: p === safePage ? "#fff" : "#555",
                        textDecoration: "none",
                        padding: "10px 16px", borderRadius: 4,
                        background: p === safePage ? "#A01414" : "#fff",
                        border: p === safePage ? "1px solid #A01414" : "1px solid #E0E0E0",
                        minWidth: 40, textAlign: "center",
                        transition: "all .2s",
                      }}
                    >
                      {p}
                    </Link>
                  ))}

                  {/* Suivant */}
                  {safePage < totalPages ? (
                    <Link
                      href={`/blog?page=${safePage + 1}`}
                      style={{
                        fontFamily: "DM Sans, sans-serif", fontSize: 13, fontWeight: 600,
                        color: "#fff", textDecoration: "none",
                        padding: "10px 20px", borderRadius: 4,
                        background: "#A01414", border: "1px solid #A01414",
                        transition: "all .2s",
                      }}
                    >
                      Suivant →
                    </Link>
                  ) : (
                    <span style={{
                      fontFamily: "DM Sans, sans-serif", fontSize: 13, fontWeight: 600,
                      color: "#ccc", padding: "10px 20px",
                      border: "1px solid #F0F0F0", borderRadius: 4, background: "#fafafa",
                    }}>
                      Suivant →
                    </span>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer minimal />
    </>
  );
}

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
    images: [{ url: "https://res.cloudinary.com/daol8mzeg/image/upload/w_1200,h_630,c_fill/v1772665987/LOGO_VOITURES_CHINOISE_ROUGE_600x_pfafuh.png", width: 1200, height: 630 }],
  },
};

const SUPABASE_URL = "https://eckphabqkleahrujkcfu.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVja3BoYWJxa2xlYWhydWprY2Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxODgwMTUsImV4cCI6MjA5MTc2NDAxNX0.kj19EuQe29b9F0z4x84yoEfKp5xJBU7ng2917wQAx0g";

const CAT_LABELS: Record<string, string> = {
  actualites: "Actualités",
  guides: "Guides d'achat",
  modeles: "Nouveaux modèles",
  marche: "Marché auto",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

function EyeIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
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

  // Fetch all view counts from Supabase in one request
  let viewsMap: Record<string, number> = {};
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/post_views?select=slug,count`,
      {
        headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
        next: { revalidate: 60 },
      }
    );
    const data = await res.json();
    if (Array.isArray(data)) {
      data.forEach((r: { slug: string; count: number }) => { viewsMap[r.slug] = r.count || 0; });
    }
  } catch {}

  let featured = null;
  let gridPosts: typeof allPosts = [];

  if (safePage === 1) {
    const [first, ...rest] = allPosts;
    featured = first ?? null;
    gridPosts = rest.slice(0, PAGE_SIZE);
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
        <div className="blog-page-hero-inner">
          <div className="blog-page-hero-eyebrow">Voitures Chinoises · Blog</div>
          <h1 className="blog-page-hero-title">
            Actualités &amp; guides<br />
            <em className="blog-page-hero-em">sur l&apos;automobile chinoise.</em>
          </h1>
          <p className="blog-page-hero-sub">
            Conseils d&apos;achat, nouveaux modèles, analyses du marché — tout ce qu&apos;il faut savoir avant d&apos;importer votre véhicule en Afrique.
          </p>
        </div>
      </section>

      <main className="blog-main">
        <div className="blog-page-inner">

          {allPosts.length === 0 ? (
            <div className="blog-empty">Les articles arrivent bientôt.</div>
          ) : (
            <>
              {/* Article vedette */}
              {safePage === 1 && featured && (
                <Link href={`/blog/${featured.slug}`} className="blog-featured">
                  <div className="blog-featured-img-wrap">
                    {featured.imageUrl ? (
                      <Image
                        src={featured.imageUrl}
                        alt={featured.imageAlt || featured.title}
                        fill
                        priority
                        className="blog-featured-img"
                        sizes="(max-width: 768px) 100vw, 55vw"
                        style={{ objectFit: "cover" }}
                      />
                    ) : (
                      <div className="blog-img-placeholder" />
                    )}
                  </div>
                  <div className="blog-featured-body">
                    <span className="blog-cat-label">
                      À la une · {CAT_LABELS[featured.category] || featured.category}
                    </span>
                    <h2 className="blog-featured-title">{featured.title}</h2>
                    {featured.excerpt && (
                      <p className="blog-featured-excerpt">{featured.excerpt}</p>
                    )}
                    <div className="blog-meta">
                      <span className="blog-date">
                        {featured.publishedAt ? formatDate(featured.publishedAt) : ""}
                        {(viewsMap[featured.slug] ?? 0) > 0 && (
                          <span className="blog-views" style={{ marginLeft: 10 }}>
                            <EyeIcon />
                            {(viewsMap[featured.slug]).toLocaleString("fr-FR")} vues
                          </span>
                        )}
                      </span>
                      <span className="blog-read-link">Lire l&apos;article →</span>
                    </div>
                  </div>
                </Link>
              )}

              {/* Grille */}
              {gridPosts.length > 0 && (
                <div className="blog-grid">
                  {gridPosts.map((post) => {
                    const views = viewsMap[post.slug] ?? 0;
                    return (
                      <Link key={post._id} href={`/blog/${post.slug}`} className="blog-card-link">
                        <article className="blog-card">
                          <div className="blog-card-img-wrap">
                            {post.imageUrl ? (
                              <Image
                                src={post.imageUrl}
                                alt={post.imageAlt || post.title}
                                fill
                                className="blog-card-img"
                                sizes="(max-width: 560px) 100vw, (max-width: 900px) 50vw, 33vw"
                                style={{ objectFit: "cover" }}
                              />
                            ) : (
                              <div className="blog-img-placeholder" />
                            )}
                          </div>
                          <div className="blog-card-body">
                            <span className="blog-cat-label">
                              {CAT_LABELS[post.category] || post.category}
                            </span>
                            <h3 className="blog-card-title">{post.title}</h3>
                            <div className="blog-meta">
                              <span className="blog-date">
                                {post.publishedAt ? formatDate(post.publishedAt) : ""}
                              </span>
                              <span className="blog-views">
                                <EyeIcon />
                                {views > 0 ? `${views.toLocaleString("fr-FR")} vues` : "0 vue"}
                              </span>
                            </div>
                          </div>
                        </article>
                      </Link>
                    );
                  })}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="blog-pagination">
                  {safePage > 1 ? (
                    <Link href={safePage === 2 ? "/blog" : `/blog?page=${safePage - 1}`} className="blog-pag-btn">
                      ← Précédent
                    </Link>
                  ) : (
                    <span className="blog-pag-btn disabled">← Précédent</span>
                  )}

                  <div className="blog-pag-pages">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <Link
                        key={p}
                        href={p === 1 ? "/blog" : `/blog?page=${p}`}
                        className={`blog-pag-num${p === safePage ? " active" : ""}`}
                      >
                        {p}
                      </Link>
                    ))}
                  </div>

                  {safePage < totalPages ? (
                    <Link href={`/blog?page=${safePage + 1}`} className="blog-pag-btn primary">
                      Suivant →
                    </Link>
                  ) : (
                    <span className="blog-pag-btn disabled">Suivant →</span>
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

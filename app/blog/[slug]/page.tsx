import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getPosts, getPostBySlug } from "@/sanity/queries";
import { PortableText } from "@portabletext/react";
import type { Metadata } from "next";

export const revalidate = 60;

const CAT_LABELS: Record<string, string> = {
  actualites: "Actualités",
  guides: "Guides d'achat",
  modeles: "Nouveaux modèles",
  marche: "Marché automobile",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

function estimateReadTime(body: any[]): number {
  if (!body) return 1;
  const text = body
    .filter((b) => b._type === "block")
    .flatMap((b) => b.children?.map((c: any) => c.text || "") || [])
    .join(" ");
  return Math.max(1, Math.round(text.split(/\s+/).length / 200));
}

export async function generateStaticParams() {
  const posts = await getPosts().catch(() => []);
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug).catch(() => null);
  if (!post) return {};
  const title = post.seoTitle || `${post.title} — Voitures Chinoises`;
  const description = post.seoDescription || post.excerpt || "";
  return {
    title,
    description,
    alternates: { canonical: `https://www.voitureschinoises.com/blog/${slug}` },
    openGraph: {
      title,
      description,
      images: post.imageUrl ? [{ url: post.imageUrl, width: 1200, height: 630 }] : [],
      type: "article",
      publishedTime: post.publishedAt,
      authors: ["Connexion Stratégique"],
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

// Portable Text components
const ptComponents = {
  block: {
    normal: ({ children }: any) => <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 16, lineHeight: 1.85, color: "#333", marginBottom: 20 }}>{children}</p>,
    h2: ({ children }: any) => <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 32, fontWeight: 700, color: "#0D0D0D", margin: "40px 0 16px", lineHeight: 1.2 }}>{children}</h2>,
    h3: ({ children }: any) => <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 24, fontWeight: 700, color: "#0D0D0D", margin: "32px 0 12px", lineHeight: 1.2 }}>{children}</h3>,
    h4: ({ children }: any) => <h4 style={{ fontFamily: "DM Sans, sans-serif", fontSize: 16, fontWeight: 700, color: "#0D0D0D", margin: "24px 0 8px" }}>{children}</h4>,
    blockquote: ({ children }: any) => (
      <blockquote style={{
        borderLeft: "3px solid #A01414", paddingLeft: 24, margin: "28px 0",
        fontFamily: "Cormorant Garamond, serif", fontSize: 22, fontStyle: "italic", color: "#555",
      }}>{children}</blockquote>
    ),
  },
  marks: {
    strong: ({ children }: any) => <strong style={{ fontWeight: 700, color: "#0D0D0D" }}>{children}</strong>,
    em: ({ children }: any) => <em style={{ fontStyle: "italic" }}>{children}</em>,
    link: ({ value, children }: any) => (
      <a href={value?.href} target={value?.blank ? "_blank" : undefined} rel="noopener noreferrer"
        style={{ color: "#A01414", textDecoration: "underline" }}>{children}</a>
    ),
  },
  types: {
    image: ({ value }: any) => value?.url ? (
      <figure style={{ margin: "32px 0" }}>
        <img src={value.url} alt={value.alt || ""} style={{ width: "100%", borderRadius: 8, display: "block" }} />
        {value.caption && (
          <figcaption style={{ fontFamily: "DM Sans, sans-serif", fontSize: 12, color: "#aaa", textAlign: "center", marginTop: 8 }}>
            {value.caption}
          </figcaption>
        )}
      </figure>
    ) : null,
  },
  list: {
    bullet: ({ children }: any) => <ul style={{ paddingLeft: 24, marginBottom: 20 }}>{children}</ul>,
    number: ({ children }: any) => <ol style={{ paddingLeft: 24, marginBottom: 20 }}>{children}</ol>,
  },
  listItem: {
    bullet: ({ children }: any) => <li style={{ fontFamily: "DM Sans, sans-serif", fontSize: 16, lineHeight: 1.8, color: "#333", marginBottom: 6 }}>{children}</li>,
    number: ({ children }: any) => <li style={{ fontFamily: "DM Sans, sans-serif", fontSize: 16, lineHeight: 1.8, color: "#333", marginBottom: 6 }}>{children}</li>,
  },
};

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [post, allPosts] = await Promise.all([
    getPostBySlug(slug).catch(() => null),
    getPosts().catch(() => []),
  ]);
  if (!post) notFound();

  const readTime = estimateReadTime(post!.body || []);
  const currentIndex = allPosts.findIndex((p) => p.slug === slug);
  const nextPost = currentIndex >= 0 && currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  return (
    <>
      <Nav dark />

      {/* JSON-LD Article + BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Article",
                "@id": `https://www.voitureschinoises.com/blog/${slug}#article`,
                "headline": post!.title,
                "datePublished": post!.publishedAt,
                "dateModified": post!.publishedAt,
                "image": post!.imageUrl ? { "@type": "ImageObject", "url": post!.imageUrl, "width": 1200, "height": 630 } : undefined,
                "author": { "@type": "Organization", "name": "Connexion Stratégique", "url": "https://www.voitureschinoises.com" },
                "publisher": {
                  "@type": "Organization",
                  "name": "Voitures Chinoises",
                  "logo": { "@type": "ImageObject", "url": "https://res.cloudinary.com/daol8mzeg/image/upload/v1772665987/LOGO_VOITURES_CHINOISE_ROUGE_600x_pfafuh.png" }
                },
                "description": post!.excerpt || "",
                "mainEntityOfPage": { "@type": "WebPage", "@id": `https://www.voitureschinoises.com/blog/${slug}` },
                "inLanguage": "fr-FR",
                "isPartOf": { "@id": "https://www.voitureschinoises.com/blog" },
              },
              {
                "@type": "BreadcrumbList",
                "itemListElement": [
                  { "@type": "ListItem", "position": 1, "name": "Accueil", "item": "https://www.voitureschinoises.com" },
                  { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://www.voitureschinoises.com/blog" },
                  { "@type": "ListItem", "position": 3, "name": post!.title, "item": `https://www.voitureschinoises.com/blog/${slug}` },
                ],
              },
            ],
          }),
        }}
      />

      <main>
        {/* Hero */}
        <section style={{ position: "relative", minHeight: 420, background: "#0D0D0D", display: "flex", alignItems: "flex-end" }}>
          {post!.imageUrl && (
            <Image src={post!.imageUrl} alt={post!.imageAlt || post!.title} fill style={{ objectFit: "cover", opacity: 0.35 }} unoptimized />
          )}
          <div style={{ position: "relative", zIndex: 1, maxWidth: 820, margin: "0 auto", width: "100%", padding: "0 40px 56px" }}>
            {/* Breadcrumb */}
            <div style={{ fontFamily: "DM Sans, sans-serif", fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 20, letterSpacing: "0.08em" }}>
              <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>Accueil</Link>
              {" · "}
              <Link href="/blog" style={{ color: "inherit", textDecoration: "none" }}>Blog</Link>
              {" · "}
              <span style={{ color: "rgba(255,255,255,0.7)" }}>{post!.title}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
              {post!.category && (
                <span style={{ background: "#A01414", color: "#fff", fontFamily: "DM Sans, sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", padding: "5px 12px", borderRadius: 2 }}>
                  {CAT_LABELS[post!.category] || post!.category}
                </span>
              )}
              {post!.publishedAt && (
                <span style={{ fontFamily: "DM Sans, sans-serif", fontSize: 12, color: "rgba(255,255,255,0.5)" }}>
                  {formatDate(post!.publishedAt)}
                </span>
              )}
              <span style={{ fontFamily: "DM Sans, sans-serif", fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
                {readTime} min de lecture
              </span>
            </div>
            <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(28px,4vw,52px)", fontWeight: 700, color: "#fff", lineHeight: 1.15 }}>
              {post!.title}
            </h1>
          </div>
        </section>

        {/* Article body */}
        <section style={{ background: "#fff", padding: "48px 40px 80px" }}>
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            {/* Back link — top */}
            <div style={{ marginBottom: 32 }}>
              <Link href="/blog" style={{ fontFamily: "DM Sans, sans-serif", fontSize: 13, fontWeight: 700, color: "#A01414", letterSpacing: "0.06em", textDecoration: "none" }}>
                ← Retour au blog
              </Link>
            </div>

            {post!.excerpt && (
              <p style={{
                fontFamily: "Cormorant Garamond, serif", fontSize: 20, fontStyle: "italic",
                color: "#555", lineHeight: 1.7, marginBottom: 40,
                paddingBottom: 32, borderBottom: "1px solid #E0E0E0",
              }}>
                {post!.excerpt}
              </p>
            )}
            {post!.body && post!.body.length > 0 && (
              <PortableText value={post!.body} components={ptComponents} />
            )}

            {/* Next article */}
            {nextPost && (
              <div style={{ marginTop: 64, paddingTop: 40, borderTop: "2px solid #E0E0E0" }}>
                <div style={{ fontFamily: "DM Sans, sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#aaa", marginBottom: 16 }}>
                  Article suivant
                </div>
                <Link href={`/blog/${nextPost.slug}`} style={{ textDecoration: "none", display: "block" }}>
                  <div style={{
                    border: "1px solid #E0E0E0", borderRadius: 12, overflow: "hidden",
                    display: "grid", gridTemplateColumns: nextPost.imageUrl ? "160px 1fr" : "1fr",
                    transition: "box-shadow .2s",
                  }}
                    className="blog-next-card"
                  >
                    {nextPost.imageUrl && (
                      <div style={{ position: "relative", height: 140, background: "#111" }}>
                        <Image src={nextPost.imageUrl} alt={nextPost.imageAlt || nextPost.title} fill style={{ objectFit: "cover" }} unoptimized />
                      </div>
                    )}
                    <div style={{ padding: "20px 24px" }}>
                      {nextPost.category && (
                        <span style={{ fontFamily: "DM Sans, sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#A01414", display: "block", marginBottom: 8 }}>
                          {CAT_LABELS[nextPost.category] || nextPost.category}
                        </span>
                      )}
                      <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 20, fontWeight: 700, color: "#0D0D0D", lineHeight: 1.25, marginBottom: 8 }}>
                        {nextPost.title}
                      </h3>
                      {nextPost.excerpt && (
                        <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 13, color: "#666", lineHeight: 1.6, margin: 0 }}>
                          {nextPost.excerpt.length > 120 ? nextPost.excerpt.slice(0, 120) + "…" : nextPost.excerpt}
                        </p>
                      )}
                      <div style={{ marginTop: 12, fontFamily: "DM Sans, sans-serif", fontSize: 12, fontWeight: 700, color: "#A01414" }}>
                        Lire l&apos;article →
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer minimal />
    </>
  );
}

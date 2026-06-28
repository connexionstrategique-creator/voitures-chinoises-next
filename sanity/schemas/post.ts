import { defineField, defineType } from "sanity";
import { orderRankField } from "@sanity/orderable-document-list";

export const postSchema = defineType({
  name: "post",
  title: "Article Blog",
  type: "document",
  groups: [
    { name: "content", title: "✍️ Contenu", default: true },
    { name: "seo",     title: "🔍 SEO" },
  ],
  fields: [
    orderRankField({ type: "post" }),
    defineField({
      name: "title", title: "Titre", type: "string",
      group: "content",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug", title: "Slug (URL)", type: "slug",
      group: "content",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "mainImage", title: "Image principale", type: "image",
      group: "content",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", title: "Texte alternatif", type: "string" }),
      ],
    }),
    defineField({
      name: "publishedAt", title: "Date de publication", type: "datetime",
      group: "content",
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "category", title: "Catégorie", type: "string",
      group: "content",
      options: {
        list: [
          { title: "Actualités",        value: "actualites" },
          { title: "Guides d'achat",    value: "guides"     },
          { title: "Nouveaux modèles",  value: "modeles"    },
          { title: "Marché automobile", value: "marche"     },
        ],
        layout: "radio",
      },
      initialValue: "actualites",
    }),
    defineField({
      name: "excerpt", title: "Extrait (accroche)", type: "text",
      group: "content", rows: 3,
      description: "Affiché sur la carte blog et utilisé pour la meta description SEO (150–200 caractères idéalement).",
      validation: (r) => r.max(300),
    }),
    defineField({
      name: "body", title: "Contenu de l'article",
      type: "array", group: "content",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal",   value: "normal"     },
            { title: "H2",       value: "h2"         },
            { title: "H3",       value: "h3"         },
            { title: "H4",       value: "h4"         },
            { title: "Citation", value: "blockquote" },
          ],
          marks: {
            decorators: [
              { title: "Gras",    value: "strong" },
              { title: "Italique", value: "em"    },
            ],
            annotations: [
              {
                title: "Lien", name: "link", type: "object",
                fields: [
                  defineField({ name: "href", title: "URL", type: "url" }),
                  defineField({ name: "blank", title: "Nouvel onglet", type: "boolean", initialValue: true }),
                ],
              },
            ],
          },
        },
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({ name: "alt", title: "Texte alternatif", type: "string" }),
            defineField({ name: "caption", title: "Légende", type: "string" }),
          ],
        },
        { type: "table" },
        { type: "promoAuto" },
        {
          type: "object",
          name: "youtubeEmbed",
          title: "Vidéo YouTube",
          fields: [
            defineField({ name: "videoId", title: "ID YouTube (ex: dQw4w9WgXcQ)", type: "string" }),
            defineField({ name: "caption", title: "Légende (optionnel)", type: "string" }),
          ],
          preview: { select: { title: "videoId" }, prepare: ({ title }: any) => ({ title: `▶ YouTube: ${title}` }) },
        },
      ],
    }),
    defineField({
      name: "seoTitle", title: "Titre SEO (optionnel)", type: "string",
      group: "seo",
      description: "Si vide, utilise le titre de l'article.",
    }),
    defineField({
      name: "seoDescription", title: "Description SEO (optionnel)", type: "text",
      group: "seo", rows: 2,
      description: "Si vide, utilise l'extrait.",
    }),
  ],
  preview: {
    select: { title: "title", media: "mainImage", category: "category", date: "publishedAt" },
    prepare({ title, media, category, date }: any) {
      const icons: Record<string, string> = { actualites: "📰", guides: "📖", modeles: "🚗", marche: "📊" };
      const d = date ? new Date(date).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" }) : "";
      return { title, subtitle: `${icons[category] || "📝"} ${d}`, media };
    },
  },
  orderings: [
    { title: "Date (récent)", name: "publishedAtDesc", by: [{ field: "publishedAt", direction: "desc" }] },
  ],
});

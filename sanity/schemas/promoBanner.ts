import { defineField, defineType } from "sanity";

export const promoBannerSchema = defineType({
  name: "promoBanner",
  title: "Publicité bannière (affiche)",
  type: "object",
  fields: [
    defineField({
      name: "image",
      title: "Image / Affiche",
      type: "image",
      options: { hotspot: false },
      validation: (r) => r.required(),
      description: "Uploadez votre affiche promotionnelle (JPG ou PNG).",
    }),
    defineField({
      name: "alt",
      title: "Texte alternatif",
      type: "string",
      description: "Ex : Offre groupage Changan X5 Plus juin 2026",
    }),
    defineField({
      name: "linkUrl",
      title: "Lien au clic (optionnel)",
      type: "url",
      description: "URL WhatsApp, page catalogue, etc. Laissez vide pour une image sans lien.",
    }),
  ],
  preview: {
    select: { title: "alt", media: "image" },
    prepare({ title, media }: any) {
      return { title: `🖼 ${title || "Bannière promo"}`, media };
    },
  },
});

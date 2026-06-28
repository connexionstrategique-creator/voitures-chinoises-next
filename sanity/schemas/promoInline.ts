import { defineType, defineField } from "sanity";

export default defineType({
  name: "promoInline",
  title: "Publicité inline",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Label (ex: PUBLICITÉ)",
      type: "string",
      initialValue: "PUBLICITÉ",
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "title",
      title: "Titre",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Description courte",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "ctaLabel",
      title: "Texte du bouton",
      type: "string",
      initialValue: "En savoir plus",
    }),
    defineField({
      name: "whatsappMessage",
      title: "Message WhatsApp",
      type: "string",
    }),
  ],
  preview: {
    select: { title: "title", media: "image" },
    prepare({ title, media }) {
      return { title: title || "Publicité inline", media };
    },
  },
});

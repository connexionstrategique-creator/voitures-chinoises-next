import { defineField, defineType } from "sanity";

export const carSchema = defineType({
  name: "car",
  title: "Voiture",
  type: "document",
  fields: [
    defineField({ name: "brand", title: "Marque", type: "string", validation: (r) => r.required() }),
    defineField({ name: "model", title: "Modèle", type: "string", validation: (r) => r.required() }),
    defineField({ name: "year", title: "Année", type: "string", initialValue: "2026" }),
    defineField({
      name: "cat",
      title: "Catégorie",
      type: "string",
      options: { list: [{ title: "SUV", value: "suv" }, { title: "Hybride", value: "hybride" }] },
    }),
    defineField({
      name: "badge",
      title: "Badge",
      type: "string",
      options: { list: [{ title: "Nouveau", value: "new" }, { title: "Populaire", value: "pop" }, { title: "Électrique", value: "elec" }, { title: "Promo", value: "promo" }] },
    }),
    defineField({ name: "badgeText", title: "Texte du badge", type: "string" }),
    defineField({ name: "featured", title: "Mis en avant (grande carte)", type: "boolean", initialValue: false }),
    defineField({ name: "price", title: "Prix FCFA (ex: 13 935 000)", type: "string", validation: (r) => r.required() }),
    defineField({ name: "color", title: "Couleur SVG (hex)", type: "string", initialValue: "#A01414" }),
    defineField({
      name: "colors",
      title: "Couleurs disponibles",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "photos",
      title: "Photos",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "label", title: "Légende", type: "string" }),
            defineField({ name: "image", title: "Photo", type: "image", options: { hotspot: true } }),
          ],
        },
      ],
    }),
    defineField({
      name: "specs",
      title: "Fiche technique",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "key", title: "Clé (ex: Moteur)", type: "string" }),
            defineField({ name: "value", title: "Valeur (ex: 2.0T Essence)", type: "string" }),
          ],
        },
      ],
    }),
    defineField({ name: "mini_v1", title: "Mini spec 1 — valeur", type: "string" }),
    defineField({ name: "mini_k1", title: "Mini spec 1 — clé", type: "string" }),
    defineField({ name: "mini_v2", title: "Mini spec 2 — valeur", type: "string" }),
    defineField({ name: "mini_k2", title: "Mini spec 2 — clé", type: "string" }),
    defineField({ name: "mini_v3", title: "Mini spec 3 — valeur", type: "string" }),
    defineField({ name: "mini_k3", title: "Mini spec 3 — clé", type: "string" }),
    defineField({ name: "desc", title: "Description", type: "text", rows: 4 }),
    defineField({ name: "order", title: "Ordre d'affichage", type: "number", initialValue: 99 }),
  ],
  preview: {
    select: { title: "brand", subtitle: "model", media: "photos.0.src" },
    prepare({ title, subtitle }) {
      return { title: `${title} ${subtitle}` };
    },
  },
  orderings: [{ title: "Ordre d'affichage", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
});

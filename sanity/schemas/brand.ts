import { defineField, defineType } from "sanity";

export const brandSchema = defineType({
  name: "brand",
  title: "Marque",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Nom de la marque", type: "string", validation: (r) => r.required() }),
    defineField({ name: "desc", title: "Description courte", type: "string" }),
    defineField({ name: "logo", title: "URL du logo (Cloudinary)", type: "url" }),
    defineField({ name: "order", title: "Ordre d'affichage", type: "number", initialValue: 99 }),
  ],
  preview: {
    select: { title: "name", subtitle: "desc" },
  },
});

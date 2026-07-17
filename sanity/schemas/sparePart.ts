import { defineField, defineType } from "sanity";

export const sparePartSchema = defineType({
  name: "sparePart",
  title: "Pièce de rechange",
  type: "document",

  groups: [
    { name: "identite",  title: "🔩 Identité",        default: true },
    { name: "visuels",   title: "📸 Photos"            },
    { name: "catalogue", title: "🏷️ Prix & Catalogue"  },
  ],

  fields: [
    defineField({
      name: "name",
      title: "Nom de la pièce",
      type: "string",
      group: "identite",
      description: "Ex : Filtre à huile moteur, Plaquettes de frein avant…",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug (URL)",
      type: "slug",
      group: "identite",
      options: { source: "name", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "reference",
      title: "Référence constructeur",
      type: "string",
      group: "identite",
      description: "Ex : CHN-FLT-0042",
    }),
    defineField({
      name: "category",
      title: "Catégorie",
      type: "string",
      group: "identite",
      options: {
        list: [
          { title: "Filtration (huile, air, carburant…)",    value: "filtration"  },
          { title: "Freinage (plaquettes, disques…)",         value: "freinage"    },
          { title: "Moteur & transmission",                   value: "moteur"      },
          { title: "Suspension & direction",                  value: "suspension"  },
          { title: "Électricité & batterie",                  value: "electricite" },
          { title: "Carrosserie & vitrage",                   value: "carrosserie" },
          { title: "Entretien courant",                       value: "entretien"   },
          { title: "Autre",                                   value: "autre"       },
        ],
        layout: "radio",
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      group: "identite",
      rows: 3,
      description: "Brève description de la pièce et de son rôle.",
    }),
    defineField({
      name: "compatibleCars",
      title: "Voitures compatibles",
      type: "array",
      group: "identite",
      description: "Sélectionner toutes les voitures avec lesquelles cette pièce est compatible.",
      of: [
        {
          type: "reference",
          to: [{ type: "car" }],
          options: {
            filter: "_type == 'car'",
            disableNew: true,
          },
        },
      ],
    }),

    // ── PHOTOS ──
    defineField({
      name: "photos",
      title: "Photos de la pièce",
      type: "array",
      group: "visuels",
      of: [{ type: "image", options: { hotspot: true } }],
      options: { layout: "grid" },
    }),

    // ── PRIX & CATALOGUE ──
    defineField({
      name: "price",
      title: "Prix de référence (FCFA)",
      type: "number",
      group: "catalogue",
      description: "Prix indicatif en FCFA. Ex : 15000",
      validation: (r) => r.required().positive(),
    }),
    defineField({
      name: "inStock",
      title: "Disponible",
      type: "boolean",
      group: "catalogue",
      initialValue: true,
      description: "Cocher si la pièce est disponible à la commande.",
    }),
    defineField({
      name: "featured",
      title: "Mettre en avant",
      type: "boolean",
      group: "catalogue",
      initialValue: false,
    }),
  ],

  preview: {
    select: {
      title: "name",
      subtitle: "category",
      media: "photos.0",
    },
    prepare({ title, subtitle, media }) {
      const cats: Record<string, string> = {
        filtration:  "Filtration",
        freinage:    "Freinage",
        moteur:      "Moteur",
        suspension:  "Suspension",
        electricite: "Électricité",
        carrosserie: "Carrosserie",
        entretien:   "Entretien",
        autre:       "Autre",
      };
      return { title: title ?? "Pièce", subtitle: cats[subtitle] ?? subtitle, media };
    },
  },
});

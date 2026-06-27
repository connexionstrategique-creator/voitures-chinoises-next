import { defineField, defineType } from "sanity";
import { orderRankField, orderRankOrdering } from "@sanity/orderable-document-list";

export const carSchema = defineType({
  name: "car",
  title: "Voiture",
  type: "document",

  // ── ONGLETS ──────────────────────────────────────────────
  groups: [
    { name: "identite",  title: "🚗 Identité",       default: true },
    { name: "visuels",   title: "📸 Photos & Couleurs" },
    { name: "technique", title: "⚙️ Fiche Technique"  },
    { name: "catalogue", title: "🏷️ Prix & Catalogue" },
  ],

  // ── SOUS-GROUPES (pour mini-specs) ───────────────────────
  fieldsets: [
    { name: "mini1", title: "Badge technique 1", options: { columns: 2 } },
    { name: "mini2", title: "Badge technique 2", options: { columns: 2 } },
    { name: "mini3", title: "Badge technique 3", options: { columns: 2 } },
  ],

  fields: [
    // ── IDENTITÉ ──
    defineField({
      name: "brand", title: "Marque", type: "string",
      group: "identite",
      description: "Ex : BYD, Changan, Jetour…",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "model", title: "Modèle", type: "string",
      group: "identite",
      description: "Ex : Titanium 7, CS55, X70 Plus…",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "year", title: "Année", type: "string",
      group: "identite",
      initialValue: "2026",
    }),
    defineField({
      name: "cat", title: "Catégorie", type: "string",
      group: "identite",
      options: {
        list: [
          { title: "SUV", value: "suv" },
          { title: "Hybride / PHEV", value: "hybride" },
          { title: "5 Places", value: "5places" },
          { title: "7 Places", value: "7places" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "desc", title: "Accroche courte", type: "text",
      group: "identite",
      rows: 2,
      description: "1 phrase d'accroche. Ex : Découvrez la BYD Titanium 7...",
    }),
    defineField({
      name: "reasons",
      title: "5 Raisons d'acheter",
      type: "array",
      group: "identite",
      description: "Exactement 5 raisons convaincantes. Générées automatiquement par l'IA.",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "title", title: "Titre", type: "string" }),
            defineField({ name: "body", title: "Détail", type: "text", rows: 2 }),
          ],
          preview: { select: { title: "title", subtitle: "body" } },
        },
      ],
    }),

    // ── VISUELS ──
    defineField({
      name: "photos",
      title: "Photos — Sélectionner plusieurs à la fois",
      description: "Cliquer 'Add item' puis sélectionner plusieurs fichiers d'un coup dans le sélecteur de fichiers.",
      type: "array",
      group: "visuels",
      of: [{ type: "image", options: { hotspot: true } }],
      options: { layout: "grid" },
    }),
    defineField({
      name: "colors", title: "Couleurs disponibles", type: "array",
      group: "visuels",
      description: "Ajouter une couleur par ligne (ex : Blanc Perle, Noir Obsidien…)",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "color", title: "Couleur de l'icône SVG (hex)", type: "string",
      group: "visuels",
      initialValue: "#A01414",
      description: "Couleur principale de la silhouette SVG sur les cartes.",
    }),

    defineField({
      name: "colorGroups",
      title: "Photos par couleur (filtrage)",
      type: "array",
      group: "visuels",
      description: "Si renseigné, les visiteurs peuvent filtrer les photos par couleur sur la page voiture.",
      of: [{
        type: "object",
        name: "colorGroup",
        title: "Groupe couleur",
        fields: [
          defineField({ name: "colorName", title: "Couleur (ex : Noire, Blanche…)", type: "string" }),
          defineField({
            name: "photos", title: "Photos de cette couleur", type: "array",
            of: [{ type: "image", options: { hotspot: true } }],
            options: { layout: "grid" },
          }),
        ],
        preview: { select: { title: "colorName" } },
      }],
    }),
    defineField({
      name: "youtubeId",
      title: "Vidéo YouTube (ID)",
      type: "string",
      group: "visuels",
      description: "L'ID de la vidéo YouTube (ex : dQw4w9WgXcQ pour https://youtu.be/dQw4w9WgXcQ).",
    }),
    defineField({
      name: "autohomeId",
      title: "Viewer 3D AutoHome — Extérieur",
      type: "string",
      group: "visuels",
      description: "Chemin pano extérieur AutoHome (ex : ext/69960 → pano.autohome.com.cn/car/ext/69960).",
    }),
    defineField({
      name: "autohomeInteriorId",
      title: "Viewer 3D AutoHome — Intérieur",
      type: "string",
      group: "visuels",
      description: "Chemin pano intérieur AutoHome (ex : pano/61568).",
    }),

    // ── FICHE TECHNIQUE ──
    defineField({
      name: "mini_v1", title: "Valeur", type: "string",
      group: "technique", fieldset: "mini1",
      description: "Ex : 2.0T",
    }),
    defineField({
      name: "mini_k1", title: "Label", type: "string",
      group: "technique", fieldset: "mini1",
      description: "Ex : Moteur",
    }),
    defineField({
      name: "mini_v2", title: "Valeur", type: "string",
      group: "technique", fieldset: "mini2",
      description: "Ex : 5",
    }),
    defineField({
      name: "mini_k2", title: "Label", type: "string",
      group: "technique", fieldset: "mini2",
      description: "Ex : Places",
    }),
    defineField({
      name: "mini_v3", title: "Valeur", type: "string",
      group: "technique", fieldset: "mini3",
      description: "Ex : 0",
    }),
    defineField({
      name: "mini_k3", title: "Label", type: "string",
      group: "technique", fieldset: "mini3",
      description: "Ex : Kilomètre",
    }),
    defineField({
      name: "specs", title: "Fiche technique complète", type: "array",
      group: "technique",
      description: "Chaque ligne = une ligne de la fiche technique (clé + valeur).",
      of: [
        {
          type: "object",
          preview: { select: { title: "key", subtitle: "value" } },
          fields: [
            defineField({ name: "key",   title: "Caractéristique (ex : Moteur)", type: "string" }),
            defineField({ name: "value", title: "Valeur (ex : 2.0T Turbo Essence)", type: "string" }),
          ],
        },
      ],
    }),

    // ── PRIX & CATALOGUE ──
    defineField({
      name: "price", title: "Prix CIF (FCFA)", type: "string",
      group: "catalogue",
      description: "Ex : 13 935 000  — utiliser des espaces comme séparateurs de milliers.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "badge", title: "Badge", type: "string",
      group: "catalogue",
      options: {
        list: [
          { title: "Nouveau", value: "new" },
          { title: "Populaire", value: "pop" },
          { title: "Électrique", value: "elec" },
          { title: "Promo", value: "promo" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "badgeText", title: "Texte libre du badge", type: "string",
      group: "catalogue",
      description: "Remplace le badge prédéfini si renseigné.",
    }),
    defineField({
      name: "featured", title: "Mettre en avant (grande carte)", type: "boolean",
      group: "catalogue",
      initialValue: false,
    }),
    orderRankField({ type: "car" }),
    defineField({
      name: "order", title: "Ordre (ancien)", type: "number",
      hidden: true,
    }),
  ],

  preview: {
    select: {
      title: "brand",
      subtitle: "model",
      media: "photos.0.image",
    },
    prepare({ title, subtitle, media }) {
      return { title: `${title ?? "—"} ${subtitle ?? ""}`.trim(), media };
    },
  },

  orderings: [orderRankOrdering],
});

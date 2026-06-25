import { defineField, defineType } from "sanity";

export const siteSettingsSchema = defineType({
  name: "siteSettings",
  title: "⚙️ Paramètres du site",
  type: "document",
  groups: [
    { name: "hero",    title: "🏠 Page d'accueil — Hero", default: true },
    { name: "contact", title: "📞 Contact & WhatsApp" },
  ],

  fields: [
    // ── HERO ──
    defineField({
      name: "heroLine1",
      title: "Hero — Ligne 1",
      type: "string",
      group: "hero",
      initialValue: "Voitures chinoises.",
      description: "Première ligne du grand titre.",
    }),
    defineField({
      name: "heroLine2",
      title: "Hero — Ligne 2 (italique rouge)",
      type: "string",
      group: "hero",
      initialValue: "Neuves.",
      description: "Deuxième ligne — apparaît en rouge italique.",
    }),
    defineField({
      name: "heroLine3",
      title: "Hero — Ligne 3 (gras)",
      type: "string",
      group: "hero",
      initialValue: "Prix d'usine.",
      description: "Troisième ligne — apparaît en gras.",
    }),
    defineField({
      name: "heroSubtitle",
      title: "Hero — Sous-titre",
      type: "text",
      rows: 3,
      group: "hero",
      initialValue: "Une voiture neuve au prix d'une occasion. Nous achetons directement en usine en Chine — vous choisissez, vous personnalisez, nous livrons CIF jusqu'à votre port. Zéro intermédiaire. Zéro mauvaise surprise.",
      description: "Texte descriptif sous le titre principal.",
    }),

    // ── CONTACT ──
    defineField({
      name: "whatsappNumber",
      title: "Numéro WhatsApp (sans +, sans espaces)",
      type: "string",
      group: "contact",
      initialValue: "8619587439774",
      description: "Ex : 22941765341 — utilisé pour tous les boutons WhatsApp du site.",
    }),
    defineField({
      name: "phoneDisplay",
      title: "Numéro affiché (formaté)",
      type: "string",
      group: "contact",
      initialValue: "+229 01 41 76 53 41",
      description: "Version lisible affichée dans le footer.",
    }),
    defineField({
      name: "phoneCN",
      title: "Numéro Chine (affiché)",
      type: "string",
      group: "contact",
      initialValue: "+86 195 8743 9774",
    }),
  ],

  preview: {
    prepare() {
      return { title: "Paramètres du site" };
    },
  },
});

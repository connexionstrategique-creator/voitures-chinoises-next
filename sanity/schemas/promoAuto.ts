import { defineField, defineType } from "sanity";

export const promoAutoSchema = defineType({
  name: "promoAuto",
  title: "Publicité véhicule",
  type: "object",
  fields: [
    defineField({
      name: "vehicleName",
      title: "Nom du véhicule",
      type: "string",
      description: "Ex : CHANGAN X5 PLUS",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "version",
      title: "Version / Édition",
      type: "string",
      description: "Ex : VERSION BEYOND Pro",
    }),
    defineField({
      name: "year",
      title: "Année",
      type: "string",
      initialValue: "2026",
    }),
    defineField({
      name: "price",
      title: "Prix TTC en FCFA",
      type: "string",
      description: "Ex : 9 800 000",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "image",
      title: "Image promotionnelle (optionnel)",
      type: "image",
      options: { hotspot: true },
      description: "Photo du véhicule ou visuel de la promo",
    }),
    defineField({
      name: "includedItems",
      title: "Ce qui est inclus dans le prix",
      type: "array",
      of: [{ type: "string" }],
      initialValue: [
        "Achat du véhicule",
        "Licence d'exportation",
        "Transport maritime jusqu'à Cotonou",
        "Dédouanement",
        "Immatriculation",
      ],
    }),
    defineField({
      name: "bonusItems",
      title: "Bonus gratuits",
      type: "array",
      of: [{ type: "string" }],
      description: "Laisser vide si pas de bonus",
    }),
    defineField({
      name: "availableUnits",
      title: "Nombre de véhicules disponibles",
      type: "number",
    }),
    defineField({
      name: "paymentDeadline",
      title: "Date limite de paiement",
      type: "string",
      description: "Ex : 20 JUIN 2026",
    }),
    defineField({
      name: "shippingDate",
      title: "Date de chargement du conteneur",
      type: "string",
      description: "Ex : 30 JUIN 2026",
    }),
    defineField({
      name: "ctaLabel",
      title: "Texte du bouton",
      type: "string",
      initialValue: "Réserver ma place",
    }),
    defineField({
      name: "whatsappMessage",
      title: "Message WhatsApp pré-rempli",
      type: "string",
      description: "Laissez vide pour le message par défaut",
    }),
  ],
  preview: {
    select: { title: "vehicleName", subtitle: "price" },
    prepare({ title, subtitle }: any) {
      return { title: `📢 ${title || "Promo véhicule"}`, subtitle: subtitle ? `${subtitle} FCFA` : "" };
    },
  },
});

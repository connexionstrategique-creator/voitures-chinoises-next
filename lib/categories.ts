import type { Car } from "@/data/types";
import { toSlug } from "./slug";

// Stored in Sanity as "<body>" or "<body>-<energy>". "hybride" = PHEV or EREV
// (range extender); 48V mild hybrids stay in the plain body category.
export const CAR_CATEGORIES: { value: string; title: string }[] = [
  { value: "suv", title: "SUV" },
  { value: "suv-hybride", title: "SUV hybride" },
  { value: "suv-electrique", title: "SUV électrique" },
  { value: "berline", title: "Berline" },
  { value: "berline-hybride", title: "Berline hybride" },
  { value: "berline-electrique", title: "Berline électrique" },
  { value: "citadine", title: "Citadine" },
  { value: "citadine-electrique", title: "Citadine électrique" },
  { value: "monospace", title: "Monospace" },
  { value: "monospace-hybride", title: "Monospace hybride" },
  { value: "pickup", title: "Pick-up" },
  { value: "pickup-hybride", title: "Pick-up hybride" },
  { value: "utilitaire", title: "Utilitaire" },
];

// Brings legacy spellings ("SUV électrique", "Berline hybride", "sedan", "Pick-up")
// to the stored form, so filters don't depend on case or accents.
export function normalizeCat(cat: string | null | undefined): string {
  return toSlug(cat ?? "")
    .replace(/^sedan/, "berline")
    .replace(/^pick-up/, "pickup");
}

export function catLabel(cat: string): string {
  const value = normalizeCat(cat);
  return CAR_CATEGORIES.find((c) => c.value === value)?.title ?? cat;
}

export const TYPE_FILTERS = [
  { key: "all", label: "Tous" },
  { key: "suv", label: "SUV" },
  { key: "berline", label: "Berlines" },
  { key: "pickup", label: "Pick-up" },
  { key: "hybride", label: "Hybrides" },
  { key: "electrique", label: "Électriques" },
  { key: "5places", label: "5 Places" },
  { key: "7places", label: "7 Places" },
];

// Largest "N places" / "N seats" in the model name or tech sheet, or the leading
// number of a "Places" entry ("7 (2+3+2)"). null when the sheet doesn't say.
export function seatCount(car: Pick<Car, "model" | "specs">): number | null {
  let max: number | null = null;
  const texts = [car.model, ...Object.entries(car.specs).map(([k, v]) => `${k} ${v}`)];
  for (const text of texts) {
    for (const m of text.matchAll(/\b(\d{1,2})\s*(?:places|seats)\b/gi)) {
      max = Math.max(max ?? 0, Number(m[1]));
    }
  }
  for (const key of ["Places", "Nombre de places"]) {
    const m = car.specs[key]?.match(/^\s*(\d{1,2})\b/);
    if (m) max = Math.max(max ?? 0, Number(m[1]));
  }
  return max;
}

export function matchesTypeFilter(car: Pick<Car, "cat" | "model" | "specs">, filter: string): boolean {
  if (filter === "all") return true;
  const parts = normalizeCat(car.cat).split("-");
  switch (filter) {
    case "hybride":
    case "electrique":
      return parts.includes(filter);
    case "5places":
      return seatCount(car) === 5;
    case "7places": {
      // 7 to 9 seats: excludes minibuses
      const seats = seatCount(car);
      return seats !== null && seats >= 7 && seats <= 9;
    }
    default:
      // Body type: "suv" also matches "suv-hybride" and "suv-electrique"
      return parts[0] === filter;
  }
}

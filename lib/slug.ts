export function toSlug(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function carSlug(brand: string, model: string): string {
  return `${toSlug(brand)}-${toSlug(model)}`;
}

export function brandSlug(name: string): string {
  return toSlug(name);
}

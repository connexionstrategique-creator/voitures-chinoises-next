import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/", "/studio", "/api/"],
      },
    ],
    sitemap: "https://www.voitureschinoises.com/sitemap.xml",
  };
}

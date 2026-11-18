import type { MetadataRoute } from "next";
import { isProduction, site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  if (!isProduction) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/taloyhtio/"] },
    sitemap: `${site.url}/sitemap.xml`,
  };
}

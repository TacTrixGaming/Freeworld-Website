import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/rules", "/applications"],
      disallow: ["/admin", "/my-applications", "/api"]
    },
    sitemap: `${siteConfig.baseUrl}/sitemap.xml`
  };
}

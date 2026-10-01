import type { MetadataRoute } from "next";
import { APP_CONFIG } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/dashboard/",
        "/order/",
      ],
    },
    sitemap: new URL("/sitemap.xml", APP_CONFIG.url).toString(),
    host: APP_CONFIG.url,
  };
}

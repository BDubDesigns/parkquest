import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "ParkQuest Family Park Passport",
    short_name: "ParkQuest",
    description:
      "Explore Bellingham parks, stamp family visits, and earn Adventure Points and stickers.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#f8fafc",
    theme_color: "#064e3b",
    categories: ["family", "travel", "lifestyle"],
    icons: [
      {
        src: "/icons/parkquest-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/parkquest-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/parkquest-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}

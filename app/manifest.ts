import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Samir Shaikh's Portfolio",
    short_name: "Samir Shaikh",
    description: "The personal portfolio and blog of Samir Shaikh — AI Backend Engineer, AI SDE, and Agentic AI Engineer — showcasing AI projects, backend engineering work, and developer journey.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        src: "/Filled_Logo.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/Filled_Logo.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}

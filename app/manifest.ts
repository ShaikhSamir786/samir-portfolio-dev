import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Samir Shaikh's Portfolio",
    short_name: "Samir Shaikh",
    description: "The personal portfolio and blog of Samir, showcasing my projects, skills, and developer journey.",
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

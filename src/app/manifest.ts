import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SemiconductorOS",
    short_name: "SemiOS",
    description:
      "AI-powered semiconductor study dashboard with a personal mentor for placement preparation.",
    start_url: "/",
    display: "standalone",
    background_color: "#07111f",
    theme_color: "#07111f",
    icons: [
      {
        src: "/icon-192.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/icon-512.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}

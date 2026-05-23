import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "golink — anonim link & not paylaş",
    short_name: "golink",
    description: "Anonim link ve not paylaşımı. Hesap yok, isteğe bağlı kısa isim.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#f9fafb",
    theme_color: "#f9fafb",
    lang: "tr",
    orientation: "portrait",
    icons: [
      {
        src: "/icon.svg",
        type: "image/svg+xml",
        sizes: "any",
        purpose: "any",
      },
      {
        src: "/apple-icon.svg",
        type: "image/svg+xml",
        sizes: "180x180",
        purpose: "any",
      },
      {
        src: "/maskable-icon.svg",
        type: "image/svg+xml",
        sizes: "any",
        purpose: "maskable",
      },
    ],
  };
}

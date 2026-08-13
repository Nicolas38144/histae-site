import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Histae",
    short_name: "Histae",
    description: "Une application de rencontre qui privilégie le temps, la réciprocité et le consentement.",
    start_url: "/fr/",
    display: "browser",
    background_color: "#0d1421",
    theme_color: "#0d1421",
    icons: [{ src: "/logo.png", sizes: "any", type: "image/png" }],
  };
}

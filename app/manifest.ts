import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Histae",
    short_name: "Histae",
    description: "Histae organise la découverte, les matchs réciproques et la conversation autour du temps, du consentement et du contrôle des données.",
    start_url: "/fr/",
    display: "browser",
    background_color: "#0d1421",
    theme_color: "#0d1421",
    icons: [{ src: "/logo.png", sizes: "any", type: "image/png" }],
  };
}

import type { Metadata } from "next";

export const brandIcons = {
  icon: [
    { url: "/branding/favicon.svg", type: "image/svg+xml" },
    { url: "/branding/favicon.png", type: "image/png", sizes: "48x48" },
  ],
  apple: [{ url: "/branding/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
} satisfies Metadata["icons"];

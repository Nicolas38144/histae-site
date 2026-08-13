import type { Metadata } from "next";
import "./globals.css";
import { publicUrl } from "../lib/metadata";

export const metadata: Metadata = {
  metadataBase: new URL(publicUrl),
  title: { default: "Histae", template: "%s · Histae" },
  description: "Une application de rencontre qui privilégie le temps, la réciprocité et le consentement.",
  icons: { icon: "/logo.png" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
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

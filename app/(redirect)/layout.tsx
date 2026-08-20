import type { Metadata } from "next";
import "../globals.css";
import { publicUrl } from "../../lib/metadata";

export const metadata: Metadata = {
  metadataBase: new URL(publicUrl),
  title: "Histae",
  description: "Histae organise la découverte, les matchs réciproques et la conversation autour du temps, du consentement et du contrôle des données.",
  robots: { index: false, follow: true },
  icons: { icon: "/logo.png" },
};

export default function RedirectLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fr"><body>{children}</body></html>;
}

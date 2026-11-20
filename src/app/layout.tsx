import type { Metadata, Viewport } from "next";
import { fr } from "@/lib/i18n/fr";
import "./globals.css";

export const metadata: Metadata = {
  title: fr.meta.title,
  description: fr.meta.description,
  applicationName: "PAP Revolution",
  authors: [{ name: "SOS Villages d'Enfants Tunisie" }],
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#EFFAFF",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" dir="ltr">
      <body>{children}</body>
    </html>
  );
}

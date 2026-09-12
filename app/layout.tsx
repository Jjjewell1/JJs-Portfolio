import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://jjs.jewellcore.com"),
  title: "JJ Jewell — Jewellcore",
  description:
    "JJ Jewell is a self-taught builder who ran his own lawn-care business for a decade and rebuilt those instincts into software, self-hosted infrastructure, and AI. Websites, server admin, homelab.",
  openGraph: {
    title: "JJ Jewell — Jewellcore",
    description:
      "Websites, hosting, and homelab-admin that actually ship. Ten years of lawn-care hustle, rebuilt into a self-hosted software business.",
    url: "https://jjs.jewellcore.com",
    siteName: "Jewellcore",
    type: "website",
  },
  icons: { icon: "/icon.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
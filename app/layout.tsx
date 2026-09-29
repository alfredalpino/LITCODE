import type { Metadata, Viewport } from "next";
import { StudioProvider } from "@/components/StudioProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "SDE Laboratory Studio",
  description:
    "Learn JS/Python/TypeScript by doing — and practice interview DSA with real company-tagged problems.",
};

export const viewport: Viewport = {
  themeColor: "#0e1218",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <StudioProvider>{children}</StudioProvider>
      </body>
    </html>
  );
}

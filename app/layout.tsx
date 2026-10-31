import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fulbaria College — HSC Result 2026",
  description:
    "Search HSC 2026 results for Fulbaria College (EIIN 111516), Mymensingh Board. Filter by session and group, then open a candidate for full details and subject grades.",
  applicationName: "Fulbaria Result Explorer",
};

export const viewport: Viewport = {
  themeColor: "#171717",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: "dark" }}>
      <body className="min-h-screen bg-bg font-sans text-ink antialiased">
        {children}
      </body>
    </html>
  );
}

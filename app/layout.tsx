import type { Metadata } from "next";
import { googleFontUrl } from "@/lib/fonts/catalog";
import { familiesInUse } from "@/lib/fonts/used";
import "./globals.css";

export const metadata: Metadata = {
  title: "SantoDS v1",
  description: "Design system Santo — tokens em paridade com o Figma",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // A tipografia é resolvida pelo nome da família, que vem dos tokens
  // brand/family/*. Por isso as fontes chegam do Google Fonts com o nome real:
  // o next/font geraria um nome hasheado que nunca casaria com o token.
  const families = await familiesInUse();

  return (
    <html lang="pt-BR" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {families.map((family) => {
          const href = googleFontUrl(family);
          return href ? <link key={family} rel="stylesheet" href={href} /> : null;
        })}
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

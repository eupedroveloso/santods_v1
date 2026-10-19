import type { Metadata, Viewport } from "next";
import { googleFontUrl } from "@/lib/fonts/catalog";
import { familiesInUse } from "@/lib/fonts/used";
import { DEV_CSS_REFRESH, THEME_SCRIPT } from "./_components/theme-script";
import { DocsShell } from "./_docs/shell";
import { docsNav, docsSearch } from "./_docs/site";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "SantoDS", template: "%s · SantoDS" },
  description: "Documentação do SantoDS: tokens, estilos, componentes e identidades, em paridade com o Figma.",
};

// viewport-fit=cover: sem ele, env(safe-area-inset-*) vale 0 e a TabBar
// floating / o Fab ficam sob a barra do sistema no iPhone.
export const viewport: Viewport = { viewportFit: "cover" };

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
    // suppressHydrationWarning: o script do tema muda data-theme antes da hidratacao.
    <html lang="pt-BR" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        {process.env.NODE_ENV !== "production" && <script dangerouslySetInnerHTML={{ __html: DEV_CSS_REFRESH }} />}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {families.map((family) => {
          const href = googleFontUrl(family);
          return href ? <link key={family} rel="stylesheet" href={href} /> : null;
        })}
      </head>
      <body className="min-h-full flex flex-col">
        <DocsShell nav={docsNav()} search={docsSearch()}>
          {children}
        </DocsShell>
      </body>
    </html>
  );
}

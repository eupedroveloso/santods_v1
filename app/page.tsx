import Link from "next/link";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { TokenDoc } from "@/lib/tokens/types";
import { Foundations } from "./_screens/foundations";
import { ApplicationScreen, CardsScreen, DashboardScreen } from "./_screens/showcase";
import { ThemeToggle } from "./_components/theme-toggle";
import { figmaSource } from "@/lib/tokens";

export default async function Home() {
  const doc: TokenDoc = JSON.parse(
    await readFile(join(process.cwd(), "tokens/santods.figma.json"), "utf8"),
  );
  const tokenCount = Object.values(doc.collections).reduce(
    (a, c) => a + Object.keys(c.variables).length,
    0,
  );

  return (
    <main
      className="mx-auto flex w-full flex-col gap-3xl px-lg py-3xl"
      style={{ maxWidth: "var(--santo-dimension-container-xl)" }}
    >
      <header className="flex flex-wrap items-end justify-between gap-md border-b-thin border-border-subtle pb-lg">
        <div className="flex flex-col gap-2xs">
          <h1 className="santo-heading-3-bold">SantoDS v1</h1>
          <p className="santo-body-regular text-text-secondary">
            {tokenCount} variáveis, {Object.keys(doc.textStyles).length} text styles e{" "}
            {Object.keys(doc.effectStyles).length} effect styles, em paridade verificada com{" "}
            <code className="santo-code-sm">{figmaSource.fileName}</code>.
          </p>
        </div>
        <div className="flex items-center gap-sm">
          <Link
            href="/componentes"
            className="santo-body-small-semibold rounded-md border-thin border-border-default px-md py-xs text-text-primary hover:bg-neutral-subtle-default"
          >
            Componentes
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <Foundations doc={doc} />

      <section className="flex flex-col gap-lg border-t-thin border-border-subtle pt-3xl">
        <h2 className="santo-heading-5-semibold">Componentes montados só com tokens</h2>
        <CardsScreen />
        <DashboardScreen />
        <ApplicationScreen />
      </section>

      <footer className="santo-caption-regular border-t-thin border-border-subtle pt-lg text-text-tertiary">
        {Object.entries(doc.collections)
          .map(([name, c]) => `${name} (${Object.keys(c.variables).length}, modos: ${c.modes.join("/")})`)
          .join(" · ")}
      </footer>
    </main>
  );
}

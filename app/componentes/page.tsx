import type { Metadata } from "next";
import Link from "next/link";
import { ComponentsDocs } from "./docs";

export const metadata: Metadata = {
  title: "Componentes · SantoDS",
  description: "Documentação viva da biblioteca de componentes do SantoDS.",
};

export default function ComponentesPage() {
  return (
    <main
      className="mx-auto flex w-full flex-col gap-3xl px-lg py-3xl"
      style={{ maxWidth: "var(--santo-dimension-container-xl)" }}
    >
      <header className="flex flex-col gap-sm border-b-thin border-border-subtle pb-lg">
        <nav className="santo-caption-regular flex items-center gap-2xs text-text-tertiary">
          <Link href="/" className="text-text-brand hover:underline">SantoDS</Link>
          <span>/</span>
          <span>Componentes</span>
        </nav>
        <h1 className="santo-heading-3-bold">Componentes</h1>
        <p className="santo-body-large-regular max-w-[60ch] text-text-secondary">
          Peças construídas só com tokens do Figma. Cada uma abaixo está viva — o que
          você vê é o componente real, no tema atual. Alterne o modo no topo da home.
        </p>
      </header>

      <ComponentsDocs />
    </main>
  );
}

import type { Metadata } from "next";
import { DocPage } from "../_docs/page-header";
import { ExampleViews } from "./views-nav";

export const metadata: Metadata = {
  title: "Exemplos",
  description: "O SantoDS em uso real: finanças, cartões, painel e aplicação montados só com tokens e componentes.",
};

export default function ExemplosPage() {
  return (
    <DocPage>
      <ExampleViews />
    </DocPage>
  );
}

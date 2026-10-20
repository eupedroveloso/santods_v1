import type { Metadata } from "next";
import { DocPage } from "../_docs/page-header";
import { ExampleViews } from "./views-nav";

export const metadata: Metadata = {
  title: "Exemplos",
  description: "O SantoDS em uso real: Dashboard e Landing Page, com o produto fictício Compasso, montados só com tokens e componentes.",
};

export default function ExemplosPage() {
  return (
    <DocPage layout="full">
      <ExampleViews />
    </DocPage>
  );
}

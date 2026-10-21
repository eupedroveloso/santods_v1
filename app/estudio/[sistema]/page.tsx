import { redirect } from "next/navigation";

/** /estudio/<sistema> abre no primeiro estilo. */
export default async function SistemaPage({ params }: PageProps<"/estudio/[sistema]">) {
  const { sistema } = await params;
  redirect(`/estudio/${encodeURIComponent(sistema)}/cor`);
}

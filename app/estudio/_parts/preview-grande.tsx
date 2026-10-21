"use client";

import { Card, Segmented } from "@/lib/ui";
import { AbrirEmAba, Aparelho, TEMAS } from "./claro-escuro";
import { LARGURAS, TELAS } from "./telas-dados";
import { useEscala, useIframesRascunho } from "./use-iframes-rascunho";
import type { Preferencia } from "./use-preferencia";

/**
 * Modo Preview do editor: UM iframe grande na coluna central inteira, num tema
 * só, com a barra fina de tela, tema, largura e aba nova. Cada mudança no
 * painel chega ao iframe na hora (postMessage), sem salvar. O aparelho cabe
 * pela escala (largura e altura); a moldura nasce do filho (xl + xs).
 */
export function PreviewGrande({
  css,
  fontes,
  sistema,
  pref,
  muda,
}: {
  css: string;
  fontes: string[];
  sistema: { id: string; slug: string };
  pref: Preferencia;
  muda: (p: Partial<Preferencia>) => void;
}) {
  const { registrar } = useIframesRascunho(css, fontes, `estudio:${sistema.id}`);
  const { caixa, medir } = useEscala();
  const aparelho = LARGURAS.find((l) => l.id === pref.largura)!;
  // Amostra ocupa a área inteira (rola dentro); telas cabem por escala, a altura
  // do iframe cresce para preencher a área já na escala.
  const amostra = pref.tela === "amostra";
  const escala = amostra || !caixa.largura ? 1 : Math.min(1, caixa.largura / aparelho.largura);
  const largura = amostra ? caixa.largura : aparelho.largura;
  const altura = caixa.altura ? caixa.altura / escala : aparelho.altura;

  return (
    <section aria-label="Preview" className="flex min-h-(--santo-dimension-space-512) min-w-0 flex-1 flex-col gap-sm">
      <div className="flex flex-wrap items-center gap-xs">
        <Segmented size="sm" value={pref.tela} onChange={(v) => muda({ tela: v })} options={TELAS.map((t) => ({ value: t.id, label: t.label }))} />
        <Segmented size="sm" value={pref.tema} onChange={(v) => muda({ tema: v })} options={TEMAS.map((t) => ({ value: t.id, label: t.label }))} />
        {!amostra && (
          <Segmented size="sm" value={pref.largura} onChange={(v) => muda({ largura: v })} options={LARGURAS.map((l) => ({ value: l.id, label: l.label }))} />
        )}
        <span className="ml-auto">
          <AbrirEmAba slug={sistema.slug} tela={pref.tela} />
        </span>
      </div>
      <Card variant="sunken" padding="xs" contentRadius="xl" className="min-h-0 flex-1">
        <div ref={medir} className="flex min-h-0 flex-1 justify-center">
          {caixa.largura > 0 && (
            <Aparelho
              tela={pref.tela}
              tema={pref.tema}
              largura={largura}
              altura={altura}
              escala={escala}
              registrar={registrar("grande")}
              rolar
            />
          )}
        </div>
      </Card>
    </section>
  );
}

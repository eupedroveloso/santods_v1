"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { Card, CodeBlock, Icon, IconButton } from "@/lib/ui";

/**
 * Bloco de demonstracao em borda dupla: o rotulo na moldura, o componente vivo
 * no painel interno e, se houver, o codigo no rodape da moldura (recolhido
 * atras de um botao so de icone). So rotulo — nunca paragrafo explicativo.
 * Variante numerosa nao vira grade exaustiva aqui: vai para um seletor no
 * playground, mostrando um exemplo por vez (diretriz do Pedro).
 */
export function DemoCard({
  id,
  title,
  code,
  codeTitle,
  layout = "center",
  children,
}: {
  /** Ancora da secao. */
  id?: string;
  title: string;
  /** Codigo de uso; liga o botao de codigo (so icone). */
  code?: string;
  /** Titulo da janela de codigo (nome do arquivo). */
  codeTitle?: string;
  /** `center` para peca isolada, `stretch` para algo que ocupa a largura. */
  layout?: "center" | "stretch";
  children: ReactNode;
}) {
  const [showCode, setShowCode] = useState(false);
  return (
    <section id={id} className="scroll-mt-6xl">
      <Card
        variant="double"
        padded={false}
        header={
          <div className="flex min-w-0 flex-1 items-center justify-between gap-sm">
            <h2 className="santo-body-small-semibold text-text-primary">{title}</h2>
            {code && (
              <IconButton
                size="sm"
                label={showCode ? "Esconder código" : "Mostrar código"}
                aria-expanded={showCode}
                onClick={() => setShowCode((s) => !s)}
              >
                <Icon.Code size={16} />
              </IconButton>
            )}
          </div>
        }
        footer={code && showCode ? <CodeBlock code={code} title={codeTitle} className="flex-1" /> : undefined}
      >
        <div
          className={`flex min-h-(--santo-dimension-space-192) min-w-0 flex-col justify-center p-xl ${
            layout === "center" ? "items-center" : "items-stretch"
          }`}
        >
          {children}
        </div>
      </Card>
    </section>
  );
}

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

# SantoDS

Dois agentes cuidam deste repositório. Use-os:

- **`figma-parity`** — qualquer coisa de token ou tema. Conhece o fluxo de
  sincronização com o Figma e os hashes de referência.
- **`santo-design`** — qualquer coisa de tela, componente ou aparência. Conhece o
  vocabulário de token e o padrão de qualidade.

Regras que não se negociam:

- **Nada em `lib/tokens/` é editado à mão.** São arquivos gerados. As exceções, que
  são código-fonte de verdade: `emit.mjs`, `types.ts` e os `.d.ts`.
- A fonte da verdade é `tokens/santods.figma.json`. Valor errado no CSS significa
  snapshot desatualizado (sincronize com o Figma) ou emissor com bug.
- `lib/tokens/emit.mjs` é o único caminho de renderização. Mexeu num emissor,
  mexeu no que o build inteiro produz.
- Componente de UI vive em `lib/ui/` e é documentado em `/componentes`. Antes de
  criar um componente, veja se ele já existe lá.
- **Nenhum valor solto** em código de interface: sem hex cru, sem `p-[13px]`,
  sem `rounded-[10px]`. `npm run design:check` cobra isso.
- Depois de mexer em token: `npm run tokens`.
- Depois de mexer em interface: `npm run design:check && npm run build`.

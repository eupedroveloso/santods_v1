# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

# SantoDS

Dois agentes cuidam deste repositório. Use-os:

- **`figma-parity`** — qualquer coisa de token, tema ou marca. Conhece o fluxo de
  sincronização com o Figma e os hashes de referência.
- **`santo-design`** — qualquer coisa de tela, componente ou aparência. Conhece o
  vocabulário de token e o padrão de qualidade.

Regras que não se negociam:

- **Nada em `lib/tokens/` é editado à mão.** São arquivos gerados. As exceções, que
  são código-fonte de verdade: `emit.mjs`, `brand.mjs`, `types.ts` e os `.d.ts`.
- A fonte da verdade é `tokens/santods.figma.json`. Valor errado no CSS significa
  snapshot desatualizado (sincronize com o Figma) ou emissor com bug.
- `lib/tokens/emit.mjs` é o único caminho de renderização: o build e o preview ao
  vivo do Studio chamam as mesmas funções. Mexeu num emissor, mexeu nos dois.
- Uma marca em `brands/` guarda **só overrides**. Nunca materialize os 345 tokens
  num arquivo de marca — isso mata a herança do Figma.
- **Primitives é fundação: intocável.** Um produto derivado muda *para onde* o
  apelido semântico aponta (`space/md` → `dimension/space/12`), nunca o degrau em
  si. `npm run brands:check` reprova override em Primitives. Ver `lib/tokens/layers.ts`.
- Componente de UI vive em `lib/ui/` e é documentado em `/componentes`. Antes de
  criar um componente, veja se ele já existe lá.
- **Nenhum valor solto** em código de interface: sem hex cru, sem `p-[13px]`,
  sem `rounded-[10px]`. `npm run design:check` cobra isso.
- Depois de mexer em token ou marca: `npm run tokens && npm run brands:check`.
- Depois de mexer em interface: `npm run design:check && npm run build`.

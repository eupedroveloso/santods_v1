/**
 * Script de ESCRITA para o MCP `use_figma`: NIVEL B do Estudio (tokens/ESTUDIO.contrato.md).
 *
 * Torna por marca o que hoje e global, sem mudar nenhum valor renderizado:
 *   - Brand ganha 56 variaveis: brand/family/heading, brand/shape/radius-<nivel>,
 *     brand/space/<nivel>, brand/type/<papel>/size|leading, brand/control/height/*,
 *     brand/shadow/<estilo>/<camada>. Santo e VTSD recebem EXATAMENTE os valores de
 *     hoje (os mesmos aliases/literais que a Semantic, os text styles e os effect
 *     styles usam), entao nada muda na tela.
 *   - Semantic: space/* e radius/* (menos none, md e full) passam a apontar para
 *     brand/*; nasce control/height/sm|md|lg.
 *   - Text styles: os 11 papeis ligam fontSize/lineHeight em brand/type/*; os
 *     heading-* ligam fontFamily em brand/family/heading. code/* nao muda.
 *   - Effect styles: a cor de cada camada liga em brand/shadow/<estilo>/<n>.
 *   - Efeitos (2026-10-21): brand/effect/*, brand/glass/*, brand/gradient/brand/*; Semantic effect/*,
 *     glass/*, gradient/*; Color glass/{surface,border,highlight}; effect styles novos glass/{sm,md,lg}
 *     (background blur), blur/{sm,md} (layer blur) e glow/{brand,neutral} (sombra colorida).
 *   - Superficies (2026-10-21): Brand ganha brand/surface/<page|raised|sunken|well|panel|overlay>/<light|dark>,
 *     brand/border/<subtle|default|strong>/<light|dark> e a moldura (brand/frame/inset, enabled,
 *     border/<light|dark>); Color: surface/* e border/* apontam para elas, e nascem surface/well,
 *     surface/panel, frame/surface e frame/border; Semantic: frame/inset e frame/enabled.
 *
 * Fluxo (ver .claude/agents/figma-parity.md):
 *   1. Cole este arquivo no `use_figma` com DRY_RUN = true: so lista o plano e
 *      valida (colecoes, modos, alvos de alias, fontes dos headings).
 *   2. Plano aprovado: DRY_RUN = false e rode de novo. E idempotente.
 *   3. scripts/figma-dump.js -> node scripts/check-parity.mjs <dump> --write -> npm run tokens.
 *
 * FONTE UNICA: scripts/figma-nivel-b-apply.mjs le NIVEL_B deste arquivo para aplicar
 * o mesmo ao snapshot (excecao autorizada pelo maestro em 2026-10-21, Figma read-only).
 * Mantenha NIVEL_B como literal puro.
 */
const DRY_RUN = true;

/* Gerado do snapshot em 2026-10-21 (valores de hoje em Santo e VTSD). */
const NIVEL_B = {
  "Brand": {
    "brand/family/heading": {
      "type": "STRING",
      "scopes": [
        "FONT_FAMILY"
      ],
      "description": "Família dos títulos (heading-1 a heading-6). Igual à sans quando a marca não separa título de corpo. No Estúdio: qualquer família do Google Fonts (lib/fonts/google-index.json).",
      "values": {
        "Santo": "Albert Sans",
        "VTSD": "Sora"
      }
    },
    "brand/shape/radius-xs": {
      "type": "FLOAT",
      "scopes": [
        "CORNER_RADIUS"
      ],
      "description": "Raio xs da marca. No Estúdio: base × fator do nível.",
      "values": {
        "Santo": "{dimension/radius/4}",
        "VTSD": "{dimension/radius/4}"
      }
    },
    "brand/shape/radius-sm": {
      "type": "FLOAT",
      "scopes": [
        "CORNER_RADIUS"
      ],
      "description": "Raio sm da marca. No Estúdio: base × fator do nível.",
      "values": {
        "Santo": "{dimension/radius/8}",
        "VTSD": "{dimension/radius/8}"
      }
    },
    "brand/shape/radius-lg": {
      "type": "FLOAT",
      "scopes": [
        "CORNER_RADIUS"
      ],
      "description": "Raio lg da marca. No Estúdio: base × fator do nível.",
      "values": {
        "Santo": "{dimension/radius/12}",
        "VTSD": "{dimension/radius/12}"
      }
    },
    "brand/shape/radius-xl": {
      "type": "FLOAT",
      "scopes": [
        "CORNER_RADIUS"
      ],
      "description": "Raio xl da marca. No Estúdio: base × fator do nível.",
      "values": {
        "Santo": "{dimension/radius/16}",
        "VTSD": "{dimension/radius/16}"
      }
    },
    "brand/shape/radius-2xl": {
      "type": "FLOAT",
      "scopes": [
        "CORNER_RADIUS"
      ],
      "description": "Raio 2xl da marca. No Estúdio: base × fator do nível.",
      "values": {
        "Santo": "{dimension/radius/24}",
        "VTSD": "{dimension/radius/24}"
      }
    },
    "brand/shape/radius-3xl": {
      "type": "FLOAT",
      "scopes": [
        "CORNER_RADIUS"
      ],
      "description": "Raio 3xl da marca. No Estúdio: base × fator do nível.",
      "values": {
        "Santo": "{dimension/radius/32}",
        "VTSD": "{dimension/radius/32}"
      }
    },
    "brand/space/3xs": {
      "type": "FLOAT",
      "scopes": [
        "WIDTH_HEIGHT",
        "GAP"
      ],
      "description": "Espaço 3xs da marca. No Estúdio: unidade × fator do nível.",
      "values": {
        "Santo": "{dimension/space/2}",
        "VTSD": "{dimension/space/2}"
      }
    },
    "brand/space/2xs": {
      "type": "FLOAT",
      "scopes": [
        "WIDTH_HEIGHT",
        "GAP"
      ],
      "description": "Espaço 2xs da marca. No Estúdio: unidade × fator do nível.",
      "values": {
        "Santo": "{dimension/space/4}",
        "VTSD": "{dimension/space/4}"
      }
    },
    "brand/space/xs": {
      "type": "FLOAT",
      "scopes": [
        "WIDTH_HEIGHT",
        "GAP"
      ],
      "description": "Espaço xs da marca. No Estúdio: unidade × fator do nível.",
      "values": {
        "Santo": "{dimension/space/8}",
        "VTSD": "{dimension/space/8}"
      }
    },
    "brand/space/sm": {
      "type": "FLOAT",
      "scopes": [
        "WIDTH_HEIGHT",
        "GAP"
      ],
      "description": "Espaço sm da marca. No Estúdio: unidade × fator do nível.",
      "values": {
        "Santo": "{dimension/space/12}",
        "VTSD": "{dimension/space/12}"
      }
    },
    "brand/space/md": {
      "type": "FLOAT",
      "scopes": [
        "WIDTH_HEIGHT",
        "GAP"
      ],
      "description": "Espaço md da marca. No Estúdio: unidade × fator do nível.",
      "values": {
        "Santo": "{dimension/space/16}",
        "VTSD": "{dimension/space/16}"
      }
    },
    "brand/space/lg": {
      "type": "FLOAT",
      "scopes": [
        "WIDTH_HEIGHT",
        "GAP"
      ],
      "description": "Espaço lg da marca. No Estúdio: unidade × fator do nível.",
      "values": {
        "Santo": "{dimension/space/24}",
        "VTSD": "{dimension/space/24}"
      }
    },
    "brand/space/xl": {
      "type": "FLOAT",
      "scopes": [
        "WIDTH_HEIGHT",
        "GAP"
      ],
      "description": "Espaço xl da marca. No Estúdio: unidade × fator do nível.",
      "values": {
        "Santo": "{dimension/space/32}",
        "VTSD": "{dimension/space/32}"
      }
    },
    "brand/space/2xl": {
      "type": "FLOAT",
      "scopes": [
        "WIDTH_HEIGHT",
        "GAP"
      ],
      "description": "Espaço 2xl da marca. No Estúdio: unidade × fator do nível.",
      "values": {
        "Santo": "{dimension/space/40}",
        "VTSD": "{dimension/space/40}"
      }
    },
    "brand/space/3xl": {
      "type": "FLOAT",
      "scopes": [
        "WIDTH_HEIGHT",
        "GAP"
      ],
      "description": "Espaço 3xl da marca. No Estúdio: unidade × fator do nível.",
      "values": {
        "Santo": "{dimension/space/48}",
        "VTSD": "{dimension/space/48}"
      }
    },
    "brand/space/4xl": {
      "type": "FLOAT",
      "scopes": [
        "WIDTH_HEIGHT",
        "GAP"
      ],
      "description": "Espaço 4xl da marca. No Estúdio: unidade × fator do nível.",
      "values": {
        "Santo": "{dimension/space/64}",
        "VTSD": "{dimension/space/64}"
      }
    },
    "brand/space/5xl": {
      "type": "FLOAT",
      "scopes": [
        "WIDTH_HEIGHT",
        "GAP"
      ],
      "description": "Espaço 5xl da marca. No Estúdio: unidade × fator do nível.",
      "values": {
        "Santo": "{dimension/space/80}",
        "VTSD": "{dimension/space/80}"
      }
    },
    "brand/space/6xl": {
      "type": "FLOAT",
      "scopes": [
        "WIDTH_HEIGHT",
        "GAP"
      ],
      "description": "Espaço 6xl da marca. No Estúdio: unidade × fator do nível.",
      "values": {
        "Santo": "{dimension/space/96}",
        "VTSD": "{dimension/space/96}"
      }
    },
    "brand/space/7xl": {
      "type": "FLOAT",
      "scopes": [
        "WIDTH_HEIGHT",
        "GAP"
      ],
      "description": "Espaço 7xl da marca. No Estúdio: unidade × fator do nível.",
      "values": {
        "Santo": "{dimension/space/128}",
        "VTSD": "{dimension/space/128}"
      }
    },
    "brand/space/8xl": {
      "type": "FLOAT",
      "scopes": [
        "WIDTH_HEIGHT",
        "GAP"
      ],
      "description": "Espaço 8xl da marca. No Estúdio: unidade × fator do nível.",
      "values": {
        "Santo": "{dimension/space/192}",
        "VTSD": "{dimension/space/192}"
      }
    },
    "brand/type/heading-1/size": {
      "type": "FLOAT",
      "scopes": [
        "FONT_SIZE"
      ],
      "description": "Tamanho do papel heading-1.",
      "values": {
        "Santo": "{type/size/72}",
        "VTSD": "{type/size/72}"
      }
    },
    "brand/type/heading-1/leading": {
      "type": "FLOAT",
      "scopes": [
        "LINE_HEIGHT"
      ],
      "description": "Entrelinha do papel heading-1.",
      "values": {
        "Santo": "{type/leading/80}",
        "VTSD": "{type/leading/80}"
      }
    },
    "brand/type/heading-2/size": {
      "type": "FLOAT",
      "scopes": [
        "FONT_SIZE"
      ],
      "description": "Tamanho do papel heading-2.",
      "values": {
        "Santo": "{type/size/60}",
        "VTSD": "{type/size/60}"
      }
    },
    "brand/type/heading-2/leading": {
      "type": "FLOAT",
      "scopes": [
        "LINE_HEIGHT"
      ],
      "description": "Entrelinha do papel heading-2.",
      "values": {
        "Santo": "{type/leading/72}",
        "VTSD": "{type/leading/72}"
      }
    },
    "brand/type/heading-3/size": {
      "type": "FLOAT",
      "scopes": [
        "FONT_SIZE"
      ],
      "description": "Tamanho do papel heading-3.",
      "values": {
        "Santo": "{type/size/48}",
        "VTSD": "{type/size/48}"
      }
    },
    "brand/type/heading-3/leading": {
      "type": "FLOAT",
      "scopes": [
        "LINE_HEIGHT"
      ],
      "description": "Entrelinha do papel heading-3.",
      "values": {
        "Santo": "{type/leading/56}",
        "VTSD": "{type/leading/56}"
      }
    },
    "brand/type/heading-4/size": {
      "type": "FLOAT",
      "scopes": [
        "FONT_SIZE"
      ],
      "description": "Tamanho do papel heading-4.",
      "values": {
        "Santo": "{type/size/36}",
        "VTSD": "{type/size/36}"
      }
    },
    "brand/type/heading-4/leading": {
      "type": "FLOAT",
      "scopes": [
        "LINE_HEIGHT"
      ],
      "description": "Entrelinha do papel heading-4.",
      "values": {
        "Santo": "{type/leading/44}",
        "VTSD": "{type/leading/44}"
      }
    },
    "brand/type/heading-5/size": {
      "type": "FLOAT",
      "scopes": [
        "FONT_SIZE"
      ],
      "description": "Tamanho do papel heading-5.",
      "values": {
        "Santo": "{type/size/30}",
        "VTSD": "{type/size/30}"
      }
    },
    "brand/type/heading-5/leading": {
      "type": "FLOAT",
      "scopes": [
        "LINE_HEIGHT"
      ],
      "description": "Entrelinha do papel heading-5.",
      "values": {
        "Santo": "{type/leading/38}",
        "VTSD": "{type/leading/38}"
      }
    },
    "brand/type/heading-6/size": {
      "type": "FLOAT",
      "scopes": [
        "FONT_SIZE"
      ],
      "description": "Tamanho do papel heading-6.",
      "values": {
        "Santo": "{type/size/24}",
        "VTSD": "{type/size/24}"
      }
    },
    "brand/type/heading-6/leading": {
      "type": "FLOAT",
      "scopes": [
        "LINE_HEIGHT"
      ],
      "description": "Entrelinha do papel heading-6.",
      "values": {
        "Santo": "{type/leading/32}",
        "VTSD": "{type/leading/32}"
      }
    },
    "brand/type/body-large/size": {
      "type": "FLOAT",
      "scopes": [
        "FONT_SIZE"
      ],
      "description": "Tamanho do papel body-large.",
      "values": {
        "Santo": "{type/size/18}",
        "VTSD": "{type/size/18}"
      }
    },
    "brand/type/body-large/leading": {
      "type": "FLOAT",
      "scopes": [
        "LINE_HEIGHT"
      ],
      "description": "Entrelinha do papel body-large.",
      "values": {
        "Santo": "{type/leading/28}",
        "VTSD": "{type/leading/28}"
      }
    },
    "brand/type/body/size": {
      "type": "FLOAT",
      "scopes": [
        "FONT_SIZE"
      ],
      "description": "Tamanho do papel body.",
      "values": {
        "Santo": "{type/size/16}",
        "VTSD": "{type/size/16}"
      }
    },
    "brand/type/body/leading": {
      "type": "FLOAT",
      "scopes": [
        "LINE_HEIGHT"
      ],
      "description": "Entrelinha do papel body.",
      "values": {
        "Santo": "{type/leading/24}",
        "VTSD": "{type/leading/24}"
      }
    },
    "brand/type/body-small/size": {
      "type": "FLOAT",
      "scopes": [
        "FONT_SIZE"
      ],
      "description": "Tamanho do papel body-small.",
      "values": {
        "Santo": "{type/size/14}",
        "VTSD": "{type/size/14}"
      }
    },
    "brand/type/body-small/leading": {
      "type": "FLOAT",
      "scopes": [
        "LINE_HEIGHT"
      ],
      "description": "Entrelinha do papel body-small.",
      "values": {
        "Santo": "{type/leading/20}",
        "VTSD": "{type/leading/20}"
      }
    },
    "brand/type/caption/size": {
      "type": "FLOAT",
      "scopes": [
        "FONT_SIZE"
      ],
      "description": "Tamanho do papel caption.",
      "values": {
        "Santo": "{type/size/12}",
        "VTSD": "{type/size/12}"
      }
    },
    "brand/type/caption/leading": {
      "type": "FLOAT",
      "scopes": [
        "LINE_HEIGHT"
      ],
      "description": "Entrelinha do papel caption.",
      "values": {
        "Santo": "{type/leading/16}",
        "VTSD": "{type/leading/16}"
      }
    },
    "brand/type/caption-small/size": {
      "type": "FLOAT",
      "scopes": [
        "FONT_SIZE"
      ],
      "description": "Tamanho do papel caption-small.",
      "values": {
        "Santo": "{type/size/10}",
        "VTSD": "{type/size/10}"
      }
    },
    "brand/type/caption-small/leading": {
      "type": "FLOAT",
      "scopes": [
        "LINE_HEIGHT"
      ],
      "description": "Entrelinha do papel caption-small.",
      "values": {
        "Santo": "{type/leading/16}",
        "VTSD": "{type/leading/16}"
      }
    },
    "brand/control/height/sm": {
      "type": "FLOAT",
      "scopes": [
        "WIDTH_HEIGHT"
      ],
      "description": "Altura de controle sm (botão, campo, seletor).",
      "values": {
        "Santo": "{dimension/size/32}",
        "VTSD": "{dimension/size/32}"
      }
    },
    "brand/control/height/md": {
      "type": "FLOAT",
      "scopes": [
        "WIDTH_HEIGHT"
      ],
      "description": "Altura de controle md (botão, campo, seletor).",
      "values": {
        "Santo": "{dimension/size/40}",
        "VTSD": "{dimension/size/40}"
      }
    },
    "brand/control/height/lg": {
      "type": "FLOAT",
      "scopes": [
        "WIDTH_HEIGHT"
      ],
      "description": "Altura de controle lg (botão, campo, seletor).",
      "values": {
        "Santo": "{dimension/size/48}",
        "VTSD": "{dimension/size/48}"
      }
    },
    "brand/shadow/xs/1": {
      "type": "COLOR",
      "scopes": [
        "EFFECT_COLOR"
      ],
      "description": "Cor da camada 1 da sombra xs. No Estúdio: tinta × alfa × intensidade.",
      "values": {
        "Santo": "#100d1614",
        "VTSD": "#100d1614"
      }
    },
    "brand/shadow/sm/1": {
      "type": "COLOR",
      "scopes": [
        "EFFECT_COLOR"
      ],
      "description": "Cor da camada 1 da sombra sm. No Estúdio: tinta × alfa × intensidade.",
      "values": {
        "Santo": "#100d1614",
        "VTSD": "#100d1614"
      }
    },
    "brand/shadow/sm/2": {
      "type": "COLOR",
      "scopes": [
        "EFFECT_COLOR"
      ],
      "description": "Cor da camada 2 da sombra sm. No Estúdio: tinta × alfa × intensidade.",
      "values": {
        "Santo": "#100d160f",
        "VTSD": "#100d160f"
      }
    },
    "brand/shadow/md/1": {
      "type": "COLOR",
      "scopes": [
        "EFFECT_COLOR"
      ],
      "description": "Cor da camada 1 da sombra md. No Estúdio: tinta × alfa × intensidade.",
      "values": {
        "Santo": "#100d1614",
        "VTSD": "#100d1614"
      }
    },
    "brand/shadow/md/2": {
      "type": "COLOR",
      "scopes": [
        "EFFECT_COLOR"
      ],
      "description": "Cor da camada 2 da sombra md. No Estúdio: tinta × alfa × intensidade.",
      "values": {
        "Santo": "#100d160f",
        "VTSD": "#100d160f"
      }
    },
    "brand/shadow/lg/1": {
      "type": "COLOR",
      "scopes": [
        "EFFECT_COLOR"
      ],
      "description": "Cor da camada 1 da sombra lg. No Estúdio: tinta × alfa × intensidade.",
      "values": {
        "Santo": "#100d1617",
        "VTSD": "#100d1617"
      }
    },
    "brand/shadow/lg/2": {
      "type": "COLOR",
      "scopes": [
        "EFFECT_COLOR"
      ],
      "description": "Cor da camada 2 da sombra lg. No Estúdio: tinta × alfa × intensidade.",
      "values": {
        "Santo": "#100d160f",
        "VTSD": "#100d160f"
      }
    },
    "brand/shadow/xl/1": {
      "type": "COLOR",
      "scopes": [
        "EFFECT_COLOR"
      ],
      "description": "Cor da camada 1 da sombra xl. No Estúdio: tinta × alfa × intensidade.",
      "values": {
        "Santo": "#100d161a",
        "VTSD": "#100d161a"
      }
    },
    "brand/shadow/xl/2": {
      "type": "COLOR",
      "scopes": [
        "EFFECT_COLOR"
      ],
      "description": "Cor da camada 2 da sombra xl. No Estúdio: tinta × alfa × intensidade.",
      "values": {
        "Santo": "#100d160f",
        "VTSD": "#100d160f"
      }
    },
    "brand/shadow/2xl/1": {
      "type": "COLOR",
      "scopes": [
        "EFFECT_COLOR"
      ],
      "description": "Cor da camada 1 da sombra 2xl. No Estúdio: tinta × alfa × intensidade.",
      "values": {
        "Santo": "#100d161f",
        "VTSD": "#100d161f"
      }
    },
    "brand/surface/page/light": {
      "type": "COLOR",
      "scopes": [
        "FRAME_FILL",
        "SHAPE_FILL"
      ],
      "description": "Superfície page no tema claro. No Estúdio: degrau da rampa neutral (profundidade por tom).",
      "values": {
        "Santo": "{palette/neutral/50}",
        "VTSD": "{palette/neutral/50}"
      }
    },
    "brand/surface/page/dark": {
      "type": "COLOR",
      "scopes": [
        "FRAME_FILL",
        "SHAPE_FILL"
      ],
      "description": "Superfície page no tema escuro. No Estúdio: degrau da rampa neutral (profundidade por tom).",
      "values": {
        "Santo": "{palette/neutral/950}",
        "VTSD": "{palette/neutral/950}"
      }
    },
    "brand/surface/raised/light": {
      "type": "COLOR",
      "scopes": [
        "FRAME_FILL",
        "SHAPE_FILL"
      ],
      "description": "Superfície raised no tema claro. No Estúdio: degrau da rampa neutral (profundidade por tom).",
      "values": {
        "Santo": "{palette/neutral/0}",
        "VTSD": "{palette/neutral/0}"
      }
    },
    "brand/surface/raised/dark": {
      "type": "COLOR",
      "scopes": [
        "FRAME_FILL",
        "SHAPE_FILL"
      ],
      "description": "Superfície raised no tema escuro. No Estúdio: degrau da rampa neutral (profundidade por tom).",
      "values": {
        "Santo": "{palette/neutral/900}",
        "VTSD": "{palette/neutral/900}"
      }
    },
    "brand/surface/sunken/light": {
      "type": "COLOR",
      "scopes": [
        "FRAME_FILL",
        "SHAPE_FILL"
      ],
      "description": "Superfície sunken no tema claro. No Estúdio: degrau da rampa neutral (profundidade por tom).",
      "values": {
        "Santo": "{palette/neutral/100}",
        "VTSD": "{palette/neutral/100}"
      }
    },
    "brand/surface/sunken/dark": {
      "type": "COLOR",
      "scopes": [
        "FRAME_FILL",
        "SHAPE_FILL"
      ],
      "description": "Superfície sunken no tema escuro. No Estúdio: degrau da rampa neutral (profundidade por tom).",
      "values": {
        "Santo": "{palette/neutral/1000}",
        "VTSD": "{palette/neutral/1000}"
      }
    },
    "brand/surface/well/light": {
      "type": "COLOR",
      "scopes": [
        "FRAME_FILL",
        "SHAPE_FILL"
      ],
      "description": "Superfície well no tema claro. No Estúdio: degrau da rampa neutral (profundidade por tom).",
      "values": {
        "Santo": "{palette/neutral/100}",
        "VTSD": "{palette/neutral/100}"
      }
    },
    "brand/surface/well/dark": {
      "type": "COLOR",
      "scopes": [
        "FRAME_FILL",
        "SHAPE_FILL"
      ],
      "description": "Superfície well no tema escuro. No Estúdio: degrau da rampa neutral (profundidade por tom).",
      "values": {
        "Santo": "{palette/neutral/1000}",
        "VTSD": "{palette/neutral/1000}"
      }
    },
    "brand/surface/panel/light": {
      "type": "COLOR",
      "scopes": [
        "FRAME_FILL",
        "SHAPE_FILL"
      ],
      "description": "Superfície panel no tema claro. No Estúdio: degrau da rampa neutral (profundidade por tom).",
      "values": {
        "Santo": "{palette/neutral/0}",
        "VTSD": "{palette/neutral/0}"
      }
    },
    "brand/surface/panel/dark": {
      "type": "COLOR",
      "scopes": [
        "FRAME_FILL",
        "SHAPE_FILL"
      ],
      "description": "Superfície panel no tema escuro. No Estúdio: degrau da rampa neutral (profundidade por tom).",
      "values": {
        "Santo": "{palette/neutral/900}",
        "VTSD": "{palette/neutral/900}"
      }
    },
    "brand/surface/overlay/light": {
      "type": "COLOR",
      "scopes": [
        "FRAME_FILL",
        "SHAPE_FILL"
      ],
      "description": "Superfície overlay no tema claro. No Estúdio: degrau da rampa neutral (profundidade por tom).",
      "values": {
        "Santo": "#100d1699",
        "VTSD": "#100d1699"
      }
    },
    "brand/surface/overlay/dark": {
      "type": "COLOR",
      "scopes": [
        "FRAME_FILL",
        "SHAPE_FILL"
      ],
      "description": "Superfície overlay no tema escuro. No Estúdio: degrau da rampa neutral (profundidade por tom).",
      "values": {
        "Santo": "#000000b8",
        "VTSD": "#000000b8"
      }
    },
    "brand/border/subtle/light": {
      "type": "COLOR",
      "scopes": [
        "STROKE_COLOR"
      ],
      "description": "Borda subtle no tema claro. No Estúdio: degrau da rampa neutral.",
      "values": {
        "Santo": "{palette/neutral/200}",
        "VTSD": "{palette/neutral/200}"
      }
    },
    "brand/border/subtle/dark": {
      "type": "COLOR",
      "scopes": [
        "STROKE_COLOR"
      ],
      "description": "Borda subtle no tema escuro. No Estúdio: degrau da rampa neutral.",
      "values": {
        "Santo": "{palette/neutral/800}",
        "VTSD": "{palette/neutral/800}"
      }
    },
    "brand/border/default/light": {
      "type": "COLOR",
      "scopes": [
        "STROKE_COLOR"
      ],
      "description": "Borda default no tema claro. No Estúdio: degrau da rampa neutral.",
      "values": {
        "Santo": "{palette/neutral/300}",
        "VTSD": "{palette/neutral/300}"
      }
    },
    "brand/border/default/dark": {
      "type": "COLOR",
      "scopes": [
        "STROKE_COLOR"
      ],
      "description": "Borda default no tema escuro. No Estúdio: degrau da rampa neutral.",
      "values": {
        "Santo": "{palette/neutral/700}",
        "VTSD": "{palette/neutral/700}"
      }
    },
    "brand/border/strong/light": {
      "type": "COLOR",
      "scopes": [
        "STROKE_COLOR"
      ],
      "description": "Borda strong no tema claro. No Estúdio: degrau da rampa neutral.",
      "values": {
        "Santo": "{palette/neutral/400}",
        "VTSD": "{palette/neutral/400}"
      }
    },
    "brand/border/strong/dark": {
      "type": "COLOR",
      "scopes": [
        "STROKE_COLOR"
      ],
      "description": "Borda strong no tema escuro. No Estúdio: degrau da rampa neutral.",
      "values": {
        "Santo": "{palette/neutral/600}",
        "VTSD": "{palette/neutral/600}"
      }
    },
    "brand/frame/inset": {
      "type": "FLOAT",
      "scopes": [
        "GAP"
      ],
      "description": "Recuo da moldura da borda dupla (degrau de espaço da marca).",
      "values": {
        "Santo": "{brand/space/xs}",
        "VTSD": "{brand/space/xs}"
      }
    },
    "brand/frame/enabled": {
      "type": "FLOAT",
      "scopes": [],
      "description": "Borda dupla ligada (1) ou desligada (0) no Design System da marca.",
      "values": {
        "Santo": 1,
        "VTSD": 1
      }
    },
    "brand/frame/border/light": {
      "type": "COLOR",
      "scopes": [
        "STROKE_COLOR"
      ],
      "description": "Borda interna da borda dupla, tema claro (transparente = só o tom separa).",
      "values": {
        "Santo": "#00000000",
        "VTSD": "#00000000"
      }
    },
    "brand/frame/border/dark": {
      "type": "COLOR",
      "scopes": [
        "STROKE_COLOR"
      ],
      "description": "Borda interna da borda dupla, tema escuro.",
      "values": {
        "Santo": "{palette/neutral/800}",
        "VTSD": "{palette/neutral/800}"
      }
    },
    "brand/shape/radius-control": {
      "type": "FLOAT",
      "scopes": [
        "CORNER_RADIUS"
      ],
      "description": "Base do raio de CONTROLE (botão, campo, chip), independente do raio de container (radius-base).",
      "values": {
        "Santo": "{dimension/radius/8}",
        "VTSD": "{dimension/radius/8}"
      }
    },
    "brand/control/padding-x/sm": {
      "type": "FLOAT",
      "scopes": [
        "GAP"
      ],
      "description": "Padding horizontal do controle sm.",
      "values": {
        "Santo": "{brand/space/sm}",
        "VTSD": "{brand/space/sm}"
      }
    },
    "brand/control/padding-x/md": {
      "type": "FLOAT",
      "scopes": [
        "GAP"
      ],
      "description": "Padding horizontal do controle md.",
      "values": {
        "Santo": "{brand/space/md}",
        "VTSD": "{brand/space/md}"
      }
    },
    "brand/control/padding-x/lg": {
      "type": "FLOAT",
      "scopes": [
        "GAP"
      ],
      "description": "Padding horizontal do controle lg.",
      "values": {
        "Santo": "{brand/space/lg}",
        "VTSD": "{brand/space/lg}"
      }
    },
    "brand/control/radius/sm": {
      "type": "FLOAT",
      "scopes": [
        "CORNER_RADIUS"
      ],
      "description": "Raio do controle sm.",
      "values": {
        "Santo": "{brand/shape/radius-control}",
        "VTSD": "{brand/shape/radius-control}"
      }
    },
    "brand/control/radius/md": {
      "type": "FLOAT",
      "scopes": [
        "CORNER_RADIUS"
      ],
      "description": "Raio do controle md.",
      "values": {
        "Santo": "{brand/shape/radius-control}",
        "VTSD": "{brand/shape/radius-control}"
      }
    },
    "brand/control/radius/lg": {
      "type": "FLOAT",
      "scopes": [
        "CORNER_RADIUS"
      ],
      "description": "Raio do controle lg.",
      "values": {
        "Santo": "{brand/shape/radius-control}",
        "VTSD": "{brand/shape/radius-control}"
      }
    },
    "brand/control/border/sm": {
      "type": "FLOAT",
      "scopes": [
        "STROKE_FLOAT"
      ],
      "description": "Espessura da borda do controle sm (variantes com contorno).",
      "values": {
        "Santo": "{dimension/border/1}",
        "VTSD": "{dimension/border/1}"
      }
    },
    "brand/control/border/md": {
      "type": "FLOAT",
      "scopes": [
        "STROKE_FLOAT"
      ],
      "description": "Espessura da borda do controle md (variantes com contorno).",
      "values": {
        "Santo": "{dimension/border/1}",
        "VTSD": "{dimension/border/1}"
      }
    },
    "brand/control/border/lg": {
      "type": "FLOAT",
      "scopes": [
        "STROKE_FLOAT"
      ],
      "description": "Espessura da borda do controle lg (variantes com contorno).",
      "values": {
        "Santo": "{dimension/border/1}",
        "VTSD": "{dimension/border/1}"
      }
    },
    "brand/control/font/sm": {
      "type": "FLOAT",
      "scopes": [
        "FONT_SIZE"
      ],
      "description": "Tamanho de fonte do rótulo do controle sm.",
      "values": {
        "Santo": "{brand/type/caption/size}",
        "VTSD": "{brand/type/caption/size}"
      }
    },
    "brand/control/font/md": {
      "type": "FLOAT",
      "scopes": [
        "FONT_SIZE"
      ],
      "description": "Tamanho de fonte do rótulo do controle md.",
      "values": {
        "Santo": "{brand/type/body-small/size}",
        "VTSD": "{brand/type/body-small/size}"
      }
    },
    "brand/control/font/lg": {
      "type": "FLOAT",
      "scopes": [
        "FONT_SIZE"
      ],
      "description": "Tamanho de fonte do rótulo do controle lg.",
      "values": {
        "Santo": "{brand/type/body/size}",
        "VTSD": "{brand/type/body/size}"
      }
    },
    "brand/control/icon/sm": {
      "type": "FLOAT",
      "scopes": [
        "WIDTH_HEIGHT"
      ],
      "description": "Tamanho do ícone dentro do controle sm.",
      "values": {
        "Santo": "{dimension/icon/16}",
        "VTSD": "{dimension/icon/16}"
      }
    },
    "brand/control/icon/md": {
      "type": "FLOAT",
      "scopes": [
        "WIDTH_HEIGHT"
      ],
      "description": "Tamanho do ícone dentro do controle md.",
      "values": {
        "Santo": "{dimension/icon/16}",
        "VTSD": "{dimension/icon/16}"
      }
    },
    "brand/control/icon/lg": {
      "type": "FLOAT",
      "scopes": [
        "WIDTH_HEIGHT"
      ],
      "description": "Tamanho do ícone dentro do controle lg.",
      "values": {
        "Santo": "{dimension/icon/16}",
        "VTSD": "{dimension/icon/16}"
      }
    },
    "brand/control/gap/sm": {
      "type": "FLOAT",
      "scopes": [
        "GAP"
      ],
      "description": "Distância ícone-texto no controle sm.",
      "values": {
        "Santo": "{brand/space/2xs}",
        "VTSD": "{brand/space/2xs}"
      }
    },
    "brand/control/gap/md": {
      "type": "FLOAT",
      "scopes": [
        "GAP"
      ],
      "description": "Distância ícone-texto no controle md.",
      "values": {
        "Santo": "{brand/space/xs}",
        "VTSD": "{brand/space/xs}"
      }
    },
    "brand/control/gap/lg": {
      "type": "FLOAT",
      "scopes": [
        "GAP"
      ],
      "description": "Distância ícone-texto no controle lg.",
      "values": {
        "Santo": "{brand/space/xs}",
        "VTSD": "{brand/space/xs}"
      }
    },
    "brand/type/heading-1/tracking": {
      "type": "FLOAT",
      "scopes": [
        "LETTER_SPACING"
      ],
      "description": "Tracking do papel heading-1 (% do tamanho).",
      "values": {
        "Santo": "{type/tracking/tighter}",
        "VTSD": "{type/tracking/tighter}"
      }
    },
    "brand/type/heading-2/tracking": {
      "type": "FLOAT",
      "scopes": [
        "LETTER_SPACING"
      ],
      "description": "Tracking do papel heading-2 (% do tamanho).",
      "values": {
        "Santo": "{type/tracking/tighter}",
        "VTSD": "{type/tracking/tighter}"
      }
    },
    "brand/type/heading-3/tracking": {
      "type": "FLOAT",
      "scopes": [
        "LETTER_SPACING"
      ],
      "description": "Tracking do papel heading-3 (% do tamanho).",
      "values": {
        "Santo": "{type/tracking/tight}",
        "VTSD": "{type/tracking/tight}"
      }
    },
    "brand/type/heading-4/tracking": {
      "type": "FLOAT",
      "scopes": [
        "LETTER_SPACING"
      ],
      "description": "Tracking do papel heading-4 (% do tamanho).",
      "values": {
        "Santo": "{type/tracking/tight}",
        "VTSD": "{type/tracking/tight}"
      }
    },
    "brand/type/heading-5/tracking": {
      "type": "FLOAT",
      "scopes": [
        "LETTER_SPACING"
      ],
      "description": "Tracking do papel heading-5 (% do tamanho).",
      "values": {
        "Santo": "{type/tracking/snug}",
        "VTSD": "{type/tracking/snug}"
      }
    },
    "brand/type/heading-6/tracking": {
      "type": "FLOAT",
      "scopes": [
        "LETTER_SPACING"
      ],
      "description": "Tracking do papel heading-6 (% do tamanho).",
      "values": {
        "Santo": "{type/tracking/snug}",
        "VTSD": "{type/tracking/snug}"
      }
    },
    "brand/type/body-large/tracking": {
      "type": "FLOAT",
      "scopes": [
        "LETTER_SPACING"
      ],
      "description": "Tracking do papel body-large (% do tamanho).",
      "values": {
        "Santo": "{type/tracking/normal}",
        "VTSD": "{type/tracking/normal}"
      }
    },
    "brand/type/body/tracking": {
      "type": "FLOAT",
      "scopes": [
        "LETTER_SPACING"
      ],
      "description": "Tracking do papel body (% do tamanho).",
      "values": {
        "Santo": "{type/tracking/normal}",
        "VTSD": "{type/tracking/normal}"
      }
    },
    "brand/type/body-small/tracking": {
      "type": "FLOAT",
      "scopes": [
        "LETTER_SPACING"
      ],
      "description": "Tracking do papel body-small (% do tamanho).",
      "values": {
        "Santo": "{type/tracking/normal}",
        "VTSD": "{type/tracking/normal}"
      }
    },
    "brand/type/caption/tracking": {
      "type": "FLOAT",
      "scopes": [
        "LETTER_SPACING"
      ],
      "description": "Tracking do papel caption (% do tamanho).",
      "values": {
        "Santo": "{type/tracking/normal}",
        "VTSD": "{type/tracking/normal}"
      }
    },
    "brand/type/caption-small/tracking": {
      "type": "FLOAT",
      "scopes": [
        "LETTER_SPACING"
      ],
      "description": "Tracking do papel caption-small (% do tamanho).",
      "values": {
        "Santo": "{type/tracking/wide}",
        "VTSD": "{type/tracking/wide}"
      }
    },
    "brand/shadow/xs/1/y": {
      "type": "FLOAT",
      "scopes": [
        "EFFECT_FLOAT"
      ],
      "description": "Deslocamento vertical da camada 1 da sombra xs. No Estúdio: deslocamento x multiplicador.",
      "values": {
        "Santo": 1,
        "VTSD": 1
      }
    },
    "brand/shadow/xs/1/blur": {
      "type": "FLOAT",
      "scopes": [
        "EFFECT_FLOAT"
      ],
      "description": "Desfoque da camada 1 da sombra xs. No Estúdio: desfoque x multiplicador.",
      "values": {
        "Santo": 2,
        "VTSD": 2
      }
    },
    "brand/shadow/sm/1/y": {
      "type": "FLOAT",
      "scopes": [
        "EFFECT_FLOAT"
      ],
      "description": "Deslocamento vertical da camada 1 da sombra sm. No Estúdio: deslocamento x multiplicador.",
      "values": {
        "Santo": 1,
        "VTSD": 1
      }
    },
    "brand/shadow/sm/1/blur": {
      "type": "FLOAT",
      "scopes": [
        "EFFECT_FLOAT"
      ],
      "description": "Desfoque da camada 1 da sombra sm. No Estúdio: desfoque x multiplicador.",
      "values": {
        "Santo": 3,
        "VTSD": 3
      }
    },
    "brand/shadow/sm/2/y": {
      "type": "FLOAT",
      "scopes": [
        "EFFECT_FLOAT"
      ],
      "description": "Deslocamento vertical da camada 2 da sombra sm. No Estúdio: deslocamento x multiplicador.",
      "values": {
        "Santo": 1,
        "VTSD": 1
      }
    },
    "brand/shadow/sm/2/blur": {
      "type": "FLOAT",
      "scopes": [
        "EFFECT_FLOAT"
      ],
      "description": "Desfoque da camada 2 da sombra sm. No Estúdio: desfoque x multiplicador.",
      "values": {
        "Santo": 2,
        "VTSD": 2
      }
    },
    "brand/shadow/md/1/y": {
      "type": "FLOAT",
      "scopes": [
        "EFFECT_FLOAT"
      ],
      "description": "Deslocamento vertical da camada 1 da sombra md. No Estúdio: deslocamento x multiplicador.",
      "values": {
        "Santo": 4,
        "VTSD": 4
      }
    },
    "brand/shadow/md/1/blur": {
      "type": "FLOAT",
      "scopes": [
        "EFFECT_FLOAT"
      ],
      "description": "Desfoque da camada 1 da sombra md. No Estúdio: desfoque x multiplicador.",
      "values": {
        "Santo": 8,
        "VTSD": 8
      }
    },
    "brand/shadow/md/2/y": {
      "type": "FLOAT",
      "scopes": [
        "EFFECT_FLOAT"
      ],
      "description": "Deslocamento vertical da camada 2 da sombra md. No Estúdio: deslocamento x multiplicador.",
      "values": {
        "Santo": 2,
        "VTSD": 2
      }
    },
    "brand/shadow/md/2/blur": {
      "type": "FLOAT",
      "scopes": [
        "EFFECT_FLOAT"
      ],
      "description": "Desfoque da camada 2 da sombra md. No Estúdio: desfoque x multiplicador.",
      "values": {
        "Santo": 4,
        "VTSD": 4
      }
    },
    "brand/shadow/lg/1/y": {
      "type": "FLOAT",
      "scopes": [
        "EFFECT_FLOAT"
      ],
      "description": "Deslocamento vertical da camada 1 da sombra lg. No Estúdio: deslocamento x multiplicador.",
      "values": {
        "Santo": 12,
        "VTSD": 12
      }
    },
    "brand/shadow/lg/1/blur": {
      "type": "FLOAT",
      "scopes": [
        "EFFECT_FLOAT"
      ],
      "description": "Desfoque da camada 1 da sombra lg. No Estúdio: desfoque x multiplicador.",
      "values": {
        "Santo": 16,
        "VTSD": 16
      }
    },
    "brand/shadow/lg/2/y": {
      "type": "FLOAT",
      "scopes": [
        "EFFECT_FLOAT"
      ],
      "description": "Deslocamento vertical da camada 2 da sombra lg. No Estúdio: deslocamento x multiplicador.",
      "values": {
        "Santo": 4,
        "VTSD": 4
      }
    },
    "brand/shadow/lg/2/blur": {
      "type": "FLOAT",
      "scopes": [
        "EFFECT_FLOAT"
      ],
      "description": "Desfoque da camada 2 da sombra lg. No Estúdio: desfoque x multiplicador.",
      "values": {
        "Santo": 6,
        "VTSD": 6
      }
    },
    "brand/shadow/xl/1/y": {
      "type": "FLOAT",
      "scopes": [
        "EFFECT_FLOAT"
      ],
      "description": "Deslocamento vertical da camada 1 da sombra xl. No Estúdio: deslocamento x multiplicador.",
      "values": {
        "Santo": 20,
        "VTSD": 20
      }
    },
    "brand/shadow/xl/1/blur": {
      "type": "FLOAT",
      "scopes": [
        "EFFECT_FLOAT"
      ],
      "description": "Desfoque da camada 1 da sombra xl. No Estúdio: desfoque x multiplicador.",
      "values": {
        "Santo": 24,
        "VTSD": 24
      }
    },
    "brand/shadow/xl/2/y": {
      "type": "FLOAT",
      "scopes": [
        "EFFECT_FLOAT"
      ],
      "description": "Deslocamento vertical da camada 2 da sombra xl. No Estúdio: deslocamento x multiplicador.",
      "values": {
        "Santo": 8,
        "VTSD": 8
      }
    },
    "brand/shadow/xl/2/blur": {
      "type": "FLOAT",
      "scopes": [
        "EFFECT_FLOAT"
      ],
      "description": "Desfoque da camada 2 da sombra xl. No Estúdio: desfoque x multiplicador.",
      "values": {
        "Santo": 8,
        "VTSD": 8
      }
    },
    "brand/shadow/2xl/1/y": {
      "type": "FLOAT",
      "scopes": [
        "EFFECT_FLOAT"
      ],
      "description": "Deslocamento vertical da camada 1 da sombra 2xl. No Estúdio: deslocamento x multiplicador.",
      "values": {
        "Santo": 24,
        "VTSD": 24
      }
    },
    "brand/shadow/2xl/1/blur": {
      "type": "FLOAT",
      "scopes": [
        "EFFECT_FLOAT"
      ],
      "description": "Desfoque da camada 1 da sombra 2xl. No Estúdio: desfoque x multiplicador.",
      "values": {
        "Santo": 48,
        "VTSD": 48
      }
    },
    "brand/effect/blur/sm": {
      "type": "FLOAT",
      "scopes": [
        "EFFECT_FLOAT"
      ],
      "description": "Raio do desfoque de fundo sm (background blur). No Estúdio: efeitos.blur.sm.",
      "values": {
        "Santo": 4,
        "VTSD": 4
      }
    },
    "brand/effect/blur/md": {
      "type": "FLOAT",
      "scopes": [
        "EFFECT_FLOAT"
      ],
      "description": "Raio do desfoque de fundo md (background blur). No Estúdio: efeitos.blur.md.",
      "values": {
        "Santo": 8,
        "VTSD": 8
      }
    },
    "brand/effect/blur/lg": {
      "type": "FLOAT",
      "scopes": [
        "EFFECT_FLOAT"
      ],
      "description": "Raio do desfoque de fundo lg (background blur). No Estúdio: efeitos.blur.lg.",
      "values": {
        "Santo": 16,
        "VTSD": 16
      }
    },
    "brand/effect/blur/xl": {
      "type": "FLOAT",
      "scopes": [
        "EFFECT_FLOAT"
      ],
      "description": "Raio do desfoque de fundo xl (background blur). No Estúdio: efeitos.blur.xl.",
      "values": {
        "Santo": 24,
        "VTSD": 24
      }
    },
    "brand/effect/layer-blur/sm": {
      "type": "FLOAT",
      "scopes": [
        "EFFECT_FLOAT"
      ],
      "description": "Raio do desfoque de camada sm (layer blur).",
      "values": {
        "Santo": 2,
        "VTSD": 2
      }
    },
    "brand/effect/layer-blur/md": {
      "type": "FLOAT",
      "scopes": [
        "EFFECT_FLOAT"
      ],
      "description": "Raio do desfoque de camada md (layer blur).",
      "values": {
        "Santo": 4,
        "VTSD": 4
      }
    },
    "brand/effect/glow/brand": {
      "type": "COLOR",
      "scopes": [
        "EFFECT_COLOR"
      ],
      "description": "Cor do brilho de marca (sombra colorida): brand/500 a 35% no Santo.",
      "values": {
        "Santo": "#64a3fe59",
        "VTSD": "#4ab2a759"
      }
    },
    "brand/effect/glow/neutral": {
      "type": "COLOR",
      "scopes": [
        "EFFECT_COLOR"
      ],
      "description": "Cor do brilho neutro: neutral/950 a 20% no Santo.",
      "values": {
        "Santo": "#090f1733",
        "VTSD": "#0f0f0f33"
      }
    },
    "brand/effect/glow/blur": {
      "type": "FLOAT",
      "scopes": [
        "EFFECT_FLOAT"
      ],
      "description": "Desfoque do brilho (glow).",
      "values": {
        "Santo": 24,
        "VTSD": 24
      }
    },
    "brand/effect/noise": {
      "type": "FLOAT",
      "scopes": [
        "OPACITY"
      ],
      "description": "Opacidade do ruído de textura (0..0,5).",
      "values": {
        "Santo": 0.04,
        "VTSD": 0.04
      }
    },
    "brand/gradient/brand/angle": {
      "type": "FLOAT",
      "scopes": [],
      "description": "Ângulo do gradiente de marca, em graus.",
      "values": {
        "Santo": 135,
        "VTSD": 135
      }
    },
    "brand/gradient/brand/from": {
      "type": "COLOR",
      "scopes": [
        "FRAME_FILL",
        "SHAPE_FILL"
      ],
      "description": "Parada inicial do gradiente de marca.",
      "values": {
        "Santo": "{palette/brand/500}",
        "VTSD": "{palette/brand/500}"
      }
    },
    "brand/gradient/brand/to": {
      "type": "COLOR",
      "scopes": [
        "FRAME_FILL",
        "SHAPE_FILL"
      ],
      "description": "Parada final do gradiente de marca.",
      "values": {
        "Santo": "{palette/brand/700}",
        "VTSD": "{palette/brand/700}"
      }
    },
    "brand/glass/surface/light": {
      "type": "COLOR",
      "scopes": [
        "FRAME_FILL",
        "SHAPE_FILL"
      ],
      "description": "Superfície de vidro, claro: tinta + alfa.",
      "values": {
        "Santo": "#ffffffb8",
        "VTSD": "#ffffffb8"
      }
    },
    "brand/glass/surface/dark": {
      "type": "COLOR",
      "scopes": [
        "FRAME_FILL",
        "SHAPE_FILL"
      ],
      "description": "Superfície de vidro, escuro: tinta + alfa.",
      "values": {
        "Santo": "#131a2599",
        "VTSD": "#1a1a1a99"
      }
    },
    "brand/glass/border/light": {
      "type": "COLOR",
      "scopes": [
        "STROKE_COLOR"
      ],
      "description": "Borda do vidro, claro.",
      "values": {
        "Santo": "#ffffff80",
        "VTSD": "#ffffff80"
      }
    },
    "brand/glass/border/dark": {
      "type": "COLOR",
      "scopes": [
        "STROKE_COLOR"
      ],
      "description": "Borda do vidro, escuro.",
      "values": {
        "Santo": "#ffffff1f",
        "VTSD": "#ffffff1f"
      }
    },
    "brand/glass/highlight/light": {
      "type": "COLOR",
      "scopes": [
        "FRAME_FILL",
        "SHAPE_FILL"
      ],
      "description": "Brilho de borda superior do vidro, claro.",
      "values": {
        "Santo": "#ffffff99",
        "VTSD": "#ffffff99"
      }
    },
    "brand/glass/highlight/dark": {
      "type": "COLOR",
      "scopes": [
        "FRAME_FILL",
        "SHAPE_FILL"
      ],
      "description": "Brilho de borda superior do vidro, escuro.",
      "values": {
        "Santo": "#ffffff14",
        "VTSD": "#ffffff14"
      }
    },
    "brand/glass/blur": {
      "type": "FLOAT",
      "scopes": [
        "EFFECT_FLOAT"
      ],
      "description": "Desfoque de fundo do vidro (degrau de efeito).",
      "values": {
        "Santo": "{brand/effect/blur/md}",
        "VTSD": "{brand/effect/blur/md}"
      }
    },
    "brand/glass/enabled": {
      "type": "FLOAT",
      "scopes": [],
      "description": "Tratamento de superfície em vidro ligado (1) ou desligado (0).",
      "values": {
        "Santo": 0,
        "VTSD": 0
      }
    }
  },
  "Semantic": {
    "radius/xs": {
      "value": "{brand/shape/radius-xs}"
    },
    "radius/sm": {
      "value": "{brand/shape/radius-sm}"
    },
    "radius/lg": {
      "value": "{brand/shape/radius-lg}"
    },
    "radius/xl": {
      "value": "{brand/shape/radius-xl}"
    },
    "radius/2xl": {
      "value": "{brand/shape/radius-2xl}"
    },
    "radius/3xl": {
      "value": "{brand/shape/radius-3xl}"
    },
    "space/3xs": {
      "value": "{brand/space/3xs}"
    },
    "space/2xs": {
      "value": "{brand/space/2xs}"
    },
    "space/xs": {
      "value": "{brand/space/xs}"
    },
    "space/sm": {
      "value": "{brand/space/sm}"
    },
    "space/md": {
      "value": "{brand/space/md}"
    },
    "space/lg": {
      "value": "{brand/space/lg}"
    },
    "space/xl": {
      "value": "{brand/space/xl}"
    },
    "space/2xl": {
      "value": "{brand/space/2xl}"
    },
    "space/3xl": {
      "value": "{brand/space/3xl}"
    },
    "space/4xl": {
      "value": "{brand/space/4xl}"
    },
    "space/5xl": {
      "value": "{brand/space/5xl}"
    },
    "space/6xl": {
      "value": "{brand/space/6xl}"
    },
    "space/7xl": {
      "value": "{brand/space/7xl}"
    },
    "space/8xl": {
      "value": "{brand/space/8xl}"
    },
    "control/height/sm": {
      "type": "FLOAT",
      "scopes": [
        "WIDTH_HEIGHT"
      ],
      "description": "Altura de controle sm. Use em h-(--santo-control-height-sm).",
      "value": "{brand/control/height/sm}"
    },
    "control/height/md": {
      "type": "FLOAT",
      "scopes": [
        "WIDTH_HEIGHT"
      ],
      "description": "Altura de controle md. Use em h-(--santo-control-height-md).",
      "value": "{brand/control/height/md}"
    },
    "control/height/lg": {
      "type": "FLOAT",
      "scopes": [
        "WIDTH_HEIGHT"
      ],
      "description": "Altura de controle lg. Use em h-(--santo-control-height-lg).",
      "value": "{brand/control/height/lg}"
    },
    "frame/inset": {
      "type": "FLOAT",
      "scopes": [
        "GAP"
      ],
      "description": "Recuo da moldura da borda dupla (--santo-frame-inset).",
      "value": "{brand/frame/inset}"
    },
    "frame/enabled": {
      "type": "FLOAT",
      "scopes": [],
      "description": "Borda dupla ligada (1) ou desligada (0) (--santo-frame-enabled).",
      "value": "{brand/frame/enabled}"
    },
    "radius/control": {
      "type": "FLOAT",
      "scopes": [
        "CORNER_RADIUS"
      ],
      "description": "Raio base de controle (rounded-control).",
      "value": "{brand/shape/radius-control}"
    },
    "control/padding-x/sm": {
      "type": "FLOAT",
      "scopes": [
        "GAP"
      ],
      "description": "Padding horizontal do controle sm. Use --santo-control-padding-x-sm.",
      "value": "{brand/control/padding-x/sm}"
    },
    "control/padding-x/md": {
      "type": "FLOAT",
      "scopes": [
        "GAP"
      ],
      "description": "Padding horizontal do controle md. Use --santo-control-padding-x-md.",
      "value": "{brand/control/padding-x/md}"
    },
    "control/padding-x/lg": {
      "type": "FLOAT",
      "scopes": [
        "GAP"
      ],
      "description": "Padding horizontal do controle lg. Use --santo-control-padding-x-lg.",
      "value": "{brand/control/padding-x/lg}"
    },
    "control/radius/sm": {
      "type": "FLOAT",
      "scopes": [
        "CORNER_RADIUS"
      ],
      "description": "Raio do controle sm. Use --santo-control-radius-sm.",
      "value": "{brand/control/radius/sm}"
    },
    "control/radius/md": {
      "type": "FLOAT",
      "scopes": [
        "CORNER_RADIUS"
      ],
      "description": "Raio do controle md. Use --santo-control-radius-md.",
      "value": "{brand/control/radius/md}"
    },
    "control/radius/lg": {
      "type": "FLOAT",
      "scopes": [
        "CORNER_RADIUS"
      ],
      "description": "Raio do controle lg. Use --santo-control-radius-lg.",
      "value": "{brand/control/radius/lg}"
    },
    "control/border/sm": {
      "type": "FLOAT",
      "scopes": [
        "STROKE_FLOAT"
      ],
      "description": "Espessura da borda do controle sm (variantes com contorno). Use --santo-control-border-sm.",
      "value": "{brand/control/border/sm}"
    },
    "control/border/md": {
      "type": "FLOAT",
      "scopes": [
        "STROKE_FLOAT"
      ],
      "description": "Espessura da borda do controle md (variantes com contorno). Use --santo-control-border-md.",
      "value": "{brand/control/border/md}"
    },
    "control/border/lg": {
      "type": "FLOAT",
      "scopes": [
        "STROKE_FLOAT"
      ],
      "description": "Espessura da borda do controle lg (variantes com contorno). Use --santo-control-border-lg.",
      "value": "{brand/control/border/lg}"
    },
    "control/font/sm": {
      "type": "FLOAT",
      "scopes": [
        "FONT_SIZE"
      ],
      "description": "Tamanho de fonte do rótulo do controle sm. Use --santo-control-font-sm.",
      "value": "{brand/control/font/sm}"
    },
    "control/font/md": {
      "type": "FLOAT",
      "scopes": [
        "FONT_SIZE"
      ],
      "description": "Tamanho de fonte do rótulo do controle md. Use --santo-control-font-md.",
      "value": "{brand/control/font/md}"
    },
    "control/font/lg": {
      "type": "FLOAT",
      "scopes": [
        "FONT_SIZE"
      ],
      "description": "Tamanho de fonte do rótulo do controle lg. Use --santo-control-font-lg.",
      "value": "{brand/control/font/lg}"
    },
    "control/icon/sm": {
      "type": "FLOAT",
      "scopes": [
        "WIDTH_HEIGHT"
      ],
      "description": "Tamanho do ícone dentro do controle sm. Use --santo-control-icon-sm.",
      "value": "{brand/control/icon/sm}"
    },
    "control/icon/md": {
      "type": "FLOAT",
      "scopes": [
        "WIDTH_HEIGHT"
      ],
      "description": "Tamanho do ícone dentro do controle md. Use --santo-control-icon-md.",
      "value": "{brand/control/icon/md}"
    },
    "control/icon/lg": {
      "type": "FLOAT",
      "scopes": [
        "WIDTH_HEIGHT"
      ],
      "description": "Tamanho do ícone dentro do controle lg. Use --santo-control-icon-lg.",
      "value": "{brand/control/icon/lg}"
    },
    "control/gap/sm": {
      "type": "FLOAT",
      "scopes": [
        "GAP"
      ],
      "description": "Distância ícone-texto no controle sm. Use --santo-control-gap-sm.",
      "value": "{brand/control/gap/sm}"
    },
    "control/gap/md": {
      "type": "FLOAT",
      "scopes": [
        "GAP"
      ],
      "description": "Distância ícone-texto no controle md. Use --santo-control-gap-md.",
      "value": "{brand/control/gap/md}"
    },
    "control/gap/lg": {
      "type": "FLOAT",
      "scopes": [
        "GAP"
      ],
      "description": "Distância ícone-texto no controle lg. Use --santo-control-gap-lg.",
      "value": "{brand/control/gap/lg}"
    },
    "effect/blur/sm": {
      "type": "FLOAT",
      "scopes": [
        "EFFECT_FLOAT"
      ],
      "description": "Desfoque de fundo sm (--santo-effect-blur-sm; Tailwind backdrop-blur-effect-sm).",
      "value": "{brand/effect/blur/sm}"
    },
    "effect/blur/md": {
      "type": "FLOAT",
      "scopes": [
        "EFFECT_FLOAT"
      ],
      "description": "Desfoque de fundo md (--santo-effect-blur-md; Tailwind backdrop-blur-effect-md).",
      "value": "{brand/effect/blur/md}"
    },
    "effect/blur/lg": {
      "type": "FLOAT",
      "scopes": [
        "EFFECT_FLOAT"
      ],
      "description": "Desfoque de fundo lg (--santo-effect-blur-lg; Tailwind backdrop-blur-effect-lg).",
      "value": "{brand/effect/blur/lg}"
    },
    "effect/blur/xl": {
      "type": "FLOAT",
      "scopes": [
        "EFFECT_FLOAT"
      ],
      "description": "Desfoque de fundo xl (--santo-effect-blur-xl; Tailwind backdrop-blur-effect-xl).",
      "value": "{brand/effect/blur/xl}"
    },
    "effect/layer-blur/sm": {
      "type": "FLOAT",
      "scopes": [
        "EFFECT_FLOAT"
      ],
      "description": "Desfoque de camada sm (--santo-effect-layer-blur-sm).",
      "value": "{brand/effect/layer-blur/sm}"
    },
    "effect/layer-blur/md": {
      "type": "FLOAT",
      "scopes": [
        "EFFECT_FLOAT"
      ],
      "description": "Desfoque de camada md (--santo-effect-layer-blur-md).",
      "value": "{brand/effect/layer-blur/md}"
    },
    "effect/glow/brand": {
      "type": "COLOR",
      "scopes": [
        "EFFECT_COLOR"
      ],
      "description": "Cor do brilho de marca (--santo-effect-glow-brand). A sombra pronta: --santo-glow-brand.",
      "value": "{brand/effect/glow/brand}"
    },
    "effect/glow/neutral": {
      "type": "COLOR",
      "scopes": [
        "EFFECT_COLOR"
      ],
      "description": "Cor do brilho neutro (--santo-effect-glow-neutral). A sombra pronta: --santo-glow-neutral.",
      "value": "{brand/effect/glow/neutral}"
    },
    "effect/noise": {
      "type": "FLOAT",
      "scopes": [
        "OPACITY"
      ],
      "description": "Opacidade do ruído (--santo-effect-noise).",
      "value": "{brand/effect/noise}"
    },
    "glass/blur": {
      "type": "FLOAT",
      "scopes": [
        "EFFECT_FLOAT"
      ],
      "description": "Desfoque de fundo do vidro (--santo-glass-blur).",
      "value": "{brand/glass/blur}"
    },
    "glass/enabled": {
      "type": "FLOAT",
      "scopes": [],
      "description": "Vidro ligado (1) ou desligado (0) (--santo-glass-enabled).",
      "value": "{brand/glass/enabled}"
    },
    "gradient/brand/angle": {
      "type": "FLOAT",
      "scopes": [],
      "description": "Ângulo do gradiente de marca (--santo-gradient-brand-angle).",
      "value": "{brand/gradient/brand/angle}"
    },
    "gradient/brand/from": {
      "type": "COLOR",
      "scopes": [
        "FRAME_FILL",
        "SHAPE_FILL"
      ],
      "description": "Parada inicial do gradiente de marca.",
      "value": "{brand/gradient/brand/from}"
    },
    "gradient/brand/to": {
      "type": "COLOR",
      "scopes": [
        "FRAME_FILL",
        "SHAPE_FILL"
      ],
      "description": "Parada final do gradiente de marca. Pronto: --santo-gradient-brand.",
      "value": "{brand/gradient/brand/to}"
    }
  },
  "Color": {
    "color/surface/page": {
      "values": {
        "Light": "{brand/surface/page/light}",
        "Dark": "{brand/surface/page/dark}"
      }
    },
    "color/surface/raised": {
      "values": {
        "Light": "{brand/surface/raised/light}",
        "Dark": "{brand/surface/raised/dark}"
      }
    },
    "color/surface/sunken": {
      "values": {
        "Light": "{brand/surface/sunken/light}",
        "Dark": "{brand/surface/sunken/dark}"
      }
    },
    "color/surface/overlay": {
      "values": {
        "Light": "{brand/surface/overlay/light}",
        "Dark": "{brand/surface/overlay/dark}"
      }
    },
    "color/border/subtle": {
      "values": {
        "Light": "{brand/border/subtle/light}",
        "Dark": "{brand/border/subtle/dark}"
      }
    },
    "color/border/default": {
      "values": {
        "Light": "{brand/border/default/light}",
        "Dark": "{brand/border/default/dark}"
      }
    },
    "color/border/strong": {
      "values": {
        "Light": "{brand/border/strong/light}",
        "Dark": "{brand/border/strong/dark}"
      }
    },
    "color/surface/well": {
      "type": "COLOR",
      "scopes": [
        "FRAME_FILL",
        "SHAPE_FILL"
      ],
      "description": "Poço: campo de formulário (Input/Textarea well) e áreas rebaixadas de entrada.",
      "values": {
        "Light": "{brand/surface/well/light}",
        "Dark": "{brand/surface/well/dark}"
      }
    },
    "color/surface/panel": {
      "type": "COLOR",
      "scopes": [
        "FRAME_FILL",
        "SHAPE_FILL"
      ],
      "description": "Painel interno da borda dupla (e painéis elevados dentro de moldura).",
      "values": {
        "Light": "{brand/surface/panel/light}",
        "Dark": "{brand/surface/panel/dark}"
      }
    },
    "frame/surface": {
      "type": "COLOR",
      "scopes": [
        "FRAME_FILL",
        "SHAPE_FILL"
      ],
      "description": "Cor do painel interno da borda dupla (--santo-frame-surface).",
      "values": {
        "Light": "{color/surface/panel}",
        "Dark": "{color/surface/panel}"
      }
    },
    "frame/border": {
      "type": "COLOR",
      "scopes": [
        "STROKE_COLOR"
      ],
      "description": "Borda interna da borda dupla (--santo-frame-border).",
      "values": {
        "Light": "{brand/frame/border/light}",
        "Dark": "{brand/frame/border/dark}"
      }
    },
    "glass/surface": {
      "type": "COLOR",
      "scopes": [
        "FRAME_FILL",
        "SHAPE_FILL"
      ],
      "description": "Superfície de vidro (--santo-glass-surface).",
      "values": {
        "Light": "{brand/glass/surface/light}",
        "Dark": "{brand/glass/surface/dark}"
      }
    },
    "glass/border": {
      "type": "COLOR",
      "scopes": [
        "STROKE_COLOR"
      ],
      "description": "Borda do vidro (--santo-glass-border).",
      "values": {
        "Light": "{brand/glass/border/light}",
        "Dark": "{brand/glass/border/dark}"
      }
    },
    "glass/highlight": {
      "type": "COLOR",
      "scopes": [
        "FRAME_FILL",
        "SHAPE_FILL"
      ],
      "description": "Brilho do vidro (--santo-glass-highlight).",
      "values": {
        "Light": "{brand/glass/highlight/light}",
        "Dark": "{brand/glass/highlight/dark}"
      }
    }
  },
  "textStyles": {
    "heading-1": {
      "fontSize": "brand/type/heading-1/size",
      "lineHeight": "brand/type/heading-1/leading",
      "fontFamily": "brand/family/heading",
      "letterSpacing": "brand/type/heading-1/tracking"
    },
    "heading-2": {
      "fontSize": "brand/type/heading-2/size",
      "lineHeight": "brand/type/heading-2/leading",
      "fontFamily": "brand/family/heading",
      "letterSpacing": "brand/type/heading-2/tracking"
    },
    "heading-3": {
      "fontSize": "brand/type/heading-3/size",
      "lineHeight": "brand/type/heading-3/leading",
      "fontFamily": "brand/family/heading",
      "letterSpacing": "brand/type/heading-3/tracking"
    },
    "heading-4": {
      "fontSize": "brand/type/heading-4/size",
      "lineHeight": "brand/type/heading-4/leading",
      "fontFamily": "brand/family/heading",
      "letterSpacing": "brand/type/heading-4/tracking"
    },
    "heading-5": {
      "fontSize": "brand/type/heading-5/size",
      "lineHeight": "brand/type/heading-5/leading",
      "fontFamily": "brand/family/heading",
      "letterSpacing": "brand/type/heading-5/tracking"
    },
    "heading-6": {
      "fontSize": "brand/type/heading-6/size",
      "lineHeight": "brand/type/heading-6/leading",
      "fontFamily": "brand/family/heading",
      "letterSpacing": "brand/type/heading-6/tracking"
    },
    "body-large": {
      "fontSize": "brand/type/body-large/size",
      "lineHeight": "brand/type/body-large/leading",
      "letterSpacing": "brand/type/body-large/tracking"
    },
    "body": {
      "fontSize": "brand/type/body/size",
      "lineHeight": "brand/type/body/leading",
      "letterSpacing": "brand/type/body/tracking"
    },
    "body-small": {
      "fontSize": "brand/type/body-small/size",
      "lineHeight": "brand/type/body-small/leading",
      "letterSpacing": "brand/type/body-small/tracking"
    },
    "caption": {
      "fontSize": "brand/type/caption/size",
      "lineHeight": "brand/type/caption/leading",
      "letterSpacing": "brand/type/caption/tracking"
    },
    "caption-small": {
      "fontSize": "brand/type/caption-small/size",
      "lineHeight": "brand/type/caption-small/leading",
      "letterSpacing": "brand/type/caption-small/tracking"
    }
  },
  "effectStyles": {
    "xs": [
      {
        "color": "brand/shadow/xs/1",
        "y": "brand/shadow/xs/1/y",
        "blur": "brand/shadow/xs/1/blur"
      }
    ],
    "sm": [
      {
        "color": "brand/shadow/sm/1",
        "y": "brand/shadow/sm/1/y",
        "blur": "brand/shadow/sm/1/blur"
      },
      {
        "color": "brand/shadow/sm/2",
        "y": "brand/shadow/sm/2/y",
        "blur": "brand/shadow/sm/2/blur"
      }
    ],
    "md": [
      {
        "color": "brand/shadow/md/1",
        "y": "brand/shadow/md/1/y",
        "blur": "brand/shadow/md/1/blur"
      },
      {
        "color": "brand/shadow/md/2",
        "y": "brand/shadow/md/2/y",
        "blur": "brand/shadow/md/2/blur"
      }
    ],
    "lg": [
      {
        "color": "brand/shadow/lg/1",
        "y": "brand/shadow/lg/1/y",
        "blur": "brand/shadow/lg/1/blur"
      },
      {
        "color": "brand/shadow/lg/2",
        "y": "brand/shadow/lg/2/y",
        "blur": "brand/shadow/lg/2/blur"
      }
    ],
    "xl": [
      {
        "color": "brand/shadow/xl/1",
        "y": "brand/shadow/xl/1/y",
        "blur": "brand/shadow/xl/1/blur"
      },
      {
        "color": "brand/shadow/xl/2",
        "y": "brand/shadow/xl/2/y",
        "blur": "brand/shadow/xl/2/blur"
      }
    ],
    "2xl": [
      {
        "color": "brand/shadow/2xl/1",
        "y": "brand/shadow/2xl/1/y",
        "blur": "brand/shadow/2xl/1/blur"
      }
    ]
  },
  "descriptions": {
    "brand/family/sans": "Família sans da marca: corpo e legenda (body-large ao caption-small). Os títulos usam brand/family/heading. No Estúdio: qualquer família do Google Fonts (lib/fonts/google-index.json).",
    "brand/family/mono": "Família mono da marca (code/*). No Estúdio: só famílias monoespaçadas do Google Fonts (lib/fonts/google-index.json)."
  },
  "novosEffectStyles": {
    "glass/sm": {
      "description": "Vidro sm: desfoque de fundo 4px (brand/effect/blur/sm). Preencha com color/glass/surface e contorne com color/glass/border.",
      "effects": [
        {
          "type": "BACKGROUND_BLUR",
          "x": 0,
          "y": 0,
          "blur": 4,
          "spread": 0,
          "color": null,
          "visible": true,
          "blendMode": "NORMAL",
          "boundVariables": {
            "blur": "brand/effect/blur/sm"
          }
        }
      ]
    },
    "glass/md": {
      "description": "Vidro md: desfoque de fundo 8px (brand/effect/blur/md). Preencha com color/glass/surface e contorne com color/glass/border.",
      "effects": [
        {
          "type": "BACKGROUND_BLUR",
          "x": 0,
          "y": 0,
          "blur": 8,
          "spread": 0,
          "color": null,
          "visible": true,
          "blendMode": "NORMAL",
          "boundVariables": {
            "blur": "brand/effect/blur/md"
          }
        }
      ]
    },
    "glass/lg": {
      "description": "Vidro lg: desfoque de fundo 16px (brand/effect/blur/lg). Preencha com color/glass/surface e contorne com color/glass/border.",
      "effects": [
        {
          "type": "BACKGROUND_BLUR",
          "x": 0,
          "y": 0,
          "blur": 16,
          "spread": 0,
          "color": null,
          "visible": true,
          "blendMode": "NORMAL",
          "boundVariables": {
            "blur": "brand/effect/blur/lg"
          }
        }
      ]
    },
    "blur/sm": {
      "description": "Desfoque de camada sm: 2px (brand/effect/layer-blur/sm).",
      "effects": [
        {
          "type": "LAYER_BLUR",
          "x": 0,
          "y": 0,
          "blur": 2,
          "spread": 0,
          "color": null,
          "visible": true,
          "blendMode": "NORMAL",
          "boundVariables": {
            "blur": "brand/effect/layer-blur/sm"
          }
        }
      ]
    },
    "blur/md": {
      "description": "Desfoque de camada md: 4px (brand/effect/layer-blur/md).",
      "effects": [
        {
          "type": "LAYER_BLUR",
          "x": 0,
          "y": 0,
          "blur": 4,
          "spread": 0,
          "color": null,
          "visible": true,
          "blendMode": "NORMAL",
          "boundVariables": {
            "blur": "brand/effect/layer-blur/md"
          }
        }
      ]
    },
    "glow/brand": {
      "description": "Brilho brand: sombra colorida sem deslocamento (brand/effect/glow/brand).",
      "effects": [
        {
          "type": "DROP_SHADOW",
          "x": 0,
          "y": 0,
          "blur": 24,
          "spread": 0,
          "color": "#64a3fe59",
          "visible": true,
          "blendMode": "NORMAL",
          "boundVariables": {
            "color": "brand/effect/glow/brand",
            "blur": "brand/effect/glow/blur"
          }
        }
      ]
    },
    "glow/neutral": {
      "description": "Brilho neutral: sombra colorida sem deslocamento (brand/effect/glow/neutral).",
      "effects": [
        {
          "type": "DROP_SHADOW",
          "x": 0,
          "y": 0,
          "blur": 24,
          "spread": 0,
          "color": "#090f1733",
          "visible": true,
          "blendMode": "NORMAL",
          "boundVariables": {
            "color": "brand/effect/glow/neutral",
            "blur": "brand/effect/glow/blur"
          }
        }
      ]
    }
  }
};

/* ------------------------------------------------------------------ Figma */

const collections = await figma.variables.getLocalVariableCollectionsAsync();
const byName = new Map();
for (const v of await figma.variables.getLocalVariablesAsync()) byName.set(v.name, v);
const collectionOf = (name) => {
  const c = collections.find((x) => x.name === name);
  if (!c) throw new Error(`Colecao ${name} nao existe no Figma`);
  return c;
};
const brand = collectionOf('Brand');
const semantic = collectionOf('Semantic');
const color = collectionOf('Color');
const problems = [];
const plan = [];

// Validacao antes de qualquer escrita.
const modeIds = {};
for (const m of brand.modes) modeIds[m.name] = m.modeId;
const aliasTarget = (v) => (typeof v === 'string' && v.startsWith('{') && v.endsWith('}') ? v.slice(1, -1) : null);
const willExist = new Set([...byName.keys(), ...Object.keys(NIVEL_B.Brand), ...Object.keys(NIVEL_B.Semantic), ...Object.keys(NIVEL_B.Color)]);
const colorModes = {};
for (const m of color.modes) colorModes[m.name] = m.modeId;
for (const [name, def] of Object.entries(NIVEL_B.Color)) {
  for (const [mode, value] of Object.entries(def.values)) {
    if (!(mode in colorModes)) problems.push(`Color nao tem o modo ${mode} (${name})`);
    const t = aliasTarget(value);
    if (t && !willExist.has(t)) problems.push(`Color ${name} [${mode}] aponta para ${t}, que nao existe`);
  }
  if (!def.type && !byName.has(name)) problems.push(`Color ${name} nao existe e a spec nao diz o tipo`);
}
for (const [name, def] of Object.entries(NIVEL_B.Brand)) {
  for (const [mode, value] of Object.entries(def.values)) {
    if (!(mode in modeIds)) problems.push(`Brand nao tem o modo ${mode} (${name})`);
    const t = aliasTarget(value);
    if (t && !willExist.has(t)) problems.push(`${name} [${mode}] aponta para ${t}, que nao existe`);
  }
}
for (const [name, def] of Object.entries(NIVEL_B.Semantic)) {
  const t = aliasTarget(def.value);
  if (!t || !willExist.has(t)) problems.push(`Semantic ${name} precisa apontar para variavel existente (${def.value})`);
  if (!def.type && !byName.has(name)) problems.push(`Semantic ${name} nao existe e a spec nao diz o tipo`);
}
const textStyles = await figma.getLocalTextStylesAsync();
const effectStyles = await figma.getLocalEffectStylesAsync();
for (const role of Object.keys(NIVEL_B.textStyles)) {
  if (!textStyles.some((s) => s.name.split('/')[1] === role)) problems.push(`Nenhum text style com o papel ${role}`);
}
for (const [style, layers] of Object.entries(NIVEL_B.effectStyles)) {
  const s = effectStyles.find((x) => x.name === style);
  if (!s) problems.push(`Effect style ${style} nao existe`);
  else if (s.effects.length !== layers.length) problems.push(`Effect style ${style} tem ${s.effects.length} camadas; a spec tem ${layers.length}`);
}
const headingFamilies = new Set(Object.values(NIVEL_B.Brand['brand/family/heading'].values));
const fonts = await figma.listAvailableFontsAsync();
for (const family of headingFamilies) {
  if (!fonts.some((f) => f.fontName.family === family)) problems.push(`Fonte ${family} indisponivel no Figma`);
}
if (problems.length) return { ok: false, written: false, problems };

// Escrita (ou plano, em DRY_RUN).
const aliasOf = (value) => {
  const t = aliasTarget(value);
  return t ? figma.variables.createVariableAlias(byName.get(t)) : value;
};
const sameValue = (current, wanted) => {
  const t = aliasTarget(wanted);
  if (t) return current && current.type === 'VARIABLE_ALIAS' && byName.get(t) && current.id === byName.get(t).id;
  if (typeof wanted === 'string' && wanted.startsWith('#') && current && typeof current === 'object') {
    const h = (x) => Math.round(x * 255).toString(16).padStart(2, '0');
    return `#${h(current.r)}${h(current.g)}${h(current.b)}${current.a === 1 ? '' : h(current.a)}` === wanted;
  }
  return current === wanted;
};
const hexToRgba = (hex) => {
  const n = (i) => parseInt(hex.slice(i, i + 2), 16) / 255;
  return { r: n(1), g: n(3), b: n(5), a: hex.length === 9 ? n(7) : 1 };
};
const raw = (def, value) => (def.type === 'COLOR' && !aliasTarget(value) ? hexToRgba(value) : value);

function ensure(collection, name, def) {
  let v = byName.get(name);
  if (!v) {
    plan.push(`criar ${collection.name}/${name}`);
    if (DRY_RUN) return null;
    v = figma.variables.createVariable(name, collection, def.type);
    byName.set(name, v);
  }
  // scopes [] e explicito: some de todo seletor (nao fica ALL_SCOPES). O dump omite os dois casos.
  if (def.scopes && JSON.stringify([...v.scopes].sort()) !== JSON.stringify([...def.scopes].sort())) {
    plan.push(`scopes ${name}`);
    if (!DRY_RUN) v.scopes = def.scopes;
  }
  if (def.description !== undefined && v.description !== def.description) {
    plan.push(`description ${name}`);
    if (!DRY_RUN) v.description = def.description;
  }
  return v;
}

// 1. Brand: cria tudo antes de ligar (aliases entre brand/* e para primitivas).
for (const [name, def] of Object.entries(NIVEL_B.Brand)) ensure(brand, name, def);
for (const [name, def] of Object.entries(NIVEL_B.Brand)) {
  const v = byName.get(name);
  for (const [mode, value] of Object.entries(def.values)) {
    if (v && sameValue(v.valuesByMode[modeIds[mode]], value)) continue;
    plan.push(`${name} [${mode}] = ${value}`);
    if (!DRY_RUN) v.setValueForMode(modeIds[mode], aliasOf(raw(def, value)));
  }
}
for (const [name, description] of Object.entries(NIVEL_B.descriptions)) {
  const v = byName.get(name);
  if (v && v.description !== description) {
    plan.push(`description ${name}`);
    if (!DRY_RUN) v.description = description;
  }
}

// 2. Color (Light/Dark): superficies, bordas e a moldura da borda dupla apontam para brand/*.
for (const [name, def] of Object.entries(NIVEL_B.Color)) if (def.type) ensure(color, name, def);
for (const [name, def] of Object.entries(NIVEL_B.Color)) {
  const v = byName.get(name);
  for (const [mode, value] of Object.entries(def.values)) {
    if (v && sameValue(v.valuesByMode[colorModes[mode]], value)) continue;
    plan.push(`Color ${name} [${mode}] = ${value}`);
    if (!DRY_RUN) v.setValueForMode(colorModes[mode], aliasOf(raw({ type: 'COLOR' }, value)));
  }
}

// 3. Semantic.
const semanticMode = semantic.modes[0].modeId;
for (const [name, def] of Object.entries(NIVEL_B.Semantic)) {
  const v = def.type ? ensure(semantic, name, def) : byName.get(name);
  if (v && sameValue(v.valuesByMode[semanticMode], def.value)) continue;
  plan.push(`Semantic ${name} = ${def.value}`);
  if (!DRY_RUN) v.setValueForMode(semanticMode, aliasOf(def.value));
}

// 4. Text styles: carregar as fontes de TODOS os modos antes de ligar fontFamily.
if (!DRY_RUN) {
  const styles = new Set();
  for (const s of textStyles) styles.add(s.fontName.style);
  for (const family of headingFamilies) for (const style of styles) {
    if (fonts.some((f) => f.fontName.family === family && f.fontName.style === style)) await figma.loadFontAsync({ family, style });
  }
}
for (const s of textStyles) {
  const binding = NIVEL_B.textStyles[s.name.split('/')[1]];
  if (!binding) continue;
  for (const [field, varName] of Object.entries(binding)) {
    const current = s.boundVariables && s.boundVariables[field];
    if (current && byName.get(varName) && current.id === byName.get(varName).id) continue;
    plan.push(`text style ${s.name}.${field} -> ${varName}`);
    if (!DRY_RUN) {
      await figma.loadFontAsync(s.fontName);
      s.setBoundVariable(field, byName.get(varName));
    }
  }
}

// 5. Effect styles: cor, deslocamento vertical e desfoque de cada camada ligados a brand/shadow/*.
// Camada na spec: { color, y, blur } (nomes de variavel); campo do Figma: color, offsetY, radius.
const EFFECT_FIELD = { color: 'color', y: 'offsetY', blur: 'radius' };
const camada = (l) => (typeof l === 'string' ? { color: l } : l);
for (const [style, layers] of Object.entries(NIVEL_B.effectStyles)) {
  const s = effectStyles.find((x) => x.name === style);
  const pending = layers.map(camada).some((l, i) =>
    Object.entries(l).some(([k, varName]) => {
      const b = s.effects[i].boundVariables && s.effects[i].boundVariables[EFFECT_FIELD[k]];
      return !(b && byName.get(varName) && b.id === byName.get(varName).id);
    }),
  );
  if (!pending) continue;
  plan.push(`effect style ${style}: camadas ligadas a ${layers.map((l) => Object.values(camada(l)).join('+')).join(', ')}`);
  if (!DRY_RUN) {
    s.effects = s.effects.map((e, i) => {
      let out = e;
      for (const [k, varName] of Object.entries(camada(layers[i]))) out = figma.variables.setBoundVariableForEffect(out, EFFECT_FIELD[k], byName.get(varName));
      return out;
    });
  }
}

// 6. Effect styles novos: glass/* (background blur), blur/* (layer blur), glow/* (sombra colorida).
const toFigmaEffect = (e) =>
  e.type === 'BACKGROUND_BLUR' || e.type === 'LAYER_BLUR'
    ? { type: e.type, radius: e.blur, visible: e.visible, blurType: 'NORMAL' }
    : { type: e.type, color: hexToRgba(e.color), offset: { x: e.x, y: e.y }, radius: e.blur, spread: e.spread, visible: e.visible, blendMode: e.blendMode };
for (const [name, def] of Object.entries(NIVEL_B.novosEffectStyles || {})) {
  let st = effectStyles.find((x) => x.name === name);
  if (!st) {
    plan.push(`criar effect style ${name}`);
    if (DRY_RUN) continue;
    st = figma.createEffectStyle();
    st.name = name;
    effectStyles.push(st);
  }
  if (st.description !== def.description) {
    plan.push(`description ${name}`);
    if (!DRY_RUN) st.description = def.description;
  }
  const ligado = (fx, k, varName) => {
    const b = fx.boundVariables && fx.boundVariables[EFFECT_FIELD[k]];
    return b && byName.get(varName) && b.id === byName.get(varName).id;
  };
  const igual = st.effects.length === def.effects.length && def.effects.every((e, i) => st.effects[i].type === e.type && Object.entries(e.boundVariables || {}).every(([k, v]) => ligado(st.effects[i], k, v)));
  if (igual) continue;
  plan.push(`effect style ${name}: ${def.effects.map((e) => e.type).join(' + ')}`);
  if (!DRY_RUN) {
    st.effects = def.effects.map((e) => {
      let fx = toFigmaEffect(e);
      for (const [k, varName] of Object.entries(e.boundVariables || {})) fx = figma.variables.setBoundVariableForEffect(fx, EFFECT_FIELD[k], byName.get(varName));
      return fx;
    });
  }
}

return { ok: true, written: !DRY_RUN, changes: plan.length, plan };

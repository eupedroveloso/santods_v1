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
      "description": "Família dos títulos (heading-1 a heading-6). Igual à sans quando a marca não separa título de corpo.",
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
    }
  },
  "textStyles": {
    "heading-1": {
      "fontSize": "brand/type/heading-1/size",
      "lineHeight": "brand/type/heading-1/leading",
      "fontFamily": "brand/family/heading"
    },
    "heading-2": {
      "fontSize": "brand/type/heading-2/size",
      "lineHeight": "brand/type/heading-2/leading",
      "fontFamily": "brand/family/heading"
    },
    "heading-3": {
      "fontSize": "brand/type/heading-3/size",
      "lineHeight": "brand/type/heading-3/leading",
      "fontFamily": "brand/family/heading"
    },
    "heading-4": {
      "fontSize": "brand/type/heading-4/size",
      "lineHeight": "brand/type/heading-4/leading",
      "fontFamily": "brand/family/heading"
    },
    "heading-5": {
      "fontSize": "brand/type/heading-5/size",
      "lineHeight": "brand/type/heading-5/leading",
      "fontFamily": "brand/family/heading"
    },
    "heading-6": {
      "fontSize": "brand/type/heading-6/size",
      "lineHeight": "brand/type/heading-6/leading",
      "fontFamily": "brand/family/heading"
    },
    "body-large": {
      "fontSize": "brand/type/body-large/size",
      "lineHeight": "brand/type/body-large/leading"
    },
    "body": {
      "fontSize": "brand/type/body/size",
      "lineHeight": "brand/type/body/leading"
    },
    "body-small": {
      "fontSize": "brand/type/body-small/size",
      "lineHeight": "brand/type/body-small/leading"
    },
    "caption": {
      "fontSize": "brand/type/caption/size",
      "lineHeight": "brand/type/caption/leading"
    },
    "caption-small": {
      "fontSize": "brand/type/caption-small/size",
      "lineHeight": "brand/type/caption-small/leading"
    }
  },
  "effectStyles": {
    "xs": [
      "brand/shadow/xs/1"
    ],
    "sm": [
      "brand/shadow/sm/1",
      "brand/shadow/sm/2"
    ],
    "md": [
      "brand/shadow/md/1",
      "brand/shadow/md/2"
    ],
    "lg": [
      "brand/shadow/lg/1",
      "brand/shadow/lg/2"
    ],
    "xl": [
      "brand/shadow/xl/1",
      "brand/shadow/xl/2"
    ],
    "2xl": [
      "brand/shadow/2xl/1"
    ]
  },
  "descriptions": {
    "brand/family/sans": "Família sans da marca: corpo e legenda (body-large ao caption-small). Os títulos usam brand/family/heading."
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
const problems = [];
const plan = [];

// Validacao antes de qualquer escrita.
const modeIds = {};
for (const m of brand.modes) modeIds[m.name] = m.modeId;
const aliasTarget = (v) => (typeof v === 'string' && v.startsWith('{') && v.endsWith('}') ? v.slice(1, -1) : null);
const willExist = new Set([...byName.keys(), ...Object.keys(NIVEL_B.Brand), ...Object.keys(NIVEL_B.Semantic)]);
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

// 2. Semantic.
const semanticMode = semantic.modes[0].modeId;
for (const [name, def] of Object.entries(NIVEL_B.Semantic)) {
  const v = def.type ? ensure(semantic, name, def) : byName.get(name);
  if (v && sameValue(v.valuesByMode[semanticMode], def.value)) continue;
  plan.push(`Semantic ${name} = ${def.value}`);
  if (!DRY_RUN) v.setValueForMode(semanticMode, aliasOf(def.value));
}

// 3. Text styles: carregar as fontes de TODOS os modos antes de ligar fontFamily.
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

// 4. Effect styles: cor de cada camada ligada a brand/shadow/*.
for (const [style, layers] of Object.entries(NIVEL_B.effectStyles)) {
  const s = effectStyles.find((x) => x.name === style);
  const pending = layers.some((varName, i) => {
    const b = s.effects[i].boundVariables && s.effects[i].boundVariables.color;
    return !(b && byName.get(varName) && b.id === byName.get(varName).id);
  });
  if (!pending) continue;
  plan.push(`effect style ${style}: cor ligada a ${layers.join(', ')}`);
  if (!DRY_RUN) s.effects = s.effects.map((e, i) => figma.variables.setBoundVariableForEffect(e, 'color', byName.get(layers[i])));
}

return { ok: true, written: !DRY_RUN, changes: plan.length, plan };

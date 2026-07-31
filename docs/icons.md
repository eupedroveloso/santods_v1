# Ícones

O Santo não desenha ícone. Há um acervo único, e ele existe nos dois ambientes
ao mesmo tempo:

- **No Figma**, na página **Icones** — 4.791 conjuntos de componentes, cada um
  com 4 variantes de peso.
- **No código**, no pacote **`@dev-mbr/icons`** (repositório privado
  [dev-mbr/rtg-icons](https://github.com/dev-mbr/rtg-icons)).

São os mesmos desenhos: os SVGs que subiram para o pacote saíram desses
componentes. Por isso **nada é extraído do Figma e guardado no repositório do
Santo** — no Figma se usa instância, no código se importa do pacote, e a ponte
entre os dois é só o nome.

Um ícone desenhado à mão numa tela é a mesma classe de erro que uma cor digitada
à mão: parece certo, não existe para o sistema, e ninguém consegue reimplementar
sem adivinhar.

## A equivalência

Um conjunto no Figma vira um componente por variante, e o nome do componente é o
nome do conjunto em PascalCase mais o peso:

| Figma                                     | código                |
| ----------------------------------------- | --------------------- |
| conjunto `arrow-right`, `Weight=Regular`  | `ArrowRightRegular`   |
| conjunto `arrow-right`, `Weight=Light`    | `ArrowRightLight`     |
| conjunto `magnifying-glass`, `Weight=Solid` | `MagnifyingGlassSolid` |
| conjunto `circle-check`, `Weight=Duotone` | `CircleCheckDuotone`  |

**Não existe export sem sufixo.** `import { ArrowRight }` não compila; o correto
é `ArrowRightRegular`. Conjunto cujo nome começa com dígito ganha o prefixo
`Icon` (`0` → `Icon0Regular`), porque identificador em JavaScript não pode
começar com número.

**`regular` é o padrão do Santo.** É o peso mais neutro para interface. Os
outros três existem e se usam pelo sufixo quando houver motivo — não por
preferência de quem está desenhando na hora.

### A equivalência está verificada

Comparação feita em 31/07/2026 por digest FNV sobre as duas listas de nomes
ordenadas, para não depender de inspeção visual:

```
repositório  4.791 nomes  digest f1f7812d
Figma        4.791 nomes  digest f1f7812d   (4.792 conjuntos, 1 duplicata)
```

Os nomes são idênticos, um a um. Refazer essa conferência é um `readdirSync` de
`svg/regular/` contra os nomes dos conjuntos da página Icones.

## Três exceções encontradas no arquivo

Nenhuma bloqueia o uso, e todas quebrariam alguém em silêncio se não estivessem
escritas:

1. **`plus-circle` está duplicado no Figma.** Dois conjuntos com o mesmo nome,
   lado a lado (`38:55380` em x=792 e `38:55394` em x=876), ambos com as quatro
   variantes. No pacote existe só um. Quem instanciar pega um dos dois sem
   saber qual — e se os desenhos divergirem no futuro, a diferença não aparece
   em lugar nenhum.
2. **`face-meh` não tem Solid no pacote.** O Figma tem as quatro variantes de
   todos os 4.792 conjuntos, mas `svg/solid/` tem 4.790 arquivos: falta
   `face-meh`. Ou seja, `FaceMehSolid` **existe no Figma e não existe no
   código**. É a única divergência de variante do acervo inteiro.
3. **Os ícones de marca não são componentes.** O frame `Brand` da página Icones
   tem 592 desenhos soltos dentro de um `Frame 1`, e **zero** componentes ou
   conjuntos. No pacote eles existem (`svg/brand/`, 591 arquivos), mas no Figma
   não dá para instanciar. Enquanto isso não mudar, ícone de marca é
   inutilizável em protótipo.

## Instalação

O pacote é privado, no GitHub Packages. O `.npmrc` da raiz já aponta o escopo
para lá e lê o token do ambiente. Falta o token:

```bash
export GITHUB_TOKEN=<token com read:packages>
pnpm install
```

`pnpm install` lê o **ambiente**, não o `.env` da raiz — o `.env` só é lido pelos
scripts de token do `@santo/tokens`. Em CI, use o secret do workflow.

## Tamanho e cor

Ícone tem rampa própria: **`dimension/icon/*`** (12, 16, 20, 24, 32, 40, 48),
separada de `dimension/size/*`. As duas medem coisas diferentes — `size` é
altura de controle e alvo de toque, `icon` é o quadrado do glifo. Um botão de
48px costuma levar um ícone de 20px; amarrar as duas rampas faria uma crescer
junto com a outra sem que ninguém tivesse pedido.

O tamanho nativo é **16** — é o viewBox do desenho e o tamanho dos componentes
no Figma. Acima disso são ampliações limpas; abaixo, o glifo perde definição.

Cor sai de `color/icon/*`. Os SVGs usam `fill="currentColor"`, então no código
basta a cor de texto do contexto; no Figma, o preenchimento da instância vincula
à variável.

> **`strokeWidth` e `absoluteStrokeWidth` não fazem nada.** A API do pacote
> expõe as duas, mas numa amostra de 3.000 SVGs apenas **1** usa `stroke` — o
> acervo é de preenchimento. Não construa nada em cima dessas props.

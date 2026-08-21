/**
 * Conjunto de icones do SantoDS.
 *
 * Todos com o mesmo desenho: grade de 24, traco de 1.5, pontas e juntas
 * arredondadas, `currentColor`. O tamanho vem dos tokens `dimension/icon/*`,
 * entao um icone nunca vira um numero solto no meio do JSX.
 *
 * O arquivo do Figma tem uma biblioteca Font Awesome inteira na pagina Icones,
 * mas ela nao faz parte dos tokens — estes aqui sao os que a lib usa de fato.
 */

export type IconSize = 12 | 16 | 20 | 24 | 32 | 40 | 48;

export type IconProps = {
  /** Casa com os tokens dimension/icon/*. */
  size?: IconSize;
  className?: string;
  /** Rotulo acessivel. Sem ele, o icone e tratado como decorativo. */
  title?: string;
};

function Svg({ size = 16, className = "", title, children }: IconProps & { children: React.ReactNode }) {
  const px = `var(--santo-dimension-icon-${size})`;
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: px, height: px }}
      className={`shrink-0 ${className}`}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
}

export const Search = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </Svg>
);

export const ChevronDown = (p: IconProps) => (
  <Svg {...p}>
    <path d="m6 9 6 6 6-6" />
  </Svg>
);

export const ChevronRight = (p: IconProps) => (
  <Svg {...p}>
    <path d="m9 6 6 6-6 6" />
  </Svg>
);

export const ChevronLeft = (p: IconProps) => (
  <Svg {...p}>
    <path d="m15 6-6 6 6 6" />
  </Svg>
);

export const Undo = (p: IconProps) => (
  <Svg {...p}>
    <path d="M9 14 4 9l5-5" />
    <path d="M4 9h11a5 5 0 0 1 0 10h-4" />
  </Svg>
);

export const Redo = (p: IconProps) => (
  <Svg {...p}>
    <path d="m15 14 5-5-5-5" />
    <path d="M20 9H9a5 5 0 0 0 0 10h4" />
  </Svg>
);

export const Reset = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 12a9 9 0 1 0 3-6.7" />
    <path d="M3 4v5h5" />
  </Svg>
);

export const Import = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3v11" />
    <path d="m8 10 4 4 4-4" />
    <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
  </Svg>
);

export const Save = (p: IconProps) => (
  <Svg {...p}>
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z" />
    <path d="M8 3v6h7" />
    <path d="M8 21v-6h8v6" />
  </Svg>
);

export const Code = (p: IconProps) => (
  <Svg {...p}>
    <path d="m9 6-5 6 5 6" />
    <path d="m15 6 5 6-5 6" />
  </Svg>
);

export const Sun = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </Svg>
);

export const Moon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />
  </Svg>
);

/** Duas setas trocando de lado: usado para religar um token a outro. */
export const Shuffle = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 8h11l-3-3" />
    <path d="M20 16H9l3 3" />
  </Svg>
);

export const Link = (p: IconProps) => (
  <Svg {...p}>
    <path d="M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1" />
    <path d="M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1" />
  </Svg>
);

export const Unlink = (p: IconProps) => (
  <Svg {...p}>
    <path d="M15 8l1-1a5 5 0 0 1 7 7l-1 1" />
    <path d="M9 16l-1 1a5 5 0 0 1-7-7l1-1" />
    <path d="m3 3 18 18" />
  </Svg>
);

export const Plus = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 5v14M5 12h14" />
  </Svg>
);

export const Minus = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 12h14" />
  </Svg>
);

export const Check = (p: IconProps) => (
  <Svg {...p}>
    <path d="m4 12 5 5L20 6" />
  </Svg>
);

export const Close = (p: IconProps) => (
  <Svg {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Svg>
);

export const More = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="5" r="1" />
    <circle cx="12" cy="12" r="1" />
    <circle cx="12" cy="19" r="1" />
  </Svg>
);

export const Expand = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 9V4h5M20 15v5h-5M20 9V4h-5M4 15v5h5" />
  </Svg>
);

export const Copy = (p: IconProps) => (
  <Svg {...p}>
    <rect x="9" y="9" width="11" height="11" rx="2" />
    <path d="M5 15V5a2 2 0 0 1 2-2h8" />
  </Svg>
);

export const Download = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3v12" />
    <path d="m7 11 5 5 5-5" />
    <path d="M4 20h16" />
  </Svg>
);

export const Palette = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3a9 9 0 0 0 0 18c1 0 1.7-.8 1.7-1.7 0-.5-.2-.9-.5-1.2-.3-.3-.5-.7-.5-1.1 0-.9.8-1.7 1.7-1.7H16a5 5 0 0 0 5-5c0-4-4-7.3-9-7.3Z" />
    <circle cx="7.5" cy="11.5" r="1" />
    <circle cx="11" cy="7.5" r="1" />
    <circle cx="16" cy="9.5" r="1" />
  </Svg>
);

export const ArrowUpRight = (p: IconProps) => (
  <Svg {...p}>
    <path d="M7 17 17 7M8 7h9v9" />
  </Svg>
);

export const ArrowDownLeft = (p: IconProps) => (
  <Svg {...p}>
    <path d="M17 7 7 17M16 17H7V8" />
  </Svg>
);

export const TrendUp = (p: IconProps) => (
  <Svg {...p}>
    <path d="m3 17 6-6 4 4 8-8" />
    <path d="M15 7h6v6" />
  </Svg>
);

export const Github = (p: IconProps) => (
  <Svg {...p}>
    <path d="M15 21v-3.2c0-1 .3-1.7.9-2.2-2.9-.3-5.9-1.4-5.9-6.4 0-1.4.5-2.5 1.3-3.4-.1-.3-.6-1.6.1-3.3 0 0 1.1-.3 3.6 1.3a12 12 0 0 1 6.5 0C23 2.2 24.1 2.5 24.1 2.5c.7 1.7.2 3 .1 3.3.8.9 1.3 2 1.3 3.4 0 5-3 6.1-5.9 6.4.5.4.9 1.2.9 2.4V21" transform="translate(-5)" />
    <path d="M10 18c-2.5.8-4.5 0-5.5-2" />
  </Svg>
);

export const Google = (p: IconProps) => (
  <Svg {...p}>
    <path d="M20.5 12.2c0-.6-.05-1.2-.16-1.7H12v3.4h4.8a4.1 4.1 0 0 1-1.8 2.7v2.2h2.9c1.7-1.6 2.6-3.9 2.6-6.6Z" />
    <path d="M12 21c2.4 0 4.5-.8 6-2.2l-2.9-2.2c-.8.5-1.8.9-3.1.9-2.4 0-4.4-1.6-5.1-3.8H3.9v2.3A9 9 0 0 0 12 21Z" />
    <path d="M6.9 13.7a5.4 5.4 0 0 1 0-3.4V8H3.9a9 9 0 0 0 0 8l3-2.3Z" />
    <path d="M12 6.6c1.3 0 2.5.5 3.5 1.4l2.6-2.6A9 9 0 0 0 3.9 8l3 2.3c.7-2.2 2.7-3.7 5.1-3.7Z" />
  </Svg>
);

export const Sparkles = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3.5 13.6 8 18 9.5 13.6 11 12 15.5 10.4 11 6 9.5 10.4 8Z" />
    <path d="M18.5 15.5 19.2 17.3 21 18l-1.8.7-.7 1.8-.7-1.8L16 18l1.8-.7Z" />
  </Svg>
);

export const Figma = (p: IconProps) => (
  <Svg {...p}>
    <path d="M9 3h3v6H9a3 3 0 1 1 0-6Z" />
    <path d="M12 3h3a3 3 0 1 1 0 6h-3V3Z" />
    <path d="M9 9h3v6H9a3 3 0 1 1 0-6Z" />
    <path d="M12 9h3a3 3 0 1 1-3 3V9Z" />
    <path d="M9 15h3v3a3 3 0 1 1-3-3Z" />
  </Svg>
);

export const Eyedropper = (p: IconProps) => (
  <Svg {...p}>
    <path d="m2 22 1-4 9-9" />
    <path d="M12 9l3 3" />
    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L11 15l-3-3Z" />
    <path d="m7 18-1-1" />
  </Svg>
);

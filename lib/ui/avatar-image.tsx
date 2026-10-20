"use client";

import Image from "next/image";
import { useState } from "react";
import type { ReactNode } from "react";

/**
 * Foto do Avatar, com queda para as iniciais quando o arquivo falha. Interno
 * (sem meta): o Avatar e quem aparece no catalogo.
 */
export function AvatarImage({
  src,
  avifSrc,
  alt,
  size,
  fallback,
}: {
  src: string;
  avifSrc?: string;
  alt: string;
  size: number;
  fallback: ReactNode;
}) {
  const [failed, setFailed] = useState(false);
  const [avifFailed, setAvifFailed] = useState(false);
  if (failed) return <span role="img" aria-label={alt}>{fallback}</span>;
  const preferAvif = Boolean(avifSrc && !avifFailed);
  const image = (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      sizes={`${size}px`}
      unoptimized
      onError={() => preferAvif ? setAvifFailed(true) : setFailed(true)}
      className="size-full rounded-full object-cover"
    />
  );
  return preferAvif ? <picture className="contents"><source type="image/avif" srcSet={avifSrc} />{image}</picture> : image;
}

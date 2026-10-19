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
  alt,
  size,
  fallback,
}: {
  src: string;
  alt: string;
  size: number;
  fallback: ReactNode;
}) {
  const [failed, setFailed] = useState(false);
  if (failed) return <>{fallback}</>;
  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      unoptimized
      onError={() => setFailed(true)}
      className="size-full rounded-full object-cover"
    />
  );
}

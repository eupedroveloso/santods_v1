import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

/** Cartao tonal: barra de topo, titulo em 2 linhas, 2 acoes e vitrine. */
export function HeroCardThumb() {
  return (
    <ThumbFrame pad="sm">
      <S.Block tone="soft" className="flex-col items-center gap-2xs p-2xs">
        <S.Bar w="full" size="sm" />
        <S.Bar w="lg" size="lg" tone="strong" />
        <S.Bar w="md" size="md" tone="emphasis" />
        <div className="flex gap-3xs">
          <S.Button size="sm" variant="soft" w="xs" />
          <S.Button size="sm" w="sm" />
        </div>
      </S.Block>
    </ThumbFrame>
  );
}

import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

/** Logo, titulo em duas linhas (trecho em enfase), apoio e chamada (sem tarja). */
export function LandingHeroThumb() {
  return (
    <ThumbFrame pad="md">
      <div className="flex flex-col items-center gap-2xs">
        <S.Bar w="sm" size="md" tone="strong" />
        <div className="flex gap-2xs">
          <S.Bar w="md" size="lg" tone="strong" />
          <S.Bar w="sm" size="lg" tone="emphasis" />
        </div>
        <S.Bar w="lg" size="lg" tone="strong" />
        <S.Bar w="xl" size="sm" />
        <S.Bar w="lg" size="md" />
      </div>
    </ThumbFrame>
  );
}

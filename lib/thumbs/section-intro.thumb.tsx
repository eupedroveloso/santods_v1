import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

/** Ponto + overline, titulo em linhas com pastilha inline; ultima linha mais clara. */
export function SectionIntroThumb() {
  return (
    <ThumbFrame pad="md">
      <div className="flex flex-col items-center gap-2xs">
        <S.Bar w="xs" size="sm" />
        <div className="flex items-center gap-2xs">
          <S.Bar w="md" size="lg" tone="strong" />
          <S.Block w="xs" h="md" tone="emphasis" />
          <S.Bar w="sm" size="lg" tone="strong" />
        </div>
        <S.Bar w="lg" size="lg" tone="base" />
      </div>
    </ThumbFrame>
  );
}

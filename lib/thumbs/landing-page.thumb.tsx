import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

/** Coluna central: titulo, video e CTA, com laterais decorativas. */
export function LandingPageThumb() {
  return (
    <ThumbFrame pad="sm">
      <div className="flex items-stretch justify-between gap-xs">
        <S.Block w="2xs" tone="soft" />
        <div className="flex min-w-0 flex-1 flex-col items-center gap-2xs">
          <S.Bar w="lg" size="lg" tone="strong" />
          <S.Block h="xl" tone="base" />
          <S.Block h="xs" tone="emphasis" />
        </div>
        <S.Block w="2xs" tone="soft" />
      </div>
    </ThumbFrame>
  );
}

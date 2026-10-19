import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

export function RadioCardThumb() {
  return (
    <ThumbFrame pad="md">
      <S.Block tone="soft" className="items-start gap-xs p-xs">
        <S.Check shape="round" on />
        <div className="flex min-w-0 flex-1 flex-col gap-2xs">
          <S.Bar w="md" tone="strong" />
          <S.Bar w="lg" size="sm" />
        </div>
      </S.Block>
    </ThumbFrame>
  );
}

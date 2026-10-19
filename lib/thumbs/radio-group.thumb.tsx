import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

export function RadioGroupThumb() {
  return (
    <ThumbFrame>
      <S.Block tone="soft" className="items-center gap-xs p-xs">
        <S.Check shape="round" on />
        <S.Bar w="md" tone="strong" />
      </S.Block>
      <S.Block tone="soft" className="items-center gap-xs p-xs">
        <S.Check shape="round" />
        <S.Bar w="lg" />
      </S.Block>
    </ThumbFrame>
  );
}

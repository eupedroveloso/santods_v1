import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

export function CardHeaderThumb() {
  return (
    <ThumbFrame>
      <div className="flex items-start gap-xs">
        <div className="flex flex-col gap-2xs">
          <S.Bar w="md" size="lg" tone="strong" />
          <S.Bar w="lg" size="sm" />
        </div>
        <div className="ml-auto">
          <S.Button size="sm" />
        </div>
      </div>
      <S.Rule />
      <S.Block h="2xl" />
    </ThumbFrame>
  );
}

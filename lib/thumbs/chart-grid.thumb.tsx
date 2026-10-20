import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

export function ChartGridThumb() {
  return (
    <ThumbFrame>
      <div className="flex flex-col gap-md">
        <S.Rule />
        <S.Rule />
        <S.Rule />
        <S.Rule emphasis />
      </div>
    </ThumbFrame>
  );
}

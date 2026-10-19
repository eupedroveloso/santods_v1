import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

export function RingThumb() {
  return (
    <ThumbFrame pad="md">
      <div className="flex items-center justify-center gap-sm">
        <S.Ring value={72} size="lg" />
      </div>
    </ThumbFrame>
  );
}

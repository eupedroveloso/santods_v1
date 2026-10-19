import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

export function CopyButtonThumb() {
  return (
    <ThumbFrame pad="md">
      <S.Field placeholder="lg" trailing={<S.Button size="sm" square />} />
    </ThumbFrame>
  );
}

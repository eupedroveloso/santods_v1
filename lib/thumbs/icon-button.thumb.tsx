import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

export function IconButtonThumb() {
  return (
    <ThumbFrame pad="md">
      <div className="flex justify-center gap-xs">
        <S.Button variant="soft" square />
        <S.Button variant="soft" square />
        <S.Button square />
      </div>
    </ThumbFrame>
  );
}

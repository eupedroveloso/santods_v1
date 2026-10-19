import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

export function ButtonThumb() {
  return (
    <ThumbFrame pad="md">
      <div className="flex justify-center">
        <S.Button w="lg" />
      </div>
    </ThumbFrame>
  );
}

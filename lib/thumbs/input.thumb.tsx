import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

export function InputThumb() {
  return (
    <ThumbFrame pad="md">
      <S.Field placeholder="md" caret />
    </ThumbFrame>
  );
}

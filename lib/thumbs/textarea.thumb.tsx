import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

export function TextareaThumb() {
  return (
    <ThumbFrame pad="md">
      <S.Field multiline placeholder="lg" caret />
    </ThumbFrame>
  );
}

import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

export function SearchTriggerThumb() {
  return (
    <ThumbFrame pad="md">
      <S.Field
        leading={<S.Circle size="xs" tone="emphasis" />}
        placeholder="sm"
        trailing={<S.Chip w="xs" tone="raised" />}
      />
    </ThumbFrame>
  );
}

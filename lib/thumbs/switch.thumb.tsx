import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

export function SwitchThumb() {
  return (
    <ThumbFrame pad="md">
      <div className="flex justify-center gap-xs">
        <S.Chip w="xs" tone="strong" align="start">
          <S.Circle size="xs" tone="raised" />
        </S.Chip>
        <S.Chip w="xs" tone="emphasis" align="end">
          <S.Circle size="xs" tone="raised" />
        </S.Chip>
      </div>
    </ThumbFrame>
  );
}

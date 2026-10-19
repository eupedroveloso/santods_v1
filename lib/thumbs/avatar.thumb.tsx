import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

export function AvatarThumb() {
  return (
    <ThumbFrame pad="md">
      <div className="flex justify-center gap-xs">
        <S.Circle size="xl" tone="emphasis" />
        <S.Circle size="xl" tone="base" />
        <S.Circle size="xl" tone="soft" />
      </div>
    </ThumbFrame>
  );
}

import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

export function AvatarGroupThumb() {
  return (
    <ThumbFrame pad="md">
      <div className="flex items-center justify-center">
        <S.Circle size="xl" tone="emphasis" ring />
        <div className="-ml-xs">
          <S.Circle size="xl" tone="base" ring />
        </div>
        <div className="-ml-xs">
          <S.Circle size="xl" tone="soft" ring />
        </div>
        <div className="ml-xs">
          <S.Chip w="xs" tone="soft">
            <S.Bar w="2xs" size="sm" tone="strong" />
          </S.Chip>
        </div>
      </div>
    </ThumbFrame>
  );
}

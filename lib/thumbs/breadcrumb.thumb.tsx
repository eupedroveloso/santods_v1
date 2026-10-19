import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

export function BreadcrumbThumb() {
  return (
    <ThumbFrame pad="md">
      <div className="flex items-center gap-2xs">
        <S.Bar w="xs" size="sm" />
        <S.Circle size="xs" tone="soft" />
        <S.Bar w="xs" size="sm" />
        <S.Circle size="xs" tone="soft" />
        <S.Bar w="sm" size="sm" tone="emphasis" />
      </div>
    </ThumbFrame>
  );
}

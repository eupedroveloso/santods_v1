import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

export function TableOfContentsThumb() {
  return (
    <ThumbFrame pad="md">
      <S.Bar w="sm" size="sm" />
      <div className="flex gap-xs">
        <S.Rule vertical />
        <div className="flex min-w-0 flex-1 flex-col gap-xs">
          <S.Bar w="md" tone="emphasis" />
          <div className="flex flex-col gap-xs pl-sm">
            <S.Bar w="lg" />
            <S.Bar w="md" />
          </div>
          <S.Bar w="sm" />
        </div>
      </div>
    </ThumbFrame>
  );
}

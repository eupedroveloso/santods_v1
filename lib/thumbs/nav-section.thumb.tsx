import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

export function NavSectionThumb() {
  return (
    <ThumbFrame pad="md">
      <S.Bar w="sm" size="sm" />
      <S.Row divider={false}>
        <S.Circle size="xs" tone="emphasis" />
        <S.Bar w="md" tone="strong" />
      </S.Row>
      <div className="flex gap-xs pl-2xs">
        <S.Rule vertical />
        <div className="flex min-w-0 flex-1 flex-col gap-xs py-3xs">
          <S.Bar w="lg" />
          <S.Bar w="md" />
        </div>
      </div>
    </ThumbFrame>
  );
}

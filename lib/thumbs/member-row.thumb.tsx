import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

export function MemberRowThumb() {
  return (
    <ThumbFrame pad="md">
      <S.Row divider={false}>
        <S.Circle size="lg" tone="emphasis" />
        <div className="flex min-w-0 flex-1 flex-col gap-3xs">
          <S.Bar w="fill" size="sm" tone="strong" />
          <S.Bar w="sm" size="sm" />
        </div>
        <div className="ml-auto"><S.Chip w="sm" tone="soft" /></div>
      </S.Row>
    </ThumbFrame>
  );
}

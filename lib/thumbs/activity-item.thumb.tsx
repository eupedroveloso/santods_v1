import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

export function ActivityItemThumb() {
  return (
    <ThumbFrame>
      <S.Row>
        <S.Circle size="lg" tone="emphasis" />
        <div className="flex min-w-0 flex-1 flex-col gap-2xs">
          <S.Bar w="lg" tone="strong" />
          <S.Bar w="md" size="sm" />
        </div>
        <div className="ml-auto">
          <S.Bar w="xs" size="sm" />
        </div>
      </S.Row>
      <S.Row divider={false}>
        <S.Circle size="lg" tone="base" />
        <div className="flex min-w-0 flex-1 flex-col gap-2xs">
          <S.Bar w="xl" tone="strong" />
          <S.Bar w="sm" size="sm" />
        </div>
        <div className="ml-auto">
          <S.Bar w="xs" size="sm" />
        </div>
      </S.Row>
    </ThumbFrame>
  );
}

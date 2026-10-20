import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

export function ActivityCardThumb() {
  return (
    <ThumbFrame pad="md">
      <div className="flex items-center gap-xs">
        <S.Bar w="md" tone="strong" />
        <div className="ml-auto"><S.Chip w="xs" tone="soft" /></div>
      </div>
      <S.Row divider={false}>
        <S.Circle size="md" />
        <div className="flex min-w-0 flex-1 flex-col gap-3xs">
          <S.Bar w="fill" size="sm" tone="strong" />
          <S.Bar w="sm" size="sm" />
        </div>
        <div className="ml-auto"><S.Bar w="2xs" size="sm" /></div>
      </S.Row>
      <div className="flex justify-end"><S.Button size="sm" w="md" float /></div>
    </ThumbFrame>
  );
}

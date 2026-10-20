import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

export function TeamCardThumb() {
  return (
    <ThumbFrame pad="sm">
      <div className="flex items-center gap-xs">
        <S.Bar w="md" tone="strong" />
        <div className="ml-auto"><div className="flex -space-x-2xs"><S.Circle size="sm" ring /><S.Circle size="sm" ring /><S.Circle size="sm" ring /></div></div>
      </div>
      <S.Row>
        <S.Circle size="md" tone="emphasis" />
        <div className="flex min-w-0 flex-1 flex-col gap-3xs">
          <S.Bar w="fill" size="sm" tone="strong" />
          <S.Bar w="sm" size="sm" />
        </div>
        <div className="ml-auto"><S.Chip w="sm" tone="soft" /></div>
      </S.Row>
      <S.Row divider={false}>
        <S.Circle size="md" />
        <div className="flex min-w-0 flex-1 flex-col gap-3xs">
          <S.Bar w="fill" size="sm" tone="strong" />
          <S.Bar w="sm" size="sm" />
        </div>
        <div className="ml-auto"><S.Chip w="sm" tone="soft" /></div>
      </S.Row>
    </ThumbFrame>
  );
}

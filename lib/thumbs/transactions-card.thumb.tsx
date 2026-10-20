import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

export function TransactionsCardThumb() {
  return (
    <ThumbFrame pad="sm">
      <div className="flex items-center gap-xs">
        <S.Bar w="md" tone="strong" />
        <div className="ml-auto"><S.Chip w="xs" tone="soft" /></div>
      </div>
      <S.Row>
        <S.Block w="2xs" h="md" tone="emphasis" />
        <div className="flex min-w-0 flex-1 flex-col gap-3xs">
          <S.Bar w="fill" size="sm" tone="strong" />
          <S.Bar w="sm" size="sm" />
        </div>
        <div className="ml-auto"><S.Bar w="xs" size="sm" tone="strong" /></div>
      </S.Row>
      <S.Row divider={false}>
        <S.Block w="2xs" h="md" />
        <div className="flex min-w-0 flex-1 flex-col gap-3xs">
          <S.Bar w="fill" size="sm" tone="strong" />
          <S.Bar w="sm" size="sm" />
        </div>
        <div className="ml-auto"><S.Bar w="xs" size="sm" tone="strong" /></div>
      </S.Row>
    </ThumbFrame>
  );
}

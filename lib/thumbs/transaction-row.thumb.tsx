import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

export function TransactionRowThumb() {
  return (
    <ThumbFrame pad="md">
      <S.Row divider={false}>
        <S.Block w="2xs" h="md" tone="emphasis" />
        <div className="flex min-w-0 flex-1 flex-col gap-3xs">
          <S.Bar w="fill" size="sm" tone="strong" />
          <S.Bar w="sm" size="sm" />
        </div>
        <div className="ml-auto"><div className="flex items-center gap-2xs"><S.Bar w="xs" tone="strong" /><S.Button variant="soft" size="sm" square /></div></div>
      </S.Row>
    </ThumbFrame>
  );
}

import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

/** Duas linhas: tile de entrada (protagonista) e de saida, titulo/meta e valor a direita. */
export function TransactionRowThumb() {
  return (
    <ThumbFrame pad="md">
      <S.Row>
        <S.Block w="xs" h="lg" tone="emphasis" />
        <div className="flex min-w-0 flex-1 flex-col gap-3xs">
          <S.Bar w="md" size="md" tone="strong" />
          <S.Bar w="sm" size="sm" />
        </div>
        <S.Bar w="xs" size="md" tone="strong" />
      </S.Row>
      <S.Row divider={false}>
        <S.Block w="xs" h="lg" tone="base" />
        <div className="flex min-w-0 flex-1 flex-col gap-3xs">
          <S.Bar w="lg" size="md" tone="strong" />
          <S.Bar w="sm" size="sm" />
        </div>
        <S.Bar w="xs" size="md" />
      </S.Row>
    </ThumbFrame>
  );
}

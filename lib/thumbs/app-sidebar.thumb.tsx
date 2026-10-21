import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

/** Coluna unica: faixa do topo (marca + botoes), grupos abertos com rotulo e item ativo elevado. */
export function AppSidebarThumb() {
  return (
    <ThumbFrame pad="sm">
      <div className="flex items-center gap-2xs">
        <S.Bar w="md" size="md" tone="strong" />
        <div className="ml-auto flex gap-2xs">
          <S.Block w="2xs" h="xs" tone="strong" />
          <S.Block w="2xs" h="xs" tone="strong" />
        </div>
      </div>
      <S.Rule />
      <S.Bar w="sm" size="sm" />
      <S.Row active divider={false}>
        <S.Bar w="md" size="md" tone="emphasis" />
      </S.Row>
      <S.Row divider={false}>
        <S.Bar w="lg" size="md" />
      </S.Row>
    </ThumbFrame>
  );
}

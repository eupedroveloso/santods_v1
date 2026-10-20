import { Skeleton as S } from "@/lib/ui/skeleton";
import { ThumbFrame } from "@/lib/ui/thumb-frame";

/** Coluna unica: busca no topo e grupos abertos com rotulo e item ativo elevado. */
export function AppSidebarThumb() {
  return (
    <ThumbFrame pad="sm">
      <S.Field w="full" />
      <S.Bar w="sm" size="sm" />
      <S.Row active divider={false}>
        <S.Bar w="md" size="md" tone="emphasis" />
      </S.Row>
      <S.Row divider={false}>
        <S.Bar w="lg" size="md" />
      </S.Row>
      <S.Bar w="xs" size="sm" />
    </ThumbFrame>
  );
}
